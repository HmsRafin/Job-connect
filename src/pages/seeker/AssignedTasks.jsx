import React, { useState } from 'react';
import { 
  CheckSquare, Clock, FileText, Download, Upload, 
  CheckCircle, AlertCircle, Send, FileCode 
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export default function AssignedTasks() {
  const { tasks, submitTask } = usePlatform();
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [responseNotes, setResponseNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    if (!activeTaskId) return;

    submitTask(activeTaskId, responseNotes, selectedFile || { name: 'Solution_Repository_Submission.pdf' });
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setActiveTaskId(null);
      setResponseNotes('');
      setSelectedFile(null);
    }, 2000);
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
          <p className="text-xs text-slate-300">View tasks assigned by potential employers, review instructions, and submit before deadline.</p>
        </div>

        <div className="text-right">
          <span className="text-3xl font-black text-brand-accent">{tasks.length}</span>
          <span className="text-xs text-slate-400 block font-semibold">Assigned Tasks</span>
        </div>
      </div>

      {/* Task Cards */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
        <h3 className="text-lg font-bold text-brand-navy border-b border-slate-100 pb-4">Assigned Candidate Assessments</h3>

        {tasks.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No active tasks assigned yet.
          </div>
        ) : (
          <div className="space-y-6">
            {tasks.map((task) => (
              <div key={task.id} className="p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                        {task.company}
                      </span>
                      {task.status === 'Submitted' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Submitted
                        </span>
                      )}
                    </div>
                    <h4 className="text-base font-bold text-brand-navy mt-1">{task.title}</h4>
                    <p className="text-xs text-slate-500">For position: {task.jobTitle}</p>
                  </div>

                  <div className="text-right text-xs">
                    <span className="text-slate-400 block">Deadline</span>
                    <span className="font-bold text-rose-600 flex items-center gap-1 justify-end">
                      <Clock className="w-3.5 h-3.5" />
                      {task.deadline}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-700">
                  <p><strong>Description:</strong> {task.description}</p>
                  {task.instructions && (
                    <p><strong>Instructions:</strong> {task.instructions}</p>
                  )}
                  {task.attachmentName && (
                    <div className="pt-2 flex items-center gap-2 text-brand-accent font-bold">
                      <FileText className="w-4 h-4" />
                      <span>Attachment: {task.attachmentName}</span>
                      <button className="px-2.5 py-1 text-[11px] bg-white rounded-lg border border-slate-200 hover:bg-slate-100 flex items-center gap-1">
                        <Download className="w-3 h-3" /> Download Attachment
                      </button>
                    </div>
                  )}
                </div>

                {/* Submission Form Toggle */}
                {task.status !== 'Submitted' ? (
                  activeTaskId === task.id ? (
                    <form onSubmit={handleTaskSubmit} className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-4 animate-fade-in">
                      <h5 className="text-xs font-bold text-brand-navy">Submit Task Solution Response</h5>

                      <div>
                        <label className="block text-xs font-bold text-brand-navy mb-1">Response Notes / Link</label>
                        <textarea
                          rows={3}
                          required
                          value={responseNotes}
                          onChange={(e) => setResponseNotes(e.target.value)}
                          placeholder="Provide repository link (GitHub/Vercel/Figma) or summary notes..."
                          className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-brand-navy mb-1">Upload Submission File / PDF</label>
                        <input
                          type="file"
                          onChange={(e) => setSelectedFile(e.target.files[0])}
                          className="w-full text-xs p-2 bg-white rounded-xl border border-slate-200"
                        />
                      </div>

                      {submittedSuccess ? (
                        <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" /> Solution Uploaded & Submitted to Employer!
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setActiveTaskId(null)}
                            className="px-3 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-200"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 text-xs font-bold rounded-xl bg-brand-accent hover:bg-brand-accentHover text-white shadow-md flex items-center gap-1.5"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Submit Solution Before Deadline</span>
                          </button>
                        </div>
                      )}
                    </form>
                  ) : (
                    <button
                      onClick={() => setActiveTaskId(task.id)}
                      className="px-5 py-2.5 text-xs font-bold rounded-xl bg-brand-accent text-white hover:bg-brand-accentHover shadow-sm flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Submit Solution Response</span>
                    </button>
                  )
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium">
                    Solution submitted on <strong>{task.submittedAt}</strong>. File: <em>{task.responseFile}</em>
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
