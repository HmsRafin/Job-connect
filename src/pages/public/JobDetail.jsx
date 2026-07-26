import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Building2, MapPin, DollarSign, Calendar, Briefcase, 
  CheckCircle2, Globe, Users, ArrowLeft, Bookmark, Share2, Send, ExternalLink 
} from 'lucide-react';
import { mockJobs } from '../../data/mockData';
import ApplyModal from '../../components/common/ApplyModal';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const job = mockJobs.find(j => j.id === id) || mockJobs[0];

  const relatedJobs = mockJobs.filter(j => j.id !== job.id).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-brand-navy transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to search results</span>
      </button>

      {/* Main Job Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <img
              src={job.logo}
              alt={job.company}
              className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-500">{job.company}</h4>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span className="text-[10px] font-semibold text-emerald-600">Actively Hiring</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy mt-1">
                {job.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-brand-accent" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-brand-teal" />
                  {job.salary}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  Posted {job.postedDate}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`p-3 rounded-2xl border transition-colors ${
                isSaved
                  ? 'bg-brand-accent text-white border-brand-accent'
                  : 'bg-slate-50 text-slate-500 hover:text-brand-navy border-slate-200'
              }`}
            >
              <Bookmark className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsApplyOpen(true)}
              className="px-6 py-3.5 rounded-2xl bg-brand-accent hover:bg-brand-accentHover text-white font-bold text-sm shadow-md shadow-brand-accent/25 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Apply Now</span>
            </button>
          </div>
        </div>

        {/* Pill Badges */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-brand-accent border border-blue-100">
            {job.type}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
            {job.workModel}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-100">
            {job.category}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
            {job.experience}
          </span>
        </div>
      </div>

      {/* Grid: Content & Sticky Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Tabbed Information */}
        <main className="lg:col-span-8 space-y-6">
          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 bg-white px-4 rounded-2xl border shadow-sm">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'responsibilities', label: 'Responsibilities' },
              { id: 'requirements', label: 'Requirements' },
              { id: 'company', label: 'About Company' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-5 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-brand-accent text-brand-accent'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Box */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-brand-navy mb-2">Role Overview</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {job.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wider mb-3">Key Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'responsibilities' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-brand-navy">Core Responsibilities</h3>
                <div className="space-y-3">
                  {job.responsibilities.map((resp, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-600 leading-relaxed">{resp}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'requirements' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-brand-navy">Requirements & Qualifications</h3>
                <div className="space-y-3">
                  {job.requirements.map((req, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-brand-teal shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-600 leading-relaxed">{req}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'company' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-brand-navy">{job.companyInfo.about}</h3>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium">Company Size</span>
                    <p className="font-bold text-brand-navy mt-0.5">{job.companyInfo.size}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Founded</span>
                    <p className="font-bold text-brand-navy mt-0.5">{job.companyInfo.founded}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Website</span>
                    <a
                      href={job.companyInfo.website}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-brand-accent mt-0.5 flex items-center gap-1 hover:underline"
                    >
                      <span>Visit Web</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Right Sticky Sidebar */}
        <aside className="lg:col-span-4 space-y-6 sticky top-28">
          {/* Quick Apply Card */}
          <div className="bg-brand-navy text-white rounded-3xl p-6 shadow-xl border border-white/10 space-y-4">
            <h4 className="text-base font-bold text-white">Ready to apply?</h4>
            <p className="text-xs text-slate-300">
              Submit your resume directly to the lead hiring team at {job.company}.
            </p>
            <button
              onClick={() => setIsApplyOpen(true)}
              className="w-full py-3.5 rounded-2xl bg-brand-accent hover:bg-brand-accentHover text-white font-bold text-xs shadow-md shadow-brand-accent/25 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Apply Now with Profile</span>
            </button>
          </div>

          {/* Related Positions */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-4">
            <h4 className="text-sm font-bold text-brand-navy">Similar Openings</h4>
            <div className="space-y-3">
              {relatedJobs.map((rj) => (
                <Link
                  key={rj.id}
                  to={`/jobs/${rj.id}`}
                  className="block p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all space-y-1"
                >
                  <h5 className="text-xs font-bold text-brand-navy truncate">{rj.title}</h5>
                  <p className="text-[11px] text-slate-500">{rj.company} • {rj.salary}</p>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <ApplyModal
        job={job}
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
      />
    </div>
  );
}
