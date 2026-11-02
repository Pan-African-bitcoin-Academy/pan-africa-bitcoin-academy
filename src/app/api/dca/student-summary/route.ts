import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { attachSessionRefresh, requireStudent } from '@/lib/session';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const ENROLLED_STATUSES = new Set(['enrolled', 'active']);

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

export async function GET(request: NextRequest) {
  const session = requireStudent(request);
  if (!session) {
    return NextResponse.json({ error: 'Sign in to view your Bitcoin accumulation.' }, { status: 401 });
  }

  const { data: student, error: studentError } = await supabaseAdmin
    .from('students')
    .select('id, status')
    .eq('profile_id', session.userId)
    .maybeSingle();

  if (studentError) {
    console.error('Failed to verify DCA dashboard student enrollment:', studentError);
    return responseWithSession({ error: 'Unable to verify student enrollment.' }, 500, session);
  }

  const status = typeof student?.status === 'string' ? student.status.toLowerCase() : '';
  if (!student || !ENROLLED_STATUSES.has(status)) {
    return responseWithSession({ error: 'This summary is available to enrolled PBA students.' }, 403, session);
  }

  const { data: enrollments, error: enrollmentError } = await supabaseAdmin
    .from('cohort_enrollment')
    .select('cohort_id, cohorts!inner(id)')
    .eq('student_id', session.userId)
    .limit(1);

  if (enrollmentError) {
    console.error('Failed to verify DCA dashboard cohort enrollment:', enrollmentError);
    return responseWithSession({ error: 'Unable to verify student enrollment.' }, 500, session);
  }
  if (!enrollments?.length) {
    return responseWithSession({ error: 'This summary is available to enrolled PBA students.' }, 403, session);
  }

  const [plansResult, purchasesResult, marketResponse] = await Promise.all([
    supabaseAdmin
      .from('dca_plans')
      .select('id, name, contribution_amount, frequency, start_date, end_date, initial_contribution, fee_percent, status, updated_at')
      .eq('user_id', session.userId)
      .order('created_at', { ascending: false }),
    supabaseAdmin
      .from('dca_purchases')
      .select('id, purchase_date, amount_usd, btc_received, fees_usd, updated_at')
      .eq('user_id', session.userId)
      .order('purchase_date', { ascending: true }),
    fetch(`${COINGECKO_API}/coins/markets?vs_currency=usd&ids=bitcoin`, {
      next: { revalidate: 300 },
    }).catch((error: unknown) => {
      console.error('Bitcoin market price request failed for student DCA summary:', error);
      return null;
    }),
  ]);

  if (plansResult.error || purchasesResult.error) {
    console.error('Failed to load student DCA summary:', {
      plansError: plansResult.error,
      purchasesError: purchasesResult.error,
    });
    return responseWithSession(
      { eligible: true, error: 'Unable to load your Bitcoin accumulation summary.' },
      500,
      session,
    );
  }

  if (!marketResponse) {
    return responseWithSession(
      { eligible: true, error: 'The latest Bitcoin price is temporarily unavailable.' },
      502,
      session,
    );
  }
  if (!marketResponse.ok) {
    console.error('Failed to load Bitcoin market price for student DCA summary:', marketResponse.status);
    return responseWithSession(
      { eligible: true, error: 'The latest Bitcoin price is temporarily unavailable.' },
      502,
      session,
    );
  }

  let marketData: unknown;
  try {
    marketData = await marketResponse.json();
  } catch (error) {
    console.error('Unable to parse Bitcoin market data for student DCA summary:', error);
    return responseWithSession(
      { eligible: true, error: 'The latest Bitcoin price is temporarily unavailable.' },
      502,
      session,
    );
  }
  const market = Array.isArray(marketData) ? marketData[0] : null;
  if (
    !market ||
    typeof market !== 'object' ||
    !('current_price' in market) ||
    typeof market.current_price !== 'number' ||
    !Number.isFinite(market.current_price) ||
    !('last_updated' in market) ||
    typeof market.last_updated !== 'string'
  ) {
    console.error('CoinGecko returned invalid market data for student DCA summary.');
    return responseWithSession(
      { eligible: true, error: 'The latest Bitcoin price is temporarily unavailable.' },
      502,
      session,
    );
  }

  const plans = (plansResult.data ?? []).map((plan) => ({
    id: plan.id,
    name: plan.name,
    contributionAmount: Number(plan.contribution_amount),
    frequency: plan.frequency,
    startDate: plan.start_date,
    endDate: plan.end_date,
    initialContribution: Number(plan.initial_contribution),
    status: plan.status,
    updatedAt: plan.updated_at,
  }));
  const purchases = (purchasesResult.data ?? []).map((purchase) => ({
    id: purchase.id,
    purchaseDate: purchase.purchase_date,
    amountUsd: Number(purchase.amount_usd),
    btcReceived: Number(purchase.btc_received),
    feesUsd: Number(purchase.fees_usd),
    updatedAt: purchase.updated_at,
  }));
  const recordUpdateDates = [...plans, ...purchases]
    .map((record) => record.updatedAt)
    .filter((date): date is string => typeof date === 'string' && Number.isFinite(Date.parse(date)));

  return responseWithSession(
    {
      eligible: true,
      plans,
      purchases,
      currentPrice: market.current_price,
      priceUpdatedAt: market.last_updated,
      lastUpdated: recordUpdateDates.length
        ? recordUpdateDates.reduce((latest, date) => date > latest ? date : latest)
        : null,
    },
    200,
    session,
  );
}
