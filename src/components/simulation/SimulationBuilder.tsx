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
  
  // ... keep existing code (handleZoomIn, handleZoomOut, handlePanCanvas, handleAddEquipment, handleClearCanvas, handleStartSimulation)

  // ... keep existing code (handleSaveSettings, handleCanvasClick, handleMouseDown, handleMouseUp)

  // ... keep existing code (handleCanvasMouseMove, handleEquipmentClick, handlePortClick, handleStartConnection)
  
  // ... keep existing code (handleEquipmentDragStart, handleEquipmentDragEnd, handleStartMove, handleOpenSettings, handleDeleteEquipment)

  // ... keep existing code (renderPort, renderEquipmentCard, renderStream, renderAnalysisSection functions)

  // ... keep existing code (remaining code including JSX render function)
};

export default SimulationBuilder;
