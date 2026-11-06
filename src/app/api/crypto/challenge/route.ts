import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, issueChallenge } from '@/lib/cryptoChallengeStore';

export async function GET(request: NextRequest) {
  const accountId = request.nextUrl.searchParams.get('accountId');

  if (!accountId || typeof accountId !== 'string' || !accountId.startsWith('pba_acc_')) {
    return NextResponse.json(
      { error: 'A valid PBA account ID (starting with pba_acc_) is required.' },
      { status: 400 },
    );
  }

  // Rate limiting based on IP or accountId
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown-ip';
  if (!checkRateLimit(ip) || !checkRateLimit(accountId)) {
    return NextResponse.json(
      { error: 'Too many authentication attempts. Please wait a minute and try again.' },
      { status: 429 },
    );
  }

  const { challenge, expiresAt } = await issueChallenge(accountId);

  return NextResponse.json({
    challenge,
    expiresAt,
    algorithm: 'ECDSA-P256',
  });
}
