import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { requireStudent } from '@/lib/session';

/**
 * Upload certificate image for a student
 * This is optional - students can upload their photo for certificates
 * If uploaded, it can optionally be synced to their profile picture
 */
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = requireStudent(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { imageData, useAsProfilePicture } = await req.json();

    if (!imageData) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }

    // Validate image data format
    if (!imageData.startsWith('data:image/')) {
      return NextResponse.json(
        { error: 'Invalid image format. Please upload a valid image file.' },
        { status: 400 }
      );
    }

    // Check image size (max 5MB)
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
    const imageSizeInBytes = (base64Data.length * 3) / 4;
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

    if (imageSizeInBytes > maxSizeInBytes) {
      return NextResponse.json(
        { error: 'Image size exceeds 5MB limit. Please upload a smaller image.' },
        { status: 400 }
      );
    }

    // Validate image type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const imageType = imageData.split(';')[0].split(':')[1];
    if (!allowedTypes.includes(imageType)) {
      return NextResponse.json(
        { error: 'Invalid image type. Please upload JPEG, PNG, or WebP (certificate-quality images).' },
        { status: 400 }
      );
    }

    // Get student record, create if missing
    let { data: student, error: studentError } = await supabaseAdmin
      .from('students')
      .select('id, profile_id')
      .eq('profile_id', session.userId)
      .maybeSingle();

    if (studentError) {
      console.error('[upload-certificate-image] Error checking student record:', studentError);
    }

    if (!student) {
      // Student record doesn't exist - create it automatically
      console.log(`[upload-certificate-image] Creating missing student record for profile ${session.userId}`);
      const { data: newStudent, error: createError } = await supabaseAdmin
        .from('students')
        .insert({
          profile_id: session.userId,
          progress_percent: 0,
          assignments_completed: 0,
          projects_completed: 0,
          live_sessions_attended: 0,
        })
        .select('id, profile_id')
        .single();

      if (createError || !newStudent) {
        console.error('[upload-certificate-image] Failed to create student record:', createError);
        return NextResponse.json(
          { error: 'Failed to create student record. Please contact support.' },
          { status: 500 }
        );
      }

      student = newStudent;
      console.log(`[upload-certificate-image] Successfully created student record for profile ${session.userId}`);
    }

    // Convert base64 to buffer
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Generate unique filename
    const fileExt = imageData.split(';')[0].split('/')[1];
    const fileName = `certificate-${student.id}.${fileExt}`;
    const filePath = `certificates/${fileName}`;

    // Upload to Supabase Storage (use admin client for server-side uploads)
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('profile_img') // Using same bucket as profile images
      .upload(filePath, buffer, {
        contentType: `image/${fileExt}`,
        upsert: true, // Replace if exists
      });

    if (uploadError) {
      console.error('Error uploading certificate image:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload image', details: uploadError.message },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('profile_img')
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;

    // Update student record with certificate image URL
    const { error: updateStudentError } = await supabaseAdmin
      .from('students')
      .update({ certificate_image_url: publicUrl })
      .eq('id', student.id);

    if (updateStudentError) {
      console.error('Error updating student with certificate image URL:', updateStudentError);
      return NextResponse.json(
        { error: 'Failed to update student record', details: updateStudentError.message },
        { status: 500 }
      );
    }

    // Optionally sync to profile picture if requested
    if (useAsProfilePicture) {
      const { error: updateProfileError } = await supabaseAdmin
        .from('profiles')
        .update({ photo_url: publicUrl })
        .eq('id', session.userId);

      if (updateProfileError) {
        console.error('Error updating profile with certificate image:', updateProfileError);
        // Don't fail the request, just log the error
      }
    }

    return NextResponse.json(
      { 
        success: true, 
        certificateImageUrl: publicUrl,
        profilePictureUrl: useAsProfilePicture ? publicUrl : undefined,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error in certificate image upload API:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' ? { details: error.message } : {})
      },
      { status: 500 }
    );
  }
}

/**
 * Delete certificate image (optional)
 */
export async function DELETE(req: NextRequest) {
  try {
    const session = requireStudent(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get student record, create if missing
    let { data: student, error: studentError } = await supabaseAdmin
      .from('students')
      .select('id, certificate_image_url')
      .eq('profile_id', session.userId)
      .maybeSingle();

    if (studentError) {
      console.error('[upload-certificate-image DELETE] Error checking student record:', studentError);
    }

    if (!student) {
      // Student record doesn't exist - create it automatically
      console.log(`[upload-certificate-image DELETE] Creating missing student record for profile ${session.userId}`);
      const { data: newStudent, error: createError } = await supabaseAdmin
        .from('students')
        .insert({
          profile_id: session.userId,
          progress_percent: 0,
          assignments_completed: 0,
          projects_completed: 0,
          live_sessions_attended: 0,
        })
        .select('id, certificate_image_url')
        .single();

      if (createError || !newStudent) {
        console.error('[upload-certificate-image DELETE] Failed to create student record:', createError);
        return NextResponse.json(
          { error: 'Failed to create student record. Please contact support.' },
          { status: 500 }
        );
      }

      student = newStudent;
      console.log(`[upload-certificate-image DELETE] Successfully created student record for profile ${session.userId}`);
    }

    // Remove certificate image URL from student record
    const { error: updateError } = await supabaseAdmin
      .from('students')
      .update({ certificate_image_url: null })
      .eq('id', student.id);

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to remove certificate image', details: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting certificate image:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' ? { details: error.message } : {})
      },
      { status: 500 }
    );
  }
}


