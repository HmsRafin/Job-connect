import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, ShieldAlert } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export default function AdminLogin() {
  const { login, currentUser } = usePlatform();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@jobconnect.com');
  const [password, setPassword] = useState('admin123');
  const [errorMsg, setErrorMsg] = useState('');

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const res = login('admin', email, password);
    if (!res.success) {
      setErrorMsg(res.message || 'Access Denied: Admin authorization required.');
      return;
    }

    navigate('/admin/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen bg-brand-navyDark text-white font-sans flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-brand-navy rounded-3xl p-8 border border-white/10 shadow-2xl space-y-6">
        {/* Admin Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 mx-auto shadow-md">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-500/20 text-purple-300 uppercase tracking-widest border border-purple-500/30">
            RESTRICTED ADMIN PORTAL
          </span>
          <h1 className="text-2xl font-extrabold text-white">Website Management Sign In</h1>
          <p className="text-xs text-slate-300">Dedicated system administration access control gateway.</p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-xs font-semibold text-rose-300 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Admin Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@jobconnect.com"
                className="w-full pl-9 pr-3 py-3 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Master Admin Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-3 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2"
          >
            <span>Authenticate Admin Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-white/10 text-center text-xs text-slate-400">
          Not an administrator?{' '}
          <Link to="/login" className="font-bold text-brand-teal hover:underline">
            Return to Public Login
          </Link>
        </div>
      </div>
    </div>
  );
}
