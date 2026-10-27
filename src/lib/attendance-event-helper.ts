import { supabaseAdmin } from '@/lib/supabase';
import { validateUUID } from '@/lib/security-utils';

export interface EnsuredAttendanceEvent {
  id: string;
  name: string;
  type: string;
  chapter_number?: number | null;
  cohort_id?: string | null;
  start_time?: string | null;
}

/**
 * Ensures an event exists in the `events` table for a given eventId or sessionId.
 * If the ID corresponds to a cohort session in `cohort_sessions`, it bridges it into
 * the `events` table to satisfy foreign key constraints (such as `attendance_event_id_fkey`).
 */
export async function ensureEventExists(
  rawId: string
): Promise<{ ok: boolean; eventId?: string; error?: string; event?: EnsuredAttendanceEvent }> {
  if (!rawId || typeof rawId !== 'string') {
    return { ok: false, error: 'Event or session ID is required' };
  }

  const cleanId = rawId.replace(/^session-/, '').trim();

  if (!validateUUID(cleanId)) {
    return { ok: false, error: 'Invalid event or session ID format' };
  }

  // 1. Check if event already exists in `events` table
  const { data: existingEvent, error: eventErr } = await supabaseAdmin
    .from('events')
    .select('id, name, type, chapter_number, cohort_id, start_time')
    .eq('id', cleanId)
    .maybeSingle();

  if (existingEvent) {
    return { ok: true, eventId: cleanId, event: existingEvent as EnsuredAttendanceEvent };
  }

  if (eventErr && eventErr.code !== 'PGRST116') {
    console.warn('[attendance-helper] Error querying events table:', eventErr);
  }

  // 2. Check if it exists in `cohort_sessions` table
  const { data: sessionRow, error: sessionErr } = await supabaseAdmin
    .from('cohort_sessions')
    .select(`
      id,
      cohort_id,
      session_number,
      session_date,
      topic,
      cohorts (
        id,
        name
      )
    `)
    .eq('id', cleanId)
    .maybeSingle();

  if (sessionErr) {
    console.error('[attendance-helper] Error querying cohort_sessions:', sessionErr);
    return { ok: false, error: sessionErr.message };
  }

  if (!sessionRow) {
    return { ok: false, error: 'Event or session not found in events or cohort sessions' };
  }

  // 3. Bridge cohort_session into `events` table with the matching ID
  const cohortData = Array.isArray(sessionRow.cohorts) ? sessionRow.cohorts[0] : sessionRow.cohorts;
  const cohortName = (cohortData as any)?.name || 'Cohort';
  const sessionNumber = sessionRow.session_number != null ? `Session ${sessionRow.session_number}` : 'Session';
  const topicSuffix = sessionRow.topic ? `: ${sessionRow.topic}` : '';
  const sessionTitle = `${cohortName} - ${sessionNumber}${topicSuffix}`.trim();

  const sessionStartTime = sessionRow.session_date
    ? new Date(sessionRow.session_date).toISOString()
    : new Date().toISOString();

  const newEventPayload: any = {
    id: sessionRow.id,
    name: sessionTitle,
    type: 'live-class',
    cohort_id: sessionRow.cohort_id || null,
    start_time: sessionStartTime,
    description: sessionRow.topic || `Cohort session ${sessionRow.session_number || ''}`,
  };

  const { data: insertedEvent, error: insertErr } = await supabaseAdmin
    .from('events')
    .insert(newEventPayload)
    .select('id, name, type, chapter_number, cohort_id, start_time')
    .maybeSingle();

  if (insertErr) {
    // If it already exists due to concurrent creation
    if (insertErr.code === '23505') {
      const { data: recheckEvent } = await supabaseAdmin
        .from('events')
        .select('id, name, type, chapter_number, cohort_id, start_time')
        .eq('id', cleanId)
        .maybeSingle();

      if (recheckEvent) {
        return { ok: true, eventId: cleanId, event: recheckEvent as EnsuredAttendanceEvent };
      }
    }
    console.error('[attendance-helper] Error creating bridge event:', insertErr);
    return { ok: false, error: `Failed to initialize event for session: ${insertErr.message}` };
  }

  return { ok: true, eventId: cleanId, event: (insertedEvent || newEventPayload) as EnsuredAttendanceEvent };
}
