import React, { useState } from 'react';
import { 
  Zap, Building2, Briefcase, Calendar, Clock, DollarSign, 
  Search, Filter, CheckCircle2, AlertCircle, Trash2, 
  ExternalLink, Eye, RefreshCw, ChevronRight, X, Sparkles,
  TrendingUp, Users, ArrowUpRight, ShieldCheck, Check
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export default function FeaturedBoostedPosts() {
  const { listings, boostListing, cancelBoost, updateListing, boostPricing } = usePlatform();

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // All, Active, Expired
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modals
  const [selectedJob, setSelectedJob] = useState(null);
  const [extendModalJob, setExtendModalJob] = useState(null);
  const [extendDays, setExtendDays] = useState(7);
  const [extendPrice, setExtendPrice] = useState(59);
  const [actionSuccess, setActionSuccess] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter ONLY Boosted / Featured posts
  const boostedListings = listings.filter(job => {
    const isBoosted = Boolean(job.featured) || (Number(job.boostedDays) > 0) || Boolean(job.boostExpiry);
    return isBoosted;
  });

  // Calculate Expiry Status
  const getBoostStatus = (job) => {
    if (!job.featured && !job.boostExpiry) return { label: 'Inactive', color: 'bg-slate-100 text-slate-600', active: false };
    
    if (job.boostExpiry) {
      const expDate = new Date(job.boostExpiry);
      const now = new Date();
      if (expDate < now) {
        return { label: 'Boost Expired', color: 'bg-amber-100 text-amber-800 border-amber-300', active: false };
      }
      const daysLeft = Math.ceil((expDate - now) / (1000 * 60 * 60 * 24));
      return { label: `Active (${daysLeft}d left)`, color: 'bg-emerald-100 text-emerald-800 border-emerald-300', active: true };
    }

    return { label: 'Active (Pinned)', color: 'bg-emerald-100 text-emerald-800 border-emerald-300', active: true };
  };

  // Applied Filtered Boosted Listings
  const filteredListings = boostedListings.filter(job => {
    const matchesSearch = 
      (job.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.location || '').toLowerCase().includes(searchTerm.toLowerCase());

    const boostStatus = getBoostStatus(job);
    const matchesStatus = 
      statusFilter === 'All' ? true :
      statusFilter === 'Active' ? boostStatus.active :
      statusFilter === 'Expired' ? !boostStatus.active : true;

    const matchesCategory = categoryFilter === 'All' || job.category === categoryFilter || job.categoryType === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Metrics
  const totalBoosted = boostedListings.length;
  const activeBoosted = boostedListings.filter(j => getBoostStatus(j).active).length;
  const expiredBoosted = totalBoosted - activeBoosted;
  const totalRevenue = boostedListings.reduce((sum, j) => sum + ((j.boostedDays || 7) * 8.5), 0);

  // Unique categories
  const categoriesList = ['All', ...new Set(boostedListings.map(j => j.category).filter(Boolean))];

  // Handle Cancel Boost
  const handleCancelBoost = async (jobId) => {
    if (window.confirm('Are you sure you want to cancel the featured/boosted status for this job? It will revert to a standard listing.')) {
      setIsProcessing(true);
      try {
        await cancelBoost(jobId);
        setActionSuccess('Featured boost status cancelled successfully.');
        setTimeout(() => setActionSuccess(''), 4000);
      } catch (err) {
        console.error(err);
        alert('Failed to cancel boost status.');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // Handle Extend Boost Submit
  const handleExtendBoostSubmit = async (e) => {
    e.preventDefault();
    if (!extendModalJob) return;

    setIsProcessing(true);
    try {
      await boostListing(extendModalJob.id, extendDays, extendPrice, {
        title: `Admin Boost Extension: ${extendModalJob.title}`,
        paymentMethod: 'Admin Override'
      });
      setActionSuccess(`Boost extended for ${extendDays} days successfully in database!`);
      setExtendModalJob(null);
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      console.error(err);
      alert('Failed to extend boost.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Monetized Posts & Employer Promotions</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Featured & Boosted Posts Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Monitor and manage paid job promotions, boost active duration, verify transactions, and control featured placements on candidate search feeds.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-3 rounded-2xl bg-white/10 border border-white/15 text-center">
            <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">Active Boosts</span>
            <span className="text-xl font-extrabold text-white">{activeBoosted} Live</span>
          </div>
          <div className="px-4 py-3 rounded-2xl bg-white/10 border border-white/15 text-center">
            <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider block">Total Boosts</span>
            <span className="text-xl font-extrabold text-white">{totalBoosted} Posts</span>
          </div>
        </div>
      </div>

      {/* Success Banner */}
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
            <span>Total Featured Posts</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Zap className="w-4 h-4 fill-amber-500" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-brand-navy">{totalBoosted}</h3>
          <span className="text-[11px] text-slate-400 font-medium">All-time boosted listings</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Currently Active Live</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-emerald-600">{activeBoosted}</h3>
          <span className="text-[11px] text-emerald-700 font-semibold">Generating top impressions</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Expired Promotions</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-700">{expiredBoosted}</h3>
          <span className="text-[11px] text-slate-400 font-medium">Eligible for renewal</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Estimated Boost Value</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-indigo-600">${Math.round(totalRevenue)}</h3>
          <span className="text-[11px] text-indigo-700 font-semibold">Promotion fees recorded</span>
        </div>
      </div>

      {/* Search & Filtering Controls */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-card space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by job title, company name, location or keywords..."
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

          {/* Filter Status Tabs */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 shrink-0">Status:</span>
            {['All', 'Active', 'Expired'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === st 
                    ? 'bg-brand-navy text-white shadow-sm' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 shrink-0">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="p-2.5 text-xs rounded-xl border border-slate-200 bg-white font-semibold"
            >
              {categoriesList.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Boosted Posts Listing */}
      {filteredListings.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-card space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
            <Zap className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-brand-navy">No Featured / Boosted Posts Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {boostedListings.length === 0
                ? "No employers have boosted any job posts yet. When recruiters purchase a boost package, their listings will appear here."
                : "No boosted posts match your active search and filter criteria."}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredListings.map((job) => {
            const status = getBoostStatus(job);
            return (
              <div
                key={job.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card hover:border-amber-300 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden group"
              >
                {/* Left accent indicator for boosted status */}
                <div className={`absolute top-0 left-0 bottom-0 w-2 ${status.active ? 'bg-amber-400' : 'bg-slate-300'}`} />

                {/* Company & Job Info */}
                <div className="flex items-start gap-4 pl-2">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center shadow-sm">
                    {job.logo ? (
                      <img src={job.logo} alt={job.company} className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="w-7 h-7 text-slate-400" />
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-extrabold text-brand-navy">{job.company}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                        <Zap className="w-3 h-3 fill-amber-500" />
                        FEATURED PROMOTION
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${status.color}`}>
                        {status.label}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-extrabold text-brand-navy">
                      {job.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                      <span>{job.categoryType || 'Job'}</span>
                      <span>•</span>
                      <span>{job.category}</span>
                      <span>•</span>
                      <span>{job.workModel || job.location}</span>
                      <span>•</span>
                      <span className="font-bold text-slate-700">{job.salary}</span>
                    </div>
                  </div>
                </div>

                {/* Boost Stats & Controls */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 lg:border-l lg:border-slate-100 lg:pl-6 shrink-0 justify-between lg:justify-end">
                  
                  {/* Boost Metadata */}
                  <div className="space-y-1 text-left sm:text-right text-xs">
                    <div className="flex items-center sm:justify-end gap-1 text-slate-600 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Duration: {job.boostedDays || 7} Days</span>
                    </div>
                    {job.boostExpiry && (
                      <span className="text-[11px] text-slate-400 block">
                        Expires: {new Date(job.boostExpiry).toLocaleDateString()}
                      </span>
                    )}
                    <div className="flex items-center sm:justify-end gap-1 text-emerald-600 font-bold text-[11px]">
                      <Users className="w-3.5 h-3.5" />
                      <span>{job.applicationsCount || 0} Applicants Received</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedJob(job)}
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                      title="View Full Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setExtendModalJob(job);
                        setExtendDays(7);
                        setExtendPrice(59);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Extend Boost</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCancelBoost(job.id)}
                      disabled={isProcessing}
                      className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold transition-colors cursor-pointer"
                      title="Cancel Boost & Demote to Standard"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Extend Boost */}
      {extendModalJob && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                <h3 className="text-base font-extrabold text-brand-navy">Extend Featured Boost</h3>
              </div>
              <button
                onClick={() => setExtendModalJob(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-xs text-slate-500 block">Extending promotion for:</span>
              <h4 className="text-sm font-bold text-brand-navy">{extendModalJob.title}</h4>
              <p className="text-xs text-brand-accent font-semibold">{extendModalJob.company}</p>
            </div>

            <form onSubmit={handleExtendBoostSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-brand-navy mb-1.5">Select Extension Duration</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { days: 7, price: 59, label: '7 Days' },
                    { days: 15, price: 99, label: '15 Days' },
                    { days: 30, price: 169, label: '30 Days' },
                  ].map(tier => (
                    <button
                      key={tier.days}
                      type="button"
                      onClick={() => {
                        setExtendDays(tier.days);
                        setExtendPrice(tier.price);
                      }}
                      className={`p-3 rounded-2xl text-xs font-bold border transition-all text-center cursor-pointer ${
                        extendDays === tier.days
                          ? 'bg-amber-500 text-white border-amber-600 shadow-md'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span className="block">{tier.label}</span>
                      <span className={`text-[10px] block mt-0.5 ${extendDays === tier.days ? 'text-amber-100' : 'text-slate-500'}`}>${tier.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
                <span className="font-bold block">Promotion Benefit:</span>
                <p className="text-[11px] text-slate-600">
                  This post will receive priority pinning at the top of candidate search results with a highlighted Featured badge.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setExtendModalJob(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-6 py-2.5 rounded-xl bg-brand-navy hover:bg-slate-800 text-white text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{isProcessing ? 'Extending...' : 'Confirm & Save'}</span>
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
                  <span className="font-bold text-brand-navy block mb-1">Requirements:</span>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    {selectedJob.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end pt-4 border-t border-slate-100">
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
