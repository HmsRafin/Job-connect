import React, { useState } from 'react';
import { X, Upload, CheckCircle, FileText, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ApplyModal({ job, isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [pitch, setPitch] = useState('');
  const [selectedResume, setSelectedResume] = useState('Alex_Vance_Resume_2026.pdf');

  if (!isOpen || !job) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
        >
          {/* Header */}
          <div className="bg-brand-navy text-white p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="text-[10px] font-bold text-brand-teal uppercase tracking-widest">Quick Application</span>
            <h3 className="text-xl font-bold text-white mt-1">{job.title}</h3>
            <p className="text-xs text-slate-300 mt-1">{job.company} • {job.location}</p>
          </div>

          {submitted ? (
            <div className="p-10 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-extrabold text-brand-navy">Application Submitted!</h4>
              <p className="text-sm text-slate-600 max-w-sm mx-auto">
                Your profile & resume have been securely forwarded to <span className="font-semibold">{job.company}</span> hiring team.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Select Resume */}
              <div>
                <label className="block text-xs font-bold text-brand-navy mb-2">Select Saved Resume</label>
                <div className="p-3 rounded-2xl border-2 border-brand-accent bg-blue-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-brand-accent text-white">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-brand-navy">{selectedResume}</h5>
                      <p className="text-[10px] text-slate-500">Uploaded Jul 15, 2026 • PDF (1.4 MB)</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-brand-accent px-2.5 py-1 rounded-full bg-white shadow-sm">Active</span>
                </div>
              </div>

              {/* Cover Pitch */}
              <div>
                <label className="block text-xs font-bold text-brand-navy mb-1">
                  Elevator Pitch / Cover Note <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={4}
                  value={pitch}
                  onChange={(e) => setPitch(e.target.value)}
                  placeholder="Introduce yourself and explain why you're a great fit for this role..."
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold rounded-xl bg-brand-accent hover:bg-brand-accentHover text-white shadow-md shadow-brand-accent/25 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Application</span>
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
