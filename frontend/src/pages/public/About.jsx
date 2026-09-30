import React from 'react';
import { Briefcase, Target, ShieldCheck, Users, Sparkles, Award, Globe, Code, Server, Terminal, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  const team = [
    { 
      name: 'HMS Rafin', 
      role: 'Team Leader & Backend Developer', 
      initials: 'HR', 
      icon: Terminal, 
      color: 'from-blue-600 to-indigo-700',
      description: 'System architect leading backend infrastructure, database schema governance, and API security.'
    },
    { 
      name: 'Zawadul Karim', 
      role: 'Backend Developer', 
      initials: 'ZK', 
      icon: Server, 
      color: 'from-indigo-600 to-purple-700',
      description: 'Engineers server-side business logic, authentication workflows, and role-based authorization services.'
    },
    { 
      name: 'Istiaque Ahmed', 
      role: 'Frontend Developer', 
      initials: 'IA', 
      icon: Code, 
      color: 'from-purple-600 to-pink-700',
      description: 'Crafts responsive user interfaces, dynamic state management systems, and interactive UI component libraries.'
    },
    { 
      name: 'Tanvir Ahmed', 
      role: 'Frontend Developer', 
      initials: 'TA', 
      icon: Layers, 
      color: 'from-teal-600 to-emerald-700',
      description: 'Focuses on web application design integrity, client-side route security, and seamless candidate-employer user experiences.'
    },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Header */}
      <section className="bg-brand-navy text-white py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-teal text-xs font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>Our Mission & Vision</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Reimagining Global Tech Talent Infrastructure</h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            JobConnect was built to empower world-class software engineers, product managers, and designers to connect directly with ambitious tech startups and global enterprise leaders.
          </p>
        </div>
      </section>

      {/* Value Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-card space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-accent flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-brand-navy">High-Signal Matching</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We cut through recruiter noise by enforcing transparent compensation bands, verified technical requirements, and direct communication lines.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-card space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-brand-teal flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-brand-navy">Verified Employers</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every employer account on JobConnect undergoes identity audit and job post moderation before going live.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-card space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-brand-navy">Global First</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Support for borderless remote positions, multi-currency salary bands, and asynchronous hiring workflows.
            </p>
          </div>
        </div>
      </section>

      {/* Executive Leadership Team Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-brand-accent uppercase tracking-widest">Engineering & Product Leadership</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy">Leadership Team</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Meet the core engineering team behind the JobConnect platform infrastructure.
          </p>
        </div>

        {/* Clean Text-Based Profile Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, i) => {
            const Icon = member.icon;
            return (
              <div 
                key={i} 
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card hover:shadow-hover hover:border-brand-accent/40 transition-all space-y-4 text-center flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Clean Text-Based Initials Avatar Badge */}
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-tr ${member.color} text-white font-extrabold text-xl flex items-center justify-center mx-auto shadow-md relative`}>
                    <span>{member.initials}</span>
                    <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-xl bg-white border border-slate-200 text-brand-navy flex items-center justify-center shadow-sm">
                      <Icon className="w-4 h-4 text-brand-accent" />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-brand-navy">{member.name}</h4>
                    <span className="text-xs font-bold text-brand-accent block mt-0.5">{member.role}</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    {member.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] font-bold text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Verified Core Contributor</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
