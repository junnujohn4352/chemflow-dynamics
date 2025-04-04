
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Equipment } from "./types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  Thermometer, 
  Gauge, 
  Droplets, 
  LineChart, 
  Wand2 
} from "lucide-react";
import RealTimeAnalysis from "./RealTimeAnalysis";

interface ProcessDataPanelProps {
  simulationData: {
    componentA: number;
    componentB: number;
    systemEfficiency: number;
  };
  equipment: Equipment[];
  isRunning?: boolean;
  simulationTime?: number;
}

const ProcessDataPanel: React.FC<ProcessDataPanelProps> = ({ 
  simulationData, 
  equipment,
  isRunning = false,
  simulationTime = 0
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'analysis'>('summary');

  // Find equipment by type
  const getEquipmentByType = (type: string) => {
    return equipment.filter(eq => eq.type === type);
  };

  // Helper function to create a progress bar
  const createProgressBar = (value: number, maxValue: number, color: string) => {
    const percentage = (value / maxValue) * 100;
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full ${color}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    );
  };

  return (
    <div className="h-full">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 h-full">
        <Tabs 
          defaultValue="summary" 
          onValueChange={(value) => setActiveTab(value as 'summary' | 'analysis')}
          className="h-full flex flex-col"
        >
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="summary" className="text-xs flex items-center gap-1">
              <BarChart3 className="h-3.5 w-3.5" />
              Process Summary
            </TabsTrigger>
            <TabsTrigger value="analysis" className="text-xs flex items-center gap-1">
              <LineChart className="h-3.5 w-3.5" />
              Real-time Analysis
            </TabsTrigger>
          </TabsList>
          
          <TabsContent 
            value="summary" 
            className="flex-1 overflow-auto space-y-6 pr-1"
          >
            <div>
              <h3 className="text-sm font-medium mb-2 text-gray-600">System Status</h3>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-100">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="text-xs text-gray-600">System Efficiency</div>
                  <div className="text-xs font-medium">{simulationData.systemEfficiency.toFixed(1)}%</div>
                </div>
                {createProgressBar(simulationData.systemEfficiency, 100, "bg-blue-600")}
                
                <div className="mt-3 flex items-center justify-between mb-1.5">
                  <div className="text-xs text-gray-600">Component A</div>
                  <div className="text-xs font-medium">{simulationData.componentA.toFixed(1)}%</div>
                </div>
                {createProgressBar(simulationData.componentA, 100, "bg-green-500")}
                
                <div className="mt-3 flex items-center justify-between mb-1.5">
                  <div className="text-xs text-gray-600">Component B</div>
                  <div className="text-xs font-medium">{simulationData.componentB.toFixed(1)}%</div>
                </div>
                {createProgressBar(simulationData.componentB, 100, "bg-purple-500")}
                
                <div className="mt-4 pt-2 border-t border-blue-100 flex justify-between items-center">
                  <div className={cn(
                    "text-xs font-medium px-2 py-0.5 rounded-full",
                    isRunning 
                      ? "bg-green-100 text-green-700" 
                      : "bg-gray-100 text-gray-600"
                  )}>
                    {isRunning ? "System Running" : "System Idle"}
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Time: {simulationTime.toFixed(1)} min
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2 text-gray-600">Equipment Overview</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Thermometer className="h-4 w-4 text-red-500 mr-2" />
                    <span className="text-xs">Average Temperature</span>
                  </div>
                  <div className="text-xs font-medium">
                    {equipment
                      .filter(e => e.metrics?.temperature)
                      .reduce((sum, e) => sum + (e.metrics?.temperature as number), 0) / 
                      Math.max(1, equipment.filter(e => e.metrics?.temperature).length)
                    }°C
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Gauge className="h-4 w-4 text-blue-500 mr-2" />
                    <span className="text-xs">Average Pressure</span>
                  </div>
                  <div className="text-xs font-medium">
                    {equipment
                      .filter(e => e.metrics?.pressure)
                      .reduce((sum, e) => sum + (e.metrics?.pressure as number), 0) / 
                      Math.max(1, equipment.filter(e => e.metrics?.pressure).length)
                    } kPa
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Droplets className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-xs">Total Flow</span>
                  </div>
                  <div className="text-xs font-medium">
                    {equipment
                      .filter(e => e.metrics?.flow)
                      .reduce((sum, e) => sum + (e.metrics?.flow as number), 0)
                    } kg/h
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Wand2 className="h-4 w-4 text-purple-500 mr-2" />
                    <span className="text-xs">Equipment Count</span>
                  </div>
                  <div className="text-xs font-medium">
                    {equipment.length} units
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2 text-gray-600">Equipment Status</h3>
              <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-1">
                {equipment.map(eq => (
                  <div 
                    key={eq.id} 
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center">
                      <div className={cn(
                        "h-2 w-2 rounded-full mr-2",
                        eq.status === 'running' ? "bg-green-500" : "bg-gray-400"
                      )}></div>
                      <span className="text-xs truncate max-w-[100px]" title={eq.name}>
                        {eq.name}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">{eq.type}</div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent 
            value="analysis" 
            className="flex-1 overflow-auto"
          >
            <RealTimeAnalysis 
              equipment={equipment}
              isRunning={isRunning}
              simulationTime={simulationTime}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProcessDataPanel;
