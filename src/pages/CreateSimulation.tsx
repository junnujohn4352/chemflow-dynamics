import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { 
  Save, ArrowLeft, Play, Check, RefreshCw, Download, 
  FileText, ChevronRight, ChevronLeft, ChevronDown,
  BarChart3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SimulationBuilder } from "@/components/simulation/SimulationBuilder";
import ComponentSelector from "@/components/simulation/ComponentSelector";
import ThermodynamicsSelector from "@/components/simulation/ThermodynamicsSelector";
import SimulationResults from "@/components/simulation/SimulationResults";
import { Button } from "@/components/ui/button";
import TooltipWrapper from "@/components/ui/TooltipWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const CreateSimulation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<'components' | 'thermodynamics' | 'builder'>('components');
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [simulationName, setSimulationName] = useState('Untitled Simulation');
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState('Peng-Robinson');
  const [isSimulationComplete, setIsSimulationComplete] = useState(false);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisData, setAnalysisData] = useState<any[]>([]);
  const [simulationSubject, setSimulationSubject] = useState<string | null>(null);
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
  
  useEffect(() => {
    let progress = 0;
    if (selectedComponents.length > 0) progress += 33;
    if (selectedModel !== '') progress += 33;
    if (isSimulationComplete) progress += 34;
    setSimulationProgress(progress);
  }, [selectedComponents, selectedModel, isSimulationComplete]);

  const componentsValid = selectedComponents.length > 0;
  const allStepsValid = componentsValid && selectedModel !== '';

  const handleComponentSelectionDone = () => {
    if (componentsValid) {
      setCurrentStep('thermodynamics');
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
      setCurrentStep('builder');
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
    
    const simulationData = {
      name: simulationName,
      components: selectedComponents,
      thermodynamicModel: selectedModel,
      subject: simulationSubject,
      lastUpdated: new Date().toISOString(),
      id: `sim-${Date.now()}`
    };
    
    localStorage.setItem('chemflow-simulation-data', JSON.stringify(simulationData));
    localStorage.setItem('chemflow-active-simulation', 'true');
    
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

  const handleGoBack = () => {
    if (currentStep === 'thermodynamics') {
      setCurrentStep('components');
    } else if (currentStep === 'builder') {
      setCurrentStep('thermodynamics');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-900">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Simulation</h1>
              <div className="ml-4">
                <input
                  type="text"
                  value={simulationName}
                  onChange={(e) => setSimulationName(e.target.value)}
                  className="border border-gray-300 dark:border-gray-700 rounded-md p-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  placeholder="Simulation Name"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {currentStep !== 'components' && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleGoBack}
                  className="flex items-center"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              )}
              
              <Button 
                onClick={handleSaveSimulation}
                variant="outline"
                className="flex items-center"
              >
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
              
              {currentStep === 'builder' && (
                <Button 
                  onClick={handleRunSimulation} 
                  disabled={isSimulationRunning}
                  className="bg-green-600 hover:bg-green-700 text-white flex items-center"
                >
                  {isSimulationRunning ? (
                    <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4 mr-1" />
                  )}
                  {isSimulationRunning ? 'Simulating...' : 'Run Simulation'}
                </Button>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-1">
              <span className={`${currentStep === 'components' ? 'font-medium text-blue-600' : ''}`}>1. Select Components</span>
              <span className={`${currentStep === 'thermodynamics' ? 'font-medium text-blue-600' : ''}`}>2. Thermodynamic Model</span>
              <span className={`${currentStep === 'builder' ? 'font-medium text-blue-600' : ''}`}>3. Build Flowsheet</span>
            </div>
            <Progress value={simulationProgress} className="h-2" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
          {currentStep === 'components' && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Select Chemical Components</h2>
                <Button 
                  onClick={handleComponentSelectionDone}
                  disabled={!componentsValid}
                  className="flex items-center"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              
              <ComponentSelector 
                selectedComponents={selectedComponents} 
                setSelectedComponents={setSelectedComponents} 
              />
            </div>
          )}
          
          {currentStep === 'thermodynamics' && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Select Thermodynamic Model</h2>
                <Button 
                  onClick={handleModelSelectionDone}
                  disabled={!selectedModel}
                  className="flex items-center"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              
              <ThermodynamicsSelector 
                selectedModel={selectedModel}
                setSelectedModel={setSelectedModel}
                selectedComponents={selectedComponents}
              />
            </div>
          )}
          
          {currentStep === 'builder' && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Process Flowsheet Builder</h2>
              
              <SimulationBuilder 
                selectedComponents={selectedComponents}
                thermodynamicModel={selectedModel}
                onRunSimulation={handleRunSimulation}
              />
              
              {isSimulationComplete && showAnalysis && (
                <div ref={analysisRef}>
                  <SimulationResults
                    simulationSubject={simulationSubject}
                    components={selectedComponents}
                    thermodynamicModel={selectedModel}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CreateSimulation;
