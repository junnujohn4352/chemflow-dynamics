
import React, { createContext, useContext, useEffect, useCallback } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAuthentication } from "@/hooks/useAuthentication";
import { AuthContextType } from "@/types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { user, setUser, fetchUserProfile, updateProfile } = useUserProfile();
  const { 
    session, 
    isLoading, 
    login, 
    signup, 
    logout, 
    initAuth 
  } = useAuthentication({
    fetchUserProfile,
    setUser,
  });

  // Initialize authentication on component mount
  useEffect(() => {
    let subscription: { unsubscribe: () => void } | undefined;
    
    const initialize = async () => {
      try {
        subscription = await initAuth();
      } catch (error) {
        console.error("Error initializing authentication:", error);
      }
    };
    
    initialize();
    
    // Cleanup function
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [initAuth]);

  // Create the auth context value object
  const authContextValue: AuthContextType = {
    user,
    session,
    isAuthenticated: !!user && !!session,
    isLoading,
    login,
    signup,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
