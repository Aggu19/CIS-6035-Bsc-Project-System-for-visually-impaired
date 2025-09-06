import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ACCESS_CODE = (import.meta as any).env?.VITE_ACCESS_CODE as string | undefined;
const STORAGE_KEY = 'app_access_granted';

type ProtectedRouteProps = {
  children: React.ReactElement;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();

  // If no access code set, don't protect
  if (!ACCESS_CODE || ACCESS_CODE.trim().length === 0) {
    return children;
  }

  const granted = typeof window !== 'undefined' && window.sessionStorage.getItem(STORAGE_KEY) === 'true';
  if (granted) return children;

  const input = typeof window !== 'undefined' ? window.prompt('Enter access code to view this page:') : undefined;
  if (input && input === ACCESS_CODE) {
    window.sessionStorage.setItem(STORAGE_KEY, 'true');
    return children;
  }

  return <Navigate to="/" replace state={{ from: location }} />;
};

export default ProtectedRoute;

