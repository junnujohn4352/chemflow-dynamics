
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";
import { 
  Save, ArrowLeft, Settings2, GitBranch, Play 
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Custom hooks and components
import { useSimulationData } from "@/hooks/useSimulationData";
import { useSimulationAnalysis } from "@/hooks/useSimulationAnalysis";
import SimulationSteps from "@/components/simulation/SimulationSteps";
import SimulationTabs from "@/components/simulation/SimulationTabs";
import TabContent from "@/components/simulation/TabContent";
import SimulationAnalysisSection from "@/components/simulation/SimulationAnalysisSection";

const CreateSimulation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Simulation data and state management
  const {
    selectedComponents,
    setSelectedComponents,
    selectedModel,
    setSelectedModel,
    simulationName,
    setSimulationName,
    simulationSubject,
    setSimulationSubject,
    detectSimulationSubject,
    saveSimulation
  } = useSimulationData();
  
  // Analysis functionality
  const {
    isSimulationRunning,
    setIsSimulationRunning,
    isSimulationComplete,
    setIsSimulationComplete,
    showAnalysis,
    setShowAnalysis,
    analysisData,
    subjectAnalyses,
    activeSubjectAnalysis,
    setActiveSubjectAnalysis,
    generateAnalysisData,
    generateSubjectAnalyses
  } = useSimulationAnalysis(selectedComponents);
  
  // UI state
  const [activeTab, setActiveTab] = React.useState<'components' | 'thermodynamics' | 'builder'>('components');
  
  // Validation checks
  const componentsValid = selectedComponents.length > 0;
  const allStepsValid = componentsValid && selectedModel !== '';
  
  const handleSaveSimulation = () => {
    saveSimulation();
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
          
          <SimulationSteps 
            componentsValid={componentsValid}
            selectedModel={selectedModel}
            isSimulationComplete={isSimulationComplete}
          />
          
          <SimulationTabs 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            componentsValid={componentsValid}
            selectedModel={selectedModel}
            isSimulationComplete={isSimulationComplete}
            showAnalysis={showAnalysis}
            setShowAnalysis={setShowAnalysis}
          />
          
          <TabContent 
            activeTab={activeTab}
            selectedComponents={selectedComponents}
            setSelectedComponents={setSelectedComponents}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            componentsValid={componentsValid}
            onRunSimulation={handleRunSimulation}
            handleComponentSelectionDone={handleComponentSelectionDone}
            handleModelSelectionDone={handleModelSelectionDone}
          />
          
          <SimulationAnalysisSection 
            showAnalysis={showAnalysis}
            isSimulationComplete={isSimulationComplete}
            setShowAnalysis={setShowAnalysis}
            simulationSubject={simulationSubject}
            selectedComponents={selectedComponents}
            thermodynamicModel={selectedModel}
            subjectAnalyses={subjectAnalyses}
            activeSubjectAnalysis={activeSubjectAnalysis}
            setActiveSubjectAnalysis={setActiveSubjectAnalysis}
            analysisData={analysisData}
          />
          
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
