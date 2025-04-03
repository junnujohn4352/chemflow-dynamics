import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GlassPanel from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/button";
import { BarChart3, Droplets, Zap, Activity, ChartPie, ArrowRight } from "lucide-react";
import UnitConverter from "@/components/tools/UnitConverter";
import { toast } from "sonner";

const Analysis = () => {
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [efficiencyData, setEfficiencyData] = useState({
    overallEfficiency: 78,
    equipmentEfficiency: 82,
    thermalEfficiency: 75,
    massRecovery: 92,
    energyUtilization: 68
  });
  
  const [energyData, setEnergyData] = useState({
    totalEnergy: 12500, // kWh
    heating: 7800, // kWh
    cooling: 3200, // kWh
    pumping: 950, // kWh
    other: 550, // kWh
    co2Emissions: 4200 // kg CO2
  });
  
  const [massBalanceData, setMassBalanceData] = useState({
    input: {
      stream1: 1200, // kg/h
      stream2: 850, // kg/h
      stream3: 320, // kg/h
    },
    output: {
      product1: 980, // kg/h
      product2: 620, // kg/h
      waste: 710, // kg/h
      losses: 60 // kg/h
    },
    components: {
      componentA: { in: 720, out: 705 }, // kg/h
      componentB: { in: 980, out: 952 }, // kg/h
      componentC: { in: 670, out: 653 }, // kg/h
    }
  });

  const inputTotal = Object.values(massBalanceData.input).reduce((acc, val) => acc + val, 0);
  const outputTotal = Object.values(massBalanceData.output).reduce((acc, val) => acc + val, 0);
  const massBalance = ((outputTotal / inputTotal) * 100).toFixed(1);

  const renderMetricsPanel = () => {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 animate-fade-in">
        <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white flex items-center">
          <ChartPie className="mr-2 h-5 w-5 text-blue-500" />
          Efficiency Metrics
        </h3>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-300">Overall Process Efficiency</span>
              <span className="font-medium text-blue-600 dark:text-blue-400">{efficiencyData.overallEfficiency}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${efficiencyData.overallEfficiency}%` }}></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-300">Equipment Efficiency</span>
                <span className="font-medium text-green-600 dark:text-green-400">{efficiencyData.equipmentEfficiency}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${efficiencyData.equipmentEfficiency}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-300">Thermal Efficiency</span>
                <span className="font-medium text-amber-600 dark:text-amber-400">{efficiencyData.thermalEfficiency}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: `${efficiencyData.thermalEfficiency}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-300">Mass Recovery</span>
                <span className="font-medium text-purple-600 dark:text-purple-400">{efficiencyData.massRecovery}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${efficiencyData.massRecovery}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-300">Energy Utilization</span>
                <span className="font-medium text-red-600 dark:text-red-400">{efficiencyData.energyUtilization}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${efficiencyData.energyUtilization}%` }}></div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <button 
              onClick={() => {
                toast.success("Report generated successfully");
              }}
              className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
            >
              Generate Report
            </button>
            <button
              onClick={() => {
                toast.success("Data exported successfully");
              }}
              className="bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Export Data
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderEnergyPanel = () => {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 animate-fade-in">
        <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white flex items-center">
          <Zap className="mr-2 h-5 w-5 text-amber-500" />
          Energy Analysis
        </h3>
        
        <div className="mb-6">
          <h4 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-200">Energy Consumption Breakdown</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg dark:bg-gray-700">
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-300">Total Energy Consumption</span>
                  <span className="font-medium text-amber-600">{energyData.totalEnergy.toLocaleString()} kWh</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-300">Heating</span>
                    <span className="font-medium">{energyData.heating.toLocaleString()} kWh ({((energyData.heating / energyData.totalEnergy) * 100).toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(energyData.heating / energyData.totalEnergy) * 100}%` }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-300">Cooling</span>
                    <span className="font-medium">{energyData.cooling.toLocaleString()} kWh ({((energyData.cooling / energyData.totalEnergy) * 100).toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(energyData.cooling / energyData.totalEnergy) * 100}%` }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-300">Pumping</span>
                    <span className="font-medium">{energyData.pumping.toLocaleString()} kWh ({((energyData.pumping / energyData.totalEnergy) * 100).toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(energyData.pumping / energyData.totalEnergy) * 100}%` }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-300">Other</span>
                    <span className="font-medium">{energyData.other.toLocaleString()} kWh ({((energyData.other / energyData.totalEnergy) * 100).toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(energyData.other / energyData.totalEnergy) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg dark:bg-gray-700">
              <h5 className="font-medium mb-3 text-gray-700 dark:text-gray-200">Environmental Impact</h5>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-300">CO₂ Emissions</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{energyData.co2Emissions.toLocaleString()} kg</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                  <div className="bg-gray-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                <p className="mb-2">Equivalent to:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>{(energyData.co2Emissions / 200).toFixed(1)} trees needed to offset annually</li>
                  <li>{(energyData.co2Emissions / 120).toFixed(1)} car trips around the Earth</li>
                </ul>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <h5 className="font-medium mb-2 text-gray-700 dark:text-gray-200">Optimization Potential</h5>
                <p className="text-sm text-gray-600 dark:text-gray-300">Estimated savings with optimization: 15-20%</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            onClick={() => {
              toast.success("Energy optimization report generated", {
                description: "Recommendations saved to your dashboard"
              });
            }}
            className="text-sm"
          >
            Generate Optimization Report
          </Button>
        </div>
      </div>
    );
  };

  const renderMassBalancePanel = () => {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 animate-fade-in">
        <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white flex items-center">
          <Activity className="mr-2 h-5 w-5 text-green-500" />
          Mass Balance Analysis
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-200">Mass Flow Summary</h4>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-4 dark:bg-blue-900/20">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 dark:text-gray-200 font-medium">Total Input</span>
                <span className="text-blue-700 dark:text-blue-300 font-medium">{inputTotal.toLocaleString()} kg/h</span>
              </div>
              <div className="space-y-2">
                {Object.entries(massBalanceData.input).map(([stream, value]) => (
                  <div key={stream} className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{stream}</span>
                    <span>{value.toLocaleString()} kg/h</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg dark:bg-green-900/20">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 dark:text-gray-200 font-medium">Total Output</span>
                <span className="text-green-700 dark:text-green-300 font-medium">{outputTotal.toLocaleString()} kg/h</span>
              </div>
              <div className="space-y-2">
                {Object.entries(massBalanceData.output).map(([stream, value]) => (
                  <div key={stream} className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{stream}</span>
                    <span>{value.toLocaleString()} kg/h</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-200">Mass Balance</h4>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-300">Mass Balance Closure</span>
                <span className="font-medium text-indigo-600 dark:text-indigo-400">{massBalance}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2.5 mb-4">
                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${massBalance}%` }}></div>
              </div>
              
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                <p className={massBalance > 95 ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}>
                  {massBalance > 95 
                    ? "✓ Mass balance is within acceptable limits" 
                    : "⚠ Mass balance discrepancy detected"}
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h5 className="font-medium mb-3 text-gray-700 dark:text-gray-200">Component Analysis</h5>
              
              <div className="space-y-3">
                {Object.entries(massBalanceData.components).map(([component, values]) => {
                  const recoveryRate = ((values.out / values.in) * 100).toFixed(1);
                  return (
                    <div key={component}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-300">{component}</span>
                        <span className="font-medium">{recoveryRate}% recovery</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <span>In: {values.in.toLocaleString()} kg/h</span>
                        <span>Out: {values.out.toLocaleString()} kg/h</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${
                            parseFloat(recoveryRate) > 95 
                              ? "bg-green-500" 
                              : parseFloat(recoveryRate) > 85 
                                ? "bg-amber-500" 
                                : "bg-red-500"
                          }`} 
                          style={{ width: `${recoveryRate}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            onClick={() => {
              toast.success("Mass balance report generated", {
                description: "The report has been saved to your documents"
              });
            }}
            className="text-sm"
          >
            Export Mass Balance Report
          </Button>
        </div>
      </div>
    );
  };

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
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setActivePanel(activePanel === 'metrics' ? null : 'metrics')}
                  >
                    View Metrics
                  </Button>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium mb-2">Energy Analysis</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Detailed breakdown of energy consumption in your processes.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setActivePanel(activePanel === 'energy' ? null : 'energy')}
                  >
                    Analyze Energy
                  </Button>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium mb-2">Mass Balance</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Comprehensive mass balance analysis for your chemical processes.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setActivePanel(activePanel === 'massBalance' ? null : 'massBalance')}
                  >
                    Calculate Balance
                  </Button>
                </div>
              </div>
              
              {activePanel === 'metrics' && renderMetricsPanel()}
              {activePanel === 'energy' && renderEnergyPanel()}
              {activePanel === 'massBalance' && renderMassBalancePanel()}
              
              {!activePanel && (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">Select an analysis option above to view detailed metrics</p>
                  <Button 
                    variant="default" 
                    onClick={() => {
                      const options = ['metrics', 'energy', 'massBalance'];
                      setActivePanel(options[Math.floor(Math.random() * options.length)]);
                    }}
                  >
                    Run Sample Analysis
                  </Button>
                </div>
              )}
            </GlassPanel>
            
            <UnitConverter />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Analysis;
