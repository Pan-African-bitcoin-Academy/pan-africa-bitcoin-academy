import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { setStudentCookie } from '@/lib/session';
import { deriveAccountIdFromSpki, base64UrlToBytes } from '@/lib/cryptoAuth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
    }

    const { accountId, publicKeySpki, algorithm = 'ECDSA-P256' } = body;

    if (!accountId || typeof accountId !== 'string' || !accountId.startsWith('pba_acc_')) {
      return NextResponse.json({ error: 'Invalid account ID format.' }, { status: 400 });
    }

    if (!publicKeySpki || typeof publicKeySpki !== 'string' || publicKeySpki.length < 50) {
      return NextResponse.json({ error: 'Invalid public key payload.' }, { status: 400 });
    }

    // Cryptographic validation: verify that accountId is deterministically derived from publicKeySpki
    try {
      const pubBytes = base64UrlToBytes(publicKeySpki);
      const derivedId = await deriveAccountIdFromSpki(pubBytes);
      if (derivedId !== accountId) {
        return NextResponse.json(
          { error: 'Account ID does not match public key derivation.' },
          { status: 400 },
        );
      }
    } catch (err) {
      console.error('Failed to verify public key derivation:', err);
      return NextResponse.json({ error: 'Corrupted public key.' }, { status: 400 });
    }

    // Check if account already exists
    const syntheticEmail = `${accountId}@crypto.pba`;
    const { data: existing } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .or(`student_id.eq.${accountId},email.eq.${syntheticEmail}`)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: 'An account with this cryptographic identity already exists. Please log in instead.' },
        { status: 409 },
      );
    }

    // Create the profile envelope with no personal info or KYC
    const nowIso = new Date().toISOString();
    const { data: newProfile, error: insertError } = await supabaseAdmin
      .from('profiles')
      .insert({
        name: `DCA User ${accountId.slice(8, 16)}`,
        email: syntheticEmail,
        password_hash: `CRYPTO:${algorithm}:${publicKeySpki}`,
        student_id: accountId,
        status: 'Active',
        email_verified_at: nowIso,
      })
      .select('id, student_id, email')
      .single();

    if (insertError || !newProfile) {
      console.error('Failed to create cryptographic account profile:', insertError);
      return NextResponse.json(
        { error: 'Failed to create account in database. Please try again.' },
        { status: 500 },
      );
    }

    const now = Date.now();
    const response = NextResponse.json({
      ok: true,
      accountId: newProfile.student_id,
      userId: newProfile.id,
      message: 'Cryptographic DCA account created successfully.',
    });

    // Establish secure session cookie
    setStudentCookie(response, {
      userId: newProfile.id,
      email: newProfile.student_id,
      issuedAt: now,
      lastActive: now,
      rememberMe: true, // Long-lived session for DCA planners
    });

    return response;
  } catch (error) {
    console.error('Unexpected error in crypto register:', error);
    return NextResponse.json(
      { error: 'Internal server error creating account.' },
      { status: 500 },
    );
  }
}
