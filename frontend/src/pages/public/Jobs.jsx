import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, MapPin, Filter, Bookmark, ArrowUpDown, X, 
  Briefcase, Check, Sparkles, ChevronDown, Zap, ExternalLink, GraduationCap, Building2, SlidersHorizontal
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import ApplyModal from '../../components/common/ApplyModal';

export default function Jobs() {
  const { listings, advertisements, categories, savedJobIds, toggleSaveJob } = usePlatform();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const initialKeyword = searchParams.get('keyword') || '';
  const initialLocation = searchParams.get('location') || '';
  const initialCategory = searchParams.get('category') || '';
  const initialTab = searchParams.get('tab') || 'All'; // 'All', 'Jobs', 'Internships'

  const [activeTab, setActiveTab] = useState(initialTab);
  const [keyword, setKeyword] = useState(initialKeyword);
  const [locationFilter, setLocationFilter] = useState(initialLocation);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedWorkModel, setSelectedWorkModel] = useState('All');
  const [minSalary, setMinSalary] = useState(0);
  const [selectedJob, setSelectedJob] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state when URL query params change (e.g. from Home search or back navigation)
  useEffect(() => {
    const kw = searchParams.get('keyword');
    const loc = searchParams.get('location');
    const cat = searchParams.get('category');
    const tab = searchParams.get('tab');

    if (kw !== null && kw !== undefined) setKeyword(kw);
    if (loc !== null && loc !== undefined) setLocationFilter(loc);
    if (cat !== null && cat !== undefined) setSelectedCategory(cat);
    if (tab !== null && tab !== undefined) setActiveTab(tab);
  }, [searchParams]);

  const popularKeywords = [
    'Web Developer', 'React', 'Node.js', 'Python', 'Backend Developer', 
    'Frontend Developer', 'UI/UX Designer', 'Laravel', 'Full-Stack',
    'Customer Support', 'Marketing', 'Sales'
  ];

  const jobTypes = ['Full-Time', 'Contract', 'Part-Time', 'Internship'];
  const workModels = ['All', 'Remote', 'Hybrid', 'On-site'];

  const toggleJobType = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  // Helper to extract numerical salary from strings like "$90,000 - $130,000", "$80k", "$45,000"
  const parseSalaryNumber = (salaryStr) => {
    if (!salaryStr) return 0;
    if (typeof salaryStr === 'number') return salaryStr;
    const cleaned = String(salaryStr).replace(/,/g, '');
    const matches = cleaned.match(/\d+/g);
    if (matches && matches.length > 0) {
      const numbers = matches.map(Number);
      const maxVal = Math.max(...numbers);
      if (maxVal < 1000 && String(salaryStr).toLowerCase().includes('k')) {
        return maxVal * 1000;
      }
      return maxVal;
    }
    return 100000; // default permissive
  };

  // Filtered logic across listings
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      // 1. Tab subpage category filter (Jobs vs Internships)
      if (activeTab === 'Jobs') {
        if (item.categoryType === 'Internship' || item.type === 'Internship') return false;
      }
      if (activeTab === 'Internships') {
        if (item.categoryType !== 'Internship' && item.type !== 'Internship') return false;
      }

      // 2. Keyword Search (title, skills, requirements, tags, company, category, keywords, description)
      if (keyword && keyword.trim()) {
        const rawQuery = keyword.toLowerCase().trim();
        
        // Build comprehensive searchable corpus for the listing
        const requirementsText = Array.isArray(item.requirements) 
          ? item.requirements.join(' ') 
          : (typeof item.requirements === 'string' ? item.requirements : '');
        
        const tagsText = Array.isArray(item.tags) 
          ? item.tags.join(' ') 
          : (typeof item.tags === 'string' ? item.tags : '');

        const corpus = `
          ${item.title || ''} 
          ${item.company || ''} 
          ${item.category || ''} 
          ${item.categoryType || ''} 
          ${item.type || ''} 
          ${item.workModel || ''} 
          ${item.experience || ''} 
          ${item.description || ''} 
          ${requirementsText} 
          ${tagsText}
        `.toLowerCase();

        // Check full phrase match first
        const matchesExactPhrase = corpus.includes(rawQuery);
        
        if (!matchesExactPhrase) {
          // Check if every individual word in the search query matches the corpus
          const words = rawQuery.split(/[\s,+/]+/).filter(w => w.length > 0);
          const allWordsMatch = words.every(w => corpus.includes(w));
          if (!allWordsMatch) return false;
        }
      }

      // 3. City / Location / Work Setup filter
      if (locationFilter && locationFilter.trim()) {
        const locQuery = locationFilter.toLowerCase().trim();
        const itemLocation = (item.location || '').toLowerCase();
        const itemWorkModel = (item.workModel || '').toLowerCase();

        const matchesLoc = itemLocation.includes(locQuery) || itemWorkModel.includes(locQuery);
        if (!matchesLoc) {
          // Match by individual words (e.g. "Dhaka" in "Dhaka, Bangladesh")
          const locTokens = locQuery.split(/[\s,+/]+/).filter(w => w.length > 0);
          const anyTokenMatch = locTokens.some(tok => itemLocation.includes(tok) || itemWorkModel.includes(tok));
          if (!anyTokenMatch) return false;
        }
      }

      // 4. Industry Category filter
      if (selectedCategory && selectedCategory !== 'All') {
        if (item.category !== selectedCategory) return false;
      }

      // 5. Work Setup filter (Remote/Hybrid/On-site)
      if (selectedWorkModel !== 'All') {
        const currentModel = (item.workModel || '').toLowerCase();
        const targetModel = selectedWorkModel.toLowerCase();
        if (!currentModel.includes(targetModel)) return false;
      }

      // 6. Job Type filter (Full-Time, Contract, Part-Time, Internship)
      if (selectedTypes.length > 0) {
        const currentType = (item.type || '').toLowerCase();
        const hasMatchingType = selectedTypes.some(t => currentType.includes(t.toLowerCase()));
        if (!hasMatchingType) return false;
      }

      // 7. Salary Min Filter (only applies if slider is moved from 0)
      if (minSalary > 10000) {
        const itemSalaryNumber = parseSalaryNumber(item.salary);
        if (itemSalaryNumber < minSalary) return false;
      }

      return true;
    }).sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)); // Featured/Boosted posts sorted to top
  }, [listings, activeTab, keyword, locationFilter, selectedCategory, selectedWorkModel, selectedTypes, minSalary]);

  // Handle Search Submission and URL params sync
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const params = {};
    if (keyword.trim()) params.keyword = keyword.trim();
    if (locationFilter.trim()) params.location = locationFilter.trim();
    if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
    if (activeTab && activeTab !== 'All') params.tab = activeTab;
    setSearchParams(params);
  };

  const clearFilters = () => {
    setKeyword('');
    setLocationFilter('');
    setSelectedCategory('');
    setSelectedTypes([]);
    setSelectedWorkModel('All');
    setMinSalary(0);
    setActiveTab('All');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="bg-brand-navy text-white rounded-3xl p-8 relative overflow-hidden shadow-xl border border-white/10">
        <div className="relative z-10 max-w-3xl space-y-2">
          <span className="text-xs font-bold text-brand-teal uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Unified Career & Opportunity Portal
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Browse Opportunities</h1>
          <p className="text-slate-300 text-sm">
            Discover <span className="font-bold text-white text-base">{filteredListings.length}</span> active career openings, technical roles, and internship placements.
          </p>
        </div>
      </div>

      {/* Category Tabs: Jobs vs Internships Navigation */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-sm flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          {[
            { id: 'All', label: 'All Opportunities', icon: Briefcase },
            { id: 'Jobs', label: 'Full-Time & Part-Time Jobs', icon: Building2 },
            { id: 'Internships', label: 'Internship Programs', icon: GraduationCap },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  const params = Object.fromEntries(searchParams.entries());
                  if (tab.id === 'All') delete params.tab;
                  else params.tab = tab.id;
                  setSearchParams(params);
                }}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-brand-accent text-white shadow-md shadow-brand-accent/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-brand-navy'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="text-xs text-slate-500 font-semibold px-3 hidden sm:block">
          Matching: <strong className="text-brand-navy">{filteredListings.length}</strong> listings
        </div>
      </div>

      {/* Powerful Search Bar with Keyword Chips */}
      <form onSubmit={handleSearchSubmit} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-brand-accent absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search by job title, skills, tags, company, or keyword..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-11 pr-10 py-3 text-xs font-medium rounded-2xl border border-slate-200 focus:outline-none focus:border-brand-accent shadow-sm"
            />
            {keyword && (
              <button 
                type="button"
                onClick={() => { setKeyword(''); }} 
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                title="Clear keyword"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="md:col-span-4 relative">
            <MapPin className="w-4 h-4 text-brand-teal absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search by city (e.g. Dhaka), country, or 'Remote'..."
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full pl-11 pr-10 py-3 text-xs font-medium rounded-2xl border border-slate-200 focus:outline-none focus:border-brand-accent shadow-sm"
            />
            {locationFilter && (
              <button 
                type="button"
                onClick={() => { setLocationFilter(''); }} 
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                title="Clear location"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-brand-navy hover:bg-brand-navyDark text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </div>
        </div>

        {/* Suggested Keyword Chips */}
        <div className="pt-2 flex items-center gap-2 flex-wrap text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Suggested:</span>
          {popularKeywords.map((kw) => (
            <button
              type="button"
              key={kw}
              onClick={() => {
                setKeyword(kw);
                const params = Object.fromEntries(searchParams.entries());
                params.keyword = kw;
                setSearchParams(params);
              }}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${
                keyword === kw
                  ? 'bg-brand-accent text-white border-brand-accent shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              {kw}
            </button>
          ))}
          {(keyword || locationFilter || selectedCategory || selectedTypes.length > 0 || selectedWorkModel !== 'All' || minSalary > 0) && (
            <button
              type="button"
              onClick={clearFilters}
              className="px-3 py-1 rounded-full text-[11px] font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 ml-auto cursor-pointer flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </form>

      {/* Main Grid: Filters Sidebar + Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Filter Sidebar */}
        <aside className={`
          lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-6
          ${mobileFilterOpen ? 'block' : 'hidden lg:block'}
        `}>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="text-base font-bold text-brand-navy flex items-center gap-2">
              <Filter className="w-4 h-4 text-brand-accent" />
              <span>Filter Opportunities</span>
            </h3>
            <button
              onClick={clearFilters}
              className="text-xs font-semibold text-brand-accent hover:underline"
            >
              Reset All
            </button>
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-bold text-brand-navy mb-1.5">Industry Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:border-brand-accent"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Work Setup Toggle */}
          <div>
            <label className="block text-xs font-bold text-brand-navy mb-2">Work Setup</label>
            <div className="grid grid-cols-2 gap-2">
              {workModels.map((model) => (
                <button
                  key={model}
                  onClick={() => setSelectedWorkModel(model)}
                  className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                    selectedWorkModel === model
                      ? 'bg-brand-accent text-white border-brand-accent shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {model}
                </button>
              ))}
            </div>
          </div>

          {/* Employment Type Checkboxes */}
          <div>
            <label className="block text-xs font-bold text-brand-navy mb-2">Employment Type</label>
            <div className="space-y-2">
              {jobTypes.map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={() => toggleJobType(type)}
                    className="w-4 h-4 rounded text-brand-accent focus:ring-brand-accent border-slate-300"
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Minimum Salary Slider */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-brand-navy">Min Compensation</label>
              <span className="text-xs font-bold text-brand-accent">${minSalary.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={30000}
              max={220000}
              step={10000}
              value={minSalary}
              onChange={(e) => setMinSalary(Number(e.target.value))}
              className="w-full accent-brand-accent cursor-pointer"
            />
          </div>

          {/* Active Company Advertisements Banner */}
          {advertisements.length > 0 && (
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Featured Employer Showcase</span>
              {advertisements.slice(0, 1).map((ad) => (
                <div key={ad.id} className="bg-gradient-to-br from-brand-navy to-indigo-900 text-white rounded-2xl p-4 space-y-3 border border-white/10 shadow-md">
                  <img src={ad.bannerUrl} alt={ad.title} className="w-full h-24 rounded-xl object-cover" />
                  <div>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-400 text-brand-navy uppercase">SPONSORED AD</span>
                    <h4 className="text-xs font-bold text-white mt-1">{ad.title}</h4>
                    <p className="text-[11px] text-slate-300 mt-1 leading-relaxed line-clamp-2">{ad.description}</p>
                  </div>
                  <a
                    href={ad.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 text-center text-xs font-bold rounded-xl bg-brand-accent hover:bg-brand-accentHover text-white flex items-center justify-center gap-1.5"
                  >
                    <span>Visit Company Site</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </aside>

        {/* Right Main Panel: Listings */}
        <main className="lg:col-span-8 space-y-4">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-brand-navy">Search Options</span>
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-brand-navy text-white flex items-center gap-1.5"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>{mobileFilterOpen ? 'Hide Filters' : 'Show Filters'}</span>
            </button>
          </div>

          {/* Listings Cards */}
          {filteredListings.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-brand-navy">No matching opportunities found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try clearing your search query or loosening filter limits to view available roles.
              </p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-brand-accent text-white"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            filteredListings.map((job) => (
              <div
                key={job.id}
                className={`bg-white rounded-2xl p-6 border transition-all space-y-4 relative ${
                  job.featured
                    ? 'border-brand-accent ring-2 ring-brand-accent/20 shadow-lg bg-gradient-to-r from-blue-50/20 via-white to-white'
                    : 'border-slate-200 shadow-card hover:shadow-hover hover:border-brand-accent/40'
                }`}
              >
                {job.featured && (
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-amber-400 text-brand-navy font-black text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-sm">
                    <Zap className="w-3 h-3 text-brand-navy fill-current" />
                    <span>FEATURED BOOST</span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={job.logo}
                      alt={job.company}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-100 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{job.company}</span>
                        {job.categoryType === 'Internship' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700">
                            INTERNSHIP
                          </span>
                        )}
                      </div>
                      <Link to={`/jobs/${job.id}`}>
                        <h3 className="text-base font-bold text-brand-navy hover:text-brand-accent transition-colors flex items-center gap-2">
                          {job.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-slate-500 mt-0.5">{job.location} • {job.experience}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleSaveJob(job.id)}
                    className={`p-2.5 rounded-xl border self-start sm:self-auto transition-colors cursor-pointer ${
                      savedJobIds.includes(job.id)
                        ? 'bg-amber-50 text-amber-500 border-amber-200'
                        : 'bg-slate-50 text-slate-400 hover:text-brand-accent border-slate-200'
                    }`}
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {job.description}
                </p>

                {/* Tags & Actions */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-brand-accent border border-blue-100">
                      {job.type}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                      {job.workModel}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {job.salary}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/jobs/${job.id}`}
                      className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-brand-navy rounded-xl hover:bg-slate-100"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => setSelectedJob(job)}
                      className="px-4 py-2 text-xs font-bold rounded-xl bg-brand-accent hover:bg-brand-accentHover text-white shadow-sm transition-all"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </main>
      </div>

      <ApplyModal
        job={selectedJob}
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
      />
    </div>
  );
}
