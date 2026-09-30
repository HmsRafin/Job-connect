import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Briefcase, ShieldCheck, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export default function Login() {
  const { login } = usePlatform();
  const navigate = useNavigate();

  // Role Selection
  const [selectedRole, setSelectedRole] = useState('seeker'); // 'seeker' | 'recruiter' | 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setErrorMsg('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await login(selectedRole, email, password);
      if (!res.success) {
        setErrorMsg(res.message || 'Authentication failed. Please verify your credentials.');
        return;
      }

      // Automatic redirection strictly based on role
      if (selectedRole === 'seeker') {
        navigate('/seeker/dashboard', { replace: true });
      } else if (selectedRole === 'recruiter') {
        navigate('/recruiter/dashboard', { replace: true });
      } else if (selectedRole === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      }
    } catch (err) {
      setErrorMsg('Login request failed. Please check server connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center lg:text-left">
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-accent/10 text-brand-accent uppercase tracking-wider">
          Step 1: Role-Aware Sign In
        </span>
        <h2 className="text-2xl font-extrabold text-brand-navy">Portal Access Sign In</h2>
        <p className="text-xs text-slate-500">Select your account role and enter your registered credentials.</p>
      </div>

      {/* Mandatory Role Selection Options */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-brand-navy">Select Account Role Entry <span className="text-rose-500">*</span></label>
        <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
          <button
            type="button"
            onClick={() => handleRoleSelect('seeker')}
            className={`py-2.5 px-2 rounded-xl text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all ${
              selectedRole === 'seeker'
                ? 'bg-brand-accent text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <User className="w-4 h-4 shrink-0" />
            <span>Job Seeker</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSelect('recruiter')}
            className={`py-2.5 px-2 rounded-xl text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all ${
              selectedRole === 'recruiter'
                ? 'bg-brand-navy text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Briefcase className="w-4 h-4 shrink-0" />
            <span>Employer</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSelect('admin')}
            className={`py-2.5 px-2 rounded-xl text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all ${
              selectedRole === 'admin'
                ? 'bg-purple-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Admin</span>
          </button>
        </div>
      </div>

      {/* Role Confirmation Indicator */}
      <div className={`p-3 rounded-2xl border text-xs flex items-center justify-between ${
        selectedRole === 'seeker' ? 'bg-blue-50 border-blue-200 text-brand-navy' :
        selectedRole === 'recruiter' ? 'bg-amber-50 border-amber-200 text-amber-900' :
        'bg-purple-50 border-purple-200 text-purple-900'
      }`}>
        <span className="font-semibold">
          Selected Portal: <strong>{selectedRole === 'seeker' ? 'Job Seeker Dashboard' : selectedRole === 'recruiter' ? 'Employer Console' : 'Website Management Admin Panel'}</strong>
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white border">
          {selectedRole}
        </span>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form matching selected role */}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-brand-navy mb-1">
            {selectedRole === 'seeker' ? 'Candidate Email Address' : selectedRole === 'recruiter' ? 'Company Work Email' : 'Admin Account Email'}
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full pl-9 pr-3 py-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent font-medium"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-brand-navy">Password</label>
            <a href="/contact" className="text-[11px] font-semibold text-brand-accent hover:underline">Contact support</a>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-9 pr-3 py-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3.5 rounded-xl text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          } ${
            selectedRole === 'seeker' ? 'bg-brand-accent hover:bg-brand-accentHover' :
            selectedRole === 'recruiter' ? 'bg-brand-navy hover:bg-brand-navyDark' :
            'bg-purple-700 hover:bg-purple-800'
          }`}
        >
          <span>{loading ? 'Authenticating...' : `Sign In to ${selectedRole === 'seeker' ? 'Seeker Portal' : selectedRole === 'recruiter' ? 'Employer Console' : 'Admin Panel'}`}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Admin specific direct link note */}
      {selectedRole === 'admin' && (
        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Admin portal also features a restricted login route at{' '}
          <Link to="/admin/login" className="font-bold text-purple-700 hover:underline">
            /admin/login
          </Link>
        </div>
      )}

      <div className="pt-4 border-t border-slate-200 text-center text-xs text-slate-500">
        Don't have an account?{' '}
        <Link to="/register" className="font-bold text-brand-accent hover:underline">
          Register now
        </Link>
      </div>
    </div>
  );
}
