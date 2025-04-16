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
import { getEquipmentIcon } from "@/components/ui/equipment/EquipmentIcons";

// Equipment types
const heatExchangerEquipment = [
  { id: "shell-tube", name: "Shell & Tube", type: "shell-tube-heat-exchanger", description: "Standard shell and tube heat exchanger" },
  { id: "plate-heat", name: "Plate Heat Exchanger", type: "plate-heat-exchanger", description: "Compact plate-type heat exchanger" },
  { id: "air-cooler", name: "Air Cooler", type: "air-cooler", description: "Forced/induced draft air cooler" },
  { id: "double-pipe", name: "Double Pipe", type: "double-pipe", description: "Simple double pipe heat exchanger" },
  { id: "spiral", name: "Spiral", type: "spiral-heat-exchanger", description: "Spiral-type heat exchanger" },
  { id: "plate-fin", name: "Plate-Fin", type: "plate-fin-exchanger", description: "Compact plate-fin design" },
];

const separationEquipment = [
  { id: "flash", name: "Flash Drum", type: "flash", description: "Vapor-liquid separation" },
  { id: "3-phase", name: "Three Phase Separator", type: "three-phase-separator", description: "Gas-liquid-liquid separation" },
  { id: "component-split", name: "Component Splitter", type: "component-splitter", description: "Pure component separation" },
  { id: "hydrocyclone", name: "Hydrocyclone", type: "hydrocyclone", description: "Centrifugal separation" },
  { id: "membrane", name: "Membrane", type: "membrane", description: "Membrane-based separation" },
];

const processEquipment = [
  { id: "pump", name: "Pump", type: "pump", description: "Liquid pressure increase" },
  { id: "compressor", name: "Compressor", type: "compressor", description: "Gas compression" },
  { id: "expander", name: "Expander", type: "expander", description: "Gas expansion" },
  { id: "valve", name: "Control Valve", type: "valve", description: "Flow control" },
  { id: "mixer", name: "Mixer", type: "mixer", description: "Stream mixing" },
  { id: "splitter", name: "Splitter", type: "splitter", description: "Stream splitting" },
  { id: "pipe", name: "Pipe Segment", type: "pipe-segment", description: "Pipe flow calculations" },
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
            <TabsList className="mx-2 mt-2 grid grid-cols-4">
              <TabsTrigger value="process">Process</TabsTrigger>
              <TabsTrigger value="heat">Heat Exchange</TabsTrigger>
              <TabsTrigger value="separation">Separation</TabsTrigger>
              <TabsTrigger value="columns">Columns</TabsTrigger>
              <TabsTrigger value="reactors">Reactors</TabsTrigger>
            </TabsList>
            
            <div className="p-2 flex-1 overflow-y-auto">
              <TabsContent value="process" className="mt-0 space-y-2">
                {processEquipment.map(equipment => (
                  <EquipmentItem 
                    key={equipment.id}
                    equipment={equipment}
                    onDragStart={handleDragStart}
                  />
                ))}
              </TabsContent>

              <TabsContent value="heat" className="mt-0 space-y-2">
                {heatExchangerEquipment.map(equipment => (
                  <EquipmentItem 
                    key={equipment.id}
                    equipment={equipment}
                    onDragStart={handleDragStart}
                  />
                ))}
              </TabsContent>

              <TabsContent value="separation" className="mt-0 space-y-2">
                {separationEquipment.map(equipment => (
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
                }}
              >
                <div 
                  className="w-16 h-16 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-md flex items-center justify-center"
                >
                  {getEquipmentIcon(equipment.type)}
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
          {getEquipmentIcon(equipment.type)}
        </div>
        <div>
          <div className="text-sm font-medium">{equipment.name}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{equipment.description}</div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2 } from 'lucide-react';

interface EquipmentPropertiesProps {
  equipment: Equipment;
  onUpdate: (id: string, updates: Partial<Equipment>) => void;
  onDelete: () => void;
  components: string[];
}

export const EquipmentProperties: React.FC<EquipmentPropertiesProps> = ({
  equipment,
  onUpdate,
  onDelete,
  components
}) => {
  const [activeTab, setActiveTab] = useState('basic');

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="operating">Operating</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div>
            <Label>Equipment Name</Label>
            <Input
              value={equipment.name}
              onChange={(e) => onUpdate(equipment.id, { name: e.target.value })}
            />
          </div>
          <div>
            <Label>Equipment Type</Label>
            <Input value={equipment.type} disabled />
          </div>
          <div>
            <Label>Description</Label>
            <textarea
              className="w-full p-2 border rounded"
              value={equipment.description || ''}
              onChange={(e) => onUpdate(equipment.id, { description: e.target.value })}
            />
          </div>
        </TabsContent>

        <TabsContent value="operating" className="space-y-4">
          {renderOperatingParameters()}
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          {renderAdvancedParameters()}
        </TabsContent>
      </Tabs>

      <div className="pt-4 border-t">
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

  function renderOperatingParameters() {
    switch (equipment.type) {
      case 'heat-exchanger':
        return (
          <>
            <div>
              <Label>Heat Duty (kW)</Label>
              <Input
                type="number"
                value={equipment.settings?.heatDuty || 0}
                onChange={(e) => updateSettings('heatDuty', parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label>Hot Side Inlet Temperature (°C)</Label>
              <Input
                type="number"
                value={equipment.settings?.hotInletTemp || 0}
                onChange={(e) => updateSettings('hotInletTemp', parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label>Cold Side Inlet Temperature (°C)</Label>
              <Input
                type="number"
                value={equipment.settings?.coldInletTemp || 0}
                onChange={(e) => updateSettings('coldInletTemp', parseFloat(e.target.value))}
              />
            </div>
          </>
        );
      
      // Add more cases for different equipment types
      default:
        return <p>No specific operating parameters for this equipment type.</p>;
    }
  }

  function renderAdvancedParameters() {
    switch (equipment.type) {
      case 'heat-exchanger':
        return (
          <>
            <div>
              <Label>Overall Heat Transfer Coefficient (W/m²·K)</Label>
              <Input
                type="number"
                value={equipment.settings?.heatTransferCoeff || 0}
                onChange={(e) => updateSettings('heatTransferCoeff', parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label>Fouling Factor</Label>
              <Input
                type="number"
                value={equipment.settings?.foulingFactor || 0}
                onChange={(e) => updateSettings('foulingFactor', parseFloat(e.target.value))}
              />
            </div>
          </>
        );
      
      // Add more cases for different equipment types
      default:
        return <p>No advanced parameters for this equipment type.</p>;
    }
  }

  function updateSettings(key: string, value: any) {
    onUpdate(equipment.id, {
      settings: {
        ...equipment.settings,
        [key]: value
      }
    });
  }
};

export default EquipmentProperties;

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
            <select className="w-
