import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { attachSessionRefresh, requireStudent } from '@/lib/session';

const FREQUENCIES = new Set(['daily', 'weekly', 'biweekly', 'monthly']);
const STATUSES = new Set(['active', 'paused', 'archived']);

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

function mapPlan(body: Record<string, unknown>) {
  return {
    name: body.name,
    contribution_amount: body.contributionAmount,
    frequency: body.frequency,
    start_date: body.startDate,
    end_date: body.endDate,
    initial_contribution: body.initialContribution,
    fee_percent: body.feePercent,
    notes: body.notes,
    ...(body.status === undefined ? {} : { status: body.status }),
  };
}

function validPlan(body: Record<string, unknown>): boolean {
  return typeof body.name === 'string' &&
    body.name.trim().length > 0 &&
    body.name.length <= 100 &&
    numberInRange(body.contributionAmount, 0.01, 1_000_000_000) &&
    typeof body.frequency === 'string' &&
    FREQUENCIES.has(body.frequency) &&
    isDate(body.startDate) &&
    isDate(body.endDate) &&
    body.endDate >= body.startDate &&
    numberInRange(body.initialContribution, 0, 1_000_000_000) &&
    numberInRange(body.feePercent, 0, 100) &&
    typeof body.notes === 'string' &&
    body.notes.length <= 2000 &&
    (body.status === undefined || (typeof body.status === 'string' && STATUSES.has(body.status)));
}

export async function GET(request: NextRequest) {
  const session = requireStudent(request);
  if (!session) return NextResponse.json({ error: 'Sign in to load saved DCA plans.' }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from('dca_plans')
    .select('*')
    .eq('user_id', session.userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to load DCA plans:', error);
    return responseWithSession({ error: 'Unable to load saved DCA plans.' }, 500, session);
  }
  return responseWithSession({ plans: data }, 200, session);
}

export async function POST(request: NextRequest) {
  const session = requireStudent(request);
  if (!session) return NextResponse.json({ error: 'Sign in to save DCA plans.' }, { status: 401 });

  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== 'object' || !validPlan(body as Record<string, unknown>)) {
    return responseWithSession({ error: 'Enter valid DCA plan details.' }, 400, session);
  }

  const { data, error } = await supabaseAdmin
    .from('dca_plans')
    .insert({ ...mapPlan(body as Record<string, unknown>), user_id: session.userId })
    .select('*')
    .single();

  if (error) {
    console.error('Failed to save DCA plan:', error);
    return responseWithSession({ error: 'Unable to save this DCA plan.' }, 500, session);
  }
  return responseWithSession({ plan: data }, 201, session);
}

export async function PATCH(request: NextRequest) {
  const session = requireStudent(request);
  if (!session) return NextResponse.json({ error: 'Sign in to update DCA plans.' }, { status: 401 });

  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return responseWithSession({ error: 'Enter valid DCA plan details.' }, 400, session);
  }
  const values = body as Record<string, unknown>;
  if (typeof values.id !== 'string' || !validPlan(values)) {
    return responseWithSession({ error: 'Enter valid DCA plan details.' }, 400, session);
  }

  const { data, error } = await supabaseAdmin
    .from('dca_plans')
    .update({ ...mapPlan(values), updated_at: new Date().toISOString() })
    .eq('id', values.id)
    .eq('user_id', session.userId)
    .select('*')
    .maybeSingle();

  if (error) {
    console.error('Failed to update DCA plan:', error);
    return responseWithSession({ error: 'Unable to update this DCA plan.' }, 500, session);
  }
  if (!data) return responseWithSession({ error: 'DCA plan not found.' }, 404, session);
  return responseWithSession({ plan: data }, 200, session);
}

export async function DELETE(request: NextRequest) {
  const session = requireStudent(request);
  if (!session) return NextResponse.json({ error: 'Sign in to delete DCA plans.' }, { status: 401 });

  const id = request.nextUrl.searchParams.get('id');
  if (!id) return responseWithSession({ error: 'A plan ID is required.' }, 400, session);

  const { data, error } = await supabaseAdmin
    .from('dca_plans')
    .delete()
    .eq('id', id)
    .eq('user_id', session.userId)
    .select('id')
    .maybeSingle();

  if (error) {
    console.error('Failed to delete DCA plan:', error);
    return responseWithSession({ error: 'Unable to delete this DCA plan.' }, 500, session);
  }
  if (!data) return responseWithSession({ error: 'DCA plan not found.' }, 404, session);
  return responseWithSession({ deleted: true }, 200, session);
}
