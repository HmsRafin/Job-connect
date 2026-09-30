import React, { useState } from 'react';
import { 
  Calendar, Plus, Video, Clock, Globe, User, 
  ExternalLink, CheckCircle, Send, Sparkles, X, AlertCircle
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export default function InterviewManagement() {
  const { interviews, scheduleInterview, applications, myListings = [], myApplications = [], currentUser } = usePlatform();
  const [showScheduleForm, setShowScheduleForm] = useState(false);

  const currentComp = currentUser?.companyName || currentUser?.name || '';
  const currentDbId = currentUser?.dbId || (currentUser?.id ? Number(String(currentUser.id).replace('usr-', '')) : null);
  const myListingIds = new Set(myListings.map(l => String(l.id)));

  const companyApplicants = myApplications.length > 0 ? myApplications : applications.filter(a => {
    if (!currentUser) return false;
    if (a.jobId && myListingIds.has(String(a.jobId))) return true;
    if (currentComp && a.company && a.company.trim().toLowerCase() === currentComp.trim().toLowerCase()) return true;
    return false;
  });

  const companyInterviews = interviews.filter(item => {
    if (!currentUser) return false;
    if (currentDbId && item.recruiterId && Number(item.recruiterId) === Number(currentDbId)) return true;
    if (currentComp && item.company && item.company.trim().toLowerCase() === currentComp.trim().toLowerCase()) return true;
    return false;
  });

  const [selectedAppId, setSelectedAppId] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [timezone, setTimezone] = useState('GMT+6 (BST)');
  const [platform, setPlatform] = useState('Zoom');
  const [meetingUrl, setMeetingUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [scheduling, setScheduling] = useState(false);

  const handleSelectApplicant = (e) => {
    const appId = e.target.value;
    setSelectedAppId(appId);
    if (appId) {
      const app = companyApplicants.find(a => String(a.id) === String(appId));
      if (app) {
        setCandidateName(app.candidateName || '');
        setCandidateEmail(app.candidateEmail || '');
        setJobTitle(app.jobTitle || '');
      }
    }
  };

  const handleSchedule = async (e) => {
    e.preventDefault();
    setScheduling(true);
    try {
      await scheduleInterview({
        applicationId: selectedAppId ? Number(selectedAppId) || selectedAppId : null,
        candidateName: candidateName.trim(),
        candidateEmail: candidateEmail.trim(),
        jobTitle: jobTitle.trim() || 'Software Engineer',
        date,
        time,
        timezone,
        platform,
        meetingUrl: meetingUrl.trim(),
        notes: notes.trim(),
        company: currentUser?.companyName || currentUser?.name || 'Hiring Company'
      });

      setShowScheduleForm(false);
      setSelectedAppId('');
      setCandidateName('');
      setCandidateEmail('');
      setJobTitle('');
      setDate('');
      setTime('');
      setMeetingUrl('');
      setNotes('');
    } catch (err) {
      console.error('Schedule interview error:', err);
    } finally {
      setScheduling(false);
    }
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
          <p className="text-xs text-slate-300">Schedule technical screens, panel interviews, and send instant conference links to candidates.</p>
        </div>

        <button
          onClick={() => setShowScheduleForm(!showScheduleForm)}
          className="px-6 py-3.5 rounded-2xl bg-brand-accent hover:bg-brand-accentHover text-white font-bold text-xs shadow-md shadow-brand-accent/25 flex items-center gap-2 cursor-pointer transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Interview</span>
        </button>
      </div>

      {/* Schedule Form */}
      {showScheduleForm && (
        <form onSubmit={handleSchedule} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-brand-navy">Schedule Candidate Interview</h3>
              <p className="text-xs text-slate-500">Interview invitation will appear in candidate portal & notify them.</p>
            </div>
            <button type="button" onClick={() => setShowScheduleForm(false)} className="text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Select Applicant */}
          {companyApplicants.length > 0 && (
            <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-1.5">
              <label className="block text-xs font-bold text-brand-navy">Auto-Fill from Active Applicants (Optional):</label>
              <select
                value={selectedAppId}
                onChange={handleSelectApplicant}
                className="w-full p-2.5 text-xs rounded-xl border border-blue-200 bg-white font-medium focus:outline-none focus:border-brand-accent"
              >
                <option value="">-- Choose an applicant to auto-fill candidate info --</option>
                {companyApplicants.map(app => (
                  <option key={app.id} value={app.id}>
                    {app.candidateName} — {app.jobTitle} ({app.candidateEmail})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Candidate Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Saifur Rahman"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Candidate Email *</label>
              <input
                type="email"
                required
                placeholder="candidate@example.com"
                value={candidateEmail}
                onChange={(e) => setCandidateEmail(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Job Role *</label>
              <input
                type="text"
                required
                placeholder="e.g. Senior Frontend Engineer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Interview Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Time *</label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Timezone</label>
              <input
                type="text"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Meeting Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-white font-medium"
              >
                <option value="Google Meet">Google Meet</option>
                <option value="Zoom">Zoom</option>
                <option value="Microsoft Teams">Microsoft Teams</option>
                <option value="Onsite Office">Onsite Office</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Video Meeting URL / Location *</label>
              <input
                type="url"
                required
                placeholder="https://meet.google.com/xyz-job-connect or https://zoom.us/j/..."
                value={meetingUrl}
                onChange={(e) => setMeetingUrl(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-navy mb-1">Interview Topics & Instructions</label>
            <textarea
              rows={3}
              placeholder="e.g. System architecture overview, live coding exercise, questions regarding candidate portfolio..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent font-medium"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowScheduleForm(false)}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={scheduling}
              className="px-6 py-2.5 text-xs font-bold rounded-xl bg-brand-accent hover:bg-brand-accentHover text-white shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {scheduling ? (
                <span>Scheduling...</span>
              ) : (
                <>
                  <Calendar className="w-4 h-4" />
                  <span>Schedule & Send Invitation</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Interview List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-base font-bold text-brand-navy">Scheduled Interviews ({companyInterviews.length})</h3>
          <span className="text-xs text-slate-400 font-semibold">Persisted in Cloud Database</span>
        </div>

        {companyInterviews.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs space-y-3">
            <Calendar className="w-8 h-8 mx-auto text-slate-300" />
            <p className="font-semibold text-slate-600">No candidate interviews currently scheduled.</p>
            <p className="text-slate-400">Click "Schedule New Interview" to set up a video meeting with an applicant.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {companyInterviews.map((item) => (
              <div key={item.id} className="p-6 rounded-2xl border border-slate-200 hover:border-brand-accent/30 shadow-sm space-y-4 bg-white transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-base font-bold text-brand-navy">{item.candidateName}</h4>
                    <p className="text-xs text-slate-500">{item.candidateEmail} • <span className="text-brand-accent font-semibold">{item.jobTitle}</span></p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    item.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                    item.status === 'Reschedule Requested' ? 'bg-rose-100 text-rose-800' : 'bg-blue-50 text-brand-accent'
                  }`}>
                    {item.status}
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-xs text-slate-700">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="flex items-center gap-1.5 text-brand-accent font-bold">
                      <Calendar className="w-3.5 h-3.5" /> {item.date}
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-600 font-bold">
                      <Clock className="w-3.5 h-3.5" /> {item.time} ({item.timezone})
                    </span>
                  </div>
                  {item.notes && <p className="text-[11px] text-slate-600 italic pt-1">"{item.notes}"</p>}
                  {item.candidateResponse && (
                    <div className="pt-2 border-t border-slate-200 text-emerald-800 font-semibold text-[11px]">
                      Candidate Note: {item.candidateResponse}
                    </div>
                  )}
                </div>

                <a
                  href={item.meetingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-xl bg-brand-accent hover:bg-brand-accentHover text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Video className="w-4 h-4" />
                  <span>Join Meeting ({item.platform})</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
