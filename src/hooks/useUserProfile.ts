
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/auth";

export const useUserProfile = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const { toast } = useToast();

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
        return null;
      }

      // If profile exists, map it to our UserProfile type
      if (profile) {
        const userProfile: UserProfile = {
          id: profile.id,
          email: profile.email,
          name: profile.name,
          isSubscribed: profile.is_subscribed,
          transactionId: profile.transaction_id || undefined,
          lastLogin: new Date(profile.last_login)
        };

        setUser(userProfile);

        // Check if the user has completed payment
        const paymentCompleted = profile.is_subscribed;
        localStorage.setItem('chemflow-payment-completed', paymentCompleted ? 'true' : 'false');
        
        if (profile.transaction_id) {
          localStorage.setItem('chemflow-transaction-id', profile.transaction_id);
        }

        return userProfile;
      }
      return null;
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
      return null;
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

  return {
    user,
    setUser,
    fetchUserProfile,
    updateProfile,
  };
};
