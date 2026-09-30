import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Briefcase, LayoutDashboard, User, FileText, Search, Bell, 
  LogOut, Menu, X, ArrowLeft, CheckSquare, Calendar, Bookmark, Settings
} from 'lucide-react';
import NotificationDrawer from '../components/common/NotificationDrawer';
import { usePlatform } from '../context/PlatformContext';

export default function SeekerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = usePlatform();

  const navItems = [
    { name: 'Dashboard Overview', path: '/seeker/dashboard', icon: LayoutDashboard },
    { name: 'Profile & Resume', path: '/seeker/profile', icon: User },
    { name: 'My Applications', path: '/seeker/applications', icon: FileText },
    { name: 'Assigned Tasks', path: '/seeker/tasks', icon: CheckSquare },
    { name: 'Scheduled Interviews', path: '/seeker/interviews', icon: Calendar },
    { name: 'Saved Opportunities', path: '/seeker/saved', icon: Bookmark },
    { name: 'Notifications', path: '/seeker/notifications', icon: Bell },
    { name: 'Browse Opportunities', path: '/jobs', icon: Search },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex bg-brand-canvas text-brand-slate font-sans">
      {/* Sidebar Overlay for Mobile */}
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
                <span className="text-[10px] text-brand-teal font-semibold tracking-wider uppercase">Candidate Portal</span>
              </div>
            </Link>
            <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* User Brief (Clickable link to profile) */}
          <Link
            to="/seeker/profile"
            onClick={() => setSidebarOpen(false)}
            title="View Profile & Resume"
            className="p-4 mx-3 my-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-brand-accent/40 flex items-center gap-3 transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:scale-105 transition-transform shrink-0">
              {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'JS'}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-white group-hover:text-brand-accent transition-colors truncate">
                {currentUser?.name || 'Job Seeker'}
              </h4>
              <p className="text-[10px] text-slate-400 group-hover:text-slate-300 transition-colors truncate">
                {currentUser?.email || 'Candidate Account'}
              </p>
            </div>
          </Link>

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
              navigate('/login');
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
              {navItems.find(n => n.path === location.pathname)?.name || 'Seeker Workspace'}
            </h2>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <NotificationDrawer activeRole="seeker" />
            
            <Link 
              to="/seeker/profile" 
              title="View Profile & Resume"
              className="flex items-center gap-2 border-l border-slate-200 pl-3 py-1 hover:opacity-80 transition-opacity cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-full bg-brand-navy text-white flex items-center justify-center font-bold text-xs shadow-sm group-hover:ring-2 group-hover:ring-brand-accent/50 transition-all">
                {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'JS'}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-brand-navy leading-tight group-hover:text-brand-accent transition-colors">{currentUser?.name || 'Job Seeker'}</span>
                <span className="text-[10px] text-slate-400">Job Seeker</span>
              </div>
            </Link>

            {/* Topbar Sign Out Button */}
            <button
              onClick={async () => {
                await logout();
                navigate('/login');
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
