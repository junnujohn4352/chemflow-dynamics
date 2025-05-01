
import React from "react";
import { ArrowRight, Beaker, FlaskConical, Atom, Calculator } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ChemFlowLogo from "@/assets/icons/ChemFlowLogo";
import FormulaCard from "./FormulaCard";

const LandingContent: React.FC = () => {
  const navigate = useNavigate();

  const handleEnterDashboard = () => {
    navigate('/dashboard');
  };

  return (
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
        <FormulaCard 
          title="Reynolds Number" 
          formula="Re = ρvD/μ"
          className="bg-gradient-to-br from-purple-50 to-purple-100/50"
        />
        <FormulaCard 
          title="Bernoulli's Equation" 
          formula="P₁ + ½ρv₁² + ρgh₁ = P₂ + ½ρv₂² + ρgh₂"
          className="bg-gradient-to-br from-blue-50 to-blue-100/50"
        />
        <FormulaCard 
          title="Mass Balance" 
          formula="∑(ṁᵢₙ) = ∑(ṁₒᵤₜ)"
          className="bg-gradient-to-br from-cyan-50 to-cyan-100/50"
        />
        <FormulaCard 
          title="Energy Balance" 
          formula="Q - W = ΔE"
          className="bg-gradient-to-br from-indigo-50 to-indigo-100/50"
        />
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
  );
};

export default LandingContent;
