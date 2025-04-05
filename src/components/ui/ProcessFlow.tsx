
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import EquipmentCard from "./EquipmentCard";
import GlassPanel from "./GlassPanel";
import { 
  ArrowRight, 
  Columns,
  Database, 
  Download, 
  LineChart, 
  Play, 
  Square,
  Settings2, 
  Share2,
  Link,
  ChevronDown,
  ChevronUp,
  Plus,
  Layers,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface ProcessFlowProps {
  className?: string;
  onStartSimulation?: () => void;
}

interface Equipment {
  id: string;
  type: string;
  name: string;
  status: string;
  metrics: any;
  position: { x: number; y: number };
  connections?: string[];
}

interface Connection {
  id: string;
  source: string;
  target: string;
  animated: boolean;
}

const renderMetricValue = (metric: any): string => {
  if (metric === null || metric === undefined) {
    return '';
  }
  
  if (typeof metric === 'object') {
    try {
      return JSON.stringify(metric);
    } catch (e) {
      return '[Object]';
    }
  }
  
  return String(metric);
};

const ProcessFlow: React.FC<ProcessFlowProps> = ({ className, onStartSimulation }) => {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [simulationData, setSimulationData] = useState({
    componentA: 0,
    componentB: 0,
    systemEfficiency: 0
  });
  
  const [equipment, setEquipment] = useState<Equipment[]>([
    { 
      id: 'feed-tank', 
      type: 'tank', 
      name: 'Feed Tank', 
      status: 'stopped', 
      metrics: { level: 75, temperature: 25 },
      position: { x: 0, y: 0 },
      connections: []
    },
    { 
      id: 'feed-pump', 
      type: 'pump', 
      name: 'Feed Pump', 
      status: 'stopped', 
      metrics: { flow: 120 },
      position: { x: 2, y: 0 },
      connections: []
    },
    { 
      id: 'heat-exchanger', 
      type: 'heat-exchanger', 
      name: 'Heat Exchanger', 
      status: 'stopped', 
      metrics: { temperature: 65 },
      position: { x: 0, y: 1 },
      connections: []
    },
    { 
      id: 'preheater', 
      type: 'heater', 
      name: 'Preheater', 
      status: 'stopped', 
      metrics: { temperature: 25 },
      position: { x: 2, y: 1 },
      connections: []
    },
    { 
      id: 'reactor', 
      type: 'reactor', 
      name: 'Main Reactor', 
      status: 'stopped', 
      metrics: { temperature: 75, pressure: 180 },
      position: { x: 0, y: 2 },
      connections: []
    },
    { 
      id: 'distillation-column', 
      type: 'column', 
      name: 'Distillation Column', 
      status: 'stopped', 
      metrics: { pressure: 150, temperature: 30 },
      position: { x: 2, y: 2 },
      connections: []
    },
    { 
      id: 'filter', 
      type: 'filter', 
      name: 'Particulate Filter', 
      status: 'stopped', 
      metrics: { flow: 85, pressure: 160 },
      position: { x: 0, y: 3 },
      connections: []
    },
    { 
      id: 'separator', 
      type: 'separator', 
      name: 'Phase Separator', 
      status: 'stopped', 
      metrics: { temperature: 45, pressure: 130 },
      position: { x: 2, y: 3 },
      connections: []
    },
    { 
      id: 'product-tank', 
      type: 'tank', 
      name: 'Product Tank', 
      status: 'stopped', 
      metrics: { level: 10, temperature: 25 },
      position: { x: 0, y: 4 },
      connections: []
    },
    { 
      id: 'condenser', 
      type: 'condenser', 
      name: 'Condenser', 
      status: 'stopped', 
      metrics: { temperature: 25 },
      position: { x: 2, y: 4 },
      connections: []
    }
  ]);
  
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string | null>(null);
  const [tempName, setTempName] = useState("");
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [connectMode, setConnectMode] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [showEquipmentPalette, setShowEquipmentPalette] = useState(false);
  
  // Equipment palette categories
  const equipmentCategories = [
    {
      name: "Heat Transfer",
      types: [
        { type: "heat-exchanger", name: "Heat Exchanger" },
        { type: "shell-and-tube", name: "Shell & Tube HX" },
        { type: "plate", name: "Plate HX" },
        { type: "air-cooler", name: "Air Cooler" },
        { type: "reboiler", name: "Reboiler" },
        { type: "heater", name: "Heater" },
        { type: "condenser", name: "Condenser" },
        { type: "cooling-tower", name: "Cooling Tower" },
        { type: "furnace", name: "Furnace" }
      ]
    },
    {
      name: "Reactors",
      types: [
        { type: "reactor", name: "Reactor" },
        { type: "batch-reactor", name: "Batch Reactor" }
      ]
    },
    {
      name: "Separation",
      types: [
        { type: "column", name: "Distillation Column" },
        { type: "separator", name: "Separator" },
        { type: "filter", name: "Filter" },
        { type: "cyclone", name: "Cyclone" },
        { type: "flash", name: "Flash Drum" },
        { type: "decanter", name: "Decanter" },
        { type: "centrifuge", name: "Centrifuge" },
        { type: "crystallizer", name: "Crystallizer" },
        { type: "absorber", name: "Absorber" },
        { type: "stripper", name: "Stripper" },
        { type: "evaporator", name: "Evaporator" },
        { type: "dryer", name: "Dryer" },
        { type: "scrubber", name: "Scrubber" },
        { type: "extractor", name: "Extractor" }
      ]
    },
    {
      name: "Flow & Storage",
      types: [
        { type: "pump", name: "Pump" },
        { type: "valve", name: "Valve" },
        { type: "compressor", name: "Compressor" },
        { type: "tank", name: "Tank" },
        { type: "mixer", name: "Mixer" },
        { type: "turbine", name: "Turbine" }
      ]
    }
  ];
  
  const toggleSimulation = () => {
    const newState = !isRunning;
    setIsRunning(newState);
    
    setEquipment(equipment.map(eq => ({
      ...eq,
      status: newState ? 'running' : 'stopped'
    })));
    
    if (newState && onStartSimulation) {
      onStartSimulation();
    }
    
    if (newState) {
      startDataUpdates();
    }
  };

  const startDataUpdates = () => {
    let progress = 0;
    const updateInterval = setInterval(() => {
      progress += 5;
      if (progress <= 100) {
        setSimulationData({
          componentA: Math.min(78, (78 * progress) / 100),
          componentB: Math.min(45, (45 * progress) / 100),
          systemEfficiency: Math.min(92, (92 * progress) / 100)
        });
        
        setEquipment(prev => prev.map(eq => {
          const updatedMetrics = { ...eq.metrics };
          
          if (eq.type === 'heater' || eq.type === 'column') {
            updatedMetrics.temperature = Math.min(85, 25 + (60 * progress) / 100);
          }
          
          if (eq.type === 'tank' && eq.id === 'product-tank') {
            updatedMetrics.level = Math.min(45, 10 + (35 * progress) / 100);
            updatedMetrics.temperature = Math.min(60, 25 + (35 * progress) / 100);
          }
          
          if (eq.type === 'condenser') {
            updatedMetrics.temperature = Math.min(40, 25 + (15 * progress) / 100);
          }
          
          return {
            ...eq,
            metrics: updatedMetrics
          };
        }));
      } else {
        clearInterval(updateInterval);
      }
    }, 200);
    
    return () => clearInterval(updateInterval);
  };

  useEffect(() => {
    return () => {
      setIsRunning(false);
    };
  }, []);

  const handleEquipmentDragStart = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedEquipment(id);
    setIsDragging(true);
    setDragStartPos({
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleEquipmentDragEnd = () => {
    setSelectedEquipment(null);
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedEquipment) return;
    
    const deltaX = e.clientX - dragStartPos.x;
    const deltaY = e.clientY - dragStartPos.y;
    
    setEquipment(prev => prev.map(eq => {
      if (eq.id === selectedEquipment) {
        return {
          ...eq,
          position: {
            x: Math.max(0, Math.min(2, eq.position.x + (deltaX > 50 ? 1 : deltaX < -50 ? -1 : 0))),
            y: Math.max(0, Math.min(4, eq.position.y + (deltaY > 50 ? 1 : deltaY < -50 ? -1 : 0)))
          }
        };
      }
      return eq;
    }));
    
    setDragStartPos({
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleEquipmentMove = (id: string, direction: 'up' | 'down' | 'left' | 'right') => {
    setEquipment(prev => prev.map(eq => {
      if (eq.id === id) {
        const newPosition = { ...eq.position };
        
        switch (direction) {
          case 'up':
            newPosition.y = Math.max(0, newPosition.y - 1);
            break;
          case 'down':
            newPosition.y = Math.min(4, newPosition.y + 1);
            break;
          case 'left':
            newPosition.x = Math.max(0, newPosition.x - 1);
            break;
          case 'right':
            newPosition.x = Math.min(2, newPosition.x + 1);
            break;
        }
        
        return { ...eq, position: newPosition };
      }
      return eq;
    }));
  };

  const startEditingName = (id: string) => {
    const eq = equipment.find(e => e.id === id);
    if (eq) {
      setEditingName(id);
      setTempName(typeof eq.name === 'string' ? eq.name : String(eq.name));
    }
  };

  const saveEquipmentName = () => {
    if (editingName && tempName.trim()) {
      setEquipment(prev => prev.map(eq => {
        if (eq.id === editingName) {
          return { ...eq, name: tempName.trim() };
        }
        return eq;
      }));
      setEditingName(null);
    }
  };

  const startConnectMode = (id: string) => {
    if (connectMode === id) {
      setConnectMode(null);
      toast({
        title: "Connection Cancelled",
        description: "Connection mode disabled",
      });
    } else {
      setConnectMode(id);
      toast({
        title: "Connect Mode Enabled",
        description: `Select another equipment to connect from ${equipment.find(e => e.id === id)?.name}`,
      });
    }
  };

  const handleConnectionSelect = (id: string) => {
    if (connectMode && connectMode !== id) {
      const newConnection: Connection = {
        id: `conn-${Date.now()}`,
        source: connectMode,
        target: id,
        animated: true
      };
      
      setConnections(prev => [...prev, newConnection]);
      
      setEquipment(prev => 
        prev.map(eq => {
          if (eq.id === connectMode) {
            return {
              ...eq,
              connections: [...(eq.connections || []), id]
            };
          }
          return eq;
        })
      );
      
      toast({
        title: "Connection Created",
        description: `Connected ${equipment.find(e => e.id === connectMode)?.name} to ${equipment.find(e => e.id === id)?.name}`,
      });
      
      setConnectMode(null);
    }
  };

  const toggleDetails = (id: string) => {
    setShowDetails(showDetails === id ? null : id);
  };

  // Add new equipment from palette
  const handleAddEquipment = (type: string, name: string) => {
    const newId = `${type}-${Date.now()}`;
    const newEquipment: Equipment = {
      id: newId,
      type,
      name,
      status: isRunning ? 'running' : 'stopped',
      metrics: type === 'tank' 
        ? { level: 0, temperature: 25 }
        : type === 'heat-exchanger' || type.includes('heat') || type === 'condenser' || type === 'heater'
          ? { temperature: 25 }
          : type === 'pump' || type === 'compressor'
            ? { flow: 0 }
            : type === 'column' || type === 'reactor'
              ? { temperature: 25, pressure: 100 }
              : {},
      position: { 
        x: Math.floor(Math.random() * 3),  // Random position in the grid
        y: Math.floor(Math.random() * 5)
      },
      connections: []
    };
    
    setEquipment(prev => [...prev, newEquipment]);
    toast({
      title: "Equipment Added",
      description: `Added ${name} to the process flow`
    });
  };

  const renderEquipmentGrid = () => {
    const grid = Array(5).fill(0).map(() => Array(3).fill(null));
    
    equipment.forEach(eq => {
      const { x, y } = eq.position;
      grid[y][x] = eq;
    });
    
    return (
      <div 
        className="grid grid-cols-3 gap-4"
        onMouseMove={handleMouseMove}
        onMouseUp={handleEquipmentDragEnd}
        onMouseLeave={handleEquipmentDragEnd}
      >
        {grid.map((row, rowIndex) => (
          <React.Fragment key={`row-${rowIndex}`}>
            {row.map((eq, colIndex) => (
              <div key={`cell-${rowIndex}-${colIndex}`} className="min-h-[120px] flex items-center justify-center">
                {eq ? (
                  <div className="relative group">
                    {editingName === eq.id ? (
                      <div className="absolute -top-10 left-0 right-0 flex z-50">
                        <input
                          type="text"
                          value={tempName}
                          onChange={(e) => setTempName(e.target.value)}
                          onBlur={saveEquipmentName}
                          onKeyDown={(e) => e.key === 'Enter' && saveEquipmentName()}
                          autoFocus
                          className="w-full px-2 py-1 text-sm border rounded shadow-md"
                        />
                      </div>
                    ) : null}
                    
                    <div className="absolute -top-8 left-0 right-0 hidden group-hover:flex justify-center">
                      <button 
                        onClick={() => handleEquipmentMove(eq.id, 'up')}
                        disabled={eq.position.y === 0}
                        className="p-1 bg-blue-100 rounded-full mx-1 disabled:opacity-50 hover:bg-blue-200 transition-all shadow-sm"
                      >
                        ↑
                      </button>
                    </div>
                    
                    <div className="absolute top-1/2 -right-8 -translate-y-1/2 hidden group-hover:flex flex-col">
                      <button 
                        onClick={() => handleEquipmentMove(eq.id, 'right')}
                        disabled={eq.position.x === 2}
                        className="p-1 bg-blue-100 rounded-full my-1 disabled:opacity-50 hover:bg-blue-200 transition-all shadow-sm"
                      >
                        →
                      </button>
                    </div>
                    
                    <div className="absolute -bottom-8 left-0 right-0 hidden group-hover:flex justify-center">
                      <button 
                        onClick={() => handleEquipmentMove(eq.id, 'down')}
                        disabled={eq.position.y === 4}
                        className="p-1 bg-blue-100 rounded-full mx-1 disabled:opacity-50 hover:bg-blue-200 transition-all shadow-sm"
                      >
                        ↓
                      </button>
                    </div>
                    
                    <div className="absolute top-1/2 -left-8 -translate-y-1/2 hidden group-hover:flex flex-col">
                      <button 
                        onClick={() => handleEquipmentMove(eq.id, 'left')}
                        disabled={eq.position.x === 0}
                        className="p-1 bg-blue-100 rounded-full my-1 disabled:opacity-50 hover:bg-blue-200 transition-all shadow-sm"
                      >
                        ←
                      </button>
                    </div>
                    
                    <div 
                      className={`cursor-move hover:scale-105 transition-transform ${
                        connectMode && connectMode !== eq.id 
                          ? 'ring-2 ring-blue-400 ring-offset-2 cursor-pointer' 
                          : ''
                      }`}
                      onMouseDown={(e) => handleEquipmentDragStart(eq.id, e)}
                      onDoubleClick={() => startEditingName(eq.id)}
                      onClick={() => connectMode && connectMode !== eq.id ? handleConnectionSelect(eq.id) : null}
                    >
                      <EquipmentCard 
                        type={eq.type} 
                        name={typeof eq.name === 'string' ? eq.name : String(eq.name)} 
                        status={isRunning ? "running" : "stopped"} 
                        metrics={eq.metrics}
                      />
                      
                      <div className="mt-2 flex space-x-2 justify-center">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className={`text-xs px-2 py-1 h-auto ${
                            connectMode === eq.id ? 'bg-blue-100 border-blue-400' : ''
                          }`}
                          onClick={(e) => {
                            e.stopPropagation(); 
                            startConnectMode(eq.id);
                          }}
                        >
                          <Link className="h-3 w-3 mr-1" />
                          {connectMode === eq.id ? 'Cancel' : 'Connect'}
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className={`text-xs px-2 py-1 h-auto ${
                            showDetails === eq.id ? 'bg-gray-100 border-gray-400' : ''
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDetails(eq.id);
                          }}
                        >
                          {showDetails === eq.id ? 'Hide' : 'Info'}
                        </Button>
                      </div>
                      
                      {showDetails === eq.id && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white p-3 rounded-lg shadow-lg z-10 border border-gray-200 text-left animate-fade-in">
                          <h4 className="font-medium text-sm text-blue-700 mb-2">{eq.name} Details</h4>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Type:</span>
                              <span className="font-medium">{eq.type}</span>
                            </div>
                            {Object.entries(eq.metrics).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-gray-500">{key}:</span>
                                <span className="font-medium">
                                  {renderMetricValue(value)}
                                  {key === 'temperature' ? '°C' : 
                                   key === 'pressure' ? ' kPa' : 
                                   key === 'level' ? '%' : 
                                   key === 'flow' ? ' kg/h' : ''}
                                </span>
                              </div>
                            ))}
                            <div className="flex justify-between">
                              <span className="text-gray-500">Status:</span>
                              <span className={`font-medium ${
                                isRunning ? 'text-green-600' : 'text-gray-600'
                              }`}>
                                {isRunning ? 'Running' : 'Stopped'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Connections:</span>
                              <span className="font-medium">
                                {eq.connections?.length || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full min-h-[120px] border border-dashed border-blue-200 rounded-xl flex items-center justify-center bg-blue-50/30 hover:bg-blue-50 transition-colors">
                    <span className="text-gray-400 text-xs">Empty</span>
                  </div>
                )}
              </div>
            ))}
          </React.Fragment>
        ))}
        
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <defs>
            <marker 
              id="arrowhead" 
              markerWidth="10" 
              markerHeight="7" 
              refX="0" 
              refY="3.5" 
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
            </marker>
          </defs>
          
          {connections.map(conn => {
            const source = equipment.find(e => e.id === conn.source);
            const target = equipment.find(e => e.id === conn.target);
            
            if (!source || !target) return null;
            
            const cellWidth = 120;
            const cellHeight = 120;
            const margin = 12;
            
            const sourceX = (source.position.x * (cellWidth + margin)) + (cellWidth / 2);
            const sourceY = (source.position.y * (cellHeight + margin)) + (cellHeight / 2);
            
            const targetX = (target.position.x * (cellWidth + margin)) + (cellWidth / 2);
            const targetY = (target.position.y * (cellHeight + margin)) + (cellHeight / 2);
            
            const dx = targetX - sourceX;
            const dy = targetY - sourceY;
            
            const controlX1 = sourceX + dx * 0.3;
            const controlY1 = sourceY;
            const controlX2 = targetX - dx * 0.3;
            const controlY2 = targetY;
            
            const dashArray = "5,5";
            
            return (
              <g key={conn.id}>
                <path 
                  d={`M ${sourceX} ${sourceY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${targetX} ${targetY}`} 
                  fill="none" 
                  stroke="#3b82f6" 
                  strokeWidth="2" 
                  strokeDasharray={dashArray}
                  markerEnd="url(#arrowhead)"
                  className={conn.animated ? "animate-dash" : ""}
                />
                
                <circle 
                  r="3" 
                  fill="#3b82f6" 
                  className="animate-pulse">
                  <animateMotion 
                    dur="3s"
                    repeatCount="indefinite"
                    path={`M ${sourceX} ${sourceY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${targetX} ${targetY}`}
                  />
                </circle>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  // Render equipment palette
  const renderEquipmentPalette = () => {
    if (!showEquipmentPalette) return null;
    
    return (
      <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-20 overflow-y-auto transition-all transform">
        <div className="p-4 border-b sticky top-0 bg-white z-10 flex items-center justify-between">
          <h3 className="text-lg font-medium">Equipment Palette</h3>
          <button 
            onClick={() => setShowEquipmentPalette(false)}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-3">
          {equipmentCategories.map((category, idx) => (
            <div key={idx} className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Layers className="h-4 w-4 mr-1 text-blue-500" />
                {category.name}
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {category.types.map((item, i) => (
                  <button
                    key={i}
                    className="p-2 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors text-xs flex flex-col items-center"
                    onClick={() => handleAddEquipment(item.type, item.name)}
                  >
                    <EquipmentCard 
                      type={item.type} 
                      name={item.name}
                      className="w-full scale-75 transform origin-top"
                    />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={cn("w-full", className)}>
      <GlassPanel className="p-6 animate-fade-in shadow-xl border border-white/50 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white/10 to-transparent"></div>
        
        <div className="flex justify-between items-center mb-6 relative z-10">
          <div>
            <h2 className="text-2xl font-medium bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">Distillation Process</h2>
            <p className="text-gray-500 mt-1">Simulation Overview</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline"
              onClick={() => setShowEquipmentPalette(!showEquipmentPalette)}
              className="mr-2"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Equipment
            </Button>
            
            <button 
              onClick={toggleSimulation}
              className={cn(
                "inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium transition-all shadow-md hover:shadow-lg transform hover:scale-105",
                isRunning 
                  ? "bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-200" 
                  : "bg-gradient-to-r from-green-400 to-green-500 text-white hover:from-green-500 hover:to-green-600"
              )}
            >
              {isRunning ? (
                <>
                  <Square className="mr-2 h-4 w-4" />
                  Stop Simulation
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Run Simulation
                </>
              )}
            </button>
            <button className="p-2 rounded-lg text-gray-500 hover:text-flow-blue hover:bg-blue-50 transition-all">
              <Settings2 className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-lg text-gray-500 hover:text-flow-blue hover:bg-blue-50 transition-all">
              <Download className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-lg text-gray-500 hover:text-flow-blue hover:bg-blue-50 transition-all">
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="col-span-2">
            <div className="flex flex-col gap-4">
              {renderEquipmentGrid()}
            </div>
          </div>
          
          <div>
            <div className="h-full flex flex-col gap-6">
              <div className="flex-1 rounded-xl border border-blue-100 overflow-hidden shadow-lg bg-gradient-to-b from-white to-blue-50 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">Process Data</h3>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded-lg text-gray-500 hover:text-flow-blue hover:bg-blue-50 transition-all">
                      <LineChart className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 rounded-lg text-gray-500 hover:text-flow-blue hover:bg-blue-50 transition-all">
                      <Database className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 rounded-lg text-gray-500 hover:text-flow-blue hover:bg-blue-50 transition-all">
                      <Columns className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-white/80 shadow-sm hover:shadow-md transition-all border border-blue-50">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Component A</span>
                      <span className="text-sm font-medium">{simulationData.componentA.toFixed(1)}%</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${simulationData.componentA}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-white/80 shadow-sm hover:shadow-md transition-all border border-blue-50">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Component B</span>
                      <span className="text-sm font-medium">{simulationData.componentB.toFixed(1)}%</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all duration-500"
                        style={{ width: `${simulationData.componentB}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-white/80 shadow-sm hover:shadow-md transition-all border border-blue-50">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">System Efficiency</span>
                      <span className="text-sm font-medium">{simulationData.systemEfficiency.toFixed(1)}%</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all duration-500"
                        style={{ width: `${simulationData.systemEfficiency}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">System Status</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-blue-50 flex items-center">
                      <div className={`h-2 w-2 rounded-full mr-2 ${isRunning ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <span>Simulation: {isRunning ? 'Active' : 'Inactive'}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-blue-50 flex items-center">
                      <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                      <span>Connections: {connections.length}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-blue-50 flex items-center">
                      <div className="h-2 w-2 rounded-full bg-purple-500 mr-2"></div>
                      <span>Equipment: {equipment.length}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-blue-50 flex items-center">
                      <div className="h-2 w-2 rounded-full bg-amber-500 mr-2"></div>
                      <span>Warnings: {0}</span>
                    </div>
                  </div>
                </div>
                
                {isRunning && (
                  <div className="mt-6 p-3 rounded-lg border border-green-100 bg-green-50">
                    <h4 className="text-sm font-medium text-green-700 flex items-center">
                      <ArrowRight className="h-3.5 w-3.5 mr-1" />
                      Simulation Progress
                    </h4>
                    <p className="text-xs text-green-600 mt-1">
                      The simulation is running smoothly. All equipment is functioning as expected.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {renderEquipmentPalette()}
      </GlassPanel>
    </div>
  );
};

export default ProcessFlow;

