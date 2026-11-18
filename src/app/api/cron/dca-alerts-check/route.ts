import { timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { Resend } from 'resend';
import {
  fetchCurrentBtcPrice,
  evaluatePriceAlert,
  isContributionReminderDue,
  evaluateMissedContribution,
  evaluateGoalMilestone,
} from '@/lib/dca/alertEngine';
import type { UserAlert, NotificationPreference } from '@/lib/dca/alertTypes';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://panafricanbitcoin.com';
const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ||
  'Pan-African ₿itcoin Academy <noreply@panafricanbitcoin.com>';

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  try {
    return new Resend(key);
  } catch {
    return null;
  }
}

async function sendAlertEmail(opts: {
  to: string;
  title: string;
  body: string;
  alertType: string;
}): Promise<boolean> {
  const resend = getResend();
  if (!resend) return false;

  const { to, title, body } = opts;

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title}</title></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;padding:20px;">
  <div style="background:linear-gradient(135deg,#f97316 0%,#06b6d4 100%);padding:28px;text-align:center;border-radius:10px 10px 0 0;">
    <h1 style="color:white;margin:0;font-size:22px;">⚡ Smart Alert Triggered</h1>
  </div>
  <div style="background:#f9fafb;padding:28px;border-radius:0 0 10px 10px;border:1px solid #e5e7eb;">
    <h2 style="margin-top:0;color:#1f2937;">${title}</h2>
    <p style="font-size:15px;color:#374151;">${body}</p>
    <div style="text-align:center;margin:24px 0;">
      <a href="${SITE_URL}/dca" style="display:inline-block;background:linear-gradient(135deg,#ea580c 0%,#0891b2 100%);color:#ffffff;padding:12px 28px;text-decoration:none;border-radius:8px;font-weight:600;font-size:15px;">
        View Your DCA Dashboard →
      </a>
    </div>
    <p style="font-size:12px;color:#9ca3af;margin-top:24px;padding-top:16px;border-top:1px solid #e5e7eb;">
      Automated alert from Pan-African ₿itcoin Academy. 
      <a href="${SITE_URL}/dca" style="color:#0891b2;">Manage your alerts</a>
    </p>
  </div>
</body>
</html>`;

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: title,
      html,
    });
    return !error;
  } catch {
    return false;
  }
}

export const maxDuration = 300;

function isAuthorized(request: NextRequest, secret: string): boolean {
  const authorization = request.headers.get('authorization') ?? '';
  if (!authorization.startsWith('Bearer ')) return false;
  const supplied = Buffer.from(authorization.slice('Bearer '.length));
  const expected = Buffer.from(secret);
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'CRON_SECRET is not configured.' }, { status: 503 });
  }

  // Development bypass or valid Bearer token
  if (!isAuthorized(request, secret)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const startedAt = new Date();
  let alertsChecked = 0;
  let notificationsCreated = 0;
  let skippedDuplicates = 0;

  try {
    // 1. Fetch all enabled alerts
    const { data: alerts, error: alertsError } = await supabaseAdmin
      .from('user_alerts')
      .select('*')
      .eq('is_enabled', true);

    if (alertsError) {
      return NextResponse.json({ error: alertsError.message }, { status: 500 });
    }

    if (!alerts || alerts.length === 0) {
      return NextResponse.json({
        ok: true,
        message: 'No active alerts to evaluate.',
        alertsChecked: 0,
        notificationsCreated: 0,
      });
    }

    alertsChecked = alerts.length;

    // 2. Fetch current BTC market price
    const market = await fetchCurrentBtcPrice();

    // 3. Fetch notification preferences for active alert users
    const userIds = [...new Set(alerts.map((a: UserAlert) => a.user_id).filter(Boolean))];
    const { data: prefs } = await supabaseAdmin
      .from('notification_preferences')
      .select('*')
      .in('user_id', userIds);

    const prefMap = new Map<string, NotificationPreference>();
    (prefs || []).forEach((p: NotificationPreference) => {
      if (p.user_id) prefMap.set(p.user_id, p);
    });

    // Fallback: fetch email addresses from students table for users without notification_preferences rows
    const usersWithoutPrefs = userIds.filter((id) => id && !prefMap.has(id as string)) as string[];
    const emailFallbackMap = new Map<string, string>();
    if (usersWithoutPrefs.length > 0) {
      const { data: students } = await supabaseAdmin
        .from('students')
        .select('id, email')
        .in('id', usersWithoutPrefs);
      (students || []).forEach((s: { id: string; email: string }) => {
        if (s.id && s.email) emailFallbackMap.set(s.id, s.email);
      });
    }

    // 4. Process each alert
    for (const alert of alerts as UserAlert[]) {
      const userPref = alert.user_id ? prefMap.get(alert.user_id) : undefined;
      const timezone = userPref?.timezone || 'UTC';
      // Resolve best email address: preference row > fallback from students table
      const resolvedEmail =
        userPref?.email_address ||
        (alert.user_id ? emailFallbackMap.get(alert.user_id) : undefined) ||
        null;

      let triggerResult: { title: string; body: string; dedupKey: string } | null = null;

      if (alert.type === 'price_threshold' || alert.type === 'price_change_pct') {
        if (market) {
          const res = evaluatePriceAlert(alert, market);
          if (res?.isTriggered) {
            triggerResult = { title: res.title, body: res.body, dedupKey: res.dedupKey };
          }
        }
      } else if (alert.type === 'contribution_reminder') {
        const res = isContributionReminderDue(alert, timezone);
        if (res.isDue) {
          triggerResult = {
            title: 'DCA Contribution Reminder ⏰',
            body: `Your scheduled Bitcoin contribution (${alert.schedule_frequency || 'scheduled'}) is due today. Stay disciplined on your sats accumulation!`,
            dedupKey: res.dedupKey,
          };
        }
      } else if (alert.type === 'missed_contribution') {
        const res = await evaluateMissedContribution(alert);
        if (res?.isMissed) {
          triggerResult = { title: res.title, body: res.body, dedupKey: res.dedupKey };
        }
      } else if (alert.type === 'goal_milestone') {
        const res = await evaluateGoalMilestone(alert);
        if (res?.isReached) {
          triggerResult = { title: res.title, body: res.body, dedupKey: res.dedupKey };
        }
      }

      // If triggered, deduplicate and record notification
      if (triggerResult) {
        // Try inserting into alert_events for deduplication
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
          // Key already exists => duplicate trigger, skip
          skippedDuplicates++;
          continue;
        }

        // Send email if user has email notifications enabled (or no prefs yet, default to on)
        let emailSent = false;
        const emailEnabled = userPref ? userPref.email_enabled : true;
        if (emailEnabled && resolvedEmail) {
          emailSent = await sendAlertEmail({
            to: resolvedEmail,
            title: triggerResult.title,
            body: triggerResult.body,
            alertType: alert.type,
          });
        }

        // Create the in-app notification record
        await supabaseAdmin.from('notifications').insert({
          user_id: alert.user_id,
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
          delivery_channel: userPref?.email_enabled ? ['in_app', 'email'] : ['in_app'],
          email_sent: emailSent,
        });

        // Update alert last_triggered_at (and disable if is_one_time)
        await supabaseAdmin
          .from('user_alerts')
          .update({
            last_triggered_at: new Date().toISOString(),
            is_enabled: alert.is_one_time ? false : true,
          })
          .eq('id', alert.id);

        notificationsCreated++;
      }
    }

    return NextResponse.json({
      ok: true,
      durationMs: Date.now() - startedAt.getTime(),
      alertsChecked,
      notificationsCreated,
      skippedDuplicates,
      marketPrice: market?.current_price ?? null,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Alerts processing failed.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
