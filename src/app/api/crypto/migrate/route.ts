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

    if (!publicKeySpki || typeof publicKeySpki !== 'string' || publicKeySpki.length < 50) {
      return NextResponse.json({ error: 'Invalid public key payload.' }, { status: 400 });
    }

    // Verify cryptographic derivation
    try {
      const pubBytes = base64UrlToBytes(publicKeySpki);
      const derivedId = await deriveAccountIdFromSpki(pubBytes);
      if (derivedId !== accountId) {
        return NextResponse.json({ error: 'Account ID does not match public key.' }, { status: 400 });
      }
    } catch (err) {
      console.error('Failed to verify public key derivation:', err);
      return NextResponse.json({ error: 'Corrupted public key.' }, { status: 400 });
    }

    // Check if this account ID is already used by another profile
    const { data: existingInCrypto } = await supabaseAdmin
      .from('crypto_accounts')
      .select('id, profile_id')
      .eq('account_id', accountId)
      .maybeSingle();

    if (existingInCrypto && existingInCrypto.profile_id !== session.userId) {
      return NextResponse.json(
        { error: 'This cryptographic key is already linked to another student account.' },
        { status: 409 },
      );
    }

    const { data: existingInProfiles } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('student_id', accountId)
      .neq('id', session.userId)
      .maybeSingle();

    if (existingInProfiles) {
      return NextResponse.json(
        { error: 'This cryptographic key is already linked to another student account.' },
        { status: 409 },
      );
    }

    // Link in crypto_accounts table (do NOT overwrite profiles.password_hash!)
    const { data: studentCryptoEntry } = await supabaseAdmin
      .from('crypto_accounts')
      .select('id')
      .eq('profile_id', session.userId)
      .maybeSingle();

    if (studentCryptoEntry) {
      const { error: updateError } = await supabaseAdmin
        .from('crypto_accounts')
        .update({
          account_id: accountId,
          public_key: publicKeySpki,
          algorithm,
          status: 'active',
        })
        .eq('id', studentCryptoEntry.id);

      if (updateError) {
        console.error('Failed to update crypto_accounts:', updateError);
        return NextResponse.json({ error: 'Failed to update account security.' }, { status: 500 });
      }
    } else {
      const { error: insertError } = await supabaseAdmin
        .from('crypto_accounts')
        .insert({
          account_id: accountId,
          public_key: publicKeySpki,
          algorithm,
          profile_id: session.userId,
          status: 'active',
        });

      if (insertError) {
        console.error('Failed to insert into crypto_accounts:', insertError);
        return NextResponse.json({ error: 'Failed to link private key.' }, { status: 500 });
      }
    }

    // Update profile student_id if not already set
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('student_id, email')
      .eq('id', session.userId)
      .single();

    if (profile && !profile.student_id) {
      try {
        await supabaseAdmin
          .from('profiles')
          .update({ student_id: accountId })
          .eq('id', session.userId);
      } catch {
        // ignore
      }
    }

    const response = NextResponse.json({
      ok: true,
      accountId,
      message: 'Cryptographic key linked successfully. You can now log in using either email & password or your private key.',
    });

    attachSessionRefresh(response, {
      userId: session.userId,
      email: session.email,
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
