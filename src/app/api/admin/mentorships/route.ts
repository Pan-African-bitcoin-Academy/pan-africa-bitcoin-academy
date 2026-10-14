import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { attachRefresh, requireAdmin } from '@/lib/adminSession';

export async function GET(req: NextRequest) {
  const session = requireAdmin(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');

  let query = supabaseAdmin
    .from('mentorship_applications')
    .select('*')
    .order('created_at', { ascending: false });

  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Mentorship list error:', error);
    return NextResponse.json({ error: 'Failed to load mentorship applications' }, { status: 500 });
  }

  const res = NextResponse.json({ applications: data || [] });
  attachRefresh(res, session);
  return res;
}

export async function PATCH(req: NextRequest) {
  const session = requireAdmin(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'id and status required' }, { status: 400 });
    }

    // Get the mentorship application first
    const { data: application, error: appError } = await supabaseAdmin
      .from('mentorship_applications')
      .select('*')
      .eq('id', id)
      .single();

    if (appError || !application) {
      return NextResponse.json({ error: 'Mentorship application not found' }, { status: 404 });
    }

    // Update the mentorship application status
    const { error: updateError } = await supabaseAdmin
      .from('mentorship_applications')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (updateError) {
      console.error('Mentorship update error:', updateError);
      return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
    }

    // If status is 'Approved', create or update mentor record
    if (status === 'Approved') {
      // Check if mentor already exists
      const { data: existingMentor } = await supabaseAdmin
        .from('mentors')
        .select('id')
        .eq('mentorship_application_id', id)
        .single();

      // Determine mentor type based on role
      let mentorType = 'Mentor'; // Default
      if (application.role) {
        const roleLower = application.role.toLowerCase();
        if (roleLower.includes('volunteer')) {
          mentorType = 'Volunteer';
        } else if (roleLower.includes('lecturer') || roleLower.includes('guest')) {
          mentorType = 'Guest Lecturer';
        }
      }

      // Create mentor description from experience and motivation
      const description = application.experience || application.motivation || 'Contributing to Bitcoin education in Africa.';

      if (existingMentor) {
        // Update existing mentor (reactivate if needed)
        const { error: mentorUpdateError } = await supabaseAdmin
          .from('mentors')
          .update({
            name: application.name,
            role: application.role || 'Contributor',
            description: description.substring(0, 200), // Limit description length
            type: mentorType,
            is_active: true,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingMentor.id);

        if (mentorUpdateError) {
          console.error('Error updating mentor:', mentorUpdateError);
          // Don't fail the request, just log the error
        }
      } else {
        // Create new mentor record
        const { error: mentorInsertError } = await supabaseAdmin
          .from('mentors')
          .insert({
            mentorship_application_id: id,
            name: application.name,
            role: application.role || 'Contributor',
            description: description.substring(0, 200), // Limit description length
            type: mentorType,
            is_active: true,
          });

        if (mentorInsertError) {
          console.error('Error creating mentor:', mentorInsertError);
          // Don't fail the request, just log the error
        }
      }
    } else if (application.status === 'Approved' && status !== 'Approved') {
      // If changing from Approved to something else, deactivate the mentor
      const { error: deactivateError } = await supabaseAdmin
        .from('mentors')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('mentorship_application_id', id);

      if (deactivateError) {
        console.error('Error deactivating mentor:', deactivateError);
        // Don't fail the request, just log the error
      }
    }

    const res = NextResponse.json({ success: true });
    attachRefresh(res, session);
    return res;
  } catch (error: any) {
    console.error('Mentorship PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}




