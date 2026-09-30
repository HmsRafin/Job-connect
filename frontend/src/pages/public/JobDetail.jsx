import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Building2, MapPin, DollarSign, Calendar, Briefcase, 
  CheckCircle2, Globe, Users, ArrowLeft, Bookmark, Share2, Send, ExternalLink 
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import ApplyModal from '../../components/common/ApplyModal';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { listings, savedJobIds, toggleSaveJob } = usePlatform();
  const [activeTab, setActiveTab] = useState('overview');
  const [isApplyOpen, setIsApplyOpen] = useState(false);

  const job = listings.find(j => String(j.id) === String(id));
  const isSaved = job ? savedJobIds.includes(job.id) : false;
  const relatedJobs = job ? listings.filter(j => j.id !== job.id).slice(0, 3) : [];

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <Briefcase className="w-16 h-16 mx-auto text-slate-300" />
        <h2 className="text-2xl font-extrabold text-brand-navy">Position Not Found</h2>
        <p className="text-xs text-slate-500">The listing you are looking for may have been removed or has expired.</p>
        <Link
          to="/jobs"
          className="inline-block px-6 py-2.5 bg-brand-accent text-white rounded-xl font-bold text-xs shadow-md"
        >
          Explore All Openings
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-brand-navy transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to search results</span>
      </button>

      {/* Main Job Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <img
              src={job.logo || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=120&q=80'}
              alt={job.company}
              className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-500">{job.company}</h4>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span className="text-[10px] font-semibold text-emerald-600">Active Opening</span>
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
                  Posted {job.postedDate || 'recently'}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleSaveJob(job.id)}
              className={`p-3.5 rounded-2xl border transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-amber-50 border-amber-200 text-amber-500'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Bookmark className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsApplyOpen(true)}
              className="px-8 py-3.5 rounded-2xl bg-brand-accent hover:bg-brand-accentHover text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-accent/25 hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Apply for Position</span>
            </button>
          </div>
        </div>

        {/* Highlight Badges */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-brand-accent border border-blue-100">
            {job.type}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-brand-teal border border-teal-100">
            {job.workModel}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-100">
            {job.experience}
          </span>
          {job.featured && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
              ★ Featured Opportunity
            </span>
          )}
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Job Details */}
        <div className="lg:col-span-8 space-y-8">
          {/* Navigation Sub-Tabs */}
          <div className="flex border-b border-slate-200">
            {['overview', 'responsibilities', 'requirements'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-6 text-xs sm:text-sm font-bold capitalize transition-all border-b-2 cursor-pointer ${
                  activeTab === tab
                    ? 'border-brand-accent text-brand-navy'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-brand-navy">About the Role</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {job.description}
                </p>
              </div>
            )}

            {activeTab === 'responsibilities' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-brand-navy">Core Responsibilities</h3>
                <ul className="space-y-2.5">
                  {(job.responsibilities || [
                    'Collaborate closely with product team to deliver high-quality features.',
                    'Write clean, maintainable, and well-tested code.',
                    'Participate in code reviews and architecture planning sessions.'
                  ]).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-brand-teal shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'requirements' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-brand-navy">Role Requirements</h3>
                <ul className="space-y-2.5">
                  {(job.requirements || [
                    'Demonstrated experience in modern development workflows.',
                    'Strong problem-solving and analytical thinking skills.',
                    'Solid communication and collaborative teamwork abilities.'
                  ]).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Company Snapshot */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-5">
            <h3 className="text-sm font-bold text-brand-navy uppercase tracking-wider">
              About {job.company}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {job.companyInfo?.about || `${job.company} is a verified employer on JobConnect hiring top talent.`}
            </p>

            <div className="space-y-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Company Size</span>
                <span className="font-semibold text-brand-navy">{job.companyInfo?.size || 'Enterprise'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Industry</span>
                <span className="font-semibold text-brand-navy">{job.category || 'Technology'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <ApplyModal
        job={job}
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
      />
    </div>
  );
}
