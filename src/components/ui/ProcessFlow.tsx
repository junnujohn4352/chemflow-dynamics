
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import GlassPanel from "./GlassPanel";
import { SimulationConfig } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import ProcessFlowHeader from "./process-flow/ProcessFlowHeader";
import ProcessFlowDiagram from "./process-flow/ProcessFlowDiagram";
import ProcessDataPanel from "./process-flow/ProcessDataPanel";
import { defaultConfig, runningConfig } from "./process-flow/SimulationConfig";

interface ProcessFlowProps {
  className?: string;
}

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
        <ProcessFlowHeader
          isRunning={isRunning}
          toggleSimulation={toggleSimulation}
          config={config}
          onLoadSimulation={handleLoadSimulation}
        />

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="col-span-2">
            <ProcessFlowDiagram config={config} />
          </div>
          
          <div>
            <ProcessDataPanel config={config} isRunning={isRunning} />
          </div>
        </div>
      </GlassPanel>
    </div>
  );
};

export default ProcessFlow;
