import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Briefcase, CheckCircle2, Shield, Sparkles, Star } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-canvas text-brand-slate font-sans selection:bg-brand-accent selection:text-white">
      {/* Top Bar */}
      <div className="bg-brand-navy border-b border-white/10 text-white px-4 py-2 flex items-center justify-between z-10">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-accent to-brand-teal flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Job<span className="text-brand-accent">Connect</span>
          </span>
        </Link>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-49px)]">
        {/* Left: High-Trust Deep Navy Branding Showcase */}
        <div className="lg:col-span-5 bg-brand-navy relative overflow-hidden flex flex-col justify-between p-8 lg:p-12 text-white border-r border-white/10">
          {/* Subtle Glowing Radial Highlights */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-accent/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-teal/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 space-y-6 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-brand-teal text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Talent Ecosystem</span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
              Connect with top global tech opportunities and elite teams.
            </h1>

            <p className="text-slate-300 text-sm leading-relaxed">
              JobConnect bridges top-tier engineers, designers, and managers with verified high-growth startups and enterprise companies.
            </p>

            <div className="space-y-3 pt-4">
              {[
                'Verified Job Postings from Direct Hiring Managers',
                'AI-Powered Resume Match & Application Tracking',
                'Transparent Salary Bands & Remote Work Badges',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-brand-teal shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Trust Card */}
          <div className="relative z-10 mt-10 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-slate-200 italic leading-relaxed">
              "JobConnect makes recruitment seamless and intuitive with end-to-end applicant pipelines, technical testing, and video interviews."
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-9 h-9 rounded-full bg-brand-accent flex items-center justify-center font-bold text-white text-xs">
                JC
              </div>
              <div>
                <h5 className="text-xs font-bold text-white">Verified Platform Partner</h5>
                <p className="text-[10px] text-slate-400">Enterprise Recruitment Network</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 text-xs text-slate-400 flex items-center gap-2">
            <Shield className="w-4 h-4 text-brand-accent" />
            <span>256-bit Enterprise Encryption Guaranteed</span>
          </div>
        </div>

        {/* Right: Clean Card Form Container */}
        <div className="lg:col-span-7 bg-brand-canvas flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
