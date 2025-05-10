
import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Bookmark, FileText, Settings2, Database, Share2 } from "lucide-react";
import EquipmentPanel from "@/components/simulation/EquipmentPanel";
import SimulationCanvas from "@/components/simulation/SimulationCanvas";
import { EquipmentType } from "@/components/ui/equipment/EquipmentIcons";
import { v4 as uuidv4 } from 'uuid';
import ChemAssistant from "@/components/ai/ChemAssistant";

interface Equipment {
  id: string;
  type: EquipmentType;
  position: { x: number; y: number };
}

const CreateSimulation: React.FC = () => {
  const [simulationName, setSimulationName] = useState<string>("New Simulation");
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [showAIAssistant, setShowAIAssistant] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("equipment");
  const [bookmarks, setBookmarks] = useState([
    { id: 1, name: "Distillation Column", date: "2025-05-01" },
    { id: 2, name: "Reactor Network", date: "2025-05-05" },
    { id: 3, name: "Heat Exchanger Design", date: "2025-05-08" }
  ]);
  
  const [reports, setReports] = useState([
    { id: 1, name: "Mass Balance Analysis", date: "2025-05-03" },
    { id: 2, name: "Energy Optimization Report", date: "2025-05-07" },
    { id: 3, name: "Process Safety Evaluation", date: "2025-05-10" }
  ]);

  const [documentationItems, setDocumentationItems] = useState([
    { id: 1, title: "Equipment Sizing Guidelines", type: "PDF", size: "1.2 MB" },
    { id: 2, title: "Thermodynamic Models Guide", type: "PDF", size: "2.4 MB" },
    { id: 3, title: "Simulation Best Practices", type: "PDF", size: "3.1 MB" },
    { id: 4, title: "Chemical Properties Database", type: "Reference", size: "Online" }
  ]);

  const { toast } = useToast();

  const handleEquipmentDrop = useCallback((type: EquipmentType, position: { x: number; y: number }) => {
    const newEquipment: Equipment = {
      id: uuidv4(),
      type,
      position
    };
    
    setEquipment(prev => [...prev, newEquipment]);
  }, []);

  const handleSimulationCreation = (simulationData: any) => {
    toast({
      title: "Simulation Created",
      description: `New simulation "${simulationData.title}" has been set up.`,
    });
    setSimulationName(simulationData.title);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{simulationName}</h1>
          <p className="text-muted-foreground">Process Simulation Editor</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowAIAssistant(!showAIAssistant)}>
            {showAIAssistant ? "Hide AI Assistant" : "Show AI Assistant"}
          </Button>
          <Button>Save Simulation</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Simulation Tools</CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 mb-2">
                <TabsTrigger value="equipment">Equipment</TabsTrigger>
                <TabsTrigger value="documentation">Docs</TabsTrigger>
                <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>
              
              <TabsContent value="equipment" className="mt-0">
                <EquipmentPanel onEquipmentSelect={(type) => {
                  toast({
                    title: "Equipment Selected",
                    description: `${type.replace('-', ' ')} has been selected. Drag it to the canvas.`
                  });
                }} />
              </TabsContent>
              
              <TabsContent value="documentation" className="mt-0">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground mb-4">Technical documentation and guides</p>
                  {documentationItems.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-muted cursor-pointer">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-blue-500" />
                        <div>
                          <p className="font-medium">{doc.title}</p>
                          <p className="text-xs text-muted-foreground">{doc.type} • {doc.size}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="bookmarks" className="mt-0">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground mb-4">Your saved simulation bookmarks</p>
                  {bookmarks.map(bookmark => (
                    <div key={bookmark.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-muted cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Bookmark className="h-4 w-4 text-blue-500" />
                        <div>
                          <p className="font-medium">{bookmark.name}</p>
                          <p className="text-xs text-muted-foreground">Saved on {bookmark.date}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">Load</Button>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="reports" className="mt-0">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground mb-4">Your simulation reports</p>
                  {reports.map(report => (
                    <div key={report.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-muted cursor-pointer">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-blue-500" />
                        <div>
                          <p className="font-medium">{report.name}</p>
                          <p className="text-xs text-muted-foreground">Generated on {report.date}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Simulation Canvas</CardTitle>
            </CardHeader>
            <CardContent className="h-[600px]">
              <SimulationCanvas equipment={equipment} onEquipmentDrop={handleEquipmentDrop} />
            </CardContent>
          </Card>

          {showAIAssistant && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>ChemFlow AI Assistant</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ChemAssistant 
                  initialPrompt="Help me with my chemical engineering simulation"
                  onSimulationCreate={handleSimulationCreation}
                />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Simulation Settings</CardTitle>
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
