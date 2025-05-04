
import React, { useState, useRef, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ComponentSelector from "@/components/simulation/ComponentSelector";
import ThermodynamicsSelector from "@/components/simulation/ThermodynamicsSelector";
import EquipmentSelector from "@/components/simulation/EquipmentSelector";
import { 
  Play, 
  ArrowLeft, 
  ArrowRight, 
  Check,
  RefreshCw,
  FileText,
  ChevronRight,
  Trash2,
  X,
  Save,
  MousePointer,
  Plus,
  Link2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { EquipmentType } from "@/components/ui/equipment/EquipmentIcons";
import { Separator } from "@/components/ui/separator";
import HysysIntegration from "@/components/simulation/HysysIntegration";
import EquipmentCard, { EquipmentMetric } from "@/components/ui/EquipmentCard";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Connection interface for tracking equipment connections
interface Connection {
  fromEquipmentId: string;
  fromPoint: string;
  toEquipmentId: string;
  toPoint: string;
}

// Equipment interface for tracking equipment on the canvas
interface EquipmentItem {
  id: string;
  type: EquipmentType;
  title: string;
  position: { x: number; y: number };
  metrics?: EquipmentMetric[];
  connections?: string[];
}

const CreateSimulation = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<'chemicals' | 'thermodynamics' | 'equipment' | 'results'>('chemicals');
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('Peng-Robinson');
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentType[]>([]);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationComplete, setSimulationComplete] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [simulationName, setSimulationName] = useState('Untitled Simulation');
  const [problemDescription, setProblemDescription] = useState<string>('');
  const resultsRef = useRef<HTMLDivElement>(null);
  
  // New state variables for the enhanced canvas functionality
  const [placedEquipment, setPlacedEquipment] = useState<EquipmentItem[]>([]);
  const [activeEquipment, setActiveEquipment] = useState<string | null>(null);
  const [connectionMode, setConnectionMode] = useState(false);
  const [connectionStart, setConnectionStart] = useState<{equipmentId: string, point: string} | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const flowsheetRef = useRef<HTMLDivElement>(null);

  // Calculate progress based on current step
  const calculateProgress = () => {
    switch(currentStep) {
      case 'chemicals': return 25;
      case 'thermodynamics': return 50;
      case 'equipment': return 75;
      case 'results': return 100;
      default: return 0;
    }
  };

  // Generate default metrics based on equipment type
  const generateDefaultMetrics = (equipmentType: EquipmentType): EquipmentMetric[] => {
    switch(equipmentType) {
      case 'reactor':
        return [
          { key: 'temperature', value: '250', editable: true, description: 'Operating temperature of the reactor' },
          { key: 'pressure', value: '1500', editable: true, description: 'Operating pressure in kPa' },
          { key: 'conversion', value: '85', editable: true, description: 'Expected conversion percentage' }
        ];
      case 'heat-exchanger':
        return [
          { key: 'duty', value: '500', editable: true, description: 'Heat transfer rate in kW' },
          { key: 'temperature', value: '95', editable: true, description: 'Hot side outlet temperature in °C' },
          { key: 'efficiency', value: '75', editable: true, description: 'Heat exchanger efficiency' }
        ];
      case 'distillation':
        return [
          { key: 'pressure', value: '101.3', editable: true, description: 'Column operating pressure in kPa' },
          { key: 'reflux-ratio', value: '3.5', editable: true, description: 'Reflux ratio for the column' },
          { key: 'stages', value: '20', editable: true, description: 'Number of theoretical stages' }
        ];
      case 'pump':
        return [
          { key: 'flow', value: '100', editable: true, description: 'Volumetric flow rate in m³/h' },
          { key: 'pressure', value: '300', editable: true, description: 'Discharge pressure in kPa' },
          { key: 'efficiency', value: '65', editable: true, description: 'Pump efficiency percentage' }
        ];
      case 'compressor':
        return [
          { key: 'pressure', value: '500', editable: true, description: 'Discharge pressure in kPa' },
          { key: 'power', value: '75', editable: true, description: 'Power consumption in kW' },
          { key: 'efficiency', value: '70', editable: true, description: 'Adiabatic efficiency percentage' }
        ];
      case 'flash':
        return [
          { key: 'temperature', value: '65', editable: true, description: 'Flash temperature in °C' },
          { key: 'pressure', value: '150', editable: true, description: 'Vessel pressure in kPa' },
          { key: 'vapor-fraction', value: '0.35', editable: true, description: 'Vapor fraction' }
        ];
      // Add defaults for other equipment types
      default:
        return [
          { key: 'parameter1', value: '0', editable: true, description: 'Equipment parameter 1' },
          { key: 'parameter2', value: '0', editable: true, description: 'Equipment parameter 2' }
        ];
    }
  };

  const handleComponentSelectionDone = () => {
    if (selectedComponents.length === 0) {
      toast({
        title: "Components required",
        description: "Please select at least one chemical component before continuing",
        variant: "destructive",
      });
      return;
    }
    setCurrentStep('thermodynamics');
    setSimulationProgress(calculateProgress());
  };

  const handleThermodynamicsSelectionDone = () => {
    if (!selectedModel) {
      toast({
        title: "Thermodynamic model required",
        description: "Please select a thermodynamic model before continuing",
        variant: "destructive",
      });
      return;
    }
    setCurrentStep('equipment');
    setSimulationProgress(calculateProgress());
  };

  const handleEquipmentSelectionDone = () => {
    if (placedEquipment.length === 0) {
      toast({
        title: "Equipment required",
        description: "Please add at least one piece of equipment to your flowsheet",
        variant: "destructive",
      });
      return;
    }
    setCurrentStep('results');
    setSimulationProgress(calculateProgress());
    runSimulation();
  };

  const handleSelectEquipment = (equipmentType: EquipmentType) => {
    if (canvasRef.current) {
      // Create a unique ID for the equipment
      const id = `equipment-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
      // Add the equipment to the canvas at a default position
      const centerX = canvasRef.current.clientWidth / 2 - 70;
      const centerY = canvasRef.current.clientHeight / 2 - 60;
      
      const newEquipment: EquipmentItem = {
        id,
        type: equipmentType,
        title: equipmentType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        position: { x: centerX, y: centerY },
        metrics: generateDefaultMetrics(equipmentType),
      };
      
      setPlacedEquipment([...placedEquipment, newEquipment]);
      setSelectedEquipment([...selectedEquipment, equipmentType]);
      
      toast({
        title: "Equipment added",
        description: `${newEquipment.title} has been added to your flowsheet`,
      });
    }
  };

  const handleDragStart = (e: React.DragEvent, equipment: EquipmentItem) => {
    // Set the data to be transferred
    e.dataTransfer.setData('application/json', JSON.stringify({
      id: equipment.id,
      type: equipment.type,
      offset: {
        x: e.nativeEvent.offsetX,
        y: e.nativeEvent.offsetY
      }
    }));
    
    // Set the drag image
    const ghostEl = document.createElement('div');
    ghostEl.style.width = '100px';
    ghostEl.style.height = '60px';
    ghostEl.style.backgroundColor = 'rgba(0,0,0,0.1)';
    ghostEl.style.borderRadius = '8px';
    document.body.appendChild(ghostEl);
    
    e.dataTransfer.setDragImage(ghostEl, 50, 30);
    
    setTimeout(() => {
      document.body.removeChild(ghostEl);
    }, 0);
  };

  const dragOverHandler = (e: React.DragEvent) => {
    e.preventDefault();
    
    // Highlight drop target - Fix: Cast to HTMLElement before accessing style
    const dropTarget = e.target as HTMLElement;
    if (dropTarget && dropTarget.style) {
      dropTarget.style.backgroundColor = "rgba(0,0,255,0.1)";
      dropTarget.style.border = "2px dashed #4299E1";
    }
  };

  const dragLeaveHandler = (e: React.DragEvent) => {
    // Remove highlight from drop target - Fix: Cast to HTMLElement before accessing style
    const dropTarget = e.target as HTMLElement;
    if (dropTarget && dropTarget.style) {
      dropTarget.style.backgroundColor = "";
      dropTarget.style.border = "";
    }
  };

  const dropHandler = (e: React.DragEvent) => {
    e.preventDefault();
    
    // Get the drop target - Fix: Cast to HTMLElement before accessing style
    const dropTarget = e.target as HTMLElement;
    if (dropTarget && dropTarget.style) {
      dropTarget.style.backgroundColor = "";
      dropTarget.style.border = "";
    }
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      const { id, offset } = data;
      
      // Calculate the new position based on the drop coordinates and the initial click offset
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - offset.x;
      const y = e.clientY - rect.top - offset.y;
      
      // Update the position of the equipment
      setPlacedEquipment(prev => prev.map(eq => {
        if (eq.id === id) {
          return { ...eq, position: { x, y } };
        }
        return eq;
      }));
    } catch (err) {
      console.error('Error during drop:', err);
    }
  };
  
  const handleEquipmentClick = (id: string) => {
    if (connectionMode) {
      // In connection mode, clicking on equipment does nothing
      return;
    }
    
    setActiveEquipment(activeEquipment === id ? null : id);
  };
  
  const handleRemoveEquipment = (id: string) => {
    // Remove the equipment
    const equipmentToRemove = placedEquipment.find(eq => eq.id === id);
    if (equipmentToRemove) {
      setPlacedEquipment(placedEquipment.filter(eq => eq.id !== id));
      
      // Remove any connections to/from this equipment
      setConnections(connections.filter(conn => 
        conn.fromEquipmentId !== id && conn.toEquipmentId !== id
      ));
      
      // If this was the active equipment, clear the selection
      if (activeEquipment === id) {
        setActiveEquipment(null);
      }
      
      toast({
        title: "Equipment removed",
        description: `${equipmentToRemove.title} has been removed from your flowsheet`,
      });
    }
  };
  
  const handleConnectionPointClick = (equipmentId: string, point: string) => {
    if (!connectionMode) return;
    
    if (!connectionStart) {
      // This is the first click in the connection process
      setConnectionStart({equipmentId, point});
      toast({
        title: "Connection started",
        description: "Now click on another connection point to complete the connection",
      });
    } else {
      // This is the second click, complete the connection
      if (connectionStart.equipmentId === equipmentId) {
        // Can't connect to the same equipment
        toast({
          title: "Invalid connection",
          description: "Cannot connect an equipment to itself",
          variant: "destructive",
        });
        return;
      }
      
      // Check if this connection already exists
      const connectionExists = connections.some(
        conn => 
          (conn.fromEquipmentId === connectionStart.equipmentId && conn.fromPoint === connectionStart.point &&
           conn.toEquipmentId === equipmentId && conn.toPoint === point) ||
          (conn.fromEquipmentId === equipmentId && conn.fromPoint === point &&
           conn.toEquipmentId === connectionStart.equipmentId && conn.toPoint === connectionStart.point)
      );
      
      if (connectionExists) {
        toast({
          title: "Connection exists",
          description: "This connection already exists",
          variant: "destructive",
        });
        setConnectionStart(null);
        return;
      }
      
      // Add the new connection
      const newConnection: Connection = {
        fromEquipmentId: connectionStart.equipmentId,
        fromPoint: connectionStart.point,
        toEquipmentId: equipmentId,
        toPoint: point
      };
      
      setConnections([...connections, newConnection]);
      setConnectionStart(null);
      
      toast({
        title: "Connection created",
        description: "Connection between equipment has been established",
      });
    }
  };
  
  const handleCancelConnection = () => {
    setConnectionStart(null);
    setConnectionMode(false);
  };
  
  const toggleConnectionMode = () => {
    setConnectionMode(!connectionMode);
    setConnectionStart(null);
    if (!connectionMode) {
      toast({
        title: "Connection mode activated",
        description: "Click on connection points to create connections between equipment",
      });
    }
  };
  
  const handleRemoveConnection = (connectionIndex: number) => {
    setConnections(connections.filter((_, index) => index !== connectionIndex));
  };

  const handleGoBack = () => {
    switch(currentStep) {
      case 'thermodynamics':
        setCurrentStep('chemicals');
        break;
      case 'equipment':
        setCurrentStep('thermodynamics');
        break;
      case 'results':
        setCurrentStep('equipment');
        break;
      default:
        break;
    }
    setSimulationProgress(calculateProgress());
  };

  // Handle edits to equipment metrics
  const handleMetricEdit = (equipmentId: string, metricKey: string, value: string) => {
    setPlacedEquipment(prev => prev.map(eq => {
      if (eq.id === equipmentId && eq.metrics) {
        return {
          ...eq,
          metrics: eq.metrics.map(metric => 
            metric.key === metricKey ? { ...metric, value } : metric
          )
        };
      }
      return eq;
    }));
    
    toast({
      title: "Parameter updated",
      description: `${metricKey} has been updated to ${value}`,
    });
  };

  const runSimulation = () => {
    setSimulationRunning(true);
    
    // Simulate a delay for the simulation to run
    setTimeout(() => {
      setSimulationRunning(false);
      setSimulationComplete(true);
      toast({
        title: "Simulation Complete",
        description: "Process simulation results are now available",
      });
    }, 2000);
  };

  const handleExportToPDF = async () => {
    if (!resultsRef.current || !simulationComplete) {
      toast({
        title: "Cannot export results",
        description: "Please complete the simulation first",
        variant: "destructive",
      });
      return;
    }
    
    try {
      toast({
        title: "Generating PDF",
        description: "Please wait while we generate your report...",
      });
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const resultsElement = resultsRef.current;
      
      pdf.setFontSize(18);
      pdf.text(`${simulationName} - Simulation Results`, 20, 20);
      
      pdf.setFontSize(12);
      pdf.text(`Thermodynamic Model: ${selectedModel}`, 20, 30);
      pdf.text(`Components: ${selectedComponents.join(", ")}`, 20, 40);
      pdf.text(`Date: ${new Date().toLocaleDateString()}`, 20, 50);
      
      // If we have a flowsheet ref, include it in the PDF
      if (flowsheetRef.current) {
        try {
          const canvas = await html2canvas(flowsheetRef.current);
          const imgData = canvas.toDataURL('image/png');
          pdf.addPage();
          pdf.text("Process Flowsheet", 20, 20);
          pdf.addImage(imgData, 'PNG', 20, 30, 170, 100);
        } catch (error) {
          console.error("Error generating flowsheet image:", error);
        }
      }
      
      pdf.save(`${simulationName.replace(/\s+/g, '_')}_Results.pdf`);
      
      toast({
        title: "PDF Generated",
        description: "Results have been saved as PDF",
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "PDF Generation Failed",
        description: "There was an error generating the PDF report",
        variant: "destructive"
      });
    }
  };
  
  // Draw connections between equipment
  const renderConnections = () => {
    // Safety check for SSR
    if (typeof window === 'undefined') return null;
    
    return connections.map((connection, index) => {
      // Find the source and target equipment
      const fromEquipment = placedEquipment.find(eq => eq.id === connection.fromEquipmentId);
      const toEquipment = placedEquipment.find(eq => eq.id === connection.toEquipmentId);
      
      if (!fromEquipment || !toEquipment || !canvasRef.current) return null;
      
      // Get the connection points from DOM
      const fromEl = document.querySelector(`[data-equipment-id="${connection.fromEquipmentId}"] [data-connection="${connection.fromPoint}"]`) as HTMLElement;
      const toEl = document.querySelector(`[data-equipment-id="${connection.toEquipmentId}"] [data-connection="${connection.toPoint}"]`) as HTMLElement;
      
      if (!fromEl || !toEl) return null;
      
      // Calculate the positions
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const fromRect = fromEl.getBoundingClientRect();
      const toRect = toEl.getBoundingClientRect();
      
      // Calculate coordinates relative to the canvas
      const fromX = fromRect.left - canvasRect.left + fromRect.width / 2;
      const fromY = fromRect.top - canvasRect.top + fromRect.height / 2;
      const toX = toRect.left - canvasRect.left + toRect.width / 2;
      const toY = toRect.top - canvasRect.top + toRect.height / 2;
      
      // Calculate the path
      const dx = toX - fromX;
      const dy = toY - fromY;
      const length = Math.sqrt(dx * dx + dy * dy);
      
      // Add a midpoint for a slight curve
      const midX = (fromX + toX) / 2;
      const midY = (fromY + toY) / 2;
      
      // Calculate control point for a slight curve (perpendicular to the line)
      const offsetX = -dy * 0.2;
      const offsetY = dx * 0.2;
      const ctrlX = midX + offsetX;
      const ctrlY = midY + offsetY;
      
      return (
        <div key={`connection-${index}`} className="absolute top-0 left-0 pointer-events-none">
          {/* SVG for the curved line */}
          <svg 
            style={{ 
              position: 'absolute',
              width: '100%',
              height: '100%',
              overflow: 'visible'
            }}
          >
            <path
              d={`M ${fromX} ${fromY} Q ${ctrlX} ${ctrlY}, ${toX} ${toY}`}
              stroke="#3b82f6"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5,5"
              markerEnd="url(#arrowhead)"
            />
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="10"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
              </marker>
            </defs>
            
            {/* Click area for removing the connection */}
            <path
              d={`M ${fromX} ${fromY} Q ${ctrlX} ${ctrlY}, ${toX} ${toY}`}
              stroke="transparent"
              strokeWidth="10"
              fill="none"
              style={{ cursor: 'pointer', pointerEvents: 'auto' }}
              onClick={() => handleRemoveConnection(index)}
            />
          </svg>
        </div>
      );
    });
  };

  // Add sidebar panel component for equipment details
  const EquipmentDetailsPanel = () => {
    if (!activeEquipment) return null;
    
    const equipment = placedEquipment.find(eq => eq.id === activeEquipment);
    if (!equipment) return null;
    
    return (
      <div className="absolute top-0 right-0 w-72 h-full bg-white dark:bg-gray-800 border-l border-blue-200 dark:border-blue-800 p-4 shadow-lg overflow-y-auto z-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-blue-900 dark:text-blue-100">{equipment.title} Properties</h3>
          <Button variant="ghost" size="sm" onClick={() => setActiveEquipment(null)} className="h-7 w-7 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {equipment.metrics && equipment.metrics.length > 0 ? (
          <div className="space-y-4">
            {equipment.metrics.map((metric, index) => (
              <div key={`${metric.key}-${index}`} className="space-y-1">
                <div className="flex justify-between">
                  <label htmlFor={`metric-${metric.key}`} className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {metric.key.charAt(0).toUpperCase() + metric.key.slice(1).replace(/-/g, ' ')}
                  </label>
                  {metric.description && (
                    <span className="text-xs text-blue-500 dark:text-blue-400 cursor-help" title={metric.description}>
                      ?
                    </span>
                  )}
                </div>
                <Input
                  id={`metric-${metric.key}`}
                  value={String(metric.value)}
                  onChange={(e) => handleMetricEdit(equipment.id, metric.key, e.target.value)}
                  className="h-8"
                  readOnly={!metric.editable}
                />
                {metric.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{metric.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No editable parameters available.</p>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-900 dark:to-purple-900">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold text-blue-900 dark:text-white mb-2 flex items-center gap-2">
              <input 
                type="text"
                value={simulationName}
                onChange={(e) => setSimulationName(e.target.value)}
                className="bg-transparent border-b border-blue-300 dark:border-blue-700 focus:outline-none focus:border-blue-500 px-1 py-0.5 text-blue-900 dark:text-white"
                placeholder="Simulation Name"
              />
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                {currentStep === 'chemicals' ? 'Step 1' : 
                 currentStep === 'thermodynamics' ? 'Step 2' :
                 currentStep === 'equipment' ? 'Step 3' : 'Step 4'}
              </Badge>
            </h1>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-1">
              <span className={`flex items-center gap-1 ${currentStep === 'chemicals' ? 'font-medium text-blue-600' : 'text-gray-600 dark:text-gray-400'}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${currentStep === 'chemicals' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>1</div>
                Select Chemicals
              </span>
              <span className={`flex items-center gap-1 ${currentStep === 'thermodynamics' ? 'font-medium text-blue-600' : 'text-gray-600 dark:text-gray-400'}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${currentStep === 'thermodynamics' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>2</div>
                Thermodynamic Model
              </span>
              <span className={`flex items-center gap-1 ${currentStep === 'equipment' ? 'font-medium text-blue-600' : 'text-gray-600 dark:text-gray-400'}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${currentStep === 'equipment' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>3</div>
                Equipment Flow
              </span>
              <span className={`flex items-center gap-1 ${currentStep === 'results' ? 'font-medium text-blue-600' : 'text-gray-600 dark:text-gray-400'}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${currentStep === 'results' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>4</div>
                Results
              </span>
            </div>
            <Progress value={simulationProgress} className="h-2 bg-blue-100 dark:bg-blue-900">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" />
            </Progress>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 border border-blue-100 dark:border-blue-900">
          {currentStep === 'chemicals' && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-blue-900 dark:text-white">Select Chemical Components</h2>
                <Button 
                  onClick={handleComponentSelectionDone}
                  className="flex items-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              
              <ComponentSelector 
                selectedComponents={selectedComponents} 
                setSelectedComponents={setSelectedComponents} 
              />
            </div>
          )}
          
          {currentStep === 'thermodynamics' && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleGoBack}
                    className="mr-4 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                  <h2 className="text-xl font-semibold text-blue-900 dark:text-white">Select Thermodynamic Model</h2>
                </div>
                <Button 
                  onClick={handleThermodynamicsSelectionDone}
                  className="flex items-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              
              <ThermodynamicsSelector 
                selectedModel={selectedModel}
                setSelectedModel={setSelectedModel}
                selectedComponents={selectedComponents}
              />
            </div>
          )}
          
          {currentStep === 'equipment' && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleGoBack}
                    className="mr-4 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                  <h2 className="text-xl font-semibold text-blue-900 dark:text-white">Equipment Flow Selection</h2>
                </div>
                <Button 
                  onClick={handleEquipmentSelectionDone}
                  className="flex items-center bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white"
                >
                  Run Simulation
                  <Play className="h-4 w-4 ml-1" />
                </Button>
              </div>
              
              {/* Problem Description Input */}
              <div className="mb-4 bg-blue-50 dark:bg-blue-900/50 p-4 rounded-lg">
                <label htmlFor="problem-description" className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                  Problem Description (Context for equipment parameters)
                </label>
                <Textarea
                  id="problem-description"
                  placeholder="Describe the process problem or scenario that will provide context for equipment parameters..."
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  className="h-20 resize-none"
                />
                <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                  Adding a problem description helps provide context for equipment parameter adjustments.
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Equipment Selector Panel */}
                <div className="col-span-1 bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                  <h3 className="text-md font-medium mb-4 text-blue-900 dark:text-blue-100">Equipment Library</h3>
                  <div className="overflow-y-auto max-h-[65vh] pr-2">
                    <EquipmentSelector onSelectEquipment={handleSelectEquipment} />
                  </div>
                </div>
                
                {/* Canvas Area */}
                <div className="col-span-3">
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-blue-900 rounded-lg border-2 border-dashed border-blue-200 dark:border-blue-800 p-4 relative overflow-hidden" style={{ minHeight: '70vh' }}>
                    <div className="flex justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant={connectionMode ? "default" : "outline"} 
                          size="sm" 
                          onClick={toggleConnectionMode}
                          className={`flex items-center ${connectionMode ? 'bg-blue-600 text-white' : 'border-blue-300'}`}
                        >
                          <Link2 className="h-3.5 w-3.5 mr-1" />
                          {connectionMode ? "Cancel Connection" : "Connect Equipment"}
                        </Button>
                        
                        {connectionMode && connectionStart && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handleCancelConnection}
                            className="border-red-300 hover:border-red-400 hover:bg-red-50 text-red-600"
                          >
                            <X className="h-3.5 w-3.5 mr-1" />
                            Cancel
                          </Button>
                        )}
                      </div>
                      
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                        {activeEquipment ? 'Equipment Selected' : connectionMode ? 'Connection Mode' : 'Edit Mode'}
                      </Badge>
                    </div>
                    
                    {/* Canvas */}
                    <div 
                      ref={canvasRef}
                      className="w-full h-full min-h-[60vh] relative"
                      onDragOver={dragOverHandler}
                      onDragLeave={dragLeaveHandler}
                      onDrop={dropHandler}
                    >
                      <div ref={flowsheetRef} className="w-full h-full relative">
                        {/* Equipment Items */}
                        {placedEquipment.map((equipment) => (
                          <div
                            key={equipment.id}
                            className={`absolute transition-all duration-300 ${activeEquipment === equipment.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                            style={{
                              left: `${equipment.position.x}px`,
                              top: `${equipment.position.y}px`,
                              zIndex: activeEquipment === equipment.id ? 10 : 1
                            }}
                            data-equipment-id={equipment.id}
                          >
                            <EquipmentCard
                              type={equipment.type}
                              title={equipment.title}
                              metrics={equipment.metrics}
                              draggable={true}
                              onDragStart={(e) => handleDragStart(e, equipment)}
                              size="md"
                              selected={activeEquipment === equipment.id}
                              onClick={() => handleEquipmentClick(equipment.id)}
                              showConnections={true}
                              onConnectionPointClick={(point) => handleConnectionPointClick(equipment.id, point)}
                              activeConnectionPoints={(connections || [])
                                .filter(conn => 
                                  conn.fromEquipmentId === equipment.id || 
                                  conn.toEquipmentId === equipment.id
                                )
                                .map(conn => 
                                  conn.fromEquipmentId === equipment.id ? 
                                  conn.fromPoint : conn.toPoint
                                )}
                              onMetricEdit={(key, value) => handleMetricEdit(equipment.id, key, value)}
                              problem={problemDescription}
                            />
                            
                            {/* Equipment Controls */}
                            {activeEquipment === equipment.id && (
                              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 p-1 flex space-x-1 z-20">
                                <Button 
                                  variant="destructive" 
                                  size="icon" 
                                  className="h-7 w-7" 
                                  onClick={() => handleRemoveEquipment(equipment.id)}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                        
                        {/* Connection Lines */}
                        {renderConnections()}
                        
                        {/* Equipment Details Panel */}
                        <EquipmentDetailsPanel />
                      </div>
                    </div>
                    
                    {/* Empty State */}
                    {placedEquipment.length === 0 && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-blue-800 dark:text-blue-200 pointer-events-none">
                        <Plus className="h-12 w-12 mb-3 opacity-50" />
                        <h3 className="text-lg font-medium mb-2">Add Equipment to Your Flowsheet</h3>
                        <p className="text-sm opacity-70 max-w-md">
                          Select equipment from the library on the left and arrange them on this canvas. Connect them to create your process flow.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 'results' && (
            <div className="animate-fade-in" ref={resultsRef}>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleGoBack}
                    className="mr-4 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                  <h2 className="text-xl font-semibold text-blue-900 dark:text-white">Simulation Results</h2>
                </div>
                <Button 
                  onClick={handleExportToPDF}
                  variant="outline"
                  className="flex items-center bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900"
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Export PDF
                </Button>
              </div>
              
              {simulationRunning ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <RefreshCw className="h-10 w-10 text-blue-600 dark:text-blue-400 animate-spin mb-4" />
                  <h3 className="text-lg font-medium">Running Process Simulation</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Please wait while we process your simulation...
                  </p>
                </div>
              ) : simulationComplete ? (
                <div>
                  <Tabs defaultValue="results">
                    <TabsList className="w-full mb-4 bg-blue-50 dark:bg-blue-900">
                      <TabsTrigger value="results">Analysis Results</TabsTrigger>
                      <TabsTrigger value="flowsheet">Process Flowsheet</TabsTrigger>
                      <TabsTrigger value="hysys">HYSYS Integration</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="results" className="border border-blue-100 dark:border-blue-900 rounded-lg p-4">
                      <div className="space-y-6">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                          <h3 className="text-lg font-medium mb-3 text-blue-900 dark:text-blue-100">Simulation Summary</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Components</p>
                              <p className="font-medium text-blue-900 dark:text-blue-100">{selectedComponents.join(", ")}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Thermodynamic Model</p>
                              <p className="font-medium text-blue-900 dark:text-blue-100">{selectedModel}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Equipment Count</p>
                              <p className="font-medium text-blue-900 dark:text-blue-100">{placedEquipment.length} items</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Connections</p>
                              <p className="font-medium text-blue-900 dark:text-blue-100">{connections.length} connections</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="bg-gradient-to-br from-teal-50 to-green-50 dark:from-teal-900/30 dark:to-green-900/30 p-4 rounded-lg border border-teal-100 dark:border-teal-800">
                            <h4 className="text-md font-medium mb-3 text-teal-900 dark:text-teal-100">Energy Analysis</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Total Energy Input:</span>
                                <span className="font-medium text-teal-700 dark:text-teal-300">620 kW</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Total Energy Output:</span>
                                <span className="font-medium text-teal-700 dark:text-teal-300">580 kW</span>
                              </div>
                              <div className="flex justify-between border-t border-teal-200 dark:border-teal-700 pt-2 mt-2">
                                <span className="text-gray-600 dark:text-gray-400">Energy Efficiency:</span>
                                <span className="font-medium text-teal-700 dark:text-teal-300">93.5%</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 p-4 rounded-lg border border-purple-100 dark:border-purple-800">
                            <h4 className="text-md font-medium mb-3 text-purple-900 dark:text-purple-100">Mass Balance</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Feed Rate:</span>
                                <span className="font-medium text-purple-700 dark:text-purple-300">100 kg/h</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Product Rate:</span>
                                <span className="font-medium text-purple-700 dark:text-purple-300">97.5 kg/h</span>
                              </div>
                              <div className="flex justify-between border-t border-purple-200 dark:border-purple-700 pt-2 mt-2">
                                <span className="text-gray-600 dark:text-gray-400">Yield:</span>
                                <span className="font-medium text-purple-700 dark:text-purple-300">97.5%</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 p-4 rounded-lg border border-amber-100 dark:border-amber-800">
                            <h4 className="text-md font-medium mb-3 text-amber-900 dark:text-amber-100">Environmental Impact</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">CO₂ Emissions:</span>
                                <span className="font-medium text-amber-700 dark:text-amber-300">45 kg/h</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Water Usage:</span>
                                <span className="font-medium text-amber-700 dark:text-amber-300">1,200 kg/h</span>
                              </div>
                              <div className="flex justify-between border-t border-amber-200 dark:border-amber-700 pt-2 mt-2">
                                <span className="text-gray-600 dark:text-gray-400">Carbon Intensity:</span>
                                <span className="font-medium text-amber-700 dark:text-amber-300">Medium</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="flowsheet" className="border border-blue-100 dark:border-blue-900 rounded-lg p-4 min-h-[400px]">
                      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-blue-900 rounded-lg border-2 border-dashed border-blue-200 dark:border-blue-800 p-4 relative overflow-hidden" style={{ minHeight: '60vh' }}>
                        <div ref={flowsheetRef} className="w-full h-full relative">
                          {/* Equipment Items */}
                          {placedEquipment.map((equipment) => (
                            <div
                              key={equipment.id}
                              className="absolute"
                              style={{
                                left: `${equipment.position.x}px`,
                                top: `${equipment.position.y}px`,
                              }}
                              data-equipment-id={equipment.id}
                            >
                              <EquipmentCard
                                type={equipment.type}
                                title={equipment.title}
                                draggable={false}
                                size="md"
                                showConnections={true}
                                activeConnectionPoints={(connections || [])
                                  .filter(conn => 
                                    conn.fromEquipmentId === equipment.id || 
                                    conn.toEquipmentId === equipment.id
                                  )
                                  .map(conn => 
                                    conn.fromEquipmentId === equipment.id ? 
                                    conn.fromPoint : conn.toPoint
                                  )}
                              />
                            </div>
                          ))}
                          {/* Connection Lines */}
                          {renderConnections()}
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="hysys" className="border border-blue-100 dark:border-blue-900 rounded-lg">
                      <HysysIntegration 
                        selectedComponents={selectedComponents}
                        thermodynamicModel={selectedModel}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <h3 className="text-lg font-medium">Ready to Run Simulation</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Click "Run Simulation" to start process calculations
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CreateSimulation;
