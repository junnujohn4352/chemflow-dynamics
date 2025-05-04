
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import EquipmentCard from '@/components/ui/equipment/EquipmentCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Thermometer, Beaker, Droplets, Activity, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { EquipmentType } from '@/components/ui/equipment/EquipmentIcons';
import ProcessFlow from '@/components/ui/ProcessFlow';
import EquipmentSelector from './EquipmentSelector';

interface SimulationBuilderProps {
  selectedComponents: string[];
  thermodynamicModel: string;
  onRunSimulation?: () => void;
}

interface CanvasEquipment {
  id: string;
  type: EquipmentType;
  title: string;
  position: { x: number; y: number };
  metrics: { key: string; value: string }[];
}

interface Connection {
  id: string;
  source: string;
  target: string;
  sourcePoint: string;
  targetPoint: string;
}

export const SimulationBuilder: React.FC<SimulationBuilderProps> = ({
  selectedComponents,
  thermodynamicModel,
  onRunSimulation
}) => {
  const { toast } = useToast();
  const [equipmentMetrics, setEquipmentMetrics] = useState([
    { key: "Temperature", value: "85°C" },
    { key: "Pressure", value: "150 kPa" },
    { key: "Flow", value: "1200 kg/h" }
  ]);
  
  const [processType, setProcessType] = useState("distillation");
  const [operatingTemp, setOperatingTemp] = useState("85");
  const [operatingPressure, setOperatingPressure] = useState("150");
  const [feedFlowRate, setFeedFlowRate] = useState("1200");
  const [canvasEquipment, setCanvasEquipment] = useState<CanvasEquipment[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
  const [isDrawingConnection, setIsDrawingConnection] = useState(false);
  const [connectionStart, setConnectionStart] = useState<{equipmentId: string, point: string} | null>(null);
  const [processSteps, setProcessSteps] = useState<string[]>([
    "Define simulation objectives",
    "Develop process flowsheet", 
    "Input thermodynamic and property data", 
    "Specify operating conditions", 
    "Solve simulation model", 
    "Analyze results"
  ]);
  
  const libraryEquipment = [
    { type: "reactor" as EquipmentType, title: "CSTR Reactor" },
    { type: "column" as EquipmentType, title: "Distillation" },
    { type: "heat-exchanger" as EquipmentType, title: "Heat Exchanger" },
    { type: "pump" as EquipmentType, title: "Centrifugal Pump" },
    { type: "flash" as EquipmentType, title: "Flash Drum" },
    { type: "compressor" as EquipmentType, title: "Compressor" },
    { type: "valve" as EquipmentType, title: "Control Valve" },
    { type: "mixer" as EquipmentType, title: "Mixer" },
    { type: "tank" as EquipmentType, title: "Storage Tank" },
    { type: "cooler" as EquipmentType, title: "Cooler" },
    { type: "heater" as EquipmentType, title: "Heater" },
    { type: "filter" as EquipmentType, title: "Filter" }
  ];

  const handleDragStart = (e: React.DragEvent, type: EquipmentType, title: string) => {
    e.dataTransfer.setData("equipmentType", type);
    e.dataTransfer.setData("equipmentTitle", title);
    e.dataTransfer.effectAllowed = "copy";
  };
  
  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };
  
  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("equipmentType") as EquipmentType;
    const title = e.dataTransfer.getData("equipmentTitle");
    
    if (!type || !title) return;
    
    // Get position relative to the drop target
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newEquipment: CanvasEquipment = {
      id: `equipment-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type,
      title,
      position: { x, y },
      metrics: [...equipmentMetrics]
    };
    
    setCanvasEquipment(prev => [...prev, newEquipment]);
    
    toast({
      title: "Equipment Added",
      description: `${title} added to the process canvas.`,
    });
  };

  const handleEquipmentClick = (id: string) => {
    setSelectedEquipment(prevSelected => prevSelected === id ? null : id);
  };

  const handleRemoveEquipment = (id: string) => {
    // Remove all connections involving this equipment
    setConnections(prev => prev.filter(conn => conn.source !== id && conn.target !== id));
    
    // Remove the equipment itself
    setCanvasEquipment(prev => prev.filter(item => item.id !== id));
    setSelectedEquipment(null);
    
    toast({
      title: "Equipment Removed",
      description: "The selected equipment has been removed.",
    });
  };

  const handleClearCanvas = () => {
    if (canvasEquipment.length === 0) return;
    
    setCanvasEquipment([]);
    setConnections([]);
    setSelectedEquipment(null);
    
    toast({
      title: "Canvas Cleared",
      description: "All equipment has been removed from the process canvas.",
    });
  };
  
  const handleConnectionPointClick = (e: React.MouseEvent, equipmentId: string) => {
    // Only handle clicks on connection points
    if (!(e.target as HTMLElement).dataset.connection) return;
    
    const pointType = (e.target as HTMLElement).dataset.connection as string;
    
    if (!isDrawingConnection) {
      // Start drawing a connection
      setIsDrawingConnection(true);
      setConnectionStart({ equipmentId, point: pointType });
    } else {
      // Finish drawing a connection if not connecting to the same equipment
      if (connectionStart && connectionStart.equipmentId !== equipmentId) {
        const newConnection: Connection = {
          id: `connection-${Date.now()}`,
          source: connectionStart.equipmentId,
          target: equipmentId,
          sourcePoint: connectionStart.point,
          targetPoint: pointType
        };
        
        setConnections(prev => [...prev, newConnection]);
        
        toast({
          title: "Connection Created",
          description: "Equipment connection has been established.",
        });
      }
      
      // Reset connection drawing state
      setIsDrawingConnection(false);
      setConnectionStart(null);
    }
  };
  
  const handleSelectEquipment = (type: EquipmentType) => {
    // Create a new equipment with the selected type
    const title = type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    
    const newEquipment: CanvasEquipment = {
      id: `equipment-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type,
      title,
      position: { x: 200, y: 200 }, // Default position in the middle
      metrics: [...equipmentMetrics]
    };
    
    setCanvasEquipment(prev => [...prev, newEquipment]);
    
    toast({
      title: "Equipment Added",
      description: `${title} added to the process canvas.`,
    });
  };
  
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg col-span-1">
          <h3 className="text-lg font-medium mb-3">Equipment Library</h3>
          <p className="text-sm text-gray-600 mb-2">Drag equipment to the canvas to build your process</p>
          
          <EquipmentSelector onSelectEquipment={handleSelectEquipment} />
          
          <div className="mt-4 grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-2">
            {libraryEquipment.map((equipment, index) => (
              <EquipmentCard 
                key={index}
                type={equipment.type} 
                title={equipment.title}
                onDragStart={handleDragStart}
                metrics={equipmentMetrics}
                status="ready"
                size="sm"
                showConnections={false}
              />
            ))}
          </div>
        </div>
        
        <div 
          className="bg-white border border-dashed border-gray-300 p-4 rounded-lg col-span-2 relative min-h-[500px]"
          onDragOver={handleCanvasDragOver}
          onDrop={handleCanvasDrop}
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium">Process Canvas</h3>
            {canvasEquipment.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-500 border-red-200 hover:bg-red-50"
                onClick={handleClearCanvas}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Clear Canvas
              </Button>
            )}
          </div>
          
          {canvasEquipment.length > 0 ? (
            <div className="relative w-full h-[450px]">
              {/* Draw connections */}
              <svg className="absolute inset-0 pointer-events-none z-0">
                {connections.map(conn => {
                  const source = canvasEquipment.find(e => e.id === conn.source);
                  const target = canvasEquipment.find(e => e.id === conn.target);
                  
                  if (!source || !target) return null;
                  
                  // This is simplified - in a real implementation, you'd calculate exact connector positions
                  // based on the connection points and their positions
                  return (
                    <line 
                      key={conn.id}
                      x1={source.position.x} 
                      y1={source.position.y}
                      x2={target.position.x} 
                      y2={target.position.y}
                      stroke="#6366f1"
                      strokeWidth="2"
                      strokeDasharray="4"
                    />
                  );
                })}
              </svg>
              
              {canvasEquipment.map(equipment => (
                <div 
                  key={equipment.id} 
                  style={{ 
                    position: 'absolute', 
                    left: `${equipment.position.x - 50}px`, 
                    top: `${equipment.position.y - 50}px`,
                    zIndex: selectedEquipment === equipment.id ? 10 : 1
                  }}
                  onClick={(e) => handleConnectionPointClick(e, equipment.id)}
                >
                  <EquipmentCard 
                    type={equipment.type}
                    title={equipment.title}
                    metrics={equipment.metrics}
                    draggable={false}
                    selected={selectedEquipment === equipment.id}
                    onClick={() => handleEquipmentClick(equipment.id)}
                    size="sm"
                    showConnections={true}
                  />
                  {selectedEquipment === equipment.id && (
                    <div className="absolute top-0 right-0 -mt-2 -mr-2">
                      <Button 
                        size="icon" 
                        variant="destructive" 
                        className="h-6 w-6 rounded-full"
                        onClick={() => handleRemoveEquipment(equipment.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[450px] flex items-center justify-center">
              <p className="text-gray-400">Drag equipment here to build your process</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium mb-3">Process Flow Steps</h3>
        <ProcessFlow />
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
