
import React from "react";
import Navbar from "@/components/layout/Navbar";
import AspenCalculations from "@/components/simulation/AspenCalculations";
import Footer from "@/components/layout/Footer";

const HysysCalculations = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-1 py-16 px-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold mb-2 dark:text-white">Aspen HYSYS Calculations</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Access a comprehensive library of chemical process calculations and analyses
            </p>
          </div>
          
          <AspenCalculations />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HysysCalculations;
