
import React from "react";
import { LineChart, Database, Columns } from "lucide-react";

interface ProcessDataPanelProps {
  simulationData: {
    componentA: number;
    componentB: number;
    systemEfficiency: number;
  };
  equipment: any[];
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

const ProcessDataPanel: React.FC<ProcessDataPanelProps> = ({
  simulationData,
  equipment,
}) => {
  return (
    <div className="flex-1 rounded-xl border border-blue-100 overflow-hidden shadow-lg bg-gradient-to-b from-white to-blue-50 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">Process Data</h3>
        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded-lg text-gray-500 hover:text-flow-blue hover:bg-blue-50 transition-all">
            <LineChart className="h-4 w-4" />
          </button>
          <button className="p-1.5 rounded-lg text-gray-500 hover:text-flow-blue hover:bg-blue-50 transition-all">
            <Database className="h-4 w-4" />
          </button>
          <button className="p-1.5 rounded-lg text-gray-500 hover:text-flow-blue hover:bg-blue-50 transition-all">
            <Columns className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="p-3 rounded-lg bg-white/80 shadow-sm hover:shadow-md transition-all border border-blue-50">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Component A</span>
            <span className="text-sm font-medium">{simulationData.componentA.toFixed(1)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-2 bg-gradient-to-r from-blue-400 to-flow-blue rounded-full transition-all duration-500 ease-out"
              style={{ width: `${simulationData.componentA}%` }}
            ></div>
          </div>
        </div>
        
        <div className="p-3 rounded-lg bg-white/80 shadow-sm hover:shadow-md transition-all border border-blue-50">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Component B</span>
            <span className="text-sm font-medium">{simulationData.componentB.toFixed(1)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-2 bg-gradient-to-r from-flow-cyan to-cyan-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${simulationData.componentB}%` }}
            ></div>
          </div>
        </div>
        
        <div className="p-3 rounded-lg bg-white/80 shadow-sm hover:shadow-md transition-all border border-blue-50">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">System Efficiency</span>
            <span className="text-sm font-medium">{simulationData.systemEfficiency.toFixed(1)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-2 bg-gradient-to-r from-blue-400 to-flow-teal rounded-full transition-all duration-500 ease-out"
              style={{ width: `${simulationData.systemEfficiency}%` }}
            ></div>
          </div>
        </div>
        
        <div className="mt-8">
          <h4 className="text-sm font-medium mb-3 text-gray-700">Key Parameters</h4>
          <div className="space-y-2">
            {equipment.map(eq => (
              <div key={eq.id} className="flex justify-between py-1.5 border-b border-blue-50 hover:bg-blue-50/50 px-2 rounded transition-colors">
                <span className="text-sm text-gray-500">{typeof eq.name === 'string' ? eq.name : String(eq.name)}</span>
                <span className="text-sm font-medium text-blue-700">
                  {eq.type === 'tank' 
                    ? `${renderMetricValue(eq.metrics.level)}% level` 
                    : eq.type === 'pump' 
                      ? `${renderMetricValue(eq.metrics.flow)} kg/h` 
                      : eq.type === 'heater' || eq.type === 'column' || eq.type === 'condenser'
                        ? `${renderMetricValue(eq.metrics.temperature)}°C`
                        : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessDataPanel;
