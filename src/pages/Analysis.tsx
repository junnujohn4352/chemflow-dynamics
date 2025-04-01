
import React, { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GlassPanel from "@/components/ui/GlassPanel";
import ProcessFlow from "@/components/ui/ProcessFlow";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, RefreshCw, AlertCircle, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Equipment, Stream } from "@/components/simulation/SimulationBuilder";

interface AnalysisData {
  timestamp: string;
  temperature: number;
  pressure: number;
  flow: number;
  composition: {
    [key: string]: number;
  };
  molarFlows?: {
    [key: string]: number;
  };
  heatDuty?: number;
  efficiency?: number;
}

interface SimulationData {
  name: string;
  components: string[];
  thermodynamicModel: string;
  lastUpdated: string;
  equipment: Equipment[];
  streams: Stream[];
}

const Analysis = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeSimulation, setActiveSimulation] = useState<boolean>(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData[]>([]);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);
  const [simulationStarted, setSimulationStarted] = useState(false);
  const [simulationData, setSimulationData] = useState<SimulationData | null>(null);
  const [simulationComponents, setSimulationComponents] = useState<string[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<'composition' | 'temperature' | 'pressure' | 'flow' | 'molarFlow' | 'energy'>('composition');

  // Check for existing simulation data
  useEffect(() => {
    const checkSimulationStatus = () => {
      const isActive = localStorage.getItem('chemflow-active-simulation') === 'true';
      const isRunning = localStorage.getItem('chemflow-simulation-running') === 'true';
      
      setActiveSimulation(isActive);
      
      if (isRunning && !simulationStarted) {
        setSimulationStarted(true);
        startSimulation();
      }
      
      // Load simulation data
      const simDataStr = localStorage.getItem('chemflow-simulation-data');
      if (simDataStr) {
        try {
          const simData = JSON.parse(simDataStr);
          setSimulationData(simData);
          setSimulationComponents(simData.components || []);
        } catch (e) {
          console.error("Error parsing simulation data:", e);
        }
      }
    };
    
    checkSimulationStatus();
    setLoading(false);
    
    // Check for simulation status changes periodically
    const statusInterval = setInterval(checkSimulationStatus, 2000);
    
    return () => {
      clearInterval(statusInterval);
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, []);

  // Start data generation when simulation is run
  const startSimulation = useCallback(() => {
    setSimulationStarted(true);
    refreshData();
    
    // Set up periodic refresh every 10 seconds
    const interval = setInterval(() => {
      refreshData();
    }, 10000);
    
    setRefreshInterval(interval);
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  const refreshData = () => {
    setLoading(true);
    
    // Get simulation components
    const simDataStr = localStorage.getItem('chemflow-simulation-data');
    let components: string[] = simulationComponents;
    
    if (simDataStr) {
      try {
        const simData = JSON.parse(simDataStr);
        components = simData.components || components;
        setSimulationComponents(components);
      } catch (e) {
        console.error("Error parsing simulation data for refresh:", e);
      }
    }
    
    // Generate real-time simulation data based on the current time
    const now = new Date();
    const newData: AnalysisData[] = [];
    
    // Generate data points with some realistic variations
    for (let i = 24; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
      
      // Add sinusoidal patterns and some randomness for realism
      const timeEffect = Math.sin(i * 0.5);
      const randomFactor = Math.random() * 0.5;
      const noiseComponent = timeEffect + randomFactor;
      
      // Calculate values with noise
      const temperatureBase = 75 + noiseComponent * 5;
      const pressureBase = 150 + noiseComponent * 10;
      const flowBase = 120 + noiseComponent * 15;
      
      // Generate composition data using actual components
      const composition: {[key: string]: number} = {};
      const molarFlows: {[key: string]: number} = {};
      
      const totalComponents = components.length;
      if (totalComponents > 0) {
        // Distribute percentages randomly but ensure they sum to 100
        let remaining = 100;
        components.forEach((comp, index) => {
          if (index === totalComponents - 1) {
            // Last component gets whatever is left to ensure sum is 100
            composition[comp] = Math.round(remaining * 10) / 10;
          } else {
            // Assign a random percentage with some influence from the time-based noise
            const basePercentage = 100 / totalComponents;
            const adjustedPercentage = basePercentage + (noiseComponent * 5);
            const percentage = Math.min(Math.round(adjustedPercentage * 10) / 10, remaining - 1);
            composition[comp] = percentage;
            remaining -= percentage;
          }
          
          // Calculate molar flows based on composition and total flow
          molarFlows[comp] = Math.round((composition[comp] / 100 * flowBase) * 100) / 100;
        });
      } else {
        // Default fallback if no components
        composition["componentA"] = Math.round((78 + noiseComponent * 3) * 10) / 10;
        composition["componentB"] = Math.round((22 - noiseComponent * 3) * 10) / 10;
        
        molarFlows["componentA"] = Math.round((composition["componentA"] / 100 * flowBase) * 100) / 100;
        molarFlows["componentB"] = Math.round((composition["componentB"] / 100 * flowBase) * 100) / 100;
      }
      
      // Calculate some engineering metrics
      const heatDuty = Math.round((500 + noiseComponent * 100) * 10) / 10;
      const efficiency = Math.round((85 + noiseComponent * 5) * 10) / 10;
      
      newData.push({
        timestamp: timestamp.toISOString(),
        temperature: Math.round(temperatureBase * 10) / 10,
        pressure: Math.round(pressureBase * 10) / 10,
        flow: Math.round(flowBase * 10) / 10,
        composition,
        molarFlows,
        heatDuty,
        efficiency
      });
    }
    
    setAnalysisData(newData);
    setLoading(false);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const downloadData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(analysisData));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "chemflow-analysis.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    toast({
      title: "Data exported",
      description: "The analysis data has been downloaded as JSON"
    });
  };
  
  const goToCreateSimulation = () => {
    navigate('/create-simulation');
  };
  
  const runNewAnalysis = () => {
    if (!activeSimulation) {
      toast({
        title: "No Simulation",
        description: "Please create a simulation first",
        variant: "destructive"
      });
      return;
    }
    
    localStorage.setItem('chemflow-simulation-running', 'true');
    setSimulationStarted(true);
    startSimulation();
  };

  // Analysis type tabs
  const analysisTabs = [
    { id: 'composition', label: 'Composition Analysis' },
    { id: 'temperature', label: 'Temperature Profile' },
    { id: 'pressure', label: 'Pressure Analysis' },
    { id: 'flow', label: 'Flow Rate Analysis' },
    { id: 'molarFlow', label: 'Molar Flow Analysis' },
    { id: 'energy', label: 'Energy Analysis' }
  ];
  
  const renderAnalysisCharts = () => {
    if (analysisData.length === 0) return null;
    
    switch (selectedAnalysis) {
      case 'composition':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassPanel className="p-6">
              <h2 className="text-xl font-medium mb-4">Component Composition</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={analysisData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" tickFormatter={formatTime} />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, 'Concentration']} />
                    <Legend />
                    {simulationComponents.length > 0 ? (
                      simulationComponents.map((comp, index) => {
                        const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00C49F'];
                        return (
                          <Line 
                            key={comp}
                            type="monotone" 
                            dataKey={`composition.${comp}`} 
                            name={comp}
                            stroke={colors[index % colors.length]}
                            strokeWidth={2} 
                            dot={false} 
                          />
                        );
                      })
                    ) : (
                      <>
                        <Line type="monotone" dataKey="composition.componentA" name="Component A" stroke="#8884d8" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="composition.componentB" name="Component B" stroke="#82ca9d" strokeWidth={2} dot={false} />
                      </>
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassPanel>
            
            <GlassPanel className="p-6">
              <h2 className="text-xl font-medium mb-4">Synthetic Analysis</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={analysisData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" tickFormatter={formatTime} />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, 'Yield']} />
                    <Legend />
                    <Line type="monotone" dataKey="efficiency" name="Process Yield" stroke="#ff7300" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassPanel>
          </div>
        );
        
      case 'temperature':
        return (
          <div className="grid grid-cols-1 gap-6">
            <GlassPanel className="p-6">
              <h2 className="text-xl font-medium mb-4">Temperature Profile</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={analysisData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" tickFormatter={formatTime} />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}°C`, 'Temperature']} />
                    <Legend />
                    <Line type="monotone" dataKey="temperature" stroke="#3B82F6" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassPanel>
          </div>
        );
        
      case 'pressure':
        return (
          <div className="grid grid-cols-1 gap-6">
            <GlassPanel className="p-6">
              <h2 className="text-xl font-medium mb-4">Pressure Trend</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={analysisData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" tickFormatter={formatTime} />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} kPa`, 'Pressure']} />
                    <Legend />
                    <Line type="monotone" dataKey="pressure" stroke="#22D3EE" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassPanel>
          </div>
        );
        
      case 'flow':
        return (
          <div className="grid grid-cols-1 gap-6">
            <GlassPanel className="p-6">
              <h2 className="text-xl font-medium mb-4">Flow Rate Analysis</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={analysisData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" tickFormatter={formatTime} />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} kg/h`, 'Flow Rate']} />
                    <Legend />
                    <Line type="monotone" dataKey="flow" stroke="#2DD4BF" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassPanel>
          </div>
        );
        
      case 'molarFlow':
        return (
          <div className="grid grid-cols-1 gap-6">
            <GlassPanel className="p-6">
              <h2 className="text-xl font-medium mb-4">Molar Flows Analysis</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={analysisData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" tickFormatter={formatTime} />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} kmol/h`, 'Molar Flow']} />
                    <Legend />
                    {simulationComponents.length > 0 ? (
                      simulationComponents.map((comp, index) => {
                        const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00C49F'];
                        return (
                          <Line 
                            key={comp}
                            type="monotone" 
                            dataKey={`molarFlows.${comp}`} 
                            name={comp}
                            stroke={colors[index % colors.length]}
                            strokeWidth={2} 
                            dot={false} 
                          />
                        );
                      })
                    ) : (
                      <>
                        <Line type="monotone" dataKey="molarFlows.componentA" name="Component A" stroke="#8884d8" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="molarFlows.componentB" name="Component B" stroke="#82ca9d" strokeWidth={2} dot={false} />
                      </>
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassPanel>
          </div>
        );
        
      case 'energy':
        return (
          <div className="grid grid-cols-1 gap-6">
            <GlassPanel className="p-6">
              <h2 className="text-xl font-medium mb-4">Energy Analysis</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={analysisData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" tickFormatter={formatTime} />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} kW`, 'Heat Duty']} />
                    <Legend />
                    <Line type="monotone" dataKey="heatDuty" name="Heat Duty" stroke="#F97316" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassPanel>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-6 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-display font-bold mb-2">Process Analysis</h1>
              <p className="text-gray-600">Monitor real-time process data and performance metrics</p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={refreshData}
                disabled={loading || !activeSimulation || !simulationStarted}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh Data
              </Button>
              <Button 
                variant="outline" 
                onClick={downloadData}
                disabled={loading || !simulationStarted || analysisData.length === 0}
              >
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
              <Button 
                variant={simulationStarted ? "outline" : "default"} 
                onClick={runNewAnalysis}
                disabled={!activeSimulation}
              >
                <Play className="mr-2 h-4 w-4" />
                {simulationStarted ? "Restart Analysis" : "Run Analysis"}
              </Button>
            </div>
          </div>
          
          {!activeSimulation ? (
            <GlassPanel className="p-12 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-amber-50 text-amber-600">
                  <AlertCircle className="h-8 w-8" />
                </div>
              </div>
              <h3 className="text-xl font-medium mb-2">No Active Simulation</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Create and run a simulation from the Simulations page to see real-time analysis data here.
              </p>
              <Button onClick={goToCreateSimulation}>
                Create Simulation
              </Button>
            </GlassPanel>
          ) : (
            <>
              <ProcessFlow className="mb-8" onStartSimulation={startSimulation} />
              
              {!simulationStarted ? (
                <GlassPanel className="p-12 text-center mb-6">
                  <h3 className="text-xl font-medium mb-2">Waiting for Simulation to Start</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Click the "Run Analysis" button above to generate real-time analysis data.
                  </p>
                </GlassPanel>
              ) : (
                <>
                  {/* Analysis type tabs */}
                  <div className="mb-6 overflow-x-auto">
                    <div className="flex space-x-2">
                      {analysisTabs.map(tab => (
                        <button
                          key={tab.id}
                          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                            selectedAnalysis === tab.id 
                              ? 'bg-flow-blue text-white' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          onClick={() => setSelectedAnalysis(tab.id as any)}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Analysis Charts */}
                  {renderAnalysisCharts()}
                </>
              )}
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Analysis;
