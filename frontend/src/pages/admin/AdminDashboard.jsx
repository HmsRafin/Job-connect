import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Briefcase, CheckSquare, ShieldCheck, Activity, 
  TrendingUp, AlertCircle, ArrowRight, Grid 
} from 'lucide-react';
import { getDashboardStats } from '../../lib/api/dashboard';
import { usePlatform } from '../../context/PlatformContext';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { currentUser } = usePlatform();
  const { user } = useAuth();
  const activeUser = currentUser || user;
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        setError('Failed to load dashboard statistics.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const auditLogs = (stats?.recent_logins || []).map((login) => ({
    id: login?.id,
    action: 'User Logged In',
    target: `${login?.user?.name || 'Unknown'} (${login?.user?.role || 'N/A'}) - ${login?.ip_address || 'Unknown IP'}`,
    time: login?.login_at ? new Date(login.login_at).toLocaleString() : 'Unknown',
    type: 'info'
  }));

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-brand-navy text-white rounded-3xl p-8 border border-purple-500/20 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/40 border border-purple-500/30 text-purple-300 text-xs font-semibold">
            <Activity className="w-3.5 h-3.5" />
            <span>Platform Health 99.98% Operational</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Welcome back, {activeUser?.name || 'Platform Administrator'}!</h1>
          <p className="text-xs text-slate-300">Oversee global user activity, job moderation queue, and system health.</p>
        </div>
      </div>

      {/* Metrics Row */}
      {loading ? (
        <div className="text-center py-10 text-slate-500 animate-pulse">Loading statistics...</div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-2">
            <span className="text-xs font-medium text-slate-500">Total System Users</span>
            <h3 className="text-3xl font-extrabold text-brand-navy">{stats?.total_users ?? 0}</h3>
            <span className="text-[10px] text-emerald-600 font-bold">{stats?.new_users ?? 0} new this week</span>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-2">
            <span className="text-xs font-medium text-slate-500">Active Users</span>
            <h3 className="text-3xl font-extrabold text-purple-600">{stats?.active_users ?? 0}</h3>
            <span className="text-[10px] text-purple-600 font-bold">currently active</span>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-2">
            <span className="text-xs font-medium text-slate-500">Moderation Queue</span>
            <h3 className="text-3xl font-extrabold text-amber-500">0 Pending</h3>
            <span className="text-[10px] text-amber-600 font-bold">All caught up</span>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-2">
            <span className="text-xs font-medium text-slate-500">Platform Health</span>
            <h3 className="text-3xl font-extrabold text-emerald-600">100%</h3>
            <span className="text-[10px] text-emerald-600 font-bold">0 outages</span>
          </div>
        </div>
      )}

      {/* Grid: Audit Logs & Quick Admin Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Real-time System Audit Feed */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-6">
          <h3 className="text-base font-bold text-brand-navy">Real-time Platform Audit Log</h3>

          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-4 text-slate-400 text-sm">Loading logs...</div>
            ) : auditLogs.length === 0 ? (
              <div className="text-center py-4 text-slate-400 text-sm">No recent activity</div>
            ) : (
              auditLogs.map((log) => (
                <div key={log.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-brand-navy">{log.action}</h4>
                    <p className="text-[11px] text-slate-500">{log.target}</p>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400">{log.time}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Admin Actions */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-4">
          <h3 className="text-base font-bold text-brand-navy">Management Controls</h3>

          <div className="space-y-3">
            <Link
              to="/admin/users"
              className="w-full p-4 rounded-2xl border border-slate-200 hover:border-purple-600 hover:bg-purple-50/40 flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-100 text-purple-600">
                  <Users className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-brand-navy group-hover:text-purple-600">User Management</h4>
                  <p className="text-[10px] text-slate-500">Suspend or promote Seekers & Recruiters</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              to="/admin/jobs"
              className="w-full p-4 rounded-2xl border border-slate-200 hover:border-purple-600 hover:bg-purple-50/40 flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-100 text-amber-600">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-brand-navy group-hover:text-purple-600">Job Moderation Queue</h4>
                  <p className="text-[10px] text-slate-500">Review pending employer posts</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              to="/admin/categories"
              className="w-full p-4 rounded-2xl border border-slate-200 hover:border-purple-600 hover:bg-purple-50/40 flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600">
                  <Grid className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-brand-navy group-hover:text-purple-600">Category Manager</h4>
                  <p className="text-[10px] text-slate-500">Add or edit job categories</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
