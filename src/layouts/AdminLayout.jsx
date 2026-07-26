import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, LayoutDashboard, Users, Briefcase, FolderKanban, 
  Bell, LogOut, Menu, X, ArrowLeft, Zap, Megaphone, CreditCard, DollarSign, Settings
} from 'lucide-react';
import NotificationDrawer from '../components/common/NotificationDrawer';
import { usePlatform } from '../context/PlatformContext';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = usePlatform();

  const navItems = [
    { name: 'Platform Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'User Management', path: '/admin/users', icon: Users },
    { name: 'Job & Internship Moderation', path: '/admin/jobs', icon: Briefcase },
    { name: 'Category Management', path: '/admin/categories', icon: FolderKanban },
    { name: 'Platform Advertisements', path: '/admin/advertisements', icon: Megaphone },
    { name: 'Featured / Boosted Posts', path: '/admin/featured', icon: Zap },
    { name: 'Boost Pricing Settings', path: '/admin/boost-pricing', icon: DollarSign },
    { name: 'Ad Pricing Settings', path: '/admin/ad-pricing', icon: DollarSign },
    { name: 'Payment Transaction Ledger', path: '/admin/payments', icon: CreditCard },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex bg-brand-canvas text-brand-slate font-sans">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Deep Navy Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-brand-navy text-white flex flex-col justify-between border-r border-white/10 transition-transform duration-300 transform overflow-y-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div>
          {/* Header */}
          <div className="h-20 px-6 flex items-center justify-between border-b border-white/10 sticky top-0 bg-brand-navy z-10">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-accent to-brand-teal flex items-center justify-center shadow-md">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-white">
                  Job<span className="text-brand-accent">Connect</span>
                </span>
                <span className="text-[10px] text-purple-400 font-bold tracking-wider uppercase">System Admin</span>
              </div>
            </Link>
            <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* User Brief */}
          <div className="p-4 mx-3 my-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
              SA
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-white truncate">{currentUser?.name || 'Platform Administrator'}</h4>
              <p className="text-[10px] text-slate-400 truncate">Super Admin Rights</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="px-3 space-y-1 pb-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all ${
                    active
                      ? 'bg-brand-accent text-white shadow-md shadow-brand-accent/20'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 space-y-2 sticky bottom-0 bg-brand-navy">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Public App</span>
          </Link>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 rounded-xl hover:bg-rose-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-base sm:text-lg font-bold text-brand-navy hidden sm:block">
              {navItems.find(n => n.path === location.pathname)?.name || 'Admin Console'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <NotificationDrawer activeRole="admin" />
            
            <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
              <div className="w-8 h-8 rounded-full bg-purple-700 text-white flex items-center justify-center font-bold text-xs">
                SA
              </div>
              <span className="text-xs font-bold text-brand-navy hidden sm:block">System Admin</span>
            </div>
          </div>
        </header>

        {/* Dynamic Outlet Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
