
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
  
  const handleAddEquipment = (type: string, subType?: string) => {
    const equipmentType = equipmentList.find(item => item.id === type);
    
    if (!equipmentType) return;
    
    let name = equipmentType.name;
    if (subType) {
      const subTypeOption = equipmentType.subTypes?.find(item => item.id === subType);
      if (subTypeOption) {
        name = subTypeOption.name;
      }
    }
    
    const newEquipment: Equipment = {
      id: `${type}-${Date.now()}`,
      type,
      name,
      position: { x: 100, y: 100 },
      connections: [],
      settings: {},
      subType
    };
    
    if (type === 'feed') {
      newEquipment.settings = {
        temperature: 25,
        pressure: 101.3,
        flowRate: 100,
        composition: selectedComponents.reduce((acc, comp) => {
          acc[comp] = 100 / selectedComponents.length;
          return acc;
        }, {} as Record<string, number>)
      };
    } else if (type === 'reactor') {
      const reactionTypes = {
        cstr: 'CSTR',
        pfr: 'PFR',
        batch: 'Batch'
      };
      
      newEquipment.settings = {
        temperature: 50,
        pressure: 150,
        conversionTarget: 0.85,
        reactionType: reactionTypes[subType as keyof typeof reactionTypes] || 'CSTR'
      };
    } else if (type === 'heater' || type === 'cooler') {
      newEquipment.settings = {
        targetTemperature: type === 'heater' ? 80 : 15,
        heatDuty: type === 'heater' ? 500 : -500,
        pressure: 101.3
      };
    } else if (type === 'column') {
      newEquipment.settings = {
        numberOfStages: 10,
        feedStage: 5,
        refluxRatio: 1.5,
        reboilerDuty: 1000,
        pressure: 101.3
      };
    } else if (type === 'valve') {
      newEquipment.settings = {
        pressureDrop: 50,
        valveType: 'linear'
      };
    } else if (type === 'pump') {
      newEquipment.settings = {
        pressureIncrease: 100,
        efficiency: 0.75
      };
    } else if (type === 'product') {
      newEquipment.settings = {
        temperature: 25,
        pressure: 101.3
      };
    } else if (type === 'mixer') {
      newEquipment.settings = {
        pressure: 101.3,
        temperature: 25,
        mixingEfficiency: 0.95
      };
    }
    
    setEquipment([...equipment, newEquipment]);
    setActiveEquipment(null);
    setActiveSubType(null);
    setShowSubTypes(false);
    
    toast({
      title: "Equipment added",
      description: `${name} has been added to the simulation`
    });
  };
  
  const handleConnectEquipment = (id: string) => {
    if (!isConnecting) {
      setIsConnecting(id);
      
      toast({
        title: "Connect mode activated",
        description: "Select another equipment to create a stream between them"
      });
    } else if (isConnecting !== id) {
      const newStream: Stream = {
        id: `stream-${Date.now()}`,
        from: isConnecting,
        to: id,
        type: "material",
        properties: {
          flowRate: 100,
          temperature: 25,
          pressure: 101.3
        }
      };
      
      const updatedStreams = [...streams, newStream];
      setStreams(updatedStreams);
      
      const updatedEquipment = equipment.map(eq => {
        if (eq.id === isConnecting) {
          return { ...eq, connections: [...eq.connections, id] };
        }
        return eq;
      });
      
      setEquipment(updatedEquipment);
      setIsConnecting(null);
      
      localStorage.setItem('chemflow-streams', JSON.stringify(updatedStreams));
      localStorage.setItem('chemflow-equipment', JSON.stringify(updatedEquipment));
      
      toast({
        title: "Stream created",
        description: "A new stream has been added to the simulation"
      });
    } else {
      setIsConnecting(null);
      
      toast({
        title: "Connect mode cancelled",
        description: "Connection process has been cancelled"
      });
    }
  };
  
  const handleMoveEquipment = (id: string, deltaX: number, deltaY: number) => {
    const updatedEquipment = equipment.map(eq => {
      if (eq.id === id) {
        return {
          ...eq,
          position: {
            x: eq.position.x + deltaX,
            y: eq.position.y + deltaY
          }
        };
      }
      return eq;
    });
    
    setEquipment(updatedEquipment);
    localStorage.setItem('chemflow-equipment', JSON.stringify(updatedEquipment));
  };
  
  const handleDeleteElement = (id: string, type: 'equipment' | 'stream') => {
    if (type === 'equipment') {
      const updatedEquipment = equipment.filter(eq => eq.id !== id);
      
      const updatedStreams = streams.filter(s => s.from !== id && s.to !== id);
      
      const equipmentWithUpdatedConnections = updatedEquipment.map(eq => ({
        ...eq,
        connections: eq.connections.filter(conn => conn !== id)
      }));
      
      setEquipment(equipmentWithUpdatedConnections);
      setStreams(updatedStreams);
      
      localStorage.setItem('chemflow-equipment', JSON.stringify(equipmentWithUpdatedConnections));
      localStorage.setItem('chemflow-streams', JSON.stringify(updatedStreams));
    } else if (type === 'stream') {
      const streamToRemove = streams.find(s => s.id === id);
      if (!streamToRemove) return;
      
      const updatedStreams = streams.filter(s => s.id !== id);
      
      const updatedEquipment = equipment.map(eq => {
        if (eq.id === streamToRemove.from) {
          return {
            ...eq,
            connections: eq.connections.filter(conn => conn !== streamToRemove.to)
          };
        }
        return eq;
      });
      
      setEquipment(updatedEquipment);
      setStreams(updatedStreams);
      
      localStorage.setItem('chemflow-equipment', JSON.stringify(updatedEquipment));
      localStorage.setItem('chemflow-streams', JSON.stringify(updatedStreams));
    }
    
    toast({
      title: `${type === 'equipment' ? 'Equipment' : 'Stream'} deleted`,
      description: `The ${type} has been removed from the simulation`
    });
  };
  
  const handleSelectElement = (id: string, type: 'equipment' | 'stream') => {
    setSelectedElement(id);
    
    if (type === 'equipment') {
      const selectedEq = equipment.find(eq => eq.id === id);
      if (selectedEq) {
        setEditingEquipment(selectedEq);
        setShowSettings(true);
      }
    }
  };
  
  const handleSaveSettings = (equipmentId: string, newSettings: Record<string, any>) => {
    const equipmentName = newSettings._equipmentName;
    delete newSettings._equipmentName;
    
    const updatedEquipment = equipment.map(eq => {
      if (eq.id === equipmentId) {
        return {
          ...eq,
          name: equipmentName || eq.name,
          settings: newSettings
        };
      }
      return eq;
    });
    
    setEquipment(updatedEquipment);
    setShowSettings(false);
    setEditingEquipment(null);
    
    localStorage.setItem('chemflow-equipment', JSON.stringify(updatedEquipment));
    
    toast({
      title: "Settings saved",
      description: "Equipment settings have been updated"
    });
  };
  
  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isConnecting) {
      handleConnectEquipment(id);
      return;
    }
    
    setIsDragging(true);
    setDraggedEquipment(id);
    setDragStartPos({
      x: e.clientX,
      y: e.clientY
    });
  };
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !draggedEquipment) return;
    
    const deltaX = e.clientX - dragStartPos.x;
    const deltaY = e.clientY - dragStartPos.y;
    
    handleMoveEquipment(draggedEquipment, deltaX, deltaY);
    
    setDragStartPos({
      x: e.clientX,
      y: e.clientY
    });
  }, [isDragging, draggedEquipment, dragStartPos]);
  
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDraggedEquipment(null);
  }, []);
  
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);
  
  useEffect(() => {
    if (equipment.length > 0) {
      localStorage.setItem('chemflow-equipment', JSON.stringify(equipment));
    }
    
    if (streams.length > 0) {
      localStorage.setItem('chemflow-streams', JSON.stringify(streams));
    }
  }, [equipment, streams]);
  
  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 10, 150));
  };
  
  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 10, 50));
  };
  
  const handleClearCanvas = () => {
    if (equipment.length === 0 && streams.length === 0) return;
    
    setEquipment([]);
    setStreams([]);
    localStorage.removeItem('chemflow-equipment');
    localStorage.removeItem('chemflow-streams');
    
    toast({
      title: "Canvas cleared",
      description: "All equipment and streams have been removed"
    });
  };
  
  const handleStartSimulation = () => {
    if (equipment.length === 0) {
      toast({
        title: "No equipment",
        description: "Please add at least one piece of equipment to the simulation",
        variant: "destructive"
      });
      return;
    }
    
    setSimulationRunning(true);
    
    localStorage.setItem('chemflow-simulation-equipment-count', equipment.length.toString());
    localStorage.setItem('chemflow-simulation-streams-count', streams.length.toString());
    
    onRunSimulation();
  };
  
  const renderEquipmentIcon = (type: string, selected: boolean = false) => {
    const icons: Record<string, React.ReactNode> = {
      feed: <Droplets className="h-6 w-6" />,
      reactor: <FlaskConical className="h-6 w-6" />,
      heater: <Thermometer className="h-6 w-6" />,
      cooler: <Thermometer className="h-6 w-6 rotate-180" />,
      column: <Container className="h-6 w-6" />,
      valve: <Gauge className="h-6 w-6" />,
      pump: <Gauge className="h-6 w-6" />,
      mixer: <Columns className="h-6 w-6" />,
      product: <Droplets className="h-6 w-6" />
    };
    
    return (
      <div className={`p-3 rounded-full ${selected ? 'bg-flow-blue text-white' : 'bg-gray-100 text-gray-600'}`}>
        {icons[type] || <FlaskConical className="h-6 w-6" />}
      </div>
    );
  };
  
  const renderEquipmentCard = (eq: Equipment) => {
    const isSelected = selectedElement === eq.id;
    const isConnectingThis = isConnecting === eq.id;
    
    const displaySettings: Record<string, string> = {};
    
    if (eq.settings) {
      for (const [key, value] of Object.entries(eq.settings)) {
        if (key === 'composition') continue;
        
        if (typeof value === 'number') {
          displaySettings[key] = value.toFixed(1);
        } else {
          displaySettings[key] = safeStringify(value);
        }
      }
    }
    
    return (
      <div
        key={eq.id}
        className={`absolute bg-white p-4 rounded-lg shadow-md transition-all ${
          isSelected ? 'ring-2 ring-flow-blue' : ''
        } ${isConnectingThis ? 'ring-2 ring-amber-500' : ''}`}
        style={{
          left: eq.position.x,
          top: eq.position.y,
          zIndex: isSelected ? 10 : 1,
          minWidth: '180px'
        }}
        onMouseDown={(e) => handleMouseDown(e, eq.id)}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {renderEquipmentIcon(eq.type)}
            <div>
              <h4 className="font-medium text-sm">{safeStringify(eq.name)}</h4>
              <span className="text-xs text-gray-500">{eq.type}{eq.subType ? ` (${eq.subType})` : ''}</span>
            </div>
          </div>
          <button
            onClick={() => handleDeleteElement(eq.id, 'equipment')}
            className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
        
        {Object.keys(displaySettings).length > 0 && (
          <div className="mt-2 space-y-1 border-t pt-2">
            {Object.entries(displaySettings).slice(0, 3).map(([key, value]) => (
              <div key={key} className="flex justify-between text-xs">
                <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                <span className="font-medium">{safeStringify(value)}</span>
              </div>
            ))}
            {Object.keys(displaySettings).length > 3 && (
              <div className="text-xs text-gray-400 text-center">+{Object.keys(displaySettings).length - 3} more</div>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between mt-3">
          <button
            onClick={() => handleConnectEquipment(eq.id)}
            className={`p-1.5 rounded text-xs ${
              isConnecting === eq.id 
                ? 'bg-amber-100 text-amber-600'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {isConnecting === eq.id ? 'Cancel' : 'Connect'}
          </button>
          <button
            onClick={() => handleSelectElement(eq.id, 'equipment')}
            className="p-1.5 bg-flow-blue/10 rounded text-flow-blue text-xs hover:bg-flow-blue/20"
          >
            Configure
          </button>
          <div className="p-1.5 bg-gray-100 rounded text-gray-500 hover:bg-gray-200 cursor-move">
            <Move className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>
    );
  };
  
  const renderStream = (stream: Stream) => {
    const fromEq = equipment.find(eq => eq.id === stream.from);
    const toEq = equipment.find(eq => eq.id === stream.to);
    
    if (!fromEq || !toEq) return null;
    
    const startX = fromEq.position.x + 90;
    const startY = fromEq.position.y + 60;
    const endX = toEq.position.x + 90;
    const endY = toEq.position.y + 60;
    
    const isSelected = selectedElement === stream.id;
    
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
            refX="10"
            refY="3.5"
            orient="auto"
          >
            <polygon 
              points="0 0, 10 3.5, 0 7" 
              fill={isSelected ? "#3b82f6" : "#94a3b8"} 
            />
          </marker>
        </defs>
        <g onClick={() => handleSelectElement(stream.id, 'stream')}>
          <line
            x1={startX}
            y1={startY}
            x2={endX}
            y2={endY}
            stroke={isSelected ? "#3b82f6" : "#94a3b8"}
            strokeWidth={isSelected ? 3 : 2}
            strokeDasharray={stream.type === "energy" ? "5,5" : "none"}
            markerEnd={`url(#arrowhead-${stream.id})`}
            className="pointer-events-auto cursor-pointer"
          />
          
          <text
            x={(startX + endX) / 2}
            y={(startY + endY) / 2 - 8}
            fill="#64748b"
            fontSize="10"
            textAnchor="middle"
            className="pointer-events-auto cursor-pointer"
          >
            {safeStringify(stream.properties?.flowRate || '')} kg/h
          </text>
          
          {isSelected && (
            <rect
              x={(startX + endX) / 2 - 10}
              y={(startY + endY) / 2 + 8}
              width="20"
              height="20"
              fill="white"
              stroke="#e2e8f0"
              rx="4"
              className="pointer-events-auto cursor-pointer"
              onClick={() => handleDeleteElement(stream.id, 'stream')}
            />
          )}
          
          {isSelected && (
            <text
              x={(startX + endX) / 2}
              y={(startY + endY) / 2 + 21}
              fill="#ef4444"
              fontSize="12"
              textAnchor="middle"
              className="pointer-events-auto cursor-pointer"
              onClick={() => handleDeleteElement(stream.id, 'stream')}
            >
              ×
            </text>
          )}
        </g>
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
          className="relative border rounded-lg h-[500px] overflow-auto bg-gray-50"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
        >
          <div className="absolute inset-0 w-full h-full" 
               style={{
                 backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
                 backgroundSize: '20px 20px'
               }}
          />
          
          {streams.map(renderStream)}
          
          {equipment.map(renderEquipmentCard)}
          
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
