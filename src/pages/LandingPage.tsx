
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

  // Formula categories
  const formulaCategories = {
    basic: [
      { name: "Reynolds Number", formula: "Re = ρvD/μ", color: "bg-flow-blue/10" },
      { name: "Bernoulli's Equation", formula: "P₁ + ½ρv₁² + ρgh₁ = P₂ + ½ρv₂² + ρgh₂", color: "bg-flow-cyan/10" },
      { name: "Mass Balance", formula: "∑(ṁᵢₙ) = ∑(ṁₒᵤₜ)", color: "bg-flow-teal/10" },
      { name: "Energy Balance", formula: "Q - W = ΔE", color: "bg-indigo-500/10" }
    ],
    thermodynamics: [
      { name: "Gibbs Free Energy", formula: "ΔG = ΔH - TΔS", color: "bg-purple-500/10" },
      { name: "Enthalpy", formula: "H = U + PV", color: "bg-pink-500/10" },
      { name: "Entropy Change", formula: "ΔS = ∫(δQ/T)", color: "bg-red-500/10" },
      { name: "Clausius-Clapeyron", formula: "ln(P₂/P₁) = ΔH/R(1/T₁ - 1/T₂)", color: "bg-orange-500/10" }
    ],
    kinetics: [
      { name: "Arrhenius Equation", formula: "k = A·e^(-E_a/RT)", color: "bg-amber-500/10" },
      { name: "First Order Rate", formula: "ln(C/C₀) = -kt", color: "bg-yellow-500/10" },
      { name: "Second Order Rate", formula: "1/C - 1/C₀ = kt", color: "bg-lime-500/10" },
      { name: "Half Life", formula: "t₁/₂ = ln(2)/k", color: "bg-green-500/10" }
    ],
    transport: [
      { name: "Fick's Law", formula: "J = -D(∂c/∂x)", color: "bg-emerald-500/10" },
      { name: "Fourier's Law", formula: "q = -k(∂T/∂x)", color: "bg-teal-500/10" },
      { name: "Darcy's Law", formula: "Q = -kA(∂P/∂L)/μ", color: "bg-cyan-500/10" },
      { name: "Shell Balance", formula: "∑F_in - ∑F_out + ∑F_gen = ∑F_acc", color: "bg-sky-500/10" }
    ],
    reactors: [
      { name: "CSTR Design", formula: "V = F₀(C_A0 - C_A)/r_A", color: "bg-blue-500/10" },
      { name: "PFR Design", formula: "V = F₀∫(dX/r_A)", color: "bg-indigo-500/10" },
      { name: "PFR Conversion", formula: "dX/dz = -r_A/(u₀·C_A0)", color: "bg-violet-500/10" },
      { name: "Batch Reactor", formula: "t = C_A0∫(dX/r_A)", color: "bg-purple-500/10" }
    ]
  };

  // Get the formulas based on selected category
  const formulas = formulaCategories[selectedCategory] || formulaCategories.basic;

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
          <div className="absolute top-20 -left-20 w-72 h-72 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-float"></div>
          <div className="absolute -bottom-20 right-10 w-80 h-80 bg-teal-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float animation-delay-1000"></div>
          
          <div className="flex justify-center mb-10 hover:scale-105 transition-transform">
            <ChemFlowLogo className="h-32 w-auto drop-shadow-lg" />
          </div>
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-bold leading-tight mb-8 text-transparent bg-clip-text bg-gradient-to-r from-flow-blue via-flow-cyan to-flow-teal drop-shadow-sm">
            Welcome to ChemFlow
          </h1>
          
          <p className="text-2xl text-gray-600 mb-10 max-w-2xl mx-auto">
            The advanced process simulation platform designed for modern engineers and scientists.
          </p>

          <div className="flex justify-center mb-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-sm">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[220px] rounded-full border-0 bg-transparent">
                  <SelectValue placeholder="Select Formula Category" />
                </SelectTrigger>
                <SelectContent>
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
            <Flask className="h-8 w-8 text-indigo-500 animate-bounce delay-300" />
            <Calculator className="h-8 w-8 text-purple-500 animate-bounce delay-400" />
            <Gauge className="h-8 w-8 text-pink-500 animate-bounce delay-500" />
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
