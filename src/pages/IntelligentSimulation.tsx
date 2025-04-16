
import React, { useState, useRef, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import { 
  Search, 
  Info, 
  ChevronDown, 
  Thermometer, 
  Gauge, 
  Beaker, 
  Percent, 
  ArrowLeftRight, 
  FileDown, 
  ChevronLeft,
  ChevronRight,
  FileText as FileTextIcon,
  DownloadCloud
} from "lucide-react";
import {
  Area,
  AreaChart,
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Types for our chemical compounds
type Compound = {
  id: string;
  name: string;
  formula: string;
  molecularWeight: number;
  boilingPoint: number;
  criticalTemperature: number;
  criticalPressure: number;
  phase: 'Gas' | 'Liquid' | 'Solid';
  hazards: string[];
  enthalpyOfFormation: number;
  heatCapacityCoefficients: {
    a: number;
    b: number;
    c: number;
    d: number;
    e: number;
  };
  antoineConstants: {
    a: number;
    b: number;
    c: number;
  };
  latentHeat: number;
  viscosity: number;
  density: number;
  dielectricConstant: number;
  category: string[];
};

// Types for thermodynamic models
type ThermodynamicModel = {
  id: string;
  name: string;
  description: string;
  applicability: string[];
  limitations: string[];
};

// Sample compound data
const compounds: Compound[] = [
  {
    id: "c1",
    name: "Water",
    formula: "H₂O",
    molecularWeight: 18.02,
    boilingPoint: 100,
    criticalTemperature: 374.0,
    criticalPressure: 22.1,
    phase: "Liquid",
    hazards: [],
    enthalpyOfFormation: -285.8,
    heatCapacityCoefficients: {
      a: 30.09,
      b: 6.83,
      c: 6.79,
      d: -2.53,
      e: 0.08,
    },
    antoineConstants: {
      a: 8.07,
      b: 1730.63,
      c: 233.43,
    },
    latentHeat: 40.68,
    viscosity: 0.89,
    density: 997,
    dielectricConstant: 80.1,
    category: ["Polar", "Inorganic", "Universal solvent"],
  },
  {
    id: "c2",
    name: "Ethanol",
    formula: "C₂H₅OH",
    molecularWeight: 46.07,
    boilingPoint: 78.3,
    criticalTemperature: 241.0,
    criticalPressure: 6.3,
    phase: "Liquid",
    hazards: ["Flammable"],
    enthalpyOfFormation: -277.6,
    heatCapacityCoefficients: {
      a: 9.00,
      b: 21.15,
      c: -8.39,
      d: 1.37,
      e: -0.03,
    },
    antoineConstants: {
      a: 8.20,
      b: 1642.89,
      c: 230.30,
    },
    latentHeat: 38.56,
    viscosity: 1.07,
    density: 789,
    dielectricConstant: 24.5,
    category: ["Alcohol", "Organic", "Solvent"],
  },
  {
    id: "c3",
    name: "Methane",
    formula: "CH₄",
    molecularWeight: 16.04,
    boilingPoint: -161.5,
    criticalTemperature: -82.6,
    criticalPressure: 4.6,
    phase: "Gas",
    hazards: ["Flammable", "Explosive"],
    enthalpyOfFormation: -74.8,
    heatCapacityCoefficients: {
      a: 19.89,
      b: 5.02,
      c: 1.27,
      d: -11.00,
      e: 0.01,
    },
    antoineConstants: {
      a: 6.70,
      b: 405.42,
      c: 267.78,
    },
    latentHeat: 8.17,
    viscosity: 0.01,
    density: 0.72,
    dielectricConstant: 1.0,
    category: ["Hydrocarbon", "Alkane", "Natural gas"],
  },
  {
    id: "c4",
    name: "Benzene",
    formula: "C₆H₆",
    molecularWeight: 78.11,
    boilingPoint: 80.1,
    criticalTemperature: 288.9,
    criticalPressure: 4.9,
    phase: "Liquid",
    hazards: ["Toxic", "Carcinogenic", "Flammable"],
    enthalpyOfFormation: 82.9,
    heatCapacityCoefficients: {
      a: -36.73,
      b: 47.89,
      c: -31.86,
      d: 8.76,
      e: -0.05,
    },
    antoineConstants: {
      a: 6.90,
      b: 1211.03,
      c: 220.79,
    },
    latentHeat: 30.8,
    viscosity: 0.65,
    density: 877,
    dielectricConstant: 2.3,
    category: ["Aromatic", "Organic", "Solvent"],
  },
  {
    id: "c5",
    name: "Carbon Dioxide",
    formula: "CO₂",
    molecularWeight: 44.01,
    boilingPoint: -78.5,
    criticalTemperature: 31.1,
    criticalPressure: 7.4,
    phase: "Gas",
    hazards: ["Asphyxiant"],
    enthalpyOfFormation: -393.5,
    heatCapacityCoefficients: {
      a: 27.43,
      b: 4.23,
      c: -1.96,
      d: 0.39,
      e: -0.02,
    },
    antoineConstants: {
      a: 9.81,
      b: 1347.79,
      c: 273.00,
    },
    latentHeat: 15.33,
    viscosity: 0.015,
    density: 1.98,
    dielectricConstant: 1.0,
    category: ["Inorganic", "Greenhouse gas"],
  },
  {
    id: "c6",
    name: "Acetone",
    formula: "C₃H₆O",
    molecularWeight: 58.08,
    boilingPoint: 56.1,
    criticalTemperature: 235.0,
    criticalPressure: 4.8,
    phase: "Liquid",
    hazards: ["Flammable", "Irritant"],
    enthalpyOfFormation: -248.1,
    heatCapacityCoefficients: {
      a: 6.30,
      b: 26.06,
      c: -16.53,
      d: 4.48,
      e: -0.03,
    },
    antoineConstants: {
      a: 7.02,
      b: 1161.00,
      c: 224.00,
    },
    latentHeat: 29.1,
    viscosity: 0.31,
    density: 784,
    dielectricConstant: 20.7,
    category: ["Ketone", "Organic", "Solvent"],
  },
  {
    id: "c7",
    name: "Hydrogen",
    formula: "H₂",
    molecularWeight: 2.02,
    boilingPoint: -252.9,
    criticalTemperature: -240.0,
    criticalPressure: 1.3,
    phase: "Gas",
    hazards: ["Flammable", "Explosive"],
    enthalpyOfFormation: 0,
    heatCapacityCoefficients: {
      a: 33.07,
      b: -11.36,
      c: 11.43,
      d: -2.77,
      e: -0.16,
    },
    antoineConstants: {
      a: 3.54,
      b: 99.40,
      c: 7.70,
    },
    latentHeat: 0.90,
    viscosity: 0.009,
    density: 0.09,
    dielectricConstant: 1.0,
    category: ["Hydrogen", "Element", "Fuel"],
  },
];

// Thermodynamic models
const thermodynamicModels: ThermodynamicModel[] = [
  {
    id: "model1",
    name: "Ideal Gas",
    description: "Basic model for gas phase behavior at low pressures and high temperatures",
    applicability: ["Simple gas systems", "Low pressure", "High temperature"],
    limitations: ["Not suitable for real gases at high pressures", "No intermolecular forces considered"],
  },
  {
    id: "model2",
    name: "Raoult's Law",
    description: "Model for ideal liquid solutions where components follow ideal behavior",
    applicability: ["Similar chemical structures", "Similar molecular sizes", "Non-polar mixtures"],
    limitations: ["Not applicable to strongly non-ideal mixtures", "Fails for polar/non-polar mixtures"],
  },
  {
    id: "model3",
    name: "NRTL",
    description: "Non-Random Two-Liquid model for highly non-ideal liquid mixtures",
    applicability: ["Highly non-ideal systems", "Partially miscible liquids", "VLE, LLE calculations"],
    limitations: ["Requires binary interaction parameters", "Computationally more intensive"],
  },
  {
    id: "model4",
    name: "Peng-Robinson",
    description: "Cubic equation of state for real gas and liquid phase behavior",
    applicability: ["Hydrocarbon processing", "Natural gas systems", "High pressure applications"],
    limitations: ["Less accurate for hydrogen bonding compounds", "Limited for highly polar systems"],
  },
  {
    id: "model5",
    name: "UNIQUAC",
    description: "UNIversal QUAsiChemical model for liquid phase activity coefficients",
    applicability: ["Strong non-ideal mixtures", "Phase equilibria calculations", "Wide temperature ranges"],
    limitations: ["Requires binary parameters", "Complex parameter estimation"],
  },
  {
    id: "model6",
    name: "Soave-Redlich-Kwong",
    description: "Modified Redlich-Kwong equation of state with temperature dependence",
    applicability: ["Vapor pressure calculations", "Oil and gas processes", "Supercritical extraction"],
    limitations: ["Less accurate near critical point", "Limited for highly polar compounds"],
  },
  {
    id: "model7",
    name: "UNIFAC",
    description: "UNIQUAC Functional-group Activity Coefficients predictive model",
    applicability: ["Prediction without experimental data", "Wide range of mixtures", "Process design"],
    limitations: ["Limited database of interaction parameters", "Group contribution approximations"],
  },
];

// Sample calculations result data for charts
const generatePhaseData = (temperature: number, selectedCompounds: Compound[]) => {
  const data = [];
  const baseTemp = temperature || 25;
  
  for (let i = 0; i <= 10; i++) {
    const composition = i / 10;
    const vapor = Math.min(100, Math.max(0, 20 + 70 * composition + (baseTemp - 25) * 0.8));
    const liquid = Math.min(100, Math.max(0, 100 - vapor));
    
    data.push({
      composition: i * 10,
      vapor,
      liquid,
    });
  }
  
  return data;
};

const generateActivityCoeffData = (temperature: number, pressure: number) => {
  const data = [];
  const baseTemp = temperature || 25;
  const basePress = pressure || 1;
  
  for (let i = 0; i <= 10; i++) {
    const x = i / 10;
    const component1 = Math.exp(0.5 * x * x + (baseTemp - 25) * 0.01);
    const component2 = Math.exp(0.3 * (1 - x) * (1 - x) + (basePress - 1) * 0.02);
    
    data.push({
      moleFraction: i * 10,
      component1,
      component2,
    });
  }
  
  return data;
};

const generateEnthalpyData = (temperature: number, pressure: number) => {
  const data = [];
  const baseTemp = temperature || 25;
  const basePress = pressure || 1;
  
  for (let i = 0; i <= 10; i++) {
    const x = i / 10;
    const enthalpy = -10 - 25 * x + x * x * 20 + (baseTemp - 25) * 0.5 + (basePress - 1) * 0.1;
    const entropy = 50 + 20 * x - x * x * 10 + (baseTemp - 25) * 0.2;
    const gibbs = enthalpy - (baseTemp + 273.15) * (entropy / 1000);
    
    data.push({
      composition: i * 10,
      enthalpy,
      entropy: entropy / 10,
      gibbs,
    });
  }
  
  return data;
};

const IntelligentSimulation = () => {
  // State for selected compounds
  const [selectedCompounds, setSelectedCompounds] = useState<Compound[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModel, setSelectedModel] = useState<ThermodynamicModel | null>(null);
  
  // State for operating conditions
  const [temperature, setTemperature] = useState<number>(25);
  const [pressure, setPressure] = useState<number>(1);
  const [composition, setComposition] = useState<number[]>([50, 50]);
  
  // Step tracking
  const [currentStep, setCurrentStep] = useState<number>(1);
  
  // Filtered compounds based on search
  const filteredCompounds = compounds.filter(
    compound =>
      compound.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      compound.formula.toLowerCase().includes(searchTerm.toLowerCase()) ||
      compound.category.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Function to toggle compound selection
  const toggleCompoundSelection = (compound: Compound) => {
    if (selectedCompounds.some(c => c.id === compound.id)) {
      setSelectedCompounds(selectedCompounds.filter(c => c.id !== compound.id));
    } else {
      // Only allow 2 compounds for simplicity in this demo
      if (selectedCompounds.length < 2) {
        setSelectedCompounds([...selectedCompounds, compound]);
      } else {
        // Replace the last selected compound
        const updatedCompounds = [...selectedCompounds];
        updatedCompounds[updatedCompounds.length - 1] = compound;
        setSelectedCompounds(updatedCompounds);
      }
    }
  };
  
  // Chart data for results (simulated)
  const phaseData = generatePhaseData(temperature, selectedCompounds);
  const activityCoeffData = generateActivityCoeffData(temperature, pressure);
  const enthalpyData = generateEnthalpyData(temperature, pressure);

  // Function to handle next step
  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };
  
  // Function to handle previous step
  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };
  
  // Function to update composition (ensuring they sum to 100%)
  const updateComposition = (index: number, value: number) => {
    const newComposition = [...composition];
    newComposition[index] = value;
    
    // Adjust other component to maintain 100% total
    if (newComposition.length === 2) {
      newComposition[1 - index] = 100 - value;
    }
    
    setComposition(newComposition);
  };
  
  // Function to simulate export to PDF
  const exportToPDF = () => {
    console.log("Exporting to PDF...");
    // In a real implementation, this would use a library like jsPDF
    alert("Report downloaded as ChemFlow_Simulation_Report.pdf");
  };
  
  // Determine if we can proceed to the next step
  const canProceedToModel = selectedCompounds.length > 0;
  const canProceedToConditions = selectedModel !== null;
  const canProceedToResults = temperature > 0 && pressure > 0;
  
  // Refs for scrolling to sections
  const compoundSectionRef = useRef<HTMLDivElement>(null);
  const modelSectionRef = useRef<HTMLDivElement>(null);
  const conditionsSectionRef = useRef<HTMLDivElement>(null);
  const resultsSectionRef = useRef<HTMLDivElement>(null);
  
  // Effect to scroll to the appropriate section when step changes
  useEffect(() => {
    const scrollToRef = (ref: React.RefObject<HTMLDivElement>) => {
      if (ref.current) {
        ref.current.scrollIntoView({ behavior: "smooth" });
      }
    };
    
    switch (currentStep) {
      case 1:
        scrollToRef(compoundSectionRef);
        break;
      case 2:
        scrollToRef(modelSectionRef);
        break;
      case 3:
        scrollToRef(conditionsSectionRef);
        break;
      case 4:
        scrollToRef(resultsSectionRef);
        break;
      default:
        break;
    }
  }, [currentStep]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-1 py-8 px-4 md:px-6 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold mb-2 dark:text-white">
              Intelligent Simulation
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Build a chemical process simulation with real-time analysis and results
            </p>
          </div>
          
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              {[1, 2, 3, 4].map((step) => (
                <div 
                  key={step}
                  className="flex flex-col items-center"
                  onClick={() => {
                    if (
                      (step === 2 && canProceedToModel) ||
                      (step === 3 && canProceedToConditions) ||
                      (step === 4 && canProceedToResults) ||
                      step < currentStep
                    ) {
                      setCurrentStep(step);
                    }
                  }}
                >
                  <div 
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center border-2 cursor-pointer",
                      step === currentStep
                        ? "bg-blue-600 border-blue-600 text-white"
                        : step < currentStep
                        ? "bg-green-500 border-green-500 text-white"
                        : "bg-white border-gray-300 text-gray-500 dark:bg-gray-800 dark:border-gray-600"
                    )}
                  >
                    {step < currentStep ? (
                      "✓"
                    ) : (
                      step
                    )}
                  </div>
                  <span 
                    className={cn(
                      "text-xs mt-2",
                      step === currentStep
                        ? "text-blue-600 font-medium"
                        : step < currentStep
                        ? "text-green-500"
                        : "text-gray-500 dark:text-gray-400"
                    )}
                  >
                    {step === 1 && "Compounds"}
                    {step === 2 && "Model"}
                    {step === 3 && "Conditions"}
                    {step === 4 && "Results"}
                  </span>
                </div>
              ))}
              
              {/* Connecting lines */}
              <div className="absolute left-0 right-0 flex justify-center">
                <div className="h-0.5 w-2/3 bg-gray-200 dark:bg-gray-700 absolute top-5 -z-10"></div>
              </div>
            </div>
          </div>
          
          {/* Step 1: Compound Selection */}
          <div 
            ref={compoundSectionRef}
            className={cn(
              "transition-opacity duration-300",
              currentStep !== 1 ? "opacity-60" : "opacity-100"
            )}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center">
                <Beaker className="w-5 h-5 mr-2" />
                Compound Selection
              </h2>
              
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Search compounds by name, formula, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCompounds.map((compound) => (
                  <div
                    key={compound.id}
                    className={cn(
                      "border rounded-lg p-4 cursor-pointer transition-colors",
                      selectedCompounds.some(c => c.id === compound.id)
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 hover:border-blue-300 dark:border-gray-700"
                    )}
                    onClick={() => toggleCompoundSelection(compound)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium dark:text-white">{compound.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                          {compound.formula}
                        </p>
                      </div>
                      <div className={cn(
                        "text-xs px-2 py-1 rounded-full",
                        compound.phase === "Gas" 
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                          : compound.phase === "Liquid"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                      )}>
                        {compound.phase}
                      </div>
                    </div>
                    
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">MW:</span> {compound.molecularWeight} g/mol
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">BP:</span> {compound.boilingPoint}°C
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Tc:</span> {compound.criticalTemperature}°C
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Pc:</span> {compound.criticalPressure} MPa
                      </div>
                    </div>
                    
                    {compound.hazards.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {compound.hazards.map((hazard, index) => (
                          <span 
                            key={index}
                            className="bg-red-100 text-red-800 text-xs px-1.5 py-0.5 rounded dark:bg-red-900/30 dark:text-red-300"
                          >
                            {hazard}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* Detail dialog trigger */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="mt-3 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                          View detailed properties
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <span>{compound.name}</span>
                            <span className="text-gray-500 dark:text-gray-400 font-mono">
                              ({compound.formula})
                            </span>
                          </DialogTitle>
                          <DialogDescription>
                            Detailed chemical and thermodynamic properties
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                          <div>
                            <h3 className="font-medium mb-2 dark:text-white">Basic Properties</h3>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Molecular Weight:</span>
                                <span>{compound.molecularWeight} g/mol</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Boiling Point:</span>
                                <span>{compound.boilingPoint}°C</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Normal Phase:</span>
                                <span>{compound.phase}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Density:</span>
                                <span>{compound.density} kg/m³</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Viscosity:</span>
                                <span>{compound.viscosity} mPa·s</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Dielectric Constant:</span>
                                <span>{compound.dielectricConstant}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="font-medium mb-2 dark:text-white">Critical Properties</h3>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Critical Temperature:</span>
                                <span>{compound.criticalTemperature}°C</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Critical Pressure:</span>
                                <span>{compound.criticalPressure} MPa</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Enthalpy of Formation:</span>
                                <span>{compound.enthalpyOfFormation} kJ/mol</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Latent Heat:</span>
                                <span>{compound.latentHeat} kJ/mol</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="md:col-span-2">
                            <h3 className="font-medium mb-2 dark:text-white">Antoine Constants</h3>
                            <div className="space-y-1 text-sm">
                              <div className="grid grid-cols-3 gap-4">
                                <div>
                                  <span className="text-gray-600 dark:text-gray-400">A:</span>
                                  <span className="ml-2">{compound.antoineConstants.a}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600 dark:text-gray-400">B:</span>
                                  <span className="ml-2">{compound.antoineConstants.b}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600 dark:text-gray-400">C:</span>
                                  <span className="ml-2">{compound.antoineConstants.c}</span>
                                </div>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                For vapor pressure calculation: log(P) = A - B/(T + C)
                              </p>
                            </div>
                          </div>
                          
                          <div className="md:col-span-2">
                            <h3 className="font-medium mb-2 dark:text-white">Heat Capacity Coefficients</h3>
                            <div className="space-y-1 text-sm">
                              <div className="grid grid-cols-5 gap-2">
                                <div>
                                  <span className="text-gray-600 dark:text-gray-400">a:</span>
                                  <span className="ml-1">{compound.heatCapacityCoefficients.a}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600 dark:text-gray-400">b:</span>
                                  <span className="ml-1">{compound.heatCapacityCoefficients.b}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600 dark:text-gray-400">c:</span>
                                  <span className="ml-1">{compound.heatCapacityCoefficients.c}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600 dark:text-gray-400">d:</span>
                                  <span className="ml-1">{compound.heatCapacityCoefficients.d}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600 dark:text-gray-400">e:</span>
                                  <span className="ml-1">{compound.heatCapacityCoefficients.e}</span>
                                </div>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                For heat capacity calculation: Cp = a + bT + cT² + dT³ + e/T²
                              </p>
                            </div>
                          </div>
                          
                          {compound.hazards.length > 0 && (
                            <div className="md:col-span-2">
                              <h3 className="font-medium mb-2 text-red-600 dark:text-red-400">Hazards and Safety</h3>
                              <div className="flex flex-wrap gap-2">
                                {compound.hazards.map((hazard, index) => (
                                  <span
                                    key={index}
                                    className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded dark:bg-red-900/30 dark:text-red-300"
                                  >
                                    {hazard}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="md:col-span-2">
                            <h3 className="font-medium mb-2 dark:text-white">Categories</h3>
                            <div className="flex flex-wrap gap-2">
                              {compound.category.map((cat, index) => (
                                <span
                                  key={index}
                                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded dark:bg-blue-900/30 dark:text-blue-300"
                                >
                                  {cat}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                ))}
              </div>
              
              {/* Selected compounds summary */}
              {selectedCompounds.length > 0 && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                  <h3 className="font-medium mb-2 dark:text-white">Selected Compounds</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCompounds.map((compound) => (
                      <div
                        key={compound.id}
                        className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full dark:bg-blue-900/30 dark:text-blue-300"
                      >
                        <span>{compound.name}</span>
                        <button
                          className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCompounds(selectedCompounds.filter(c => c.id !== compound.id));
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-6 flex justify-end">
                <Button
                  disabled={!canProceedToModel}
                  onClick={handleNextStep}
                  className="flex items-center gap-2"
                >
                  Next: Select Model
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Step 2: Thermodynamic Model Selection */}
          <div 
            ref={modelSectionRef}
            className={cn(
              "transition-opacity duration-300",
              currentStep !== 2 ? "opacity-60" : "opacity-100"
            )}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center">
                <Thermometer className="w-5 h-5 mr-2" />
                Thermodynamic Model Selection
              </h2>
              
              {selectedCompounds.length === 0 ? (
                <div className="text-center p-8 text-gray-500 dark:text-gray-400">
                  Please select compounds first
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Select a thermodynamic model appropriate for your {selectedCompounds.length === 1 ? "compound" : "binary system"}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {thermodynamicModels.map((model) => (
                      <div
                        key={model.id}
                        className={cn(
                          "border rounded-lg p-4 cursor-pointer transition-colors",
                          selectedModel?.id === model.id
                            ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                            : "border-gray-200 hover:border-green-300 dark:border-gray-700"
                        )}
                        onClick={() => setSelectedModel(model)}
                      >
                        <h3 className="font-medium dark:text-white">{model.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {model.description}
                        </p>
                        
                        <div className="mt-3">
                          <Dialog>
                            <DialogTrigger asChild>
                              <button className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center">
                                <Info className="h-3 w-3 mr-1" /> Learn more
                              </button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>{model.name}</DialogTitle>
                                <DialogDescription>
                                  Thermodynamic model details and applicability
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="mt-4 space-y-4">
                                <div>
                                  <h4 className="font-medium text-sm mb-1 dark:text-white">Description</h4>
                                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    {model.description}
                                  </p>
                                </div>
                                
                                <div>
                                  <h4 className="font-medium text-sm mb-1 dark:text-white">Best For:</h4>
                                  <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400 text-sm">
                                    {model.applicability.map((item, index) => (
                                      <li key={index}>{item}</li>
                                    ))}
                                  </ul>
                                </div>
                                
                                <div>
                                  <h4 className="font-medium text-sm mb-1 dark:text-white">Limitations:</h4>
                                  <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400 text-sm">
                                    {model.limitations.map((item, index) => (
                                      <li key={index}>{item}</li>
                                    ))}
                                  </ul>
                                </div>
                                
                                <div className="bg-blue-50 p-3 rounded-md dark:bg-blue-900/20">
                                  <h4 className="font-medium text-sm mb-1 text-blue-700 dark:text-blue-300">Recommendation</h4>
                                  <p className="text-sm text-blue-600 dark:text-blue-400">
                                    {model.name === "Ideal Gas" && "Use for simple gas phase calculations at low pressures."}
                                    {model.name === "Raoult's Law" && "Good starting point for similar molecules with weak interactions."}
                                    {model.name === "NRTL" && "Excellent for strongly non-ideal liquid mixtures with accurate parameters."}
                                    {model.name === "Peng-Robinson" && "Strong choice for hydrocarbon systems across wide conditions."}
                                    {model.name === "UNIQUAC" && "Preferred for strongly non-ideal mixtures when parameters are known."}
                                    {model.name === "Soave-Redlich-Kwong" && "Well-suited for vapor-liquid equilibria in petrochemical processes."}
                                    {model.name === "UNIFAC" && "Best when experimental data isn't available for the specific system."}
                                  </p>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {selectedModel && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                      <h3 className="font-medium mb-2 dark:text-white">Selected Model</h3>
                      <div className="flex items-center">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full dark:bg-green-900/30 dark:text-green-300">
                          {selectedModel.name}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-6 flex justify-between">
                    <Button
                      onClick={handlePrevStep}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Back: Compounds
                    </Button>
                    
                    <Button
                      disabled={!canProceedToConditions}
                      onClick={handleNextStep}
                      className="flex items-center gap-2"
                    >
                      Next: Operating Conditions
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Step 3: Operating Conditions */}
          <div 
            ref={conditionsSectionRef}
            className={cn(
              "transition-opacity duration-300",
              currentStep !== 3 ? "opacity-60" : "opacity-100"
            )}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center">
                <Gauge className="w-5 h-5 mr-2" />
                Operating Conditions
              </h2>
              
              {!selectedModel ? (
                <div className="text-center p-8 text-gray-500 dark:text-gray-400">
                  Please select a thermodynamic model first
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Temperature (°C)
                      </label>
                      <div className="flex items-center">
                        <input
                          type="range"
                          min="0"
                          max="200"
                          step="1"
                          value={temperature}
                          onChange={(e) => setTemperature(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        />
                        <input
                          type="number"
                          min="0"
                          max="200"
                          value={temperature}
                          onChange={(e) => setTemperature(Number(e.target.value))}
                          className="ml-4 w-20 p-1 border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
                        <span>0°C</span>
                        <span>200°C</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Pressure (bar)
                      </label>
                      <div className="flex items-center">
                        <input
                          type="range"
                          min="0.1"
                          max="50"
                          step="0.1"
                          value={pressure}
                          onChange={(e) => setPressure(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        />
                        <input
                          type="number"
                          min="0.1"
                          max="50"
                          step="0.1"
                          value={pressure}
                          onChange={(e) => setPressure(Number(e.target.value))}
                          className="ml-4 w-20 p-1 border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
                        <span>0.1 bar</span>
                        <span>50 bar</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Composition sliders, only show if multiple compounds are selected */}
                  {selectedCompounds.length > 1 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                        <Percent className="w-4 h-4 mr-1" />
                        Composition (mol%)
                      </h3>
                      
                      <div className="space-y-4">
                        {selectedCompounds.map((compound, index) => (
                          <div key={compound.id}>
                            <div className="flex justify-between items-center mb-1">
                              <label className="text-sm text-gray-600 dark:text-gray-400">
                                {compound.name}
                              </label>
                              <span className="text-sm font-medium dark:text-white">
                                {composition[index]}%
                              </span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              step="1"
                              value={composition[index]}
                              onChange={(e) => updateComposition(index, Number(e.target.value))}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                            />
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 flex justify-center">
                        <div className="px-4 py-2 bg-gray-100 rounded-lg dark:bg-gray-700">
                          <div className="flex items-center gap-3">
                            <ArrowLeftRight className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            <button
                              onClick={() => setComposition([50, 50])}
                              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                            >
                              Reset to 50/50
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-6 flex justify-between">
                    <Button
                      onClick={handlePrevStep}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Back: Model
                    </Button>
                    
                    <Button
                      disabled={!canProceedToResults}
                      onClick={handleNextStep}
                      className="flex items-center gap-2"
                    >
                      Next: View Results
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Step 4: Results */}
          <div 
            ref={resultsSectionRef}
            className={cn(
              "transition-opacity duration-300",
              currentStep !== 4 ? "opacity-60" : "opacity-100"
            )}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center">
                <FileTextIcon className="w-5 h-5 mr-2" />
                Simulation Results
              </h2>
              
              {!canProceedToResults ? (
                <div className="text-center p-8 text-gray-500 dark:text-gray-400">
                  Please complete the previous steps first
                </div>
              ) : (
                <>
                  <div className="bg-blue-50 text-blue-700 p-4 rounded-lg mb-6 dark:bg-blue-900/20 dark:text-blue-300">
                    <h3 className="font-medium flex items-center">
                      <Info className="w-4 h-4 mr-2" />
                      Simulation Summary
                    </h3>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4 text-sm">
                      <div>
                        <span className="text-blue-600 dark:text-blue-400">Compounds:</span>{" "}
                        {selectedCompounds.map(c => c.name).join(" + ")}
                      </div>
                      <div>
                        <span className="text-blue-600 dark:text-blue-400">Model:</span>{" "}
                        {selectedModel?.name}
                      </div>
                      <div>
                        <span className="text-blue-600 dark:text-blue-400">Temperature:</span>{" "}
                        {temperature}°C
                      </div>
                      <div>
                        <span className="text-blue-600 dark:text-blue-400">Pressure:</span>{" "}
                        {pressure} bar
                      </div>
                      {selectedCompounds.length > 1 && (
                        <div className="sm:col-span-2">
                          <span className="text-blue-600 dark:text-blue-400">Composition:</span>{" "}
                          {selectedCompounds.map((c, i) => `${c.name} (${composition[i]}%)`).join(" + ")}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Tabs defaultValue="phase" className="mt-6">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="phase">Phase Distribution</TabsTrigger>
                      <TabsTrigger value="properties">Properties</TabsTrigger>
                      <TabsTrigger value="activity">Activity & Fugacity</TabsTrigger>
                      <TabsTrigger value="energy">Energy Analysis</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="phase" className="mt-4">
                      <div>
                        <h3 className="text-lg font-medium mb-4 dark:text-white">Phase Distribution</h3>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="bg-gray-50 p-4 rounded-lg dark:bg-gray-700">
                            <h4 className="text-sm font-medium mb-3 dark:text-white">
                              Vapor-Liquid Distribution vs Composition
                            </h4>
                            <div className="h-64">
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                  data={phaseData}
                                  margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                                >
                                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                  <XAxis 
                                    dataKey="composition" 
                                    label={{ 
                                      value: 'Composition (%)', 
                                      position: 'bottom',
                                      style: { fontSize: '0.75rem' }
                                    }} 
                                  />
                                  <YAxis
                                    label={{
                                      value: 'Phase (%)',
                                      angle: -90,
                                      position: 'left',
                                      style: { fontSize: '0.75rem' }
                                    }}
                                  />
                                  <Tooltip 
                                    formatter={(value: number) => [`${value.toFixed(1)}%`, '']}
                                    labelFormatter={(value) => `Composition: ${value}%`}
                                  />
                                  <Area
                                    type="monotone"
                                    dataKey="vapor"
                                    stackId="1"
                                    stroke="#8884d8"
                                    fill="#8884d8"
                                    name="Vapor"
                                  />
                                  <Area
                                    type="monotone"
                                    dataKey="liquid"
                                    stackId="1"
                                    stroke="#82ca9d"
                                    fill="#82ca9d"
                                    name="Liquid"
                                  />
                                  <Legend />
                                </AreaChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                          
                          <div>
                            <div className="bg-gray-50 p-4 rounded-lg mb-4 dark:bg-gray-700">
                              <h4 className="text-sm font-medium mb-3 dark:text-white">
                                Current System
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-white p-3 rounded shadow-sm dark:bg-gray-800">
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    Vapor Phase
                                  </div>
                                  <div className="text-2xl font-bold mt-1 dark:text-white">
                                    {Math.round(phaseData[Math.round(composition[0] / 10)].vapor)}%
                                  </div>
                                </div>
                                <div className="bg-white p-3 rounded shadow-sm dark:bg-gray-800">
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    Liquid Phase
                                  </div>
                                  <div className="text-2xl font-bold mt-1 dark:text-white">
                                    {Math.round(phaseData[Math.round(composition[0] / 10)].liquid)}%
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg dark:bg-gray-700">
                              <h4 className="text-sm font-medium mb-3 dark:text-white">
                                Bubble and Dew Points
                              </h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">Bubble Point Temperature:</span>
                                  <span className="font-medium dark:text-white">
                                    {(temperature - 10 + Math.random() * 5).toFixed(1)}°C
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">Dew Point Temperature:</span>
                                  <span className="font-medium dark:text-white">
                                    {(temperature + 10 + Math.random() * 5).toFixed(1)}°C
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">Bubble Point Pressure:</span>
                                  <span className="font-medium dark:text-white">
                                    {(pressure * 0.9 + Math.random() * 0.2).toFixed(2)} bar
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">Dew Point Pressure:</span>
                                  <span className="font-medium dark:text-white">
                                    {(pressure * 1.1 + Math.random() * 0.2).toFixed(2)} bar
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="properties" className="mt-4">
                      <div>
                        <h3 className="text-lg font-medium mb-4 dark:text-white">Physical Properties</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-gray-50 p-4 rounded-lg dark:bg-gray-700">
                            <h4 className="text-sm font-medium mb-3 dark:text-white">
                              Mixture Properties
                            </h4>
                            
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Average Molecular Weight:</span>
                                <span className="font-medium dark:text-white">
                                  {selectedCompounds.length === 1 
                                    ? selectedCompounds[0].molecularWeight 
                                    : (selectedCompounds[0].molecularWeight * (composition[0] / 100) + 
                                       selectedCompounds[1].molecularWeight * (composition[1] / 100)).toFixed(2)
                                  } g/mol
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Density:</span>
                                <span className="font-medium dark:text-white">
                                  {selectedCompounds.length === 1 
                                    ? selectedCompounds[0].density
                                    : (selectedCompounds[0].density * (composition[0] / 100) + 
                                       selectedCompounds[1].density * (composition[1] / 100)).toFixed(0)
                                  } kg/m³
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Viscosity:</span>
                                <span className="font-medium dark:text-white">
                                  {selectedCompounds.length === 1 
                                    ? selectedCompounds[0].viscosity
                                    : (selectedCompounds[0].viscosity * Math.log(composition[0] / 100) + 
                                       selectedCompounds[1].viscosity * Math.log(composition[1] / 100)).toFixed(2)
                                  } mPa·s
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Dielectric Constant:</span>
                                <span className="font-medium dark:text-white">
                                  {selectedCompounds.length === 1 
                                    ? selectedCompounds[0].dielectricConstant
                                    : (selectedCompounds[0].dielectricConstant * (composition[0] / 100) + 
                                       selectedCompounds[1].dielectricConstant * (composition[1] / 100)).toFixed(1)
                                  }
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Heat of Mixing:</span>
                                <span className="font-medium dark:text-white">
                                  {selectedCompounds.length === 1 
                                    ? "N/A"
                                    : ((Math.random() * 2 - 1) * composition[0] * composition[1] / 100).toFixed(2)
                                  } kJ/mol
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-lg dark:bg-gray-700">
                            <h4 className="text-sm font-medium mb-3 dark:text-white">
                              Vapor Pressure
                            </h4>
                            <div className="h-48">
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                  data={Array.from({ length: 11 }, (_, i) => {
                                    const t = temperature - 50 + i * 10;
                                    return {
                                      temp: t,
                                      pressure: Math.max(0.1, calculateVaporPressure(selectedCompounds[0], t)),
                                      pressure2: selectedCompounds.length > 1 
                                        ? Math.max(0.1, calculateVaporPressure(selectedCompounds[1], t))
                                        : null
                                    };
                                  })}
                                  margin={{ top: 5, right: 5, bottom: 20, left: 5 }}
                                >
                                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                  <XAxis 
                                    dataKey="temp" 
                                    label={{ 
                                      value: 'Temperature (°C)', 
                                      position: 'bottom',
                                      style: { fontSize: '0.75rem' }
                                    }} 
                                  />
                                  <YAxis
                                    label={{
                                      value: 'Vapor Pressure (bar)',
                                      angle: -90,
                                      position: 'left',
                                      style: { fontSize: '0.75rem' }
                                    }}
                                  />
                                  <Tooltip formatter={(value: any) => [`${Number(value).toFixed(2)} bar`, '']} />
                                  <Line
                                    type="monotone"
                                    dataKey="pressure"
                                    stroke="#8884d8"
                                    name={selectedCompounds[0]?.name || "Compound 1"}
                                    dot={false}
                                    activeDot={{ r: 5 }}
                                  />
                                  {selectedCompounds.length > 1 && (
                                    <Line
                                      type="monotone"
                                      dataKey="pressure2"
                                      stroke="#82ca9d"
                                      name={selectedCompounds[1]?.name || "Compound 2"}
                                      dot={false}
                                      activeDot={{ r: 5 }}
                                    />
                                  )}
                                  <Legend />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                            <div className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
                              Calculated using Antoine equation
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-6">
                          <div className="bg-gray-50 p-4 rounded-lg dark:bg-gray-700">
                            <h4 className="text-sm font-medium mb-3 dark:text-white">
                              Equilibrium Constants (K-values)
                            </h4>
                            
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead>
                                  <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                      Compound
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                      K-value at {temperature}°C
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                      K-value at {temperature + 10}°C
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                      K-value at {temperature + 20}°C
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                  {selectedCompounds.map((compound) => (
                                    <tr key={compound.id}>
                                      <td className="px-4 py-2 text-sm dark:text-white">
                                        {compound.name}
                                      </td>
                                      <td className="px-4 py-2 text-sm dark:text-white">
                                        {(calculateVaporPressure(compound, temperature) / pressure).toFixed(3)}
                                      </td>
                                      <td className="px-4 py-2 text-sm dark:text-white">
                                        {(calculateVaporPressure(compound, temperature + 10) / pressure).toFixed(3)}
                                      </td>
                                      <td className="px-4 py-2 text-sm dark:text-white">
                                        {(calculateVaporPressure(compound, temperature + 20) / pressure).toFixed(3)}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            
                            {selectedCompounds.length > 1 && (
                              <div className="mt-4">
                                <h5 className="text-xs font-medium mb-1 dark:text-white">
                                  Relative Volatility (α)
                                </h5>
                                <div className="text-sm dark:text-white">
                                  α<sub>{selectedCompounds[0]?.name}/{selectedCompounds[1]?.name}</sub> = {
                                    (calculateVaporPressure(selectedCompounds[0], temperature) /
                                    calculateVaporPressure(selectedCompounds[1], temperature)).toFixed(3)
                                  }
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="activity" className="mt-4">
                      <div>
                        <h3 className="text-lg font-medium mb-4 dark:text-white">Activity & Fugacity</h3>
                        
                        {selectedCompounds.length < 2 ? (
                          <div className="bg-yellow-50 p-4 rounded-lg text-center dark:bg-yellow-900/20">
                            <p className="text-yellow-700 dark:text-yellow-300">
                              Activity and fugacity coefficients require at least two components.
                            </p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-gray-50 p-4 rounded-lg dark:bg-gray-700">
                              <h4 className="text-sm font-medium mb-3 dark:text-white">
                                Activity Coefficients vs Composition
                              </h4>
                              <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                  <LineChart
                                    data={activityCoeffData}
                                    margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                                  >
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                    <XAxis 
                                      dataKey="moleFraction" 
                                      label={{ 
                                        value: `${selectedCompounds[0]?.name} Mole Fraction (%)`, 
                                        position: 'bottom',
                                        style: { fontSize: '0.75rem' }
                                      }} 
                                    />
                                    <YAxis
                                      label={{
                                        value: 'Activity Coefficient',
                                        angle: -90,
                                        position: 'left',
                                        style: { fontSize: '0.75rem' }
                                      }}
                                    />
                                    <Tooltip formatter={(value: any) => [`${Number(value).toFixed(3)}`, '']} />
                                    <Line
                                      type="monotone"
                                      dataKey="component1"
                                      stroke="#8884d8"
                                      name={selectedCompounds[0]?.name}
                                      dot={false}
                                    />
                                    <Line
                                      type="monotone"
                                      dataKey="component2"
                                      stroke="#82ca9d"
                                      name={selectedCompounds[1]?.name}
                                      dot={false}
                                    />
                                    <Legend />
                                  </LineChart>
                                </ResponsiveContainer>
                              </div>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg dark:bg-gray-700">
                              <h4 className="text-sm font-medium mb-3 dark:text-white">
                                Current Activity & Fugacity
                              </h4>
                              
                              <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                  <thead>
                                    <tr>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                        Compound
                                      </th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                        Liquid Phase Activity Coeff.
                                      </th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                        Vapor Phase Fugacity Coeff.
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {selectedCompounds.map((compound, index) => {
                                      const activityCoeff = index === 0 
                                        ? activityCoeffData[Math.round(composition[0]/10)].component1
                                        : activityCoeffData[Math.round(composition[0]/10)].component2;
                                      
                                      const fugacityCoeff = 0.95 + Math.random() * 0.1;
                                      
                                      return (
                                        <tr key={compound.id}>
                                          <td className="px-4 py-2 text-sm dark:text-white">
                                            {compound.name}
                                          </td>
                                          <td className="px-4 py-2 text-sm dark:text-white">
                                            {activityCoeff.toFixed(3)}
                                          </td>
                                          <td className="px-4 py-2 text-sm dark:text-white">
                                            {fugacityCoeff.toFixed(3)}
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                              
                              <div className="mt-6">
                                <h5 className="text-xs font-medium mb-2 dark:text-white">
                                  Fugacity Values
                                </h5>
                                
                                {selectedCompounds.map((compound, index) => {
                                  const activityCoeff = index === 0 
                                    ? activityCoeffData[Math.round(composition[0]/10)].component1
                                    : activityCoeffData[Math.round(composition[0]/10)].component2;
                                  
                                  const fugacityCoeff = 0.95 + Math.random() * 0.1;
                                  const vaporPressure = calculateVaporPressure(compound, temperature);
                                  const fugacity = (activityCoeff * (composition[index]/100) * vaporPressure * fugacityCoeff).toFixed(3);
                                  
                                  return (
                                    <div key={compound.id} className="mb-2">
                                      <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">
                                          {compound.name} Fugacity:
                                        </span>
                                        <span className="font-medium dark:text-white">
                                          {fugacity} bar
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="energy" className="mt-4">
                      <div>
                        <h3 className="text-lg font-medium mb-4 dark:text-white">Energy Analysis</h3>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="bg-gray-50 p-4 rounded-lg dark:bg-gray-700">
                            <h4 className="text-sm font-medium mb-3 dark:text-white">
                              Thermodynamic Properties vs Composition
                            </h4>
                            <div className="h-64">
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                  data={enthalpyData}
                                  margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                                >
                                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                  <XAxis 
                                    dataKey="composition" 
                                    label={{ 
                                      value: `${selectedCompounds[0]?.name} Content (%)`, 
                                      position: 'bottom',
                                      style: { fontSize: '0.75rem' }
                                    }} 
                                  />
                                  <YAxis
                                    label={{
                                      value: 'Energy (kJ/mol)',
                                      angle: -90,
                                      position: 'left',
                                      style: { fontSize: '0.75rem' }
                                    }}
                                  />
                                  <Tooltip formatter={(value: any) => [`${Number(value).toFixed(2)} kJ/mol`, '']} />
                                  <Line
                                    type="monotone"
                                    dataKey="enthalpy"
                                    stroke="#8884d8"
                                    name="Enthalpy (H)"
                                    dot={false}
                                  />
                                  <Line
                                    type="monotone"
                                    dataKey="gibbs"
                                    stroke="#82ca9d"
                                    name="Gibbs Energy (G)"
                                    dot={false}
                                  />
                                  <Line
                                    type="monotone"
                                    dataKey="entropy"
                                    stroke="#ffc658"
                                    name="Entropy (S) × 10"
                                    dot={false}
                                  />
                                  <Legend />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                          
                          <div>
                            <div className="bg-gray-50 p-4 rounded-lg mb-4 dark:bg-gray-700">
                              <h4 className="text-sm font-medium mb-3 dark:text-white">
                                Current Thermodynamic State
                              </h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Enthalpy (H):</span>
                                    <span className="font-medium dark:text-white">
                                      {enthalpyData[Math.round(composition[0]/10)].enthalpy.toFixed(2)} kJ/mol
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Entropy (S):</span>
                                    <span className="font-medium dark:text-white">
                                      {(enthalpyData[Math.round(composition[0]/10)].entropy * 10).toFixed(2)} J/mol·K
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Gibbs (G):</span>
                                    <span className="font-medium dark:text-white">
                                      {enthalpyData[Math.round(composition[0]/10)].gibbs.toFixed(2)} kJ/mol
                                    </span>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Heat Capacity:</span>
                                    <span className="font-medium dark:text-white">
                                      {(50 + Math.random() * 20).toFixed(2)} J/mol·K
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Heat of Mixing:</span>
                                    <span className="font-medium dark:text-white">
                                      {((Math.random() * 2 - 1) * composition[0] * composition[1] / 5000).toFixed(3)} kJ/mol
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Entropy of Mixing:</span>
                                    <span className="font-medium dark:text-white">
                                      {(Math.random() * composition[0] * composition[1] / 500).toFixed(3)} J/mol·K
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg dark:bg-gray-700">
                              <h4 className="text-sm font-medium mb-3 dark:text-white">
                                Energetic Summary
                              </h4>
                              
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">Total Latent Heat:</span>
                                  <span className="font-medium dark:text-white">
                                    {selectedCompounds.length === 1 
                                      ? selectedCompounds[0].latentHeat
                                      : (selectedCompounds[0].latentHeat * (composition[0]/100) + 
                                         selectedCompounds[1].latentHeat * (composition[1]/100)).toFixed(2)
                                    } kJ/mol
                                  </span>
                                </div>
                                
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">Energy Required for Phase Change:</span>
                                  <span className="font-medium dark:text-white">
                                    {(selectedCompounds.length === 1 
                                      ? selectedCompounds[0].latentHeat
                                      : (selectedCompounds[0].latentHeat * (composition[0]/100) + 
                                         selectedCompounds[1].latentHeat * (composition[1]/100))
                                    ).toFixed(2)} kJ/mol
                                  </span>
                                </div>
                                
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">Sensible Heat (ΔT=10°C):</span>
                                  <span className="font-medium dark:text-white">
                                    {((50 + Math.random() * 20) * 10 / 1000).toFixed(2)} kJ/mol
                                  </span>
                                </div>
                                
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">Total Energy Balance:</span>
                                  <span className="font-medium dark:text-white">
                                    {enthalpyData[Math.round(composition[0]/10)].enthalpy.toFixed(2)} kJ/mol
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  <div className="mt-8 flex justify-between">
                    <Button
                      onClick={handlePrevStep}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Back: Conditions
                    </Button>
                    
                    <Button
                      onClick={exportToPDF}
                      className="flex items-center gap-2"
                    >
                      <DownloadCloud className="h-4 w-4" />
                      Export Report
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Utility function to calculate vapor pressure using Antoine equation
function calculateVaporPressure(compound: Compound | undefined, temperature: number): number {
  if (!compound) return 1.0;
  
  const { a, b, c } = compound.antoineConstants;
  const logP = a - (b / (temperature + c));
  // Convert from mmHg to bar
  return Math.pow(10, logP) * 0.00133322;
}

export default IntelligentSimulation;
