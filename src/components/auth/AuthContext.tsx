
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

interface UserProfile {
  id: string;
  email: string;
  name: string;
  isSubscribed: boolean;
  transactionId?: string;
  lastLogin: Date;
}

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, name: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

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
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in on initial load
    const initAuth = async () => {
      setIsLoading(true);
      
      // Set up auth state listener FIRST
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, currentSession) => {
          setSession(currentSession);
          
          // If session exists, fetch user profile
          if (currentSession?.user) {
            // Use setTimeout to prevent potential deadlock
            setTimeout(() => {
              fetchUserProfile(currentSession.user.id);
            }, 0);
          } else {
            setUser(null);
          }
        }
      );

      // THEN check for existing session
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      
      if (currentSession?.user) {
        await fetchUserProfile(currentSession.user.id);
      }
      
      setIsLoading(false);
      
      return () => {
        subscription.unsubscribe();
      };
    };

    initAuth();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      // First check if user profile exists
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      // If profile exists, map it to our UserProfile type
      if (profile) {
        setUser({
          id: profile.id,
          email: profile.email,
          name: profile.name,
          isSubscribed: profile.is_subscribed,
          transactionId: profile.transaction_id || undefined,
          lastLogin: new Date(profile.last_login)
        });

        // Check if the user has completed payment
        const paymentCompleted = profile.is_subscribed;
        localStorage.setItem('chemflow-payment-completed', paymentCompleted ? 'true' : 'false');
        
        if (profile.transaction_id) {
          localStorage.setItem('chemflow-transaction-id', profile.transaction_id);
        }
      }
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error?.message || "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, name: string, password: string) => {
    setIsLoading(true);
    try {
      // Register the user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });

      if (error) throw error;

      // Create profile in the user_profiles table
      if (data.user) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert([
            {
              id: data.user.id,
              name,
              email,
              is_subscribed: false,
              transaction_id: localStorage.getItem('chemflow-transaction-id') || null,
              last_login: new Date().toISOString()
            }
          ]);

        if (profileError) {
          console.error("Error creating user profile:", profileError);
          // If profile creation fails, we should still let the user continue
          // as the auth record was created successfully
        }
      }

      toast({
        title: "Account created successfully",
        description: "You can now login with your credentials.",
      });
      
      navigate("/sign-in");
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error?.message || "An error occurred during sign up",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      localStorage.removeItem("chemflow-user");
      localStorage.removeItem("auth");
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      
      navigate("/sign-in");
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error?.message || "An error occurred during logout",
        variant: "destructive",
      });
    }
  };

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    if (!user || !user.id) {
      toast({
        title: "Update failed",
        description: "You must be logged in to update your profile",
        variant: "destructive",
      });
      return;
    }

    try {
      const updates = {
        ...(profileData.name && { name: profileData.name }),
        ...(profileData.email && { email: profileData.email }),
        ...(profileData.isSubscribed !== undefined && { is_subscribed: profileData.isSubscribed }),
        ...(profileData.transactionId && { transaction_id: profileData.transactionId }),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      // Update local user state
      setUser({ ...user, ...profileData });

      // If subscription status changed, update local storage
      if (profileData.isSubscribed !== undefined) {
        localStorage.setItem('chemflow-payment-completed', profileData.isSubscribed ? 'true' : 'false');
      }

      if (profileData.transactionId) {
        localStorage.setItem('chemflow-transaction-id', profileData.transactionId);
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully."
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error?.message || "An error occurred while updating your profile",
        variant: "destructive",
      });
    }
  };

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
