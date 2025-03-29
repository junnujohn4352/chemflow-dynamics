
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GlassPanel from "@/components/ui/GlassPanel";
import { 
  Save, ArrowLeft, Layers, Database, Settings2, 
  Thermometer, GitBranch, Play
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SimulationBuilder from "@/components/simulation/SimulationBuilder";
import ComponentSelector from "@/components/simulation/ComponentSelector";
import ThermodynamicsSelector from "@/components/simulation/ThermodynamicsSelector";

const CreateSimulation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'components' | 'thermodynamics' | 'builder'>('components');
  const [simulationName, setSimulationName] = useState('Untitled Simulation');
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState('Peng-Robinson');
  
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
              <button 
                className="inline-flex items-center px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 font-medium shadow-sm hover:bg-gray-50 transition-colors"
                onClick={() => navigate("/simulations")}
              >
                Cancel
              </button>
              <button 
                className="inline-flex items-center px-4 py-2 rounded-lg bg-flow-blue text-white font-medium shadow-sm hover:bg-flow-blue/90 transition-colors"
                onClick={handleSaveSimulation}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Simulation
              </button>
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
              </button>
            </div>
          </div>
          
          {/* Tab content */}
          <GlassPanel className="p-6">
            {activeTab === 'components' && (
              <ComponentSelector 
                selectedComponents={selectedComponents}
                setSelectedComponents={setSelectedComponents}
              />
            )}
            
            {activeTab === 'thermodynamics' && (
              <ThermodynamicsSelector 
                selectedModel={selectedModel}
                setSelectedModel={setSelectedModel}
              />
            )}
            
            {activeTab === 'builder' && (
              <SimulationBuilder 
                selectedComponents={selectedComponents}
                thermodynamicModel={selectedModel}
              />
            )}
          </GlassPanel>
          
          {/* Footer actions */}
          <div className="mt-6 flex justify-between">
            <div className="flex items-center gap-3">
              <button className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-50 text-gray-700 font-medium hover:bg-gray-100 transition-colors">
                <Settings2 className="mr-2 h-4 w-4" />
                Settings
              </button>
              <button className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-50 text-gray-700 font-medium hover:bg-gray-100 transition-colors">
                <GitBranch className="mr-2 h-4 w-4" />
                Version History
              </button>
            </div>
            <button className="inline-flex items-center px-4 py-2 rounded-lg bg-green-50 text-green-600 font-medium hover:bg-green-100 transition-colors">
              <Play className="mr-2 h-4 w-4" />
              Run Simulation
            </button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CreateSimulation;
