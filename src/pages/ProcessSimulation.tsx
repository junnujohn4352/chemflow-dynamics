
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { 
  FlaskConical, Thermometer, Droplets, Layers, FileText, 
  Settings2, Database, Share2, Play, Save, Download, BarChart2
} from "lucide-react";
import EquipmentPanel from "@/components/simulation/EquipmentPanel";
import SimulationCanvas from "@/components/simulation/SimulationCanvas";
import { EquipmentType } from "@/components/ui/equipment/EquipmentIcons";
import HysysProcessEquipment from "@/components/simulation/HysysProcessEquipment";

interface Equipment {
  id: string;
  type: EquipmentType;
  position: { x: number; y: number };
  connections?: { from: string; to: string }[];
  properties?: Record<string, any>;
}

interface Stream {
  id: string;
  from: { equipmentId: string; connectionPoint: string };
  to: { equipmentId: string; connectionPoint: string };
  properties?: {
    temperature?: number;
    pressure?: number;
    flowRate?: number;
    composition?: Record<string, number>;
  };
}

const ProcessSimulation: React.FC = () => {
  const { toast } = useToast();
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [simulationName, setSimulationName] = useState<string>("New HYSYS Simulation");
  const [activeTab, setActiveTab] = useState<string>("flowsheet");
  const [selectedComponents, setSelectedComponents] = useState<string[]>([
    "Methane", "Ethane", "Propane", "Water", "Carbon Dioxide", "Nitrogen"
  ]);
  const [runningSimulation, setRunningSimulation] = useState<boolean>(false);
  const [simulationResults, setSimulationResults] = useState<any>(null);
  
  const handleEquipmentDrop = (type: EquipmentType, position: { x: number; y: number }) => {
    const newEquipment: Equipment = {
      id: uuidv4(),
      type,
      position,
      properties: getDefaultPropertiesForEquipment(type)
    };
    
    setEquipment(prev => [...prev, newEquipment]);
    
    toast({
      title: "Equipment Added",
      description: `${type.replace('-', ' ')} has been added to your simulation.`
    });
  };
  
  const getDefaultPropertiesForEquipment = (type: EquipmentType): Record<string, any> => {
    switch (type) {
      case 'reactor':
        return {
          type: 'CSTR',
          volume: 5.0,
          temperature: 75,
          pressure: 200,
          conversion: 85
        };
      case 'heat-exchanger':
        return {
          type: 'Shell & Tube',
          area: 10.0,
          duty: 500,
          hotInletTemp: 150,
          hotOutletTemp: 90,
          coldInletTemp: 25,
          coldOutletTemp: 70
        };
      case 'distillation':
        return {
          numberOfTrays: 20,
          feedTray: 10,
          refluxRatio: 1.5,
          reboilerDuty: 1200,
          condenserDuty: -1000
        };
      case 'pump':
        return {
          type: 'Centrifugal',
          efficiency: 75,
          power: 15,
          head: 100
        };
      case 'compressor':
        return {
          type: 'Centrifugal',
          efficiency: 80,
          power: 250,
          pressureRatio: 3.0
        };
      case 'flash':
        return {
          temperature: 60,
          pressure: 150,
          vaporFraction: 0.4
        };
      case 'vessel':
        return {
          diameter: 2,
          height: 6,
          orientation: 'Vertical',
          liquidLevel: 50
        };
      default:
        return {};
    }
  };

  const handleEquipmentSelect = (id: string) => {
    // This would open equipment properties panel
    toast({
      title: "Equipment Selected",
      description: `You can now edit the properties of this equipment.`
    });
  };
  
  const handleRunSimulation = () => {
    if (equipment.length === 0) {
      toast({
        title: "Cannot Run Simulation",
        description: "Add some equipment to the simulation first.",
        variant: "destructive"
      });
      return;
    }
    
    setRunningSimulation(true);
    
    // Simulate a calculation that takes time
    setTimeout(() => {
      const results = {
        converged: true,
        iterations: Math.floor(Math.random() * 10) + 5,
        streams: equipment.map(equip => ({
          equipmentId: equip.id,
          type: equip.type,
          outputs: {
            temperature: Math.round(Math.random() * 150 + 30),
            pressure: Math.round(Math.random() * 400 + 100),
            flowRate: Math.round(Math.random() * 1000 + 100) / 10,
            composition: selectedComponents.reduce((acc, comp) => {
              acc[comp] = Math.round(Math.random() * 1000) / 10;
              return acc;
            }, {} as Record<string, number>)
          }
        }))
      };
      
      setSimulationResults(results);
      setRunningSimulation(false);
      
      toast({
        title: "Simulation Complete",
        description: `The simulation converged after ${results.iterations} iterations.`,
      });
    }, 3000);
  };
  
  const handleSaveSimulation = () => {
    toast({
      title: "Simulation Saved",
      description: "Your simulation has been saved successfully."
    });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Process Simulation Environment
          </h1>
          <p className="text-muted-foreground">Aspen HYSYS-like Process Simulator</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline"
            size="sm"
            className="flex items-center gap-1.5"
            onClick={handleSaveSimulation}
          >
            <Save className="h-4 w-4" />
            Save
          </Button>
          
          <Button 
            variant="outline"
            size="sm"
            className="flex items-center gap-1.5"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          
          <Button 
            size="sm"
            className={`flex items-center gap-1.5 ${runningSimulation ? "bg-amber-600 hover:bg-amber-700" : ""}`}
            onClick={handleRunSimulation}
            disabled={runningSimulation}
          >
            {runningSimulation ? (
              <>
                <div className="h-3 w-3 rounded-full bg-white animate-pulse"></div>
                Running...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Run Simulation
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-5 mb-6">
          <TabsTrigger value="flowsheet" className="flex items-center gap-1.5">
            <FileText className="h-4 w-4" />
            Process Flowsheet
          </TabsTrigger>
          <TabsTrigger value="components" className="flex items-center gap-1.5">
            <Database className="h-4 w-4" />
            Components
          </TabsTrigger>
          <TabsTrigger value="thermodynamics" className="flex items-center gap-1.5">
            <Thermometer className="h-4 w-4" />
            Thermodynamics
          </TabsTrigger>
          <TabsTrigger value="streams" className="flex items-center gap-1.5">
            <Droplets className="h-4 w-4" />
            Stream Data
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-1.5">
            <BarChart2 className="h-4 w-4" />
            Results
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="flowsheet" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="md:col-span-1">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Equipment Library</CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                  {/* Updated equipment panel with all HYSYS equipment types */}
                  <HysysProcessEquipment />
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Process Flowsheet</CardTitle>
                </CardHeader>
                <CardContent className="h-[600px] bg-gray-50 rounded-md border-dashed border-2 border-gray-300">
                  <SimulationCanvas 
                    equipment={equipment}
                    onEquipmentDrop={handleEquipmentDrop}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="components">
          <Card>
            <CardHeader>
              <CardTitle>Component Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  "Methane", "Ethane", "Propane", "n-Butane", "i-Butane",
                  "n-Pentane", "i-Pentane", "n-Hexane", "Water", "Nitrogen",
                  "Oxygen", "Carbon Dioxide", "Hydrogen Sulfide", "Hydrogen",
                  "Carbon Monoxide", "Argon", "Helium", "Ammonia", "Benzene",
                  "Toluene", "Ethylene", "Propylene", "Acetone", "Methanol",
                  "Ethanol", "Acetic Acid", "Formic Acid"
                ].map((component) => (
                  <div 
                    key={component}
                    className={`border rounded-md p-3 cursor-pointer transition-colors ${
                      selectedComponents.includes(component)
                        ? "bg-blue-100 border-blue-300"
                        : "bg-white border-gray-200 hover:bg-blue-50"
                    }`}
                    onClick={() => {
                      if (selectedComponents.includes(component)) {
                        setSelectedComponents(prev => prev.filter(c => c !== component));
                      } else {
                        setSelectedComponents(prev => [...prev, component]);
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <FlaskConical className={`h-4 w-4 ${selectedComponents.includes(component) ? "text-blue-600" : "text-gray-400"}`} />
                      <span className={selectedComponents.includes(component) ? "font-medium text-blue-800" : ""}>{component}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="thermodynamics">
          <Card>
            <CardHeader>
              <CardTitle>Thermodynamic Models</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Equation of State Models</h3>
                  <div className="space-y-2">
                    {[
                      "Peng-Robinson", "Soave-Redlich-Kwong", "Lee-Kesler-Plocker",
                      "Benedict-Webb-Rubin", "BWRS", "Virial", "Sour PR"
                    ].map((model) => (
                      <div key={model} className="flex items-center gap-3 p-2 border rounded-md hover:bg-blue-50 cursor-pointer">
                        <input type="radio" name="eosModel" id={model} />
                        <label htmlFor={model} className="cursor-pointer">{model}</label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Activity Coefficient Models</h3>
                  <div className="space-y-2">
                    {[
                      "NRTL", "UNIQUAC", "Wilson", "Van Laar", "Margules", 
                      "UNIFAC", "Electrolyte NRTL"
                    ].map((model) => (
                      <div key={model} className="flex items-center gap-3 p-2 border rounded-md hover:bg-blue-50 cursor-pointer">
                        <input type="radio" name="activityModel" id={model} />
                        <label htmlFor={model} className="cursor-pointer">{model}</label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Special Models</h3>
                  <div className="space-y-2">
                    {[
                      "Glycol Package", "Amine Package", "Steam Package", "MBWR",
                      "Chao-Seader", "Grayson-Streed", "Extended Antoine"
                    ].map((model) => (
                      <div key={model} className="flex items-center gap-3 p-2 border rounded-md hover:bg-blue-50 cursor-pointer">
                        <input type="checkbox" id={model} />
                        <label htmlFor={model} className="cursor-pointer">{model}</label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Binary Interaction Parameters</h3>
                  <Card className="p-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      Configure binary interaction parameters between components for accurate simulation results.
                    </p>
                    <Button variant="outline">
                      <Settings2 className="h-4 w-4 mr-1.5" />
                      Configure Parameters
                    </Button>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="streams">
          <Card>
            <CardHeader>
              <CardTitle>Process Streams</CardTitle>
            </CardHeader>
            <CardContent>
              {equipment.length === 0 ? (
                <div className="text-center p-8 border border-dashed rounded-md">
                  <p className="text-muted-foreground">Add equipment to the flowsheet to create process streams</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="border p-2 text-left">Stream Name</th>
                        <th className="border p-2 text-left">From</th>
                        <th className="border p-2 text-left">To</th>
                        <th className="border p-2 text-right">Temperature (°C)</th>
                        <th className="border p-2 text-right">Pressure (kPa)</th>
                        <th className="border p-2 text-right">Flow Rate (kg/h)</th>
                        <th className="border p-2 text-left">Vapor Fraction</th>
                        <th className="border p-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {simulationResults ? (
                        simulationResults.streams.map((stream: any, index: number) => (
                          <tr key={index} className="hover:bg-slate-50">
                            <td className="border p-2">Stream-{index+1}</td>
                            <td className="border p-2">{stream.type}</td>
                            <td className="border p-2">-</td>
                            <td className="border p-2 text-right">{stream.outputs.temperature}</td>
                            <td className="border p-2 text-right">{stream.outputs.pressure}</td>
                            <td className="border p-2 text-right">{stream.outputs.flowRate}</td>
                            <td className="border p-2">{(Math.random() > 0.5 ? "1.0" : "0.0")}</td>
                            <td className="border p-2">
                              <Button variant="outline" size="sm">View</Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className="border p-4 text-center">
                            Run the simulation to view stream data
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>Simulation Results</CardTitle>
            </CardHeader>
            <CardContent>
              {simulationResults ? (
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-md p-4">
                    <h3 className="text-green-800 font-medium">Simulation Converged</h3>
                    <p className="text-green-600">The simulation successfully converged after {simulationResults.iterations} iterations.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {equipment.map((equip, index) => {
                      const result = simulationResults.streams.find((s: any) => s.equipmentId === equip.id);
                      return (
                        <Card key={equip.id} className="overflow-hidden">
                          <div className="bg-slate-100 p-3">
                            <h4 className="font-medium">{equip.type.replace('-', ' ')} Results</h4>
                          </div>
                          <CardContent className="p-4">
                            {result ? (
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Temperature:</span>
                                  <span className="font-medium">{result.outputs.temperature} °C</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Pressure:</span>
                                  <span className="font-medium">{result.outputs.pressure} kPa</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Flow Rate:</span>
                                  <span className="font-medium">{result.outputs.flowRate} kg/h</span>
                                </div>
                                {equip.type === 'reactor' && (
                                  <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Conversion:</span>
                                    <span className="font-medium">{Math.round(Math.random() * 100)} %</span>
                                  </div>
                                )}
                                {equip.type === 'heat-exchanger' && (
                                  <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Heat Duty:</span>
                                    <span className="font-medium">{Math.round(Math.random() * 1000)} kW</span>
                                  </div>
                                )}
                                <Button variant="outline" size="sm" className="w-full mt-2">View Details</Button>
                              </div>
                            ) : (
                              <p className="text-muted-foreground text-sm">No data available</p>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 border border-dashed rounded-md">
                  <p className="text-muted-foreground">Run the simulation to view results</p>
                  <Button 
                    onClick={handleRunSimulation}
                    disabled={runningSimulation || equipment.length === 0}
                    className="mt-4"
                  >
                    <Play className="h-4 w-4 mr-1.5" />
                    Run Simulation
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProcessSimulation;
