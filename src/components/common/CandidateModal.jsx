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
              {candidate.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <span className="text-[10px] font-bold text-brand-teal uppercase tracking-wider">Candidate Match: {candidate.matchScore}</span>
              <h3 className="text-xl font-bold text-white">{candidate.name}</h3>
              <p className="text-xs text-slate-300">{candidate.role} • {candidate.experience}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <MapPin className="w-4 h-4 text-brand-accent" />
              <span>{candidate.location}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Mail className="w-4 h-4 text-brand-accent" />
              <span>{candidate.name.toLowerCase().replace(' ', '.')}@devmail.io</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">Professional Summary</h4>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              {candidate.bio}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">Verified Skills</h4>
            <div className="flex flex-wrap gap-1.5">
              {candidate.skills.map((skill, i) => (
                <span key={i} className="px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-navy/5 text-brand-navy border border-slate-200">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Resume File Card */}
          <div>
            <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">Attached Resume</h4>
            <div className="p-3.5 rounded-2xl border border-slate-200 bg-white flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-brand-navy">{candidate.resumeFile}</h5>
                  <p className="text-[10px] text-slate-500">PDF Document • 1.4 MB</p>
                </div>
              </div>
              <button 
                onClick={() => alert(`Simulating download of ${candidate.resumeFile}`)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Action Footer */}
        <div className="bg-slate-50 p-4 px-6 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Status:</span>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
              {candidate.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { onStatusChange(candidate.id, 'Rejected'); onClose(); }}
              className="px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Reject Candidate</span>
            </button>
            <button
              onClick={() => { onStatusChange(candidate.id, 'Interviewing'); onClose(); }}
              className="px-4 py-2 rounded-xl bg-brand-accent hover:bg-brand-accentHover text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-brand-accent/20 transition-all"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Advance to Interview</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
