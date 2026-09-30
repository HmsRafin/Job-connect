import React from 'react';
import { 
  FileText, CheckCircle, Clock, Calendar, ChevronRight, 
  Building, AlertCircle, ArrowUpRight 
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export default function MyApplications() {
  const { applications } = usePlatform();

  const pipelineStages = [
    'Application Submitted',
    'Under Review',
    'Shortlisted',
    'Task Assignment',
    'Task Submitted',
    'Interview Scheduled',
    'Interview Completed',
    'Final Decision',
    'Hired'
  ];

  const getStageIndex = (stage) => {
    if (stage === 'Hired') return 8;
    if (stage === 'Rejected') return -1;
    const idx = pipelineStages.indexOf(stage);
    return idx !== -1 ? idx : 0;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-brand-navy text-white rounded-3xl p-8 border border-white/10 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold text-brand-teal uppercase tracking-widest flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            Active Progression Tracker
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">My Submitted Applications</h1>
          <p className="text-xs text-slate-300">Track real-time recruitment progression from review to offer.</p>
        </div>

        <div className="text-right">
          <span className="text-3xl font-black text-brand-accent">{applications.length}</span>
          <span className="text-xs text-slate-400 block font-semibold">Active Applications</span>
        </div>
      </div>

      {/* Applications Stepper Cards */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
        <h3 className="text-lg font-bold text-brand-navy border-b border-slate-100 pb-4">Application Progress Tracker</h3>

        {applications.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No applications submitted yet.
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((app) => {
              const currentStep = getStageIndex(app.stage);
              const isRejected = app.stage === 'Rejected';

              return (
                <div key={app.id} className="p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{app.company}</span>
                      <h4 className="text-base font-bold text-brand-navy">{app.jobTitle}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Applied on {app.appliedDate} • {app.salary}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        app.stage === 'Hired' ? 'bg-emerald-100 text-emerald-800' :
                        isRejected ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-brand-accent'
                      }`}>
                        Current Status: {app.stage}
                      </span>
                    </div>
                  </div>

                  {/* 9-Stage Visual Progress Bar */}
                  {!isRejected ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                        <span>Submitted</span>
                        <span>Stage {currentStep + 1} of 9</span>
                        <span>Hired</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                        {pipelineStages.map((stg, i) => (
                          <div
                            key={stg}
                            className={`flex-1 border-r border-white transition-all ${
                              i <= currentStep ? 'bg-brand-accent' : 'bg-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                        <span className="truncate">{pipelineStages[currentStep] || app.stage}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                      <strong>Application Closed:</strong> Position filled or application was not selected.
                    </div>
                  )}

                  {app.notes && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <strong className="text-brand-navy">Recruiter Note:</strong> "{app.notes}"
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
