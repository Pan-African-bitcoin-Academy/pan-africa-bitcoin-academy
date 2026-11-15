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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = requireStudent(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const { id } = await params;
  try {
    const body = await request.json();
    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (body.is_enabled !== undefined) updateData.is_enabled = Boolean(body.is_enabled);
    if (body.threshold_value !== undefined) updateData.threshold_value = Number(body.threshold_value);
    if (body.cooldown_hours !== undefined) updateData.cooldown_hours = Number(body.cooldown_hours);
    if (body.schedule_time !== undefined) updateData.schedule_time = String(body.schedule_time);
    if (body.grace_period_days !== undefined) updateData.grace_period_days = Number(body.grace_period_days);

    const { data: alert, error } = await supabaseAdmin
      .from('user_alerts')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', session.userId)
      .select()
      .single();

    if (error) {
      return responseWithSession({ error: 'Failed to update alert.' }, 500, session);
    }

    return responseWithSession({ alert }, 200, session);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Invalid request.';
    return responseWithSession({ error: msg }, 400, session);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = requireStudent(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const { id } = await params;
  const { error } = await supabaseAdmin
    .from('user_alerts')
    .delete()
    .eq('id', id)
    .eq('user_id', session.userId);

  if (error) {
    return responseWithSession({ error: 'Failed to delete alert.' }, 500, session);
  }

  return responseWithSession({ success: true }, 200, session);
}
