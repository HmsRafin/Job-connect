import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Briefcase, Mail, Lock, Building, ArrowRight, AlertCircle } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export default function Register() {
  const { register } = usePlatform();
  const [role, setRole] = useState('seeker'); // 'seeker' | 'recruiter'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await register(role, { name, email, company, password, password_confirmation: password });
      if (!res.success) {
        setErrorMsg(res.message || 'Registration failed. Please check form details.');
        return;
      }

      if (role === 'recruiter') {
        navigate('/recruiter/dashboard', { replace: true });
      } else {
        navigate('/seeker/dashboard', { replace: true });
      }
    } catch (err) {
      setErrorMsg('Registration failed due to connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center lg:text-left">
        <h2 className="text-2xl font-extrabold text-brand-navy">Create your account</h2>
        <p className="text-xs text-slate-500">Select your account type to register for authorized portal tools.</p>
      </div>

      {/* Role Toggle Tabs */}
      <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
        <button
          type="button"
          onClick={() => setRole('seeker')}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            role === 'seeker'
              ? 'bg-brand-accent text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Job Seeker</span>
        </button>

        <button
          type="button"
          onClick={() => setRole('recruiter')}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            role === 'recruiter'
              ? 'bg-brand-navy text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Employer / Company</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-brand-navy mb-1">
            {role === 'recruiter' ? 'Recruiter / Contact Person Name' : 'Full Name'}
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full pl-9 pr-3 py-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-brand-navy mb-1">
            {role === 'recruiter' ? 'Company Work Email' : 'Email Address'}
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full pl-9 pr-3 py-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent"
            />
          </div>
        </div>

        {role === 'recruiter' && (
          <div>
            <label className="block text-xs font-bold text-brand-navy mb-1">Company / Organization Name</label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Acme Corporation"
                className="w-full pl-9 pr-3 py-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent font-semibold"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-brand-navy mb-1">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
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
            role === 'recruiter'
              ? 'bg-brand-navy hover:bg-brand-navyDark shadow-brand-navy/20'
              : 'bg-brand-accent hover:bg-brand-accentHover shadow-brand-accent/20'
          }`}
        >
          <span>{loading ? 'Creating Account...' : `Create ${role === 'recruiter' ? 'Employer' : 'Job Seeker'} Account & Sign In`}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="pt-4 border-t border-slate-200 text-center text-xs text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-brand-accent hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}
