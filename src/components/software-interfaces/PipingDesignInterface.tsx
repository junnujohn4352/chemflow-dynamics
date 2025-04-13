
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Save, Layers, Pencil, Image, Download, Plus, Eye } from "lucide-react";

interface PipingDesignInterfaceProps {
  software: {
    name: string;
    description: string;
    category: string;
  };
}

const PipingDesignInterface: React.FC<PipingDesignInterfaceProps> = ({ software }) => {
  const [activeTab, setActiveTab] = useState("pid");

  return (
    <div className="space-y-6 mt-4">
      <Tabs defaultValue="pid" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="pid">P&ID Design</TabsTrigger>
          <TabsTrigger value="3d-model">3D Modeling</TabsTrigger>
          <TabsTrigger value="isometric">Isometric Drawing</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pid" className="p-4 border rounded-md mt-4">
          <div className="grid grid-cols-4 gap-4 h-[600px]">
            <div className="col-span-1 border-r pr-4 space-y-4">
              <h3 className="font-medium mb-2">P&ID Elements</h3>
              
              <div className="space-y-3">
                <Label className="text-sm font-medium">Equipment</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="justify-start text-xs">
                    Vessel
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start text-xs">
                    Column
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start text-xs">
                    Reactor
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start text-xs">
                    Heat Exchanger
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start text-xs">
                    Pump
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start text-xs">
                    Compressor
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                <Label className="text-sm font-medium">Piping</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="justify-start text-xs">
                    Process Line
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start text-xs">
                    Utility Line
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start text-xs">
                    Connection
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start text-xs">
                    Reducing Tee
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                <Label className="text-sm font-medium">Valves</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="justify-start text-xs">
                    Gate Valve
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start text-xs">
                    Globe Valve
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start text-xs">
                    Check Valve
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start text-xs">
                    Control Valve
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                <Label className="text-sm font-medium">Instruments</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="justify-start text-xs">
                    Indicator
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start text-xs">
                    Transmitter
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start text-xs">
                    Controller
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start text-xs">
                    Switch
                  </Button>
                </div>
              </div>
              
              <div className="pt-3 border-t">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Custom Symbol
                </Button>
              </div>
            </div>
            
            <div className="col-span-3 space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Pencil className="h-4 w-4 mr-1" />
                    Draw
                  </Button>
                  <Button variant="outline" size="sm">
                    <Layers className="h-4 w-4 mr-1" />
                    Layers
                  </Button>
                  <Select defaultValue="actual">
                    <SelectTrigger className="w-36 h-8">
                      <SelectValue placeholder="View Scale" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="50">50%</SelectItem>
                      <SelectItem value="75">75%</SelectItem>
                      <SelectItem value="actual">100%</SelectItem>
                      <SelectItem value="150">150%</SelectItem>
                      <SelectItem value="200">200%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Button variant="outline" size="sm">
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md p-2 bg-gray-50 dark:bg-gray-800 h-[520px] flex items-center justify-center">
                <div className="text-center">
                  <Image className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600" />
                  <p className="mt-4 text-gray-500 dark:text-gray-400">
                    [P&ID drawing area would appear here]
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                    Drag elements from the left panel to create your P&ID
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="3d-model" className="p-4 border rounded-md mt-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  View Options
                </Button>
                <Select defaultValue="shaded">
                  <SelectTrigger className="w-40 h-8">
                    <SelectValue placeholder="Display Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wireframe">Wireframe</SelectItem>
                    <SelectItem value="hidden">Hidden Line</SelectItem>
                    <SelectItem value="shaded">Shaded</SelectItem>
                    <SelectItem value="rendered">Rendered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-5 gap-4 h-[560px]">
              <div className="col-span-1 border-r pr-2 space-y-4 overflow-y-auto h-full">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Model Tree</Label>
                  
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center space-x-1 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                      <span>+ Project</span>
                    </div>
                    <div className="ml-4 space-y-1">
                      <div className="flex items-center space-x-1 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                        <span>+ Process Area</span>
                      </div>
                      <div className="ml-4 space-y-1">
                        <div className="flex items-center space-x-1 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                          <span>+ Equipment</span>
                        </div>
                        <div className="ml-4 space-y-1">
                          <div className="flex items-center space-x-1 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                            <span>Reactor R-101</span>
                          </div>
                          <div className="flex items-center space-x-1 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                            <span>Column C-101</span>
                          </div>
                          <div className="flex items-center space-x-1 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                            <span>Heat Exchanger E-101</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                          <span>+ Piping</span>
                        </div>
                        <div className="ml-4 space-y-1">
                          <div className="flex items-center space-x-1 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                            <span>Line 100-A-3"-CS150</span>
                          </div>
                          <div className="flex items-center space-x-1 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                            <span>Line 101-P-4"-SS316</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                          <span>+ Instruments</span>
                        </div>
                        <div className="flex items-center space-x-1 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                          <span>+ Structures</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-3 border-t space-y-3">
                  <Label className="text-sm font-medium">Component Library</Label>
                  
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                      <Plus className="h-3 w-3 mr-1" />
                      Add Equipment
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                      <Plus className="h-3 w-3 mr-1" />
                      Add Piping Component
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                      <Plus className="h-3 w-3 mr-1" />
                      Add Structure
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="col-span-4 space-y-4">
                <div className="border rounded-md p-2 bg-gray-50 dark:bg-gray-800 h-full flex items-center justify-center">
                  <div className="text-center">
                    <Image className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600" />
                    <p className="mt-4 text-gray-500 dark:text-gray-400">
                      [3D model visualization would appear here]
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                      This area would display the 3D model of your piping system
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="isometric" className="p-4 border rounded-md mt-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Isometric Drawing Generation</h3>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  New Drawing
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Export PDF
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-1 space-y-4">
                <div className="border rounded-md p-4 bg-white dark:bg-gray-800 space-y-3">
                  <Label htmlFor="line-number">Line Number</Label>
                  <Input id="line-number" placeholder="e.g. 100-P-3" />
                  
                  <Label htmlFor="line-spec">Line Specification</Label>
                  <Select defaultValue="cs-150">
                    <SelectTrigger id="line-spec">
                      <SelectValue placeholder="Select specification" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cs-150">CS-150# (Carbon Steel)</SelectItem>
                      <SelectItem value="cs-300">CS-300# (Carbon Steel)</SelectItem>
                      <SelectItem value="ss-150">SS-150# (Stainless Steel 316)</SelectItem>
                      <SelectItem value="ss-300">SS-300# (Stainless Steel 316)</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Label htmlFor="pipe-size">Pipe Size</Label>
                  <Select defaultValue="3in">
                    <SelectTrigger id="pipe-size">
                      <SelectValue placeholder="Select pipe size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1in">1" (DN25)</SelectItem>
                      <SelectItem value="2in">2" (DN50)</SelectItem>
                      <SelectItem value="3in">3" (DN80)</SelectItem>
                      <SelectItem value="4in">4" (DN100)</SelectItem>
                      <SelectItem value="6in">6" (DN150)</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Label htmlFor="pipe-schedule">Pipe Schedule</Label>
                  <Select defaultValue="40">
                    <SelectTrigger id="pipe-schedule">
                      <SelectValue placeholder="Select pipe schedule" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">Schedule 10</SelectItem>
                      <SelectItem value="40">Schedule 40</SelectItem>
                      <SelectItem value="80">Schedule 80</SelectItem>
                      <SelectItem value="160">Schedule 160</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Label htmlFor="service">Service</Label>
                  <Input id="service" placeholder="e.g. Process Fluid" />
                  
                  <div className="flex items-center space-x-2 pt-1">
                    <Switch id="include-bom" />
                    <Label htmlFor="include-bom" className="text-sm">Include BOM in drawing</Label>
                  </div>
                </div>
                
                <Button className="w-full">
                  Generate Isometric Drawing
                </Button>
              </div>
              
              <div className="col-span-2 border rounded-md p-4 bg-white dark:bg-gray-800 h-[500px] flex items-center justify-center">
                <div className="text-center">
                  <Image className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600" />
                  <p className="mt-4 text-gray-500 dark:text-gray-400">
                    [Isometric drawing preview would appear here]
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                    Fill in the specifications and click "Generate Isometric Drawing"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="specifications" className="p-4 border rounded-md mt-4">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium">Line Specifications</h3>
                
                <div className="border rounded-md p-4 bg-white dark:bg-gray-800 space-y-3">
                  <Label htmlFor="spec-code">Specification Code</Label>
                  <Input id="spec-code" placeholder="e.g. CS-150" />
                  
                  <Label htmlFor="spec-description">Description</Label>
                  <Input id="spec-description" placeholder="Carbon Steel, ANSI 150#" />
                  
                  <Label htmlFor="material">Material</Label>
                  <Select defaultValue="cs">
                    <SelectTrigger id="material">
                      <SelectValue placeholder="Select material" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cs">Carbon Steel</SelectItem>
                      <SelectItem value="ss304">Stainless Steel 304</SelectItem>
                      <SelectItem value="ss316">Stainless Steel 316</SelectItem>
                      <SelectItem value="duplex">Duplex SS</SelectItem>
                      <SelectItem value="alloy">Alloy Steel</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Label htmlFor="pressure-rating">Pressure Rating</Label>
                  <Select defaultValue="150">
                    <SelectTrigger id="pressure-rating">
                      <SelectValue placeholder="Select pressure rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="150">ANSI 150#</SelectItem>
                      <SelectItem value="300">ANSI 300#</SelectItem>
                      <SelectItem value="600">ANSI 600#</SelectItem>
                      <SelectItem value="900">ANSI 900#</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Label htmlFor="temperature-range">Temperature Range</Label>
                  <div className="flex items-center gap-2">
                    <Input id="min-temp" placeholder="Min" className="w-20" />
                    <span className="text-sm">to</span>
                    <Input id="max-temp" placeholder="Max" className="w-20" />
                    <span className="text-sm whitespace-nowrap">°C</span>
                  </div>
                  
                  <Button variant="outline" className="w-full" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Specification
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Specification Components</h3>
                
                <div className="border rounded-md p-4 bg-white dark:bg-gray-800 space-y-3 h-[400px] overflow-y-auto">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                      <span className="text-sm font-medium">Pipe</span>
                      <span className="text-xs text-gray-500">ASTM A106 Gr. B</span>
                    </div>
                    <div className="flex justify-between items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                      <span className="text-sm font-medium">Flange</span>
                      <span className="text-xs text-gray-500">ASTM A105, RF</span>
                    </div>
                    <div className="flex justify-between items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                      <span className="text-sm font-medium">Elbow</span>
                      <span className="text-xs text-gray-500">ASTM A234 WPB</span>
                    </div>
                    <div className="flex justify-between items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                      <span className="text-sm font-medium">Tee</span>
                      <span className="text-xs text-gray-500">ASTM A234 WPB</span>
                    </div>
                    <div className="flex justify-between items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                      <span className="text-sm font-medium">Reducer</span>
                      <span className="text-xs text-gray-500">ASTM A234 WPB</span>
                    </div>
                    <div className="flex justify-between items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                      <span className="text-sm font-medium">Valve - Gate</span>
                      <span className="text-xs text-gray-500">API 600, A216 WCB</span>
                    </div>
                    <div className="flex justify-between items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                      <span className="text-sm font-medium">Valve - Globe</span>
                      <span className="text-xs text-gray-500">API 623, A216 WCB</span>
                    </div>
                    <div className="flex justify-between items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                      <span className="text-sm font-medium">Valve - Check</span>
                      <span className="text-xs text-gray-500">API 594, A216 WCB</span>
                    </div>
                    <div className="flex justify-between items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                      <span className="text-sm font-medium">Gasket</span>
                      <span className="text-xs text-gray-500">Spiral Wound, 316L/Graphite</span>
                    </div>
                    <div className="flex justify-between items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                      <span className="text-sm font-medium">Bolting</span>
                      <span className="text-xs text-gray-500">ASTM A193 B7 / A194 2H</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full mt-2" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Component
                  </Button>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Export Specification
                  </Button>
                  <Button size="sm">
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PipingDesignInterface;
