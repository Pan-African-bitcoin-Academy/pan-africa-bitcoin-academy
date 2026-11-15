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

  const { data: pref, error } = await supabaseAdmin
    .from('notification_preferences')
    .select('*')
    .eq('user_id', session.userId)
    .maybeSingle();

  if (error) {
    return responseWithSession({ error: 'Failed to retrieve preferences.' }, 500, session);
  }

  const defaultPref = {
    timezone: 'UTC',
    in_app_enabled: true,
    email_enabled: true,
    email_address: session.email,
  };

  return responseWithSession({ preferences: pref || defaultPref }, 200, session);
}

export async function POST(request: NextRequest) {
  const session = requireStudent(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { timezone, in_app_enabled, email_enabled, email_address } = body;

    const { data: preference, error } = await supabaseAdmin
      .from('notification_preferences')
      .upsert(
        {
          user_id: session.userId,
          timezone: timezone || 'UTC',
          in_app_enabled: in_app_enabled !== undefined ? Boolean(in_app_enabled) : true,
          email_enabled: email_enabled !== undefined ? Boolean(email_enabled) : true,
          email_address: email_address || session.email,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )
      .select()
      .single();

    if (error) {
      return responseWithSession({ error: 'Failed to save preferences: ' + error.message }, 500, session);
    }

    return responseWithSession({ preference }, 200, session);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Invalid request.';
    return responseWithSession({ error: msg }, 400, session);
  }
}
