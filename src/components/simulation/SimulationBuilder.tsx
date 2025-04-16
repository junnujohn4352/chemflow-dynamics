import React, { useState, useRef, useEffect } from "react";
import { 
  Settings, Save, Plus, Trash2, ZoomIn, ZoomOut, MousePointer, 
  Hand, Link, Play, Check, BarChart3, RefreshCw, ChevronDown,
  ChevronLeft, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StreamDataPanel from "./StreamDataPanel";

// Equipment types
const processingEquipment = [
  { id: "pump", name: "Pump", type: "pump", description: "Increases fluid pressure" },
  { id: "compressor", name: "Compressor", type: "compressor", description: "Increases gas pressure" },
  { id: "heat-exchanger", name: "Heat Exchanger", type: "heat-exchanger", description: "Transfers heat between fluids" },
  { id: "mixer", name: "Mixer", type: "mixer", description: "Combines multiple streams" },
  { id: "splitter", name: "Splitter", type: "splitter", description: "Divides a stream into multiple outputs" },
  { id: "valve", name: "Valve", type: "valve", description: "Controls flow rate or pressure" },
  { id: "flash-drum", name: "Flash Drum", type: "flash-drum", description: "Separates vapor and liquid phases" },
];

const columnEquipment = [
  { id: "distillation", name: "Distillation Column", type: "distillation", description: "Separates components by boiling point" },
  { id: "absorption", name: "Absorption Column", type: "absorption", description: "Removes components using a solvent" },
  { id: "stripping", name: "Stripping Column", type: "stripping", description: "Removes dissolved gases from liquids" },
  { id: "extraction", name: "Extraction Column", type: "extraction", description: "Separates using liquid-liquid extraction" },
];

const reactorEquipment = [
  { id: "cstr", name: "CSTR", type: "cstr", description: "Continuous stirred-tank reactor" },
  { id: "pfr", name: "PFR", type: "pfr", description: "Plug flow reactor" },
  { id: "batch", name: "Batch Reactor", type: "batch", description: "Batch reaction vessel" },
  { id: "gibbs", name: "Gibbs Reactor", type: "gibbs", description: "Equilibrium reactor" },
];

// Equipment rendering functions
const renderEquipmentIcon = (type: string) => {
  switch (type) {
    case 'pump':
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
          <circle cx="12" cy="12" r="8" />
          <line x1="12" y1="4" x2="12" y2="8" />
          <line x1="12" y1="16" x2="12" y2="20" />
          <line x1="6" y1="12" x2="18" y2="12" />
        </svg>
      );
    case 'compressor':
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
          <rect x="4" y="8" width="16" height="8" rx="2" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="12" y1="8" x2="12" y2="16" />
        </svg>
      );
    case 'heat-exchanger':
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
          <path d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      );
    case 'mixer':
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
          <circle cx="12" cy="12" r="8" />
          <line x1="4" y1="12" x2="8" y2="12" />
          <line x1="16" y1="12" x2="20" y2="12" />
          <line x1="12" y1="4" x2="12" y2="8" />
          <line x1="12" y1="16" x2="12" y2="20" />
        </svg>
      );
    case 'splitter':
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
          <circle cx="12" cy="12" r="8" />
          <line x1="4" y1="12" x2="8" y2="12" />
          <line x1="16" y1="8" x2="20" y2="4" />
          <line x1="16" y1="16" x2="20" y2="20" />
        </svg>
      );
    case 'valve':
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
          <path d="M4 12h16" />
          <path d="M12 4l-4 8 8 8-4-8" />
        </svg>
      );
    case 'flash-drum':
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
          <rect x="4" y="8" width="16" height="12" rx="2" />
          <line x1="12" y1="4" x2="12" y2="8" />
          <line x1="12" y1="20" x2="12" y2="24" />
        </svg>
      );
    case 'distillation':
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
          <rect x="6" y="4" width="12" height="16" rx="2" />
          <line x1="6" y1="8" x2="18" y2="8" />
          <line x1="6" y1="12" x2="18" y2="12" />
          <line x1="6" y1="16" x2="18" y2="16" />
          <line x1="12" y1="20" x2="12" y2="24" />
        </svg>
      );
    case 'cstr':
    case 'batch':
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
          <circle cx="12" cy="12" r="8" />
          <path d="M12 4v4M12 16v4M4 12h4M16 12h4" />
        </svg>
      );
    case 'pfr':
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
          <rect x="4" y="8" width="16" height="8" rx="4" />
          <line x1="4" y1="12" x2="20" y2="12" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="12" y1="4" x2="12" y2="20" />
        </svg>
      );
  }
};

// Types
interface Equipment {
  id: string;
  name: string;
  type: string;
  position: { x: number; y: number };
  settings?: Record<string, any>;
}

interface Connection {
  id?: string;
  source: { id: string; x: number; y: number; port?: string };
  target: { id: string; x: number; y: number; port?: string };
  isInProgress?: boolean;
}

const SimulationBuilder: React.FC<{
  selectedComponents: string[];
  thermodynamicModel: string;
  onRunSimulation: () => void;
}> = ({ selectedComponents, thermodynamicModel, onRunSimulation }) => {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [mode, setMode] = useState<'select' | 'pan' | 'connect'>('select');
  const [scale, setScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
  const [draggingEquipment, setDraggingEquipment] = useState<string | null>(null);
  const [connectionInProgress, setConnectionInProgress] = useState<Partial<Connection> | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Handle canvas mouse events for panning
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (mode === 'pan') {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    } else if (mode === 'select') {
      // Deselect when clicking on empty canvas
      setSelectedEquipment(null);
    }
  };
  
  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (isPanning && mode === 'pan') {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    }
    
    // Update connection in progress
    if (connectionInProgress && connectionInProgress.source) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = (e.clientX - rect.left - panOffset.x) / scale;
        const y = (e.clientY - rect.top - panOffset.y) / scale;
        
        setConnections(prev => {
          const filtered = prev.filter(c => !c.isInProgress);
          return [
            ...filtered,
            {
              source: connectionInProgress.source as Connection['source'],
              target: { id: 'temp', x, y },
              isInProgress: true
            }
          ];
        });
      }
    }
  };
  
  const handleCanvasMouseUp = () => {
    if (isPanning) {
      setIsPanning(false);
    }
    
    // End connection in progress if not connected to a target
    if (connectionInProgress) {
      setConnections(prev => prev.filter(c => !c.isInProgress));
      setConnectionInProgress(null);
    }
  };
  
  // Handle equipment dragging
  const handleDragStart = (e: React.DragEvent, equipment: { id: string; name: string; type: string }) => {
    e.dataTransfer.setData('application/json', JSON.stringify(equipment));
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    const data = e.dataTransfer.getData('application/json');
    if (data) {
      try {
        const equipment = JSON.parse(data);
        const rect = canvasRef.current?.getBoundingClientRect();
        
        if (rect) {
          const x = (e.clientX - rect.left - panOffset.x) / scale;
          const y = (e.clientY - rect.top - panOffset.y) / scale;
          
          const newEquipment: Equipment = {
            id: `${equipment.id}-${Date.now()}`,
            name: equipment.name,
            type: equipment.type,
            position: { x, y },
            settings: {}
          };
          
          setEquipmentList(prev => [...prev, newEquipment]);
        }
      } catch (error) {
        console.error('Error parsing dragged equipment:', error);
      }
    }
  };
  
  // Connection handling
  const startConnection = (e: React.MouseEvent, equipmentId: string, port: string) => {
    e.stopPropagation();
    
    const equipment = equipmentList.find(eq => eq.id === equipmentId);
    if (!equipment) return;
    
    let portX = equipment.position.x;
    let portY = equipment.position.y;
    
    // Adjust position based on port location
    switch (port) {
      case 'left':
        portX -= 8;
        portY += 8;
        break;
      case 'right':
        portX += 16 + 8;
        portY += 8;
        break;
      case 'top':
        portX += 8;
        portY -= 8;
        break;
      case 'bottom':
        portX += 8;
        portY += 16 + 8;
        break;
    }
    
    setConnectionInProgress({
      source: {
        id: equipmentId,
        x: portX,
        y: portY,
        port
      }
    });
  };
  
  // Equipment selection and manipulation
  const handleEquipmentSelect = (id: string) => {
    setSelectedEquipment(id);
  };
  
  const updateEquipment = (id: string, updates: Partial<Equipment>) => {
    setEquipmentList(prev => 
      prev.map(eq => eq.id === id ? { ...eq, ...updates } : eq)
    );
  };
  
  const removeEquipment = (id: string) => {
    setEquipmentList(prev => prev.filter(eq => eq.id !== id));
    setConnections(prev => prev.filter(c => c.source.id !== id && c.target.id !== id));
    setSelectedEquipment(null);
  };
  
  const clearCanvas = () => {
    if (confirm('Are you sure you want to clear the canvas? This will remove all equipment and connections.')) {
      setEquipmentList([]);
      setConnections([]);
      setSelectedEquipment(null);
    }
  };

  return (
    <div className="flex flex-col h-[700px]">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 border-b bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`px-2 ${mode === 'select' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : ''}`}
                  onClick={() => setMode('select')}
                >
                  <MousePointer className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Select Mode</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`px-2 ${mode === 'pan' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : ''}`}
                  onClick={() => setMode('pan')}
                >
                  <Hand className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Pan Mode</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`px-2 ${mode === 'connect' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : ''}`}
                  onClick={() => setMode('connect')}
                >
                  <Link className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Connect Mode</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <div className="h-4 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-2"
                  onClick={() => setScale(Math.min(scale + 0.1, 2))}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom In</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-2"
                  onClick={() => setScale(Math.max(scale - 0.1, 0.5))}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom Out</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <div className="h-4 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-2"
                  onClick={() => setShowGrid(!showGrid)}
                >
                  <div className="h-4 w-4 grid grid-cols-2 grid-rows-2 gap-0.5">
                    {[...Array(4)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`${showGrid ? 'bg-blue-500' : 'bg-gray-400'} rounded-sm`}
                      ></div>
                    ))}
                  </div>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle Grid</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-2"
                  onClick={clearCanvas}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Clear Canvas</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            className="flex items-center"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-4 w-4 mr-1" />
            Settings
          </Button>
          
          <Button
            size="sm"
            className="flex items-center bg-green-600 hover:bg-green-700 text-white"
            onClick={onRunSimulation}
            disabled={isRunning}
          >
            {isRunning ? (
              <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <Play className="h-4 w-4 mr-1" />
            )}
            {isRunning ? 'Running...' : 'Run Simulation'}
          </Button>
        </div>
      </div>
      
      <div className="flex flex-1 h-full overflow-hidden">
        {/* Equipment Panel */}
        <div className="w-64 border-r bg-gray-50 dark:bg-gray-800 flex flex-col">
          <div className="p-2 border-b font-medium text-sm flex justify-between items-center">
            <span>Equipment Library</span>
            <ChevronDown className="h-4 w-4" />
          </div>
          
          <Tabs defaultValue="process" className="flex-1 flex flex-col">
            <TabsList className="mx-2 mt-2 grid grid-cols-3">
              <TabsTrigger value="process">Process</TabsTrigger>
              <TabsTrigger value="columns">Columns</TabsTrigger>
              <TabsTrigger value="reactors">Reactors</TabsTrigger>
            </TabsList>
            
            <div className="p-2 flex-1 overflow-y-auto">
              <TabsContent value="process" className="mt-0 space-y-2">
                {processingEquipment.map(equipment => (
                  <EquipmentItem 
                    key={equipment.id}
                    equipment={equipment}
                    onDragStart={handleDragStart}
                  />
                ))}
              </TabsContent>
              
              <TabsContent value="columns" className="mt-0 space-y-2">
                {columnEquipment.map(equipment => (
                  <EquipmentItem 
                    key={equipment.id}
                    equipment={equipment}
                    onDragStart={handleDragStart}
                  />
                ))}
              </TabsContent>
              
              <TabsContent value="reactors" className="mt-0 space-y-2">
                {reactorEquipment.map(equipment => (
                  <EquipmentItem 
                    key={equipment.id}
                    equipment={equipment}
                    onDragStart={handleDragStart}
                  />
                ))}
              </TabsContent>
            </div>
          </Tabs>
        </div>
        
        {/* Canvas */}
        <div 
          ref={canvasRef}
          className={`flex-1 relative overflow-hidden bg-white dark:bg-gray-900 ${
            mode === 'pan' ? 'cursor-grab active:cursor-grabbing' : 
            mode === 'connect' ? 'cursor-crosshair' : 'cursor-default'
          }`}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {/* Grid */}
          {showGrid && (
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: 'linear-gradient(to right, #f0f0f0 1px, transparent 1px), linear-gradient(to bottom, #f0f0f0 1px, transparent 1px)',
                backgroundSize: `${20 * scale}px ${20 * scale}px`,
                transform: `translate(${panOffset.x}px, ${panOffset.y}px)`
              }}
            ></div>
          )}
          
          {/* Equipment and Connections */}
          <div 
            className="absolute" 
            style={{ 
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${scale})`,
              transformOrigin: '0 0'
            }}
          >
            {/* Draw connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {connections.map((connection, idx) => (
                <line
                  key={`connection-${idx}`}
                  x1={connection.source.x}
                  y1={connection.source.y}
                  x2={connection.target.x}
                  y2={connection.target.y}
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeDasharray={connection.isInProgress ? "5,5" : "none"}
                />
              ))}
            </svg>
            
            {/* Render equipment */}
            {equipmentList.map(equipment => (
              <div
                key={equipment.id}
                className={`absolute p-1 flex flex-col items-center ${
                  selectedEquipment === equipment.id ? 'ring-2 ring-blue-500' : ''
                }`}
                style={{
                  left: `${equipment.position.x}px`,
                  top: `${equipment.position.y}px`,
                  cursor: mode === 'select' ? 'pointer' : 'default',
                }}
                onClick={(e) => {
                  if (mode === 'select') {
                    e.stopPropagation();
                    handleEquipmentSelect(equipment.id);
                  }
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  setDraggingEquipment(equipment.id);
                }}
              >
                <div 
                  className="w-16 h-16 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-md flex items-center justify-center"
                >
                  {renderEquipmentIcon(equipment.type)}
                </div>
                <span className="text-xs mt-1 max-w-16 truncate">
                  {equipment.name}
                </span>
                
                {/* Connection points */}
                {mode === 'connect' && (
                  <>
                    <div 
                      className="absolute left-0 top-1/2 w-3 h-3 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                      onMouseDown={(e) => startConnection(e, equipment.id, 'left')}
                    ></div>
                    <div 
                      className="absolute right-0 top-1/2 w-3 h-3 bg-blue-500 rounded-full transform translate-x-1/2 -translate-y-1/2 cursor-pointer"
                      onMouseDown={(e) => startConnection(e, equipment.id, 'right')}
                    ></div>
                    <div 
                      className="absolute left-1/2 top-0 w-3 h-3 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                      onMouseDown={(e) => startConnection(e, equipment.id, 'top')}
                    ></div>
                    <div 
                      className="absolute left-1/2 bottom-0 w-3 h-3 bg-blue-500 rounded-full transform -translate-x-1/2 translate-y-1/2 cursor-pointer"
                      onMouseDown={(e) => startConnection(e, equipment.id, 'bottom')}
                    ></div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Properties/Details Panel */}
        {(selectedEquipment || showSettings) && (
          <div className="w-72 border-l bg-gray-50 dark:bg-gray-800 flex flex-col overflow-auto">
            <div className="p-3 border-b font-medium flex justify-between items-center">
              <span>{selectedEquipment ? 'Equipment Properties' : 'Simulation Settings'}</span>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => {
                  setSelectedEquipment(null);
                  setShowSettings(false);
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-3 flex-1">
              {selectedEquipment ? (
                <EquipmentProperties 
                  equipment={equipmentList.find(e => e.id === selectedEquipment)!}
                  onUpdate={updateEquipment}
                  onDelete={() => removeEquipment(selectedEquipment)}
                  components={selectedComponents}
                />
              ) : (
                <SimulationSettings 
                  thermodynamicModel={thermodynamicModel}
                  components={selectedComponents}
                />
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Toggle button for property panel */}
      {!selectedEquipment && !showSettings && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-0 top-1/2 transform -translate-y-1/2 opacity-50 hover:opacity-100"
          onClick={() => setShowSettings(true)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

// Equipment Item Component
interface EquipmentItemProps {
  equipment: { id: string; name: string; type: string; description: string };
  onDragStart: (e: React.DragEvent, equipment: { id: string; name: string; type: string }) => void;
}

const EquipmentItem: React.FC<EquipmentItemProps> = ({ equipment, onDragStart }) => {
  return (
    <div
      className="p-2 bg-white dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 cursor-grab hover:border-blue-300 dark:hover:border-blue-500 transition-colors"
      draggable
      onDragStart={(e) => onDragStart(e, equipment)}
    >
      <div className="flex items-center">
        <div className="mr-2 text-gray-700 dark:text-gray-300">
          {renderEquipmentIcon(equipment.type)}
        </div>
        <div>
          <div className="text-sm font-medium">{equipment.name}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{equipment.description}</div>
        </div>
      </div>
    </div>
  );
};

// Equipment Properties Component
interface EquipmentPropertiesProps {
  equipment: Equipment;
  onUpdate: (id: string, updates: Partial<Equipment>) => void;
  onDelete: () => void;
  components: string[];
}

const EquipmentProperties: React.FC<EquipmentPropertiesProps> = ({ 
  equipment, 
  onUpdate, 
  onDelete,
  components
}) => {
  const [name, setName] = useState(equipment.name);
  
  useEffect(() => {
    setName(equipment.name);
  }, [equipment.id, equipment.name]);
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  
  const handleNameBlur = () => {
    onUpdate(equipment.id, { name });
  };
  
  // Render different property fields based on equipment type
  const renderTypeSpecificProperties = () => {
    switch (equipment.type) {
      case 'heat-exchanger':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1">Heat Duty (kW)</label>
              <input 
                type="number" 
                className="w-full p-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                defaultValue={equipment.settings?.heatDuty || 100}
                onChange={(e) => onUpdate(equipment.id, { 
                  settings: { ...equipment.settings, heatDuty: parseFloat(e.target.value) } 
                })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Hot Side Inlet Temp (°C)</label>
              <input 
                type="number" 
                className="w-full p-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                defaultValue={equipment.settings?.hotInlet || 150}
                onChange={(e) => onUpdate(equipment.id, { 
                  settings: { ...equipment.settings, hotInlet: parseFloat(e.target.value) } 
                })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Cold Side Inlet Temp (°C)</label>
              <input 
                type="number" 
                className="w-full p-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                defaultValue={equipment.settings?.coldInlet || 25}
                onChange={(e) => onUpdate(equipment.id, { 
                  settings: { ...equipment.settings, coldInlet: parseFloat(e.target.value) } 
                })}
              />
            </div>
          </div>
        );
      
      case 'pump':
      case 'compressor':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1">Discharge Pressure (kPa)</label>
              <input 
                type="number" 
                className="w-full p-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                defaultValue={equipment.settings?.pressure || 200}
                onChange={(e) => onUpdate(equipment.id, { 
                  settings: { ...equipment.settings, pressure: parseFloat(e.target.value) } 
                })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Efficiency (%)</label>
              <input 
                type="number" 
                className="w-full p-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                defaultValue={equipment.settings?.efficiency || 75}
                min={0}
                max={100}
                onChange={(e) => onUpdate(equipment.id, { 
                  settings: { ...equipment.settings, efficiency: parseFloat(e.target.value) } 
                })}
              />
            </div>
          </div>
        );
      
      case 'distillation':
      case 'absorption':
      case 'stripping':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1">Number of Stages</label>
              <input 
                type="number" 
                className="w-full p-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                defaultValue={equipment.settings?.stages || 10}
                min={1}
                onChange={(e) => onUpdate(equipment.id, { 
                  settings: { ...equipment.settings, stages: parseInt(e.target.value) } 
                })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Feed Stage</label>
              <input 
                type="number" 
                className="w-full p-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                defaultValue={equipment.settings?.feedStage || 5}
                min={1}
                max={equipment.settings?.stages || 10}
                onChange={(e) => onUpdate(equipment.id, { 
                  settings: { ...equipment.settings, feedStage: parseInt(e.target.value) } 
                })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Reflux Ratio</label>
              <input 
                type="number" 
                className="w-full p-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                defaultValue={equipment.settings?.refluxRatio || 1.5}
                min={0.1}
                step={0.1}
                onChange={(e) => onUpdate(equipment.id, { 
                  settings: { ...equipment.settings, refluxRatio: parseFloat(e.target.value) } 
                })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Key Components</label>
              <select 
                className="w-full p-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                defaultValue={equipment.settings?.lightKey || (components.length > 0 ? components[0] : '')}
                onChange={(e) => onUpdate(equipment.id, { 
                  settings: { ...equipment.settings, lightKey: e.target.value } 
                })}
              >
                <option value="">Select Light Key</option>
                {components.map(comp => (
                  <option key={`light-${comp}`} value={comp}>{comp}</option>
                ))}
              </select>
              <select 
                className="w-full p-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 mt-2"
                defaultValue={equipment.settings?.heavyKey || (components.length > 1 ? components[1] : '')}
                onChange={(e) => onUpdate(equipment.id, { 
                  settings: { ...equipment.settings, heavyKey: e.target.value } 
                })}
              >
                <option value="">Select Heavy Key</option>
                {components.map(comp => (
                  <option key={`heavy-${comp}`} value={comp}>{comp}</option>
                ))}
              </select>
            </div>
          </div>
        );
      
      case 'cstr':
      case 'pfr':
      case 'batch':
      case 'gibbs':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1">Temperature (°C)</label>
              <input 
                type="number" 
                className="w-full p-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                defaultValue={equipment.settings?.temperature || 25}
                onChange={(e) => onUpdate(equipment.id, { 
                  settings: { ...equipment.settings, temperature: parseFloat(e.target.value) } 
                })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Pressure (kPa)</label>
              <input 
                type="number" 
                className="w-full p-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                defaultValue={equipment.settings?.pressure || 101.325}
                onChange={(e) => onUpdate(equipment.id, { 
                  settings: { ...equipment.settings, pressure: parseFloat(e.target.value) } 
                })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Conversion (%)</label>
              <input 
                type="number" 
                className="w-full p-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                defaultValue={equipment.settings?.conversion || 90}
                min={0}
                max={100}
                onChange={(e) => onUpdate(equipment.id, { 
                  settings: { ...equipment.settings, conversion: parseFloat(e.target.value) } 
                })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Reactants</label>
              <select 
                className="w-full p-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                multiple
                defaultValue={equipment.settings?.reactants || []}
                onChange={(e) => {
                  const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                  onUpdate(equipment.id, { 
                    settings: { ...equipment.settings, reactants: selectedOptions } 
                  });
                }}
              >
                {components.map(comp => (
                  <option key={comp} value={comp}>{comp}</option>
                ))}
              </select>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            No specific properties for this equipment type.
          </div>
        );
    }
  };
  
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium mb-1">Equipment Name</label>
        <input 
          type="text" 
          className="w-full p-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          value={name}
          onChange={handleNameChange}
          onBlur={handleNameBlur}
        />
      </div>
      
      <div>
        <label className="block text-xs font-medium mb-1">Equipment Type</label>
        <div className="p-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700">
          {equipment.type}
        </div>
      </div>
      
      <div>
        <label className="block text-xs font-medium mb-1">Position</label>
        <div className="flex space-x-2">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">X</label>
            <input 
              type="number" 
              className="w-full p-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              value={Math.round(equipment.position.x)}
              onChange={(e) => onUpdate(equipment.id, { 
                position: { ...equipment.position, x: parseInt(e.target.value) } 
              })}
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Y</label>
            <input 
              type="number" 
              className="w-full p-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              value={Math.round(equipment.position.y)}
              onChange={(e) => onUpdate(equipment.id, { 
                position: { ...equipment.position, y: parseInt(e.target.value) } 
              })}
            />
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h4 className="text-sm font-medium mb-3">Equipment Properties</h4>
        {renderTypeSpecificProperties()}
      </div>
      
      <div className="pt-4">
        <Button 
          variant="destructive" 
          size="sm" 
          className="w-full"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Remove Equipment
        </Button>
      </div>
    </div>
  );
};

// Simulation Settings Component
interface SimulationSettingsProps {
  thermodynamicModel: string;
  components: string[];
}

const SimulationSettings: React.FC<SimulationSettingsProps> = ({ 
  thermodynamicModel, 
  components 
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-2">Simulation Configuration</h4>
        <div className="space-y-3 text-sm">
          <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
            <span className="text-gray-500 dark:text-gray-400">Thermodynamic Model:</span>
            <span className="ml-2 font-medium">{thermodynamicModel}</span>
          </div>
          
          <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
            <span className="text-gray-500 dark:text-gray-400">Components:</span>
            <div className="mt-1 flex flex-wrap gap-1">
              {components.map(comp => (
                <span 
                  key={comp} 
                  className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded text-xs"
                >
                  {comp}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h4 className="text-sm font-medium mb-2">Calculation Options</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1">Convergence Tolerance</label>
            <select className="w-full p-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
              <option value="1e-3">1e-3 (Low)</option>
              <option value="1e-5" selected>1e-5 (Medium)</option>
              <option value="1e-7">1e-7 (High)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-medium mb-1">Maximum Iterations</label>
            <input 
              type="number" 
              className="w-full p-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              defaultValue={100}
              min={10}
            />
          </div>
          
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="enableHeatIntegration"
              className="rounded border-gray-300"
              defaultChecked
            />
            <label htmlFor="enableHeatIntegration" className="ml-2 text-xs">
              Enable heat integration analysis
            </label>
          </div>
          
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="enableSensitivity"
              className="rounded border-gray-300"
            />
            <label htmlFor="enableSensitivity" className="ml-2 text-xs">
              Run sensitivity analysis
            </label>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h4 className="text-sm font-medium mb-2">Stream Data</h4>
        <StreamDataPanel selectedComponents={components} />
      </div>
    </div>
  );
};

export default SimulationBuilder;
