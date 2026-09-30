import React, { useState } from 'react';
import { 
  Inbox, Search, Filter, MessageSquare, CheckCircle, Clock, 
  AlertCircle, ShieldAlert, Send, Eye, User, Building, Phone, Mail, 
  ChevronRight, RefreshCw, X, Tag, History, CheckSquare, Sparkles
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export default function ComplainBox() {
  const { complaints, replyComplaint, updateComplaintStatus, refreshPlatformData } = usePlatform();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal / Detail drawer state
  const [activeTicket, setActiveTicket] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyStatus, setReplyStatus] = useState('Resolved');
  const [replyPriority, setReplyPriority] = useState('Normal');
  const [replyLoading, setReplyLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  // Filter logic
  const filteredTickets = (complaints || []).filter((ticket) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchSearch = 
        ticket.name?.toLowerCase().includes(q) ||
        ticket.email?.toLowerCase().includes(q) ||
        ticket.subject?.toLowerCase().includes(q) ||
        ticket.message?.toLowerCase().includes(q) ||
        ticket.category?.toLowerCase().includes(q);
      if (!matchSearch) return false;
    }

    // Status filter
    if (selectedStatus !== 'All' && ticket.status !== selectedStatus) return false;

    // Role filter
    if (selectedRole !== 'All') {
      if (selectedRole === 'seeker' && ticket.role !== 'seeker') return false;
      if (selectedRole === 'recruiter' && ticket.role !== 'recruiter' && ticket.role !== 'company') return false;
      if (selectedRole === 'guest' && ticket.role !== 'guest') return false;
    }

    // Category filter
    if (selectedCategory !== 'All' && ticket.category !== selectedCategory) return false;

    return true;
  });

  // Calculate statistics
  const totalCount = (complaints || []).length;
  const openCount = (complaints || []).filter(c => c.status === 'Open').length;
  const inReviewCount = (complaints || []).filter(c => c.status === 'In Review').length;
  const resolvedCount = (complaints || []).filter(c => c.status === 'Resolved' || c.status === 'Closed').length;

  const handleOpenTicket = (ticket) => {
    setActiveTicket(ticket);
    setReplyText('');
    setReplyStatus(ticket.status === 'Open' ? 'Resolved' : ticket.status);
    setReplyPriority(ticket.priority || 'Normal');
    setActionSuccess('');
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!activeTicket || !replyText.trim()) return;

    setReplyLoading(true);
    try {
      await replyComplaint(activeTicket.id, replyText, replyStatus, replyPriority);
      setActionSuccess('Feedback reply sent successfully and notified the user!');

      // Update active ticket view with new reply in history
      const updatedHistory = [
        ...(activeTicket.history || []),
        {
          action: 'Admin Feedback',
          actor: 'System Administrator',
          role: 'admin',
          email: 'admin@jobconnect.com',
          message: replyText,
          new_status: replyStatus,
          timestamp: new Date().toISOString()
        }
      ];

      setActiveTicket(prev => ({
        ...prev,
        adminFeedback: replyText,
        status: replyStatus,
        priority: replyPriority,
        repliedAt: new Date().toISOString(),
        history: updatedHistory
      }));

      setReplyText('');
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      console.error('Failed to submit reply:', err);
    } finally {
      setReplyLoading(false);
    }
  };

  const handleQuickStatusChange = async (ticketId, newStatus) => {
    await updateComplaintStatus(ticketId, newStatus);
    if (activeTicket && activeTicket.id === ticketId) {
      setActiveTicket(prev => ({
        ...prev,
        status: newStatus,
        history: [
          ...(prev.history || []),
          {
            action: 'Status Change',
            actor: 'System Administrator',
            role: 'admin',
            note: `Status updated to ${newStatus}`,
            new_status: newStatus,
            timestamp: new Date().toISOString()
          }
        ]
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-brand-navy flex items-center gap-2">
            <Inbox className="w-6 h-6 text-brand-accent" />
            <span>Complain Box & Support Inquiries</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review user complaints, contact messages, and send direct feedback to Job Seekers and Employers.
          </p>
        </div>

        <button
          onClick={refreshPlatformData}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all shadow-sm self-start cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Received</span>
            <span className="text-2xl font-black text-brand-navy">{totalCount}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Pending / Open</span>
            <span className="text-2xl font-black text-rose-600">{openCount}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">In Review</span>
            <span className="text-2xl font-black text-amber-600">{inReviewCount}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Resolved</span>
            <span className="text-2xl font-black text-emerald-600">{resolvedCount}</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Keyword Search */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sender, email, subject, or message..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent bg-slate-50/50"
            />
          </div>

          {/* Status Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Review">In Review</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Role Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent bg-white"
            >
              <option value="All">All User Roles</option>
              <option value="seeker">Job Seeker</option>
              <option value="recruiter">Employer</option>
              <option value="guest">Guest / Visitor</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent bg-white"
            >
              <option value="All">All Categories</option>
              <option value="General Support">General Support</option>
              <option value="Account & Profile">Account & Profile</option>
              <option value="Payment & Boosting">Payment & Boosting</option>
              <option value="Task & Interview">Task & Interview</option>
              <option value="Bug Report">Bug Report</option>
              <option value="Complaint & Grievance">Complaint & Grievance</option>
              <option value="Feature Suggestion">Feature Suggestion</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main List / Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredTickets.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Inbox className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">No Inquiries or Complaints Found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              There are currently no tickets matching your filter criteria.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredTickets.map((ticket) => {
              const isResolved = ticket.status === 'Resolved' || ticket.status === 'Closed';
              const isSeeker = ticket.role === 'seeker';
              const isRecruiter = ticket.role === 'recruiter' || ticket.role === 'company';

              return (
                <div 
                  key={ticket.id}
                  className="p-5 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group"
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      isSeeker ? 'bg-blue-100 text-blue-700' :
                      isRecruiter ? 'bg-purple-100 text-purple-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {isSeeker ? <User className="w-5 h-5" /> :
                       isRecruiter ? <Building className="w-5 h-5" /> :
                       <MessageSquare className="w-5 h-5" />}
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-brand-navy truncate">
                          {ticket.subject}
                        </span>
                        
                        {/* Role Badge */}
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isSeeker ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          isRecruiter ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                          'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {isSeeker ? 'Job Seeker' : isRecruiter ? 'Employer' : 'Guest'}
                        </span>

                        {/* Category Badge */}
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                          {ticket.category}
                        </span>

                        {/* Priority Badge */}
                        {ticket.priority && ticket.priority !== 'Normal' && (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            ticket.priority === 'Urgent' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                            ticket.priority === 'High' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {ticket.priority} Priority
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-1">
                        {ticket.message}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                        <span className="font-semibold text-slate-600">{ticket.name}</span>
                        <span>•</span>
                        <span>{ticket.email}</span>
                        {ticket.phone && (
                          <>
                            <span>•</span>
                            <span>{ticket.phone}</span>
                          </>
                        )}
                        <span>•</span>
                        <span>{ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : 'Recently'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status and Action Buttons */}
                  <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      ticket.status === 'Open' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                      ticket.status === 'In Review' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {ticket.status}
                    </span>

                    <button
                      onClick={() => handleOpenTicket(ticket)}
                      className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-brand-navy hover:bg-slate-800 text-white shadow-sm transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Review & Reply</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Ticket Details & Feedback Modal */}
      {activeTicket && (
        <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col my-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-accent/10 text-brand-accent flex items-center justify-center font-bold">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-brand-navy flex items-center gap-2">
                    <span>Ticket: {activeTicket.subject}</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    ID: #{activeTicket.id} • Category: {activeTicket.category}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTicket(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {actionSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{actionSuccess}</span>
                </div>
              )}

              {/* Sender Details Panel */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Sender Name & Role</span>
                  <span className="font-bold text-brand-navy flex items-center gap-1.5 mt-0.5">
                    {activeTicket.name} 
                    <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                      {activeTicket.role}
                    </span>
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px]">Email Address</span>
                  <span className="font-bold text-brand-navy block mt-0.5">{activeTicket.email}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px]">Phone Number</span>
                  <span className="font-bold text-brand-navy block mt-0.5">{activeTicket.phone || 'Not Provided'}</span>
                </div>
              </div>

              {/* Original Message */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-navy uppercase tracking-wider block">
                  Original Message Description
                </label>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap shadow-inner">
                  {activeTicket.message}
                </div>
              </div>

              {/* Communication & Activity History Log */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <label className="text-xs font-bold text-brand-navy uppercase tracking-wider flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-brand-accent" />
                    <span>Audit & Feedback History Log</span>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {(activeTicket.history || []).length} Recorded Event(s)
                  </span>
                </div>

                <div className="space-y-3">
                  {(activeTicket.history || []).map((item, idx) => (
                    <div 
                      key={idx} 
                      className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
                        item.role === 'admin' 
                          ? 'bg-purple-50/60 border-purple-200 text-purple-900' 
                          : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold flex items-center gap-1.5">
                          {item.role === 'admin' ? (
                            <span className="text-purple-700 font-extrabold flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              {item.actor || 'Administrator'} (Feedback Response)
                            </span>
                          ) : (
                            <span>{item.actor} (Initial Ticket Submission)</span>
                          )}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {item.timestamp ? new Date(item.timestamp).toLocaleString() : 'Recorded'}
                        </span>
                      </div>
                      
                      {item.message && (
                        <p className="text-xs leading-relaxed whitespace-pre-wrap pl-2 border-l-2 border-current">
                          {item.message}
                        </p>
                      )}

                      {item.note && (
                        <p className="text-[11px] text-slate-500 italic">
                          {item.note}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Admin Feedback Form */}
              <form onSubmit={handleSendReply} className="p-5 rounded-2xl bg-brand-navy/5 border border-brand-navy/10 space-y-4">
                <h4 className="text-xs font-bold text-brand-navy flex items-center gap-2">
                  <Send className="w-3.5 h-3.5 text-brand-accent" />
                  <span>Send Direct Feedback / Solution to User</span>
                </h4>

                <div>
                  <textarea
                    rows={4}
                    required
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your response, clarification, or resolution note here. The user will receive this in their portal notifications..."
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent bg-white shadow-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Set Ticket Status</label>
                    <select
                      value={replyStatus}
                      onChange={(e) => setReplyStatus(e.target.value)}
                      className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent bg-white"
                    >
                      <option value="Resolved">Resolved</option>
                      <option value="In Review">In Review</option>
                      <option value="Closed">Closed</option>
                      <option value="Open">Keep Open</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Priority</label>
                    <select
                      value={replyPriority}
                      onChange={(e) => setReplyPriority(e.target.value)}
                      className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent bg-white"
                    >
                      <option value="Normal">Normal</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={replyLoading || !replyText.trim()}
                    className="px-5 py-2.5 rounded-xl bg-brand-accent hover:bg-brand-accentHover disabled:opacity-50 text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{replyLoading ? 'Sending Feedback...' : 'Send Feedback & Notify User'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
