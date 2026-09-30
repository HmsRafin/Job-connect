import { downloadPrivateFile } from '../../lib/download';
import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, MapPin, Upload, FileText, Trash2, Plus, 
  Check, Save, Sparkles, Globe, Briefcase, GraduationCap, 
  Calendar, ShieldCheck, Camera, DollarSign,
  Clock, Award, Languages, CheckCircle2, AlertCircle, Download,
  ExternalLink, Edit3, X
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { fetchProfile, updateProfile, uploadResumeApi, uploadImageApi } from '../../lib/api/profile';

export default function ProfileCV() {
  const { currentUser } = usePlatform();

  // Basic & Personal Details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [age, setAge] = useState('');
  const [nidNumber, setNidNumber] = useState('');
  const [gender, setGender] = useState('Male');
  const [maritalStatus, setMaritalStatus] = useState('Single');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bio, setBio] = useState('');

  // Professional Preferences
  const [expectedSalary, setExpectedSalary] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Mid-Level (2-5 yrs)');
  const [availability, setAvailability] = useState('Immediate');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');

  // Skills & Languages
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [softSkills, setSoftSkills] = useState([]);
  const [newSoftSkill, setNewSoftSkill] = useState('');
  const [languages, setLanguages] = useState([]);
  const [newLanguage, setNewLanguage] = useState('');

  // Work Experience List
  const [experience, setExperience] = useState([]);
  const [showExpForm, setShowExpForm] = useState(false);
  const [expJobTitle, setExpJobTitle] = useState('');
  const [expCompany, setExpCompany] = useState('');
  const [expLocation, setExpLocation] = useState('');
  const [expStartDate, setExpStartDate] = useState('');
  const [expEndDate, setExpEndDate] = useState('');
  const [expCurrent, setExpCurrent] = useState(false);
  const [expDesc, setExpDesc] = useState('');

  // Education List
  const [education, setEducation] = useState([]);
  const [showEduForm, setShowEduForm] = useState(false);
  const [eduDegree, setEduDegree] = useState('');
  const [eduInstitution, setEduInstitution] = useState('');
  const [eduField, setEduField] = useState('');
  const [eduPassingYear, setEduPassingYear] = useState('');
  const [eduGrade, setEduGrade] = useState('');

  // Resume / CV Document
  const [resumeData, setResumeData] = useState(null); // { name, size, data, uploadedAt }

  // State Feedback
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Auto calculate age from date of birth
  const handleDobChange = (dobVal) => {
    setDateOfBirth(dobVal);
    if (dobVal) {
      const birthDate = new Date(dobVal);
      const diff = Date.now() - birthDate.getTime();
      const ageDate = new Date(diff);
      const calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
      if (!isNaN(calculatedAge) && calculatedAge > 0 && calculatedAge < 120) {
        setAge(String(calculatedAge));
      }
    }
  };

  // Load Profile from Backend Database
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setInitialLoading(true);
        const res = await fetchProfile();
        if (res?.profile || res?.user) {
          const u = res.user || {};
          const p = res.profile || {};

          setName(u.name || currentUser?.name || '');
          setEmail(u.email || currentUser?.email || '');
          setTitle(p.title || '');
          setPhone(p.phone || '');
          setDateOfBirth(p.date_of_birth || '');
          setAge(p.age || '');
          setNidNumber(p.nid_number || '');
          setGender(p.gender || 'Male');
          setMaritalStatus(p.marital_status || 'Single');
          setLocation(p.location || '');
          setAddress(p.address || '');
          setAvatarUrl(p.avatar_url || '');
          setBio(p.bio || '');

          setExpectedSalary(p.expected_salary || '');
          setExperienceLevel(p.experience_level || 'Mid-Level (2-5 yrs)');
          setAvailability(p.availability || 'Immediate');
          setPortfolioUrl(p.portfolio_url || '');
          setGithubUrl(p.github_url || '');
          setLinkedinUrl(p.linkedin_url || '');

          if (Array.isArray(p.skills)) setSkills(p.skills);
          if (Array.isArray(p.soft_skills)) setSoftSkills(p.soft_skills);
          if (Array.isArray(p.languages)) setLanguages(p.languages);
          if (Array.isArray(p.experience)) setExperience(p.experience);
          if (Array.isArray(p.education)) setEducation(p.education);

          if (p.resume_name || p.resume_url) {
            setResumeData({
              name: p.resume_name || (p.resume_url ? p.resume_url.split('/').pop() : 'Resume.pdf'),
              size: p.resume_size || 'PDF Document',
              url: p.resume_url || null,
              data: p.resume_data || null,
              uploadedAt: 'Saved in Database'
            });
          }
        }
      } catch (err) {
        console.warn('Could not fetch candidate profile:', err);
      } finally {
        setInitialLoading(false);
      }
    };
    loadProfile();
  }, [currentUser]);

  // Skill Add / Remove Handlers
  const addSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (s) => {
    setSkills(skills.filter(item => item !== s));
  };

  const addSoftSkill = (e) => {
    e.preventDefault();
    if (newSoftSkill.trim() && !softSkills.includes(newSoftSkill.trim())) {
      setSoftSkills([...softSkills, newSoftSkill.trim()]);
      setNewSoftSkill('');
    }
  };

  const removeSoftSkill = (s) => {
    setSoftSkills(softSkills.filter(item => item !== s));
  };

  const addLanguage = (e) => {
    e.preventDefault();
    if (newLanguage.trim() && !languages.includes(newLanguage.trim())) {
      setLanguages([...languages, newLanguage.trim()]);
      setNewLanguage('');
    }
  };

  const removeLanguage = (l) => {
    setLanguages(languages.filter(item => item !== l));
  };

  // Experience Handlers
  const handleAddExperience = (e) => {
    e.preventDefault();
    if (!expJobTitle.trim() || !expCompany.trim()) {
      alert('Please provide Job Title and Company Name');
      return;
    }
    const newExp = {
      id: `exp-${Date.now()}`,
      title: expJobTitle.trim(),
      company: expCompany.trim(),
      location: expLocation.trim() || 'Remote',
      startDate: expStartDate,
      endDate: expCurrent ? 'Present' : expEndDate,
      isCurrent: expCurrent,
      description: expDesc.trim()
    };
    setExperience([newExp, ...experience]);
    setExpJobTitle('');
    setExpCompany('');
    setExpLocation('');
    setExpStartDate('');
    setExpEndDate('');
    setExpCurrent(false);
    setExpDesc('');
    setShowExpForm(false);
  };

  const removeExperience = (id) => {
    setExperience(experience.filter(item => item.id !== id));
  };

  // Education Handlers
  const handleAddEducation = (e) => {
    e.preventDefault();
    if (!eduDegree.trim() || !eduInstitution.trim()) {
      alert('Please provide Degree and Institution name');
      return;
    }
    const newEdu = {
      id: `edu-${Date.now()}`,
      degree: eduDegree.trim(),
      institution: eduInstitution.trim(),
      field: eduField.trim(),
      passingYear: eduPassingYear.trim(),
      grade: eduGrade.trim()
    };
    setEducation([newEdu, ...education]);
    setEduDegree('');
    setEduInstitution('');
    setEduField('');
    setEduPassingYear('');
    setEduGrade('');
    setShowEduForm(false);
  };

  const removeEducation = (id) => {
    setEducation(education.filter(item => item.id !== id));
  };

  const handleAvatarUpload = async event => {
    const file = event.target.files[0];
    if (!file) return;
    try { setAvatarUrl((await uploadImageApi(file, 'avatar')).url); }
    catch { /* Shared API error banner reports the failure. */ }
  };

  const handleResumeUpload = async event => {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf') || file.size > 10 * 1024 * 1024) {
      alert('Choose a PDF document smaller than 10 MB.');
      return;
    }
    try {
      const response = await uploadResumeApi(file);
      setResumeData({ name: response.resume_name, size: response.resume_size, url: response.resume_url, uploadedAt: 'Saved in Database' });
    } catch { /* Preserve the last saved CV and display the shared API error. */ }
  };

  const handleDownloadResume = async () => {
    if (!resumeData) return;
    try { await downloadPrivateFile('/api/profile/resume', resumeData.name || 'Resume.pdf'); }
    catch { /* Shared API error banner reports the failure. */ }
  };

  // Calculate Profile Completeness Percentage
  const calculateCompleteness = () => {
    let score = 0;
    if (name) score += 10;
    if (email) score += 10;
    if (title) score += 10;
    if (phone) score += 10;
    if (nidNumber) score += 10;
    if (bio) score += 10;
    if (skills.length > 0) score += 15;
    if (experience.length > 0) score += 10;
    if (education.length > 0) score += 5;
    if (resumeData) score += 10;
    return Math.min(100, score);
  };

  // Save Everything to Database
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name,
        title,
        phone,
        date_of_birth: dateOfBirth,
        age,
        nid_number: nidNumber,
        gender,
        marital_status: maritalStatus,
        location,
        address,
        avatar_url: avatarUrl,
        bio,
        expected_salary: expectedSalary,
        experience_level: experienceLevel,
        availability,
        portfolio_url: portfolioUrl,
        github_url: githubUrl,
        linkedin_url: linkedinUrl,
        skills,
        soft_skills: softSkills,
        languages,
        experience,
        education,
        resume_url: resumeData?.url || resumeData?.name || null,
        resume_name: resumeData?.name || null,
        resume_size: resumeData?.size || null,
      };

      await updateProfile(payload);

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to save profile changes:', err);
      alert('Failed to save changes to database. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  const completeness = calculateCompleteness();

  if (initialLoading) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-semibold text-slate-500">Loading Candidate Portfolio & Database Records...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* 1. Header Profile Banner & Strength Gauge */}
      <div className="bg-gradient-to-r from-brand-navy via-brand-navyDark to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            {/* Avatar with live upload option */}
            <div className="relative group">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-indigo-700 text-white font-black text-2xl flex items-center justify-center overflow-hidden border-2 border-white/20 shadow-lg shrink-0">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={name || 'Avatar'} className="w-full h-full object-cover" />
                ) : (
                  <span>{name ? name.slice(0, 2).toUpperCase() : 'JS'}</span>
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-brand-accent hover:bg-brand-accentHover text-white shadow-md cursor-pointer transition-transform group-hover:scale-110">
                <Camera className="w-4 h-4" />
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              </label>
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-teal/20 text-brand-teal text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                <span>Verified Candidate Account</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">{name || 'Job Seeker Profile'}</h1>
              <p className="text-xs text-slate-300 font-medium">{title || 'Professional Title Not Set'}</p>
              <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-300 flex-wrap">
                {location && (
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-brand-teal" /> {location}</span>
                )}
                {phone && (
                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-brand-teal" /> {phone}</span>
                )}
                {age && (
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-brand-teal" /> {age} Years Old</span>
                )}
              </div>
            </div>
          </div>

          {/* Profile Strength Widget & Action */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
            <div className="space-y-1.5 min-w-[140px]">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-300">Profile Score:</span>
                <span className="text-brand-teal">{completeness}%</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 via-brand-teal to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${completeness}%` }}
                ></div>
              </div>
              <span className="text-[10px] text-slate-400 block">
                {completeness >= 80 ? '🌟 Highly Rankable Profile' : '⚠️ Add NID & Skills to reach 100%'}
              </span>
            </div>

            <button
              onClick={handleSaveProfile}
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-brand-accent hover:bg-brand-accentHover text-white font-bold text-xs shadow-md shadow-brand-accent/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 transition-all shrink-0"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Profile Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Feedback Alert */}
      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Profile changes successfully updated and saved to backend database!</span>
        </div>
      )}

      <form onSubmit={handleSaveProfile} className="space-y-8">
        {/* 2. Personal & Identity Information */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-brand-accent flex items-center justify-center font-bold">
                <User className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-brand-navy">Personal Details & National Identity</h3>
            </div>
            <span className="text-[11px] font-semibold text-slate-400">Strictly Protected Information</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Full Legal Name <span className="text-rose-500">*</span></label>
              <input
                type="text"
                required
                placeholder="e.g. Md. Saifur Rahman"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Email Address <span className="text-rose-500">*</span></label>
              <input
                type="email"
                required
                placeholder="candidate@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Phone Number <span className="text-rose-500">*</span></label>
              <input
                type="tel"
                placeholder="+880 1700-000000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Date of Birth</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => handleDobChange(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Age (Years)</label>
              <input
                type="number"
                placeholder="e.g. 26"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">National ID (NID) Number</label>
              <input
                type="text"
                placeholder="e.g. 19982691234567890"
                value={nidNumber}
                onChange={(e) => setNidNumber(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent font-mono font-bold text-brand-navy"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent font-medium bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Marital Status</label>
              <select
                value={maritalStatus}
                onChange={(e) => setMaritalStatus(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent font-medium bg-white"
              >
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Unspecified">Unspecified</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">City / Region (Location)</label>
              <input
                type="text"
                placeholder="e.g. Dhaka, Bangladesh (or Remote)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Full Street Address</label>
              <input
                type="text"
                placeholder="House 12, Road 4, Sector 7, Uttara"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent font-medium"
              />
            </div>
          </div>
        </div>

        {/* 3. Professional Overview & Career Targets */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Briefcase className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-brand-navy">Professional Headline & Career Targets</h3>
            </div>
            <span className="text-[11px] font-semibold text-slate-400">Visible to Hiring Managers</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Professional Job Title <span className="text-rose-500">*</span></label>
              <input
                type="text"
                placeholder="e.g. Senior Full-Stack Engineer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Experience Level</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent font-medium bg-white"
              >
                <option value="Entry-Level (0-2 yrs)">Entry-Level (0-2 yrs)</option>
                <option value="Mid-Level (2-5 yrs)">Mid-Level (2-5 yrs)</option>
                <option value="Senior Level (5-8 yrs)">Senior Level (5-8 yrs)</option>
                <option value="Lead / Executive (8+ yrs)">Lead / Executive (8+ yrs)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Expected Salary</label>
              <input
                type="text"
                placeholder="e.g. ৳90,000 - ৳120,000 / month"
                value={expectedSalary}
                onChange={(e) => setExpectedSalary(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Availability / Notice Period</label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent font-medium bg-white"
              >
                <option value="Immediate">Immediate</option>
                <option value="1 Week">1 Week</option>
                <option value="2 Weeks">2 Weeks</option>
                <option value="1 Month">1 Month</option>
                <option value="2 Months">2 Months</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Portfolio / Personal Website</label>
              <input
                type="url"
                placeholder="https://mysite.dev"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">GitHub / LinkedIn URL</label>
              <input
                type="url"
                placeholder="https://linkedin.com/in/username"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-navy mb-1">Executive Summary / Professional Bio</label>
            <textarea
              rows={4}
              placeholder="Highlight your background, core technical strengths, proudest achievements, and what motivates you..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent"
            />
          </div>
        </div>

        {/* 4. PDF Resume Upload & Storage */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-brand-navy">Resume / CV Document (PDF)</h3>
            </div>
            <span className="text-[11px] font-semibold text-slate-400">Attached Automatically on Job Applications</span>
          </div>

          {resumeData ? (
            <div className="p-5 rounded-2xl border-2 border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3.5 rounded-2xl bg-rose-100 text-rose-700">
                  <FileText className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-brand-navy">{resumeData.name}</h4>
                  <p className="text-[11px] text-slate-500">{resumeData.size} • Status: <strong className="text-emerald-600 font-bold">Saved in Database</strong></p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleDownloadResume}
                  className="px-4 py-2 rounded-xl bg-brand-navy hover:bg-brand-navyDark text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download / View PDF</span>
                </button>

                <label className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 cursor-pointer flex items-center gap-1.5 shadow-sm">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Replace PDF</span>
                  <input type="file" accept=".pdf" className="hidden" onChange={handleResumeUpload} />
                </label>

                <button
                  type="button"
                  onClick={() => setResumeData(null)}
                  className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl"
                  title="Remove CV"
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
                <span className="text-xs font-bold text-brand-navy block">Click or Drag & Drop your PDF Resume</span>
                <span className="text-[10px] text-slate-500">Standard PDF documents up to 10MB supported</span>
              </div>
              <input type="file" accept=".pdf" className="hidden" onChange={handleResumeUpload} />
            </label>
          )}
        </div>

        {/* 5. Work Experience Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Briefcase className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-brand-navy">Work Experience History</h3>
            </div>
            <button
              type="button"
              onClick={() => setShowExpForm(!showExpForm)}
              className="px-3.5 py-1.5 rounded-xl bg-brand-navy text-white text-xs font-bold flex items-center gap-1.5 hover:bg-brand-navyDark cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Work Experience</span>
            </button>
          </div>

          {/* Add Experience Modal / Form */}
          {showExpForm && (
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold text-brand-navy uppercase tracking-wider">Add New Experience Entry</h4>
                <button type="button" onClick={() => setShowExpForm(false)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-brand-navy mb-1">Job Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Software Engineer"
                    value={expJobTitle}
                    onChange={(e) => setExpJobTitle(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-brand-navy mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TechCorp Solutions"
                    value={expCompany}
                    onChange={(e) => setExpCompany(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-brand-navy mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Dhaka (Hybrid)"
                    value={expLocation}
                    onChange={(e) => setExpLocation(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                <div>
                  <label className="block text-[11px] font-bold text-brand-navy mb-1">Start Date</label>
                  <input
                    type="text"
                    placeholder="e.g. Jan 2022"
                    value={expStartDate}
                    onChange={(e) => setExpStartDate(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-brand-navy mb-1">End Date</label>
                  <input
                    type="text"
                    disabled={expCurrent}
                    placeholder="e.g. Dec 2024"
                    value={expCurrent ? 'Present' : expEndDate}
                    onChange={(e) => setExpEndDate(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white disabled:bg-slate-100"
                  />
                </div>
                <div className="pt-4">
                  <label className="inline-flex items-center gap-2 text-xs font-bold text-brand-navy cursor-pointer">
                    <input
                      type="checkbox"
                      checked={expCurrent}
                      onChange={(e) => setExpCurrent(e.target.checked)}
                      className="rounded text-brand-accent"
                    />
                    <span>I currently work here</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-brand-navy mb-1">Core Responsibilities & Achievements</label>
                <textarea
                  rows={3}
                  placeholder="Architected microservices, improved performance by 30%, led a team of 5 engineers..."
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowExpForm(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddExperience}
                  className="px-5 py-2 text-xs font-bold bg-brand-accent hover:bg-brand-accentHover text-white rounded-xl shadow-sm"
                >
                  Save Experience Entry
                </button>
              </div>
            </div>
          )}

          {/* List of Experiences */}
          {experience.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 space-y-1">
              <Briefcase className="w-6 h-6 mx-auto text-slate-300" />
              <p>No work experience recorded yet. Click "Add Work Experience" above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {experience.map((item) => (
                <div key={item.id} className="p-5 rounded-2xl border border-slate-200 hover:border-brand-accent/30 bg-white transition-all space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-brand-navy">{item.title}</h4>
                      <p className="text-xs font-semibold text-brand-accent">{item.company} • <span className="text-slate-500 font-normal">{item.location}</span></p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {item.startDate} — {item.endDate}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeExperience(item.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        title="Delete experience"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {item.description && (
                    <p className="text-xs text-slate-600 pt-1 leading-relaxed">{item.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 6. Education & Academic Credentials */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-brand-navy">Education & Qualifications</h3>
            </div>
            <button
              type="button"
              onClick={() => setShowEduForm(!showEduForm)}
              className="px-3.5 py-1.5 rounded-xl bg-brand-navy text-white text-xs font-bold flex items-center gap-1.5 hover:bg-brand-navyDark cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Education</span>
            </button>
          </div>

          {/* Add Education Form */}
          {showEduForm && (
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold text-brand-navy uppercase tracking-wider">Add Degree / Qualification</h4>
                <button type="button" onClick={() => setShowEduForm(false)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-brand-navy mb-1">Degree / Certificate *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. B.Sc in Computer Science & Engineering"
                    value={eduDegree}
                    onChange={(e) => setEduDegree(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-brand-navy mb-1">Institution / University *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BUET / University of Dhaka"
                    value={eduInstitution}
                    onChange={(e) => setEduInstitution(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-brand-navy mb-1">Major / Field of Study</label>
                  <input
                    type="text"
                    placeholder="e.g. Software Engineering"
                    value={eduField}
                    onChange={(e) => setEduField(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-brand-navy mb-1">Passing Year / Graduation</label>
                  <input
                    type="text"
                    placeholder="e.g. 2023"
                    value={eduPassingYear}
                    onChange={(e) => setEduPassingYear(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-brand-navy mb-1">Grade / CGPA</label>
                  <input
                    type="text"
                    placeholder="e.g. 3.85 out of 4.00"
                    value={eduGrade}
                    onChange={(e) => setEduGrade(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowEduForm(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddEducation}
                  className="px-5 py-2 text-xs font-bold bg-brand-accent hover:bg-brand-accentHover text-white rounded-xl shadow-sm"
                >
                  Save Qualification
                </button>
              </div>
            </div>
          )}

          {/* Education List */}
          {education.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 space-y-1">
              <GraduationCap className="w-6 h-6 mx-auto text-slate-300" />
              <p>No educational credentials added yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {education.map((item) => (
                <div key={item.id} className="p-4.5 rounded-2xl border border-slate-200 hover:border-brand-accent/30 bg-white transition-all space-y-1 relative">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-brand-navy">{item.degree}</h4>
                      <p className="text-xs font-semibold text-slate-600">{item.institution}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeEducation(item.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{item.field || 'General Studies'}</span>
                    <span className="font-bold text-brand-navy">Passing Year: {item.passingYear} {item.grade && `(${item.grade})`}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 7. Skills, Competencies & Languages */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Award className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-brand-navy">Skills, Strengths & Spoken Languages</h3>
            </div>
          </div>

          {/* Technical Skills */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-brand-navy">Core Technical Competencies</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add tech skill (e.g. React, Node.js, Python, PostgreSQL, AWS, Docker)..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(e); } }}
                className="flex-1 p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent"
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-5 py-3 rounded-xl bg-brand-navy text-white text-xs font-bold flex items-center gap-1 hover:bg-brand-navyDark cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Skill</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {skills.length === 0 ? (
                <span className="text-xs text-slate-400 italic">No technical skills added yet.</span>
              ) : (
                skills.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold bg-brand-navy/5 text-brand-navy border border-slate-200 flex items-center gap-2"
                  >
                    <span>{s}</span>
                    <button type="button" onClick={() => removeSkill(s)} className="hover:text-rose-600 font-bold">×</button>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Soft Skills & Languages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            {/* Soft Skills */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-brand-navy">Soft Skills & Leadership</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. Team Leadership, Problem Solving..."
                  value={newSoftSkill}
                  onChange={(e) => setNewSoftSkill(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSoftSkill(e); } }}
                  className="flex-1 p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent"
                />
                <button
                  type="button"
                  onClick={addSoftSkill}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-brand-navy text-xs font-bold cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {softSkills.map((s, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-full text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5 font-medium">
                    <span>{s}</span>
                    <button type="button" onClick={() => removeSoftSkill(s)} className="hover:text-rose-600 font-bold">×</button>
                  </span>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-brand-navy">Spoken Languages</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. Bengali (Native), English (Fluent)..."
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addLanguage(e); } }}
                  className="flex-1 p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent"
                />
                <button
                  type="button"
                  onClick={addLanguage}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-brand-navy text-xs font-bold cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {languages.map((l, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-full text-xs bg-blue-50 text-brand-accent border border-blue-200 flex items-center gap-1.5 font-medium">
                    <span>{l}</span>
                    <button type="button" onClick={() => removeLanguage(l)} className="hover:text-rose-600 font-bold">×</button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Save Footer Bar */}
        <div className="p-6 bg-brand-navy rounded-3xl border border-white/10 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-white">
          <div>
            <h4 className="text-sm font-bold text-white">Ready to save your candidate profile?</h4>
            <p className="text-xs text-slate-300">All updated qualifications and resume will be securely preserved in database.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 rounded-2xl bg-brand-accent hover:bg-brand-accentHover text-white font-bold text-xs shadow-lg shadow-brand-accent/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 transition-all"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Saving Profile...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
