import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { attachRefresh, requireAdmin } from '@/lib/adminSession';

/**
 * Admin endpoint to fetch detailed progress for a single student
 * Returns comprehensive progress information including:
 * - All chapters with completion status
 * - All assignments with submission status
 * - Attendance records
 * - Sats rewards
 * - Achievements
 */
export async function POST(req: NextRequest) {
  try {
    const session = requireAdmin(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { studentEmail } = await req.json();

    if (!studentEmail) {
      return NextResponse.json({ error: 'Student email is required' }, { status: 400 });
    }

    // Get profile by email
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, name, email')
      .eq('email', studentEmail.toLowerCase().trim())
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Get student record, create if missing
    let { data: student } = await supabaseAdmin
      .from('students')
      .select('id')
      .eq('profile_id', profile.id)
      .maybeSingle();

    if (!student) {
      // Student record doesn't exist - create it automatically
      console.log(`[admin/students/progress/detail] Creating missing student record for profile ${profile.id}`);
      const { data: newStudent, error: createError } = await supabaseAdmin
        .from('students')
        .insert({
          profile_id: profile.id,
          progress_percent: 0,
          assignments_completed: 0,
          projects_completed: 0,
          live_sessions_attended: 0,
        })
        .select('id')
        .single();

      if (createError || !newStudent) {
        console.error('[admin/students/progress/detail] Failed to create student record:', createError);
        return NextResponse.json(
          { error: 'Failed to create student record. Please contact support.' },
          { status: 500 }
        );
      }

      student = newStudent;
      console.log(`[admin/students/progress/detail] Successfully created student record for profile ${profile.id}`);
    }

    // Get all chapter progress
    const { data: chapterProgressData } = await supabaseAdmin
      .from('chapter_progress')
      .select('chapter_number, chapter_slug, is_completed, is_unlocked, completed_at')
      .eq('student_id', profile.id)
      .order('chapter_number', { ascending: true });

    // Build chapters list (ensure all 20 chapters are represented)
    const chapters = Array.from({ length: 20 }, (_, i) => {
      const chapterNumber = i + 1;
      const progress = chapterProgressData?.find((cp: any) => cp.chapter_number === chapterNumber);
      return {
        chapterNumber,
        chapterSlug: progress?.chapter_slug || '',
        isCompleted: progress?.is_completed === true,
        isUnlocked: progress?.is_unlocked === true || chapterNumber === 1, // Chapter 1 always unlocked
        completedAt: progress?.completed_at || undefined,
      };
    });

    // Get all assignments and submissions
    const { data: assignmentsData } = await supabaseAdmin
      .from('assignments')
      .select('id, title, status')
      .eq('status', 'active');

    const { data: submissionsData } = await supabaseAdmin
      .from('assignment_submissions')
      .select('assignment_id, is_correct, submitted_at')
      .eq('student_id', profile.id);

    // Build assignments list
    const assignments = (assignmentsData || []).map((assignment: any) => {
      const submission = submissionsData?.find((s: any) => s.assignment_id === assignment.id);
      return {
        id: assignment.id,
        title: assignment.title,
        isCompleted: !!submission,
        isCorrect: submission?.is_correct || false,
        submittedAt: submission?.submitted_at || undefined,
      };
    });

    // Get attendance
    const { data: attendanceData } = await supabaseAdmin
      .from('attendance')
      .select('event_id')
      .eq('student_id', profile.id);

    const { data: liveEvents } = await supabaseAdmin
      .from('events')
      .select('id')
      .eq('type', 'live-class');

    const lecturesAttended = attendanceData?.length || 0;
    const totalLectures = liveEvents?.length || 0;
    const attendancePercent = totalLectures > 0 ? Math.round((lecturesAttended / totalLectures) * 100) : 0;

    // Get sats rewards
    const { data: satsReward } = await supabaseAdmin
      .from('sats_rewards')
      .select('amount_paid, amount_pending')
      .eq('student_id', profile.id)
      .maybeSingle();

    // Get achievements
    const { data: achievementsData } = await supabaseAdmin
      .from('achievements')
      .select('badge_name, earned_at')
      .eq('student_id', profile.id)
      .order('earned_at', { ascending: false });

    // Map achievements (we need to get achievement definitions to get icons/titles)
    // For now, use badge_name as title and a default icon
    const achievements = (achievementsData || []).map((ach: any) => ({
      id: ach.badge_name || 'unknown',
      title: ach.badge_name || 'Achievement',
      icon: '🏆', // Default icon, could be enhanced with achievement definitions
      earnedAt: ach.earned_at,
    }));

    // Calculate overall progress
    const completedChapters = chapters.filter((c) => c.isCompleted).length;
    const overallProgress = Math.round((completedChapters / 20) * 50 + attendancePercent * 0.5);

    const progress = {
      chapters,
      assignments,
      attendance: {
        lecturesAttended,
        totalLectures,
        attendancePercent,
      },
      sats: {
        earned: satsReward?.amount_paid || 0,
        pending: satsReward?.amount_pending || 0,
      },
      achievements,
      overallProgress,
    };

    const res = NextResponse.json({ progress }, { status: 200 });
    attachRefresh(res, session);
    return res;
  } catch (error: any) {
    console.error('Error in admin student progress detail API:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' ? { details: error.message } : {}),
      },
      { status: 500 }
    );
  }
}

