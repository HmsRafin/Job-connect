export const mockCategories = [
  { id: 'tech', name: 'Software Development', count: '1,420 Jobs', icon: 'Code', bg: 'bg-blue-50 text-blue-600' },
  { id: 'design', name: 'UI/UX & Product Design', count: '850 Jobs', icon: 'Palette', bg: 'bg-indigo-50 text-indigo-600' },
  { id: 'finance', name: 'Finance & Banking', count: '630 Jobs', icon: 'TrendingUp', bg: 'bg-emerald-50 text-emerald-600' },
  { id: 'marketing', name: 'Digital Marketing', count: '940 Jobs', icon: 'Megaphone', bg: 'bg-amber-50 text-amber-600' },
  { id: 'data', name: 'Data Science & AI', count: '710 Jobs', icon: 'Cpu', bg: 'bg-purple-50 text-purple-600' },
  { id: 'management', name: 'Product Management', count: '520 Jobs', icon: 'Briefcase', bg: 'bg-teal-50 text-teal-600' },
  { id: 'sales', name: 'Sales & Business Dev', count: '1,100 Jobs', icon: 'Target', bg: 'bg-rose-50 text-rose-600' },
  { id: 'hr', name: 'Human Resources', count: '390 Jobs', icon: 'Users', bg: 'bg-cyan-50 text-cyan-600' },
];

export const mockJobs = [
  {
    id: 'job-1',
    title: 'Senior Frontend Engineer (React/TypeScript)',
    company: 'Stripe Global',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
    location: 'San Francisco, CA (Hybrid)',
    category: 'Software Development',
    type: 'Full-Time',
    workModel: 'Hybrid',
    salary: '$165,000 - $195,000',
    salaryMin: 165000,
    salaryMax: 195000,
    experience: 'Senior (5+ yrs)',
    postedDate: '2 days ago',
    featured: true,
    urgent: true,
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'GraphQL'],
    description: 'We are looking for an exceptional Senior Frontend Engineer to build high-performance financial interfaces, payment widgets, and global dashboard features powering millions of transactions daily.',
    responsibilities: [
      'Architect and scale user-facing web applications utilizing React 18+ and Next.js framework.',
      'Collaborate closely with Product Designers to refine design systems and component micro-interactions.',
      'Optimize web performance, accessibility (WCAG 2.1 AA), and core web vitals.',
      'Mentor mid-level developers and participate in design system governance.'
    ],
    requirements: [
      '5+ years building production-grade web applications in React and TypeScript.',
      'Strong expertise in modern CSS architectures, Tailwind CSS, and state management.',
      'Demonstrated experience with automated testing (Jest, Cypress/Playwright).',
      'Solid grasp of HTTP protocols, RESTful APIs, and GraphQL schemas.'
    ],
    companyInfo: {
      about: 'Stripe is a technology company that builds economic infrastructure for the internet. Businesses of every size use our software to accept payments and manage their operations online.',
      size: '5,000+ employees',
      founded: '2010',
      website: 'https://stripe.com'
    }
  },
  {
    id: 'job-2',
    title: 'Lead UI/UX Product Designer',
    company: 'Figma Systems',
    logo: 'https://images.unsplash.com/photo-1614680376593-902f749f7fdc?auto=format&fit=crop&w=120&q=80',
    location: 'Remote (US/Canada)',
    category: 'UI/UX & Product Design',
    type: 'Full-Time',
    workModel: 'Remote',
    salary: '$150,000 - $180,000',
    salaryMin: 150000,
    salaryMax: 180000,
    experience: 'Lead (7+ yrs)',
    postedDate: '1 day ago',
    featured: true,
    urgent: false,
    tags: ['Figma', 'Design Systems', 'Prototyping', 'User Research'],
    description: 'Join Figma as a Lead Product Designer to shape the next frontier of multiplayer design tools, design tokens, and real-time collaboration widgets.',
    responsibilities: [
      'Lead end-to-end design initiatives from user discovery through high-fidelity visual design.',
      'Establish interactive component libraries and cross-platform design guidelines.',
      'Partner with Engineering leadership to ensure seamless design handoff and design quality.'
    ],
    requirements: [
      '7+ years of experience designing SaaS product interfaces.',
      'World-class portfolio demonstrating interactive prototyping and system thinking.',
      'Deep mastery of Figma, motion design tools, and accessibility standards.'
    ],
    companyInfo: {
      about: 'Figma helps teams create, test, and ship better designs from start to finish.',
      size: '1,200+ employees',
      founded: '2012',
      website: 'https://figma.com'
    }
  },
  {
    id: 'job-3',
    title: 'Senior Data Scientist (LLMs & Search)',
    company: 'Anthropic Labs',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
    location: 'New York, NY (On-site)',
    category: 'Data Science & AI',
    type: 'Full-Time',
    workModel: 'On-site',
    salary: '$190,000 - $240,000',
    salaryMin: 190000,
    salaryMax: 240000,
    experience: 'Senior (4+ yrs)',
    postedDate: '3 days ago',
    featured: true,
    urgent: true,
    tags: ['Python', 'PyTorch', 'LLMs', 'Vector DBs', 'RAG'],
    description: 'Help build state-of-the-art semantic search models, retrieval algorithms, and alignment pipelines for enterprise AI assistants.',
    responsibilities: [
      'Develop RAG architectures and evaluate embedding models on multi-modal datasets.',
      'Deploy low-latency inferencing microservices using PyTorch and vLLM.',
      'Conduct empirical research on model hallucination reduction and context window scaling.'
    ],
    requirements: [
      'MS or PhD in CS, Statistics, or Machine Learning.',
      'Proven track record scaling transformer-based models in production.',
      'Proficiency with Python, CUDA, PyTorch, and distributed training setups.'
    ],
    companyInfo: {
      about: 'Anthropic is an AI safety and research company working to build reliable, beneficial AI systems.',
      size: '500+ employees',
      founded: '2021',
      website: 'https://anthropic.com'
    }
  },
  {
    id: 'job-4',
    title: 'Principal DevOps & Cloud Architect',
    company: 'Datadog Platforms',
    logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&q=80',
    location: 'Austin, TX (Hybrid)',
    category: 'Software Development',
    type: 'Full-Time',
    workModel: 'Hybrid',
    salary: '$175,000 - $210,000',
    salaryMin: 175000,
    salaryMax: 210000,
    experience: 'Principal (8+ yrs)',
    postedDate: 'Just now',
    featured: false,
    urgent: true,
    tags: ['Kubernetes', 'AWS', 'Terraform', 'Go', 'Prometheus'],
    description: 'Architect auto-scaling multi-region infrastructure and zero-trust Kubernetes clusters handling tens of billions of metric events per hour.',
    responsibilities: [
      'Own infrastructure as code using Terraform and GitOps methodology.',
      'Enhance incident response automation and multi-region failover architecture.'
    ],
    requirements: [
      '8+ years managing cloud infrastructure on AWS/GCP at hyper scale.',
      'Expert knowledge of Kubernetes internal networking, CNI plugins, and eBPF.'
    ],
    companyInfo: {
      about: 'Datadog is the monitoring and security platform for cloud applications.',
      size: '4,000+ employees',
      founded: '2010',
      website: 'https://datadoghq.com'
    }
  },
  {
    id: 'job-5',
    title: 'Product Growth Manager',
    company: 'Notion Workspace',
    logo: 'https://images.unsplash.com/photo-1614680376593-902f749f7fdc?auto=format&fit=crop&w=120&q=80',
    location: 'Remote (Worldwide)',
    category: 'Product Management',
    type: 'Full-Time',
    workModel: 'Remote',
    salary: '$140,000 - $170,000',
    salaryMin: 140000,
    salaryMax: 170000,
    experience: 'Mid-Level (3+ yrs)',
    postedDate: '4 days ago',
    featured: false,
    urgent: false,
    tags: ['Growth', 'A/B Testing', 'Product Analytics', 'SQL'],
    description: 'Drive end-to-end self-serve acquisition loops, viral invitation mechanics, and premium conversion funnels across desktop and mobile.',
    responsibilities: [
      'Formulate growth hypotheses and execute rapid A/B experimentation programs.',
      'Analyze churn metrics, onboarding drop-offs, and paywall interactions.'
    ],
    requirements: [
      '3+ years experience leading PLG (Product-Led Growth) initiatives.',
      'Advanced proficiency in SQL, Amplitude, Mixpanel, and statistical modeling.'
    ],
    companyInfo: {
      about: 'Notion is the all-in-one workspace for notes, docs, wikis, and projects.',
      size: '800+ employees',
      founded: '2016',
      website: 'https://notion.so'
    }
  },
  {
    id: 'job-6',
    title: 'Fintech Senior Financial Analyst',
    company: 'Revolut Pay',
    logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&q=80',
    location: 'London, UK / Remote',
    category: 'Finance & Banking',
    type: 'Full-Time',
    workModel: 'Hybrid',
    salary: '$120,000 - $145,000',
    salaryMin: 120000,
    salaryMax: 145000,
    experience: 'Mid-Level (4+ yrs)',
    postedDate: '5 days ago',
    featured: false,
    urgent: false,
    tags: ['Financial Modeling', 'SQL', 'Treasury', 'Risk Analysis'],
    description: 'Oversee liquidity reporting, revenue forecasting, and cross-border currency corridor margins for global consumer banking expansion.',
    responsibilities: ['Build dynamic multi-currency FP&A models.', 'Perform treasury liquidity risk assessments.'],
    requirements: ['CFA/CPA or BS in Finance/Economics.', 'Solid mastery of SQL and financial modeling.'],
    companyInfo: { about: 'Revolut is building the world’s first global financial superapp.', size: '7,000+ employees', founded: '2015', website: 'https://revolut.com' }
  }
];

export const mockStats = {
  activeJobs: '12,450+',
  totalCompanies: '850+',
  successfulPlacements: '45,200+',
  avgSalaryGrowth: '+28%',
  seekerAppliedCount: 14,
  seekerInterviewsCount: 3,
  seekerSavedCount: 8,
  recruiterActivePostings: 5,
  recruiterTotalApplicants: 128,
  adminTotalUsers: '24,890',
  adminPlatformHealth: '99.98%'
};

export const mockApplications = [
  {
    id: 'app-101',
    jobTitle: 'Senior Frontend Engineer (React/TypeScript)',
    company: 'Stripe Global',
    location: 'San Francisco, CA (Hybrid)',
    appliedDate: '2026-07-20',
    status: 'Interviewing',
    salary: '$165,000 - $195,000',
    notes: 'Technical screen completed with Senior Engineering Manager. Onsite scheduled for next Tuesday.'
  },
  {
    id: 'app-102',
    jobTitle: 'Lead UI/UX Product Designer',
    company: 'Figma Systems',
    location: 'Remote (US/Canada)',
    appliedDate: '2026-07-18',
    status: 'Pending',
    salary: '$150,000 - $180,000',
    notes: 'Application reviewed by Talent Acquisition team.'
  },
  {
    id: 'app-103',
    jobTitle: 'Full Stack Engineer',
    company: 'Vercel Inc.',
    location: 'Remote',
    appliedDate: '2026-07-10',
    status: 'Accepted',
    salary: '$160,000 - $185,000',
    notes: 'Official offer letter received and acknowledged.'
  },
  {
    id: 'app-104',
    jobTitle: 'Staff Frontend Architect',
    company: 'Airbnb',
    location: 'San Jose, CA',
    appliedDate: '2026-06-28',
    status: 'Rejected',
    salary: '$200,000 - $230,000',
    notes: 'Role filled internally.'
  }
];

export const mockApplicantsList = [
  {
    id: 'cand-1',
    name: 'Alex Vance',
    role: 'Senior React Developer',
    experience: '6 Years',
    location: 'San Francisco, CA',
    appliedJob: 'Senior Frontend Engineer (React/TypeScript)',
    appliedDate: '2026-07-22',
    status: 'Interviewing',
    matchScore: '96%',
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Redux Toolkit'],
    resumeFile: 'Alex_Vance_Resume_Frontend.pdf',
    bio: 'Passionate frontend engineer with 6+ years experience architecting scalable SaaS applications, improving core web vitals, and maintaining complex design systems.'
  },
  {
    id: 'cand-2',
    name: 'Elena Rostova',
    role: 'Product Designer',
    experience: '5 Years',
    location: 'Austin, TX',
    appliedJob: 'Lead UI/UX Product Designer',
    appliedDate: '2026-07-21',
    status: 'Pending',
    matchScore: '91%',
    skills: ['Figma', 'User Research', 'Design Systems', 'Micro-interactions'],
    resumeFile: 'Elena_Rostova_Design_Portfolio.pdf',
    bio: 'Product Designer dedicated to creating seamless human-computer interfaces with hyper-focus on accessibility and interactive visual design.'
  },
  {
    id: 'cand-3',
    name: 'Marcus Chen',
    role: 'DevOps & Cloud Engineer',
    experience: '8 Years',
    location: 'Seattle, WA',
    appliedJob: 'Principal DevOps & Cloud Architect',
    appliedDate: '2026-07-19',
    status: 'Accepted',
    matchScore: '98%',
    skills: ['Kubernetes', 'AWS', 'Terraform', 'Prometheus', 'Docker'],
    resumeFile: 'Marcus_Chen_Cloud_Architect.pdf',
    bio: 'Cloud Architect with deep expertise in infrastructure automation, zero-trust container security, and high-availability multi-region cluster deployments.'
  }
];

export const mockUsersList = [
  { id: 'usr-1', name: 'Sarah Jenkins', email: 'sarah.j@gmail.com', role: 'Job Seeker', status: 'Active', joined: 'Jan 2026', totalApps: 14 },
  { id: 'usr-2', name: 'Stripe Talent Team', email: 'careers@stripe.com', role: 'Recruiter', status: 'Active', joined: 'Nov 2025', totalJobs: 8 },
  { id: 'usr-3', name: 'David Miller', email: 'david.m@cybersec.io', role: 'Job Seeker', status: 'Suspended', joined: 'Feb 2026', totalApps: 2 },
  { id: 'usr-4', name: 'Figma Recruitment', email: 'hr@figma.com', role: 'Recruiter', status: 'Active', joined: 'Aug 2025', totalJobs: 12 },
  { id: 'usr-5', name: 'Antigravity Admin', email: 'admin@jobconnect.com', role: 'Admin', status: 'Active', joined: 'Jan 2025', totalJobs: 0 }
];

export const mockJobModerationQueue = [
  { id: 'mod-1', title: 'Senior Blockchain Auditor', company: 'Defi Protocol X', category: 'Finance', status: 'Pending Review', submittedBy: 'crypto.recruiter@defi.io', date: '2026-07-24' },
  { id: 'mod-2', title: 'AI Ethics & Policy Researcher', company: 'Open Cognitive Foundation', category: 'Data Science & AI', status: 'Approved', submittedBy: 'policy@opencognitive.org', date: '2026-07-23' },
  { id: 'mod-3', title: 'Unreal Engine 5 Graphics Programmer', company: 'Apex Game Studio', category: 'Software Development', status: 'Pending Review', submittedBy: 'jobs@apexstudios.com', date: '2026-07-24' }
];

export const mockSeekerProfile = {
  name: 'Alex Vance',
  title: 'Senior Frontend & UI Engineer',
  email: 'alex.vance@devmail.io',
  phone: '+1 (555) 234-5678',
  location: 'San Francisco, CA',
  bio: 'Full-stack leaning frontend software engineer specializing in React, Next.js, and modern CSS architecture. Passionate about design systems, performance, and developer tooling.',
  website: 'https://alexvance.dev',
  github: 'github.com/alexvance',
  linkedin: 'linkedin.com/in/alexvance',
  skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'GraphQL', 'Jest', 'Vite'],
  resume: {
    fileName: 'Alex_Vance_Resume_2026.pdf',
    fileSize: '1.4 MB',
    uploadedAt: 'July 15, 2026'
  },
  experience: [
    {
      company: 'Vercel Labs',
      role: 'Senior UI Engineer',
      period: '2023 - Present',
      description: 'Built core UI components for Vercel Analytics dashboard. Reduced bundle size by 32%.'
    },
    {
      company: 'Shopify Core',
      role: 'Frontend Developer',
      period: '2020 - 2023',
      description: 'Maintained merchant checkout widgets used by over 500k e-commerce stores.'
    }
  ]
};
