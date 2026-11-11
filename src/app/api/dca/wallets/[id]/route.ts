import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { attachSessionRefresh, requireStudent } from '@/lib/session';

function responseWithSession(
  body: object,
  status: number,
  session: NonNullable<ReturnType<typeof requireStudent>>,
) {
  const response = NextResponse.json(body, { status });
  attachSessionRefresh(response, {
    userId: session.userId,
    email: session.email,
    userType: 'student',
    issuedAt: session.issuedAt,
    lastActive: Date.now(),
  });
  return response;
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = requireStudent(request);
  if (!session) {
    return NextResponse.json({ error: 'Sign in to manage wallets.' }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return responseWithSession({ error: 'Wallet ID is required.' }, 400, session);
  }

  try {
    // Verify wallet ownership
    const { data: wallet, error: fetchErr } = await supabaseAdmin
      .from('dca_wallets')
      .select('id, label')
      .eq('id', id)
      .eq('user_id', session.userId)
      .maybeSingle();

    if (fetchErr || !wallet) {
      return responseWithSession({ error: 'Wallet not found or access denied.' }, 404, session);
    }

    // Unlink any purchases that referenced this wallet (preserving the purchase!)
    const { error: unlinkError } = await supabaseAdmin
      .from('dca_purchases')
      .update({ deposited_to_wallet_id: null, is_in_wallet: false, wallet_transfer_date: null })
      .eq('deposited_to_wallet_id', id)
      .eq('user_id', session.userId);
    if (unlinkError) {
      console.error('Error unlinking wallet from manual DCA records:', unlinkError);
      return responseWithSession({ error: 'Could not safely disconnect this wallet. Manual records were preserved.' }, 500, session);
    }

    // Delete wallet (cascades to dca_wallet_transactions and dca_wallet_balance_snapshots)
    const { error: deleteErr } = await supabaseAdmin
      .from('dca_wallets')
      .delete()
      .eq('id', id)
      .eq('user_id', session.userId);

    if (deleteErr) {
      console.error('Error deleting wallet:', deleteErr);
      return responseWithSession({ error: 'Failed to disconnect wallet.' }, 500, session);
    }

    return responseWithSession({
      success: true,
      message: `Wallet "${wallet.label}" disconnected. Manual DCA records remain untouched.`,
    }, 200, session);
  } catch (err) {
    console.error('DELETE /api/dca/wallets/[id] error:', err);
    return responseWithSession({ error: 'Internal server error.' }, 500, session);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = requireStudent(request);
  if (!session) {
    return NextResponse.json({ error: 'Sign in to manage wallets.' }, { status: 401 });
  }

  const { id } = await params;
  const body = (await request.json().catch(() => null)) as { label?: string } | null;
  const label = body?.label?.trim();

  if (!label || label.length < 1 || label.length > 100) {
    return responseWithSession({ error: 'Valid label is required (1-100 characters).' }, 400, session);
  }

  try {
    const { data: updated, error } = await supabaseAdmin
      .from('dca_wallets')
      .update({ label, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', session.userId)
      .select('id, label, wallet_type, format, balance_sats, unconfirmed_balance_sats, sync_status, sync_error, last_synced_at, created_at')
      .single();

    if (error || !updated) {
      return responseWithSession({ error: 'Unable to update wallet label.' }, 500, session);
    }

    return responseWithSession({ wallet: updated }, 200, session);
  } catch (err) {
    console.error('PATCH /api/dca/wallets/[id] error:', err);
    return responseWithSession({ error: 'Internal server error.' }, 500, session);
  }
}
