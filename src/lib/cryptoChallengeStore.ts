import crypto from 'crypto';
import { supabaseAdmin } from './supabase';

interface StoredChallenge {
  challenge: string;
  accountId: string;
  expiresAt: number;
}

// In-memory fallback store
const fallbackChallengeStore = new Map<string, StoredChallenge>();

// Rate limiter tracking: key -> timestamps[]
const rateLimits = new Map<string, number[]>();

const CHALLENGE_TTL_MS = 60 * 1000; // 60 seconds TTL
const MAX_REQUESTS_PER_MINUTE = 15;

/**
 * Clean up expired rate limits and fallback challenges
 */
function cleanupExpired() {
  const now = Date.now();
  for (const [key, item] of fallbackChallengeStore.entries()) {
    if (item.expiresAt < now) {
      fallbackChallengeStore.delete(key);
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
 * Issue a new cryptographic challenge for an account.
 * Persists to Supabase `crypto_challenges` table with fallback to in-memory store.
 */
export async function issueChallenge(accountId: string): Promise<{ challenge: string; expiresAt: number }> {
  cleanupExpired();

  // 32 cryptographically secure random bytes
  const randomBytes = crypto.randomBytes(32);
  const challenge = `pba_auth_${randomBytes.toString('hex')}`;
  const expiresAt = Date.now() + CHALLENGE_TTL_MS;

  // Persist to database for multi-instance / serverless consistency
  try {
    const { error } = await supabaseAdmin.from('crypto_challenges').insert({
      account_id: accountId,
      challenge,
      expires_at: new Date(expiresAt).toISOString(),
      used: false,
    });

    if (error) {
      console.warn('Failed to insert challenge into DB, using fallback memory store:', error.message);
      fallbackChallengeStore.set(challenge, {
        challenge,
        accountId,
        expiresAt,
      });
    }
  } catch (err) {
    console.warn('Database error while issuing challenge, using fallback memory store:', err);
    fallbackChallengeStore.set(challenge, {
      challenge,
      accountId,
      expiresAt,
    });
  }

  return { challenge, expiresAt };
}

/**
 * Consume a challenge for verification.
 * Strictly single-use: marks used in DB immediately to prevent replays.
 */
export async function consumeChallenge(challenge: string, accountId: string): Promise<boolean> {
  cleanupExpired();

  if (!challenge || !accountId) {
    return false;
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('crypto_challenges')
      .select('id, account_id, expires_at, used')
      .eq('challenge', challenge)
      .maybeSingle();

    if (!error && data) {
      if (data.used) {
        return false; // Replay attack detected
      }

      if (new Date(data.expires_at).getTime() < Date.now()) {
        return false; // Expired
      }

      if (data.account_id.toLowerCase() !== accountId.toLowerCase()) {
        return false; // Account ID mismatch
      }

      // Atomically mark as used
      const { error: updateError } = await supabaseAdmin
        .from('crypto_challenges')
        .update({ used: true })
        .eq('id', data.id)
        .eq('used', false);

      if (updateError) {
        return false;
      }

      return true;
    }
  } catch (err) {
    console.warn('Database error while consuming challenge, checking fallback memory store:', err);
  }

  // Check fallback store
  const stored = fallbackChallengeStore.get(challenge);
  if (!stored) {
    return false;
  }

  fallbackChallengeStore.delete(challenge);

  if (stored.expiresAt < Date.now()) {
    return false;
  }

  if (stored.accountId.toLowerCase() !== accountId.toLowerCase()) {
    return false;
  }

  return true;
}
