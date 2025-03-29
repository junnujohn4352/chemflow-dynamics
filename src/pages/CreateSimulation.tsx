
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GlassPanel from "@/components/ui/GlassPanel";
import { 
  Save, ArrowLeft, Layers, Database, Settings2, 
  Thermometer, GitBranch, Play, Check
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SimulationBuilder from "@/components/simulation/SimulationBuilder";
import ComponentSelector from "@/components/simulation/ComponentSelector";
import ThermodynamicsSelector from "@/components/simulation/ThermodynamicsSelector";
import { Button } from "@/components/ui/button";

const CreateSimulation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'components' | 'thermodynamics' | 'builder'>('components');
  const [simulationName, setSimulationName] = useState('Untitled Simulation');
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState('Peng-Robinson');
  const [isSimulationComplete, setIsSimulationComplete] = useState(false);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  
  // Validation checks
  const componentsValid = selectedComponents.length > 0;
  const allStepsValid = componentsValid && selectedModel !== '';
  
  // Handle save simulation
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
    
    // Here you would save the simulation data to your backend
    // For now, we'll just simulate a successful save
    toast({
      title: "Simulation saved",
      description: "Your simulation has been created successfully!"
    });
    
    navigate("/simulations");
  };

  // Handle run simulation
  const handleRunSimulation = () => {
    if (!allStepsValid) {
      toast({
        title: "Incomplete setup",
        description: "Please complete all simulation setup steps first",
        variant: "destructive",
      });
      return;
    }

    setIsSimulationRunning(true);
    
    // Simulate a processing delay
    setTimeout(() => {
      setIsSimulationRunning(false);
      setIsSimulationComplete(true);
      
      toast({
        title: "Simulation complete",
        description: "Process simulation finished successfully!",
      });
    }, 3000);
  };
  
  // Proceed to next tab automatically when component selection is done
  const handleComponentSelectionDone = () => {
    if (componentsValid && activeTab === 'components') {
      toast({
        title: "Components selected",
        description: "Now choose a thermodynamic model for your simulation"
      });
      setActiveTab('thermodynamics');
    }
  };
  
  // Proceed to builder when thermodynamic model is selected
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
          {/* Header with navigation */}
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
                onClick={() => navigate("/simulations")}
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
          
          {/* Progress indicator */}
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
          
          {/* Tabs navigation */}
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
            </div>
          </div>
          
          {/* Tab content */}
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
          
          {/* Footer actions */}
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
