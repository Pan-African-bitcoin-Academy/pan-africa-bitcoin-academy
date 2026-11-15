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

  const { searchParams } = new URL(request.url);
  const limit = Math.min(Number(searchParams.get('limit') || 25), 100);

  const { data: notifications, error } = await supabaseAdmin
    .from('notifications')
    .select('*')
    .eq('user_id', session.userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    return responseWithSession({ error: 'Failed to fetch notifications.' }, 500, session);
  }

  const unreadCount = (notifications || []).filter((n) => !n.is_read).length;

  return responseWithSession({ notifications: notifications || [], unreadCount }, 200, session);
}

export async function PATCH(request: NextRequest) {
  const session = requireStudent(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { notificationId, markAllRead } = body;

    if (markAllRead) {
      const { error } = await supabaseAdmin
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('user_id', session.userId)
        .eq('is_read', false);

      if (error) {
        return responseWithSession({ error: 'Failed to update notifications.' }, 500, session);
      }
      return responseWithSession({ success: true }, 200, session);
    }

    if (notificationId) {
      const { error } = await supabaseAdmin
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', notificationId)
        .eq('user_id', session.userId);

      if (error) {
        return responseWithSession({ error: 'Failed to update notification.' }, 500, session);
      }
      return responseWithSession({ success: true }, 200, session);
    }

    return responseWithSession({ error: 'Missing notificationId or markAllRead.' }, 400, session);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Invalid request.';
    return responseWithSession({ error: msg }, 400, session);
  }
}
