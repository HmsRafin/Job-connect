import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, LayoutDashboard, Users, Briefcase, FolderKanban, 
  Bell, LogOut, Menu, X, ArrowLeft, Zap, Megaphone, CreditCard, DollarSign, Settings, Inbox
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
    { name: 'Complain Box & Support', path: '/admin/complaints', icon: Inbox },
    { name: 'User Management', path: '/admin/users', icon: Users },
    { name: 'Job & Internship Moderation', path: '/admin/jobs', icon: Briefcase },
    { name: 'Category Management', path: '/admin/categories', icon: FolderKanban },
    { name: 'Featured / Boosted Posts', path: '/admin/featured', icon: Zap },
    { name: 'Boost Pricing Settings', path: '/admin/boost-pricing', icon: DollarSign },
    { name: 'Payment Transaction Ledger', path: '/admin/payments', icon: CreditCard },
    { name: 'Advertisements', path: '/admin/advertisements', icon: Megaphone },
    { name: 'Advertisement Pricing', path: '/admin/ad-pricing', icon: DollarSign },
    { name: 'Ownership & Handover', path: '/admin/settings', icon: Settings },
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
              {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'AD'}
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
        <div className="p-4 border-t border-white/10 sticky bottom-0 bg-brand-navy space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Public App</span>
          </Link>
          <button
            onClick={async () => {
              await logout();
              navigate('/admin/login');
            }}
            className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-rose-400 hover:text-white hover:bg-rose-600/20 rounded-xl transition-all cursor-pointer text-left"
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

          <div className="flex items-center gap-3 sm:gap-4">
            <NotificationDrawer activeRole="admin" />
            
            <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
              <div className="w-9 h-9 rounded-full bg-purple-700 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'AD'}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-brand-navy leading-tight">{currentUser?.name || 'Administrator'}</span>
                <span className="text-[10px] text-purple-600 font-semibold">Super Admin</span>
              </div>
            </div>

            {/* Topbar Sign Out Button */}
            <button
              onClick={async () => {
                await logout();
                navigate('/admin/login');
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 hover:border-rose-600 rounded-xl transition-all shadow-sm group cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
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
