
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresSubscription?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiresSubscription = true 
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // If not authenticated, redirect to sign-in
  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }
  
  // Check if user has access to simulation (has paid)
  const hasSimulationAccess = user?.isSubscribed;
  
  // If route requires subscription and user hasn't paid, redirect to payment
  if (requiresSubscription && !hasSimulationAccess) {
    return <Navigate to="/payment" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
