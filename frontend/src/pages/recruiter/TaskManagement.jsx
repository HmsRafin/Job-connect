import React, { useState } from 'react';
import { 
  CheckSquare, Plus, FileText, Download, CheckCircle, Clock, 
  Send, User, AlertCircle, ArrowUpRight, Check, X, ExternalLink
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export default function TaskManagement() {
  const { tasks, assignTask, applications, myListings = [], myApplications = [], currentUser } = usePlatform();
  const [showAssignForm, setShowAssignForm] = useState(false);

  const currentComp = currentUser?.companyName || currentUser?.name || '';
  const currentDbId = currentUser?.dbId || (currentUser?.id ? Number(String(currentUser.id).replace('usr-', '')) : null);
  const myListingIds = new Set(myListings.map(l => String(l.id)));

  const companyApplicants = myApplications.length > 0 ? myApplications : applications.filter(a => {
    if (!currentUser) return false;
    if (a.jobId && myListingIds.has(String(a.jobId))) return true;
    if (currentComp && a.company && a.company.trim().toLowerCase() === currentComp.trim().toLowerCase()) return true;
    return false;
  });

  const companyTasks = tasks.filter(t => {
    if (!currentUser) return false;
    if (currentDbId && t.recruiterId && Number(t.recruiterId) === Number(currentDbId)) return true;
    if (currentComp && t.company && t.company.trim().toLowerCase() === currentComp.trim().toLowerCase()) return true;
    return false;
  });

  const [selectedAppId, setSelectedAppId] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [deadline, setDeadline] = useState('');
  const [assigning, setAssigning] = useState(false);

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

  const handleAssign = async (e) => {
    e.preventDefault();
    setAssigning(true);
    try {
      await assignTask({
        applicationId: selectedAppId ? Number(selectedAppId) || selectedAppId : null,
        candidateName: candidateName.trim(),
        candidateEmail: candidateEmail.trim(),
        jobTitle: jobTitle.trim() || 'Software Engineer',
        title: taskTitle.trim(),
        description: description.trim(),
        instructions: instructions.trim(),
        attachmentName: attachmentName.trim() || null,
        deadline: deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
        company: currentUser?.companyName || currentUser?.name || 'Hiring Company'
      });

      setShowAssignForm(false);
      setSelectedAppId('');
      setCandidateName('');
      setCandidateEmail('');
      setJobTitle('');
      setTaskTitle('');
      setDescription('');
      setInstructions('');
      setAttachmentName('');
      setDeadline('');
    } catch (err) {
      console.error('Assign task error:', err);
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-brand-navy text-white rounded-3xl p-8 border border-white/10 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold text-brand-teal uppercase tracking-widest flex items-center gap-1.5">
            <CheckSquare className="w-3.5 h-3.5" />
            Applicant Screening Module
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Task Assignment Management</h1>
          <p className="text-xs text-slate-300">Assign assessment tasks to shortlisted candidates and review candidate submissions.</p>
        </div>

        <button
          onClick={() => setShowAssignForm(!showAssignForm)}
          className="px-6 py-3.5 rounded-2xl bg-brand-accent hover:bg-brand-accentHover text-white font-bold text-xs shadow-md shadow-brand-accent/25 flex items-center gap-2 cursor-pointer transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Assign New Task</span>
        </button>
      </div>

      {/* Task Creation Form */}
      {showAssignForm && (
        <form onSubmit={handleAssign} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-brand-navy">Assign Candidate Assessment Task</h3>
              <p className="text-xs text-slate-500">The task will appear in the candidate's portal and database record.</p>
            </div>
            <button type="button" onClick={() => setShowAssignForm(false)} className="text-slate-400 hover:text-slate-700">
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
              <label className="block text-xs font-bold text-brand-navy mb-1">Target Candidate Name *</label>
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
              <label className="block text-xs font-bold text-brand-navy mb-1">Applied Job Position *</label>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Task Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Build Responsive Dashboard & API Integration"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Submission Deadline *</label>
              <input
                type="datetime-local"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-navy mb-1">Task Description & Requirements *</label>
            <textarea
              rows={3}
              required
              placeholder="Outline what the candidate needs to build, tech stack expectations, and evaluation criteria..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-navy mb-1">Submission Instructions & Guidelines</label>
            <textarea
              rows={2}
              placeholder="e.g. Provide a public GitHub repository link or deploy to Vercel/Netlify. Attach project documentation."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent font-medium"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAssignForm(false)}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={assigning}
              className="px-6 py-2.5 text-xs font-bold rounded-xl bg-brand-accent hover:bg-brand-accentHover text-white shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {assigning ? (
                <span>Assigning...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Assign Task to Candidate</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Task List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-base font-bold text-brand-navy">Assigned Candidate Assessments ({companyTasks.length})</h3>
          <span className="text-xs text-slate-400 font-semibold">Persisted in Cloud Database</span>
        </div>

        {companyTasks.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs space-y-3">
            <CheckSquare className="w-8 h-8 mx-auto text-slate-300" />
            <p className="font-semibold text-slate-600">No assessment tasks assigned yet.</p>
            <p className="text-slate-400">Click "Assign New Task" above to send a technical test to an applicant.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {companyTasks.map((task) => (
              <div key={task.id} className="p-6 rounded-2xl border border-slate-200 hover:border-brand-accent/30 shadow-sm space-y-3 bg-white transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-base font-bold text-brand-navy">{task.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Candidate: <strong className="text-slate-800">{task.candidateName}</strong> ({task.candidateEmail}) • Role: <span className="text-brand-accent font-semibold">{task.jobTitle}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-medium">
                      Deadline: <strong className="text-rose-600 font-bold">{task.deadline}</strong>
                    </span>
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                      task.status === 'Submitted' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {task.status === 'Submitted' ? '✓ Solution Submitted' : 'Pending Submission'}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl text-xs text-slate-700 space-y-1">
                  <p><strong>Requirements:</strong> {task.description}</p>
                  {task.instructions && (
                    <p className="text-slate-500"><strong>Instructions:</strong> {task.instructions}</p>
                  )}
                </div>

                {task.status === 'Submitted' && (
                  <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-xs text-emerald-950 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-emerald-900">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Candidate Solution Received</span>
                    </div>
                    {task.feedback && (
                      <p className="text-slate-700 bg-white p-2.5 rounded-xl border border-emerald-100">
                        <strong>Candidate Notes / URL:</strong> {task.feedback}
                      </p>
                    )}
                    {task.submissionUrl && (
                      <div className="flex items-center gap-2 text-brand-accent font-semibold">
                        <FileText className="w-3.5 h-3.5" />
                        <span>Attached File: {task.submissionUrl}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
