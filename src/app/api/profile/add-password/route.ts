import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/supabase';
import { requireStudent } from '@/lib/session';
import { validatePassword } from '@/lib/passwordValidation';

export async function POST(request: NextRequest) {
  const session = requireStudent(request);
  if (!session) {
    return NextResponse.json({ error: 'You must be signed in to link email and password.' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
    }

    const { email, password } = body;

    if (!email || typeof email !== 'string' || !/\S+@\S+\.\S+/.test(email.trim())) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
    }

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Password is required.' }, { status: 400 });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: passwordValidation.errors[0] || 'Password does not meet strength requirements.' },
        { status: 400 },
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if email already used by someone else
    const { data: existingUser } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', cleanEmail)
      .neq('id', session.userId)
      .maybeSingle();

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email address already exists.' },
        { status: 409 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update profile
    const { data: updatedProfile, error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        email: cleanEmail,
        password_hash: hashedPassword,
        email_verified_at: new Date().toISOString(),
      })
      .eq('id', session.userId)
      .select('id, email, name')
      .single();

    if (updateError || !updatedProfile) {
      console.error('Failed to link email/password to profile:', updateError);
      return NextResponse.json(
        { error: 'Failed to update account security settings.' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      email: updatedProfile.email,
      message: 'Email and password linked successfully. You can now use both methods to sign in.',
    });
  } catch (error) {
    console.error('Error linking email and password:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
