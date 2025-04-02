
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Plus, Minus, Thermometer, Droplets, Settings2, Container, FlaskConical, Columns, Gauge, Save, Trash2, X, Sliders, Move, ArrowLeft, Play, ChevronsUpDown, Circle } from "lucide-react";
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
  ports?: { id: string; type: "input" | "output"; position: string }[];
}

export interface Stream {
  id: string;
  from: string;
  fromPort?: string;
  to: string;
  toPort?: string;
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
  const [isConnecting, setIsConnecting] = useState<{ id: string; portId?: string } | null>(null);
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
  const [isMoving, setIsMoving] = useState(false);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 6000, height: 6000 });
  const [streamAnimations, setStreamAnimations] = useState<Record<string, boolean>>({});
  
  // Default parameters for different equipment types
  const defaultParameters = {
    feed: {
      temperature: 25, // °C
      pressure: 101.325, // kPa
      flowRate: 100, // kg/h
      phase: "Liquid",
      composition: selectedComponents.reduce((acc, comp) => {
        acc[comp] = 0;
        return acc;
      }, {} as Record<string, number>)
    },
    reactor: {
      temperature: 80, // °C
      pressure: 200, // kPa
      volume: 10, // m³
      conversionRate: 85, // %
      reactionType: "CSTR"
    },
    column: {
      temperature: 65, // °C
      pressure: 150, // kPa
      numberOfTrays: 20,
      refluxRatio: 1.5,
      feedTray: 10,
      bottomsRate: 50, // kg/h
      distillateRate: 50 // kg/h
    },
    heater: {
      inletTemperature: 25, // °C
      outletTemperature: 80, // °C
      pressure: 101.325, // kPa
      heatDuty: 100, // kW
      efficiency: 85 // %
    },
    cooler: {
      inletTemperature: 80, // °C
      outletTemperature: 25, // °C
      pressure: 101.325, // kPa
      heatDuty: 100, // kW
      efficiency: 85 // %
    },
    mixer: {
      pressure: 101.325, // kPa
      temperature: 25, // °C
      efficiency: 95 // %
    },
    valve: {
      inletPressure: 200, // kPa
      outletPressure: 101.325, // kPa
      flowCoefficient: 0.75,
      valveType: "linear"
    },
    pump: {
      inletPressure: 101.325, // kPa
      outletPressure: 300, // kPa
      efficiency: 75, // %
      power: 5 // kW
    },
    product: {
      temperature: 25, // °C
      pressure: 101.325, // kPa
      flowRate: 100, // kg/h
      purity: 95 // %
    }
  };
  
  // Equipment port configuration
  const equipmentPorts = {
    feed: [
      { id: 'out', type: 'output', position: 'right' }
    ],
    reactor: [
      { id: 'in', type: 'input', position: 'left' },
      { id: 'out', type: 'output', position: 'right' }
    ],
    column: [
      { id: 'in', type: 'input', position: 'left' },
      { id: 'top', type: 'output', position: 'top' },
      { id: 'bottom', type: 'output', position: 'bottom' }
    ],
    heater: [
      { id: 'in', type: 'input', position: 'left' },
      { id: 'out', type: 'output', position: 'right' }
    ],
    cooler: [
      { id: 'in', type: 'input', position: 'left' },
      { id: 'out', type: 'output', position: 'right' }
    ],
    mixer: [
      { id: 'in1', type: 'input', position: 'left' },
      { id: 'in2', type: 'input', position: 'top' },
      { id: 'out', type: 'output', position: 'right' }
    ],
    valve: [
      { id: 'in', type: 'input', position: 'left' },
      { id: 'out', type: 'output', position: 'right' }
    ],
    pump: [
      { id: 'in', type: 'input', position: 'left' },
      { id: 'out', type: 'output', position: 'right' }
    ],
    product: [
      { id: 'in', type: 'input', position: 'left' }
    ]
  };
  
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
    
    // Start stream animations
    const intervalId = setInterval(() => {
      if (streams.length > 0) {
        setStreamAnimations(prevAnimations => {
          const newAnimations = { ...prevAnimations };
          
          streams.forEach(stream => {
            // Toggle animation state for each stream
            newAnimations[stream.id] = !prevAnimations[stream.id];
          });
          
          return newAnimations;
        });
      }
    }, 1500);
    
    return () => clearInterval(intervalId);
  }, [streams.length]);
  
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
  
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 50));
  };

  const handlePanCanvas = (dx: number, dy: number) => {
    setCanvasOffset(prev => ({
      x: prev.x + dx,
      y: prev.y + dy
    }));
  };

  const handleAddEquipment = (type: string, subType?: string) => {
    const id = `${type}-${Date.now()}`;
    
    // Add appropriate ports for the equipment type
    const ports = equipmentPorts[type as keyof typeof equipmentPorts] || [];
    
    // Get the default parameters for this equipment type
    const settings = defaultParameters[type as keyof typeof defaultParameters] || {};
    
    const newEquipment: Equipment = {
      id,
      type,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${equipment.filter(e => e.type === type).length + 1}`,
      position: { x: 500, y: 500 },
      connections: [],
      settings,
      subType,
      ports: ports as Equipment['ports']
    };
    
    setEquipment(prev => [...prev, newEquipment]);
    setActiveEquipment(null);
    setActiveSubType(null);
    setShowSubTypes(false);
    
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
    
    localStorage.setItem('chemflow-equipment', JSON.stringify(equipment));
    localStorage.setItem('chemflow-streams', JSON.stringify(streams));
    
    onRunSimulation();
    
    setTimeout(() => {
      setSimulationRunning(false);
    }, 2000);
  };

  const handleSaveSettings = (equipmentId: string, newSettings: Record<string, any>) => {
    setEquipment(prev => 
      prev.map(eq => {
        if (eq.id === equipmentId) {
          const equipmentName = newSettings._equipmentName;
          delete newSettings._equipmentName;
          
          return {
            ...eq,
            name: equipmentName || eq.name,
            settings: newSettings
          };
        }
        return eq;
      })
    );
    
    setShowSettings(false);
    setEditingEquipment(null);
    
    localStorage.setItem('chemflow-equipment', JSON.stringify(
      equipment.map(eq => {
        if (eq.id === equipmentId) {
          const equipmentName = newSettings._equipmentName;
          delete newSettings._equipmentName;
          
          return {
            ...eq,
            name: equipmentName || eq.name,
            settings: newSettings
          };
        }
        return eq;
      })
    ));
    
    toast({
      title: "Settings saved",
      description: `Updated settings for equipment`
    });
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (isMoving && selectedElement) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const scale = zoom / 100;
        
        // Calculate position within the canvas, accounting for zoom and pan
        const x = (e.clientX - rect.left) / scale - canvasOffset.x;
        const y = (e.clientY - rect.top) / scale - canvasOffset.y;
        
        setEquipment(prev => prev.map(eq => {
          if (eq.id === selectedElement) {
            return {
              ...eq,
              position: { x, y }
            };
          }
          return eq;
        }));
        
        localStorage.setItem('chemflow-equipment', JSON.stringify(
          equipment.map(eq => {
            if (eq.id === selectedElement) {
              return {
                ...eq,
                position: { x, y }
              };
            }
            return eq;
          })
        ));
        
        setIsMoving(false);
        setSelectedElement(null);
        
        toast({
          title: "Equipment moved",
          description: "New position saved"
        });
      }
      return;
    }
    
    if (isConnecting) {
      setIsConnecting(null);
    } else {
      setSelectedElement(null);
    }
    setIsMoving(false);
  };

  // Middle mouse button panning
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    // Middle mouse button (wheel) pressed for panning
    if (e.button === 1) {
      e.preventDefault();
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (e.button === 1) {
      setIsPanning(false);
    }
    
    if (isDragging) {
      handleEquipmentDragEnd();
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    // Handle panning with middle mouse button
    if (isPanning) {
      const dx = (e.clientX - lastPanPoint.x) / (zoom / 100);
      const dy = (e.clientY - lastPanPoint.y) / (zoom / 100);
      
      handlePanCanvas(dx, dy);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      return;
    }
    
    // Handle equipment dragging
    if (isDragging && draggedEquipment && canvasRef.current) {
      e.preventDefault();
      const rect = canvasRef.current.getBoundingClientRect();
      const scale = zoom / 100;
      
      // Calculate position within the canvas, accounting for zoom and pan
      const x = (e.clientX - rect.left) / scale - canvasOffset.x;
      const y = (e.clientY - rect.top) / scale - canvasOffset.y;
      
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

  const handleEquipmentClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedElement(id);
  };

  const handlePortClick = (e: React.MouseEvent, equipmentId: string, portId: string) => {
    e.stopPropagation();
    
    if (isConnecting && isConnecting.id !== equipmentId) {
      // Find the source equipment and port
      const sourceEquipment = equipment.find(eq => eq.id === isConnecting.id);
      const sourcePort = sourceEquipment?.ports?.find(port => port.id === isConnecting.portId);
      
      // Find the target equipment and port
      const targetEquipment = equipment.find(eq => eq.id === equipmentId);
      const targetPort = targetEquipment?.ports?.find(port => port.id === portId);
      
      // Only connect if it's a valid connection (output to input)
      if (sourceEquipment && targetEquipment && sourcePort && targetPort) {
        if (sourcePort.type === 'output' && targetPort.type === 'input') {
          const newStream: Stream = {
            id: `stream-${Date.now()}`,
            from: isConnecting.id,
            fromPort: isConnecting.portId,
            to: equipmentId,
            toPort: portId,
            type: "material",
            properties: {}
          };
          
          setStreams(prev => [...prev, newStream]);
          
          setEquipment(prev => prev.map(eq => {
            if (eq.id === isConnecting.id || eq.id === equipmentId) {
              return {
                ...eq,
                connections: [...eq.connections, newStream.id]
              };
            }
            return eq;
          }));
          
          localStorage.setItem('chemflow-streams', JSON.stringify([...streams, newStream]));
          
          toast({
            title: "Connection created",
            description: "Stream connection established successfully"
          });
        } else {
          toast({
            title: "Invalid connection",
            description: "You can only connect from an output port to an input port",
            variant: "destructive"
          });
        }
      }
      
      setIsConnecting(null);
    } else if (!isConnecting) {
      // Start connection from this port
      setIsConnecting({ id: equipmentId, portId });
    } else {
      setIsConnecting(null);
    }
  };
  
  const handleStartConnection = (e: React.MouseEvent, id: string, portId?: string) => {
    e.stopPropagation();
    setIsConnecting({ id, portId });
  };
  
  const handleEquipmentDragStart = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setIsDragging(true);
    setDraggedEquipment(id);
    
    const equipmentItem = equipment.find(item => item.id === id);
    if (equipmentItem && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const scale = zoom / 100;
      
      // Calculate the offset within the equipment item
      const offsetX = (e.clientX - rect.left) / scale - canvasOffset.x - equipmentItem.position.x;
      const offsetY = (e.clientY - rect.top) / scale - canvasOffset.y - equipmentItem.position.y;
      
      setDragStartPos({
        x: offsetX,
        y: offsetY
      });
    }
  };
  
  const handleEquipmentDragEnd = () => {
    if (isDragging && draggedEquipment) {
      localStorage.setItem('chemflow-equipment', JSON.stringify(equipment));
    }
    
    setIsDragging(false);
    setDraggedEquipment(null);
  };
  
  const handleStartMove = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setIsMoving(true);
    setSelectedElement(id);
    
    toast({
      title: "Move mode activated",
      description: "Click on the canvas to place the equipment",
    });
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
    
    const connectedStreams = streams.filter(
      stream => stream.from === id || stream.to === id
    );
    
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
    
    setStreams(prev => 
      prev.filter(stream => stream.from !== id && stream.to !== id)
    );
    
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

  const renderPort = (eq: Equipment, port: { id: string; type: string; position: string }) => {
    const isPortConnecting = isConnecting?.id === eq.id && isConnecting?.portId === port.id;
    const isConnected = streams.some(
      stream => (stream.from === eq.id && stream.fromPort === port.id) || 
               (stream.to === eq.id && stream.toPort === port.id)
    );
    
    let positionClass = '';
    switch (port.position) {
      case 'top':
        positionClass = 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2';
        break;
      case 'right':
        positionClass = 'right-0 top-1/2 translate-x-1/2 -translate-y-1/2';
        break;
      case 'bottom':
        positionClass = 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2';
        break;
      case 'left':
        positionClass = 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2';
        break;
    }
    
    return (
      <div
        key={`${eq.id}-${port.id}`}
        className={`absolute ${positionClass} w-3 h-3 rounded-full cursor-pointer z-20 flex items-center justify-center ${
          isPortConnecting 
            ? 'bg-amber-500 ring-2 ring-amber-200 transform scale-125' 
            : isConnected 
              ? 'bg-flow-blue ring-2 ring-blue-200' 
              : 'bg-gray-200 hover:bg-flow-blue/70 hover:ring-2 hover:ring-blue-200'
        }`}
        onClick={(e) => handlePortClick(e, eq.id, port.id)}
        title={`${port.type === 'input' ? 'Input' : 'Output'} port: ${port.id}`}
      >
        <Circle className="h-2 w-2 text-white" />
      </div>
    );
  };

  const renderEquipmentCard = (eq: Equipment) => {
    const isSelected = selectedElement === eq.id;
    const isSource = isConnecting?.id === eq.id;
    const isBeingMoved = isMoving && selectedElement === eq.id;
    
    const equipmentType = equipmentList.find(e => e.id === eq.type);
    
    return (
      <div 
        key={eq.id}
        className={`absolute p-2 rounded-lg shadow-xl backdrop-blur-sm hover:shadow-blue-200/50 animate-fade-in transition-all ${
          isSelected 
            ? 'border-[3px] border-flow-blue shadow-lg bg-gradient-to-b from-white to-blue-50' 
            : isSource 
              ? 'border-[3px] border-amber-500 bg-white'
              : isBeingMoved
                ? 'border-[3px] border-green-500 bg-white'
                : 'border-2 border-gray-200 bg-white hover:border-flow-blue/50'
        }`}
        style={{
          left: `${eq.position.x}px`,
          top: `${eq.position.y}px`,
          zIndex: isSelected ? 10 : 1,
          cursor: isDragging && draggedEquipment === eq.id ? 'grabbing' : 'grab',
          transform: 'translate3d(0, 0, 0)', // Force GPU acceleration
        }}
        onClick={(e) => handleEquipmentClick(e, eq.id)}
      >
        <div 
          className="w-20 h-20 flex flex-col items-center justify-center gap-1 relative"
          onMouseDown={(e) => handleEquipmentDragStart(e, eq.id)}
          onMouseUp={handleEquipmentDragEnd}
        >
          {/* Render ports */}
          {eq.ports?.map(port => renderPort(eq, port))}
          
          <div className="text-flow-blue flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full transition-all hover:scale-105">
            {equipmentType?.icon || <Container className="h-8 w-8 text-flow-blue" />}
          </div>
          <span className="text-xs text-center font-medium">{eq.name}</span>
          {eq.subType && (
            <span className="text-xs text-gray-500">{
              equipmentType?.subTypes?.find(sub => sub.id === eq.subType)?.name || eq.subType
            }</span>
          )}
          
          {isSelected && (
            <div className="absolute -top-1 -right-1 flex gap-1">
              <button 
                className="p-1 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-600 shadow-sm hover:scale-110 transition-all"
                onClick={(e) => handleStartConnection(e, eq.id)}
                title="Connect to another equipment"
              >
                <Play className="h-3 w-3" />
              </button>
              <button 
                className="p-1 rounded-full bg-green-100 hover:bg-green-200 text-green-600 shadow-sm hover:scale-110 transition-all"
                onClick={(e) => handleStartMove(e, eq.id)}
                title="Move to specific location"
              >
                <Move className="h-3 w-3" />
              </button>
              <button 
                className="p-1 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 shadow-sm hover:scale-110 transition-all"
                onClick={(e) => handleOpenSettings(e, eq.id)}
                title="Equipment settings"
              >
                <Settings2 className="h-3 w-3" />
              </button>
              <button 
                className="p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-600 shadow-sm hover:scale-110 transition-all"
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
    
    // Find the position of the ports
    let sourceX = sourceEq.position.x + 10;
    let sourceY = sourceEq.position.y + 10;
    let targetX = targetEq.position.x + 10;
    let targetY = targetEq.position.y + 10;
    
    if (stream.fromPort && stream.toPort) {
      const sourcePort = sourceEq.ports?.find(p => p.id === stream.fromPort);
      const targetPort = targetEq.ports?.find(p => p.id === stream.toPort);
      
      if (sourcePort && targetPort) {
        // Adjust positions based on port positions
        switch (sourcePort.position) {
          case 'top':
            sourceX = sourceEq.position.x + 10;
            sourceY = sourceEq.position.y - 5;
            break;
          case 'right':
            sourceX = sourceEq.position.x + 25;
            sourceY = sourceEq.position.y + 10;
            break;
          case 'bottom':
            sourceX = sourceEq.position.x + 10;
            sourceY = sourceEq.position.y + 25;
            break;
          case 'left':
            sourceX = sourceEq.position.x - 5;
            sourceY = sourceEq.position.y + 10;
            break;
        }
        
        switch (targetPort.position) {
          case 'top':
            targetX = targetEq.position.x + 10;
            targetY = targetEq.position.y - 5;
            break;
          case 'right':
            targetX = targetEq.position.x + 25;
            targetY = targetEq.position.y + 10;
            break;
          case 'bottom':
            targetX = targetEq.position.x + 10;
            targetY = targetEq.position.y + 25;
            break;
          case 'left':
            targetX = targetEq.position.x - 5;
            targetY = targetEq.position.y + 10;
            break;
        }
      }
    }
    
    const dx = targetX - sourceX;
    const dy = targetY - sourceY;
    const angle = Math.atan2(dy, dx);
    
    // Calculate control points for a bezier curve
    const length = Math.sqrt(dx * dx + dy * dy);
    const controlPointX = sourceX + dx * 0.5;
    const controlPointY = sourceY + dy * 0.5;
    
    // Determine arrow points
    const arrowSize = 8;
    const arrowX = targetX - arrowSize * Math.cos(angle);
    const arrowY = targetY - arrowSize * Math.sin(angle);
    
    let streamColor = "stroke-blue-500";
    let streamGlow = "filter drop-shadow(0 0 2px rgba(59, 130, 246, 0.5))";
    
    if (stream.type === "energy") {
      streamColor = "stroke-red-500";
      streamGlow = "filter drop-shadow(0 0 2px rgba(239, 68, 68, 0.5))";
    } else if (stream.type === "signal") {
      streamColor = "stroke-green-500";
      streamGlow = "filter drop-shadow(0 0 2px rgba(34, 197, 94, 0.5))";
    }
    
    // Animated dots along the stream
    const isAnimating = streamAnimations[stream.id];
    const dotPosition = isAnimating ? 0.7 : 0.3; // Alternate between two positions
    
    const dotX = sourceX + dx * dotPosition;
    const dotY = sourceY + dy * dotPosition;
    
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
        
        {/* Bezier Curve for the stream */}
        <path
          d={`M ${sourceX} ${sourceY} Q ${controlPointX} ${controlPointY} ${targetX} ${targetY}`}
          className={`${streamColor} stroke-2 ${streamGlow} fill-none`}
          markerEnd={`url(#arrowhead-${stream.id})`}
        />
        
        {/* Animated Dot */}
        <circle
          cx={dotX}
          cy={dotY}
          r="3"
          className={`${streamColor.replace('stroke-', 'fill-')} animate-pulse`}
        />
      </svg>
    );
  };

  return (
    <div className="flex flex-col">
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2 bg-gradient-to-r from-flow-blue to-blue-600 bg-clip-text text-transparent">Flowsheet Builder</h3>
        <p className="text-gray-600 text-sm">
          Build your process flowsheet by adding and connecting equipment from the palette below.
        </p>
      </div>
      
      <div className="p-4 border rounded-lg bg-gradient-to-b from-white to-blue-50 mb-6 shadow-md animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium bg-gradient-to-r from-flow-blue to-blue-600 bg-clip-text text-transparent">Equipment Palette</h4>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleZoomIn}
              className="p-1.5 rounded-lg bg-white text-gray-500 border hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm"
            >
              <Plus className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium">{zoom}%</span>
            <button 
              onClick={handleZoomOut}
              className="p-1.5 rounded-lg bg-white text-gray-500 border hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm"
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
                  activeEquipment === item.id ? 'bg-flow-blue/10 text-flow-blue' : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                } flex items-center gap-2 border border-gray-200 transition-all hover:shadow-md shadow-sm`}
              >
                <span className="transition-transform hover:scale-110">{item.icon}</span>
                <span className="text-sm font-medium">{item.name}</span>
              </button>
              
              {activeEquipment === item.id && showSubTypes && item.subTypes && (
                <div className="w-full mt-2 mb-1 ml-4 pl-4 border-l-2 border-blue-200 animate-fade-in-up">
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
                            : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                        } text-xs border border-gray-200 transition-all hover:shadow-md shadow-sm`}
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
        <div className="bg-gradient-to-r from-white to-blue-50 border rounded-lg p-1 mb-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-1">
            <button
              onClick={handleClearCanvas}
              className="p-1.5 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all"
              title="Clear canvas"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                setZoom(100);
                setCanvasOffset({ x: 0, y: 0 });
              }}
              className="p-1.5 rounded-lg text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-all"
              title="Reset view"
            >
              <ChevronsUpDown className="h-4 w-4" />
            </button>
            <span className="text-xs text-gray-500 ml-2">
              Tip: Use middle mouse button to pan around
            </span>
          </div>
          
          <div className="text-xs text-gray-500">
            {equipment.length} equipment · {streams.length} streams
          </div>
          
          <button
            onClick={handleStartSimulation}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 text-xs font-medium flex items-center gap-1 shadow-md transition-all hover:shadow-lg transform hover:scale-105"
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
          className="relative border rounded-lg overflow-auto bg-gradient-to-b from-blue-50/20 to-white shadow-inner"
          style={{ 
            height: "800px",
            maxHeight: "800px",
            width: "100%",
            overflow: "hidden"
          }}
          onClick={handleCanvasClick}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleCanvasMouseMove}
          onMouseLeave={handleMouseUp}
        >
          <div className="absolute"
               style={{
                 width: `${canvasDimensions.width}px`,
                 height: `${canvasDimensions.height}px`,
                 transform: `scale(${zoom / 100}) translate(${canvasOffset.x}px, ${canvasOffset.y}px)`,
                 transformOrigin: '0 0',
                 backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
                 backgroundSize: '20px 20px'
               }}
          >
            {streams.map(stream => renderStream(stream))}
            {equipment.map(eq => renderEquipmentCard(eq))}
          </div>
          
          {isConnecting && (
            <div className="fixed bottom-4 right-4 bg-amber-100 text-amber-700 p-3 rounded-lg shadow-md text-sm flex items-center gap-2 animate-pulse-subtle">
              <span>Select a port to connect</span>
              <button 
                onClick={() => setIsConnecting(null)}
                className="p-1 rounded-full bg-amber-200 text-amber-700 hover:bg-amber-300 transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          
          {isMoving && (
            <div className="fixed bottom-4 right-4 bg-green-100 text-green-700 p-3 rounded-lg shadow-md text-sm flex items-center gap-2 animate-pulse-subtle">
              <span>Click on the canvas to place the equipment</span>
              <button 
                onClick={() => setIsMoving(false)}
                className="p-1 rounded-full bg-green-200 text-green-700 hover:bg-green-300 transition-all"
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
        <Button 
          onClick={handleStartSimulation} 
          disabled={simulationRunning}
          className="bg-gradient-to-r from-flow-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all transform hover:scale-105"
        >
          {simulationRunning ? 'Simulating...' : 'Run Simulation'}
        </Button>
      </div>
    </div>
  );
};

export default SimulationBuilder;
