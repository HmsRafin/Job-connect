import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, CheckCircle2, Clock, Bookmark, ArrowRight, 
  Calendar, FileText, Sparkles, TrendingUp 
} from 'lucide-react';
import { mockStats, mockApplications, mockJobs } from '../../data/mockData';

export default function SeekerDashboard() {
  const recommendedJobs = mockJobs.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-brand-navy text-white rounded-3xl p-8 relative overflow-hidden shadow-xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-teal text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Profile 92% Complete</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Welcome back, Alex!</h1>
          <p className="text-xs sm:text-sm text-slate-300">
            You have <span className="text-white font-bold">1 active interview</span> scheduled for next week with Stripe Global.
          </p>
        </div>

        <Link
          to="/seeker/profile"
          className="px-5 py-3 rounded-2xl bg-brand-accent hover:bg-brand-accentHover text-white font-bold text-xs shadow-md shadow-brand-accent/25 shrink-0 flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          <span>Update CV & Profile</span>
        </Link>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500">Applied Jobs</span>
            <h3 className="text-3xl font-extrabold text-brand-navy">{mockStats.seekerAppliedCount}</h3>
            <span className="text-[10px] text-emerald-600 font-semibold">+2 this week</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-accent flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500">Interviews Scheduled</span>
            <h3 className="text-3xl font-extrabold text-brand-accent">{mockStats.seekerInterviewsCount}</h3>
            <span className="text-[10px] text-brand-accent font-semibold">Active stage</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500">Saved Positions</span>
            <h3 className="text-3xl font-extrabold text-brand-teal">{mockStats.seekerSavedCount}</h3>
            <span className="text-[10px] text-slate-400 font-semibold">Bookmarked</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-brand-teal flex items-center justify-center">
            <Bookmark className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Grid: Recent Applications Activity & Recommended Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Applications Feed */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-brand-navy">Recent Applications</h3>
            <Link to="/seeker/applications" className="text-xs font-bold text-brand-accent hover:underline">
              View All Tracker
            </Link>
          </div>

          <div className="space-y-4">
            {mockApplications.map((app) => (
              <div
                key={app.id}
                className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 flex items-center justify-between gap-4"
              >
                <div>
                  <h4 className="text-xs font-bold text-brand-navy">{app.jobTitle}</h4>
                  <p className="text-[11px] text-slate-500">{app.company} • Applied {app.appliedDate}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                  app.status === 'Interviewing' ? 'bg-blue-100 text-blue-700' :
                  app.status === 'Accepted' ? 'bg-emerald-100 text-emerald-700' :
                  app.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-700'
                }`}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Jobs for Alex */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-brand-navy flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-accent" />
              <span>Recommended for You</span>
            </h3>
            <Link to="/jobs" className="text-xs font-bold text-brand-accent hover:underline">
              Explore
            </Link>
          </div>

          <div className="space-y-3">
            {recommendedJobs.map((j) => (
              <div key={j.id} className="p-3.5 rounded-2xl border border-slate-100 hover:border-brand-accent/30 bg-white transition-all space-y-2">
                <div className="flex items-center gap-3">
                  <img src={j.logo} alt={j.company} className="w-9 h-9 rounded-xl object-cover" />
                  <div>
                    <h5 className="text-xs font-bold text-brand-navy">{j.title}</h5>
                    <p className="text-[10px] text-slate-500">{j.company} • {j.salary}</p>
                  </div>
                </div>
                <Link
                  to={`/jobs/${j.id}`}
                  className="w-full py-1.5 rounded-xl bg-slate-100 hover:bg-brand-accent hover:text-white text-[11px] font-bold text-slate-700 transition-colors flex items-center justify-center gap-1"
                >
                  <span>Apply Quick</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
