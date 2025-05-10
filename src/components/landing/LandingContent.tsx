
import React from "react";
import { ArrowRight, Beaker, FlaskConical, Atom, Calculator, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ChemFlowLogo from "@/assets/icons/ChemFlowLogo";
import FormulaCard from "./FormulaCard";

const LandingContent: React.FC = () => {
  const navigate = useNavigate();

  const handleEnterDashboard = () => {
    navigate('/dashboard');
  };
  
  const handleSignIn = () => {
    navigate('/auth');
  };

  return (
    <div className="text-center max-w-5xl mx-auto py-16 px-6 relative">
      {/* Enhanced decorative blobs with animations */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float"></div>
      <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float-reverse" style={{ animationDelay: "2s" }}></div>
      <div className="absolute top-40 left-1/4 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-float" style={{ animationDelay: "4s" }}></div>
      <div className="absolute bottom-40 right-1/4 w-40 h-40 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-float-reverse" style={{ animationDelay: "3s" }}></div>
      
      {/* Animated 3D elements */}
      <div className="absolute top-20 left-1/3 w-16 h-16 border-2 border-blue-300/30 rounded-lg rotate-12 animate-spin-slow opacity-70"></div>
      <div className="absolute bottom-60 right-1/3 w-12 h-12 border-2 border-purple-300/30 rounded-full animate-spin-slow opacity-70" style={{ animationDelay: "7s" }}></div>
      <div className="absolute bottom-20 left-2/3 w-20 h-20 border-2 border-pink-300/30 rounded-lg -rotate-12 animate-spin-slow opacity-70" style={{ animationDelay: "5s", animationDirection: "reverse" }}></div>
      <div className="absolute top-40 right-1/4 w-24 h-24 border border-indigo-300/20 rounded-lg rotate-45 animate-float opacity-80" style={{ animationDelay: "3.5s" }}></div>
      <div className="absolute bottom-32 left-1/4 w-32 h-16 border border-cyan-300/20 rounded-xl -rotate-12 animate-float-reverse opacity-80" style={{ animationDelay: "4.5s" }}></div>
      
      <div className="flex justify-center mb-10 hover:scale-105 transition-transform animate-scale-in">
        <ChemFlowLogo className="h-32 w-auto drop-shadow-lg" />
      </div>
      
      <h1 className="text-6xl md:text-7xl font-display font-bold leading-tight mb-8 
        bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in-up">
        Welcome to ChemFlow
      </h1>
      
      <p className="text-2xl text-blue-700/90 mb-16 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        The advanced process simulation platform designed for modern engineers and scientists.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
        <FormulaCard 
          title="Reynolds Number" 
          formula="Re = ρvD/μ"
          className="bg-gradient-to-br from-purple-50 to-purple-100/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        />
        <FormulaCard 
          title="Bernoulli's Equation" 
          formula="P₁ + ½ρv₁² + ρgh₁ = P₂ + ½ρv₂² + ρgh₂"
          className="bg-gradient-to-br from-blue-50 to-blue-100/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        />
        <FormulaCard 
          title="Mass Balance" 
          formula="∑(ṁᵢₙ) = ∑(ṁₒᵤₜ)"
          className="bg-gradient-to-br from-cyan-50 to-cyan-100/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        />
        <FormulaCard 
          title="Energy Balance" 
          formula="Q - W = ΔE"
          className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        />
      </div>
      
      <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
        <Button
          onClick={handleEnterDashboard}
          className="px-8 py-6 text-lg font-medium rounded-xl 
            bg-gradient-to-r from-blue-600 to-purple-600 text-white
            shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          size="lg"
        >
          Enter Dashboard
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        
        <Button
          onClick={handleSignIn}
          className="px-8 py-6 text-lg font-medium rounded-xl 
            bg-gradient-to-r from-purple-500 to-pink-500 text-white
            shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          size="lg"
        >
          Sign In / Sign Up
          <LogIn className="ml-2 h-5 w-5" />
        </Button>
      </div>

      <div className="flex gap-6 justify-center mt-16 mb-8 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
        <div className="p-2 rounded-full bg-blue-100">
          <Beaker className="h-8 w-8 text-blue-500 animate-bounce" />
        </div>
        <div className="p-2 rounded-full bg-purple-100">
          <FlaskConical className="h-8 w-8 text-purple-500 animate-bounce" style={{ animationDelay: "0.1s" }} />
        </div>
        <div className="p-2 rounded-full bg-cyan-100">
          <Atom className="h-8 w-8 text-cyan-500 animate-bounce" style={{ animationDelay: "0.2s" }} />
        </div>
        <div className="p-2 rounded-full bg-indigo-100">
          <Calculator className="h-8 w-8 text-indigo-500 animate-bounce" style={{ animationDelay: "0.3s" }} />
        </div>
      </div>
      
      <div className="text-gray-600 text-sm font-medium animate-fade-in" style={{ animationDelay: "0.6s" }}>
        © {new Date().getFullYear()} ChemFlow | Process Simulation Reimagined
      </div>
    </div>
  );
};

export default LandingContent;
