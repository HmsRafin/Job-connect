import React, { useState } from 'react';
import { 
  User, Mail, Phone, MapPin, Upload, FileText, Trash2, Plus, 
  Check, Save, Sparkles, Globe, Briefcase 
} from 'lucide-react';
import { mockSeekerProfile } from '../../data/mockData';

export default function ProfileCV() {
  const [profile, setProfile] = useState(mockSeekerProfile);
  const [skills, setSkills] = useState(mockSeekerProfile.skills);
  const [newSkill, setNewSkill] = useState('');
  const [resumeFile, setResumeFile] = useState(mockSeekerProfile.resume);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const addSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile({
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        uploadedAt: 'Just now'
      });
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-brand-navy text-white rounded-3xl p-8 border border-white/10 shadow-xl flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-brand-teal uppercase tracking-widest">Candidate Portfolio</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Profile & CV Builder</h1>
          <p className="text-xs text-slate-300">Keep your skills and resume up to date for direct recruiter matches.</p>
        </div>

        {savedSuccess && (
          <div className="px-4 py-2 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Profile Saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Personal Details & Bio Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
          <h3 className="text-lg font-bold text-brand-navy border-b border-slate-100 pb-3">
            Personal Information & Bio
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Professional Title</label>
              <input
                type="text"
                value={profile.title}
                onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Location</label>
              <input
                type="text"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-navy mb-1">Executive Summary / Bio</label>
            <textarea
              rows={4}
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent"
            />
          </div>
        </div>

        {/* Drag & Drop PDF Resume Upload Area */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-4">
          <h3 className="text-lg font-bold text-brand-navy border-b border-slate-100 pb-3">
            Resume / CV Document
          </h3>

          {resumeFile ? (
            <div className="p-4 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-rose-50 text-rose-600">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-brand-navy">{resumeFile.fileName}</h4>
                  <p className="text-[10px] text-slate-500">{resumeFile.fileSize} • Uploaded {resumeFile.uploadedAt}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer">
                  <span>Replace</span>
                  <input type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} />
                </label>
                <button
                  type="button"
                  onClick={() => setResumeFile(null)}
                  className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <label className="border-2 border-dashed border-brand-accent/40 bg-blue-50/40 hover:bg-blue-50 rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors space-y-3 text-center">
              <div className="w-12 h-12 rounded-full bg-brand-accent text-white flex items-center justify-center shadow-md">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-brand-navy block">Click or Drag & Drop PDF Resume</span>
                <span className="text-[10px] text-slate-500">PDF documents up to 10MB supported</span>
              </div>
              <input type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} />
            </label>
          )}
        </div>

        {/* Skills Tag Generator */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-4">
          <h3 className="text-lg font-bold text-brand-navy border-b border-slate-100 pb-3">
            Core Technical Skills
          </h3>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Add skill (e.g. GraphQL, Next.js)..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="flex-1 p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent"
            />
            <button
              type="button"
              onClick={addSkill}
              className="px-4 py-2.5 rounded-xl bg-brand-navy text-white text-xs font-bold flex items-center gap-1 hover:bg-brand-navyDark"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-brand-navy/5 text-brand-navy border border-slate-200 flex items-center gap-2"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="hover:text-rose-600 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3.5 rounded-2xl bg-brand-accent hover:bg-brand-accentHover text-white font-bold text-xs shadow-lg shadow-brand-accent/25 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}
