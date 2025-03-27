
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProcessFlow from "@/components/ui/ProcessFlow";
import GlassPanel from "@/components/ui/GlassPanel";
import { useSimulations } from "@/hooks/use-simulations";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2, Clock, Calendar } from "lucide-react";

const Simulations = () => {
  const { simulations, isLoading, deleteSimulation } = useSimulations();

  const handleDeleteSimulation = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (confirm('Are you sure you want to delete this simulation?')) {
      deleteSimulation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <section className="pt-24 pb-20 px-6 bg-gray-50 flex-grow">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <Link 
                  to="/" 
                  className="inline-flex items-center text-flow-blue hover:text-flow-blue/80 mb-2"
                >
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Back to Home
                </Link>
                <h1 className="text-3xl font-display font-bold">My Simulations</h1>
                <p className="text-gray-600 mt-1">
                  Manage and run your saved chemical process simulations
                </p>
              </div>
              <Link to="/">
                <Button>
                  Create New Simulation
                </Button>
              </Link>
            </div>
            
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading your simulations...</p>
              </div>
            ) : !simulations || simulations.length === 0 ? (
              <GlassPanel className="p-12 text-center">
                <h3 className="text-xl font-medium mb-3">No Simulations Found</h3>
                <p className="text-gray-500 mb-6">
                  You haven't saved any simulations yet. Start by creating a new simulation.
                </p>
                <Link to="/">
                  <Button>
                    Create Your First Simulation
                  </Button>
                </Link>
              </GlassPanel>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {simulations.map((simulation) => (
                  <Link 
                    to={`/?id=${simulation.id}`} 
                    key={simulation.id}
                    className="block transition-transform hover:-translate-y-1"
                  >
                    <GlassPanel className="p-6 h-full">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-medium">{simulation.name}</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleDeleteSimulation(simulation.id as string, e)}
                        >
                          <Trash2 size={16} className="text-gray-500 hover:text-red-500" />
                        </Button>
                      </div>
                      
                      {simulation.description && (
                        <p className="text-gray-600 mt-2 line-clamp-2">{simulation.description}</p>
                      )}
                      
                      <div className="mt-4 flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Last updated: {new Date(simulation.updated_at || '').toLocaleDateString()}</span>
                      </div>
                      
                      <div className="mt-6 pt-4 border-t border-gray-100">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">Components</p>
                            <p className="text-sm font-medium">A: {simulation.results?.componentA || 0}%</p>
                            <p className="text-sm font-medium">B: {simulation.results?.componentB || 0}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Efficiency</p>
                            <p className="text-sm font-medium">{simulation.results?.efficiency || 0}%</p>
                          </div>
                        </div>
                      </div>
                    </GlassPanel>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Simulations;
