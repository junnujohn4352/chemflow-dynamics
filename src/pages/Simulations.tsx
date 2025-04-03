import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import GlassPanel from "@/components/ui/GlassPanel";
import { 
  PlusCircle, Clock, ArrowRight, FlaskConical, 
  Trash2, Play, Edit, Download, Trash, Info,
  Thermometer, Droplets, Zap, Activity, Layers, BarChart3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ComponentProperties {
  criticalTemp?: number;      // K
  criticalPressure?: number;  // kPa
  acentricFactor?: number;
  molecularWeight?: number;   // g/mol
  boilingPoint?: number;      // K
  densityLiquid?: number;     // kg/m³
  densityVapor?: number;      // kg/m³
  cpLiquid?: number;          // J/(kg·K)
  cpVapor?: number;           // J/(kg·K)
  heatOfVaporization?: number; // kJ/mol
}

interface SimulationComponent {
  name: string;
  percentage: number;
  properties?: ComponentProperties;
}

interface StreamData {
  name: string;
  temperature?: number;      // K
  pressure?: number;         // kPa
  flowRate?: number;         // kg/h
  vaporFraction?: number;    // 0-1
  composition?: {[component: string]: number}; // mole fractions
}

interface EquipmentData {
  name: string;
  type: string;
  efficiency?: number;
  operatingTemp?: number;    // K
  operatingPressure?: number; // kPa
  dutyCooling?: number;      // kW
  dutyHeating?: number;      // kW
}

interface SimulationCard {
  id: string;
  name: string;
  description: string;
  lastUpdated: string;
  efficiency: number;
  components: SimulationComponent[] | string[];
  equipment?: EquipmentData[] | number;
  streams?: StreamData[] | number;
  thermodynamicModel?: string;
  unitSet?: string;
  reactions?: {
    name: string;
    type: string;
    rate?: number;
    conversion?: number;
  }[];
  energy?: {
    totalHeatingDuty?: number;
    totalCoolingDuty?: number;
    netEnergy?: number;
  };
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

const Simulations = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [simulations, setSimulations] = useState<SimulationCard[]>([]);
  const [activeSimId, setActiveSimId] = useState<string | null>(null);
  
  useEffect(() => {
    loadSimulations();
  }, []);
  
  const loadSimulations = () => {
    const saved = localStorage.getItem('chemflow-simulations');
    if (saved) {
      try {
        const parsedSimulations = JSON.parse(saved);
        
        const enhancedSimulations = parsedSimulations.map((sim: SimulationCard) => {
          if (!Array.isArray(sim.components) || typeof sim.components[0] === 'string') {
            const enhancedComponents = (sim.components as string[]).map(name => ({
              name,
              percentage: Math.floor(Math.random() * 70) + 30,
              properties: generateDummyComponentProperties(name)
            }));
            
            return {
              ...sim,
              components: enhancedComponents,
              equipment: Array.isArray(sim.equipment) ? sim.equipment : generateDummyEquipment(),
              streams: Array.isArray(sim.streams) ? sim.streams : generateDummyStreams(sim.components as string[]),
              unitSet: sim.unitSet || "SI",
              reactions: sim.reactions || generateDummyReactions(),
              energy: sim.energy || {
                totalHeatingDuty: Math.floor(Math.random() * 1000) + 100,
                totalCoolingDuty: Math.floor(Math.random() * 800) + 50,
                netEnergy: Math.floor(Math.random() * 500) - 250
              }
            };
          }
          return sim;
        });
        
        setSimulations(enhancedSimulations);
      } catch (e) {
        console.error("Error loading simulations:", e);
      }
    }
  };

  const generateDummyComponentProperties = (name: string): ComponentProperties => {
    const commonProperties: {[key: string]: ComponentProperties} = {
      'Water': {
        criticalTemp: 647.1,
        criticalPressure: 22064,
        acentricFactor: 0.344,
        molecularWeight: 18.02,
        boilingPoint: 373.15,
        densityLiquid: 997,
        densityVapor: 0.804,
        cpLiquid: 4186,
        cpVapor: 1996,
        heatOfVaporization: 40.65
      },
      'Methane': {
        criticalTemp: 190.6,
        criticalPressure: 4599,
        acentricFactor: 0.011,
        molecularWeight: 16.04,
        boilingPoint: 111.7,
        densityLiquid: 422.6,
        densityVapor: 1.8,
        cpLiquid: 3500,
        cpVapor: 2226,
        heatOfVaporization: 8.17
      },
      'Ethanol': {
        criticalTemp: 513.9,
        criticalPressure: 6137,
        acentricFactor: 0.644,
        molecularWeight: 46.07,
        boilingPoint: 351.5,
        densityLiquid: 789,
        densityVapor: 1.6,
        cpLiquid: 2400,
        cpVapor: 1500,
        heatOfVaporization: 38.6
      },
      'Benzene': {
        criticalTemp: 562.2,
        criticalPressure: 4894,
        acentricFactor: 0.212,
        molecularWeight: 78.11,
        boilingPoint: 353.3,
        densityLiquid: 876,
        densityVapor: 2.7,
        cpLiquid: 1720,
        cpVapor: 1050,
        heatOfVaporization: 30.72
      },
      'Nitrogen': {
        criticalTemp: 126.2,
        criticalPressure: 3396,
        acentricFactor: 0.037,
        molecularWeight: 28.01,
        boilingPoint: 77.4,
        densityLiquid: 808,
        densityVapor: 1.25,
        cpLiquid: 2042,
        cpVapor: 1040,
        heatOfVaporization: 5.57
      }
    };
    
    if (commonProperties[name]) {
      return commonProperties[name];
    }
    
    return {
      criticalTemp: Math.floor(Math.random() * 500) + 200,
      criticalPressure: Math.floor(Math.random() * 6000) + 2000,
      acentricFactor: Math.random() * 0.8,
      molecularWeight: Math.floor(Math.random() * 100) + 15,
      boilingPoint: Math.floor(Math.random() * 300) + 200,
      densityLiquid: Math.floor(Math.random() * 900) + 500,
      densityVapor: Math.floor(Math.random() * 5) + 0.5,
      cpLiquid: Math.floor(Math.random() * 3000) + 1000,
      cpVapor: Math.floor(Math.random() * 1500) + 800,
      heatOfVaporization: Math.floor(Math.random() * 40) + 5
    };
  };

  const generateDummyEquipment = (): EquipmentData[] => {
    return [
      {
        name: "Reactor-001",
        type: "CSTR",
        efficiency: 0.85,
        operatingTemp: 345,
        operatingPressure: 1200,
        dutyHeating: 125
      },
      {
        name: "Distillation-001",
        type: "Distillation Column",
        efficiency: 0.78,
        operatingTemp: 380,
        operatingPressure: 101.3,
        dutyCooling: 95
      },
      {
        name: "Heat-Exchanger-001",
        type: "Shell and Tube",
        efficiency: 0.92,
        operatingTemp: 320,
        dutyHeating: 75
      }
    ];
  };

  const generateDummyStreams = (components: string[]): StreamData[] => {
    const streams: StreamData[] = [];
    
    const feedComposition: {[component: string]: number} = {};
    components.forEach(comp => {
      if (typeof comp === 'string') {
        feedComposition[comp] = 1.0 / components.length;
      } else {
        feedComposition[(comp as SimulationComponent).name] = 1.0 / components.length;
      }
    });
    
    streams.push({
      name: "Feed",
      temperature: 298,
      pressure: 101.3,
      flowRate: 1000,
      vaporFraction: 0,
      composition: feedComposition
    });
    
    streams.push({
      name: "Product-Vapor",
      temperature: 380,
      pressure: 95,
      flowRate: 400,
      vaporFraction: 1.0,
      composition: { ...feedComposition }
    });
    
    streams.push({
      name: "Product-Liquid",
      temperature: 320,
      pressure: 110,
      flowRate: 600,
      vaporFraction: 0,
      composition: { ...feedComposition }
    });
    
    return streams;
  };

  const generateDummyReactions = () => {
    return [
      {
        name: "Main Reaction",
        type: "Conversion",
        conversion: 0.85
      },
      {
        name: "Side Reaction",
        type: "Kinetic",
        rate: 0.015
      }
    ];
  };

  const handleDeleteSimulation = (id: string) => {
    const updatedSimulations = simulations.filter(sim => sim.id !== id);
    setSimulations(updatedSimulations);
    localStorage.setItem('chemflow-simulations', JSON.stringify(updatedSimulations));
    
    const activeSimData = localStorage.getItem('chemflow-simulation-data');
    if (activeSimData) {
      try {
        const simData = JSON.parse(activeSimData);
        const simName = simData.name;
        
        const deletedSim = simulations.find(sim => sim.id === id);
        if (deletedSim && safeStringify(deletedSim.name) === simName) {
          localStorage.removeItem('chemflow-active-simulation');
          localStorage.removeItem('chemflow-simulation-running');
        }
      } catch (e) {
        console.error("Error checking active simulation:", e);
      }
    }
    
    toast({
      title: "Simulation deleted",
      description: "The simulation has been removed successfully."
    });
  };

  const handleClearAllSimulations = () => {
    setSimulations([]);
    localStorage.removeItem('chemflow-simulations');
    
    localStorage.removeItem('chemflow-active-simulation');
    localStorage.removeItem('chemflow-simulation-running');
    localStorage.removeItem('chemflow-simulation-data');
    
    toast({
      title: "All simulations cleared",
      description: "All simulations have been removed successfully."
    });
  };

  const handleRunSimulation = (simulation: SimulationCard) => {
    localStorage.setItem('chemflow-active-simulation', 'true');
    localStorage.setItem('chemflow-simulation-running', 'true');
    
    const simulationData = {
      name: safeStringify(simulation.name),
      components: Array.isArray(simulation.components) ? 
        simulation.components.map(c => typeof c === 'string' ? c : safeStringify(c.name)) : [],
      thermodynamicModel: safeStringify(simulation.thermodynamicModel || 'Peng-Robinson'),
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('chemflow-simulation-data', JSON.stringify(simulationData));
    
    toast({
      title: "Simulation activated",
      description: "Navigating to analysis..."
    });
    
    setTimeout(() => {
      navigate('/analysis');
    }, 1000);
  };

  const handleEditSimulation = (simulation: SimulationCard) => {
    localStorage.setItem('chemflow-active-simulation', 'true');
    
    const simulationData = {
      name: safeStringify(simulation.name),
      components: Array.isArray(simulation.components) ? 
        simulation.components.map(c => typeof c === 'string' ? c : safeStringify(c.name)) : [],
      thermodynamicModel: safeStringify(simulation.thermodynamicModel || 'Peng-Robinson'),
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('chemflow-simulation-data', JSON.stringify(simulationData));
    
    navigate('/create-simulation');
  };

  const exportSimulation = (simulation: SimulationCard) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(simulation));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${safeStringify(simulation.name)}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    toast({
      title: "Simulation exported",
      description: "The simulation has been downloaded as JSON"
    });
  };

  const renderComponents = (components: any[]) => {
    if (!components || !Array.isArray(components)) {
      return <p className="text-sm text-gray-500">No components available</p>;
    }

    return components.map((comp, idx) => {
      const compName = typeof comp === 'string' ? comp : (comp.name ? safeStringify(comp.name) : 'Unknown');
      const percentage = typeof comp === 'string' ? 100 : (comp.percentage || 0);
      
      return (
        <div key={idx} className="mb-2">
          <div className="flex justify-between text-sm mb-1 dark:text-gray-300">
            <span>{compName}</span>
            <span>{typeof comp === 'string' ? '' : `${percentage}%`}</span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div 
              className="h-1.5 rounded-full bg-flow-blue"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
      );
    });
  };

  const toggleSimulationDetails = (id: string) => {
    setActiveSimId(activeSimId === id ? null : id);
  };

  const renderComponentProperties = (component: SimulationComponent) => {
    if (!component.properties) return null;
    
    const props = component.properties;
    
    return (
      <div className="mt-2 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-xs">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-gray-500 dark:text-gray-400">MW: {props.molecularWeight} g/mol</p>
            <p className="text-gray-500 dark:text-gray-400">Tc: {props.criticalTemp} K</p>
            <p className="text-gray-500 dark:text-gray-400">Pc: {props.criticalPressure} kPa</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Tb: {props.boilingPoint} K</p>
            <p className="text-gray-500 dark:text-gray-400">ω: {props.acentricFactor?.toFixed(3)}</p>
            <p className="text-gray-500 dark:text-gray-400">ΔHvap: {props.heatOfVaporization} kJ/mol</p>
          </div>
        </div>
      </div>
    );
  };

  const renderStreams = (streams: StreamData[]) => {
    return (
      <div className="mt-3 border-t border-gray-200 dark:border-gray-700 pt-3">
        <h4 className="text-sm font-medium mb-2 flex items-center dark:text-gray-200">
          <Droplets className="h-4 w-4 mr-1 text-blue-500" />
          Streams
        </h4>
        <div className="space-y-2">
          {streams.map((stream, idx) => (
            <div key={idx} className="text-xs bg-gray-50 dark:bg-gray-800 p-2 rounded">
              <div className="font-medium mb-1">{stream.name}</div>
              <div className="grid grid-cols-3 gap-1">
                <span className="text-gray-500 dark:text-gray-400">T: {stream.temperature} K</span>
                <span className="text-gray-500 dark:text-gray-400">P: {stream.pressure} kPa</span>
                <span className="text-gray-500 dark:text-gray-400">F: {stream.flowRate} kg/h</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderEquipment = (equipment: EquipmentData[]) => {
    return (
      <div className="mt-3 border-t border-gray-200 dark:border-gray-700 pt-3">
        <h4 className="text-sm font-medium mb-2 flex items-center dark:text-gray-200">
          <Layers className="h-4 w-4 mr-1 text-purple-500" />
          Equipment
        </h4>
        <div className="space-y-2">
          {equipment.map((equip, idx) => (
            <div key={idx} className="text-xs bg-gray-50 dark:bg-gray-800 p-2 rounded">
              <div className="font-medium mb-1">{equip.name} ({equip.type})</div>
              <div className="grid grid-cols-2 gap-1">
                {equip.operatingTemp && (
                  <span className="text-gray-500 dark:text-gray-400">Temp: {equip.operatingTemp} K</span>
                )}
                {equip.operatingPressure && (
                  <span className="text-gray-500 dark:text-gray-400">Press: {equip.operatingPressure} kPa</span>
                )}
                {equip.efficiency && (
                  <span className="text-gray-500 dark:text-gray-400">Eff: {(equip.efficiency * 100).toFixed(1)}%</span>
                )}
                {equip.dutyHeating && (
                  <span className="text-gray-500 dark:text-gray-400">Q(+): {equip.dutyHeating} kW</span>
                )}
                {equip.dutyCooling && (
                  <span className="text-gray-500 dark:text-gray-400">Q(-): {equip.dutyCooling} kW</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderReactions = (reactions: {name: string, type: string, rate?: number, conversion?: number}[]) => {
    if (!reactions || reactions.length === 0) return null;
    
    return (
      <div className="mt-3 border-t border-gray-200 dark:border-gray-700 pt-3">
        <h4 className="text-sm font-medium mb-2 flex items-center dark:text-gray-200">
          <Zap className="h-4 w-4 mr-1 text-amber-500" />
          Reactions
        </h4>
        <div className="space-y-2">
          {reactions.map((reaction, idx) => (
            <div key={idx} className="text-xs bg-gray-50 dark:bg-gray-800 p-2 rounded">
              <div className="font-medium">{reaction.name}</div>
              <div className="text-gray-500 dark:text-gray-400">Type: {reaction.type}</div>
              {reaction.conversion && (
                <div className="text-gray-500 dark:text-gray-400">Conversion: {(reaction.conversion * 100).toFixed(1)}%</div>
              )}
              {reaction.rate && (
                <div className="text-gray-500 dark:text-gray-400">Rate: {reaction.rate} mol/(L·s)</div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderEnergy = (energy: {totalHeatingDuty?: number, totalCoolingDuty?: number, netEnergy?: number}) => {
    if (!energy) return null;
    
    return (
      <div className="mt-3 border-t border-gray-200 dark:border-gray-700 pt-3">
        <h4 className="text-sm font-medium mb-2 flex items-center dark:text-gray-200">
          <Activity className="h-4 w-4 mr-1 text-red-500" />
          Energy Analysis
        </h4>
        <div className="grid grid-cols-3 gap-2 text-xs">
          {energy.totalHeatingDuty !== undefined && (
            <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded text-center">
              <div className="text-red-500 dark:text-red-400 font-medium">Heating</div>
              <div>{energy.totalHeatingDuty} kW</div>
            </div>
          )}
          {energy.totalCoolingDuty !== undefined && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded text-center">
              <div className="text-blue-500 dark:text-blue-400 font-medium">Cooling</div>
              <div>{energy.totalCoolingDuty} kW</div>
            </div>
          )}
          {energy.netEnergy !== undefined && (
            <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded text-center">
              <div className="text-purple-500 dark:text-purple-400 font-medium">Net</div>
              <div>{energy.netEnergy} kW</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-1 py-16 px-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold mb-2 dark:text-white">My Simulations</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage and run your chemical process simulations</p>
            </div>
            <div className="flex space-x-3">
              {simulations.length > 0 && (
                <Button 
                  variant="destructive"
                  onClick={handleClearAllSimulations}
                  className="inline-flex items-center"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Clear All
                </Button>
              )}
              <Link 
                to="/create-simulation"
                className="inline-flex items-center px-5 py-2.5 rounded-lg bg-flow-blue text-white font-medium shadow-sm hover:bg-flow-blue/90 transition-colors"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                New Simulation
              </Link>
            </div>
          </div>
          
          {simulations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {simulations.map((sim) => (
                <GlassPanel 
                  key={safeStringify(sim.id)} 
                  className="p-6 hover:shadow-md transition-shadow bg-white dark:bg-gray-800 dark:border-gray-700"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div 
                      className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900 text-flow-blue dark:text-blue-200 cursor-pointer"
                      onClick={() => toggleSimulationDetails(sim.id)}
                    >
                      <FlaskConical className="h-5 w-5" />
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{new Date(safeStringify(sim.lastUpdated)).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-medium mb-2 dark:text-white flex items-center">
                    {safeStringify(sim.name)}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="ml-2" onClick={() => toggleSimulationDetails(sim.id)}>
                            <Info className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Click to show/hide details</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{safeStringify(sim.description)}</p>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2 flex items-center dark:text-gray-200">
                      <FlaskConical className="h-4 w-4 mr-1 text-green-500" />
                      Components
                    </h4>
                    {sim.components && Array.isArray(sim.components) ? (
                      renderComponents(sim.components)
                    ) : (
                      <p className="text-sm text-gray-500">No components available</p>
                    )}
                  </div>
                  
                  {activeSimId === sim.id && (
                    <div className="mt-4 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <div className="mb-3">
                        <h4 className="text-sm font-medium mb-2 flex items-center dark:text-gray-200">
                          <Thermometer className="h-4 w-4 mr-1 text-green-600" />
                          Component Properties
                        </h4>
                        <div className="space-y-3">
                          {Array.isArray(sim.components) && sim.components.map((comp, idx) => {
                            if (typeof comp !== 'string' && comp.properties) {
                              return (
                                <div key={idx}>
                                  <div className="font-medium text-sm">{comp.name}</div>
                                  {renderComponentProperties(comp as SimulationComponent)}
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                      </div>
                      
                      <div className="mb-3 border-t border-gray-200 dark:border-gray-700 pt-3">
                        <h4 className="text-sm font-medium flex items-center dark:text-gray-200">
                          <BarChart3 className="h-4 w-4 mr-1 text-indigo-500" />
                          Thermodynamics
                        </h4>
                        <div className="mt-2 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-xs">
                          <p className="text-gray-700 dark:text-gray-300">Property Package: <span className="font-medium">{safeStringify(sim.thermodynamicModel)}</span></p>
                          <p className="text-gray-700 dark:text-gray-300">Unit Set: <span className="font-medium">{safeStringify(sim.unitSet || "SI")}</span></p>
                        </div>
                      </div>
                      
                      {sim.equipment && Array.isArray(sim.equipment) && (
                        renderEquipment(sim.equipment as EquipmentData[])
                      )}
                      
                      {sim.streams && Array.isArray(sim.streams) && (
                        renderStreams(sim.streams as StreamData[])
                      )}
                      
                      {sim.reactions && Array.isArray(sim.reactions) && (
                        renderReactions(sim.reactions)
                      )}
                      
                      {sim.energy && (
                        renderEnergy(sim.energy)
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-sm dark:text-gray-300">
                      <span className="text-gray-500 dark:text-gray-400">Efficiency:</span>
                      <span className="ml-2 font-medium text-flow-blue">{safeStringify(sim.efficiency)}%</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDeleteSimulation(sim.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"
                        title="Delete simulation"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => exportSimulation(sim)}
                        className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500"
                        title="Export simulation"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditSimulation(sim)}
                        className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500"
                        title="Edit simulation"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleRunSimulation(sim)}
                        className="p-1.5 rounded-lg hover:bg-green-50 text-green-500"
                        title="Run simulation"
                      >
                        <Play className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </GlassPanel>
              ))}
            </div>
          ) : (
            <GlassPanel className="p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-900">
                  <FlaskConical className="h-6 w-6 text-flow-blue dark:text-blue-200" />
                </div>
              </div>
              <h3 className="text-xl font-medium mb-2 dark:text-white">No Simulations Yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Create your first simulation to get started with chemical process modeling
              </p>
              <Link 
                to="/create-simulation"
                className="inline-flex items-center px-5 py-2.5 rounded-lg bg-flow-blue text-white font-medium hover:bg-flow-blue/90 transition-colors"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Simulation
              </Link>
            </GlassPanel>
          )}
        </div>
      </main>
    </div>
  );
};

export default Simulations;
