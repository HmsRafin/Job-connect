import React, { useState } from 'react';
import { 
  Calendar, Video, Clock, Globe, ExternalLink, 
  CheckCircle, Sparkles, Building, Check, MessageSquare, AlertCircle, X
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export default function ScheduledInterviews() {
  const { interviews, respondInterview } = usePlatform();
  const [rescheduleTargetId, setRescheduleTargetId] = useState(null);
  const [rescheduleNote, setRescheduleNote] = useState('');
  const [loadingId, setLoadingId] = useState(null);

  const handleConfirm = async (id) => {
    setLoadingId(id);
    try {
      await respondInterview(id, 'Confirmed', 'Candidate confirmed attendance for scheduled time.');
    } finally {
      setLoadingId(null);
    }
  };

  const handleRescheduleSubmit = async (e, id) => {
    e.preventDefault();
    if (!rescheduleNote.trim()) return;
    setLoadingId(id);
    try {
      await respondInterview(id, 'Reschedule Requested', rescheduleNote.trim());
      setRescheduleTargetId(null);
      setRescheduleNote('');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-brand-navy text-white rounded-3xl p-8 border border-white/10 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold text-brand-teal uppercase tracking-widest flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Candidate Video Conference Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Scheduled Interviews</h1>
          <p className="text-xs text-slate-300">View upcoming interview appointments, respond with confirmation or reschedule, and join video meeting rooms.</p>
        </div>

        <div className="text-right">
          <span className="text-3xl font-black text-brand-accent">{interviews.length}</span>
          <span className="text-xs text-slate-400 block font-semibold">Scheduled Sessions</span>
        </div>
      </div>

      {/* Interviews Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-brand-navy">Upcoming Interview Calendar ({interviews.length})</h3>
          <span className="text-xs text-slate-400 font-semibold">Real-time Cloud Sync</span>
        </div>

        {interviews.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400 space-y-3">
            <Calendar className="w-10 h-10 mx-auto text-slate-300" />
            <p className="font-semibold text-slate-600">No scheduled interviews at this time.</p>
            <p className="text-slate-400">When an employer shortlists you for an interview, the meeting invitation will appear here with full video conference links.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {interviews.map((item) => (
              <div key={item.id} className="p-6 rounded-2xl border border-slate-200 hover:border-brand-accent/40 shadow-sm space-y-4 transition-all bg-white flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-blue-50 text-brand-accent flex items-center justify-center font-bold">
                        <Video className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.company}</span>
                        <h4 className="text-base font-bold text-brand-navy">{item.jobTitle}</h4>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      item.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                      item.status === 'Reschedule Requested' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                      'bg-blue-50 text-brand-accent border border-blue-100'
                    }`}>
                      {item.status === 'Confirmed' ? '✓ Attendance Confirmed' : item.status}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                    <div className="flex items-center justify-between font-bold text-brand-navy">
                      <span className="flex items-center gap-1.5 text-brand-accent font-bold">
                        <Calendar className="w-4 h-4" /> Date: {item.date}
                      </span>
                      <span className="flex items-center gap-1.5 text-slate-700 font-bold">
                        <Clock className="w-4 h-4" /> Time: {item.time} ({item.timezone})
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-200">
                      <span className="text-slate-500 font-semibold block mb-1">Meeting Platform: {item.platform}</span>
                      {item.notes && (
                        <p className="text-[11px] text-slate-600 italic bg-white p-2.5 rounded-lg border border-slate-100">
                          <strong>Employer Instructions:</strong> "{item.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Reschedule Box if active */}
                  {rescheduleTargetId === item.id && (
                    <form onSubmit={(e) => handleRescheduleSubmit(e, item.id)} className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-xl space-y-2 animate-fade-in text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-rose-900">Request Time Reschedule:</span>
                        <button type="button" onClick={() => setRescheduleTargetId(null)} className="text-slate-400 hover:text-slate-700">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        required
                        placeholder="State your available time slots or reasons for reschedule..."
                        value={rescheduleNote}
                        onChange={(e) => setRescheduleNote(e.target.value)}
                        className="w-full p-2 text-xs rounded-lg border border-rose-200 bg-white focus:outline-none"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="submit"
                          disabled={loadingId === item.id}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-[11px] cursor-pointer"
                        >
                          Send Reschedule Request
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {/* Actions: Confirm, Reschedule, Join Video */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    {item.status !== 'Confirmed' && (
                      <button
                        type="button"
                        onClick={() => handleConfirm(item.id)}
                        disabled={loadingId === item.id}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Confirm Attendance</span>
                      </button>
                    )}

                    {item.status !== 'Reschedule Requested' && rescheduleTargetId !== item.id && (
                      <button
                        type="button"
                        onClick={() => setRescheduleTargetId(item.id)}
                        className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Reschedule</span>
                      </button>
                    )}
                  </div>

                  <a
                    href={item.meetingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 rounded-xl bg-brand-accent hover:bg-brand-accentHover text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
                  >
                    <Video className="w-4 h-4" />
                    <span>Join Video Meeting ({item.platform})</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
