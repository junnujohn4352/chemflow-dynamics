
import React, { useState } from "react";
import { Equipment, EquipmentParameter } from "./types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SliderIcon, Settings2 } from "lucide-react";

interface ParametersPanelProps {
  equipment: Equipment;
  onParameterChange?: (parameterId: string, value: any) => void;
  isRunning?: boolean;
}

const ParametersPanel: React.FC<ParametersPanelProps> = ({
  equipment,
  onParameterChange,
  isRunning = false
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced'>('basic');

  // If equipment doesn't have parameters yet, create default ones based on metrics
  const parameters = equipment.parameters || createDefaultParameters(equipment);

  // Function to handle parameter value changes
  const handleValueChange = (parameterId: string, value: any) => {
    if (onParameterChange && !isRunning) {
      onParameterChange(parameterId, value);
    }
  };

  // Get parameters for the current tab
  const tabParameters = parameters.filter(param => param.category === activeTab);

  return (
    <div className="mt-4 border-t border-blue-100 pt-3">
      <Tabs 
        defaultValue="basic" 
        onValueChange={(value) => setActiveTab(value as 'basic' | 'advanced')}
        className="w-full"
      >
        <TabsList className="w-full mb-3 grid grid-cols-2">
          <TabsTrigger value="basic" className="text-xs flex items-center">
            <SliderIcon className="h-3 w-3 mr-1" />
            Basic Parameters
          </TabsTrigger>
          <TabsTrigger value="advanced" className="text-xs flex items-center">
            <Settings2 className="h-3 w-3 mr-1" />
            Advanced
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-2">
          {renderParameters(tabParameters, handleValueChange, isRunning)}
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-2">
          {renderParameters(tabParameters, handleValueChange, isRunning)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Function to render parameters based on their type
const renderParameters = (
  parameters: EquipmentParameter[], 
  onChange: (id: string, value: any) => void,
  isRunning: boolean
) => {
  if (parameters.length === 0) {
    return <div className="text-xs text-gray-500 italic">No parameters available</div>;
  }

  return parameters.map(param => (
    <div key={param.id} className="flex justify-between items-center py-1 px-2 rounded-md bg-blue-50">
      <span className="text-xs text-gray-700">{param.name}:</span>
      {renderParameterInput(param, onChange, isRunning)}
    </div>
  ));
};

// Render the appropriate input for each parameter type
const renderParameterInput = (
  param: EquipmentParameter, 
  onChange: (id: string, value: any) => void,
  isRunning: boolean
) => {
  const disabled = isRunning;
  const valueWithUnit = param.unit ? `${param.value} ${param.unit}` : param.value;

  switch (param.type) {
    case 'number':
      return (
        <div className="flex items-center">
          <input
            type="number"
            value={param.value}
            min={param.min}
            max={param.max}
            onChange={(e) => onChange(param.id, parseFloat(e.target.value))}
            disabled={disabled}
            className="w-16 text-xs py-1 px-2 rounded border border-gray-300 disabled:bg-gray-100"
          />
          {param.unit && <span className="ml-1 text-xs text-gray-500">{param.unit}</span>}
        </div>
      );
    case 'boolean':
      return (
        <input
          type="checkbox"
          checked={param.value}
          onChange={(e) => onChange(param.id, e.target.checked)}
          disabled={disabled}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600"
        />
      );
    case 'select':
      return (
        <select
          value={param.value}
          onChange={(e) => onChange(param.id, e.target.value)}
          disabled={disabled}
          className="text-xs py-1 px-2 rounded border border-gray-300 disabled:bg-gray-100"
        >
          {param.options?.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      );
    default:
      return (
        <span className={`text-xs font-medium ${isRunning ? "text-green-600" : "text-blue-600"}`}>
          {valueWithUnit}
        </span>
      );
  }
};

// Create default parameters based on equipment metrics
const createDefaultParameters = (equipment: Equipment): EquipmentParameter[] => {
  const parameters: EquipmentParameter[] = [];
  
  if (equipment.metrics) {
    // Convert metrics to basic parameters
    Object.entries(equipment.metrics).forEach(([key, value], index) => {
      let unit = '';
      let min = 0;
      let max = 100;
      
      // Set appropriate units and ranges based on metric type
      if (key === 'temperature') {
        unit = '°C';
        min = -50;
        max = 1000;
      } else if (key === 'pressure') {
        unit = 'kPa';
        min = 0;
        max = 10000;
      } else if (key === 'flow' || key === 'flowRate') {
        unit = 'kg/h';
        min = 0;
        max = 5000;
      } else if (key === 'level' || key === 'efficiency' || key === 'conversion' || key === 'purity') {
        unit = '%';
        min = 0;
        max = 100;
      } else if (key === 'duty') {
        unit = 'kW';
        min = 0;
        max = 10000;
      }
      
      parameters.push({
        id: `param-${key}`,
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value: value,
        unit: unit,
        min: min,
        max: max,
        type: 'number',
        category: index < 4 ? 'basic' : 'advanced',
        description: `${key.charAt(0).toUpperCase() + key.slice(1)} of the ${equipment.type}`
      });
    });
  }
  
  // Add equipment-specific parameters
  switch (equipment.type) {
    case 'reactor':
      parameters.push(
        {
          id: 'param-reactionType',
          name: 'Reaction Type',
          value: 'Exothermic',
          type: 'select',
          options: ['Exothermic', 'Endothermic', 'Equilibrium'],
          category: 'advanced',
          description: 'Type of reaction occurring in the reactor'
        },
        {
          id: 'param-catalyst',
          name: 'Catalyst Present',
          value: true,
          type: 'boolean',
          category: 'advanced',
          description: 'Whether a catalyst is present in the reactor'
        }
      );
      break;
    case 'column':
      parameters.push(
        {
          id: 'param-stages',
          name: 'Stages',
          value: 20,
          type: 'number',
          min: 1,
          max: 100,
          category: 'basic',
          description: 'Number of theoretical stages in the column'
        },
        {
          id: 'param-refluxRatio',
          name: 'Reflux Ratio',
          value: 1.5,
          type: 'number',
          min: 0.1,
          max: 10,
          category: 'basic',
          description: 'Reflux ratio in the column'
        }
      );
      break;
    case 'pump':
      parameters.push(
        {
          id: 'param-efficiency',
          name: 'Efficiency',
          value: 75,
          unit: '%',
          type: 'number',
          min: 10,
          max: 100,
          category: 'basic',
          description: 'Efficiency of the pump'
        },
        {
          id: 'param-power',
          name: 'Power',
          value: 5.5,
          unit: 'kW',
          type: 'number',
          min: 0.1,
          max: 1000,
          category: 'basic',
          description: 'Power consumption of the pump'
        }
      );
      break;
  }
  
  return parameters;
};

export default ParametersPanel;
