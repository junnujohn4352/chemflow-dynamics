
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import AspenCalculations from "@/components/simulation/AspenCalculations";
import Footer from "@/components/layout/Footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { 
  Thermometer, Gauge, Beaker, Flask, 
  Droplets, Waves, Shield, Zap, DollarSign 
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// List of calculation categories with their descriptions and icons
const calculationCategories = [
  {
    id: "thermodynamic",
    name: "Thermodynamic & Physical Properties",
    icon: <Thermometer className="h-5 w-5" />,
    description: "Calculate phase equilibrium, EOS, activity coefficients, and thermodynamic properties",
    calculations: [
      "Vapor-liquid equilibrium (VLE)",
      "Liquid-liquid equilibrium (LLE)",
      "Solid-liquid equilibrium (SLE)",
      "Equation of State (EOS) calculations",
      "Activity coefficient models",
      "Enthalpy and entropy calculations",
      "Fugacity and phase stability analysis",
      "Compressibility factor (Z-factor) calculations"
    ]
  },
  {
    id: "process",
    name: "Process Simulation & Unit Operations",
    icon: <Gauge className="h-5 w-5" />,
    description: "Perform mass/energy balances, flow sheeting, optimization, and equipment sizing",
    calculations: [
      "Mass and energy balance",
      "Flow sheeting for steady-state and dynamic simulations",
      "Process optimization",
      "Sensitivity analysis",
      "Hydraulic calculations",
      "Equipment sizing",
      "Column convergence and tray analysis"
    ]
  },
  {
    id: "heat",
    name: "Heat Transfer & Exchanger Design",
    icon: <Zap className="h-5 w-5" />,
    description: "Design heat exchangers, calculate temperature profiles, and optimize energy use",
    calculations: [
      "Log Mean Temperature Difference (LMTD) method",
      "Effectiveness-NTU (ε-NTU) method",
      "Heat exchanger sizing and rating",
      "Pinch analysis for energy optimization",
      "Fouling factor calculations",
      "Heat loss and heat duty calculations"
    ]
  },
  {
    id: "reaction",
    name: "Reaction Engineering",
    icon: <Flask className="h-5 w-5" />,
    description: "Model reactors, analyze kinetics, and optimize reaction conditions",
    calculations: [
      "Reactor modeling (PFR, CSTR, Batch)",
      "Reaction kinetics analysis",
      "Equilibrium conversions",
      "Heat of reaction calculations",
      "Reaction yield and selectivity optimization"
    ]
  },
  {
    id: "distillation",
    name: "Distillation & Separation Processes",
    icon: <Beaker className="h-5 w-5" />,
    description: "Design and optimize distillation columns and other separation processes",
    calculations: [
      "McCabe-Thiele method for distillation",
      "Fenske-Underwood-Gilliland method",
      "Rigorous distillation column simulations",
      "Packed and tray column design",
      "Absorption and stripping calculations",
      "Azeotropic and extractive distillation modeling",
      "Multicomponent distillation",
      "Mass transfer rate-based modeling"
    ]
  },
  {
    id: "fluid",
    name: "Fluid Flow & Pipeline Hydraulics",
    icon: <Waves className="h-5 w-5" />,
    description: "Calculate pressure drops, model flows, and size pumps and compressors",
    calculations: [
      "Pressure drop calculations (Darcy-Weisbach, Hazen-Williams)",
      "Two-phase flow modeling",
      "Pump sizing and NPSH calculations",
      "Compressor power requirements",
      "Surge analysis and relief system design"
    ]
  },
  {
    id: "safety",
    name: "Process Safety & Environmental Calculations",
    icon: <Shield className="h-5 w-5" />,
    description: "Size relief systems, analyze hazards, and assess environmental impacts",
    calculations: [
      "Flare and vent system sizing",
      "Relief valve sizing (API 520/521)",
      "Emission modeling and dispersion analysis",
      "Fire and explosion consequence modeling",
      "Environmental impact assessments"
    ]
  },
  {
    id: "utilities",
    name: "Utilities & Energy Optimization",
    icon: <Zap className="h-5 w-5" />,
    description: "Model utility systems and optimize energy consumption",
    calculations: [
      "Steam network modeling",
      "Fuel gas system optimization",
      "Cogeneration and waste heat recovery",
      "Refrigeration cycle modeling",
      "Utility cost and energy efficiency analysis"
    ]
  },
  {
    id: "economic",
    name: "Economic Analysis",
    icon: <DollarSign className="h-5 w-5" />,
    description: "Estimate costs, calculate returns, and analyze project economics",
    calculations: [
      "Capital cost estimation",
      "Operating cost analysis",
      "Payback period and return on investment (ROI)",
      "Net present value (NPV) and internal rate of return (IRR)"
    ]
  }
];

const HysysCalculations = () => {
  const [activeCategory, setActiveCategory] = useState(calculationCategories[0].id);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 dark:text-white">
      <Navbar />
      
      <main className="flex-1 py-16 px-6 animate-fade-in">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-8 relative">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: "2s" }}></div>
            
            <h1 className="text-4xl font-display font-bold mb-4 bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent relative z-10">
              Aspen HYSYS Calculations
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl relative z-10">
              Access a comprehensive library of chemical process calculations with real-time analysis 
              and modern visualization tools that enhance your workflow.
            </p>
            <div className="mt-4 flex flex-wrap gap-3 relative z-10">
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 shadow-sm hover:shadow transform hover:scale-105 transition-all">
                Real-time Analysis
              </span>
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 shadow-sm hover:shadow transform hover:scale-105 transition-all">
                Step-by-step Calculations
              </span>
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 shadow-sm hover:shadow transform hover:scale-105 transition-all">
                Interactive Examples
              </span>
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 shadow-sm hover:shadow transform hover:scale-105 transition-all">
                Aspen HYSYS Compatible
              </span>
            </div>
          </div>
          
          <div className="glass-panel relative z-10 shadow-xl border border-white/30 backdrop-blur-sm">
            <TooltipProvider>
              <Tabs defaultValue={activeCategory} onValueChange={setActiveCategory} className="w-full">
                <div className="overflow-x-auto pb-3">
                  <TabsList className="bg-blue-50/50 dark:bg-gray-800/50 p-1 flex space-x-1 flex-nowrap min-w-max">
                    {calculationCategories.map((category) => (
                      <TabsTrigger
                        key={category.id}
                        value={category.id}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700",
                          "whitespace-nowrap text-sm font-medium"
                        )}
                      >
                        {category.icon}
                        <span>{category.name}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
                
                {calculationCategories.map((category) => (
                  <TabsContent
                    key={category.id}
                    value={category.id}
                    className="p-6 focus:outline-none"
                  >
                    <div className="max-w-screen-lg mx-auto">
                      <div className="mb-6">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
                          {category.name}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                          {category.description}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-white/70 dark:bg-gray-800/50 p-5 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                          <h3 className="text-lg font-semibold mb-3 text-blue-700 dark:text-blue-400">
                            Available Calculations
                          </h3>
                          <ul className="space-y-2">
                            {category.calculations.map((calc, index) => (
                              <li key={index} className="flex items-start">
                                <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-1.5 mr-2 flex-shrink-0"></span>
                                <span className="text-sm text-gray-700 dark:text-gray-300">{calc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <AspenCalculations calculationType={category.id} className="h-full" />
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </TooltipProvider>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HysysCalculations;
