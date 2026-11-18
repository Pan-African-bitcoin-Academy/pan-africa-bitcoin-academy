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

export type AlertLang = 'en' | 'ti';

export interface AlertTriggerContent {
  title: string;
  body: string;
  title_en: string;
  body_en: string;
  title_ti: string;
  body_ti: string;
  dedupKey: string;
}

/**
 * Normalizes user language string to 'en' or 'ti'
 */
export function normalizeLang(lang?: string | null): AlertLang {
  if (!lang) return 'en';
  const l = lang.toLowerCase().trim();
  if (l === 'ti' || l === 'tigrigna' || l === 'tigrinya') return 'ti';
  return 'en';
}

/**
 * Evaluates price threshold conditions
 */
export function evaluatePriceAlert(
  alert: UserAlert,
  market: MarketPriceSnapshot,
  lang: AlertLang = 'en'
): ({ isTriggered: boolean } & AlertTriggerContent) | null {
  if (!isCooldownSatisfied(alert)) return null;

  const btcPrice = market.current_price;
  const threshold = alert.threshold_value || 0;
  const dateStr = new Date().toISOString().slice(0, 13); // hourly granularity for price dedup

  if (alert.type === 'price_threshold') {
    if (alert.condition === 'below' && btcPrice <= threshold) {
      const title_en = 'Bitcoin Price Dip Alert 📉';
      const body_en = `Bitcoin is currently $${btcPrice.toLocaleString()} USD, falling below your alert target of $${threshold.toLocaleString()} USD.`;
      const title_ti = 'ናይ ቢትኮይን ዋጋ ምውራድ መጠንቀቕታ 📉';
      const body_ti = `ቢትኮይን ኣብዚ እዋን $${btcPrice.toLocaleString()} ዶላር ኣሎ፣ እዚ ድማ ካብቲ ዝመረጽካዮ ናይ መጠንቀቕታ ዋጋ $${threshold.toLocaleString()} ዶላር ወሪዱ ኣሎ።`;

      return {
        isTriggered: true,
        title: lang === 'ti' ? title_ti : title_en,
        body: lang === 'ti' ? body_ti : body_en,
        title_en,
        body_en,
        title_ti,
        body_ti,
        dedupKey: `price_below_${alert.id}_${dateStr}`,
      };
    }
    if (alert.condition === 'above' && btcPrice >= threshold) {
      const title_en = 'Bitcoin Price Rise Alert 🚀';
      const body_en = `Bitcoin is currently $${btcPrice.toLocaleString()} USD, rising above your alert target of $${threshold.toLocaleString()} USD.`;
      const title_ti = 'ናይ ቢትኮይን ዋጋ ምዕባይ መጠንቀቕታ 🚀';
      const body_ti = `ቢትኮይን ኣብዚ እዋን $${btcPrice.toLocaleString()} ዶላር በጺሑ ኣሎ፣ እዚ ድማ ካብቲ ዝመረጽካዮ ናይ መጠንቀቕታ ዋጋ $${threshold.toLocaleString()} ዶላር ደይቡ ኣሎ።`;

      return {
        isTriggered: true,
        title: lang === 'ti' ? title_ti : title_en,
        body: lang === 'ti' ? body_ti : body_en,
        title_en,
        body_en,
        title_ti,
        body_ti,
        dedupKey: `price_above_${alert.id}_${dateStr}`,
      };
    }
  }

  if (alert.type === 'price_change_pct' || alert.condition === 'drop_pct') {
    const change24h = market.price_change_percentage_24h ?? 0;
    const dropTarget = Math.abs(threshold);
    if (change24h <= -dropTarget) {
      const pctFormatted = Math.abs(change24h).toFixed(2);
      const title_en = 'Bitcoin 24-Hour Price Drop Alert ⚡';
      const body_en = `Bitcoin has dropped ${pctFormatted}% in the last 24 hours (Current: $${btcPrice.toLocaleString()} USD). Good time to review your DCA plan!`;
      const title_ti = 'ናይ 24 ሰዓት ቢትኮይን ዋጋ ምውራድ መጠንቀቕታ ⚡';
      const body_ti = `ቢትኮይን ኣብ ዝሓለፈ 24 ሰዓታት ብ ${pctFormatted}% ወሪዱ ኣሎ (ናይ ሕጂ ዋጋ: $${btcPrice.toLocaleString()} ዶላር)። ናይ DCA መደብካ ንምምርማር ጽቡቕ ግዜ እዩ!`;

      return {
        isTriggered: true,
        title: lang === 'ti' ? title_ti : title_en,
        body: lang === 'ti' ? body_ti : body_en,
        title_en,
        body_en,
        title_ti,
        body_ti,
        dedupKey: `drop_pct_${alert.id}_${dateStr}`,
      };
    }
  }

  return null;
}

/**
 * Returns enriched content for contribution reminder:
 * - Scheduled frequency and target amount (USD & Sats)
 * - Current Bitcoin spot price and sats-per-dollar purchasing power
 * - Total sats accumulated so far (motivation tracker)
 * - Discipline reminder to log today's purchase
 */
export async function getContributionReminderContent(
  alert: UserAlert,
  dedupKey: string,
  market?: MarketPriceSnapshot | null,
  lang: AlertLang = 'en',
  totalSatsAccumulated?: number
): Promise<AlertTriggerContent> {
  const isTi = lang === 'ti';
  const freq = alert.schedule_frequency || 'scheduled';
  const freqMapTi: Record<string, string> = {
    daily: 'መዓልታዊ',
    weekly: 'ሰሙናዊ',
    biweekly: 'ናይ ክልተ ሰሙን',
    monthly: 'ወርሓዊ',
  };
  const freqTi = freqMapTi[freq] || 'ስሩዕ';

  // Amount & sats calculation
  const amountUsd = alert.threshold_value ? Number(alert.threshold_value) : null;
  const btcPrice = market?.current_price ?? null;
  const satsPerDollar = btcPrice && btcPrice > 0 ? Math.round(100_000_000 / btcPrice) : null;
  const amountSats =
    amountUsd && btcPrice && btcPrice > 0
      ? Math.round((amountUsd / btcPrice) * 100_000_000)
      : null;

  // Total sats accumulated so far
  let totalSats = totalSatsAccumulated;
  if (totalSats === undefined && alert.user_id) {
    try {
      const { data: purchases } = await supabaseAdmin
        .from('dca_purchases')
        .select('satoshis')
        .eq('user_id', alert.user_id);
      totalSats = (purchases || []).reduce(
        (acc: number, p: { satoshis?: number | string | null }) => acc + (Number(p.satoshis) || 0),
        0
      );
    } catch {
      totalSats = 0;
    }
  }

  // --- English text generation ---
  const title_en = 'DCA Contribution Reminder ⏰';
  let body_en = amountUsd
    ? `Your scheduled $${amountUsd.toLocaleString()} ${freq} Bitcoin contribution${amountSats ? ` (~${amountSats.toLocaleString()} sats)` : ''} is due today.`
    : `Your scheduled Bitcoin contribution (${freq}) is due today.`;

  if (btcPrice) {
    body_en += ` Current BTC: $${btcPrice.toLocaleString()} USD${satsPerDollar ? ` (~${satsPerDollar.toLocaleString()} sats/$1)` : ''}.`;
  }
  if (totalSats && totalSats > 0) {
    body_en += ` You've stacked ${totalSats.toLocaleString()} sats to date!`;
  }
  body_en += ` Stay disciplined and log today's purchase to keep your streak going!`;

  // --- Tigrinya text generation ---
  const title_ti = 'ናይ DCA ምዕቃብ መዘኻኸሪ ⏰';
  let body_ti = amountUsd
    ? `ናይ $${amountUsd.toLocaleString()} ${freqTi} ናይ ቢትኮይን ምዕቃብካ${amountSats ? ` (~${amountSats.toLocaleString()} ሳትስ)` : ''} ሎሚ ዝፍጸመሉ ዕለት እዩ።`
    : `ናይ ቢትኮይን ስሩዕ ምዕቃብካ (${freqTi}) ሎሚ ዝፍጸመሉ ዕለት እዩ።`;

  if (btcPrice) {
    body_ti += ` ናይ ሕጂ ዋጋ ቢትኮይን: $${btcPrice.toLocaleString()} ዶላር${satsPerDollar ? ` (ብ $1 ~${satsPerDollar.toLocaleString()} ሳትስ)` : ''}።`;
  }
  if (totalSats && totalSats > 0) {
    body_ti += ` ክሳብ ሕጂ ${totalSats.toLocaleString()} ሳትስ ኣኪብካ ኣለኻ!`;
  }
  body_ti += ` ሳትስ ኣብ ምእካብ ጽኑዕ ኩን፣ ናይ ሎሚ ግዝኢትካ ድማ ምዝገብ!`;

  return {
    title: isTi ? title_ti : title_en,
    body: isTi ? body_ti : body_en,
    title_en,
    body_en,
    title_ti,
    body_ti,
    dedupKey,
  };
}

/**
 * Checks for missed scheduled contributions
 */
export async function evaluateMissedContribution(
  alert: UserAlert,
  lang: AlertLang = 'en'
): Promise<({ isMissed: boolean } & AlertTriggerContent) | null> {
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
    const title_en = 'Missed DCA Contribution Reminder ⚠️';
    const body_en = `You have an active DCA plan, but no contribution was recorded in the past ${graceDays} days grace period. Make sure to log your purchase or adjust your plan schedule!`;
    const title_ti = 'ዝተረፈ ናይ DCA ምዕቃብ መዘኻኸሪ ⚠️';
    const body_ti = `ንጡፍ ናይ DCA መደብ ኣለካ፣ ግን ኣብ ዝሓለፉ ${graceDays} መዓልታት ዝኾነ ምዕቃብ ኣይተመዝገበን። ግዝኢትካ ምዝገብ ወይ ናይ መደብካ ግዜ ኣዐሪ!`;

    return {
      isMissed: true,
      title: lang === 'ti' ? title_ti : title_en,
      body: lang === 'ti' ? body_ti : body_en,
      title_en,
      body_en,
      title_ti,
      body_ti,
      dedupKey: `missed_${alert.id}_${cycleStr}`,
    };
  }

  return null;
}

/**
 * Checks goal milestones (25%, 50%, 75%, 100%, or target BTC)
 */
export async function evaluateGoalMilestone(
  alert: UserAlert,
  lang: AlertLang = 'en'
): Promise<({ isReached: boolean } & AlertTriggerContent) | null> {
  if (!alert.user_id) return null;

  // Calculate user's total sats accumulated
  const { data: purchases } = await supabaseAdmin
    .from('dca_purchases')
    .select('satoshis')
    .eq('user_id', alert.user_id);

  const totalSats = (purchases || []).reduce((acc: number, p: any) => acc + (Number(p.satoshis) || 0), 0);
  const targetThreshold = Number(alert.threshold_value) || 0;

  if (totalSats >= targetThreshold && targetThreshold > 0) {
    const btcAmount = (totalSats / 100_000_000).toFixed(4);
    const dedupKey = `milestone_${alert.id}_${targetThreshold}`;
    const targetLabelEn = targetThreshold >= 1000 ? (targetThreshold / 100_000_000).toFixed(4) + ' BTC' : targetThreshold + '%';
    const targetLabelTi = targetThreshold >= 1000 ? (targetThreshold / 100_000_000).toFixed(4) + ' ቢትኮይን' : targetThreshold + '%';

    const title_en = 'DCA Goal Milestone Reached! 🎉';
    const body_en = `Congratulations! You have accumulated ${btcAmount} BTC (${totalSats.toLocaleString()} sats), hitting your milestone target of ${targetLabelEn}.`;
    const title_ti = 'ናይ DCA ዕላማ ደረጃ በጺሕካ! 🎉';
    const body_ti = `እንቋዕ ሓጎሰካ! ${btcAmount} ቢትኮይን (${totalSats.toLocaleString()} sats) ኣኪብካ፣ ናይ ዕላማኻ ደረጃ ${targetLabelTi} በጺሕካ ኣለኻ።`;

    return {
      isReached: true,
      title: lang === 'ti' ? title_ti : title_en,
      body: lang === 'ti' ? body_ti : body_en,
      title_en,
      body_en,
      title_ti,
      body_ti,
      dedupKey,
    };
  }

  return null;
}
