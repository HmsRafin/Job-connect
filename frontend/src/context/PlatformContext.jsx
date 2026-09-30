import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import api from '../lib/api/axios';
import { uploadResumeApi } from '../lib/api/profile';
import { fetchJobs, createJob, updateJob as apiUpdateJob, boostJob as apiBoostJob, cancelBoostJob as apiCancelBoostJob, deleteJob as apiDeleteJob } from '../lib/api/jobs';
import { fetchApplications, submitApplication, updateApplicationStatus } from '../lib/api/applications';
import { 
  fetchTasks, createTask,
  fetchInterviews, createInterview, updateInterview as apiUpdateInterview,
  fetchAdvertisements, createAdvertisement as apiCreateAdvertisement,
  fetchPayments
} from '../lib/api/recruitment';
import { fetchBoostPricing, updateBoostPricingApi } from '../lib/api/settings';
import { 
  submitContactInquiry, fetchComplaints as apiFetchComplaints, 
  replyToComplaint as apiReplyToComplaint, updateComplaintStatus as apiUpdateComplaintStatus 
} from '../lib/api/complaints';
import { useAuth } from './AuthContext';

const PlatformContext = createContext();
const parseList = value => {
  try { const parsed = JSON.parse(value); return Array.isArray(parsed) ? parsed : []; }
  catch { return []; }
};
const errorMessage = error => Object.values(error.response?.data?.errors || {}).flat().join(' ')
  || error.response?.data?.message || error.message || 'The request could not be completed.';
const sessionUser = user => user ? {
  ...user, id: 'usr-' + user.id, dbId: user.id,
  role: user.role?.toLowerCase(), companyName: user.companyName || user.profile?.company_name || user.company_name || user.name,
} : null;
const replaceById = (items, updated) => items.map(item => String(item.id) === String(updated.id) ? updated : item);


// Helper to normalize listing objects
const normalizeListing = (job) => ({
  id: job.id,
  title: job.title,
  company: job.company,
  categoryType: job.category_type || job.categoryType || 'Job',
  category: job.category || 'Software Development',
  type: job.type || 'Full-Time',
  workModel: job.work_model || job.workModel || 'Remote',
  location: job.location || 'Remote',
  salary: job.salary || 'Competitive',
  experience: job.experience || 'Mid-Level (2-5 yrs)',
  description: job.description || '',
  requirements: Array.isArray(job.requirements) ? job.requirements : (typeof job.requirements === 'string' ? parseList(job.requirements) : []),
  tags: Array.isArray(job.tags) ? job.tags : (typeof job.tags === 'string' ? parseList(job.tags) : [job.category_type || 'Job', job.type || 'Full-Time', job.work_model || 'Remote']),
  logo: job.logo || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=120&q=80',
  featured: Boolean(job.featured),
  boostedDays: job.boosted_days || job.boostedDays || 0,
  boostExpiry: job.boost_expiry || job.boostExpiry || null,
  status: job.status || 'Active',
  applicationsCount: job.applications_count || 0,
  postedDate: job.created_at ? new Date(job.created_at).toLocaleDateString() : 'Recently',
  userId: job.user_id,
});

// Helper to normalize application objects
const normalizeApplication = (app) => {
  const rawStatus = app.status || app.stage || 'Application Submitted';
  const displayStage = rawStatus === 'Applied' ? 'Application Submitted' : rawStatus;

  return {
    id: app.id,
    jobId: app.listing_id || app.jobId,
    jobTitle: app.listing?.title || app.jobTitle || 'Job Position',
    company: app.listing?.company || app.company || 'Hiring Company',
    candidateName: app.candidate_name || app.candidateName || 'Candidate',
    candidateEmail: app.candidate_email || app.candidateEmail || 'candidate@example.com',
    candidatePhone: app.candidate_phone || app.candidatePhone || '',
    appliedDate: app.created_at ? new Date(app.created_at).toISOString().split('T')[0] : (app.appliedDate || new Date().toISOString().split('T')[0]),
    stage: displayStage,
    status: displayStage,
    salary: app.listing?.salary || app.salary || 'Not specified',
    matchScore: app.ai_score ?? app.matchScore ?? null,
    pitch: app.cover_letter || app.pitch || '',
    resumeFile: app.resume_name || app.resume_url || app.resumeFile || '',
    taskDetails: app.task_details || null,
    interviewDate: app.interview_date || null,
    notes: `Current status: ${displayStage}`
  };
};

// Helper to normalize advertisement objects
const normalizeAdvertisement = (ad) => {
  if (!ad) return null;
  return {
    id: ad.id,
    userId: ad.user_id || ad.userId,
    title: ad.title || 'Advertisement',
    company: ad.company || 'Company',
    description: ad.description || '',
    bannerUrl: ad.image_url || ad.bannerUrl || ad.imageUrl || 'https://images.unsplash.com/photo-1542744094-3a317272018a?auto=format&fit=crop&w=800&q=80',
    imageUrl: ad.image_url || ad.bannerUrl || ad.imageUrl,
    websiteUrl: ad.target_url || ad.websiteUrl || ad.targetUrl || '#',
    targetUrl: ad.target_url || ad.websiteUrl || ad.targetUrl || '#',
    placement: ad.placement || 'Sidebar',
    days: Number(ad.days) || 30,
    startDate: ad.start_date || ad.startDate || (ad.created_at ? new Date(ad.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
    endDate: ad.end_date || ad.endDate || null,
    status: ad.status || 'Active',
    cost: Number(ad.amount) || Number(ad.cost) || (ad.days ? Number(ad.days) * 15 : 450),
    clicks: ad.clicks || 0,
    impressions: ad.impressions || 0,
  };
};

// Helper to normalize task objects
const normalizeTask = (task) => ({
  id: task.id,
  applicationId: task.application_id || task.applicationId,
  recruiterId: task.recruiter_id || task.recruiterId,
  seekerId: task.seeker_id || task.seekerId,
  title: task.title,
  description: task.description || '',
  instructions: task.instructions || task.description || '',
  attachmentName: task.attachment_name || task.attachmentName || null,
  deadline: task.deadline ? (task.deadline.includes('T') ? task.deadline.replace('T', ' ') : task.deadline) : 'Within 7 Days',
  status: task.status || 'Pending',
  submissionUrl: task.status === 'Submitted' ? (task.submission_url || null) : null,
  feedback: task.submission_notes || task.feedback || null,
  candidateName: task.seeker?.name || task.application?.candidate_name || task.candidateName || 'Candidate',
  candidateEmail: task.seeker?.email || task.application?.candidate_email || task.candidateEmail || 'candidate@example.com',
  jobTitle: task.application?.listing?.title || task.jobTitle || 'Position Assessment',
  company: task.recruiter?.name || task.application?.listing?.company || task.company || 'Hiring Company',
  createdAt: task.created_at || new Date().toISOString(),
});

// Helper to normalize interview objects
const normalizeInterview = (item) => ({
  id: item.id,
  applicationId: item.application_id || item.applicationId,
  recruiterId: item.recruiter_id || item.recruiterId,
  seekerId: item.seeker_id || item.seekerId,
  title: item.title || 'Technical Interview Screen',
  date: item.date ? (typeof item.date === 'string' && item.date.includes('T') ? item.date.split('T')[0] : item.date) : new Date().toISOString().split('T')[0],
  time: item.time || '10:00 AM',
  timezone: item.timezone || 'GMT+6 (BST)',
  platform: item.platform || (item.meeting_link?.includes('zoom') ? 'Zoom' : (item.meeting_link?.includes('meet.google') ? 'Google Meet' : 'Video Conference')),
  meetingUrl: item.meeting_link || item.meetingUrl || '',
  type: item.type || 'Video',
  status: item.status || 'Scheduled',
  notes: item.notes || '',
  candidateResponse: item.candidate_response || item.candidateResponse || '',
  candidateName: item.seeker?.name || item.application?.candidate_name || item.candidateName || 'Candidate',
  candidateEmail: item.seeker?.email || item.application?.candidate_email || item.candidateEmail || 'candidate@example.com',
  jobTitle: item.application?.listing?.title || item.jobTitle || 'Position Interview',
  company: item.recruiter?.name || item.application?.listing?.company || item.company || 'Hiring Company',
  createdAt: item.created_at || new Date().toISOString(),
});

// Helper to normalize complaint / inquiry objects
const normalizeComplaint = (c) => ({
  id: c.id,
  userId: c.user_id || c.userId || null,
  name: c.name || 'User',
  email: c.email || 'user@example.com',
  phone: c.phone || '',
  role: c.role || 'guest',
  category: c.category || 'General Support',
  subject: c.subject || 'Support Inquiry',
  message: c.message || '',
  status: c.status || 'Open',
  priority: c.priority || 'Normal',
  adminFeedback: c.admin_feedback || c.adminFeedback || null,
  adminName: c.admin?.name || 'Platform Administrator',
  repliedAt: c.replied_at || c.repliedAt || null,
  history: Array.isArray(c.history) ? c.history : (typeof c.history === 'string' ? parseList(c.history) : [
    {
      action: 'Submitted',
      actor: c.name || 'User',
      role: c.role || 'guest',
      email: c.email || 'user@example.com',
      message: c.message || '',
      timestamp: c.created_at || new Date().toISOString()
    }
  ]),
  createdAt: c.created_at || c.createdAt || new Date().toISOString(),
});


export function PlatformProvider({ children }) {
  const auth = useAuth();
  const currentUser = React.useMemo(() => sessionUser(auth.user), [auth.user]);
  const [listings, setListings] = useState([]);
  const [advertisements, setAdvertisements] = useState([]);
  const [applications, setApplications] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [payments, setPayments] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [boostPricing, setBoostPricingState] = useState(null);
  const [adPricing, setAdPricingState] = useState({ Sidebar: 9, Banner: 19, Premium: 29 });
  const [platformError, setPlatformError] = useState('');
  const [dataLoading, setDataLoading] = useState(true);
  const refreshVersion = useRef(0);

  useEffect(() => {
    const showError = event => setPlatformError(event.detail);
    window.addEventListener('jobconnect:api-error', showError);
    return () => window.removeEventListener('jobconnect:api-error', showError);
  }, []);

  const refreshPlatformData = async () => {
    const version = ++refreshVersion.current;
    const jobs = [
      [fetchJobs, setListings, normalizeListing],
      [fetchBoostPricing, setBoostPricingState, null],
      [fetchAdvertisements, setAdvertisements, normalizeAdvertisement],
      [async () => (await api.get('/api/settings/ad-pricing')).data, setAdPricingState, null],
      [async () => (await api.get('/api/categories')).data, setCategories, item => ({
        ...item, icon: item.icon || 'Briefcase', bg: 'bg-blue-50 text-blue-600',
        count: (item.listings_count || 0) + ' Jobs',
      })],
    ];
    if (currentUser) {
      jobs.push(
        [fetchApplications, setApplications, normalizeApplication],
        [fetchTasks, setTasks, normalizeTask],
        [fetchInterviews, setInterviews, normalizeInterview],
        [apiFetchComplaints, setComplaints, normalizeComplaint],
        [async () => (await api.get('/api/notifications')).data, setNotifications, item => ({
          ...item, role: 'all', read: Boolean(item.is_read), time: new Date(item.created_at).toLocaleString(),
        })],
      );
      if (currentUser.role === 'seeker') {
        jobs.push([async () => (await api.get('/api/saved-jobs')).data, setSavedJobIds, id => Number(id)]);
      } else {
        jobs.push([fetchPayments, setPayments, item => ({
          ...item, amount: Number(item.amount) || 0,
          itemType: item.item_type || item.type, itemTitle: item.reference_title || item.item_title || item.description,
          company: item.user?.name || currentUser?.companyName || '',
          date: item.created_at ? new Date(item.created_at).toLocaleDateString() : '',
          cardLast4: item.card_last4 || '', cardholder: item.cardholder || '',
        })]);
      }
    }
    await Promise.allSettled(jobs.map(async ([fetcher, setter, normalizer]) => {
      const response = await fetcher();
      if (version === refreshVersion.current) {
        setter(normalizer ? (response.data || []).map(normalizer) : response.data);
      }
    }));
    if (version === refreshVersion.current) setDataLoading(false);
  };

  useEffect(() => {
    setApplications([]); setTasks([]); setInterviews([]); setComplaints([]);
    setNotifications([]); setPayments([]); setSavedJobIds([]); setListings([]);
    setDataLoading(true);
    if (!auth.loading) refreshPlatformData();
    return () => { refreshVersion.current += 1; };
  }, [auth.loading, currentUser?.dbId]);

  useEffect(() => {
    if (auth.loading) return;
    const refresh = () => { if (!document.hidden) refreshPlatformData(); };
    const timer = window.setInterval(refresh, 60000);
    window.addEventListener('focus', refresh);
    return () => { window.clearInterval(timer); window.removeEventListener('focus', refresh); };
  }, [auth.loading, currentUser?.dbId]);

  const setCurrentUser = next => {
    const updated = typeof next === 'function' ? next(currentUser) : next;
    auth.setUser(updated ? { ...auth.user, ...updated, id: updated.dbId || auth.user?.id } : null);
  };
  const updateCurrentUserSession = partial => setCurrentUser({ ...currentUser, ...partial });
  const login = async (role, email, password) => {
    try {
      const authApi = await import('../lib/api/auth');
      const data = await authApi.login({ email, password, role: role === 'company' ? 'recruiter' : role });
      localStorage.setItem('auth_token', data.token);
      auth.setUser(data.user);
      setPlatformError('');
      return { success: true, user: sessionUser(data.user) };
    } catch (error) { return { success: false, message: errorMessage(error) }; }
  };
  const register = async (role, details) => {
    try {
      const authApi = await import('../lib/api/auth');
      const data = await authApi.register({
        name: details.name, email: details.email, password: details.password, company: details.company,
        password_confirmation: details.password, role: role === 'company' ? 'recruiter' : role,
      });
      localStorage.setItem('auth_token', data.token);
      auth.setUser(data.user);
      setPlatformError('');
      return { success: true, user: sessionUser(data.user) };
    } catch (error) { return { success: false, message: errorMessage(error) }; }
  };
  const logout = async () => {
    await auth.logout();
    for (const key of ['jobconnect_session', 'jobconnect_saved_jobs', 'jobconnect_notifications', 'jobconnect_complaints']) localStorage.removeItem(key);
  };
  const toggleSaveJob = async jobId => {
    if (currentUser?.role !== 'seeker') { setPlatformError('Sign in as a job seeker to save opportunities.'); return; }
    try {
      if (savedJobIds.includes(Number(jobId))) {
        await api.delete('/api/saved-jobs/' + jobId);
        setSavedJobIds(previous => previous.filter(id => id !== Number(jobId)));
      } else {
        await api.post('/api/saved-jobs', { listing_id: jobId });
        setSavedJobIds(previous => [...new Set([...previous, Number(jobId)])]);
      }
    } catch { /* The shared API error banner reports the failure. */ }
  };
  const listingPayload = listing => ({
    title: listing.title, company: listing.company || currentUser?.companyName,
    category_type: listing.categoryType || listing.category_type, category: listing.category,
    type: listing.type, work_model: listing.workModel || listing.work_model,
    location: listing.location, salary: listing.salary, experience: listing.experience,
    description: listing.description, requirements: listing.requirements, tags: listing.tags,
    logo: listing.logo, status: listing.status, featured: listing.featured,
  });
  const addListing = async listing => {
    const response = await createJob(listingPayload(listing));
    const created = normalizeListing(response.data);
    setListings(previous => [created, ...previous]);
    return created;
  };
  const updateListing = async (id, changes) => {
    const response = await apiUpdateJob(id, listingPayload(changes));
    const updated = normalizeListing(response.data);
    setListings(previous => replaceById(previous, updated));
    return { success: true, data: updated };
  };
  const deleteListing = async id => {
    await apiDeleteJob(id);
    setListings(previous => previous.filter(item => item.id !== id));
    return { success: true };
  };
  const applyToJob = async (id, details) => {
    let resumeUrl = details.resumeUrl;
    if (details.resumeFile instanceof File) resumeUrl = (await uploadResumeApi(details.resumeFile)).resume_url;
    if (!resumeUrl) throw new Error('Upload a resume before applying.');
    const response = await submitApplication({
      listing_id: id, candidate_name: details.candidateName, candidate_email: details.candidateEmail,
      candidate_phone: details.candidatePhone, cover_letter: details.pitch, resume_url: resumeUrl,
    });
    const created = normalizeApplication(response.data);
    setApplications(previous => [created, ...previous]);
    return { success: true, data: created };
  };
  const updateApplicationStage = async (id, status) => {
    const response = await updateApplicationStatus(id, { status });
    setApplications(previous => replaceById(previous, normalizeApplication(response.data)));
    return { success: true };
  };
  const assignTask = async details => {
    const response = await createTask({
      application_id: details.applicationId, title: details.title, description: details.description,
      instructions: details.instructions, attachment_name: details.attachmentName, deadline: details.deadline,
    });
    const created = normalizeTask(response.data);
    setTasks(previous => [created, ...previous]);
    await refreshPlatformData();
    return created;
  };
  const submitTask = async (id, notes, file) => {
    const data = new FormData();
    data.append('_method', 'PUT'); data.append('status', 'Submitted'); data.append('submission_notes', notes || '');
    if (file instanceof File) data.append('submission_file', file);
    const response = await api.post('/api/tasks/' + id, data, { headers: { 'Content-Type': 'multipart/form-data' } });
    setTasks(previous => replaceById(previous, normalizeTask(response.data.data)));
    await refreshPlatformData();
  };
  const scheduleInterview = async details => {
    const response = await createInterview({
      application_id: details.applicationId, title: details.title || 'Interview',
      date: details.date, time: details.time, timezone: details.timezone,
      platform: details.platform, type: ['In-Person', 'Phone'].includes(details.platform) ? details.platform : 'Video', meeting_link: details.meetingUrl, notes: details.notes,
    });
    const created = normalizeInterview(response.data);
    setInterviews(previous => [created, ...previous]);
    await refreshPlatformData();
    return created;
  };
  const respondInterview = async (id, status, responseNotes) => {
    const response = await apiUpdateInterview(id, { status, candidate_response: responseNotes });
    setInterviews(previous => replaceById(previous, normalizeInterview(response.data)));
    await refreshPlatformData();
  };
  const createAdvertisement = async details => {
    const response = await apiCreateAdvertisement({
      title: details.title, description: details.description, company: currentUser?.companyName,
      image_url: details.bannerUrl || details.imageUrl, target_url: details.websiteUrl,
      placement: details.placement, days: Number(details.days), payment_method: 'Demo',
    });
    const created = normalizeAdvertisement(response.data);
    setAdvertisements(previous => [created, ...previous]);
    return created;
  };
  const boostListing = async (id, days) => {
    const response = await apiBoostJob(id, { days, payment_method: 'Demo' });
    if (response.data) setListings(previous => replaceById(previous, normalizeListing(response.data)));
    await refreshPlatformData();
  };
  const cancelBoost = async id => { await apiCancelBoostJob(id); await refreshPlatformData(); };
  const recordPayment = () => { throw new Error('Payments can only be recorded by a verified payment provider.'); };
  const setBoostPricing = async pricing => {
    const response = await updateBoostPricingApi(pricing);
    setBoostPricingState(response.data || pricing);
  };
  const setAdPricing = async pricing => {
    const response = await api.post('/api/settings/ad-pricing', pricing);
    setAdPricingState(response.data.data);
  };
  const markNotificationRead = async id => {
    try {
      await api.put('/api/notifications/' + id, { is_read: true });
      setNotifications(previous => previous.map(item => item.id === id ? { ...item, read: true } : item));
    } catch { /* The shared API error banner reports the failure. */ }
  };
  const submitComplaint = async details => {
    const response = await submitContactInquiry(details);
    const created = normalizeComplaint(response.data);
    setComplaints(previous => [created, ...previous]);
    return { success: true, data: created };
  };
  const replyComplaint = async (id, feedback, status = 'Resolved', priority = 'Normal') => {
    const response = await apiReplyToComplaint(id, { feedback, status, priority });
    setComplaints(previous => replaceById(previous, normalizeComplaint(response.data)));
    return { success: true };
  };
  const updateComplaintStatus = async (id, status, priority = 'Normal', note = '') => {
    const response = await apiUpdateComplaintStatus(id, { status, priority, note });
    setComplaints(previous => replaceById(previous, normalizeComplaint(response.data)));
    return { success: true };
  };
  const saveCategory = async category => {
    const payload = { name: category.name, icon: category.icon };
    const response = category.id ? await api.put('/api/categories/' + category.id, payload) : await api.post('/api/categories', payload);
    await refreshPlatformData();
    return response.data;
  };
  const deleteCategory = async id => {
    await api.delete('/api/categories/' + id);
    setCategories(previous => previous.filter(item => item.id !== id));
  };
  const isCompanyListing = (listing, user = currentUser) => Boolean(listing && user && Number(listing.userId) === Number(user.dbId));
  const myListings = React.useMemo(() => listings.filter(item => isCompanyListing(item)), [listings, currentUser]);
  const isCompanyApplication = (application, user = currentUser, ownListings = myListings) =>
    Boolean(user && ownListings.some(listing => String(listing.id) === String(application.jobId)));
  const myApplications = React.useMemo(() => applications.filter(item => isCompanyApplication(item)), [applications, myListings, currentUser]);

  return (
    <PlatformContext.Provider value={{
      currentUser, setCurrentUser, updateCurrentUserSession, login, register, logout,
      listings, setListings, myListings, isCompanyListing, addListing, updateListing, deleteListing,
      boostListing, cancelBoost, advertisements, setAdvertisements, createAdvertisement,
      applications, setApplications, myApplications, isCompanyApplication, applyToJob, updateApplicationStage,
      tasks, setTasks, assignTask, submitTask, interviews, setInterviews, scheduleInterview, respondInterview,
      complaints, setComplaints, submitComplaint, replyComplaint, updateComplaintStatus,
      notifications, markNotificationRead, payments, setPayments, recordPayment,
      savedJobIds, toggleSaveJob, categories, setCategories, saveCategory, deleteCategory,
      boostPricing, setBoostPricing, adPricing, setAdPricing, refreshPlatformData, dataLoading,
    }}>
      {platformError && (
        <div role="alert" className="fixed bottom-4 left-4 right-4 z-[100] rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900 shadow-lg flex items-center justify-between gap-4">
          <span>{platformError}</span>
          <button type="button" onClick={() => setPlatformError('')} aria-label="Dismiss error" className="font-bold">Dismiss</button>
        </div>
      )}
      {children}
    </PlatformContext.Provider>
  );
}
export const usePlatform = () => useContext(PlatformContext);
