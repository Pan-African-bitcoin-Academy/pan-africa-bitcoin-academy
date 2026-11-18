/**
 * POST /api/dca/alerts/check
 *
 * Client-triggered alert evaluation for the authenticated user.
 * Called from the /dca page on load so alerts fire in real time
 * without requiring a paid cron schedule (Vercel free tier workaround).
 *
 * Rate-limited: at most one evaluation per user per 15 minutes.
 */
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { attachSessionRefresh, requireStudent } from '@/lib/session';
import { Resend } from 'resend';
import {
  fetchCurrentBtcPrice,
  evaluatePriceAlert,
  isContributionReminderDue,
  evaluateMissedContribution,
  evaluateGoalMilestone,
  getContributionReminderContent,
  isCooldownSatisfied,
  normalizeLang,
} from '@/lib/dca/alertEngine';
import type { AlertLang } from '@/lib/dca/alertEngine';
import type { UserAlert, NotificationPreference } from '@/lib/dca/alertTypes';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://panafricanbitcoin.com';
const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ||
  'Pan-African ₿itcoin Academy <noreply@panafricanbitcoin.com>';

/** Simple in-memory per-process rate limit: userId → last check timestamp */
const lastCheckMap = new Map<string, number>();
const CLIENT_THROTTLE_MS = 15 * 60 * 1000; // 15 minutes

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  try { return new Resend(key); } catch { return null; }
}

async function sendAlertEmail(
  to: string,
  title: string,
  body: string,
  lang?: AlertLang,
  alertType?: string
): Promise<boolean> {
  const resend = getResend();
  if (!resend) return false;
  const isTi = lang === 'ti';
  const isReminder = alertType === 'contribution_reminder';

  const headerText = isTi ? '⚡ ናይ ብልሒ መጠንቀቕታ' : '⚡ Smart Alert Triggered';
  const ctaText = isReminder
    ? isTi
      ? 'ሎሚ ዝገዛእካዮ ምዝገብ →'
      : "Log Today's Purchase →"
    : isTi
    ? 'ናይ DCA ዳሽቦርድካ ርአ →'
    : 'View Your DCA Dashboard →';
  const ctaUrl = isReminder ? `${SITE_URL}/dca?action=log` : `${SITE_URL}/dca`;
  const footerText = isTi
    ? 'ካብ ፓን-አፍሪካ ₿itcoin Academy ዝተፈጠረ ኣውቶማቲክ መጠንቀቕታ።'
    : 'Automated alert from Pan-African ₿itcoin Academy.';
  const manageText = isTi ? 'መጠንቀቕታታትካ ኣቀናብር' : 'Manage your alerts';

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;padding:20px;">
  <div style="background:linear-gradient(135deg,#f97316 0%,#06b6d4 100%);padding:28px;text-align:center;border-radius:10px 10px 0 0;">
    <h1 style="color:white;margin:0;font-size:22px;">${headerText}</h1>
  </div>
  <div style="background:#f9fafb;padding:28px;border-radius:0 0 10px 10px;border:1px solid #e5e7eb;">
    <h2 style="margin-top:0;color:#1f2937;">${title}</h2>
    <p style="font-size:15px;color:#374151;">${body}</p>
    <div style="text-align:center;margin:24px 0;">
      <a href="${ctaUrl}" style="display:inline-block;background:linear-gradient(135deg,#ea580c 0%,#0891b2 100%);color:#fff;padding:12px 28px;text-decoration:none;border-radius:8px;font-weight:600;font-size:15px;">
        ${ctaText}
      </a>
    </div>
    <p style="font-size:12px;color:#9ca3af;margin-top:24px;padding-top:16px;border-top:1px solid #e5e7eb;">
      ${footerText}
      <a href="${SITE_URL}/dca" style="color:#0891b2;">${manageText}</a>
    </p>
  </div>
</body>
</html>`;
  try {
    const { error } = await resend.emails.send({ from: FROM_EMAIL, to, subject: title, html });
    return !error;
  } catch { return false; }
}

export async function POST(request: NextRequest) {
  const session = requireStudent(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const userId = session.userId;

  // Server-side rate limit: skip if checked recently in this process
  const lastCheck = lastCheckMap.get(userId) ?? 0;
  if (Date.now() - lastCheck < CLIENT_THROTTLE_MS) {
    return NextResponse.json({ ok: true, skipped: true, reason: 'throttled' });
  }
  lastCheckMap.set(userId, Date.now());

  try {
    // 1. Fetch this user's enabled alerts
    const { data: alerts, error: alertsError } = await supabaseAdmin
      .from('user_alerts')
      .select('*')
      .eq('user_id', userId)
      .eq('is_enabled', true);

    if (alertsError || !alerts || alerts.length === 0) {
      const response = NextResponse.json({ ok: true, alertsChecked: 0, notificationsCreated: 0 });
      attachSessionRefresh(response, {
        userId: session.userId, email: session.email,
        userType: 'student', issuedAt: session.issuedAt, lastActive: Date.now(),
      });
      return response;
    }

    // 2. Fetch market price, notification preferences, and student language in parallel
    const [market, { data: prefRow }, { data: studentRow }] = await Promise.all([
      fetchCurrentBtcPrice(),
      supabaseAdmin
        .from('notification_preferences')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle(),
      supabaseAdmin
        .from('students')
        .select('preferred_language')
        .eq('id', userId)
        .maybeSingle(),
    ]);

    const userPref = prefRow as NotificationPreference | null;
    const timezone = userPref?.timezone || 'UTC';
    const emailEnabled = userPref ? userPref.email_enabled : true;
    const resolvedEmail = userPref?.email_address || session.email || null;
    const lang = normalizeLang(
      (studentRow as { preferred_language?: string } | null)?.preferred_language
    );

    let notificationsCreated = 0;
    let skippedDuplicates = 0;

    for (const alert of alerts as UserAlert[]) {
      if (!isCooldownSatisfied(alert)) continue;

      let triggerResult: { title: string; body: string; dedupKey: string } | null = null;

      if (alert.type === 'price_threshold' || alert.type === 'price_change_pct') {
        if (market) {
          const res = evaluatePriceAlert(alert, market, lang);
          if (res?.isTriggered) {
            triggerResult = { title: res.title, body: res.body, dedupKey: res.dedupKey };
          }
        }
      } else if (alert.type === 'contribution_reminder') {
        const res = isContributionReminderDue(alert, timezone);
        if (res.isDue) {
          const content = await getContributionReminderContent(alert, res.dedupKey, market, lang);
          triggerResult = { title: content.title, body: content.body, dedupKey: content.dedupKey };
        }
      } else if (alert.type === 'missed_contribution') {
        const res = await evaluateMissedContribution(alert, lang);
        if (res?.isMissed) {
          triggerResult = { title: res.title, body: res.body, dedupKey: res.dedupKey };
        }
      } else if (alert.type === 'goal_milestone') {
        const res = await evaluateGoalMilestone(alert, lang);
        if (res?.isReached) {
          triggerResult = { title: res.title, body: res.body, dedupKey: res.dedupKey };
        }
      }

      if (!triggerResult) continue;

      // Deduplicate via alert_events unique key
      const { error: dedupError } = await supabaseAdmin.from('alert_events').insert({
        alert_id: alert.id,
        dedup_key: triggerResult.dedupKey,
        trigger_context: {
          alertType: alert.type,
          threshold: alert.threshold_value,
          btcPrice: market?.current_price,
        },
      });

      if (dedupError) {
        skippedDuplicates++;
        continue;
      }

      // Send email
      let emailSent = false;
      if (emailEnabled && resolvedEmail) {
        emailSent = await sendAlertEmail(resolvedEmail, triggerResult.title, triggerResult.body, lang, alert.type);
      }

      // Write in-app notification
      await supabaseAdmin.from('notifications').insert({
        user_id: userId,
        account_id: alert.account_id,
        alert_id: alert.id,
        type: alert.type,
        title: triggerResult.title,
        body: triggerResult.body,
        data: {
          btcPrice: market?.current_price,
          threshold: alert.threshold_value,
          timestamp: new Date().toISOString(),
        },
        is_read: false,
        delivery_channel: emailEnabled ? ['in_app', 'email'] : ['in_app'],
        email_sent: emailSent,
      });

      // Mark last triggered (disable if one-time)
      await supabaseAdmin
        .from('user_alerts')
        .update({
          last_triggered_at: new Date().toISOString(),
          is_enabled: alert.is_one_time ? false : true,
        })
        .eq('id', alert.id);

      notificationsCreated++;
    }

    const response = NextResponse.json({
      ok: true,
      alertsChecked: alerts.length,
      notificationsCreated,
      skippedDuplicates,
    });
    attachSessionRefresh(response, {
      userId: session.userId, email: session.email,
      userType: 'student', issuedAt: session.issuedAt, lastActive: Date.now(),
    });
    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Alert check failed.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
