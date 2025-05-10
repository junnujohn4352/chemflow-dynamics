
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
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
  const [loadingAnimationComplete, setLoadingAnimationComplete] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Show initial animation then set the state to complete
    const timer = setTimeout(() => {
      setLoadingAnimationComplete(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-900 relative overflow-hidden">
      <Navbar />
      
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-20 right-10 w-72 h-72 rounded-full bg-blue-300 opacity-20 blur-3xl animate-pulse" style={{ animationDuration: '15s' }}></div>
        <div className="absolute top-40 -left-20 w-80 h-80 rounded-full bg-purple-300 opacity-15 blur-3xl animate-pulse" style={{ animationDuration: '18s' }}></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 rounded-full bg-indigo-300 opacity-10 blur-3xl animate-pulse" style={{ animationDuration: '12s' }}></div>
      </div>
      
      <main className="flex-1 container mx-auto px-4 py-6 relative z-10">
        <motion.div 
          initial="hidden"
          animate={loadingAnimationComplete ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <motion.div className="mb-6" variants={itemVariants}>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">HYSYS Calculations</h1>
            
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <motion.span 
                  className={`${currentStep === 'chemicals' ? 'font-medium text-blue-600' : ''} transition-colors duration-300`}
                  whileHover={{ scale: 1.05 }}
                >
                  1. Select Chemicals
                </motion.span>
                <motion.span 
                  className={`${currentStep === 'thermodynamics' ? 'font-medium text-blue-600' : ''} transition-colors duration-300`}
                  whileHover={{ scale: 1.05 }}
                >
                  2. Thermodynamic Model
                </motion.span>
                <motion.span 
                  className={`${currentStep === 'equipment' ? 'font-medium text-blue-600' : ''} transition-colors duration-300`}
                  whileHover={{ scale: 1.05 }}
                >
                  3. Equipment Flow
                </motion.span>
                <motion.span 
                  className={`${currentStep === 'results' ? 'font-medium text-blue-600' : ''} transition-colors duration-300`}
                  whileHover={{ scale: 1.05 }}
                >
                  4. Results
                </motion.span>
              </div>
              <motion.div 
                className="relative h-2 bg-blue-100 rounded-full overflow-hidden"
                initial={{ width: "100%" }}
              >
                <motion.div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                  initial={{ width: "0%" }}
                  animate={{ width: `${simulationProgress}%` }}
                  transition={{ 
                    duration: 0.5, 
                    ease: "easeInOut" 
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-blue-100 p-6 mb-6"
            variants={itemVariants}
          >
            {currentStep === 'chemicals' && (
              <motion.div 
                className="animate-fade-in"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Select Chemical Components</h2>
                  <Button 
                    onClick={handleComponentSelectionDone}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-blue-300/30"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
                
                <ComponentSelector 
                  selectedComponents={selectedComponents} 
                  setSelectedComponents={setSelectedComponents} 
                />
              </motion.div>
            )}
            
            {currentStep === 'thermodynamics' && (
              <motion.div 
                className="animate-fade-in"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleGoBack}
                      className="mr-4 border-blue-200 hover:bg-blue-50"
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Back
                    </Button>
                    <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Select Thermodynamic Model</h2>
                  </div>
                  <Button 
                    onClick={handleThermodynamicsSelectionDone}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-blue-300/30"
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
              </motion.div>
            )}
            
            {currentStep === 'equipment' && (
              <motion.div 
                className="animate-fade-in"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleGoBack}
                      className="mr-4 border-blue-200 hover:bg-blue-50"
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Back
                    </Button>
                    <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Equipment Flow Selection</h2>
                  </div>
                  <Button 
                    onClick={handleEquipmentSelectionDone}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-blue-300/30"
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
                  <motion.div 
                    className="mt-4 p-4 border border-blue-100 rounded-md bg-blue-50/50"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ 
                      opacity: 1, 
                      height: 'auto',
                      transition: { duration: 0.3 }
                    }}
                  >
                    <h3 className="text-md font-medium mb-2 text-blue-700">Selected Equipment:</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedEquipment.map((eq, idx) => (
                        <motion.div 
                          key={idx} 
                          className="px-3 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-md text-sm text-blue-700 shadow-sm"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ 
                            opacity: 1, 
                            scale: 1,
                            transition: { delay: idx * 0.1 }
                          }}
                          whileHover={{ scale: 1.05 }}
                        >
                          {eq.replace("-", " ")}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
            
            {currentStep === 'results' && (
              <motion.div 
                className="animate-fade-in"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                ref={resultsRef}
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleGoBack}
                      className="mr-4 border-blue-200 hover:bg-blue-50"
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Back
                    </Button>
                    <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Simulation Results</h2>
                  </div>
                  <Button 
                    onClick={handleExportToPDF}
                    variant="outline"
                    className="flex items-center border-blue-200 hover:bg-blue-50"
                    disabled={!simulationComplete}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Export PDF
                  </Button>
                </div>
                
                {simulationRunning ? (
                  <motion.div 
                    className="flex flex-col items-center justify-center py-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div
                      animate={{ 
                        rotate: 360,
                        transition: { duration: 2, repeat: Infinity, ease: "linear" }
                      }}
                    >
                      <RefreshCw className="h-16 w-16 text-blue-600 mb-4" />
                    </motion.div>
                    <motion.h3 
                      className="text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                    >
                      Running HYSYS Calculations
                    </motion.h3>
                    <motion.p 
                      className="text-gray-600 dark:text-gray-400"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.3 }}
                    >
                      Please wait while we process your simulation...
                    </motion.p>
                  </motion.div>
                ) : simulationComplete ? (
                  <HysysIntegration 
                    selectedComponents={selectedComponents}
                    thermodynamicModel={selectedModel}
                  />
                ) : (
                  <motion.div 
                    className="flex flex-col items-center justify-center py-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.h3 
                      className="text-lg font-medium mb-2"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                    >
                      Ready to Run Simulation
                    </motion.h3>
                    <motion.p 
                      className="text-gray-600 dark:text-gray-400"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.3 }}
                    >
                      Click "Run Simulation" to start HYSYS calculations
                    </motion.p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HysysCalculations;
