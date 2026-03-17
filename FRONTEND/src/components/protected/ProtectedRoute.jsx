import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute(props) {
  const allowedRole = props.allowedRole;
  const children = props.children; 
  
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace={true} />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace={true} />;
  }

  return children;
}