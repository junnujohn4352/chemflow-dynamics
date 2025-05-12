
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import LandingContent from "@/components/landing/LandingContent";

const LandingPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Simple navigate to process simulation
  const handleStartSimulation = () => {
    navigate("/process-simulation");
    toast({
      title: "Opening ChemFlow Simulator",
      description: "Loading the CAPE-OPEN compliant process simulation environment..."
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <LandingContent />
        
        {/* Action Button */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center items-center">
            <Button 
              size="lg" 
              onClick={handleStartSimulation}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-6"
            >
              Open ChemFlow Simulator
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <p>&copy; {new Date().getFullYear()} ChemFlow Process Simulation. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
