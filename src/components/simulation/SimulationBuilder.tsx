import React, { useState, useRef, useEffect } from 'react';
import { PlusCircle, Trash2, Save, Play, Grid3X3, ZoomIn, ZoomOut, Move } from 'lucide-react';
import ProcessFlow from '@/components/ui/ProcessFlow';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import ComponentSelector from './ComponentSelector';
import EquipmentSelector from './EquipmentSelector';
import EquipmentSettings from './EquipmentSettings';
import StreamSettings from './StreamSettings';
import FlowStream from './FlowStream';
import LlamaService from '@/services/LlamaService';

interface SimulationBuilderProps {
  selectedComponents: string[];
  thermodynamicModel: string;
  onRunSimulation: () => void;
}

interface Equipment {
  id: string;
  type: string;
  name: string;
  position: { x: number; y: number };
  rotation?: number;
  settings: Record<string, any>;
  connectionPoints?: {
    input: { x: number; y: number }[];
    output: { x: number; y: number }[];
  };
}

interface FlowStreamType {
  id: string;
  sourceId: string;
  sourcePoint: number;
  targetId: string;
  targetPoint: number;
  label?: string;
  parameters: {
    flowRate: number;
    temperature: number;
    pressure: number;
    phase: string;
    composition: Record<string, number>;
  };
}

const SimulationBuilder: React.FC<SimulationBuilderProps> = ({
  selectedComponents,
  thermodynamicModel,
  onRunSimulation
}) => {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [flowStreams, setFlowStreams] = useState<FlowStreamType[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
  const [selectedStream, setSelectedStream] = useState<string | null>(null);
  const [showEquipmentSettings, setShowEquipmentSettings] = useState(false);
  const [showStreamSettings, setShowStreamSettings] = useState(false);
  const [connecting, setConnecting] = useState<{
    active: boolean;
    sourceId: string;
    sourcePoint: number;
  } | null>(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [draggedEquipmentId, setDraggedEquipmentId] = useState<string | null>(null);
  
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [canvasDragStart, setCanvasDragStart] = useState({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setCanvasSize({ width, height });
    }
  }, []);
  
  useEffect(() => {
    const simulation = {
      components: selectedComponents,
      thermodynamicModel,
      equipment: equipmentList.map(eq => ({ type: eq.type, name: eq.name })),
      streams: flowStreams.length
    };
    
    LlamaService.getInstance().setSimulationData(simulation);
  }, [selectedComponents, thermodynamicModel, equipmentList, flowStreams]);
  
  const handleAddEquipment = (type: string) => {
    const id = `equip-${Date.now()}`;
    const name = getDefaultName(type);
    
    const settings: Record<string, any> = {};
    
    if (type === 'reactor') {
      settings.temperature = 80;
      settings.pressure = 2;
      settings.conversionMode = 'kinetic';
      settings.volume = 10;
      settings.reactionType = 'liquid-phase';
    } else if (type === 'column') {
      settings.numberOfStages = 15;
      settings.feedStage = 7;
      settings.pressure = 1.01325;
      settings.refluxRatio = 1.5;
      settings.reboilerType = 'kettle';
    } else if (type === 'heater' || type === 'cooler') {
      settings.temperature = type === 'heater' ? 120 : 30;
      settings.pressure = 1.01325;
      settings.heatDuty = type === 'heater' ? 1000 : -1000;
    } else if (type === 'pump') {
      settings.pressure = 5;
      settings.efficiency = 75;
      settings.pumpType = 'centrifugal';
    } else if (type === 'tank') {
      settings.volume = 100;
      settings.pressure = 1.01325;
      settings.temperature = 25;
    } else if (type === 'valve') {
      settings.pressureDrop = 1;
      settings.flowCoefficient = 10;
      settings.valveType = 'control';
    } else if (type === 'mixer') {
      settings.pressure = 1.01325;
      settings.mixerType = 'tee';
    } else if (type === 'splitter') {
      settings.splitRatio = 0.5;
      settings.pressure = 1.01325;
    }
    
    let connectionPoints;
    
    if (type === 'reactor' || type === 'column') {
      connectionPoints = {
        input: [{ x: 0, y: 0.5 }],
        output: [{ x: 1, y: 0.5 }, { x: 0.5, y: 1 }]
      };
    } else if (type === 'tank') {
      connectionPoints = {
        input: [{ x: 0.5, y: 0 }],
        output: [{ x: 0.5, y: 1 }]
      };
    } else if (type === 'mixer') {
      connectionPoints = {
        input: [{ x: 0, y: 0.3 }, { x: 0, y: 0.7 }],
        output: [{ x: 1, y: 0.5 }]
      };
    } else if (type === 'splitter') {
      connectionPoints = {
        input: [{ x: 0, y: 0.5 }],
        output: [{ x: 1, y: 0.3 }, { x: 1, y: 0.7 }]
      };
    } else {
      connectionPoints = {
        input: [{ x: 0, y: 0.5 }],
        output: [{ x: 1, y: 0.5 }]
      };
    }
    
    const newEquipment: Equipment = {
      id,
      type,
      name,
      position: {
        x: Math.random() * (canvasSize.width - 200),
        y: Math.random() * (canvasSize.height - 200)
      },
      settings,
      connectionPoints
    };
    
    setEquipmentList(prev => [...prev, newEquipment]);
    toast({
      title: "Equipment Added",
      description: `${name} has been added to the simulation`
    });
  };
  
  const getDefaultName = (type: string): string => {
    const count = equipmentList.filter(e => e.type === type).length + 1;
    switch (type) {
      case 'reactor': return `Reactor-${count}`;
      case 'pump': return `Pump-${count}`;
      case 'valve': return `Valve-${count}`;
      case 'heater': return `Heater-${count}`;
      case 'cooler': return `Cooler-${count}`;
      case 'column': return `Column-${count}`;
      case 'tank': return `Tank-${count}`;
      case 'mixer': return `Mixer-${count}`;
      case 'splitter': return `Splitter-${count}`;
      default: return `Equipment-${count}`;
    }
  };
  
  const handleEquipmentClick = (id: string) => {
    if (connecting?.active) {
      handleCreateConnection(id);
    } else {
      setSelectedEquipment(id);
      setSelectedStream(null);
    }
  };
  
  const handleStreamClick = (id: string) => {
    setSelectedStream(id);
    setSelectedEquipment(null);
  };
  
  const handleStartConnection = (equipmentId: string, pointIndex: number, isOutput: boolean) => {
    if (isOutput) {
      setConnecting({
        active: true,
        sourceId: equipmentId,
        sourcePoint: pointIndex
      });
    }
  };
  
  const handleCreateConnection = (targetId: string) => {
    if (!connecting) return;
    
    if (connecting.sourceId === targetId) {
      setConnecting(null);
      return;
    }
    
    const sourceEquipment = equipmentList.find(e => e.id === connecting.sourceId);
    const targetEquipment = equipmentList.find(e => e.id === targetId);
    
    if (!sourceEquipment || !targetEquipment || !targetEquipment.connectionPoints) {
      setConnecting(null);
      return;
    }
    
    const targetPoint = 0;
    
    const newStream: FlowStreamType = {
      id: `stream-${Date.now()}`,
      sourceId: connecting.sourceId,
      sourcePoint: connecting.sourcePoint,
      targetId: targetId,
      targetPoint: targetPoint,
      label: `S-${flowStreams.length + 1}`,
      parameters: {
        flowRate: 1000,
        temperature: 25,
        pressure: 1.01325,
        phase: 'Liquid',
        composition: Object.fromEntries(selectedComponents.map(c => [c, 1/selectedComponents.length]))
      }
    };
    
    setFlowStreams(prev => [...prev, newStream]);
    setConnecting(null);
    
    toast({
      title: "Connection Created",
      description: `Created flow stream from ${sourceEquipment.name} to ${targetEquipment.name}`
    });
  };
  
  const handleDeleteSelected = () => {
    if (selectedEquipment) {
      setFlowStreams(prev => prev.filter(s => 
        s.sourceId !== selectedEquipment && s.targetId !== selectedEquipment
      ));
      
      setEquipmentList(prev => prev.filter(e => e.id !== selectedEquipment));
      setSelectedEquipment(null);
      
      toast({
        title: "Equipment Deleted",
        description: "Equipment and connected streams have been removed"
      });
    } else if (selectedStream) {
      setFlowStreams(prev => prev.filter(s => s.id !== selectedStream));
      setSelectedStream(null);
      
      toast({
        title: "Stream Deleted",
        description: "Flow stream has been removed"
      });
    }
  };
  
  const handleMouseDown = (e: React.MouseEvent, equipmentId: string) => {
    e.stopPropagation();
    if (!connecting?.active) {
      setIsDragging(true);
      setDraggedEquipmentId(equipmentId);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && draggedEquipmentId) {
      const equipment = equipmentList.find(eq => eq.id === draggedEquipmentId);
      if (!equipment) return;
      
      const dx = (e.clientX - dragStart.x) / scale;
      const dy = (e.clientY - dragStart.y) / scale;
      
      setEquipmentList(prev => prev.map(eq => {
        if (eq.id === draggedEquipmentId) {
          return {
            ...eq,
            position: {
              x: eq.position.x + dx,
              y: eq.position.y + dy
            }
          };
        }
        return eq;
      }));
      
      setDragStart({ x: e.clientX, y: e.clientY });
    } else if (isDraggingCanvas) {
      const dx = e.clientX - canvasDragStart.x;
      const dy = e.clientY - canvasDragStart.y;
      
      setOffset({
        x: offset.x + dx,
        y: offset.y + dy
      });
      
      setCanvasDragStart({ x: e.clientX, y: e.clientY });
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedEquipmentId(null);
    setIsDraggingCanvas(false);
  };
  
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      setIsDraggingCanvas(true);
      setCanvasDragStart({ x: e.clientX, y: e.clientY });
      setSelectedEquipment(null);
      setSelectedStream(null);
    }
  };
  
  const handleSaveEquipmentSettings = (equipmentId: string, settings: Record<string, any>) => {
    if (!equipmentId) return;
    
    const newName = settings._equipmentName;
    delete settings._equipmentName;
    
    setEquipmentList(prev => prev.map(eq => {
      if (eq.id === equipmentId) {
        return {
          ...eq,
          name: newName || eq.name,
          settings: {
            ...eq.settings,
            ...settings
          }
        };
      }
      return eq;
    }));
    
    setShowEquipmentSettings(false);
    
    toast({
      title: "Settings Saved",
      description: "Equipment settings have been updated"
    });
  };
  
  const handleSaveStreamSettings = (streamId: string, parameters: any) => {
    setFlowStreams(prev => prev.map(stream => {
      if (stream.id === streamId) {
        return {
          ...stream,
          parameters
        };
      }
      return stream;
    }));
    
    setShowStreamSettings(false);
    
    toast({
      title: "Stream Updated",
      description: "Flow stream parameters have been updated"
    });
  };
  
  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 2));
  };
  
  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };
  
  const handleResetZoom = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };
  
  const getStreamPath = (stream: FlowStreamType) => {
    const sourceEquipment = equipmentList.find(e => e.id === stream.sourceId);
    const targetEquipment = equipmentList.find(e => e.id === stream.targetId);
    
    if (!sourceEquipment || !targetEquipment || 
        !sourceEquipment.connectionPoints || !targetEquipment.connectionPoints) {
      return null;
    }
    
    const sourcePoint = sourceEquipment.connectionPoints.output[stream.sourcePoint];
    const targetPoint = targetEquipment.connectionPoints.input[stream.targetPoint];
    
    if (!sourcePoint || !targetPoint) return null;
    
    const sourceX = sourceEquipment.position.x + sourcePoint.x * 150;
    const sourceY = sourceEquipment.position.y + sourcePoint.y * 150;
    const targetX = targetEquipment.position.x + targetPoint.x * 150;
    const targetY = targetEquipment.position.y + targetPoint.y * 150;
    
    const midX = (sourceX + targetX) / 2;
    const midY = (sourceY + targetY) / 2;
    
    const length = Math.sqrt(Math.pow(targetX - sourceX, 2) + Math.pow(targetY - sourceY, 2));
    
    return {
      source: { x: sourceX, y: sourceY },
      target: { x: targetX, y: targetY },
      mid: { x: midX, y: midY },
      length
    };
  };
  
  const renderConnectionPoints = (equipment: Equipment) => {
    if (!equipment.connectionPoints) return null;
    
    return (
      <>
        {equipment.connectionPoints.input.map((point, index) => (
          <div
            key={`in-${index}`}
            className="absolute w-3 h-3 bg-blue-400 rounded-full shadow-md border border-white transform -translate-x-1/2 -translate-y-1/2 hover:bg-blue-500 transition-colors z-20"
            style={{
              left: `${point.x * 100}%`,
              top: `${point.y * 100}%`
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        ))}
        
        {equipment.connectionPoints.output.map((point, index) => (
          <div
            key={`out-${index}`}
            className="absolute w-3 h-3 bg-green-400 rounded-full shadow-md border border-white transform -translate-x-1/2 -translate-y-1/2 hover:bg-green-500 transition-colors cursor-pointer z-20"
            style={{
              left: `${point.x * 100}%`,
              top: `${point.y * 100}%`
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleStartConnection(equipment.id, index, true);
            }}
          />
        ))}
      </>
    );
  };
  
  const renderEquipment = () => {
    return equipmentList.map(equipment => (
      <div
        key={equipment.id}
        className={`absolute w-[150px] h-[150px] cursor-grab ${isDragging && draggedEquipmentId === equipment.id ? 'cursor-grabbing z-30' : 'z-20'} ${selectedEquipment === equipment.id ? 'ring-2 ring-flow-blue ring-offset-2' : ''}`}
        style={{
          left: `${equipment.position.x}px`,
          top: `${equipment.position.y}px`,
          transform: equipment.rotation ? `rotate(${equipment.rotation}deg)` : 'none'
        }}
        onClick={(e) => {
          e.stopPropagation();
          handleEquipmentClick(equipment.id);
        }}
        onMouseDown={(e) => handleMouseDown(e, equipment.id)}
      >
        <div className="relative w-full h-full bg-white rounded-lg shadow-md border border-gray-200 p-2 flex flex-col">
          <div className="text-center font-medium text-sm mb-1 truncate">{equipment.name}</div>
          
          <div className="flex-1 flex items-center justify-center">
            {getEquipmentIcon(equipment.type)}
          </div>
          
          <div className="text-xs text-gray-500 text-center capitalize">{equipment.type}</div>
          
          {renderConnectionPoints(equipment)}
        </div>
      </div>
    ));
  };
  
  const renderFlowStreams = () => {
    return flowStreams.map(stream => {
      const pathInfo = getStreamPath(stream);
      if (!pathInfo) return null;
      
      const { source, target, mid, length } = pathInfo;
      
      const angle = Math.atan2(target.y - source.y, target.x - source.x) * 180 / Math.PI;
      
      return (
        <div key={stream.id} className="absolute top-0 left-0 z-10" style={{ pointerEvents: 'none' }}>
          <div 
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${selectedStream === stream.id ? 'z-20' : 'z-10'}`}
            style={{
              left: `${source.x}px`, 
              top: `${source.y}px`,
              width: `${length}px`,
              height: '2px',
              transformOrigin: 'left center',
              transform: `rotate(${angle}deg)`,
              pointerEvents: 'auto'
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleStreamClick(stream.id);
            }}
          >
            <FlowStream
              id={stream.id}
              sourceId={stream.sourceId}
              targetId={stream.targetId}
              label={stream.label}
              className={`${selectedStream === stream.id ? 'h-2 bg-flow-blue' : 'h-1 bg-blue-400'}`}
              animated={true}
              parameters={stream.parameters}
              onSettingsClick={() => {
                setSelectedStream(stream.id);
                setShowStreamSettings(true);
              }}
            />
          </div>
        </div>
      );
    });
  };
  
  const getEquipmentIcon = (type: string) => {
    const iconSize = "w-12 h-12";
    const iconColor = "text-flow-blue";
    
    switch (type) {
      case 'reactor':
        return (
          <svg viewBox="0 0 24 24" className={`${iconSize} ${iconColor}`}>
            <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M8 8L16 16M8 16L16 8" stroke="currentColor" strokeWidth="2" />
          </svg>
        );
      case 'pump':
        return (
          <svg viewBox="0 0 24 24" className={`${iconSize} ${iconColor}`}>
            <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M12 6V2M12 22V18M18 12h4M2 12h4" stroke="currentColor" strokeWidth="2" />
          </svg>
        );
      case 'valve':
        return (
          <svg viewBox="0 0 24 24" className={`${iconSize} ${iconColor}`}>
            <path d="M4 12h16M12 4v16" stroke="currentColor" strokeWidth="2" />
            <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        );
      case 'heater':
        return (
          <svg viewBox="0 0 24 24" className={`${iconSize} ${iconColor}`}>
            <rect x="4" y="6" width="16" height="12" rx="1" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M7 10l2 2 2-2 2 2 2-2 2 2" stroke="currentColor" strokeWidth="2" />
          </svg>
        );
      case 'cooler':
        return (
          <svg viewBox="0 0 24 24" className={`${iconSize} ${iconColor}`}>
            <rect x="4" y="6" width="16" height="12" rx="1" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M7 14l2-2 2 2 2-2 2 2 2-2" stroke="currentColor" strokeWidth="2" />
          </svg>
        );
      case 'column':
        return (
          <svg viewBox="0 0 24 24" className={`${iconSize} ${iconColor}`}>
            <rect x="8" y="4" width="8" height="16" rx="1" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M8 8h8M8 12h8M8 16h8" stroke="currentColor" strokeWidth="1" />
          </svg>
        );
      case 'tank':
        return (
          <svg viewBox="0 0 24 24" className={`${iconSize} ${iconColor}`}>
            <path d="M6 6h12v12a6 6 0 0 1-12 0V6z" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M6 10h12" stroke="currentColor" strokeWidth="1" strokeDasharray="2" />
          </svg>
        );
      case 'mixer':
        return (
          <svg viewBox="0 0 24 24" className={`${iconSize} ${iconColor}`}>
            <path d="M2 8h5l5 8h10" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M2 16h5l5-8h10" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        );
      case 'splitter':
        return (
          <svg viewBox="0 0 24 24" className={`${iconSize} ${iconColor}`}>
            <path d="M2 12h8l6 -6h6M2 12h8l6 6h6" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="10" cy="12" r="2" fill="currentColor" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" className={`${iconSize} ${iconColor}`}>
            <rect x="4" y="4" width="16" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" />
          </svg>
        );
    }
  };
  
  const getCurrentEquipmentSettings = () => {
    if (!selectedEquipment) return {};
    
    const equipment = equipmentList.find(eq => eq.id === selectedEquipment);
    return equipment?.settings || {};
  };
  
  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap gap-4 mb-4">
        <div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleDeleteSelected}
            disabled={!selectedEquipment && !selectedStream}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Selected
          </Button>
        </div>
        
        <div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              if (selectedEquipment) {
                setShowEquipmentSettings(true);
              }
            }}
            disabled={!selectedEquipment}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Equipment Settings
          </Button>
        </div>
        
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleZoomOut} title="Zoom Out">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleResetZoom} title="Reset View">
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomIn} title="Zoom In">
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex gap-4 mb-6">
        <div className="w-36 shrink-0">
          <EquipmentSelector onAddEquipment={handleAddEquipment} />
        </div>
        
        <div 
          className="flex-1 border border-blue-100 rounded-xl overflow-hidden bg-blue-50/30 relative"
          style={{ height: '600px' }}
          ref={containerRef}
        >
          <div 
            className={`absolute inset-0 ${isDraggingCanvas ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{
              backgroundImage: 'radial-gradient(circle, #e0e7ff 1px, transparent 1px)',
              backgroundSize: `${10 * scale}px ${10 * scale}px`,
              backgroundPosition: `${offset.x % (10 * scale)}px ${offset.y % (10 * scale)}px`
            }}
            ref={canvasRef}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div
              className="absolute transform-gpu"
              style={{
                transform: `scale(${scale}) translate(${offset.x / scale}px, ${offset.y / scale}px)`,
                width: '100%',
                height: '100%'
              }}
            >
              {renderFlowStreams()}
              {renderEquipment()}
              
              {connecting?.active && (
                <div className="fixed inset-0 z-50 pointer-events-none">
                  <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded absolute top-4 left-1/2 transform -translate-x-1/2">
                    Select target equipment to connect
                  </div>
                </div>
              )}
            </div>
            
            <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-md border border-blue-100 z-40">
              <div className="flex items-center gap-1">
                <Move className="h-4 w-4 text-gray-500" />
                <span className="text-xs text-gray-600">Pan: Drag canvas</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between mt-4">
        <Button 
          variant="outline"
          onClick={() => {
            toast({
              title: "Simulation Saved",
              description: "Your flowsheet has been saved"
            });
          }}
        >
          <Save className="mr-2 h-4 w-4" />
          Save Flowsheet
        </Button>
        
        <Button 
          onClick={onRunSimulation}
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
        >
          <Play className="mr-2 h-4 w-4" />
          Run Simulation
        </Button>
      </div>
      
      {showEquipmentSettings && selectedEquipment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <EquipmentSettings
            equipment={{
              id: selectedEquipment,
              type: equipmentList.find(eq => eq.id === selectedEquipment)?.type || '',
              name: equipmentList.find(eq => eq.id === selectedEquipment)?.name || '',
              settings: getCurrentEquipmentSettings()
            }}
            onClose={() => setShowEquipmentSettings(false)}
            onSave={handleSaveEquipmentSettings}
          />
        </div>
      )}
      
      {showStreamSettings && selectedStream && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <StreamSettings
            streamId={selectedStream}
            onClose={() => setShowStreamSettings(false)}
            onSave={handleSaveStreamSettings}
            availableComponents={selectedComponents}
            initialParameters={flowStreams.find(s => s.id === selectedStream)?.parameters}
          />
        </div>
      )}
    </div>
  );
};

export default SimulationBuilder;
