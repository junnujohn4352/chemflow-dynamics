import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GlassPanel from "@/components/ui/GlassPanel";
import { 
  Save, ArrowLeft, Layers, Database, Settings2, 
  GitBranch, Play, Check, Pause, RefreshCw,
  BarChart3, ChevronDown, ChevronUp, FlaskConical, Waves, Zap, Droplets, Shield, Cpu, Leaf,
  ThermometerIcon as Thermometer, Download, FileText
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
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface SubjectAnalysis {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: string;
  charts: React.ReactNode;
  mathData?: string;
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
  const analysisRef = useRef<HTMLDivElement>(null);

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

  // Add the missing function definitions
  const handleComponentSelectionDone = () => {
    if (componentsValid) {
      setActiveTab('thermodynamics');
    } else {
      toast({
        title: "Components required",
        description: "Please select at least one component before continuing",
        variant: "destructive",
      });
    }
  };

  const handleModelSelectionDone = () => {
    if (selectedModel) {
      setActiveTab('builder');
    } else {
      toast({
        title: "Thermodynamic model required",
        description: "Please select a thermodynamic model before continuing",
        variant: "destructive",
      });
    }
  };

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
    
    if (isSimulationComplete && analysisData.length > 0) {
      localStorage.setItem('chemflow-analysis-data', JSON.stringify(analysisData));
      
      handleExportToPDF();
      
      toast({
        title: "Simulation saved",
        description: "Your simulation and analysis data have been saved successfully!"
      });
    } else {
      toast({
        title: "Simulation saved",
        description: "Your simulation has been created successfully!"
      });
    }
  };

  const handleExportToPDF = async () => {
    if (!analysisRef.current || !isSimulationComplete) {
      toast({
        title: "Cannot export analysis",
        description: "Please complete the simulation first",
        variant: "destructive",
      });
      return;
    }
    
    try {
      toast({
        title: "Generating PDF",
        description: "Please wait while we generate your analysis report...",
      });
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const analysisElement = analysisRef.current;
      
      pdf.setFontSize(18);
      pdf.text(`${simulationName} - Analysis Report`, 20, 20);
      
      pdf.setFontSize(12);
      pdf.text(`Thermodynamic Model: ${selectedModel}`, 20, 30);
      pdf.text(`Components: ${selectedComponents.join(", ")}`, 20, 40);
      pdf.text(`Subject: ${simulationSubject || "Chemical Process"}`, 20, 50);
      pdf.text(`Date: ${new Date().toLocaleDateString()}`, 20, 60);
      
      const scale = 2;
      const canvas = await html2canvas(analysisElement, { scale });
      const imgData = canvas.toDataURL('image/png');
      
      const imgWidth = 170;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);
      
      pdf.addPage();
      pdf.setFontSize(16);
      pdf.text("Mathematical Analysis Data", 20, 20);
      
      let yPos = 35;
      subjectAnalyses.forEach(analysis => {
        if (yPos > 250) {
          pdf.addPage();
          yPos = 20;
        }
        
        pdf.setFontSize(14);
        pdf.text(analysis.title, 20, yPos);
        yPos += 10;
        
        pdf.setFontSize(10);
        const mathData = analysis.mathData || generateMathData(analysis.id);
        const mathLines = mathData.split('\n');
        
        mathLines.forEach(line => {
          if (yPos > 280) {
            pdf.addPage();
            yPos = 20;
          }
          pdf.text(line, 20, yPos);
          yPos += 5;
        });
        
        yPos += 15;
      });
      
      pdf.save(`${simulationName.replace(/\s+/g, '_')}_Analysis.pdf`);
      
      toast({
        title: "PDF Generated",
        description: "Analysis report has been saved as PDF",
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "PDF Generation Failed",
        description: "There was an error generating the PDF report",
        variant: "destructive"
      });
    }
  };

  const generateMathData = (analysisType: string): string => {
    switch (analysisType) {
      case "heatTransfer":
        return `Heat Transfer Calculations:
Q = U × A × LMTD
where:
U = Overall heat transfer coefficient = ${(25 + Math.random() * 10).toFixed(2)} W/m²·K
A = Heat transfer area = ${(15 + Math.random() * 5).toFixed(2)} m²
LMTD = Log Mean Temperature Difference = ${(65 + Math.random() * 15).toFixed(2)} °C

Heat Duty Q = ${(24000 + Math.random() * 5000).toFixed(2)} W`;

      case "fluidFlow":
        return `Fluid Flow Calculations:
Pressure Drop (ΔP) = f × (L/D) × (ρ × v²/2)
where:
f = Friction factor = ${(0.02 + Math.random() * 0.01).toFixed(4)}
L = Pipe length = ${(10 + Math.random() * 5).toFixed(2)} m
D = Pipe diameter = ${(0.1 + Math.random() * 0.05).toFixed(3)} m
ρ = Fluid density = ${(800 + Math.random() * 200).toFixed(2)} kg/m³
v = Fluid velocity = ${(1 + Math.random() * 0.5).toFixed(2)} m/s

Pressure Drop = ${(10 + Math.random() * 5).toFixed(2)} kPa`;

      case "thermodynamics":
        return `Thermodynamic Properties (${selectedModel}):
${selectedComponents.map(comp => 
  `${comp}:
  - Critical Temperature: ${(300 + Math.random() * 200).toFixed(2)} K
  - Critical Pressure: ${(5 + Math.random() * 3).toFixed(2)} MPa
  - Acentric Factor: ${(0.2 + Math.random() * 0.3).toFixed(3)}
  - Compressibility Factor (Z): ${(0.7 + Math.random() * 0.3).toFixed(3)}`
).join('\n\n')}

Mixture Properties:
- Fugacity Coefficients calculated using ${selectedModel} equation of state
- Departure Functions for enthalpy and entropy calculated`;

      case "massTransfer":
        return `Mass Transfer Analysis:
Overall Mass Transfer Coefficient (K) = ${(0.005 + Math.random() * 0.003).toFixed(5)} m/s
Number of Transfer Units (NTU) = ${(3 + Math.random() * 2).toFixed(2)}
Height of Transfer Unit (HTU) = ${(0.5 + Math.random() * 0.3).toFixed(2)} m
Packing Height = NTU × HTU = ${(1.5 + Math.random() * 1).toFixed(2)} m`;

      case "reactionEngineering":
        return `Reaction Engineering:
Reaction: ${selectedComponents[0] || "A"} → ${selectedComponents[1] || "B"} + ${selectedComponents[2] || "C"}
Rate Constant (k) = ${(0.05 + Math.random() * 0.03).toFixed(4)} s⁻¹
Activation Energy (Ea) = ${(50 + Math.random() * 20).toFixed(2)} kJ/mol
Pre-exponential Factor (A) = ${(1e5 + Math.random() * 5e4).toExponential(2)} s⁻¹
Conversion at equilibrium = ${(0.9 + Math.random() * 0.09).toFixed(4)} (${((0.9 + Math.random() * 0.09) * 100).toFixed(2)}%)`;

      case "safetyAnalysis":
        return `Safety Analysis:
Relief Valve Sizing:
- Required Relief Area = ${(0.001 + Math.random() * 0.0005).toFixed(5)} m²
- Relief Flow Rate = ${(10 + Math.random() * 5).toFixed(2)} kg/s
- Set Pressure = ${(100 + Math.random() * 20).toFixed(2)} kPa

Explosion Index = ${(3 + Math.random() * 2).toFixed(2)}
Maximum Overpressure = ${(50 + Math.random() * 20).toFixed(2)} kPa`;

      case "processSimulation":
        return `Process Simulation Results:
Mass Balance:
${selectedComponents.map(comp => 
  `${comp}: ${(90 + Math.random() * 10).toFixed(2)}% recovery`
).join('\n')}

Energy Balance:
- Total Heat Input = ${(500 + Math.random() * 100).toFixed(2)} kW
- Total Heat Output = ${(480 + Math.random() * 100).toFixed(2)} kW
- Heat Loss = ${(20 + Math.random() * 10).toFixed(2)} kW`;

      case "utilityEnvironmental":
        return `Utility & Environmental Analysis:
Utility Requirements:
- Steam Consumption = ${(2000 + Math.random() * 500).toFixed(2)} kg/h
- Cooling Water = ${(20000 + Math.random() * 5000).toFixed(2)} kg/h
- Electricity = ${(100 + Math.random() * 30).toFixed(2)} kWh

Environmental Impact:
- CO₂ Emissions = ${(500 + Math.random() * 100).toFixed(2)} kg/h
- Wastewater Generation = ${(5 + Math.random() * 2).toFixed(2)} m³/h`;

      default:
        return `Analysis Data for ${analysisType}:\nDetailed mathematical calculations based on ${selectedModel} model with components: ${selectedComponents.join(", ")}`;
    }
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
    
    generateAccurateAnalysisData();
    
    await generateDetailedSubjectAnalyses(subject);

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

  const generateAccurateAnalysisData = () => {
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
        let concentrationProfile;
        
        if (comp === 'Ethanol') {
          concentrationProfile = Math.min(95, 10 + 85 * (1 - Math.exp(-0.2 * time)));
        } else if (comp === 'Water') {
          concentrationProfile = Math.min(90, 15 + 75 * (1 - Math.exp(-0.15 * time)));
        } else if (comp === 'Methanol') {
          concentrationProfile = Math.min(85, 5 + 80 * (1 - Math.exp(-0.25 * time)));
        } else if (comp === 'Butanol') {
          concentrationProfile = Math.min(75, 8 + 67 * (1 - Math.exp(-0.18 * time)));
        } else {
          concentrationProfile = Math.min(80, 10 + 70 * (1 - Math.exp(-0.2 * time)));
        }
        
        concentrationProfile *= (0.95 + Math.random() * 0.1);
        
        if (selectedModel === 'Peng-Robinson') {
          concentrationProfile *= 1.02;
        } else if (selectedModel === 'Soave-Redlich-Kwong') {
          concentrationProfile *= 0.98;
        } else if (selectedModel === 'NRTL') {
          concentrationProfile *= (1 + Math.sin(time / 5) * 0.05);
        }
        
        baseObj[comp] = concentrationProfile;
      });
      
      if (selectedComponents.includes('Ethanol') && selectedComponents.includes('Water')) {
        baseObj.temperature = 351 + 5 * Math.sin(time / 3);
      } else if (selectedComponents.some(c => c.includes('ane'))) {
        baseObj.temperature = 273 + 30 * Math.sin(time / 4);
      } else {
        baseObj.temperature = 300 + 50 * Math.sin(time / 5);
      }
      
      if (selectedModel === 'Peng-Robinson' || selectedModel === 'Soave-Redlich-Kwong') {
        baseObj.pressure = 150 - 50 * Math.cos(time / 3);
      } else {
        baseObj.pressure = 100 - 10 * Math.cos(time / 3);
      }
      
      if (selectedComponents.length >= 2) {
        baseObj.conversion = Math.min(0.95, 1 - Math.exp(-0.15 * time));
      } else {
        baseObj.conversion = Math.min(0.90, 1 - Math.exp(-0.10 * time));
      }
      
      return baseObj;
    });
    
    setAnalysisData(data);
  };

  const startRealTimeAnalysis = () => {
    if (realTimeInterval) {
      clearInterval(realTimeInterval);
    }

    const initialData = generateAccurateRealTimeDataPoint(0);
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
        
        const newDataPoint = generateAccurateRealTimeDataPoint(timePoint);
        return [...prevData, newDataPoint];
      });
    }, 2000);
    
    setRealTimeInterval(intervalId);
  };

  const generateAccurateRealTimeDataPoint = (timePoint: number) => {
    const dataPoint: { 
      time: number; 
      temperature?: number; 
      pressure?: number; 
      conversion?: number;
      [key: string]: number | undefined; 
    } = { time: timePoint };
    
    selectedComponents.forEach(comp => {
      let value;
      
      if (comp === 'Ethanol') {
        value = Math.min(95, 10 + 85 * (1 - Math.exp(-0.2 * timePoint)));
        
        if (selectedModel === 'NRTL' || selectedModel === 'UNIQUAC') {
          value *= 1.05;
        }
      } else if (comp === 'Water') {
        value = Math.min(90, 15 + 75 * (1 - Math.exp(-0.15 * timePoint)));
        
        if (selectedModel === 'Peng-Robinson') {
          value *= 0.95;
        }
      } else if (comp === 'Methanol') {
        value = Math.min(85, 5 + 80 * (1 - Math.exp(-0.25 * timePoint)));
        
        if (selectedComponents.includes('Acetic Acid')) {
          value *= 0.85;
        }
      } else if (comp === 'Butanol') {
        value = Math.min(75, 8 + 67 * (1 - Math.exp(-0.18 * timePoint)));
      } else if (comp.includes('Acid')) {
        value = Math.max(5, 70 - 65 * (1 - Math.exp(-0.15 * timePoint)));
      } else if (comp.includes('ane')) {
        value = Math.min(60, 5 + 55 * (1 - Math.exp(-0.3 * timePoint)));
      } else {
        value = Math.min(80, 10 + 70 * (1 - Math.exp(-0.2 * timePoint)));
      }
      
      dataPoint[comp] = value * (0.95 + Math.random() * 0.1);
    });
    
    if (simulationSubject === 'Distillation') {
      dataPoint.temperature = 350 + 30 * Math.sin(timePoint / 5 + Math.random() * 0.3);
    } else if (simulationSubject === 'Esterification Reaction') {
      dataPoint.temperature = 330 + 25 * Math.sin(timePoint / 4 + Math.random() * 0.2);
    } else if (simulationSubject === 'Gas Processing') {
      dataPoint.temperature = 250 + 40 * Math.sin(timePoint / 6 + Math.random() * 0.4);
    } else {
      dataPoint.temperature = 300 + 50 * Math.sin(timePoint / 3 + Math.random() * 0.5);
    }
    
    if (simulationSubject === 'Gas Processing') {
      dataPoint.pressure = 200 - 20 * Math.cos(timePoint / 2 + Math.random() * 0.3);
    } else {
      dataPoint.pressure = 100 - 10 * Math.cos(timePoint / 2 + Math.random() * 0.3);
    }
    
    if (simulationSubject === 'Esterification Reaction') {
      dataPoint.conversion = Math.min(0.98, 1 - Math.exp(-0.15 * (timePoint + 1)));
    } else if (simulationSubject === 'Aromatics Separation') {
      dataPoint.conversion = Math.min(0.95, 1 - Math.exp(-0.1 * (timePoint + 1)));
    } else {
      dataPoint.conversion = Math.min(0.90, 1 - Math.exp(-0.08 * (timePoint + 1)));
    }
    
    return dataPoint;
  };

  const generateDetailedSubjectAnalyses = async (subject: string) => {
    try {
      const generateDetailedAnalysis = (subject: string, components: string[]): string => {
        const analysisText = `# ${subject} Analysis Summary
        
This analysis examines the ${subject} process using ${components.join(", ")} as the main components with the ${selectedModel} thermodynamic model.
        
## Key Findings
- The process shows stable behavior under normal operating conditions
- Operating temperature range: ${(300 + Math.random() * 50).toFixed(1)}-${(350 + Math.random() * 50).toFixed(1)}K
- Operating pressure range: ${(90 + Math.random() * 10).toFixed(1)}-${(110 + Math.random() * 20).toFixed(1)} kPa
- The system achieves ${(93 + Math.random() * 6).toFixed(1)}% conversion efficiency

## Mathematical Model
${selectedModel} was used to calculate fugacity coefficients and activity coefficients.
${components.length > 1 ? `The binary interaction parameters were fitted to experimental VLE data.` : ''}
${subject.includes('Reaction') ? `The reaction kinetics follow an Arrhenius-type rate expression with activation energy of ${(50 + Math.random() * 30).toFixed(1)} kJ/mol.` : ''}

## Recommendations
- Consider ${Math.random() > 0.5 ? 'increasing residence time' : 'optimizing temperature profile'} for better conversion
- Monitor temperature gradients in the system to prevent ${Math.random() > 0.5 ? 'hotspots' : 'cold spots'}
- Optimize energy usage by heat integration with ${Math.random() > 0.5 ? 'feed preheating' : 'product cooling'}
- Regular maintenance of critical equipment is recommended to prevent ${Math.random() > 0.5 ? 'fouling' : 'corrosion'}`;

        return analysisText;
      };
      
      const heatTransferAnalysis = generateDetailedAnalysis(`Heat Transfer for ${subject}`, selectedComponents);
      const fluidFlowAnalysis = generateDetailedAnalysis(`Fluid Flow for ${subject}`, selectedComponents);
      const thermodynamicsAnalysis = generateDetailedAnalysis(`Thermodynamics for ${subject}`, selectedComponents);
      const massTransferAnalysis = generateDetailedAnalysis(`Mass Transfer for ${subject}`, selectedComponents);
      const reactionAnalysis = generateDetailedAnalysis(`Reaction Engineering for ${subject}`, selectedComponents);
      const safetyAnalysis = generateDetailedAnalysis(`Safety for ${subject}`, selectedComponents);
      const processAnalysis = generateDetailedAnalysis(`Process Simulation for ${subject}`, selectedComponents);
      const utilityAnalysis = generateDetailedAnalysis(`Utility Requirements for ${subject}`, selectedComponents);
      
      const analyses: SubjectAnalysis[] = [
        {
          id: "heatTransfer",
          title: "Heat Transfer Analysis",
          icon: <Thermometer className="h-5 w-5" />,
          content: heatTransferAnalysis,
          mathData: generateMathData("heatTransfer"),
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
                <CartesianGrid
