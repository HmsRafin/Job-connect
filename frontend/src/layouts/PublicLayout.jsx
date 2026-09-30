import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Briefcase, Search, Menu, X, ArrowRight, Globe, Share2, ExternalLink, Sparkles, GitBranch } from 'lucide-react';
import AuthUserBadge from '../components/auth/AuthUserBadge';
import NotificationDrawer from '../components/common/NotificationDrawer';
import { usePlatform } from '../context/PlatformContext';

export default function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = usePlatform();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Career Opportunities', path: '/jobs' },
    { name: 'Workflow', path: '/workflow', badge: 'LIVE', icon: GitBranch },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-canvas text-brand-slate font-sans selection:bg-brand-accent selection:text-white">
      {/* Executive Top Banner / Role Preview Bar */}
      <div className="bg-brand-navyDark text-slate-300 text-xs py-1.5 px-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-brand-accent/20 text-brand-accent font-semibold text-[10px]">SECURE PLATFORM</span>
          <span className="hidden sm:inline">Welcome to JobConnect – Career & Recruitment Infrastructure.</span>
        </div>
        <div className="flex items-center gap-3">
          {currentUser && <NotificationDrawer activeRole={currentUser.role} />}
          <AuthUserBadge />
        </div>
      </div>

      {/* Primary Deep Navy Header */}
      <header className="sticky top-0 z-40 bg-brand-navy/95 backdrop-blur-md border-b border-white/10 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-accent to-brand-teal flex items-center justify-center shadow-lg shadow-brand-accent/25 group-hover:scale-105 transition-transform">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1">
                  Job<span className="text-brand-accent">Connect</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-teal"></span>
                </span>
                <span className="text-[10px] tracking-widest uppercase text-slate-400 font-medium">Enterprise Careers</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all inline-flex items-center gap-1.5 ${
                    isActive(link.path)
                      ? 'bg-brand-accent text-white shadow-sm font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.icon && <link.icon className={`w-3.5 h-3.5 ${isActive(link.path) ? 'text-white' : link.badge ? 'text-emerald-300' : 'text-slate-400'}`} />}
                  {link.name}
                  {link.badge && <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-black tracking-widest leading-none ${isActive(link.path) ? 'bg-white text-brand-accent' : 'bg-emerald-500 text-white shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse'}`}>{link.badge}</span>}
                </Link>
              ))}
            </nav>

            {/* Right Action Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {currentUser ? (
                <Link
                  to={currentUser.role === 'seeker' ? '/seeker/dashboard' : currentUser.role === 'recruiter' ? '/recruiter/dashboard' : '/admin/dashboard'}
                  className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-brand-accent to-blue-600 hover:from-brand-accentHover hover:to-blue-700 text-white shadow-md flex items-center gap-2"
                >
                  <span>Go to My Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2.5 text-sm font-medium text-slate-200 hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-brand-accent to-blue-600 hover:from-brand-accentHover hover:to-blue-700 text-white shadow-md shadow-brand-accent/20 hover:shadow-lg transition-all flex items-center gap-2 group"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-brand-navy border-b border-white/10 px-4 pt-3 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-medium flex items-center gap-2 ${
                  isActive(link.path)
                    ? 'bg-brand-accent text-white font-semibold'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {link.icon && <link.icon className="w-4 h-4" />}
                {link.name}
                {link.badge && <span className="ml-auto px-2 py-0.5 rounded-full bg-emerald-500 text-white text-xs font-black tracking-widest animate-pulse">{link.badge}</span>}
              </Link>
            ))}
            <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
              {!currentUser ? (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-3 rounded-xl border border-white/20 text-white font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-3 rounded-xl bg-brand-accent text-white font-semibold shadow-md"
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <Link
                  to={currentUser.role === 'seeker' ? '/seeker/dashboard' : currentUser.role === 'recruiter' ? '/recruiter/dashboard' : '/admin/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 rounded-xl bg-brand-accent text-white font-semibold shadow-md"
                >
                  My Portal Dashboard
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Modern Executive Footer */}
      <footer className="bg-brand-navy text-slate-300 border-t border-white/10 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
            <div className="lg:col-span-2 space-y-4">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-accent to-brand-teal flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">
                  Job<span className="text-brand-accent">Connect</span>
                </span>
              </Link>
              <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
                Empowering world-class engineers, designers, and tech leaders to connect with top-tier global enterprise tech opportunities.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">For Job Seekers</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/jobs" className="hover:text-white transition-colors">Explore All Opportunities</Link></li>
                <li><Link to="/seeker/dashboard" className="hover:text-white transition-colors">Candidate Workspace</Link></li>
                <li><Link to="/seeker/profile" className="hover:text-white transition-colors">Profile & Resume</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">For Employers</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/recruiter/jobs/create" className="hover:text-white transition-colors">Post a Position</Link></li>
                <li><Link to="/recruiter/dashboard" className="hover:text-white transition-colors">Employer Console</Link></li>
                <li><Link to="/admin/login" className="hover:text-white transition-colors">Website Management</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Stay Updated</h4>
              <p className="text-xs text-slate-400">Subscribe for weekly career insights & hot remote job alerts.</p>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <p>© {new Date().getFullYear()} JobConnect Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
