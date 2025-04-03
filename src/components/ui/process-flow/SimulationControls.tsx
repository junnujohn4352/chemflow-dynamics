
import React from "react";
import { Button } from "@/components/ui/button";
import { Play, Square, Settings2, Download, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SimulationControlsProps {
  isRunning: boolean;
  onToggleSimulation: () => void;
}

const SimulationControls: React.FC<SimulationControlsProps> = ({
  isRunning,
  onToggleSimulation,
}) => {
  return (
    <div className="flex items-center gap-3">
      <button 
        onClick={onToggleSimulation}
        className={cn(
          "inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium transition-all shadow-md hover:shadow-lg transform hover:scale-105",
          isRunning 
            ? "bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-200" 
            : "bg-gradient-to-r from-green-400 to-green-500 text-white hover:from-green-500 hover:to-green-600"
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
      <button className="p-2 rounded-lg text-gray-500 hover:text-flow-blue hover:bg-blue-50 transition-all">
        <Settings2 className="h-5 w-5" />
      </button>
      <button className="p-2 rounded-lg text-gray-500 hover:text-flow-blue hover:bg-blue-50 transition-all">
        <Download className="h-5 w-5" />
      </button>
      <button className="p-2 rounded-lg text-gray-500 hover:text-flow-blue hover:bg-blue-50 transition-all">
        <Share2 className="h-5 w-5" />
      </button>
    </div>
  );
};

export default SimulationControls;
