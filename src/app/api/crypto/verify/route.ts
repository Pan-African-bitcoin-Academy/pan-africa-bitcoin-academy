import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { setStudentCookie } from '@/lib/session';
import { consumeChallenge } from '@/lib/cryptoChallengeStore';
import { verifySignature } from '@/lib/cryptoAuth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
    }

    const { accountId, challenge, signature } = body;

    if (!accountId || typeof accountId !== 'string') {
      return NextResponse.json({ error: 'Account ID is required.' }, { status: 400 });
    }

    if (!challenge || typeof challenge !== 'string') {
      return NextResponse.json({ error: 'Authentication challenge is required.' }, { status: 400 });
    }

    if (!signature || typeof signature !== 'string') {
      return NextResponse.json({ error: 'Signature is required.' }, { status: 400 });
    }

    // Step 1: Validate & consume challenge (single-use replay protection)
    const isValidChallenge = await consumeChallenge(challenge, accountId);
    if (!isValidChallenge) {
      return NextResponse.json(
        { error: 'Authentication challenge expired or invalid. Please request a new challenge.' },
        { status: 401 },
      );
    }

    // Step 2: Fetch registered public key
    let publicKeySpki: string | null = null;
    let targetProfileId: string | null = null;
    let userProfile: any = null;

    // First attempt: Check crypto_accounts table
    const { data: cryptoAcc, error: cryptoAccError } = await supabaseAdmin
      .from('crypto_accounts')
      .select('id, account_id, public_key, algorithm, profile_id, status')
      .eq('account_id', accountId)
      .maybeSingle();

    if (cryptoAcc && cryptoAcc.public_key) {
      if (cryptoAcc.status === 'suspended') {
        return NextResponse.json({ error: 'This account has been suspended.' }, { status: 403 });
      }

      publicKeySpki = cryptoAcc.public_key;
      targetProfileId = cryptoAcc.profile_id;

      if (targetProfileId) {
        const { data: prof } = await supabaseAdmin
          .from('profiles')
          .select('id, name, email, student_id, status')
          .eq('id', targetProfileId)
          .maybeSingle();
        userProfile = prof;
      }
    }

    // Fallback: If not found in crypto_accounts, check profiles table
    if (!publicKeySpki) {
      const syntheticEmail = `${accountId}@crypto.pba`;
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('id, name, email, student_id, password_hash, status')
        .or(`student_id.eq.${accountId},email.eq.${syntheticEmail}`)
        .maybeSingle();

      if (profileError || !profile) {
        return NextResponse.json(
          { error: 'No registered account found with this Account ID. Please create an account first.' },
          { status: 404 },
        );
      }

      if (profile.status === 'suspended') {
        return NextResponse.json({ error: 'This account has been suspended.' }, { status: 403 });
      }

      const passwordHash = profile.password_hash || '';
      if (!passwordHash.startsWith('CRYPTO:')) {
        return NextResponse.json(
          { error: 'This account does not have a linked cryptographic key. Please sign in with your email and password.' },
          { status: 400 },
        );
      }

      const parts = passwordHash.split(':');
      publicKeySpki = parts[2];
      targetProfileId = profile.id;
      userProfile = profile;

      // Auto-backfill to crypto_accounts for future lookups
      if (publicKeySpki && profile.id) {
        try {
          await supabaseAdmin.from('crypto_accounts').insert({
            account_id: accountId,
            public_key: publicKeySpki,
            algorithm: 'ECDSA-P256',
            profile_id: profile.id,
            status: 'active',
          });
        } catch {
          // ignore
        }
      }
    }

    if (!publicKeySpki || !userProfile) {
      return NextResponse.json(
        { error: 'Registered public key or account profile could not be retrieved.' },
        { status: 404 },
      );
    }

    // Step 3: Cryptographically verify signature against registered public key
    const signatureValid = await verifySignature(publicKeySpki, challenge, signature);
    if (!signatureValid) {
      return NextResponse.json(
        { error: 'Cryptographic signature verification failed. Private key does not match this account.' },
        { status: 401 },
      );
    }

    // Step 4: Issue secure session cookie
    const now = Date.now();
    const response = NextResponse.json({
      ok: true,
      accountId: userProfile.student_id || accountId,
      userId: userProfile.id,
      email: userProfile.email,
      name: userProfile.name,
      message: 'Authenticated successfully.',
    });

    setStudentCookie(response, {
      userId: userProfile.id,
      email: userProfile.email || accountId,
      issuedAt: now,
      lastActive: now,
      rememberMe: true,
    });

    return response;
  } catch (error) {
    console.error('Unexpected error in crypto verify:', error);
    return NextResponse.json(
      { error: 'Internal server error verifying signature.' },
      { status: 500 },
    );
  }
}
