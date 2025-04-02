
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
  Share2
} from "lucide-react";

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
}

const ProcessFlow: React.FC<ProcessFlowProps> = ({ className, onStartSimulation }) => {
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
      position: { x: 0, y: 0 }
    },
    { 
      id: 'feed-pump', 
      type: 'pump', 
      name: 'Feed Pump', 
      status: 'stopped', 
      metrics: { flow: 120 },
      position: { x: 2, y: 0 }
    },
    { 
      id: 'preheater', 
      type: 'heater', 
      name: 'Preheater', 
      status: 'stopped', 
      metrics: { temperature: 25 },
      position: { x: 0, y: 2 }
    },
    { 
      id: 'distillation-column', 
      type: 'column', 
      name: 'Distillation Column', 
      status: 'stopped', 
      metrics: { pressure: 150, temperature: 30 },
      position: { x: 2, y: 2 }
    },
    { 
      id: 'product-tank', 
      type: 'tank', 
      name: 'Product Tank', 
      status: 'stopped', 
      metrics: { level: 10, temperature: 25 },
      position: { x: 0, y: 4 }
    },
    { 
      id: 'condenser', 
      type: 'condenser', 
      name: 'Condenser', 
      status: 'stopped', 
      metrics: { temperature: 25 },
      position: { x: 2, y: 4 }
    }
  ]);

  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string | null>(null);
  const [tempName, setTempName] = useState("");
  
  const toggleSimulation = () => {
    const newState = !isRunning;
    setIsRunning(newState);
    
    // Update equipment status
    setEquipment(equipment.map(eq => ({
      ...eq,
      status: newState ? 'running' : 'stopped'
    })));
    
    if (newState && onStartSimulation) {
      onStartSimulation();
    }
    
    // Start updating simulation data if running
    if (newState) {
      startDataUpdates();
    }
  };

  const startDataUpdates = () => {
    // Simulate data flow when simulation is running
    let progress = 0;
    const updateInterval = setInterval(() => {
      progress += 5;
      if (progress <= 100) {
        setSimulationData({
          componentA: Math.min(78, (78 * progress) / 100),
          componentB: Math.min(45, (45 * progress) / 100),
          systemEfficiency: Math.min(92, (92 * progress) / 100)
        });
        
        // Update equipment metrics based on running state
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
    
    // Clean up interval on component unmount
    return () => clearInterval(updateInterval);
  };

  useEffect(() => {
    // Clean up on unmount
    return () => {
      // Reset state when component unmounts
      setIsRunning(false);
    };
  }, []);

  const handleEquipmentDragStart = (id: string) => {
    setSelectedEquipment(id);
  };

  const handleEquipmentDragEnd = () => {
    setSelectedEquipment(null);
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
      setTempName(eq.name);
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

  const renderEquipmentGrid = () => {
    const grid = Array(5).fill(0).map(() => Array(3).fill(null));
    
    // Place equipment on the grid
    equipment.forEach(eq => {
      const { x, y } = eq.position;
      grid[y][x] = eq;
    });
    
    return (
      <div className="grid grid-cols-3 gap-4">
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
                          className="w-full px-2 py-1 text-sm border rounded"
                        />
                      </div>
                    ) : null}
                    
                    <div className="absolute -top-8 left-0 right-0 hidden group-hover:flex justify-center">
                      <button 
                        onClick={() => handleEquipmentMove(eq.id, 'up')}
                        disabled={eq.position.y === 0}
                        className="p-1 bg-gray-200 rounded-full mx-1 disabled:opacity-50"
                      >
                        ↑
                      </button>
                    </div>
                    
                    <div className="absolute top-1/2 -right-8 -translate-y-1/2 hidden group-hover:flex flex-col">
                      <button 
                        onClick={() => handleEquipmentMove(eq.id, 'right')}
                        disabled={eq.position.x === 2}
                        className="p-1 bg-gray-200 rounded-full my-1 disabled:opacity-50"
                      >
                        →
                      </button>
                    </div>
                    
                    <div className="absolute -bottom-8 left-0 right-0 hidden group-hover:flex justify-center">
                      <button 
                        onClick={() => handleEquipmentMove(eq.id, 'down')}
                        disabled={eq.position.y === 4}
                        className="p-1 bg-gray-200 rounded-full mx-1 disabled:opacity-50"
                      >
                        ↓
                      </button>
                    </div>
                    
                    <div className="absolute top-1/2 -left-8 -translate-y-1/2 hidden group-hover:flex flex-col">
                      <button 
                        onClick={() => handleEquipmentMove(eq.id, 'left')}
                        disabled={eq.position.x === 0}
                        className="p-1 bg-gray-200 rounded-full my-1 disabled:opacity-50"
                      >
                        ←
                      </button>
                    </div>
                    
                    <div 
                      className="cursor-move"
                      onMouseDown={() => handleEquipmentDragStart(eq.id)}
                      onMouseUp={handleEquipmentDragEnd}
                      onDoubleClick={() => startEditingName(eq.id)}
                    >
                      <EquipmentCard 
                        type={eq.type} 
                        name={eq.name} 
                        status={isRunning ? "running" : "stopped"} 
                        metrics={eq.metrics}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full min-h-[120px] border border-dashed border-gray-300 rounded-xl flex items-center justify-center">
                    <span className="text-gray-400 text-xs">Empty</span>
                  </div>
                )}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className={cn("w-full", className)}>
      <GlassPanel className="p-6 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-medium">Distillation Process</h2>
            <p className="text-gray-500 mt-1">Simulation Overview</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleSimulation}
              className={cn(
                "inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium transition-colors",
                isRunning 
                  ? "bg-amber-50 text-amber-600 hover:bg-amber-100" 
                  : "bg-green-50 text-green-600 hover:bg-green-100"
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
            <button className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
              <Settings2 className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
              <Download className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Process Flow Diagram */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="col-span-2">
            <div className="flex flex-col gap-4">
              {renderEquipmentGrid()}
            </div>
          </div>
          
          {/* Process Data Panel */}
          <div>
            <div className="h-full flex flex-col gap-6">
              <div className="flex-1 rounded-xl border border-gray-100 overflow-hidden shadow-sm bg-white p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Process Data</h3>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                      <LineChart className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                      <Database className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                      <Columns className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-gray-50">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Component A</span>
                      <span className="text-sm font-medium">{simulationData.componentA.toFixed(1)}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                      <div 
                        className="h-2 bg-flow-blue rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${simulationData.componentA}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-gray-50">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Component B</span>
                      <span className="text-sm font-medium">{simulationData.componentB.toFixed(1)}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                      <div 
                        className="h-2 bg-flow-cyan rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${simulationData.componentB}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-gray-50">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">System Efficiency</span>
                      <span className="text-sm font-medium">{simulationData.systemEfficiency.toFixed(1)}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                      <div 
                        className="h-2 bg-flow-teal rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${simulationData.systemEfficiency}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h4 className="text-sm font-medium mb-3">Key Parameters</h4>
                    <div className="space-y-2">
                      {equipment.map(eq => (
                        <div key={eq.id} className="flex justify-between py-1.5 border-b border-gray-100">
                          <span className="text-sm text-gray-500">{eq.name}</span>
                          <span className="text-sm font-medium">
                            {eq.type === 'tank' 
                              ? `${eq.metrics.level}% level` 
                              : eq.type === 'pump' 
                                ? `${eq.metrics.flow} kg/h` 
                                : eq.type === 'heater' || eq.type === 'column' || eq.type === 'condenser'
                                  ? `${eq.metrics.temperature}°C`
                                  : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
};

export default ProcessFlow;
