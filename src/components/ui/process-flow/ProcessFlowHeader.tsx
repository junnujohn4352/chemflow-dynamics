
import React from "react";
import { Play, Square, Settings2, Download, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import SimulationManager from "../SimulationManager";
import { SimulationConfig } from "@/lib/supabase";

interface ProcessFlowHeaderProps {
  isRunning: boolean;
  toggleSimulation: () => void;
  config: SimulationConfig;
  onLoadSimulation: (loadedConfig: SimulationConfig) => void;
}

const ProcessFlowHeader: React.FC<ProcessFlowHeaderProps> = ({
  isRunning,
  toggleSimulation,
  config,
  onLoadSimulation,
}) => {
  return (
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
          onLoadSimulation={onLoadSimulation}
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
  );
};

export default ProcessFlowHeader;
