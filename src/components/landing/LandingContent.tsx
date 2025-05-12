
import React from "react";
import { useNavigate } from "react-router-dom";
import ChemFlowLogo from "@/assets/icons/ChemFlowLogo";
import FormulaCard from "./FormulaCard";

const LandingContent: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center max-w-5xl mx-auto py-16 px-6 relative">
      {/* Background styling elements */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float"></div>
      <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float-reverse" style={{ animationDelay: "2s" }}></div>
      <div className="absolute top-40 left-1/4 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-float" style={{ animationDelay: "4s" }}></div>
      <div className="absolute bottom-40 right-1/4 w-40 h-40 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-float-reverse" style={{ animationDelay: "3s" }}></div>
      
      {/* Logo */}
      <div className="flex justify-center mb-10 hover:scale-105 transition-transform animate-scale-in">
        <ChemFlowLogo className="h-32 w-auto drop-shadow-lg" />
      </div>
      
      {/* Main title */}
      <h1 className="text-6xl md:text-7xl font-display font-bold leading-tight mb-8 
        bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in-up">
        ChemFlow Simulator
      </h1>
      
      <p className="text-2xl text-blue-700/90 mb-16 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        CAPE-OPEN to CAPE-OPEN process simulation environment for chemical engineering.
      </p>

      {/* Key formulas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
        <FormulaCard 
          title="Material Balance" 
          formula="∑(ṁᵢₙ) = ∑(ṁₒᵤₜ)"
          className="bg-gradient-to-br from-blue-50 to-blue-100/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        />
        <FormulaCard 
          title="Energy Balance" 
          formula="Q - W = ΔH"
          className="bg-gradient-to-br from-cyan-50 to-cyan-100/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        />
        <FormulaCard 
          title="Raoult's Law" 
          formula="Pᵢ = xᵢP°ᵢ"
          className="bg-gradient-to-br from-purple-50 to-purple-100/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        />
        <FormulaCard 
          title="Peng-Robinson" 
          formula="P = RT/(V-b) - a/[V(V+b)+b(V-b)]"
          className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        />
      </div>
      
      {/* Description of COCO capabilities */}
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-md border border-blue-100 mb-8">
        <h2 className="text-2xl font-semibold text-blue-800 mb-3">About ChemFlow Simulator</h2>
        <p className="text-gray-700 mb-4">
          ChemFlow is based on COCO, a free-of-charge CAPE-OPEN compliant steady-state simulation environment consisting of the following components:
        </p>
        <ul className="text-left text-gray-700 space-y-2 mb-4 max-w-2xl mx-auto">
          <li>• <strong>COFE</strong> - The CAPE-OPEN Flowsheet Environment</li>
          <li>• <strong>CORN</strong> - The CAPE-OPEN Reaction Numerics package</li>
          <li>• <strong>COUSCOUS</strong> - The CAPE-OPEN Unit-operations Simple package</li>
          <li>• <strong>TEA</strong> - The Thermodynamics for Engineering Applications package</li>
        </ul>
        <p className="text-gray-700">
          Our web implementation brings these powerful tools to your browser for convenient chemical process simulation.
        </p>
      </div>
      
      <div className="text-gray-600 text-sm font-medium animate-fade-in" style={{ animationDelay: "0.6s" }}>
        © {new Date().getFullYear()} ChemFlow | Chemical Process Simulation Environment
      </div>
    </div>
  );
};

export default LandingContent;
