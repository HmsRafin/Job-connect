import React, { useState } from 'react';
import { 
  Calendar, Plus, Video, Clock, Globe, User, 
  ExternalLink, CheckCircle, Send, Sparkles 
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export default function InterviewManagement() {
  const { interviews, scheduleInterview } = usePlatform();
  const [showScheduleForm, setShowScheduleForm] = useState(false);

  const [candidateName, setCandidateName] = useState('Alex Vance');
  const [candidateEmail, setCandidateEmail] = useState('alex.vance@devmail.io');
  const [jobTitle, setJobTitle] = useState('Senior Frontend Engineer (React/TypeScript)');
  const [date, setDate] = useState('2026-07-28');
  const [time, setTime] = useState('14:00');
  const [timezone, setTimezone] = useState('PST (UTC-8)');
  const [platform, setPlatform] = useState('Zoom Link');
  const [meetingUrl, setMeetingUrl] = useState('https://zoom.us/j/9876543210');
  const [notes, setNotes] = useState('Technical architecture and live coding session.');

  const handleSchedule = (e) => {
    e.preventDefault();
    scheduleInterview({
      candidateName,
      candidateEmail,
      jobTitle,
      date,
      time,
      timezone,
      platform,
      meetingUrl,
      notes,
      company: 'Stripe Global'
    });
    setShowScheduleForm(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-brand-navy text-white rounded-3xl p-8 border border-white/10 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold text-brand-teal uppercase tracking-widest flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Interview Scheduler & Video Conference Engine
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Interview Management</h1>
          <p className="text-xs text-slate-300">Schedule technical screens, panel interviews, and send instant platform links.</p>
        </div>

        <button
          onClick={() => setShowScheduleForm(!showScheduleForm)}
          className="px-6 py-3.5 rounded-2xl bg-brand-accent hover:bg-brand-accentHover text-white font-bold text-xs shadow-md shadow-brand-accent/25 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Interview</span>
        </button>
      </div>

      {/* Schedule Form */}
      {showScheduleForm && (
        <form onSubmit={handleSchedule} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-brand-navy">Schedule Candidate Interview</h3>
            <span className="text-xs font-semibold text-slate-400">Step 6 of Recruitment Workflow</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Candidate Name</label>
              <input
                type="text"
                required
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Candidate Email</label>
              <input
                type="email"
                required
                value={candidateEmail}
                onChange={(e) => setCandidateEmail(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-navy mb-1">Position / Job Opening</label>
            <input
              type="text"
              required
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Interview Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Time</label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Time Zone</label>
              <input
                type="text"
                required
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                placeholder="e.g. PST, EST, GMT+6"
                className="w-full p-3 text-xs rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Meeting Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-white font-semibold"
              >
                <option value="Zoom Link">Zoom Meeting</option>
                <option value="Google Meet Link">Google Meet</option>
                <option value="Microsoft Teams Link">Microsoft Teams</option>
                <option value="Other Meeting URL">Other Custom Link</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Video Join URL</label>
              <input
                type="url"
                required
                value={meetingUrl}
                onChange={(e) => setMeetingUrl(e.target.value)}
                placeholder="https://zoom.us/j/123456789"
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent font-mono text-brand-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-navy mb-1">Interview Instructions & Notes (Optional)</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="System design expectations, panel interviewers, key preparation notes..."
              className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowScheduleForm(false)}
              className="px-4 py-2.5 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold rounded-xl bg-brand-accent hover:bg-brand-accentHover text-white shadow-md flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Confirm & Notify Candidate</span>
            </button>
          </div>
        </form>
      )}

      {/* Scheduled Interviews List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
        <h3 className="text-lg font-bold text-brand-navy border-b border-slate-100 pb-4">Upcoming Scheduled Interviews</h3>

        {interviews.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No scheduled interviews on calendar.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {interviews.map((item) => (
              <div key={item.id} className="p-6 rounded-2xl border border-slate-200 hover:border-brand-accent/40 shadow-sm space-y-4 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-brand-accent flex items-center justify-center">
                      <Video className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.platform}</span>
                      <h4 className="text-sm font-bold text-brand-navy">{item.candidateName}</h4>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                    {item.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600">
                  <p className="font-semibold text-brand-navy">{item.jobTitle}</p>
                  <div className="flex items-center gap-4 text-slate-500 text-[11px]">
                    <span className="flex items-center gap-1 font-bold text-brand-accent">
                      <Calendar className="w-3.5 h-3.5" /> {item.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {item.time} {item.timezone}
                    </span>
                  </div>
                </div>

                {item.notes && (
                  <p className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    "{item.notes}"
                  </p>
                )}

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <a
                    href={item.meetingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-brand-accent hover:underline flex items-center gap-1"
                  >
                    <span>Launch Video Room</span>
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
