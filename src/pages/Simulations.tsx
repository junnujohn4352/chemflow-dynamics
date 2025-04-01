
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import GlassPanel from "@/components/ui/GlassPanel";
import { 
  PlusCircle, Clock, ArrowRight, FlaskConical, 
  Trash2, Play, Edit, Download 
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
  components: SimulationComponent[];
  equipment?: number;
  streams?: number;
  thermodynamicModel?: string;
}

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
  
  const handleRunSimulation = (simulation: SimulationCard) => {
    // Load the saved equipment and streams if available
    localStorage.setItem('chemflow-active-simulation', 'true');
    localStorage.setItem('chemflow-simulation-running', 'true');
    
    // Create simulation data object
    const simulationData = {
      name: simulation.name,
      components: simulation.components.map(c => c.name),
      thermodynamicModel: simulation.thermodynamicModel || 'Peng-Robinson',
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
      name: simulation.name,
      components: simulation.components.map(c => c.name),
      thermodynamicModel: simulation.thermodynamicModel || 'Peng-Robinson',
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('chemflow-simulation-data', JSON.stringify(simulationData));
    
    navigate('/create-simulation');
  };
  
  const exportSimulation = (simulation: SimulationCard) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(simulation));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${simulation.name}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    toast({
      title: "Simulation exported",
      description: "The simulation has been downloaded as JSON"
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
            <Link 
              to="/create-simulation"
              className="inline-flex items-center px-5 py-2.5 rounded-lg bg-flow-blue text-white font-medium shadow-sm hover:bg-flow-blue/90 transition-colors"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              New Simulation
            </Link>
          </div>
          
          {simulations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {simulations.map((sim) => (
                <GlassPanel 
                  key={sim.id} 
                  className="p-6 hover:shadow-md transition-shadow bg-white dark:bg-gray-800 dark:border-gray-700"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900 text-flow-blue dark:text-blue-200">
                      <FlaskConical className="h-5 w-5" />
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{new Date(sim.lastUpdated).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-medium mb-2 dark:text-white">{sim.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{sim.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2 dark:text-gray-200">Components</h4>
                    {sim.components.map((comp, idx) => (
                      <div key={idx} className="mb-2">
                        <div className="flex justify-between text-sm mb-1 dark:text-gray-300">
                          <span>{comp.name}</span>
                          <span>{comp.percentage}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full">
                          <div 
                            className="h-1.5 rounded-full bg-flow-blue"
                            style={{ width: `${comp.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {sim.thermodynamicModel && (
                    <div className="text-sm mb-4 dark:text-gray-300">
                      <span className="text-gray-500 dark:text-gray-400">Property Package:</span>
                      <span className="ml-2 font-medium">{sim.thermodynamicModel}</span>
                    </div>
                  )}
                  
                  {sim.equipment !== undefined && (
                    <div className="text-sm mb-4 dark:text-gray-300">
                      <span className="text-gray-500 dark:text-gray-400">Equipment:</span>
                      <span className="ml-2 font-medium">{sim.equipment}</span>
                      {sim.streams !== undefined && (
                        <>
                          <span className="mx-2">|</span>
                          <span className="text-gray-500 dark:text-gray-400">Streams:</span>
                          <span className="ml-2 font-medium">{sim.streams}</span>
                        </>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm dark:text-gray-300">
                      <span className="text-gray-500 dark:text-gray-400">Efficiency:</span>
                      <span className="ml-2 font-medium text-flow-blue">{sim.efficiency}%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex space-x-2">
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditSimulation(sim)}
                        className="dark:border-gray-600 dark:text-gray-200"
                      >
                        <Edit className="h-3.5 w-3.5 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => exportSimulation(sim)}
                        className="dark:border-gray-600 dark:text-gray-200"
                      >
                        <Download className="h-3.5 w-3.5 mr-1" />
                        Export
                      </Button>
                      <Button 
                        size="sm"
                        variant="outline"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 dark:border-gray-600"
                        onClick={() => handleDeleteSimulation(sim.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        Delete
                      </Button>
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => handleRunSimulation(sim)}
                    >
                      <Play className="h-3.5 w-3.5 mr-1" />
                      Run
                    </Button>
                  </div>
                </GlassPanel>
              ))}
            </div>
          ) : (
            <GlassPanel className="p-12 text-center bg-white dark:bg-gray-800 dark:border-gray-700">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-blue-50 dark:bg-blue-900 text-flow-blue dark:text-blue-200">
                  <FlaskConical className="h-8 w-8" />
                </div>
              </div>
              <h3 className="text-xl font-medium mb-2 dark:text-white">No simulations found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Create your first simulation to start modeling chemical processes with ChemFlow
              </p>
              <Link 
                to="/create-simulation"
                className="inline-flex items-center px-5 py-2.5 rounded-lg bg-flow-blue text-white font-medium shadow-sm hover:bg-flow-blue/90 transition-colors"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Your First Simulation
              </Link>
            </GlassPanel>
          )}
        </div>
      </main>
    </div>
  );
};

export default Simulations;
