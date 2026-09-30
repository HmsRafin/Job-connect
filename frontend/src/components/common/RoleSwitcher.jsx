import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Briefcase, ShieldCheck, Globe, ChevronDown } from 'lucide-react';

export default function RoleSwitcher() {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveRole = () => {
    if (location.pathname.startsWith('/seeker')) return 'seeker';
    if (location.pathname.startsWith('/recruiter')) return 'recruiter';
    if (location.pathname.startsWith('/admin')) return 'admin';
    return 'public';
  };

  const currentRole = getActiveRole();

  const roles = [
    { id: 'public', label: 'Guest & Public Portal', path: '/', icon: Globe, badge: 'Visitor' },
    { id: 'seeker', label: 'Job Seeker Dashboard', path: '/seeker/dashboard', icon: User, badge: 'Seeker' },
    { id: 'recruiter', label: 'Recruiter Dashboard', path: '/recruiter/profile', icon: Briefcase, badge: 'Employer' },
    { id: 'admin', label: 'Platform Admin Panel', path: '/admin/dashboard', icon: ShieldCheck, badge: 'Admin' },
  ];

  return (
    <div className="relative group inline-block text-left">
      <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-full bg-brand-navy/10 dark:bg-white/10 text-brand-navy dark:text-white hover:bg-brand-accent hover:text-white transition-all border border-brand-navy/20 dark:border-white/20">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="hidden sm:inline">Role View:</span>
        <span className="capitalize font-bold">
          {roles.find(r => r.id === currentRole)?.badge}
        </span>
        <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
      </button>

      <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-brand-navy border border-slate-200 dark:border-slate-700 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-1.5">
        <div className="px-3 py-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase border-b border-slate-100 dark:border-slate-800 mb-1">
          Switch Prototype View
        </div>
        {roles.map((role) => {
          const Icon = role.icon;
          const isActive = currentRole === role.id;
          return (
            <button
              key={role.id}
              onClick={() => navigate(role.path)}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl transition-all ${
                isActive
                  ? 'bg-brand-accent text-white font-semibold'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                <span>{role.label}</span>
              </div>
              {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
