import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockJobs, mockApplications, mockApplicantsList, mockUsersList, mockCategories } from '../data/mockData';

const PlatformContext = createContext();

// Pre-defined User Accounts for Role Auth Validation
const defaultUsers = [
  { id: 'usr-1', name: 'Alex Vance', email: 'alex.vance@devmail.io', role: 'seeker', title: 'Senior Frontend Developer' },
  { id: 'usr-2', name: 'Stripe Talent Team', email: 'careers@stripe.com', role: 'recruiter', companyName: 'Stripe Global' },
  { id: 'usr-[recruiter-2]', name: 'Figma HR Team', email: 'hr@figma.com', role: 'recruiter', companyName: 'Figma Systems' },
  { id: 'usr-5', name: 'Platform Administrator', email: 'admin@jobconnect.com', role: 'admin' }
];

// Initial Mock Data Extensions
const initialListings = [
  ...mockJobs.map((job, idx) => ({
    ...job,
    categoryType: idx % 2 === 0 ? 'Job' : 'Job',
    featured: job.featured || false,
    boostedDays: job.featured ? 7 : 0,
    boostExpiry: job.featured ? '2026-08-05' : null,
  })),
  {
    id: 'intern-1',
    title: 'Full Stack Engineering Intern',
    company: 'Stripe Global',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
    location: 'San Francisco, CA (Hybrid)',
    category: 'Software Development',
    categoryType: 'Internship',
    type: 'Part-Time',
    workModel: 'Hybrid',
    salary: '$45 - $55 / hr',
    salaryMin: 90000,
    salaryMax: 110000,
    experience: 'Entry / Student',
    postedDate: '1 day ago',
    featured: true,
    urgent: true,
    tags: ['React', 'Node.js', 'TypeScript', 'Internship'],
    description: '12-week summer engineering internship with hands-on mentoring, shipping production code to millions of active users.',
    responsibilities: ['Build customer-facing React components', 'Participate in daily agile standups', 'Write unit tests using Jest'],
    requirements: ['Currently enrolled in CS or related degree', 'Proficiency in JavaScript/TypeScript', 'Passion for web development'],
    companyInfo: { about: 'Stripe builds financial infrastructure for the web.', size: '5,000+ employees', founded: '2010', website: 'https://stripe.com' }
  },
  {
    id: 'intern-2',
    title: 'UI/UX Design Intern (Summer 2026)',
    company: 'Figma Systems',
    logo: 'https://images.unsplash.com/photo-1614680376593-902f749f7fdc?auto=format&fit=crop&w=120&q=80',
    location: 'Remote (US/Canada)',
    category: 'UI/UX & Product Design',
    categoryType: 'Internship',
    type: 'Part-Time',
    workModel: 'Remote',
    salary: '$40 - $50 / hr',
    salaryMin: 80000,
    salaryMax: 100000,
    experience: 'Entry / Student',
    postedDate: '3 days ago',
    featured: false,
    urgent: false,
    tags: ['Figma', 'Prototyping', 'Design Systems', 'Internship'],
    description: 'Work closely with Figma product designers to prototype next-generation collaborative canvas features.',
    responsibilities: ['Assist in design system component updates', 'Conduct user interviews', 'Create wireframes and interactive prototypes'],
    requirements: ['Portfolio showcasing UI/UX projects', 'Proficiency with Figma', 'Strong eye for typography and layout'],
    companyInfo: { about: 'Figma helps teams create and ship better designs.', size: '1,200+ employees', founded: '2012', website: 'https://figma.com' }
  }
];

const initialAdvertisements = [
  {
    id: 'ad-101',
    company: 'Stripe Global',
    title: 'Build the Future of Internet Commerce',
    description: 'Join our world-class engineering team and power financial infrastructure worldwide.',
    bannerUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
    websiteUrl: 'https://stripe.com/careers',
    startDate: '2026-07-20',
    endDate: '2026-08-20',
    days: 30,
    cost: 450,
    status: 'Active'
  },
  {
    id: 'ad-102',
    company: 'Figma Systems',
    title: 'Figma Config 2026 Global Design Conference',
    description: 'Register now for early bird tickets to the biggest global design event of the year!',
    bannerUrl: 'https://images.unsplash.com/photo-1542744094-3a317272018a?auto=format&fit=crop&w=800&q=80',
    websiteUrl: 'https://config.figma.com',
    startDate: '2026-07-15',
    endDate: '2026-08-15',
    days: 30,
    cost: 450,
    status: 'Active'
  }
];

const initialApplicationsExtended = [
  {
    id: 'app-101',
    jobId: 'job-1',
    jobTitle: 'Senior Frontend Engineer (React/TypeScript)',
    candidateName: 'Alex Vance',
    candidateEmail: 'alex.vance@devmail.io',
    company: 'Stripe Global',
    appliedDate: '2026-07-20',
    stage: 'Interview Scheduled',
    salary: '$165,000 - $195,000',
    matchScore: 96,
    notes: 'Technical screen passed with flying colors. Onsite Zoom interview scheduled.'
  },
  {
    id: 'app-102',
    jobId: 'job-2',
    jobTitle: 'Lead UI/UX Product Designer',
    candidateName: 'Elena Rostova',
    candidateEmail: 'elena.rostova@design.io',
    company: 'Figma Systems',
    appliedDate: '2026-07-21',
    stage: 'Task Assignment',
    salary: '$150,000 - $180,000',
    matchScore: 91,
    notes: 'Design exercise task assigned with deadline July 30th.'
  },
  {
    id: 'app-103',
    jobId: 'job-3',
    jobTitle: 'Senior Data Scientist (LLMs & Search)',
    candidateName: 'Marcus Chen',
    candidateEmail: 'marcus.chen@cloud.dev',
    company: 'Anthropic Labs',
    appliedDate: '2026-07-19',
    stage: 'Under Review',
    salary: '$190,000 - $240,000',
    matchScore: 94,
    notes: 'Resume under review by hiring manager.'
  }
];

const initialTasks = [
  {
    id: 'task-201',
    appId: 'app-102',
    jobTitle: 'Lead UI/UX Product Designer',
    company: 'Figma Systems',
    candidateName: 'Elena Rostova',
    candidateEmail: 'elena.rostova@design.io',
    title: 'Interactive Design Tokens Micro-App',
    description: 'Design a high-fidelity interactive component for managing color token hierarchies in Figma.',
    instructions: 'Create a Figma file or HTML demo showcasing interactive token states, light/dark mode variations, and WCAG contrast indicators.',
    attachmentName: 'Figma_Design_Token_Prompt.pdf',
    deadline: '2026-07-30T23:59:59',
    maxMarks: 100,
    status: 'Pending Submission',
    submittedAt: null,
    responseNotes: '',
    responseFile: null,
    score: null
  }
];

const initialInterviews = [
  {
    id: 'int-301',
    appId: 'app-101',
    jobTitle: 'Senior Frontend Engineer (React/TypeScript)',
    company: 'Stripe Global',
    candidateName: 'Alex Vance',
    candidateEmail: 'alex.vance@devmail.io',
    date: '2026-07-28',
    time: '14:00',
    timezone: 'PST (UTC-8)',
    platform: 'Zoom Link',
    meetingUrl: 'https://zoom.us/j/9876543210',
    notes: 'Focus on System Architecture, State Management, and Frontend Performance optimizations.',
    status: 'Scheduled'
  }
];

const initialNotifications = [
  {
    id: 'notif-1',
    role: 'seeker',
    title: 'Interview Scheduled!',
    message: 'Stripe Global has scheduled your Technical Interview for July 28th at 2:00 PM PST via Zoom.',
    time: '2 hours ago',
    read: false,
    type: 'interview'
  },
  {
    id: 'notif-2',
    role: 'seeker',
    title: 'Task Assigned',
    message: 'Figma Systems assigned a new Design Assessment task with deadline July 30th.',
    time: '1 day ago',
    read: false,
    type: 'task'
  },
  {
    id: 'notif-3',
    role: 'recruiter',
    title: 'New Application Received',
    message: 'Alex Vance applied for Senior Frontend Engineer (React/TypeScript).',
    time: '3 hours ago',
    read: false,
    type: 'application'
  },
  {
    id: 'notif-4',
    role: 'admin',
    title: 'Payment Received ($169)',
    message: 'Stripe Global purchased a 30-Day Featured Job Boost.',
    time: '5 hours ago',
    read: false,
    type: 'payment'
  }
];

const initialPayments = [
  {
    id: 'pay-501',
    company: 'Stripe Global',
    itemType: 'Job Boost (30 Days)',
    itemTitle: 'Senior Frontend Engineer (React/TypeScript)',
    amount: 169,
    cardLast4: '4242',
    cardholder: 'Stripe Talent HR',
    date: '2026-07-24',
    status: 'Completed'
  },
  {
    id: 'pay-502',
    company: 'Figma Systems',
    itemType: 'Company Advertisement (30 Days)',
    itemTitle: 'Figma Config 2026 Global Design Conference',
    amount: 450,
    cardLast4: '8888',
    cardholder: 'Figma Marketing',
    date: '2026-07-20',
    status: 'Completed'
  }
];

export function PlatformProvider({ children }) {
  // Session State (persisted in localStorage)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedSession = localStorage.getItem('jobconnect_session');
      return savedSession ? JSON.parse(savedSession) : null;
    } catch {
      return null;
    }
  });

  const [listings, setListings] = useState(initialListings);
  const [advertisements, setAdvertisements] = useState(initialAdvertisements);
  const [applications, setApplications] = useState(initialApplicationsExtended);
  const [tasks, setTasks] = useState(initialTasks);
  const [interviews, setInterviews] = useState(initialInterviews);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [payments, setPayments] = useState(initialPayments);

  const [boostPricing, setBoostPricing] = useState({
    day3: 29,
    day7: 59,
    day15: 99,
    day30: 169,
    customPerDay: 6
  });

  const [adPricing, setAdPricing] = useState({
    perDay: 15,
    minimumDays: 7
  });

  // Sync session with localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('jobconnect_session', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('jobconnect_session');
    }
  }, [currentUser]);

  // Authenticate User with Role Enforcement
  const login = (role, email, password) => {
    // Check if email matches predefined users
    const matched = defaultUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (matched) {
      if (matched.role !== role) {
        return { success: false, message: `Access Denied: Account '${email}' belongs to the ${matched.role.toUpperCase()} role, not ${role.toUpperCase()}.` };
      }
      setCurrentUser(matched);
      return { success: true, user: matched };
    }

    // Fallback account creation for custom email
    const newUser = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0].replace('.', ' '),
      email,
      role,
      companyName: role === 'recruiter' ? 'Enterprise Employer' : null
    };

    setCurrentUser(newUser);
    return { success: true, user: newUser };
  };

  // Register User
  const register = (role, userData) => {
    if (role === 'admin') {
      return { success: false, message: 'Public registration is disabled for Website Management Admin accounts.' };
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name: userData.name || 'New User',
      email: userData.email,
      role,
      companyName: role === 'recruiter' ? (userData.company || 'New Employer') : null
    };

    setCurrentUser(newUser);
    return { success: true, user: newUser };
  };

  // Logout
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('jobconnect_session');
  };

  // Helper Functions

  const addListing = (newPosting) => {
    const company = currentUser?.companyName || 'Stripe Global';
    const created = {
      id: `post-${Date.now()}`,
      company,
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
      postedDate: 'Just now',
      featured: newPosting.isBoosted || false,
      boostedDays: newPosting.boostDays || 0,
      boostExpiry: newPosting.isBoosted ? '2026-08-25' : null,
      companyInfo: { about: 'Verified Employer Company', size: '5,000+ employees', founded: '2010', website: 'https://stripe.com' },
      ...newPosting
    };
    setListings(prev => [created, ...prev]);

    addNotification({
      role: 'admin',
      title: `New ${newPosting.categoryType} Posted`,
      message: `${company} posted "${newPosting.title}"`,
      type: 'moderation'
    });

    return created;
  };

  const boostListing = (listingId, durationDays, cost, paymentDetails) => {
    setListings(prev => prev.map(item => {
      if (item.id === listingId) {
        return {
          ...item,
          featured: true,
          boostedDays: durationDays,
          boostExpiry: `2026-08-${25 + Number(durationDays)}`
        };
      }
      return item;
    }));

    const payment = {
      id: `pay-${Date.now()}`,
      company: currentUser?.companyName || paymentDetails.company || 'Stripe Global',
      itemType: `Job Boost (${durationDays} Days)`,
      itemTitle: paymentDetails.title || 'Boosted Listing',
      amount: cost,
      cardLast4: paymentDetails.cardNumber ? paymentDetails.cardNumber.slice(-4) : '4242',
      cardholder: paymentDetails.cardholder || 'Company HR',
      date: new Date().toISOString().split('T')[0],
      status: 'Completed'
    };
    setPayments(prev => [payment, ...prev]);

    addNotification({
      role: 'recruiter',
      title: 'Post Boost Activated!',
      message: `Your listing has been boosted for ${durationDays} days.`,
      type: 'payment'
    });
  };

  const createAdvertisement = (adData, durationDays, cost, paymentDetails) => {
    const company = currentUser?.companyName || paymentDetails.company || 'Stripe Global';
    const newAd = {
      id: `ad-${Date.now()}`,
      company,
      title: adData.title,
      description: adData.description,
      bannerUrl: adData.bannerUrl || 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
      websiteUrl: adData.websiteUrl,
      startDate: adData.startDate || new Date().toISOString().split('T')[0],
      endDate: adData.endDate || '2026-08-30',
      days: durationDays,
      cost: cost,
      status: 'Active'
    };

    setAdvertisements(prev => [newAd, ...prev]);

    const payment = {
      id: `pay-${Date.now()}`,
      company,
      itemType: `Company Advertisement (${durationDays} Days)`,
      itemTitle: adData.title,
      amount: cost,
      cardLast4: paymentDetails.cardNumber ? paymentDetails.cardNumber.slice(-4) : '4242',
      cardholder: paymentDetails.cardholder || 'Marketing Lead',
      date: new Date().toISOString().split('T')[0],
      status: 'Completed'
    };
    setPayments(prev => [payment, ...prev]);

    addNotification({
      role: 'recruiter',
      title: 'Advertisement Campaign Published',
      message: `"${adData.title}" is live for ${durationDays} display days.`,
      type: 'advertisement'
    });
  };

  const updateApplicationStage = (appId, newStage, note = '') => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return { ...app, stage: newStage, notes: note || app.notes };
      }
      return app;
    }));

    addNotification({
      role: 'seeker',
      title: `Application Status: ${newStage}`,
      message: `Your application status for "${newStage}" has been updated by the employer.`,
      type: 'application'
    });
  };

  const assignTask = (taskData) => {
    const newTask = {
      id: `task-${Date.now()}`,
      status: 'Pending Submission',
      submittedAt: null,
      responseNotes: '',
      responseFile: null,
      score: null,
      ...taskData
    };
    setTasks(prev => [newTask, ...prev]);

    if (taskData.appId) {
      updateApplicationStage(taskData.appId, 'Task Assignment', `Assigned Task: ${taskData.title}`);
    }

    addNotification({
      role: 'seeker',
      title: 'New Task Assigned!',
      message: `Employer assigned "${taskData.title}". Deadline: ${taskData.deadline}`,
      type: 'task'
    });
  };

  const submitTask = (taskId, responseNotes, fileObject) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: 'Submitted',
          submittedAt: new Date().toISOString(),
          responseNotes,
          responseFile: fileObject?.name || 'Task_Submission_Solution.pdf'
        };
      }
      return t;
    }));

    const targetTask = tasks.find(t => t.id === taskId);
    if (targetTask && targetTask.appId) {
      updateApplicationStage(targetTask.appId, 'Task Submitted', 'Candidate submitted task response.');
    }

    addNotification({
      role: 'recruiter',
      title: 'Task Submitted by Candidate',
      message: `${targetTask?.candidateName || 'Candidate'} submitted solutions for "${targetTask?.title}".`,
      type: 'task'
    });
  };

  const scheduleInterview = (interviewData) => {
    const newInt = {
      id: `int-${Date.now()}`,
      status: 'Scheduled',
      ...interviewData
    };
    setInterviews(prev => [newInt, ...prev]);

    if (interviewData.appId) {
      updateApplicationStage(interviewData.appId, 'Interview Scheduled', `Interview scheduled for ${interviewData.date} at ${interviewData.time}`);
    }

    addNotification({
      role: 'seeker',
      title: 'Interview Scheduled',
      message: `${interviewData.company} scheduled interview on ${interviewData.date} at ${interviewData.time} ${interviewData.timezone}. Link: ${interviewData.meetingUrl}`,
      type: 'interview'
    });
  };

  const addNotification = (notif) => {
    const item = {
      id: `notif-${Date.now()}`,
      time: 'Just now',
      read: false,
      ...notif
    };
    setNotifications(prev => [item, ...prev]);
  };

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <PlatformContext.Provider value={{
      currentUser,
      login,
      register,
      logout,
      listings,
      advertisements,
      applications,
      tasks,
      interviews,
      notifications,
      payments,
      boostPricing,
      setBoostPricing,
      adPricing,
      setAdPricing,
      addListing,
      boostListing,
      createAdvertisement,
      updateApplicationStage,
      assignTask,
      submitTask,
      scheduleInterview,
      addNotification,
      markNotificationRead
    }}>
      {children}
    </PlatformContext.Provider>
  );
}

export function usePlatform() {
  return useContext(PlatformContext);
}
