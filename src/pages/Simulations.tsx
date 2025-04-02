
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import GlassPanel from "@/components/ui/GlassPanel";
import { 
  PlusCircle, Clock, ArrowRight, FlaskConical, 
  Trash2, Play, Edit, Download, Trash
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface SimulationComponent {
  name: string;
  percentage: number;
}

interface SimulationCard {
  id: string;
  name: string;
  description: string;
  lastUpdated: string;
  efficiency: number;
  components: SimulationComponent[] | string[];
  equipment?: number;
  streams?: number;
  thermodynamicModel?: string;
}

// Helper function to safely convert objects to strings
const safeStringify = (value: any): string => {
  if (value === null || value === undefined) {
    return '';
  }
  
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch (e) {
      return '[Object]';
    }
  }
  
  return String(value);
};

const Simulations = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [simulations, setSimulations] = useState<SimulationCard[]>([]);
  
  // Load simulations when component mounts
  useEffect(() => {
    loadSimulations();
  }, []);
  
  const loadSimulations = () => {
    const saved = localStorage.getItem('chemflow-simulations');
    if (saved) {
      try {
        const parsedSimulations = JSON.parse(saved);
        setSimulations(parsedSimulations);
      } catch (e) {
        console.error("Error loading simulations:", e);
      }
    }
  };

  const handleDeleteSimulation = (id: string) => {
    // Update the simulations list
    const updatedSimulations = simulations.filter(sim => sim.id !== id);
    setSimulations(updatedSimulations);
    localStorage.setItem('chemflow-simulations', JSON.stringify(updatedSimulations));
    
    // If active simulation was deleted, clear active simulation flag
    const activeSimData = localStorage.getItem('chemflow-simulation-data');
    if (activeSimData) {
      try {
        const simData = JSON.parse(activeSimData);
        const simName = simData.name;
        
        const deletedSim = simulations.find(sim => sim.id === id);
        if (deletedSim && deletedSim.name === simName) {
          localStorage.removeItem('chemflow-active-simulation');
          localStorage.removeItem('chemflow-simulation-running');
        }
      } catch (e) {
        console.error("Error checking active simulation:", e);
      }
    }
    
    toast({
      title: "Simulation deleted",
      description: "The simulation has been removed successfully."
    });
  };
  
  const handleClearAllSimulations = () => {
    // Clear all simulations
    setSimulations([]);
    localStorage.removeItem('chemflow-simulations');
    
    // Clear active simulation as well
    localStorage.removeItem('chemflow-active-simulation');
    localStorage.removeItem('chemflow-simulation-running');
    localStorage.removeItem('chemflow-simulation-data');
    
    toast({
      title: "All simulations cleared",
      description: "All simulations have been removed successfully."
    });
  };
  
  const handleRunSimulation = (simulation: SimulationCard) => {
    // Load the saved equipment and streams if available
    localStorage.setItem('chemflow-active-simulation', 'true');
    localStorage.setItem('chemflow-simulation-running', 'true');
    
    // Create simulation data object
    const simulationData = {
      name: safeStringify(simulation.name),
      components: simulation.components.map(c => 
        typeof c === 'string' ? c : safeStringify(c.name)
      ),
      thermodynamicModel: safeStringify(simulation.thermodynamicModel || 'Peng-Robinson'),
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('chemflow-simulation-data', JSON.stringify(simulationData));
    
    toast({
      title: "Simulation activated",
      description: "Navigating to analysis..."
    });
    
    // Navigate to analysis page
    setTimeout(() => {
      navigate('/analysis');
    }, 1000);
  };
  
  const handleEditSimulation = (simulation: SimulationCard) => {
    // Set this simulation as active and navigate to create-simulation
    localStorage.setItem('chemflow-active-simulation', 'true');
    
    // Create simulation data object
    const simulationData = {
      name: safeStringify(simulation.name),
      components: simulation.components.map(c => 
        typeof c === 'string' ? c : safeStringify(c.name)
      ),
      thermodynamicModel: safeStringify(simulation.thermodynamicModel || 'Peng-Robinson'),
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('chemflow-simulation-data', JSON.stringify(simulationData));
    
    navigate('/create-simulation');
  };
  
  const exportSimulation = (simulation: SimulationCard) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(simulation));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${safeStringify(simulation.name)}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    toast({
      title: "Simulation exported",
      description: "The simulation has been downloaded as JSON"
    });
  };

  // Helper function to safely render components
  const renderComponents = (components: any[]) => {
    if (!components || !Array.isArray(components)) {
      return <p className="text-sm text-gray-500">No components available</p>;
    }

    return components.map((comp, idx) => {
      // Ensure we're properly handling the component, whether it's a string or object
      const compName = typeof comp === 'string' ? comp : (comp.name ? safeStringify(comp.name) : 'Unknown');
      const percentage = typeof comp === 'string' ? 100 : (comp.percentage || 0);
      
      return (
        <div key={idx} className="mb-2">
          <div className="flex justify-between text-sm mb-1 dark:text-gray-300">
            <span>{compName}</span>
            <span>{typeof comp === 'string' ? '' : `${percentage}%`}</span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div 
              className="h-1.5 rounded-full bg-flow-blue"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-1 py-16 px-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold mb-2 dark:text-white">My Simulations</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage and run your chemical process simulations</p>
            </div>
            <div className="flex space-x-3">
              {simulations.length > 0 && (
                <Button 
                  variant="destructive"
                  onClick={handleClearAllSimulations}
                  className="inline-flex items-center"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Clear All
                </Button>
              )}
              <Link 
                to="/create-simulation"
                className="inline-flex items-center px-5 py-2.5 rounded-lg bg-flow-blue text-white font-medium shadow-sm hover:bg-flow-blue/90 transition-colors"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                New Simulation
              </Link>
            </div>
          </div>
          
          {simulations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {simulations.map((sim) => (
                <GlassPanel 
                  key={safeStringify(sim.id)} 
                  className="p-6 hover:shadow-md transition-shadow bg-white dark:bg-gray-800 dark:border-gray-700"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900 text-flow-blue dark:text-blue-200">
                      <FlaskConical className="h-5 w-5" />
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{new Date(safeStringify(sim.lastUpdated)).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-medium mb-2 dark:text-white">{safeStringify(sim.name)}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{safeStringify(sim.description)}</p>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2 dark:text-gray-200">Components</h4>
                    {sim.components && Array.isArray(sim.components) ? (
                      renderComponents(sim.components)
                    ) : (
                      <p className="text-sm text-gray-500">No components available</p>
                    )}
                  </div>
                  
                  {sim.thermodynamicModel && (
                    <div className="text-sm mb-4 dark:text-gray-300">
                      <span className="text-gray-500 dark:text-gray-400">Property Package:</span>
                      <span className="ml-2 font-medium">{safeStringify(sim.thermodynamicModel)}</span>
                    </div>
                  )}
                  
                  {sim.equipment !== undefined && (
                    <div className="text-sm mb-4 dark:text-gray-300">
                      <span className="text-gray-500 dark:text-gray-400">Equipment:</span>
                      <span className="ml-2 font-medium">{safeStringify(sim.equipment)}</span>
                      {sim.streams !== undefined && (
                        <>
                          <span className="mx-2">|</span>
                          <span className="text-gray-500 dark:text-gray-400">Streams:</span>
                          <span className="ml-2 font-medium">{safeStringify(sim.streams)}</span>
                        </>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm dark:text-gray-300">
                      <span className="text-gray-500 dark:text-gray-400">Efficiency:</span>
                      <span className="ml-2 font-medium text-flow-blue">{safeStringify(sim.efficiency)}%</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDeleteSimulation(sim.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"
                        title="Delete simulation"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => exportSimulation(sim)}
                        className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500"
                        title="Export simulation"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditSimulation(sim)}
                        className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500"
                        title="Edit simulation"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleRunSimulation(sim)}
                        className="p-1.5 rounded-lg hover:bg-green-50 text-green-500"
                        title="Run simulation"
                      >
                        <Play className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </GlassPanel>
              ))}
            </div>
          ) : (
            <GlassPanel className="p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-900">
                  <FlaskConical className="h-6 w-6 text-flow-blue dark:text-blue-200" />
                </div>
              </div>
              <h3 className="text-xl font-medium mb-2 dark:text-white">No Simulations Yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Create your first simulation to get started with chemical process modeling
              </p>
              <Link 
                to="/create-simulation"
                className="inline-flex items-center px-5 py-2.5 rounded-lg bg-flow-blue text-white font-medium hover:bg-flow-blue/90 transition-colors"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Simulation
              </Link>
            </GlassPanel>
          )}
        </div>
      </main>
    </div>
  );
};

export default Simulations;
