import React, { useState } from 'react';
import { CheckSquare, Check, X, ShieldAlert, Sparkles, Building2 } from 'lucide-react';
import { mockJobModerationQueue } from '../../data/mockData';

export default function JobModeration() {
  const [queue, setQueue] = useState(mockJobModerationQueue);

  const updateStatus = (id, newStatus) => {
    setQueue(queue.map(item => item.id === id ? { ...item, status: newStatus } : item));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-brand-navy text-white rounded-3xl p-8 border border-white/10 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Quality Assurance</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Job Moderation Queue</h1>
          <p className="text-xs text-slate-300">Approve or reject pending employer job submissions before publishing live.</p>
        </div>
      </div>

      {/* Queue List */}
      <div className="space-y-4">
        {queue.map((item) => (
          <div key={item.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{item.company}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                <span className="text-[10px] font-semibold text-purple-600">{item.category}</span>
              </div>
              <h3 className="text-base font-bold text-brand-navy">{item.title}</h3>
              <p className="text-xs text-slate-500">Submitted by: {item.submittedBy} • Date: {item.date}</p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                item.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                item.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'
              }`}>
                {item.status}
              </span>

              {item.status === 'Pending Review' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateStatus(item.id, 'Rejected')}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => updateStatus(item.id, 'Approved')}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve Post</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
