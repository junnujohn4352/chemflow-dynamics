
import React from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import GlassPanel from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/button";
import { 
  Calculator, 
  BookOpen, 
  FlaskConical,
  ArrowRight,
  Atom,
  Thermometer,
  Waves,
  Beaker,
  ArrowRightLeft
} from "lucide-react";

const ChemicalTools = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="py-10 px-6 max-w-screen-xl mx-auto bg-gradient-to-b from-blue-50 to-indigo-100 min-h-screen">
        {/* Background Animations */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-blue-200 opacity-20 animate-float" style={{ animationDuration: '8s' }}></div>
          <div className="absolute top-40 right-20 w-60 h-60 rounded-full bg-blue-300 opacity-30 animate-float" style={{ animationDuration: '12s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-80 h-80 rounded-full bg-indigo-200 opacity-20 animate-float" style={{ animationDuration: '10s' }}></div>
        </div>
        
        <div className="mb-8 relative z-10">
          <h1 className="text-4xl font-display font-bold mb-4 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent animate-pulse" style={{ animationDuration: '3s' }}>
            Chemical Engineering Tools
          </h1>
          <p className="text-blue-700 dark:text-blue-300 max-w-3xl">
            Access powerful tools for chemical engineering calculations, simulations, and unit conversions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {/* Chemical Formulas Panel */}
          <GlassPanel className="flex flex-col h-full transform hover:scale-105 transition-all duration-300 border-blue-200 shadow-lg shadow-blue-100 hover:shadow-blue-200">
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4 animate-pulse" style={{ animationDuration: '4s' }}>
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-blue-700">Chemical Formulas</h2>
            <p className="text-blue-600 mb-6 flex-grow">
              Access a comprehensive database of chemical engineering formulas, equations, and correlations for various applications.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-center bg-blue-50 p-2 rounded-lg transform hover:translate-x-2 transition-transform">
                <Atom className="mr-2 h-5 w-5 text-blue-600" />
                <span className="text-blue-700">Thermodynamics</span>
              </div>
              <div className="flex items-center bg-blue-50 p-2 rounded-lg transform hover:translate-x-2 transition-transform">
                <Thermometer className="mr-2 h-5 w-5 text-blue-600" />
                <span className="text-blue-700">Heat Transfer</span>
              </div>
              <div className="flex items-center bg-blue-50 p-2 rounded-lg transform hover:translate-x-2 transition-transform">
                <Waves className="mr-2 h-5 w-5 text-blue-600" />
                <span className="text-blue-700">Fluid Mechanics</span>
              </div>
            </div>
            <Button 
              onClick={() => navigate("/chemical-formulas")}
              className="w-full justify-between bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 shadow-md"
            >
              Browse Formulas
              <ArrowRight className="h-4 w-4 animate-bounce" />
            </Button>
          </GlassPanel>

          {/* Simulation Panel */}
          <GlassPanel className="flex flex-col h-full transform hover:scale-105 transition-all duration-300 border-purple-200 shadow-lg shadow-purple-100 hover:shadow-purple-200">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4 animate-pulse" style={{ animationDuration: '5s' }}>
              <FlaskConical className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-purple-700">Process Simulation</h2>
            <p className="text-purple-600 mb-6 flex-grow">
              Design and analyze chemical processes with our advanced simulation tools for creating and optimizing process flowsheets.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-center bg-purple-50 p-2 rounded-lg transform hover:translate-x-2 transition-transform">
                <Beaker className="mr-2 h-5 w-5 text-purple-600" />
                <span className="text-purple-700">Equipment Models</span>
              </div>
              <div className="flex items-center bg-purple-50 p-2 rounded-lg transform hover:translate-x-2 transition-transform">
                <Calculator className="mr-2 h-5 w-5 text-purple-600" />
                <span className="text-purple-700">Process Analysis</span>
              </div>
              <div className="flex items-center bg-purple-50 p-2 rounded-lg transform hover:translate-x-2 transition-transform">
                <Thermometer className="mr-2 h-5 w-5 text-purple-600" />
                <span className="text-purple-700">Thermodynamic Models</span>
              </div>
            </div>
            <Button 
              onClick={() => navigate("/intelligent-simulation")}
              className="w-full justify-between bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 shadow-md"
            >
              Start Simulation
              <ArrowRight className="h-4 w-4 animate-bounce" />
            </Button>
          </GlassPanel>

          {/* Unit Converter Panel */}
          <GlassPanel className="flex flex-col h-full transform hover:scale-105 transition-all duration-300 border-indigo-200 shadow-lg shadow-indigo-100 hover:shadow-indigo-200">
            <div className="bg-gradient-to-br from-indigo-400 to-blue-600 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4 animate-pulse" style={{ animationDuration: '4.5s' }}>
              <ArrowRightLeft className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-indigo-700">Unit Converter</h2>
            <p className="text-indigo-600 mb-6 flex-grow">
              Quickly convert between different units of measurement commonly used in chemical engineering calculations.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-center bg-indigo-50 p-2 rounded-lg transform hover:translate-x-2 transition-transform">
                <Calculator className="mr-2 h-5 w-5 text-indigo-600" />
                <span className="text-indigo-700">Temperature & Pressure</span>
              </div>
              <div className="flex items-center bg-indigo-50 p-2 rounded-lg transform hover:translate-x-2 transition-transform">
                <Calculator className="mr-2 h-5 w-5 text-indigo-600" />
                <span className="text-indigo-700">Flow & Volume</span>
              </div>
              <div className="flex items-center bg-indigo-50 p-2 rounded-lg transform hover:translate-x-2 transition-transform">
                <Calculator className="mr-2 h-5 w-5 text-indigo-600" />
                <span className="text-indigo-700">Energy & Power</span>
              </div>
            </div>
            <Button 
              onClick={() => navigate("/unit-converter")}
              className="w-full justify-between bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 shadow-md"
            >
              Open Converter
              <ArrowRight className="h-4 w-4 animate-bounce" />
            </Button>
          </GlassPanel>
        </div>
      </div>
    </Layout>
  );
};

export default ChemicalTools;
