
import React from "react";
import { LineChart, Database, Columns } from "lucide-react";
import { SimulationConfig } from "@/lib/supabase";

interface ProcessDataPanelProps {
  config: SimulationConfig;
  isRunning: boolean;
}

const ProcessDataPanel: React.FC<ProcessDataPanelProps> = ({ config, isRunning }) => {
  return (
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
  );
};

export default ProcessDataPanel;
