import React, { useState } from 'react';
import { Users, Search, Shield, Ban, CheckCircle, Filter } from 'lucide-react';
import { mockUsersList } from '../../data/mockData';

export default function UserManagement() {
  const [users, setUsers] = useState(mockUsersList);
  const [roleFilter, setRoleFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const toggleUserStatus = (userId) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'Active' ? 'Suspended' : 'Active';
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const filteredUsers = users.filter(u => {
    if (roleFilter !== 'All' && u.role !== roleFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-brand-navy text-white rounded-3xl p-8 border border-white/10 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Platform Administration</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">User Management</h1>
          <p className="text-xs text-slate-300">View, suspend, or promote candidate and employer accounts.</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['All', 'Job Seeker', 'Recruiter', 'Admin'].map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                roleFilter === r
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* User Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">User Details</th>
                <th className="py-4 px-6">Platform Role</th>
                <th className="py-4 px-6">Joined</th>
                <th className="py-4 px-6">Account Status</th>
                <th className="py-4 px-6 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredUsers.map((usr) => (
                <tr key={usr.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6">
                    <div>
                      <h4 className="font-bold text-brand-navy">{usr.name}</h4>
                      <p className="text-[11px] text-slate-500">{usr.email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      usr.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                      usr.role === 'Recruiter' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {usr.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-medium text-slate-600">{usr.joined}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                      usr.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {usr.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {usr.role !== 'Admin' && (
                      <button
                        onClick={() => toggleUserStatus(usr.id)}
                        className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs ${
                          usr.status === 'Active'
                            ? 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100'
                            : 'bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100'
                        }`}
                      >
                        {usr.status === 'Active' ? 'Suspend' : 'Reactivate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
