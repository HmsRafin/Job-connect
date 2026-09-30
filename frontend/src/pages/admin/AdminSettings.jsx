import React, { useState } from 'react';
import { 
  ShieldCheck, Lock, Mail, User, KeyRound, AlertCircle, 
  CheckCircle2, ArrowRight, ShieldAlert, Sparkles, RefreshCw 
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { useAuth } from '../../context/AuthContext';
import { updateCredentials } from '../../lib/api/auth';

export default function AdminSettings() {
  const { currentUser, setCurrentUser } = usePlatform();
  const { user } = useAuth();
  const activeUser = currentUser || user;

  const [name, setName] = useState(activeUser?.name || 'Platform Administrator');
  const [email, setEmail] = useState(activeUser?.email || 'admin@jobconnect.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', message: '' });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setStatusMsg({ type: '', message: '' });

    if (!currentPassword) {
      setStatusMsg({ type: 'error', message: 'Current password is required to authorize credential changes or handover.' });
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setStatusMsg({ type: 'error', message: 'New password and confirm password do not match.' });
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setStatusMsg({ type: 'error', message: 'New password must be at least 6 characters long.' });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        current_password: currentPassword,
      };

      if (newPassword) {
        payload.new_password = newPassword;
      }

      const res = await updateCredentials(payload);

      if (res.user) {
        const updatedUser = {
          ...currentUser,
          name: res.user.name,
          email: res.user.email,
        };
        setCurrentUser(updatedUser);
      }

      setStatusMsg({
        type: 'success',
        message: 'Admin credentials and platform ownership updated and saved to the database successfully!'
      });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
      const backendErr = err.response?.data?.errors?.current_password?.[0] || 
                         err.response?.data?.errors?.email?.[0] ||
                         err.response?.data?.message || 
                         'Failed to update admin credentials. Please check your current password.';
      setStatusMsg({ type: 'error', message: backendErr });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="bg-brand-navy text-white rounded-3xl p-8 border border-purple-500/20 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/40 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-1">
            <KeyRound className="w-3.5 h-3.5" />
            <span>Master Administration Security</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Platform Ownership & Admin Handover</h1>
          <p className="text-xs text-slate-300">
            Securely update master administrator email, password, and manage future website ownership transfers.
          </p>
        </div>
      </div>

      {/* Handover Guidelines Card */}
      <div className="p-6 rounded-3xl bg-purple-50/70 border border-purple-200/80 space-y-3">
        <div className="flex items-center gap-2 text-purple-950 font-bold text-sm">
          <ShieldCheck className="w-5 h-5 text-purple-700 shrink-0" />
          <span>Website Handover & Security Rules</span>
        </div>
        <p className="text-xs text-purple-900 leading-relaxed">
          To hand over this platform to a new owner: First log in with your current administrator email and password. Then, enter the new owner's name, their new email address, and their new password below. You must verify your current password to authorize this transfer. All data is saved permanently in the backend database.
        </p>
      </div>

      {/* Status Feedback Alert */}
      {statusMsg.message && (
        <div className={`p-4 rounded-2xl border text-xs font-semibold flex items-start gap-3 animate-fade-in ${
          statusMsg.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          <span className="leading-relaxed">{statusMsg.message}</span>
        </div>
      )}

      {/* Handover & Credential Form */}
      <form onSubmit={handleUpdate} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-base font-bold text-brand-navy">Administrator Credentials Configuration</h3>
          <p className="text-xs text-slate-500">Modify administrator details or transfer access to a new authorized email.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-brand-navy mb-1">
              Administrator Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Master Administrator"
                className="w-full pl-9 pr-3 py-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-navy mb-1">
              Admin / Handover Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full pl-9 pr-3 py-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600 font-medium"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 space-y-4">
          <div>
            <label className="block text-xs font-bold text-brand-navy mb-1">
              Current Admin Password <span className="text-rose-500">* (Required for Authorization)</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password to verify identity"
                className="w-full pl-9 pr-3 py-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600 font-medium"
              />
            </div>
            <span className="text-[11px] text-slate-400 block mt-1">
              For security, you must provide the current password before changing credentials.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">
                New Admin Password <span className="text-slate-400 font-normal">(Leave blank if keeping current password)</span>
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new master password"
                  className="w-full pl-9 pr-3 py-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new master password"
                  className="w-full pl-9 pr-3 py-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600 font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <span className="text-xs text-slate-400">
            Changes will take effect immediately across all admin sessions.
          </span>
          <button
            type="submit"
            disabled={loading}
            className={`px-8 py-3.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-lg shadow-purple-700/25 flex items-center gap-2 cursor-pointer ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            <span>{loading ? 'Updating Credentials...' : 'Save & Handover Credentials'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
