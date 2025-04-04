
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from './Layout';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("auth") === "true";

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/sign-in');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return <Layout>{children}</Layout>;
};

export default AuthLayout;
