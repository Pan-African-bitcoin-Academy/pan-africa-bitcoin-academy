/**
 * PBA Bitcoin DCA Platform - Cryptographic Account Authentication
 *
 * Provides browser-side keypair generation (ECDSA P-256 via Web Crypto API),
 * passphrase-protected encrypted backup generation (PBKDF2 + AES-256-GCM),
 * challenge signing, and signature verification.
 *
 * IMPORTANT:
 * - This is an account identity/authentication system, NOT a Bitcoin wallet.
 * - Private keys are never transmitted to the server or stored in plain text.
 * - PBA does not hold user funds or verify external purchases.
 */

export interface CryptoAccountIdentity {
  accountId: string; // 'pba_acc_' + 32-hex chars
  publicKeySpki: string; // base64url SPKI
  algorithm: 'ECDSA-P256';
  createdAt: string;
}

export interface EncryptedKeyBackup {
  format: 'pba-dca-encrypted-key';
  version: 1;
  accountId: string;
  algorithm: 'ECDSA-P256';
  salt: string; // base64url 16 bytes
  iv: string; // base64url 12 bytes
  iterations: number;
  ciphertext: string; // base64url AES-GCM ciphertext + tag
  createdAt: string;
}

export interface GeneratedAccountBundle {
  identity: CryptoAccountIdentity;
  privateKey: CryptoKey;
  publicKey: CryptoKey;
}

// Convert BufferSource or Uint8Array to base64url
export function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = typeof btoa !== 'undefined'
    ? btoa(binary)
    : Buffer.from(bytes).toString('base64');
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Convert base64url to Uint8Array
export function base64UrlToBytes(base64url: string): Uint8Array {
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }
  if (typeof atob !== 'undefined') {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }
  return new Uint8Array(Buffer.from(base64, 'base64'));
}

// Get the subtle crypto implementation across environments
function getSubtle(): SubtleCrypto {
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    return window.crypto.subtle;
  }
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.subtle) {
    return globalThis.crypto.subtle;
  }
  // Node.js fallback
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const nodeCrypto = require('crypto');
    if (nodeCrypto.webcrypto?.subtle) {
      return nodeCrypto.webcrypto.subtle;
    }
  } catch {
    // ignore
  }
  throw new Error('Web Crypto API (subtle) is not available in this environment.');
}

function getRandomValues(array: Uint8Array): Uint8Array {
  if (typeof window !== 'undefined' && window.crypto) {
    return window.crypto.getRandomValues(array);
  }
  if (typeof globalThis !== 'undefined' && globalThis.crypto) {
    return globalThis.crypto.getRandomValues(array);
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const nodeCrypto = require('crypto');
  return nodeCrypto.webcrypto.getRandomValues(array);
}

/**
 * Derive stable deterministic Account ID from public key SPKI bytes:
 * 'pba_acc_' + hex(SHA-256(spki)).slice(0, 32)
 */
export async function deriveAccountIdFromSpki(spkiBytes: Uint8Array): Promise<string> {
  const subtle = getSubtle();
  const hash = await subtle.digest('SHA-256', spkiBytes as unknown as BufferSource);
  const hashBytes = new Uint8Array(hash);
  let hex = '';
  for (let i = 0; i < hashBytes.length; i++) {
    hex += hashBytes[i].toString(16).padStart(2, '0');
  }
  return `pba_acc_${hex.slice(0, 32)}`;
}

/**
 * Generate a new browser-side asymmetric keypair (ECDSA P-256).
 * Private key is extractable ONLY to allow the user to generate an encrypted backup file.
 */
export async function generateAccountKeypair(): Promise<GeneratedAccountBundle> {
  const subtle = getSubtle();
  const keyPair = await subtle.generateKey(
    { name: 'ECDSA', namedCurve: 'P-256' },
    true,
    ['sign', 'verify'],
  );

  const spkiBuffer = await subtle.exportKey('spki', keyPair.publicKey);
  const spkiBytes = new Uint8Array(spkiBuffer);
  const accountId = await deriveAccountIdFromSpki(spkiBytes);

  return {
    identity: {
      accountId,
      publicKeySpki: bytesToBase64Url(spkiBytes),
      algorithm: 'ECDSA-P256',
      createdAt: new Date().toISOString(),
    },
    privateKey: keyPair.privateKey,
    publicKey: keyPair.publicKey,
  };
}

/**
 * Create a passphrase-protected encrypted backup file for the user.
 * Uses PBKDF2 with 100,000 iterations of SHA-256 + AES-256-GCM.
 */
export async function createEncryptedBackup(
  privateKey: CryptoKey,
  accountId: string,
  passphrase: string,
): Promise<EncryptedKeyBackup> {
  if (!passphrase || passphrase.length < 8) {
    throw new Error('Backup passphrase must be at least 8 characters long.');
  }

  const subtle = getSubtle();
  const pkcs8Buffer = await subtle.exportKey('pkcs8', privateKey);

  const salt = getRandomValues(new Uint8Array(16));
  const iv = getRandomValues(new Uint8Array(12));

  const enc = new TextEncoder();
  const passKey = await subtle.importKey(
    'raw',
    enc.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey'],
  );

  const aesKey = await subtle.deriveKey(
    { name: 'PBKDF2', salt: salt as unknown as BufferSource, iterations: 100000, hash: 'SHA-256' },
    passKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt'],
  );

  const encryptedBuffer = await subtle.encrypt(
    { name: 'AES-GCM', iv: iv as unknown as BufferSource },
    aesKey,
    pkcs8Buffer,
  );

  return {
    format: 'pba-dca-encrypted-key',
    version: 1,
    accountId,
    algorithm: 'ECDSA-P256',
    salt: bytesToBase64Url(salt),
    iv: bytesToBase64Url(iv),
    iterations: 100000,
    ciphertext: bytesToBase64Url(new Uint8Array(encryptedBuffer)),
    createdAt: new Date().toISOString(),
  };
}

/**
 * Decrypt an encrypted backup file using the user's passphrase.
 * Returns the restored CryptoKey for signing.
 */
export async function restoreFromEncryptedBackup(
  backup: EncryptedKeyBackup,
  passphrase: string,
): Promise<{ privateKey: CryptoKey; accountId: string }> {
  if (backup.format !== 'pba-dca-encrypted-key') {
    throw new Error('Invalid backup file format. Expected PBA DCA encrypted key backup.');
  }

  const subtle = getSubtle();
  const salt = base64UrlToBytes(backup.salt);
  const iv = base64UrlToBytes(backup.iv);
  const ciphertext = base64UrlToBytes(backup.ciphertext);

  const enc = new TextEncoder();
  const passKey = await subtle.importKey(
    'raw',
    enc.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey'],
  );

  const aesKey = await subtle.deriveKey(
    { name: 'PBKDF2', salt: salt as unknown as BufferSource, iterations: backup.iterations || 100000, hash: 'SHA-256' },
    passKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt'],
  );

  try {
    const decryptedBuffer = await subtle.decrypt(
      { name: 'AES-GCM', iv: iv as unknown as BufferSource },
      aesKey,
      ciphertext as unknown as BufferSource,
    );

    const privateKey = await subtle.importKey(
      'pkcs8',
      decryptedBuffer,
      { name: 'ECDSA', namedCurve: 'P-256' },
      true,
      ['sign'],
    );

    return { privateKey, accountId: backup.accountId };
  } catch {
    throw new Error('Incorrect passphrase or corrupted backup file.');
  }
}

/**
 * Export raw PKCS#8 private key as base64url (for direct string key access)
 */
export async function exportRawPrivateKey(privateKey: CryptoKey): Promise<string> {
  const subtle = getSubtle();
  const pkcs8 = await subtle.exportKey('pkcs8', privateKey);
  return bytesToBase64Url(new Uint8Array(pkcs8));
}

/**
 * Import raw PKCS#8 or JWK private key from string.
 * Supports base64url PKCS#8 strings and JSON JWK strings.
 */
export async function importRawPrivateKey(input: string): Promise<CryptoKey> {
  const subtle = getSubtle();
  const trimmed = input.trim();

  // If input is a JSON string (JWK)
  if (trimmed.startsWith('{')) {
    try {
      const jwk = JSON.parse(trimmed);
      return await subtle.importKey(
        'jwk',
        jwk,
        { name: 'ECDSA', namedCurve: 'P-256' },
        true,
        ['sign'],
      );
    } catch {
      // Fallback to base64url pkcs8
    }
  }

  const pkcs8Bytes = base64UrlToBytes(trimmed);
  return subtle.importKey(
    'pkcs8',
    pkcs8Bytes as unknown as BufferSource,
    { name: 'ECDSA', namedCurve: 'P-256' },
    true,
    ['sign'],
  );
}

/**
 * Automatically derive the public Account ID from an imported private key.
 * Mirrors Nostr's behavior where providing a private key automatically yields the public identity.
 */
export async function deriveAccountIdFromPrivateKey(
  privateKey: CryptoKey,
): Promise<{ accountId: string; publicKeySpki: string }> {
  const subtle = getSubtle();
  const jwk = await subtle.exportKey('jwk', privateKey);
  const pubJwk = { kty: 'EC', crv: 'P-256', x: jwk.x, y: jwk.y };
  const pubKey = await subtle.importKey(
    'jwk',
    pubJwk,
    { name: 'ECDSA', namedCurve: 'P-256' },
    true,
    ['verify'],
  );
  const spki = await subtle.exportKey('spki', pubKey);
  const accountId = await deriveAccountIdFromSpki(new Uint8Array(spki));
  return {
    accountId,
    publicKeySpki: bytesToBase64Url(new Uint8Array(spki)),
  };
}

/**
 * Sign an authentication challenge locally in the browser
 */
export async function signChallenge(privateKey: CryptoKey, challenge: string): Promise<string> {
  const subtle = getSubtle();
  const enc = new TextEncoder();
  const challengeBytes = enc.encode(challenge);

  const signatureBuffer = await subtle.sign(
    { name: 'ECDSA', hash: { name: 'SHA-256' } },
    privateKey,
    challengeBytes,
  );

  return bytesToBase64Url(new Uint8Array(signatureBuffer));
}

/**
 * Verify a signed challenge (can run on server or client)
 */
export async function verifySignature(
  publicKeySpkiBase64: string,
  challenge: string,
  signatureBase64: string,
): Promise<boolean> {
  try {
    const subtle = getSubtle();
    const pubBytes = base64UrlToBytes(publicKeySpkiBase64);
    const pubKey = await subtle.importKey(
      'spki',
      pubBytes as unknown as BufferSource,
      { name: 'ECDSA', namedCurve: 'P-256' },
      false,
      ['verify'],
    );

    const enc = new TextEncoder();
    const challengeBytes = enc.encode(challenge);
    const sigBytes = base64UrlToBytes(signatureBase64);

    return await subtle.verify(
      { name: 'ECDSA', hash: { name: 'SHA-256' } },
      pubKey,
      sigBytes as unknown as BufferSource,
      challengeBytes,
    );
  } catch (err) {
    console.error('Signature verification error:', err);
    return false;
  }
}
