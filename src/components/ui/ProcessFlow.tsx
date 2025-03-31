
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import EquipmentCard from "./EquipmentCard";
import GlassPanel from "./GlassPanel";
import { 
  ArrowRight, 
  Columns,
  Database, 
  Download, 
  LineChart, 
  Play, 
  Square,
  Settings2, 
  Share2
} from "lucide-react";

interface ProcessFlowProps {
  className?: string;
  onStartSimulation?: () => void;
}

const ProcessFlow: React.FC<ProcessFlowProps> = ({ className, onStartSimulation }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [simulationData, setSimulationData] = useState({
    componentA: 0,
    componentB: 0,
    systemEfficiency: 0
  });
  
  const toggleSimulation = () => {
    const newState = !isRunning;
    setIsRunning(newState);
    
    if (newState && onStartSimulation) {
      onStartSimulation();
    }
    
    // Start updating simulation data if running
    if (newState) {
      startDataUpdates();
    }
  };

  const startDataUpdates = () => {
    // Simulate data flow when simulation is running
    let progress = 0;
    const updateInterval = setInterval(() => {
      progress += 5;
      if (progress <= 100) {
        setSimulationData({
          componentA: Math.min(78, (78 * progress) / 100),
          componentB: Math.min(45, (45 * progress) / 100),
          systemEfficiency: Math.min(92, (92 * progress) / 100)
        });
      } else {
        clearInterval(updateInterval);
      }
    }, 200);
    
    // Clean up interval on component unmount
    return () => clearInterval(updateInterval);
  };

  useEffect(() => {
    // Clean up on unmount
    return () => {
      // Reset state when component unmounts
      setIsRunning(false);
    };
  }, []);

  return (
    <div className={cn("w-full", className)}>
      <GlassPanel className="p-6 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-medium">Distillation Process</h2>
            <p className="text-gray-500 mt-1">Simulation Overview</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleSimulation}
              className={cn(
                "inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium transition-colors",
                isRunning 
                  ? "bg-amber-50 text-amber-600 hover:bg-amber-100" 
                  : "bg-green-50 text-green-600 hover:bg-green-100"
              )}
            >
              {isRunning ? (
                <>
                  <Square className="mr-2 h-4 w-4" />
                  Stop Simulation
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Run Simulation
                </>
              )}
            </button>
            <button className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
              <Settings2 className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
              <Download className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Process Flow Diagram */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="col-span-2">
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-3 gap-4">
                <EquipmentCard 
                  type="tank" 
                  name="Feed Tank" 
                  status={isRunning ? "running" : "stopped"} 
                  metrics={{ level: 75, temperature: 25 }}
                />
                <div className="flex items-center justify-center">
                  <div className="h-0.5 w-full bg-gradient-to-r from-flow-blue to-flow-cyan"></div>
                  <ArrowRight className="text-flow-blue" />
                </div>
                <EquipmentCard 
                  type="pump" 
                  name="Feed Pump" 
                  status={isRunning ? "running" : "stopped"} 
                  metrics={{ flow: 120 }}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center justify-center">
                  <div className="h-10 w-0.5 bg-gradient-to-b from-flow-blue to-flow-cyan"></div>
                </div>
                <div></div>
                <div className="flex items-center justify-center">
                  <div className="h-10 w-0.5 bg-gradient-to-b from-flow-blue to-flow-cyan"></div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <EquipmentCard 
                  type="heater" 
                  name="Preheater" 
                  status={isRunning ? "running" : "stopped"} 
                  metrics={{ temperature: isRunning ? 85 : 25 }}
                />
                <div className="flex items-center justify-center">
                  <div className="h-0.5 w-full bg-gradient-to-r from-flow-blue to-flow-cyan"></div>
                  <ArrowRight className="text-flow-blue" />
                </div>
                <EquipmentCard 
                  type="column" 
                  name="Distillation Column" 
                  status={isRunning ? "running" : "stopped"} 
                  metrics={{ pressure: 150, temperature: isRunning ? 95 : 30 }}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center justify-center">
                  <div className="h-10 w-0.5 bg-gradient-to-b from-flow-blue to-flow-cyan"></div>
                </div>
                <div></div>
                <div className="flex items-center justify-center">
                  <div className="h-10 w-0.5 bg-gradient-to-b from-flow-blue to-flow-cyan"></div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <EquipmentCard 
                  type="tank" 
                  name="Product Tank" 
                  status={isRunning ? "running" : "stopped"} 
                  metrics={{ level: isRunning ? 45 : 10, temperature: isRunning ? 60 : 25 }}
                />
                <div className="flex items-center justify-center">
                  <div className="h-0.5 w-full bg-gradient-to-r from-flow-blue to-flow-cyan"></div>
                  <ArrowRight className="text-flow-blue" />
                </div>
                <EquipmentCard 
                  type="condenser" 
                  name="Condenser" 
                  status={isRunning ? "running" : "stopped"} 
                  metrics={{ temperature: isRunning ? 40 : 25 }}
                />
              </div>
            </div>
          </div>
          
          {/* Process Data Panel */}
          <div>
            <div className="h-full flex flex-col gap-6">
              <div className="flex-1 rounded-xl border border-gray-100 overflow-hidden shadow-sm bg-white p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Process Data</h3>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                      <LineChart className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                      <Database className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                      <Columns className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-gray-50">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Component A</span>
                      <span className="text-sm font-medium">{simulationData.componentA.toFixed(1)}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                      <div 
                        className="h-2 bg-flow-blue rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${simulationData.componentA}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-gray-50">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Component B</span>
                      <span className="text-sm font-medium">{simulationData.componentB.toFixed(1)}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                      <div 
                        className="h-2 bg-flow-cyan rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${simulationData.componentB}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-gray-50">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">System Efficiency</span>
                      <span className="text-sm font-medium">{simulationData.systemEfficiency.toFixed(1)}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                      <div 
                        className="h-2 bg-flow-teal rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${simulationData.systemEfficiency}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h4 className="text-sm font-medium mb-3">Key Parameters</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between py-1.5 border-b border-gray-100">
                        <span className="text-sm text-gray-500">Reflux Ratio</span>
                        <span className="text-sm font-medium">3.5</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-gray-100">
                        <span className="text-sm text-gray-500">Feed Rate</span>
                        <span className="text-sm font-medium">120 kg/h</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-gray-100">
                        <span className="text-sm text-gray-500">Reboiler Duty</span>
                        <span className="text-sm font-medium">850 kW</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-gray-100">
                        <span className="text-sm text-gray-500">Condenser Duty</span>
                        <span className="text-sm font-medium">-780 kW</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
};

export default ProcessFlow;
