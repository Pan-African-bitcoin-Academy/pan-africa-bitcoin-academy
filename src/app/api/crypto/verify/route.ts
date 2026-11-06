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
    const isValidChallenge = consumeChallenge(challenge, accountId);
    if (!isValidChallenge) {
      return NextResponse.json(
        { error: 'Authentication challenge expired or invalid. Please request a new challenge.' },
        { status: 401 },
      );
    }

    // Step 2: Fetch registered public key for this account
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

    // Extract public key from password_hash field (format: "CRYPTO:ECDSA-P256:<spki>")
    const passwordHash = profile.password_hash || '';
    if (!passwordHash.startsWith('CRYPTO:')) {
      return NextResponse.json(
        { error: 'This account was not registered with a cryptographic key. Please use email sign in or migrate your account.' },
        { status: 400 },
      );
    }

    const parts = passwordHash.split(':');
    const publicKeySpki = parts[2];

    if (!publicKeySpki) {
      return NextResponse.json({ error: 'Malformed registered public key.' }, { status: 500 });
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
      accountId: profile.student_id || accountId,
      userId: profile.id,
      message: 'Authenticated successfully.',
    });

    setStudentCookie(response, {
      userId: profile.id,
      email: profile.student_id || accountId,
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
