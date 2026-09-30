import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Clock, Calendar, FileText, Briefcase, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export default function SeekerNotifications() {
  const { notifications, markNotificationRead } = usePlatform();
  const navigate = useNavigate();
  const seekerNotifs = notifications.filter(n => n.role === 'seeker' || n.role === 'all');

  const getIcon = (type) => {
    switch (type) {
      case 'interview': return <Calendar className="w-5 h-5 text-emerald-500" />;
      case 'task': return <FileText className="w-5 h-5 text-brand-accent" />;
      case 'application': return <Briefcase className="w-5 h-5 text-amber-500" />;
      default: return <Sparkles className="w-5 h-5 text-brand-teal" />;
    }
  };

  const handleClick = (n) => {
    markNotificationRead(n.id);
    if (n.link) {
      navigate(n.link);
      return;
    }
    if (n.type === 'task') navigate('/seeker/tasks');
    else if (n.type === 'interview') navigate('/seeker/interviews');
    else if (n.type === 'application') navigate('/seeker/applications');
    else navigate('/seeker/dashboard');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-brand-navy text-white rounded-3xl p-8 border border-white/10 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold text-brand-teal uppercase tracking-widest flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5" />
            Alert Timeline
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Notifications</h1>
          <p className="text-xs text-slate-300">Stay updated on application progress, task assignments, and interview schedules.</p>
        </div>

        <div className="text-right">
          <span className="text-3xl font-black text-brand-accent">{seekerNotifs.filter(n=>!n.read).length}</span>
          <span className="text-xs text-slate-400 block font-semibold">Unread Alerts</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-brand-navy">All Activity Notifications</h3>
          <span className="text-xs text-slate-400 font-semibold">Click any notification to open relevant page</span>
        </div>

        {seekerNotifs.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No notifications available yet.
          </div>
        ) : (
          <div className="space-y-3">
            {seekerNotifs.map((n) => (
              <div
                key={n.id}
                onClick={() => handleClick(n)}
                className={`p-5 rounded-2xl cursor-pointer transition-all flex items-start gap-4 border group hover:border-brand-accent/40 hover:shadow-sm ${
                  !n.read ? 'bg-blue-50/70 border-blue-200' : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                  {getIcon(n.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-brand-navy group-hover:text-brand-accent transition-colors flex items-center gap-2">
                      <span>{n.title}</span>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-brand-accent inline-block"></span>
                      )}
                    </h4>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 shrink-0">
                      <Clock className="w-3 h-3" /> {n.time}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-brand-accent font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>View assessment / schedule details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
