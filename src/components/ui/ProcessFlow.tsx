import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import GlassPanel from "./GlassPanel";
import { useToast } from "@/hooks/use-toast";
import { Equipment, Connection } from "./process-flow/types";
import SimulationControls from "./process-flow/SimulationControls";
import EquipmentGrid from "./process-flow/EquipmentGrid";
import ProcessDataPanel from "./process-flow/ProcessDataPanel";
import { 
  Container, 
  Gauge, 
  Thermometer, 
  FlaskConical, 
  Droplets, 
  Columns, 
  Filter, 
  Beaker, 
  Lightbulb,
  Pipette, 
  Milestone,
  Package,
  CircleOff,
  Wind,
  Cpu,
  Flame,
  Waves,
  ArrowRight
} from "lucide-react";

interface ProcessFlowProps {
  className?: string;
  onStartSimulation?: () => void;
}

const equipmentTypes = [
  { id: "tank", name: "Tank", icon: <Container className="h-5 w-5 text-blue-600" /> },
  { id: "product", name: "Product", icon: <Package className="h-5 w-5 text-emerald-500" /> },
  
  { id: "pump", name: "Pump", icon: <Gauge className="h-5 w-5 text-blue-600" /> },
  { id: "valve", name: "Valve", icon: <CircleOff className="h-5 w-5 text-green-500" /> },
  { id: "compressor", name: "Compressor", icon: <Wind className="h-5 w-5 text-indigo-500" /> },
  
  { id: "heater", name: "Heater", icon: <Thermometer className="h-5 w-5 text-red-500" /> },
  { id: "cooler", name: "Cooler", icon: <Thermometer className="h-5 w-5 text-blue-400" /> },
  { id: "heatExchanger", name: "Heat Exchanger", icon: <Lightbulb className="h-5 w-5 text-yellow-500" /> },
  { id: "furnace", name: "Furnace", icon: <Flame className="h-5 w-5 text-orange-600" /> },
  
  { id: "column", name: "Distillation Column", icon: <FlaskConical className="h-5 w-5 text-purple-500" /> },
  { id: "absorber", name: "Absorber", icon: <FlaskConical className="h-5 w-5 text-indigo-400" /> },
  { id: "separator", name: "Separator", icon: <Columns className="h-5 w-5 text-teal-600" /> },
  { id: "flashDrum", name: "Flash Drum", icon: <Container className="h-5 w-5 text-amber-500" /> },
  { id: "filter", name: "Filter", icon: <Filter className="h-5 w-5 text-gray-600" /> },
  
  { id: "reactor", name: "Reactor", icon: <Beaker className="h-5 w-5 text-pink-500" /> },
  { id: "cstr", name: "CSTR", icon: <Beaker className="h-5 w-5 text-rose-600" /> },
  { id: "pfr", name: "PFR", icon: <Beaker className="h-5 w-5 text-fuchsia-600" /> },
  
  { id: "mixer", name: "Mixer", icon: <Columns className="h-5 w-5 text-orange-500" /> },
  { id: "splitter", name: "Splitter", icon: <Milestone className="h-5 w-5 text-indigo-500" /> },
  
  { id: "sensor", name: "Sensor", icon: <Pipette className="h-5 w-5 text-teal-500" /> },
  { id: "coolingTower", name: "Cooling Tower", icon: <Waves className="h-5 w-5 text-blue-300" /> },
  
  { id: "arrow", name: "Flow Direction", icon: <ArrowRight className="h-5 w-5 text-gray-500" /> },
  
  { id: "controller", name: "Controller", icon: <Cpu className="h-5 w-5 text-violet-500" /> }
];

const ProcessFlow: React.FC<ProcessFlowProps> = ({ className, onStartSimulation }) => {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [simulationData, setSimulationData] = useState({
    componentA: 0,
    componentB: 0,
    systemEfficiency: 0
  });
  
  const [selectedEquipmentType, setSelectedEquipmentType] = useState<string | null>(null);
  const [equipment, setEquipment] = useState<Equipment[]>([
    { 
      id: 'feed-tank', 
      type: 'tank', 
      name: 'Feed Tank',
      metrics: { level: 75, temperature: 25 },
      position: { x: 0, y: 0 },
      connections: [],
      description: 'Raw material storage'
    },
    { 
      id: 'feed-pump', 
      type: 'pump', 
      name: 'Feed Pump',
      metrics: { flow: 120 },
      position: { x: 2, y: 0 },
      connections: [],
      description: 'Flow rate: 120 L/min'
    },
    { 
      id: 'preheater', 
      type: 'heater', 
      name: 'Preheater',
      metrics: { temperature: 25 },
      position: { x: 0, y: 2 },
      connections: [],
      description: 'Heat to 80°C'
    },
    { 
      id: 'distillation-column', 
      type: 'column', 
      name: 'Distillation Column',
      metrics: { pressure: 150, temperature: 30 },
      position: { x: 2, y: 2 },
      connections: [],
      description: '20 stages, 150 kPa'
    },
    { 
      id: 'product-tank', 
      type: 'tank', 
      name: 'Product Tank',
      metrics: { level: 10, temperature: 25 },
      position: { x: 0, y: 4 },
      connections: [],
      description: 'Final product storage'
    },
    { 
      id: 'condenser', 
      type: 'cooler', 
      name: 'Condenser',
      metrics: { temperature: 25 },
      position: { x: 2, y: 4 },
      connections: [],
      description: 'Cooling to 25°C'
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
      const sourceEquipment = equipment.find(e => e.id === connectMode);
      const targetEquipment = equipment.find(e => e.id === id);
      
      if (sourceEquipment && targetEquipment) {
        const connectionLabel = `${sourceEquipment.type} → ${targetEquipment.type}`;
        
        const newConnection: Connection = {
          id: `conn-${Date.now()}`,
          source: connectMode,
          target: id,
          animated: true,
          label: connectionLabel
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
          description: `Connected ${sourceEquipment.name} to ${targetEquipment.name}`,
        });
      }
      
      setConnectMode(null);
    }
  };

  const toggleDetails = (id: string) => {
    setShowDetails(showDetails === id ? null : id);
  };

  const handleEquipmentSelect = (type: string) => {
    setSelectedEquipmentType(selectedEquipmentType === type ? null : type);
    toast({
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Selected`,
      description: "Click on an empty cell to place the equipment",
    });
  };

  const handleCellClick = (row: number, col: number) => {
    if (!selectedEquipmentType) return;
    
    const cellOccupied = equipment.some(eq => 
      eq.position.x === col && eq.position.y === row
    );
    
    if (cellOccupied) {
      toast({
        title: "Cell Occupied",
        description: "This position already has equipment",
        variant: "destructive"
      });
      return;
    }
    
    const newId = `${selectedEquipmentType}-${Date.now()}`;
    const newEquipment: Equipment = {
      id: newId,
      type: selectedEquipmentType,
      name: `${selectedEquipmentType.charAt(0).toUpperCase() + selectedEquipmentType.slice(1)} ${
        equipment.filter(e => e.type === selectedEquipmentType).length + 1
      }`,
      status: 'stopped',
      metrics: 
        selectedEquipmentType === 'tank' ? { level: 50, temperature: 25 } :
        selectedEquipmentType === 'pump' ? { flow: 120 } :
        selectedEquipmentType === 'compressor' ? { flow: 150, pressure: 350 } :
        selectedEquipmentType === 'valve' ? { flow: 80 } :
        selectedEquipmentType === 'heater' ? { temperature: 80 } :
        selectedEquipmentType === 'cooler' ? { temperature: 15 } :
        selectedEquipmentType === 'heatExchanger' ? { duty: 250 } :
        selectedEquipmentType === 'furnace' ? { temperature: 850, efficiency: 85 } :
        selectedEquipmentType === 'column' ? { pressure: 150, temperature: 65 } :
        selectedEquipmentType === 'absorber' ? { pressure: 120, efficiency: 90 } :
        selectedEquipmentType === 'flashDrum' ? { pressure: 110, temperature: 40 } :
        selectedEquipmentType === 'separator' ? { separation: 95 } :
        selectedEquipmentType === 'mixer' ? { efficiency: 90 } :
        selectedEquipmentType === 'splitter' ? { ratio: 0.5 } :
        selectedEquipmentType === 'reactor' ? { temperature: 85, conversion: 75 } :
        selectedEquipmentType === 'cstr' ? { volume: 5, conversion: 80 } :
        selectedEquipmentType === 'pfr' ? { length: 10, diameter: 0.5, conversion: 85 } :
        selectedEquipmentType === 'filter' ? { efficiency: 95 } :
        selectedEquipmentType === 'sensor' ? { reading: 42 } :
        selectedEquipmentType === 'controller' ? { setpoint: 50 } :
        selectedEquipmentType === 'coolingTower' ? { approach: 5, range: 10 } :
        selectedEquipmentType === 'product' ? { purity: 99 } :
        selectedEquipmentType === 'arrow' ? { direction: 0 } :
        {},
      position: { x: col, y: row },
      connections: [],
      description: 
        selectedEquipmentType === 'tank' ? 'Storage vessel for liquids' :
        selectedEquipmentType === 'pump' ? 'Increases fluid pressure' :
        selectedEquipmentType === 'compressor' ? 'Increases gas pressure' :
        selectedEquipmentType === 'valve' ? 'Controls flow rate' :
        selectedEquipmentType === 'heater' ? 'Increases fluid temperature' :
        selectedEquipmentType === 'cooler' ? 'Decreases fluid temperature' :
        selectedEquipmentType === 'heatExchanger' ? 'Transfers heat between fluids' :
        selectedEquipmentType === 'furnace' ? 'High temperature heating equipment' :
        selectedEquipmentType === 'column' ? 'Separates components by boiling point' :
        selectedEquipmentType === 'absorber' ? 'Selectively absorbs components from a gas stream' :
        selectedEquipmentType === 'flashDrum' ? 'Separates vapor and liquid phases' :
        selectedEquipmentType === 'separator' ? 'Separates process streams' :
        selectedEquipmentType === 'mixer' ? 'Combines multiple streams' :
        selectedEquipmentType === 'splitter' ? 'Divides a stream into multiple outputs' :
        selectedEquipmentType === 'reactor' ? 'Chemical reaction vessel' :
        selectedEquipmentType === 'cstr' ? 'Continuous Stirred Tank Reactor' :
        selectedEquipmentType === 'pfr' ? 'Plug Flow Reactor' :
        selectedEquipmentType === 'filter' ? 'Removes solids from fluids' :
        selectedEquipmentType === 'sensor' ? 'Measures process parameters' :
        selectedEquipmentType === 'controller' ? 'Controls process parameters' :
        selectedEquipmentType === 'coolingTower' ? 'Removes heat from cooling water' :
        selectedEquipmentType === 'product' ? 'Final product output' :
        selectedEquipmentType === 'arrow' ? 'Indicates flow direction' :
        `New ${selectedEquipmentType} equipment`
    };
    
    if (selectedEquipmentType === 'arrow') {
      newEquipment.rotation = 0;
      newEquipment.scale = 1;
    }
    
    setEquipment(prev => [...prev, newEquipment]);
    
    toast({
      title: "Equipment Placed",
      description: `Added ${newEquipment.name} at position (${col},${row})`,
    });
    
    setSelectedEquipmentType(null);
  };

  const handleArrowRotate = (id: string, degrees: number) => {
    setEquipment(prev => prev.map(eq => {
      if (eq.id === id) {
        return {
          ...eq,
          rotation: ((eq.rotation || 0) + degrees) % 360
        };
      }
      return eq;
    }));
  };

  const handleArrowResize = (id: string, scaleFactor: number) => {
    setEquipment(prev => prev.map(eq => {
      if (eq.id === id) {
        const newScale = Math.max(0.5, Math.min(3, (eq.scale || 1) + scaleFactor));
        return {
          ...eq,
          scale: newScale
        };
      }
      return eq;
    }));
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
          <SimulationControls 
            isRunning={isRunning} 
            onToggleSimulation={toggleSimulation} 
          />
        </div>

        <div className="mb-6 p-3 bg-white border border-gray-100 rounded-xl shadow-sm overflow-x-auto">
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium text-gray-500 mr-2">Equipment:</div>
            <div className="flex flex-wrap gap-2">
              {equipmentTypes.map(type => (
                <button
                  key={type.id}
                  className={`px-3 py-1.5 rounded text-xs border transition-colors flex items-center gap-1 ${
                    selectedEquipmentType === type.id
                      ? 'bg-blue-100 border-blue-300 text-blue-700'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => handleEquipmentSelect(type.id)}
                >
                  <span className="mr-1">{type.icon}</span>
                  {type.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="col-span-2">
            <div className="flex flex-col gap-4">
              <EquipmentGrid 
                equipment={equipment}
                connections={connections}
                connectMode={connectMode}
                editingName={editingName}
                tempName={tempName}
                showDetails={showDetails}
                isRunning={isRunning}
                onDragStart={handleEquipmentDragStart}
                onMouseMove={handleMouseMove}
                onMouseUp={handleEquipmentDragEnd}
                onMouseLeave={handleEquipmentDragEnd}
                onEditName={startEditingName}
                onNameChange={(e) => setTempName(e.target.value)}
                onSaveName={saveEquipmentName}
                onConnect={startConnectMode}
                onConnectionSelect={handleConnectionSelect}
                onToggleDetails={toggleDetails}
                onMove={handleEquipmentMove}
                onCellClick={handleCellClick}
                onRotate={handleArrowRotate}
                onResize={handleArrowResize}
              />
            </div>
          </div>
          
          <div>
            <div className="h-full flex flex-col gap-6">
              <ProcessDataPanel 
                simulationData={simulationData}
                equipment={equipment}
              />
            </div>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
};

export default ProcessFlow;
