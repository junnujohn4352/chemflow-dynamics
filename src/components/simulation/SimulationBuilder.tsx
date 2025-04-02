
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Plus, Minus, Thermometer, Droplets, Settings2, Container, FlaskConical, Columns, Gauge, Save, Trash2, X, Sliders, Move, ArrowLeft, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import EquipmentSettings from "./EquipmentSettings";
import { useNavigate } from "react-router-dom";

interface SimulationBuilderProps {
  selectedComponents: string[];
  thermodynamicModel: string;
  onRunSimulation: () => void;
}

export interface Equipment {
  id: string;
  type: string;
  name: string;
  position: { x: number; y: number };
  connections: string[];
  settings: Record<string, any>;
  subType?: string;
}

export interface Stream {
  id: string;
  from: string;
  to: string;
  type: "material" | "energy" | "signal";
  properties: Record<string, any>;
}

const safeStringify = (value: any): string => {
  if (value === null || value === undefined) {
    return '';
  }
  
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch (e) {
      return '[Object]';
    }
  }
  
  return String(value);
};

const SimulationBuilder: React.FC<SimulationBuilderProps> = ({ 
  selectedComponents,
  thermodynamicModel,
  onRunSimulation
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeEquipment, setActiveEquipment] = useState<string | null>(null);
  const [activeSubType, setActiveSubType] = useState<string | null>(null);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedEquipment, setDraggedEquipment] = useState<string | null>(null);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [showSubTypes, setShowSubTypes] = useState(false);
  
  useEffect(() => {
    const savedEquipment = localStorage.getItem('chemflow-equipment');
    const savedStreams = localStorage.getItem('chemflow-streams');
    
    if (savedEquipment) {
      try {
        setEquipment(JSON.parse(savedEquipment));
      } catch (e) {
        console.error("Error loading saved equipment:", e);
      }
    }
    
    if (savedStreams) {
      try {
        setStreams(JSON.parse(savedStreams));
      } catch (e) {
        console.error("Error loading saved streams:", e);
      }
    }
  }, []);
  
  const equipmentList = [
    { id: "feed", name: "Feed Stream", icon: <Droplets className="h-5 w-5" /> },
    { 
      id: "reactor", 
      name: "Reactor", 
      icon: <FlaskConical className="h-5 w-5" />,
      subTypes: [
        { id: "cstr", name: "CSTR" },
        { id: "pfr", name: "PFR" },
        { id: "batch", name: "Batch Reactor" },
        { id: "pbr", name: "Packed Bed Reactor" },
        { id: "fbr", name: "Fluidized Bed Reactor" }
      ]
    },
    { 
      id: "column", 
      name: "Distillation Column", 
      icon: <FlaskConical className="h-5 w-5" />,
      subTypes: [
        { id: "tray", name: "Tray Column" },
        { id: "packed", name: "Packed Column" },
        { id: "extractive", name: "Extractive Distillation" },
        { id: "azeotropic", name: "Azeotropic Distillation" }
      ]
    },
    { 
      id: "heater", 
      name: "Heater", 
      icon: <Thermometer className="h-5 w-5" />,
      subTypes: [
        { id: "electric", name: "Electric Heater" },
        { id: "steam", name: "Steam Heater" },
        { id: "combustion", name: "Fired Heater" }
      ]
    },
    { 
      id: "cooler", 
      name: "Cooler", 
      icon: <Thermometer className="h-5 w-5" />,
      subTypes: [
        { id: "water", name: "Water Cooler" },
        { id: "air", name: "Air Cooler" },
        { id: "refrigeration", name: "Refrigeration" }
      ]
    },
    { 
      id: "mixer", 
      name: "Mixer", 
      icon: <Columns className="h-5 w-5" />,
      subTypes: [
        { id: "static", name: "Static Mixer" },
        { id: "dynamic", name: "Dynamic Mixer" },
        { id: "inline", name: "Inline Mixer" }
      ]
    },
    { id: "valve", name: "Valve", icon: <Gauge className="h-5 w-5" /> },
    { id: "pump", name: "Pump", icon: <Gauge className="h-5 w-5" /> },
    { id: "product", name: "Product Stream", icon: <Droplets className="h-5 w-5" /> }
  ];
  
  // Add the missing handler functions
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 50));
  };

  const handleAddEquipment = (type: string, subType?: string) => {
    const id = `${type}-${Date.now()}`;
    const newEquipment: Equipment = {
      id,
      type,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${equipment.filter(e => e.type === type).length + 1}`,
      position: { x: 200, y: 200 },
      connections: [],
      settings: {},
      subType
    };
    
    setEquipment(prev => [...prev, newEquipment]);
    setActiveEquipment(null);
    setActiveSubType(null);
    setShowSubTypes(false);
    
    // Save to localStorage
    localStorage.setItem('chemflow-equipment', JSON.stringify([...equipment, newEquipment]));
    
    toast({
      title: "Equipment added",
      description: `Added ${newEquipment.name} to the flowsheet`
    });
  };

  const handleClearCanvas = () => {
    if (equipment.length === 0 && streams.length === 0) {
      return;
    }
    
    if (confirm("Are you sure you want to clear the canvas? This will remove all equipment and connections.")) {
      setEquipment([]);
      setStreams([]);
      localStorage.removeItem('chemflow-equipment');
      localStorage.removeItem('chemflow-streams');
      
      toast({
        title: "Canvas cleared",
        description: "All equipment and connections have been removed"
      });
    }
  };

  const handleStartSimulation = () => {
    if (equipment.length === 0) {
      toast({
        title: "No equipment",
        description: "Please add equipment to simulate",
        variant: "destructive"
      });
      return;
    }
    
    setSimulationRunning(true);
    
    // Save current state
    localStorage.setItem('chemflow-equipment', JSON.stringify(equipment));
    localStorage.setItem('chemflow-streams', JSON.stringify(streams));
    
    // Call the onRunSimulation prop to start the simulation
    onRunSimulation();
    
    // Simulate some delay for processing
    setTimeout(() => {
      setSimulationRunning(false);
    }, 2000);
  };

  const handleSaveSettings = (updatedEquipment: Equipment) => {
    setEquipment(prev => 
      prev.map(eq => eq.id === updatedEquipment.id ? updatedEquipment : eq)
    );
    
    setShowSettings(false);
    setEditingEquipment(null);
    
    // Save to localStorage
    localStorage.setItem('chemflow-equipment', JSON.stringify(
      equipment.map(eq => eq.id === updatedEquipment.id ? updatedEquipment : eq)
    ));
    
    toast({
      title: "Settings saved",
      description: `Updated settings for ${updatedEquipment.name}`
    });
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (isConnecting) {
      // Cancel connection if clicking on canvas
      setIsConnecting(null);
    } else {
      // Deselect if clicking on canvas
      setSelectedElement(null);
    }
  };

  const handleEquipmentClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    
    if (isConnecting && isConnecting !== id) {
      // Create a new stream
      const newStream: Stream = {
        id: `stream-${Date.now()}`,
        from: isConnecting,
        to: id,
        type: "material",
        properties: {}
      };
      
      setStreams(prev => [...prev, newStream]);
      
      // Update connections for both equipment
      setEquipment(prev => prev.map(eq => {
        if (eq.id === isConnecting || eq.id === id) {
          return {
            ...eq,
            connections: [...eq.connections, newStream.id]
          };
        }
        return eq;
      }));
      
      // Save to localStorage
      localStorage.setItem('chemflow-streams', JSON.stringify([...streams, newStream]));
      
      toast({
        title: "Connection created",
        description: "Equipment connected successfully"
      });
      
      setIsConnecting(null);
    } else {
      setSelectedElement(id);
    }
  };

  const handleStartConnection = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setIsConnecting(id);
  };
  
  const handleEquipmentDragStart = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setIsDragging(true);
    setDraggedEquipment(id);
    
    const eq = equipment.find(item => item.id === id);
    if (eq) {
      setDragStartPos({
        x: e.clientX - eq.position.x,
        y: e.clientY - eq.position.y
      });
    }
  };
  
  const handleEquipmentDragEnd = () => {
    setIsDragging(false);
    setDraggedEquipment(null);
    
    // Save the updated positions to localStorage
    localStorage.setItem('chemflow-equipment', JSON.stringify(equipment));
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && draggedEquipment && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const scale = zoom / 100;
      
      const x = (e.clientX - rect.left) / scale - dragStartPos.x;
      const y = (e.clientY - rect.top) / scale - dragStartPos.y;
      
      setEquipment(prev => prev.map(eq => {
        if (eq.id === draggedEquipment) {
          return {
            ...eq,
            position: { x, y }
          };
        }
        return eq;
      }));
    }
  };
  
  const handleOpenSettings = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const eq = equipment.find(item => item.id === id);
    if (eq) {
      setEditingEquipment(eq);
      setShowSettings(true);
    }
  };
  
  const handleDeleteEquipment = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    
    // Find connected streams
    const connectedStreams = streams.filter(
      stream => stream.from === id || stream.to === id
    );
    
    // Update equipment to remove connections
    setEquipment(prev => 
      prev
        .filter(eq => eq.id !== id)
        .map(eq => ({
          ...eq,
          connections: eq.connections.filter(conn => 
            !connectedStreams.some(stream => stream.id === conn)
          )
        }))
    );
    
    // Remove streams
    setStreams(prev => 
      prev.filter(stream => stream.from !== id && stream.to !== id)
    );
    
    // Save to localStorage
    localStorage.setItem('chemflow-equipment', JSON.stringify(
      equipment
        .filter(eq => eq.id !== id)
        .map(eq => ({
          ...eq,
          connections: eq.connections.filter(conn => 
            !connectedStreams.some(stream => stream.id === conn)
          )
        }))
    ));
    
    localStorage.setItem('chemflow-streams', JSON.stringify(
      streams.filter(stream => stream.from !== id && stream.to !== id)
    ));
    
    toast({
      title: "Equipment deleted",
      description: "Equipment and all connections removed"
    });
  };

  const renderEquipmentCard = (eq: Equipment) => {
    const isSelected = selectedElement === eq.id;
    const isSource = isConnecting === eq.id;
    
    // Get the equipment type data
    const equipmentType = equipmentList.find(e => e.id === eq.type);
    
    return (
      <div 
        key={eq.id}
        className={`absolute p-2 rounded-lg shadow-md bg-white border-2 transition-all ${
          isSelected 
            ? 'border-flow-blue' 
            : isSource 
              ? 'border-amber-500' 
              : 'border-gray-200'
        }`}
        style={{
          left: `${eq.position.x}px`,
          top: `${eq.position.y}px`,
          zIndex: isSelected ? 10 : 1,
          cursor: isDragging && draggedEquipment === eq.id ? 'grabbing' : 'grab'
        }}
        onClick={(e) => handleEquipmentClick(e, eq.id)}
      >
        <div 
          className="w-20 h-20 flex flex-col items-center justify-center gap-1 relative"
          onMouseDown={(e) => handleEquipmentDragStart(e, eq.id)}
          onMouseUp={handleEquipmentDragEnd}
        >
          {equipmentType?.icon || <Container className="h-8 w-8 text-gray-500" />}
          <span className="text-xs text-center font-medium">{eq.name}</span>
          {eq.subType && (
            <span className="text-xs text-gray-500">{
              equipmentType?.subTypes?.find(sub => sub.id === eq.subType)?.name || eq.subType
            }</span>
          )}
          
          {isSelected && (
            <div className="absolute -top-1 -right-1 flex gap-1">
              <button 
                className="p-1 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-600"
                onClick={(e) => handleStartConnection(e, eq.id)}
                title="Connect to another equipment"
              >
                <Play className="h-3 w-3" />
              </button>
              <button 
                className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
                onClick={(e) => handleOpenSettings(e, eq.id)}
                title="Equipment settings"
              >
                <Settings2 className="h-3 w-3" />
              </button>
              <button 
                className="p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-600"
                onClick={(e) => handleDeleteEquipment(e, eq.id)}
                title="Delete equipment"
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
    const sourceEq = equipment.find(eq => eq.id === stream.from);
    const targetEq = equipment.find(eq => eq.id === stream.to);
    
    if (!sourceEq || !targetEq) {
      return null;
    }
    
    // Calculate the center points of each equipment
    const sourceX = sourceEq.position.x + 10;
    const sourceY = sourceEq.position.y + 10;
    const targetX = targetEq.position.x + 10;
    const targetY = targetEq.position.y + 10;
    
    // Calculate the angle and draw the arrow
    const dx = targetX - sourceX;
    const dy = targetY - sourceY;
    const angle = Math.atan2(dy, dx);
    
    // Get the stream color based on type
    let streamColor = "stroke-blue-500";
    if (stream.type === "energy") {
      streamColor = "stroke-red-500";
    } else if (stream.type === "signal") {
      streamColor = "stroke-green-500";
    }
    
    return (
      <svg 
        key={stream.id}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <defs>
          <marker 
            id={`arrowhead-${stream.id}`}
            markerWidth="10"
            markerHeight="7"
            refX="0"
            refY="3.5"
            orient="auto"
          >
            <polygon 
              points="0 0, 10 3.5, 0 7" 
              className={streamColor.replace('stroke-', 'fill-')} 
            />
          </marker>
        </defs>
        <line
          x1={sourceX + 10}
          y1={sourceY + 10}
          x2={targetX + 10}
          y2={targetY + 10}
          className={`${streamColor} stroke-2`}
          markerEnd={`url(#arrowhead-${stream.id})`}
        />
      </svg>
    );
  };

  return (
    <div className="flex flex-col">
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Flowsheet Builder</h3>
        <p className="text-gray-600 text-sm">
          Build your process flowsheet by adding and connecting equipment from the palette below.
        </p>
      </div>
      
      <div className="p-4 border rounded-lg bg-gray-50 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium">Equipment Palette</h4>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleZoomIn}
              className="p-1.5 rounded-lg bg-white text-gray-500 border hover:bg-gray-50"
            >
              <Plus className="h-4 w-4" />
            </button>
            <span className="text-sm">{zoom}%</span>
            <button 
              onClick={handleZoomOut}
              className="p-1.5 rounded-lg bg-white text-gray-500 border hover:bg-gray-50"
            >
              <Minus className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {equipmentList.map((item) => (
            <React.Fragment key={item.id}>
              <button
                onClick={() => {
                  if (item.subTypes && item.subTypes.length > 0) {
                    setActiveEquipment(item.id);
                    setShowSubTypes(!showSubTypes);
                  } else {
                    handleAddEquipment(item.id);
                  }
                }}
                className={`p-2 rounded-lg ${
                  activeEquipment === item.id ? 'bg-flow-blue/10 text-flow-blue' : 'bg-white text-gray-600 hover:bg-gray-50'
                } flex items-center gap-2 border transition-colors`}
              >
                <span>{item.icon}</span>
                <span className="text-sm font-medium">{item.name}</span>
              </button>
              
              {activeEquipment === item.id && showSubTypes && item.subTypes && (
                <div className="w-full mt-2 mb-1 ml-4 pl-4 border-l-2 border-flow-blue/20">
                  <div className="flex flex-wrap gap-2">
                    {item.subTypes.map(subType => (
                      <button
                        key={subType.id}
                        onClick={() => {
                          handleAddEquipment(item.id, subType.id);
                        }}
                        className={`px-3 py-1.5 rounded-lg ${
                          activeSubType === subType.id 
                            ? 'bg-flow-blue/10 text-flow-blue' 
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                        } text-xs border transition-colors`}
                      >
                        {subType.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      <div className="flex-1 relative overflow-hidden">
        <div className="bg-white border rounded-lg p-1 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={handleClearCanvas}
              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
              title="Clear canvas"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setZoom(100)}
              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
              title="Reset zoom"
            >
              <Settings2 className="h-4 w-4" />
            </button>
          </div>
          
          <div className="text-xs text-gray-500">
            {equipment.length} equipment · {streams.length} streams
          </div>
          
          <button
            onClick={handleStartSimulation}
            className="px-3 py-1.5 rounded-lg bg-green-500 text-white hover:bg-green-600 text-xs font-medium flex items-center gap-1"
            disabled={simulationRunning}
          >
            {simulationRunning ? (
              <>Running...</>
            ) : (
              <>
                <Play className="h-3 w-3" />
                Run Simulation
              </>
            )}
          </button>
        </div>
        
        <div 
          ref={canvasRef}
          className="relative border rounded-lg h-[800px] overflow-auto bg-gray-50"
          style={{ 
            transform: `scale(${zoom / 100})`, 
            transformOrigin: 'top left',
            minWidth: '1200px',
            width: '100%'
          }}
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
        >
          <div className="absolute inset-0 w-full h-full" 
               style={{
                 backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
                 backgroundSize: '20px 20px'
               }}
          />
          
          {streams.map(stream => renderStream(stream))}
          
          {equipment.map(eq => renderEquipmentCard(eq))}
          
          {isConnecting && (
            <div className="fixed bottom-4 right-4 bg-amber-100 text-amber-700 p-3 rounded-lg shadow-md text-sm flex items-center gap-2">
              <span>Select an equipment to connect</span>
              <button 
                onClick={() => setIsConnecting(null)}
                className="p-1 rounded-full bg-amber-200 text-amber-700 hover:bg-amber-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
      
      {showSettings && editingEquipment && (
        <EquipmentSettings
          equipment={editingEquipment}
          equipmentTypes={equipmentList}
          onClose={() => {
            setShowSettings(false);
            setEditingEquipment(null);
          }}
          onSave={handleSaveSettings}
        />
      )}
      
      <div className="mt-6 flex justify-end">
        <Button onClick={handleStartSimulation} disabled={simulationRunning}>
          {simulationRunning ? 'Simulating...' : 'Run Simulation'}
        </Button>
      </div>
    </div>
  );
};

export default SimulationBuilder;
