import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GlassPanel from "@/components/ui/GlassPanel";
import { 
  Save, ArrowLeft, Layers, Database, Settings2, 
  GitBranch, Play, Check, Pause, RefreshCw,
  BarChart3, ChevronDown, ChevronUp, FlaskConical, Waves, Zap, Droplets, Shield, Cpu, Leaf
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SimulationBuilder from "@/components/simulation/SimulationBuilder";
import ComponentSelector from "@/components/simulation/ComponentSelector";
import ThermodynamicsSelector from "@/components/simulation/ThermodynamicsSelector";
import { Button } from "@/components/ui/button";
import HysysIntegration from "@/components/simulation/HysysIntegration";
import RealTimeAnalysisCharts from "@/components/charts/RealTimeAnalysisCharts";
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
  Line,
  BarChart,
  Bar
} from 'recharts';

interface SubjectAnalysis {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: string;
  charts: React.ReactNode;
}

const CreateSimulation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'components' | 'thermodynamics' | 'builder'>('components');
  const [simulationName, setSimulationName] = useState('Untitled Simulation');
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState('Peng-Robinson');
  const [isSimulationComplete, setIsSimulationComplete] = useState(false);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisData, setAnalysisData] = useState<any[]>([]);
  const [simulationSubject, setSimulationSubject] = useState<string | null>(null);
  const [subjectAnalyses, setSubjectAnalyses] = useState<SubjectAnalysis[]>([]);
  const [activeSubjectAnalysis, setActiveSubjectAnalysis] = useState<string | null>(null);
  const [realTimeData, setRealTimeData] = useState<any[]>([]);
  const [isRealTimeActive, setIsRealTimeActive] = useState(false);
  const [realTimeInterval, setRealTimeInterval] = useState<number | null>(null);

  useEffect(() => {
    const savedSimData = localStorage.getItem('chemflow-simulation-data');
    if (savedSimData) {
      try {
        const simData = JSON.parse(savedSimData);
        if (simData.components && simData.components.length > 0) {
          setSelectedComponents(simData.components);
        }
        if (simData.thermodynamicModel) {
          setSelectedModel(simData.thermodynamicModel);
        }
        if (simData.name) {
          setSimulationName(simData.name);
        }
        if (simData.subject) {
          setSimulationSubject(simData.subject);
        }
      } catch (e) {
        console.error("Error loading saved simulation data:", e);
      }
    }
  }, []);

  const componentsValid = selectedComponents.length > 0;
  const allStepsValid = componentsValid && selectedModel !== '';

  const handleSaveSimulation = () => {
    if (simulationName.trim() === '') {
      toast({
        title: "Name required",
        description: "Please enter a name for your simulation",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedComponents.length === 0) {
      toast({
        title: "Components required",
        description: "Please select at least one component for your simulation",
        variant: "destructive",
      });
      return;
    }
    
    localStorage.setItem('chemflow-simulation-name', simulationName);
    localStorage.setItem('chemflow-selected-components', JSON.stringify(selectedComponents));
    localStorage.setItem('chemflow-selected-model', selectedModel);
    
    if (simulationSubject) {
      localStorage.setItem('chemflow-simulation-subject', simulationSubject);
    }
    
    toast({
      title: "Simulation saved",
      description: "Your simulation has been created successfully!"
    });
  };

  const detectSimulationSubject = () => {
    const hasAromatic = selectedComponents.some(c => 
      ['Benzene', 'Toluene', 'Xylene', 'Styrene'].includes(c));
    
    const hasAlcohol = selectedComponents.some(c => 
      ['Methanol', 'Ethanol', 'Propanol', 'Butanol'].includes(c));
      
    const hasAcid = selectedComponents.some(c => 
      ['Acetic Acid', 'Formic Acid', 'Sulfuric Acid'].includes(c));
    
    const hasGas = selectedComponents.some(c => 
      ['Methane', 'Ethane', 'Propane', 'Nitrogen', 'Oxygen', 'Carbon Dioxide'].includes(c));
    
    if (hasAromatic && hasAlcohol) {
      return "Liquid-Liquid Extraction";
    } else if (hasAlcohol && hasAcid) {
      return "Esterification Reaction";
    } else if (hasAlcohol) {
      return "Distillation";
    } else if (hasGas) {
      return "Gas Processing";
    } else if (hasAromatic) {
      return "Aromatics Separation";
    } else if (hasAcid) {
      return "Acid Gas Treatment";
    } else {
      return "Chemical Process";
    }
  };

  const handleRunSimulation = async () => {
    if (!allStepsValid) {
      toast({
        title: "Incomplete setup",
        description: "Please complete all simulation setup steps first",
        variant: "destructive",
      });
      return;
    }

    setIsSimulationRunning(true);
    
    const subject = detectSimulationSubject();
    setSimulationSubject(subject);
    localStorage.setItem('chemflow-simulation-subject', subject);
    
    generateAnalysisData();
    
    await generateSubjectAnalyses(subject);

    startRealTimeAnalysis();
    
    setTimeout(() => {
      setIsSimulationRunning(false);
      setIsSimulationComplete(true);
      setShowAnalysis(true);
      
      toast({
        title: "Simulation complete",
        description: `${subject} simulation finished successfully!`,
      });
    }, 2000);
  };

  const startRealTimeAnalysis = () => {
    if (realTimeInterval) {
      clearInterval(realTimeInterval);
    }

    const initialData = generateRealTimeDataPoint(0);
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
        
        const newDataPoint = generateRealTimeDataPoint(timePoint);
        return [...prevData, newDataPoint];
      });
    }, 2000);
    
    setRealTimeInterval(intervalId);
  };

  const generateRealTimeDataPoint = (timePoint: number) => {
    const dataPoint: { 
      time: number; 
      temperature?: number; 
      pressure?: number; 
      conversion?: number;
      [key: string]: number | undefined; 
    } = { time: timePoint };
    
    selectedComponents.forEach(comp => {
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

  const stopRealTimeAnalysis = () => {
    if (realTimeInterval) {
      clearInterval(realTimeInterval);
      setRealTimeInterval(null);
    }
    setIsRealTimeActive(false);
  };

  const generateAnalysisData = () => {
    const timePoints = Array.from({ length: 25 }, (_, i) => i);
    
    const data = timePoints.map(time => {
      const baseObj: { 
        time: number; 
        temperature?: number; 
        pressure?: number; 
        conversion?: number;
        [key: string]: number | undefined; 
      } = { time };
      
      selectedComponents.forEach(comp => {
        if (comp === 'Ethanol') {
          baseObj[comp] = 100 - 100 * Math.exp(-0.05 * time);
        } else if (comp === 'Water') {
          baseObj[comp] = 100 - 100 * Math.exp(-0.02 * time);
        } else if (comp === 'Methanol') {
          baseObj[comp] = 85 - 85 * Math.exp(-0.07 * time);
        } else if (comp === 'Butanol') {
          baseObj[comp] = 75 - 75 * Math.exp(-0.03 * time);
        } else {
          baseObj[comp] = 80 - 80 * Math.exp(-0.04 * time);
        }
        
        baseObj[comp] *= (0.9 + Math.random() * 0.2);
      });
      
      baseObj.temperature = 300 + 50 * Math.sin(time / 5);
      baseObj.pressure = 100 - 10 * Math.cos(time / 3);
      baseObj.conversion = Math.min(0.98, 1 - Math.exp(-0.15 * time));
      
      return baseObj;
    });
    
    setAnalysisData(data);
  };

  const generateSubjectAnalyses = async (subject: string) => {
    try {
      const generateStaticAnalysis = (subject: string, components: string[]): string => {
        return `# ${subject} Analysis Summary
        
This analysis examines the ${subject} process using ${components.join(", ")} as the main components.
        
## Key Findings
- The process shows stable behavior under normal operating conditions
- Operating temperature range: 300-350K
- Operating pressure range: 90-110 kPa
- The system achieves 95-98% conversion efficiency

## Recommendations
- Consider increasing residence time for better conversion
- Monitor temperature gradients in the system
- Optimize energy usage by heat integration
- Regular maintenance of critical equipment is recommended`;
      };
      
      const heatTransferAnalysis = generateStaticAnalysis(`Heat Transfer for ${subject}`, selectedComponents);
      const fluidFlowAnalysis = generateStaticAnalysis(`Fluid Flow for ${subject}`, selectedComponents);
      const thermodynamicsAnalysis = generateStaticAnalysis(`Thermodynamics for ${subject}`, selectedComponents);
      const massTransferAnalysis = generateStaticAnalysis(`Mass Transfer for ${subject}`, selectedComponents);
      const reactionAnalysis = generateStaticAnalysis(`Reaction Engineering for ${subject}`, selectedComponents);
      const safetyAnalysis = generateStaticAnalysis(`Safety for ${subject}`, selectedComponents);
      const processAnalysis = generateStaticAnalysis(`Process Simulation for ${subject}`, selectedComponents);
      const utilityAnalysis = generateStaticAnalysis(`Utility Requirements for ${subject}`, selectedComponents);
      
      const analyses: SubjectAnalysis[] = [
        {
          id: "heatTransfer",
          title: "Heat Transfer Analysis",
          icon: <Thermometer className="h-5 w-5" />,
          content: heatTransferAnalysis,
          charts: (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analysisData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" label={{ value: 'Time (min)', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Temperature (K)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="temperature" stroke="#ff7300" name="Temperature" />
              </LineChart>
            </ResponsiveContainer>
          )
        },
        {
          id: "fluidFlow",
          title: "Fluid Flow Analysis",
          icon: <Waves className="h-5 w-5" />,
          content: fluidFlowAnalysis,
          charts: (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analysisData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" label={{ value: 'Time (min)', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Pressure (kPa)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="pressure" stroke="#387908" name="Pressure" />
              </LineChart>
            </ResponsiveContainer>
          )
        },
        {
          id: "thermodynamics",
          title: "Thermodynamic Analysis",
          icon: <Zap className="h-5 w-5" />,
          content: thermodynamicsAnalysis,
          charts: (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analysisData}>
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
          )
        },
        {
          id: "massTransfer",
          title: "Mass Transfer Analysis",
          icon: <Droplets className="h-5 w-5" />,
          content: massTransferAnalysis,
          charts: (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analysisData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" label={{ value: 'Time (min)', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Concentration (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                {selectedComponents.slice(0, 4).map((comp, index) => {
                  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];
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
          )
        },
        {
          id: "reactionEngineering",
          title: "Reaction Engineering Analysis",
          icon: <FlaskConical className="h-5 w-5" />,
          content: reactionAnalysis,
          charts: (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analysisData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" label={{ value: 'Time (min)', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Conversion', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="conversion" stroke="#8884d8" activeDot={{ r: 8 }} name="Conversion" />
              </LineChart>
            </ResponsiveContainer>
          )
        },
        {
          id: "safetyAnalysis",
          title: "Safety Analysis",
          icon: <Shield className="h-5 w-5" />,
          content: safetyAnalysis,
          charts: (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analysisData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" label={{ value: 'Time (min)', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Pressure (kPa)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="pressure" stroke="#ff0000" name="Pressure" />
                <Line type="monotone" dataKey={(datum) => datum.pressure ? datum.pressure * 0.9 : 0} stroke="#00ff00" strokeDasharray="5 5" name="Relief Pressure" />
              </LineChart>
            </ResponsiveContainer>
          )
        },
        {
          id: "processSimulation",
          title: "Process Simulation",
          icon: <Cpu className="h-5 w-5" />,
          content: processAnalysis,
          charts: (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[analysisData[analysisData.length - 1]]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tick={false} />
                <YAxis label={{ value: 'Concentration (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                {selectedComponents.map((comp, index) => {
                  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00C49F'];
                  return (
                    <Bar 
                      key={comp} 
                      dataKey={comp} 
                      fill={colors[index % colors.length]} 
                    />
                  );
                })}
              </BarChart>
            </ResponsiveContainer>
          )
        },
        {
          id: "utilityEnvironmental",
          title: "Utility & Environmental Analysis",
          icon: <Leaf className="h-5 w-5" />,
          content: utilityAnalysis,
          charts: (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analysisData.filter((_, i) => i % 3 === 0)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" label={{ value: 'Time (min)', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Resource Usage', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey={(datum) => datum.temperature ? datum.temperature / 10 : 0} stroke="#0088fe" name="Steam Usage" />
                <Line type="monotone" dataKey={(datum) => datum.pressure ? datum.pressure / 5 : 0} stroke="#00C49F" name="Cooling Water" />
                <Line type="monotone" dataKey={(datum) => datum.conversion ? datum.conversion * 100 : 0} stroke="#FFBB28" name="Power Usage" />
              </LineChart>
            </ResponsiveContainer>
          )
        }
      ];
      
      setSubjectAnalyses(analyses);
      setActiveSubjectAnalysis(analyses[0].id);
      
    } catch (error) {
      console.error("Error generating analyses:", error);
      toast({
        title: "Analysis Generation Failed",
        description: "There was an error generating detailed analyses",
        variant: "destructive"
      });
    }
  };

  const handleComponentSelectionDone = () => {
    if (componentsValid && activeTab === 'components') {
      toast({
        title: "Components selected",
        description: "Now choose a thermodynamic model for your simulation"
      });
      setActiveTab('thermodynamics');
    }
  };

  const handleModelSelectionDone = () => {
    if (activeTab === 'thermodynamics') {
      toast({
        title: "Thermodynamic model selected",
        description: "Now build your process flowsheet"
      });
      setActiveTab('builder');
    }
  };

  const renderAnalysisSection = () => {
    if (!showAnalysis || !isSimulationComplete) return null;
    
    return (
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-display font-bold">
            {simulationSubject} Simulation Analysis
          </h2>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowAnalysis(!showAnalysis)}
          >
            {showAnalysis ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-blue-700 dark:text-blue-400">Real-time Analysis</h3>
            <div className="flex gap-2">
              <Button 
                variant={isRealTimeActive ? "destructive" : "default"}
                size="sm"
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
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setRealTimeData([])}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset Data
              </Button>
            </div>
          </div>
          
          <GlassPanel className="p-6">
            <RealTimeAnalysisCharts 
              realTimeData={realTimeData} 
              selectedComponents={selectedComponents}
              isRealTimeActive={isRealTimeActive}
            />
          </GlassPanel>
        </div>
        
        <div className="mt-4">
          <HysysIntegration 
            selectedComponents={selectedComponents}
            thermodynamicModel={selectedModel}
          />
        </div>
        
        <div className="border-b border-gray-200 mb-6 mt-6">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {subjectAnalyses.map(analysis => (
              <button
                key={analysis.id}
                className={`py-2 px-4 flex items-center rounded-t-lg text-sm font-medium transition-colors ${
                  activeSubjectAnalysis === analysis.id
                    ? 'bg-white border-x border-t border-gray-200 text-flow-blue' 
                    : 'bg-gray-50 text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveSubjectAnalysis(analysis.id)}
              >
                {analysis.icon}
                <span className="ml-2">{analysis.title}</span>
              </button>
            ))}
          </div>
        </div>
        
        {activeSubjectAnalysis && (
          <GlassPanel className="p-6">
            {subjectAnalyses.find(a => a.id === activeSubjectAnalysis)?.charts}
            
            <div className="mt-6 prose dark:prose-invert max-w-none">
              <div
                dangerouslySetInnerHTML={{ 
                  __html: subjectAnalyses.find(a => a.id === activeSubjectAnalysis)?.content
                    .replace(/\n/g, '<br>')
                    .replace(/#{1,6}\s?(.*)/g, '<h4>$1</h4>') || ''
                }}
              />
            </div>
          </GlassPanel>
        )}
        
        <div className="mt-6 flex justify-between">
          <Button 
            variant="outline"
            onClick={() => setShowAnalysis(false)}
          >
            Hide Analysis
          </Button>
          <Button>
            Export Results
          </Button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    return () => {
      if (realTimeInterval) {
        clearInterval(realTimeInterval);
      }
    };
  }, [realTimeInterval]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-6 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <button 
                onClick={() => navigate("/simulations")}
                className="mr-4 p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <input
                  type="text"
                  value={simulationName}
                  onChange={(e) => setSimulationName(e.target.value)}
                  className="text-2xl font-display font-bold bg-transparent border-none focus:ring-0 focus:outline-none focus:border-b-2 focus:border-flow-blue"
                  placeholder="Simulation Name"
                />
                <p className="text-gray-600 text-sm">Define your chemical process simulation</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline"
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </Button>
              <Button 
                variant="default"
                onClick={handleSaveSimulation}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Simulation
              </Button>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center">
              <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
                componentsValid ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {componentsValid ? <Check className="h-4 w-4" /> : '1'}
              </div>
              <div className={`h-1 w-12 ${
                componentsValid ? 'bg-green-500' : 'bg-gray-200'
              }`}></div>
              <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
                selectedModel ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {selectedModel ? <Check className="h-4 w-4" /> : '2'}
              </div>
              <div className={`h-1 w-12 ${
                selectedModel ? 'bg-green-500' : 'bg-gray-200'
              }`}></div>
              <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
                isSimulationComplete ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {isSimulationComplete ? <Check className="h-4 w-4" /> : '3'}
              </div>
            </div>
          </div>
          
          <div className="mb-6 border-b border-gray-200">
            <div className="flex space-x-4">
              <button
                className={`py-3 px-4 flex items-center border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'components' 
                    ? 'border-flow-blue text-flow-blue' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('components')}
              >
                <Database className="mr-2 h-4 w-4" />
                Components
                {componentsValid && <Check className="ml-2 h-3 w-3 text-green-500" />}
              </button>
              <button
                className={`py-3 px-4 flex items-center border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'thermodynamics' 
                    ? 'border-flow-blue text-flow-blue' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('thermodynamics')}
              >
                <Thermometer className="mr-2 h-4 w-4" />
                Thermodynamics
                {selectedModel && <Check className="ml-2 h-3 w-3 text-green-500" />}
              </button>
              <button
                className={`py-3 px-4 flex items-center border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'builder' 
                    ? 'border-flow-blue text-flow-blue' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('builder')}
              >
                <Layers className="mr-2 h-4 w-4" />
                Flowsheet Builder
                {isSimulationComplete && <Check className="ml-2 h-3 w-3 text-green-500" />}
              </button>
              
              {isSimulationComplete && (
                <button
                  className={`py-3 px-4 flex items-center border-b-2 font-medium text-sm transition-colors
                    ${showAnalysis ? 'border-flow-blue text-flow-blue' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  onClick={() => setShowAnalysis(!showAnalysis)}
                  id="analysis-tab"
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Analysis
                </button>
              )}
            </div>
          </div>
          
          <GlassPanel className="p-6">
            {activeTab === 'components' && (
              <div className="flex flex-col">
                <ComponentSelector 
                  selectedComponents={selectedComponents}
                  setSelectedComponents={setSelectedComponents}
                />
                <div className="mt-6 flex justify-end">
                  <Button 
                    onClick={handleComponentSelectionDone}
                    disabled={!componentsValid}
                  >
                    Continue to Thermodynamics
                  </Button>
                </div>
              </div>
            )}
            
            {activeTab === 'thermodynamics' && (
              <div className="flex flex-col">
                <ThermodynamicsSelector 
                  selectedModel={selectedModel}
                  setSelectedModel={setSelectedModel}
                />
                <div className="mt-6 flex justify-between">
                  <Button 
                    variant="outline"
                    onClick={() => setActiveTab('components')}
                  >
                    Back to Components
                  </Button>
                  <Button 
                    onClick={handleModelSelectionDone}
                    disabled={!selectedModel}
                  >
                    Continue to Flowsheet Builder
                  </Button>
                </div>
              </div>
            )}
            
            {activeTab === 'builder' && (
              <SimulationBuilder 
                selectedComponents={selectedComponents}
                thermodynamicModel={selectedModel}
                onRunSimulation={handleRunSimulation}
              />
            )}
          </GlassPanel>
          
          {renderAnalysisSection()}
          
          <div className="mt-6 flex justify-between">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Settings2 className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <Button variant="outline" size="sm">
                <GitBranch className="mr-2 h-4 w-4" />
                Version History
              </Button>
            </div>
            <Button 
              className={`${isSimulationRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-green-600 hover:bg-green-700'}`}
              disabled={!allStepsValid || isSimulationRunning}
              onClick={handleRunSimulation}
            >
              <Play className="mr-2 h-4 w-4" />
              {isSimulationRunning ? 'Running Simulation...' : 'Run Simulation'}
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CreateSimulation;
