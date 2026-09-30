import React, { useState } from 'react';
import { 
  Briefcase, Check, X, ShieldAlert, Sparkles, Building2, 
  Search, Filter, CheckCircle2, AlertCircle, Trash2, 
  Eye, Clock, MapPin, Tag, ArrowUpRight, ShieldCheck, 
  ChevronRight, RefreshCw, AlertTriangle, Layers, Award
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export default function JobModeration() {
  const { listings, updateListing, deleteListing } = usePlatform();

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // All, Active, Pending, Rejected, Suspended
  const [typeFilter, setTypeFilter] = useState('All'); // All, Job, Internship
  const [workModelFilter, setWorkModelFilter] = useState('All');

  // Modals & Feedback
  const [selectedJob, setSelectedJob] = useState(null);
  const [rejectModalJob, setRejectModalJob] = useState(null);
  const [rejectReason, setRejectReason] = useState('Incomplete job requirements or contact details.');
  const [actionSuccess, setActionSuccess] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter listings
  const filteredListings = listings.filter(item => {
    const matchesSearch = 
      (item.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.location || '').toLowerCase().includes(searchTerm.toLowerCase());

    const normalizedStatus = item.status || 'Active';
    const matchesStatus = 
      statusFilter === 'All' ? true :
      statusFilter === 'Active' ? (normalizedStatus === 'Active' || normalizedStatus === 'Approved') :
      statusFilter === 'Pending' ? (normalizedStatus === 'Pending' || normalizedStatus === 'Under Review') :
      statusFilter === 'Rejected' ? normalizedStatus === 'Rejected' :
      statusFilter === 'Suspended' ? (normalizedStatus === 'Suspended' || normalizedStatus === 'Closed') : true;

    const matchesType = 
      typeFilter === 'All' ? true :
      typeFilter === 'Internship' ? (item.categoryType === 'Internship' || (item.type || '').toLowerCase().includes('intern')) :
      typeFilter === 'Job' ? (item.categoryType !== 'Internship' && !(item.type || '').toLowerCase().includes('intern')) : true;

    const matchesWorkModel = workModelFilter === 'All' || item.workModel === workModelFilter;

    return matchesSearch && matchesStatus && matchesType && matchesWorkModel;
  });

  // Moderation Metrics
  const totalListings = listings.length;
  const activeCount = listings.filter(j => (j.status || 'Active') === 'Active' || j.status === 'Approved').length;
  const pendingCount = listings.filter(j => j.status === 'Pending' || j.status === 'Under Review').length;
  const rejectedCount = listings.filter(j => j.status === 'Rejected' || j.status === 'Suspended').length;
  const internshipCount = listings.filter(j => j.categoryType === 'Internship' || (j.type || '').toLowerCase().includes('intern')).length;

  // Actions
  const handleApprove = async (id) => {
    setIsProcessing(true);
    try {
      await updateListing(id, { status: 'Active' });
      setActionSuccess('Job post approved and published live in database.');
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      console.error(err);
      alert('Failed to approve job post.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectConfirm = async (e) => {
    e.preventDefault();
    if (!rejectModalJob) return;

    setIsProcessing(true);
    try {
      await updateListing(rejectModalJob.id, { 
        status: 'Rejected',
        notes: `Rejected by Admin: ${rejectReason}`
      });
      setActionSuccess(`Job post marked as Rejected. Reason recorded.`);
      setRejectModalJob(null);
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      console.error(err);
      alert('Failed to reject job post.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSuspend = async (id) => {
    if (window.confirm('Are you sure you want to suspend/unpublish this job post?')) {
      setIsProcessing(true);
      try {
        await updateListing(id, { status: 'Suspended' });
        setActionSuccess('Job post suspended successfully.');
        setTimeout(() => setActionSuccess(''), 4000);
      } catch (err) {
        console.error(err);
        alert('Failed to suspend job post.');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this job post from database? This cannot be undone.')) {
      setIsProcessing(true);
      try {
        await deleteListing(id);
        setActionSuccess('Job post permanently deleted from database.');
        setTimeout(() => setActionSuccess(''), 4000);
      } catch (err) {
        console.error(err);
        alert('Failed to delete job post.');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="bg-brand-navy text-white rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Full Quality Assurance & Moderation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Job & Internship Moderation Queue
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Review, verify, approve, reject, or manage all employer job and internship submissions across the platform.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-3 rounded-2xl bg-white/10 border border-white/15 text-center">
            <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">Pending Review</span>
            <span className="text-xl font-extrabold text-white">{pendingCount}</span>
          </div>
          <div className="px-4 py-3 rounded-2xl bg-white/10 border border-white/15 text-center">
            <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider block">Total Active</span>
            <span className="text-xl font-extrabold text-white">{activeCount}</span>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold flex items-center gap-3 shadow-md animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Total Submissions</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-brand-navy">{totalListings}</h3>
          <span className="text-[11px] text-slate-400 font-medium">All jobs & internships</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Active & Live</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Check className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-emerald-600">{activeCount}</h3>
          <span className="text-[11px] text-emerald-700 font-semibold">Published on candidate feed</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Pending Review</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-amber-500">{pendingCount}</h3>
          <span className="text-[11px] text-amber-700 font-semibold">Requires verification</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Internships</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-indigo-600">{internshipCount}</h3>
          <span className="text-[11px] text-indigo-700 font-semibold">Graduate & trainee openings</span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-card space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          
          {/* Search Box */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by job title, company, category, location..."
              className="w-full pl-10 p-2.5 text-xs rounded-2xl border border-slate-200 focus:outline-none focus:border-brand-accent font-medium"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white font-semibold"
            >
              <option value="All">All Types (Jobs & Internships)</option>
              <option value="Job">Full-Time / Part-Time Jobs</option>
              <option value="Internship">Internships Only</option>
            </select>
          </div>

          {/* Work Model Filter */}
          <div>
            <select
              value={workModelFilter}
              onChange={(e) => setWorkModelFilter(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white font-semibold"
            >
              <option value="All">All Work Models</option>
              <option value="Remote">Remote</option>
              <option value="On-site">On-site</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
        </div>

        {/* Status Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500 shrink-0">Moderation Status:</span>
          {['All', 'Active', 'Pending', 'Rejected', 'Suspended'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-brand-navy text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Queue List */}
      {filteredListings.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-card space-y-3">
          <Briefcase className="w-12 h-12 mx-auto text-slate-300" />
          <h3 className="text-base font-bold text-brand-navy">No Job Submissions Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No listings matched your active filters or search criteria.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredListings.map((item) => {
            const rawStatus = item.status || 'Active';
            const isActive = rawStatus === 'Active' || rawStatus === 'Approved';
            const isPending = rawStatus === 'Pending' || rawStatus === 'Under Review';
            const isRejected = rawStatus === 'Rejected';
            const isSuspended = rawStatus === 'Suspended' || rawStatus === 'Closed';

            return (
              <div 
                key={item.id} 
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card hover:border-slate-300 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5"
              >
                {/* Left Info */}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center shadow-sm">
                    {item.logo ? (
                      <img src={item.logo} alt={item.company} className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="w-7 h-7 text-slate-400" />
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-extrabold text-brand-navy">{item.company}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      <span className="text-xs font-semibold text-purple-600">{item.category}</span>
                      {item.categoryType === 'Internship' && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          INTERNSHIP
                        </span>
                      )}
                      {item.featured && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200">
                          BOOSTED
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-extrabold text-brand-navy">
                      {item.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                      <span>{item.type || 'Full-Time'}</span>
                      <span>•</span>
                      <span>{item.workModel || item.location}</span>
                      <span>•</span>
                      <span className="font-bold text-slate-700">{item.salary}</span>
                      <span>•</span>
                      <span className="text-[11px] text-slate-400">Posted: {item.postedDate || 'Recent'}</span>
                    </div>
                  </div>
                </div>

                {/* Right Status & Action Controls */}
                <div className="flex flex-wrap items-center gap-3 shrink-0 justify-between lg:justify-end border-t lg:border-t-0 pt-4 lg:pt-0">
                  
                  {/* Status Badge */}
                  <span className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold border ${
                    isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    isPending ? 'bg-amber-50 text-amber-800 border-amber-200' :
                    isRejected ? 'bg-rose-50 text-rose-700 border-rose-200' :
                    'bg-slate-100 text-slate-700 border-slate-300'
                  }`}>
                    {rawStatus}
                  </span>

                  {/* Actions Group */}
                  <div className="flex items-center gap-2">
                    
                    {/* View Details */}
                    <button
                      type="button"
                      onClick={() => setSelectedJob(item)}
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                      title="View Full Job Description"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Approve Button if not active */}
                    {!isActive && (
                      <button
                        type="button"
                        onClick={() => handleApprove(item.id)}
                        disabled={isProcessing}
                        className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>Approve Post</span>
                      </button>
                    )}

                    {/* Reject Button if not rejected */}
                    {!isRejected && (
                      <button
                        type="button"
                        onClick={() => setRejectModalJob(item)}
                        disabled={isProcessing}
                        className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold transition-colors cursor-pointer"
                        title="Reject Post"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}

                    {/* Suspend Button if Active */}
                    {isActive && (
                      <button
                        type="button"
                        onClick={() => handleSuspend(item.id)}
                        disabled={isProcessing}
                        className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-amber-50 hover:text-amber-700 text-slate-600 text-xs font-semibold transition-colors cursor-pointer"
                        title="Suspend / Close Job"
                      >
                        Suspend
                      </button>
                    )}

                    {/* Permanent Delete */}
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      disabled={isProcessing}
                      className="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete Permanently"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Rejection Reason */}
      {rejectModalJob && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                <h3 className="text-base font-extrabold text-brand-navy">Reject Job Submission</h3>
              </div>
              <button
                onClick={() => setRejectModalJob(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-bold text-brand-navy">{rejectModalJob.title}</h4>
              <p className="text-xs text-slate-500">Submitted by: {rejectModalJob.company}</p>
            </div>

            <form onSubmit={handleRejectConfirm} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-brand-navy mb-1.5">Select Reason for Rejection</label>
                <select
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white font-medium"
                >
                  <option value="Incomplete job requirements or contact details.">Incomplete job requirements</option>
                  <option value="Violates platform recruitment policy or terms.">Violates recruitment policies</option>
                  <option value="Duplicate or spam job posting.">Duplicate or spam posting</option>
                  <option value="Inappropriate salary or unverified company credentials.">Unverified company credentials</option>
                  <option value="Other administrative review reasons.">Other administrative reasons</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-navy mb-1">Custom Note to Employer</label>
                <textarea
                  rows={2}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectModalJob(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>Confirm Rejection</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Job Details View */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                  {selectedJob.logo ? <img src={selectedJob.logo} alt="" className="w-full h-full object-cover" /> : <Building2 className="w-6 h-6 text-slate-400" />}
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-brand-navy">{selectedJob.title}</h3>
                  <p className="text-xs text-brand-accent font-semibold">{selectedJob.company}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Type</span>
                  <span className="font-bold text-brand-navy">{selectedJob.type}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Category</span>
                  <span className="font-bold text-brand-navy">{selectedJob.category}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Location</span>
                  <span className="font-bold text-brand-navy">{selectedJob.location}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Salary</span>
                  <span className="font-bold text-brand-navy">{selectedJob.salary}</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-brand-navy block mb-1">Job Description:</span>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  {selectedJob.description}
                </p>
              </div>

              {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                <div>
                  <span className="font-bold text-brand-navy block mb-1">Requirements & Qualifications:</span>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    {selectedJob.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-xs text-slate-400">Status: <strong>{selectedJob.status || 'Active'}</strong></span>
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
