import React, { useState } from 'react';
import { 
  Bot, Sparkles, Filter, ArrowUpDown, CheckCircle, 
  XCircle, AlertCircle, Award, Sliders, RefreshCw, Check
} from 'lucide-react';
import { mockApplicantsList } from '../../data/mockData';

export default function AIScreening() {
  const [analyzing, setAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(true);

  // Criteria Form State
  const [reqSkills, setReqSkills] = useState('React, TypeScript, Next.js, Tailwind CSS');
  const [minExp, setMinExp] = useState('5 Years');
  const [education, setEducation] = useState('B.S. in Computer Science or related');
  const [certifications, setCertifications] = useState('AWS Certified Developer, Meta Frontend Professional');
  const [languages, setLanguages] = useState('TypeScript, JavaScript, Python');
  const [keywords, setKeywords] = useState('Design Systems, WCAG Accessibility, Micro-frontend');
  const [minCgpa, setMinCgpa] = useState('3.50 / 4.00');
  const [location, setLocation] = useState('San Francisco, CA or Remote');
  const [customReqs, setCustomReqs] = useState('Must have experience scaling SaaS dashboards with 100k+ active users.');

  const [filterRecommendation, setFilterRecommendation] = useState('All');
  const [sortBy, setSortBy] = useState('score');

  // Mock candidates with AI attributes
  const [aiCandidates, setAiCandidates] = useState([
    {
      id: 'ai-1',
      name: 'Alex Vance',
      role: 'Senior React Developer',
      matchScore: 96,
      recommendation: 'Highly Recommended',
      matchedSkills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Redux Toolkit'],
      missingSkills: ['GraphQL'],
      education: 'B.S. Computer Science (CGPA 3.85)',
      experience: '6 Years',
      reason: 'Perfect match for core React/TypeScript frontend requirements with strong background in SaaS dashboards.'
    },
    {
      id: 'ai-2',
      name: 'Elena Rostova',
      role: 'Product Designer',
      matchScore: 88,
      recommendation: 'Recommended',
      matchedSkills: ['Figma', 'Design Systems', 'Micro-interactions'],
      missingSkills: ['React Code Handoff'],
      education: 'B.A. Interaction Design (CGPA 3.70)',
      experience: '5 Years',
      reason: 'Exceptional visual design portfolio and system thinking; minor gap in production coding experience.'
    },
    {
      id: 'ai-3',
      name: 'Marcus Chen',
      role: 'DevOps & Cloud Engineer',
      matchScore: 74,
      recommendation: 'Consider',
      matchedSkills: ['Python', 'AWS', 'Kubernetes'],
      missingSkills: ['React', 'Next.js', 'Frontend Architecture'],
      education: 'M.S. Cloud Infrastructure (CGPA 3.90)',
      experience: '8 Years',
      reason: 'Strong infrastructure skillset, but role requires heavy user interface component construction.'
    },
    {
      id: 'ai-4',
      name: 'David Miller',
      role: 'Junior Web Developer',
      matchScore: 45,
      recommendation: 'Not Suitable',
      matchedSkills: ['HTML', 'CSS'],
      missingSkills: ['React 18+', 'TypeScript', 'Next.js', 'Design Systems'],
      education: 'Diploma in Web Fundamentals (CGPA 2.90)',
      experience: '1 Year',
      reason: 'Below minimum 5 years experience threshold and lacks required React/TypeScript mastery.'
    }
  ]);

  const handleAnalyze = (e) => {
    e.preventDefault();
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setHasAnalyzed(true);
    }, 1500);
  };

  const getRecommendationBadge = (tag) => {
    switch (tag) {
      case 'Highly Recommended':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Recommended':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Consider':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Not Suitable':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const filteredCandidates = aiCandidates
    .filter(c => filterRecommendation === 'All' || c.recommendation === filterRecommendation)
    .sort((a, b) => sortBy === 'score' ? b.matchScore - a.matchScore : a.name.localeCompare(b.name));

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-brand-navy text-white rounded-3xl p-8 border border-white/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-purple-500 to-indigo-500 text-white uppercase tracking-wider">
              UI PLACEHOLDER MODULE
            </span>
            <span className="text-xs text-slate-300">Automated Match Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            AI Candidate Screening & Shortlisting
          </h1>
          <p className="text-xs text-slate-300">Configure custom criteria and let the AI ranking interface evaluate applicants.</p>
        </div>

        <div className="p-3 rounded-2xl bg-white/10 border border-white/20 text-xs text-slate-200 max-w-xs">
          <strong className="text-amber-400 block">Future AI Backend Integration:</strong>
          This interface is structured with zero backend logic, ready for API model binding.
        </div>
      </div>

      {/* Criteria Section Form */}
      <form onSubmit={handleAnalyze} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-brand-navy flex items-center gap-2">
            <Sliders className="w-5 h-5 text-brand-accent" />
            <span>AI Shortlisting Screening Criteria</span>
          </h3>
          <span className="text-xs font-semibold text-slate-400">Configure parameters for candidate scoring</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-brand-navy mb-1">Required Skills (Comma separated)</label>
            <input
              type="text"
              value={reqSkills}
              onChange={(e) => setReqSkills(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-navy mb-1">Years of Experience</label>
            <input
              type="text"
              value={minExp}
              onChange={(e) => setMinExp(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-brand-navy mb-1">Education Level</label>
            <input
              type="text"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-navy mb-1">Preferred Certifications</label>
            <input
              type="text"
              value={certifications}
              onChange={(e) => setCertifications(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-brand-navy mb-1">Programming Languages</label>
            <input
              type="text"
              value={languages}
              onChange={(e) => setLanguages(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-navy mb-1">Target Keywords</label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-navy mb-1">Minimum CGPA</label>
            <input
              type="text"
              value={minCgpa}
              onChange={(e) => setMinCgpa(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-brand-navy mb-1">Location Preference</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-navy mb-1">Custom Requirements</label>
            <input
              type="text"
              value={customReqs}
              onChange={(e) => setCustomReqs(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={analyzing}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 flex items-center gap-2"
          >
            {analyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running AI Screening Algorithm...</span>
              </>
            ) : (
              <>
                <Bot className="w-4 h-4" />
                <span>Analyze Applications</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* AI Screening Results Board */}
      {hasAnalyzed && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-brand-navy flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span>AI Screening Match Results</span>
              </h3>
              <p className="text-xs text-slate-500">Evaluated 4 candidate applications against criteria parameters.</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Filter by recommendation */}
              <div className="flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={filterRecommendation}
                  onChange={(e) => setFilterRecommendation(e.target.value)}
                  className="p-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold"
                >
                  <option value="All">All Recommendations</option>
                  <option value="Highly Recommended">Highly Recommended</option>
                  <option value="Recommended">Recommended</option>
                  <option value="Consider">Consider</option>
                  <option value="Not Suitable">Not Suitable</option>
                </select>
              </div>

              {/* Sort selector */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="p-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold"
              >
                <option value="score">Sort by Highest Match Score</option>
                <option value="name">Sort by Candidate Name</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredCandidates.map((cand) => (
              <div
                key={cand.id}
                className="p-6 rounded-2xl border border-slate-200 hover:border-purple-300 shadow-sm space-y-4 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-md">
                      {cand.matchScore}%
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-brand-navy">{cand.name}</h4>
                        <span className={`px-3 py-0.5 rounded-full text-[10px] font-extrabold border ${getRecommendationBadge(cand.recommendation)}`}>
                          {cand.recommendation}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{cand.role} • {cand.experience} Exp • {cand.education}</p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                  <strong className="text-brand-navy">AI Rationale:</strong> {cand.reason}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">Matched Skills</span>
                    <div className="flex flex-wrap gap-1">
                      {cand.matchedSkills.map(s => (
                        <span key={s} className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-100">
                    <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block mb-1">Missing Skills</span>
                    <div className="flex flex-wrap gap-1">
                      {cand.missingSkills.length === 0 ? (
                        <span className="text-[10px] text-slate-400 font-medium">None</span>
                      ) : (
                        cand.missingSkills.map(s => (
                          <span key={s} className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-semibold">
                            ✗ {s}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
