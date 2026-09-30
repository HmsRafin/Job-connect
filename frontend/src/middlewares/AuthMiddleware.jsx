import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * AuthMiddleware
 * Ensures user is authenticated (any role).
 */
export default function AuthMiddleware({ children }) {
  const { user: authUser, loading: authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-slate-500 font-medium">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  const activeUser = authUser;

  if (!activeUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
