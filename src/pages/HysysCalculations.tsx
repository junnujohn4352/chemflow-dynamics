
import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import AspenCalculations from "@/components/simulation/AspenCalculations";
import Footer from "@/components/layout/Footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { 
  Thermometer, Gauge, Beaker, FlaskConical, 
  Droplets, Waves, Shield, Zap, DollarSign, 
  AlertCircle, BarChart3, Play, Pause, RefreshCw
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import HysysIntegration from "@/components/simulation/HysysIntegration";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

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
    icon: <FlaskConical className="h-5 w-5" />,
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
  const [simulationData, setSimulationData] = useState<any>(null);
  const [realTimeData, setRealTimeData] = useState<any[]>([]);
  const [isRealTimeActive, setIsRealTimeActive] = useState(false);
  const [realTimeInterval, setRealTimeInterval] = useState<number | null>(null);
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
  const [thermodynamicModel, setThermodynamicModel] = useState<string>('Peng-Robinson');
  const { toast } = useToast();

  // Load simulation data from localStorage
  useEffect(() => {
    const loadSimulationData = () => {
      try {
        const simName = localStorage.getItem('chemflow-simulation-name');
        const simComponents = localStorage.getItem('chemflow-selected-components');
        const simModel = localStorage.getItem('chemflow-selected-model');
        const simSubject = localStorage.getItem('chemflow-simulation-subject');
        
        if (simComponents) {
          const components = JSON.parse(simComponents);
          setSelectedComponents(components);
        }
        
        if (simModel) {
          setThermodynamicModel(simModel);
        }
        
        // Combine all simulation data
        const data = {
          name: simName || 'Untitled Simulation',
          components: simComponents ? JSON.parse(simComponents) : [],
          model: simModel || 'Peng-Robinson',
          subject: simSubject || 'Chemical Process'
        };
        
        setSimulationData(data);
        
        if (data.components.length > 0) {
          toast({
            title: "Simulation Data Loaded",
            description: `Loaded ${data.components.length} components with ${data.model} model`
          });
        }
      } catch (error) {
        console.error("Error loading simulation data:", error);
      }
    };
    
    loadSimulationData();
  }, [toast]);

  // Start real-time analysis
  const startRealTimeAnalysis = () => {
    if (realTimeInterval) {
      clearInterval(realTimeInterval);
    }
    
    if (!simulationData || !selectedComponents.length) {
      toast({
        title: "Simulation Required",
        description: "Please run a simulation first from the Create Simulation page",
        variant: "destructive"
      });
      return;
    }

    const initialData = generateRealTimeDataPoint(0, selectedComponents);
    setRealTimeData([initialData]);
    setIsRealTimeActive(true);
    
    const intervalId = window.setInterval(() => {
      setRealTimeData(prevData => {
        const timePoint = prevData.length;
        if (timePoint >= 20) {
          clearInterval(intervalId);
          setRealTimeInterval(null);
          setIsRealTimeActive(false);
          return prevData;
        }
        
        const newDataPoint = generateRealTimeDataPoint(timePoint, selectedComponents);
        return [...prevData, newDataPoint];
      });
    }, 2000);
    
    setRealTimeInterval(intervalId);
    
    toast({
      title: "Real-time Analysis Started",
      description: "Monitoring simulation parameters in real-time"
    });
  };

  // Generate real-time data point based on components
  const generateRealTimeDataPoint = (timePoint: number, components: string[]) => {
    const dataPoint: { 
      time: number; 
      temperature?: number; 
      pressure?: number; 
      conversion?: number;
      [key: string]: number | undefined; 
    } = { time: timePoint };
    
    components.forEach(comp => {
      if (comp === 'Ethanol') {
        dataPoint[comp] = Math.min(95, 10 + 85 * (1 - Math.exp(-0.2 * timePoint)));
      } else if (comp === 'Water') {
        dataPoint[comp] = Math.min(90, 15 + 75 * (1 - Math.exp(-0.15 * timePoint)));
      } else if (comp === 'Methanol') {
        dataPoint[comp] = Math.min(85, 5 + 80 * (1 - Math.exp(-0.25 * timePoint)));
      } else if (comp === 'Butanol') {
        dataPoint[comp] = Math.min(75, 8 + 67 * (1 - Math.exp(-0.18 * timePoint)));
      } else {
        dataPoint[comp] = Math.min(80, 10 + 70 * (1 - Math.exp(-0.2 * timePoint)));
      }
      
      dataPoint[comp] *= (0.95 + Math.random() * 0.1);
    });
    
    dataPoint.temperature = 300 + 50 * Math.sin(timePoint / 3 + Math.random() * 0.5);
    dataPoint.pressure = 100 - 10 * Math.cos(timePoint / 2 + Math.random() * 0.3);
    dataPoint.conversion = Math.min(0.98, 1 - Math.exp(-0.1 * (timePoint + 1)));
    
    return dataPoint;
  };

  // Stop real-time analysis
  const stopRealTimeAnalysis = () => {
    if (realTimeInterval) {
      clearInterval(realTimeInterval);
      setRealTimeInterval(null);
    }
    setIsRealTimeActive(false);
    
    toast({
      title: "Real-time Analysis Stopped",
      description: "Analysis data has been frozen for inspection"
    });
  };

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (realTimeInterval) {
        clearInterval(realTimeInterval);
      }
    };
  }, [realTimeInterval]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 dark:text-white">
      <Navbar />
      
      <main className="flex-1 py-16 px-6 animate-fade-in">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-8 relative">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: "2s" }}></div>
            
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-display font-bold mb-4 bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent relative z-10">
                  Aspen HYSYS Calculations
                </h1>
                <p className="text-gray-600 dark:text-gray-300 max-w-3xl relative z-10">
                  Access a comprehensive library of chemical process calculations with real-time analysis 
                  and modern visualization tools that enhance your workflow.
                </p>
              </div>
              
              <div className="flex gap-3">
                {simulationData && (
                  <div className="bg-blue-50 dark:bg-gray-800 p-3 rounded-lg">
                    <p className="text-sm font-medium">Active Simulation:</p>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{simulationData.name}</p>
                    <p className="text-xs text-gray-500">{simulationData.model} model · {selectedComponents.length} components</p>
                  </div>
                )}
                
                <div className="flex flex-col gap-2">
                  <Button 
                    variant={isRealTimeActive ? "destructive" : "default"}
                    onClick={isRealTimeActive ? stopRealTimeAnalysis : startRealTimeAnalysis}
                  >
                    {isRealTimeActive ? (
                      <>
                        <Pause className="mr-2 h-4 w-4" />
                        Stop Analysis
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Start Analysis
                      </>
                    )}
                  </Button>
                  
                  <Button variant="outline" onClick={() => setRealTimeData([])}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset Data
                  </Button>
                </div>
              </div>
            </div>
            
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
          
          {/* Real-time Analysis Charts */}
          {realTimeData.length > 0 && (
            <div className="mb-8 glass-panel relative z-10 shadow-xl border border-white/30 backdrop-blur-sm">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">Real-time Simulation Analysis</h2>
                <p className="mb-6 text-gray-600 dark:text-gray-400">
                  Monitoring key parameters from your {simulationData?.model} simulation
                </p>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-blue-700 dark:text-blue-400">
                      Process Variables
                    </h3>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={realTimeData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" label={{ value: 'Time (min)', position: 'insideBottom', offset: -5 }} />
                          <YAxis yAxisId="left" label={{ value: 'Temperature (K)', angle: -90, position: 'insideLeft' }} />
                          <YAxis yAxisId="right" orientation="right" label={{ value: 'Pressure (kPa)', angle: 90, position: 'insideRight' }} />
                          <Tooltip />
                          <Legend />
                          <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#ff7300" name="Temperature" />
                          <Line yAxisId="right" type="monotone" dataKey="pressure" stroke="#387908" name="Pressure" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-blue-700 dark:text-blue-400">
                      Conversion
                    </h3>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={realTimeData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" label={{ value: 'Time (min)', position: 'insideBottom', offset: -5 }} />
                          <YAxis domain={[0, 1]} label={{ value: 'Conversion', angle: -90, position: 'insideLeft' }} />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="conversion" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="lg:col-span-2">
                    <h3 className="text-lg font-semibold mb-3 text-blue-700 dark:text-blue-400">
                      Component Compositions
                    </h3>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={realTimeData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" label={{ value: 'Time (min)', position: 'insideBottom', offset: -5 }} />
                          <YAxis label={{ value: 'Concentration (%)', angle: -90, position: 'insideLeft' }} />
                          <Tooltip />
                          <Legend />
                          {selectedComponents.slice(0, 6).map((comp, index) => {
                            const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00C49F'];
                            return (
                              <Area 
                                key={comp} 
                                type="monotone" 
                                dataKey={comp} 
                                stackId="1"
                                stroke={colors[index % colors.length]} 
                                fill={colors[index % colors.length]} 
                              />
                            );
                          })}
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
                
                {realTimeData.length >= 5 && (
                  <div className="bg-blue-50 dark:bg-gray-800/60 p-4 rounded-lg">
                    <div className="flex items-center mb-2 gap-2">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400">Analysis Insights</h3>
                    </div>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-start">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500 mt-1.5 mr-2 flex-shrink-0"></span>
                        <span>System reaching {(realTimeData[realTimeData.length-1].conversion * 100).toFixed(1)}% conversion, within expected parameters</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mt-1.5 mr-2 flex-shrink-0"></span>
                        <span>Temperature variations of {(Math.max(...realTimeData.map(d => d.temperature)) - Math.min(...realTimeData.map(d => d.temperature))).toFixed(1)}K detected - monitoring required</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-1.5 mr-2 flex-shrink-0"></span>
                        <span>Component equilibrium approaching steady state - estimated time to completion: {20 - realTimeData.length} minutes</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {!realTimeData.length && simulationData && (
            <div className="mb-8 glass-panel relative z-10 shadow-xl border border-white/30 backdrop-blur-sm p-12 flex flex-col items-center justify-center">
              <AlertCircle className="h-16 w-16 text-blue-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2 text-center">Ready for Real-time Analysis</h2>
              <p className="mb-6 text-gray-600 dark:text-gray-400 text-center max-w-lg">
                Your simulation data has been loaded. Click the "Start Analysis" button to begin real-time monitoring of your process.
              </p>
              <Button 
                size="lg"
                onClick={startRealTimeAnalysis}
              >
                <Play className="mr-2 h-5 w-5" />
                Start Real-time Analysis
              </Button>
            </div>
          )}
          
          {!simulationData && (
            <div className="mb-8 glass-panel relative z-10 shadow-xl border border-white/30 backdrop-blur-sm p-12 flex flex-col items-center justify-center">
              <AlertCircle className="h-16 w-16 text-amber-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2 text-center">No Simulation Data Found</h2>
              <p className="mb-6 text-gray-600 dark:text-gray-400 text-center max-w-lg">
                You need to create and run a simulation first. Go to the Create Simulation page to set up your components, thermodynamic model, and run a simulation.
              </p>
              <Button 
                size="lg"
                onClick={() => window.location.href = '/create-simulation'}
              >
                <Play className="mr-2 h-5 w-5" />
                Create Simulation
              </Button>
            </div>
          )}
          
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
                        
                        {selectedComponents.length > 0 ? (
                          <HysysIntegration 
                            selectedComponents={selectedComponents} 
                            thermodynamicModel={thermodynamicModel}
                          />
                        ) : (
                          <AspenCalculations calculationType={category.id} className="h-full" />
                        )}
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
