import React, { useState } from 'react';
import { 
  Users, Search, Filter, Eye, Check, Ban, FileText, Sparkles, Star 
} from 'lucide-react';
import { mockApplicantsList } from '../../data/mockData';
import CandidateModal from '../../components/common/CandidateModal';

export default function ManageApplicants() {
  const [candidates, setCandidates] = useState(mockApplicantsList);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const handleStatusChange = (id, newStatus) => {
    setCandidates(candidates.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  const filteredCandidates = candidates.filter(c => {
    if (filterStatus !== 'All' && c.status !== filterStatus) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.appliedJob.toLowerCase().includes(q) || c.skills.some(s => s.toLowerCase().includes(q));
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-brand-navy text-white rounded-3xl p-8 border border-white/10 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Candidate Pipeline</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Manage Applicants</h1>
          <p className="text-xs text-slate-300">Review incoming candidate applications and match scores.</p>
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search candidate name or skill..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['All', 'Pending', 'Interviewing', 'Accepted', 'Rejected'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                filterStatus === status
                  ? 'bg-brand-navy text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Candidate List Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Candidate Profile</th>
                <th className="py-4 px-6">Applied Role</th>
                <th className="py-4 px-6">AI Match Score</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredCandidates.map((cand) => (
                <tr key={cand.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-accent to-brand-teal flex items-center justify-center font-bold text-white text-xs">
                        {cand.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-bold text-brand-navy">{cand.name}</h4>
                        <p className="text-[11px] text-slate-500">{cand.role} • {cand.experience}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-slate-700">{cand.appliedJob}</span>
                    <span className="block text-[10px] text-slate-400">Applied {cand.appliedDate}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                      <Sparkles className="w-3 h-3 text-emerald-500" />
                      {cand.matchScore}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                      cand.status === 'Interviewing' ? 'bg-blue-100 text-blue-700' :
                      cand.status === 'Accepted' ? 'bg-emerald-100 text-emerald-700' :
                      cand.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {cand.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-1">
                    <button
                      onClick={() => setSelectedCandidate(cand)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-brand-navy hover:text-white text-slate-700 font-bold transition-all"
                    >
                      <Eye className="w-3.5 h-3.5 inline mr-1" />
                      Review Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CandidateModal
        candidate={selectedCandidate}
        isOpen={!!selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
