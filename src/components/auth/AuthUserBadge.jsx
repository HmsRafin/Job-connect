import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, ShieldCheck, Briefcase, LayoutDashboard } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export default function AuthUserBadge() {
  const { currentUser, logout } = usePlatform();
  const navigate = useNavigate();

  if (!currentUser) {
    return (
      <div className="flex items-center gap-2">
        <Link
          to="/login"
          className="px-3.5 py-1.5 text-xs font-semibold rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-all border border-white/10"
        >
          Sign In
        </Link>
        <Link
          to="/register"
          className="px-4 py-1.5 text-xs font-bold rounded-full bg-brand-accent hover:bg-brand-accentHover text-white shadow-sm"
        >
          Register
        </Link>
      </div>
    );
  }

  const getDashboardPath = () => {
    if (currentUser.role === 'seeker') return '/seeker/dashboard';
    if (currentUser.role === 'recruiter') return '/recruiter/dashboard';
    if (currentUser.role === 'admin') return '/admin/dashboard';
    return '/';
  };

  const getRoleBadgeStyle = () => {
    if (currentUser.role === 'seeker') return 'bg-blue-500/20 text-blue-300 border-blue-400/30';
    if (currentUser.role === 'recruiter') return 'bg-amber-500/20 text-amber-300 border-amber-400/30';
    if (currentUser.role === 'admin') return 'bg-purple-500/20 text-purple-300 border-purple-400/30';
    return 'bg-slate-500/20 text-slate-300';
  };

  return (
    <div className="flex items-center gap-3">
      {/* Dashboard Shortcut */}
      <Link
        to={getDashboardPath()}
        className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-full bg-white/10 hover:bg-white/20 text-white transition-all border border-white/10"
      >
        <LayoutDashboard className="w-3.5 h-3.5 text-brand-teal" />
        <span>My Dashboard</span>
      </Link>

      {/* Identity Badge */}
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="font-bold text-white max-w-[120px] truncate">{currentUser.name}</span>
        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${getRoleBadgeStyle()}`}>
          {currentUser.role}
        </span>
      </div>

      {/* Sign Out Button */}
      <button
        onClick={() => { logout(); navigate('/login'); }}
        className="p-1.5 rounded-full text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
        title="Sign Out"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  );
}
