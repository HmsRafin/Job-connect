import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { usePlatform } from '../../context/PlatformContext';
import AccessDenied from '../../pages/public/AccessDenied';

export default function ProtectedRoute({ allowedRoles = [], children }) {
  const { currentUser } = usePlatform();
  const location = useLocation();

  // 1. If user is not authenticated at all, redirect to login
  if (!currentUser) {
    const loginTarget = allowedRoles.includes('admin') ? '/admin/login' : '/login';
    return <Navigate to={loginTarget} state={{ from: location }} replace />;
  }

  // 2. If user role is not authorized for this route, render Access Denied (403)
  if (!allowedRoles.includes(currentUser.role)) {
    return <AccessDenied attemptedPath={location.pathname} requiredRoles={allowedRoles} />;
  }

  // 3. Authorized access granted
  return children;
}
