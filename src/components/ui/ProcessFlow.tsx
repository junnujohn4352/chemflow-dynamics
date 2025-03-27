
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import EquipmentCard from "./EquipmentCard";
import GlassPanel from "./GlassPanel";
import SimulationManager from "./SimulationManager";
import { 
  ArrowRight, 
  Columns,
  Database, 
  Download, 
  LineChart, 
  Play, 
  Settings2, 
  Share2, 
  Square
} from "lucide-react";
import { SimulationConfig, EquipmentState } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

interface ProcessFlowProps {
  className?: string;
}

const defaultConfig: SimulationConfig = {
  equipmentStates: {
    feedTank: {
      status: "stopped",
      metrics: { level: 75, temperature: 25 }
    },
    feedPump: {
      status: "stopped",
      metrics: { flow: 120 }
    },
    preheater: {
      status: "stopped",
      metrics: { temperature: 25 }
    },
    distillationColumn: {
      status: "stopped",
      metrics: { pressure: 150, temperature: 30 }
    },
    productTank: {
      status: "stopped",
      metrics: { level: 10, temperature: 25 }
    },
    condenser: {
      status: "stopped",
      metrics: { temperature: 25 }
    }
  },
  parameters: {
    refluxRatio: 3.5,
    feedRate: 120,
    reboilerDuty: 850,
    condenserDuty: -780
  }
};

const runningConfig: SimulationConfig = {
  equipmentStates: {
    feedTank: {
      status: "running",
      metrics: { level: 75, temperature: 25 }
    },
    feedPump: {
      status: "running",
      metrics: { flow: 120 }
    },
    preheater: {
      status: "running",
      metrics: { temperature: 85 }
    },
    distillationColumn: {
      status: "running",
      metrics: { pressure: 150, temperature: 95 }
    },
    productTank: {
      status: "running",
      metrics: { level: 45, temperature: 60 }
    },
    condenser: {
      status: "running",
      metrics: { temperature: 40 }
    }
  },
  parameters: {
    refluxRatio: 3.5,
    feedRate: 120,
    reboilerDuty: 850,
    condenserDuty: -780
  }
};

const ProcessFlow: React.FC<ProcessFlowProps> = ({ className }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [config, setConfig] = useState<SimulationConfig>(defaultConfig);
  
  const toggleSimulation = () => {
    setIsRunning(!isRunning);
  };

  // Update config when running state changes
  useEffect(() => {
    setConfig(isRunning ? runningConfig : defaultConfig);
  }, [isRunning]);

  // Load a saved simulation
  const handleLoadSimulation = (loadedConfig: SimulationConfig) => {
    setConfig(loadedConfig);
    
    // If the loaded config has running states, turn on the simulation
    const hasRunningEquipment = Object.values(loadedConfig.equipmentStates).some(
      equipment => equipment.status === "running"
    );
    
    setIsRunning(hasRunningEquipment);
    
    toast({
      title: "Simulation Loaded",
      description: "The saved simulation has been loaded successfully.",
    });
  };

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
            
            <SimulationManager 
              currentConfig={config}
              isRunning={isRunning}
              onLoadSimulation={handleLoadSimulation}
            />
            
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

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="col-span-2">
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-3 gap-4">
                <EquipmentCard 
                  type="tank" 
                  name="Feed Tank" 
                  status={config.equipmentStates.feedTank.status} 
                  metrics={config.equipmentStates.feedTank.metrics}
                />
                <div className="flex items-center justify-center">
                  <div className="h-0.5 w-full bg-gradient-to-r from-flow-blue to-flow-cyan"></div>
                  <ArrowRight className="text-flow-blue" />
                </div>
                <EquipmentCard 
                  type="pump" 
                  name="Feed Pump" 
                  status={config.equipmentStates.feedPump.status} 
                  metrics={config.equipmentStates.feedPump.metrics}
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
                  status={config.equipmentStates.preheater.status} 
                  metrics={config.equipmentStates.preheater.metrics}
                />
                <div className="flex items-center justify-center">
                  <div className="h-0.5 w-full bg-gradient-to-r from-flow-blue to-flow-cyan"></div>
                  <ArrowRight className="text-flow-blue" />
                </div>
                <EquipmentCard 
                  type="column" 
                  name="Distillation Column" 
                  status={config.equipmentStates.distillationColumn.status} 
                  metrics={config.equipmentStates.distillationColumn.metrics}
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
                  status={config.equipmentStates.productTank.status} 
                  metrics={config.equipmentStates.productTank.metrics}
                />
                <div className="flex items-center justify-center">
                  <div className="h-0.5 w-full bg-gradient-to-r from-flow-blue to-flow-cyan"></div>
                  <ArrowRight className="text-flow-blue" />
                </div>
                <EquipmentCard 
                  type="condenser" 
                  name="Condenser" 
                  status={config.equipmentStates.condenser.status} 
                  metrics={config.equipmentStates.condenser.metrics}
                />
              </div>
            </div>
          </div>
          
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
                      <span className="text-sm font-medium">{isRunning ? "78%" : "0%"}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                      <div 
                        className="h-2 bg-flow-blue rounded-full transition-all duration-1000 ease-out"
                        style={{ width: isRunning ? "78%" : "0%" }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-gray-50">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Component B</span>
                      <span className="text-sm font-medium">{isRunning ? "45%" : "0%"}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                      <div 
                        className="h-2 bg-flow-cyan rounded-full transition-all duration-1000 ease-out"
                        style={{ width: isRunning ? "45%" : "0%" }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-gray-50">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">System Efficiency</span>
                      <span className="text-sm font-medium">{isRunning ? "92%" : "0%"}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                      <div 
                        className="h-2 bg-flow-teal rounded-full transition-all duration-1000 ease-out"
                        style={{ width: isRunning ? "92%" : "0%" }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h4 className="text-sm font-medium mb-3">Key Parameters</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between py-1.5 border-b border-gray-100">
                        <span className="text-sm text-gray-500">Reflux Ratio</span>
                        <span className="text-sm font-medium">{config.parameters.refluxRatio}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-gray-100">
                        <span className="text-sm text-gray-500">Feed Rate</span>
                        <span className="text-sm font-medium">{config.parameters.feedRate} kg/h</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-gray-100">
                        <span className="text-sm text-gray-500">Reboiler Duty</span>
                        <span className="text-sm font-medium">{config.parameters.reboilerDuty} kW</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-gray-100">
                        <span className="text-sm text-gray-500">Condenser Duty</span>
                        <span className="text-sm font-medium">{config.parameters.condenserDuty} kW</span>
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
