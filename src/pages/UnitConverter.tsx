
import React from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import UnitConverter from "@/components/tools/UnitConverter";
import { Calculator, Zap, ArrowRight, Ruler, Activity } from "lucide-react";

const UnitConverterPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 dark:text-white relative">
      <Navbar />
      
      {/* Enhanced Background Animations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-blue-200 opacity-20 animate-float" style={{ animationDuration: '8s' }}></div>
        <div className="absolute top-40 right-20 w-60 h-60 rounded-full bg-blue-300 opacity-30 animate-float" style={{ animationDuration: '12s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 rounded-full bg-indigo-200 opacity-20 animate-float" style={{ animationDuration: '10s' }}></div>
        <div className="absolute bottom-40 right-1/4 w-44 h-44 rounded-full bg-purple-200 opacity-25 animate-float" style={{ animationDuration: '13s' }}></div>
      </div>
      
      <main className="flex-1 py-16 px-6 animate-fade-in relative z-10">
        <div className="max-w-screen-xl mx-auto">
          <motion.div 
            className="mb-8 relative"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-display font-bold mb-4 bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent animate-pulse" style={{ animationDuration: '3s' }}>
              Chemical Engineering Unit Converter
            </h1>
            <p className="text-blue-700 dark:text-blue-300 max-w-3xl">
              Versatile tool for converting between units commonly used in chemical engineering applications and processes.
            </p>
          </motion.div>
          
          <motion.div 
            className="space-y-8 relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Feature highlights */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {[
                {
                  icon: <Calculator className="h-6 w-6 text-blue-500" />,
                  title: "20+ Unit Categories",
                  description: "All the chemical engineering conversions you need in one place"
                },
                {
                  icon: <Ruler className="h-6 w-6 text-purple-500" />,
                  title: "Precision Focused",
                  description: "High-accuracy conversions with proper scientific notation"
                },
                {
                  icon: <Zap className="h-6 w-6 text-amber-500" />,
                  title: "Favorites System",
                  description: "Save your most-used unit categories for quick access"
                },
                {
                  icon: <Activity className="h-6 w-6 text-emerald-500" />,
                  title: "Engineering Context",
                  description: "Learn when and where to apply different units"
                }
              ].map((feature, idx) => (
                <motion.div 
                  key={idx}
                  className="bg-white/80 dark:bg-blue-900/30 backdrop-blur-sm rounded-xl p-5 shadow hover:shadow-md transition-shadow border border-blue-100 dark:border-blue-800"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="h-12 w-12 rounded-full bg-blue-50 dark:bg-blue-800/50 flex items-center justify-center mb-3">
                    {feature.icon}
                  </div>
                  <h3 className="font-medium text-lg mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          
            <div className="bg-white/80 dark:bg-blue-900/30 backdrop-blur-md p-6 rounded-xl border border-blue-200 dark:border-blue-700 shadow-lg hover:shadow-blue-200 dark:hover:shadow-blue-900 transition-all transform hover:scale-[1.01]">
              <UnitConverter />
            </div>
            
            {/* Chemical engineering use cases */}
            <motion.div 
              className="mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <h2 className="text-2xl font-semibold mb-4 text-blue-700 dark:text-blue-300">Common Use Cases in Chemical Engineering</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Process Design",
                    description: "Convert between different unit systems when designing process equipment, calculating heat duties, or sizing reactors.",
                    examples: ["LMTD calculations", "Pipe sizing", "Heat exchanger specifications"]
                  },
                  {
                    title: "Reaction Engineering",
                    description: "Handle pressure, temperature, and concentration units when working with reaction kinetics and equilibrium calculations.",
                    examples: ["Rate constants", "Equilibrium conversions", "Activation energies"]
                  },
                  {
                    title: "Environmental Compliance",
                    description: "Convert between mass, concentration, and emission units to ensure regulatory requirements are met.",
                    examples: ["Emission rates", "Concentration limits", "Pollutant conversions"]
                  }
                ].map((useCase, idx) => (
                  <motion.div 
                    key={idx}
                    className="bg-gradient-to-br from-white to-blue-50 dark:from-blue-900/50 dark:to-indigo-900/50 p-5 rounded-xl shadow border border-blue-100 dark:border-blue-800"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.6 + idx * 0.1 }}
                  >
                    <div className="flex items-center mb-3">
                      <ArrowRight className="h-5 w-5 text-blue-500 mr-2" />
                      <h3 className="font-medium text-lg text-gray-900 dark:text-white">{useCase.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{useCase.description}</p>
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
                      <p className="text-xs text-blue-700 dark:text-blue-300 font-medium mb-1">Examples:</p>
                      <ul className="list-disc pl-5 text-xs text-blue-600 dark:text-blue-400">
                        {useCase.examples.map((example, i) => (
                          <li key={i}>{example}</li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UnitConverterPage;
