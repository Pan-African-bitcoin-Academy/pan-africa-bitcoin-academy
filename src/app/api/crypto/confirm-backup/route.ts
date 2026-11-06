import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireStudent } from '@/lib/session';

export async function POST(request: NextRequest) {
  const session = requireStudent(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { accountId } = body;

    if (accountId) {
      try {
        await supabaseAdmin
          .from('crypto_accounts')
          .update({ backup_confirmed: true })
          .eq('profile_id', session.userId)
          .eq('account_id', accountId);
      } catch {
        // ignore
      }
    }

    return NextResponse.json({
      ok: true,
      message: 'Backup confirmation saved.',
    });
  } catch (error) {
    console.error('Error confirming backup:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
