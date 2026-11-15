-- 20261116000000_dca_smart_alerts.sql
-- DCA Smart Alerts & Notification System

-- 1. Table: user_alerts
CREATE TABLE IF NOT EXISTS public.user_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  account_id TEXT, -- For cryptographic key accounts (e.g. pba_acc_...)
  type TEXT NOT NULL CHECK (type IN (
    'contribution_reminder',
    'price_threshold',
    'price_change_pct',
    'missed_contribution',
    'goal_milestone'
  )),
  condition TEXT NOT NULL CHECK (condition IN (
    'above',
    'below',
    'drop_pct',
    'scheduled_time',
    'missed_grace',
    'milestone_reached'
  )),
  threshold_value NUMERIC, -- Price in USD, milestone percentage (25, 50, etc.), or drop percentage
  currency TEXT NOT NULL DEFAULT 'USD',
  schedule_frequency TEXT CHECK (schedule_frequency IN ('daily', 'weekly', 'biweekly', 'monthly')),
  schedule_day_of_week INT CHECK (schedule_day_of_week BETWEEN 0 AND 6), -- 0=Sunday
  schedule_day_of_month INT CHECK (schedule_day_of_month BETWEEN 1 AND 31),
  schedule_time TEXT DEFAULT '09:00', -- 'HH:MM' 24h
  grace_period_days INT DEFAULT 2,
  cooldown_hours INT DEFAULT 24,
  is_one_time BOOLEAN NOT NULL DEFAULT false,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  last_triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Table: notification_preferences
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  account_id TEXT,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  in_app_enabled BOOLEAN NOT NULL DEFAULT true,
  email_enabled BOOLEAN NOT NULL DEFAULT true,
  email_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_notification_pref_user UNIQUE NULLS NOT DISTINCT (user_id, account_id)
);

-- 3. Table: notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  account_id TEXT,
  alert_id UUID REFERENCES public.user_alerts(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB DEFAULT '{}'::jsonb,
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMPTZ,
  delivery_channel TEXT[] NOT NULL DEFAULT ARRAY['in_app']::TEXT[],
  email_sent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Table: alert_events (Deduplication log)
CREATE TABLE IF NOT EXISTS public.alert_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id UUID NOT NULL REFERENCES public.user_alerts(id) ON DELETE CASCADE,
  dedup_key TEXT NOT NULL UNIQUE,
  trigger_context JSONB DEFAULT '{}'::jsonb,
  triggered_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_alerts_user ON public.user_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_alerts_account ON public.user_alerts(account_id);
CREATE INDEX IF NOT EXISTS idx_user_alerts_enabled ON public.user_alerts(is_enabled, type);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications(user_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_account_read ON public.notifications(account_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alert_events_dedup ON public.alert_events(dedup_key);

-- Row Level Security (RLS)
ALTER TABLE public.user_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_events ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (cron & backend)
CREATE POLICY "Service role full access on user_alerts" ON public.user_alerts FOR ALL USING (true);
CREATE POLICY "Service role full access on notification_preferences" ON public.notification_preferences FOR ALL USING (true);
CREATE POLICY "Service role full access on notifications" ON public.notifications FOR ALL USING (true);
CREATE POLICY "Service role full access on alert_events" ON public.alert_events FOR ALL USING (true);
