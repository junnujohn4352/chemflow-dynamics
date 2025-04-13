
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Play, LineChart, Plus, Save } from "lucide-react";

interface ReactionEngineeringInterfaceProps {
  software: {
    name: string;
    description: string;
    category: string;
  };
}

const ReactionEngineeringInterface: React.FC<ReactionEngineeringInterfaceProps> = ({ software }) => {
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationComplete, setSimulationComplete] = useState(false);

  const handleRunSimulation = () => {
    setSimulationRunning(true);
    setTimeout(() => {
      setSimulationRunning(false);
      setSimulationComplete(true);
    }, 2000);
  };

  return (
    <div className="space-y-6 mt-4">
      <Tabs defaultValue="reactions">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="reactions">Reactions</TabsTrigger>
          <TabsTrigger value="kinetics">Kinetics</TabsTrigger>
          <TabsTrigger value="reactor">Reactor Model</TabsTrigger>
          <TabsTrigger value="results">Simulation Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="reactions" className="p-4 border rounded-md mt-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Reaction Mechanism</h3>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Reaction
              </Button>
            </div>
            
            <div className="border rounded-md p-4 bg-white dark:bg-gray-800">
              <h4 className="font-medium mb-2">Reaction 1</h4>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">A + B</span>
                <span className="text-lg">→</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">C</span>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="reaction-type">Reaction Type</Label>
                    <Select defaultValue="elementary">
                      <SelectTrigger id="reaction-type">
                        <SelectValue placeholder="Select reaction type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="elementary">Elementary</SelectItem>
                        <SelectItem value="non-elementary">Non-Elementary</SelectItem>
                        <SelectItem value="catalytic">Catalytic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="reaction-phase">Phase</Label>
                    <Select defaultValue="gas">
                      <SelectTrigger id="reaction-phase">
                        <SelectValue placeholder="Select phase" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gas">Gas Phase</SelectItem>
                        <SelectItem value="liquid">Liquid Phase</SelectItem>
                        <SelectItem value="solid">Solid-Catalyzed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="reaction-equation">Stoichiometric Equation</Label>
                  <Input id="reaction-equation" value="A + B → C" readOnly className="font-mono" />
                </div>
              </div>
            </div>
            
            <div className="border rounded-md p-4 bg-white dark:bg-gray-800">
              <h4 className="font-medium mb-2">Reaction 2</h4>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">C</span>
                <span className="text-lg">→</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">D + E</span>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="reaction2-type">Reaction Type</Label>
                    <Select defaultValue="elementary">
                      <SelectTrigger id="reaction2-type">
                        <SelectValue placeholder="Select reaction type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="elementary">Elementary</SelectItem>
                        <SelectItem value="non-elementary">Non-Elementary</SelectItem>
                        <SelectItem value="catalytic">Catalytic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="reaction2-phase">Phase</Label>
                    <Select defaultValue="gas">
                      <SelectTrigger id="reaction2-phase">
                        <SelectValue placeholder="Select phase" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gas">Gas Phase</SelectItem>
                        <SelectItem value="liquid">Liquid Phase</SelectItem>
                        <SelectItem value="solid">Solid-Catalyzed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="reaction2-equation">Stoichiometric Equation</Label>
                  <Input id="reaction2-equation" value="C → D + E" readOnly className="font-mono" />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="kinetics" className="p-4 border rounded-md mt-4">
          <div className="space-y-4">
            <h3 className="font-medium">Reaction Kinetics Parameters</h3>
            
            <div className="border rounded-md p-4 bg-white dark:bg-gray-800">
              <h4 className="font-medium mb-2">Reaction 1: A + B → C</h4>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pre-exponential">Pre-exponential Factor (A)</Label>
                    <Input id="pre-exponential" defaultValue="1.5e7" />
                    <p className="text-xs text-gray-500 mt-1">mol⁻¹·L·s⁻¹</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="activation-energy">Activation Energy (Ea)</Label>
                    <Input id="activation-energy" defaultValue="50.0" />
                    <p className="text-xs text-gray-500 mt-1">kJ/mol</p>
                  </div>
                </div>
                
                <div>
                  <Label>Temperature Dependence</Label>
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs">300 K</span>
                      <span className="text-xs">800 K</span>
                    </div>
                    <Slider defaultValue={[500]} min={300} max={800} step={10} />
                    <div className="text-center mt-1">
                      <span className="text-sm">500 K</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="reaction-order">Reaction Order</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <Label htmlFor="order-a" className="text-xs">Component A</Label>
                      <Input id="order-a" defaultValue="1" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="order-b" className="text-xs">Component B</Label>
                      <Input id="order-b" defaultValue="1" className="mt-1" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border rounded-md p-4 bg-white dark:bg-gray-800">
              <h4 className="font-medium mb-2">Reaction 2: C → D + E</h4>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pre-exponential2">Pre-exponential Factor (A)</Label>
                    <Input id="pre-exponential2" defaultValue="8.4e6" />
                    <p className="text-xs text-gray-500 mt-1">s⁻¹</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="activation-energy2">Activation Energy (Ea)</Label>
                    <Input id="activation-energy2" defaultValue="75.0" />
                    <p className="text-xs text-gray-500 mt-1">kJ/mol</p>
                  </div>
                </div>
                
                <div>
                  <Label>Temperature Dependence</Label>
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs">300 K</span>
                      <span className="text-xs">800 K</span>
                    </div>
                    <Slider defaultValue={[550]} min={300} max={800} step={10} />
                    <div className="text-center mt-1">
                      <span className="text-sm">550 K</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="reaction-order2">Reaction Order</Label>
                  <div className="grid grid-cols-1 gap-4 mt-2">
                    <div>
                      <Label htmlFor="order-c" className="text-xs">Component C</Label>
                      <Input id="order-c" defaultValue="1" className="mt-1" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="reactor" className="p-4 border rounded-md mt-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="reactor-type">Reactor Type</Label>
                <Select defaultValue="cstr">
                  <SelectTrigger id="reactor-type">
                    <SelectValue placeholder="Select reactor type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="batch">Batch Reactor</SelectItem>
                    <SelectItem value="cstr">Continuous Stirred Tank Reactor (CSTR)</SelectItem>
                    <SelectItem value="pfr">Plug Flow Reactor (PFR)</SelectItem>
                    <SelectItem value="semi-batch">Semi-Batch Reactor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="reactor-mode">Operation Mode</Label>
                <Select defaultValue="isothermal">
                  <SelectTrigger id="reactor-mode">
                    <SelectValue placeholder="Select operation mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="isothermal">Isothermal</SelectItem>
                    <SelectItem value="adiabatic">Adiabatic</SelectItem>
                    <SelectItem value="non-isothermal">Non-Isothermal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="reactor-volume">Volume (L)</Label>
                <Input id="reactor-volume" defaultValue="100" />
              </div>
              
              <div>
                <Label htmlFor="reactor-temp">Temperature (K)</Label>
                <Input id="reactor-temp" defaultValue="500" />
              </div>
              
              <div>
                <Label htmlFor="reactor-pressure">Pressure (bar)</Label>
                <Input id="reactor-pressure" defaultValue="5" />
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Initial Conditions</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="initial-a">Concentration of A (mol/L)</Label>
                  <Input id="initial-a" defaultValue="2.0" />
                </div>
                <div>
                  <Label htmlFor="initial-b">Concentration of B (mol/L)</Label>
                  <Input id="initial-b" defaultValue="2.0" />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="initial-c">Concentration of C (mol/L)</Label>
                  <Input id="initial-c" defaultValue="0.0" />
                </div>
                <div>
                  <Label htmlFor="initial-d">Concentration of D (mol/L)</Label>
                  <Input id="initial-d" defaultValue="0.0" />
                </div>
                <div>
                  <Label htmlFor="initial-e">Concentration of E (mol/L)</Label>
                  <Input id="initial-e" defaultValue="0.0" />
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-4">
              <Button variant="outline">
                <Save className="h-4 w-4 mr-1" />
                Save Configuration
              </Button>
              
              <Button 
                onClick={handleRunSimulation}
                disabled={simulationRunning}
              >
                <Play className="h-4 w-4 mr-1" />
                {simulationRunning ? "Simulating..." : "Run Simulation"}
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="results" className="p-4 border rounded-md mt-4">
          {simulationComplete ? (
            <div className="space-y-6">
              <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-md">
                <p className="text-green-700 dark:text-green-300 text-sm">Simulation completed successfully</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Concentration Profiles</h3>
                <div className="aspect-video bg-white dark:bg-gray-800 rounded border flex items-center justify-center">
                  <div className="text-center">
                    <LineChart className="h-12 w-12 mx-auto mb-2 text-blue-500" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">[Concentration vs. time plot would appear here]</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Conversion and Selectivity</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="border rounded-md p-4 bg-white dark:bg-gray-800">
                    <h4 className="text-sm font-medium mb-3">Conversion of A</h4>
                    <div className="text-center">
                      <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">92.5%</span>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4 bg-white dark:bg-gray-800">
                    <h4 className="text-sm font-medium mb-3">Selectivity to D & E</h4>
                    <div className="text-center">
                      <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">78.3%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <Button variant="outline" size="sm">Export Data</Button>
                <Button variant="outline" size="sm">Generate Report</Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4">Run simulation to view results</p>
              <Button 
                onClick={handleRunSimulation}
                disabled={simulationRunning}
              >
                <Play className="h-4 w-4 mr-1" />
                {simulationRunning ? "Simulating..." : "Run Simulation"}
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReactionEngineeringInterface;
