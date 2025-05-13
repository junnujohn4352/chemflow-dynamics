
import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { 
  FlaskConical, 
  Database, 
  Thermometer, 
  Droplets, 
  FileText, 
  Settings2, 
  ArrowRightLeft,
  Save,
  Download,
  Share2,
  Play
} from "lucide-react";
import SimulationCanvas from "@/components/simulation/SimulationCanvas";
import { EquipmentType } from "@/components/ui/equipment/EquipmentIcons";
import UnitOperationsTab from "@/components/coco-simulator/tabs/UnitOperationsTab";

interface Equipment {
  id: string;
  type: EquipmentType;
  position: { x: number; y: number };
}

const CreateSimulation: React.FC = () => {
  const [simulationName, setSimulationName] = useState<string>("New Process Simulation");
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [activeTab, setActiveTab] = useState<string>("unit-operations");
  const [runningSimulation, setRunningSimulation] = useState<boolean>(false);
  
  const { toast } = useToast();

  const handleEquipmentDrop = useCallback((type: EquipmentType, position: { x: number; y: number }) => {
    const newEquipment: Equipment = {
      id: uuidv4(),
      type,
      position
    };
    
    setEquipment(prev => [...prev, newEquipment]);
    
    toast({
      title: "Equipment Added",
      description: `${type.replace('-', ' ')} has been added to your simulation.`
    });
  }, [toast]);

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
      setRunningSimulation(false);
      
      toast({
        title: "Simulation Complete",
        description: "The process simulation has converged successfully.",
      });
    }, 2000);
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
            WebHYSYS Process Simulator
          </h1>
          <p className="text-muted-foreground">Web-based Chemical Process Simulation Environment</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Simulation Components</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-2">
                  <TabsTrigger value="unit-operations">Units</TabsTrigger>
                  <TabsTrigger value="streams">Streams</TabsTrigger>
                  <TabsTrigger value="thermodynamics">Thermo</TabsTrigger>
                </TabsList>
                
                <TabsContent value="unit-operations" className="mt-0">
                  <UnitOperationsTab couscousUnits={[]} />
                </TabsContent>
                
                <TabsContent value="streams" className="mt-0">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground mb-4">Stream Types</p>
                    
                    {[
                      { name: "Material Stream", icon: <Droplets className="h-4 w-4 text-blue-500" />, description: "Transport mass and energy between unit operations" },
                      { name: "Energy Stream", icon: <ArrowRightLeft className="h-4 w-4 text-orange-500" />, description: "Transfer energy between unit operations" },
                      { name: "Signal Stream", icon: <ArrowRightLeft className="h-4 w-4 text-green-500" />, description: "Transfer information like controllers" },
                    ].map(stream => (
                      <div key={stream.name} className="flex items-center justify-between p-3 border rounded-md hover:bg-blue-50 cursor-pointer">
                        <div className="flex items-center gap-3">
                          {stream.icon}
                          <div>
                            <p className="font-medium">{stream.name}</p>
                            <p className="text-xs text-muted-foreground">{stream.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="thermodynamics" className="mt-0">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground mb-4">Thermodynamic Models</p>
                    
                    {[
                      { name: "Peng-Robinson", type: "Equation of State" },
                      { name: "Soave-Redlich-Kwong", type: "Equation of State" },
                      { name: "NRTL", type: "Activity Coefficient" },
                      { name: "UNIQUAC", type: "Activity Coefficient" },
                      { name: "Ideal", type: "Basic" },
                    ].map(model => (
                      <div key={model.name} className="flex items-center justify-between p-3 border rounded-md hover:bg-blue-50 cursor-pointer">
                        <div>
                          <p className="font-medium">{model.name}</p>
                          <p className="text-xs text-muted-foreground">{model.type}</p>
                        </div>
                        <Button variant="ghost" size="sm">Select</Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Process Flow Diagram</CardTitle>
            </CardHeader>
            <CardContent className="h-[600px]">
              <SimulationCanvas equipment={equipment} onEquipmentDrop={handleEquipmentDrop} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Simulation Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="simName">Simulation Name</Label>
                  <Input 
                    id="simName" 
                    value={simulationName} 
                    onChange={e => setSimulationName(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="thermoModel">Thermodynamic Model</Label>
                  <Select defaultValue="pr">
                    <SelectTrigger id="thermoModel">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pr">Peng-Robinson</SelectItem>
                      <SelectItem value="srk">Soave-Redlich-Kwong</SelectItem>
                      <SelectItem value="nrtl">NRTL</SelectItem>
                      <SelectItem value="uniquac">UNIQUAC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="simType">Simulation Type</Label>
                  <Select defaultValue="steady">
                    <SelectTrigger id="simType">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="steady">Steady-state</SelectItem>
                      <SelectItem value="dynamic">Dynamic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="gap-1">
                  <Settings2 className="h-4 w-4" /> Advanced Settings
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <Database className="h-4 w-4" /> Component Database
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <Share2 className="h-4 w-4" /> Share Simulation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateSimulation;
