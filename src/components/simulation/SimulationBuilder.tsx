
import React, { useState, useRef, useEffect, useCallback } from "react";
import { 
  Plus, Minus, Thermometer, Droplets, Settings2, Container, 
  FlaskConical, Columns, Gauge, Save, Trash2, X, Sliders, 
  Move, Play, ChevronsUpDown, Circle, Network, Maximize, 
  Minimize, RotateCw, MousePointer, Hand, CornerUpLeft
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import EquipmentSettings from "./EquipmentSettings";
import { useNavigate } from "react-router-dom";
import TooltipWrapper from "@/components/ui/TooltipWrapper";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

const SimulationBuilder: React.FC<SimulationBuilderProps> = ({ 
  selectedComponents,
  thermodynamicModel,
  onRunSimulation
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [isConnecting, setIsConnecting] = useState<{ id: string; portId?: string } | null>(null);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedEquipment, setDraggedEquipment] = useState<string | null>(null);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [canvasDimensions] = useState({ width: 6000, height: 6000 });
  const [interactionMode, setInteractionMode] = useState<'select' | 'pan' | 'connect'>('select');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [streamAnimations, setStreamAnimations] = useState<Record<string, boolean>>({});
  
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
      id: "heat-exchanger", 
      name: "Heat Exchanger", 
      icon: <Network className="h-5 w-5" />,
      subTypes: [
        { id: "shell-tube", name: "Shell & Tube" },
        { id: "plate", name: "Plate Heat Exchanger" },
        { id: "double-pipe", name: "Double Pipe" },
        { id: "spiral", name: "Spiral Heat Exchanger" }
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

  const handleDragStart = (e: React.DragEvent, type: string, subType?: string) => {
    e.dataTransfer.setData("equipmentType", type);
    if (subType) {
      e.dataTransfer.setData("subType", subType);
    }
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("equipmentType");
    const subType = e.dataTransfer.getData("subType") || undefined;
    
    if (!type || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const scale = zoom / 100;
    
    const x = (e.clientX - rect.left) / scale - canvasOffset.x;
    const y = (e.clientY - rect.top) / scale - canvasOffset.y;
    
    const id = `${type}-${Date.now()}`;
    const ports = equipmentPorts[type as keyof typeof equipmentPorts] || [];
    const settings = defaultParameters[type as keyof typeof defaultParameters] || {};
    
    const newEquipment: Equipment = {
      id,
      type,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${equipment.filter(e => e.type === type).length + 1}`,
      position: { x, y },
      connections: [],
      settings,
      subType,
      ports: ports as Equipment['ports']
    };
    
    setEquipment(prev => [...prev, newEquipment]);
    
    localStorage.setItem('chemflow-equipment', JSON.stringify([...equipment, newEquipment]));
    
    toast({
      title: "Equipment added",
      description: `Added ${newEquipment.name} to the flowsheet`
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
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

  const handleRunSimulation = () => {
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
    if (interactionMode === 'pan') {
      return; // Don't clear selection in pan mode
    }
    
    if (isMoving && selectedElement) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const scale = zoom / 100;
        
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
    
    if (isConnecting && interactionMode === 'connect') {
      setIsConnecting(null);
    } else if (interactionMode === 'select') {
      setSelectedElement(null);
    }
    setIsMoving(false);
  };

  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    // Middle click or in pan mode
    if (e.button === 1 || interactionMode === 'pan') {
      e.preventDefault();
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (e.button === 1 || interactionMode === 'pan') {
      setIsPanning(false);
    }
    
    if (isDragging) {
      handleEquipmentDragEnd();
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      const dx = (e.clientX - lastPanPoint.x) / (zoom / 100);
      const dy = (e.clientY - lastPanPoint.y) / (zoom / 100);
      
      handlePanCanvas(dx, dy);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      return;
    }
    
    if (isDragging && draggedEquipment && canvasRef.current) {
      e.preventDefault();
      const rect = canvasRef.current.getBoundingClientRect();
      const scale = zoom / 100;
      
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
    
    // If double click and in select mode, enter move mode
    if (e.detail === 2 && interactionMode === 'select') {
      setIsMoving(true);
      setSelectedElement(id);
      
      toast({
        title: "Move mode activated",
        description: "Click on the canvas to place the equipment",
      });
      return;
    }
    
    // Single click behavior
    if (interactionMode === 'select') {
      setSelectedElement(id);
    } else if (interactionMode === 'connect') {
      if (!isConnecting) {
        setIsConnecting({ id });
        setSelectedElement(id);
      }
    }
  };

  const handlePortClick = (e: React.MouseEvent, equipmentId: string, portId: string) => {
    e.stopPropagation();
    
    if (interactionMode !== 'connect' && interactionMode !== 'select') {
      return;
    }
    
    if (isConnecting && isConnecting.id !== equipmentId) {
      const sourceEquipment = equipment.find(eq => eq.id === isConnecting.id);
      const sourcePort = sourceEquipment?.ports?.find(port => port.id === isConnecting.portId);
      
      const targetEquipment = equipment.find(eq => eq.id === equipmentId);
      const targetPort = targetEquipment?.ports?.find(port => port.id === portId);
      
      if (sourceEquipment && targetEquipment && ((sourcePort && targetPort) || (!sourcePort && !targetPort))) {
        // Case 1: Both have ports defined
        if (sourcePort && targetPort) {
          if (sourcePort.type === 'output' && targetPort.type === 'input') {
            createConnection(equipmentId, portId);
          } else {
            toast({
              title: "Invalid connection",
              description: "You can only connect from an output port to an input port",
              variant: "destructive"
            });
          }
        } 
        // Case 2: Neither have ports defined
        else {
          createConnection(equipmentId, portId);
        }
      }
      
      setIsConnecting(null);
    } else if (!isConnecting || (isConnecting && !isConnecting.portId)) {
      setIsConnecting({ id: equipmentId, portId });
    } else {
      setIsConnecting(null);
    }
  };
  
  const createConnection = (toEquipmentId: string, toPortId?: string) => {
    if (!isConnecting) return;
    
    const newStream: Stream = {
      id: `stream-${Date.now()}`,
      from: isConnecting.id,
      fromPort: isConnecting.portId,
      to: toEquipmentId,
      toPort: toPortId,
      type: "material",
      properties: {}
    };
    
    setStreams(prev => [...prev, newStream]);
    
    setEquipment(prev => prev.map(eq => {
      if (eq.id === isConnecting.id || eq.id === toEquipmentId) {
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
  };
  
  const handleStartConnection = (e: React.MouseEvent, id: string, portId?: string) => {
    e.stopPropagation();
    setInteractionMode('connect');
    setIsConnecting({ id, portId });
  };
  
  const handleEquipmentDragStart = (e: React.MouseEvent, id: string) => {
    if (interactionMode !== 'select') return;
    
    e.stopPropagation();
    setIsDragging(true);
    setDraggedEquipment(id);
    
    const equipmentItem = equipment.find(item => item.id === id);
    if (equipmentItem && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const scale = zoom / 100;
      
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

  // Render equipment in canvas
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
          cursor: interactionMode === 'select' ? (isDragging && draggedEquipment === eq.id ? 'grabbing' : 'grab') : 'default',
          transform: 'translate3d(0, 0, 0)', // Force GPU acceleration
        }}
        onClick={(e) => handleEquipmentClick(e, eq.id)}
      >
        <div 
          className="w-20 h-20 flex flex-col items-center justify-center gap-1 relative"
          onMouseDown={interactionMode === 'select' ? (e) => handleEquipmentDragStart(e, eq.id) : undefined}
          onMouseUp={handleEquipmentDragEnd}
        >
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
              <TooltipWrapper>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      className="p-1 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-600 shadow-sm hover:scale-110 transition-all"
                      onClick={(e) => handleStartConnection(e, eq.id)}
                    >
                      <Play className="h-3 w-3" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Connect to another equipment</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipWrapper>
              
              <TooltipWrapper>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      className="p-1 rounded-full bg-green-100 hover:bg-green-200 text-green-600 shadow-sm hover:scale-110 transition-all"
                      onClick={(e) => handleStartMove(e, eq.id)}
                    >
                      <Move className="h-3 w-3" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Move to specific location</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipWrapper>
              
              <TooltipWrapper>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      className="p-1 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 shadow-sm hover:scale-110 transition-all"
                      onClick={(e) => handleOpenSettings(e, eq.id)}
                    >
                      <Settings2 className="h-3 w-3" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Equipment settings</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipWrapper>
              
              <TooltipWrapper>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      className="p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-600 shadow-sm hover:scale-110 transition-all"
                      onClick={(e) => handleDeleteEquipment(e, eq.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete equipment</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipWrapper>
            </div>
          )}
        </div>
      </div>
    );
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

  const renderStream = (stream: Stream) => {
    const sourceEq = equipment.find(eq => eq.id === stream.from);
    const targetEq = equipment.find(eq => eq.id === stream.to);
    
    if (!sourceEq || !targetEq) {
      return null;
    }
    
    let sourceX = sourceEq.position.x + 10;
    let sourceY = sourceEq.position.y + 10;
    let targetX = targetEq.position.x + 10;
    let targetY = targetEq.position.y + 10;
    
    if (stream.fromPort && stream.toPort) {
      const sourcePort = sourceEq.ports?.find(p => p.id === stream.fromPort);
      const targetPort = targetEq.ports?.find(p => p.id === stream.toPort);
      
      if (sourcePort && targetPort) {
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
    
    const length = Math.sqrt(dx * dx + dy * dy);
    const controlPointX = sourceX + dx * 0.5;
    const controlPointY = sourceY + dy * 0.5;
    
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
    
    const isAnimating = streamAnimations[stream.id];
    const dotPosition = isAnimating ? 0.7 : 0.3;
    
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
        
        <path
          d={`M ${sourceX} ${sourceY} Q ${controlPointX} ${controlPointY} ${targetX} ${targetY}`}
          className={`${streamColor} stroke-2 ${streamGlow} fill-none`}
          markerEnd={`url(#arrowhead-${stream.id})`}
        />
        
        <circle
          cx={dotX}
          cy={dotY}
          r="3"
          className={`${streamColor.replace('stroke-', 'fill-')} animate-pulse`}
        />
      </svg>
    );
  };

  // Render sidebar equipment list
  const renderEquipmentItem = (item: typeof equipmentList[0]) => {
    return (
      <div key={item.id} className="mb-2">
        <div
          className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 flex items-center justify-between cursor-grab"
          draggable={true}
          onDragStart={(e) => handleDragStart(e, item.id)}
        >
          <div className="flex items-center">
            <div className="rounded-full p-2 bg-blue-100 mr-3">
              {item.icon}
            </div>
            <span className="text-sm font-medium">{item.name}</span>
          </div>
          {item.subTypes && item.subTypes.length > 0 && (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </div>
        
        {item.subTypes && item.subTypes.length > 0 && (
          <div className="pl-4 mt-1 border-l-2 border-gray-200 space-y-1">
            {item.subTypes.map(subType => (
              <div
                key={subType.id}
                className="bg-white rounded-lg p-2 shadow-sm border border-gray-200 flex items-center text-xs cursor-grab"
                draggable={true}
                onDragStart={(e) => handleDragStart(e, item.id, subType.id)}
              >
                {subType.name}
              </div>
            ))}
          </div>
        )}
      </div>
    );
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
    
    const intervalId = setInterval(() => {
      if (streams.length > 0) {
        setStreamAnimations(prevAnimations => {
          const newAnimations = { ...prevAnimations };
          
          streams.forEach(stream => {
            newAnimations[stream.id] = !prevAnimations[stream.id];
          });
          
          return newAnimations;
        });
      }
    }, 1500);
    
    return () => clearInterval(intervalId);
  }, [streams.length]);
  
  return (
    <div className="flex flex-col">
      <div className="flex h-[800px] border rounded-lg overflow-hidden shadow-md bg-gray-50">
        {/* Left Sidebar - Equipment Palette */}
        <div 
          ref={sidebarRef}
          className={`bg-white border-r flex flex-col transition-all duration-300 ${
            sidebarExpanded ? 'w-64' : 'w-16'
          }`}
        >
          <div className="p-3 border-b flex items-center justify-between">
            <h3 className={`font-medium text-gray-700 ${!sidebarExpanded && 'sr-only'}`}>Equipment</h3>
            <button 
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              className="p-1 rounded-md hover:bg-gray-100"
            >
              {sidebarExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3">
            {sidebarExpanded ? (
              <div className="space-y-1">
                {equipmentList.map(renderEquipmentItem)}
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4">
                {equipmentList.map(item => (
                  <TooltipWrapper key={item.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className="p-2 rounded-full bg-blue-100 cursor-grab"
                          draggable={true}
                          onDragStart={(e) => handleDragStart(e, item.id)}
                        >
                          {item.icon}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{item.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipWrapper>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="bg-white border-b p-2 flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <TooltipWrapper>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant={interactionMode === 'select' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setInteractionMode('select')}
                    >
                      <MousePointer className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Select Mode (drag equipment)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipWrapper>
              
              <TooltipWrapper>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant={interactionMode === 'pan' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setInteractionMode('pan')}
                    >
                      <Hand className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Pan Mode (move canvas)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipWrapper>
              
              <TooltipWrapper>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant={interactionMode === 'connect' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setInteractionMode('connect')}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Connect Mode</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipWrapper>
              
              <div className="h-6 w-px bg-gray-300 mx-1"></div>
              
              <TooltipWrapper>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleZoomIn}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Zoom In</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipWrapper>
              
              <span className="text-xs font-mono">{zoom}%</span>
              
              <TooltipWrapper>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleZoomOut}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Zoom Out</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipWrapper>
              
              <TooltipWrapper>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setZoom(100);
                        setCanvasOffset({ x: 0, y: 0 });
                      }}
                    >
                      <RotateCw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Reset View</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipWrapper>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={handleClearCanvas}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear Canvas
              </Button>
              
              <Button 
                onClick={handleRunSimulation}
                disabled={simulationRunning}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Play className="h-4 w-4 mr-1" />
                Run
              </Button>
            </div>
          </div>
          
          {/* Canvas Area */}
          <div 
            ref={canvasRef}
            className="flex-1 overflow-hidden bg-gray-100 relative"
            onClick={handleCanvasClick}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleCanvasMouseMove}
            onMouseLeave={handleMouseUp}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
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
            
            {/* Status Messages */}
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
            
            {/* Interaction Mode Indicator */}
            <div className="absolute top-4 left-4 bg-white bg-opacity-80 p-2 rounded-md text-sm">
              <span className="font-medium">Mode: </span>
              {interactionMode === 'select' && 'Select & Drag'}
              {interactionMode === 'pan' && 'Pan Canvas'}
              {interactionMode === 'connect' && 'Connect Equipment'}
            </div>
          </div>
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
    </div>
  );
};

export default SimulationBuilder;
