
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Beaker, FlaskConical, Atom } from "lucide-react";
import { ChemFlowLogo } from "@/assets/icons/ChemFlowLogo";
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

  const handleEnterApp = () => {
    navigate('/dashboard');
  };

  const formulas = [
    { name: "Reynolds Number", formula: "Re = ρvD/μ", color: "bg-flow-blue/10" },
    { name: "Bernoulli's Equation", formula: "P₁ + ½ρv₁² + ρgh₁ = P₂ + ½ρv₂² + ρgh₂", color: "bg-flow-cyan/10" },
    { name: "Mass Balance", formula: "∑(ṁᵢₙ) = ∑(ṁₒᵤₜ)", color: "bg-flow-teal/10" },
    { name: "Energy Balance", formula: "Q - W = ΔE", color: "bg-indigo-500/10" }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-blue-50 to-cyan-50 overflow-hidden">
      {loading ? (
        <div className="text-center" style={{ opacity: opacity }}>
          <div className="flex justify-center mb-6 animate-pulse">
            <ChemFlowLogo className="h-24 w-auto" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">ChemFlow</h1>
          <div className="flex items-center justify-center">
            <div className="h-1 w-64 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-flow-blue via-flow-cyan to-flow-teal animate-progress"
                style={{ width: '75%' }}
              ></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center max-w-5xl mx-auto px-6 relative" style={{ opacity: opacity }}>
          <div className="absolute inset-0 bg-white/30 rounded-full blur-3xl -z-10 animate-pulse"></div>
          
          <div className="flex justify-center mb-10 hover:scale-105 transition-transform">
            <ChemFlowLogo className="h-32 w-auto drop-shadow-lg" />
          </div>
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-bold leading-tight mb-8 text-transparent bg-clip-text bg-gradient-to-r from-flow-blue via-flow-cyan to-flow-teal drop-shadow-sm">
            Welcome to ChemFlow
          </h1>
          
          <p className="text-2xl text-gray-600 mb-10 max-w-2xl mx-auto">
            The advanced process simulation platform designed for modern engineers and scientists.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-4xl mx-auto">
            {formulas.map((item, index) => (
              <GlassPanel 
                key={index} 
                className={`p-4 ${item.color} group hover:scale-105 transition-all duration-300 hover:shadow-xl`}
                intensity="light"
              >
                <h3 className="text-sm font-medium text-gray-700 mb-2 group-hover:text-flow-blue transition-colors">
                  {item.name}
                </h3>
                <p className="text-lg font-mono text-flow-blue group-hover:text-opacity-80 transition-all">
                  {item.formula}
                </p>
              </GlassPanel>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Button
              onClick={handleEnterApp}
              className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-gradient-to-r from-flow-blue to-flow-cyan text-white font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
              size="lg"
            >
              Enter Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <div className="flex gap-6 justify-center mb-16">
            <Beaker className="h-8 w-8 text-flow-blue animate-bounce" />
            <FlaskConical className="h-8 w-8 text-flow-cyan animate-bounce delay-100" />
            <Atom className="h-8 w-8 text-flow-teal animate-bounce delay-200" />
          </div>
          
          <div className="text-gray-500 text-sm">
            © {new Date().getFullYear()} ChemFlow | Process Simulation Reimagined
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
