
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Play, BarChart, LineChart, Download } from "lucide-react";

interface ThermodynamicInterfaceProps {
  software: {
    name: string;
    description: string;
    category: string;
  };
}

const ThermodynamicInterface: React.FC<ThermodynamicInterfaceProps> = ({ software }) => {
  const [calculating, setCalculating] = useState(false);
  const [resultsReady, setResultsReady] = useState(false);

  const handleCalculate = () => {
    setCalculating(true);
    setTimeout(() => {
      setCalculating(false);
      setResultsReady(true);
    }, 1500);
  };

  return (
    <div className="space-y-6 mt-4">
      <Tabs defaultValue="properties">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="properties">Property Calculation</TabsTrigger>
          <TabsTrigger value="phase">Phase Equilibrium</TabsTrigger>
          <TabsTrigger value="charts">Property Charts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="properties" className="p-4 border rounded-md mt-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="compound">Compound</Label>
                <Select defaultValue="water">
                  <SelectTrigger id="compound">
                    <SelectValue placeholder="Select compound" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="water">Water</SelectItem>
                    <SelectItem value="methane">Methane</SelectItem>
                    <SelectItem value="ethanol">Ethanol</SelectItem>
                    <SelectItem value="co2">Carbon Dioxide</SelectItem>
                    <SelectItem value="nitrogen">Nitrogen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="temperature">Temperature (K)</Label>
                <Input id="temperature" type="number" defaultValue="298.15" />
              </div>
              
              <div>
                <Label htmlFor="pressure">Pressure (kPa)</Label>
                <Input id="pressure" type="number" defaultValue="101.325" />
              </div>
              
              <div>
                <Label htmlFor="model">Equation of State</Label>
                <Select defaultValue="peng-robinson">
                  <SelectTrigger id="model">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="peng-robinson">Peng-Robinson</SelectItem>
                    <SelectItem value="srk">Soave-Redlich-Kwong</SelectItem>
                    <SelectItem value="pr-peneloux">PR-Peneloux</SelectItem>
                    <SelectItem value="ideal-gas">Ideal Gas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleCalculate}
                disabled={calculating}
              >
                {calculating ? "Calculating..." : "Calculate Properties"}
              </Button>
            </div>
            
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-4">Calculated Properties</h3>
              
              {resultsReady ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Density:</div>
                    <div className="text-sm font-medium">997.1 kg/m³</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Viscosity:</div>
                    <div className="text-sm font-medium">0.891 mPa·s</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Heat Capacity:</div>
                    <div className="text-sm font-medium">4.18 kJ/(kg·K)</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Thermal Conductivity:</div>
                    <div className="text-sm font-medium">0.606 W/(m·K)</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Enthalpy:</div>
                    <div className="text-sm font-medium">-285.8 kJ/mol</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Entropy:</div>
                    <div className="text-sm font-medium">69.95 J/(mol·K)</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Gibbs Energy:</div>
                    <div className="text-sm font-medium">-237.1 kJ/mol</div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="h-4 w-4 mr-1" />
                      Export Data
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <p>No data calculated yet</p>
                  <p className="text-sm mt-1">Use the form to calculate properties</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="phase" className="p-4 border rounded-md mt-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label>Components</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <Input defaultValue="0.7" className="w-20" />
                    <span className="text-sm">Methane</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input defaultValue="0.2" className="w-20" />
                    <span className="text-sm">Ethane</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input defaultValue="0.1" className="w-20" />
                    <span className="text-sm">Propane</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mt-2">
                  Add Component
                </Button>
              </div>
              
              <div>
                <Label>Temperature Range (K)</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Input defaultValue="200" className="w-24" />
                  <span>to</span>
                  <Input defaultValue="350" className="w-24" />
                </div>
              </div>
              
              <div>
                <Label>Pressure (kPa)</Label>
                <Input defaultValue="5000" />
              </div>
              
              <Button onClick={handleCalculate}>
                <Play className="h-4 w-4 mr-1" />
                Calculate Phase Diagram
              </Button>
            </div>
            
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-4">Phase Diagram</h3>
              
              {resultsReady ? (
                <div className="aspect-square bg-white dark:bg-gray-800 rounded border flex items-center justify-center">
                  <div className="text-center">
                    <LineChart className="h-12 w-12 mx-auto mb-2 text-blue-500" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">[Phase diagram visualization would appear here]</p>
                  </div>
                </div>
              ) : (
                <div className="aspect-square bg-white dark:bg-gray-800 rounded border flex items-center justify-center">
                  <p className="text-gray-400">No phase data calculated yet</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="charts" className="p-4 border rounded-md mt-4">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Property</Label>
                <Select defaultValue="density">
                  <SelectTrigger>
                    <SelectValue placeholder="Select property" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="density">Density</SelectItem>
                    <SelectItem value="viscosity">Viscosity</SelectItem>
                    <SelectItem value="enthalpy">Enthalpy</SelectItem>
                    <SelectItem value="entropy">Entropy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Variable</Label>
                <Select defaultValue="temperature">
                  <SelectTrigger>
                    <SelectValue placeholder="Select variable" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="temperature">Temperature</SelectItem>
                    <SelectItem value="pressure">Pressure</SelectItem>
                    <SelectItem value="composition">Composition</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Model</Label>
                <Select defaultValue="peng-robinson">
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="peng-robinson">Peng-Robinson</SelectItem>
                    <SelectItem value="srk">Soave-Redlich-Kwong</SelectItem>
                    <SelectItem value="ideal">Ideal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button variant="outline" size="sm">
                <BarChart className="h-4 w-4 mr-1" />
                Generate Chart
              </Button>
            </div>
            
            <div className="aspect-video bg-white dark:bg-gray-800 rounded border flex items-center justify-center">
              <div className="text-center">
                <BarChart className="h-12 w-12 mx-auto mb-2 text-blue-500" />
                <p className="text-sm text-gray-500 dark:text-gray-400">[Property chart visualization would appear here]</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ThermodynamicInterface;
