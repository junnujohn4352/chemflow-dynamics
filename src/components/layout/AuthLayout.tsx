
import React from 'react';
import { Layout } from './Layout';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return <Layout>{children}</Layout>;
};

export default AuthLayout;
