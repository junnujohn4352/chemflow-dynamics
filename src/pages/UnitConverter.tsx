
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import UnitConverter from "@/components/tools/UnitConverter";

const UnitConverterPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 dark:text-white relative">
      <Navbar />
      
      {/* Background Animations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-blue-200 opacity-20 animate-float" style={{ animationDuration: '8s' }}></div>
        <div className="absolute top-40 right-20 w-60 h-60 rounded-full bg-blue-300 opacity-30 animate-float" style={{ animationDuration: '12s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 rounded-full bg-indigo-200 opacity-20 animate-float" style={{ animationDuration: '10s' }}></div>
      </div>
      
      <main className="flex-1 py-16 px-6 animate-fade-in relative z-10">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-8 relative">
            <h1 className="text-4xl font-display font-bold mb-4 bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent animate-pulse" style={{ animationDuration: '3s' }}>
              Unit Converter
            </h1>
            <p className="text-blue-700 dark:text-blue-300 max-w-3xl">
              Convert between different units of measurement for chemical engineering applications.
            </p>
          </div>
          
          <div className="space-y-8 relative z-10">
            <div className="bg-white/80 dark:bg-blue-900/50 backdrop-blur-md p-6 rounded-xl border border-blue-200 dark:border-blue-700 shadow-lg hover:shadow-blue-200 dark:hover:shadow-blue-700 transition-all transform hover:scale-[1.01]">
              <UnitConverter />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UnitConverterPage;
