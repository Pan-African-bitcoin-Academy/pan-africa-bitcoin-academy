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

export async function GET(request: NextRequest) {
  const session = requireStudent(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const { data: alerts, error } = await supabaseAdmin
    .from('user_alerts')
    .select('*')
    .eq('user_id', session.userId)
    .order('created_at', { ascending: false });

  if (error) {
    return responseWithSession({ error: 'Failed to retrieve alerts.' }, 500, session);
  }

  return responseWithSession({ alerts: alerts || [] }, 200, session);
}

export async function POST(request: NextRequest) {
  const session = requireStudent(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      type,
      condition,
      threshold_value,
      currency = 'USD',
      schedule_frequency,
      schedule_day_of_week,
      schedule_day_of_month,
      schedule_time = '09:00',
      grace_period_days = 2,
      cooldown_hours = 24,
      is_one_time = false,
      is_enabled = true,
    } = body;

    const validTypes = [
      'contribution_reminder',
      'price_threshold',
      'price_change_pct',
      'missed_contribution',
      'goal_milestone',
    ];

    if (!type || !validTypes.includes(type)) {
      return responseWithSession({ error: 'Invalid alert type.' }, 400, session);
    }

    const { data: alert, error } = await supabaseAdmin
      .from('user_alerts')
      .insert({
        user_id: session.userId,
        type,
        condition,
        threshold_value: threshold_value !== undefined ? Number(threshold_value) : null,
        currency,
        schedule_frequency,
        schedule_day_of_week,
        schedule_day_of_month,
        schedule_time,
        grace_period_days,
        cooldown_hours,
        is_one_time,
        is_enabled,
      })
      .select()
      .single();

    if (error) {
      return responseWithSession({ error: 'Failed to create alert: ' + error.message }, 500, session);
    }

    return responseWithSession({ alert }, 201, session);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Invalid request payload.';
    return responseWithSession({ error: msg }, 400, session);
  }
}
