
import React, { useState } from "react";
import GlassPanel from "@/components/ui/GlassPanel";
import { cn } from "@/lib/utils";
import { Calculator, Droplets, Beaker, Thermometer, Waves, Zap, Shield, Cpu, Leaf } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface AspenCalculationsProps {
  className?: string;
}

const AspenCalculations: React.FC<AspenCalculationsProps> = ({ className }) => {
  const { toast } = useToast();
  const [calculationType, setCalculationType] = useState<string | null>(null);
  const [calculationProgress, setCalculationProgress] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [results, setResults] = useState<any>(null);

  const calculationTypes = [
    { id: "vle", name: "Vapor-Liquid Equilibrium", icon: Droplets, description: "Calculate phase equilibrium properties" },
    { id: "energy", name: "Energy Balance", icon: Zap, description: "Energy flow analysis and optimization" },
    { id: "reaction", name: "Reaction Kinetics", icon: Beaker, description: "Model chemical reaction rates" },
    { id: "transport", name: "Transport Properties", icon: Waves, description: "Calculate fluid dynamic properties" },
    { id: "thermodynamic", name: "Thermodynamic Properties", icon: Thermometer, description: "Enthalpy, entropy, and Gibbs energy" },
    { id: "equipment", name: "Equipment Sizing", icon: Calculator, description: "Size process equipment based on flow" },
    { id: "environment", name: "Environmental Impact", icon: Leaf, description: "Calculate emissions and sustainability metrics" },
    { id: "safety", name: "Safety Analysis", icon: Shield, description: "Analyze process hazards and risks" },
    { id: "optimization", name: "Process Optimization", icon: Cpu, description: "Optimize parameters for efficiency" }
  ];

  const performCalculation = (type: string) => {
    setCalculationType(type);
    setCalculationProgress(0);
    setIsCalculating(true);
    setResults(null);
    
    // Simulated calculation
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setCalculationProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setIsCalculating(false);
        
        // Use built-in calculations based on type
        if (type === "vle") {
          setResults({
            components: ["Methane", "Ethane", "Propane"],
            temperature: 298.15,
            pressure: 101.325,
            results: [
              { component: "Methane", liquidMoleFraction: 0.05, vaporMoleFraction: 0.65 },
              { component: "Ethane", liquidMoleFraction: 0.15, vaporMoleFraction: 0.25 },
              { component: "Propane", liquidMoleFraction: 0.80, vaporMoleFraction: 0.10 }
            ]
          });
        } else if (type === "energy") {
          setResults({
            inputs: [
              { stream: "Feed", enthalpy: -25.6 },
              { stream: "Steam", enthalpy: -45.2 }
            ],
            outputs: [
              { stream: "Product", enthalpy: -35.8 },
              { stream: "Waste", enthalpy: -12.4 }
            ],
            balance: -22.6,
            efficiency: 0.86
          });
        } else if (type === "thermodynamic") {
          setResults({
            components: [
              { name: "Methane", enthalpy: -74.8, entropy: 186.2, gibbs: -50.8 },
              { name: "Ethane", enthalpy: -84.7, entropy: 229.5, gibbs: -32.9 },
              { name: "Water", enthalpy: -285.8, entropy: 69.9, gibbs: -237.1 }
            ]
          });
        } else {
          // Default message for other calculation types
          setResults({
            message: "This calculation type is currently not supported with built-in calculations. Please try another type.",
            simulationRequired: true
          });
        }
        
        toast({
          title: "Calculation complete",
          description: `The ${calculationTypes.find(c => c.id === type)?.name || type} calculation has finished.`
        });
      }
    }, 100);
    
    return () => clearInterval(interval);
  };

  return (
    <div className={cn("w-full", className)}>
      <GlassPanel className="p-6">
        <h2 className="text-2xl font-medium mb-6">Aspen HYSYS Calculations</h2>
        
        {!calculationType ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {calculationTypes.map((calc) => (
              <div
                key={calc.id}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors cursor-pointer group"
                onClick={() => performCalculation(calc.id)}
              >
                <div className="flex items-center mb-2">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                    <calc.icon className="h-5 w-5 text-flow-blue dark:text-blue-400" />
                  </div>
                  <h3 className="font-medium text-lg">{calc.name}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{calc.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium">
                {calculationTypes.find(c => c.id === calculationType)?.name || calculationType}
              </h3>
              <Button
                variant="outline"
                onClick={() => setCalculationType(null)}
              >
                Choose Another Calculation
              </Button>
            </div>
            
            {isCalculating ? (
              <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
                <p className="mb-2">Performing calculation...</p>
                <Progress value={calculationProgress} className="mb-2" />
                <p className="text-sm text-gray-500">{calculationProgress}% complete</p>
              </div>
            ) : (
              <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h4 className="text-lg font-medium mb-4">Results</h4>
                
                {results && results.simulationRequired ? (
                  <div className="text-center py-8">
                    <p>{results.message}</p>
                  </div>
                ) : results && results.components && results.temperature ? (
                  <div>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Temperature</p>
                        <p className="text-lg font-medium">{results.temperature} K</p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Pressure</p>
                        <p className="text-lg font-medium">{results.pressure} kPa</p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Components</p>
                        <p className="text-lg font-medium">{results.components.length}</p>
                      </div>
                    </div>
                    
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800">
                          <th className="border border-gray-200 dark:border-gray-700 p-2 text-left">Component</th>
                          <th className="border border-gray-200 dark:border-gray-700 p-2 text-left">Liquid Mole Fraction</th>
                          <th className="border border-gray-200 dark:border-gray-700 p-2 text-left">Vapor Mole Fraction</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.results.map((result: any, i: number) => (
                          <tr key={i}>
                            <td className="border border-gray-200 dark:border-gray-700 p-2">{result.component}</td>
                            <td className="border border-gray-200 dark:border-gray-700 p-2">{result.liquidMoleFraction}</td>
                            <td className="border border-gray-200 dark:border-gray-700 p-2">{result.vaporMoleFraction}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : results && results.inputs ? (
                  <div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <h5 className="font-medium mb-2">Inputs</h5>
                        <div className="space-y-2">
                          {results.inputs.map((input: any, i: number) => (
                            <div key={i} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg flex justify-between">
                              <span>{input.stream}</span>
                              <span className="font-medium">{input.enthalpy} kJ/mol</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Outputs</h5>
                        <div className="space-y-2">
                          {results.outputs.map((output: any, i: number) => (
                            <div key={i} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg flex justify-between">
                              <span>{output.stream}</span>
                              <span className="font-medium">{output.enthalpy} kJ/mol</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Energy Balance</p>
                        <p className="text-lg font-medium">{results.balance} kJ/mol</p>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Process Efficiency</p>
                        <p className="text-lg font-medium">{(results.efficiency * 100).toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>
                ) : results && results.components && results.components[0].enthalpy ? (
                  <div>
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800">
                          <th className="border border-gray-200 dark:border-gray-700 p-2 text-left">Component</th>
                          <th className="border border-gray-200 dark:border-gray-700 p-2 text-left">Enthalpy (kJ/mol)</th>
                          <th className="border border-gray-200 dark:border-gray-700 p-2 text-left">Entropy (J/mol·K)</th>
                          <th className="border border-gray-200 dark:border-gray-700 p-2 text-left">Gibbs Energy (kJ/mol)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.components.map((comp: any, i: number) => (
                          <tr key={i}>
                            <td className="border border-gray-200 dark:border-gray-700 p-2">{comp.name}</td>
                            <td className="border border-gray-200 dark:border-gray-700 p-2">{comp.enthalpy}</td>
                            <td className="border border-gray-200 dark:border-gray-700 p-2">{comp.entropy}</td>
                            <td className="border border-gray-200 dark:border-gray-700 p-2">{comp.gibbs}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p>No result data available.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </GlassPanel>
    </div>
  );
};

export default AspenCalculations;
