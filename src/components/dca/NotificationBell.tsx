'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, Check, Clock, ExternalLink, X } from 'lucide-react';
import type { SmartNotification } from '@/lib/dca/alertTypes';

interface NotificationBellProps {
  onOpenSettings?: () => void;
}

export function NotificationBell({ onOpenSettings }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<SmartNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/dca/notifications?limit=20');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch {
      // offline / not signed in
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Poll every minute
    return () => clearInterval(interval);
  }, []);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleMarkAllRead = async () => {
    try {
      const res = await fetch('/api/dca/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true }),
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
        setUnreadCount(0);
      }
    } catch {
      // ignore
    }
  };

  const handleMarkSingleRead = async (id: string) => {
    try {
      await fetch('/api/dca/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: id }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // ignore
    }
  };

  return (
    <div className="relative inline-block" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200/80 bg-white text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 shadow-xs transition cursor-pointer"
        aria-label="Smart Notifications"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#f97602] px-1 text-[10px] font-bold text-white shadow-xs">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-x-3 top-20 sm:absolute sm:inset-x-auto sm:top-auto sm:right-0 mt-2 sm:w-96 rounded-2xl border border-zinc-200 bg-white shadow-2xl z-50 text-zinc-900 overflow-hidden flex flex-col max-h-[calc(100dvh-7rem)] sm:max-h-[480px] animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-100 p-3.5 bg-zinc-50/70">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider">
                Smart Alerts
              </span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-orange-100 text-[#f97602] text-[10px] font-semibold px-2 py-0.5">
                  {unreadCount} unread
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="text-[11px] font-medium text-[#f97602] hover:underline cursor-pointer"
                >
                  Mark all read
                </button>
              )}
              {onOpenSettings && (
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onOpenSettings();
                  }}
                  className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-200/60 hover:text-zinc-700 transition cursor-pointer"
                  title="Manage Alerts"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="overflow-y-auto divide-y divide-zinc-100">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-zinc-400">
                <Bell className="h-7 w-7 mx-auto mb-2 text-zinc-300 stroke-[1.5]" />
                No notifications yet.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => !n.is_read && handleMarkSingleRead(n.id)}
                  className={`p-3.5 transition cursor-pointer flex items-start gap-3 ${
                    n.is_read ? 'bg-white hover:bg-zinc-50' : 'bg-orange-50/30 hover:bg-orange-50/50'
                  }`}
                >
                  <div className="mt-0.5">
                    {n.is_read ? (
                      <Clock className="h-4 w-4 text-zinc-400" />
                    ) : (
                      <span className="flex h-2.5 w-2.5 rounded-full bg-[#f97602]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs ${n.is_read ? 'font-medium text-zinc-700' : 'font-bold text-zinc-900'}`}>
                      {n.title}
                    </p>
                    <p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed break-words">
                      {n.body}
                    </p>
                    {n.type === 'contribution_reminder' && (
                      <a
                        href="/dca?action=log"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsOpen(false);
                          if (!n.is_read) handleMarkSingleRead(n.id);
                        }}
                        className="inline-flex items-center gap-1 mt-2 px-2.5 py-1 rounded-lg bg-orange-50 text-[#f97602] border border-orange-200/80 text-[10px] font-semibold hover:bg-orange-100 transition"
                      >
                        {n.title.includes('ናይ') ? 'ሎሚ ዝገዛእካዮ ምዝገብ →' : "Log Today's Purchase →"}
                      </a>
                    )}
                    <span className="text-[10px] text-zinc-400 mt-1 block">
                      {new Date(n.created_at).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
