import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCircle, Clock, X, Sparkles, Briefcase, Calendar, FileText, CreditCard, ArrowRight } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export default function NotificationDrawer({ activeRole = 'seeker' }) {
  const { notifications, markNotificationRead } = usePlatform();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

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

  const handleNotificationClick = (n) => {
    markNotificationRead(n.id);
    setIsOpen(false);

    if (n.link) {
      navigate(n.link);
      return;
    }

    // Role & Type intelligent fallback route
    if (activeRole === 'seeker') {
      if (n.type === 'task') navigate('/seeker/tasks');
      else if (n.type === 'interview') navigate('/seeker/interviews');
      else if (n.type === 'application') navigate('/seeker/applications');
      else navigate('/seeker/dashboard');
    } else if (activeRole === 'recruiter' || activeRole === 'company') {
      if (n.type === 'task') navigate('/recruiter/tasks');
      else if (n.type === 'interview') navigate('/recruiter/interviews');
      else if (n.type === 'application') navigate('/recruiter/applicants');
      else if (n.type === 'payment') navigate('/recruiter/payments');
      else if (n.type === 'boost') navigate('/recruiter/boosted');
      else navigate('/recruiter/dashboard');
    } else if (activeRole === 'admin') {
      if (n.type === 'payment') navigate('/admin/payments');
      else navigate('/admin/dashboard');
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-2xl bg-gradient-to-tr from-brand-accent via-blue-600 to-brand-teal text-white hover:shadow-lg hover:shadow-brand-accent/30 hover:scale-105 active:scale-95 transition-all shadow-md shadow-brand-accent/20 border border-white/20 flex items-center justify-center group cursor-pointer"
        title="Notifications Center"
      >
        <Bell className="w-4.5 h-4.5 text-white group-hover:rotate-12 transition-transform drop-shadow" />
        {unreadCount > 0 ? (
          <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-rose-500 text-white font-black text-[10px] flex items-center justify-center border-2 border-white shadow-md animate-bounce">
            {unreadCount}
          </span>
        ) : (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-200"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-3xl bg-white border border-slate-200 shadow-2xl z-50 overflow-hidden text-slate-800 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="p-4 bg-brand-navy text-white flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-brand-accent to-brand-teal text-white flex items-center justify-center shadow-sm">
                <Bell className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Notifications Center</h4>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
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
                  onClick={() => handleNotificationClick(n)}
                  className={`p-4 transition-colors cursor-pointer flex items-start gap-3 hover:bg-slate-100/80 group ${
                    !n.read ? 'bg-blue-50/70 font-semibold' : 'bg-white text-slate-600'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-brand-navy dark:text-white truncate group-hover:text-brand-accent transition-colors flex items-center gap-1">
                        <span>{n.title}</span>
                      </h5>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 shrink-0">
                        <Clock className="w-3 h-3" /> {n.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed line-clamp-2">
                      {n.message}
                    </p>
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-brand-accent font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Click to view details</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 bg-slate-50 dark:bg-brand-navyDark text-center border-t border-slate-100 dark:border-slate-800 flex items-center justify-between px-4">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              {unreadCount} Unread Alerts
            </span>
            <span className="text-[10px] text-brand-accent font-semibold">
              Click any notification to navigate
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
