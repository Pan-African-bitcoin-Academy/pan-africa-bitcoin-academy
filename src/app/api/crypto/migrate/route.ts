import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireStudent, attachSessionRefresh } from '@/lib/session';
import { deriveAccountIdFromSpki, base64UrlToBytes } from '@/lib/cryptoAuth';

export async function POST(request: NextRequest) {
  const session = requireStudent(request);
  if (!session) {
    return NextResponse.json({ error: 'You must be signed in to link a private key.' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const { accountId, publicKeySpki, algorithm = 'ECDSA-P256' } = body;

    if (!accountId || typeof accountId !== 'string' || !accountId.startsWith('pba_acc_')) {
      return NextResponse.json({ error: 'Invalid account ID.' }, { status: 400 });
    }

    if (!publicKeySpki || typeof publicKeySpki !== 'string') {
      return NextResponse.json({ error: 'Invalid public key.' }, { status: 400 });
    }

    // Verify cryptographic derivation
    const pubBytes = base64UrlToBytes(publicKeySpki);
    const derivedId = await deriveAccountIdFromSpki(pubBytes);
    if (derivedId !== accountId) {
      return NextResponse.json({ error: 'Account ID does not match public key.' }, { status: 400 });
    }

    // Check if this account ID is already used by another profile
    const { data: existing } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('student_id', accountId)
      .neq('id', session.userId)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: 'This cryptographic key is already linked to another account.' },
        { status: 409 },
      );
    }

    // Update existing profile to link this cryptographic key
    const { data: updated, error } = await supabaseAdmin
      .from('profiles')
      .update({
        student_id: accountId,
        password_hash: `CRYPTO:${algorithm}:${publicKeySpki}`,
      })
      .eq('id', session.userId)
      .select('id, email, student_id')
      .single();

    if (error || !updated) {
      console.error('Failed to link cryptographic key to profile:', error);
      return NextResponse.json({ error: 'Failed to update account.' }, { status: 500 });
    }

    const response = NextResponse.json({
      ok: true,
      accountId: updated.student_id,
      message: 'Cryptographic account key linked successfully. You can now log in using your private key.',
    });

    attachSessionRefresh(response, {
      userId: session.userId,
      email: updated.student_id || session.email,
      userType: 'student',
      issuedAt: session.issuedAt,
      lastActive: Date.now(),
    });

    return response;
  } catch (error) {
    console.error('Unexpected error in crypto migrate:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
