import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GlassPanel from "@/components/ui/GlassPanel";
import { 
  Save, ArrowLeft, Layers, Database, Settings2, 
  Thermometer, GitBranch, Play, Check, 
  BarChart3, ChevronDown, ChevronUp, FlaskConical, Waves, Zap, Droplets, Shield, Cpu, Leaf
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SimulationBuilder from "@/components/simulation/SimulationBuilder";
import ComponentSelector from "@/components/simulation/ComponentSelector";
import ThermodynamicsSelector from "@/components/simulation/ThermodynamicsSelector";
import { Button } from "@/components/ui/button";
import HysysIntegration from "@/components/simulation/HysysIntegration";
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
          icon: <Shield className="h-5 w-5" />
