import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, Plus, Calendar, Clock, MapPin, DollarSign, 
  RotateCcw, XCircle, Sparkles, CheckCircle2, AlertCircle, Briefcase, ArrowRight 
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import BoostModal from '../../components/common/BoostModal';

export default function BoostedPosts() {
  const { listings, currentUser, cancelBoost } = usePlatform();
  const [selectedJob, setSelectedJob] = useState(null);
  const [showBoostModal, setShowBoostModal] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState({ type: '', text: '' });

  const currentComp = currentUser?.companyName || currentUser?.name || '';
  const currentDbId = currentUser?.dbId || (currentUser?.id ? Number(String(currentUser.id).replace('usr-', '')) : null);

  // Filter listings strictly for this company
  const companyListings = listings.filter(l => {
    if (!currentUser) return false;
    if (currentDbId && l.userId && Number(l.userId) === Number(currentDbId)) return true;
    if (currentComp && l.company && l.company.trim().toLowerCase() === currentComp.trim().toLowerCase()) return true;
    return false;
  });

  const boostedPosts = companyListings.filter(l => l.featured);
  const unboostedPosts = companyListings.filter(l => !l.featured);

  const handleOpenBoostModal = (job) => {
    setSelectedJob(job);
    setShowBoostModal(true);
  };

  const handleCancelBoost = async (jobId, title) => {
    if (window.confirm(`Are you sure you want to cancel the featured boost for "${title}"?`)) {
      try {
        await cancelBoost(jobId);
        setFeedbackMsg({
          type: 'success',
          text: `Boost status cancelled for "${title}". The post will return to standard listing.`
        });
        setTimeout(() => setFeedbackMsg({ type: '', text: '' }), 4000);
      } catch (err) {
        console.error(err);
        setFeedbackMsg({ type: 'error', text: 'Failed to cancel boost status.' });
      }
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-brand-navy text-white rounded-3xl p-8 border border-white/10 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-1">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Search Ranking & Visibility Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Boosted & Standard Job Postings</h1>
          <p className="text-xs text-slate-300">
            Featured boosted posts appear with priority placement at the top of candidate search queries.
          </p>
        </div>

        <Link
          to="/recruiter/jobs/create"
          className="px-6 py-3.5 rounded-2xl bg-brand-accent hover:bg-brand-accentHover text-white font-bold text-xs shadow-md shadow-brand-accent/25 flex items-center gap-2 cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Job</span>
        </Link>
      </div>

      {/* Feedback Alert */}
      {feedbackMsg.text && (
        <div className={`p-4 rounded-2xl border text-xs font-semibold flex items-center gap-2 animate-fade-in shadow-sm ${
          feedbackMsg.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {feedbackMsg.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Currently Boosted (Featured)</span>
            <span className="text-2xl font-black text-amber-500">{boostedPosts.length}</span>
            <span className="text-[10px] text-amber-600 font-semibold block mt-0.5">Top-Ranked Visibility</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center font-bold">
            <Zap className="w-6 h-6 fill-current" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Standard (Unboosted) Posts</span>
            <span className="text-2xl font-black text-brand-navy">{unboostedPosts.length}</span>
            <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Regular Search Order</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-slate-50 text-slate-600 flex items-center justify-center font-bold">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Total Published Posts</span>
            <span className="text-2xl font-black text-brand-accent">{companyListings.length}</span>
            <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">Live on Platform</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-brand-accent flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* SECTION 1: Active Boosted Job Posts */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shadow-sm">
              <Zap className="w-4 h-4 fill-current text-amber-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-brand-navy">Active Featured Boosted Posts</h3>
              <p className="text-xs text-slate-400">Currently active priority promotions.</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
            {boostedPosts.length} Boosted
          </span>
        </div>

        {boostedPosts.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400 space-y-2 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <Zap className="w-8 h-8 mx-auto text-slate-300" />
            <p className="font-semibold text-slate-600">No active boosted job posts right now.</p>
            <p className="text-[11px] text-slate-400">Boost any of your standard listings below to gain 5x candidate views.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {boostedPosts.map((job) => (
              <div 
                key={job.id} 
                className="p-6 rounded-2xl border-2 border-amber-400/80 bg-gradient-to-br from-amber-50/40 via-white to-amber-50/20 shadow-md space-y-4 relative"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-brand-navy font-black text-[9px] uppercase tracking-wider inline-flex items-center gap-1 shadow-sm">
                      <Zap className="w-3 h-3 fill-current text-brand-navy" />
                      FEATURED ACTIVE
                    </span>
                    <h4 className="text-base font-bold text-brand-navy pt-1">{job.title}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-2 flex-wrap">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {job.salary}</span>
                    </p>
                  </div>
                </div>

                {/* Expiry & Days Info */}
                <div className="p-3 rounded-xl bg-white/80 border border-amber-200 flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Calendar className="w-4 h-4 text-amber-600" />
                    <span>Boost Expiration:</span>
                  </div>
                  <span className="font-bold text-brand-navy">
                    {job.boostExpiry || `${job.boostedDays || 7} Days Active`}
                  </span>
                </div>

                {/* Boost Actions (Renew / Cancel) */}
                <div className="pt-2 flex items-center justify-between gap-3 border-t border-amber-100">
                  <button
                    onClick={() => handleCancelBoost(job.id, job.title)}
                    className="px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Cancel Boost</span>
                  </button>

                  <button
                    onClick={() => handleOpenBoostModal(job)}
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-brand-navy text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Renew / Extend Boost</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: Standard Unboosted Posts */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-brand-accent flex items-center justify-center shadow-sm">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-brand-navy">Standard (Unboosted) Job Postings</h3>
              <p className="text-xs text-slate-400">Published vacancies available for featured boost promotion.</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            {unboostedPosts.length} Standard
          </span>
        </div>

        {unboostedPosts.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400 space-y-2 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500" />
            <p className="font-semibold text-slate-600">All your current job postings are boosted!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {unboostedPosts.map((job) => (
              <div key={job.id} className="py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-100 text-brand-accent uppercase">
                      {job.categoryType || 'Job'}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {job.type}
                    </span>
                    <span className="text-xs text-slate-400">• Posted {job.postedDate}</span>
                  </div>
                  <h4 className="text-base font-bold text-brand-navy">{job.title}</h4>
                  <p className="text-xs text-slate-500">{job.location} ({job.workModel}) • {job.salary}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleOpenBoostModal(job)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-brand-navy font-bold text-xs shadow-md shadow-amber-400/20 flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    <span>Boost this Job</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Boost Modal */}
      {selectedJob && (
        <BoostModal
          isOpen={showBoostModal}
          onClose={() => {
            setShowBoostModal(false);
            setSelectedJob(null);
          }}
          itemTitle={selectedJob.title}
          itemId={selectedJob.id}
        />
      )}
    </div>
  );
}
