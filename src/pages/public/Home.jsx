import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, MapPin, Briefcase, ArrowRight, TrendingUp, Sparkles, 
  CheckCircle2, Building2, Code, Palette, Megaphone, Cpu, Target, Users, ShieldCheck, Bookmark
} from 'lucide-react';
import { mockCategories, mockJobs, mockStats } from '../../data/mockData';
import ApplyModal from '../../components/common/ApplyModal';

export default function Home() {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs?keyword=${encodeURIComponent(keyword)}&location=${encodeURIComponent(location)}`);
  };

  const toggleSaveJob = (jobId) => {
    if (savedJobs.includes(jobId)) {
      setSavedJobs(savedJobs.filter(id => id !== jobId));
    } else {
      setSavedJobs([...savedJobs, jobId]);
    }
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

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative bg-brand-navy text-white pt-12 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-brand-accent/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-teal/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-brand-teal text-xs sm:text-sm font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>The Executive Platform for Elite Tech Careers</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto text-white">
            Find your next high-impact job at top global companies.
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Discover thousands of hand-verified remote, hybrid, and executive software engineering, design, and product management roles.
          </p>

          {/* Interactive Search Bar Box */}
          <form 
            onSubmit={handleSearch}
            className="max-w-4xl mx-auto bg-white p-3 sm:p-4 rounded-3xl shadow-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-3 text-brand-navy"
          >
            <div className="md:col-span-5 flex items-center gap-3 px-3 py-2 border-b md:border-b-0 md:border-r border-slate-200">
              <Search className="w-5 h-5 text-brand-accent shrink-0" />
              <input
                type="text"
                placeholder="Job title, skill, or company..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full text-sm font-medium placeholder-slate-400 focus:outline-none bg-transparent"
              />
            </div>

            <div className="md:col-span-4 flex items-center gap-3 px-3 py-2 border-b md:border-b-0 md:border-r border-slate-200">
              <MapPin className="w-5 h-5 text-brand-teal shrink-0" />
              <input
                type="text"
                placeholder="Location or 'Remote'..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-sm font-medium placeholder-slate-400 focus:outline-none bg-transparent"
              />
            </div>

            <div className="md:col-span-3">
              <button
                type="submit"
                className="w-full h-full py-3.5 px-6 rounded-2xl bg-brand-accent hover:bg-brand-accentHover text-white font-bold text-sm shadow-md shadow-brand-accent/25 hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>Search Jobs</span>
              </button>
            </div>
          </form>

          {/* Popular Tag Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-300 pt-2">
            <span className="font-semibold text-slate-400">Popular:</span>
            {['React Developer', 'UI/UX Designer', 'Remote', 'Product Manager', 'Data Scientist'].map((tag) => (
              <button
                key={tag}
                onClick={() => navigate(`/jobs?keyword=${encodeURIComponent(tag)}`)}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Highlighting Metrics Counter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-200/80">
          <div className="text-center space-y-1 p-2">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-brand-navy">{mockStats.activeJobs}</h3>
            <p className="text-xs sm:text-sm font-medium text-brand-muted">Active Job Listings</p>
          </div>
          <div className="text-center space-y-1 p-2 border-l border-slate-100">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-brand-accent">{mockStats.totalCompanies}</h3>
            <p className="text-xs sm:text-sm font-medium text-brand-muted">Verified Employers</p>
          </div>
          <div className="text-center space-y-1 p-2 border-l border-slate-100">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-brand-teal">{mockStats.successfulPlacements}</h3>
            <p className="text-xs sm:text-sm font-medium text-brand-muted">Tech Placements</p>
          </div>
          <div className="text-center space-y-1 p-2 border-l border-slate-100">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-emerald-600">{mockStats.avgSalaryGrowth}</h3>
            <p className="text-xs sm:text-sm font-medium text-brand-muted">Avg. Compensation Increase</p>
          </div>
        </div>
      </section>

      {/* Job Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-accent">Explore Opportunities</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy mt-1">
              Explore Popular Job Categories
            </h2>
          </div>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-accent hover:text-brand-accentHover"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockCategories.map((cat) => {
            const IconComp = getCategoryIcon(cat.icon);
            return (
              <div
                key={cat.id}
                onClick={() => navigate(`/jobs?category=${encodeURIComponent(cat.name)}`)}
                className="group cursor-pointer p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between space-y-4"
              >
                <div className={`w-12 h-12 rounded-2xl ${cat.bg} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                  <IconComp className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-brand-navy group-hover:text-brand-accent transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">{cat.count}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-teal">Curated Positions</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy mt-1">
              Featured Job Openings
            </h2>
          </div>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-accent hover:text-brand-accentHover"
          >
            <span>Browse 1,200+ Jobs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card hover:shadow-hover hover:border-brand-accent/40 transition-all flex flex-col justify-between space-y-5 relative group"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={job.logo}
                      alt={job.company}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-100 shadow-sm"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-500">{job.company}</h4>
                      <p className="text-[11px] text-slate-400">{job.location}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSaveJob(job.id)}
                    className={`p-2 rounded-xl border transition-colors ${
                      savedJobs.includes(job.id)
                        ? 'bg-brand-accent text-white border-brand-accent'
                        : 'bg-slate-50 text-slate-400 hover:text-brand-accent border-slate-200'
                    }`}
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-4 space-y-2">
                  <Link to={`/jobs/${job.id}`}>
                    <h3 className="text-base font-bold text-brand-navy group-hover:text-brand-accent transition-colors line-clamp-1">
                      {job.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>
                </div>

                {/* Pill Badges */}
                <div className="flex flex-wrap gap-1.5 pt-3">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-brand-accent border border-blue-100">
                    {job.type}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                    {job.workModel}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                    {job.salary}
                  </span>
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-400">{job.postedDate}</span>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/jobs/${job.id}`}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-brand-navy"
                  >
                    Details
                  </Link>
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="px-4 py-1.5 text-xs font-bold rounded-xl bg-brand-accent hover:bg-brand-accentHover text-white shadow-sm transition-all"
                  >
                    Quick Apply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* High-Converting Signup Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-brand-navy text-white p-8 sm:p-12 relative overflow-hidden shadow-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-accent/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-xl space-y-4 text-center md:text-left">
            <span className="px-3 py-1 rounded-full bg-brand-teal/20 text-brand-teal text-xs font-bold border border-brand-teal/30">
              For Engineers & Leaders
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Ready to take the next leap in your career?
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Create your executive profile, upload your resume, and get matched with top tech employers instantly.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <Link
              to="/register"
              className="px-8 py-4 rounded-2xl bg-brand-accent hover:bg-brand-accentHover text-white font-bold text-sm shadow-xl shadow-brand-accent/30 transition-all flex items-center gap-2"
            >
              <span>Create Candidate Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/recruiter/profile"
              className="px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all"
            >
              Post a Job as Employer
            </Link>
          </div>
        </div>
      </section>

      {/* Modal */}
      <ApplyModal
        job={selectedJob}
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
      />
    </div>
  );
}
