import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { attachSessionRefresh, requireStudent } from '@/lib/session';

function isDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function numberInRange(value: unknown, min: number, max: number): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max;
}

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

function validPurchase(body: Record<string, unknown>): boolean {
  const isInWallet = body.isInWallet === true;
  const depositedToWalletId = body.depositedToWalletId;
  const planId = body.planId;
  return isDate(body.purchaseDate) &&
    numberInRange(body.amountUsd, 0.01, 1_000_000_000) &&
    numberInRange(body.btcPrice, 0.01, 1_000_000_000) &&
    numberInRange(body.btcReceived, 0.000000000001, 21_000_000) &&
    numberInRange(body.feesUsd, 0, 1_000_000_000) &&
    typeof body.transactionId === 'string' &&
    body.transactionId.length <= 200 &&
    typeof body.notes === 'string' &&
    body.notes.length <= 2000 &&
    (planId === undefined || planId === null ||
      (typeof planId === 'string' &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(planId))) &&
    (body.isInWallet === undefined || typeof body.isInWallet === 'boolean') &&
    (depositedToWalletId === undefined || depositedToWalletId === null ||
      (typeof depositedToWalletId === 'string' &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(depositedToWalletId))) &&
    (body.walletTransferDate === undefined || body.walletTransferDate === null || isDate(body.walletTransferDate)) &&
    (isInWallet
      ? typeof depositedToWalletId === 'string' && isDate(body.walletTransferDate)
      : (depositedToWalletId === undefined || depositedToWalletId === null || depositedToWalletId === '') &&
        (body.walletTransferDate === undefined || body.walletTransferDate === null || body.walletTransferDate === ''));
}

function mapPurchase(body: Record<string, unknown>) {
  return {
    plan_id: body.planId ?? null,
    purchase_date: body.purchaseDate,
    amount_usd: body.amountUsd,
    btc_price: body.btcPrice,
    btc_received: body.btcReceived,
    fees_usd: body.feesUsd,
    transaction_id: body.transactionId,
    notes: body.notes,
    deposited_to_wallet_id: body.isInWallet === true ? body.depositedToWalletId : null,
    is_in_wallet: body.isInWallet === true,
    wallet_transfer_date: body.isInWallet === true ? body.walletTransferDate : null,
  };
}

async function ownsWallet(userId: string, walletId: unknown): Promise<boolean> {
  if (typeof walletId !== 'string') return false;
  const { data, error } = await supabaseAdmin
    .from('dca_wallets')
    .select('id')
    .eq('id', walletId)
    .eq('user_id', userId)
    .maybeSingle();
  if (error) {
    console.error('Failed to validate linked DCA wallet:', error);
    throw new Error('Unable to verify the selected wallet.');
  }
  return Boolean(data);
}

async function ownsPlan(userId: string, planId: unknown): Promise<boolean> {
  if (typeof planId !== 'string') return false;
  const { data, error } = await supabaseAdmin
    .from('dca_plans')
    .select('id')
    .eq('id', planId)
    .eq('user_id', userId)
    .maybeSingle();
  if (error) {
    console.error('Failed to validate DCA purchase plan:', error);
    throw new Error('Unable to verify the selected plan.');
  }
  return Boolean(data);
}

export async function GET(request: NextRequest) {
  const session = requireStudent(request);
  if (!session) return NextResponse.json({ error: 'Sign in to load saved purchases.' }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from('dca_purchases')
    .select('*')
    .eq('user_id', session.userId)
    .order('purchase_date', { ascending: false });

  if (error) {
    console.error('Failed to load DCA purchases:', error);
    return responseWithSession({ error: 'Unable to load saved purchases.' }, 500, session);
  }
  return responseWithSession({ purchases: data }, 200, session);
}

export async function POST(request: NextRequest) {
  const session = requireStudent(request);
  if (!session) return NextResponse.json({ error: 'Sign in to save purchases.' }, { status: 401 });

  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== 'object' || !validPurchase(body as Record<string, unknown>)) {
    return responseWithSession({ error: 'Enter valid purchase details.' }, 400, session);
  }
  const values = body as Record<string, unknown>;
  if (values.planId != null) {
    try {
      if (!await ownsPlan(session.userId, values.planId)) {
        return responseWithSession({ error: 'Select one of your saved DCA plans.' }, 400, session);
      }
    } catch {
      return responseWithSession({ error: 'Unable to verify the selected plan.' }, 500, session);
    }
  }
  if (values.isInWallet === true) {
    try {
      if (!await ownsWallet(session.userId, values.depositedToWalletId)) {
        return responseWithSession({ error: 'Select one of your connected wallets for this manual record.' }, 400, session);
      }
    } catch {
      return responseWithSession({ error: 'Unable to verify the selected wallet.' }, 500, session);
    }
  }

  const { data, error } = await supabaseAdmin
    .from('dca_purchases')
    .insert({ ...mapPurchase(values), user_id: session.userId })
    .select('*')
    .single();

  if (error) {
    console.error('Failed to save DCA purchase:', error);
    return responseWithSession({ error: 'Unable to save this purchase.' }, 500, session);
  }
  return responseWithSession({ purchase: data }, 201, session);
}

export async function PATCH(request: NextRequest) {
  const session = requireStudent(request);
  if (!session) return NextResponse.json({ error: 'Sign in to update purchases.' }, { status: 401 });

  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return responseWithSession({ error: 'Enter valid purchase details.' }, 400, session);
  }
  const values = body as Record<string, unknown>;
  if (typeof values.id !== 'string' || !validPurchase(values)) {
    return responseWithSession({ error: 'Enter valid purchase details.' }, 400, session);
  }
  if (values.planId != null) {
    try {
      if (!await ownsPlan(session.userId, values.planId)) {
        return responseWithSession({ error: 'Select one of your saved DCA plans.' }, 400, session);
      }
    } catch {
      return responseWithSession({ error: 'Unable to verify the selected plan.' }, 500, session);
    }
  }
  if (values.isInWallet === true) {
    try {
      if (!await ownsWallet(session.userId, values.depositedToWalletId)) {
        return responseWithSession({ error: 'Select one of your connected wallets for this manual record.' }, 400, session);
      }
    } catch {
      return responseWithSession({ error: 'Unable to verify the selected wallet.' }, 500, session);
    }
  }

  const { data, error } = await supabaseAdmin
    .from('dca_purchases')
    .update({ ...mapPurchase(values), updated_at: new Date().toISOString() })
    .eq('id', values.id)
    .eq('user_id', session.userId)
    .select('*')
    .maybeSingle();

  if (error) {
    console.error('Failed to update DCA purchase:', error);
    return responseWithSession({ error: 'Unable to update this purchase.' }, 500, session);
  }
  if (!data) return responseWithSession({ error: 'Purchase not found.' }, 404, session);
  return responseWithSession({ purchase: data }, 200, session);
}

export async function DELETE(request: NextRequest) {
  const session = requireStudent(request);
  if (!session) return NextResponse.json({ error: 'Sign in to delete purchases.' }, { status: 401 });

  const id = request.nextUrl.searchParams.get('id');
  if (!id) return responseWithSession({ error: 'A purchase ID is required.' }, 400, session);

  const { data, error } = await supabaseAdmin
    .from('dca_purchases')
    .delete()
    .eq('id', id)
    .eq('user_id', session.userId)
    .select('id')
    .maybeSingle();

  if (error) {
    console.error('Failed to delete DCA purchase:', error);
    return responseWithSession({ error: 'Unable to delete this purchase.' }, 500, session);
  }
  if (!data) return responseWithSession({ error: 'Purchase not found.' }, 404, session);
  return responseWithSession({ deleted: true }, 200, session);
}
