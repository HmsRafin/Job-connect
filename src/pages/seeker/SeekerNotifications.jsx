import React from 'react';
import { Bell, Clock, Calendar, FileText, Briefcase, CheckCircle } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export default function SeekerNotifications() {
  const { notifications, markNotificationRead } = usePlatform();
  const seekerNotifs = notifications.filter(n => n.role === 'seeker' || n.role === 'all');

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
        <h3 className="text-lg font-bold text-brand-navy border-b border-slate-100 pb-4">All Notifications</h3>

        <div className="divide-y divide-slate-100">
          {seekerNotifs.map((n) => (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={`p-4 rounded-2xl cursor-pointer transition-colors flex items-start gap-4 ${
                !n.read ? 'bg-blue-50/60' : 'hover:bg-slate-50'
              }`}
            >
              <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-brand-accent shrink-0 shadow-sm">
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-brand-navy">{n.title}</h4>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {n.time}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
