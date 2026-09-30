import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AccessDenied from '../pages/public/AccessDenied';

/**
 * RoleMiddleware (ProtectedRoute)
 * Guards routes based on authentication status and user roles.
 * 
 * @param {Array} allowedRoles - List of allowed roles (e.g., ['seeker'], ['recruiter', 'company'], ['admin'])
 * @param {ReactNode} children - The component / layout to render if authorized
 */
export default function RoleMiddleware({ allowedRoles = [], children }) {
  const { user: authUser, loading: authLoading } = useAuth();
  const location = useLocation();

  // Show spinner while checking auth credentials
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-slate-500 font-medium">Verifying authorization credentials...</p>
        </div>
      </div>
    );
  }

  const activeUser = authUser;

  // 1. Unauthenticated users are redirected to login
  if (!activeUser) {
    const loginTarget = allowedRoles.includes('admin') ? '/admin/login' : '/login';
    return <Navigate to={loginTarget} state={{ from: location }} replace />;
  }

  // 2. Strict Role Match Verification
  const userRole = activeUser.role?.toLowerCase();
  const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase());

  const isAllowed = 
    normalizedAllowedRoles.includes(userRole) ||
    (normalizedAllowedRoles.includes('recruiter') && userRole === 'company') ||
    (normalizedAllowedRoles.includes('company') && userRole === 'recruiter') ||
    (normalizedAllowedRoles.includes('admin') && (userRole === 'super_admin' || userRole === 'administrator'));

  // 3. Unauthorized access is blocked and shows 403 Forbidden Screen
  if (!isAllowed) {
    return <AccessDenied attemptedPath={location.pathname} requiredRoles={allowedRoles} />;
  }

  // 4. Authorized access granted
  return children;
}
