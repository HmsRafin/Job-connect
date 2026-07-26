import React from 'react';
import { 
  Calendar, Video, Clock, Globe, ExternalLink, 
  CheckCircle, Sparkles, Building 
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export default function ScheduledInterviews() {
  const { interviews } = usePlatform();

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-brand-navy text-white rounded-3xl p-8 border border-white/10 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold text-brand-teal uppercase tracking-widest flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Video Conference Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Scheduled Interviews</h1>
          <p className="text-xs text-slate-300">View upcoming interview dates, video join links, and employer notes.</p>
        </div>

        <div className="text-right">
          <span className="text-3xl font-black text-brand-accent">{interviews.length}</span>
          <span className="text-xs text-slate-400 block font-semibold">Scheduled Sessions</span>
        </div>
      </div>

      {/* Interviews Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
        <h3 className="text-lg font-bold text-brand-navy border-b border-slate-100 pb-4">Upcoming Interview Calendar</h3>

        {interviews.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No scheduled interviews.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {interviews.map((item) => (
              <div key={item.id} className="p-6 rounded-2xl border border-slate-200 hover:border-brand-accent/40 shadow-sm space-y-4 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-brand-accent flex items-center justify-center">
                      <Video className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.company}</span>
                      <h4 className="text-base font-bold text-brand-navy">{item.jobTitle}</h4>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                    {item.status}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold text-brand-navy">
                    <span className="flex items-center gap-1.5 text-brand-accent">
                      <Calendar className="w-4 h-4" /> Date: {item.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" /> Time: {item.time} ({item.timezone})
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-slate-500 font-semibold block mb-1">Meeting Platform: {item.platform}</span>
                    {item.notes && (
                      <p className="text-[11px] text-slate-600 italic">"{item.notes}"</p>
                    )}
                  </div>
                </div>

                <a
                  href={item.meetingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 rounded-xl bg-brand-accent hover:bg-brand-accentHover text-white font-bold text-xs shadow-md flex items-center justify-center gap-2"
                >
                  <Video className="w-4 h-4" />
                  <span>Join Video Meeting ({item.platform})</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
