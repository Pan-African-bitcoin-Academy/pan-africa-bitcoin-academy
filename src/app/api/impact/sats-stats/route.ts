import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * API endpoint to fetch sats reward economy statistics
 * Returns:
 * - satsEarned: Total sats awarded (amount_paid + amount_pending)
 * - satsSpent: Total sats paid out (amount_paid)
 * - satsCirculated: Total sats circulated (same as satsSpent - sats that moved)
 */
export async function GET(req: NextRequest) {
  try {
    // Fetch all sats rewards
    const { data: rewards, error } = await supabaseAdmin
      .from('sats_rewards')
      .select('amount_paid, amount_pending');

    if (error) {
      console.error('Error fetching sats rewards:', error);
      return NextResponse.json(
        { error: 'Failed to fetch sats statistics' },
        { status: 500 }
      );
    }

    // Calculate statistics
    let satsEarned = 0;
    let satsSpent = 0;

    if (rewards && rewards.length > 0) {
      rewards.forEach((reward: any) => {
        const paid = reward.amount_paid || 0;
        const pending = reward.amount_pending || 0;
        
        // Sats Earned = total rewards awarded (paid + pending)
        satsEarned += paid + pending;
        
        // Sats Spent = only what's been paid out
        satsSpent += paid;
      });
    }

    // Sats Circulated = same as Sats Spent (sats that have moved)
    const satsCirculated = satsSpent;

    return NextResponse.json({
      satsEarned,
      satsSpent,
      satsCirculated,
    });
  } catch (error: any) {
    console.error('Error in sats stats API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
