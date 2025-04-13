
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Play, Save, PlusCircle, Settings } from "lucide-react";

interface ProcessSimulationInterfaceProps {
  software: {
    name: string;
    description: string;
    category: string;
  };
}

const ProcessSimulationInterface: React.FC<ProcessSimulationInterfaceProps> = ({ software }) => {
  const [activeTab, setActiveTab] = useState("flowsheet");
  const [simulationStatus, setSimulationStatus] = useState<"idle" | "running" | "complete">("idle");

  const handleRunSimulation = () => {
    setSimulationStatus("running");
    setTimeout(() => {
      setSimulationStatus("complete");
    }, 2000);
  };

  return (
    <div className="space-y-6 mt-4">
      <Tabs defaultValue="flowsheet" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="flowsheet">Flowsheet</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="thermodynamics">Thermodynamics</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="flowsheet" className="p-4 border rounded-md mt-4">
          <div className="bg-gray-100 dark:bg-gray-700 h-80 rounded-md p-4 flex items-center justify-center relative">
            <div className="flex flex-col items-center">
              <p className="text-center text-gray-500 dark:text-gray-400 mb-2">Drag and drop equipment from the palette to create your process flowsheet</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Add Equipment
                </Button>
                <Button variant="outline" size="sm">
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Add Stream
                </Button>
              </div>
            </div>
            <div className="absolute bottom-4 right-4 flex gap-2">
              <Button variant="outline" size="sm">
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button 
                variant={simulationStatus === "running" ? "secondary" : "default"} 
                size="sm"
                onClick={handleRunSimulation}
                disabled={simulationStatus === "running"}
              >
                <Play className="h-4 w-4 mr-1" />
                {simulationStatus === "idle" ? "Run Simulation" : 
                 simulationStatus === "running" ? "Running..." : "Re-run"}
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="components" className="p-4 border rounded-md mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="component-search">Search Components</Label>
              <Input id="component-search" placeholder="e.g. Methane, Water, etc." className="mb-4" />
              
              <div className="border rounded-md p-2 max-h-60 overflow-y-auto">
                <div className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                  <div className="flex justify-between items-center">
                    <span>Water</span>
                    <Badge>H₂O</Badge>
                  </div>
                </div>
                <div className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                  <div className="flex justify-between items-center">
                    <span>Methane</span>
                    <Badge>CH₄</Badge>
                  </div>
                </div>
                <div className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                  <div className="flex justify-between items-center">
                    <span>Ethanol</span>
                    <Badge>C₂H₅OH</Badge>
                  </div>
                </div>
                <div className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                  <div className="flex justify-between items-center">
                    <span>Carbon Dioxide</span>
                    <Badge>CO₂</Badge>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <Label>Selected Components</Label>
              <div className="border rounded-md p-2 h-48 overflow-y-auto">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 mb-2 rounded">
                  <div className="flex justify-between items-center">
                    <span>Water</span>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">×</Button>
                  </div>
                </div>
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded">
                  <div className="flex justify-between items-center">
                    <span>Methane</span>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">×</Button>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <Button className="w-full">
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Add Components
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="thermodynamics" className="p-4 border rounded-md mt-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="property-package">Property Package</Label>
              <Select defaultValue="peng-robinson">
                <SelectTrigger>
                  <SelectValue placeholder="Select a property package" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="peng-robinson">Peng-Robinson</SelectItem>
                  <SelectItem value="nrtl">NRTL</SelectItem>
                  <SelectItem value="uniquac">UNIQUAC</SelectItem>
                  <SelectItem value="saft">SAFT</SelectItem>
                  <SelectItem value="rk-soave">Redlich-Kwong-Soave</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Binary Interaction Parameters</Label>
              <div className="border rounded-md p-4 mt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="component1">Component 1</Label>
                    <Select defaultValue="water">
                      <SelectTrigger id="component1">
                        <SelectValue placeholder="Select component" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="water">Water</SelectItem>
                        <SelectItem value="methane">Methane</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="component2">Component 2</Label>
                    <Select defaultValue="methane">
                      <SelectTrigger id="component2">
                        <SelectValue placeholder="Select component" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="water">Water</SelectItem>
                        <SelectItem value="methane">Methane</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Label htmlFor="kij-value">kij Value</Label>
                  <div className="flex items-center gap-4">
                    <Slider defaultValue={[0.3]} max={1} step={0.01} className="flex-1" />
                    <span className="w-12 text-center">0.30</span>
                  </div>
                </div>
                
                <Button className="mt-4" variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-1" />
                  Advanced Settings
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="results" className="p-4 border rounded-md mt-4">
          {simulationStatus === "complete" ? (
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-md border border-green-200 dark:border-green-800">
                <p className="text-green-700 dark:text-green-300 text-sm font-medium">Simulation completed successfully</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Material Balance</h3>
                <div className="border rounded-md overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stream</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Temperature (°C)</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pressure (bar)</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Flow Rate (kg/h)</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      <tr>
                        <td className="px-4 py-2 text-sm">Feed</td>
                        <td className="px-4 py-2 text-sm">25.0</td>
                        <td className="px-4 py-2 text-sm">1.01</td>
                        <td className="px-4 py-2 text-sm">1000.0</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-sm">Product</td>
                        <td className="px-4 py-2 text-sm">80.5</td>
                        <td className="px-4 py-2 text-sm">2.50</td>
                        <td className="px-4 py-2 text-sm">980.3</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-sm">Waste</td>
                        <td className="px-4 py-2 text-sm">65.2</td>
                        <td className="px-4 py-2 text-sm">1.05</td>
                        <td className="px-4 py-2 text-sm">19.7</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" size="sm">
                  Export Results
                </Button>
                <Button variant="outline" size="sm">
                  Generate Report
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-60">
              <p className="text-gray-500 dark:text-gray-400 mb-4">Run simulation to view results</p>
              <Button 
                onClick={handleRunSimulation} 
                disabled={simulationStatus === "running"}
              >
                <Play className="h-4 w-4 mr-1" />
                {simulationStatus === "running" ? "Running..." : "Run Simulation"}
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProcessSimulationInterface;
