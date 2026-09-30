import React from 'react';
import { X, FileText, Check, Ban, Mail, Phone, MapPin, Download, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CandidateModal({ candidate, isOpen, onClose, onStatusChange }) {
  if (!isOpen || !candidate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
      >
        {/* Header */}
        <div className="bg-brand-navy text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-accent to-brand-teal flex items-center justify-center font-bold text-white text-xl shadow-lg">
              {candidate.name ? candidate.name.split(' ').map(n => n[0]).join('') : 'CD'}
            </div>
            <div>
              <span className="text-[10px] font-bold text-brand-teal uppercase tracking-wider">Candidate Match: {candidate.matchScore ?? 'Not scored'}%</span>
              <h3 className="text-xl font-bold text-white">{candidate.name}</h3>
              <p className="text-xs text-slate-300">{candidate.role || 'Applicant'}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <MapPin className="w-4 h-4 text-brand-accent" />
              <span>{candidate.location || 'Remote'}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Mail className="w-4 h-4 text-brand-accent" />
              <span>{candidate.email || 'candidate@example.com'}</span>
            </div>
          </div>

          {candidate.bio && (
            <div>
              <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">Candidate Note / Pitch</h4>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {candidate.bio}
              </p>
            </div>
          )}

          {/* Resume File Card */}
          <div>
            <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">Attached Application Document</h4>
            <div className="p-3.5 rounded-2xl border border-slate-200 bg-white flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-brand-navy">{candidate.resumeFile || 'Resume_Document.pdf'}</h5>
                  <p className="text-[10px] text-slate-500">PDF Document</p>
                </div>
              </div>
              <button 
                onClick={() => alert(`Downloading ${candidate.resumeFile || 'Resume_Document.pdf'}`)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Action Footer */}
        <div className="bg-slate-50 p-4 px-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Status:</span>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
              {candidate.status}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            <button
              onClick={() => { onStatusChange(candidate.id, 'Rejected'); onClose(); }}
              className="px-3 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Reject</span>
            </button>
            <a
              href="/recruiter/tasks"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-brand-accent text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Assign Task</span>
            </a>
            <a
              href="/recruiter/interviews"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-brand-navy hover:bg-brand-navyDark text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Schedule Interview</span>
            </a>
            <button
              onClick={() => { onStatusChange(candidate.id, 'Hired'); onClose(); }}
              className="px-4 py-2 rounded-xl bg-brand-accent hover:bg-brand-accentHover text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-brand-accent/20 transition-all cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Hire Candidate</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
