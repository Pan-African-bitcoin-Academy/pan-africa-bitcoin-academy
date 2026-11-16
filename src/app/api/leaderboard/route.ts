import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Fetch students from students table
    const { data: studentsData, error: studentsError } = await supabaseAdmin
      .from('students')
      .select('id, profile_id, assignments_completed, live_sessions_attended, cohort_id')
      .limit(500);

    if (studentsError) {
      console.error('[Leaderboard API] Error fetching students:', studentsError);
      return NextResponse.json(
        {
          error: 'Failed to fetch leaderboard students',
          ...(process.env.NODE_ENV === 'development' ? { details: studentsError.message } : {}),
        },
        { status: 500 }
      );
    }

    const profileIds = (studentsData || []).map((s: any) => s.profile_id).filter(Boolean);

    // 2. Fetch profiles
    let profilesData: any[] = [];
    if (profileIds.length > 0) {
      const { data: profiles, error: profilesError } = await supabaseAdmin
        .from('profiles')
        .select('id, name, email, status')
        .in('id', profileIds);

      if (profilesError) {
        console.error('[Leaderboard API] Error fetching profiles:', profilesError);
      } else {
        profilesData = profiles || [];
      }
    }

    // 3. Fetch sats rewards (both amount_paid and amount_pending)
    let rewardsData: any[] = [];
    try {
      const { data: rewards, error: rewardsError } = await supabaseAdmin
        .from('sats_rewards')
        .select('student_id, amount_paid, amount_pending');
      if (rewardsError) {
        console.warn('[Leaderboard API] Warning fetching rewards:', rewardsError);
      } else {
        rewardsData = rewards || [];
      }
    } catch (e) {
      console.warn('[Leaderboard API] Error querying sats_rewards:', e);
    }

    // 4. Fetch achievements (awards)
    let achievementsData: any[] = [];
    try {
      const { data: achievements, error: achError } = await supabaseAdmin
        .from('achievements')
        .select('student_id, badge_name');
      if (achError) {
        console.warn('[Leaderboard API] Warning fetching achievements:', achError);
      } else {
        achievementsData = achievements || [];
      }
    } catch (e) {
      console.warn('[Leaderboard API] Error querying achievements:', e);
    }

    // 5. Fetch chapter progress
    let chaptersData: any[] = [];
    try {
      const { data: chapters, error: chError } = await supabaseAdmin
        .from('chapter_progress')
        .select('student_id, is_completed')
        .eq('is_completed', true);
      if (chError) {
        console.warn('[Leaderboard API] Warning fetching chapter progress:', chError);
      } else {
        chaptersData = chapters || [];
      }
    } catch (e) {
      console.warn('[Leaderboard API] Error querying chapter_progress:', e);
    }

    // 6. Fetch attendance & cohort sessions count
    let attendanceData: any[] = [];
    let cohortSessionsData: any[] = [];
    try {
      const [{ data: att }, { data: sess }] = await Promise.all([
        supabaseAdmin.from('attendance').select('student_id, event_id'),
        supabaseAdmin.from('cohort_sessions').select('id, cohort_id'),
      ]);
      attendanceData = att || [];
      cohortSessionsData = sess || [];
    } catch (e) {
      console.warn('[Leaderboard API] Non-critical attendance fetch error:', e);
    }

    // Map profiles by ID
    const profileMap = new Map<string, any>();
    profilesData.forEach((p) => profileMap.set(p.id, p));

    // Map sats by student_id (which stores profile.id)
    const satsMap = new Map<string, number>();
    rewardsData.forEach((r) => {
      if (!r.student_id) return;
      const current = satsMap.get(r.student_id) || 0;
      const amount = (r.amount_paid || 0) + (r.amount_pending || 0);
      satsMap.set(r.student_id, current + amount);
    });

    // Map achievements by student_id
    const achievementsMap = new Map<string, number>();
    achievementsData.forEach((a) => {
      if (!a.student_id) return;
      const current = achievementsMap.get(a.student_id) || 0;
      achievementsMap.set(a.student_id, current + 1);
    });

    // Map chapters completed by student_id
    const chaptersMap = new Map<string, number>();
    chaptersData.forEach((c) => {
      if (!c.student_id) return;
      const current = chaptersMap.get(c.student_id) || 0;
      chaptersMap.set(c.student_id, current + 1);
    });

    // Map sessions count by cohort_id
    const cohortSessionCount = new Map<string, number>();
    cohortSessionsData.forEach((s) => {
      if (!s.cohort_id) return;
      const current = cohortSessionCount.get(s.cohort_id) || 0;
      cohortSessionCount.set(s.cohort_id, current + 1);
    });

    // Map attendance count by student_id
    const attendanceCountMap = new Map<string, number>();
    attendanceData.forEach((a) => {
      if (!a.student_id) return;
      const current = attendanceCountMap.get(a.student_id) || 0;
      attendanceCountMap.set(a.student_id, current + 1);
    });

    // Build student performance entries
    const seenProfileIds = new Set<string>();
    const entries: Array<{
      studentId: string;
      name: string;
      sats: number;
      awards: number;
      assignments: number;
      chaptersCompleted: number;
      attendance: number;
    }> = [];

    (studentsData || []).forEach((s: any) => {
      const profileId = s.profile_id || s.id;
      if (!profileId || seenProfileIds.has(profileId)) return;
      seenProfileIds.add(profileId);

      const profile = profileMap.get(profileId);
      // Skip inactive or banned accounts
      const status = profile?.status?.toLowerCase();
      if (status === 'banned' || status === 'suspended') {
        return;
      }

      const rawName = profile?.name?.trim();
      const name = rawName || 'Anonymous Student';
      const sats = satsMap.get(profileId) || 0;
      const awardsCount = achievementsMap.get(profileId) || 0;
      const assignments = s.assignments_completed || 0;
      const chaptersCompleted = chaptersMap.get(profileId) || 0;

      // Attendance percentage calculation
      const attended = attendanceCountMap.get(profileId) || s.live_sessions_attended || 0;
      const totalSessions = (s.cohort_id && cohortSessionCount.get(s.cohort_id)) || 0;
      let attendance = 0;
      if (totalSessions > 0) {
        attendance = Math.min(100, Math.round((attended / totalSessions) * 100));
      } else if (attended > 0) {
        attendance = Math.min(100, attended * 10);
      }

      // Only list students who have received Sats (sats > 0)
      if (sats > 0) {
        entries.push({
          studentId: profileId,
          name,
          sats,
          awards: awardsCount > 0 ? awardsCount : assignments,
          assignments,
          chaptersCompleted,
          attendance,
        });
      }
    });

    // Rank by student performance:
    // 1. Sats earned (descending)
    // 2. Awards / Achievements earned (descending)
    // 3. Assignments completed (descending)
    // 4. Chapters completed (descending)
    // 5. Attendance percentage (descending)
    // 6. Name (alphabetical)
    entries.sort((a, b) => {
      if (b.sats !== a.sats) return b.sats - a.sats;
      if (b.awards !== a.awards) return b.awards - a.awards;
      if (b.assignments !== a.assignments) return b.assignments - a.assignments;
      if (b.chaptersCompleted !== a.chaptersCompleted) return b.chaptersCompleted - a.chaptersCompleted;
      if (b.attendance !== a.attendance) return b.attendance - a.attendance;
      return a.name.localeCompare(b.name);
    });

    // Assign rank numbers
    const leaderboard = entries.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

    return NextResponse.json({ leaderboard }, { status: 200 });
  } catch (error: any) {
    console.error('[Leaderboard API] Unexpected error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' ? { details: error.message } : {}),
      },
      { status: 500 }
    );
  }
}
