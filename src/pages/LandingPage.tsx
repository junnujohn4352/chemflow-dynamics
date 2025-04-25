import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Beaker, FlaskConical, Atom, Calculator, FlaskRound, Gauge } from "lucide-react";
import { ChemFlowLogo } from "@/assets/icons/ChemFlowLogo";
import { Button } from "@/components/ui/button";
import GlassPanel from "@/components/ui/GlassPanel";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

const LandingPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [opacity, setOpacity] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("basic");

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

  const formulaCategories = {
    basic: [
      { name: "Reynolds Number", formula: "Re = ρvD/μ", color: "bg-gradient-to-r from-purple-500/40 to-pink-500/40", textColor: "text-purple-800", hoverColor: "hover:bg-purple-600/20" },
      { name: "Bernoulli's Equation", formula: "P₁ + ½ρv₁² + ρgh₁ = P₂ + ½ρv₂² + ρgh₂", color: "bg-gradient-to-r from-blue-500/40 to-cyan-500/40", textColor: "text-blue-800", hoverColor: "hover:bg-blue-600/20" },
      { name: "Mass Balance", formula: "∑(ṁᵢₙ) = ∑(ṁₒᵤₜ)", color: "bg-gradient-to-r from-green-500/40 to-teal-500/40", textColor: "text-green-800", hoverColor: "hover:bg-green-600/20" },
      { name: "Energy Balance", formula: "Q - W = ΔE", color: "bg-gradient-to-r from-orange-500/40 to-red-500/40", textColor: "text-orange-800", hoverColor: "hover:bg-orange-600/20" }
    ],
    thermodynamics: [
      { name: "Gibbs Free Energy", formula: "ΔG = ΔH - TΔS", color: "bg-gradient-to-r from-purple-400/20 to-pink-500/20" },
      { name: "Enthalpy", formula: "H = U + PV", color: "bg-gradient-to-r from-blue-400/20 to-cyan-500/20" },
      { name: "Entropy Change", formula: "ΔS = ∫(δQ/T)", color: "bg-gradient-to-r from-green-400/20 to-teal-500/20" },
      { name: "Clausius-Clapeyron", formula: "ln(P₂/P₁) = ΔH/R(1/T₁ - 1/T₂)", color: "bg-gradient-to-r from-orange-400/20 to-red-500/20" }
    ],
    kinetics: [
      { name: "Arrhenius Equation", formula: "k = A·e^(-E_a/RT)", color: "bg-gradient-to-r from-amber-400/20 to-yellow-500/20" },
      { name: "First Order Rate", formula: "ln(C/C₀) = -kt", color: "bg-gradient-to-r from-yellow-400/20 to-lime-500/20" },
      { name: "Second Order Rate", formula: "1/C - 1/C₀ = kt", color: "bg-gradient-to-r from-lime-400/20 to-green-500/20" },
      { name: "Half Life", formula: "t₁/₂ = ln(2)/k", color: "bg-gradient-to-r from-green-400/20 to-blue-500/20" }
    ],
    transport: [
      { name: "Fick's Law", formula: "J = -D(∂c/∂x)", color: "bg-gradient-to-r from-emerald-400/20 to-teal-500/20" },
      { name: "Fourier's Law", formula: "q = -k(∂T/∂x)", color: "bg-gradient-to-r from-teal-400/20 to-cyan-500/20" },
      { name: "Darcy's Law", formula: "Q = -kA(∂P/∂L)/μ", color: "bg-gradient-to-r from-cyan-400/20 to-sky-500/20" },
      { name: "Shell Balance", formula: "∑F_in - ∑F_out + ∑F_gen = ∑F_acc", color: "bg-gradient-to-r from-sky-400/20 to-blue-500/20" }
    ],
    reactors: [
      { name: "CSTR Design", formula: "V = F₀(C_A0 - C_A)/r_A", color: "bg-gradient-to-r from-blue-400/20 to-indigo-500/20" },
      { name: "PFR Design", formula: "V = F₀∫(dX/r_A)", color: "bg-gradient-to-r from-indigo-400/20 to-violet-500/20" },
      { name: "PFR Conversion", formula: "dX/dz = -r_A/(u₀·C_A0)", color: "bg-gradient-to-r from-violet-400/20 to-purple-500/20" },
      { name: "Batch Reactor", formula: "t = C_A0∫(dX/r_A)", color: "bg-gradient-to-r from-purple-400/20 to-pink-500/20" }
    ]
  };

  const formulas = formulaCategories[selectedCategory] || formulaCategories.basic;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center 
      bg-gradient-to-br from-blue-50/10 via-cyan-50/10 to-teal-50/10 overflow-hidden relative">
      {loading ? (
        <div className="text-center backdrop-blur-sm bg-white/5 p-8 rounded-2xl" style={{ opacity: opacity }}>
          <div className="flex justify-center mb-6 animate-pulse">
            <ChemFlowLogo className="h-24 w-auto" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">ChemFlow</h1>
          <div className="flex items-center justify-center">
            <div className="h-1 w-64 bg-gray-200/30 rounded-full overflow-hidden backdrop-blur-sm">
              <div 
                className="h-full bg-gradient-to-r from-flow-blue/60 via-flow-cyan/60 to-flow-teal/60 animate-progress"
                style={{ width: '75%' }}
              ></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center max-w-5xl mx-auto px-6 relative" style={{ opacity: opacity }}>
          <div className="absolute inset-0 bg-white/5 rounded-full blur-3xl -z-10 animate-pulse"></div>
          <div className="absolute top-20 -left-20 w-72 h-72 bg-purple-400/10 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-float"></div>
          <div className="absolute -bottom-20 right-10 w-80 h-80 bg-blue-400/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float animation-delay-1000"></div>
          
          <div className="flex justify-center mb-10 hover:scale-105 transition-transform">
            <ChemFlowLogo className="h-32 w-auto drop-shadow-lg" />
          </div>
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-bold leading-tight mb-8 
            text-transparent bg-clip-text bg-gradient-to-r from-purple-600/90 via-blue-500/90 to-pink-500/90 
            drop-shadow-sm animate-pulse">
            Welcome to ChemFlow
          </h1>
          
          <p className="text-2xl text-gray-600/90 mb-10 max-w-2xl mx-auto 
            bg-gradient-to-r from-blue-500/90 to-purple-500/90 bg-clip-text text-transparent 
            font-semibold drop-shadow-sm">
            The advanced process simulation platform designed for modern engineers and scientists.
          </p>

          <div className="flex justify-center mb-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-full p-1 shadow-sm">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[220px] rounded-full border-0 
                  bg-gradient-to-r from-blue-100/20 to-purple-100/20 
                  text-blue-800 hover:from-blue-200/30 hover:to-purple-200/30 
                  transition-all duration-300 backdrop-blur-md">
                  <SelectValue placeholder="Select Formula Category" />
                </SelectTrigger>
                <SelectContent className="bg-white/10 backdrop-blur-md border-white/20">
                  <SelectItem value="basic">Basic Principles</SelectItem>
                  <SelectItem value="thermodynamics">Thermodynamics</SelectItem>
                  <SelectItem value="kinetics">Reaction Kinetics</SelectItem>
                  <SelectItem value="transport">Transport Phenomena</SelectItem>
                  <SelectItem value="reactors">Reactor Design</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 max-w-4xl mx-auto">
            {formulas.map((item, index) => (
              <GlassPanel 
                key={index} 
                className={`p-4 ${item.color.replace(/40/g, '20')} ${item.hoverColor} group hover:scale-105 
                  transition-all duration-300 hover:shadow-xl border border-white/10 
                  backdrop-blur-md bg-white/5`}
                intensity="light"
              >
                <h3 className={`text-sm font-medium ${item.textColor} mb-2 
                  group-hover:text-opacity-90 transition-colors`}>
                  {item.name}
                </h3>
                <p className={`text-lg font-mono ${item.textColor} 
                  group-hover:text-opacity-80 transition-all`}>
                  {item.formula}
                </p>
              </GlassPanel>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Button
              onClick={handleEnterApp}
              className="inline-flex items-center justify-center px-8 py-3 rounded-xl 
              bg-gradient-to-r from-purple-600/40 to-pink-600/40 text-white font-medium 
              shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all 
              backdrop-blur-md border border-white/20
              hover:from-purple-700/50 hover:to-pink-700/50 
              active:from-purple-800/60 active:to-pink-800/60"
              size="lg"
            >
              Enter Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <div className="flex gap-6 justify-center mb-16">
            <Beaker className="h-8 w-8 text-purple-500 animate-bounce" />
            <FlaskConical className="h-8 w-8 text-blue-500 animate-bounce delay-100" />
            <Atom className="h-8 w-8 text-green-500 animate-bounce delay-200" />
            <FlaskRound className="h-8 w-8 text-teal-500 animate-bounce delay-300" />
            <Calculator className="h-8 w-8 text-pink-500 animate-bounce delay-400" />
            <Gauge className="h-8 w-8 text-orange-500 animate-bounce delay-500" />
          </div>
          
          <div className="text-gray-700/80 text-sm font-medium 
            bg-gradient-to-r from-blue-500/80 to-purple-500/80 bg-clip-text text-transparent
            backdrop-blur-sm">
            © {new Date().getFullYear()} ChemFlow | Process Simulation Reimagined
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
