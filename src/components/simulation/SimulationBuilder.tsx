
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import EquipmentCard from '@/components/ui/equipment/EquipmentCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Thermometer, Beaker, Droplets, Activity } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SimulationBuilderProps {
  selectedComponents: string[];
  thermodynamicModel: string;
  onRunSimulation?: () => void;
}

export const SimulationBuilder: React.FC<SimulationBuilderProps> = ({
  selectedComponents,
  thermodynamicModel,
  onRunSimulation
}) => {
  const [equipmentMetrics, setEquipmentMetrics] = useState([
    { key: "Temperature", value: "85°C" },
    { key: "Pressure", value: "150 kPa" },
    { key: "Flow", value: "1200 kg/h" }
  ]);
  
  const [processType, setProcessType] = useState("distillation");
  const [operatingTemp, setOperatingTemp] = useState("85");
  const [operatingPressure, setOperatingPressure] = useState("150");
  const [feedFlowRate, setFeedFlowRate] = useState("1200");
  
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg col-span-1">
          <h3 className="text-lg font-medium mb-3">Equipment Library</h3>
          <div className="grid grid-cols-2 gap-2">
            <EquipmentCard 
              type="reactor" 
              title="CSTR Reactor"
              onEdit={() => {}}
              metrics={equipmentMetrics}
              status="ready"
            />
            <EquipmentCard 
              type="column" 
              title="Distillation"
              onEdit={() => {}}
              metrics={equipmentMetrics}
              status="ready"
            />
            <EquipmentCard 
              type="heat-exchanger" 
              title="Heat Exchanger"
              onEdit={() => {}}
              metrics={equipmentMetrics}
              status="ready"
            />
            <EquipmentCard 
              type="pump" 
              title="Centrifugal Pump"
              onEdit={() => {}}
              metrics={equipmentMetrics}
              status="ready"
            />
            <EquipmentCard 
              type="flash" 
              title="Flash Drum"
              onEdit={() => {}}
              metrics={equipmentMetrics}
              status="ready"
            />
            <EquipmentCard 
              type="compressor" 
              title="Compressor"
              onEdit={() => {}}
              metrics={equipmentMetrics}
              status="ready"
            />
          </div>
        </div>
        
        <div className="bg-white border border-dashed border-gray-300 p-4 rounded-lg col-span-2">
          <h3 className="text-lg font-medium mb-3">Process Canvas</h3>
          <div className="min-h-[300px] flex items-center justify-center">
            <p className="text-gray-400">Drag equipment here to build your process</p>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-3">Process Parameters</h3>
        
        <Tabs defaultValue="basic">
          <TabsList className="mb-4">
            <TabsTrigger value="basic">
              <Thermometer className="h-4 w-4 mr-1" />
              Operating Conditions
            </TabsTrigger>
            <TabsTrigger value="process">
              <Beaker className="h-4 w-4 mr-1" />
              Process Type
            </TabsTrigger>
            <TabsTrigger value="components">
              <Droplets className="h-4 w-4 mr-1" />
              Components
            </TabsTrigger>
            <TabsTrigger value="advanced">
              <Activity className="h-4 w-4 mr-1" />
              Advanced
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="operating-temp">Operating Temperature (°C)</Label>
                <Input 
                  id="operating-temp"
                  value={operatingTemp}
                  onChange={(e) => setOperatingTemp(e.target.value)}
                  type="number"
                  placeholder="85"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="operating-pressure">Operating Pressure (kPa)</Label>
                <Input 
                  id="operating-pressure"
                  value={operatingPressure}
                  onChange={(e) => setOperatingPressure(e.target.value)}
                  type="number"
                  placeholder="150"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="feed-flow">Feed Flow Rate (kg/h)</Label>
                <Input 
                  id="feed-flow"
                  value={feedFlowRate}
                  onChange={(e) => setFeedFlowRate(e.target.value)}
                  type="number"
                  placeholder="1200"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="process">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="process-type">Process Type</Label>
                <Select value={processType} onValueChange={setProcessType}>
                  <SelectTrigger id="process-type">
                    <SelectValue placeholder="Select process type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="distillation">Distillation</SelectItem>
                    <SelectItem value="reaction">Chemical Reaction</SelectItem>
                    <SelectItem value="extraction">Liquid-Liquid Extraction</SelectItem>
                    <SelectItem value="absorption">Gas Absorption</SelectItem>
                    <SelectItem value="heat-exchange">Heat Exchange</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {processType === "distillation" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reflux-ratio">Reflux Ratio</Label>
                    <Input id="reflux-ratio" type="number" defaultValue="1.5" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="number-of-stages">Number of Theoretical Stages</Label>
                    <Input id="number-of-stages" type="number" defaultValue="10" />
                  </div>
                </div>
              )}
              
              {processType === "reaction" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="conversion">Conversion (%)</Label>
                    <Input id="conversion" type="number" defaultValue="95" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reaction-order">Reaction Order</Label>
                    <Select defaultValue="first">
                      <SelectTrigger id="reaction-order">
                        <SelectValue placeholder="Select reaction order" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="zero">Zero Order</SelectItem>
                        <SelectItem value="first">First Order</SelectItem>
                        <SelectItem value="second">Second Order</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="components">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Selected Components</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {selectedComponents.map((component) => (
                    <div 
                      key={component} 
                      className="p-2 bg-blue-50 border border-blue-100 rounded-md text-sm"
                    >
                      {component}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Using Thermodynamic Model: </Label>
                <div className="p-2 bg-green-50 border border-green-100 rounded-md inline-block">
                  {thermodynamicModel}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="calculation-method">Calculation Method</Label>
                <Select defaultValue="inside-out">
                  <SelectTrigger id="calculation-method">
                    <SelectValue placeholder="Select calculation method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inside-out">Inside-Out</SelectItem>
                    <SelectItem value="newton">Newton's Method</SelectItem>
                    <SelectItem value="quasi-newton">Quasi-Newton</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tolerance">Convergence Tolerance</Label>
                <Input id="tolerance" type="number" defaultValue="0.0001" step="0.0001" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="max-iterations">Maximum Iterations</Label>
                <Input id="max-iterations" type="number" defaultValue="100" />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SimulationBuilder;
