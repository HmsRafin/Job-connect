import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, Plus, Edit, Trash2, Users, Zap, 
  MapPin, DollarSign, Clock, CheckCircle2, AlertCircle, X, Save 
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import BoostModal from '../../components/common/BoostModal';

export default function MyJobPosts() {
  const { listings, currentUser, myApplications = [], updateListing, deleteListing, categories } = usePlatform();
  const [selectedForBoost, setSelectedForBoost] = useState(null);
  const [showBoostModal, setShowBoostModal] = useState(false);

  // Edit Modal State
  const [editingJob, setEditingJob] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editType, setEditType] = useState('Full-Time');
  const [editWorkModel, setEditWorkModel] = useState('Remote');
  const [editLocation, setEditLocation] = useState('');
  const [editSalary, setEditSalary] = useState('');
  const [editExperience, setEditExperience] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editRequirements, setEditRequirements] = useState('');
  const [editStatus, setEditStatus] = useState('Active');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  const currentComp = currentUser?.companyName || currentUser?.name || '';
  const currentDbId = currentUser?.dbId || (currentUser?.id ? Number(String(currentUser.id).replace('usr-', '')) : null);

  // Filter listings strictly for this company / recruiter (no fallbacks)
  const myListings = listings.filter(l => {
    if (!currentUser) return false;
    if (currentDbId && l.userId && Number(l.userId) === Number(currentDbId)) return true;
    if (currentComp && l.company && l.company.trim().toLowerCase() === currentComp.trim().toLowerCase()) return true;
    return false;
  });

  const handleOpenEdit = (job) => {
    setEditingJob(job);
    setEditTitle(job.title || '');
    setEditCategory(job.category || 'Software Development');
    setEditType(job.type || 'Full-Time');
    setEditWorkModel(job.workModel || 'Remote');
    setEditLocation(job.location || 'Remote');
    setEditSalary(job.salary || 'Competitive');
    setEditExperience(job.experience || 'Mid-Level (2-5 yrs)');
    setEditDescription(job.description || '');
    setEditRequirements(Array.isArray(job.requirements) ? job.requirements.join('\n') : (job.requirements || ''));
    setEditStatus(job.status || 'Active');
    setSaveMsg('');
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingJob) return;

    setSaving(true);
    setSaveMsg('');

    try {
      const updatedData = {
        title: editTitle.trim(),
        company: editingJob.company,
        category: editCategory,
        categoryType: editingJob.categoryType || 'Job',
        type: editType,
        workModel: editWorkModel,
        location: editLocation.trim() || 'Remote',
        salary: editSalary.trim() || 'Competitive',
        experience: editExperience,
        description: editDescription.trim(),
        requirements: editRequirements.split('\n').filter(r => r.trim()),
        status: editStatus,
      };

      await updateListing(editingJob.id, updatedData);
      setSaveMsg('Job posting updated and saved to database successfully!');
      setTimeout(() => {
        setEditingJob(null);
        setSaveMsg('');
      }, 1200);
    } catch (err) {
      console.error(err);
      setSaveMsg('Failed to update job posting.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      await deleteListing(id);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-brand-navy text-white rounded-3xl p-8 border border-white/10 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5" />
            Employer Job Inventory
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">My Job & Internship Posts</h1>
          <p className="text-xs text-slate-300">
            View, edit, and monitor all job opportunities published by {currentComp || 'your company'}.
          </p>
        </div>

        <Link
          to="/recruiter/jobs/create"
          className="px-6 py-3.5 rounded-2xl bg-brand-accent hover:bg-brand-accentHover text-white font-bold text-xs shadow-md shadow-brand-accent/25 flex items-center gap-2 cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Position</span>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Total Published Posts</span>
            <span className="text-2xl font-black text-brand-navy">{myListings.length}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-accent flex items-center justify-center font-bold">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Active Openings</span>
            <span className="text-2xl font-black text-emerald-600">
              {myListings.filter(l => l.status === 'Active').length}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Featured / Boosted Posts</span>
            <span className="text-2xl font-black text-amber-500">
              {myListings.filter(l => l.featured).length}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Listings List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-brand-navy">Published Job & Internship Openings</h3>
          <span className="text-xs text-slate-500 font-semibold">{myListings.length} Positions</span>
        </div>

        {myListings.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs space-y-3">
            <Briefcase className="w-12 h-12 mx-auto text-slate-300" />
            <p className="text-sm font-bold text-slate-600">You haven't posted any jobs or internships yet.</p>
            <p className="text-xs text-slate-400">Click the button above to publish your first hiring opening.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {myListings.map((job) => (
              <div 
                key={job.id} 
                className="p-6 rounded-2xl border border-slate-200 hover:border-brand-accent/40 shadow-sm transition-all space-y-4 bg-white"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-100 text-brand-accent uppercase">
                        {job.categoryType || 'Job'}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {job.type}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        job.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {job.status || 'Active'}
                      </span>
                      {job.featured && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                          <Zap className="w-3 h-3 fill-current text-amber-500" />
                          Featured
                        </span>
                      )}
                    </div>
                    <h4 className="text-lg font-bold text-brand-navy">{job.title}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-3 flex-wrap">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location} ({job.workModel})</span>
                      <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> {job.salary}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Posted {job.postedDate}</span>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => handleOpenEdit(job)}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-brand-navy font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Post</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedForBoost(job);
                        setShowBoostModal(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-600 fill-current" />
                      <span>Boost</span>
                    </button>

                    <Link
                      to="/recruiter/applicants"
                      className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-brand-accent font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Applicants ({myApplications.filter(a => String(a.jobId) === String(job.id)).length || job.applicationsCount || 0})</span>
                    </Link>

                    <button
                      onClick={() => handleDelete(job.id, job.title)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete Job"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Job Modal */}
      {editingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 space-y-6 p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-brand-accent uppercase tracking-wider">Database Update</span>
                <h3 className="text-lg font-bold text-brand-navy">Edit Job Posting</h3>
              </div>
              <button 
                onClick={() => setEditingJob(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-brand-navy hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {saveMsg && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{saveMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-brand-navy mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1">Category</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-white font-medium"
                  >
                    {categories.map(c => (
                      <option key={c.id || c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1">Employment Type</label>
                  <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value)}
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-white font-medium"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1">Work Model</label>
                  <select
                    value={editWorkModel}
                    onChange={(e) => setEditWorkModel(e.target.value)}
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-white font-medium"
                  >
                    <option value="Remote">Remote</option>
                    <option value="On-Site">On-Site</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1">Location</label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1">Salary Range</label>
                  <input
                    type="text"
                    value={editSalary}
                    onChange={(e) => setEditSalary(e.target.value)}
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1">Experience Level</label>
                  <select
                    value={editExperience}
                    onChange={(e) => setEditExperience(e.target.value)}
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-white font-medium"
                  >
                    <option value="Entry-Level (0-2 yrs)">Entry-Level (0-2 yrs)</option>
                    <option value="Mid-Level (2-5 yrs)">Mid-Level (2-5 yrs)</option>
                    <option value="Senior (5+ yrs)">Senior (5+ yrs)</option>
                    <option value="Lead / Executive">Lead / Executive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1">Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-white font-medium"
                  >
                    <option value="Active">Active (Accepting Applications)</option>
                    <option value="Paused">Paused</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-navy mb-1">Description *</label>
                <textarea
                  rows={4}
                  required
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-navy mb-1">Requirements (one per line)</label>
                <textarea
                  rows={3}
                  value={editRequirements}
                  onChange={(e) => setEditRequirements(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingJob(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-brand-accent hover:bg-brand-accentHover text-white font-bold text-xs shadow-md flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save & Update Database'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Boost Modal */}
      {selectedForBoost && (
        <BoostModal
          isOpen={showBoostModal}
          onClose={() => setShowBoostModal(false)}
          itemTitle={selectedForBoost.title}
          itemId={selectedForBoost.id}
        />
      )}
    </div>
  );
}
