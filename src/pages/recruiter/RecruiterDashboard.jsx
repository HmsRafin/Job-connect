import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building, Briefcase, Users, PlusCircle, Globe, MapPin, 
  Upload, Save, Check, Sparkles 
} from 'lucide-react';
import { mockStats, mockJobs } from '../../data/mockData';

export default function RecruiterDashboard() {
  const [companyName, setCompanyName] = useState('Stripe Global');
  const [website, setWebsite] = useState('https://stripe.com');
  const [size, setSize] = useState('5,000+ employees');
  const [about, setAbout] = useState('Stripe is a technology company that builds economic infrastructure for the internet.');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-brand-navy text-white rounded-3xl p-8 border border-white/10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Verified Employer Account</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Employer Dashboard & Profile</h1>
          <p className="text-xs text-slate-300">Manage company information, active listings, and candidate pipeline.</p>
        </div>

        <Link
          to="/recruiter/jobs/create"
          className="px-6 py-3.5 rounded-2xl bg-brand-accent hover:bg-brand-accentHover text-white font-bold text-xs shadow-md shadow-brand-accent/25 flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post a New Job</span>
        </Link>
      </div>

      {/* Overview Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500">Active Job Postings</span>
            <h3 className="text-3xl font-extrabold text-brand-navy">{mockStats.recruiterActivePostings}</h3>
            <span className="text-[10px] text-emerald-600 font-semibold">1 pending review</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-accent flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500">Total Applicants</span>
            <h3 className="text-3xl font-extrabold text-brand-accent">{mockStats.recruiterTotalApplicants}</h3>
            <span className="text-[10px] text-brand-accent font-semibold">+18 new this week</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500">Successful Hires</span>
            <h3 className="text-3xl font-extrabold text-brand-teal">12</h3>
            <span className="text-[10px] text-slate-400 font-semibold">Verified placements</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-brand-teal flex items-center justify-center">
            <Building className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Company Profile Manager Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-brand-navy">Company Profile Manager</h3>
          {saved && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <Check className="w-4 h-4" /> Profile Updated!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-brand-navy mb-1">Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-brand-navy mb-1">Company Website</label>
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-brand-navy mb-1">Employee Size Band</label>
            <input
              type="text"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-brand-navy mb-1">Logo / Banner Uploader</label>
            <div className="p-2 border border-slate-200 rounded-xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 font-bold text-white flex items-center justify-center text-xs">
                SG
              </div>
              <label className="text-xs font-bold text-brand-accent hover:underline cursor-pointer">
                <span>Upload Logo File</span>
                <input type="file" className="hidden" />
              </label>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-brand-navy mb-1">About Company Overview</label>
          <textarea
            rows={4}
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-brand-navy hover:bg-brand-navyDark text-white font-bold text-xs shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Company Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}
