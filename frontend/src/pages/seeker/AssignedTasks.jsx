import React, { useState } from 'react';
import { 
  CheckSquare, Clock, FileText, Download, Upload, 
  CheckCircle, AlertCircle, Send, FileCode, Check, X, ExternalLink
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export default function AssignedTasks() {
  const { tasks, submitTask } = usePlatform();
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [responseNotes, setResponseNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    if (!activeTaskId) return;

    setSubmitting(true);
    try {
      await submitTask(
        activeTaskId,
        responseNotes.trim(),
        selectedFile
      );
      setSubmittedSuccess(true);
      setTimeout(() => {
        setSubmittedSuccess(false);
        setActiveTaskId(null);
        setResponseNotes('');
        setSelectedFile(null);
      }, 2000);
    } catch (err) {
      console.error('Task submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-brand-navy text-white rounded-3xl p-8 border border-white/10 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold text-brand-teal uppercase tracking-widest flex items-center gap-1.5">
            <CheckSquare className="w-3.5 h-3.5" />
            Candidate Assessment Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Assigned Technical Tasks</h1>
          <p className="text-xs text-slate-300">View tasks assigned by potential employers, review instructions, and submit your solution before deadline.</p>
        </div>

        <div className="text-right">
          <span className="text-3xl font-black text-brand-accent">{tasks.length}</span>
          <span className="text-xs text-slate-400 block font-semibold">Assigned Tasks</span>
        </div>
      </div>

      {/* Task Cards */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-brand-navy">Assigned Candidate Assessments ({tasks.length})</h3>
          <span className="text-xs text-slate-400 font-semibold">Persisted in Database</span>
        </div>

        {tasks.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400 space-y-3">
            <CheckSquare className="w-10 h-10 mx-auto text-slate-300" />
            <p className="font-semibold text-slate-600">No active tasks assigned yet.</p>
            <p className="text-slate-400">When an employer assigns an assessment task for one of your job applications, it will appear here immediately.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {tasks.map((task) => (
              <div key={task.id} className="p-6 rounded-2xl border border-slate-200 hover:border-brand-accent/30 shadow-sm space-y-4 bg-white transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                        {task.company}
                      </span>
                      {task.status === 'Submitted' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 border border-emerald-200">
                          <CheckCircle className="w-3 h-3" /> Solution Submitted
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          Pending Submission
                        </span>
                      )}
                    </div>
                    <h4 className="text-base font-bold text-brand-navy mt-1">{task.title}</h4>
                    <p className="text-xs text-slate-500">For position: <strong className="text-brand-accent">{task.jobTitle}</strong></p>
                  </div>

                  <div className="text-right text-xs">
                    <span className="text-slate-400 block font-medium">Submission Deadline</span>
                    <span className="font-bold text-rose-600 flex items-center gap-1 justify-end mt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                      {task.deadline}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-700">
                  <p><strong>Description & Objectives:</strong> {task.description}</p>
                  {task.instructions && (
                    <p className="text-slate-600 pt-1"><strong>Instructions:</strong> {task.instructions}</p>
                  )}
                  {task.attachmentName && (
                    <div className="pt-2 flex items-center gap-2 text-brand-accent font-bold">
                      <FileText className="w-4 h-4" />
                      <span>Attached Material: {task.attachmentName}</span>
                    </div>
                  )}
                </div>

                {/* Submission Form Toggle */}
                {task.status !== 'Submitted' ? (
                  activeTaskId === task.id ? (
                    <form onSubmit={handleTaskSubmit} className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-4 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-bold text-brand-navy uppercase tracking-wider">Submit Task Solution Response</h5>
                        <button type="button" onClick={() => setActiveTaskId(null)} className="text-slate-400 hover:text-slate-700">
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-brand-navy mb-1">Solution Notes / Repository URL *</label>
                        <textarea
                          rows={3}
                          required
                          value={responseNotes}
                          onChange={(e) => setResponseNotes(e.target.value)}
                          placeholder="Provide repository link (GitHub/GitLab), deployed demo URL (Vercel/Netlify), or solution summary notes..."
                          className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent bg-white font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-brand-navy mb-1">Attach Solution File (Optional PDF/ZIP)</label>
                        <input
                          type="file"
                          onChange={(e) => setSelectedFile(e.target.files[0])}
                          className="w-full text-xs p-2.5 bg-white rounded-xl border border-slate-200 font-medium"
                        />
                        {selectedFile && (
                          <span className="text-[11px] text-emerald-600 font-bold block mt-1">
                            Attached: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                          </span>
                        )}
                      </div>

                      {submittedSuccess ? (
                        <div className="p-3.5 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span>Solution successfully saved & submitted to employer!</span>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setActiveTaskId(null)}
                            className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-200 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-2.5 text-xs font-bold rounded-xl bg-brand-accent hover:bg-brand-accentHover text-white shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-70"
                          >
                            {submitting ? (
                              <span>Submitting...</span>
                            ) : (
                              <>
                                <Send className="w-3.5 h-3.5" />
                                <span>Submit Solution to Employer</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </form>
                  ) : (
                    <button
                      onClick={() => setActiveTaskId(task.id)}
                      className="px-5 py-2.5 text-xs font-bold rounded-xl bg-brand-accent text-white hover:bg-brand-accentHover shadow-sm flex items-center gap-2 cursor-pointer transition-all"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Submit Solution Response</span>
                    </button>
                  )
                ) : (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Solution Response Submitted</span>
                    </div>
                    {task.feedback && (
                      <p className="text-slate-700 bg-white p-2.5 rounded-lg border border-emerald-100 mt-1">
                        <strong>Submitted Notes / URL:</strong> {task.feedback}
                      </p>
                    )}
                    {task.submissionUrl && (
                      <p className="text-[11px] text-slate-500 font-semibold">
                        Attached Document: {task.submissionUrl}
                      </p>
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
