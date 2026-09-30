import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * GuestMiddleware
 * Prevents already logged-in users from accessing /login and /register pages.
 * Redirects them directly to their own role dashboard.
 */
export default function GuestMiddleware({ children }) {
  const { user: authUser, loading: authLoading } = useAuth();

  if (authLoading) {
    return null;
  }

  const activeUser = authUser;

  if (activeUser) {
    const role = activeUser.role?.toLowerCase();
    if (role === 'seeker') return <Navigate to="/seeker/dashboard" replace />;
    if (role === 'recruiter' || role === 'company') return <Navigate to="/company/dashboard" replace />;
    if (role === 'admin' || role === 'super_admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}
