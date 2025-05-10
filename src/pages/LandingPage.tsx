
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const LandingPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Check if user is logged in
  const checkAuth = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error checking auth status:", error);
      return false;
    }
  };

  // Get started button handler
  const handleGetStarted = async () => {
    try {
      const isAuthenticated = await checkAuth();
      if (isAuthenticated) {
        // User is already logged in, redirect to resources
        navigate("/resources");
      } else {
        // User is not logged in, redirect to auth page
        navigate("/auth");
      }
    } catch (error) {
      console.error("Error in Get Started handler:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-grow flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-blue-900 mb-6">
            Welcome to ChemFlow
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8">
            Your comprehensive chemical engineering learning platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              onClick={handleGetStarted}
            >
              Get Started
            </Button>
            <Link to="/auth">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <p>&copy; {new Date().getFullYear()} ChemFlow Learning. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
