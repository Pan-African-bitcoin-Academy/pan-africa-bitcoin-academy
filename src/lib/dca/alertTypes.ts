export type AlertType =
  | 'contribution_reminder'
  | 'price_threshold'
  | 'price_change_pct'
  | 'missed_contribution'
  | 'goal_milestone';

export type AlertCondition =
  | 'above'
  | 'below'
  | 'drop_pct'
  | 'scheduled_time'
  | 'missed_grace'
  | 'milestone_reached';

export interface UserAlert {
  id: string;
  user_id?: string | null;
  account_id?: string | null;
  type: AlertType;
  condition: AlertCondition;
  threshold_value?: number | null;
  currency: string;
  schedule_frequency?: 'daily' | 'weekly' | 'biweekly' | 'monthly' | null;
  schedule_day_of_week?: number | null;
  schedule_day_of_month?: number | null;
  schedule_time?: string | null;
  grace_period_days?: number;
  cooldown_hours: number;
  is_one_time: boolean;
  is_enabled: boolean;
  last_triggered_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationPreference {
  id: string;
  user_id?: string | null;
  account_id?: string | null;
  timezone: string;
  in_app_enabled: boolean;
  email_enabled: boolean;
  email_address?: string | null;
  created_at: string;
  updated_at: string;
}

export interface SmartNotification {
  id: string;
  user_id?: string | null;
  account_id?: string | null;
  alert_id?: string | null;
  type: AlertType;
  title: string;
  body: string;
  data: Record<string, unknown>;
  is_read: boolean;
  read_at?: string | null;
  delivery_channel: string[];
  email_sent: boolean;
  created_at: string;
}
