import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, CheckCircle, ArrowRight, ArrowLeft, 
  Briefcase, DollarSign, MapPin, Sparkles, Check, Zap
} from 'lucide-react';
import { mockCategories } from '../../data/mockData';
import { usePlatform } from '../../context/PlatformContext';
import BoostModal from '../../components/common/BoostModal';

export default function PostJob() {
  const navigate = useNavigate();
  const { addListing } = usePlatform();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [createdJobId, setCreatedJobId] = useState(null);
  const [showBoostModal, setShowBoostModal] = useState(false);

  const [title, setTitle] = useState('');
  const [categoryType, setCategoryType] = useState('Job'); // Required: 'Job' vs 'Internship'
  const [category, setCategory] = useState('Software Development');
  const [type, setType] = useState('Full-Time');
  const [workModel, setWorkModel] = useState('Remote');
  const [location, setLocation] = useState('San Francisco, CA');
  const [salary, setSalary] = useState('$150,000 - $180,000');
  const [experience, setExperience] = useState('Senior (5+ yrs)');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [wantBoost, setWantBoost] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPosting = addListing({
      title: title || (categoryType === 'Internship' ? 'Engineering Intern' : 'Senior Software Engineer'),
      categoryType,
      category,
      type,
      workModel,
      location,
      salary,
      experience,
      description: description || 'Exciting career opportunity at an enterprise tech organization.',
      requirements: requirements ? requirements.split('\n') : ['3+ years experience', 'Strong communication skills'],
      tags: [categoryType, type, category.split(' ')[0], workModel]
    });

    setCreatedJobId(newPosting.id);
    setSubmitted(true);

    if (wantBoost) {
      setShowBoostModal(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="bg-brand-navy text-white rounded-3xl p-8 border border-white/10 shadow-xl flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-brand-teal uppercase tracking-widest">Listing Creation Wizard</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Create Opportunity Listing</h1>
          <p className="text-xs text-slate-300">Publish jobs or internships to over 25,000+ verified candidates.</p>
        </div>
      </div>

      {submitted ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-card space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-brand-navy">Position Published Successfully!</h2>
          <p className="text-xs text-slate-600 max-w-sm mx-auto">
            Your <span className="font-bold">{categoryType}</span> posting for <span className="font-bold">{title || 'Position'}</span> is now live in the directory.
          </p>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 max-w-md mx-auto flex items-center justify-between">
            <div className="text-left text-xs">
              <span className="font-bold text-amber-900 block">Want higher applicant engagement?</span>
              <span className="text-amber-700">Boost this post to display at top of search results.</span>
            </div>
            <button
              onClick={() => setShowBoostModal(true)}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-brand-navy font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-sm"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Boost Post</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              onClick={() => { setSubmitted(false); setStep(1); }}
              className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100"
            >
              Post Another Opening
            </button>
            <button
              onClick={() => navigate('/jobs')}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-brand-accent text-white hover:bg-brand-accentHover"
            >
              View in Opportunities Portal
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
          {/* Stepper Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 text-xs font-bold">
            {[
              { num: 1, label: 'Category & Basics' },
              { num: 2, label: 'Type & Compensation' },
              { num: 3, label: 'Details & Promotion' },
            ].map((s) => (
              <div key={s.num} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === s.num ? 'bg-brand-accent text-white' :
                  step > s.num ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <span className={step === s.num ? 'text-brand-navy' : 'text-slate-400'}>{s.label}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                {/* Mandatory Category Type Selector */}
                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-2">
                    Posting Category <span className="text-rose-500">* (Required)</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setCategoryType('Job')}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        categoryType === 'Job'
                          ? 'border-brand-accent bg-blue-50/60 ring-2 ring-brand-accent/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-brand-navy">Full-Time / Part-Time Job</span>
                        {categoryType === 'Job' && <Check className="w-4 h-4 text-brand-accent" />}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">Standard career opening for professional candidates.</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCategoryType('Internship')}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        categoryType === 'Internship'
                          ? 'border-purple-500 bg-purple-50/60 ring-2 ring-purple-500/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-brand-navy">Internship Opportunity</span>
                        {categoryType === 'Internship' && <Check className="w-4 h-4 text-purple-600" />}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">Student, trainee, or early career placement program.</p>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1">Listing Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={categoryType === 'Internship' ? 'e.g. Frontend Engineering Intern (Summer 2026)' : 'e.g. Senior Full Stack Engineer'}
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-navy mb-1">Industry Field</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-white"
                    >
                      {mockCategories.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-navy mb-1">Primary Location</label>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. San Francisco, CA (or Remote)"
                      className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-6 py-3 rounded-xl bg-brand-accent hover:bg-brand-accentHover text-white font-bold text-xs flex items-center gap-2"
                  >
                    <span>Next: Type & Compensation</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-navy mb-1">Employment Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="Full-Time">Full-Time</option>
                      <option value="Contract">Contract</option>
                      <option value="Part-Time">Part-Time</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-navy mb-1">Work Model</label>
                    <select
                      value={workModel}
                      onChange={(e) => setWorkModel(e.target.value)}
                      className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="On-site">On-site</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-navy mb-1">Stipend / Salary Range</label>
                    <input
                      type="text"
                      required
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      placeholder={categoryType === 'Internship' ? '$40 - $55 / hr' : '$150,000 - $180,000'}
                      className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-navy mb-1">Experience Expectations</label>
                    <input
                      type="text"
                      required
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      placeholder={categoryType === 'Internship' ? 'Student / Early Career' : 'Senior (5+ yrs)'}
                      className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-6 py-3 rounded-xl bg-brand-accent hover:bg-brand-accentHover text-white font-bold text-xs flex items-center gap-2"
                  >
                    <span>Next: Details & Promotion</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1">Role Description</label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the opportunity, key missions, and team culture..."
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1">Requirements & Qualifications (One per line)</label>
                  <textarea
                    rows={3}
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder="Proficiency with React/TypeScript&#10;Strong understanding of REST APIs&#10;Collaborative mindset"
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent"
                  />
                </div>

                {/* Option to Boost Immediately */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-600 flex items-center justify-center">
                      <Zap className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-brand-navy">Featured Job Boost Subscription</h4>
                      <p className="text-[11px] text-slate-600">Highlight your post at the top of candidate search results.</p>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-brand-navy">
                    <input
                      type="checkbox"
                      checked={wantBoost}
                      onChange={(e) => setWantBoost(e.target.checked)}
                      className="w-4 h-4 rounded text-brand-accent focus:ring-brand-accent"
                    />
                    <span>Boost This Post</span>
                  </label>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-4 py-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3.5 rounded-xl bg-brand-accent hover:bg-brand-accentHover text-white font-bold text-xs shadow-md flex items-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Publish {categoryType} Listing</span>
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      )}

      <BoostModal
        isOpen={showBoostModal}
        onClose={() => setShowBoostModal(false)}
        itemTitle={title || 'New Opportunity'}
        itemId={createdJobId}
      />
    </div>
  );
}
