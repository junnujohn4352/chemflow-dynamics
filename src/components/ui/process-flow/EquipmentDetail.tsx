
import React from "react";
import { Equipment } from "./types";

interface EquipmentDetailProps {
  equipment: Equipment;
  isRunning: boolean;
  onClose: () => void;
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
}) => {
  const { name, type, metrics, connections } = equipment;
  
  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white p-3 rounded-lg shadow-lg z-10 border border-gray-200 text-left animate-fade-in">
      <h4 className="font-medium text-sm text-blue-700 mb-2">{name} Details</h4>
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
    </div>
  );
};

export default EquipmentDetail;
