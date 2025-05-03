
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  email: string;
  name: string;
  isSubscribed: boolean;
  subscriptionType?: string;
  lastLogin: Date;
  transactionId?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, transactionId?: string | null) => Promise<void>;
  signup: (email: string, name: string, password: string, transactionId?: string | null) => Promise<void>;
  logout: () => void;
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in on initial load
    const checkAuth = () => {
      const storedUser = localStorage.getItem("chemflow-user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (e) {
          console.error("Error parsing stored user", e);
          localStorage.removeItem("chemflow-user");
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string, transactionId?: string | null) => {
    setIsLoading(true);
    try {
      // This would be replaced with actual API call
      // Simulate API latency
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, validate credentials with backend
      if (email && password) {
        // For demo purposes, create a mock user
        const mockUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          email,
          name: email.split('@')[0],
          isSubscribed: localStorage.getItem('chemflow-payment-completed') === 'true',
          lastLogin: new Date(),
          transactionId: transactionId || undefined
        };

        setUser(mockUser);
        localStorage.setItem("chemflow-user", JSON.stringify(mockUser));
        localStorage.setItem("auth", "true");
        
        toast({
          title: "Login successful",
          description: `Welcome back, ${mockUser.name}!`,
        });
        
        navigate("/dashboard");
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, name: string, password: string, transactionId?: string | null) => {
    setIsLoading(true);
    try {
      // This would be replaced with actual API call
      // Simulate API latency
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, register user with backend
      if (email && name && password) {
        // For demo purposes, create a mock user
        const mockUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          email,
          name,
          isSubscribed: localStorage.getItem('chemflow-payment-completed') === 'true',
          lastLogin: new Date(),
          transactionId: transactionId || undefined
        };
        
        toast({
          title: "Account created successfully",
          description: "You can now login with your credentials.",
        });
        
        navigate("/sign-in");
      } else {
        throw new Error("Please fill all required fields");
      }
    } catch (error) {
      toast({
        title: "Sign up failed",
        description: error instanceof Error ? error.message : "An error occurred during sign up",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem("chemflow-user");
    localStorage.removeItem("auth");
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    navigate("/sign-in");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
