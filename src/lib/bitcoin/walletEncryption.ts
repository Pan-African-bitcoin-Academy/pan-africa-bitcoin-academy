import 'server-only';
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

const ENCRYPTION_VERSION = 'v1';
const ENCRYPTION_ALGORITHM = 'aes-256-gcm';

function getEncryptionKey(): Buffer {
  const configuredKey = process.env.DCA_WALLET_ENCRYPTION_KEY;
  if (!configuredKey) {
    throw new Error('DCA_WALLET_ENCRYPTION_KEY is required to store watch-only wallet data.');
  }

  const key = /^[0-9a-f]{64}$/i.test(configuredKey)
    ? Buffer.from(configuredKey, 'hex')
    : Buffer.from(configuredKey, 'base64');
  if (key.length !== 32) {
    throw new Error('DCA_WALLET_ENCRYPTION_KEY must encode exactly 32 bytes as hex or base64.');
  }
  return key;
}

export function encryptWalletWatchData(value: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv(ENCRYPTION_ALGORITHM, getEncryptionKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return [
    ENCRYPTION_VERSION,
    iv.toString('base64url'),
    authTag.toString('base64url'),
    ciphertext.toString('base64url'),
  ].join(':');
}

export function decryptWalletWatchData(encryptedValue: string): string {
  const [version, encodedIv, encodedAuthTag, encodedCiphertext, ...extra] = encryptedValue.split(':');
  if (version !== ENCRYPTION_VERSION || !encodedIv || !encodedAuthTag || !encodedCiphertext || extra.length) {
    throw new Error('Stored watch-only wallet data has an unsupported encryption format.');
  }

  const decipher = createDecipheriv(
    ENCRYPTION_ALGORITHM,
    getEncryptionKey(),
    Buffer.from(encodedIv, 'base64url'),
  );
  decipher.setAuthTag(Buffer.from(encodedAuthTag, 'base64url'));
  return Buffer.concat([
    decipher.update(Buffer.from(encodedCiphertext, 'base64url')),
    decipher.final(),
  ]).toString('utf8');
}
