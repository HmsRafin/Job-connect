import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, MapPin, Briefcase, ArrowRight, TrendingUp, Sparkles, 
  CheckCircle2, Building2, Code, Palette, Megaphone, Cpu, Target, Users, ShieldCheck, Bookmark,
  Zap, Star, Layers, Activity, CheckCircle
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import ApplyModal from '../../components/common/ApplyModal';
import api from '../../lib/api/axios';

export default function Home() {
  const { listings, categories, savedJobIds, toggleSaveJob } = usePlatform();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [backendStatus, setBackendStatus] = useState({ message: 'Checking service availability', success: false });
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/test')
      .then(() => setBackendStatus({ message: 'Service available', success: true }))
      .catch(() => setBackendStatus({ message: 'Service unavailable. Please try again.', success: false }));
  }, []);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set('keyword', keyword.trim());
    if (location.trim()) params.set('location', location.trim());
    navigate(`/jobs?${params.toString()}`);
  };

  // Map icon string to component
  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'Code': return Code;
      case 'Palette': return Palette;
      case 'TrendingUp': return TrendingUp;
      case 'Megaphone': return Megaphone;
      case 'Cpu': return Cpu;
      case 'Briefcase': return Briefcase;
      case 'Target': return Target;
      case 'Users': return Users;
      default: return Briefcase;
    }
  };

  const filteredHomeListings = (listings || []).filter((item) => {
    if (keyword && keyword.trim()) {
      const q = keyword.toLowerCase().trim();
      const requirementsText = Array.isArray(item.requirements) 
        ? item.requirements.join(' ') 
        : (typeof item.requirements === 'string' ? item.requirements : '');
      const tagsText = Array.isArray(item.tags) 
        ? item.tags.join(' ') 
        : (typeof item.tags === 'string' ? item.tags : '');

      const corpus = `
        ${item.title || ''} 
        ${item.company || ''} 
        ${item.category || ''} 
        ${item.categoryType || ''} 
        ${item.type || ''} 
        ${item.workModel || ''} 
        ${item.experience || ''} 
        ${item.description || ''} 
        ${requirementsText} 
        ${tagsText}
      `.toLowerCase();

      const words = q.split(/[\s,+/]+/).filter(w => w.length > 0);
      const matches = corpus.includes(q) || words.every(w => corpus.includes(w));
      if (!matches) return false;
    }

    if (location && location.trim()) {
      const l = location.toLowerCase().trim();
      const loc = (item.location || '').toLowerCase();
      const wm = (item.workModel || '').toLowerCase();
      const locTokens = l.split(/[\s,+/]+/).filter(w => w.length > 0);
      const matches = loc.includes(l) || wm.includes(l) || locTokens.some(tok => loc.includes(tok) || wm.includes(tok));
      if (!matches) return false;
    }

    return true;
  });

  const featuredListings = filteredHomeListings.slice(0, 6);

  return (
    <div className="pb-24 overflow-hidden">
      {/* 1. Hero Section (Seamlessly connected to Navbar with zero white gaps) */}
      <section className="relative bg-gradient-to-b from-brand-navy via-brand-navy to-slate-900 text-white pt-10 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-white/10">
        {/* Ambient Glows & Background Effects */}
        <div className="absolute -top-24 left-1/4 w-[500px] h-[500px] bg-brand-accent/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 right-1/4 w-[450px] h-[450px] bg-brand-teal/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-7">
          {/* Executive Tag & Live Status Capsule */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-brand-teal text-xs font-semibold shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-brand-teal animate-spin-slow" />
              <span>Next-Gen Full-Stack Recruitment Ecosystem</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{backendStatus.message}</span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] max-w-4xl mx-auto text-white">
            Find your next <span className="bg-gradient-to-r from-blue-400 via-brand-teal to-brand-accent bg-clip-text text-transparent">high-impact</span> career opportunity.
          </h1>

          <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Discover verified remote, hybrid, and on-site engineering, design, and management openings posted directly by authenticated hiring companies.
          </p>

          {/* Interactive Search Card */}
          <form 
            onSubmit={handleSearch}
            className="max-w-4xl mx-auto bg-white/95 backdrop-blur-xl p-3 sm:p-3.5 rounded-3xl shadow-2xl border border-white/40 grid grid-cols-1 md:grid-cols-12 gap-2 text-brand-navy"
          >
            <div className="md:col-span-5 flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-slate-50/80 border border-slate-100 focus-within:border-brand-accent focus-within:bg-white transition-all">
              <Search className="w-4.5 h-4.5 text-brand-accent shrink-0" />
              <input
                type="text"
                placeholder="Job title, skill, company, or keyword..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full text-xs sm:text-sm font-semibold placeholder-slate-400 focus:outline-none bg-transparent"
              />
            </div>

            <div className="md:col-span-4 flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-slate-50/80 border border-slate-100 focus-within:border-brand-teal focus-within:bg-white transition-all">
              <MapPin className="w-4.5 h-4.5 text-brand-teal shrink-0" />
              <input
                type="text"
                placeholder="City, Location or 'Remote'..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-xs sm:text-sm font-semibold placeholder-slate-400 focus:outline-none bg-transparent"
              />
            </div>

            <div className="md:col-span-3">
              <button
                type="submit"
                className="w-full h-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-brand-accent to-blue-600 hover:from-brand-accentHover hover:to-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-accent/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Search Jobs</span>
              </button>
            </div>
          </form>

          {/* Popular Tag Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-300 pt-1">
            <span className="font-semibold text-slate-400">Popular Searches:</span>
            {['React', 'Frontend', 'Backend', 'Full Stack', 'Remote', 'Python', 'UI/UX'].map((tag) => (
              <button
                key={tag}
                onClick={() => navigate(`/jobs?keyword=${encodeURIComponent(tag)}`)}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 transition-all cursor-pointer hover:border-brand-accent/50 hover:text-white"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Executive Metrics Floating Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/95 backdrop-blur-xl p-6 sm:p-7 rounded-3xl shadow-2xl border border-slate-200/90">
          <div className="text-center space-y-1 p-2">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-brand-navy">{listings.length || '25+'}</h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Tech Openings</p>
          </div>
          <div className="text-center space-y-1 p-2 border-l border-slate-100">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-brand-accent">100%</h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Verified Companies</p>
          </div>
          <div className="text-center space-y-1 p-2 border-l border-slate-100">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-brand-teal">Direct</h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assessment & Interviews</p>
          </div>
          <div className="text-center space-y-1 p-2 border-l border-slate-100">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-emerald-600">Free</h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">For Job Seekers</p>
          </div>
        </div>
      </section>

      {/* 3. Job Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-accent">Explore by Specialization</span>
            <h2 className="text-2xl sm:text-3xl font-black text-brand-navy mt-1">
              Popular Career Disciplines
            </h2>
          </div>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-brand-accent hover:text-brand-accentHover group"
          >
            <span>Browse All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const IconComp = getCategoryIcon(cat.icon);
            return (
              <div
                key={cat.id}
                onClick={() => navigate(`/jobs?category=${encodeURIComponent(cat.name)}`)}
                className="group cursor-pointer p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-brand-accent/40 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between space-y-4"
              >
                <div className={`w-12 h-12 rounded-2xl ${cat.bg || 'bg-blue-50 text-brand-accent'} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                  <IconComp className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-brand-navy group-hover:text-brand-accent transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">Explore Open Positions</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Featured Job Openings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-teal">Curated Positions</span>
            <h2 className="text-2xl sm:text-3xl font-black text-brand-navy mt-1">
              Latest Opportunity Openings
            </h2>
          </div>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-brand-accent hover:text-brand-accentHover group"
          >
            <span>Explore All {listings.length} Listings</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {featuredListings.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-card space-y-4">
            <Briefcase className="w-12 h-12 mx-auto text-slate-300" />
            <h3 className="text-lg font-bold text-brand-navy">No Job Listings Published Yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Be the first to post an opportunity or register as an employer to publish jobs and internships directly to candidates.
            </p>
            <div className="pt-2">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-accent hover:bg-brand-accentHover text-white text-xs font-bold rounded-xl shadow-md"
              >
                <span>Register as Employer</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-card hover:shadow-2xl hover:border-brand-accent/50 transition-all duration-200 flex flex-col justify-between space-y-5 relative group"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={job.logo}
                        alt={job.company}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-100 shadow-sm"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-500">{job.company}</h4>
                        <Link 
                          to={`/jobs/${job.id}`}
                          className="text-base font-bold text-brand-navy group-hover:text-brand-accent transition-colors line-clamp-1"
                        >
                          {job.title}
                        </Link>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleSaveJob(job.id)}
                      className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                        savedJobIds.includes(job.id)
                          ? 'bg-brand-accent/10 border-brand-accent text-brand-accent'
                          : 'border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                      }`}
                      title={savedJobIds.includes(job.id) ? 'Saved' : 'Save Job'}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-4">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-brand-accent border border-blue-100">
                      {job.categoryType || 'Job'}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                      {job.workModel}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 font-mono">
                      {job.salary}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-4 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Posted {job.postedDate || 'Recently'}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/jobs/${job.id}`}
                      className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-brand-accent rounded-lg transition-colors"
                    >
                      Details
                    </Link>
                    <button
                      onClick={() => setSelectedJob(job)}
                      className="px-3.5 py-1.5 rounded-xl bg-brand-navy hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Apply Modal */}
      {selectedJob && (
        <ApplyModal
          job={selectedJob}
          isOpen={true}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
}
