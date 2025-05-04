import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import EquipmentCard from '@/components/ui/equipment/EquipmentCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Thermometer, Beaker, Droplets, Activity, Trash2, Settings, Edit2, Save, X, FileText } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { EquipmentType } from '@/components/ui/equipment/EquipmentIcons';
import ProcessFlow from '@/components/ui/ProcessFlow';
import EquipmentSelector from './EquipmentSelector';
import SimulationResults from './SimulationResults';

interface SimulationBuilderProps {
  selectedComponents: string[];
  thermodynamicModel: string;
  onRunSimulation?: () => void;
}

interface EquipmentPosition {
  x: number;
  y: number;
}

interface ConnectionPoint {
  x: number;
  y: number;
  point: string;
}

interface EquipmentMetric {
  key: string;
  value: string;
  editable?: boolean;
  options?: string[];
}

interface CanvasEquipment {
  id: string;
  type: EquipmentType;
  title: string;
  position: EquipmentPosition;
  metrics: EquipmentMetric[];
  activeConnectionPoints: string[];
  feedComponent?: string;
  inputTemp?: string;
  inputPressure?: string;
  flowRate?: string;
  efficiency?: string;
  customParameters?: Record<string, string>;
}

interface Connection {
  id: string;
  source: string;
  target: string;
  sourcePoint: string;
  targetPoint: string;
  sourcePosition?: EquipmentPosition;
  targetPosition?: EquipmentPosition;
  flowRate?: string;
  component?: string;
}

export const SimulationBuilder: React.FC<SimulationBuilderProps> = ({
  selectedComponents,
  thermodynamicModel,
  onRunSimulation
}) => {
  const { toast } = useToast();
  const [equipmentMetrics, setEquipmentMetrics] = useState<EquipmentMetric[]>([
    { key: "Temperature", value: "85°C", editable: true },
    { key: "Pressure", value: "150 kPa", editable: true },
    { key: "Flow", value: "1200 kg/h", editable: true }
  ]);
  
  const [processType, setProcessType] = useState("distillation");
  const [operatingTemp, setOperatingTemp] = useState("85");
  const [operatingPressure, setOperatingPressure] = useState("150");
  const [feedFlowRate, setFeedFlowRate] = useState("1200");
  const [canvasEquipment, setCanvasEquipment] = useState<CanvasEquipment[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
  const [connectionStart, setConnectionStart] = useState<{equipmentId: string, point: string} | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedEquipment, setDraggedEquipment] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const [showPropertyEditor, setShowPropertyEditor] = useState(false);
  const [simulationResults, setSimulationResults] = useState<boolean>(false);
  const [simulationSubject, setSimulationSubject] = useState<string | null>(null);
  const [showDottedLines, setShowDottedLines] = useState(true); // Add this line to control dotted lines visibility
  
  const [processSteps, setProcessSteps] = useState<string[]>([
    "Define simulation objectives",
    "Develop process flowsheet", 
    "Input thermodynamic and property data", 
    "Specify operating conditions", 
    "Solve simulation model", 
    "Analyze results"
  ]);
  
  const libraryEquipment = [
    { type: "reactor" as EquipmentType, title: "CSTR Reactor" },
    { type: "distillation" as EquipmentType, title: "Distillation" },
    { type: "heat-exchanger" as EquipmentType, title: "Heat Exchanger" },
    { type: "pump" as EquipmentType, title: "Centrifugal Pump" },
    { type: "flash" as EquipmentType, title: "Flash Drum" },
    { type: "compressor" as EquipmentType, title: "Compressor" },
    { type: "valve" as EquipmentType, title: "Control Valve" },
    { type: "mixer" as EquipmentType, title: "Mixer" },
    { type: "tank" as EquipmentType, title: "Storage Tank" },
    { type: "cooler" as EquipmentType, title: "Cooler" },
    { type: "heater" as EquipmentType, title: "Heater" },
    { type: "filter" as EquipmentType, title: "Filter" }
  ];

  // Add feed stream options based on selected components
  const feedStreams = selectedComponents.map(component => ({
    type: "feed" as EquipmentType,
    title: `${component} Feed`
  }));

  const allEquipmentOptions = [...libraryEquipment, ...feedStreams];

  const handleDragStart = (e: React.DragEvent, type: EquipmentType, title: string) => {
    e.dataTransfer.setData("equipmentType", type);
    e.dataTransfer.setData("equipmentTitle", title);
    e.dataTransfer.effectAllowed = "copy";
  };
  
  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };
  
  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("equipmentType") as EquipmentType;
    const title = e.dataTransfer.getData("equipmentTitle");
    
    if (!type || !title) return;
    
    // Get position relative to the drop target
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if it's a feed stream
    const isFeed = type === "feed";
    const component = isFeed ? title.replace(" Feed", "") : undefined;
    
    const newEquipment: CanvasEquipment = {
      id: `equipment-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type,
      title,
      position: { x, y },
      metrics: [...equipmentMetrics],
      activeConnectionPoints: [],
      feedComponent: component
    };
    
    if (isFeed) {
      // Add specific metrics for feed streams
      newEquipment.metrics = [
        { key: "Component", value: component || "", editable: false },
        { key: "Temperature", value: "25°C", editable: true },
        { key: "Pressure", value: "101 kPa", editable: true },
        { key: "Flow Rate", value: "100 kg/h", editable: true }
      ];
    } else if (type === "reactor") {
      newEquipment.metrics = [
        { key: "Temperature", value: "85°C", editable: true },
        { key: "Pressure", value: "150 kPa", editable: true },
        { key: "Conversion", value: "95%", editable: true },
        { key: "Residence Time", value: "60 min", editable: true }
      ];
    } else if (type === "column" || type === "distillation") {
      newEquipment.metrics = [
        { key: "Stages", value: "10", editable: true },
        { key: "Reflux Ratio", value: "1.5", editable: true },
        { key: "Feed Stage", value: "5", editable: true },
        { key: "Pressure", value: "150 kPa", editable: true }
      ];
    } else if (type === "heat-exchanger") {
      newEquipment.metrics = [
        { key: "Duty", value: "500 kW", editable: true },
        { key: "ΔT Hot Side", value: "30°C", editable: true },
        { key: "ΔT Cold Side", value: "40°C", editable: true },
        { key: "Area", value: "25 m²", editable: true }
      ];
    }
    
    setCanvasEquipment(prev => [...prev, newEquipment]);
    
    toast({
      title: "Equipment Added",
      description: `${title} added to the process canvas.`,
    });
  };

  const handleMouseDown = (e: React.MouseEvent, equipmentId: string) => {
    // If clicking on a connection point, handle connection logic instead
    if ((e.target as HTMLElement).dataset.connection) {
      return;
    }
    
    e.stopPropagation();
    const equipment = canvasEquipment.find(eq => eq.id === equipmentId);
    if (!equipment) return;
    
    setIsDragging(true);
    setDraggedEquipment(equipmentId);
    setSelectedEquipment(equipmentId);
    
    // Calculate the offset between mouse position and equipment position
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    setDragOffset({ x: offsetX, y: offsetY });
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !draggedEquipment || !canvasRef.current) return;
    
    e.preventDefault();
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - dragOffset.x;
    const y = e.clientY - rect.top - dragOffset.y;
    
    // Update the position of the dragged equipment
    setCanvasEquipment(prev => 
      prev.map(eq => 
        eq.id === draggedEquipment 
          ? { ...eq, position: { x: x + 50, y: y + 50 } } 
          : eq
      )
    );
    
    // Also update connections involving this equipment
    updateConnectionPositions(draggedEquipment, { x: x + 50, y: y + 50 });
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedEquipment(null);
  };

  const handleEquipmentClick = (id: string) => {
    setSelectedEquipment(prevSelected => prevSelected === id ? null : id);
    setShowPropertyEditor(true);
  };

  const handleRemoveEquipment = (id: string) => {
    // Remove all connections involving this equipment
    setConnections(prev => prev.filter(conn => conn.source !== id && conn.target !== id));
    
    // Remove the equipment itself
    setCanvasEquipment(prev => prev.filter(item => item.id !== id));
    setSelectedEquipment(null);
    setShowPropertyEditor(false);
    
    toast({
      title: "Equipment Removed",
      description: "The selected equipment has been removed.",
    });
  };

  const handleClearCanvas = () => {
    if (canvasEquipment.length === 0) return;
    
    setCanvasEquipment([]);
    setConnections([]);
    setSelectedEquipment(null);
    setShowPropertyEditor(false);
    
    toast({
      title: "Canvas Cleared",
      description: "All equipment has been removed from the process canvas.",
    });
  };

  const updateConnectionPositions = (equipmentId: string, newPosition: EquipmentPosition) => {
    setConnections(prevConnections => 
      prevConnections.map(conn => {
        if (conn.source === equipmentId) {
          return { ...conn, sourcePosition: newPosition };
        }
        if (conn.target === equipmentId) {
          return { ...conn, targetPosition: newPosition };
        }
        return conn;
      })
    );
  };
  
  const handleConnectionPointClick = (equipmentId: string, point: string) => {
    // If we're not already starting a connection, mark this as the start
    if (!connectionStart) {
      setConnectionStart({ equipmentId, point });
      
      // Mark this connection point as active
      setCanvasEquipment(prev => 
        prev.map(eq => 
          eq.id === equipmentId 
            ? { ...eq, activeConnectionPoints: [...eq.activeConnectionPoints, point] } 
            : eq
        )
      );
      
      return;
    }
    
    // Don't allow connecting to the same equipment
    if (connectionStart.equipmentId === equipmentId) {
      // If clicking the same point, cancel the connection
      if (connectionStart.point === point) {
        // Remove active status from the point
        setCanvasEquipment(prev => 
          prev.map(eq => 
            eq.id === equipmentId 
              ? { ...eq, activeConnectionPoints: eq.activeConnectionPoints.filter(p => p !== point) } 
              : eq
          )
        );
        
        setConnectionStart(null);
      }
      return;
    }
    
    // Create the connection
    const sourceEquipment = canvasEquipment.find(eq => eq.id === connectionStart.equipmentId);
    const targetEquipment = canvasEquipment.find(eq => eq.id === equipmentId);
    
    if (!sourceEquipment || !targetEquipment) return;
    
    // Try to determine what's flowing - if source is a feed stream use its component
    const flowingComponent = sourceEquipment.type === "feed" ? sourceEquipment.feedComponent : undefined;
    
    const newConnection: Connection = {
      id: `connection-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      source: connectionStart.equipmentId,
      sourcePoint: connectionStart.point,
      target: equipmentId,
      targetPoint: point,
      sourcePosition: sourceEquipment.position,
      targetPosition: targetEquipment.position,
      component: flowingComponent,
      flowRate: "100 kg/h"
    };
    
    setConnections(prev => [...prev, newConnection]);
    
    // Mark the target connection point as active
    setCanvasEquipment(prev => 
      prev.map(eq => 
        eq.id === equipmentId 
          ? { ...eq, activeConnectionPoints: [...eq.activeConnectionPoints, point] } 
          : eq
      )
    );
    
    // Clear the connection start state
    setConnectionStart(null);
    
    toast({
      title: "Connection Created",
      description: "Flow connection has been established between equipment.",
    });
  };
  
  const handleRemoveConnection = (connectionId: string) => {
    const connection = connections.find(conn => conn.id === connectionId);
    if (!connection) return;
    
    // Remove active status from connection points
    setCanvasEquipment(prev => 
      prev.map(eq => {
        if (eq.id === connection.source) {
          return { 
            ...eq, 
            activeConnectionPoints: eq.activeConnectionPoints.filter(p => p !== connection.sourcePoint) 
          };
        }
        if (eq.id === connection.target) {
          return { 
            ...eq, 
            activeConnectionPoints: eq.activeConnectionPoints.filter(p => p !== connection.targetPoint) 
          };
        }
        return eq;
      })
    );
    
    // Remove the connection
    setConnections(prev => prev.filter(conn => conn.id !== connectionId));
  };
  
  const handleSelectEquipment = (equipmentType: EquipmentType) => {
    // Create a new equipment with the selected type
    let title = equipmentType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    
    // Special handling for feed streams
    const isFeed = equipmentType === "feed";
    let component = undefined;
    
    if (isFeed && selectedComponents.length > 0) {
      // User selected a feed type, so we'll prompt for which component
      component = selectedComponents[0]; // Default to first component
      title = `${component} Feed`;
    }
    
    const newEquipment: CanvasEquipment = {
      id: `equipment-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type,
      title,
      position: { x: 200, y: 200 }, // Default position in the middle
      metrics: [...equipmentMetrics],
      activeConnectionPoints: [],
      feedComponent: component
    };
    
    if (isFeed && component) {
      // Add specific metrics for feed streams
      newEquipment.metrics = [
        { key: "Component", value: component, editable: false },
        { key: "Temperature", value: "25°C", editable: true },
        { key: "Pressure", value: "101 kPa", editable: true },
        { key: "Flow Rate", value: "100 kg/h", editable: true }
      ];
    }
    
    setCanvasEquipment(prev => [...prev, newEquipment]);
    
    toast({
      title: "Equipment Added",
      description: `${title} added to the process canvas.`,
    });
  };
  
  // Calculate the position of a connection point on an equipment
  const getConnectionPointPosition = (equipment: CanvasEquipment, point: string): ConnectionPoint => {
    let x = equipment.position.x;
    let y = equipment.position.y;
    
    // Adjust position based on connection point type
    switch (point) {
      case 'left':
        x -= 15; // Adjust based on your connection point design
        break;
      case 'right':
        x += 15;
        break;
      case 'top':
        y -= 15;
        break;
      case 'bottom':
        y += 15;
        break;
      // Add cases for other connection points as needed
      default:
        // For custom points like "input-2", "shell-in", etc.
        if (point.includes('left') || point.includes('input')) {
          x -= 15;
        } else if (point.includes('right') || point.includes('output')) {
          x += 15;
        } else if (point.includes('top') || point.includes('in')) {
          y -= 15;
        } else if (point.includes('bottom') || point.includes('out')) {
          y += 15;
        }
        break;
    }
    
    return { x, y, point };
  };
  
  // Calculate path points for the SVG connection lines
  const calculateConnectionPath = (source: CanvasEquipment, target: CanvasEquipment, sourcePoint: string, targetPoint: string) => {
    const sourcePos = getConnectionPointPosition(source, sourcePoint);
    const targetPos = getConnectionPointPosition(target, targetPoint);
    
    return {
      sourceX: sourcePos.x,
      sourceY: sourcePos.y,
      targetX: targetPos.x,
      targetY: targetPos.y
    };
  };

  // Update equipment property
  const handleUpdateProperty = (equipmentId: string, propertyKey: string, value: string) => {
    setCanvasEquipment(prev => 
      prev.map(eq => {
        if (eq.id === equipmentId) {
          return {
            ...eq,
            metrics: eq.metrics.map(metric => 
              metric.key === propertyKey ? { ...metric, value } : metric
            )
          };
        }
        return eq;
      })
    );
    
    toast({
      title: "Property Updated",
      description: `${propertyKey} updated to ${value}`,
    });
  };

  const handleRunSimulation = () => {
    if (canvasEquipment.length === 0) {
      toast({
        title: "Cannot Run Simulation",
        description: "Please add equipment to the canvas first.",
        variant: "destructive"
      });
      return;
    }

    if (connections.length === 0) {
      toast({
        title: "Cannot Run Simulation",
        description: "Please connect your equipment before running the simulation.",
        variant: "destructive"
      });
      return;
    }

    // Process name determination
    let processName = "Chemical Process";
    
    // Check if we have a distillation process
    if (canvasEquipment.some(eq => eq.type === "distillation" || eq.type === "column")) {
      processName = "Distillation Process";
    } 
    // Check if we have a reaction process
    else if (canvasEquipment.some(eq => eq.type === "reactor")) {
      processName = "Chemical Reaction Process";
    }
    // Check if we have a heat exchange process
    else if (canvasEquipment.some(eq => eq.type === "heat-exchanger" || eq.type === "cooler" || eq.type === "heater")) {
      processName = "Heat Exchange Process";
    }

    setSimulationSubject(processName);
    setSimulationResults(true);
    
    toast({
      title: "Simulation Running",
      description: "Processing your simulation...",
    });
    
    // Simulate a delay to show "processing"
    setTimeout(() => {
      toast({
        title: "Simulation Complete",
        description: "Results are now available for review.",
      });
    }, 1500);
  };
  
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg col-span-1 shadow-md border border-blue-200">
          <h3 className="text-lg font-medium mb-3 text-blue-800">Equipment Library</h3>
          <p className="text-sm text-blue-600 mb-2">Drag equipment to the canvas to build your process</p>
          
          <EquipmentSelector onSelectEquipment={handleSelectEquipment} />
          
          {selectedComponents.length > 0 && (
            <div className="mt-4 border-t border-blue-200 pt-4">
              <h4 className="text-md font-medium mb-2 text-blue-700">Feed Streams</h4>
              <div className="grid grid-cols-1 gap-2">
                {selectedComponents.map((component, idx) => (
                  <div 
                    key={idx} 
                    className="bg-gradient-to-r from-green-100 to-emerald-100 p-2 rounded-lg border border-green-200 cursor-grab flex items-center"
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, "feed", `${component} Feed`)}
                  >
                    <div className="bg-green-200 p-1 rounded-md mr-2">
                      <Droplets className="h-4 w-4 text-green-700" />
                    </div>
                    <span className="text-sm font-medium text-green-800">{component} Feed</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-4 grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-2">
            {libraryEquipment.map((equipment, index) => (
              <EquipmentCard 
                key={index}
                type={equipment.type} 
                title={equipment.title}
                onDragStart={(e) => handleDragStart(e, equipment.type, equipment.title)}
                metrics={equipmentMetrics}
                status="ready"
                size="sm"
                showConnections={false}
              />
            ))}
          </div>
        </div>
        
        <div 
          ref={canvasRef}
          className="bg-gradient-to-br from-slate-50 to-blue-50 border border-blue-200 p-4 rounded-lg col-span-2 relative min-h-[500px] shadow-md"
          onDragOver={handleCanvasDragOver}
          onDrop={handleCanvasDrop}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium text-blue-800">Process Canvas</h3>
            <div className="flex gap-2">
              {canvasEquipment.length > 0 && (
                <>
                  <div className="flex items-center mr-3">
                    <label htmlFor="show-dotted-lines" className="mr-2 text-sm text-blue-700">
                      Show Flow Lines
                    </label>
                    <input
                      id="show-dotted-lines"
                      type="checkbox"
                      checked={showDottedLines}
                      onChange={(e) => setShowDottedLines(e.target.checked)}
                      className="rounded text-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <Button 
                    onClick={handleRunSimulation}
                    className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white shadow-md"
                  >
                    Run Simulation
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-500 border-red-200 hover:bg-red-50"
                    onClick={handleClearCanvas}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Clear Canvas
                  </Button>
                </>
              )}
            </div>
          </div>
          
          {canvasEquipment.length > 0 ? (
            <div className="relative w-full h-[450px]">
              {/* Draw connections */}
              <svg className="absolute inset-0 pointer-events-none z-0">
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 3.5, 0 7" fill="#6366f1" />
                  </marker>
                </defs>
                
                {connections.map(conn => {
                  const source = canvasEquipment.find(e => e.id === conn.source);
                  const target = canvasEquipment.find(e => e.id === conn.target);
                  
                  if (!source || !target) return null;
                  
                  const { sourceX, sourceY, targetX, targetY } = calculateConnectionPath(
                    source, 
                    target, 
                    conn.sourcePoint, 
                    conn.targetPoint
                  );
                  
                  return (
                    <g key={conn.id}>
                      <line 
                        x1={sourceX} 
                        y1={sourceY}
                        x2={targetX} 
                        y2={targetY}
                        stroke="#6366f1"
                        strokeWidth="2"
                        strokeDasharray="4"
                        markerEnd="url(#arrowhead)"
                        onClick={() => handleRemoveConnection(conn.id)}
                        className="hover:stroke-blue-700 hover:stroke-[3px] cursor-pointer"
                      />
                    </g>
                  );
                })}
              </svg>
              
              {canvasEquipment.map(equipment => (
                <div 
                  key={equipment.id} 
                  className={`absolute ${isDragging && draggedEquipment === equipment.id ? 'cursor-grabbing' : 'cursor-grab'}`}
                  style={{ 
                    left: `${equipment.position.x - 50}px`, 
                    top: `${equipment.position.y - 50}px`,
                    zIndex: selectedEquipment === equipment.id ? 10 : 1,
                    transition: isDragging && draggedEquipment === equipment.id ? 'none' : 'all 0.2s'
                  }}
                  onMouseDown={(e) => handleMouseDown(e, equipment.id)}
                >
                  <EquipmentCard 
                    type={equipment.type}
                    title={equipment.title}
                    metrics={equipment.metrics}
                    draggable={false}
                    selected={selectedEquipment === equipment.id}
                    onClick={() => handleEquipmentClick(equipment.id)}
                    size="sm"
                    showConnections={true}
                    onConnectionPointClick={(point) => handleConnectionPointClick(equipment.id, point)}
                    activeConnectionPoints={equipment.activeConnectionPoints}
                    showDottedLines={showDottedLines} // Pass the showDottedLines prop
                  />
                  
                  {selectedEquipment === equipment.id && (
                    <div className="absolute top-0 right-0 -mt-2 -mr-2">
                      <Button 
                        size="icon" 
                        variant="destructive" 
                        className="h-6 w-6 rounded-full"
                        onClick={() => handleRemoveEquipment(equipment.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[450px] flex items-center justify-center">
              <p className="text-gray-400">Drag equipment here to build your process</p>
            </div>
          )}
        </div>
      </div>
      
      {selectedEquipment && showPropertyEditor && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg mb-6 shadow-md border border-indigo-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-indigo-800 flex items-center gap-2">
              <Settings className="h-5 w-5 text-indigo-700" />
              Equipment Properties
            </h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowPropertyEditor(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {canvasEquipment.find(eq => eq.id === selectedEquipment) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-indigo-700">Equipment Name</Label>
                    <Input 
                      value={canvasEquipment.find(eq => eq.id === selectedEquipment)?.title}
                      onChange={(e) => {
                        setCanvasEquipment(prev => 
                          prev.map(eq => 
                            eq.id === selectedEquipment ? { ...eq, title: e.target.value } : eq
                          )
                        );
                      }}
                      className="bg-white/80"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-indigo-700">Type</Label>
                    <Input 
                      value={canvasEquipment.find(eq => eq.id === selectedEquipment)?.type}
                      disabled
                      className="bg-white/50 text-gray-600"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="text-indigo-700 block mb-2">Properties</Label>
                <div className="bg-white/80 rounded-lg p-3 space-y-3 shadow-sm">
                  {canvasEquipment.find(eq => eq.id === selectedEquipment)?.metrics.map((metric, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-gray-700">{metric.key}</span>
                      <div className="w-32">
                        {metric.editable ? (
                          <Input 
                            value={metric.value} 
                            onChange={(e) => handleUpdateProperty(selectedEquipment, metric.key, e.target.value)}
                            className="h-7 text-sm"
                          />
                        ) : (
                          <div className="bg-gray-100 px-3 py-1 rounded text-gray-700 text-sm">{metric.value}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-4 rounded-lg mb-6 shadow-md border border-teal-200">
        <h3 className="text-lg font-medium mb-3 text-teal-800">Process Flow Steps</h3>
        <ProcessFlow />
      </div>
      
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-lg shadow-md border border-amber-200">
        <h3 className="text-lg font-medium mb-3 text-amber-800">Process Parameters</h3>
        
        <Tabs defaultValue="basic">
          <TabsList className="mb-4 bg-white/50">
            <TabsTrigger value="basic">
              <Thermometer className="h-4 w-4 mr-1" />
              Operating Conditions
            </TabsTrigger>
            <TabsTrigger value="process">
              <Beaker className="h-4 w-4 mr-1" />
              Process Type
            </TabsTrigger>
            <TabsTrigger value="components">
              <Droplets className="h-4 w-4 mr-1" />
              Components
            </TabsTrigger>
            <TabsTrigger value="advanced">
              <Activity className="h-4 w-4 mr-1" />
              Advanced
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="operating-temp">Operating Temperature (°C)</Label>
                <Input 
                  id="operating-temp"
                  value={operatingTemp}
                  onChange={(e) => setOperatingTemp(e.target.value)}
                  type="number"
                  placeholder="85"
                  className="bg-white/80"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="operating-pressure">Operating Pressure (kPa)</Label>
                <Input 
                  id="operating-pressure"
                  value={operatingPressure}
                  onChange={(e) => setOperatingPressure(e.target.value)}
                  type="number"
                  placeholder="150"
                  className="bg-white/80"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="feed-flow">Feed Flow Rate (kg/h)</Label>
                <Input 
                  id="feed-flow"
                  value={feedFlowRate}
                  onChange={(e) => setFeedFlowRate(e.target.value)}
                  type="number"
                  placeholder="1200"
                  className="bg-white/80"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="process">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="process-type">Process Type</Label>
                <Select value={processType} onValueChange={setProcessType}>
                  <SelectTrigger id="process-type" className="bg-white/80">
                    <SelectValue placeholder="Select process type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="distillation">Distillation</SelectItem>
                    <SelectItem value="reaction">Chemical Reaction</SelectItem>
                    <SelectItem value="extraction">Liquid-Liquid Extraction</SelectItem>
                    <SelectItem value="absorption">Gas Absorption</SelectItem>
                    <SelectItem value="heat-exchange">Heat Exchange</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {processType === "distillation" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reflux-ratio">Reflux Ratio</Label>
                    <Input id="reflux-ratio" type="number" defaultValue="1.5" className="bg-white/80" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="number-of-stages">Number of Theoretical Stages</Label>
                    <Input id="number-of-stages" type="number" defaultValue="10" className="bg-white/80" />
                  </div>
                </div>
              )}
              
              {processType === "reaction" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="conversion">Conversion (%)</Label>
                    <Input id="conversion" type="number" defaultValue="95" className="bg-white/80" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reaction-order">Reaction Order</Label>
                    <Select defaultValue="first">
                      <SelectTrigger id="reaction-order" className="bg-white/80">
                        <SelectValue placeholder="Select reaction order" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="zero">Zero Order</SelectItem>
                        <SelectItem value="first">First Order</SelectItem>
                        <SelectItem value="second">Second Order</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="components">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-amber-800">Selected Components</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {selectedComponents.map((component) => (
                    <div 
                      key={component} 
                      className="p-2 bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-200 rounded-md text-sm text-amber-800 shadow-sm"
                    >
                      {component}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-amber-800">Using Thermodynamic Model: </Label>
                <div className="p-2 bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 rounded-md inline-block text-green-800 shadow-sm">
                  {thermodynamicModel}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="calculation-method">Calculation Method</Label>
                <Select defaultValue="inside-out">
                  <SelectTrigger id="calculation-method" className="bg-white/80">
                    <SelectValue placeholder="Select calculation method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inside-out">Inside-Out</SelectItem>
                    <SelectItem value="newton">Newton's Method</SelectItem>
                    <SelectItem value="quasi-newton">Quasi-Newton</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tolerance">Convergence Tolerance</Label>
                <Input id="tolerance" type="number" defaultValue="0.0001" step="0.0001" className="bg-white/80" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="max-iterations">Maximum Iterations</Label>
                <Input id="max-iterations" type="number" defaultValue="100" className="bg-white/80" />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {simulationResults && (
        <div className="mt-6">
          <SimulationResults
            simulationSubject={simulationSubject}
            components={selectedComponents}
            thermodynamicModel={thermodynamicModel}
          />
          <div className="mt-4 flex justify-end">
            <Button 
              variant="outline" 
              className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50 shadow-sm flex items-center"
              onClick={() => setSimulationResults(false)}
            >
              <FileText className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulationBuilder;
