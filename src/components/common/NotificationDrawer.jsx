import React, { useState } from 'react';
import { Bell, CheckCircle, Clock, X, Sparkles, Briefcase, Calendar, FileText, CreditCard } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export default function NotificationDrawer({ activeRole = 'seeker' }) {
  const { notifications, markNotificationRead } = usePlatform();
  const [isOpen, setIsOpen] = useState(false);

  // Filter notifications for active role or public fallback
  const roleNotifs = notifications.filter(n => n.role === activeRole || n.role === 'all');
  const unreadCount = roleNotifs.filter(n => !n.read).length;

  const getIcon = (type) => {
    switch (type) {
      case 'interview': return <Calendar className="w-4 h-4 text-emerald-500" />;
      case 'task': return <FileText className="w-4 h-4 text-brand-accent" />;
      case 'payment': return <CreditCard className="w-4 h-4 text-purple-500" />;
      case 'application': return <Briefcase className="w-4 h-4 text-amber-500" />;
      default: return <Sparkles className="w-4 h-4 text-brand-teal" />;
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors border border-white/10"
        title="Notifications Center"
      >
        <Bell className="w-5 h-5 text-slate-300 dark:text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-black text-[9px] flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-white dark:bg-brand-navy border border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-hidden text-slate-800 dark:text-slate-100">
          <div className="p-4 bg-brand-navy dark:bg-brand-navyDark text-white flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-brand-teal" />
              <h4 className="text-xs font-bold uppercase tracking-wider">Notifications Center</h4>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {roleNotifs.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No new notifications for your role view.
              </div>
            ) : (
              roleNotifs.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markNotificationRead(n.id)}
                  className={`p-4 transition-colors cursor-pointer flex items-start gap-3 ${
                    !n.read ? 'bg-blue-50/50 dark:bg-white/5' : 'hover:bg-slate-50 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-brand-navy dark:text-white truncate">{n.title}</h5>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {n.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                      {n.message}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 bg-slate-50 dark:bg-brand-navyDark text-center border-t border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              {unreadCount} Unread Alerts
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
