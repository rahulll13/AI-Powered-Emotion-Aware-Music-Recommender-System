import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const { token } = useAuth();

  if (!token) {
    // If no token, redirect to the login page
    return <Navigate to="/" replace />;
  }

  // If there is a token, show the child components (the dashboard)
  return <Outlet />;
}