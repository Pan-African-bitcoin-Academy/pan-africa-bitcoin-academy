import { supabaseAdmin } from '@/lib/supabase';
import type { UserAlert, NotificationPreference } from './alertTypes';

export interface MarketPriceSnapshot {
  current_price: number;
  price_change_percentage_24h: number | null;
  high_24h: number | null;
  low_24h: number | null;
  last_updated: string;
}

export async function fetchCurrentBtcPrice(): Promise<MarketPriceSnapshot | null> {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin&price_change_percentage=24h',
      { next: { revalidate: 120 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    return {
      current_price: data[0].current_price,
      price_change_percentage_24h: data[0].price_change_percentage_24h ?? null,
      high_24h: data[0].high_24h ?? null,
      low_24h: data[0].low_24h ?? null,
      last_updated: data[0].last_updated || new Date().toISOString(),
    };
  } catch (err) {
    console.error('Failed to fetch Bitcoin price for alerts:', err);
    return null;
  }
}

/**
 * Checks if cooldown window has passed since last_triggered_at
 */
export function isCooldownSatisfied(alert: UserAlert): boolean {
  if (!alert.last_triggered_at) return true;
  const lastTriggered = new Date(alert.last_triggered_at).getTime();
  const cooldownMs = (alert.cooldown_hours || 24) * 60 * 60 * 1000;
  return Date.now() - lastTriggered >= cooldownMs;
}

/**
 * Evaluates whether a contribution reminder alert is due right now in the user's timezone.
 */
export function isContributionReminderDue(
  alert: UserAlert,
  timezone: string
): { isDue: boolean; dedupKey: string } {
  try {
    const now = new Date();
    // Get local date & time parts for user's timezone
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone || 'UTC',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      weekday: 'short',
    });

    const parts = formatter.formatToParts(now);
    const partMap: Record<string, string> = {};
    for (const p of parts) partMap[p.type] = p.value;

    const localDateStr = `${partMap.year}-${partMap.month}-${partMap.day}`;
    const localHour = parseInt(partMap.hour || '0', 10);
    const targetHour = parseInt((alert.schedule_time || '09:00').split(':')[0], 10);

    // Dedup key per day
    const dedupKey = `reminder_${alert.id}_${localDateStr}`;

    // Frequency match
    let freqMatch = false;
    const dayOfWeek = now.getUTCDay(); // approx weekday
    const dayOfMonth = parseInt(partMap.day || '1', 10);

    if (alert.schedule_frequency === 'daily') {
      freqMatch = true;
    } else if (alert.schedule_frequency === 'weekly') {
      freqMatch = alert.schedule_day_of_week === undefined || alert.schedule_day_of_week === null || alert.schedule_day_of_week === dayOfWeek;
    } else if (alert.schedule_frequency === 'monthly') {
      freqMatch = alert.schedule_day_of_month === undefined || alert.schedule_day_of_month === null || alert.schedule_day_of_month === dayOfMonth;
    } else {
      freqMatch = true;
    }

    // Trigger when local hour matches or exceeds target hour for the day
    const isDue = freqMatch && localHour >= targetHour && isCooldownSatisfied(alert);
    return { isDue, dedupKey };
  } catch (err) {
    console.error('Error evaluating reminder schedule:', err);
    return { isDue: false, dedupKey: '' };
  }
}

/**
 * Evaluates price threshold conditions
 */
export function evaluatePriceAlert(
  alert: UserAlert,
  market: MarketPriceSnapshot
): { isTriggered: boolean; title: string; body: string; dedupKey: string } | null {
  if (!isCooldownSatisfied(alert)) return null;

  const btcPrice = market.current_price;
  const threshold = alert.threshold_value || 0;
  const dateStr = new Date().toISOString().slice(0, 13); // hourly granularity for price dedup

  if (alert.type === 'price_threshold') {
    if (alert.condition === 'below' && btcPrice <= threshold) {
      return {
        isTriggered: true,
        title: 'Bitcoin Price Dip Alert 📉',
        body: `Bitcoin is currently $${btcPrice.toLocaleString()} USD, falling below your alert target of $${threshold.toLocaleString()} USD.`,
        dedupKey: `price_below_${alert.id}_${dateStr}`,
      };
    }
    if (alert.condition === 'above' && btcPrice >= threshold) {
      return {
        isTriggered: true,
        title: 'Bitcoin Price Rise Alert 🚀',
        body: `Bitcoin is currently $${btcPrice.toLocaleString()} USD, rising above your alert target of $${threshold.toLocaleString()} USD.`,
        dedupKey: `price_above_${alert.id}_${dateStr}`,
      };
    }
  }

  if (alert.type === 'price_change_pct' || alert.condition === 'drop_pct') {
    const change24h = market.price_change_percentage_24h ?? 0;
    const dropTarget = Math.abs(threshold);
    if (change24h <= -dropTarget) {
      return {
        isTriggered: true,
        title: 'Bitcoin 24-Hour Price Drop Alert ⚡',
        body: `Bitcoin has dropped ${Math.abs(change24h).toFixed(2)}% in the last 24 hours (Current: $${btcPrice.toLocaleString()} USD). Good time to review your DCA plan!`,
        dedupKey: `drop_pct_${alert.id}_${dateStr}`,
      };
    }
  }

  return null;
}

/**
 * Checks for missed scheduled contributions
 */
export async function evaluateMissedContribution(
  alert: UserAlert
): Promise<{ isMissed: boolean; title: string; body: string; dedupKey: string } | null> {
  if (!alert.user_id || !isCooldownSatisfied(alert)) return null;

  // Fetch recent purchases from dca_purchases
  const graceDays = alert.grace_period_days || 2;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - (7 + graceDays)); // Check last cycle

  const { data: purchases } = await supabaseAdmin
    .from('dca_purchases')
    .select('id, purchase_date')
    .eq('user_id', alert.user_id)
    .gte('purchase_date', cutoff.toISOString().slice(0, 10))
    .limit(1);

  // If no purchase recorded in the last cycle + grace period
  if (!purchases || purchases.length === 0) {
    const cycleStr = new Date().toISOString().slice(0, 10);
    return {
      isMissed: true,
      title: 'Missed DCA Contribution Reminder ⚠️',
      body: `You have an active DCA plan, but no contribution was recorded in the past ${graceDays} days grace period. Make sure to log your purchase or adjust your plan schedule!`,
      dedupKey: `missed_${alert.id}_${cycleStr}`,
    };
  }

  return null;
}

/**
 * Checks goal milestones (25%, 50%, 75%, 100%, or target BTC)
 */
export async function evaluateGoalMilestone(
  alert: UserAlert
): Promise<{ isReached: boolean; title: string; body: string; dedupKey: string } | null> {
  if (!alert.user_id) return null;

  // Calculate user's total sats accumulated
  const { data: purchases } = await supabaseAdmin
    .from('dca_purchases')
    .select('satoshis')
    .eq('user_id', alert.user_id);

  const totalSats = (purchases || []).reduce((acc: number, p: any) => acc + (Number(p.satoshis) || 0), 0);
  const targetThreshold = Number(alert.threshold_value) || 0;

  // If threshold is in percentage (e.g. 50%) or satoshis
  // For milestone reached:
  if (totalSats >= targetThreshold && targetThreshold > 0) {
    const btcAmount = (totalSats / 100_000_000).toFixed(4);
    const dedupKey = `milestone_${alert.id}_${targetThreshold}`;
    return {
      isReached: true,
      title: 'DCA Goal Milestone Reached! 🎉',
      body: `Congratulations! You have accumulated ${btcAmount} BTC (${totalSats.toLocaleString()} sats), hitting your milestone target of ${targetThreshold >= 1000 ? (targetThreshold / 100_000_000).toFixed(4) + ' BTC' : targetThreshold + '%'}.`,
      dedupKey,
    };
  }

  return null;
}
