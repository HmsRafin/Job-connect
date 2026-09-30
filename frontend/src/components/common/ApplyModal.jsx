import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, Upload, CheckCircle, FileText, Send, Sparkles, 
  Trash2, AlertCircle, Check, Paperclip, User, Mail, Phone, ArrowRight,
  ShieldAlert, UserPlus, LogIn, Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlatform } from '../../context/PlatformContext';
import { fetchProfile } from '../../lib/api/profile';

export default function ApplyModal({ job, isOpen, onClose }) {
  const { applyToJob, currentUser } = usePlatform();
  const navigate = useNavigate();

  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidatePhone, setCandidatePhone] = useState('');
  const [pitch, setPitch] = useState('');
  
  // Resume state: { name, size, data, isFromProfile }
  const [resumeFile, setResumeFile] = useState(null);
  const [savedProfileResume, setSavedProfileResume] = useState(null);
  
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle modal visibility whether isOpen is explicitly provided or implicit
  const showModal = isOpen !== undefined ? isOpen : Boolean(job);

  // Pre-populate data from session & profile if candidate is logged in
  useEffect(() => {
    if (showModal && currentUser && currentUser.role === 'seeker') {
      setCandidateName(currentUser.name || '');
      setCandidateEmail(currentUser.email || '');

      const loadSavedProfile = async () => {
        try {
          const res = await fetchProfile();
          if (res?.profile) {
            const p = res.profile;
            if (p.phone) setCandidatePhone(p.phone);
            if (p.resume_name || p.resume_url) {
              const profileDoc = {
                name: p.resume_name || p.resume_url,
                size: p.resume_size || 'PDF Document',
                data: p.resume_data || null,
                url: p.resume_url,
                isFromProfile: true
              };
              setSavedProfileResume(profileDoc);
              setResumeFile(profileDoc);
            }
          }
        } catch (err) {
          console.warn('Could not auto-fetch user profile for apply modal:', err);
        }
      };
      loadSavedProfile();
    }
  }, [showModal, currentUser]);

  if (!showModal || !job) return null;

  // Handle PDF file selection - instant (0ms delay)
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        setErrorMessage('Please select a valid PDF document (.pdf).');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage('File size must be less than 10MB.');
        return;
      }

      setErrorMessage('');
      const blobUrl = URL.createObjectURL(file);
      setResumeFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        url: blobUrl,
        file,
        isFromProfile: false
      });
    }
  };

  const handleUseProfileResume = () => {
    if (savedProfileResume) {
      setResumeFile(savedProfileResume);
      setErrorMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!resumeFile) {
      setErrorMessage('Please upload or attach a PDF Resume / CV before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await applyToJob(job.id, {
        candidateName: candidateName.trim() || currentUser?.name || 'Applicant',
        candidateEmail: candidateEmail.trim() || currentUser?.email || 'candidate@example.com',
        candidatePhone: candidatePhone.trim() || '',
        pitch: pitch.trim(),
        resumeFile: resumeFile.file,
        resumeUrl: resumeFile.isFromProfile ? resumeFile.url : null
      });

      if (result?.warning) {
        setErrorMessage(result.warning);
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setPitch('');
        setSubmitting(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Application submit error:', err);
      setErrorMessage(err.response?.data?.message || 'Failed to submit application. Please try again.');
      setSubmitting(false);
    }
  };

  // Determine user authorization state
  const isCandidate = currentUser && currentUser.role === 'seeker';
  const isGuest = !currentUser;
  const isOtherRole = currentUser && currentUser.role !== 'seeker';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy/70 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-8"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-navy via-brand-navyDark to-indigo-950 text-white p-6 sm:p-7 relative border-b border-white/10">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="text-[10px] font-bold text-brand-teal uppercase tracking-widest inline-flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" /> Quick Job Application
            </span>
            <h3 className="text-xl font-bold text-white mt-1">{job.title}</h3>
            <p className="text-xs text-slate-300 mt-1">{job.company} • {job.location} ({job.workModel || 'Remote'})</p>
          </div>

          {/* 1. GUEST / NON-SEEKER GATEKEEPER VIEW */}
          {!isCandidate ? (
            <div className="p-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 border border-amber-200/80 flex items-center justify-center mx-auto shadow-sm">
                <Lock className="w-8 h-8 text-brand-accent" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h4 className="text-2xl font-black text-brand-navy">
                  Job Seeker Account Required
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {isGuest ? (
                    <>
                      To apply for <span className="font-bold text-brand-navy">{job.title}</span> at <span className="font-bold text-brand-navy">{job.company}</span>, you must be registered as a Job Seeker.
                    </>
                  ) : (
                    <>
                      You are currently signed in as an <span className="font-bold text-brand-navy">{currentUser.role}</span>. Applications can only be submitted from candidate accounts.
                    </>
                  )}
                </p>
              </div>

              {/* Benefits Capsule */}
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 text-left space-y-2 text-xs text-slate-700 max-w-md mx-auto">
                <span className="font-bold text-brand-navy block text-[11px] uppercase tracking-wider">
                  With a Job Seeker Account you can:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Upload & save PDF CVs</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Direct task assignments</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Live interview scheduling</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>100% Free Forever</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate('/register?role=seeker');
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 text-xs font-bold rounded-xl bg-brand-accent hover:bg-brand-accentHover text-white shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Job Seeker Account</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate('/login');
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
              </div>
            </div>
          ) : (
            /* 2. AUTHENTICATED JOB SEEKER APPLY FORM */
            submitted ? (
              <div className="p-10 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-bounce">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h4 className="text-2xl font-extrabold text-brand-navy">Application Submitted!</h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Your application and PDF resume have been safely submitted to <span className="font-bold text-brand-navy">{job.company}</span>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5">
                {/* Error Message */}
                {errorMessage && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Applicant Basic Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-brand-navy mb-1">Full Name <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="e.g. John Doe"
                        value={candidateName}
                        onChange={(e) => setCandidateName(e.target.value)}
                        className="w-full p-2.5 pl-8 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent font-medium bg-slate-50/50"
                      />
                      <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-navy mb-1">Email Address <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        placeholder="name@example.com"
                        value={candidateEmail}
                        onChange={(e) => setCandidateEmail(e.target.value)}
                        className="w-full p-2.5 pl-8 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent font-medium bg-slate-50/50"
                      />
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3.5" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1">Contact Phone Number</label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="+880 1700-000000"
                      value={candidatePhone}
                      onChange={(e) => setCandidatePhone(e.target.value)}
                      className="w-full p-2.5 pl-8 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent font-medium bg-slate-50/50"
                    />
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3.5" />
                  </div>
                </div>

                {/* PDF Resume Upload Section */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-brand-navy">
                      Resume / CV Document (PDF) <span className="text-rose-500">*</span>
                    </label>
                    {savedProfileResume && resumeFile?.name !== savedProfileResume.name && (
                      <button
                        type="button"
                        onClick={handleUseProfileResume}
                        className="text-[11px] font-bold text-brand-accent hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Paperclip className="w-3 h-3" />
                        <span>Use Saved Profile CV</span>
                      </button>
                    )}
                  </div>

                  {resumeFile ? (
                    <div className="p-4 rounded-2xl border-2 border-brand-accent/40 bg-blue-50/50 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2.5 rounded-xl bg-rose-500 text-white shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h5 className="text-xs font-bold text-brand-navy truncate">{resumeFile.name}</h5>
                          <p className="text-[10px] text-slate-500">
                            {resumeFile.size} • {resumeFile.isFromProfile ? 'From Profile Portfolio' : 'Ready to Submit'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <label className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 cursor-pointer shadow-sm">
                          <span>Change PDF</span>
                          <input type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} />
                        </label>
                        <button
                          type="button"
                          onClick={() => setResumeFile(null)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                          title="Remove attached PDF"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-brand-accent/50 hover:border-brand-accent bg-blue-50/40 hover:bg-blue-50 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors space-y-2 text-center">
                      <div className="w-10 h-10 rounded-full bg-brand-accent text-white flex items-center justify-center shadow-md">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-brand-navy block">Click to upload or Drag & Drop PDF Resume</span>
                        <span className="text-[10px] text-slate-500">PDF files up to 10MB supported</span>
                      </div>
                      <input type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} />
                    </label>
                  )}
                </div>

                {/* Cover Pitch */}
                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1">
                    Elevator Pitch / Cover Note <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={pitch}
                    onChange={(e) => setPitch(e.target.value)}
                    placeholder="Introduce yourself, your key qualifications, and why you're a standout fit for this role..."
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 text-xs font-bold rounded-xl bg-brand-accent hover:bg-brand-accentHover text-white shadow-md shadow-brand-accent/25 flex items-center gap-2 cursor-pointer disabled:opacity-70"
                  >
                    {submitting ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Application</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
