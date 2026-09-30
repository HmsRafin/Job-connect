import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, CheckCircle2, Clock, Bookmark, ArrowRight, 
  Calendar, FileText, Sparkles, TrendingUp, Eye 
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { useAuth } from '../../context/AuthContext';

export default function SeekerDashboard() {
  const { currentUser, applications, interviews, savedJobIds, listings } = usePlatform();
  const { user } = useAuth();
  const activeUser = currentUser || user;
  const recommendedJobs = listings.slice(0, 3);
  
  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="bg-brand-navy text-white rounded-3xl p-8 border border-blue-500/20 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/40 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Job Seeker Candidate Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Welcome back, {activeUser?.name || 'Job Seeker'}!</h1>
          <p className="text-xs sm:text-sm text-slate-300">
            {interviews.length > 0 ? (
              <>You have <span className="text-white font-bold">{interviews.length} active interview(s)</span> scheduled.</>
            ) : applications.length > 0 ? (
              <>You have <span className="text-white font-bold">{applications.length} submitted application(s)</span> being reviewed.</>
            ) : (
              <>Explore verified positions and submit your applications to connect with top employers.</>
            )}
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
            <h3 className="text-3xl font-extrabold text-brand-navy">{applications.length}</h3>
            <span className="text-[10px] text-emerald-600 font-semibold">Active Submissions</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-accent flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500">Interviews Scheduled</span>
            <h3 className="text-3xl font-extrabold text-brand-accent">{interviews.length}</h3>
            <span className="text-[10px] text-brand-accent font-semibold">Scheduled Sessions</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500">Saved Positions</span>
            <h3 className="text-3xl font-extrabold text-brand-teal">{savedJobIds.length}</h3>
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

          {applications.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs space-y-3">
              <Briefcase className="w-8 h-8 mx-auto text-slate-300" />
              <p>You haven't submitted any job applications yet.</p>
              <Link to="/jobs" className="inline-block px-4 py-2 bg-brand-accent text-white rounded-xl text-xs font-bold">
                Browse Open Opportunities
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.slice(0, 5).map((app) => (
                <div
                  key={app.id}
                  className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 flex items-center justify-between gap-4"
                >
                  <div>
                    <h4 className="text-xs font-bold text-brand-navy">{app.jobTitle}</h4>
                    <p className="text-[11px] text-slate-500">{app.company} • Applied {app.appliedDate}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                    app.stage === 'Interview Scheduled' ? 'bg-blue-100 text-blue-700' :
                    app.stage === 'Hired' ? 'bg-emerald-100 text-emerald-700' :
                    app.stage === 'Rejected' ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {app.stage}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recommended Jobs */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-brand-navy flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-accent" />
              <span>Available Opportunities</span>
            </h3>
            <Link to="/jobs" className="text-xs font-bold text-brand-accent hover:underline">
              Explore All
            </Link>
          </div>

          {recommendedJobs.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs space-y-2">
              <p>No job postings live at the moment.</p>
            </div>
          ) : (
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
                    <span>View & Apply</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
