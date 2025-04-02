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
  
  const handleZoomIn = () => {
    setZoom(prevZoom => Math.min(prevZoom + 10, 200));
  };
  
  const handleZoomOut = () => {
    setZoom(prevZoom => Math.max(prevZoom - 10, 50));
  };

  const handleAddEquipment = (type: string, subType?: string) => {
    const position = { 
      x: Math.floor(Math.random() * 600) + 50, 
      y: Math.floor(Math.random() * 400) + 50 
    };
    
    const equipmentType = equipmentList.find(e => e.id === type);
    const equipmentName = subType 
      ? `${equipmentType?.name || type} (${subType})`
      : `${equipmentType?.name || type} ${equipment.filter(e => e.type === type).length + 1}`;
    
    const defaultSettings: Record<string, any> = {};
    
    if (type === "feed") {
      defaultSettings.temperature = 25;
      defaultSettings.pressure = 101.325;
      defaultSettings.flowRate = 100;
      defaultSettings.composition = {};
      selectedComponents.forEach(component => {
        defaultSettings.composition[component] = 0;
      });
    } else if (type === "reactor") {
      defaultSettings.temperature = 350;
      defaultSettings.pressure = 250;
      defaultSettings.reactionType = "CSTR";
      defaultSettings.conversion = 0.8;
    } else if (type === "heater" || type === "cooler") {
      defaultSettings.duty = type === "heater" ? 1000 : -1000;
      defaultSettings.efficiency = 0.85;
    } else if (type === "column") {
      defaultSettings.numberOfStages = 10;
      defaultSettings.feedStage = 5;
      defaultSettings.refluxRatio = 1.5;
      defaultSettings.pressure = 101.325;
    } else if (type === "valve") {
      defaultSettings.pressureDrop = 50;
      defaultSettings.valveType = "linear";
    } else if (type === "pump") {
      defaultSettings.pressureIncrease = 200;
      defaultSettings.efficiency = 0.75;
    }
    
    if (subType) {
      defaultSettings.subType = subType;
    }
    
    const newEquipment: Equipment = {
      id: `${type}-${Date.now()}`,
      type,
      name: equipmentName,
      position,
      connections: [],
      settings: defaultSettings,
      subType
    };
    
    setEquipment(prev => {
      const updated = [...prev, newEquipment];
      localStorage.setItem('chemflow-equipment', JSON.stringify(updated));
      return updated;
    });
    
    setActiveEquipment(null);
    setShowSubTypes(false);
    
    toast({
      title: "Equipment Added",
      description: `${equipmentName} has been added to the flowsheet.`,
    });
  };
  
  const handleClearCanvas = () => {
    if (window.confirm("Are you sure you want to clear the canvas? This will remove all equipment and connections.")) {
      setEquipment([]);
      setStreams([]);
      localStorage.removeItem('chemflow-equipment');
      localStorage.removeItem('chemflow-streams');
      toast({
        title: "Canvas Cleared",
        description: "All equipment and connections have been removed.",
      });
    }
  };
  
  const handleStartSimulation = () => {
    if (equipment.length === 0) {
      toast({
        title: "No Equipment",
        description: "Please add some equipment to the flowsheet first.",
        variant: "destructive"
      });
      return;
    }
    
    setSimulationRunning(true);
    
    localStorage.setItem('chemflow-active-simulation', 'true');
    localStorage.setItem('chemflow-simulation-data', JSON.stringify({
      name: "Untitled Simulation",
      date: new Date().toISOString(),
      components: selectedComponents,
      thermodynamicModel,
      equipment: equipment.length,
      streams: streams.length
    }));
    
    setTimeout(() => {
      setSimulationRunning(false);
      toast({
        title: "Simulation Complete",
        description: "The simulation has finished running.",
      });
      
      onRunSimulation();
      
      navigate('/analysis');
    }, 2000);
  };
  
  const handleSaveSettings = (equipmentId: string, newSettings: Record<string, any>) => {
    setEquipment(prev => {
      const updated = prev.map(eq => {
        if (eq.id === equipmentId) {
          const newName = newSettings._equipmentName || eq.name;
          delete newSettings._equipmentName;
          
          return {
            ...eq,
            name: newName,
            settings: {
              ...eq.settings,
              ...newSettings
            }
          };
        }
        return eq;
      });
      
      localStorage.setItem('chemflow-equipment', JSON.stringify(updated));
      return updated;
    });
    
    setShowSettings(false);
    setEditingEquipment(null);
    
    toast({
      title: "Settings Saved",
      description: "Equipment settings have been updated.",
    });
  };

  const renderEquipmentCard = (eq: Equipment) => {
    const getEquipmentIcon = () => {
      const equipmentItem = equipmentList.find(item => item.id === eq.type);
      return equipmentItem?.icon || <Container className="h-5 w-5" />;
    };
    
    return (
      <div
        key={eq.id}
        className={`absolute bg-white border rounded-lg p-3 shadow-sm w-48 ${
          selectedElement === eq.id ? 'ring-2 ring-blue-500' : ''
        } ${isDragging && draggedEquipment === eq.id ? 'opacity-60' : ''}`}
        style={{
          left: `${eq.position.x}px`,
          top: `${eq.position.y}px`,
          cursor: isDragging && draggedEquipment === eq.id ? 'grabbing' : 'grab'
        }}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedElement(eq.id);
        }}
        onMouseDown={(e) => {
          if (e.button === 0) {
            setIsDragging(true);
            setDraggedEquipment(eq.id);
            setDragStartPos({
              x: e.clientX - eq.position.x,
              y: e.clientY - eq.position.y
            });
          }
        }}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center">
            <div className="p-1.5 bg-blue-50 rounded-md text-flow-blue mr-2">
              {getEquipmentIcon()}
            </div>
            <div>
              <h4 className="text-sm font-medium leading-tight">{eq.name}</h4>
              <p className="text-xs text-gray-500 mt-0.5">{eq.type}</p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditingEquipment(eq);
              setShowSettings(true);
            }}
            className="p-1 rounded-md hover:bg-gray-100 text-gray-500"
          >
            <Settings2 className="h-3.5 w-3.5" />
          </button>
        </div>
        
        <div className="flex justify-between mt-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsConnecting(eq.id);
            }}
            className="px-2 py-1 text-xs bg-gray-50 rounded hover:bg-gray-100 text-gray-600"
          >
            Connect
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm(`Delete ${eq.name}?`)) {
                setStreams(prev => prev.filter(s => s.from !== eq.id && s.to !== eq.id));
                setEquipment(prev => {
                  const updated = prev.filter(e => e.id !== eq.id);
                  localStorage.setItem('chemflow-equipment', JSON.stringify(updated));
                  return updated;
                });
              }
            }}
            className="px-2 py-1 text-xs bg-red-50 rounded hover:bg-red-100 text-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    );
  };
  
  const renderStream = (stream: Stream) => {
    const fromEq = equipment.find(eq => eq.id === stream.from);
    const toEq = equipment.find(eq => eq.id === stream.to);
    
    if (!fromEq || !toEq) return null;
    
    const fromX = fromEq.position.x + 96;
    const fromY = fromEq.position.y + 40;
    const toX = toEq.position.x + 96;
    const toY = toEq.position.y + 40;
    
    const dx = toX - fromX;
    const dy = toY - fromY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    
    const lineColor = stream.type === 'material' 
      ? 'stroke-blue-500' 
      : stream.type === 'energy' 
        ? 'stroke-red-500' 
        : 'stroke-purple-500';
    
    return (
      <svg 
        key={`${stream.from}-${stream.to}`}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <line
          x1={fromX}
          y1={fromY}
          x2={toX}
          y2={toY}
          className={`${lineColor} ${selectedElement === stream.id ? 'stroke-[3px]' : 'stroke-[2px]'}`}
          strokeDasharray={stream.type === 'signal' ? '5,5' : ''}
        />
        
        <polygon
          points={`${toX},${toY} ${toX-8},${toY-4} ${toX-8},${toY+4}`}
          transform={`rotate(${angle}, ${toX}, ${toY})`}
          className={lineColor.replace('stroke', 'fill')}
        />
      </svg>
    );
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && draggedEquipment) {
        const canvasRect = canvasRef.current?.getBoundingClientRect();
        if (!canvasRect) return;
        
        const scale = zoom / 100;
        const scrollLeft = canvasRef.current?.scrollLeft || 0;
        const scrollTop = canvasRef.current?.scrollTop || 0;
        
        const newX = (e.clientX - canvasRect.left) / scale + scrollLeft - dragStartPos.x;
        const newY = (e.clientY - canvasRect.top) / scale + scrollTop - dragStartPos.y;
        
        setEquipment(prev => {
          const updated = prev.map(eq => {
            if (eq.id === draggedEquipment) {
              return {
                ...eq,
                position: { x: newX, y: newY }
              };
            }
            return eq;
          });
          return updated;
        });
      }
    };
    
    const handleMouseUp = () => {
      if (isDragging) {
        setEquipment(prev => {
          localStorage.setItem('chemflow-equipment', JSON.stringify(prev));
          return prev;
        });
        
        setIsDragging(false);
        setDraggedEquipment(null);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, draggedEquipment, dragStartPos, zoom]);
  
  const handleCanvasClick = () => {
    if (isConnecting) {
      setIsConnecting(null);
      return;
    }
    
    setSelectedElement(null);
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
