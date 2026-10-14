import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Step 0: Check if user is an admin (admins bypass all requirements)
    const { data: admin } = await supabaseAdmin
      .from('admins')
      .select('id, email, role')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle();

    const isAdmin = !!admin;

    // If admin, unlock all chapters (1-21)
    if (isAdmin) {
      const allChapters: Record<number, { isUnlocked: boolean; isCompleted: boolean }> = {};
      for (let i = 1; i <= 21; i++) {
        allChapters[i] = { isUnlocked: true, isCompleted: false };
      }

      // Check if admin has a profile and get completion status
      const { data: adminProfile } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('email', email.toLowerCase().trim())
        .maybeSingle();

      if (adminProfile) {
        const { data: chapterProgress } = await supabaseAdmin
          .from('chapter_progress')
          .select('chapter_number, is_completed')
          .eq('student_id', adminProfile.id);

        if (chapterProgress) {
          chapterProgress.forEach((progress) => {
            if (allChapters[progress.chapter_number]) {
              allChapters[progress.chapter_number].isCompleted = progress.is_completed || false;
            }
          });
        }
      }

      return NextResponse.json({
        isRegistered: true,
        isEnrolled: true,
        isAdmin: true,
        chapters: allChapters,
        message: 'Admin access - all chapters unlocked',
      });
    }

    // Get profile ID
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (profileError || !profile) {
      // Not registered - all chapters locked
      return NextResponse.json({
        isRegistered: false,
        isEnrolled: false,
        chapters: {},
      });
    }

    // Check if student exists
    const { data: student } = await supabaseAdmin
      .from('students')
      .select('id')
      .eq('profile_id', profile.id)
      .single();

    if (!student) {
      // Registered but not enrolled - all chapters locked
      return NextResponse.json({
        isRegistered: true,
        isEnrolled: false,
        chapters: {},
      });
    }

    // Get all chapter progress for this student
    const { data: chapterProgress, error: progressError } = await supabaseAdmin
      .from('chapter_progress')
      .select('chapter_number, is_unlocked, is_completed')
      .eq('student_id', profile.id);

    // Build status map
    const statusMap: Record<number, { isUnlocked: boolean; isCompleted: boolean }> = {};

    if (chapterProgress) {
      chapterProgress.forEach((progress) => {
        statusMap[progress.chapter_number] = {
          isUnlocked: progress.is_unlocked || false,
          isCompleted: progress.is_completed || false,
        };
      });
    }

    // Ensure Chapter 1 is unlocked for enrolled students
    if (!statusMap[1]) {
      statusMap[1] = { isUnlocked: true, isCompleted: false };
    }

    return NextResponse.json({
      isRegistered: true,
      isEnrolled: true,
      chapters: statusMap,
    });
  } catch (error: any) {
    console.error('Error getting chapter unlock status:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' ? { details: error.message } : {})
      },
      { status: 500 }
    );
  }
}







