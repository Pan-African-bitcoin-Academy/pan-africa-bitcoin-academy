import {
  generateAccountKeypair,
  createEncryptedBackup,
  restoreFromEncryptedBackup,
  signChallenge,
  verifySignature,
  deriveAccountIdFromSpki,
  base64UrlToBytes,
} from '../src/lib/cryptoAuth.ts';
import {
  issueChallenge,
  consumeChallenge,
} from '../src/lib/cryptoChallengeStore.ts';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envText = fs.readFileSync('.env.local', 'utf8');
const getEnv = (k) => {
  const line = envText.split('\n').find((l) => l.startsWith(k + '='));
  if (!line) return null;
  return line.slice(k.length + 1).replace(/^["']|["']$/g, '').trim();
};

const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL') || getEnv('SUPABASE_URL');
const supabaseKey = getEnv('SUPABASE_SECRET_KEY') || getEnv('SUPABASE_SERVICE_ROLE_KEY');
const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

async function testFullFlow() {
  console.log('=== TEST 1: Keypair Generation & ID Derivation ===');
  const bundle = await generateAccountKeypair();
  console.log('Generated Account ID:', bundle.identity.accountId);
  console.log('Public Key SPKI length:', bundle.identity.publicKeySpki.length);

  const derivedId = await deriveAccountIdFromSpki(base64UrlToBytes(bundle.identity.publicKeySpki));
  if (derivedId !== bundle.identity.accountId) {
    throw new Error('Account ID derivation mismatch!');
  }
  console.log('✓ Account ID matches public key SHA-256 derivation.');

  console.log('\n=== TEST 2: Passphrase Backup & Restoration ===');
  const passphrase = 'test-secure-passphrase-888';
  const backup = await createEncryptedBackup(bundle.privateKey, bundle.identity.accountId, passphrase);
  console.log('Encrypted backup created. Ciphertext length:', backup.ciphertext.length);

  const restored = await restoreFromEncryptedBackup(backup, passphrase);
  if (restored.accountId !== bundle.identity.accountId) {
    throw new Error('Restored account ID mismatch!');
  }
  console.log('✓ Restored private key from backup successfully with passphrase.');

  // Test wrong passphrase
  try {
    await restoreFromEncryptedBackup(backup, 'wrong-passphrase');
    throw new Error('Should have failed with wrong passphrase!');
  } catch (err) {
    console.log('✓ Correctly rejected wrong passphrase:', err.message);
  }

  console.log('\n=== TEST 3: Database Registration Envelope (No KYC) ===');
  const syntheticEmail = `${bundle.identity.accountId}@crypto.pba`;
  const { data: newProfile, error: insertError } = await supabaseAdmin
    .from('profiles')
    .insert({
      name: `DCA User ${bundle.identity.accountId.slice(8, 16)}`,
      email: syntheticEmail,
      password_hash: `CRYPTO:ECDSA-P256:${bundle.identity.publicKeySpki}`,
      student_id: bundle.identity.accountId,
      status: 'Active',
      email_verified_at: new Date().toISOString(),
    })
    .select('id, student_id, email')
    .single();

  if (insertError || !newProfile) {
    throw new Error(`Profile insert failed: ${insertError?.message}`);
  }
  console.log('✓ Account profile inserted into database. ID:', newProfile.id);

  console.log('\n=== TEST 4: Challenge-Response Authentication ===');
  const { challenge, expiresAt } = issueChallenge(bundle.identity.accountId);
  console.log('Issued Challenge:', challenge);
  console.log('Expires in:', (expiresAt - Date.now()) / 1000, 'seconds');

  // Sign challenge with restored private key
  const signature = await signChallenge(restored.privateKey, challenge);
  console.log('Signature generated:', signature.slice(0, 30) + '...');

  // Consume challenge (single use)
  const isChallengeValid = consumeChallenge(challenge, bundle.identity.accountId);
  if (!isChallengeValid) {
    throw new Error('Challenge validation failed!');
  }
  console.log('✓ Challenge consumed and verified as unexpired and matching account ID.');

  // Verify signature against public key
  const isSignatureValid = await verifySignature(bundle.identity.publicKeySpki, challenge, signature);
  if (!isSignatureValid) {
    throw new Error('Cryptographic signature verification failed!');
  }
  console.log('✓ Cryptographic signature verified successfully against registered public key.');

  console.log('\n=== TEST 5: Replay Protection ===');
  const replayAttempt = consumeChallenge(challenge, bundle.identity.accountId);
  if (replayAttempt) {
    throw new Error('Replay attack should have been rejected!');
  }
  console.log('✓ Replay protection verified: consumed challenge cannot be reused.');

  console.log('\n=== TEST 6: Cleanup ===');
  await supabaseAdmin.from('profiles').delete().eq('id', newProfile.id);
  console.log('✓ Test profile cleaned up from database.');

  console.log('\n=========================================');
  console.log('ALL CRYPTOGRAPHIC & DATABASE TESTS PASSED!');
  console.log('=========================================');
}

testFullFlow().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
