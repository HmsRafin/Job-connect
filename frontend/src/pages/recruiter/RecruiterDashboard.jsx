import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, Users, UserCheck, UserX, PlusCircle, 
  ArrowRight, GitCommit, CheckCircle2, Clock, Zap, Building, ChevronRight 
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export default function RecruiterDashboard() {
  const { currentUser, myListings = [], myApplications = [] } = usePlatform();

  const currentComp = currentUser?.companyName || currentUser?.name || 'Your Company';

  const totalJobsCount = myListings.length;
  const activeJobsCount = myListings.filter(l => l.status === 'Active').length;
  const totalApplicantsCount = myApplications.length;
  const hiredCount = myApplications.filter(a => a.stage === 'Hired').length;
  const rejectedCount = myApplications.filter(a => a.stage === 'Rejected').length;
  const inReviewCount = myApplications.filter(a => a.stage !== 'Hired' && a.stage !== 'Rejected').length;

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-brand-navy text-white rounded-3xl p-8 border border-white/10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-semibold">
            <Building className="w-3.5 h-3.5" />
            <span>Employer Overview Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome, {currentComp}!
          </h1>
          <p className="text-xs text-slate-300">
            Real-time confidential hiring performance, applicant tracking, and vacancy management.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/recruiter/profile"
            className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/10 transition-colors"
          >
            Company Profile
          </Link>
          <Link
            to="/recruiter/jobs/create"
            className="px-5 py-3 rounded-2xl bg-brand-accent hover:bg-brand-accentHover text-white font-bold text-xs shadow-md shadow-brand-accent/25 flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Job</span>
          </Link>
        </div>
      </div>

      {/* 4 Core Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Jobs Posted */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500">Jobs Posted</span>
            <h3 className="text-3xl font-extrabold text-brand-navy">{totalJobsCount}</h3>
            <span className="text-[10px] text-emerald-600 font-semibold">{activeJobsCount} Active Vacancies</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-accent flex items-center justify-center font-bold">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        {/* Total Applicants Received */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500">Total Applicants</span>
            <h3 className="text-3xl font-extrabold text-brand-accent">{totalApplicantsCount}</h3>
            <span className="text-[10px] text-indigo-600 font-semibold">{inReviewCount} In Pipeline</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Candidates Hired */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500">Candidates Hired</span>
            <h3 className="text-3xl font-extrabold text-emerald-600">{hiredCount}</h3>
            <span className="text-[10px] text-emerald-600 font-semibold">Accepted Offers</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Candidates Rejected */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500">Candidates Rejected</span>
            <h3 className="text-3xl font-extrabold text-rose-500">{rejectedCount}</h3>
            <span className="text-[10px] text-rose-500 font-semibold">Not Selected</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center font-bold">
            <UserX className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recruitment Funnel Breakdown */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-brand-navy">Candidate Recruitment Funnel</h3>
            <p className="text-xs text-slate-500">Confidential stage overview for internal hiring decisions.</p>
          </div>
          <Link
            to="/recruiter/pipeline"
            className="text-xs font-bold text-brand-accent hover:underline flex items-center gap-1"
          >
            <span>Open Pipeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Received</span>
            <p className="text-2xl font-black text-brand-navy">{totalApplicantsCount}</p>
            <span className="text-[10px] text-slate-500">100% of funnel</span>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-1">
            <span className="text-[11px] font-bold text-brand-accent uppercase">Under Screening</span>
            <p className="text-2xl font-black text-brand-accent">{inReviewCount}</p>
            <span className="text-[10px] text-brand-accent font-medium">In Assessment / Interview</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-1">
            <span className="text-[11px] font-bold text-emerald-700 uppercase">Hired</span>
            <p className="text-2xl font-black text-emerald-700">{hiredCount}</p>
            <span className="text-[10px] text-emerald-600 font-medium">Placed Candidates</span>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-1">
            <span className="text-[11px] font-bold text-rose-700 uppercase">Rejected</span>
            <p className="text-2xl font-black text-rose-700">{rejectedCount}</p>
            <span className="text-[10px] text-rose-600 font-medium">Closed Files</span>
          </div>
        </div>
      </div>

      {/* Active Jobs & Recent Submissions Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-brand-navy">Active Job Postings Overview</h3>
          <Link
            to="/recruiter/jobs"
            className="text-xs font-bold text-brand-accent hover:underline flex items-center gap-1"
          >
            <span>Manage All Jobs ({myListings.length})</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {myListings.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400 space-y-2">
            <Briefcase className="w-8 h-8 mx-auto text-slate-300" />
            <p>No job postings published yet.</p>
            <Link to="/recruiter/jobs/create" className="text-xs font-bold text-brand-accent hover:underline inline-block mt-1">
              Create Your First Job Listing
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {myListings.slice(0, 5).map((job) => {
              const jobApps = myApplications.filter(a => String(a.jobId) === String(job.id)).length;
              return (
                <div key={job.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-brand-navy">{job.title}</h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        job.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {job.status || 'Active'}
                      </span>
                      {job.featured && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                          <Zap className="w-3 h-3 fill-current text-amber-500" />
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{job.location} • {job.type} • {job.salary}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-brand-navy px-3 py-1.5 rounded-xl bg-slate-100">
                      {jobApps || job.applicationsCount || 0} Applicants
                    </span>
                  <Link
                    to="/recruiter/applicants"
                    className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-brand-accent hover:bg-blue-100 text-xs font-bold transition-colors"
                  >
                    View Applicants
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>
    </div>
  );
}
