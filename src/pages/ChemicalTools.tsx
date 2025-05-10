
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
  ArrowRightLeft // Replaced 'Convert' with 'ArrowRightLeft' which is a valid icon for conversions
} from "lucide-react";

const ChemicalTools = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="py-10 px-6 max-w-screen-xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold mb-4 bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-700 bg-clip-text text-transparent">
            Chemical Engineering Tools
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl">
            Access powerful tools for chemical engineering calculations, simulations, and unit conversions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Chemical Formulas Panel */}
          <GlassPanel className="flex flex-col h-full">
            <div className="bg-blue-50 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Chemical Formulas</h2>
            <p className="text-gray-600 mb-6 flex-grow">
              Access a comprehensive database of chemical engineering formulas, equations, and correlations for various applications.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-center">
                <Atom className="mr-2 h-5 w-5 text-blue-600" />
                <span>Thermodynamics</span>
              </div>
              <div className="flex items-center">
                <Thermometer className="mr-2 h-5 w-5 text-blue-600" />
                <span>Heat Transfer</span>
              </div>
              <div className="flex items-center">
                <Waves className="mr-2 h-5 w-5 text-blue-600" />
                <span>Fluid Mechanics</span>
              </div>
            </div>
            <Button 
              onClick={() => navigate("/chemical-formulas")}
              className="w-full justify-between"
            >
              Browse Formulas
              <ArrowRight className="h-4 w-4" />
            </Button>
          </GlassPanel>

          {/* Simulation Panel */}
          <GlassPanel className="flex flex-col h-full">
            <div className="bg-purple-50 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
              <FlaskConical className="h-8 w-8 text-purple-600" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Process Simulation</h2>
            <p className="text-gray-600 mb-6 flex-grow">
              Design and analyze chemical processes with our advanced simulation tools for creating and optimizing process flowsheets.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-center">
                <Beaker className="mr-2 h-5 w-5 text-purple-600" />
                <span>Equipment Models</span>
              </div>
              <div className="flex items-center">
                <Calculator className="mr-2 h-5 w-5 text-purple-600" />
                <span>Process Analysis</span>
              </div>
              <div className="flex items-center">
                <Thermometer className="mr-2 h-5 w-5 text-purple-600" />
                <span>Thermodynamic Models</span>
              </div>
            </div>
            <Button 
              onClick={() => navigate("/intelligent-simulation")}
              className="w-full justify-between bg-purple-600 hover:bg-purple-700"
            >
              Start Simulation
              <ArrowRight className="h-4 w-4" />
            </Button>
          </GlassPanel>

          {/* Unit Converter Panel */}
          <GlassPanel className="flex flex-col h-full">
            <div className="bg-indigo-50 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
              <ArrowRightLeft className="h-8 w-8 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Unit Converter</h2>
            <p className="text-gray-600 mb-6 flex-grow">
              Quickly convert between different units of measurement commonly used in chemical engineering calculations.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-center">
                <Calculator className="mr-2 h-5 w-5 text-indigo-600" />
                <span>Temperature & Pressure</span>
              </div>
              <div className="flex items-center">
                <Calculator className="mr-2 h-5 w-5 text-indigo-600" />
                <span>Flow & Volume</span>
              </div>
              <div className="flex items-center">
                <Calculator className="mr-2 h-5 w-5 text-indigo-600" />
                <span>Energy & Power</span>
              </div>
            </div>
            <Button 
              onClick={() => navigate("/unit-converter")}
              className="w-full justify-between bg-indigo-600 hover:bg-indigo-700"
            >
              Open Converter
              <ArrowRight className="h-4 w-4" />
            </Button>
          </GlassPanel>
        </div>
      </div>
    </Layout>
  );
};

export default ChemicalTools;
