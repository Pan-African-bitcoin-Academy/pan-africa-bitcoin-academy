import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAdmin, attachRefresh } from '@/lib/adminSession';
import { generateCohortSessions, validateCohortDates } from '@/lib/sessionGenerator';

/**
 * Generate sessions for a cohort
 * POST /api/cohorts/generate-sessions
 * Body: { cohortId: string }
 */
export async function POST(req: NextRequest) {
  try {
    const session = requireAdmin(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { cohortId } = await req.json();

    if (!cohortId) {
      return NextResponse.json(
        { error: 'cohortId is required' },
        { status: 400 }
      );
    }

    // Fetch cohort details
    const { data: cohort, error: cohortError } = await supabaseAdmin
      .from('cohorts')
      .select('id, name, start_date, end_date')
      .eq('id', cohortId)
      .single();

    if (cohortError || !cohort) {
      return NextResponse.json(
        { error: 'Cohort not found' },
        { status: 404 }
      );
    }

    if (!cohort.start_date || !cohort.end_date) {
      return NextResponse.json(
        { error: 'Cohort must have start_date and end_date to generate sessions' },
        { status: 400 }
      );
    }

    // Validate dates
    const validation = validateCohortDates(cohort.start_date, cohort.end_date);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Generate session dates
    const sessionDates = generateCohortSessions(
      new Date(cohort.start_date),
      new Date(cohort.end_date)
    );

    if (sessionDates.length === 0) {
      return NextResponse.json(
        { error: 'No valid session dates could be generated for this date range' },
        { status: 400 }
      );
    }

    // Delete existing sessions for this cohort
    const { error: deleteError } = await supabaseAdmin
      .from('cohort_sessions')
      .delete()
      .eq('cohort_id', cohortId);

    if (deleteError) {
      console.error('Error deleting existing sessions:', deleteError);
      // Continue anyway - might be first generation
    }

    // Insert new sessions
    const sessionsToInsert = sessionDates.map(({ date, sessionNumber }) => ({
      cohort_id: cohortId,
      session_date: date.toISOString().split('T')[0], // Format as YYYY-MM-DD
      session_number: sessionNumber,
      status: 'scheduled',
    }));

    const { data: insertedSessions, error: insertError } = await supabaseAdmin
      .from('cohort_sessions')
      .insert(sessionsToInsert)
      .select();

    if (insertError) {
      console.error('Error inserting sessions:', insertError);
      return NextResponse.json(
        { error: 'Failed to create sessions', details: insertError.message },
        { status: 500 }
      );
    }

    // Update cohort sessions count
    await supabaseAdmin
      .from('cohorts')
      .update({ sessions: sessionDates.length })
      .eq('id', cohortId);

    const res = NextResponse.json(
      {
        success: true,
        sessionsGenerated: insertedSessions.length,
        sessions: insertedSessions,
      },
      { status: 200 }
    );
    attachRefresh(res, session);
    return res;
  } catch (error: any) {
    console.error('Error generating sessions:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' ? { details: error.message } : {}),
      },
      { status: 500 }
    );
  }
}
