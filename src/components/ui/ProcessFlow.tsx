
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import GlassPanel from "./GlassPanel";
import { useToast } from "@/hooks/use-toast";
import { Equipment, Connection } from "./process-flow/types";
import SimulationControls from "./process-flow/SimulationControls";
import EquipmentGrid from "./process-flow/EquipmentGrid";
import ProcessDataPanel from "./process-flow/ProcessDataPanel";

interface ProcessFlowProps {
  className?: string;
  onStartSimulation?: () => void;
}

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
      connections: [],
      description: 'Raw material storage'
    },
    { 
      id: 'feed-pump', 
      type: 'pump', 
      name: 'Feed Pump', 
      status: 'stopped', 
      metrics: { flow: 120 },
      position: { x: 2, y: 0 },
      connections: [],
      description: 'Flow rate: 120 L/min'
    },
    { 
      id: 'preheater', 
      type: 'heater', 
      name: 'Preheater', 
      status: 'stopped', 
      metrics: { temperature: 25 },
      position: { x: 0, y: 2 },
      connections: [],
      description: 'Heat to 80°C'
    },
    { 
      id: 'distillation-column', 
      type: 'column', 
      name: 'Distillation Column', 
      status: 'stopped', 
      metrics: { pressure: 150, temperature: 30 },
      position: { x: 2, y: 2 },
      connections: [],
      description: '20 stages, 150 kPa'
    },
    { 
      id: 'product-tank', 
      type: 'tank', 
      name: 'Product Tank', 
      status: 'stopped', 
      metrics: { level: 10, temperature: 25 },
      position: { x: 0, y: 4 },
      connections: [],
      description: 'Final product storage'
    },
    { 
      id: 'condenser', 
      type: 'condenser', 
      name: 'Condenser', 
      status: 'stopped', 
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
