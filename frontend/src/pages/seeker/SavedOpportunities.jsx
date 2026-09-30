import React from 'react';
import { Bookmark, Search, ArrowRight, Zap, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePlatform } from '../../context/PlatformContext';

export default function SavedOpportunities() {
  const { listings, savedJobIds, toggleSaveJob } = usePlatform();
  const savedItems = listings.filter(j => savedJobIds.includes(j.id));

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-brand-navy text-white rounded-3xl p-8 border border-white/10 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold text-brand-teal uppercase tracking-widest flex items-center gap-1.5">
            <Bookmark className="w-3.5 h-3.5" />
            Bookmarked Roles
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Saved Opportunities</h1>
          <p className="text-xs text-slate-300">Keep track of jobs and internships you intend to apply for.</p>
        </div>

        <div className="text-right">
          <span className="text-3xl font-black text-brand-accent">{savedItems.length}</span>
          <span className="text-xs text-slate-400 block font-semibold">Saved Items</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-4">
        <h3 className="text-lg font-bold text-brand-navy border-b border-slate-100 pb-4">Bookmarked Listings</h3>

        {savedItems.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs space-y-3">
            <Bookmark className="w-8 h-8 mx-auto text-slate-300" />
            <p>You haven't bookmarked any opportunities yet.</p>
            <Link to="/jobs" className="inline-block px-4 py-2 bg-brand-accent text-white rounded-xl text-xs font-bold">
              Browse Opportunities
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {savedItems.map((job) => (
              <div key={job.id} className="p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <img src={job.logo} alt={job.company} className="w-12 h-12 rounded-xl object-cover border border-slate-100 shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{job.company}</span>
                    <h4 className="text-base font-bold text-brand-navy">{job.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{job.location} • {job.salary}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleSaveJob(job.id)}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 border border-rose-100 text-xs font-semibold"
                  >
                    Remove Bookmark
                  </button>
                  <Link
                    to={`/jobs/${job.id}`}
                    className="px-4 py-2 rounded-xl bg-brand-accent text-white font-bold text-xs hover:bg-brand-accentHover shadow-sm"
                  >
                    View Position
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
