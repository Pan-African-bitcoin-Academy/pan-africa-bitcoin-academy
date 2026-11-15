'use client';

import { useState, useEffect } from 'react';
import {
  Bell,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  Clock,
  TrendingDown,
  TrendingUp,
  Percent,
  Award,
  X,
  RefreshCw,
} from 'lucide-react';
import type { UserAlert, AlertType, AlertCondition } from '@/lib/dca/alertTypes';

interface SmartAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBtcPrice?: number;
}

export function SmartAlertsModal({ isOpen, onClose, currentBtcPrice = 85000 }: SmartAlertsModalProps) {
  const [alerts, setAlerts] = useState<UserAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // New Alert Form state
  const [activeTab, setActiveTab] = useState<AlertType>('price_threshold');
  const [priceCondition, setPriceCondition] = useState<'below' | 'above'>('below');
  const [priceTarget, setPriceTarget] = useState<number>(currentBtcPrice ? Math.round(currentBtcPrice * 0.95) : 80000);
  const [dropPctTarget, setDropPctTarget] = useState<number>(5);
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'biweekly' | 'monthly'>('weekly');
  const [scheduleTime, setScheduleTime] = useState('09:00');
  const [milestoneTarget, setMilestoneTarget] = useState<number>(1000000); // 1,000,000 sats (0.01 BTC)
  const [cooldownHours, setCooldownHours] = useState(24);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/dca/alerts');
      if (res.ok) {
        const data = await res.json();
        setAlerts(data.alerts || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAlerts();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      let payload: Record<string, unknown> = {
        type: activeTab,
        cooldown_hours: cooldownHours,
      };

      if (activeTab === 'price_threshold') {
        payload = {
          ...payload,
          condition: priceCondition,
          threshold_value: priceTarget,
          currency: 'USD',
        };
      } else if (activeTab === 'price_change_pct') {
        payload = {
          ...payload,
          condition: 'drop_pct',
          threshold_value: dropPctTarget,
        };
      } else if (activeTab === 'contribution_reminder') {
        payload = {
          ...payload,
          condition: 'scheduled_time',
          schedule_frequency: frequency,
          schedule_time: scheduleTime,
        };
      } else if (activeTab === 'missed_contribution') {
        payload = {
          ...payload,
          condition: 'missed_grace',
          grace_period_days: 2,
        };
      } else if (activeTab === 'goal_milestone') {
        payload = {
          ...payload,
          condition: 'milestone_reached',
          threshold_value: milestoneTarget,
        };
      }

      const res = await fetch('/api/dca/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create alert.');
      }

      setSuccessMessage('Smart alert created successfully!');
      setAlerts((prev) => [data.alert, ...prev]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error creating alert.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleAlert = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/dca/alerts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_enabled: !currentStatus }),
      });
      if (res.ok) {
        setAlerts((prev) =>
          prev.map((a) => (a.id === id ? { ...a, is_enabled: !currentStatus } : a))
        );
      }
    } catch {
      // ignore
    }
  };

  const handleDeleteAlert = async (id: string) => {
    try {
      const res = await fetch(`/api/dca/alerts/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setAlerts((prev) => prev.filter((a) => a.id !== id));
      }
    } catch {
      // ignore
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-xl rounded-2xl border border-zinc-200 bg-white shadow-2xl text-zinc-900 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 p-5 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-[#f97602] border border-orange-200/60">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900">Smart Alerts & Reminders</h2>
              <p className="text-xs text-zinc-500">Automated price triggers, schedules & milestone monitors</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-5 space-y-6">
          {errorMessage && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p>{errorMessage}</p>
            </div>
          )}
          {successMessage && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
              <Check className="h-4 w-4 shrink-0 text-emerald-600" />
              <p>{successMessage}</p>
            </div>
          )}

          {/* New Alert Form */}
          <form onSubmit={handleCreateAlert} className="space-y-4 rounded-xl border border-zinc-200 bg-zinc-50/70 p-4">
            <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider block">
              Create New Smart Alert
            </span>

            {/* Type Selector Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('price_threshold')}
                className={`py-2 px-2.5 rounded-lg font-medium text-center transition cursor-pointer ${
                  activeTab === 'price_threshold'
                    ? 'bg-white shadow-xs text-[#f97602] border border-zinc-200/80 font-semibold'
                    : 'text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                Price Target
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('price_change_pct')}
                className={`py-2 px-2.5 rounded-lg font-medium text-center transition cursor-pointer ${
                  activeTab === 'price_change_pct'
                    ? 'bg-white shadow-xs text-[#f97602] border border-zinc-200/80 font-semibold'
                    : 'text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                24h Drop %
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('contribution_reminder')}
                className={`py-2 px-2.5 rounded-lg font-medium text-center transition cursor-pointer ${
                  activeTab === 'contribution_reminder'
                    ? 'bg-white shadow-xs text-[#f97602] border border-zinc-200/80 font-semibold'
                    : 'text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                Reminder
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('goal_milestone')}
                className={`py-2 px-2.5 rounded-lg font-medium text-center transition cursor-pointer ${
                  activeTab === 'goal_milestone'
                    ? 'bg-white shadow-xs text-[#f97602] border border-zinc-200/80 font-semibold'
                    : 'text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                Milestones
              </button>
            </div>

            {/* Price Target Options */}
            {activeTab === 'price_threshold' && (
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Trigger Condition</label>
                  <select
                    value={priceCondition}
                    onChange={(e) => setPriceCondition(e.target.value as 'below' | 'above')}
                    className="w-full rounded-xl border border-zinc-300 bg-white p-2.5 text-xs text-zinc-900"
                  >
                    <option value="below">Falls below ($)</option>
                    <option value="above">Rises above ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Target Price (USD)</label>
                  <input
                    type="number"
                    value={priceTarget}
                    onChange={(e) => setPriceTarget(Number(e.target.value))}
                    className="w-full rounded-xl border border-zinc-300 bg-white p-2.5 text-xs text-zinc-900"
                  />
                </div>
              </div>
            )}

            {/* 24h Drop % Options */}
            {activeTab === 'price_change_pct' && (
              <div className="text-xs">
                <label className="block font-semibold text-zinc-700 mb-1">Alert when Bitcoin drops by (%) in 24 hours</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={dropPctTarget}
                  onChange={(e) => setDropPctTarget(Number(e.target.value))}
                  className="w-full rounded-xl border border-zinc-300 bg-white p-2.5 text-xs text-zinc-900"
                />
              </div>
            )}

            {/* Contribution Reminder Options */}
            {activeTab === 'contribution_reminder' && (
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Frequency</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as any)}
                    className="w-full rounded-xl border border-zinc-300 bg-white p-2.5 text-xs text-zinc-900"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Reminder Time</label>
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full rounded-xl border border-zinc-300 bg-white p-2.5 text-xs text-zinc-900"
                  />
                </div>
              </div>
            )}

            {/* Goal Milestone Options */}
            {activeTab === 'goal_milestone' && (
              <div className="text-xs">
                <label className="block font-semibold text-zinc-700 mb-1">Target Milestone in Satoshis</label>
                <input
                  type="number"
                  step="50000"
                  value={milestoneTarget}
                  onChange={(e) => setMilestoneTarget(Number(e.target.value))}
                  className="w-full rounded-xl border border-zinc-300 bg-white p-2.5 text-xs text-zinc-900"
                  placeholder="e.g. 1000000 sats (0.01 BTC)"
                />
                <span className="text-[11px] text-zinc-500 mt-1 block">
                  {(milestoneTarget / 100_000_000).toFixed(4)} BTC equivalent
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#f97602] py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#d46200] disabled:opacity-50 transition cursor-pointer"
            >
              {isSubmitting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Save Alert Rule
            </button>
          </form>

          {/* Active Alerts List */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider block">
              Active Smart Alerts ({alerts.length})
            </span>

            {alerts.length === 0 ? (
              <p className="text-xs text-zinc-400 py-3 text-center border border-dashed border-zinc-200 rounded-xl">
                No alert rules configured yet. Create one above to get started.
              </p>
            ) : (
              <div className="space-y-2">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 bg-white shadow-2xs text-xs"
                  >
                    <div>
                      <p className="font-semibold text-zinc-800 capitalize">
                        {alert.type.replace(/_/g, ' ')}
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        {alert.condition === 'below' && `Falls below $${alert.threshold_value?.toLocaleString()} USD`}
                        {alert.condition === 'above' && `Rises above $${alert.threshold_value?.toLocaleString()} USD`}
                        {alert.condition === 'drop_pct' && `Drops ${alert.threshold_value}% in 24h`}
                        {alert.type === 'contribution_reminder' && `${alert.schedule_frequency} at ${alert.schedule_time}`}
                        {alert.type === 'goal_milestone' && `Target ${alert.threshold_value?.toLocaleString()} sats`}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleAlert(alert.id, alert.is_enabled)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                          alert.is_enabled
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-zinc-100 text-zinc-500 border border-zinc-200'
                        }`}
                      >
                        {alert.is_enabled ? 'Active' : 'Paused'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteAlert(alert.id)}
                        className="p-1 text-zinc-400 hover:text-rose-600 transition cursor-pointer"
                        title="Delete alert"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
