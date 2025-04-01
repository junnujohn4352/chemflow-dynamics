
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronRight } from "lucide-react";
import ChemFlowLogo from "@/assets/icons/ChemFlowLogo";
import { Button } from "@/components/ui/button";

const LandingPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleEnterApp = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      {loading ? (
        <div className="text-center">
          <div className="flex justify-center mb-6 animate-pulse">
            <ChemFlowLogo className="h-24 w-auto" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">ChemFlow</h1>
          <div className="flex items-center justify-center">
            <div className="h-1 w-64 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-flow-blue via-flow-cyan to-flow-teal animate-progress"
                style={{ width: '75%' }}
              ></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center max-w-3xl mx-auto px-6">
          <div className="flex justify-center mb-6">
            <ChemFlowLogo className="h-24 w-auto" />
          </div>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-900/50 text-blue-300 text-sm font-medium mb-6">
            <span className="mr-2 bg-blue-700 text-white text-xs px-2 py-0.5 rounded-full">PRESENTED BY</span>
            LOL GROUP
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6 text-white">
            Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-flow-blue via-flow-cyan to-flow-teal">ChemFlow</span>
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto">
            The next generation chemical process simulation platform designed for modern engineers and scientists.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              onClick={handleEnterApp}
              className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-flow-blue text-white font-medium shadow-lg hover:bg-flow-blue/90 transition-colors"
              size="lg"
            >
              Enter Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-transparent border border-gray-600 text-gray-300 font-medium hover:bg-white/5 transition-colors"
            >
              Learn More
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="mt-16 text-gray-400 text-sm">
            © {new Date().getFullYear()} LOL Group | Chemical Process Simulation Reimagined
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
