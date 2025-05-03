
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AuthError, Session } from "@supabase/supabase-js";
import { UserProfile } from "@/types/auth";

interface UseAuthenticationProps {
  fetchUserProfile: (userId: string) => Promise<UserProfile | null>;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

export const useAuthentication = ({ fetchUserProfile, setUser }: UseAuthenticationProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast({
          title: "Login failed",
          description: error?.message || "An error occurred during login",
          variant: "destructive",
        });
        setIsLoading(false);
        return { error };
      }

      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      navigate("/dashboard");
      setIsLoading(false);
      return { error: undefined };
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error?.message || "An error occurred during login",
        variant: "destructive",
      });
      setIsLoading(false);
      return { error: error as AuthError };
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
      setIsLoading(false);
      return { error: undefined };
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error?.message || "An error occurred during sign up",
        variant: "destructive",
      });
      setIsLoading(false);
      return { error: error as AuthError };
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
    
    return subscription;
  };

  return {
    session,
    isLoading,
    login,
    signup,
    logout,
    initAuth,
  };
};
