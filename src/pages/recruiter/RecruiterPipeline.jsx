import React, { useState } from 'react';
import { 
  GitCommit, ChevronRight, CheckCircle, Clock, UserCheck, 
  FileText, Calendar, AlertCircle, XCircle, Filter, ArrowRight
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export default function RecruiterPipeline() {
  const { applications, updateApplicationStage } = usePlatform();
  const [filterStage, setFilterStage] = useState('All');

  const pipelineStages = [
    'Application Submitted',
    'Under Review',
    'Shortlisted',
    'Task Assignment',
    'Task Submitted',
    'Interview Scheduled',
    'Interview Completed',
    'Final Decision',
    'Hired / Rejected'
  ];

  const filteredApps = filterStage === 'All'
    ? applications
    : applications.filter(a => a.stage === filterStage);

  const getBadgeStyle = (stage) => {
    switch (stage) {
      case 'Hired': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Rejected': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Interview Scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Task Assignment': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Shortlisted': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-brand-navy text-white rounded-3xl p-8 border border-white/10 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold text-brand-teal uppercase tracking-widest flex items-center gap-1.5">
            <GitCommit className="w-3.5 h-3.5" />
            9-Stage Candidate Workflow Engine
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Recruitment Pipeline</h1>
          <p className="text-xs text-slate-300">Track candidate progression from initial submission to final hiring decision.</p>
        </div>

        <div className="text-right">
          <span className="text-3xl font-black text-brand-accent">{applications.length}</span>
          <span className="text-xs text-slate-400 block font-semibold">Active Candidates in Funnel</span>
        </div>
      </div>

      {/* Stage Progression Stepper Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pipeline Stage Progression Overview</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-9 gap-2">
          {pipelineStages.map((stg, i) => {
            const count = applications.filter(a => a.stage === stg || (stg === 'Hired / Rejected' && (a.stage === 'Hired' || a.stage === 'Rejected'))).length;
            return (
              <button
                key={stg}
                onClick={() => setFilterStage(stg === 'Hired / Rejected' ? 'All' : stg)}
                className={`p-2.5 rounded-2xl border text-left transition-all ${
                  filterStage === stg
                    ? 'border-brand-accent bg-blue-50/60 ring-2 ring-brand-accent/20'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                <span className="text-[10px] font-bold text-slate-400 block">Stage {i+1}</span>
                <span className="text-xs font-bold text-brand-navy truncate block">{stg}</span>
                <span className="text-[11px] font-black text-brand-accent mt-1 block">{count} Candidates</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Candidate Pipeline Cards */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-base font-bold text-brand-navy">Candidate Recruitment Cards</h3>
          <span className="text-xs font-semibold text-slate-500">Showing {filteredApps.length} applicants</span>
        </div>

        {filteredApps.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No candidates currently in this stage.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApps.map((app) => (
              <div key={app.id} className="p-5 rounded-2xl border border-slate-200 hover:border-brand-accent/40 shadow-sm transition-all space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-brand-navy">{app.candidateName || 'Candidate'}</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-brand-accent">
                        Match Score: {app.matchScore || 90}%
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-600 mt-0.5">{app.jobTitle} • Applied {app.appliedDate}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getBadgeStyle(app.stage)}`}>
                      {app.stage}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <strong className="text-brand-navy">Stage Notes:</strong> {app.notes || 'Application progressing through standard recruitment phases.'}
                </p>

                {/* Stage Controls */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Advance Stage:</span>
                    <select
                      value={app.stage}
                      onChange={(e) => updateApplicationStage(app.id, e.target.value)}
                      className="p-1.5 text-xs rounded-xl border border-slate-200 bg-white font-bold text-brand-navy"
                    >
                      <option value="Application Submitted">1. Application Submitted</option>
                      <option value="Under Review">2. Under Review</option>
                      <option value="Shortlisted">3. Shortlisted</option>
                      <option value="Task Assignment">4. Task Assignment</option>
                      <option value="Task Submitted">5. Task Submitted</option>
                      <option value="Interview Scheduled">6. Interview Scheduled</option>
                      <option value="Interview Completed">7. Interview Completed</option>
                      <option value="Final Decision">8. Final Decision</option>
                      <option value="Hired">9a. Hired</option>
                      <option value="Rejected">9b. Rejected</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateApplicationStage(app.id, 'Hired', 'Offer accepted! Candidate officially hired.')}
                      className="px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      Mark Hired
                    </button>
                    <button
                      onClick={() => updateApplicationStage(app.id, 'Rejected', 'Candidate notified of rejection.')}
                      className="px-3 py-1.5 text-xs font-semibold rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200"
                    >
                      Reject
                    </button>
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
