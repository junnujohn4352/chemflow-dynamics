
import React, { useState, useRef, useEffect } from "react";
import { Plus, Thermometer, Droplets, Settings2, Container, FlaskConical, Columns, Gauge, Save, Trash2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface SimulationBuilderProps {
  selectedComponents: string[];
  thermodynamicModel: string;
  onRunSimulation: () => void;
}

type Equipment = {
  id: string;
  type: string;
  name: string;
  position: { x: number; y: number };
  connections: string[];
  settings: Record<string, any>;
};

type Stream = {
  id: string;
  from: string;
  to: string;
  type: "material" | "energy" | "signal";
  properties: Record<string, any>;
};

const SimulationBuilder: React.FC<SimulationBuilderProps> = ({ 
  selectedComponents,
  thermodynamicModel,
  onRunSimulation
}) => {
  const { toast } = useToast();
  const [activeEquipment, setActiveEquipment] = useState<string | null>(null);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  
  const equipmentList = [
    { id: "feed", name: "Feed Stream", icon: <Droplets className="h-5 w-5" /> },
    { id: "mixer", name: "Mixer", icon: <Columns className="h-5 w-5" /> },
    { id: "splitter", name: "Splitter", icon: <Columns className="h-5 w-5 rotate-90" /> },
    { id: "heater", name: "Heater", icon: <Thermometer className="h-5 w-5" /> },
    { id: "cooler", name: "Cooler", icon: <Thermometer className="h-5 w-5" /> },
    { id: "flash", name: "Flash Separator", icon: <Container className="h-5 w-5" /> },
    { id: "column", name: "Distillation Column", icon: <FlaskConical className="h-5 w-5" /> },
    { id: "pump", name: "Pump", icon: <Gauge className="h-5 w-5" /> },
    { id: "reactor", name: "Reactor", icon: <FlaskConical className="h-5 w-5" /> },
  ];
  
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current || !activeEquipment) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Add new equipment
    const activeEquipmentInfo = equipmentList.find(item => item.id === activeEquipment);
    if (activeEquipmentInfo) {
      const newEquipment: Equipment = {
        id: `${activeEquipment}-${Date.now()}`,
        type: activeEquipment,
        name: activeEquipmentInfo.name,
        position: { x, y },
        connections: [],
        settings: {}
      };
      
      setEquipment(prev => [...prev, newEquipment]);
      toast({
        title: "Equipment Added",
        description: `${activeEquipmentInfo.name} has been added to the flowsheet`
      });
      
      // Reset active equipment after placing
      setActiveEquipment(null);
    }
  };
  
  const handleEquipmentClick = (e: React.MouseEvent, equipmentId: string) => {
    e.stopPropagation();
    
    if (isConnecting) {
      // Complete a connection
      if (isConnecting !== equipmentId) {
        const newStream: Stream = {
          id: `stream-${Date.now()}`,
          from: isConnecting,
          to: equipmentId,
          type: "material",
          properties: {}
        };
        
        setStreams(prev => [...prev, newStream]);
        
        // Update the connections array for both equipment
        setEquipment(prev => 
          prev.map(eq => {
            if (eq.id === isConnecting) {
              return {...eq, connections: [...eq.connections, equipmentId]};
            }
            if (eq.id === equipmentId) {
              return {...eq, connections: [...eq.connections, isConnecting]};
            }
            return eq;
          })
        );
        
        setIsConnecting(null);
        toast({
          title: "Connection Created",
          description: "Stream has been added between the equipment"
        });
      }
    } else {
      // Select equipment
      setSelectedElement(equipmentId);
    }
  };
  
  const startConnection = (e: React.MouseEvent, equipmentId: string) => {
    e.stopPropagation();
    setIsConnecting(equipmentId);
    toast({
      description: "Click on another equipment to create a connection"
    });
  };
  
  const deleteSelected = () => {
    if (!selectedElement) return;
    
    // Remove the selected equipment
    setEquipment(prev => prev.filter(eq => eq.id !== selectedElement));
    
    // Remove any streams connected to this equipment
    setStreams(prev => prev.filter(
      stream => stream.from !== selectedElement && stream.to !== selectedElement
    ));
    
    setSelectedElement(null);
    toast({
      title: "Deleted",
      description: "Equipment has been removed from the flowsheet"
    });
  };
  
  const clearCanvas = () => {
    setEquipment([]);
    setStreams([]);
    setSelectedElement(null);
    setIsConnecting(null);
    toast({
      title: "Canvas Cleared",
      description: "All equipment and connections have been removed"
    });
  };
  
  const saveFlowsheet = () => {
    // In a real app, you would save to backend here
    toast({
      title: "Flowsheet Saved",
      description: "Your process design has been saved successfully"
    });
  };
  
  const runSimulation = () => {
    if (equipment.length === 0) {
      toast({
        title: "Cannot Run",
        description: "Please add equipment to the flowsheet first",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedComponents.length === 0) {
      toast({
        title: "Components Required",
        description: "Please select chemical components before running",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Running Simulation",
      description: "Calculating process flows and conditions..."
    });
    
    // Call the parent callback to run simulation
    onRunSimulation();
  };
  
  const renderEquipment = (item: Equipment) => {
    const equipmentType = equipmentList.find(e => e.id === item.type);
    const isSelected = selectedElement === item.id;
    const isConnectingThis = isConnecting === item.id;
    
    return (
      <div 
        key={item.id}
        className={`absolute cursor-pointer p-3 rounded-lg shadow-md bg-white border ${
          isSelected ? 'border-flow-blue ring-2 ring-flow-blue/20' : 
          isConnectingThis ? 'border-green-500 ring-2 ring-green-500/20' : 
          'border-gray-200'
        }`}
        style={{ 
          left: `${item.position.x}px`, 
          top: `${item.position.y}px`,
          transform: 'translate(-50%, -50%)',
          zIndex: isSelected ? 10 : 1
        }}
        onClick={(e) => handleEquipmentClick(e, item.id)}
      >
        <div className="flex flex-col items-center">
          <div className="p-2 rounded-full bg-blue-50 text-flow-blue">
            {equipmentType?.icon || <FlaskConical className="h-5 w-5" />}
          </div>
          <span className="text-xs mt-1 whitespace-nowrap">{item.name}</span>
          {isSelected && (
            <div className="absolute -top-2 -right-2 flex space-x-1">
              <button 
                className="p-1 rounded-full bg-blue-500 text-white hover:bg-blue-600"
                onClick={(e) => {
                  e.stopPropagation();
                  startConnection(e, item.id);
                }}
              >
                <Plus className="h-3 w-3" />
              </button>
              <button 
                className="p-1 rounded-full bg-red-500 text-white hover:bg-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSelected();
                }}
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  const renderStream = (stream: Stream) => {
    const fromEquipment = equipment.find(eq => eq.id === stream.from);
    const toEquipment = equipment.find(eq => eq.id === stream.to);
    
    if (!fromEquipment || !toEquipment) return null;
    
    const startX = fromEquipment.position.x;
    const startY = fromEquipment.position.y;
    const endX = toEquipment.position.x;
    const endY = toEquipment.position.y;
    
    // Calculate line length for arrow placement
    const lineLength = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    
    // Calculate direction vector
    const dirX = (endX - startX) / lineLength;
    const dirY = (endY - startY) / lineLength;
    
    // Calculate arrow points (80% along the line)
    const arrowX = startX + dirX * lineLength * 0.8;
    const arrowY = startY + dirY * lineLength * 0.8;
    
    return (
      <svg 
        key={stream.id} 
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <line
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke="#3B82F6"
          strokeWidth="2"
          strokeDasharray={stream.type === "energy" ? "5,5" : ""}
        />
        {/* Arrow head */}
        <polygon 
          points={`${arrowX},${arrowY} ${arrowX-5*dirY-5*dirX},${arrowY+5*dirX-5*dirY} ${arrowX+5*dirY-5*dirX},${arrowY-5*dirX-5*dirY}`}
          fill="#3B82F6"
        />
      </svg>
    );
  };
  
  return (
    <div className="flex flex-col">
      <h2 className="text-xl font-medium mb-4">Flowsheet Builder</h2>
      <p className="text-gray-600 mb-6">
        Design your process flowsheet by adding unit operations and connecting streams.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Equipment palette */}
        <div className="col-span-1">
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
            <h3 className="font-medium mb-3">Equipment</h3>
            <div className="space-y-2">
              {equipmentList.map((equipment) => (
                <div
                  key={equipment.id}
                  className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors ${
                    activeEquipment === equipment.id
                      ? "bg-flow-blue/10 text-flow-blue"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveEquipment(equipment.id)}
                >
                  <div className="p-1.5 rounded bg-white mr-3 shadow-sm">
                    {equipment.icon}
                  </div>
                  <span className="text-sm">{equipment.name}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 border-t border-gray-200 pt-4">
              <h3 className="font-medium mb-3">Simulation Info</h3>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Components:</span>
                  <span className="font-medium">{selectedComponents.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Package:</span>
                  <span className="font-medium">{thermodynamicModel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Units:</span>
                  <span className="font-medium">SI</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 space-y-2">
              <Button 
                variant="default" 
                className="w-full"
                onClick={runSimulation}
              >
                Run Simulation
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={saveFlowsheet}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Flowsheet
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={clearCanvas}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All
              </Button>
            </div>
          </div>
        </div>
        
        {/* Flowsheet canvas */}
        <div className="col-span-1 md:col-span-3">
          <div className="bg-white rounded-lg border border-gray-200 h-[500px] flex flex-col relative">
            {/* Canvas toolbar */}
            <div className="p-3 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <button 
                  className="p-1.5 rounded hover:bg-gray-100 transition-colors"
                  onClick={() => setZoom(prev => Math.min(prev + 10, 200))}
                >
                  <Plus className="h-4 w-4 text-gray-600" />
                </button>
                <div className="text-gray-600 text-sm">Zoom: {zoom}%</div>
              </div>
              <button 
                className="p-1.5 rounded hover:bg-gray-100 transition-colors"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings2 className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            
            {/* Canvas with equipment and streams */}
            <div 
              ref={canvasRef}
              className="flex-1 relative overflow-hidden"
              onClick={handleCanvasClick}
              style={{ 
                cursor: activeEquipment ? 'crosshair' : 'default',
                transform: `scale(${zoom/100})`,
                transformOrigin: 'center center'
              }}
            >
              {equipment.length === 0 && !activeEquipment && (
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <div className="text-center max-w-md">
                    <div className="flex justify-center mb-4">
                      <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                        <Plus className="h-8 w-8 text-gray-400" />
                      </div>
                    </div>
                    <h3 className="text-lg font-medium mb-2">Start Building Your Flowsheet</h3>
                    <p className="text-gray-500 mb-4">
                      Select equipment from the palette and click on the canvas to place it. 
                      Connect equipment with streams to complete your process flow.
                    </p>
                  </div>
                </div>
              )}
              
              {isConnecting && (
                <div className="absolute top-4 right-4 bg-amber-50 text-amber-800 p-3 rounded-lg shadow-sm">
                  <div className="flex items-center">
                    <span>Creating connection... Click on target equipment</span>
                    <button 
                      className="ml-2 p-1 rounded-full hover:bg-amber-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsConnecting(null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
              
              {activeEquipment && (
                <div className="absolute top-4 right-4 bg-blue-50 text-blue-800 p-3 rounded-lg shadow-sm">
                  <div className="flex items-center">
                    <span>Click on the canvas to place {equipmentList.find(e => e.id === activeEquipment)?.name}</span>
                    <button 
                      className="ml-2 p-1 rounded-full hover:bg-blue-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveEquipment(null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
              
              {/* Render equipment and streams */}
              {streams.map(renderStream)}
              {equipment.map(renderEquipment)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationBuilder;
