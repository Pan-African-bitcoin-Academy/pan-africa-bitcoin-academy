import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Public API endpoint to fetch active mentors for display
export async function GET(req: NextRequest) {
  try {
    const { data: mentors, error } = await supabaseAdmin
      .from('mentors')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching mentors:', error);
      return NextResponse.json({ error: 'Failed to fetch mentors' }, { status: 500 });
    }

    return NextResponse.json({ mentors: mentors || [] });
  } catch (error: any) {
    console.error('Mentors GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
