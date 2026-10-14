import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAdmin, attachRefresh } from '@/lib/adminSession';
import { sendApprovalEmail } from '@/lib/email';
import { validateUUID, secureTextInput } from '@/lib/security-utils';
import { logAdminAction, AUDIT_ACTIONS } from '@/lib/audit-log';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://panafricanbitcoin.com';
const SETUP_PASSWORD_TOKEN_EXPIRY_HOURS = 72;

/**
 * APPROVAL FLOW - Transfer Data from Applications to Students & Profiles
 * 
 * When admin approves an application:
 * 1. STEP 1: Create/Register Profile in profiles table (or update if exists)
 *    - Transfers: name, email, phone, country, city, cohort_id from application
 *    - Sets status: 'Pending Password Setup' (or 'Active' if password exists)
 * 
 * 2. STEP 2: Create/Update Student Record in students table
 *    - Transfers ALL data from application to students table
 *    - This is the main data transfer: applications → students
 *    - Sets status: 'Enrolled'
 * 
 * 3. STEP 3: Update Profile from Student Record
 *    - Syncs profile with student data (students is source of truth)
 *    - Ensures profile has all latest data
 * 
 * 4. STEP 4: Enroll in Cohort
 *    - Creates cohort_enrollment record
 * 
 * 5. STEP 5: Unlock Chapter 1
 *    - Creates chapter_progress record
 * 
 * 6. STEP 6: Update Application Status
 *    - Sets status to 'Approved'
 *    - Links application to profile
 */
export async function POST(req: NextRequest) {
  try {
    const session = requireAdmin(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { applicationId, approvedBy } = await req.json();

    // Security: Validate applicationId format (UUID)
    if (!applicationId || !validateUUID(applicationId)) {
      return NextResponse.json(
        { error: 'Invalid application ID format' },
        { status: 400 }
      );
    }

    // Security: Sanitize approvedBy field if provided
    let sanitizedApprovedBy = session.email; // Default to session email
    if (approvedBy) {
      const approvedByValidation = secureTextInput(approvedBy, { maxLength: 200 });
      if (approvedByValidation.valid && approvedByValidation.sanitized) {
        sanitizedApprovedBy = approvedByValidation.sanitized;
      }
    }

    // Get the application
    const { data: application, error: appError } = await supabaseAdmin
      .from('applications')
      .select('*')
      .eq('id', applicationId)
      .single();

    if (appError || !application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    if (application.status === 'Approved') {
      return NextResponse.json(
        { error: 'Application is already approved' },
        { status: 400 }
      );
    }

    if (application.status === 'Rejected') {
      return NextResponse.json(
        { error: 'Application was rejected and cannot be approved' },
        { status: 400 }
      );
    }

    const emailLower = application.email?.toLowerCase().trim();
    const fullName = `${application.first_name || ''} ${application.last_name || ''}`.trim();

    // Validate required fields
    if (!emailLower) {
      return NextResponse.json(
        { error: 'Application email is missing' },
        { status: 400 }
      );
    }

    if (!fullName || fullName.trim().length === 0) {
      return NextResponse.json(
        { error: 'Application name is missing' },
        { status: 400 }
      );
    }

    // Check if profile already exists
    let profileId: string;
    let isExistingProfile = false;

    const { data: existingProfile, error: profileCheckError } = await supabaseAdmin
      .from('profiles')
      .select('id, email, status, cohort_id, phone, country, city, password_hash, email_verified_at, created_at')
      .eq('email', emailLower)
      .maybeSingle();

    // Use application.id as the student identifier across all databases
    // This ensures consistency - same ID used in applications, profiles, students, and all other tables
    const studentIdentifier = application.id; // This is the UUID from applications table

    if (existingProfile) {
      // Allow approval without pre-verification; email is effectively confirmed when they set password from the approval link.

      // Link to existing profile (basic profile already exists)
      profileId = existingProfile.id;
      isExistingProfile = true;
      console.log('Existing profile found, will update with application data:', profileId);
    } else {
      // Double-check if profile exists (race condition protection)
      const { data: doubleCheckProfile } = await supabaseAdmin
          .from('profiles')
          .select('id, email')
        .eq('email', emailLower)
          .maybeSingle();
        
      if (doubleCheckProfile) {
        // Profile was created between checks - use it
        profileId = doubleCheckProfile.id;
        isExistingProfile = true;
      } else {
        // Create new profile using the same ID as the application
        // This ensures the same ID is used across all databases (applications, profiles, students, etc.)
      const profileData: any = {
          id: studentIdentifier, // Use application.id as profile.id - ensures same ID everywhere
        name: fullName,
        email: emailLower,
        phone: application.phone || null,
        country: application.country || null,
        city: application.city || null,
        status: 'Pending Password Setup', // Special status until password is set
      };

      // Only add cohort_id if it exists and is valid
      if (application.preferred_cohort_id) {
        const { data: cohortCheck } = await supabaseAdmin
          .from('cohorts')
          .select('id')
          .eq('id', application.preferred_cohort_id)
          .maybeSingle();
        
        if (cohortCheck) {
          profileData.cohort_id = application.preferred_cohort_id;
        }
      }

        // Validate required fields before insert
        if (!profileData.name || !profileData.email) {
          return NextResponse.json(
            { 
              error: 'Failed to create profile', 
              details: 'Missing required fields: name and email are required',
            },
            { status: 400 }
          );
        }

      const { data: newProfile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('email', emailLower)
        .maybeSingle();

      if (profileError || !newProfile) {
        console.error('Error creating profile:', profileError);
        console.error('Profile creation details:', {
          name: fullName,
          email: emailLower,
          phone: application.phone,
          country: application.country,
          city: application.city,
            profile_id: studentIdentifier,
          cohort_id: application.preferred_cohort_id,
        });
          console.error('Full profileError object:', JSON.stringify(profileError, null, 2));
          console.error('Profile data being inserted:', JSON.stringify(profileData, null, 2));
          
          // Check for common errors
          let errorMessage = profileError?.message || 'Unknown error';
          if (profileError?.code === '23505') {
            // Unique constraint violation
            if (profileError?.message?.includes('email')) {
              errorMessage = 'An account with this email already exists. The profile may have been created between checks.';
            } else if (profileError?.message?.includes('id')) {
              errorMessage = 'A profile with this ID already exists';
            } else {
              errorMessage = 'Duplicate entry: ' + (profileError?.message || 'Unique constraint violation');
            }
          } else if (profileError?.code === '23502') {
            // Not null constraint violation
            errorMessage = 'Required field is missing: ' + (profileError?.message || 'Not null constraint violation');
          } else if (profileError?.code === '23503') {
            // Foreign key constraint violation
            errorMessage = 'Invalid reference: ' + (profileError?.message || 'Foreign key constraint violation');
          }
          
        return NextResponse.json(
          { 
            error: 'Failed to create profile', 
              details: errorMessage,
            code: profileError?.code,
            hint: profileError?.hint,
              fullError: process.env.NODE_ENV === 'development' ? profileError : undefined,
          },
          { status: 500 }
        );
      }

      profileId = newProfile.id;
      }
    }

    // STEP 2: Create/Update Students Record (SOURCE OF TRUTH)
    // Students database is the main database - all student data goes here
    // Use the same ID (studentIdentifier) for consistency across all tables
    const { data: existingStudent } = await supabaseAdmin
      .from('students')
      .select('id, name, email, phone, country, city, cohort_id, status, progress_percent, assignments_completed, projects_completed, live_sessions_attended')
      .eq('profile_id', profileId) // profileId is now the same as studentIdentifier (application.id)
      .maybeSingle();

    // Transfer ALL data from application to students table
    const studentData: any = {
      profile_id: profileId, // This is the same as studentIdentifier (application.id)
      name: fullName,
      email: emailLower,
      phone: application.phone || null,
      country: application.country || null,
      city: application.city || null,
      cohort_id: application.preferred_cohort_id || null,
      learning_pace: application.learning_pace || 'live_cohort',
      preferred_language: application.preferred_language || null,
      status: 'Enrolled', // Student is enrolled after approval
      // Preserve existing progress data if student record already exists
      progress_percent: existingStudent?.progress_percent || 0,
      assignments_completed: existingStudent?.assignments_completed || 0,
      projects_completed: existingStudent?.projects_completed || 0,
      live_sessions_attended: existingStudent?.live_sessions_attended || 0,
    };
    
    // If creating new student record, use the same ID for consistency
    if (!existingStudent) {
      studentData.id = studentIdentifier; // Use application.id as students.id
    }

    console.log('Transferring application data to students table:', {
      applicationId: application.id,
      profileId,
      studentData,
    });

    let studentRecord;
    if (existingStudent) {
      // Update existing student record with application data
      const { data: updatedStudent, error: updateError } = await supabaseAdmin
        .from('students')
        .update(studentData)
        .eq('id', existingStudent.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating student record:', updateError);
        return NextResponse.json(
          { error: 'Failed to update student record', details: updateError.message },
          { status: 500 }
        );
      }
      studentRecord = updatedStudent;
    } else {
      // Create new student record (source of truth)
      const { data: newStudent, error: studentError } = await supabaseAdmin
        .from('students')
        .insert(studentData)
        .select()
        .single();

      if (studentError) {
        console.error('Error creating student record:', studentError);
        return NextResponse.json(
          { error: 'Failed to create student record', details: studentError.message },
          { status: 500 }
        );
      }
      studentRecord = newStudent;
    }

    // Ensure studentRecord exists
    if (!studentRecord) {
      console.error('Student record was not created/updated');
      return NextResponse.json(
        { 
          error: 'Failed to create or update student record', 
          details: 'Student record is missing after creation/update',
        },
        { status: 500 }
      );
    }

    // STEP 3: UPDATE PROFILE WITH APPLICATION DATA
    // Update profile (whether new or existing) with all data from application
    // This ensures profile database is synced with the application data
    
    // Get current profile to check password_hash
    const { data: currentProfile, error: currentProfileError } = await supabaseAdmin
      .from('profiles')
      .select('password_hash, status')
      .eq('id', profileId)
      .maybeSingle();

    if (currentProfileError) {
      console.error('Error fetching current profile:', currentProfileError);
      return NextResponse.json(
        { 
          error: 'Failed to fetch profile for update', 
          details: currentProfileError.message,
        },
        { status: 500 }
      );
    }

    if (!currentProfile) {
      console.error('Profile not found for update:', profileId);
      return NextResponse.json(
        { 
          error: 'Profile not found', 
          details: `Profile with ID ${profileId} does not exist`,
        },
        { status: 404 }
      );
    }

    // STEP 3: Update Profile with ALL application data
    // Transfer all data from application to profile (whether new or existing)
    const profileUpdateData: any = {
      // Transfer all data from application/student record
      name: fullName, // From application
      email: emailLower, // From application
      phone: application.phone || null, // From application
      country: application.country || null, // From application
      city: application.city || null, // From application
      cohort_id: application.preferred_cohort_id || null, // From application
    };

    // Update status based on password
    // If profile already has password, keep it Active, otherwise set to Pending Password Setup
    if (currentProfile?.password_hash) {
      profileUpdateData.status = 'Active';
    } else {
      profileUpdateData.status = 'Pending Password Setup';
    }

    console.log('Updating profile with application data:', {
      profileId,
      isExistingProfile,
      updateData: profileUpdateData,
    });

    const { data: updatedProfile, error: profileUpdateError } = await supabaseAdmin
      .from('profiles')
      .update(profileUpdateData)
      .eq('id', profileId)
      .select()
      .single();

    if (profileUpdateError) {
      console.error('Error updating profile from student data:', profileUpdateError);
      console.error('Profile update data:', profileUpdateData);
      console.error('Profile ID:', profileId);
      // This is critical - profile must be updated with student data
      return NextResponse.json(
        { 
          error: 'Failed to update profile with student data', 
          details: profileUpdateError.message,
          code: profileUpdateError.code,
          hint: profileUpdateError.hint,
          profileId,
          studentRecordId: studentRecord.id,
        },
        { status: 500 }
      );
    }

    if (!updatedProfile) {
      console.error('Profile update returned no data - profile may not exist');
      return NextResponse.json(
        { 
          error: 'Failed to update profile - profile not found',
          details: 'Profile update returned no data. Profile may have been deleted.',
          profileId,
        },
        { status: 500 }
      );
    }

    console.log('Profile updated successfully:', {
      profileId: updatedProfile.id,
      name: updatedProfile.name,
      email: updatedProfile.email,
      cohort_id: updatedProfile.cohort_id,
      status: updatedProfile.status,
    });

    // STEP 4: Enroll in Cohort (if cohort_id exists in students record)
    if (studentRecord.cohort_id) {
      // Check if cohort has available seats before enrolling
      const [{ data: cohort, error: cohortError }, { count: enrolledCount }, { count: pendingCount }] = await Promise.all([
        supabaseAdmin
          .from('cohorts')
          .select('id, name, seats_total')
          .eq('id', studentRecord.cohort_id)
          .maybeSingle(),
        supabaseAdmin
          .from('cohort_enrollment')
          .select('*', { count: 'exact', head: true })
          .eq('cohort_id', studentRecord.cohort_id),
        supabaseAdmin
          .from('applications')
          .select('*', { count: 'exact', head: true })
          .eq('preferred_cohort_id', studentRecord.cohort_id)
          .eq('status', 'Pending'),
      ]);

      if (cohortError) {
        console.error('Error checking cohort availability:', cohortError);
        return NextResponse.json(
          { error: 'Failed to validate cohort availability' },
          { status: 500 }
        );
      }

      // Seat availability check removed - admins can approve applications even if cohort is full

      // Check if already enrolled
      // Use the same ID (studentIdentifier) - this is applications.id, profiles.id, and students.id
      const { data: existingEnrollment } = await supabaseAdmin
        .from('cohort_enrollment')
        .select('id')
        .eq('cohort_id', studentRecord.cohort_id)
        .eq('student_id', studentIdentifier) // Use the same ID across all tables
        .maybeSingle();

      if (!existingEnrollment) {
        // Create enrollment using the same ID (studentIdentifier)
        const { error: enrollmentError } = await supabaseAdmin
          .from('cohort_enrollment')
          .insert({
            cohort_id: studentRecord.cohort_id,
            student_id: studentIdentifier, // Same ID as applications.id, profiles.id, students.id
          });

        if (enrollmentError) {
          console.error('Error creating cohort enrollment:', enrollmentError);
          // Don't fail - enrollment can be fixed later
        }
      }
    }

    // Unlock Chapter 1 for the student
    // Use the same ID (studentIdentifier) for consistency
    try {
      const { error: chapterError } = await supabaseAdmin
        .from('chapter_progress')
        .insert({
          student_id: studentIdentifier, // Same ID as applications.id, profiles.id, students.id
          chapter_number: 1,
          chapter_slug: 'the-nature-of-money',
          is_unlocked: true,
          unlocked_at: new Date().toISOString(),
        });

      if (chapterError && !chapterError.message?.includes('duplicate')) {
        console.error('Error unlocking Chapter 1:', chapterError);
        // Don't fail - chapter progress can be set up later
      }
    } catch (chapterError) {
      console.log('Chapter progress table might not exist yet:', chapterError);
      // This is okay - table might not be migrated yet
    }

    // Verify profile exists before linking
    if (!profileId) {
      console.error('Profile ID is missing - cannot link application to profile');
      return NextResponse.json(
        { error: 'Failed to create profile - cannot approve application', details: 'Profile creation failed' },
        { status: 500 }
      );
    }

    // Double-check that the profile actually exists in the database
    const { data: verifyProfile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('id', profileId)
      .maybeSingle();

    if (!verifyProfile) {
      console.error('Profile does not exist in database:', profileId);
      return NextResponse.json(
        { error: 'Profile not found - cannot link application', details: `Profile with ID ${profileId} does not exist` },
        { status: 500 }
      );
    }

    // Security: Log approval action for audit
    logAdminAction(
      AUDIT_ACTIONS.APPLICATION_APPROVED,
      session.adminId,
      session.email,
      'application',
      {
        resourceId: applicationId,
        details: {
          applicantEmail: emailLower,
          applicantName: fullName,
          cohortId: application.preferred_cohort_id,
          learningPace: application.learning_pace || 'live_cohort',
          approvedBy: sanitizedApprovedBy,
        },
      }
    );

    // Update application status to Approved
    // approved_by column is UUID (references admin); use session.adminId, not email
    const updatePayload: Record<string, unknown> = {
      status: 'Approved',
      approved_at: new Date().toISOString(),
      profile_id: profileId,
    };
    if (session.adminId && validateUUID(session.adminId)) {
      updatePayload.approved_by = session.adminId;
    }

    const { error: updateError } = await supabaseAdmin
      .from('applications')
      .update(updatePayload)
      .eq('id', applicationId);

    if (updateError) {
      console.error('Error updating application status:', updateError);
      console.error('Update error details:', {
        applicationId,
        profileId,
        profileExists: !!verifyProfile,
        errorCode: updateError.code,
        errorMessage: updateError.message,
      });
      return NextResponse.json(
        { error: 'Failed to update application status', details: updateError.message },
        { status: 500 }
      );
    }

    // Verify both profile and student records were updated
    const { data: finalProfile, error: finalProfileError } = await supabaseAdmin
      .from('profiles')
      .select('id, name, email, cohort_id, status, student_id')
      .eq('id', profileId)
      .maybeSingle();

    const { data: finalStudent, error: finalStudentError } = await supabaseAdmin
      .from('students')
      .select('id, name, email, cohort_id, status')
      .eq('profile_id', profileId)
      .maybeSingle();

    // Log any verification errors (non-critical)
    if (finalProfileError) {
      console.warn('Error verifying profile after update:', finalProfileError);
    }
    if (finalStudentError) {
      console.warn('Error verifying student after update:', finalStudentError);
    }

    console.log('✅ Approval completed - Data Transfer Summary:', {
      application: {
        id: application.id,
        email: application.email,
        name: fullName,
      },
      profile: finalProfile ? {
        id: finalProfile.id,
        name: finalProfile.name,
        email: finalProfile.email,
        cohort_id: finalProfile.cohort_id,
        status: finalProfile.status,
        student_id: finalProfile.student_id,
        wasExisting: isExistingProfile,
      } : 'NOT FOUND',
      student: finalStudent ? {
        id: finalStudent.id,
        name: finalStudent.name,
        email: finalStudent.email,
        cohort_id: finalStudent.cohort_id,
        status: finalStudent.status,
        wasExisting: !!existingStudent,
      } : 'NOT FOUND',
      dataTransferred: {
        from: 'applications table',
        to: ['profiles table', 'students table'],
        fields: ['name', 'email', 'phone', 'country', 'city', 'cohort_id'],
      },
    });

    // Send approval email to student
    let emailSent = false;
    let emailError = null;
    
    // Validate email before sending
    if (!emailLower || !emailLower.includes('@')) {
      console.warn('Invalid email address, skipping email send:', emailLower);
      emailError = 'Invalid email address format';
    } else {
      // Get cohort name and dates for email (if cohort exists)
      let cohortName: string | undefined = undefined;
      let cohortStartDate: string | undefined = undefined;
      let cohortEndDate: string | undefined = undefined;
      if (studentRecord.cohort_id) {
        const { data: cohortData } = await supabaseAdmin
          .from('cohorts')
          .select('name, start_date, end_date')
          .eq('id', studentRecord.cohort_id)
          .maybeSingle();
        cohortName = cohortData?.name || undefined;
        cohortStartDate = cohortData?.start_date ? String(cohortData.start_date) : undefined;
        cohortEndDate = cohortData?.end_date ? String(cohortData.end_date) : undefined;
      }

      const needsPasswordSetup = !existingProfile || existingProfile.status === 'Pending Password Setup';
      let setupPasswordUrl: string | undefined;
      if (needsPasswordSetup) {
        const setupToken = crypto.randomBytes(32).toString('hex');
        const setupTokenExpiry = new Date();
        setupTokenExpiry.setHours(setupTokenExpiry.getHours() + SETUP_PASSWORD_TOKEN_EXPIRY_HOURS);
        const { error: tokenError } = await supabaseAdmin
          .from('profiles')
          .update({
            reset_token: setupToken,
            reset_token_expiry: setupTokenExpiry.toISOString(),
          })
          .eq('id', profileId);
        if (!tokenError) {
          setupPasswordUrl = `${SITE_URL}/setup-password?email=${encodeURIComponent(emailLower)}&token=${encodeURIComponent(setupToken)}`;
        }
      }

      // Send approval email
      if (process.env.NODE_ENV === 'development') {
        console.log('📧 Attempting to send approval email to:', emailLower);
      }

      const emailResult = await sendApprovalEmail({
        studentName: fullName,
        studentEmail: emailLower,
        cohortName,
        cohortStartDate,
        cohortEndDate,
        needsPasswordSetup,
        setupPasswordUrl,
      });

      emailSent = emailResult.success;
      emailError = emailResult.error || null;
      
      if (!emailSent) {
        console.error('❌ Failed to send approval email:', {
          error: emailError,
          studentEmail: emailLower,
          ...(process.env.NODE_ENV === 'development' && {
            errorDetails: emailResult.errorDetails,
            studentName: fullName,
            cohortName: cohortName || 'None',
          }),
        });
        // Don't fail the approval if email fails - just log it
      } else if (process.env.NODE_ENV === 'development') {
        console.log('✅ Approval email sent successfully to:', emailLower);
      }
    }

    const res = NextResponse.json({
      success: true,
      message: 'Application approved successfully',
      profileId,
      studentId: finalStudent?.id || null,
      isExistingProfile,
      needsPasswordSetup: !existingProfile || existingProfile.status === 'Pending Password Setup',
      emailSent,
      emailError: emailError || undefined,
    });
    attachRefresh(res, session);
    return res;
  } catch (error: any) {
    console.error('Error approving application:', error);
    const errorResponse: any = {
      error: 'Internal server error',
    };
    if (process.env.NODE_ENV === 'development' && error?.message) {
      errorResponse.details = error.message;
    }
    return NextResponse.json(errorResponse, { status: 500 });
  }
}


