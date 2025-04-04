import React, { useState, useRef, useEffect, useCallback } from "react";
import { Plus, Minus, Thermometer, Droplets, Settings2, Container, FlaskConical, Columns, Gauge, Save, Trash2, X, Sliders, Move, ArrowLeft, Play, ChevronsUpDown, ArrowRight, Info } from "lucide-react";
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
  description?: string;
  rotation?: number;
  scale?: number;
}

export interface Stream {
  id: string;
  from: string;
  to: string;
  type: "material" | "energy" | "signal";
  properties: Record<string, any>;
  label?: string;
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
  const [isConnecting, setIsConnecting] = useState<{ id: string } | null>(null);
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
  const [showEquipmentInfo, setShowEquipmentInfo] = useState<string | null>(null);
  
  const defaultParameters = {
    feed: {
      temperature: 25,
      pressure: 101.325,
      flowRate: 100,
      phase: "Liquid",
      composition: selectedComponents.reduce((acc, comp) => {
        acc[comp] = 0;
        return acc;
      }, {} as Record<string, number>),
      description: "Feed stream with raw materials"
    },
    reactor: {
      temperature: 80,
      pressure: 200,
      volume: 10,
      conversionRate: 85,
      reactionType: "CSTR",
      description: "Chemical reaction vessel"
    },
    column: {
      temperature: 65,
      pressure: 150,
      numberOfTrays: 20,
      refluxRatio: 1.5,
      feedTray: 10,
      bottomsRate: 50,
      distillateRate: 50,
      description: "Separation column with 20 stages"
    },
    heater: {
      inletTemperature: 25,
      outletTemperature: 80,
      pressure: 101.325,
      heatDuty: 100,
      efficiency: 85,
      description: "Heating equipment for process stream"
    },
    cooler: {
      inletTemperature: 80,
      outletTemperature: 25,
      pressure: 101.325,
      heatDuty: 100,
      efficiency: 85,
      description: "Cooling equipment for process stream"
    },
    mixer: {
      pressure: 101.325,
      temperature: 25,
      efficiency: 95,
      description: "Combines multiple input streams"
    },
    valve: {
      inletPressure: 200,
      outletPressure: 101.325,
      flowCoefficient: 0.75,
      valveType: "linear",
      description: "Controls flow rate and pressure"
    },
    pump: {
      inletPressure: 101.325,
      outletPressure: 300,
      efficiency: 75,
      power: 5,
      description: "Increases pressure of fluid streams"
    },
    product: {
      temperature: 25,
      pressure: 101.325,
      flowRate: 100,
      purity: 95,
      description: "Final product output stream"
    }
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
    
    const settings = defaultParameters[type as keyof typeof defaultParameters] || {};
    
    const newEquipment: Equipment = {
      id,
      type,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${equipment.filter(e => e.type === type).length + 1}`,
      position: { x: 500, y: 500 },
      connections: [],
      settings,
      subType,
      description: settings?.description || `${type.charAt(0).toUpperCase() + type.slice(1)} equipment`
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
          const description = newSettings._description || eq.description;
          delete newSettings._equipmentName;
          delete newSettings._description;
          
          return {
            ...eq,
            name: equipmentName || eq.name,
            description: description,
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
          const description = newSettings._description || eq.description;
          delete newSettings._equipmentName;
          delete newSettings._description;
          
          return {
            ...eq,
            name: equipmentName || eq.name,
            description: description,
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
      setShowEquipmentInfo(null);
    }
    setIsMoving(false);
  };

  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
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
    setSelectedElement(id);
  };

  const handleStartConnection = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (isConnecting && isConnecting.id === id) {
      setIsConnecting(null);
      toast({
        title: "Connection Cancelled",
        description: "Connection mode disabled",
      });
    } else {
      setIsConnecting({ id });
      toast({
        title: "Connect Mode Enabled",
        description: `Select another equipment to connect from ${equipment.find(e => e.id === id)?.name}`,
      });
    }
  };

  const handleConnectionSelect = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    
    if (isConnecting && isConnecting.id !== id) {
      const sourceEquipment = equipment.find(e => e.id === isConnecting.id);
      const targetEquipment = equipment.find(e => e.id === id);
      
      if (sourceEquipment && targetEquipment) {
        const label = `${sourceEquipment.type} → ${targetEquipment.type}`;
        
        const newStream: Stream = {
          id: `stream-${Date.now()}`,
          from: isConnecting.id,
          to: id,
          type: "material",
          properties: {},
          label
        };
        
        setStreams(prev => [...prev, newStream]);
        
        setEquipment(prev => prev.map(eq => {
          if (eq.id === isConnecting.id) {
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
          description: `Connected ${sourceEquipment.name} to ${targetEquipment.name}`
        });
      }
      
      setIsConnecting(null);
    }
  };
  
  const toggleEquipmentInfo = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setShowEquipmentInfo(showEquipmentInfo === id ? null : id);
  };
  
  const handleEquipmentDragStart = (e: React.MouseEvent, id: string) => {
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

  const renderEquipmentCard = (eq: Equipment) => {
    const isSelected = selectedElement === eq.id;
    const isSource = isConnecting?.id === eq.id;
    const isBeingMoved = isMoving && selectedElement === eq.id;
    const showingInfo = showEquipmentInfo === eq.id;
    
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
          transform: `translate3d(0, 0, 0) ${eq.type === 'arrow' ? `rotate(${eq.rotation || 0}deg) scale(${eq.scale || 1})` : ''}`,
        }}
        onClick={(e) => handleEquipmentClick(e, eq.id)}
      >
        <div 
          className="w-20 h-20 flex flex-col items-center justify-center gap-1 relative"
          onMouseDown={(e) => handleEquipmentDragStart(e, eq.id)}
          onMouseUp={handleEquipmentDragEnd}
        >
          <div className="text-flow-blue flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full transition-all hover:scale-105">
            {eq.type === 'arrow' ? (
              <ArrowRight className="h-8 w-8 text-flow-blue" />
            ) : (
              equipmentType?.icon || <Container className="h-8 w-8 text-flow-blue" />
            )}
          </div>
          <span className="text-xs text-center font-medium">{eq.name}</span>
          {eq.subType && (
            <span className="text-xs text-gray-500">{
              equipmentType?.subTypes?.find(sub => sub.id === eq.subType)?.name || eq.subType
            }</span>
          )}
          
          {eq.description && showingInfo && (
            <div className="absolute top-full left-0 right-0 mt-1 p-2 bg-white border border-gray-200 rounded shadow-md z-30 text-xs">
              <p className="text-gray-600">{eq.description}</p>
              {Object.entries(eq.settings || {}).slice(0, 3).map(([key, value]) => {
                if (key !== 'description' && typeof value !== 'object') {
                  return (
                    <div key={key} className="mt-1">
                      <span className="font-medium">{key}: </span>
                      <span>{value}</span>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          )}
          
          {isSelected && (
            <div className="absolute -top-1 -right-1 flex gap-1">
              {eq.type === 'arrow' && (
                <>
                  <button 
                    className="p-1 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 shadow-sm hover:scale-110 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEquipment(prev => prev.map(item => 
                        item.id === eq.id 
                          ? { ...item, rotation: ((item.rotation || 0) + 45) % 360 }
                          : item
                      ));
                    }}
                    title="Rotate arrow"
                  >
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </button>
                  <button 
                    className="p-1 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-600 shadow-sm hover:scale-110 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEquipment(prev => prev.map(item => 
                        item.id === eq.id 
                          ? { ...item, scale: (item.scale || 1) + 0.2 }
                          : item
                      ));
                    }}
                    title="Increase size"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                  <button 
                    className="p-1 rounded-full bg-indigo-100 hover:bg-indigo-200 text-indigo-600 shadow-sm hover:scale-110 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEquipment(prev => prev.map(item => 
                        item.id === eq.id 
                          ? { ...item, scale: Math.max(0.5, (item.scale || 1) - 0.2) }
                          : item
                      ));
                    }}
                    title="Decrease size"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                </>
              )}
              <button 
                className="p-1 rounded-full bg-green-100 hover:bg-green-200 text-green-600 shadow-sm hover:scale-110 transition-all"
                onClick={(e) => toggleEquipmentInfo(e, eq.id)}
                title="Show equipment information"
              >
                <Info className="h-3 w-3" />
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
    
    const sourceX = sourceEq.position.x + 10;
    const sourceY = sourceEq.position.y + 10;
    const targetX = targetEq.position.x + 10;
    const targetY = targetEq.position.y + 10;
    
    const dx = targetX - sourceX;
    const dy = targetY - sourceY;
    const angle = Math.atan2(dy, dx);
    
    const length = Math.sqrt(dx * dx + dy * dy);
    const controlPointX = sourceX + dx * 0.5;
    const controlPointY = sourceY + dy * 0.5;
    
    const arrowSize = 8;
    const arrowX = targetX - arrowSize * Math.cos(angle);
    const arrowY = targetY - arrowSize * Math.sin(angle);
    
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
              fill="#3b82f6" 
            />
          </marker>
        </defs>
        
        <path
          d={`M ${sourceX} ${sourceY} Q ${controlPointX} ${controlPointY} ${targetX} ${targetY}`}
          stroke="#3b82f6"
          strokeWidth="2"
          strokeDasharray="5,5"
          fill="none"
          markerEnd={`url(#arrowhead-${stream.id})`}
        />
        
        <circle
          cx={dotX}
          cy={dotY}
          r="3"
          fill="#3b82f6"
          className="animate-pulse"
        />
        
        {stream.label && (
          <text
            x={controlPointX}
            y={controlPointY - 10}
            textAnchor="middle"
            fill="#3b82f6"
            fontSize="10"
            className="pointer-events-none"
          >
            {stream.label}
          </text>
        )}
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
              Tip: Select equipment and use "Connect" button to create connections
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
              <span>Select another equipment to connect to</span>
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
