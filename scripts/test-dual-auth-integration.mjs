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
import bcrypt from 'bcryptjs';
import fs from 'fs';

const envText = fs.readFileSync('.env.local', 'utf8');
const getEnv = (k) => {
  const line = envText.split('\n').find((l) => l.startsWith(k + '='));
  if (!line) return null;
  return line.slice(k.length + 1).replace(/^["']|["']$/g, '').trim();
};

const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL') || getEnv('SUPABASE_URL');
const supabaseKey = getEnv('SUPABASE_SECRET_KEY') || getEnv('SUPABASE_SERVICE_ROLE_KEY');
const supabase = createClient(supabaseUrl, supabaseKey);

async function testDualAuth() {
  console.log('=== TEST 1: Register Email Student ===');
  const testEmail = `test_dual_${Date.now()}@example.com`;
  const rawPassword = 'SecurePBAStudentPassword123!';
  const passwordHash = await bcrypt.hash(rawPassword, 10);

  const { data: emailUser, error: emailErr } = await supabase
    .from('profiles')
    .insert({
      name: 'Test Dual Student',
      email: testEmail,
      password_hash: passwordHash,
      status: 'Active',
      email_verified_at: new Date().toISOString(),
    })
    .select('id, email, password_hash')
    .single();

  if (emailErr || !emailUser) {
    throw new Error(`Failed to create email user: ${emailErr?.message}`);
  }
  console.log('✓ Email student created:', emailUser.id, emailUser.email);

  console.log('\n=== TEST 2: Generate & Link Crypto Key to Existing Account ===');
  const keyBundle = await generateAccountKeypair();
  const accountId = keyBundle.identity.accountId;
  console.log('Generated Account ID:', accountId);

  // Link in crypto_accounts table (Phase 3 logic)
  const { error: linkErr } = await supabase.from('crypto_accounts').insert({
    account_id: accountId,
    public_key: keyBundle.identity.publicKeySpki,
    algorithm: 'ECDSA-P256',
    profile_id: emailUser.id,
    status: 'active',
  });

  if (linkErr) {
    throw new Error(`Failed to link crypto account: ${linkErr.message}`);
  }
  console.log('✓ Linked key in crypto_accounts.');

  // Verify profiles.password_hash was NOT overwritten!
  const { data: checkProfile } = await supabase
    .from('profiles')
    .select('password_hash')
    .eq('id', emailUser.id)
    .single();

  if (!checkProfile.password_hash || checkProfile.password_hash.startsWith('CRYPTO:')) {
    throw new Error('FAIL: password_hash was overwritten or modified!');
  }
  const passwordStillWorks = await bcrypt.compare(rawPassword, checkProfile.password_hash);
  if (!passwordStillWorks) {
    throw new Error('FAIL: original password bcrypt hash does not match!');
  }
  console.log('✓ VERIFIED: Original email/password hash is preserved and intact!');

  console.log('\n=== TEST 3: Authenticate with Crypto Key (Dual Method 1) ===');
  const { challenge } = await issueChallenge(accountId);
  const signature = await signChallenge(keyBundle.privateKey, challenge);

  // Consume challenge
  const chalValid = await consumeChallenge(challenge, accountId);
  if (!chalValid) throw new Error('Challenge validation failed');

  // Verify signature with registered public key
  const { data: cryptoAcc } = await supabase
    .from('crypto_accounts')
    .select('public_key, profile_id')
    .eq('account_id', accountId)
    .single();

  const sigValid = await verifySignature(cryptoAcc.public_key, challenge, signature);
  if (!sigValid) throw new Error('Signature verification failed');
  if (cryptoAcc.profile_id !== emailUser.id) throw new Error('Profile ID mismatch');
  console.log('✓ Successfully authenticated with private key! Connected to student:', cryptoAcc.profile_id);

  console.log('\n=== TEST 4: Authenticate with Email & Password (Dual Method 2) ===');
  const { data: loginProfile } = await supabase
    .from('profiles')
    .select('id, email, password_hash')
    .eq('email', testEmail)
    .single();

  const emailAuthSuccess = await bcrypt.compare(rawPassword, loginProfile.password_hash);
  if (!emailAuthSuccess) throw new Error('Email auth failed');
  if (loginProfile.id !== emailUser.id) throw new Error('Profile ID mismatch on email auth');
  console.log('✓ Successfully authenticated with email & password! Connected to student:', loginProfile.id);

  console.log('\n=== TEST 5: Verify Both Methods Connect to the Exact Same Student ID ===');
  if (cryptoAcc.profile_id !== loginProfile.id) {
    throw new Error('FAIL: Methods resolved to different student accounts!');
  }
  console.log(`✓ VERIFIED: Both methods resolve to identical student ID: ${loginProfile.id}`);

  console.log('\n=== TEST 6: Cleanup Test Data ===');
  await supabase.from('crypto_accounts').delete().eq('profile_id', emailUser.id);
  await supabase.from('profiles').delete().eq('id', emailUser.id);
  console.log('✓ Cleaned up test records.');

  console.log('\n=========================================');
  console.log('ALL DUAL-AUTHENTICATION TESTS PASSED! ✅');
  console.log('=========================================');
}

testDualAuth().catch(console.error);
