import { createBase58check, bech32, bech32m } from '@scure/base';
import { sha256 } from '@noble/hashes/sha2.js';
import { ripemd160 } from '@noble/hashes/legacy.js';
import { HDKey } from '@scure/bip32';
import { schnorr } from '@noble/curves/secp256k1.js';

const b58check = createBase58check(sha256);

export type SupportedDerivationScheme = 'bip44' | 'bip49' | 'bip84' | 'bip86';
export type WalletType = 'address' | 'xpub' | 'descriptor';
export type AddressFormat =
  | 'p2pkh'
  | 'p2sh'
  | 'p2wpkh'
  | 'p2wsh'
  | 'p2tr'
  | 'bip44'
  | 'bip49'
  | 'bip84'
  | 'bip86'
  | 'descriptor'
  | 'unknown';

export interface AddressValidationResult {
  valid: boolean;
  type?: AddressFormat;
  network?: 'mainnet' | 'testnet';
  error?: string;
}

export interface DetectedWalletInput {
  type: WalletType;
  format: AddressFormat;
  normalizedData: string;
  derivationPath?: string;
  scheme?: SupportedDerivationScheme;
  addressesToWatch: string[];
}

export function detectPrivateKeyOrSeed(input: string): { isSensitive: boolean; reason?: string } {
  const trimmed = input.trim();

  // 1. Extended private keys
  if (/^(xprv|yprv|zprv|tprv|uprv|vprv)[1-9A-HJ-NP-za-km-z]{100,115}$/.test(trimmed)) {
    return {
      isSensitive: true,
      reason: 'Extended private key detected (xprv/yprv/zprv). PBA only accepts read-only public keys (xpub/ypub/zpub).',
    };
  }

  // 2. WIF private keys (Base58, ~51-52 chars, starts with 5, K, L, c, 9)
  if (/^[5KLc9][1-9A-HJ-NP-za-km-z]{50,51}$/.test(trimmed)) {
    return {
      isSensitive: true,
      reason: 'WIF private key detected. Never share or import private keys.',
    };
  }

  // 3. Raw 32-byte hex private key (64 hex characters)
  if (/^[0-9a-fA-F]{64}$/.test(trimmed)) {
    return {
      isSensitive: true,
      reason: 'Raw 64-character hex key detected. Never share private keys or secrets.',
    };
  }

  // 4. Mnemonic seed phrases (12, 15, 18, 21, 24 words separated by whitespace)
  const words = trimmed.toLowerCase().split(/\s+/).filter(Boolean);
  if ([12, 15, 18, 21, 24].includes(words.length) && words.every((w) => /^[a-z]{3,8}$/.test(w))) {
    return {
      isSensitive: true,
      reason: 'Seed phrase detected (12-24 recovery words). PBA is strictly watch-only and NEVER collects seed phrases.',
    };
  }

  return { isSensitive: false };
}

export function hash160(buf: Uint8Array): Uint8Array {
  return ripemd160(sha256(buf));
}

export function pubkeyToP2PKH(pubkey: Uint8Array): string {
  const h = hash160(pubkey);
  const payload = new Uint8Array(21);
  payload[0] = 0x00; // mainnet P2PKH
  payload.set(h, 1);
  return b58check.encode(payload);
}

export function pubkeyToP2SH_P2WPKH(pubkey: Uint8Array): string {
  const pubkeyHash = hash160(pubkey);
  const redeemScript = new Uint8Array(22);
  redeemScript[0] = 0x00;
  redeemScript[1] = 0x14;
  redeemScript.set(pubkeyHash, 2);
  const scriptHash = hash160(redeemScript);
  const payload = new Uint8Array(21);
  payload[0] = 0x05; // mainnet P2SH
  payload.set(scriptHash, 1);
  return b58check.encode(payload);
}

export function pubkeyToP2WPKH(pubkey: Uint8Array): string {
  const pubkeyHash = hash160(pubkey);
  const words = [0, ...bech32.toWords(pubkeyHash)];
  return bech32.encode('bc', words);
}

export function pubkeyToP2TR(pubkey: Uint8Array): string {
  const xOnly = pubkey.length === 33 ? pubkey.slice(1) : pubkey;
  const xHex = Array.from(xOnly, (byte) => byte.toString(16).padStart(2, '0')).join('');
  const internalKey = schnorr.utils.lift_x(BigInt(`0x${xHex}`));
  const tweakBytes = schnorr.utils.taggedHash('TapTweak', xOnly);
  const tweakHex = Array.from(tweakBytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  const outputKey = internalKey
    .add(schnorr.Point.BASE.multiply(BigInt(`0x${tweakHex}`)))
    .toBytes(true)
    .slice(1);
  const words = [1, ...bech32m.toWords(outputKey)];
  return bech32m.encode('bc', words);
}

export function validateBitcoinAddress(address: string): AddressValidationResult {
  const clean = address.trim();

  // Legacy (P2PKH) or Script (P2SH)
  if (clean.startsWith('1') || clean.startsWith('3') || clean.startsWith('m') || clean.startsWith('n') || clean.startsWith('2')) {
    try {
      const decoded = b58check.decode(clean);
      if (decoded.length === 21) {
        const prefix = decoded[0];
        if (prefix === 0x00) return { valid: true, type: 'p2pkh', network: 'mainnet' };
        if (prefix === 0x05) return { valid: true, type: 'p2sh', network: 'mainnet' };
        if (prefix === 0x6f) return { valid: true, type: 'p2pkh', network: 'testnet' };
        if (prefix === 0xc4) return { valid: true, type: 'p2sh', network: 'testnet' };
      }
    } catch {
      // not valid base58check
    }
  }

  // Bech32 / Bech32m
  const lower = clean.toLowerCase();
  if ((lower.startsWith('bc1') || lower.startsWith('tb1')) && lower.includes('1')) {
    if (clean !== lower && clean !== clean.toUpperCase()) {
      return { valid: false, error: 'Bitcoin bech32 addresses cannot mix uppercase and lowercase characters.' };
    }
    const bech32Str = lower as `${string}1${string}`;
    const isTestnet = lower.startsWith('tb1');
    const expectedHrp = isTestnet ? 'tb' : 'bc';

    const taprootCandidate = lower.startsWith(`${expectedHrp}1p`);
    if (taprootCandidate) {
      try {
        const decoded = bech32m.decode(bech32Str);
        const program = bech32m.fromWords(decoded.words.slice(1));
        if (decoded.prefix === expectedHrp && decoded.words[0] === 1 && program.length === 32) {
          return { valid: true, type: 'p2tr', network: isTestnet ? 'testnet' : 'mainnet' };
        }
      } catch {
        // invalid bech32m
      }
    } else if (lower.startsWith(`${expectedHrp}1q`)) {
      try {
        const decoded = bech32.decode(bech32Str);
        const program = bech32.fromWords(decoded.words.slice(1));
        if (decoded.prefix === expectedHrp && decoded.words[0] === 0 && (program.length === 20 || program.length === 32)) {
          const type: AddressFormat = program.length === 20 ? 'p2wpkh' : 'p2wsh';
          return { valid: true, type, network: isTestnet ? 'testnet' : 'mainnet' };
        }
      } catch {
        // invalid bech32
      }
    }
  }

  return { valid: false, error: 'Invalid or unsupported Bitcoin address.' };
}

export function normalizeExtendedKey(extendedKey: string): {
  normalizedXpub: string;
  scheme: SupportedDerivationScheme;
} {
  const clean = extendedKey.trim();
  const raw = b58check.decode(clean);
  if (raw.length !== 78) {
    throw new Error('Invalid extended public key format.');
  }

  const version = Array.from(raw.slice(0, 4), (byte) => byte.toString(16).padStart(2, '0')).join('');
  const versionSchemes: Record<string, SupportedDerivationScheme> = {
    '0488b21e': 'bip44',
    '049d7cb2': 'bip49',
    '04b24746': 'bip84',
  };
  const scheme = versionSchemes[version];
  const expectedPrefix = version === '0488b21e' ? 'xpub' : version === '049d7cb2' ? 'ypub' : 'zpub';
  if (!scheme || !clean.startsWith(expectedPrefix)) {
    throw new Error('Only mainnet xpub, ypub, or zpub public extended keys are supported.');
  }

  // Standard BIP32 public key version bytes: 0x0488b21e
  const xpubBytes = new Uint8Array(raw);
  xpubBytes[0] = 0x04;
  xpubBytes[1] = 0x88;
  xpubBytes[2] = 0xb2;
  xpubBytes[3] = 0x1e;

  const normalizedXpub = b58check.encode(xpubBytes);
  const parsed = HDKey.fromExtendedKey(normalizedXpub);
  if (parsed.depth !== 3 || !parsed.publicKey) {
    throw new Error('Export the account-level extended public key from your wallet.');
  }

  return { normalizedXpub, scheme };
}

export function deriveAddressesFromXpub(
  xpub: string,
  scheme: SupportedDerivationScheme,
  count = 20,
  includeChange = false,
): string[] {
  const chains: (0 | 1)[] = includeChange ? [0, 1] : [0];
  return chains.flatMap((chain) => deriveAddressRange(xpub, scheme, chain, 0, count));
}

export function deriveAddressRange(
  xpub: string,
  scheme: SupportedDerivationScheme,
  chain: 0 | 1,
  startIndex: number,
  count: number,
): string[] {
  if (
    !Number.isSafeInteger(startIndex) ||
    startIndex < 0 ||
    !Number.isSafeInteger(count) ||
    count < 1 ||
    count > 100
  ) {
    throw new Error('Invalid extended public key address range.');
  }
  const { normalizedXpub } = normalizeExtendedKey(xpub);
  const hd = HDKey.fromExtendedKey(normalizedXpub);

  const addresses: string[] = [];
  for (let i = startIndex; i < startIndex + count; i++) {
    const child = hd.derive(`m/${chain}/${i}`);
    if (!child.publicKey) continue;
    let addr = '';
    switch (scheme) {
      case 'bip44':
        addr = pubkeyToP2PKH(child.publicKey);
        break;
      case 'bip49':
        addr = pubkeyToP2SH_P2WPKH(child.publicKey);
        break;
      case 'bip84':
        addr = pubkeyToP2WPKH(child.publicKey);
        break;
      case 'bip86':
        addr = pubkeyToP2TR(child.publicKey);
        break;
    }
    if (addr) addresses.push(addr);
  }
  return addresses;
}

export function parseDescriptor(descriptor: string): {
  type: AddressFormat;
  keyExpression: string;
  addresses: string[];
} {
  // Strip checksum if present: e.g. #30e5m2k7
  const clean = descriptor.trim().split('#')[0].trim();

  // Match wpkh([fingerprint/path]xpub.../0/*) or wpkh(xpub.../0/*)
  const wpkhMatch = clean.match(/^wpkh\((?:\[[^\]]+\])?([xyz]pub[1-9A-HJ-NP-za-km-z]+)(?:\/[01]\/\*)?\)$/);
  if (wpkhMatch) {
    const key = wpkhMatch[1];
    const { scheme } = normalizeExtendedKey(key);
    const addresses = deriveAddressesFromXpub(key, scheme === 'bip49' ? 'bip49' : 'bip84', 20, false);
    return { type: 'descriptor', keyExpression: clean, addresses };
  }

  // Match sh(wpkh(...))
  const shWpkhMatch = clean.match(/^sh\(wpkh\((?:\[[^\]]+\])?([xyz]pub[1-9A-HJ-NP-za-km-z]+)(?:\/[01]\/\*)?\)\)$/);
  if (shWpkhMatch) {
    const key = shWpkhMatch[1];
    const addresses = deriveAddressesFromXpub(key, 'bip49', 20, false);
    return { type: 'descriptor', keyExpression: clean, addresses };
  }

  // Match pkh(...)
  const pkhMatch = clean.match(/^pkh\((?:\[[^\]]+\])?([xyz]pub[1-9A-HJ-NP-za-km-z]+)(?:\/[01]\/\*)?\)$/);
  if (pkhMatch) {
    const key = pkhMatch[1];
    const addresses = deriveAddressesFromXpub(key, 'bip44', 20, false);
    return { type: 'descriptor', keyExpression: clean, addresses };
  }

  // Match tr(...)
  const trMatch = clean.match(/^tr\((?:\[[^\]]+\])?([xyz]pub[1-9A-HJ-NP-za-km-z]+)(?:\/[01]\/\*)?\)$/);
  if (trMatch) {
    const key = trMatch[1];
    const addresses = deriveAddressesFromXpub(key, 'bip86', 20, false);
    return { type: 'descriptor', keyExpression: clean, addresses };
  }

  // Check if descriptor simply wraps a single address: addr(...)
  const addrMatch = clean.match(/^addr\(([^)]+)\)$/);
  if (addrMatch) {
    const singleAddr = addrMatch[1];
    const val = validateBitcoinAddress(singleAddr);
    if (val.valid) {
      return { type: 'descriptor', keyExpression: clean, addresses: [singleAddr] };
    }
  }

  throw new Error('Unsupported or malformed public descriptor.');
}

export function parseAndValidateWalletInput(
  input: string,
  userSelectedScheme?: SupportedDerivationScheme,
): DetectedWalletInput {
  const clean = input.trim();

  // 1. Strict security check against private keys / seeds
  const sensitiveCheck = detectPrivateKeyOrSeed(clean);
  if (sensitiveCheck.isSensitive) {
    throw new Error(sensitiveCheck.reason || 'Private key or seed phrase detected.');
  }

  // 2. Check if single Bitcoin address
  const addrValidation = validateBitcoinAddress(clean);
  if (addrValidation.valid && addrValidation.type && addrValidation.network === 'mainnet') {
    const normalizedAddress = clean.toLowerCase().startsWith('bc1') ? clean.toLowerCase() : clean;
    return {
      type: 'address',
      format: addrValidation.type,
      normalizedData: normalizedAddress,
      addressesToWatch: [normalizedAddress],
    };
  }

  // 3. Check if extended public key (xpub / ypub / zpub)
  if (/^[xyz]pub[1-9A-HJ-NP-za-km-z]{100,115}$/.test(clean)) {
    try {
      const { normalizedXpub, scheme: detectedScheme } = normalizeExtendedKey(clean);
      if (clean.startsWith('ypub') && userSelectedScheme && userSelectedScheme !== 'bip49') {
        throw new Error('A ypub uses the BIP49 nested SegWit derivation scheme.');
      }
      if (clean.startsWith('zpub') && userSelectedScheme && userSelectedScheme !== 'bip84') {
        throw new Error('A zpub uses the BIP84 native SegWit derivation scheme.');
      }
      if (clean.startsWith('xpub') && !userSelectedScheme) {
        throw new Error('Choose the derivation scheme for this xpub; xpub prefixes do not identify a script type.');
      }
      const scheme = clean.startsWith('xpub')
        ? userSelectedScheme!
        : detectedScheme;
      const format: AddressFormat = scheme;
      const derivationPath =
        scheme === 'bip84'
          ? "m/84'/0'/0'"
          : scheme === 'bip49'
            ? "m/49'/0'/0'"
            : scheme === 'bip86'
              ? "m/86'/0'/0'"
              : "m/44'/0'/0'";
      const addressesToWatch = deriveAddressesFromXpub(normalizedXpub, scheme, 20, true);

      return {
        type: 'xpub',
        format,
        normalizedData: clean,
        derivationPath,
        scheme,
        addressesToWatch,
      };
    } catch (e: unknown) {
      const err = e as Error;
      throw new Error(`Invalid extended public key: ${err.message}`);
    }
  }

  // 4. Check if public descriptor
  if (clean.includes('(') || clean.startsWith('raw(')) {
    throw new Error('Public output descriptors are not enabled yet. Connect a Bitcoin address or account-level extended public key instead.');
  }

  throw new Error('Unrecognized Bitcoin address, extended public key (xpub/ypub/zpub), or descriptor.');
}
