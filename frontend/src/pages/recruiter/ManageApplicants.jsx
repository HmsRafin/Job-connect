import React, { useState } from 'react';
import { 
  Users, Search, Filter, Eye, Check, Ban, FileText, Sparkles, Star 
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import CandidateModal from '../../components/common/CandidateModal';

export default function ManageApplicants() {
  const { applications, myListings = [], myApplications = [], currentUser, updateApplicationStage } = usePlatform();
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const currentComp = currentUser?.companyName || currentUser?.name || '';
  const myListingIds = new Set(myListings.map(l => String(l.id)));

  // Candidates belonging strictly to this company
  const companyApplicants = myApplications.length > 0 ? myApplications : applications.filter(a => {
    if (!currentUser) return false;
    if (a.jobId && myListingIds.has(String(a.jobId))) return true;
    if (currentComp && a.company && a.company.trim().toLowerCase() === currentComp.trim().toLowerCase()) return true;
    return false;
  });

  const handleStatusChange = (id, newStatus) => {
    updateApplicationStage(id, newStatus);
  };

  const filteredCandidates = companyApplicants.filter(c => {
    if (filterStatus !== 'All' && c.stage !== filterStatus) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        (c.candidateName && c.candidateName.toLowerCase().includes(q)) ||
        (c.jobTitle && c.jobTitle.toLowerCase().includes(q)) ||
        (c.candidateEmail && c.candidateEmail.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-brand-navy text-white rounded-3xl p-8 border border-white/10 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Candidate Funnel</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Manage Applicants</h1>
          <p className="text-xs text-slate-300">Review incoming candidate applications, match scores, and resumes.</p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-black text-brand-accent">{companyApplicants.length}</span>
          <span className="text-xs text-slate-400 block font-semibold">Total Applicants</span>
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search candidate name or position..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['All', 'Application Submitted', 'Interview Scheduled', 'Hired', 'Rejected'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
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
        {filteredCandidates.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs space-y-3">
            <Users className="w-10 h-10 mx-auto text-slate-300" />
            <p className="font-semibold text-slate-500">No applicants found for your job postings.</p>
            <p className="text-slate-400">When job seekers apply to your listings, their profiles and resumes will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Candidate Profile</th>
                  <th className="py-4 px-6">Applied Role</th>
                  <th className="py-4 px-6">Match Score</th>
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
                          {cand.candidateName ? cand.candidateName.slice(0, 2).toUpperCase() : 'CD'}
                        </div>
                        <div>
                          <h4 className="font-bold text-brand-navy">{cand.candidateName}</h4>
                          <p className="text-[11px] text-slate-500">{cand.candidateEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-slate-700">{cand.jobTitle}</span>
                      <span className="block text-[10px] text-slate-400">Applied {cand.appliedDate}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                        <Sparkles className="w-3 h-3 text-emerald-500" />
                        {cand.matchScore ?? 'Not scored'}%
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                        cand.stage === 'Interview Scheduled' ? 'bg-blue-100 text-blue-700' :
                        cand.stage === 'Hired' ? 'bg-emerald-100 text-emerald-700' :
                        cand.stage === 'Rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {cand.stage}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-1">
                      <button
                        onClick={() => setSelectedCandidate({
                          id: cand.id,
                          name: cand.candidateName,
                          role: cand.jobTitle,
                          experience: 'Candidate',
                          location: 'Remote',
                          bio: cand.pitch || 'Candidate submitted application for this position.',
                          skills: ['Verified Profile'],
                          resumeFile: cand.resumeFile || 'Resume.pdf',
                          matchScore: cand.matchScore ?? 'Not scored',
                          status: cand.stage
                        })}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-brand-navy hover:text-white text-slate-700 font-bold transition-all cursor-pointer"
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
        )}
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
