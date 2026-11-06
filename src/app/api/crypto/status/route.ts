import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireStudent } from '@/lib/session';

export async function GET(request: NextRequest) {
  const session = requireStudent(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Fetch student profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, name, email, student_id, password_hash, created_at')
      .eq('id', session.userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // 2. Fetch linked crypto account
    const { data: cryptoAcc } = await supabaseAdmin
      .from('crypto_accounts')
      .select('id, account_id, algorithm, created_at, status')
      .eq('profile_id', session.userId)
      .maybeSingle();

    const isSyntheticEmail = profile.email?.endsWith('@crypto.pba');
    const hasTraditionalPassword =
      Boolean(profile.password_hash) && !profile.password_hash.startsWith('CRYPTO:');

    const hasCrypto = Boolean(cryptoAcc || profile.password_hash?.startsWith('CRYPTO:'));

    const activeAccountId =
      cryptoAcc?.account_id ||
      (profile.student_id?.startsWith('pba_acc_') ? profile.student_id : null);

    return NextResponse.json({
      studentId: profile.student_id || profile.id,
      profileId: profile.id,
      email: isSyntheticEmail ? null : profile.email,
      accountCreatedAt: profile.created_at,
      methods: {
        emailPassword: hasTraditionalPassword && !isSyntheticEmail,
        cryptoKey: hasCrypto,
      },
      cryptoAccount: activeAccountId
        ? {
            accountId: activeAccountId,
            algorithm: cryptoAcc?.algorithm || 'ECDSA-P256',
            status: cryptoAcc?.status || 'active',
            linkedAt: cryptoAcc?.created_at || profile.created_at,
          }
        : null,
    });
  } catch (error) {
    console.error('Error fetching crypto status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
