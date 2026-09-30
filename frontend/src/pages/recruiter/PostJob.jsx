import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, CheckCircle, ArrowRight, ArrowLeft, 
  Briefcase, DollarSign, MapPin, Sparkles, Check, Zap
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import BoostModal from '../../components/common/BoostModal';

export default function PostJob() {
  const navigate = useNavigate();
  const { addListing, categories, currentUser } = usePlatform();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [createdJobId, setCreatedJobId] = useState(null);
  const [showBoostModal, setShowBoostModal] = useState(false);

  const [title, setTitle] = useState('');
  const [categoryType, setCategoryType] = useState('Job'); // 'Job' vs 'Internship'
  const [category, setCategory] = useState(categories[0]?.name || 'Software Development');
  const [type, setType] = useState('Full-Time');
  const [workModel, setWorkModel] = useState('Remote');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [experience, setExperience] = useState('Mid-Level (2-5 yrs)');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [wantBoost, setWantBoost] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please provide a job title.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');
    try {
    const newPosting = await addListing({
      title: title.trim(),
      categoryType,
      category,
      type,
      workModel,
      location: location.trim() || 'Remote',
      salary: salary.trim() || 'Competitive',
      experience,
      description: description.trim() || 'Detailed job description will be provided to shortlisted candidates.',
      requirements: requirements ? requirements.split('\n').filter(r => r.trim()) : ['Relevant industry experience', 'Strong communication skills'],
      tags: [categoryType, type, workModel]
    });

    setCreatedJobId(newPosting.id);
    setSubmitted(true);

    if (wantBoost) setShowBoostModal(true);
    } catch (error) {
      setSubmitError(error.response?.data?.message || 'Unable to create the listing. Please try again.');
    } finally { setSubmitting(false); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="bg-brand-navy text-white rounded-3xl p-8 border border-white/10 shadow-xl flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-brand-teal uppercase tracking-widest">Listing Creation Wizard</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Create Opportunity Listing</h1>
          <p className="text-xs text-slate-300">Publish jobs or internships directly to verified candidates.</p>
        </div>
      </div>

      {submitted ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-card space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-brand-navy">Listing Submitted for Review</h2>
          <p className="text-xs text-slate-600 max-w-sm mx-auto">
            Your <span className="font-bold">{categoryType}</span> posting for <span className="font-bold">{title}</span> will appear in the directory after administrator approval.
          </p>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 max-w-md mx-auto flex items-center justify-between">
            <div className="text-left text-xs">
              <span className="font-bold text-amber-900 block">Want higher applicant engagement?</span>
              <span className="text-amber-700">Boost this post to display at top of search results.</span>
            </div>
            <button
              onClick={() => setShowBoostModal(true)}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-brand-navy font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-sm cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Boost Post</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              onClick={() => {
                setSubmitted(false);
                setStep(1);
                setTitle('');
                setLocation('');
                setSalary('');
                setDescription('');
                setRequirements('');
              }}
              className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              Post Another Opening
            </button>
            <button
              onClick={() => navigate('/jobs')}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-brand-accent text-white hover:bg-brand-accentHover cursor-pointer"
            >
              View in Directory
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} aria-busy={submitting} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
          {submitError && <p role="alert" className="text-rose-700">{submitError}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Opportunity Type <span className="text-rose-500">*</span></label>
              <select
                value={categoryType}
                onChange={(e) => setCategoryType(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-white font-medium"
              >
                <option value="Job">Regular Job Opening</option>
                <option value="Internship">Student / Internship Opening</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Position Title <span className="text-rose-500">*</span></label>
              <input
                type="text"
                required
                placeholder="e.g. Senior Frontend Engineer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Industry Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-white font-medium"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Employment Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-white font-medium"
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Work Model</label>
              <select
                value={workModel}
                onChange={(e) => setWorkModel(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-white font-medium"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Location</label>
              <input
                type="text"
                placeholder="e.g. New York, NY (or Remote)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Salary Range / Compensation</label>
              <input
                type="text"
                placeholder="e.g. $120,000 - $150,000 / yr"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Experience Level</label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-white font-medium"
              >
                <option value="Entry / Student">Entry / Student (0-1 yrs)</option>
                <option value="Junior (1-2 yrs)">Junior (1-2 yrs)</option>
                <option value="Mid-Level (2-5 yrs)">Mid-Level (2-5 yrs)</option>
                <option value="Senior (5+ yrs)">Senior (5+ yrs)</option>
                <option value="Lead (7+ yrs)">Lead (7+ yrs)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-navy mb-1">Job Description Overview</label>
            <textarea
              rows={4}
              required
              placeholder="Outline role responsibilities, key projects, and team background..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-navy mb-1">Candidate Requirements (One per line)</label>
            <textarea
              rows={4}
              placeholder="3+ years experience in React/Node&#10;Strong communication skills&#10;Experience with CI/CD pipelines"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent font-medium"
            />
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-amber-900 block">Feature / Boost this opening?</span>
              <span className="text-[11px] text-amber-700">Gain top ranking badge in public job search.</span>
            </div>
            <input
              type="checkbox"
              checked={wantBoost}
              onChange={(e) => setWantBoost(e.target.checked)}
              className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit" disabled={submitting}
              className="px-8 py-3.5 rounded-2xl bg-brand-accent hover:bg-brand-accentHover text-white font-bold text-xs shadow-md shadow-brand-accent/25 flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publish Opportunity Now</span>
            </button>
          </div>
        </form>
      )}

      {createdJobId && (
        <BoostModal
          isOpen={showBoostModal}
          onClose={() => setShowBoostModal(false)}
          jobId={createdJobId}
          jobTitle={title}
        />
      )}
    </div>
  );
}
