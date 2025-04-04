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
    heatExchanger: {
      hotInletTemp: 120, // °C
      hotOutletTemp: 80, // °C
      coldInletTemp: 25, // °C
      coldOutletTemp: 65, // °C
      pressure: 150, // kPa
      heatDuty: 250, // kW
      efficiency: 85, // %
      exchangerType: "Shell and Tube"
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
    heatExchanger: [
      { id: 'hotIn', type: 'input', position: 'top' },
      { id: 'hotOut', type: 'output', position: 'bottom' },
      { id: 'coldIn', type: 'input', position: 'left' },
      { id: 'coldOut', type: 'output', position: 'right' }
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
  
  // Define the equipment list with their types
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
      id: "heatExchanger", 
      name: "Heat Exchanger", 
      icon: <Thermometer className="h-5 w-5" />,
      subTypes: [
        { id: "shellAndTube", name: "Shell and Tube" },
        { id: "plateAndFrame", name: "Plate and Frame" },
        { id: "doublePane", name: "Double Pane" },
        { id: "spiral", name: "Spiral" },
        { id: "airCooled", name: "Air Cooled" }
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
    setZoom((prevZoom) => Math.min(prevZoom + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom - 10, 20));
  };

  const handlePanCanvas = (deltaX: number, deltaY: number) => {
    setCanvasOffset((prevOffset) => ({
      x: prevOffset.x + deltaX,
      y: prevOffset.y + deltaY,
    }));
  };

  const handleAddEquipment = (type: string, subType: string | null = null) => {
    const newEquipment: Equipment = {
      id: `equipment-${Date.now()}`,
      type: type,
      subType: subType,
      name: type.charAt(0).toUpperCase() + type.slice(1),
      position: { x: 100, y: 100 },
      connections: [],
      settings: defaultParameters[type] || {},
      ports: equipmentPorts[type] || []
    };
    setEquipment([...equipment, newEquipment]);
  };

  const handleClearCanvas = () => {
    setEquipment([]);
    setStreams([]);
    setSelectedElement(null);
    setActiveEquipment(null);
    setStreamAnimations({});
    toast({
      title: "Canvas cleared",
      description: "All equipment and streams have been removed."
    });
  };

  const handleStartSimulation = () => {
    setSimulationRunning(true);
    setStreamAnimations(prevAnimations => {
      const newAnimations = {};
      streams.forEach(stream => {
        newAnimations[stream.id] = true;
      });
      return newAnimations;
    });

    setTimeout(() => {
      setSimulationRunning(false);
      setStreamAnimations({});
      toast({
        title: "Simulation complete",
        description: "The simulation has finished running."
      });
    }, 5000);
  };

  const handleSaveSettings = (equipmentId: string, newSettings: Record<string, any>) => {
    setEquipment(prevEquipment =>
      prevEquipment.map(eq =>
        eq.id === equipmentId ? { ...eq, settings: newSettings } : eq
      )
    );
    toast({
      title: "Settings saved",
      description: `Settings for ${equipment.find(eq => eq.id === equipmentId)?.name} have been updated.`
    });
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isConnecting) {
      setIsConnecting(null);
    }
    setSelectedElement(null);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMoving) {
      setIsDragging(true);
      setDragStartPos({
        x: e.clientX - canvasRef.current!.offsetLeft - canvasOffset.x,
        y: e.clientY - canvasRef.current!.offsetTop - canvasOffset.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCanvasMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !canvasRef.current) return;

    e.preventDefault();

    const x = e.clientX - canvasRef.current.offsetLeft - canvasOffset.x;
    const y = e.clientY - canvasRef.current.offsetTop - canvasOffset.y;

    setCanvasOffset({
      x: x - dragStartPos.x,
      y: y - dragStartPos.y
    });
  }, [isDragging, dragStartPos, canvasOffset]);

  useEffect(() => {
    if (isMoving) {
      document.addEventListener('mousemove', handleCanvasMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleCanvasMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleCanvasMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isMoving, handleCanvasMouseMove]);

  const handleEquipmentClick = (event: React.MouseEvent, equipmentId: string) => {
    event.stopPropagation();
    setSelectedElement(equipmentId);
    setActiveEquipment(equipmentId);
  };

  const handlePortClick = (event: React.MouseEvent, equipmentId: string, portId?: string) => {
    event.stopPropagation();
    if (isConnecting) {
      if (isConnecting.id === equipmentId && isConnecting.portId === portId) {
        setIsConnecting(null);
        return;
      }

      const sourceEquipment = equipment.find((eq) => eq.id === isConnecting.id);
      const targetEquipment = equipment.find((eq) => eq.id === equipmentId);

      if (!sourceEquipment || !targetEquipment) {
        toast({
          title: "Error creating stream",
          description: "Could not find equipment for the stream.",
          variant: "destructive"
        });
        setIsConnecting(null);
        return;
      }

      const streamType = "material";

      const newStream: Stream = {
        id: `stream-${Date.now()}`,
        from: isConnecting.id,
        fromPort: isConnecting.portId,
        to: equipmentId,
        toPort: portId,
        type: streamType,
        properties: {}
      };

      setStreams([...streams, newStream]);
      setIsConnecting(null);
      setSelectedElement(newStream.id);
      toast({
        title: "Stream created",
        description: `A new ${streamType} stream has been created between ${sourceEquipment.name} and ${targetEquipment.name}.`
      });
    } else {
      handleStartConnection(equipmentId, portId);
    }
  };

  const handleStartConnection = (equipmentId: string, portId?: string) => {
    setIsConnecting({ id: equipmentId, portId: portId });
    setSelectedElement(equipmentId);
  };

  const handleEquipmentDragStart = (event: React.DragEvent, equipmentId: string) => {
    setDraggedEquipment(equipmentId);
    setDragStartPos({ x: event.clientX, y: event.clientY });
  };

  const handleEquipmentDragEnd = (event: React.DragEvent) => {
    if (!draggedEquipment || !canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - canvasRect.left;
    const y = event.clientY - canvasRect.top;

    setEquipment((prevEquipment) =>
      prevEquipment.map((eq) =>
        eq.id === draggedEquipment
          ? { ...eq, position: { x: x - 50, y: y - 50 } }
          : eq
      )
    );
    setDraggedEquipment(null);
  };

  const handleStartMove = () => {
    setIsMoving(!isMoving);
    toast({
      title: isMoving ? "Pan disabled" : "Pan enabled",
      description: isMoving ? "You can no longer pan the canvas" : "You can now pan the canvas by dragging"
    });
  };

  const handleOpenSettings = (equipment: Equipment) => {
    setEditingEquipment(equipment);
    setShowSettings(true);
  };

  const handleDeleteEquipment = (equipmentId: string) => {
    setEquipment((prevEquipment) => prevEquipment.filter((eq) => eq.id !== equipmentId));
    setStreams((prevStreams) =>
      prevStreams.filter(
        (stream) => stream.from !== equipmentId && stream.to !== equipmentId
      )
    );
    setSelectedElement(null);
    setActiveEquipment(null);
    toast({
      title: "Equipment deleted",
      description: "The equipment has been removed from the canvas."
    });
  };

  const renderPort = (equipment: Equipment, port: any) => {
    const portPosition = {
      left: '0%',
      right: '100%',
      top: '50%',
      bottom: '100%',
      center: '50%'
    };
    
    let x = 0;
    let y = 0;
    
    switch (port.position) {
      case 'left':
        x = -10;
        y = 20;
        break;
      case 'right':
        x = 100;
        y = 20;
        break;
      case 'top':
        x = 40;
        y = -10;
        break;
      case 'bottom':
        x = 40;
        y = 50;
        break;
      default:
        x = 25;
        y = 25;
        break;
    }
    
    const isPortConnecting = isConnecting && isConnecting.id === equipment.id && isConnecting.portId === port.id;
    
    return (
      <div
        key={port.id}
        className={`port ${port.type} ${isPortConnecting ? 'connecting' : ''}`}
        style={{
          position: 'absolute',
          left: `calc(${x}% - 5px)`,
          top: `calc(${y}% - 5px)`,
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          backgroundColor: port.type === 'input' ? 'blue' : 'red',
          cursor: 'pointer',
          zIndex: 2,
          transition: 'background-color 0.3s ease'
        }}
        onClick={(event) => handlePortClick(event, equipment.id, port.id)}
      />
    );
  };

  const renderEquipmentCard = (eq: Equipment) => {
    const isSelected = selectedElement === eq.id;
    const isConnectingTo = isConnecting && isConnecting.id === eq.id;
    const isActive = activeEquipment === eq.id;
    const defaultWidth = 80;
    const defaultHeight = 40;
    
    return (
      <div
        key={eq.id}
        id={eq.id}
        className={`equipment-card ${eq.type} ${isSelected ? 'selected' : ''} ${isConnectingTo ? 'connecting-to' : ''} ${isActive ? 'active' : ''}`}
        style={{
          position: 'absolute',
          left: eq.position.x,
          top: eq.position.y,
          width: `${defaultWidth}px`,
          height: `${defaultHeight}px`,
          border: '2px solid #ccc',
          borderRadius: '8px',
          backgroundColor: '#fff',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: isSelected ? 1 : 0,
          transition: 'border-color 0.3s ease'
        }}
        onClick={(event) => handleEquipmentClick(event, eq.id)}
        onDragStart={(event) => handleEquipmentDragStart(event, eq.id)}
        onDragEnd={handleEquipmentDragEnd}
        draggable
      >
        <div className="equipment-header" style={{ marginBottom: '5px', fontSize: '0.8em' }}>
          {eq.name}
        </div>
        <div className="equipment-icon" style={{ fontSize: '1.2em' }}>
          {equipmentList.find(e => e.id === eq.type)?.icon}
        </div>
        {eq.ports && eq.ports.map(port => renderPort(eq, port))}
      </div>
    );
  };

  const renderStream = (stream: Stream) => {
    const fromEquipment = equipment.find((eq) => eq.id === stream.from);
    const toEquipment = equipment.find((eq) => eq.id === stream.to);

    if (!fromEquipment || !toEquipment) {
      return null;
    }

    const fromPort = fromEquipment.ports?.find(port => port.id === stream.fromPort);
    const toPort = toEquipment.ports?.find(port => port.id === stream.toPort);

    const startX = fromEquipment.position.x + (fromPort?.position === 'left' ? 0 : fromPort?.position === 'right' ? 80 : 40);
    const startY = fromEquipment.position.y + (fromPort?.position === 'top' ? 0 : fromPort?.position === 'bottom' ? 40 : 20);
    const endX = toEquipment.position.x + (toPort?.position === 'left' ? 0 : toPort?.position === 'right' ? 80 : 40);
    const endY = toEquipment.position.y + (toPort?.position === 'top' ? 0 : toPort?.position === 'bottom' ? 40 : 20);

    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const isSelected = selectedElement === stream.id;
    const animationDuration = 2;
    
    return (
      <div key={stream.id} style={{
        position: 'absolute',
        left: startX,
        top: startY,
        width: distance,
        height: '2px',
        backgroundColor: stream.type === 'material' ? 'blue' : 'red',
        transformOrigin: 'top left',
        transform: `rotate(${angle}deg)`,
        zIndex: isSelected ? 1 : 0,
        cursor: 'pointer',
        overflow: 'hidden'
      }}
      onClick={() => setSelectedElement(stream.id)}
      >
        {streamAnimations[stream.id] && (
          <div style={{
            position: 'absolute',
            left: '-10px',
            top: '-1px',
            width: '20px',
            height: '4px',
            backgroundColor: 'white',
            borderRadius: '2px',
            animation: `streamAnimation ${animationDuration}s linear infinite`
          }}></div>
        )}
        <style>
          {`
            @keyframes streamAnimation {
              0% { transform: translateX(0); }
              100% { transform: translateX(${distance}px); }
            }
          `}
        </style>
      </div>
    );
  };

  const renderAnalysisSection = () => {
    if (!activeEquipment) return null;

    const eq = equipment.find(e => e.id === activeEquipment);
    if (!eq) return null;

    return (
      <div className="analysis-section">
        <h3>{eq.name} Analysis</h3>
        <p>Type: {eq.type}</p>
        {eq.subType && <p>Subtype: {eq.subType}</p>}
        <h4>Settings:</h4>
        <pre>{safeStringify(eq.settings)}</pre>
      </div>
    );
  };

  return (
    <div className="simulation-builder">
      <div className="toolbar">
        <Button onClick={handleZoomIn}><Plus className="h-4 w-4" /></Button>
        <Button onClick={handleZoomOut}><Minus className="h-4 w-4" /></Button>
        <Button onClick={handleStartMove}><Move className="h-4 w-4" /></Button>
        <Button onClick={() => handlePanCanvas(-100, 0)}><ArrowLeft className="h-4 w-4" /></Button>
        <Button onClick={handleClearCanvas}><Trash2 className="h-4 w-4" /></Button>
        <Button onClick={handleStartSimulation}><Play className="h-4 w-4" /></Button>
        <Button onClick={() => setShowSubTypes(!showSubTypes)}><ChevronsUpDown className="h-4 w-4" /></Button>
        {equipmentList.map((eq) => (
          <div key={eq.id} className="equipment-button">
            <Button onClick={() => handleAddEquipment(eq.id)}>
              {eq.name}
            </Button>
            {showSubTypes && eq.subTypes && (
              <div className="subtype-buttons">
                {eq.subTypes.map((subType) => (
                  <Button key={subType.id} onClick={() => handleAddEquipment(eq.id, subType.id)}>
                    {subType.name}
                  </Button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div
        className="canvas"
        ref={canvasRef}
        style={{
          width: canvasDimensions.width,
          height: canvasDimensions.height,
          backgroundColor: '#f0f0f0',
          overflow: 'hidden',
          cursor: isMoving ? 'grab' : 'default',
          transform: `scale(${zoom / 100}) translate(${canvasOffset.x}px, ${canvasOffset.y}px)`,
          transformOrigin: 'top left'
        }}
        onClick={handleCanvasClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        {equipment.map((eq) => renderEquipmentCard(eq))}
        {streams.map((stream) => renderStream(stream))}
      </div>

      {renderAnalysisSection()}

      {editingEquipment && (
        <EquipmentSettings
          equipment={editingEquipment}
          onSave={(newSettings) => {
            handleSaveSettings(editingEquipment.id, newSettings);
            setEditingEquipment(null);
            setShowSettings(false);
          }}
          onClose={() => {
            setEditingEquipment(null);
            setShowSettings(false);
          }}
          showSettings={showSettings}
        />
      )}
    </div>
  );
};

export default SimulationBuilder;
