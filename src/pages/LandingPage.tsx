import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Beaker, FlaskConical, Atom } from "lucide-react";
import { ChemFlowLogo } from "@/assets/icons/ChemFlowLogo";
import { Button } from "@/components/ui/button";

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
    { name: "Reynolds Number", formula: "Re = ρvD/μ" },
    { name: "Bernoulli's Equation", formula: "P₁ + ½ρv₁² + ρgh₁ = P₂ + ½ρv₂² + ρgh₂" },
    { name: "Mass Balance", formula: "∑(ṁᵢₙ) = ∑(ṁₒᵤₜ)" },
    { name: "Energy Balance", formula: "Q - W = ΔE" }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-blue-50 to-cyan-50">
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
        <div className="text-center max-w-5xl mx-auto px-6" style={{ opacity: opacity }}>
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
              <div 
                key={index}
                className="p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-blue-100 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <h3 className="text-sm font-medium text-gray-600 mb-2">{item.name}</h3>
                <p className="text-lg font-mono text-flow-blue">{item.formula}</p>
              </div>
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
