
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Beaker, FlaskConical, Atom, Calculator } from "lucide-react";
import ChemFlowLogo from "@/assets/icons/ChemFlowLogo";
import { Button } from "@/components/ui/button";
import GlassPanel from "@/components/ui/GlassPanel";

const LandingPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
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

    const loadingTimer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(loadingTimer);
    };
  }, []);

  const handleEnterDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center 
      bg-gradient-to-br from-purple-100 via-blue-100 to-cyan-100 overflow-hidden relative">
      {loading ? (
        <div className="text-center bg-white/80 p-8 rounded-2xl shadow-lg backdrop-blur-sm" 
             style={{ opacity: opacity }}>
          <div className="flex justify-center mb-6 animate-pulse">
            <ChemFlowLogo className="h-24 w-auto" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">ChemFlow</h1>
          <div className="flex items-center justify-center">
            <div className="h-1 w-64 bg-blue-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-progress w-3/4"></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center max-w-5xl mx-auto px-6 relative">
          {/* Decorative blobs */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float"></div>
          <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float" style={{ animationDelay: "2s" }}></div>
          
          <div className="flex justify-center mb-10 hover:scale-105 transition-transform">
            <ChemFlowLogo className="h-32 w-auto drop-shadow-lg" />
          </div>
          
          <h1 className="text-6xl md:text-7xl font-display font-bold leading-tight mb-8 
            bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome to ChemFlow
          </h1>
          
          <p className="text-2xl text-blue-700/90 mb-16 max-w-2xl mx-auto">
            The advanced process simulation platform designed for modern engineers and scientists.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            <GlassPanel className="p-6 hover:scale-105 transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100/50">
              <h3 className="text-lg font-bold text-purple-700 mb-2">Reynolds Number</h3>
              <p className="font-mono text-purple-600">Re = ρvD/μ</p>
            </GlassPanel>

            <GlassPanel className="p-6 hover:scale-105 transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100/50">
              <h3 className="text-lg font-bold text-blue-700 mb-2">Bernoulli's Equation</h3>
              <p className="font-mono text-blue-600">P₁ + ½ρv₁² + ρgh₁ = P₂ + ½ρv₂² + ρgh₂</p>
            </GlassPanel>

            <GlassPanel className="p-6 hover:scale-105 transition-all duration-300 bg-gradient-to-br from-cyan-50 to-cyan-100/50">
              <h3 className="text-lg font-bold text-cyan-700 mb-2">Mass Balance</h3>
              <p className="font-mono text-cyan-600">∑(ṁᵢₙ) = ∑(ṁₒᵤₜ)</p>
            </GlassPanel>

            <GlassPanel className="p-6 hover:scale-105 transition-all duration-300 bg-gradient-to-br from-indigo-50 to-indigo-100/50">
              <h3 className="text-lg font-bold text-indigo-700 mb-2">Energy Balance</h3>
              <p className="font-mono text-indigo-600">Q - W = ΔE</p>
            </GlassPanel>
          </div>
          
          <Button
            onClick={handleEnterDashboard}
            className="px-8 py-3 text-lg font-medium rounded-xl 
              bg-gradient-to-r from-blue-600 to-purple-600 text-white
              shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            size="lg"
          >
            Enter Dashboard
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <div className="flex gap-6 justify-center mt-16 mb-8">
            <Beaker className="h-8 w-8 text-blue-500 animate-bounce" />
            <FlaskConical className="h-8 w-8 text-purple-500 animate-bounce delay-100" />
            <Atom className="h-8 w-8 text-cyan-500 animate-bounce delay-200" />
            <Calculator className="h-8 w-8 text-indigo-500 animate-bounce delay-300" />
          </div>
          
          <div className="text-gray-600 text-sm font-medium">
            © {new Date().getFullYear()} ChemFlow | Process Simulation Reimagined
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
