
import { Session, AuthError } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  isSubscribed: boolean;
  transactionId?: string;
  lastLogin: Date;
}

export interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error?: AuthError }>;
  signup: (email: string, name: string, password: string) => Promise<{ error?: AuthError }>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}
