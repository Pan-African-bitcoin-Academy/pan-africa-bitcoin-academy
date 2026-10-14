import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    const studentId = searchParams.get('studentId'); // UUID of profile.id

    let profileId: string | null = null;

    // If studentId (profile UUID) is provided, use it directly
    if (studentId) {
      profileId = studentId;
    } 
    // If email is provided, get profile ID from email
    else if (email) {
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('email', email.toLowerCase().trim())
        .maybeSingle();

      if (profileError || !profile) {
        // No profile found - return zeros
        return NextResponse.json(
          { totalPaid: 0, totalPending: 0 },
          { status: 200 }
        );
      }

      profileId = profile.id;
    } else {
      // No email or studentId provided - return zeros
      return NextResponse.json(
        { totalPaid: 0, totalPending: 0 },
        { status: 200 }
      );
    }

    // Fetch sats rewards for this specific student
    const { data: rewards, error } = await supabaseAdmin
      .from('sats_rewards')
      .select('amount_paid, amount_pending')
      .eq('student_id', profileId);

    if (error) {
      console.error('Error fetching sats rewards:', error);
      return NextResponse.json(
        { 
          error: 'Failed to fetch sats',
          ...(process.env.NODE_ENV === 'development' ? { details: error.message } : {})
        },
        { status: 500 }
      );
    }

    // Calculate totals for this student
    const totalPaid = (rewards || []).reduce(
      (sum: number, reward: any) => sum + (reward.amount_paid || 0),
      0
    );
    const totalPending = (rewards || []).reduce(
      (sum: number, reward: any) => sum + (reward.amount_pending || 0),
      0
    );

    return NextResponse.json(
      { totalPaid, totalPending },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error in sats API:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' ? { details: error.message } : {})
      },
      { status: 500 }
    );
  }
}


