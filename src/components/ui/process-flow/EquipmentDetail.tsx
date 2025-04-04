
import React from "react";
import { X, Settings2, Link as LinkIcon, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Equipment } from "./types";

interface EquipmentDetailProps {
  equipment: Equipment;
  isRunning: boolean;
  onClose: () => void;
  allEquipment?: Equipment[];
  onConnectEquipment?: (sourceId: string, targetId: string) => void;
}

const EquipmentDetail: React.FC<EquipmentDetailProps> = ({
  equipment,
  isRunning,
  onClose,
  allEquipment = [],
  onConnectEquipment
}) => {
  // Function to safely render metric values
  const renderMetricValue = (metric: any): string => {
    if (metric === null || metric === undefined) {
      return '';
    }
    
    if (typeof metric === 'object') {
      try {
        return JSON.stringify(metric);
      } catch (e) {
        return '[Object]';
      }
    }
    
    return String(metric);
  };

  // Get other equipment (for connection options)
  const otherEquipment = allEquipment?.filter(eq => eq.id !== equipment.id) || [];

  return (
    <div className="absolute z-10 p-4 rounded-lg shadow-xl w-64 min-h-[200px] bg-white glass-card border-2 border-blue-200 animate-fade-in">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-md font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {equipment.name}
        </h3>
        <button 
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      <div className="text-xs text-gray-500 mb-3">
        {equipment.description || `${equipment.type} equipment`}
      </div>
      
      {equipment.metrics && Object.keys(equipment.metrics).length > 0 && (
        <>
          <div className="text-sm font-medium text-gray-700 mb-2">Parameters:</div>
          <div className="mb-4 space-y-2">
            {Object.entries(equipment.metrics).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center py-1 px-2 rounded-md bg-blue-50">
                <span className="text-xs text-gray-700 capitalize">{key}:</span>
                <span className={cn(
                  "text-xs font-medium",
                  isRunning ? "text-green-600" : "text-blue-600"
                )}>
                  {key === 'temperature' 
                    ? `${renderMetricValue(value)}°C` 
                    : key === 'pressure' 
                      ? `${renderMetricValue(value)} kPa`
                      : key === 'flow' || key === 'flowRate'
                        ? `${renderMetricValue(value)} kg/h`
                        : key === 'level'
                          ? `${renderMetricValue(value)}%`
                          : renderMetricValue(value)
                  }
                </span>
              </div>
            ))}
          </div>
        </>
      )}
      
      {/* Connection Options */}
      {otherEquipment.length > 0 && (
        <div className="mt-3">
          <div className="text-sm font-medium text-gray-700 mb-2 colorful-border blue">Connect to:</div>
          <div className="max-h-[120px] overflow-y-auto space-y-1 bg-gradient-to-r from-indigo-50 to-blue-50 p-2 rounded-md">
            {otherEquipment.map(eq => (
              <div 
                key={eq.id} 
                onClick={() => onConnectEquipment?.(equipment.id, eq.id)}
                className="flex items-center justify-between text-xs p-1.5 rounded transition-colors hover:bg-white cursor-pointer"
              >
                <span className="font-medium">{eq.name}</span>
                <div className="flex items-center">
                  <span className="text-gray-500 text-xs mr-1">{eq.type}</span>
                  <ChevronRight className="h-3 w-3 text-blue-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-4 pt-3 border-t border-blue-100 flex justify-end">
        <button className="text-xs font-medium text-indigo-600 flex items-center">
          <Settings2 className="h-3 w-3 mr-1" />
          View Details
        </button>
      </div>
    </div>
  );
};

export default EquipmentDetail;
