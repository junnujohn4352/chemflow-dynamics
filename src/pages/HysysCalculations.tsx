
import React from "react";
import Navbar from "@/components/layout/Navbar";
import AspenCalculations from "@/components/simulation/AspenCalculations";
import Footer from "@/components/layout/Footer";
import { TooltipProvider } from "@/components/ui/tooltip";

const HysysCalculations = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 dark:text-white">
      <Navbar />
      
      <main className="flex-1 py-16 px-6 animate-fade-in">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-8 relative">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: "2s" }}></div>
            
            <h1 className="text-4xl font-display font-bold mb-4 bg-gradient-to-r from-flow-blue to-blue-600 bg-clip-text text-transparent relative z-10">
              Aspen HYSYS Calculations
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl relative z-10">
              Access a comprehensive library of chemical process calculations with real-time analysis 
              and modern visualization tools that enhance your workflow.
            </p>
            <div className="mt-4 flex flex-wrap gap-3 relative z-10">
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-flow-blue/10 text-flow-blue shadow-sm hover:shadow transform hover:scale-105 transition-all">
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
              <AspenCalculations />
            </TooltipProvider>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HysysCalculations;
