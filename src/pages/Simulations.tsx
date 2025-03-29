
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GlassPanel from "@/components/ui/GlassPanel";
import { PlusCircle, Clock, ArrowRight, FlaskConical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SimulationCard {
  id: string;
  name: string;
  description: string;
  lastUpdated: string;
  efficiency: number;
  components: { name: string; percentage: number }[];
}

const Simulations = () => {
  const { toast } = useToast();
  // Mock data - in a real app, this would come from a database
  const [simulations, setSimulations] = useState<SimulationCard[]>([
    {
      id: "sim-1",
      name: "Ethanol Distillation",
      description: "Separating ethanol from water using fractional distillation",
      lastUpdated: "2025-03-28",
      efficiency: 92,
      components: [
        { name: "Ethanol", percentage: 78 },
        { name: "Water", percentage: 22 },
      ],
    },
    {
      id: "sim-2",
      name: "Methane Reforming",
      description: "Hydrogen production from methane using steam reforming",
      lastUpdated: "2025-03-27",
      efficiency: 85,
      components: [
        { name: "Hydrogen", percentage: 75 },
        { name: "Carbon Dioxide", percentage: 25 },
      ],
    },
    {
      id: "sim-3",
      name: "Ammonia Synthesis",
      description: "Haber process for ammonia production",
      lastUpdated: "2025-03-26",
      efficiency: 88,
      components: [
        { name: "Nitrogen", percentage: 45 },
        { name: "Hydrogen", percentage: 55 },
      ],
    },
  ]);

  const handleDeleteSimulation = (id: string) => {
    setSimulations(simulations.filter(sim => sim.id !== id));
    toast({
      title: "Simulation deleted",
      description: "The simulation has been removed successfully."
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-16 px-6 bg-gray-50">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold mb-2">My Simulations</h1>
              <p className="text-gray-600">Manage and run your chemical process simulations</p>
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
                  className="p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 rounded-lg bg-blue-50 text-flow-blue">
                      <FlaskConical className="h-5 w-5" />
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{sim.lastUpdated}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-medium mb-2">{sim.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{sim.description}</p>
                  
                  <div className="mb-6">
                    <h4 className="text-sm font-medium mb-2">Components</h4>
                    {sim.components.map((comp, idx) => (
                      <div key={idx} className="mb-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span>{comp.name}</span>
                          <span>{comp.percentage}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 rounded-full">
                          <div 
                            className="h-1.5 rounded-full bg-flow-blue"
                            style={{ width: `${comp.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-gray-500">Efficiency:</span>
                      <span className="ml-2 font-medium text-flow-blue">{sim.efficiency}%</span>
                    </div>
                    <Link 
                      to={`/simulation/${sim.id}`}
                      className="inline-flex items-center text-flow-blue hover:text-flow-blue/80"
                    >
                      View Details
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </GlassPanel>
              ))}
            </div>
          ) : (
            <GlassPanel className="p-12 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-blue-50 text-flow-blue">
                  <FlaskConical className="h-8 w-8" />
                </div>
              </div>
              <h3 className="text-xl font-medium mb-2">No simulations found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
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
      
      <Footer />
    </div>
  );
};

export default Simulations;
