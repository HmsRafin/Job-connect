import React, { useState, useEffect, useRef } from 'react';
import { 
  Building, Globe, MapPin, Users, Phone, Mail, FileText, 
  Check, Save, Sparkles, Image as ImageIcon, ShieldCheck, Eye, 
  Plus, Trash2, Award, Briefcase, Clock, Calendar, 
  Upload, Camera, CheckCircle2, AlertCircle, ExternalLink, 
  Crown, Compass, Layers, BadgeCheck,
  HeartHandshake, ChevronRight, Info
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { fetchProfile, updateProfile, uploadImageApi } from '../../lib/api/profile';

const LinkedInIcon = () => (
  <svg className="w-4 h-4 text-blue-600 shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-4 h-4 text-blue-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-4 h-4 text-sky-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const GithubIcon = () => (
  <svg className="w-4 h-4 text-slate-800 shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

const DEFAULT_PERKS_PRESETS = [
  "Competitive Salary", "Performance Bonus", "Health & Medical Insurance",
  "Provident Fund / 401(k)", "Flexible Working Hours", "Hybrid / Remote Work",
  "Annual Pleasure Trips & Tours", "Free Lunch & Daily Snacks", "Paid Annual Leave",
  "Learning & Certification Budget", "Parental Leave", "Modern Workstations (MacBook/PC)",
  "Overtime Allowance", "Gym / Wellness Allowance", "Friendly Culture"
];

const COMPANY_TYPES = [
  "Private Limited Company (Ltd)",
  "Public Listed Enterprise (PLC)",
  "Tech Startup / Scale-up",
  "Software & IT Agency",
  "Multinational Corporation (MNC)",
  "Non-Governmental Organization (NGO)",
  "Partnership / Sole Proprietorship"
];

const EMPLOYEE_SIZES = [
  "1-10 Employees (Seed / Boutique)",
  "11-50 Employees (Small Business)",
  "51-200 Employees (Mid-Sized / Growth)",
  "201-500 Employees (Large Enterprise)",
  "500-1000 Employees (Corporate)",
  "1000+ Employees (Global Enterprise)"
];

export default function CompanyProfile() {
  const { currentUser, updateCurrentUserSession } = usePlatform();

  // Active Tab
  const [activeTab, setActiveTab] = useState('overview');

  // --- 1. Basic & Branding ---
  const [companyName, setCompanyName] = useState(currentUser?.companyName || currentUser?.name || '');
  const [tagline, setTagline] = useState('');
  const [industry, setIndustry] = useState('Technology & Software');
  const [companyType, setCompanyType] = useState('Private Limited Company (Ltd)');
  const [foundedYear, setFoundedYear] = useState('2020');
  const [website, setWebsite] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');

  // --- 2. Owner & Executive Leadership ---
  const [ownerName, setOwnerName] = useState('');
  const [ownerTitle, setOwnerTitle] = useState('Founder & Chairman');
  const [ownerPhoto, setOwnerPhoto] = useState('');
  const [ownerBio, setOwnerBio] = useState('');
  const [ceoName, setCeoName] = useState('');
  const [ceoBio, setCeoBio] = useState('');
  const [directors, setDirectors] = useState([]);

  // --- 3. Workforce & Offices ---
  const [employeeCount, setEmployeeCount] = useState('51-200 Employees (Mid-Sized / Growth)');
  const [workingDays, setWorkingDays] = useState('Sunday - Thursday');
  const [officeHours, setOfficeHours] = useState('09:00 AM - 06:00 PM');
  const [headOffice, setHeadOffice] = useState('Dhaka, Bangladesh');
  const [branchOffices, setBranchOffices] = useState([]);

  // --- 4. Mission, Culture, Perks & Specialties ---
  const [about, setAbout] = useState('');
  const [mission, setMission] = useState('');
  const [vision, setVision] = useState('');
  const [companyCulture, setCompanyCulture] = useState('');
  const [perksAndBenefits, setPerksAndBenefits] = useState([
    "Competitive Salary", "Performance Bonus", "Health & Medical Insurance",
    "Flexible Working Hours", "Free Lunch & Daily Snacks", "Annual Pleasure Trips & Tours"
  ]);
  const [customPerkInput, setCustomPerkInput] = useState('');
  const [specialties, setSpecialties] = useState(["Web Engineering", "Cloud Systems", "AI & Automation"]);
  const [customSpecialtyInput, setCustomSpecialtyInput] = useState('');

  // --- 5. Achievements & Milestones ---
  const [achievements, setAchievements] = useState([]);

  // --- 6. Contact, Socials & Legal ---
  const [contactEmail, setContactEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [socialLinks, setSocialLinks] = useState({
    linkedin: '',
    facebook: '',
    twitter: '',
    github: '',
    youtube: ''
  });
  const [tradeLicenseNo, setTradeLicenseNo] = useState('');
  const [taxId, setTaxId] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  // States for handling UI
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  // Hidden File Inputs
  const logoInputRef = useRef(null);
  const bannerInputRef = useRef(null);
  const ownerPhotoInputRef = useRef(null);

  // Load from backend SQLite database
  useEffect(() => {
    const loadCompanyProfile = async () => {
      try {
        const res = await fetchProfile();
        if (res?.profile) {
          const p = res.profile;
          // Basic & Branding
          setCompanyName(p.company_name || res.user?.name || currentUser?.companyName || currentUser?.name || '');
          setTagline(p.tagline || '');
          setIndustry(p.industry || 'Technology & Software');
          setCompanyType(p.company_type || 'Private Limited Company (Ltd)');
          setFoundedYear(p.founded_year || '2020');
          setWebsite(p.company_website || '');
          setLogoUrl(p.company_logo || '');
          setBannerUrl(p.company_banner || '');

          // Owner & Leadership
          setOwnerName(p.owner_name || '');
          setOwnerTitle(p.owner_title || 'Founder & Chairman');
          setOwnerPhoto(p.owner_photo || '');
          setOwnerBio(p.owner_bio || '');
          setCeoName(p.ceo_name || '');
          setCeoBio(p.ceo_bio || '');
          if (Array.isArray(p.directors)) {
            setDirectors(p.directors);
          }

          // Workforce & Locations
          setEmployeeCount(p.employee_count || p.company_size || '51-200 Employees (Mid-Sized / Growth)');
          setWorkingDays(p.working_days || 'Sunday - Thursday');
          setOfficeHours(p.office_hours || '09:00 AM - 06:00 PM');
          setHeadOffice(p.head_office || p.location || p.address || 'Dhaka, Bangladesh');
          if (Array.isArray(p.branch_offices)) {
            setBranchOffices(p.branch_offices);
          }

          // Mission, Culture, Perks
          setAbout(p.bio || '');
          setMission(p.mission || '');
          setVision(p.vision || '');
          setCompanyCulture(p.company_culture || '');
          if (Array.isArray(p.perks_and_benefits) && p.perks_and_benefits.length > 0) {
            setPerksAndBenefits(p.perks_and_benefits);
          }
          if (Array.isArray(p.specialties) && p.specialties.length > 0) {
            setSpecialties(p.specialties);
          }

          // Achievements
          if (Array.isArray(p.achievements)) {
            setAchievements(p.achievements);
          }

          // Contact, Social & Legal
          setContactEmail(p.contact_email || res.user?.email || '');
          setPhone(p.contact_phone || p.phone || '');
          if (p.social_links && typeof p.social_links === 'object') {
            setSocialLinks(prev => ({ ...prev, ...p.social_links }));
          }
          setTradeLicenseNo(p.trade_license_no || '');
          setTaxId(p.tax_id || '');
          setIsVerified(p.is_verified ?? false);
        }
      } catch (err) {
        console.warn('Failed to fetch company profile from backend:', err);
      }
    };
    loadCompanyProfile();
  }, [currentUser]);

  // Handle Image Upload Helper
  const handleFileUpload = async (file, type, setter) => {
    if (!file) return;
    setUploadingImage(true);
    try {
      const res = await uploadImageApi(file, type);
      if (res?.url) {
        const fullUrl = res.url.startsWith('http') ? res.url : `${import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000'}${res.url}`;
        setter(fullUrl);
      }
    } catch (err) {
      console.warn('Backend file upload failed, converting to local preview base64:', err);
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result);
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingImage(false);
    }
  };

  // Director handlers
  const addDirector = () => {
    setDirectors([...directors, { name: '', designation: 'Director', photo: '', linkedin: '', bio: '' }]);
  };

  const updateDirector = (index, field, value) => {
    const updated = [...directors];
    updated[index][field] = value;
    setDirectors(updated);
  };

  const removeDirector = (index) => {
    setDirectors(directors.filter((_, i) => i !== index));
  };

  // Branch Office handlers
  const addBranchOffice = () => {
    setBranchOffices([...branchOffices, { branch_name: '', address: '', city: '', contact_phone: '' }]);
  };

  const updateBranchOffice = (index, field, value) => {
    const updated = [...branchOffices];
    updated[index][field] = value;
    setBranchOffices(updated);
  };

  const removeBranchOffice = (index) => {
    setBranchOffices(branchOffices.filter((_, i) => i !== index));
  };

  // Achievement handlers
  const addAchievement = () => {
    setAchievements([...achievements, { title: '', year: new Date().getFullYear().toString(), organization: '', description: '' }]);
  };

  const updateAchievement = (index, field, value) => {
    const updated = [...achievements];
    updated[index][field] = value;
    setAchievements(updated);
  };

  const removeAchievement = (index) => {
    setAchievements(achievements.filter((_, i) => i !== index));
  };

  // Perks handlers
  const togglePerk = (perk) => {
    if (perksAndBenefits.includes(perk)) {
      setPerksAndBenefits(perksAndBenefits.filter(p => p !== perk));
    } else {
      setPerksAndBenefits([...perksAndBenefits, perk]);
    }
  };

  const addCustomPerk = () => {
    if (customPerkInput.trim() && !perksAndBenefits.includes(customPerkInput.trim())) {
      setPerksAndBenefits([...perksAndBenefits, customPerkInput.trim()]);
      setCustomPerkInput('');
    }
  };

  // Specialties handlers
  const addSpecialty = () => {
    if (customSpecialtyInput.trim() && !specialties.includes(customSpecialtyInput.trim())) {
      setSpecialties([...specialties, customSpecialtyInput.trim()]);
      setCustomSpecialtyInput('');
    }
  };

  const removeSpecialty = (spec) => {
    setSpecialties(specialties.filter(s => s !== spec));
  };

  // SAVE ALL TO DATABASE
  const handleSaveAll = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const payload = {
        name: companyName.trim(),
        company_name: companyName.trim(),
        tagline: tagline.trim(),
        company_website: website.trim(),
        company_logo: logoUrl.trim() || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=200&q=80',
        company_banner: bannerUrl.trim() || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
        industry: industry.trim(),
        company_size: employeeCount,
        employee_count: employeeCount,
        founded_year: foundedYear.trim(),
        company_type: companyType,
        
        // Owner & Leadership
        owner_name: ownerName.trim(),
        owner_title: ownerTitle.trim(),
        owner_photo: ownerPhoto.trim(),
        owner_bio: ownerBio.trim(),
        ceo_name: ceoName.trim(),
        ceo_bio: ceoBio.trim(),
        directors: directors,

        // Offices & Workplace
        head_office: headOffice.trim(),
        location: headOffice.trim(),
        address: headOffice.trim(),
        branch_offices: branchOffices,
        working_days: workingDays.trim(),
        office_hours: officeHours.trim(),

        // Culture, Mission, Perks
        bio: about.trim(),
        mission: mission.trim(),
        vision: vision.trim(),
        company_culture: companyCulture.trim(),
        perks_and_benefits: perksAndBenefits,
        specialties: specialties,

        // Achievements
        achievements: achievements,

        // Contact, Social & Legal
        contact_email: contactEmail.trim(),
        contact_phone: phone.trim(),
        phone: phone.trim(),
        social_links: socialLinks,
        trade_license_no: tradeLicenseNo.trim(),
        tax_id: taxId.trim(),
      };

      await updateProfile(payload);

      if (typeof updateCurrentUserSession === 'function') {
        updateCurrentUserSession({ companyName: companyName.trim() });
      }

      setSavedSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setSavedSuccess(false), 4500);
    } catch (err) {
      console.error('Failed to save company profile:', err);
      alert('Error saving company profile to backend database. Please ensure the backend is running.');
    } finally {
      setSaving(false);
    }
  };

  // Completion calculation
  const calculateCompletion = () => {
    const fields = [
      companyName, tagline, industry, website, logoUrl, bannerUrl,
      ownerName, ownerPhoto, ceoName, headOffice, about, mission,
      contactEmail, phone, perksAndBenefits.length > 0
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16 px-3 sm:px-6">
      
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                Enterprise Corporate Identity
              </span>
              {isVerified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Verified Organization
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              {companyName || 'Corporate Organization Profile'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {tagline || 'Manage your comprehensive company identity, leadership board, office locations, workforce details, and organizational achievements.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setPreviewModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Eye className="w-4 h-4 text-amber-300" />
              <span>Candidate Live View</span>
            </button>
            <button
              type="button"
              onClick={handleSaveAll}
              disabled={saving}
              className="px-7 py-3 rounded-2xl bg-gradient-to-r from-brand-accent to-indigo-600 hover:from-brand-accentHover hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-brand-accent/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving to Database...' : 'Save All Changes'}</span>
            </button>
          </div>
        </div>

        {/* Profile Strength Progress Bar */}
        <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-black text-amber-400 text-sm">
              {calculateCompletion()}%
            </div>
            <div>
              <span className="font-bold text-white block">Profile Completion Score</span>
              <span className="text-slate-400 text-[11px]">A complete corporate profile attracts 3.4x more verified candidates</span>
            </div>
          </div>
          <div className="w-full sm:w-64 bg-white/10 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-700" 
              style={{ width: `${calculateCompletion()}%` }}
            />
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold flex items-center gap-3 shadow-md animate-fade-in">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <div>
            <span>All corporate profile data, executive leadership, offices & achievements have been stored and saved successfully in the database!</span>
          </div>
        </div>
      )}

      {/* Tabs Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none">
        {[
          { id: 'overview', label: '1. Overview & Branding', icon: Building },
          { id: 'leadership', label: '2. Owner & Executive Board', icon: Crown },
          { id: 'workforce', label: '3. Offices & Workforce', icon: MapPin },
          { id: 'culture', label: '4. Culture, Mission & Perks', icon: HeartHandshake },
          { id: 'achievements', label: '5. Achievements & Milestones', icon: Award },
          { id: 'contact', label: '6. Contact & Legal Verification', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-brand-navy text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Form inputs */}
        <div className="lg:col-span-2 space-y-6">

          {/* ===================== TAB 1: OVERVIEW & BRANDING ===================== */}
          {activeTab === 'overview' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6 animate-fade-in">
              <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-brand-navy flex items-center gap-2">
                    <Building className="w-5 h-5 text-brand-accent" />
                    Company Identity & Visual Branding
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Define core company metadata, logo, and cover showcase.</p>
                </div>
              </div>

              {/* Logo & Banner Upload Box */}
              <div className="space-y-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-xs font-bold text-brand-navy block uppercase tracking-wider">Corporate Visual Assets</span>
                
                {/* Banner Preview & Upload */}
                <div className="relative h-36 rounded-2xl bg-slate-200 overflow-hidden border border-slate-300 group">
                  {bannerUrl ? (
                    <img src={bannerUrl} alt="Cover Banner" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-gradient-to-r from-slate-800 to-indigo-900 text-white">
                      <ImageIcon className="w-8 h-8 mb-1 opacity-70" />
                      <span className="text-xs font-semibold">Upload Brand Cover / Office Banner</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => bannerInputRef.current?.click()}
                      className="px-3.5 py-2 rounded-xl bg-white/90 text-slate-900 text-xs font-bold flex items-center gap-1.5 hover:bg-white shadow-md cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5 text-brand-accent" />
                      <span>Upload Banner</span>
                    </button>
                    {bannerUrl && (
                      <button
                        type="button"
                        onClick={() => setBannerUrl('')}
                        className="px-3 py-2 rounded-xl bg-red-600/90 text-white text-xs font-bold flex items-center gap-1 hover:bg-red-600 shadow-md cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={bannerInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files?.[0], 'banner', setBannerUrl)}
                  />
                </div>

                {/* Logo Upload Row */}
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                  <div className="relative w-20 h-20 rounded-2xl bg-white border-2 border-slate-200 shadow-md overflow-hidden shrink-0 flex items-center justify-center group">
                    {logoUrl ? (
                      <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <Building className="w-9 h-9 text-slate-400" />
                    )}
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                    <input
                      type="file"
                      ref={logoInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e.target.files?.[0], 'logo', setLogoUrl)}
                    />
                  </div>

                  <div className="flex-1 space-y-1.5 w-full">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-brand-navy">Company Logo (File or Direct URL)</label>
                      <button
                        type="button"
                        onClick={() => logoInputRef.current?.click()}
                        className="text-xs text-brand-accent font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Upload className="w-3 h-3" />
                        <span>Browse File</span>
                      </button>
                    </div>
                    <input
                      type="url"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      placeholder="https://... or upload PNG/JPG logo file"
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-200 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1">Company / Organization Name *</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Apex Global Technologies Ltd."
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1">Company Slogan / Tagline</label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g. Pioneering Next-Gen Cloud & AI Innovation"
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1">Industry Sector</label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g. Software & Fintech"
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1">Company Type</label>
                  <select
                    value={companyType}
                    onChange={(e) => setCompanyType(e.target.value)}
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-white font-medium"
                  >
                    {COMPANY_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1">Founded Year</label>
                  <input
                    type="text"
                    value={foundedYear}
                    onChange={(e) => setFoundedYear(e.target.value)}
                    placeholder="e.g. 2018"
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-navy mb-1">Official Website Link</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://www.yourcompany.com"
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-navy mb-1">About Company & Organization Overview *</label>
                <textarea
                  rows={4}
                  required
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="Provide an engaging description of what your organization does, history, impact, and working philosophy..."
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 font-medium leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* ===================== TAB 2: OWNER & LEADERSHIP ===================== */}
          {activeTab === 'leadership' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-8 animate-fade-in">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-extrabold text-brand-navy flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-500" />
                  Owner, CEO & Board of Directors
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Showcase leadership hierarchy to build ultimate trust and prestige.</p>
              </div>

              {/* 1. Company Owner Section */}
              <div className="p-6 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-5">
                <div className="flex items-center justify-between border-b border-amber-200/60 pb-3">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">Company Owner / Founder Details</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                  {/* Owner Photo */}
                  <div className="relative w-24 h-24 rounded-2xl bg-white border-2 border-amber-300 shadow-md overflow-hidden shrink-0 group flex items-center justify-center">
                    {ownerPhoto ? (
                      <img src={ownerPhoto} alt="Owner" className="w-full h-full object-cover" />
                    ) : (
                      <Users className="w-10 h-10 text-amber-400" />
                    )}
                    <button
                      type="button"
                      onClick={() => ownerPhotoInputRef.current?.click()}
                      className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                    <input
                      type="file"
                      ref={ownerPhotoInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e.target.files?.[0], 'owner', setOwnerPhoto)}
                    />
                  </div>

                  <div className="flex-1 space-y-3 w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-brand-navy mb-1">Owner / Founder Full Name *</label>
                        <input
                          type="text"
                          value={ownerName}
                          onChange={(e) => setOwnerName(e.target.value)}
                          placeholder="e.g. Engr. Tanvir Ahmed"
                          className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-brand-navy mb-1">Owner Designation / Title</label>
                        <input
                          type="text"
                          value={ownerTitle}
                          onChange={(e) => setOwnerTitle(e.target.value)}
                          placeholder="e.g. Founder & Chairman"
                          className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white font-medium"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        value={ownerPhoto}
                        onChange={(e) => setOwnerPhoto(e.target.value)}
                        placeholder="Owner Photo URL or click image above to upload"
                        className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-white font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => ownerPhotoInputRef.current?.click()}
                        className="px-3 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 whitespace-nowrap cursor-pointer shadow-sm"
                      >
                        Upload Pic
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1">Message / Vision from the Owner</label>
                  <textarea
                    rows={3}
                    value={ownerBio}
                    onChange={(e) => setOwnerBio(e.target.value)}
                    placeholder="A personal quote, leadership vision, or welcoming note from the company founder..."
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-white font-medium"
                  />
                </div>
              </div>

              {/* 2. Chief Executive Officer (CEO) */}
              <div className="p-6 rounded-2xl bg-indigo-50/50 border border-indigo-200/80 space-y-4">
                <div className="flex items-center gap-2 border-b border-indigo-200/60 pb-3">
                  <BadgeCheck className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider">Chief Executive Officer (CEO)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-navy mb-1">CEO Full Name</label>
                    <input
                      type="text"
                      value={ceoName}
                      onChange={(e) => setCeoName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-navy mb-1">CEO Strategic Message</label>
                    <textarea
                      rows={2}
                      value={ceoBio}
                      onChange={(e) => setCeoBio(e.target.value)}
                      placeholder="Brief statement from CEO regarding company growth & talent culture..."
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Board of Directors */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-brand-navy flex items-center gap-2">
                      <Users className="w-4 h-4 text-brand-accent" />
                      Board of Directors & Senior Leadership
                    </h4>
                    <p className="text-xs text-slate-500">Add key directors, Managing Director, CTO, CFO, or Advisors.</p>
                  </div>
                  <button
                    type="button"
                    onClick={addDirector}
                    className="px-4 py-2 rounded-xl bg-brand-accent text-white text-xs font-bold hover:bg-brand-accentHover flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Director</span>
                  </button>
                </div>

                {directors.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 space-y-2">
                    <Users className="w-8 h-8 mx-auto opacity-50" />
                    <p className="text-xs font-semibold">No Board of Directors added yet.</p>
                    <button
                      type="button"
                      onClick={addDirector}
                      className="text-xs text-brand-accent font-bold hover:underline cursor-pointer"
                    >
                      + Click here to add your first Director
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {directors.map((dir, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative group">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-slate-700">Director #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => removeDirector(idx)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">Full Name</label>
                            <input
                              type="text"
                              value={dir.name || ''}
                              onChange={(e) => updateDirector(idx, 'name', e.target.value)}
                              placeholder="e.g. Dr. Rafiqul Islam"
                              className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">Designation</label>
                            <input
                              type="text"
                              value={dir.designation || ''}
                              onChange={(e) => updateDirector(idx, 'designation', e.target.value)}
                              placeholder="e.g. Managing Director / CTO"
                              className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-white font-medium"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">Photo URL</label>
                            <input
                              type="url"
                              value={dir.photo || ''}
                              onChange={(e) => updateDirector(idx, 'photo', e.target.value)}
                              placeholder="https://... photo link"
                              className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-white font-medium"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">LinkedIn Profile</label>
                            <input
                              type="url"
                              value={dir.linkedin || ''}
                              onChange={(e) => updateDirector(idx, 'linkedin', e.target.value)}
                              placeholder="https://linkedin.com/in/username"
                              className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-white font-medium"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">Brief Bio / Expertise</label>
                            <input
                              type="text"
                              value={dir.bio || ''}
                              onChange={(e) => updateDirector(idx, 'bio', e.target.value)}
                              placeholder="e.g. 15+ years in Enterprise FinTech"
                              className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-white font-medium"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===================== TAB 3: WORKFORCE & OFFICES ===================== */}
          {activeTab === 'workforce' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6 animate-fade-in">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-extrabold text-brand-navy flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-brand-accent" />
                  Workforce Scale & Office Locations
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Define employee count, working schedule, headquarters, and branch offices.</p>
              </div>

              {/* Workforce & Hours */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1">Workforce Size / Employee Count *</label>
                  <select
                    value={employeeCount}
                    onChange={(e) => setEmployeeCount(e.target.value)}
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-white font-semibold"
                  >
                    {EMPLOYEE_SIZES.map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1">Official Working Days</label>
                  <input
                    type="text"
                    value={workingDays}
                    onChange={(e) => setWorkingDays(e.target.value)}
                    placeholder="e.g. Sunday - Thursday"
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1">Daily Office Hours</label>
                  <input
                    type="text"
                    value={officeHours}
                    onChange={(e) => setOfficeHours(e.target.value)}
                    placeholder="e.g. 09:00 AM - 06:00 PM"
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 font-medium"
                  />
                </div>
              </div>

              {/* Headquarters Address */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-brand-navy" />
                  <span className="text-xs font-bold text-brand-navy uppercase tracking-wider">Corporate Headquarters (Main Office) *</span>
                </div>
                <textarea
                  rows={2}
                  required
                  value={headOffice}
                  onChange={(e) => setHeadOffice(e.target.value)}
                  placeholder="e.g. Level 12, Crystal Tower, Gulshan-2, Dhaka 1212, Bangladesh"
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-white font-medium"
                />
              </div>

              {/* Branch / Regional Offices */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-brand-navy flex items-center gap-2">
                      <Globe className="w-4 h-4 text-brand-accent" />
                      Branch & Regional Offices (Optional)
                    </h4>
                    <p className="text-xs text-slate-500">Add other regional, international, or manufacturing office locations.</p>
                  </div>
                  <button
                    type="button"
                    onClick={addBranchOffice}
                    className="px-4 py-2 rounded-xl bg-brand-accent text-white text-xs font-bold hover:bg-brand-accentHover flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Branch</span>
                  </button>
                </div>

                {branchOffices.length === 0 ? (
                  <div className="p-6 text-center rounded-2xl border-2 border-dashed border-slate-200 text-slate-400">
                    <p className="text-xs font-medium">No branch offices listed. If your company operates multiple branches, click above to add them.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {branchOffices.map((branch, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700">Branch Office #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => removeBranchOffice(idx)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">Branch Name</label>
                            <input
                              type="text"
                              value={branch.branch_name || ''}
                              onChange={(e) => updateBranchOffice(idx, 'branch_name', e.target.value)}
                              placeholder="e.g. Chittagong Hub"
                              className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">Branch Full Address</label>
                            <input
                              type="text"
                              value={branch.address || ''}
                              onChange={(e) => updateBranchOffice(idx, 'address', e.target.value)}
                              placeholder="e.g. Agrabad C/A, Chittagong"
                              className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-white font-medium"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===================== TAB 4: CULTURE, MISSION & PERKS ===================== */}
          {activeTab === 'culture' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6 animate-fade-in">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-extrabold text-brand-navy flex items-center gap-2">
                  <HeartHandshake className="w-5 h-5 text-rose-500" />
                  Mission, Vision, Culture & Employee Perks
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Attract top tier talent by highlighting why your company is a dream workplace.</p>
              </div>

              {/* Mission & Vision Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-brand-navy flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-brand-accent" />
                    Company Mission Statement
                  </label>
                  <textarea
                    rows={3}
                    value={mission}
                    onChange={(e) => setMission(e.target.value)}
                    placeholder="What is your core purpose and commitment to clients & community?"
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-brand-navy flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Company Future Vision
                  </label>
                  <textarea
                    rows={3}
                    value={vision}
                    onChange={(e) => setVision(e.target.value)}
                    placeholder="Where do you envision your organization in the next 5-10 years?"
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 font-medium"
                  />
                </div>
              </div>

              {/* Company Culture & Core Values */}
              <div>
                <label className="block text-xs font-bold text-brand-navy mb-1">Company Culture & Work Environment</label>
                <textarea
                  rows={3}
                  value={companyCulture}
                  onChange={(e) => setCompanyCulture(e.target.value)}
                  placeholder="Describe your team spirit, diversity, openness to ideas, learning opportunities, and work-life balance..."
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 font-medium"
                />
              </div>

              {/* Perks & Benefits Selector */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-brand-navy">
                  Employee Perks & Benefits Showcase (Select or Add Custom)
                </label>
                
                <div className="flex flex-wrap gap-2">
                  {DEFAULT_PERKS_PRESETS.map((perk) => {
                    const isSelected = perksAndBenefits.includes(perk);
                    return (
                      <button
                        key={perk}
                        type="button"
                        onClick={() => togglePerk(perk)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                        }`}
                      >
                        <Check className={`w-3.5 h-3.5 ${isSelected ? 'opacity-100' : 'opacity-30'}`} />
                        <span>{perk}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Add Custom Perk Input */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    value={customPerkInput}
                    onChange={(e) => setCustomPerkInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomPerk())}
                    placeholder="Add custom benefit (e.g. Free MacBook, Stock Options)..."
                    className="flex-1 p-2.5 text-xs rounded-xl border border-slate-200 font-medium"
                  />
                  <button
                    type="button"
                    onClick={addCustomPerk}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-900 cursor-pointer"
                  >
                    Add Perk
                  </button>
                </div>
              </div>

              {/* Core Specialties & Tech Stack */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-brand-navy">
                  Core Technologies & Specialties
                </label>
                <div className="flex flex-wrap gap-2">
                  {specialties.map((spec) => (
                    <span
                      key={spec}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1.5"
                    >
                      <span>{spec}</span>
                      <button
                        type="button"
                        onClick={() => removeSpecialty(spec)}
                        className="text-indigo-400 hover:text-red-600 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customSpecialtyInput}
                    onChange={(e) => setCustomSpecialtyInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
                    placeholder="e.g. Next.js, Laravel, Cybersecurity, FinTech..."
                    className="flex-1 p-2.5 text-xs rounded-xl border border-slate-200 font-medium"
                  />
                  <button
                    type="button"
                    onClick={addSpecialty}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 cursor-pointer"
                  >
                    Add Skill/Domain
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 5: ACHIEVEMENTS & MILESTONES ===================== */}
          {activeTab === 'achievements' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6 animate-fade-in">
              <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-brand-navy flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-500" />
                    Corporate Achievements & Milestones
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">List recognized awards, industry certifications, fundings, and historic achievements.</p>
                </div>
                <button
                  type="button"
                  onClick={addAchievement}
                  className="px-4 py-2 rounded-xl bg-brand-accent text-white text-xs font-bold hover:bg-brand-accentHover flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Milestone</span>
                </button>
              </div>

              {achievements.length === 0 ? (
                <div className="p-10 text-center rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 space-y-3">
                  <Award className="w-10 h-10 mx-auto text-amber-400 opacity-60" />
                  <p className="text-xs font-bold text-slate-600">No achievements or awards added yet.</p>
                  <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                    Adding certifications, national awards, or high-growth milestones significantly increases applicant trust and caliber.
                  </p>
                  <button
                    type="button"
                    onClick={addAchievement}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 cursor-pointer"
                  >
                    + Add Your First Achievement
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {achievements.map((ach, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-amber-50/40 border border-amber-200/80 space-y-3 relative">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-amber-600" />
                          <span className="text-xs font-bold text-amber-900">Milestone #{idx + 1}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAchievement(idx)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Achievement / Award Title *</label>
                          <input
                            type="text"
                            value={ach.title || ''}
                            onChange={(e) => updateAchievement(idx, 'title', e.target.value)}
                            placeholder="e.g. Best IT Innovation Award 2025"
                            className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Year Achieved</label>
                          <input
                            type="text"
                            value={ach.year || ''}
                            onChange={(e) => updateAchievement(idx, 'year', e.target.value)}
                            placeholder="e.g. 2025"
                            className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white font-medium"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Awarding Body / Organization</label>
                          <input
                            type="text"
                            value={ach.organization || ''}
                            onChange={(e) => updateAchievement(idx, 'organization', e.target.value)}
                            placeholder="e.g. BASIS / Ministry of ICT"
                            className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Brief Description</label>
                          <input
                            type="text"
                            value={ach.description || ''}
                            onChange={(e) => updateAchievement(idx, 'description', e.target.value)}
                            placeholder="e.g. Recognized for outstanding AI SaaS product"
                            className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white font-medium"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ===================== TAB 6: CONTACT & LEGAL ===================== */}
          {activeTab === 'contact' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6 animate-fade-in">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-extrabold text-brand-navy flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  Official Contact, Socials & Legal Verification
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Configure public recruitment contact channels and government registration credentials.</p>
              </div>

              {/* Public Contact Channels */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1">Official Recruitment / HR Email *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="careers@company.com"
                      className="w-full pl-9 p-3 text-xs rounded-xl border border-slate-200 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1">Public Corporate Hotline / Phone</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+880 1700-000000"
                      className="w-full pl-9 p-3 text-xs rounded-xl border border-slate-200 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-brand-navy">Corporate Social Media & Code Profiles</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <LinkedInIcon />
                    <input
                      type="url"
                      value={socialLinks.linkedin || ''}
                      onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                      placeholder="LinkedIn Company Page URL"
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-200 font-medium"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <FacebookIcon />
                    <input
                      type="url"
                      value={socialLinks.facebook || ''}
                      onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
                      placeholder="Facebook Page URL"
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-200 font-medium"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <TwitterIcon />
                    <input
                      type="url"
                      value={socialLinks.twitter || ''}
                      onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
                      placeholder="Twitter / X Profile URL"
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-200 font-medium"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <GithubIcon />
                    <input
                      type="url"
                      value={socialLinks.github || ''}
                      onChange={(e) => setSocialLinks({ ...socialLinks, github: e.target.value })}
                      placeholder="GitHub Organization URL"
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-200 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Legal & Authenticity Verification */}
              <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-700" />
                    <div>
                      <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider block">Business Registration & Legal Verification</span>
                      <span className="text-[11px] text-emerald-700">Display verified authenticity badge to candidates</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-emerald-900 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isVerified}
                        disabled
                        title="Verification is managed by the platform administrator."
                        className="rounded text-emerald-600 mr-1.5 focus:ring-0"
                      />
                      Verified Badge Active
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-emerald-900 mb-1">Trade License / Incorporation No.</label>
                    <input
                      type="text"
                      value={tradeLicenseNo}
                      onChange={(e) => setTradeLicenseNo(e.target.value)}
                      placeholder="e.g. TRAD/DNCC/019283/2023"
                      className="w-full p-2.5 text-xs rounded-xl border border-emerald-300 bg-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-emerald-900 mb-1">Tax ID / TIN / BIN Number</label>
                    <input
                      type="text"
                      value={taxId}
                      onChange={(e) => setTaxId(e.target.value)}
                      placeholder="e.g. BIN-002938102-0102"
                      className="w-full p-2.5 text-xs rounded-xl border border-emerald-300 bg-white font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Fixed Action Bar */}
          <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
              <Info className="w-4 h-4 text-brand-accent" />
              All inputs are stored directly into backend database on save.
            </span>
            <button
              type="button"
              onClick={handleSaveAll}
              disabled={saving}
              className="px-8 py-3.5 rounded-xl bg-brand-accent hover:bg-brand-accentHover text-white font-bold text-xs shadow-md shadow-brand-accent/25 flex items-center gap-2 cursor-pointer transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Company Profile'}</span>
            </button>
          </div>
        </div>

        {/* Right 1 Col: Live Corporate Card Preview */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden sticky top-6 space-y-4">
            
            {/* Live Preview Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-wider">Live Candidate Showcase</span>
              </div>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                ACTIVE
              </span>
            </div>

            {/* Banner & Logo Visual */}
            <div className="relative">
              <div className="h-28 bg-slate-800 overflow-hidden">
                {bannerUrl ? (
                  <img src={bannerUrl} alt="Cover" className="w-full h-full object-cover opacity-90" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-slate-900 to-indigo-900 flex items-center justify-center">
                    <Building className="w-8 h-8 text-white/30" />
                  </div>
                )}
              </div>
              
              <div className="absolute -bottom-6 left-6 w-16 h-16 rounded-2xl bg-white p-1 shadow-lg border-2 border-white overflow-hidden flex items-center justify-center">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <Building className="w-8 h-8 text-slate-400" />
                )}
              </div>
            </div>

            {/* Summary Details */}
            <div className="p-6 pt-8 space-y-4">
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-base font-extrabold text-brand-navy">{companyName || 'Your Company Name'}</h4>
                  {isVerified && <BadgeCheck className="w-4 h-4 text-brand-accent shrink-0" />}
                </div>
                <p className="text-xs text-brand-accent font-semibold">{industry}</p>
                {tagline && <p className="text-[11px] text-slate-500 italic mt-0.5">"{tagline}"</p>}
              </div>

              {/* Key Quick Stats */}
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-slate-400" /> Scale:</span>
                  <span className="font-bold text-brand-navy truncate max-w-[130px]">{employeeCount.split(' ')[0]}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /> HQ:</span>
                  <span className="font-bold text-brand-navy truncate max-w-[140px]">{headOffice}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-400" /> Founded:</span>
                  <span className="font-bold text-brand-navy">{foundedYear}</span>
                </div>
                {website && (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-slate-400" /> Web:</span>
                    <a href={website} target="_blank" rel="noreferrer" className="font-bold text-brand-accent hover:underline truncate max-w-[130px]">
                      {website.replace('https://', '').replace('http://', '')}
                    </a>
                  </div>
                )}
              </div>

              {/* Owner Quote Box if present */}
              {ownerName && (
                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/70 space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-amber-200 overflow-hidden shrink-0 flex items-center justify-center">
                      {ownerPhoto ? (
                        <img src={ownerPhoto} alt={ownerName} className="w-full h-full object-cover" />
                      ) : (
                        <Crown className="w-4 h-4 text-amber-800" />
                      )}
                    </div>
                    <div>
                      <span className="text-[11px] font-extrabold text-amber-950 block leading-tight">{ownerName}</span>
                      <span className="text-[10px] text-amber-700 font-semibold">{ownerTitle}</span>
                    </div>
                  </div>
                  {ownerBio && (
                    <p className="text-[11px] text-slate-600 italic line-clamp-2">"{ownerBio}"</p>
                  )}
                </div>
              )}

              {/* Perks preview */}
              {perksAndBenefits.length > 0 && (
                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Top Perks</span>
                  <div className="flex flex-wrap gap-1">
                    {perksAndBenefits.slice(0, 4).map((p, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        ✓ {p}
                      </span>
                    ))}
                    {perksAndBenefits.length > 4 && (
                      <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-500">
                        +{perksAndBenefits.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => setPreviewModalOpen(true)}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Open Full Page Preview</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Full Page Candidate Preview Modal */}
      {previewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in overflow-y-auto">
          <div className="bg-slate-50 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 space-y-6 pb-8">
            
            {/* Modal Header Bar */}
            <div className="p-4 sm:p-6 bg-slate-900 text-white rounded-t-3xl flex items-center justify-between sticky top-0 z-20 shadow-md">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm sm:text-base font-bold">Public Candidate View Showcase</h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewModalOpen(false)}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer"
              >
                Close Preview
              </button>
            </div>

            <div className="px-4 sm:px-8 space-y-6">
              
              {/* Cover & Brand Box */}
              <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
                <div className="h-44 sm:h-56 bg-slate-800 relative">
                  {bannerUrl ? (
                    <img src={bannerUrl} alt="Cover" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-slate-900 to-indigo-950 flex items-center justify-center">
                      <Building className="w-12 h-12 text-white/30" />
                    </div>
                  )}
                </div>

                <div className="p-6 sm:p-8 relative">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white p-1.5 shadow-xl border-4 border-white overflow-hidden flex items-center justify-center shrink-0">
                      {logoUrl ? (
                        <img src={logoUrl} alt="Logo" className="w-full h-full object-cover rounded-2xl" />
                      ) : (
                        <Building className="w-12 h-12 text-slate-400" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {isVerified && (
                        <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                          <BadgeCheck className="w-4 h-4 text-emerald-600" />
                          Verified Enterprise
                        </span>
                      )}
                      {website && (
                        <a
                          href={website}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-1.5 rounded-full text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-1.5 shadow-sm"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>Website</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl sm:text-3xl font-extrabold text-brand-navy">{companyName}</h2>
                    {tagline && <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium italic">"{tagline}"</p>}
                    <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-600 font-semibold">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-brand-accent">{industry}</span>
                      <span>•</span>
                      <span>{companyType}</span>
                      <span>•</span>
                      <span>Founded {foundedYear}</span>
                      <span>•</span>
                      <span>{employeeCount}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Owner Quote Card */}
              {ownerName && (
                <div className="bg-gradient-to-r from-amber-500/10 via-amber-100/50 to-amber-500/10 rounded-3xl p-6 sm:p-8 border border-amber-300/80 shadow-sm flex flex-col sm:flex-row items-center gap-6">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white border-2 border-amber-300 overflow-hidden shrink-0 shadow-md flex items-center justify-center">
                    {ownerPhoto ? (
                      <img src={ownerPhoto} alt={ownerName} className="w-full h-full object-cover" />
                    ) : (
                      <Crown className="w-10 h-10 text-amber-600" />
                    )}
                  </div>
                  <div className="space-y-1.5 text-center sm:text-left flex-1">
                    <span className="text-[10px] font-black tracking-widest uppercase text-amber-800 bg-amber-200/80 px-2.5 py-0.5 rounded-full inline-block">
                      Leadership Message
                    </span>
                    <h4 className="text-base sm:text-lg font-black text-brand-navy">{ownerName} ({ownerTitle})</h4>
                    <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                      "{ownerBio || 'Welcome to our organization. We are committed to fostering an innovative workplace where talents thrive.'}"
                    </p>
                  </div>
                </div>
              )}

              {/* About & Mission */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
                  <h4 className="text-sm font-bold text-brand-navy flex items-center gap-2">
                    <FileText className="w-4 h-4 text-brand-accent" />
                    About Organization
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{about || 'No detailed bio provided.'}</p>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
                  <h4 className="text-sm font-bold text-brand-navy flex items-center gap-2">
                    <Compass className="w-4 h-4 text-brand-accent" />
                    Mission & Vision
                  </h4>
                  {mission && <p className="text-xs text-slate-600"><strong className="text-brand-navy">Mission:</strong> {mission}</p>}
                  {vision && <p className="text-xs text-slate-600"><strong className="text-brand-navy">Vision:</strong> {vision}</p>}
                </div>
              </div>

              {/* Board of Directors Showcase */}
              {directors.length > 0 && (
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <h4 className="text-sm font-bold text-brand-navy flex items-center gap-2">
                    <Users className="w-4 h-4 text-brand-accent" />
                    Board of Directors & Executive Team
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {directors.map((d, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-200 overflow-hidden shrink-0 flex items-center justify-center font-bold text-slate-600">
                          {d.photo ? <img src={d.photo} alt={d.name} className="w-full h-full object-cover" /> : d.name?.charAt(0) || 'D'}
                        </div>
                        <div className="overflow-hidden">
                          <h5 className="text-xs font-bold text-brand-navy truncate">{d.name || 'Director'}</h5>
                          <p className="text-[11px] text-brand-accent font-semibold truncate">{d.designation}</p>
                          {d.bio && <p className="text-[10px] text-slate-500 truncate">{d.bio}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Achievements Showcase */}
              {achievements.length > 0 && (
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <h4 className="text-sm font-bold text-brand-navy flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-500" />
                    Key Milestones & Honors
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {achievements.map((ach, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 flex items-start gap-3">
                        <Award className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs font-bold text-amber-950 block">{ach.title} ({ach.year})</span>
                          <span className="text-[11px] text-slate-600 block">{ach.organization}</span>
                          {ach.description && <p className="text-[11px] text-slate-500 mt-1">{ach.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Perks & Benefits Badges */}
              {perksAndBenefits.length > 0 && (
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
                  <h4 className="text-sm font-bold text-brand-navy flex items-center gap-2">
                    <HeartHandshake className="w-4 h-4 text-rose-500" />
                    Perks & Workplace Benefits
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {perksAndBenefits.map((perk, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        {perk}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Offices & Contact */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-brand-navy flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-brand-accent" />
                    Office Locations
                  </h4>
                  <p className="text-xs text-slate-700"><strong>Headquarters:</strong> {headOffice}</p>
                  {branchOffices.map((b, i) => (
                    <p key={i} className="text-xs text-slate-600"><strong>{b.branch_name}:</strong> {b.address}</p>
                  ))}
                  <p className="text-xs text-slate-500 pt-1"><strong>Working Hours:</strong> {workingDays}, {officeHours}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-brand-navy flex items-center gap-2">
                    <Phone className="w-4 h-4 text-brand-accent" />
                    Direct Contact
                  </h4>
                  <p className="text-xs text-slate-700"><strong>HR Email:</strong> {contactEmail || 'Not specified'}</p>
                  <p className="text-xs text-slate-700"><strong>Phone / Hotline:</strong> {phone || 'Not specified'}</p>
                  {tradeLicenseNo && (
                    <p className="text-xs text-emerald-700 font-semibold pt-1">
                      ✓ Reg / Trade License: {tradeLicenseNo}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
