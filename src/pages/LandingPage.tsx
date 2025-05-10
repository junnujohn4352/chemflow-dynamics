
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import LandingContent from "@/components/landing/LandingContent";

const LandingPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Get started button handler - now takes user directly to resources
  const handleGetStarted = () => {
    navigate("/resources");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <LandingContent />
        
        {/* Action Buttons */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg"
            >
              Get Started with ChemFlow
            </Button>
            
            <Link to="/chemistry-game">
              <Button 
                size="lg" 
                variant="outline"
                className="w-full md:w-auto border-blue-500 text-blue-600 hover:bg-blue-50 text-lg"
              >
                Play Chemistry Game
              </Button>
            </Link>

            <Link to="/process-simulation">
              <Button 
                size="lg" 
                variant="outline"
                className="w-full md:w-auto border-green-500 text-green-600 hover:bg-green-50 text-lg"
              >
                Process Simulation Environment
              </Button>
            </Link>
          </div>
        </div>
      </main>

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
