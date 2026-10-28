import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAdmin } from '@/lib/adminSession';
import { validateUUID } from '@/lib/security-utils';

/**
 * Admin endpoint to grant exam access to a student
 */
export async function POST(req: NextRequest) {
  try {
    const session = requireAdmin(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { studentId, adminId, adminEmail } = body;

    if (!studentId || !validateUUID(studentId)) {
      return NextResponse.json(
        { error: 'Valid student ID is required' },
        { status: 400 }
      );
    }

    // Check if student exists in profiles
    const { data: student, error: studentError } = await supabaseAdmin
      .from('profiles')
      .select('id, email, name')
      .eq('id', studentId)
      .single();

    if (studentError || !student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // Check if access already granted
    const { data: existingAccess } = await supabaseAdmin
      .from('exam_access')
      .select('id')
      .eq('student_id', studentId)
      .maybeSingle();

    if (existingAccess) {
      return NextResponse.json({
        success: true,
        message: `Exam access is already granted for ${student.name || student.email}`,
        alreadyGranted: true,
      });
    }

    // Determine granted_by (must be a valid UUID existing in profiles.id, or null to satisfy FK constraint)
    let grantedByProfileId: string | null = null;

    if (adminId && typeof adminId === 'string' && validateUUID(adminId)) {
      const { data: prof } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('id', adminId)
        .maybeSingle();
      if (prof?.id) {
        grantedByProfileId = prof.id;
      }
    }

    const emailToLookup =
      session.email ||
      adminEmail ||
      (typeof adminId === 'string' && adminId.includes('@') ? adminId : null);

    if (!grantedByProfileId && emailToLookup) {
      const { data: prof } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('email', emailToLookup.toLowerCase().trim())
        .maybeSingle();
      if (prof?.id) {
        grantedByProfileId = prof.id;
      }
    }

    // Grant access
    const { data: access, error: accessError } = await supabaseAdmin
      .from('exam_access')
      .insert({
        student_id: studentId,
        granted_by: grantedByProfileId,
      })
      .select()
      .single();

    if (accessError) {
      console.error('Error granting exam access:', accessError);
      return NextResponse.json(
        { error: 'Failed to grant exam access', details: accessError.message },
        { status: 500 }
      );
    }

    // Reset timer on profile so the student has an active exam window
    await supabaseAdmin
      .from('profiles')
      .update({ exam_timer_reset_at: new Date().toISOString() })
      .eq('id', studentId);

    return NextResponse.json({
      success: true,
      message: `Exam access granted to ${student.name || student.email}`,
      access,
    });
  } catch (error: any) {
    console.error('Error granting exam access:', error);
    return NextResponse.json(
      {
        error: 'Failed to grant exam access',
        details: error?.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}
