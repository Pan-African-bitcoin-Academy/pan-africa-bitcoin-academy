import { timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import {
  fetchCurrentBtcPrice,
  evaluatePriceAlert,
  isContributionReminderDue,
  evaluateMissedContribution,
  evaluateGoalMilestone,
} from '@/lib/dca/alertEngine';
import type { UserAlert, NotificationPreference } from '@/lib/dca/alertTypes';

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

    // 4. Process each alert
    for (const alert of alerts as UserAlert[]) {
      const userPref = alert.user_id ? prefMap.get(alert.user_id) : undefined;
      const timezone = userPref?.timezone || 'UTC';

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

        // Create the user notification
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
          email_sent: false,
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
