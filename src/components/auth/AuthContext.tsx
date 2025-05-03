
import React, { createContext, useContext, useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
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
  const { session, isLoading, login, signup, logout, initAuth } = useAuthentication({
    fetchUserProfile,
    setUser,
  });

  useEffect(() => {
    const subscription = initAuth();
    
    // Cleanup function
    return () => {
      subscription.then(sub => sub.unsubscribe());
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!user && !!session,
        isLoading,
        login,
        signup,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
