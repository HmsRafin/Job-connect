import React, { useState } from 'react';
import { 
  CheckSquare, Plus, FileText, Download, CheckCircle, Clock, 
  Send, User, AlertCircle, ArrowUpRight
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export default function TaskManagement() {
  const { tasks, assignTask } = usePlatform();
  const [showAssignForm, setShowAssignForm] = useState(false);

  const [candidateName, setCandidateName] = useState('Elena Rostova');
  const [candidateEmail, setCandidateEmail] = useState('elena.rostova@design.io');
  const [taskTitle, setTaskTitle] = useState('Interactive UI Component Challenge');
  const [description, setDescription] = useState('Build a clean, accessible React component matching given design specs.');
  const [instructions, setInstructions] = useState('Upload your code repository link or ZIP submission before the deadline.');
  const [attachmentName, setAttachmentName] = useState('UI_Design_Tokens_Spec.pdf');
  const [deadline, setDeadline] = useState('2026-07-30T23:59');
  const [maxMarks, setMaxMarks] = useState(100);

  const handleAssign = (e) => {
    e.preventDefault();
    assignTask({
      candidateName,
      candidateEmail,
      title: taskTitle,
      description,
      instructions,
      attachmentName,
      deadline,
      maxMarks,
      jobTitle: 'Lead UI/UX Product Designer',
      company: 'Stripe Global'
    });
    setShowAssignForm(false);
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
          <p className="text-xs text-slate-300">Assign assessment tasks to shortlisted candidates and review submissions.</p>
        </div>

        <button
          onClick={() => setShowAssignForm(!showAssignForm)}
          className="px-6 py-3.5 rounded-2xl bg-brand-accent hover:bg-brand-accentHover text-white font-bold text-xs shadow-md shadow-brand-accent/25 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Assign New Task</span>
        </button>
      </div>

      {/* Task Creation Form */}
      {showAssignForm && (
        <form onSubmit={handleAssign} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-brand-navy">Assign Candidate Task</h3>
            <span className="text-xs font-semibold text-slate-400">Step 4 of Recruitment Workflow</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Target Candidate Name</label>
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
            <label className="block text-xs font-bold text-brand-navy mb-1">Task Title</label>
            <input
              type="text"
              required
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-navy mb-1">Task Description</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-navy mb-1">Instructions for Candidate</label>
            <textarea
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Attachment File Name (Optional)</label>
              <input
                type="text"
                value={attachmentName}
                onChange={(e) => setAttachmentName(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Submission Deadline</label>
              <input
                type="datetime-local"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Maximum Marks (Optional)</label>
              <input
                type="number"
                value={maxMarks}
                onChange={(e) => setMaxMarks(Number(e.target.value))}
                className="w-full p-3 text-xs rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAssignForm(false)}
              className="px-4 py-2.5 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold rounded-xl bg-brand-accent hover:bg-brand-accentHover text-white shadow-md flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Send Task Assignment</span>
            </button>
          </div>
        </form>
      )}

      {/* Active Tasks Overview */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
        <h3 className="text-lg font-bold text-brand-navy border-b border-slate-100 pb-4">Assigned Tasks & Submissions</h3>

        {tasks.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No tasks assigned yet. Click "Assign New Task" to evaluate candidates.
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-100 uppercase tracking-wider">
                      {task.status}
                    </span>
                    <h4 className="text-base font-bold text-brand-navy mt-1">{task.title}</h4>
                    <p className="text-xs text-slate-500">Candidate: <strong className="text-brand-navy">{task.candidateName}</strong> ({task.candidateEmail})</p>
                  </div>

                  <div className="text-right text-xs">
                    <span className="text-slate-400 block">Deadline</span>
                    <span className="font-bold text-rose-600 flex items-center gap-1 justify-end">
                      <Clock className="w-3.5 h-3.5" />
                      {task.deadline}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {task.description}
                </p>

                {/* Candidate Submission Review */}
                {task.status === 'Submitted' ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        Task Solution Submitted!
                      </span>
                      <span className="text-[10px] text-emerald-700">{task.submittedAt}</span>
                    </div>
                    {task.responseNotes && (
                      <p className="text-xs text-emerald-950 font-medium">"{task.responseNotes}"</p>
                    )}
                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {task.responseFile || 'Submission_File.pdf'}
                      </span>
                      <button className="px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white flex items-center gap-1">
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Submission</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <span>Candidate has not submitted solution yet. Pending deadline.</span>
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
