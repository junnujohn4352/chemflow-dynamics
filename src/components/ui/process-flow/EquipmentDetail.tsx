
import React from "react";
import { Equipment } from "./types";
import { ArrowRight, Link } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EquipmentDetailProps {
  equipment: Equipment;
  isRunning: boolean;
  onClose: () => void;
  allEquipment: Equipment[];
  onConnectEquipment: (sourceId: string, targetId: string) => void;
}

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

const EquipmentDetail: React.FC<EquipmentDetailProps> = ({
  equipment,
  isRunning,
  onClose,
  allEquipment,
  onConnectEquipment,
}) => {
  const { name, type, connections } = equipment;
  const metrics = equipment.metrics || {};

  // Filter out the current equipment and already connected equipment
  const availableEquipment = allEquipment.filter(eq => 
    eq.id !== equipment.id && 
    !connections?.includes(eq.id)
  );
  
  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white p-3 rounded-lg shadow-lg z-10 border border-gray-200 text-left animate-fade-in">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium text-sm text-blue-700">{name} Details</h4>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <span className="sr-only">Close</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-500">Type:</span>
          <span className="font-medium">{type}</span>
        </div>
        
        {Object.entries(metrics).map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <span className="text-gray-500">{key}:</span>
            <span className="font-medium">
              {renderMetricValue(value)}
              {key === 'temperature' ? '°C' : 
               key === 'pressure' ? ' kPa' : 
               key === 'level' ? '%' : 
               key === 'flow' ? ' kg/h' : ''}
            </span>
          </div>
        ))}
        
        <div className="flex justify-between">
          <span className="text-gray-500">Status:</span>
          <span className={`font-medium ${
            isRunning ? 'text-green-600' : 'text-gray-600'
          }`}>
            {isRunning ? 'Running' : 'Stopped'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-500">Connections:</span>
          <span className="font-medium">
            {connections?.length || 0}
          </span>
        </div>
      </div>
      
      {/* Equipment Connection Section */}
      {availableEquipment.length > 0 && (
        <div className="mt-3 pt-2 border-t border-gray-100">
          <h5 className="text-xs font-medium text-gray-700 mb-2 flex items-center">
            <Link className="h-3 w-3 mr-1" />
            Connect to Equipment
          </h5>
          <div className="grid grid-cols-2 gap-1 max-h-32 overflow-y-auto">
            {availableEquipment.map(eq => (
              <Button 
                key={eq.id}
                variant="outline"
                size="sm"
                className="text-xs py-1 h-auto flex items-center justify-between"
                onClick={() => onConnectEquipment(equipment.id, eq.id)}
              >
                {eq.name}
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentDetail;
