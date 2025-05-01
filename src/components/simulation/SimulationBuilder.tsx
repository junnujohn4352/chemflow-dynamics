
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Save, ArrowLeft, ArrowRight, Trash2, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EquipmentType } from "@/components/ui/equipment/EquipmentIcons";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EquipmentCard } from "@/components/ui/equipment/EquipmentCard";
import EquipmentSelector from "./EquipmentSelector";

interface SimulationBuilderProps {
  selectedComponents: string[];
  thermodynamicModel: string;
  onRunSimulation: () => void;
}

interface EquipmentItem {
  id: string;
  type: EquipmentType;
  name: string;
  position: { x: number; y: number };
  status: "stopped" | "running";
  metrics?: {
    temperature?: number;
    pressure?: number;
    flow?: number;
    level?: number;
    conversion?: number;
    power?: number;
    efficiency?: number;
    duty?: number;
  };
}

interface Connection {
  id: string;
  from: string;
  to: string;
  fromPosition: { x: number; y: number };
  toPosition: { x: number; y: number };
}

const SimulationBuilder: React.FC<SimulationBuilderProps> = ({
  selectedComponents,
  thermodynamicModel,
  onRunSimulation
}) => {
  const { toast } = useToast();
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [isAddEquipmentOpen, setIsAddEquipmentOpen] = useState(false);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [activeTab, setActiveTab] = useState<"flowsheet" | "connections" | "properties">("flowsheet");
  const [isDragging, setIsDragging] = useState(false);
  const [draggedEquipmentId, setDraggedEquipmentId] = useState<string | null>(null);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  // Counter for generating unique IDs
  const equipmentCounter = useRef(1);
  const connectionCounter = useRef(1);
  
  const handleAddEquipment = (type: EquipmentType) => {
    const newEquipment: EquipmentItem = {
      id: `equip-${equipmentCounter.current}`,
      type,
      name: getDefaultName(type, equipmentCounter.current),
      position: { x: 100, y: 100 },
      status: "stopped",
      metrics: generateRandomMetrics(type)
    };
    
    equipmentCounter.current += 1;
    setEquipment([...equipment, newEquipment]);
    setIsAddEquipmentOpen(false);
    
    toast({
      title: "Equipment Added",
      description: `${newEquipment.name} has been added to the flowsheet.`
    });
  };
  
  const handleRemoveEquipment = (id: string) => {
    setEquipment(equipment.filter(e => e.id !== id));
    setConnections(connections.filter(c => c.from !== id && c.to !== id));
    
    toast({
      title: "Equipment Removed",
      description: "The equipment has been removed from the flowsheet."
    });
  };
  
  const getDefaultName = (type: EquipmentType, counter: number): string => {
    const typeMap: Record<string, string> = {
      "cstr": "CSTR",
      "pfr": "PFR",
      "batch-reactor": "Batch Reactor",
      "fluidized-bed": "Fluidized Bed",
      "distillation": "Distillation Column",
      "heat-exchanger": "Heat Exchanger",
      "shell-tube-heat-exchanger": "Shell & Tube HX",
      "pump": "Pump",
      "valve": "Valve",
      "tank": "Tank",
      "flash": "Flash Drum",
      "mixer": "Mixer",
    };
    
    return `${typeMap[type] || type.charAt(0).toUpperCase() + type.slice(1).replace(/-/g, ' ')} ${counter}`;
  };
  
  const generateRandomMetrics = (type: EquipmentType) => {
    const metrics: EquipmentItem["metrics"] = {};
    
    // Add some random metrics based on equipment type
    if (["cstr", "pfr", "batch-reactor", "fluidized-bed", "fixed-bed", "catalytic"].includes(type)) {
      metrics.temperature = Math.floor(Math.random() * 300) + 50; // 50-350°C
      metrics.pressure = Math.floor(Math.random() * 20) + 1; // 1-21 kPa
      metrics.conversion = Math.floor(Math.random() * 30) + 70; // 70-100%
    }
    
    if (["heat-exchanger", "shell-tube-heat-exchanger", "plate", "heater", "cooler", "reboiler", "condenser"].includes(type)) {
      metrics.temperature = Math.floor(Math.random() * 200) + 30; // 30-230°C
      metrics.duty = Math.floor(Math.random() * 1000) + 100; // 100-1100 kW
    }
    
    if (["pump", "compressor", "turbine"].includes(type)) {
      metrics.power = Math.floor(Math.random() * 500) + 50; // 50-550 kW
      metrics.efficiency = Math.floor(Math.random() * 20) + 75; // 75-95%
    }
    
    if (["valve", "tee", "divider", "mixer"].includes(type)) {
      metrics.flow = Math.floor(Math.random() * 100) + 10; // 10-110 m³/h
      metrics.pressure = Math.floor(Math.random() * 10) + 1; // 1-11 kPa
    }
    
    if (["tank", "drum", "container"].includes(type)) {
      metrics.level = Math.floor(Math.random() * 80) + 20; // 20-100%
      metrics.pressure = Math.floor(Math.random() * 5) + 1; // 1-6 kPa
    }
    
    if (["distillation", "absorption-tower", "stripper", "column"].includes(type)) {
      metrics.temperature = Math.floor(Math.random() * 150) + 50; // 50-200°C
      metrics.pressure = Math.floor(Math.random() * 15) + 1; // 1-16 kPa
    }
    
    return metrics;
  };

  const handleMouseDown = (e: React.MouseEvent, equipmentId: string) => {
    if (e.button !== 0) return; // Only left mouse button
    
    if (connectingFrom) {
      // We're creating a connection
      if (connectingFrom !== equipmentId) {
        const fromEquipment = equipment.find(eq => eq.id === connectingFrom);
        const toEquipment = equipment.find(eq => eq.id === equipmentId);
        
        if (fromEquipment && toEquipment) {
          const newConnection: Connection = {
            id: `conn-${connectionCounter.current}`,
            from: fromEquipment.id,
            to: toEquipment.id,
            fromPosition: { ...fromEquipment.position },
            toPosition: { ...toEquipment.position }
          };
          
          connectionCounter.current += 1;
          setConnections([...connections, newConnection]);
          
          toast({
            title: "Connection Created",
            description: `Connected ${fromEquipment.name} to ${toEquipment.name}`
          });
        }
      }
      
      setConnectingFrom(null);
    } else {
      // We're starting to drag
      setIsDragging(true);
      setDraggedEquipmentId(equipmentId);
    }
    
    e.stopPropagation();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && draggedEquipmentId && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setEquipment(prevEquipment => 
        prevEquipment.map(item => 
          item.id === draggedEquipmentId 
            ? { ...item, position: { x, y } } 
            : item
        )
      );
      
      // Update connections
      setConnections(prevConnections => 
        prevConnections.map(conn => {
          if (conn.from === draggedEquipmentId) {
            return { ...conn, fromPosition: { x, y } };
          } else if (conn.to === draggedEquipmentId) {
            return { ...conn, toPosition: { x, y } };
          }
          return conn;
        })
      );
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedEquipmentId(null);
  };

  const handleCanvasClick = () => {
    if (connectingFrom) {
      setConnectingFrom(null);
    }
  };

  const startConnection = (e: React.MouseEvent, equipmentId: string) => {
    e.stopPropagation();
    setConnectingFrom(equipmentId);
    toast({
      title: "Creating Connection",
      description: "Click on another equipment to connect"
    });
  };

  const handleMetricsChange = (equipmentId: string, updatedMetrics: any) => {
    setEquipment(prevEquipment => 
      prevEquipment.map(item => 
        item.id === equipmentId 
          ? { ...item, metrics: updatedMetrics } 
          : item
      )
    );
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setConnectingFrom(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div>
      <Tabs defaultValue="flowsheet" value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="mb-6">
        <TabsList>
          <TabsTrigger value="flowsheet">Flowsheet</TabsTrigger>
          <TabsTrigger value="connections">Connections</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
        </TabsList>
        
        <TabsContent value="flowsheet" className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-medium">Process Flowsheet</h3>
              <p className="text-sm text-gray-600">Add equipment and connect them to build your process</p>
            </div>
            <Dialog open={isAddEquipmentOpen} onOpenChange={setIsAddEquipmentOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  Add Equipment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Add Equipment</DialogTitle>
                </DialogHeader>
                <EquipmentSelector onSelectEquipment={handleAddEquipment} />
              </DialogContent>
            </Dialog>
          </div>
          
          <div 
            ref={canvasRef}
            className="bg-gray-50 border rounded-lg p-4 min-h-[600px] h-[calc(100vh-300px)] relative overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={handleCanvasClick}
          >
            {equipment.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                <div className="mb-4">
                  <svg className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <p className="mb-2 text-lg font-medium">No equipment added yet</p>
                <p className="mb-4 max-w-md">Click the "Add Equipment" button to start building your flowsheet</p>
                <Button onClick={() => setIsAddEquipmentOpen(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Equipment
                </Button>
              </div>
            ) : (
              <>
                {/* Draw connections */}
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                  {connections.map((connection) => (
                    <g key={connection.id}>
                      <line
                        x1={connection.fromPosition.x + 30} // Offset to center of card
                        y1={connection.fromPosition.y + 30}
                        x2={connection.toPosition.x + 30}
                        y2={connection.toPosition.y + 30}
                        stroke="#000"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                      />
                      {/* Arrow head */}
                      <polygon 
                        points={`${connection.toPosition.x + 25},${connection.toPosition.y + 30} ${connection.toPosition.x + 35},${connection.toPosition.y + 25} ${connection.toPosition.x + 35},${connection.toPosition.y + 35}`} 
                        fill="#000" 
                        transform={`rotate(${Math.atan2(connection.toPosition.y - connection.fromPosition.y, connection.toPosition.x - connection.fromPosition.x) * 180 / Math.PI}, ${connection.toPosition.x + 30}, ${connection.toPosition.y + 30})`}
                      />
                    </g>
                  ))}
                  {connectingFrom && (
                    <line
                      x1={equipment.find(e => e.id === connectingFrom)?.position.x || 0 + 30}
                      y1={equipment.find(e => e.id === connectingFrom)?.position.y || 0 + 30}
                      x2={isDragging ? equipment.find(e => e.id === draggedEquipmentId)?.position.x || 0 + 30 : 0}
                      y2={isDragging ? equipment.find(e => e.id === draggedEquipmentId)?.position.y || 0 + 30 : 0}
                      stroke="red"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                    />
                  )}
                </svg>

                {/* Equipment */}
                {equipment.map((item) => (
                  <div
                    key={item.id}
                    className="absolute"
                    style={{
                      left: `${item.position.x}px`,
                      top: `${item.position.y}px`,
                      width: '200px',
                      zIndex: draggedEquipmentId === item.id ? 10 : 1,
                      cursor: isDragging && draggedEquipmentId === item.id ? 'grabbing' : 'grab',
                    }}
                    onMouseDown={(e) => handleMouseDown(e, item.id)}
                  >
                    <div className="mb-1 flex justify-between items-center">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-6 w-6 bg-white"
                        onClick={() => handleRemoveEquipment(item.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className={`h-6 w-6 bg-white ${connectingFrom === item.id ? 'bg-blue-100' : ''}`}
                        onClick={(e) => startConnection(e, item.id)}
                      >
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                    <EquipmentCard
                      type={item.type}
                      name={item.name}
                      status={item.status}
                      metrics={item.metrics}
                      onMetricsChange={(metrics) => handleMetricsChange(item.id, metrics)}
                    />
                  </div>
                ))}
              </>
            )}
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button onClick={onRunSimulation} className="flex items-center">
              <Play className="h-4 w-4 mr-1" />
              Run Simulation
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="connections" className="mt-4">
          <div className="bg-gray-50 border rounded-lg p-4 min-h-[400px]">
            {equipment.length < 2 ? (
              <div className="flex flex-col items-center justify-center h-[400px] text-center text-gray-500">
                <p>You need at least two pieces of equipment to create connections</p>
              </div>
            ) : (
              <div>
                <h3 className="font-medium mb-4">Stream Connections</h3>
                {connections.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No connections created yet.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {connections.map((connection, idx) => {
                      const fromEquip = equipment.find(e => e.id === connection.from);
                      const toEquip = equipment.find(e => e.id === connection.to);
                      return (
                        <div key={idx} className="flex items-center gap-2 p-2 border rounded bg-white">
                          <div>{fromEquip?.name || "Unknown"}</div>
                          <ArrowRight className="h-4 w-4" />
                          <div>{toEquip?.name || "Unknown"}</div>
                          <Button variant="ghost" size="icon" className="ml-auto h-7 w-7" onClick={() => {
                            setConnections(connections.filter((_, i) => i !== idx));
                          }}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
                
                <div className="p-4 border rounded bg-white mt-6">
                  <h4 className="text-sm font-medium mb-2">Quick Connect</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {equipment.length >= 2 && (
                      <Button variant="outline" onClick={() => {
                        if (equipment.length >= 2) {
                          const fromEquip = equipment[0];
                          const toEquip = equipment[1];
                          const newConnection: Connection = {
                            id: `conn-${connectionCounter.current}`,
                            from: fromEquip.id,
                            to: toEquip.id,
                            fromPosition: { ...fromEquip.position },
                            toPosition: { ...toEquip.position }
                          };
                          connectionCounter.current += 1;
                          setConnections([...connections, newConnection]);
                          toast({
                            title: "Connection Added",
                            description: `Connected ${fromEquip.name} to ${toEquip.name}`
                          });
                        }
                      }}>
                        Connect First Two Equipment
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="properties" className="mt-4">
          <div className="bg-gray-50 border rounded-lg p-4 min-h-[400px]">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Simulation Properties</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-md border">
                    <h4 className="text-sm font-medium mb-2">Components</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedComponents.map(component => (
                        <div key={component} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {component}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-md border">
                    <h4 className="text-sm font-medium mb-2">Thermodynamic Model</h4>
                    <div className="text-gray-700">{thermodynamicModel}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Equipment Summary</h3>
                <div className="bg-white p-4 rounded-md border">
                  {equipment.length === 0 ? (
                    <p className="text-gray-500">No equipment added yet</p>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Equipment Count: {equipment.length}</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {Object.entries(equipment.reduce((acc, curr) => {
                            const key = curr.type;
                            acc[key] = (acc[key] || 0) + 1;
                            return acc;
                          }, {} as Record<string, number>)).map(([type, count]) => (
                            <li key={type} className="text-sm">
                              {type.charAt(0).toUpperCase() + type.slice(1).replace(/-/g, ' ')}: {count}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Connections: {connections.length}</h4>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SimulationBuilder;
