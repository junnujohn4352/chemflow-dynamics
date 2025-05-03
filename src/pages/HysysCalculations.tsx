
import React, { useState, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ComponentSelector from "@/components/simulation/ComponentSelector";
import ThermodynamicsSelector from "@/components/simulation/ThermodynamicsSelector";
import EquipmentSelector from "@/components/simulation/EquipmentSelector";
import { 
  Play, 
  ArrowLeft, 
  ArrowRight, 
  Check,
  RefreshCw,
  FileText,
  ChevronRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { EquipmentType } from "@/components/ui/equipment/EquipmentIcons";
import { Separator } from "@/components/ui/separator";
import HysysIntegration from "@/components/simulation/HysysIntegration";
import html2canvas from 'jspdf';
import jsPDF from 'jspdf';

const HysysCalculations = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<'chemicals' | 'thermodynamics' | 'equipment' | 'results'>('chemicals');
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('Peng-Robinson');
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentType[]>([]);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationComplete, setSimulationComplete] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Calculate progress based on current step
  const calculateProgress = () => {
    switch(currentStep) {
      case 'chemicals': return 25;
      case 'thermodynamics': return 50;
      case 'equipment': return 75;
      case 'results': return 100;
      default: return 0;
    }
  };

  const handleComponentSelectionDone = () => {
    if (selectedComponents.length === 0) {
      toast({
        title: "Components required",
        description: "Please select at least one chemical component before continuing",
        variant: "destructive",
      });
      return;
    }
    setCurrentStep('thermodynamics');
    setSimulationProgress(calculateProgress());
  };

  const handleThermodynamicsSelectionDone = () => {
    if (!selectedModel) {
      toast({
        title: "Thermodynamic model required",
        description: "Please select a thermodynamic model before continuing",
        variant: "destructive",
      });
      return;
    }
    setCurrentStep('equipment');
    setSimulationProgress(calculateProgress());
  };

  const handleEquipmentSelectionDone = () => {
    if (selectedEquipment.length === 0) {
      toast({
        title: "Equipment required",
        description: "Please add at least one piece of equipment to your flowsheet",
        variant: "destructive",
      });
      return;
    }
    setCurrentStep('results');
    setSimulationProgress(calculateProgress());
    runSimulation();
  };

  const handleSelectEquipment = (equipmentType: EquipmentType) => {
    setSelectedEquipment([...selectedEquipment, equipmentType]);
  };

  const handleGoBack = () => {
    switch(currentStep) {
      case 'thermodynamics':
        setCurrentStep('chemicals');
        break;
      case 'equipment':
        setCurrentStep('thermodynamics');
        break;
      case 'results':
        setCurrentStep('equipment');
        break;
      default:
        break;
    }
    setSimulationProgress(calculateProgress());
  };

  const runSimulation = () => {
    setSimulationRunning(true);
    
    // Simulate a delay for the simulation to run
    setTimeout(() => {
      setSimulationRunning(false);
      setSimulationComplete(true);
      toast({
        title: "Simulation Complete",
        description: "HYSYS calculation results are now available",
      });
    }, 2000);
  };

  const handleExportToPDF = async () => {
    if (!resultsRef.current || !simulationComplete) {
      toast({
        title: "Cannot export results",
        description: "Please complete the simulation first",
        variant: "destructive",
      });
      return;
    }
    
    try {
      toast({
        title: "Generating PDF",
        description: "Please wait while we generate your report...",
      });
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const resultsElement = resultsRef.current;
      
      pdf.setFontSize(18);
      pdf.text("HYSYS Calculation Results", 20, 20);
      
      pdf.setFontSize(12);
      pdf.text(`Thermodynamic Model: ${selectedModel}`, 20, 30);
      pdf.text(`Components: ${selectedComponents.join(", ")}`, 20, 40);
      pdf.text(`Date: ${new Date().toLocaleDateString()}`, 20, 50);
      
      pdf.save("HysysCalculationResults.pdf");
      
      toast({
        title: "PDF Generated",
        description: "Results have been saved as PDF",
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

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-900">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">HYSYS Calculations</h1>
          
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-1">
              <span className={`${currentStep === 'chemicals' ? 'font-medium text-blue-600' : ''}`}>
                1. Select Chemicals
              </span>
              <span className={`${currentStep === 'thermodynamics' ? 'font-medium text-blue-600' : ''}`}>
                2. Thermodynamic Model
              </span>
              <span className={`${currentStep === 'equipment' ? 'font-medium text-blue-600' : ''}`}>
                3. Equipment Flow
              </span>
              <span className={`${currentStep === 'results' ? 'font-medium text-blue-600' : ''}`}>
                4. Results
              </span>
            </div>
            <Progress value={simulationProgress} className="h-2" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
          {currentStep === 'chemicals' && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Select Chemical Components</h2>
                <Button 
                  onClick={handleComponentSelectionDone}
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
                <div className="flex items-center">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleGoBack}
                    className="mr-4"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Select Thermodynamic Model</h2>
                </div>
                <Button 
                  onClick={handleThermodynamicsSelectionDone}
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
          
          {currentStep === 'equipment' && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleGoBack}
                    className="mr-4"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Equipment Flow Selection</h2>
                </div>
                <Button 
                  onClick={handleEquipmentSelectionDone}
                  className="flex items-center"
                >
                  Run Simulation
                  <Play className="h-4 w-4 ml-1" />
                </Button>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Select equipment to add to your flowsheet. Current selection: {selectedEquipment.length} item(s)
                </p>
              </div>
              
              <EquipmentSelector onSelectEquipment={handleSelectEquipment} />
              
              {selectedEquipment.length > 0 && (
                <div className="mt-4 p-4 border rounded-md">
                  <h3 className="text-md font-medium mb-2">Selected Equipment:</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedEquipment.map((eq, idx) => (
                      <div key={idx} className="px-3 py-2 bg-blue-50 dark:bg-blue-900 rounded-md text-sm">
                        {eq.replace("-", " ")}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {currentStep === 'results' && (
            <div className="animate-fade-in" ref={resultsRef}>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleGoBack}
                    className="mr-4"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Simulation Results</h2>
                </div>
                <Button 
                  onClick={handleExportToPDF}
                  variant="outline"
                  className="flex items-center"
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Export PDF
                </Button>
              </div>
              
              {simulationRunning ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <RefreshCw className="h-10 w-10 text-blue-600 animate-spin mb-4" />
                  <h3 className="text-lg font-medium">Running HYSYS Calculations</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Please wait while we process your simulation...
                  </p>
                </div>
              ) : simulationComplete ? (
                <HysysIntegration 
                  selectedComponents={selectedComponents}
                  thermodynamicModel={selectedModel}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <h3 className="text-lg font-medium">Ready to Run Simulation</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Click "Run Simulation" to start HYSYS calculations
                  </p>
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

export default HysysCalculations;
