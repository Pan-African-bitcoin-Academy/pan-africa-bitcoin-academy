'use client';

import { useState, useEffect } from 'react';
import {
  Bell,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  X,
  RefreshCw,
  Settings,
  Mail,
  Globe,
  MonitorSmartphone,
} from 'lucide-react';
import type { UserAlert, AlertType } from '@/lib/dca/alertTypes';

interface SmartAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBtcPrice?: number;
}

type ModalTab = 'alerts' | 'settings';

export function SmartAlertsModal({ isOpen, onClose, currentBtcPrice = 85000 }: SmartAlertsModalProps) {
  const [alerts, setAlerts] = useState<UserAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modal tabs
  const [modalTab, setModalTab] = useState<ModalTab>('alerts');

  // New Alert Form state
  const [activeTab, setActiveTab] = useState<AlertType>('price_threshold');
  const [priceCondition, setPriceCondition] = useState<'below' | 'above'>('below');
  const [priceTarget, setPriceTarget] = useState<number>(currentBtcPrice ? Math.round(currentBtcPrice * 0.95) : 80000);
  const [dropPctTarget, setDropPctTarget] = useState<number>(5);
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'biweekly' | 'monthly'>('weekly');
  const [scheduleTime, setScheduleTime] = useState('09:00');
  const [milestoneTarget, setMilestoneTarget] = useState<number>(1000000);
  const [cooldownHours, setCooldownHours] = useState(24);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Settings state
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ti'>('en');
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushPermission, setPushPermission] = useState<NotificationPermission>('default');

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

  const fetchSettings = async () => {
    try {
      setSettingsLoading(true);
      const res = await fetch('/api/dca/notifications/preferences');
      if (res.ok) {
        const data = await res.json();
        setEmailEnabled(data.preferences?.email_enabled !== false);
        setLanguage(data.language === 'ti' ? 'ti' : 'en');
      }
    } catch {
      // ignore
    } finally {
      setSettingsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAlerts();
      fetchSettings();
      // Check browser push permission state
      if (typeof window !== 'undefined' && 'Notification' in window) {
        setPushPermission(Notification.permission);
        setPushEnabled(
          Notification.permission === 'granted' &&
            localStorage.getItem('pba-push-enabled') === 'true'
        );
      }
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
        payload = { ...payload, condition: priceCondition, threshold_value: priceTarget, currency: 'USD' };
      } else if (activeTab === 'price_change_pct') {
        payload = { ...payload, condition: 'drop_pct', threshold_value: dropPctTarget };
      } else if (activeTab === 'contribution_reminder') {
        payload = { ...payload, condition: 'scheduled_time', schedule_frequency: frequency, schedule_time: scheduleTime };
      } else if (activeTab === 'missed_contribution') {
        payload = { ...payload, condition: 'missed_grace', grace_period_days: 2 };
      } else if (activeTab === 'goal_milestone') {
        payload = { ...payload, condition: 'milestone_reached', threshold_value: milestoneTarget };
      }

      const res = await fetch('/api/dca/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create alert.');

      setSuccessMessage('Smart alert created successfully!');
      setAlerts((prev) => [data.alert, ...prev]);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Error creating alert.');
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
      if (res.ok) setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, is_enabled: !currentStatus } : a)));
    } catch { /* ignore */ }
  };

  const handleDeleteAlert = async (id: string) => {
    try {
      const res = await fetch(`/api/dca/alerts/${id}`, { method: 'DELETE' });
      if (res.ok) setAlerts((prev) => prev.filter((a) => a.id !== id));
    } catch { /* ignore */ }
  };

  const handleSaveSettings = async () => {
    setSettingsSaved(false);
    try {
      await fetch('/api/dca/notifications/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email_enabled: emailEnabled, language }),
      });
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 3000);
    } catch { /* ignore */ }
  };

  const handleTogglePush = async () => {
    if (!('Notification' in window)) return;

    if (pushEnabled) {
      // Disable push
      localStorage.removeItem('pba-push-enabled');
      setPushEnabled(false);
      return;
    }

    // Request permission if not already granted
    if (Notification.permission !== 'granted') {
      const perm = await Notification.requestPermission();
      setPushPermission(perm);
      if (perm !== 'granted') return;
    }

    localStorage.setItem('pba-push-enabled', 'true');
    setPushEnabled(true);

    // Show a test notification
    new Notification(
      language === 'ti' ? 'ናይ ብሮውዘር መጠንቀቕታ ንጡፍ ኮይኑ ✅' : 'Browser notifications enabled ✅',
      {
        body:
          language === 'ti'
            ? 'ናይ ቢትኮይን DCA መጠንቀቕታታት ኣብዚ ኣቢሉ ክዉሃቡ እዮም።'
            : "You'll now receive Bitcoin DCA alerts in your browser.",
        icon: '/favicon.ico',
      }
    );
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center p-4 pt-20 bg-zinc-900/60 backdrop-blur-xs"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-xl rounded-2xl border border-zinc-200 bg-white shadow-2xl text-zinc-900 overflow-hidden flex flex-col max-h-[calc(100vh-5.5rem)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 p-5 pb-0">
          <div className="flex items-center gap-2.5 pb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-[#f97602] border border-orange-200/60">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900">Smart Alerts &amp; Reminders</h2>
              <p className="text-xs text-zinc-500">Automated price triggers, schedules &amp; milestone monitors</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="mb-4 rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex border-b border-zinc-100 px-5">
          <button
            type="button"
            onClick={() => setModalTab('alerts')}
            className={`flex items-center gap-1.5 px-1 pb-2.5 text-xs font-semibold border-b-2 transition mr-5 cursor-pointer ${
              modalTab === 'alerts'
                ? 'border-[#f97602] text-[#f97602]'
                : 'border-transparent text-zinc-400 hover:text-zinc-600'
            }`}
          >
            <Bell className="h-3.5 w-3.5" />
            Alerts
          </button>
          <button
            type="button"
            onClick={() => setModalTab('settings')}
            className={`flex items-center gap-1.5 px-1 pb-2.5 text-xs font-semibold border-b-2 transition cursor-pointer ${
              modalTab === 'settings'
                ? 'border-[#f97602] text-[#f97602]'
                : 'border-transparent text-zinc-400 hover:text-zinc-600'
            }`}
          >
            <Settings className="h-3.5 w-3.5" />
            Settings
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-5 space-y-6">
          {/* ─── ALERTS TAB ─── */}
          {modalTab === 'alerts' && (
            <>
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
                  {(['price_threshold', 'price_change_pct', 'contribution_reminder', 'goal_milestone'] as AlertType[]).map(
                    (tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={`py-2 px-2.5 rounded-lg font-medium text-center transition cursor-pointer ${
                          activeTab === tab
                            ? 'bg-white shadow-xs text-[#f97602] border border-zinc-200/80 font-semibold'
                            : 'text-zinc-600 hover:bg-zinc-100'
                        }`}
                      >
                        {tab === 'price_threshold' && 'Price Target'}
                        {tab === 'price_change_pct' && '24h Drop %'}
                        {tab === 'contribution_reminder' && 'Reminder'}
                        {tab === 'goal_milestone' && 'Milestones'}
                      </button>
                    )
                  )}
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
                        onChange={(e) => setFrequency(e.target.value as typeof frequency)}
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

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Cooldown (hours)</label>
                  <input
                    type="number"
                    min="1"
                    max="168"
                    value={cooldownHours}
                    onChange={(e) => setCooldownHours(Number(e.target.value))}
                    className="w-full rounded-xl border border-zinc-300 bg-white p-2.5 text-xs text-zinc-900"
                  />
                </div>

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

                {loading ? (
                  <p className="text-xs text-zinc-400 py-3 text-center">Loading alerts…</p>
                ) : alerts.length === 0 ? (
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
            </>
          )}

          {/* ─── SETTINGS TAB ─── */}
          {modalTab === 'settings' && (
            <div className="space-y-5">
              <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider block">
                Alert Preferences
              </span>

              {settingsLoading ? (
                <p className="text-xs text-zinc-400 py-4 text-center">Loading settings…</p>
              ) : (
                <>
                  {/* Language */}
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-zinc-700">
                      <Globe className="h-4 w-4 text-[#f97602]" />
                      Alert Language
                    </div>
                    <p className="text-[11px] text-zinc-500">
                      Emails and in-app alert text will be sent in your selected language.
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setLanguage('en')}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                          language === 'en'
                            ? 'bg-[#f97602] text-white border-[#f97602]'
                            : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300'
                        }`}
                      >
                        🇬🇧 English
                      </button>
                      <button
                        type="button"
                        onClick={() => setLanguage('ti')}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                          language === 'ti'
                            ? 'bg-[#f97602] text-white border-[#f97602]'
                            : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300'
                        }`}
                      >
                        🇪🇷 ትግርኛ (Tigrinya)
                      </button>
                    </div>
                  </div>

                  {/* Email Notifications */}
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-[#f97602]" />
                        <div>
                          <p className="text-xs font-semibold text-zinc-700">Email Notifications</p>
                          <p className="text-[11px] text-zinc-500">Receive alerts via email</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEmailEnabled((v) => !v)}
                        className={`relative w-10 h-5.5 rounded-full transition-colors cursor-pointer ${
                          emailEnabled ? 'bg-[#f97602]' : 'bg-zinc-300'
                        }`}
                        role="switch"
                        aria-checked={emailEnabled}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-white shadow transition-transform ${
                            emailEnabled ? 'translate-x-4.5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Browser Push Notifications */}
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MonitorSmartphone className="h-4 w-4 text-[#f97602]" />
                        <div>
                          <p className="text-xs font-semibold text-zinc-700">Browser Notifications</p>
                          <p className="text-[11px] text-zinc-500">
                            {pushPermission === 'denied'
                              ? 'Blocked in browser settings — please allow in your browser.'
                              : 'Show alerts as browser pop-ups when visiting the site'}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleTogglePush}
                        disabled={pushPermission === 'denied' || !('Notification' in (typeof window !== 'undefined' ? window : {}))}
                        className={`relative w-10 h-5.5 rounded-full transition-colors cursor-pointer disabled:opacity-40 ${
                          pushEnabled ? 'bg-[#f97602]' : 'bg-zinc-300'
                        }`}
                        role="switch"
                        aria-checked={pushEnabled}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-white shadow transition-transform ${
                            pushEnabled ? 'translate-x-4.5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Save Button */}
                  <button
                    type="button"
                    onClick={handleSaveSettings}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#f97602] py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#d46200] transition cursor-pointer"
                  >
                    {settingsSaved ? (
                      <>
                        <Check className="h-4 w-4" />
                        {language === 'ti' ? 'ተሓዚሉ!' : 'Saved!'}
                      </>
                    ) : (
                      language === 'ti' ? 'ቅንጅታት ሓዝ' : 'Save Settings'
                    )}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
