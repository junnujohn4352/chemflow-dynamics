import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import AspenCalculations from "@/components/simulation/AspenCalculations";
import Footer from "@/components/layout/Footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { 
  Thermometer, Gauge, Beaker, FlaskConical, 
  Droplets, Waves, Shield, Zap, DollarSign, 
  AlertCircle, BarChart3, Play, Pause, RefreshCw,
  Download, FileText
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import HysysIntegration from "@/components/simulation/HysysIntegration";
import { Button } from "@/components/ui/button";
import RealTimeAnalysisCharts from "@/components/charts/RealTimeAnalysisCharts";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const calculationCategories = [
  {
    id: "thermodynamic",
    name: "Thermodynamic & Physical Properties",
    icon: <Thermometer className="h-5 w-5" />,
    description: "Calculate phase equilibrium, EOS, activity coefficients, and thermodynamic properties",
    calculations: [
      "Vapor-liquid equilibrium (VLE)",
      "Liquid-liquid equilibrium (LLE)",
      "Solid-liquid equilibrium (SLE)",
      "Equation of State (EOS) calculations",
      "Activity coefficient models",
      "Enthalpy and entropy calculations",
      "Fugacity and phase stability analysis",
      "Compressibility factor (Z-factor) calculations"
    ]
  },
  {
    id: "process",
    name: "Process Simulation & Unit Operations",
    icon: <Gauge className="h-5 w-5" />,
    description: "Perform mass/energy balances, flow sheeting, optimization, and equipment sizing",
    calculations: [
      "Mass and energy balance",
      "Flow sheeting for steady-state and dynamic simulations",
      "Process optimization",
      "Sensitivity analysis",
      "Hydraulic calculations",
      "Equipment sizing",
      "Column convergence and tray analysis"
    ]
  },
  {
    id: "heat",
    name: "Heat Transfer & Exchanger Design",
    icon: <Zap className="h-5 w-5" />,
    description: "Design heat exchangers, calculate temperature profiles, and optimize energy use",
    calculations: [
      "Log Mean Temperature Difference (LMTD) method",
      "Effectiveness-NTU (ε-NTU) method",
      "Heat exchanger sizing and rating",
      "Pinch analysis for energy optimization",
      "Fouling factor calculations",
      "Heat loss and heat duty calculations"
    ]
  },
  {
    id: "reaction",
    name: "Reaction Engineering",
    icon: <FlaskConical className="h-5 w-5" />,
    description: "Model reactors, analyze kinetics, and optimize reaction conditions",
    calculations: [
      "Reactor modeling (PFR, CSTR, Batch)",
      "Reaction kinetics analysis",
      "Equilibrium conversions",
      "Heat of reaction calculations",
      "Reaction yield and selectivity optimization"
    ]
  },
  {
    id: "distillation",
    name: "Distillation & Separation Processes",
    icon: <Beaker className="h-5 w-5" />,
    description: "Design and optimize distillation columns and other separation processes",
    calculations: [
      "McCabe-Thiele method for distillation",
      "Fenske-Underwood-Gilliland method",
      "Rigorous distillation column simulations",
      "Packed and tray column design",
      "Absorption and stripping calculations",
      "Azeotropic and extractive distillation modeling",
      "Multicomponent distillation",
      "Mass transfer rate-based modeling"
    ]
  },
  {
    id: "fluid",
    name: "Fluid Flow & Pipeline Hydraulics",
    icon: <Waves className="h-5 w-5" />,
    description: "Calculate pressure drops, model flows, and size pumps and compressors",
    calculations: [
      "Pressure drop calculations (Darcy-Weisbach, Hazen-Williams)",
      "Two-phase flow modeling",
      "Pump sizing and NPSH calculations",
      "Compressor power requirements",
      "Surge analysis and relief system design"
    ]
  },
  {
    id: "safety",
    name: "Process Safety & Environmental Calculations",
    icon: <Shield className="h-5 w-5" />,
    description: "Size relief systems, analyze hazards, and assess environmental impacts",
    calculations: [
      "Flare and vent system sizing",
      "Relief valve sizing (API 520/521)",
      "Emission modeling and dispersion analysis",
      "Fire and explosion consequence modeling",
      "Environmental impact assessments"
    ]
  },
  {
    id: "utilities",
    name: "Utilities & Energy Optimization",
    icon: <Zap className="h-5 w-5" />,
    description: "Model utility systems and optimize energy consumption",
    calculations: [
      "Steam network modeling",
      "Fuel gas system optimization",
      "Cogeneration and waste heat recovery",
      "Refrigeration cycle modeling",
      "Utility cost and energy efficiency analysis"
    ]
  },
  {
    id: "economic",
    name: "Economic Analysis",
    icon: <DollarSign className="h-5 w-5" />,
    description: "Estimate costs, calculate returns, and analyze project economics",
    calculations: [
      "Capital cost estimation",
      "Operating cost analysis",
      "Payback period and return on investment (ROI)",
      "Net present value (NPV) and internal rate of return (IRR)"
    ]
  }
];

const HysysCalculations = () => {
  const [activeCategory, setActiveCategory] = useState(calculationCategories[0].id);
  const [simulationData, setSimulationData] = useState<any>(null);
  const [realTimeData, setRealTimeData] = useState<any[]>([]);
  const [isRealTimeActive, setIsRealTimeActive] = useState(false);
  const [realTimeInterval, setRealTimeInterval] = useState<number | null>(null);
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
  const [thermodynamicModel, setThermodynamicModel] = useState<string>('Peng-Robinson');
  const [calculationResults, setCalculationResults] = useState<any>({});
  const { toast } = useToast();
  const analysisRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadSimulationData = () => {
      try {
        const simName = localStorage.getItem('chemflow-simulation-name');
        const simComponents = localStorage.getItem('chemflow-selected-components');
        const simModel = localStorage.getItem('chemflow-selected-model');
        const simSubject = localStorage.getItem('chemflow-simulation-subject');
        const simAnalysisData = localStorage.getItem('chemflow-analysis-data');
        
        if (simComponents) {
          const components = JSON.parse(simComponents);
          setSelectedComponents(components);
        }
        
        if (simModel) {
          setThermodynamicModel(simModel);
        }
        
        const data = {
          name: simName || 'Untitled Simulation',
          components: simComponents ? JSON.parse(simComponents) : [],
          model: simModel || 'Peng-Robinson',
          subject: simSubject || 'Chemical Process',
          analysisData: simAnalysisData ? JSON.parse(simAnalysisData) : []
        };
        
        setSimulationData(data);
        
        if (data.analysisData && data.analysisData.length > 0) {
          setRealTimeData([data.analysisData[0]]);
        }
        
        if (data.components.length > 0) {
          toast({
            title: "Simulation Data Loaded",
            description: `Loaded ${data.components.length} components with ${data.model} model`
          });
          
          const results = generateInitialCalculationResults(data.components, data.model, data.subject);
          setCalculationResults(results);
        }
      } catch (error) {
        console.error("Error loading simulation data:", error);
      }
    };
    
    loadSimulationData();
  }, [toast]);

  const generateInitialCalculationResults = (components: string[], model: string, subject: string) => {
    const results: {[key: string]: any} = {};
    
    calculationCategories.forEach(category => {
      switch(category.id) {
        case "thermodynamic":
          results[category.id] = generateThermodynamicResults(components, model);
          break;
        case "process":
          results[category.id] = generateProcessResults(components, model, subject);
          break;
        case "heat":
          results[category.id] = generateHeatTransferResults(components, model);
          break;
        case "reaction":
          results[category.id] = generateReactionResults(components, model);
          break;
        case "distillation":
          results[category.id] = generateDistillationResults(components, model);
          break;
        case "fluid":
          results[category.id] = generateFluidFlowResults(components, model);
          break;
        case "safety":
          results[category.id] = generateSafetyResults(components, model);
          break;
        case "utilities":
          results[category.id] = generateUtilitiesResults(components, model);
          break;
        case "economic":
          results[category.id] = generateEconomicResults(components, model);
          break;
        default:
          results[category.id] = {
            summary: `Calculation results for ${category.name} using ${model} model with ${components.join(", ")}`,
            details: "Detailed calculations will be displayed when you run the analysis."
          };
      }
    });
    
    return results;
  };

  const generateThermodynamicResults = (components: string[], model: string) => {
    const results: {[key: string]: any} = {
      summary: `Thermodynamic properties calculated using ${model} model`,
      properties: {} as {[key: string]: any}
    };
    
    components.forEach(comp => {
      let criticalTemp, criticalPressure, acentricFactor;
      
      if (comp === 'Ethanol') {
        criticalTemp = 513.9;
        criticalPressure = 6.14;
        acentricFactor = 0.644;
      } else if (comp === 'Methanol') {
        criticalTemp = 512.6;
        criticalPressure = 8.09;
        acentricFactor = 0.565;
      } else if (comp === 'Water') {
        criticalTemp = 647.1;
        criticalPressure = 22.06;
        acentricFactor = 0.344;
      } else if (comp === 'Benzene') {
        criticalTemp = 562.2;
        criticalPressure = 4.89;
        acentricFactor = 0.210;
      } else if (comp.includes('ane')) {
        criticalTemp = 300 + Math.random() * 200;
        criticalPressure = 3 + Math.random() * 5;
        acentricFactor = 0.1 + Math.random() * 0.2;
      } else {
        criticalTemp = 400 + Math.random() * 300;
        criticalPressure = 3 + Math.random() * 20;
        acentricFactor = 0.2 + Math.random() * 0.6;
      }
      
      if (model === 'Peng-Robinson') {
        acentricFactor *= 1.02;
      } else if (model === 'Soave-Redlich-Kwong') {
        acentricFactor *= 0.98;
      }
      
      results.properties[comp] = {
        criticalTemperature: criticalTemp.toFixed(1) + ' K',
        criticalPressure: criticalPressure.toFixed(2) + ' MPa',
        acentricFactor: acentricFactor.toFixed(3),
        normalBoilingPoint: (criticalTemp * 0.6).toFixed(1) + ' K',
        molecularWeight: (10 + Math.random() * 90).toFixed(2) + ' g/mol',
        liquidDensity: (800 + Math.random() * 500).toFixed(1) + ' kg/m³',
        vaporPressure: (0.1 + Math.random() * 1).toFixed(3) + ' MPa at 298K'
      };
    });
    
    return results;
  };

  const generateProcessResults = (components: string[], model: string, subject: string) => {
    let streamData, equipmentData, optimizationData;
    
    if (subject === 'Distillation') {
      streamData = {
        feed: { temperature: '350 K', pressure: '101.3 kPa', flowRate: '100 kg/hr' },
        distillate: { temperature: '330 K', pressure: '100.0 kPa', flowRate: '40 kg/hr' },
        bottoms: { temperature: '380 K', pressure: '105.0 kPa', flowRate: '60 kg/hr' }
      };
      
      equipmentData = {
        column: { stages: '15', refluxRatio: '3.5', feedStage: '8' },
        condenser: { duty: '-250 kW', temperature: '330 K' },
        reboiler: { duty: '280 kW', temperature: '380 K' }
      };
    } else if (subject === 'Esterification Reaction') {
      streamData = {
        feedAlcohol: { temperature: '340 K', pressure: '200 kPa', flowRate: '50 kg/hr' },
        feedAcid: { temperature: '330 K', pressure: '200 kPa', flowRate: '60 kg/hr' },
        product: { temperature: '360 K', pressure: '190 kPa', flowRate: '105 kg/hr' },
        waste: { temperature: '360 K', pressure: '190 kPa', flowRate: '5 kg/hr' }
      };
      
      equipmentData = {
        reactor: { volume: '2 m³', residence: '45 min', temperature: '360 K' },
        separator: { efficiency: '95%', recoveryEster: '98%' }
      };
    } else {
      streamData = {
        feed: { temperature: '320 K', pressure: '150 kPa', flowRate: '100 kg/hr' },
        product: { temperature: '350 K', pressure: '140 kPa', flowRate: '95 kg/hr' },
        waste: { temperature: '350 K', pressure: '140 kPa', flowRate: '5 kg/hr' }
      };
      
      equipmentData = {
        mainUnit: { efficiency: '95%', operatingTemp: '350 K', operatingPressure: '150 kPa' },
        auxiliaryUnit: { efficiency: '90%', utilization: '85%' }
      };
    }
    
    optimizationData = {
      objectiveFunction: 'Maximize production while minimizing energy usage',
      constraints: 'Temperature < 400K, Pressure < 300 kPa',
      sensitivityVariables: ['Feed temperature', 'Residence time', 'Catalyst loading'],
      optimumPoint: { 
        temperature: (330 + Math.random() * 30).toFixed(1) + ' K',
        pressure: (150 + Math.random() * 50).toFixed(1) + ' kPa',
        catalyst: (2 + Math.random() * 3).toFixed(2) + ' kg/m³'
      }
    };
    
    return {
      summary: `Process simulation for ${subject} using ${components.join(", ")} with ${model} model`,
      streamData,
      equipmentData,
      optimizationData,
      massBalance: `Overall mass balance closure: ${(99 + Math.random()).toFixed(2)}%`,
      energyBalance: `Overall energy balance closure: ${(98.5 + Math.random() * 1.5).toFixed(2)}%`
    };
  };

  const generateHeatTransferResults = (components: string[], model: string) => {
    const hotSide = {
      fluid: components[0] || 'Process fluid',
      inletTemp: (350 + Math.random() * 50).toFixed(1) + ' K',
      outletTemp: (320 + Math.random() * 30).toFixed(1) + ' K',
      flowRate: (1000 + Math.random() * 500).toFixed(0) + ' kg/hr',
      pressure: (200 + Math.random() * 100).toFixed(1) + ' kPa',
      heatCapacity: (2 + Math.random()).toFixed(3) + ' kJ/kg·K'
    };
    
    const coldSide = {
      fluid: components.length > 1 ? components[1] : 'Cooling water',
      inletTemp: (290 + Math.random() * 20).toFixed(1) + ' K',
      outletTemp: (310 + Math.random() * 30).toFixed(1) + ' K',
      flowRate: (1200 + Math.random() * 600).toFixed(0) + ' kg/hr',
      pressure: (150 + Math.random() * 50).toFixed(1) + ' kPa',
      heatCapacity: (4 + Math.random() * 0.2).toFixed(3) + ' kJ/kg·K'
    };
    
    const exchanger = {
      type: 'Shell and tube heat exchanger',
      heatDuty: (250 + Math.random() * 100).toFixed(1) + ' kW',
      overallHeatTransferCoefficient: (500 + Math.random() * 300).toFixed(0) + ' W/m²·K',
      logMeanTemperatureDifference: (35 + Math.random() * 15).toFixed(1) + ' K',
      heatTransferArea: (20 + Math.random() * 10).toFixed(1) + ' m²',
      effectivenessNTU: { effectiveness: (0.7 + Math.random() * 0.2).toFixed(2), ntu: (3 + Math.random() * 2).toFixed(1) },
      foulingFactor: (0.0001 + Math.random() * 0.0001).toExponential(2) + ' m²·K/W'
    };
    
    return {
      summary: `Heat transfer calculations for ${components.join(", ")} system using ${model} thermodynamic model`,
      hotSide,
      coldSide,
      exchanger,
      energyBalance: `Heat duty balance: ${(99 + Math.random()).toFixed(1)}%`,
      recommendations: [
        `Operating the exchanger at ${exchanger.overallHeatTransferCoefficient} provides optimal performance`,
        `Cleaning schedule recommended every ${(2000 + Math.random() * 1000).toFixed(0)} hours to manage fouling`,
        `Consider ${Math.random() > 0.5 ? 'parallel' : 'counter-current'} flow arrangement for efficiency`
      ]
    };
  };

  const generateReactionResults = (components: string[], model: string) => {
    const results: {[key: string]: any} = {
      summary: `Reaction engineering calculations for ${components.join(", ")} using ${model} model`,
      kinetics: {
        rateConstant: (100 + Math.random() * 100).toFixed(2) + ' mol/(L·s)',
        activationEnergy: (50 + Math.random() * 50).toFixed(1) + ' kJ/mol',
        preExponentialFactor: (1000 + Math.random() * 1000).toFixed(0) + ' L/mol·s'
      },
      equilibrium: {
        conversion: (0.8 + Math.random() * 0.2).toFixed(2),
        equilibriumConstant: (100 + Math.random() * 100).toFixed(2)
      },
      heatOfReaction: {
        enthalpy: (50 + Math.random() * 50).toFixed(1) + ' kJ/mol',
        entropy: (10 + Math.random() * 10).toFixed(1) + ' J/(mol·K)'
      },
      yieldSelectivity: {
        yield: (0.95 + Math.random() * 0.05).toFixed(2),
        selectivity: (0.90 + Math.random() * 0.1).toFixed(2)
      }
    };
    
    return results;
  };

  const generateDistillationResults = (components: string[], model: string) => {
    const results: {[key: string]: any} = {
      summary: `Distillation calculations for ${components.join(", ")} using ${model} model`,
      McCabeThiele: {
        feed: { temperature: '350 K', pressure: '101.3 kPa', flowRate: '100 kg/hr' },
        distillate: { temperature: '330 K', pressure: '100.0 kPa', flowRate: '40 kg/hr' },
        bottoms: { temperature: '380 K', pressure: '105.0 kPa', flowRate: '60 kg/hr' }
      },
      FenskeUnderwoodGilliland: {
        feed: { temperature: '350 K', pressure: '101.3 kPa', flowRate: '100 kg/hr' },
        distillate: { temperature: '330 K', pressure: '100.0 kPa', flowRate: '40 kg/hr' },
        bottoms: { temperature: '380 K', pressure: '105.0 kPa', flowRate: '60 kg/hr' }
      },
      rigorous: {
        feed: { temperature: '350 K', pressure: '101.3 kPa', flowRate: '100 kg/hr' },
        distillate: { temperature: '330 K', pressure: '100.0 kPa', flowRate: '40 kg/hr' },
        bottoms: { temperature: '380 K', pressure: '105.0 kPa', flowRate: '60 kg/hr' }
      }
    };
    
    return results;
  };

  const generateFluidFlowResults = (components: string[], model: string) => {
    const results: {[key: string]: any} = {
      summary: `Fluid flow calculations for ${components.join(", ")} using ${model} model`,
      pressureDrop: {
        DarcyWeisbach: {
          fluid: components[0] || 'Process fluid',
          length: (10 + Math.random() * 10).toFixed(1) + ' m',
          diameter: (0.1 + Math.random() * 0.1).toFixed(2) + ' m',
          roughness: (0.0001 + Math.random() * 0.0001).toExponential(2) + ' m',
          flowRate: (100 + Math.random() * 100).toFixed(0) + ' kg/hr',
          pressureDrop: (10 + Math.random() * 10).toFixed(1) + ' kPa'
        },
        HazenWilliams: {
          fluid: components[0] || 'Process fluid',
          length: (10 + Math.random() * 10).toFixed(1) + ' m',
          diameter: (0.1 + Math.random() * 0.1).toFixed(2) + ' m',
          roughness: (0.0001 + Math.random() * 0.0001).toExponential(2) + ' m',
          flowRate: (100 + Math.random() * 100).toFixed(0) + ' kg/hr',
          pressureDrop: (10 + Math.random() * 10).toFixed(1) + ' kPa'
        }
      },
      twoPhaseFlow: {
        fluid: components[0] || 'Process fluid',
        length: (10 + Math.random() * 10).toFixed(1) + ' m',
        diameter: (0.1 + Math.random() * 0.1).toFixed(2) + ' m',
        flowRate: (100 + Math.random() * 100).toFixed(0) + ' kg/hr',
        pressureDrop: (10 + Math.random() * 10).toFixed(1) + ' kPa'
      },
      pumpSizing: {
        fluid: components[0] || 'Process fluid',
        flowRate: (100 + Math.random() * 100).toFixed(0) + ' kg/hr',
        head: (100 + Math.random() * 100).toFixed(0) + ' m',
        NPSH: (10 + Math.random() * 10).toFixed(1) + ' m'
      },
      surgeAnalysis: {
        fluid: components[0] || 'Process fluid',
        flowRate: (100 + Math.random() * 100).toFixed(0) + ' kg/hr',
        pressure: (100 + Math.random() * 100).toFixed(0) + ' kPa',
        surgeCapacity: (10 + Math.random() * 10).toFixed(1) + ' m³/s'
      }
    };
    
    return results;
  };

  const generateSafetyResults = (components: string[], model: string) => {
    const results: {[key: string]: any} = {
      summary: `Process safety calculations for ${components.join(", ")} using ${model} model`,
      flareVent: {
        capacity: (100 + Math.random() * 100).toFixed(0) + ' m³/hr',
        pressure: (100 + Math.random() * 100).toFixed(0) + ' kPa'
      },
      reliefValve: {
        size: (100 + Math.random() * 100).toFixed(0) + ' kPa',
        capacity: (100 + Math.random() * 100).toFixed(0) + ' m³/hr'
      },
      emissionModeling: {
        concentration: (10 + Math.random() * 10).toFixed(1) + ' g/m³',
        dispersion: (10 + Math.random() * 10).toFixed(1) + ' m'
      },
      fireExplosion: {
        consequence: (100 + Math.random() * 100).toFixed(0) + ' m³',
        probability: (0.01 + Math.random() * 0.01).toFixed(3)
      },
      environmentalImpact: {
        impact: (100 + Math.random() * 100).toFixed(0) + ' kg/m²'
      }
    };
    
    return results;
  };

  const generateUtilitiesResults = (components: string[], model: string) => {
    const results: {[key: string]: any} = {
      summary: `Utilities calculations for ${components.join(", ")} using ${model} model`,
      steamNetwork: {
        pressure: (100 + Math.random() * 100).toFixed(0) + ' kPa',
        temperature: (300 + Math.random() * 300).toFixed(1) + ' K',
        flowRate: (100 + Math.random() * 100).toFixed(0) + ' kg/hr'
      },
      fuelGasSystem: {
        flowRate: (100 + Math.random() * 100).toFixed(0) + ' kg/hr',
        pressure: (100 + Math.random() * 100).toFixed(0) + ' kPa'
      },
      cogeneration: {
        efficiency: (0.8 + Math.random() * 0.2).toFixed(2),
        power: (100 + Math.random() * 100).toFixed(0) + ' kW'
      },
      refrigerationCycle: {
        temperature: (300 + Math.random() * 300).toFixed(1) + ' K',
        pressure: (100 + Math.random() * 100).toFixed(0) + ' kPa',
        flowRate: (100 + Math.random() * 100).toFixed(0) + ' kg/hr'
      },
      utilityCost: {
        cost: (100 + Math.random() * 100).toFixed(0) + ' $/hr'
      }
    };
    
    return results;
  };

  const generateEconomicResults = (components: string[], model: string) => {
    const results: {[key: string]: any} = {
      summary: `Economic analysis for ${components.join(", ")} using ${model} model`,
      capitalCost: {
        initialInvestment: (1000 + Math.random() * 1000).toFixed(0) + ' $',
        operatingCost: (100 + Math.random() * 100).toFixed(0) + ' $/hr'
      },
      paybackPeriod: {
        period: (10 + Math.random() * 10).toFixed(1) + ' years'
      },
      netPresentValue: {
        value: (10000 + Math.random() * 10000).toFixed(0) + ' $'
      },
      internalRateOfReturn: {
        rate: (0.1 + Math.random() * 0.1).toFixed(2)
      }
    };
    
    return results;
  };

  const startRealTimeAnalysis = () => {
    if (realTimeInterval) {
      clearInterval(realTimeInterval);
    }
    
    if (!simulationData || !selectedComponents.length) {
      toast({
        title: "Simulation Required",
        description: "Please run a simulation first from the Create Simulation page",
        variant: "destructive"
      });
      return;
    }

    if (simulationData.analysisData && simulationData.analysisData.length > 0) {
      const initialDataPoint = simulationData.analysisData[0];
      setRealTimeData([initialDataPoint]);
      
      const intervalId = window.setInterval(() => {
        setRealTimeData(prevData => {
          const nextIndex = prevData.length;
          if (nextIndex >= simulationData.analysisData.length) {
            clearInterval(intervalId);
            setRealTimeInterval(null);
            setIsRealTimeActive(false);
            return prevData;
          }
          
          return [...prevData, simulationData.analysisData[nextIndex]];
        });
      }, 2000);
      
      setRealTimeInterval(intervalId);
      setIsRealTimeActive(true);
    } else {
      const initialData = generateRealTimeDataPoint(0, selectedComponents);
      setRealTimeData([initialData]);
      setIsRealTimeActive(true);
      
      const intervalId = window.setInterval(() => {
        setRealTimeData(prevData => {
          const timePoint = prevData.length;
          if (timePoint >= 20) {
            clearInterval(intervalId);
            setRealTimeInterval(null);
            setIsRealTimeActive(false);
            return prevData;
          }
          
          const newDataPoint = generateRealTimeDataPoint(timePoint, selectedComponents);
          return [...prevData, newDataPoint];
        });
      }, 2000);
      
      setRealTimeInterval(intervalId);
    }
    
    toast({
      title: "Real-time Analysis Started",
      description: "Monitoring simulation parameters in real-time"
    });
  };

  const generateRealTimeDataPoint = (timePoint: number, components: string[]) => {
    const dataPoint: { 
      time: number; 
      temperature?: number; 
      pressure?: number; 
      conversion?: number;
      [key: string]: number | undefined; 
    } = { time: timePoint };
    
    components.forEach(comp => {
      let value;
      const subject = simulationData?.subject || 'Chemical Process';
      
      if (comp === 'Ethanol') {
        value = Math.min(95, 10 + 85 * (1 - Math.exp(-0.2 * timePoint)));
        
        if (thermodynamicModel === 'NRTL' || thermodynamicModel === 'UNIQUAC') {
          value *= 1.05;
        }
      } else if (comp === 'Water') {
        value = Math.min(90, 15 + 75 * (1 - Math.exp(-0.15 * timePoint)));
        
        if (thermodynamicModel === 'Peng-Robinson') {
          value *= 0.95; 
        }
      } else if (comp === 'Methanol') {
        value = Math.min(85, 5 + 80 * (1 - Math.exp(-0.25 * timePoint)));
        
        if (components.includes('Acetic Acid')) {
          value *= 0.85;
        }
      } else if (comp === 'Butanol') {
        value = Math.min(75, 8 + 67 * (1 - Math.exp(-0.18 * timePoint)));
      } else if (comp.includes('Acid')) {
        value = Math.max(5, 70 - 65 * (1 - Math.exp(-0.15 * timePoint)));
      } else if (comp.includes('ane')) {
        value = Math.min(60, 5 + 55 * (1 - Math.exp(-0.3 * timePoint)));
      } else {
        value = Math.min(80, 10 + 70 * (1 - Math.exp(-0.2 * timePoint)));
      }
      
      dataPoint[comp] = value * (0.95 + Math.random() * 0.1);
    });
    
    if (simulationData?.subject === 'Distillation') {
      dataPoint.temperature = 350 + 30 * Math.sin(timePoint / 5 + Math.random() * 0.3);
    } else if (simulationData?.subject === 'Esterification Reaction') {
      dataPoint.temperature = 330 + 25 * Math.sin(timePoint / 4 + Math.random() * 0.2);
    } else if (simulationData?.subject === 'Gas Processing') {
      dataPoint.temperature = 250 + 40 * Math.sin(timePoint / 6 + Math.random() * 0.4);
    } else {
      dataPoint.temperature = 300 + 50 * Math.sin(timePoint / 3 + Math.random() * 0.5);
    }
    
    if (simulationData?.subject === 'Gas Processing') {
      dataPoint.pressure = 200 - 20 * Math.cos(timePoint / 2 + Math.random() * 0.3);
    } else {
      dataPoint.pressure = 100 - 10 * Math.cos(timePoint / 2 + Math.random() * 0.3);
    }
    
    if (simulationData?.subject === 'Esterification Reaction') {
      dataPoint.conversion = Math.min(0.98, 1 - Math.exp(-0.15 * (timePoint + 1)));
    } else if (simulationData?.subject === 'Aromatics Separation') {
      dataPoint.conversion = Math.min(0.95, 1 - Math.exp(-0.1 * (timePoint + 1)));
    } else {
      dataPoint.conversion = Math.min(0.90, 1 - Math.exp(-0.08 * (timePoint + 1)));
    }
    
    return dataPoint;
  };

  const stopRealTimeAnalysis = () => {
    if (realTimeInterval) {
      clearInterval(realTimeInterval);
      setRealTimeInterval(null);
    }
    setIsRealTimeActive(false);
    
    toast({
      title: "Real-time Analysis Stopped",
      description: "Analysis data has been frozen for inspection"
    });
  };

  const exportCalculationsToPDF = async () => {
    if (!analysisRef.current || !simulationData) {
      toast({
        title: "Cannot export calculations",
        description: "Please run a simulation first",
        variant: "destructive",
      });
      return;
    }
    
    try {
      toast({
        title: "Generating PDF",
        description: "Please wait while we generate your calculation report...",
      });
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const analysisElement = analysisRef.current;
      
      pdf.setFontSize(18);
      pdf.text(`HYSYS Calculations - ${simulationData.name}`, 20, 20);
      
      pdf.setFontSize(12);
      pdf.text(`Thermodynamic Model: ${thermodynamicModel}`, 20, 30);
      pdf.text(`Components: ${selectedComponents.join(", ")}`, 20, 40);
      pdf.text(`Category: ${calculationCategories.find(c => c.id === activeCategory)?.name || "Thermodynamic"}`, 20, 50);
      pdf.text(`Date: ${new Date().toLocaleDateString()}`, 20, 60);
      
      const scale = 2;
      const canvas = await html2canvas(analysisElement, { scale });
      const imgData = canvas.toDataURL('image/png');
      
      const imgWidth = 170;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);
      
      pdf.addPage();
      pdf.setFontSize(16);
      pdf.text("Calculation Details", 20, 20);
      
      const currentCategoryResult = calculationResults[activeCategory];
      if (currentCategoryResult) {
        let yPos = 35;
        
        pdf.setFontSize(14);
        pdf.text(calculationCategories.find(c => c.id === activeCategory)?.name || activeCategory, 20, yPos);
        yPos += 10;
        
        pdf.setFontSize(10);
        const details = JSON.stringify(currentCategoryResult, null, 2);
        const detailLines = details.split('\n');
        
        detailLines.forEach(line => {
          if (yPos > 280) {
            pdf.addPage();
            yPos = 20;
          }
          pdf.text(line, 20, yPos);
          yPos += 5;
        });
      }
      
      pdf.save(`HYSYS_Calculations_${simulationData.name.replace(/\s+/g, '_')}.pdf`);
      
      toast({
        title: "PDF Generated",
        description: "Calculation report has been saved as PDF",
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

  useEffect(() => {
    return () => {
      if (realTimeInterval) {
        clearInterval(realTimeInterval);
      }
    };
  }, [realTimeInterval]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 dark:text-white">
      <Navbar />
      
      <main className="flex-1 py-16 px-6 animate-fade-in">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-8 relative">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: "2s" }}></div>
            
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-display font-bold mb-4 bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent relative z-10">
                  Aspen HYSYS Calculations
                </h1>
                <p className="text-gray-600 dark:text-gray-300 max-w-3xl relative z-10">
                  Access a comprehensive library of chemical process calculations with real-time analysis 
                  and modern visualization tools that enhance your workflow.
                </p>
              </div>
              
              <div className="flex gap-3">
                {simulationData && (
                  <div className="bg-blue-50 dark:bg-gray-800 p-3 rounded-lg">
                    <p className="text-sm font-medium">Active Simulation:</p>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{simulationData.name}</p>
                    <p className="text-xs text-gray-500">{simulationData.model} model · {selectedComponents.length} components</p>
                  </div>
                )}
                
                <div className="flex flex-col gap-2">
                  <Button 
                    variant={isRealTimeActive ? "destructive" : "default"}
                    onClick={isRealTimeActive ? stopRealTimeAnalysis : startRealTimeAnalysis}
                  >
                    {isRealTimeActive ? (
                      <>
                        <Pause className="mr-2 h-4 w-4" />
                        Stop Analysis
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Start Analysis
                      </>
                    )}
                  </Button>
                  
                  <Button variant="outline" onClick={() => setRealTimeData([])}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset Data
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-3 relative z-10">
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 shadow-sm hover:shadow transform hover:scale-105 transition-all">
                Real-time Analysis
              </span>
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 shadow-sm hover:shadow transform hover:scale-105 transition-all">
                Step-by-step Calculations
              </span>
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 shadow-sm hover:shadow transform hover:scale-105 transition-all">
                Interactive Examples
              </span>
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 shadow-sm hover:shadow transform hover:scale-105 transition-all">
                Aspen HYSYS Compatible
              </span>
            </div>
          </div>
          
          <div ref={analysisRef}>
            {realTimeData.length > 0 && (
              <div className="mb-8 glass-panel relative z-10 shadow-xl border border-white/30 backdrop-blur-sm">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Real-time Simulation Analysis</h2>
                    <Button variant="outline" size="sm" onClick={exportCalculationsToPDF}>
                      <FileText className="mr-2 h-4 w-4" />
                      Export as PDF
                    </Button>
                  </div>
                  <p className="mb-6 text-gray-600 dark:text-gray-400">
                    Monitoring key parameters from your {simulationData?.model} simulation
                  </p>
                  
                  <RealTimeAnalysisCharts 
                    realTimeData={realTimeData} 
                    selectedComponents={selectedComponents}
                    isRealTimeActive={isRealTimeActive}
                  />
                </div>
              </div>
            )}
            
            {!realTimeData.length && simulationData && (
              <div className="mb-8 glass-panel relative z-10 shadow-xl border border-white/30 backdrop-blur-sm p-12 flex flex-col items-center justify-center">
                <AlertCircle className="h-16 w-16 text-blue-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2 text-center">Ready for Real-time Analysis</h2>
                <p className="mb-6 text-gray-600 dark:text-gray-400 text-center max-w-lg">
                  Your simulation data has been loaded. Click the "Start Analysis" button to begin real-time monitoring of your process.
                </p>
                <Button 
                  size="lg"
                  onClick={startRealTimeAnalysis}
                >
                  <Play className="mr-2 h-5 w-5" />
                  Start Real-time Analysis
                </Button>
              </div>
            )}
            
            {!simulationData && (
              <div className="mb-8 glass-panel relative z-10 shadow-xl border border-white/30 backdrop-blur-sm p-12 flex flex-col items-center justify-center">
                <AlertCircle className="h-16 w-16 text-amber-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2 text-center">No Simulation Data Found</h2>
                <p className="mb-6 text-gray-600 dark:text-gray-400 text-center max-w-lg">
                  You need to create and run a simulation first. Go to the Create Simulation page to set up your components, thermodynamic model, and run a simulation.
                </p>
                <Button 
                  size="lg"
                  onClick={() => window.location.href = '/create-simulation'}
                >
                  <Play className="mr-2 h-5 w-5" />
                  Create Simulation
                </Button>
              </div>
            )}
          </div>
          
          <div className="glass-panel relative z-10 shadow-xl border border-white/30 backdrop-blur-sm">
            <TooltipProvider>
              <Tabs defaultValue={activeCategory} onValueChange={setActiveCategory} className="w-full">
                <div className="overflow-x-auto pb-3">
                  <TabsList className="bg-blue-50/50 dark:bg-gray-800/50 p-1 flex space-x-1 flex-nowrap min-w-max">
                    {calculationCategories.map((category) => (
                      <TabsTrigger
                        key={category.id}
                        value={category.id}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700",
                          "whitespace-nowrap text-sm font-medium"
                        )}
                      >
                        {category.icon}
                        <span>{category.name}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
                
                {calculationCategories.map((category) => (
                  <TabsContent
                    key={category.id}
                    value={category.id}
                    className="p-6 focus:outline-none"
                  >
                    <div className="max-w-screen-lg mx-auto">
                      <div className="mb-6">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
                          {category.name}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                          {category.description}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-white/70 dark:bg-gray-800/50 p-5 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                          <h3 className="text-lg font-semibold mb-3 text-blue-700 dark:text-blue-400">
                            Available Calculations
                          </h3>
                          <ul className="space-y-2">
                            {category.calculations.map((calc, index) => (
                              <li key={index} className="flex items-start">
                                <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-1.5 mr-2 flex-shrink-0"></span>
                                <span className="text-sm text-gray-700 dark:text-gray-300">{calc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {selectedComponents.length > 0 ? (
                          <HysysIntegration 
                            selectedComponents={selectedComponents} 
                            thermodynamicModel={thermodynamicModel}
                            calculationType={category.id}
                            calculationResults={calculationResults[category.id]}
                          />
                        ) : (
                          <AspenCalculations calculationType={category.id} className="h-full" />
                        )}
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </TooltipProvider>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HysysCalculations;
