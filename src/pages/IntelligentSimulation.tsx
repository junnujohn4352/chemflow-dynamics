
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { 
  Search, 
  Filter, 
  FlaskConical, 
  Thermometer, 
  BarChart3, 
  ArrowRight, 
  Check,
  Info,
  Download,
  Save,
  AlertTriangle,
  Plus,
  Minus,
  Dices,
  Play
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';
import ComponentDetailsPanel from "@/components/simulation/ComponentDetailsPanel";

// Types
interface Compound {
  id: string;
  name: string;
  formula: string;
  molecularWeight: number;
  boilingPoint: number;
  criticalTemperature: number;
  criticalPressure: number;
  phase: 'gas' | 'liquid' | 'solid';
  hazard: string;
  antoineA: number;
  antoineB: number;
  antoineC: number;
  enthalpyOfFormation: number;
  structure?: string;
  category: string;
}

interface SelectedCompound extends Compound {
  composition: number;
}

interface SimulationResults {
  phaseDistribution: {
    vapor: number;
    liquid: number;
    solid: number;
  };
  fugacityCoefficients: Record<string, number>;
  activityCoefficients: Record<string, number>;
  enthalpy: number;
  entropy: number;
  gibbsFreeEnergy: number;
  bubblePoint: number;
  dewPoint: number;
  equilibriumConstants: Record<string, number>;
  relativeVolatility: Record<string, number>;
  heatOfMixing: number;
  entropyOfMixing: number;
  flashResults?: {
    vaporFraction: number;
    liquid: Record<string, number>;
    vapor: Record<string, number>;
  };
}

const IntelligentSimulation = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Step 1: Compound Selection States
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [compounds, setCompounds] = useState<Compound[]>([]);
  const [selectedCompounds, setSelectedCompounds] = useState<SelectedCompound[]>([]);
  const [activeCompoundDetails, setActiveCompoundDetails] = useState<string | null>(null);
  
  // Step 2: Thermodynamic Model States
  const [selectedModel, setSelectedModel] = useState<string>("ideal-gas");
  const [showModelInfo, setShowModelInfo] = useState(false);
  
  // Step 3: Operating Conditions States
  const [temperature, setTemperature] = useState(298); // K
  const [pressure, setPressure] = useState(101.325); // kPa
  const [phaseSpecification, setPhaseSpecification] = useState<string>("vapor-liquid");
  const [useTemperatureRange, setUseTemperatureRange] = useState(false);
  const [temperatureRange, setTemperatureRange] = useState<[number, number]>([273, 373]);
  const [usePressureRange, setUsePressureRange] = useState(false);
  const [pressureRange, setPressureRange] = useState<[number, number]>([100, 1000]);
  const [flowRate, setFlowRate] = useState(100); // mol/h
  
  // Step 4-5: Calculation Results States
  const [calculationInProgress, setCalculationInProgress] = useState(false);
  const [results, setResults] = useState<SimulationResults | null>(null);
  const [phaseData, setPhaseData] = useState<any[]>([]);
  const [propertyData, setPropertyData] = useState<any[]>([]);
  const [compositionData, setCompositionData] = useState<any[]>([]);
  const [lastCalculationTime, setLastCalculationTime] = useState<Date | null>(null);
  
  // Step 6-7: Export and Warnings
  const [warnings, setWarnings] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [simulationName, setSimulationName] = useState("Untitled Simulation");
  const chartRef = useRef<HTMLDivElement>(null);
  
  // Load compound database
  useEffect(() => {
    // Simulated database fetch
    const fetchCompounds = () => {
      // Mock database of common chemical compounds
      const mockCompounds: Compound[] = [
        {
          id: "water",
          name: "Water",
          formula: "H₂O",
          molecularWeight: 18.015,
          boilingPoint: 100,
          criticalTemperature: 647.1, // K
          criticalPressure: 22064, // kPa
          phase: 'liquid',
          hazard: "None",
          antoineA: 5.40221,
          antoineB: 1838.675,
          antoineC: -31.737,
          enthalpyOfFormation: -285.8, // kJ/mol
          category: "Inorganic"
        },
        {
          id: "methane",
          name: "Methane",
          formula: "CH₄",
          molecularWeight: 16.04,
          boilingPoint: -161.5,
          criticalTemperature: 190.6,
          criticalPressure: 4600,
          phase: 'gas',
          hazard: "Highly flammable",
          antoineA: 3.9895,
          antoineB: 443.028,
          antoineC: -0.49,
          enthalpyOfFormation: -74.87,
          category: "Hydrocarbon"
        },
        {
          id: "ethanol",
          name: "Ethanol",
          formula: "C₂H₅OH",
          molecularWeight: 46.07,
          boilingPoint: 78.37,
          criticalTemperature: 514,
          criticalPressure: 6148,
          phase: 'liquid',
          hazard: "Flammable",
          antoineA: 5.24677,
          antoineB: 1598.673,
          antoineC: -46.424,
          enthalpyOfFormation: -277.69,
          category: "Alcohol"
        },
        {
          id: "acetone",
          name: "Acetone",
          formula: "C₃H₆O",
          molecularWeight: 58.08,
          boilingPoint: 56.05,
          criticalTemperature: 508.1,
          criticalPressure: 4700,
          phase: 'liquid',
          hazard: "Flammable",
          antoineA: 4.42448,
          antoineB: 1312.253,
          antoineC: -32.445,
          enthalpyOfFormation: -248.1,
          category: "Ketone"
        },
        {
          id: "benzene",
          name: "Benzene",
          formula: "C₆H₆",
          molecularWeight: 78.11,
          boilingPoint: 80.1,
          criticalTemperature: 562.2,
          criticalPressure: 4898,
          phase: 'liquid',
          hazard: "Carcinogenic, Flammable",
          antoineA: 4.72583,
          antoineB: 1660.652,
          antoineC: -1.461,
          enthalpyOfFormation: 82.93,
          category: "Aromatic"
        },
        {
          id: "nitrogen",
          name: "Nitrogen",
          formula: "N₂",
          molecularWeight: 28.01,
          boilingPoint: -195.8,
          criticalTemperature: 126.2,
          criticalPressure: 3400,
          phase: 'gas',
          hazard: "Asphyxiant at high concentrations",
          antoineA: 3.7362,
          antoineB: 264.651,
          antoineC: -6.788,
          enthalpyOfFormation: 0,
          category: "Inorganic"
        },
        {
          id: "oxygen",
          name: "Oxygen",
          formula: "O₂",
          molecularWeight: 32.0,
          boilingPoint: -183.0,
          criticalTemperature: 154.6,
          criticalPressure: 5046,
          phase: 'gas',
          hazard: "Oxidizer",
          antoineA: 3.9523,
          antoineB: 340.024,
          antoineC: -4.144,
          enthalpyOfFormation: 0,
          category: "Inorganic"
        },
        {
          id: "carbondioxide",
          name: "Carbon Dioxide",
          formula: "CO₂",
          molecularWeight: 44.01,
          boilingPoint: -78.5, // sublimation point
          criticalTemperature: 304.2,
          criticalPressure: 7376,
          phase: 'gas',
          hazard: "Asphyxiant at high concentrations",
          antoineA: 6.81228,
          antoineB: 1301.679,
          antoineC: -3.494,
          enthalpyOfFormation: -393.51,
          category: "Inorganic"
        },
        {
          id: "toluene",
          name: "Toluene",
          formula: "C₇H₈",
          molecularWeight: 92.14,
          boilingPoint: 110.6,
          criticalTemperature: 591.8,
          criticalPressure: 4110,
          phase: 'liquid',
          hazard: "Flammable, toxic",
          antoineA: 4.54436,
          antoineB: 1738.123,
          antoineC: 0.394,
          enthalpyOfFormation: 50.0,
          category: "Aromatic"
        },
        {
          id: "hexane",
          name: "Hexane",
          formula: "C₆H₁₄",
          molecularWeight: 86.18,
          boilingPoint: 68.7,
          criticalTemperature: 507.6,
          criticalPressure: 3025,
          phase: 'liquid',
          hazard: "Flammable, toxic",
          antoineA: 4.00266,
          antoineB: 1170.875,
          antoineC: -48.833,
          enthalpyOfFormation: -198.7,
          category: "Hydrocarbon"
        },
        {
          id: "methanol",
          name: "Methanol",
          formula: "CH₃OH",
          molecularWeight: 32.04,
          boilingPoint: 64.7,
          criticalTemperature: 512.6,
          criticalPressure: 8084,
          phase: 'liquid',
          hazard: "Flammable, toxic",
          antoineA: 5.20409,
          antoineB: 1581.341,
          antoineC: -33.5,
          enthalpyOfFormation: -238.4,
          category: "Alcohol"
        },
        {
          id: "ammonia",
          name: "Ammonia",
          formula: "NH₃",
          molecularWeight: 17.03,
          boilingPoint: -33.3,
          criticalTemperature: 405.5,
          criticalPressure: 11333,
          phase: 'gas',
          hazard: "Corrosive, toxic",
          antoineA: 4.86886,
          antoineB: 1113.028,
          antoineC: -10.409,
          enthalpyOfFormation: -45.9,
          category: "Inorganic"
        }
      ];
      
      setCompounds(mockCompounds);
    };
    
    fetchCompounds();
  }, []);
  
  // Filter compounds based on search and category
  const filteredCompounds = compounds.filter(compound => {
    const matchesSearch = 
      compound.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      compound.formula.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      filterCategory === "all" || 
      compound.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Get unique categories for filter dropdown
  const categories = ["all", ...Array.from(new Set(compounds.map(c => c.category)))];
  
  // Handler for adding compound to selection
  const handleAddCompound = (compound: Compound) => {
    // Check if already selected
    if (selectedCompounds.some(c => c.id === compound.id)) {
      toast({
        title: "Already selected",
        description: `${compound.name} is already in your selection.`,
        variant: "destructive",
      });
      return;
    }
    
    // Add compound with default composition
    const newSelectedCompound: SelectedCompound = {
      ...compound,
      composition: 100 / (selectedCompounds.length + 1)
    };
    
    // Adjust compositions of all compounds to maintain 100% total
    const updatedCompounds = selectedCompounds.map(c => ({
      ...c,
      composition: 100 / (selectedCompounds.length + 1)
    }));
    
    setSelectedCompounds([...updatedCompounds, newSelectedCompound]);
    setActiveCompoundDetails(compound.id);
    
    toast({
      title: "Compound added",
      description: `${compound.name} added to simulation.`,
    });
  };
  
  // Handler for removing compound from selection
  const handleRemoveCompound = (id: string) => {
    const updatedCompounds = selectedCompounds.filter(c => c.id !== id);
    
    // Readjust compositions
    if (updatedCompounds.length > 0) {
      const equalShare = 100 / updatedCompounds.length;
      updatedCompounds.forEach(c => c.composition = equalShare);
    }
    
    setSelectedCompounds(updatedCompounds);
    
    if (activeCompoundDetails === id) {
      setActiveCompoundDetails(updatedCompounds[0]?.id || null);
    }
    
    toast({
      title: "Compound removed",
      description: `Compound removed from simulation.`,
    });
  };
  
  // Handler for updating compound composition
  const handleUpdateComposition = (id: string, newComposition: number) => {
    // Get the delta (how much we're changing)
    const compound = selectedCompounds.find(c => c.id === id);
    if (!compound) return;
    
    const delta = newComposition - compound.composition;
    
    // If only one compound, it must be 100%
    if (selectedCompounds.length === 1) {
      setSelectedCompounds([{ ...compound, composition: 100 }]);
      return;
    }
    
    // Distribute the delta proportionally among other compounds
    const otherCompounds = selectedCompounds.filter(c => c.id !== id);
    const totalOtherComposition = otherCompounds.reduce((sum, c) => sum + c.composition, 0);
    
    const updatedCompounds = selectedCompounds.map(c => {
      if (c.id === id) {
        return { ...c, composition: newComposition };
      } else {
        // Proportionally adjust other compounds to maintain 100% total
        const adjustmentFactor = (totalOtherComposition - delta) / totalOtherComposition;
        return { ...c, composition: Math.max(0, Math.min(100, c.composition * adjustmentFactor)) };
      }
    });
    
    setSelectedCompounds(updatedCompounds);
  };
  
  // Random Data Generation for the simulation
  const generateRandomData = (baseVal: number, variance: number, count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      x: i,
      y: baseVal + (Math.random() - 0.5) * variance
    }));
  };
  
  // Function to perform the thermodynamic calculations
  const performCalculations = () => {
    if (selectedCompounds.length === 0) {
      toast({
        title: "No compounds selected",
        description: "Please select at least one compound for simulation.",
        variant: "destructive",
      });
      return;
    }
    
    setCalculationInProgress(true);
    setWarnings([]);
    setSuggestions([]);
    
    // Validate inputs and generate warnings/suggestions
    validateInputs();
    
    // Simulate calculation delay
    setTimeout(() => {
      try {
        // Generate simulated results based on selected compounds, model, and conditions
        const simulatedResults = simulateResults();
        setResults(simulatedResults);
        
        // Generate chart data
        generateChartData(simulatedResults);
        
        setLastCalculationTime(new Date());
        setCalculationInProgress(false);
        
        toast({
          title: "Calculation complete",
          description: "Thermodynamic simulation has been successfully performed.",
        });
      } catch (error) {
        console.error("Calculation error:", error);
        setCalculationInProgress(false);
        
        toast({
          title: "Calculation failed",
          description: "An error occurred during simulation. Please try different parameters.",
          variant: "destructive",
        });
      }
    }, 2000);
  };
  
  // Validate inputs and generate warnings/suggestions
  const validateInputs = () => {
    const newWarnings: string[] = [];
    const newSuggestions: string[] = [];
    
    // Check if pressure exceeds critical pressure of any compound
    selectedCompounds.forEach(compound => {
      if (pressure > compound.criticalPressure) {
        newWarnings.push(`Pressure (${pressure} kPa) exceeds critical pressure of ${compound.name} (${compound.criticalPressure} kPa).`);
        newSuggestions.push("Consider switching to a supercritical model for more accurate results.");
      }
      
      if (temperature > compound.criticalTemperature) {
        newWarnings.push(`Temperature (${temperature} K) exceeds critical temperature of ${compound.name} (${compound.criticalTemperature} K).`);
      }
    });
    
    // Check model suitability
    if (selectedCompounds.length > 1 && selectedModel === "ideal-gas") {
      newSuggestions.push("For multi-component systems, consider using a more sophisticated model like Peng-Robinson.");
    }
    
    // Check for likely non-ideal behavior
    const hasAlcohol = selectedCompounds.some(c => c.category === "Alcohol");
    const hasHydrocarbon = selectedCompounds.some(c => c.category === "Hydrocarbon");
    
    if (hasAlcohol && hasHydrocarbon && selectedModel !== "nrtl") {
      newSuggestions.push("Alcohol-hydrocarbon mixtures often show non-ideal behavior. NRTL model is recommended.");
    }
    
    setWarnings(newWarnings);
    setSuggestions(newSuggestions);
  };
  
  // Simulate results based on the selected compounds and parameters
  const simulateResults = (): SimulationResults => {
    // This is a simplified simulation that would be replaced with actual thermodynamic calculations
    
    const fugacityCoefficients: Record<string, number> = {};
    const activityCoefficients: Record<string, number> = {};
    const equilibriumConstants: Record<string, number> = {};
    const relativeVolatility: Record<string, number> = {};
    
    // Calculate properties for each compound
    selectedCompounds.forEach(compound => {
      // Simplified Antoine equation for vapor pressure calculation
      const vaporPressure = Math.exp(compound.antoineA - (compound.antoineB / (temperature + compound.antoineC)));
      
      // Generate realistic-looking coefficients
      fugacityCoefficients[compound.id] = pressure > 1000 ? 0.8 + Math.random() * 0.3 : 0.95 + Math.random() * 0.1;
      activityCoefficients[compound.id] = selectedModel === "ideal-gas" ? 1.0 : 0.7 + Math.random() * 0.6;
      
      // K-values (equilibrium constants)
      equilibriumConstants[compound.id] = vaporPressure / pressure * fugacityCoefficients[compound.id];
      
      // First compound is reference for relative volatility
      if (compound.id === selectedCompounds[0].id) {
        relativeVolatility[compound.id] = 1.0;
      } else {
        relativeVolatility[compound.id] = equilibriumConstants[compound.id] / equilibriumConstants[selectedCompounds[0].id];
      }
    });
    
    // Calculate phase distribution based on temperature and pressure
    let vaporFraction = 0;
    
    if (temperature > 273 && pressure < 101.325) {
      // Higher temp, lower pressure = more vapor
      vaporFraction = 0.7 + Math.random() * 0.2;
    } else if (temperature > 373) {
      // Above boiling point of water
      vaporFraction = 0.9 + Math.random() * 0.1;
    } else if (temperature < 273) {
      // Below freezing
      vaporFraction = 0.1 + Math.random() * 0.1;
    } else {
      // Normal conditions
      vaporFraction = 0.4 + Math.random() * 0.3;
    }
    
    // Adjust for model specifics
    if (selectedModel === "peng-robinson") {
      vaporFraction *= 1.1; // Peng-Robinson tends to predict more vapor
    } else if (selectedModel === "nrtl") {
      vaporFraction *= 0.9; // NRTL may predict more liquid for certain systems
    }
    
    // Clamp between 0 and 1
    vaporFraction = Math.max(0, Math.min(1, vaporFraction));
    
    // Flash calculations
    const flashResults = {
      vaporFraction,
      liquid: {} as Record<string, number>,
      vapor: {} as Record<string, number>
    };
    
    // Distribute compounds between phases based on equilibrium constants
    let totalInVapor = 0;
    let totalInLiquid = 0;
    
    selectedCompounds.forEach(compound => {
      const K = equilibriumConstants[compound.id];
      const z = compound.composition / 100; // Mole fraction
      
      // Simplified flash calculation
      const x = z / (1 + vaporFraction * (K - 1)); // Liquid phase
      const y = K * x; // Vapor phase
      
      flashResults.liquid[compound.id] = x;
      flashResults.vapor[compound.id] = y;
      
      totalInLiquid += x;
      totalInVapor += y;
    });
    
    // Normalize to ensure sum = 1 in each phase
    Object.keys(flashResults.liquid).forEach(id => {
      flashResults.liquid[id] /= totalInLiquid;
    });
    
    Object.keys(flashResults.vapor).forEach(id => {
      flashResults.vapor[id] /= totalInVapor;
    });
    
    // Calculate overall thermodynamic properties
    const enthalpy = -10000 + temperature * 50; // Simplified calculation
    const entropy = Math.log(temperature) * 50; // Simplified calculation
    const gibbsFreeEnergy = enthalpy - temperature * entropy;
    
    // Calculate mixture properties
    const heatOfMixing = selectedCompounds.length > 1 ? -5000 + Math.random() * 2000 : 0;
    const entropyOfMixing = selectedCompounds.length > 1 ? 10 + Math.random() * 5 : 0;
    
    // Calculate bubble and dew points
    let bubblePoint = 0;
    let dewPoint = 0;
    
    if (selectedCompounds.length > 1) {
      // Simple estimation based on pure component boiling points and compositions
      const weightedBoilingPoint = selectedCompounds.reduce(
        (sum, compound) => sum + (compound.boilingPoint + 273.15) * (compound.composition / 100), 
        0
      );
      
      const minBoilingPoint = Math.min(...selectedCompounds.map(c => c.boilingPoint + 273.15));
      const maxBoilingPoint = Math.max(...selectedCompounds.map(c => c.boilingPoint + 273.15));
      
      bubblePoint = weightedBoilingPoint - 5; // Approximation
      dewPoint = weightedBoilingPoint + 10; // Approximation
      
      // Adjust for azeotropes if certain combinations exist
      if (
        (selectedCompounds.some(c => c.id === "ethanol") && selectedCompounds.some(c => c.id === "water")) ||
        (selectedCompounds.some(c => c.id === "acetone") && selectedCompounds.some(c => c.id === "methanol"))
      ) {
        // These form azeotropes
        bubblePoint = minBoilingPoint - 2;
        dewPoint = bubblePoint + 0.5; // Narrow range for azeotropes
      }
    } else if (selectedCompounds.length === 1) {
      // For pure components, bubble point = dew point = boiling point at given pressure
      const compound = selectedCompounds[0];
      const boilingPointAtPressure = compound.boilingPoint + 273.15 + (Math.log(pressure / 101.325) * 20);
      bubblePoint = boilingPointAtPressure;
      dewPoint = boilingPointAtPressure;
    }
    
    return {
      phaseDistribution: {
        vapor: vaporFraction * 100,
        liquid: (1 - vaporFraction) * 100,
        solid: 0 // Simplified - no solid phase considered
      },
      fugacityCoefficients,
      activityCoefficients,
      enthalpy,
      entropy,
      gibbsFreeEnergy,
      bubblePoint,
      dewPoint,
      equilibriumConstants,
      relativeVolatility,
      heatOfMixing,
      entropyOfMixing,
      flashResults
    };
  };
  
  // Generate data for charts based on calculation results
  const generateChartData = (results: SimulationResults) => {
    // Phase distribution data for pie chart
    const phaseDistributionData = [
      { name: 'Vapor', value: results.phaseDistribution.vapor },
      { name: 'Liquid', value: results.phaseDistribution.liquid },
      { name: 'Solid', value: results.phaseDistribution.solid }
    ].filter(item => item.value > 0);
    
    setPhaseData(phaseDistributionData);
    
    // Generate temperature-composition data
    if (useTemperatureRange && selectedCompounds.length > 1) {
      const tXYData = [];
      const temperatureStep = (temperatureRange[1] - temperatureRange[0]) / 20;
      
      for (let t = temperatureRange[0]; t <= temperatureRange[1]; t += temperatureStep) {
        const dataPoint: any = { temperature: t };
        
        // Simplified VLE calculation
        selectedCompounds.forEach(compound => {
          const vaporPressure = Math.exp(compound.antoineA - (compound.antoineB / (t + compound.antoineC)));
          const k = vaporPressure / pressure;
          
          // Simplified Raoult's Law for liquid phase
          dataPoint[`x_${compound.id}`] = compound.composition / 100 * (1 / (1 + (k - 1) * 0.5));
          
          // Simplified Raoult's Law for vapor phase
          dataPoint[`y_${compound.id}`] = k * dataPoint[`x_${compound.id}`];
        });
        
        tXYData.push(dataPoint);
      }
      
      setCompositionData(tXYData);
    }
    
    // Generate property data (e.g., enthalpy vs temperature)
    if (useTemperatureRange) {
      const propertyData = [];
      const temperatureStep = (temperatureRange[1] - temperatureRange[0]) / 20;
      
      for (let t = temperatureRange[0]; t <= temperatureRange[1]; t += temperatureStep) {
        // Simplified enthalpy and entropy calculation
        const enthalpyAtT = -10000 + t * 50;
        const entropyAtT = Math.log(t) * 50;
        const gibbsAtT = enthalpyAtT - t * entropyAtT;
        
        propertyData.push({
          temperature: t,
          enthalpy: enthalpyAtT,
          entropy: entropyAtT,
          gibbsFreeEnergy: gibbsAtT
        });
      }
      
      setPropertyData(propertyData);
    }
  };
  
  // Handle export to PDF or CSV
  const handleExport = (format: 'pdf' | 'csv') => {
    toast({
      title: `Export as ${format.toUpperCase()}`,
      description: "Your report is being generated...",
    });
    
    // Simulation of export functionality
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: `${simulationName} has been exported as ${format.toUpperCase()}.`,
      });
    }, 2000);
  };
  
  // Handle save simulation
  const handleSaveSimulation = () => {
    if (!results) {
      toast({
        title: "No results to save",
        description: "Please run a simulation first.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Saving simulation",
      description: "Your simulation data is being saved...",
    });
    
    // Save simulation to localStorage
    const simulationData = {
      name: simulationName,
      compounds: selectedCompounds,
      model: selectedModel,
      temperature,
      pressure,
      phaseSpecification,
      results,
      timestamp: new Date().toISOString()
    };
    
    try {
      // Get existing simulations
      const savedSimulationsJSON = localStorage.getItem('chemflow-simulations') || '[]';
      const savedSimulations = JSON.parse(savedSimulationsJSON);
      
      // Add new simulation with a unique ID
      const simulationWithId = {
        ...simulationData,
        id: `sim-${Date.now()}`
      };
      
      savedSimulations.push(simulationWithId);
      
      // Save back to localStorage
      localStorage.setItem('chemflow-simulations', JSON.stringify(savedSimulations));
      
      toast({
        title: "Simulation saved",
        description: `${simulationName} has been saved successfully.`,
      });
    } catch (error) {
      console.error("Error saving simulation:", error);
      toast({
        title: "Save failed",
        description: "There was an error saving your simulation.",
        variant: "destructive",
      });
    }
  };
  
  // Model information for tooltips
  const modelInfo = {
    "ideal-gas": "The Ideal Gas model assumes that gas molecules do not interact and that collisions are perfectly elastic. Suitable for gases at low pressures and high temperatures.",
    "raoults-law": "Raoult's Law assumes ideal behavior in the liquid phase. It's applicable for similar compounds (like different hydrocarbons) at low to moderate pressures.",
    "nrtl": "Non-Random Two-Liquid (NRTL) model accounts for non-ideality in liquid mixtures. Good for strongly non-ideal systems, including partially miscible liquids.",
    "peng-robinson": "Peng-Robinson equation of state works well for vapor-liquid equilibria, particularly for hydrocarbons and light gases at high pressures.",
    "srk": "Soave-Redlich-Kwong equation is good for vapor-liquid equilibria calculations at moderate pressures, especially for hydrocarbons."
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-1 py-8 px-4 lg:px-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
            <div>
              <h1 className="text-3xl font-display font-bold mb-2 dark:text-white">Intelligent Simulation</h1>
              <p className="text-gray-600 dark:text-gray-400">Build and run chemical process simulations with real-time results and visualizations</p>
            </div>
            
            <div className="mt-4 lg:mt-0 flex items-center gap-2">
              <Input
                type="text"
                placeholder="Simulation name"
                value={simulationName}
                onChange={(e) => setSimulationName(e.target.value)}
                className="max-w-[250px]"
              />
              
              <Button 
                variant="default" 
                className="flex gap-2 items-center"
                onClick={handleSaveSimulation}
              >
                <Save className="h-4 w-4" />
                Save
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="compound-selection" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5">
              <TabsTrigger value="compound-selection" className="flex items-center gap-2">
                <FlaskConical className="h-4 w-4" />
                <span className="hidden sm:inline">Compound Selection</span>
                <span className="sm:hidden">Compounds</span>
              </TabsTrigger>
              <TabsTrigger value="model-selection" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Thermodynamic Model</span>
                <span className="sm:hidden">Model</span>
              </TabsTrigger>
              <TabsTrigger value="conditions" className="flex items-center gap-2">
                <Thermometer className="h-4 w-4" />
                <span className="hidden sm:inline">Operating Conditions</span>
                <span className="sm:hidden">Conditions</span>
              </TabsTrigger>
              <TabsTrigger value="results" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Simulation Results</span>
                <span className="sm:hidden">Results</span>
              </TabsTrigger>
              <TabsTrigger value="export" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export & Reports</span>
                <span className="sm:hidden">Export</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="compound-selection" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm mt-4 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">Compound Database</h3>
                    <div className="flex gap-2 mb-4">
                      <Input 
                        type="text" 
                        placeholder="Search compounds..." 
                        className="flex-1"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        prefix={<Search className="h-4 w-4 text-gray-400" />}
                      />
                      <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>
                              {category === "all" ? "All Categories" : category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="h-[500px] overflow-y-auto border rounded-md p-2">
                      {filteredCompounds.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                          <SearchIcon className="h-12 w-12 mb-2 opacity-50" />
                          <p>No compounds found matching your search.</p>
                        </div>
                      ) : (
                        filteredCompounds.map(compound => (
                          <div 
                            key={compound.id}
                            className="p-3 border-b flex justify-between items-center hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer transition-colors rounded-md mb-1"
                            onClick={() => handleAddCompound(compound)}
                          >
                            <div>
                              <div className="font-medium">{compound.name}</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {compound.formula} | {compound.molecularWeight.toFixed(2)} g/mol
                              </div>
                              <div className="text-xs text-gray-500 flex items-center gap-1">
                                <span className={`w-2 h-2 rounded-full ${
                                  compound.phase === 'gas' ? 'bg-blue-500' :
                                  compound.phase === 'liquid' ? 'bg-green-500' : 'bg-gray-500'
                                }`}></span>
                                {compound.phase.charAt(0).toUpperCase() + compound.phase.slice(1)} | {compound.category}
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              title="Add compound to simulation"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="lg:col-span-2">
                  <h3 className="text-lg font-medium mb-3">Selected Compounds</h3>
                  {selectedCompounds.length === 0 ? (
                    <div className="border border-dashed rounded-md p-8 flex flex-col items-center justify-center text-gray-500">
                      <FlaskConical className="h-12 w-12 mb-4 opacity-50" />
                      <p className="text-center mb-2">No compounds selected yet.</p>
                      <p className="text-center text-sm">Search and select compounds from the database to begin your simulation.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {selectedCompounds.map(compound => (
                        <div 
                          key={compound.id}
                          className={`border rounded-md p-4 relative hover:shadow-md transition-shadow ${
                            activeCompoundDetails === compound.id ? 'ring-2 ring-blue-500' : ''
                          }`}
                          onClick={() => setActiveCompoundDetails(compound.id)}
                        >
                          <div className="absolute top-2 right-2 flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveCompound(compound.id);
                              }}
                              className="h-6 w-6 text-gray-400 hover:text-red-500"
                            >
                              <span className="sr-only">Remove</span>
                              <Minus className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <h4 className="font-medium">{compound.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{compound.formula}</p>
                          
                          <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                            <div>
                              <span className="text-gray-500">MW:</span> {compound.molecularWeight.toFixed(2)} g/mol
                            </div>
                            <div>
                              <span className="text-gray-500">BP:</span> {compound.boilingPoint}°C
                            </div>
                            <div>
                              <span className="text-gray-500">Tc:</span> {compound.criticalTemperature} K
                            </div>
                            <div>
                              <span className="text-gray-500">Pc:</span> {compound.criticalPressure} kPa
                            </div>
                          </div>
                          
                          <div className="mb-1 text-sm flex justify-between items-center">
                            <span>Composition:</span>
                            <span className="font-medium">{compound.composition.toFixed(1)}%</span>
                          </div>
                          
                          <Slider
                            value={[compound.composition]}
                            min={0}
                            max={100}
                            step={0.1}
                            onValueChange={(value) => handleUpdateComposition(compound.id, value[0])}
                            className="my-2"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {activeCompoundDetails && (
                    <div className="mt-4">
                      <ComponentDetailsPanel componentName={
                        selectedCompounds.find(c => c.id === activeCompoundDetails)?.name || ""
                      } />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button 
                  variant="default" 
                  className="flex items-center gap-2"
                  onClick={() => document.querySelector('[data-value="model-selection"]')?.click()}
                  disabled={selectedCompounds.length === 0}
                >
                  Next: Select Thermodynamic Model 
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="model-selection" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm mt-4 animate-fade-in">
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Select Thermodynamic Model</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Choose the most appropriate thermodynamic model for your system. The model will affect how properties and phase equilibria are calculated.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                  <ModelCard
                    id="ideal-gas"
                    name="Ideal Gas / Raoult's Law"
                    description="Simple model for ideal behavior. Good for dilute gas systems and similar liquid mixtures at low pressures."
                    selected={selectedModel === "ideal-gas"}
                    onSelect={setSelectedModel}
                    infoText={modelInfo["ideal-gas"]}
                    suitableFor={["Low pressure gases", "Dilute systems", "Similar molecules"]}
                  />
                  
                  <ModelCard
                    id="nrtl"
                    name="NRTL"
                    description="Non-Random Two-Liquid model for highly non-ideal liquid mixtures. Handles partial miscibility well."
                    selected={selectedModel === "nrtl"}
                    onSelect={setSelectedModel}
                    infoText={modelInfo["nrtl"]}
                    suitableFor={["Highly non-ideal systems", "Polar + non-polar mixtures", "Partially miscible liquids"]}
                  />
                  
                  <ModelCard
                    id="peng-robinson"
                    name="Peng-Robinson"
                    description="Equation of state for real gases and liquids at moderate to high pressures."
                    selected={selectedModel === "peng-robinson"}
                    onSelect={setSelectedModel}
                    infoText={modelInfo["peng-robinson"]}
                    suitableFor={["High pressure systems", "Hydrocarbon mixtures", "Near-critical regions"]}
                  />
                  
                  <ModelCard
                    id="srk"
                    name="Soave-Redlich-Kwong"
                    description="Modified Redlich-Kwong equation for better vapor pressure predictions."
                    selected={selectedModel === "srk"}
                    onSelect={setSelectedModel}
                    infoText={modelInfo["srk"]}
                    suitableFor={["Hydrocarbon processing", "Petroleum refining", "Natural gas systems"]}
                  />
                  
                  <ModelCard
                    id="uniquac"
                    name="UNIQUAC"
                    description="Universal Quasi-Chemical model for complex liquid mixtures with strong non-idealities."
                    selected={selectedModel === "uniquac"}
                    onSelect={setSelectedModel}
                    infoText="UNIQUAC (UNIversal QUAsi-Chemical) is suitable for strongly non-ideal liquid mixtures, especially when molecules have significant size differences."
                    suitableFor={["Strongly non-ideal mixtures", "Systems with size differences", "Polar compounds"]}
                  />
                  
                  <ModelCard
                    id="unifac"
                    name="UNIFAC"
                    description="Group contribution method for estimating activity coefficients when experimental data is unavailable."
                    selected={selectedModel === "unifac"}
                    onSelect={setSelectedModel}
                    infoText="UNIFAC uses functional group interactions to predict activity coefficients. Useful when no experimental data exists for a specific mixture."
                    suitableFor={["New compound mixtures", "Design exploration", "When experimental data is lacking"]}
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-between">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => document.querySelector('[data-value="compound-selection"]')?.click()}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back: Compound Selection
                </Button>
                
                <Button 
                  variant="default" 
                  className="flex items-center gap-2"
                  onClick={() => document.querySelector('[data-value="conditions"]')?.click()}
                  disabled={!selectedModel}
                >
                  Next: Set Operating Conditions
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="conditions" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm mt-4 animate-fade-in">
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Set Operating Conditions</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Define the temperature, pressure, and other operating parameters for your simulation.
                </p>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Thermometer className="h-5 w-5" />
                          Temperature
                        </CardTitle>
                        <CardDescription>
                          Set the operating temperature for your system
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="temp-range-toggle"
                              checked={useTemperatureRange}
                              onChange={() => setUseTemperatureRange(!useTemperatureRange)}
                              className="mr-2"
                            />
                            <label htmlFor="temp-range-toggle" className="text-sm">
                              Use temperature range
                            </label>
                          </div>
                          <div className="text-sm font-medium">
                            {useTemperatureRange 
                              ? `${temperatureRange[0]} - ${temperatureRange[1]} K` 
                              : `${temperature} K`
                            }
                          </div>
                        </div>
                        
                        {useTemperatureRange ? (
                          <div className="mt-4">
                            <div className="mb-4">
                              <label className="text-sm text-gray-600">Minimum Temperature (K)</label>
                              <div className="flex items-center mt-1">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => setTemperatureRange([Math.max(0, temperatureRange[0] - 5), temperatureRange[1]])}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <Input
                                  type="number"
                                  value={temperatureRange[0]}
                                  onChange={(e) => {
                                    const val = Number(e.target.value);
                                    if (!isNaN(val) && val >= 0) {
                                      setTemperatureRange([val, temperatureRange[1]]);
                                    }
                                  }}
                                  className="mx-2 text-center"
                                />
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => setTemperatureRange([temperatureRange[0] + 5, temperatureRange[1]])}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            
                            <div>
                              <label className="text-sm text-gray-600">Maximum Temperature (K)</label>
                              <div className="flex items-center mt-1">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => setTemperatureRange([temperatureRange[0], Math.max(temperatureRange[0], temperatureRange[1] - 5)])}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <Input
                                  type="number"
                                  value={temperatureRange[1]}
                                  onChange={(e) => {
                                    const val = Number(e.target.value);
                                    if (!isNaN(val) && val > temperatureRange[0]) {
                                      setTemperatureRange([temperatureRange[0], val]);
                                    }
                                  }}
                                  className="mx-2 text-center"
                                />
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => setTemperatureRange([temperatureRange[0], temperatureRange[1] + 5])}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-4">
                            <label className="text-sm text-gray-600">Temperature (K)</label>
                            <div className="flex items-center mt-1">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setTemperature(Math.max(0, temperature - 5))}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <Input
                                type="number"
                                value={temperature}
                                onChange={(e) => {
                                  const val = Number(e.target.value);
                                  if (!isNaN(val) && val >= 0) {
                                    setTemperature(val);
                                  }
                                }}
                                className="mx-2 text-center"
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setTemperature(temperature + 5)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            
                            <Slider
                              value={[temperature]}
                              min={200}
                              max={500}
                              step={1}
                              onValueChange={(value) => setTemperature(value[0])}
                              className="mt-2"
                            />
                            
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>200 K</span>
                              <span>500 K</span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    
                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Dices className="h-5 w-5" />
                          Phase Specification
                        </CardTitle>
                        <CardDescription>
                          Define the phase behavior for your simulation
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Select value={phaseSpecification} onValueChange={setPhaseSpecification}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select phase specification" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="vapor-liquid">Vapor-Liquid Equilibrium (VLE)</SelectItem>
                            <SelectItem value="liquid-liquid">Liquid-Liquid Equilibrium (LLE)</SelectItem>
                            <SelectItem value="vapor-liquid-liquid">Vapor-Liquid-Liquid Equilibrium (VLLE)</SelectItem>
                            <SelectItem value="solid-liquid">Solid-Liquid Equilibrium (SLE)</SelectItem>
                            <SelectItem value="flash">Flash Calculation</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <div className="mt-4">
                          <label className="text-sm text-gray-600">Flow Rate (mol/h)</label>
                          <div className="flex items-center mt-1">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setFlowRate(Math.max(1, flowRate - 10))}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Input
                              type="number"
                              value={flowRate}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                if (!isNaN(val) && val > 0) {
                                  setFlowRate(val);
                                }
                              }}
                              className="mx-2 text-center"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setFlowRate(flowRate + 10)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <BarChart3 className="h-5 w-5" />
                          Pressure
                        </CardTitle>
                        <CardDescription>
                          Set the operating pressure for your system
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="pressure-range-toggle"
                              checked={usePressureRange}
                              onChange={() => setUsePressureRange(!usePressureRange)}
                              className="mr-2"
                            />
                            <label htmlFor="pressure-range-toggle" className="text-sm">
                              Use pressure range
                            </label>
                          </div>
                          <div className="text-sm font-medium">
                            {usePressureRange 
                              ? `${pressureRange[0]} - ${pressureRange[1]} kPa` 
                              : `${pressure} kPa`
                            }
                          </div>
                        </div>
                        
                        {usePressureRange ? (
                          <div className="mt-4">
                            <div className="mb-4">
                              <label className="text-sm text-gray-600">Minimum Pressure (kPa)</label>
                              <div className="flex items-center mt-1">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => setPressureRange([Math.max(1, pressureRange[0] - 50), pressureRange[1]])}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <Input
                                  type="number"
                                  value={pressureRange[0]}
                                  onChange={(e) => {
                                    const val = Number(e.target.value);
                                    if (!isNaN(val) && val > 0) {
                                      setPressureRange([val, pressureRange[1]]);
                                    }
                                  }}
                                  className="mx-2 text-center"
                                />
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => setPressureRange([pressureRange[0] + 50, pressureRange[1]])}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            
                            <div>
                              <label className="text-sm text-gray-600">Maximum Pressure (kPa)</label>
                              <div className="flex items-center mt-1">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => setPressureRange([pressureRange[0], Math.max(pressureRange[0], pressureRange[1] - 50)])}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <Input
                                  type="number"
                                  value={pressureRange[1]}
                                  onChange={(e) => {
                                    const val = Number(e.target.value);
                                    if (!isNaN(val) && val > pressureRange[0]) {
                                      setPressureRange([pressureRange[0], val]);
                                    }
                                  }}
                                  className="mx-2 text-center"
                                />
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => setPressureRange([pressureRange[0], pressureRange[1] + 50])}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-4">
                            <label className="text-sm text-gray-600">Pressure (kPa)</label>
                            <div className="flex items-center mt-1">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setPressure(Math.max(1, pressure - 50))}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <Input
                                type="number"
                                value={pressure}
                                onChange={(e) => {
                                  const val = Number(e.target.value);
                                  if (!isNaN(val) && val > 0) {
                                    setPressure(val);
                                  }
                                }}
                                className="mx-2 text-center"
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setPressure(pressure + 50)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            
                            <Slider
                              value={[pressure]}
                              min={1}
                              max={5000}
                              step={10}
                              onValueChange={(value) => setPressure(value[0])}
                              className="mt-2"
                            />
                            
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>1 kPa</span>
                              <span>5000 kPa</span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    
                    <div className="mt-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Play className="h-5 w-5" />
                            Run Simulation
                          </CardTitle>
                          <CardDescription>
                            Calculate thermodynamic properties with your selected settings
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md mb-4">
                            <div className="text-sm font-medium mb-2">Simulation Summary</div>
                            <div className="text-sm">
                              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                <div><span className="text-gray-500">Components:</span></div>
                                <div>{selectedCompounds.length}</div>
                                
                                <div><span className="text-gray-500">Thermodynamic Model:</span></div>
                                <div>{selectedModel}</div>
                                
                                <div><span className="text-gray-500">Temperature:</span></div>
                                <div>
                                  {useTemperatureRange 
                                    ? `${temperatureRange[0]} - ${temperatureRange[1]} K` 
                                    : `${temperature} K`
                                  }
                                </div>
                                
                                <div><span className="text-gray-500">Pressure:</span></div>
                                <div>
                                  {usePressureRange 
                                    ? `${pressureRange[0]} - ${pressureRange[1]} kPa` 
                                    : `${pressure} kPa`
                                  }
                                </div>
                                
                                <div><span className="text-gray-500">Phase Specification:</span></div>
                                <div>{phaseSpecification}</div>
                              </div>
                            </div>
                          </div>
                          
                          <Button 
                            className="w-full flex items-center justify-center gap-2"
                            onClick={performCalculations}
                            disabled={calculationInProgress || selectedCompounds.length === 0}
                          >
                            {calculationInProgress ? "Calculating..." : "Run Simulation"}
                            <Play className="h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-between">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => document.querySelector('[data-value="model-selection"]')?.click()}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back: Thermodynamic Model
                </Button>
                
                <Button 
                  variant="default" 
                  className="flex items-center gap-2"
                  onClick={() => {
                    if (!results) {
                      performCalculations();
                    }
                    document.querySelector('[data-value="results"]')?.click();
                  }}
                >
                  Next: View Results
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="results" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm mt-4 animate-fade-in">
              {!results ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-4 mb-4">
                    <BarChart3 className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No Results Yet</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
                    Run a simulation to see the thermodynamic calculation results here.
                  </p>
                  <Button 
                    variant="default"
                    onClick={() => {
                      document.querySelector('[data-value="conditions"]')?.click();
                    }}
                  >
                    Go to Simulation Setup
                  </Button>
                </div>
              ) : (
                <div ref={chartRef}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Simulation Results</h3>
                    {lastCalculationTime && (
                      <div className="text-sm text-gray-500">
                        Last calculated: {lastCalculationTime.toLocaleTimeString()}
                      </div>
                    )}
                  </div>
                  
                  {(warnings.length > 0 || suggestions.length > 0) && (
                    <div className="mb-6">
                      {warnings.length > 0 && (
                        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-3">
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <AlertTriangle className="h-5 w-5 text-amber-500" />
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-amber-800">Warnings</h3>
                              <ul className="mt-2 text-sm text-amber-700 list-disc list-inside">
                                {warnings.map((warning, index) => (
                                  <li key={index}>{warning}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {suggestions.length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <Info className="h-5 w-5 text-blue-500" />
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-blue-800">Suggestions</h3>
                              <ul className="mt-2 text-sm text-blue-700 list-disc list-inside">
                                {suggestions.map((suggestion, index) => (
                                  <li key={index}>{suggestion}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Phase Distribution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={phaseData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }} />
                              <RechartsTooltip formatter={(value) => [`${value.toFixed(2)}%`, 'Percentage']} />
                              <Bar dataKey="value" fill="#8884d8" name="Percentage" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 mt-4">
                          <div className="text-center p-2 bg-blue-50 dark:bg-blue-900 rounded-md">
                            <div className="text-xs text-gray-500 dark:text-gray-400">Vapor</div>
                            <div className="font-medium">{results.phaseDistribution.vapor.toFixed(2)}%</div>
                          </div>
                          <div className="text-center p-2 bg-green-50 dark:bg-green-900 rounded-md">
                            <div className="text-xs text-gray-500 dark:text-gray-400">Liquid</div>
                            <div className="font-medium">{results.phaseDistribution.liquid.toFixed(2)}%</div>
                          </div>
                          <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                            <div className="text-xs text-gray-500 dark:text-gray-400">Solid</div>
                            <div className="font-medium">{results.phaseDistribution.solid.toFixed(2)}%</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Thermodynamic Properties</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                            <div className="text-xs text-gray-500 dark:text-gray-400">Enthalpy</div>
                            <div className="font-medium">{results.enthalpy.toFixed(2)} kJ/mol</div>
                          </div>
                          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                            <div className="text-xs text-gray-500 dark:text-gray-400">Entropy</div>
                            <div className="font-medium">{results.entropy.toFixed(4)} kJ/(mol·K)</div>
                          </div>
                          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                            <div className="text-xs text-gray-500 dark:text-gray-400">Gibbs Free Energy</div>
                            <div className="font-medium">{results.gibbsFreeEnergy.toFixed(2)} kJ/mol</div>
                          </div>
                          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                            <div className="text-xs text-gray-500 dark:text-gray-400">Heat of Mixing</div>
                            <div className="font-medium">{results.heatOfMixing.toFixed(2)} kJ/mol</div>
                          </div>
                          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                            <div className="text-xs text-gray-500 dark:text-gray-400">Bubble Point</div>
                            <div className="font-medium">{results.bubblePoint.toFixed(2)} K</div>
                          </div>
                          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                            <div className="text-xs text-gray-500 dark:text-gray-400">Dew Point</div>
                            <div className="font-medium">{results.dewPoint.toFixed(2)} K</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6 mb-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Component-Specific Properties</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-2 px-3">Component</th>
                                <th className="text-center py-2 px-3">Fugacity Coefficient</th>
                                <th className="text-center py-2 px-3">Activity Coefficient</th>
                                <th className="text-center py-2 px-3">Equilibrium Constant (K)</th>
                                <th className="text-center py-2 px-3">Relative Volatility</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedCompounds.map(compound => (
                                <tr key={compound.id} className="border-b">
                                  <td className="py-2 px-3 font-medium">{compound.name}</td>
                                  <td className="text-center py-2 px-3">{results.fugacityCoefficients[compound.id]?.toFixed(4) || "N/A"}</td>
                                  <td className="text-center py-2 px-3">{results.activityCoefficients[compound.id]?.toFixed(4) || "N/A"}</td>
                                  <td className="text-center py-2 px-3">{results.equilibriumConstants[compound.id]?.toFixed(4) || "N/A"}</td>
                                  <td className="text-center py-2 px-3">{results.relativeVolatility[compound.id]?.toFixed(4) || "N/A"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {results.flashResults && (
                    <div className="grid grid-cols-1 gap-6 mb-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Flash Calculation Results</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md mb-4">
                            <div className="text-sm font-medium">Vapor Fraction: {(results.flashResults.vaporFraction * 100).toFixed(2)}%</div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-medium mb-2">Liquid Phase Composition</h4>
                              <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr className="border-b">
                                      <th className="text-left py-2 px-3">Component</th>
                                      <th className="text-center py-2 px-3">Mole Fraction</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {Object.entries(results.flashResults.liquid).map(([id, fraction]) => {
                                      const compound = selectedCompounds.find(c => c.id === id);
                                      return (
                                        <tr key={id} className="border-b">
                                          <td className="py-2 px-3">{compound?.name || id}</td>
                                          <td className="text-center py-2 px-3">{fraction.toFixed(4)}</td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-medium mb-2">Vapor Phase Composition</h4>
                              <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr className="border-b">
                                      <th className="text-left py-2 px-3">Component</th>
                                      <th className="text-center py-2 px-3">Mole Fraction</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {Object.entries(results.flashResults.vapor).map(([id, fraction]) => {
                                      const compound = selectedCompounds.find(c => c.id === id);
                                      return (
                                        <tr key={id} className="border-b">
                                          <td className="py-2 px-3">{compound?.name || id}</td>
                                          <td className="text-center py-2 px-3">{fraction.toFixed(4)}</td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                  
                  {useTemperatureRange && propertyData.length > 0 && (
                    <div className="grid grid-cols-1 gap-6 mb-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Property vs. Temperature</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={propertyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="temperature" label={{ value: 'Temperature (K)', position: 'insideBottom', offset: -5 }} />
                                <YAxis />
                                <RechartsTooltip />
                                <Legend />
                                <Line type="monotone" dataKey="enthalpy" stroke="#8884d8" name="Enthalpy (kJ/mol)" />
                                <Line type="monotone" dataKey="entropy" stroke="#82ca9d" name="Entropy (kJ/mol·K)" strokeDasharray="5 5" />
                                <Line type="monotone" dataKey="gibbsFreeEnergy" stroke="#ff7300" name="Gibbs Energy (kJ/mol)" />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                  
                  {useTemperatureRange && compositionData.length > 0 && selectedCompounds.length > 1 && (
                    <div className="grid grid-cols-1 gap-6 mb-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Temperature-Composition (T-x-y) Diagram</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <ScatterChart>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis 
                                  dataKey="temperature" 
                                  name="Temperature" 
                                  label={{ value: 'Temperature (K)', position: 'insideBottom', offset: -5 }} 
                                />
                                <YAxis 
                                  dataKey={(entry) => {
                                    const id = selectedCompounds[0]?.id;
                                    return id ? entry[`x_${id}`] : 0;
                                  }}
                                  name="Mole Fraction" 
                                  label={{ value: 'Mole Fraction', angle: -90, position: 'insideLeft' }} 
                                />
                                <ZAxis range={[60, 60]} />
                                <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} />
                                <Legend />
                                {selectedCompounds.map((compound, index) => {
                                  const colors = ['#8884d8', '#82ca9d', '#ff7300', '#0088fe'];
                                  return (
                                    <React.Fragment key={compound.id}>
                                      <Scatter 
                                        name={`${compound.name} (Liquid)`} 
                                        data={compositionData} 
                                        fill={colors[index % colors.length]} 
                                        line={{ stroke: colors[index % colors.length] }}
                                        shape="circle"
                                        dataKey={(entry) => ({ 
                                          x: entry.temperature, 
                                          y: entry[`x_${compound.id}`] || 0 
                                        })}
                                      />
                                      <Scatter 
                                        name={`${compound.name} (Vapor)`} 
                                        data={compositionData} 
                                        fill="none"
                                        line={{ stroke: colors[index % colors.length], strokeDasharray: '5 5' }}
                                        shape="diamond"
                                        dataKey={(entry) => ({ 
                                          x: entry.temperature, 
                                          y: entry[`y_${compound.id}`] || 0 
                                        })}
                                      />
                                    </React.Fragment>
                                  );
                                })}
                              </ScatterChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                  
                  <div className="flex justify-center space-x-4">
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={() => document.querySelector('[data-value="conditions"]')?.click()}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Modify Parameters
                    </Button>
                    
                    <Button 
                      variant="default" 
                      className="flex items-center gap-2"
                      onClick={performCalculations}
                    >
                      <Play className="h-4 w-4" />
                      Recalculate
                    </Button>
                    
                    <Button 
                      variant="default" 
                      className="flex items-center gap-2"
                      onClick={() => document.querySelector('[data-value="export"]')?.click()}
                    >
                      Export Results
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="export" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm mt-4 animate-fade-in">
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Export & Reports</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Save your simulation results or generate comprehensive reports.
                </p>
                
                {!results ? (
                  <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-4 mb-4">
                      <Download className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">No Results to Export</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
                      Run a simulation first to generate results that you can export or save.
                    </p>
                    <Button 
                      variant="default"
                      onClick={() => {
                        document.querySelector('[data-value="conditions"]')?.click();
                      }}
                    >
                      Go to Simulation Setup
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Download className="h-5 w-5" />
                          Export as PDF
                        </CardTitle>
                        <CardDescription>
                          Generate a comprehensive PDF report
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                          The PDF report will include:
                          <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Simulation parameters</li>
                            <li>Component properties</li>
                            <li>Key results and charts</li>
                            <li>Thermodynamic analysis</li>
                          </ul>
                        </div>
                        <Button 
                          className="w-full"
                          onClick={() => handleExport('pdf')}
                        >
                          Generate PDF Report
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          Export Raw Data (CSV)
                        </CardTitle>
                        <CardDescription>
                          Export results as spreadsheet-compatible CSV files
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                          Data export options:
                          <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Component properties</li>
                            <li>Phase equilibrium data</li>
                            <li>Temperature-dependent properties</li>
                            <li>Flash calculation results</li>
                          </ul>
                        </div>
                        <Button 
                          className="w-full"
                          onClick={() => handleExport('csv')}
                        >
                          Export to CSV
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Save className="h-5 w-5" />
                          Save Simulation
                        </CardTitle>
                        <CardDescription>
                          Save your simulation to access it later
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Simulation Name
                          </label>
                          <Input 
                            value={simulationName}
                            onChange={(e) => setSimulationName(e.target.value)}
                            className="mb-4"
                            placeholder="Enter a descriptive name"
                          />
                        </div>
                        <Button 
                          className="w-full"
                          onClick={handleSaveSimulation}
                        >
                          Save Simulation
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-start">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => document.querySelector('[data-value="results"]')?.click()}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Results
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

// Helper Components
const SearchIcon = Search;

interface ModelCardProps {
  id: string;
  name: string;
  description: string;
  selected: boolean;
  onSelect: (id: string) => void;
  infoText: string;
  suitableFor: string[];
}

const ModelCard: React.FC<ModelCardProps> = ({
  id,
  name,
  description,
  selected,
  onSelect,
  infoText,
  suitableFor
}) => {
  return (
    <div
      className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
        selected
          ? 'ring-2 ring-blue-500 shadow-md bg-blue-50 dark:bg-blue-900/30'
          : 'hover:border-blue-300 hover:shadow-sm'
      }`}
      onClick={() => onSelect(id)}
    >
      <div className="flex justify-between mb-2">
        <h4 className="font-medium">{name}</h4>
        {selected && <Check className="h-5 w-5 text-blue-500" />}
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{description}</p>
      
      <div className="mt-2">
        <div className="text-xs text-gray-500 mb-1">Best suited for:</div>
        <div className="flex flex-wrap gap-1">
          {suitableFor.map((item, index) => (
            <span key={index} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
              {item}
            </span>
          ))}
        </div>
      </div>
      
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="link" size="sm" className="text-xs p-0 h-auto mt-2 text-blue-600">
            Learn More
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{name} Thermodynamic Model</DialogTitle>
            <DialogDescription>
              Detailed information about the {name} model and its applications
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm mb-4">{infoText}</p>
            
            <h4 className="text-sm font-medium mb-2">Best Applications:</h4>
            <ul className="list-disc list-inside text-sm space-y-1 mb-4">
              {suitableFor.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            
            <h4 className="text-sm font-medium mb-2">Mathematical Form:</h4>
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded text-sm font-mono">
              {id === 'peng-robinson' && (
                <span>P = RT/(V-b) - a(T)/(V(V+b)+b(V-b))</span>
              )}
              {id === 'srk' && (
                <span>P = RT/(V-b) - a(T)/(V(V+b))</span>
              )}
              {id === 'nrtl' && (
                <span>ln(γᵢ) = xⱼ² [τⱼᵢ Gⱼᵢ / (xᵢ + xⱼGⱼᵢ)² + τᵢⱼGᵢⱼ / (xⱼ + xᵢGᵢⱼ)²]</span>
              )}
              {id === 'ideal-gas' && (
                <span>PV = nRT</span>
              )}
              {id === 'uniquac' && (
                <span>ln(γᵢ) = ln(γᵢᶜ) + ln(γᵢᴿ)</span>
              )}
              {id === 'unifac' && (
                <span>ln(γᵢ) = ln(γᵢᶜ) + ln(γᵢᴿ)</span>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => onSelect(id)}>
              {selected ? 'Model Selected' : 'Select This Model'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IntelligentSimulation;
