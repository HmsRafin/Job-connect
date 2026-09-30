import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Middlewares / Route Guards
import { RoleMiddleware, GuestMiddleware } from './middlewares';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AuthLayout from './layouts/AuthLayout';
import SeekerLayout from './layouts/SeekerLayout';
import RecruiterLayout from './layouts/RecruiterLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/public/Home';
import Jobs from './pages/public/Jobs';
import JobDetail from './pages/public/JobDetail';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Workflow from './pages/public/Workflow';
import AccessDenied from './pages/public/AccessDenied';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminLogin from './pages/auth/AdminLogin';

// Seeker Pages
import SeekerDashboard from './pages/seeker/SeekerDashboard';
import ProfileCV from './pages/seeker/ProfileCV';
import MyApplications from './pages/seeker/MyApplications';
import AssignedTasks from './pages/seeker/AssignedTasks';
import ScheduledInterviews from './pages/seeker/ScheduledInterviews';
import SavedOpportunities from './pages/seeker/SavedOpportunities';
import SeekerNotifications from './pages/seeker/SeekerNotifications';

// Recruiter Pages
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import CompanyProfile from './pages/recruiter/CompanyProfile';
import MyJobPosts from './pages/recruiter/MyJobPosts';
import PostJob from './pages/recruiter/PostJob';
import ManageApplicants from './pages/recruiter/ManageApplicants';
import RecruiterPipeline from './pages/recruiter/RecruiterPipeline';
import TaskManagement from './pages/recruiter/TaskManagement';
import InterviewManagement from './pages/recruiter/InterviewManagement';
import BoostedPosts from './pages/recruiter/BoostedPosts';
import RecruiterPayments from './pages/recruiter/RecruiterPayments';
import CompanyAdvertisements from './pages/recruiter/CompanyAdvertisements';
import AdPricing from './pages/admin/AdPricing';
import AdminAdvertisements from './pages/admin/AdminAdvertisements';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ComplainBox from './pages/admin/ComplainBox';
import UserManagement from './pages/admin/UserManagement';
import JobModeration from './pages/admin/JobModeration';
import CategoryManagement from './pages/admin/CategoryManagement';
import FeaturedBoostedPosts from './pages/admin/FeaturedBoostedPosts';
import BoostPricing from './pages/admin/BoostPricing';
import AdminPayments from './pages/admin/AdminPayments';
import AdminSettings from './pages/admin/AdminSettings';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* 1. Public & Guest Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="jobs/:id" element={<JobDetail />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="workflow" element={<Workflow />} />
          <Route path="access-denied" element={<AccessDenied />} />
        </Route>

        {/* 2. Authentication Routes (Guarded: Guests Only) */}
        <Route path="/" element={<AuthLayout />}>
          <Route path="login" element={<GuestMiddleware><Login /></GuestMiddleware>} />
          <Route path="register" element={<GuestMiddleware><Register /></GuestMiddleware>} />
        </Route>

        {/* Dedicated Separate Admin Login Route */}
        <Route path="/admin/login" element={<GuestMiddleware><AdminLogin /></GuestMiddleware>} />

        {/* 3. Job Seeker Dashboard Routes (Protected: Seeker Role Only) */}
        <Route 
          path="/seeker" 
          element={
            <RoleMiddleware allowedRoles={['seeker']}>
              <SeekerLayout />
            </RoleMiddleware>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<SeekerDashboard />} />
          <Route path="profile" element={<ProfileCV />} />
          <Route path="applications" element={<MyApplications />} />
          <Route path="tasks" element={<AssignedTasks />} />
          <Route path="interviews" element={<ScheduledInterviews />} />
          <Route path="saved" element={<SavedOpportunities />} />
          <Route path="notifications" element={<SeekerNotifications />} />
          <Route path="settings" element={<SeekerDashboard />} />
        </Route>

        {/* 4. Hiring Company / Employer Console Routes (Protected: Recruiter / Company Role Only) */}
        <Route 
          path="/recruiter" 
          element={
            <RoleMiddleware allowedRoles={['recruiter', 'company']}>
              <RecruiterLayout />
            </RoleMiddleware>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<RecruiterDashboard />} />
          <Route path="profile" element={<CompanyProfile />} />
          <Route path="jobs" element={<MyJobPosts />} />
          <Route path="jobs/create" element={<PostJob />} />
          <Route path="applicants" element={<ManageApplicants />} />
          <Route path="pipeline" element={<RecruiterPipeline />} />
          <Route path="tasks" element={<TaskManagement />} />
          <Route path="interviews" element={<InterviewManagement />} />
          <Route path="boosted" element={<BoostedPosts />} />
          <Route path="payments" element={<RecruiterPayments />} />
          <Route path="advertisements" element={<CompanyAdvertisements />} />
          <Route path="notifications" element={<RecruiterPipeline />} />
          <Route path="settings" element={<RecruiterDashboard />} />
        </Route>

        {/* Company Alias Route (/company/dashboard) */}
        <Route 
          path="/company" 
          element={
            <RoleMiddleware allowedRoles={['recruiter', 'company']}>
              <RecruiterLayout />
            </RoleMiddleware>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<RecruiterDashboard />} />
          <Route path="profile" element={<CompanyProfile />} />
          <Route path="jobs" element={<MyJobPosts />} />
          <Route path="jobs/create" element={<PostJob />} />
          <Route path="applicants" element={<ManageApplicants />} />
          <Route path="pipeline" element={<RecruiterPipeline />} />
          <Route path="tasks" element={<TaskManagement />} />
          <Route path="interviews" element={<InterviewManagement />} />
          <Route path="boosted" element={<BoostedPosts />} />
          <Route path="payments" element={<RecruiterPayments />} />
          <Route path="advertisements" element={<CompanyAdvertisements />} />
          <Route path="notifications" element={<RecruiterPipeline />} />
          <Route path="settings" element={<RecruiterDashboard />} />
        </Route>

        {/* 5. System Admin Panel Routes (Protected: Admin Role Only) */}
        <Route 
          path="/admin" 
          element={
            <RoleMiddleware allowedRoles={['admin']}>
              <AdminLayout />
            </RoleMiddleware>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="complaints" element={<ComplainBox />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="jobs" element={<JobModeration />} />
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="featured" element={<FeaturedBoostedPosts />} />
          <Route path="boost-pricing" element={<BoostPricing />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="advertisements" element={<AdminAdvertisements />} />
          <Route path="ad-pricing" element={<AdPricing />} />
          <Route path="analytics" element={<AdminDashboard />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Fallback redirect to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
