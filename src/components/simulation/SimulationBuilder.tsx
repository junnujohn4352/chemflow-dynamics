import React, { useState, useRef, useEffect, useCallback } from "react";
import { Plus, Minus, Thermometer, Droplets, Settings2, Container, FlaskConical, Columns, Gauge, Save, Trash2, X, Sliders, Move, ArrowLeft } from "lucide-react";
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

// Helper function to safely convert objects to strings
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
    { 
      id: "splitter", 
      name: "Splitter", 
      icon: <Columns className="h-5 w-5 rotate-90" />,
      subTypes: [
        { id: "tee", name: "Tee Splitter" },
        { id: "ratio", name: "Ratio Splitter" },
        { id: "component", name: "Component Splitter" }
      ]
    },
    { 
      id: "flash", 
      name: "Flash Separator", 
      icon: <Container className="h-5 w-5" />,
      subTypes: [
        { id: "vertical", name: "Vertical Flash" },
        { id: "horizontal", name: "Horizontal Flash" },
        { id: "threephase", name: "Three-Phase Separator" }
      ]
    },
    { 
      id: "pump", 
      name: "Pump", 
      icon: <Gauge className="h-5 w-5" />,
      subTypes: [
        { id: "centrifugal", name: "Centrifugal Pump" },
        { id: "positive", name: "Positive Displacement" },
        { id: "vacuum", name: "Vacuum Pump" }
      ]
    },
    { 
      id: "heatex", 
      name: "Heat Exchanger", 
      icon: <Thermometer className="h-5 w-5" />,
      subTypes: [
        { id: "shell", name: "Shell & Tube" },
        { id: "plate", name: "Plate" },
        { id: "spiral", name: "Spiral" },
        { id: "double-pipe", name: "Double-Pipe" }
      ]
    },
    { 
      id: "compressor", 
      name: "Compressor", 
      icon: <Gauge className="h-5 w-5" />,
      subTypes: [
        { id: "centrifugal", name: "Centrifugal Compressor" },
        { id: "reciprocating", name: "Reciprocating Compressor" },
        { id: "screw", name: "Screw Compressor" }
      ]
    },
    { 
      id: "valve", 
      name: "Valve", 
      icon: <Sliders className="h-5 w-5" />,
      subTypes: [
        { id: "control", name: "Control Valve" },
        { id: "relief", name: "Relief Valve" },
        { id: "check", name: "Check Valve" },
        { id: "ball", name: "Ball Valve" }
      ]
    },
    { 
      id: "crystallizer", 
      name: "Crystallizer", 
      icon: <FlaskConical className="h-5 w-5" />,
      subTypes: [
        { id: "batch", name: "Batch Crystallizer" },
        { id: "continuous", name: "Continuous Crystallizer" },
        { id: "cooling", name: "Cooling Crystallizer" }
      ]
    },
    { 
      id: "dryer", 
      name: "Dryer", 
      icon: <Thermometer className="h-5 w-5" />,
      subTypes: [
        { id: "tray", name: "Tray Dryer" },
        { id: "rotary", name: "Rotary Dryer" },
        { id: "spray", name: "Spray Dryer" },
        { id: "fluidized", name: "Fluidized Bed Dryer" }
      ]
    },
  ];
  
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current || !activeEquipment) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const activeEquipmentInfo = equipmentList.find(item => item.id === activeEquipment);
    if (activeEquipmentInfo) {
      const newEquipment: Equipment = {
        id: `${activeEquipment}-${Date.now()}`,
        type: activeEquipment,
        name: activeSubType 
          ? `${activeEquipmentInfo.name} (${activeSubType})` 
          : activeEquipmentInfo.name,
        position: { x, y },
        connections: [],
        settings: getDefaultSettings(activeEquipment),
        subType: activeSubType || undefined
      };
      
      setEquipment(prev => [...prev, newEquipment]);
      toast({
        title: "Equipment Added",
        description: `${newEquipment.name} has been added to the flowsheet`
      });
      
      setActiveEquipment(null);
      setActiveSubType(null);
      setShowSubTypes(false);
    }
  };

  const getDefaultSettings = (type: string): Record<string, any> => {
    switch(type) {
      case "feed":
        return { 
          temperature: 25,
          pressure: 101.3,
          flowRate: 100,
          composition: selectedComponents.reduce((acc, id) => {
            acc[id] = 100 / selectedComponents.length;
            return acc;
          }, {} as Record<string, number>)
        };
      case "heater":
        return { 
          targetTemperature: 80,
          pressure: 101.3,
          heatDuty: 500 
        };
      case "cooler":
        return { 
          targetTemperature: 15,
          pressure: 101.3,
          coolingDuty: 500 
        };
      case "flash":
        return { 
          temperature: 60,
          pressure: 80,
          vaporFraction: 0.5
        };
      case "column":
        return { 
          numberOfStages: 20,
          feedStage: 10,
          refluxRatio: 1.5,
          reboilerDuty: 1000,
          condenserDuty: -900,
          topPressure: 101.3,
          bottomPressure: 110
        };
      case "pump":
        return { 
          pressureIncrease: 200,
          efficiency: 0.75
        };
      case "reactor":
        return { 
          temperature: 120,
          pressure: 150,
          conversion: 0.8,
          reactionType: "CSTR"
        };
      case "mixer":
        return { 
          pressure: 101.3
        };
      case "splitter":
        return { 
          splitRatio: 0.5,
          pressure: 101.3
        };
      case "heatex":
        return {
          hotInletTemp: 120,
          hotOutletTemp: 80,
          coldInletTemp: 25,
          coldOutletTemp: 60,
          heatTransferCoeff: 800,
          pressure: 101.3
        };
      case "compressor":
        return {
          pressureRatio: 3,
          efficiency: 0.75
        };
      case "valve":
        return {
          outletPressure: 101.3,
          valveType: "linear"
        };
      default:
        return {};
    }
  };
  
  const handleEquipmentClick = (e: React.MouseEvent, equipmentId: string) => {
    e.stopPropagation();
    
    if (isConnecting) {
      if (isConnecting !== equipmentId) {
        const newStream: Stream = {
          id: `stream-${Date.now()}`,
          from: isConnecting,
          to: equipmentId,
          type: "material",
          properties: {}
        };
        
        setStreams(prev => [...prev, newStream]);
        
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
      setSelectedElement(equipmentId);
    }
  };
  
  const startConnectionWithEvent = (e: React.MouseEvent, equipmentId: string) => {
    e.stopPropagation();
    setIsConnecting(equipmentId);
    toast({
      description: "Click on another equipment to create a connection"
    });
  };
  
  const startDragging = (e: React.MouseEvent, equipmentId: string) => {
    e.stopPropagation();
    const equipmentItem = equipmentList.find(eq => eq.id === equipmentId);
    if (!equipmentItem) return;
    
    setDraggedEquipment(equipmentId);
    setDragStartPos({ x: e.clientX, y: e.clientY });
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
    
    toast({
      description: "Dragging equipment - click to place",
    });
  };
  
  const handleDragMove = useCallback((e: MouseEvent) => {
    if (!draggedEquipment || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const deltaX = (e.clientX - dragStartPos.x) / (zoom / 100);
    const deltaY = (e.clientY - dragStartPos.y) / (zoom / 100);
    
    setEquipment(prev => prev.map(eq => {
      if (eq.id === draggedEquipment) {
        return {
          ...eq,
          position: {
            x: eq.position.x + deltaX,
            y: eq.position.y + deltaY
          }
        };
      }
      return eq;
    }));
    
    setDragStartPos({ x: e.clientX, y: e.clientY });
  }, [draggedEquipment, dragStartPos, zoom]);
  
  const handleDragEnd = useCallback(() => {
    setDraggedEquipment(null);
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
    
    localStorage.setItem('chemflow-equipment', JSON.stringify(equipment));
  }, [equipment, handleDragMove]);
  
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
    };
  }, [handleDragMove, handleDragEnd]);
  
  const deleteSelected = () => {
    if (!selectedElement) return;
    
    setEquipment(prev => prev.filter(eq => eq.id !== selectedElement));
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
  
  const saveFlowsheet = (simulationName = "Untitled Simulation") => {
    const timestamp = new Date().toISOString();
    
    const simulationData = {
      equipment,
      streams,
      components: selectedComponents,
      thermodynamicModel,
      lastUpdated: timestamp,
      name: simulationName
    };
    
    localStorage.setItem('chemflow-equipment', JSON.stringify(equipment));
    localStorage.setItem('chemflow-streams', JSON.stringify(streams));
    localStorage.setItem('chemflow-simulation-data', JSON.stringify(simulationData));
    localStorage.setItem('chemflow-active-simulation', 'true');
    
    const existingSimulations = localStorage.getItem('chemflow-simulations');
    let simulationsList = existingSimulations ? JSON.parse(existingSimulations) : [];
    
    const existingIndex = simulationsList.findIndex((sim: any) => 
      sim.name === simulationName && 
      JSON.stringify(sim.components) === JSON.stringify(selectedComponents)
    );
    
    if (existingIndex !== -1) {
      simulationsList[existingIndex] = {
        ...simulationsList[existingIndex],
        equipment: equipment.length,
        streams: streams.length,
        lastUpdated: timestamp,
        thermodynamicModel
      };
    } else {
      simulationsList.push({
        id: `sim-${Date.now()}`,
        name: simulationName,
        description: `Process simulation with ${selectedComponents.length} components`,
        lastUpdated: timestamp,
        equipment: equipment.length,
        streams: streams.length,
        components: selectedComponents.map(comp => ({
          name: comp,
          percentage: 100 / selectedComponents.length
        })),
        efficiency: Math.floor(70 + Math.random() * 25),
        thermodynamicModel
      });
    }
    
    localStorage.setItem('chemflow-simulations', JSON.stringify(simulationsList));
    
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
    
    saveFlowsheet();
    
    localStorage.setItem('chemflow-simulation-running', 'true');
    setSimulationRunning(true);
    
    toast({
      title: "Running Simulation",
      description: "Calculating process flows and conditions..."
    });
    
    onRunSimulation();
    
    const analysisTabElement = document.getElementById('analysis-tab');
    if (analysisTabElement) {
      analysisTabElement.click();
    }
  };

  const openEquipmentSettings = (equipment: Equipment) => {
    setEditingEquipment(equipment);
  };

  const updateEquipmentSettings = (equipmentId: string, newSettings: Record<string, any>) => {
    const { _equipmentName, ...restSettings } = newSettings;
    setEquipment(prev => 
      prev.map(eq => {
        if (eq.id === equipmentId) {
          return { 
            ...eq, 
            name: _equipmentName || eq.name,
            settings: restSettings
          };
        }
        return eq;
      })
    );
    
    setShowSettings(false);
    
    toast({
      title: "Settings updated",
      description: "Equipment settings have been updated successfully"
    });
  };
  
  const handleEquipmentSelect = (equipmentId: string) => {
    const equipment = equipmentList.find(eq => eq.id === equipmentId);
    
    if (equipment?.subTypes && equipment.subTypes.length > 0) {
      setActiveEquipment(equipmentId);
      setShowSubTypes(true);
    } else {
      setActiveEquipment(equipmentId);
      setShowSubTypes(false);
      setActiveSubType(null);
    }
  };
  
  const handleSubTypeSelect = (subTypeId: string, subTypeName: string) => {
    setActiveSubType(subTypeId);
    setShowSubTypes(false);
    
    toast({
      description: `Selected ${subTypeName}. Click on canvas to place.`
    });
  };
  
  const getEquipmentColor = (type: string) => {
    switch (type) {
      case 'feed': return 'bg-blue-100 text-blue-800';
      case 'reactor': return 'bg-red-100 text-red-800';
      case 'column': return 'bg-green-100 text-green-800';
      case 'heater': return 'bg-orange-100 text-orange-800';
      case 'cooler': return 'bg-teal-100 text-teal-800';
      case 'mixer': return 'bg-purple-100 text-purple-800';
      case 'splitter': return 'bg-yellow-100 text-yellow-800';
      case 'flash': return 'bg-pink-100 text-pink-800';
      case 'pump': return 'bg-indigo-100 text-indigo-800';
      case 'heatex': return 'bg-lime-100 text-lime-800';
      case 'compressor': return 'bg-cyan-100 text-cyan-800';
      case 'valve': return 'bg-rose-100 text-rose-800';
      case 'crystallizer': return 'bg-amber-100 text-amber-800';
      case 'dryer': return 'bg-fuchsia-100 text-fuchsia-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getEquipmentIcon = (type: string) => {
    switch (type) {
      case 'feed': return <Droplets className="h-5 w-5" />;
      case 'reactor': return <FlaskConical className="h-5 w-5" />;
      case 'column': return <Columns className="h-5 w-5" />;
      case 'heater': return <Thermometer className="h-5 w-5" />;
      case 'cooler': return <Thermometer className="h-5 w-5" />;
      case 'mixer': return <Columns className="h-5 w-5" />;
      case 'splitter': return <Columns className="h-5 w-5 rotate-90" />;
      case 'flash': return <Container className="h-5 w-5" />;
      case 'pump': return <Gauge className="h-5 w-5" />;
      case 'heatex': return <Thermometer className="h-5 w-5" />;
      case 'compressor': return <Gauge className="h-5 w-5" />;
      case 'valve': return <Sliders className="h-5 w-5" />;
      case 'crystallizer': return <FlaskConical className="h-5 w-5" />;
      case 'dryer': return <Thermometer className="h-5 w-5" />;
      default: return <FlaskConical className="h-5 w-5" />;
    }
  };
  
  const getSubTypeName = (type: string, subType: string) => {
    const equipment = equipmentList.find(e => e.id === type);
    if (equipment && equipment.subTypes) {
      const subTypeObj = equipment.subTypes.find(st => st.id === subType);
      return subTypeObj ? subTypeObj.name : subType;
    }
    return subType;
  };
  
  const handleCanvasMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !draggedEquipment || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setEquipment(prev => prev.map(eq => {
      if (eq.id === draggedEquipment) {
        return { ...eq, position: { x, y } };
      }
      return eq;
    }));
  }, [isDragging, draggedEquipment]);
  
  const handleDragStart = (e: React.MouseEvent, equipmentId: string) => {
    e.stopPropagation();
    setIsDragging(true);
    setDraggedEquipment(equipmentId);
    setSelectedElement(equipmentId);
  };
  
  const completeConnection = (targetEquipmentId: string) => {
    if (!isConnecting || isConnecting === targetEquipmentId) {
      setIsConnecting(null);
      return;
    }
    
    const newStream: Stream = {
      id: `stream-${Date.now()}`,
      from: isConnecting,
      to: targetEquipmentId,
      type: "material",
      properties: {}
    };
    
    setStreams(prev => [...prev, newStream]);
    
    setEquipment(prev => 
      prev.map(eq => {
        if (eq.id === isConnecting) {
          return {...eq, connections: [...eq.connections, targetEquipmentId]};
        }
        if (eq.id === targetEquipmentId) {
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
  };
  
  const deleteEquipment = (equipmentId: string) => {
    setEquipment(prev => prev.filter(eq => eq.id !== equipmentId));
    setStreams(prev => prev.filter(
      stream => stream.from !== equipmentId && stream.to !== equipmentId
    ));
    setSelectedElement(null);
    toast({
      title: "Deleted",
      description: "Equipment has been removed from the flowsheet"
    });
  };
  
  const handleSaveFlowsheet = () => {
    saveFlowsheet(localStorage.getItem('chemflow-simulation-name') || "Untitled Simulation");
  };
  
  const startConnection = (equipmentId: string) => {
    setIsConnecting(equipmentId);
    setSelectedElement(null);
    toast({
      description: "Click on another equipment to create a connection"
    });
  };
  
  const editStream = (streamId: string) => {
    // Placeholder for stream editing logic
    toast({
      description: "Stream editing is not yet implemented"
    });
  };
  
  const deleteStream = (streamId: string) => {
    setStreams(prev => prev.filter(stream => stream.id !== streamId));
    setSelectedElement(null);
    toast({
      title: "Deleted",
      description: "Stream has been removed from the flowsheet"
    });
  };
  
  const renderStream = (stream: Stream) => {
    if (!stream) return null;
    
    const fromEquipment = equipment.find(eq => eq.id === stream.from);
    const toEquipment = equipment.find(eq => eq.id === stream.to);
    const isSelected = selectedElement === stream.id;
    
    if (!fromEquipment || !toEquipment) return null;
    
    const fromPos = fromEquipment.position;
    const toPos = toEquipment.position;
    
    const fromOffset = { x: 60, y: 50 };
    const toOffset = { x: 60, y: 50 };
    
    const startX = fromPos.x;
    const startY = fromPos.y;
    const endX = toPos.x;
    const endY = toPos.y;
    
    const streamColor = stream.type === 'signal' ? '#10B981' : '#4F46E5';
    
    return (
      <div 
        key={stream.id} 
        className={`absolute ${isSelected ? 'z-20' : 'z-10'}`}
        style={{
          left: `${startX}px`,
          top: `${startY}px`,
          width: `${Math.max(1, Math.abs(endX - startX))}px`,
          height: `${Math.max(1, Math.abs(endY - startY))}px`,
        }}
      >
        {/* Stream line rendering */}
        <svg 
          className="absolute top-0 left-0 w-full h-full overflow-visible"
          onClick={() => setSelectedElement(stream.id)}
        >
          <line
            x1={fromOffset.x}
            y1={fromOffset.y}
            x2={toOffset.x}
            y2={toOffset.y}
            stroke={streamColor}
            strokeWidth={isSelected ? 3 : 2}
            strokeDasharray={stream.type === 'signal' ? "5,5" : "none"}
            markerEnd={`url(#${stream.type === 'signal' ? 'signalArrow' : 'materialArrow'})`}
          />
        </svg>
        
        {isSelected && (
          <div className="absolute flex space-x-1" style={{
            left: `${(fromOffset.x + toOffset.x) / 2}px`,
            top: `${(fromOffset.y + toOffset.y) / 2}px`,
            transform: 'translate(-50%, -50%)'
          }}>
            <button 
              className="p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
              onClick={() => deleteStream(stream.id)}
            >
              <Trash2 className="h-3 w-3" />
            </button>
            <button 
              className="p-1 bg-blue-100 rounded-full text-blue-600 hover:bg-blue-200"
              onClick={() => editStream(stream.id)}
            >
              <Settings2 className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
    );
  };
  
  const renderEquipment = (item: Equipment) => {
    if (!item) return null;
    
    const isSelected = selectedElement === item.id;
    
    return (
      <div 
        key={item.id}
        className={`absolute cursor-grab bg-white rounded-lg border ${isSelected ? 'ring-2 ring-blue-500 z-30' : 'z-20'} transition-shadow hover:shadow-md`}
        style={{
          left: `${item.position.x}px`,
          top: `${item.position.y}px`,
          width: '120px',
          height: '100px',
          transform: 'translate(-50%, -50%)'
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (isConnecting) {
            completeConnection(item.id);
          } else {
            setSelectedElement(item.id);
          }
        }}
        onMouseDown={(e) => handleDragStart(e, item.id)}
      >
        <div className="relative h-full flex flex-col items-center justify-center p-2">
          <div className={`p-2 rounded-full ${getEquipmentColor(item.type)}`}>
            {getEquipmentIcon(item.type)}
          </div>
          <div className="mt-2 text-center">
            <p className="text-xs font-medium truncate max-w-full">{safeStringify(item.name) || 'Equipment'}</p>
            {item.subType && (
              <p className="text-xs text-gray-500 truncate max-w-full">
                {getSubTypeName(item.type, item.subType) || item.subType}
              </p>
            )}
          </div>
          
          {isSelected && (
            <div className="absolute -top-3 -right-3 flex space-x-1">
              {!isConnecting && (
                <>
                  <button 
                    className="p-1 bg-green-100 rounded-full text-green-600 hover:bg-green-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      startConnection(item.id);
                    }}
                    title="Connect"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                  <button 
                    className="p-1 bg-blue-100 rounded-full text-blue-600 hover:bg-blue-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEquipmentSettings(item);
                    }}
                    title="Settings"
                  >
                    <Settings2 className="h-3 w-3" />
                  </button>
                  <button 
                    className="p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteEquipment(item.id);
                    }}
                    title="Delete"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </>
              )}
              {isConnecting && isConnecting === item.id && (
                <button 
                  className="p-1 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsConnecting(null);
                  }}
                  title="Cancel"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div
        ref={canvasRef}
        className="flex-1 relative border border-gray-200 rounded-lg bg-gray-50 overflow-hidden"
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMouseMove}
      >
        {streams.map(stream => renderStream(stream))}
        
        {equipment.map(item => renderEquipment(item))}
      </div>
      
      {editingEquipment && (
        <EquipmentSettings 
          equipment={editingEquipment}
          equipmentTypes={equipmentList}
          onClose={() => setEditingEquipment(null)}
          onSave={updateEquipmentSettings}
        />
      )}
      
      <div className="flex justify-between items-center mt-4 border-t border-gray-200 pt-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={clearCanvas}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Clear
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveFlowsheet}
          >
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>
        
        <Button
          onClick={runSimulation}
          disabled={simulationRunning}
        >
          Run Simulation
        </Button>
      </div>
    </div>
  );
};

export default SimulationBuilder;
