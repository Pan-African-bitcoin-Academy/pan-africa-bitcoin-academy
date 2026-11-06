import crypto from 'crypto';

interface StoredChallenge {
  challenge: string;
  accountId: string;
  expiresAt: number;
}

// In-memory challenge store with auto-expiry
const challengeStore = new Map<string, StoredChallenge>();

// Rate limiter tracking: key -> timestamps[]
const rateLimits = new Map<string, number[]>();

const CHALLENGE_TTL_MS = 60 * 1000; // 60 seconds TTL
const MAX_REQUESTS_PER_MINUTE = 15;

/**
 * Clean up expired challenges periodically
 */
function cleanupExpired() {
  const now = Date.now();
  for (const [key, item] of challengeStore.entries()) {
    if (item.expiresAt < now) {
      challengeStore.delete(key);
    }
  }

  for (const [key, timestamps] of rateLimits.entries()) {
    const valid = timestamps.filter((t) => now - t < 60000);
    if (valid.length === 0) {
      rateLimits.delete(key);
    } else {
      rateLimits.set(key, valid);
    }
  }
}

/**
 * Check rate limit for an identifier (IP or account)
 */
export function checkRateLimit(identifier: string): boolean {
  cleanupExpired();
  const now = Date.now();
  const list = rateLimits.get(identifier) || [];
  const recent = list.filter((t) => now - t < 60000);

  if (recent.length >= MAX_REQUESTS_PER_MINUTE) {
    return false; // Rate limited
  }

  recent.push(now);
  rateLimits.set(identifier, recent);
  return true;
}

/**
 * Issue a new cryptographic challenge for an account
 */
export function issueChallenge(accountId: string): { challenge: string; expiresAt: number } {
  cleanupExpired();

  // 32 cryptographically secure random bytes
  const randomBytes = crypto.randomBytes(32);
  const challenge = `pba_auth_${randomBytes.toString('hex')}`;
  const expiresAt = Date.now() + CHALLENGE_TTL_MS;

  challengeStore.set(challenge, {
    challenge,
    accountId,
    expiresAt,
  });

  return { challenge, expiresAt };
}

/**
 * Consume a challenge for verification.
 * Strictly single-use: deletes the challenge immediately to prevent replays.
 */
export function consumeChallenge(challenge: string, accountId: string): boolean {
  cleanupExpired();
  const stored = challengeStore.get(challenge);

  if (!stored) {
    return false; // Challenge not found or already used
  }

  // Remove immediately (single use)
  challengeStore.delete(challenge);

  if (stored.expiresAt < Date.now()) {
    return false; // Expired
  }

  if (stored.accountId.toLowerCase() !== accountId.toLowerCase()) {
    return false; // Account ID mismatch
  }

  return true;
}
