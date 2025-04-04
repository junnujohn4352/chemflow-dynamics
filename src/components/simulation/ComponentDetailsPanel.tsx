import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Edit, Save, X, Link, RefreshCw, Settings } from "lucide-react";
import { SimulationData } from "@/components/ui/process-flow/types";

interface ComponentDetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  equipment: any;
  isRunning: boolean;
}

const ComponentDetailsPanel: React.FC<ComponentDetailsPanelProps> = ({ isOpen, onClose, equipment, isRunning }) => {
  if (!isOpen || !equipment) {
    return null;
  }

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg z-50 w-96 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Equipment Details</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="h-[300px] mb-4">
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400">Name</h3>
            <p className="text-gray-800 dark:text-gray-200">{equipment.name}</p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400">Type</h3>
            <p className="text-gray-800 dark:text-gray-200">{equipment.type}</p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400">Status</h3>
            <p className="text-gray-800 dark:text-gray-200">{isRunning ? "Running" : "Stopped"}</p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400">Metrics</h3>
            <ul className="list-disc pl-5">
              {Object.entries(equipment.metrics).map(([key, value]) => (
                <li key={key} className="text-gray-800 dark:text-gray-200">
                  {key}: {value}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </ScrollArea>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>
    </div>
  );
};

export default ComponentDetailsPanel;
