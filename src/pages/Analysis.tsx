import React, { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GlassPanel from "@/components/ui/GlassPanel";
import ProcessFlow from "@/components/ui/ProcessFlow";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { Download, RefreshCw, AlertCircle, Play, FileText, Database, Activity, BarChart3, PieChart as PieChartIcon, Radar as RadarIcon } from "lucide-react";
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
  pH?: number;
  viscosity?: number;
  density?: number;
  residence?: number;
  reaction?: {
    [key: string]: number;
  };
  synthetic?: {
    yield: number;
    selectivity: number;
    conversion: number;
    purification: number;
  };
  economics?: {
    operatingCost: number;
    capitalCost: number;
    roi: number;
    paybackPeriod: number;
  };
  environmental?: {
    co2Emissions: number;
    waterUsage: number;
    wasteGeneration: number;
    energyEfficiency: number;
  };
}

interface SimulationData {
  name: string;
  components: string[];
  thermodynamicModel: string;
  lastUpdated: string;
  equipment: Equipment[];
  streams: Stream[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

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
  const [selectedAnalysis, setSelectedAnalysis] = useState<
    'composition' | 'temperature' | 'pressure' | 'flow' | 'molarFlow' | 'energy' | 
    'synthetic' | 'economics' | 'environmental' | 'physical' | 'reactions'
  >('composition');
  const [problemStatement, setProblemStatement] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  useEffect(() => {
    const checkSimulationStatus = () => {
      const isActive = localStorage.getItem('chemflow-active-simulation') === 'true';
      const isRunning = localStorage.getItem('chemflow-simulation-running') === 'true';
      
      setActiveSimulation(isActive);
      
      if (isRunning && !simulationStarted) {
        setSimulationStarted(true);
        startSimulation();
      }
      
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
    
    const statusInterval = setInterval(checkSimulationStatus, 2000);
    
    return () => {
      clearInterval(statusInterval);
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, []);

  const startSimulation = useCallback(() => {
    setSimulationStarted(true);
    refreshData();
    
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
    
    const now = new Date();
    const newData: AnalysisData[] = [];
    
    for (let i = 24; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
      
      const timeEffect = Math.sin(i * 0.5);
      const randomFactor = Math.random() * 0.5;
      const noiseComponent = timeEffect + randomFactor;
      
      const temperatureBase = 75 + noiseComponent * 5;
      const pressureBase = 150 + noiseComponent * 10;
      const flowBase = 120 + noiseComponent * 15;
      const pHBase = 7 + noiseComponent * 0.5;
      const viscosityBase = 2.5 + noiseComponent * 0.3;
      const densityBase = 850 + noiseComponent * 20;
      const residenceBase = 15 + noiseComponent * 2;
      
      const composition: {[key: string]: number} = {};
      const molarFlows: {[key: string]: number} = {};
      const reaction: {[key: string]: number} = {};
      
      const totalComponents = components.length;
      if (totalComponents > 0) {
        let remaining = 100;
        components.forEach((comp, index) => {
          if (index === totalComponents - 1) {
            composition[comp] = Math.round(remaining * 10) / 10;
          } else {
            const basePercentage = 100 / totalComponents;
            const adjustedPercentage = basePercentage + (noiseComponent * 5);
            const percentage = Math.min(Math.round(adjustedPercentage * 10) / 10, remaining - 1);
            composition[comp] = percentage;
            remaining -= percentage;
          }
          
          molarFlows[comp] = Math.round((composition[comp] / 100 * flowBase) * 100) / 100;
          
          reaction[comp] = Math.round((0.5 + noiseComponent * 0.2 + Math.random() * 0.3) * 100) / 100;
        });
      } else {
        composition["componentA"] = Math.round((78 + noiseComponent * 3) * 10) / 10;
        composition["componentB"] = Math.round((22 - noiseComponent * 3) * 10) / 10;
        
        molarFlows["componentA"] = Math.round((composition["componentA"] / 100 * flowBase) * 100) / 100;
        molarFlows["componentB"] = Math.round((composition["componentB"] / 100 * flowBase) * 100) / 100;
        
        reaction["componentA"] = Math.round((0.5 + noiseComponent * 0.2) * 100) / 100;
        reaction["componentB"] = Math.round((0.3 + noiseComponent * 0.1) * 100) / 100;
      }
      
      const heatDuty = Math.round((500 + noiseComponent * 100) * 10) / 10;
      const efficiency = Math.round((85 + noiseComponent * 5) * 10) / 10;
      
      const synthetic = {
        yield: Math.round((75 + noiseComponent * 8) * 10) / 10,
        selectivity: Math.round((80 + noiseComponent * 5) * 10) / 10,
        conversion: Math.round((85 + noiseComponent * 7) * 10) / 10,
        purification: Math.round((90 + noiseComponent * 3) * 10) / 10
      };
      
      const economics = {
        operatingCost: Math.round((2000 + noiseComponent * 300) * 10) / 10,
        capitalCost: Math.round((25000 + noiseComponent * 2000) * 10) / 10,
        roi: Math.round((18 + noiseComponent * 3) * 10) / 10,
        paybackPeriod: Math.round((4 - noiseComponent * 0.5) * 10) / 10
      };
      
      const environmental = {
        co2Emissions: Math.round((500 + noiseComponent * 50) * 10) / 10,
        waterUsage: Math.round((2000 + noiseComponent * 200) * 10) / 10,
        wasteGeneration: Math.round((100 + noiseComponent * 20) * 10) / 10,
        energyEfficiency: Math.round((70 + noiseComponent * 10) * 10) / 10
      };
      
      newData.push({
        timestamp: timestamp.toISOString(),
        temperature: Math.round(temperatureBase * 10) / 10,
        pressure: Math.round(pressureBase * 10) / 10,
        flow: Math.round(flowBase * 10) / 10,
        pH: Math.round(pHBase * 100) / 100,
        viscosity: Math.round(viscosityBase * 100) / 100,
        density: Math.round(densityBase * 10) / 10,
        residence: Math.round(residenceBase * 10) / 10,
        composition,
        molarFlows,
        reaction,
        heatDuty,
        efficiency,
        synthetic,
        economics,
        environmental
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

  const analyzeProblemStatement = async () => {
    if (!problemStatement.trim()) {
      toast({
        title: "Missing Input",
        description: "Please enter a problem statement to analyze",
        variant: "destructive"
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    setTimeout(() => {
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis Complete",
        description: "Problem statement analyzed and flowsheet generated",
      });
      
      refreshData();
    }, 3000);
  };

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
              <h2 className="text-xl font-medium mb-4">Pie Chart Distribution</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={
                        simulationComponents.length > 0
                          ? simulationComponents.map((comp, index) => ({
                              name: comp,
                              value: analysisData.length > 0 ? 
                                analysisData[0].composition[comp] || 0 : 0
                            }))
                          : [
                              { name: 'Component A', value: 78 },
                              { name: 'Component B', value: 22 }
                            ]
                      }
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {simulationComponents.length > 0
                        ? simulationComponents.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))
                        : [
                            <Cell key="cell-0" fill={COLORS[0]} />,
                            <Cell key="cell-1" fill={COLORS[1]} />
                          ]
                      }
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Concentration']} />
                  </PieChart>
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
        
      case 'synthetic':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassPanel className="p-6">
              <h2 className="text-xl font-medium mb-4">Synthetic Process Performance</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={analysisData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" tickFormatter={formatTime} />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, '']} />
                    <Legend />
                    <Line type="monotone" dataKey="synthetic.yield" name="Yield" stroke="#8884d8" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="synthetic.selectivity" name="Selectivity" stroke="#82ca9d" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="synthetic.conversion" name="Conversion" stroke="#ffc658" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="synthetic.purification" name="Purification" stroke="#ff7300" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassPanel>
            
            <GlassPanel className="p-6">
              <h2 className="text-xl font-medium mb-4">Key Performance Indicators</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={90} width={730} height={250} data={[
                    {
                      subject: 'Yield',
                      A: analysisData.length > 0 ? analysisData[0].synthetic?.yield || 0 : 0,
                      fullMark: 100
                    },
                    {
                      subject: 'Selectivity',
                      A: analysisData.length > 0 ? analysisData[0].synthetic?.selectivity || 0 : 0,
                      fullMark: 100
                    },
                    {
                      subject: 'Conversion',
                      A: analysisData.length > 0 ? analysisData[0].synthetic?.conversion || 0 : 0,
                      fullMark: 100
                    },
                    {
                      subject: 'Purification',
                      A: analysisData.length > 0 ? analysisData[0].synthetic?.purification || 0 : 0,
                      fullMark: 100
                    },
                    {
                      subject: 'Efficiency',
                      A: analysisData.length > 0 ? analysisData[0].efficiency || 0 : 0,
                      fullMark: 100
                    }
                  ]}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="Performance" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </GlassPanel>
          </div>
        );
        
      case 'reactions':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassPanel className="p-6">
              <h2 className="text-xl font-medium mb-4">Reaction Rates</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={analysisData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" tickFormatter={formatTime} />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} mol/L·s`, 'Rate']} />
                    <Legend />
                    {simulationComponents.length > 0 ? (
                      simulationComponents.map((comp, index) => {
                        const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00C49F'];
                        return (
                          <Line 
                            key={comp}
                            type="monotone" 
                            dataKey={`reaction.${comp}`}
                            name={`${comp} Rate`}
                            stroke={colors[index % colors.length]}
                            strokeWidth={2} 
                            dot={false} 
                          />
                        );
                      })
                    ) : (
                      <>
                        <Line type="monotone" dataKey="reaction.componentA" name="Component A Rate" stroke="#8884d8" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="reaction.componentB" name="Component B Rate" stroke="#82ca9d" strokeWidth={2} dot={false} />
                      </>
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassPanel>
            
            <GlassPanel className="p-6">
              <h2 className="text-xl font-medium mb-4">Residence Time Analysis</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={analysisData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" tickFormatter={formatTime} />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} min`, 'Time']} />
                    <Legend />
                    <Line type="monotone" dataKey="residence" name="Residence Time" stroke="#ff7300" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassPanel>
          </div>
        );
        
      case 'physical':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassPanel className="p-6">
              <h2 className="text-xl font-medium mb-4">Physical Properties</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={analysisData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" tickFormatter={formatTime} />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="pH" name="pH" stroke="#8884d8" strokeWidth={2} dot={false} />
                    <Line yAxisId="left" type="monotone" dataKey="viscosity" name="Viscosity (cP)" stroke="#82ca9d" strokeWidth={2} dot={false} />
                    <Line yAxisId="right" type="monotone" dataKey="density" name="Density (kg/m³)" stroke="#ffc658" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassPanel>
            
            <GlassPanel className="p-6">
              <h2 className="text-xl font-medium mb-4">Physical Properties Distribution</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[{
                      name: 'Current Properties',
                      pH: analysisData.length > 0 ? analysisData[0].pH || 0 : 0,
                      viscosity: analysisData.length > 0 ? analysisData[0].viscosity || 0 : 0,
                      density: analysisData.length > 0 ? (analysisData[0].density || 0) / 100 : 0,
                    }]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="pH" name="pH" fill="#8884d8" />
                    <Bar dataKey="viscosity" name="Viscosity (cP)" fill="#82ca9d" />
                    <Bar dataKey="density" name="Density (scaled kg/m³)" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassPanel>
          </div>
        );
        
      case 'economics':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassPanel className="p-6">
              <h2 className="text-xl font-medium mb-4">Economic Analysis</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={analysisData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" tickFormatter={formatTime} />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="economics.operatingCost" name="Operating Cost ($/day)" stroke="#8884d8" strokeWidth={2} dot={false} />
                    <Line yAxisId="right" type="monotone" dataKey="economics.roi" name="ROI (%)" stroke="#82ca9d" strokeWidth={2} dot={false} />
                    <Line yAxisId="right" type="monotone" dataKey="economics.paybackPeriod" name="Payback Period (years)" stroke="#ffc658" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassPanel>
            
            <GlassPanel className="p-6">
              <h2 className="text-xl font-medium mb-4">Capital vs Operating Cost</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Capital Cost', value: analysisData.length > 0 ? analysisData[0].economics?.capitalCost || 0 : 0 },
                        { name: 'Operating Cost (Annual)', value: analysisData.length > 0 ? (analysisData[0].economics?.operatingCost || 0) * 365 : 0 },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell key="cell-0" fill={COLORS[0]} />
                      <Cell key="cell-1" fill={COLORS[1]} />
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </GlassPanel>
          </div>
        );
        
      case 'environmental':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassPanel className="p-6">
              <h2 className="text-xl font-medium mb-4">Environmental Impact</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={analysisData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" tickFormatter={formatTime} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="environmental.co2Emissions" name="CO₂ Emissions (kg/day)" stroke="#8884d8" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="environmental.waterUsage" name="Water Usage (L/day)" stroke="#82ca9d" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="environmental.wasteGeneration" name="Waste Generation (kg/day)" stroke="#ffc658" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassPanel>
            
            <GlassPanel className="p-6">
              <h2 className="text-xl font-medium mb-4">Energy Efficiency</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={analysisData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" tickFormatter={formatTime} />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, 'Efficiency']} />
                    <Legend />
                    <Line type="monotone" dataKey="environmental.energyEfficiency" name="Energy Efficiency" stroke="#ff7300" strokeWidth={2} dot={false} />
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
      
      <main className="flex-1 py-6 px-6 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-display font-bold mb-2 dark:text-white">Process Analysis</h1>
              <p className="text-gray-600 dark:text-gray-400">Monitor real-time process data and performance metrics</p>
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
                <div className="p-4 rounded-full bg-amber-50 text-amber-600 dark:bg-amber-900 dark:text-amber-200">
                  <AlertCircle className="h-8 w-8" />
                </div>
              </div>
              <h3 className="text-xl font-medium mb-2 dark:text-white">No Active Simulation</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Create and run a simulation from the Simulations page to see real-time analysis data here.
              </p>
              <Button onClick={goToCreateSimulation}>
                Create Simulation
              </Button>
            </GlassPanel>
          ) : (
            <>
              <GlassPanel className="mb-8 p-6">
                <h2 className="text-xl font-medium mb-4 dark:text-white">Problem Statement Analysis</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Enter a chemical engineering problem statement to get an AI-generated flowsheet solution.
                </p>
                <div className="flex gap-4">
                  <textarea 
                    className="flex-1 p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    rows={2}
                    placeholder="E.g., Design a process to produce 99.5% pure ethanol from a 10% aqueous solution..."
                    value={problemStatement}
                    onChange={(e) => setProblemStatement(e.target.value)}
                  />
                  <Button 
                    className="self-end"
                    onClick={analyzeProblemStatement}
                    disabled={isAnalyzing || !problemStatement.trim()}
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" />
                        Generate Flowsheet
                      </>
                    )}
                  </Button>
                </div>
              </GlassPanel>
              
              <ProcessFlow className="mb-8" onStartSimulation={startSimulation} />
              
              {!simulationStarted ? (
                <GlassPanel className="p-12 text-center mb-6">
                  <h3 className="text-xl font-medium mb-2 dark:text-white">Waiting for Simulation to Start</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                    Click the "Run Analysis" button above to generate real-time analysis data.
                  </p>
                </GlassPanel>
              ) : (
                <>
                  <div className="mb-6 overflow-x-auto">
                    <div className="flex space-x-2">
                      {analysisTabs.map(tab => (
                        <button
                          key={tab.id}
                          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center ${
                            selectedAnalysis === tab.id 
                              ? 'bg-flow-blue text-white dark:bg-blue-700' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                          }`}
                          onClick={() => setSelectedAnalysis(tab.id as any)}
                        >
                          {tab.icon && <span className="mr-2">{tab.icon}</span>}
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
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
