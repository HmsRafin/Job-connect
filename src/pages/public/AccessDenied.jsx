import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Lock, ArrowRight, User, Building, ShieldCheck } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export default function AccessDenied({ attemptedPath, requiredRoles = [] }) {
  const { currentUser, logout } = usePlatform();
  const navigate = useNavigate();

  const getAuthorizedDashboard = () => {
    if (currentUser?.role === 'seeker') return '/seeker/dashboard';
    if (currentUser?.role === 'recruiter') return '/recruiter/dashboard';
    if (currentUser?.role === 'admin') return '/admin/dashboard';
    return '/login';
  };

  const getRoleTitle = (r) => {
    if (r === 'seeker') return 'Job Seeker';
    if (r === 'recruiter') return 'Hiring Company';
    if (r === 'admin') return 'Website Management / Admin';
    return r;
  };

  return (
    <div className="min-h-screen bg-brand-canvas text-brand-slate font-sans flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-2xl space-y-6 text-center">
        {/* Shield Alert Icon */}
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-md">
          <ShieldAlert className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-200 uppercase tracking-widest">
            HTTP 403 Forbidden Access
          </span>
          <h1 className="text-2xl font-extrabold text-brand-navy">Access Restricted</h1>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            You do not have authorization to view <code className="bg-slate-100 px-1.5 py-0.5 rounded text-rose-600 font-mono font-bold">{attemptedPath || 'this restricted portal'}</code>.
          </p>
        </div>

        {/* Auth Role Info */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-semibold">Your Active Identity:</span>
            <span className="font-bold text-brand-navy">{currentUser?.name || 'Authenticated User'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-semibold">Your Assigned Role:</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-brand-accent uppercase">
              {getRoleTitle(currentUser?.role)}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200 pt-2">
            <span className="text-slate-500 font-semibold">Required Role for Route:</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 uppercase">
              {requiredRoles.map(r => getRoleTitle(r)).join(' or ')}
            </span>
          </div>
        </div>

        {/* Security Access Control Guarantee */}
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Cross-portal access between candidates, employers, and website management is strictly prohibited under system security policy.
        </p>

        {/* Redirect Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate(getAuthorizedDashboard())}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-accent hover:bg-brand-accentHover text-white font-bold text-xs shadow-md flex items-center justify-center gap-2"
          >
            <span>Return to My Authorized Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="w-full sm:w-auto px-4 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-xs"
          >
            Sign Out & Switch Account
          </button>
        </div>
      </div>
    </div>
  );
}
