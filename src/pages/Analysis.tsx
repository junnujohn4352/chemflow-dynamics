
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GlassPanel from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";
import UnitConverter from "@/components/tools/UnitConverter";

const Analysis = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 dark:text-white">
      <Navbar />
      
      <main className="flex-1 py-16 px-6 animate-fade-in">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-8 relative">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: "2s" }}></div>
            
            <h1 className="text-4xl font-display font-bold mb-4 bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent relative z-10">
              Process Analysis
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl relative z-10">
              Analyze and optimize your chemical processes with advanced tools and unit conversion capabilities.
            </p>
            <div className="mt-4 flex flex-wrap gap-3 relative z-10">
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 shadow-sm hover:shadow transform hover:scale-105 transition-all">
                Detailed Analytics
              </span>
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 shadow-sm hover:shadow transform hover:scale-105 transition-all">
                Process Optimization
              </span>
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 shadow-sm hover:shadow transform hover:scale-105 transition-all">
                Unit Conversion
              </span>
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 shadow-sm hover:shadow transform hover:scale-105 transition-all">
                Efficiency Analysis
              </span>
            </div>
          </div>
          
          <div className="space-y-8 relative z-10">
            <GlassPanel className="p-6">
              <div className="flex items-center mb-4">
                <BarChart3 className="h-6 w-6 mr-2 text-flow-blue" />
                <h2 className="text-xl font-bold">Process Performance Analysis</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Visualize and analyze the performance metrics of your chemical processes to identify optimization opportunities.
              </p>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium mb-2">Efficiency Metrics</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Key performance indicators for your process efficiency.
                  </p>
                  <Button variant="outline" className="w-full">View Metrics</Button>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium mb-2">Energy Analysis</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Detailed breakdown of energy consumption in your processes.
                  </p>
                  <Button variant="outline" className="w-full">Analyze Energy</Button>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium mb-2">Mass Balance</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Comprehensive mass balance analysis for your chemical processes.
                  </p>
                  <Button variant="outline" className="w-full">Calculate Balance</Button>
                </div>
              </div>
            </GlassPanel>
            
            {/* Unit Converter Component */}
            <UnitConverter />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Analysis;
