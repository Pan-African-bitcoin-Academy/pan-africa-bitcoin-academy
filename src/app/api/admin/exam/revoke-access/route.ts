import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAdmin } from '@/lib/adminSession';
import { validateUUID } from '@/lib/security-utils';

/**
 * Admin endpoint to revoke exam access from a student
 */
export async function POST(req: NextRequest) {
  try {
    const session = requireAdmin(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { studentId } = body;

    if (!studentId || !validateUUID(studentId)) {
      return NextResponse.json(
        { error: 'Valid student ID is required' },
        { status: 400 }
      );
    }

    // Remove access
    const { error: deleteError } = await supabaseAdmin
      .from('exam_access')
      .delete()
      .eq('student_id', studentId);

    if (deleteError) {
      console.error('Error revoking exam access:', deleteError);
      return NextResponse.json(
        { error: 'Failed to revoke exam access', details: deleteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Exam access revoked successfully',
    });
  } catch (error: any) {
    console.error('Error revoking exam access:', error);
    return NextResponse.json(
      {
        error: 'Failed to revoke exam access',
        details: error?.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}
