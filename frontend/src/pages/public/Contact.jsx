import React, { useState, useEffect } from 'react';
import { 
  Mail, Phone, MapPin, Send, MessageSquare, CheckCircle, HelpCircle, 
  ShieldAlert, AlertCircle, Sparkles, User, Building, Clock, ChevronRight
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export default function Contact() {
  const { currentUser, submitComplaint } = usePlatform();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ticketData, setTicketData] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'guest',
    category: 'General Support',
    priority: 'Normal',
    subject: '',
    message: ''
  });

  // Auto-fill logged in user info
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        name: currentUser.name || prev.name,
        email: currentUser.email || prev.email,
        role: currentUser.role === 'recruiter' || currentUser.role === 'company' ? 'recruiter' : 
              (currentUser.role === 'seeker' ? 'seeker' : 'guest')
      }));
    }
  }, [currentUser]);

  const categories = [
    { value: 'General Support', label: 'General Inquiry & Assistance' },
    { value: 'Account & Profile', label: 'Account, Login & Profile Issue' },
    { value: 'Payment & Boosting', label: 'Payment, Ledger & Job Boost Inquiry' },
    { value: 'Task & Interview', label: 'Task Assignment or Interview Scheduling' },
    { value: 'Bug Report', label: 'Technical Bug or Error Report' },
    { value: 'Complaint & Grievance', label: 'Formal Complain / Report an Issue' },
    { value: 'Feature Suggestion', label: 'Platform Improvement Suggestion' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await submitComplaint({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        category: formData.category,
        priority: formData.priority,
        subject: formData.subject,
        message: formData.message,
      });

      setTicketData(res.data);
      setSubmitted(true);
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setTicketData(null);
    setFormData({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phone: '',
      role: currentUser?.role || 'guest',
      category: 'General Support',
      priority: 'Normal',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold text-brand-accent uppercase tracking-widest px-3 py-1 rounded-full bg-brand-accent/10">
          Support & Complain Desk
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy">
          Direct Line to System Administration
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Have an issue with your account, job posting, payment, or interview? Submit your inquiry or complaint below and our admin team will review and respond promptly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Information & Help Desk Info */}
        <div className="lg:col-span-5 bg-gradient-to-br from-brand-navy to-slate-900 text-white rounded-3xl p-8 shadow-xl space-y-6 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-accent/20 border border-brand-accent/40 flex items-center justify-center text-brand-accent">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Admin Complain Desk</h3>
              <p className="text-[11px] text-slate-300">Central Help & Dispute Resolution</p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Every submission is directly routed into the Admin Console Complain Box. When the administrator reviews and replies to your ticket, you will receive real-time notifications inside your portal.
          </p>

          <div className="space-y-4 pt-2 text-xs border-t border-white/10">
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/5 border border-white/5">
              <div className="p-2.5 rounded-xl bg-brand-teal/20 text-brand-teal shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-slate-400 block text-[10px]">Official Admin Support</span>
                <span className="font-bold text-white truncate block">admin@jobconnect.com</span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/5 border border-white/5">
              <div className="p-2.5 rounded-xl bg-brand-accent/20 text-brand-accent shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-slate-400 block text-[10px]">Hotline / Emergency Support</span>
                <span className="font-bold text-white">+880 1800-JOB-CONNECT</span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/5 border border-white/5">
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-slate-400 block text-[10px]">Operations Center</span>
                <span className="font-bold text-white">Gulshan-2, Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <Clock className="w-3.5 h-3.5" />
              <span>Fast Response Guarantee</span>
            </div>
            <p className="text-[11px] text-emerald-200/90 leading-relaxed">
              Inquiries and dispute complaints from Job Seekers and Employers are monitored live. Admin feedback history is safely archived for your reference.
            </p>
          </div>
        </div>

        {/* Message Form / Confirmation Canvas */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card">
          {submitted ? (
            <div className="text-center py-8 space-y-6">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md animate-bounce">
                <CheckCircle className="w-12 h-12" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-brand-navy">Ticket Successfully Logged!</h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  Your message has been safely saved in the Admin Complain Box. A system administrator has been notified and will provide feedback shortly.
                </p>
              </div>

              {/* Ticket Summary Card */}
              {ticketData && (
                <div className="max-w-md mx-auto p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Ticket ID:</span>
                    <span className="font-mono font-bold text-brand-navy">#{ticketData.id}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Category:</span>
                    <span className="font-semibold text-brand-navy">{ticketData.category}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Subject:</span>
                    <span className="font-semibold text-brand-navy truncate max-w-[200px]">{ticketData.subject}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Initial Status:</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      {ticketData.status || 'Open'}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto px-6 py-3 text-xs font-bold rounded-xl bg-brand-navy text-white hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-brand-navy flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-brand-accent" />
                  <span>Submit Inquiry or Complain</span>
                </h3>
                <span className="text-[11px] text-slate-400">All fields required</span>
              </div>

              {/* User Identity / Role Selector */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-brand-navy">I am submitting as</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'seeker' })}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      formData.role === 'seeker'
                        ? 'bg-brand-accent/10 border-brand-accent text-brand-accent font-bold shadow-sm'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Job Seeker</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'recruiter' })}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      formData.role === 'recruiter'
                        ? 'bg-brand-accent/10 border-brand-accent text-brand-accent font-bold shadow-sm'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Building className="w-3.5 h-3.5" />
                    <span>Employer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'guest' })}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      formData.role === 'guest'
                        ? 'bg-brand-accent/10 border-brand-accent text-brand-accent font-bold shadow-sm'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Guest / Visitor</span>
                  </button>
                </div>
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Saifur Rahman"
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent bg-slate-50/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="saif@example.com"
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent bg-slate-50/50"
                  />
                </div>
              </div>

              {/* Category & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1">Category / Issue Type</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1">Phone Number (Optional)</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+880 1700-000000"
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent bg-slate-50/50"
                  />
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-xs font-bold text-brand-navy mb-1">Priority Urgency</label>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  {['Low', 'Normal', 'High', 'Urgent'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setFormData({ ...formData, priority: p })}
                      className={`py-1.5 rounded-lg border text-center font-semibold transition-all cursor-pointer ${
                        formData.priority === p
                          ? (p === 'Urgent' ? 'bg-rose-50 border-rose-400 text-rose-700 font-bold' :
                             p === 'High' ? 'bg-amber-50 border-amber-400 text-amber-700 font-bold' :
                             'bg-brand-accent/10 border-brand-accent text-brand-accent font-bold')
                          : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-bold text-brand-navy mb-1">Subject / Issue Title</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Issue with Job Post Boost transaction"
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold text-brand-navy mb-1">Detailed Message / Description</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Please describe the issue, question, or complaint in detail so admin can review and assist you..."
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-brand-accent hover:bg-brand-accentHover disabled:opacity-50 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Submitting to Admin Box...' : 'Send Inquiry to Admin'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
