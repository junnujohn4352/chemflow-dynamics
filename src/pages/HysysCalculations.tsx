
import React from "react";
import Navbar from "@/components/layout/Navbar";
import AspenCalculations from "@/components/simulation/AspenCalculations";
import Footer from "@/components/layout/Footer";
import { TooltipProvider } from "@/components/ui/tooltip";

const HysysCalculations = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-1 py-16 px-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold mb-2 dark:text-white">Aspen HYSYS Calculations</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Access a comprehensive library of chemical process calculations with real-time analysis
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-flow-blue/10 text-flow-blue">
                Real-time Analysis
              </span>
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                Step-by-step Calculations
              </span>
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                Interactive Examples
              </span>
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                Aspen HYSYS Compatible
              </span>
            </div>
          </div>
          
          <TooltipProvider>
            <AspenCalculations />
          </TooltipProvider>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HysysCalculations;
