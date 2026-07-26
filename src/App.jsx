import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Protected Route Guard
import ProtectedRoute from './components/auth/ProtectedRoute';

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
import PostJob from './pages/recruiter/PostJob';
import ManageApplicants from './pages/recruiter/ManageApplicants';
import RecruiterPipeline from './pages/recruiter/RecruiterPipeline';
import TaskManagement from './pages/recruiter/TaskManagement';
import InterviewManagement from './pages/recruiter/InterviewManagement';
import AIScreening from './pages/recruiter/AIScreening';
import BoostedPosts from './pages/recruiter/BoostedPosts';
import CompanyAdvertisements from './pages/recruiter/CompanyAdvertisements';
import RecruiterPayments from './pages/recruiter/RecruiterPayments';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import JobModeration from './pages/admin/JobModeration';
import CategoryManagement from './pages/admin/CategoryManagement';
import BoostPricing from './pages/admin/BoostPricing';
import AdPricing from './pages/admin/AdPricing';
import AdminPayments from './pages/admin/AdminPayments';
import AdminAdvertisements from './pages/admin/AdminAdvertisements';

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
          <Route path="access-denied" element={<AccessDenied />} />
        </Route>

        {/* 2. Authentication Routes */}
        <Route path="/" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Dedicated Separate Admin Login Route */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* 3. Job Seeker Dashboard Routes (Protected: Seeker Role Only) */}
        <Route 
          path="/seeker" 
          element={
            <ProtectedRoute allowedRoles={['seeker']}>
              <SeekerLayout />
            </ProtectedRoute>
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

        {/* 4. Hiring Company Console Routes (Protected: Recruiter Role Only) */}
        <Route 
          path="/recruiter" 
          element={
            <ProtectedRoute allowedRoles={['recruiter']}>
              <RecruiterLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<RecruiterDashboard />} />
          <Route path="profile" element={<RecruiterDashboard />} />
          <Route path="jobs/create" element={<PostJob />} />
          <Route path="applicants" element={<ManageApplicants />} />
          <Route path="pipeline" element={<RecruiterPipeline />} />
          <Route path="tasks" element={<TaskManagement />} />
          <Route path="interviews" element={<InterviewManagement />} />
          <Route path="ai-screening" element={<AIScreening />} />
          <Route path="boosted" element={<BoostedPosts />} />
          <Route path="advertisements" element={<CompanyAdvertisements />} />
          <Route path="payments" element={<RecruiterPayments />} />
          <Route path="notifications" element={<RecruiterPipeline />} />
          <Route path="settings" element={<RecruiterDashboard />} />
        </Route>

        {/* 5. System Admin Panel Routes (Protected: Admin Role Only) */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="jobs" element={<JobModeration />} />
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="advertisements" element={<AdminAdvertisements />} />
          <Route path="featured" element={<JobModeration />} />
          <Route path="boost-pricing" element={<BoostPricing />} />
          <Route path="ad-pricing" element={<AdPricing />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="analytics" element={<AdminDashboard />} />
          <Route path="settings" element={<AdminDashboard />} />
        </Route>

        {/* Fallback redirect to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
