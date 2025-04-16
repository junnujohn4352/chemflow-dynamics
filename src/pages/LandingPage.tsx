
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { LolbyLogo } from "@/assets/icons/LolbyLogo";
import { Button } from "@/components/ui/button";

const LandingPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    // Initialize the fade animation after component mount
    const fadeTimer = setTimeout(() => {
      const fadeAnimation = setInterval(() => {
        setOpacity((prevOpacity) => {
          if (prevOpacity <= 0.2) {
            clearInterval(fadeAnimation);
            return 0.2;
          }
          return prevOpacity - 0.05;
        });
      }, 100);

      return () => clearInterval(fadeAnimation);
    }, 1000);

    // Simulate loading time
    const loadingTimer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(loadingTimer);
    };
  }, []);

  const handleEnterApp = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      {loading ? (
        <div className="text-center" style={{ opacity: opacity }}>
          <div className="flex justify-center mb-6 animate-pulse">
            <LolbyLogo className="h-24 w-auto" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Lolby</h1>
          <div className="flex items-center justify-center">
            <div className="h-1 w-64 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-teal-400 animate-progress"
                style={{ width: '75%' }}
              ></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center max-w-3xl mx-auto px-6" style={{ opacity: opacity }}>
          <div className="flex justify-center mb-10">
            <LolbyLogo className="h-32 w-auto" />
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-8 text-gray-900">
            Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-blue-500 to-teal-400">Lolby</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-xl mx-auto">
            The advanced process simulation platform designed for modern engineers and scientists.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              onClick={handleEnterApp}
              className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-purple-600 text-white font-medium shadow-lg hover:bg-purple-700 transition-colors"
              size="lg"
            >
              Enter Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          <div className="mt-16 text-gray-500 text-sm">
            © {new Date().getFullYear()} Lolby | Process Simulation Reimagined
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
