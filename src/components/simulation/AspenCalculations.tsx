import React, { useState } from "react";
import GlassPanel from "@/components/ui/GlassPanel";
import { cn } from "@/lib/utils";
import { 
  Calculator, Droplets, Beaker, Thermometer, Waves, Zap, 
  Shield, Cpu, Leaf, DollarSign, FlaskConical, Gauge, ArrowRight, 
  BookOpen, FileText, DownloadCloud, LucideIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface AspenCalculationsProps {
  className?: string;
  calculationType?: string;
}

// Define a type for our calculation entry
interface CalculationEntry {
  id: string;
  name: string;
  icon: LucideIcon;
}

const AspenCalculations: React.FC<AspenCalculationsProps> = ({ className, calculationType = "thermodynamic" }) => {
  const { toast } = useToast();
  const [selectedCalculation, setSelectedCalculation] = useState<string | null>(null);
  const [calculationProgress, setCalculationProgress] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [calculationTab, setCalculationTab] = useState("input");
  
  // Form state for various calculation types
  const [formState, setFormState] = useState({
    // Common
    temperature: 298.15, // K
    pressure: 101.325, // kPa
    components: ["Methane", "Ethane", "Propane"],
    composition: [0.65, 0.25, 0.10],
    
    // Reaction specific
    reactionType: "CSTR",
    conversionRate: 85,
    residence: 20, // min
    
    // Heat transfer
    heatDuty: 100, // kW
    inletTemp: 25, // °C
    outletTemp: 80, // °C
    foulingFactor: 0.0002, // m²·K/W
    
    // Distillation
    numberOfTrays: 20,
    refluxRatio: 1.5,
    feedTray: 10,
    
    // Fluid flow
    flowRate: 100, // m³/h
    pipeLength: 100, // m
    pipeDiameter: 0.1, // m
    roughness: 0.000045, // m
    
    // Economic
    capitalCost: 1000000, // $
    operatingCost: 200000, // $/year
    revenue: 500000, // $/year
    discountRate: 10, // %
    projectLife: 10 // years
  });

  // Get the available calculations for the current category
  const getCalculationsByType = (type: string): CalculationEntry[] => {
    switch (type) {
      case "thermodynamic":
        return [
          { id: "vle", name: "Vapor-Liquid Equilibrium", icon: Droplets },
          { id: "lle", name: "Liquid-Liquid Equilibrium", icon: Droplets },
          { id: "eos", name: "Equation of State", icon: Calculator },
          { id: "activity", name: "Activity Coefficients", icon: Calculator },
          { id: "enthalpy", name: "Enthalpy & Entropy", icon: Thermometer },
          { id: "zfactor", name: "Compressibility Factor", icon: Calculator }
        ];
      case "process":
        return [
          { id: "massBalance", name: "Mass & Energy Balance", icon: Calculator },
          { id: "flowsheet", name: "Flow Sheeting", icon: FileText },
          { id: "optimization", name: "Process Optimization", icon: Cpu },
          { id: "sensitivity", name: "Sensitivity Analysis", icon: Gauge },
          { id: "equipment", name: "Equipment Sizing", icon: Calculator }
        ];
      case "heat":
        return [
          { id: "lmtd", name: "LMTD Method", icon: Thermometer },
          { id: "ntu", name: "Effectiveness-NTU Method", icon: Thermometer },
          { id: "exchanger", name: "Heat Exchanger Sizing", icon: Zap },
          { id: "pinch", name: "Pinch Analysis", icon: Thermometer },
          { id: "heatDuty", name: "Heat Duty Calculations", icon: Zap }
        ];
      case "reaction":
        return [
          { id: "pfr", name: "Plug Flow Reactor", icon: FlaskConical },
          { id: "cstr", name: "Continuous Stirred Tank Reactor", icon: FlaskConical },
          { id: "batch", name: "Batch Reactor", icon: FlaskConical },
          { id: "kinetics", name: "Reaction Kinetics", icon: Calculator },
          { id: "equilibrium", name: "Equilibrium Conversion", icon: Calculator }
        ];
      case "distillation":
        return [
          { id: "mccabe", name: "McCabe-Thiele Method", icon: Beaker },
          { id: "fug", name: "Fenske-Underwood-Gilliland", icon: Beaker },
          { id: "column", name: "Column Simulation", icon: Beaker },
          { id: "packing", name: "Packed Column Design", icon: Beaker },
          { id: "azeotropic", name: "Azeotropic Distillation", icon: Beaker }
        ];
      case "fluid":
        return [
          { id: "pressureDrop", name: "Pressure Drop Calculations", icon: Waves },
          { id: "twophase", name: "Two-Phase Flow", icon: Waves },
          { id: "pump", name: "Pump Sizing", icon: Gauge },
          { id: "compressor", name: "Compressor Power", icon: Gauge },
          { id: "relief", name: "Relief System Design", icon: Shield }
        ];
      case "safety":
        return [
          { id: "flare", name: "Flare System Sizing", icon: Shield },
          { id: "relief", name: "Relief Valve Sizing", icon: Shield },
          { id: "emission", name: "Emission Modeling", icon: Shield },
          { id: "fire", name: "Fire & Explosion Analysis", icon: Shield },
          { id: "environmental", name: "Environmental Assessment", icon: Leaf }
        ];
      case "utilities":
        return [
          { id: "steam", name: "Steam Network Modeling", icon: Waves },
          { id: "fuelgas", name: "Fuel Gas System", icon: Zap },
          { id: "cogen", name: "Cogeneration", icon: Zap },
          { id: "refrigeration", name: "Refrigeration Cycle", icon: Thermometer },
          { id: "efficiency", name: "Energy Efficiency Analysis", icon: Leaf }
        ];
      case "economic":
        return [
          { id: "capex", name: "Capital Cost Estimation", icon: DollarSign },
          { id: "opex", name: "Operating Cost Analysis", icon: DollarSign },
          { id: "payback", name: "Payback Period & ROI", icon: DollarSign },
          { id: "npv", name: "NPV & IRR Calculation", icon: DollarSign },
          { id: "sensitivity", name: "Economic Sensitivity", icon: DollarSign }
        ];
      default:
        return [
          { id: "vle", name: "Vapor-Liquid Equilibrium", icon: Droplets }
        ];
    }
  };

  const currentCalculations = getCalculationsByType(calculationType);

  const handleInputChange = (name: string, value: any) => {
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const performCalculation = (calcId: string) => {
    setSelectedCalculation(calcId);
    setCalculationProgress(0);
    setIsCalculating(true);
    setResults(null);
    setCalculationTab("input");
    
    // Simulated calculation
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setCalculationProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setIsCalculating(false);
        setCalculationTab("results");
        
        // Generate results based on calculation type
        const result = generateResults(calcId);
        setResults(result);
        
        toast({
          title: "Calculation complete",
          description: `The ${currentCalculations.find(c => c.id === calcId)?.name || calcId} calculation has finished.`
        });
      }
    }, 100);
    
    return () => clearInterval(interval);
  };

  // Generate simulated results based on calculation type
  const generateResults = (calcId: string) => {
    // Common results structure with variations based on calculation type
    const baseResult = {
      timestamp: new Date().toISOString(),
      inputs: { ...formState },
      calcType: calcId,
      category: calculationType
    };

    switch (calculationType) {
      case "thermodynamic":
        if (calcId === "vle") {
          return {
            ...baseResult,
            components: formState.components,
            temperature: formState.temperature,
            pressure: formState.pressure,
            results: formState.components.map((comp, i) => ({
              component: comp,
              liquidMoleFraction: Math.random() * 0.5,
              vaporMoleFraction: 0.5 + Math.random() * 0.5
            })),
            kValues: formState.components.map(() => 0.5 + Math.random() * 1.5),
            activityCoefficients: formState.components.map(() => 0.8 + Math.random() * 0.4)
          };
        } else if (calcId === "enthalpy") {
          return {
            ...baseResult,
            components: formState.components.map((comp, i) => ({
              name: comp,
              enthalpy: -100 - Math.random() * 200, // kJ/mol
              entropy: 50 + Math.random() * 150, // J/mol·K
              gibbs: -50 - Math.random() * 100 // kJ/mol
            })),
            mixture: {
              enthalpy: -150 - Math.random() * 100,
              entropy: 100 + Math.random() * 100,
              gibbs: -80 - Math.random() * 50
            }
          };
        } else {
          return {
            ...baseResult,
            components: formState.components,
            message: "Thermodynamic calculation completed successfully",
            properties: {
              molWeight: (20 + Math.random() * 30).toFixed(2),
              density: (800 + Math.random() * 200).toFixed(1),
              viscosity: (0.5 + Math.random() * 2).toFixed(3),
              thermalConductivity: (0.1 + Math.random() * 0.3).toFixed(3)
            }
          };
        }
      
      case "reaction":
        return {
          ...baseResult,
          reactionType: formState.reactionType,
          conversionData: Array.from({ length: 10 }, (_, i) => ({
            time: i * (formState.residence / 10),
            conversion: Math.min(0.98, 1 - Math.exp(-0.15 * i))
          })),
          productYields: formState.components.map(comp => ({
            component: comp,
            yield: (Math.random() * 0.95).toFixed(3)
          })),
          heatOfReaction: (-50 - Math.random() * 100).toFixed(2),
          activationEnergy: (50 + Math.random() * 100).toFixed(2)
        };
      
      case "heat":
        return {
          ...baseResult,
          heatDuty: formState.heatDuty,
          overallHeatTransferCoefficient: (500 + Math.random() * 300).toFixed(2),
          effectiveArea: (10 + Math.random() * 20).toFixed(2),
          temperatureProfile: Array.from({ length: 10 }, (_, i) => ({
            position: i / 10,
            hotTemp: formState.inletTemp - (i / 10) * (formState.inletTemp - formState.outletTemp),
            coldTemp: formState.outletTemp - (i / 10) * (formState.outletTemp - formState.inletTemp)
          }))
        };
      
      case "distillation":
        return {
          ...baseResult,
          numberOfTheoricalStages: formState.numberOfTrays,
          minimumRefluxRatio: (formState.refluxRatio * 0.7).toFixed(2),
          actualRefluxRatio: formState.refluxRatio,
          feedStage: formState.feedTray,
          stageEfficiency: (0.7 + Math.random() * 0.2).toFixed(2),
          compositions: {
            feed: formState.composition,
            distillate: formState.composition.map(c => Math.min(1, c + Math.random() * 0.3)),
            bottoms: formState.composition.map(c => Math.max(0, c - Math.random() * 0.3))
          }
        };
      
      case "fluid":
        return {
          ...baseResult,
          reynoldsNumber: (2000 + Math.random() * 30000).toFixed(0),
          frictionFactor: (0.01 + Math.random() * 0.03).toFixed(4),
          pressureDrop: (10 + Math.random() * 50).toFixed(2),
          velocityProfile: Array.from({ length: 5 }, (_, i) => ({
            position: i / 5,
            velocity: (1 + Math.random()).toFixed(2)
          }))
        };
      
      case "economic":
        const capex = formState.capitalCost;
        const opex = formState.operatingCost;
        const revenue = formState.revenue;
        const annualCashFlow = revenue - opex;
        const paybackPeriod = capex / annualCashFlow;
        
        return {
          ...baseResult,
          capitalCost: capex,
          operatingCost: opex,
          annualRevenue: revenue,
          netAnnualCashFlow: annualCashFlow,
          paybackPeriod: paybackPeriod.toFixed(2),
          npv: (annualCashFlow * formState.projectLife * 0.7 - capex).toFixed(2),
          irr: (Math.random() * 0.15 + 0.05).toFixed(2),
          roi: ((annualCashFlow / capex) * 100).toFixed(2)
        };
      
      default:
        return {
          ...baseResult,
          message: "Calculation completed successfully",
          result: (Math.random() * 100).toFixed(2)
        };
    }
  };

  // Render appropriate form fields based on calculation type
  const renderInputFields = () => {
    const baseFields = (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="temperature">Temperature (K)</Label>
            <Input 
              id="temperature" 
              type="number" 
              value={formState.temperature}
              onChange={(e) => handleInputChange("temperature", Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pressure">Pressure (kPa)</Label>
            <Input 
              id="pressure" 
              type="number" 
              value={formState.pressure}
              onChange={(e) => handleInputChange("pressure", Number(e.target.value))}
            />
          </div>
        </div>
      </div>
    );

    // Additional fields based on calculation type
    switch (calculationType) {
      case "thermodynamic":
        return (
          <div className="space-y-4">
            {baseFields}
            
            <div className="space-y-2">
              <Label>Component Selection</Label>
              <div className="grid grid-cols-3 gap-2">
                {["Methane", "Ethane", "Propane", "Butane", "Pentane", "Hexane", "Nitrogen", "Oxygen", "Carbon Dioxide", "Water", "Methanol", "Ethanol"].map(comp => (
                  <div key={comp} className="flex items-center">
                    <input 
                      type="checkbox" 
                      id={`comp-${comp}`}
                      className="mr-2" 
                      checked={formState.components.includes(comp)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleInputChange("components", [...formState.components, comp]);
                        } else {
                          handleInputChange("components", formState.components.filter(c => c !== comp));
                        }
                      }}
                    />
                    <Label htmlFor={`comp-${comp}`} className="text-sm">{comp}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Thermodynamic Model</Label>
              <Select defaultValue="peng-robinson">
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="peng-robinson">Peng-Robinson</SelectItem>
                  <SelectItem value="srk">Soave-Redlich-Kwong</SelectItem>
                  <SelectItem value="nrtl">NRTL</SelectItem>
                  <SelectItem value="uniquac">UNIQUAC</SelectItem>
                  <SelectItem value="wilson">Wilson</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "reaction":
        return (
          <div className="space-y-4">
            {baseFields}
            
            <div className="space-y-2">
              <Label>Reactor Type</Label>
              <Select 
                defaultValue={formState.reactionType}
                onValueChange={(value) => handleInputChange("reactionType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select reactor type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CSTR">CSTR</SelectItem>
                  <SelectItem value="PFR">PFR</SelectItem>
                  <SelectItem value="Batch">Batch Reactor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Residence Time (min): {formState.residence}</Label>
              <Slider 
                value={[formState.residence]} 
                min={1} 
                max={60} 
                step={1}
                onValueChange={(value) => handleInputChange("residence", value[0])}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Target Conversion (%): {formState.conversionRate}</Label>
              <Slider 
                value={[formState.conversionRate]} 
                min={10} 
                max={99} 
                step={1}
                onValueChange={(value) => handleInputChange("conversionRate", value[0])}
              />
            </div>
          </div>
        );

      case "heat":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="inletTemp">Inlet Temperature (°C)</Label>
                <Input 
                  id="inletTemp" 
                  type="number" 
                  value={formState.inletTemp}
                  onChange={(e) => handleInputChange("inletTemp", Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="outletTemp">Outlet Temperature (°C)</Label>
                <Input 
                  id="outletTemp" 
                  type="number" 
                  value={formState.outletTemp}
                  onChange={(e) => handleInputChange("outletTemp", Number(e.target.value))}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="heatDuty">Heat Duty (kW)</Label>
              <Input 
                id="heatDuty" 
                type="number" 
                value={formState.heatDuty}
                onChange={(e) => handleInputChange("heatDuty", Number(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="foulingFactor">Fouling Factor (m²·K/W)</Label>
              <Input 
                id="foulingFactor" 
                type="number" 
                value={formState.foulingFactor}
                step="0.0001"
                onChange={(e) => handleInputChange("foulingFactor", Number(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Heat Exchanger Type</Label>
              <Select defaultValue="shell-tube">
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shell-tube">Shell and Tube</SelectItem>
                  <SelectItem value="plate">Plate Heat Exchanger</SelectItem>
                  <SelectItem value="double-pipe">Double Pipe</SelectItem>
                  <SelectItem value="spiral">Spiral Heat Exchanger</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "distillation":
        return (
          <div className="space-y-4">
            {baseFields}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numberOfTrays">Number of Trays</Label>
                <Input 
                  id="numberOfTrays" 
                  type="number" 
                  value={formState.numberOfTrays}
                  onChange={(e) => handleInputChange("numberOfTrays", Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="feedTray">Feed Tray</Label>
                <Input 
                  id="feedTray" 
                  type="number" 
                  value={formState.feedTray}
                  max={formState.numberOfTrays}
                  onChange={(e) => handleInputChange("feedTray", Number(e.target.value))}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="refluxRatio">Reflux Ratio</Label>
              <Input 
                id="refluxRatio" 
                type="number" 
                value={formState.refluxRatio}
                step="0.1"
                onChange={(e) => handleInputChange("refluxRatio", Number(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Column Type</Label>
              <Select defaultValue="tray">
                <SelectTrigger>
                  <SelectValue placeholder="Select column type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tray">Tray Column</SelectItem>
                  <SelectItem value="packed">Packed Column</SelectItem>
                  <SelectItem value="structured">Structured Packing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "economic":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capitalCost">Capital Cost ($)</Label>
                <Input 
                  id="capitalCost" 
                  type="number" 
                  value={formState.capitalCost}
                  onChange={(e) => handleInputChange("capitalCost", Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="operatingCost">Operating Cost ($/year)</Label>
                <Input 
                  id="operatingCost" 
                  type="number" 
                  value={formState.operatingCost}
                  onChange={(e) => handleInputChange("operatingCost", Number(e.target.value))}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="revenue">Annual Revenue ($/year)</Label>
                <Input 
                  id="revenue" 
                  type="number" 
                  value={formState.revenue}
                  onChange={(e) => handleInputChange("revenue", Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectLife">Project Life (years)</Label>
                <Input 
                  id="projectLife" 
                  type="number" 
                  value={formState.projectLife}
                  onChange={(e) => handleInputChange("projectLife", Number(e.target.value))}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Discount Rate (%): {formState.discountRate}</Label>
              <Slider 
                value={[formState.discountRate]} 
                min={1} 
                max={30} 
                step={0.5}
                onValueChange={(value) => handleInputChange("discountRate", value[0])}
              />
            </div>
          </div>
        );

      default:
        return baseFields;
    }
  };

  // Render results based on calculation type and results
  const renderResults = () => {
    if (!results) return <p>No results available.</p>;
    
    // Common results display components
    const renderBasicProperties = () => (
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Temperature</p>
          <p className="text-lg font-medium">{results.temperature} K</p>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Pressure</p>
          <p className="text-lg font-medium">{results.pressure} kPa</p>
        </div>
      </div>
    );
    
    // Specific displays based on calculation type
    if (calculationType === "thermodynamic" && results.components && Array.isArray(results.results)) {
      return (
        <div>
          {renderBasicProperties()}
          
          <h4 className="font-semibold mb-2">Phase Equilibrium Results</h4>
          <table className="w-full border-collapse mb-4">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <th className="border border-gray-200 dark:border-gray-700 p-2 text-left">Component</th>
                <th className="border border-gray-200 dark:border-gray-700 p-2 text-left">Liquid Mole Fraction</th>
                <th className="border border-gray-200 dark:border-gray-700 p-2 text-left">Vapor Mole Fraction</th>
                {results.kValues && <th className="border border-gray-200 dark:border-gray-700 p-2 text-left">K-Value</th>}
              </tr>
            </thead>
            <tbody>
              {results.results.map((result: any, i: number) => (
                <tr key={i}>
                  <td className="border border-gray-200 dark:border-gray-700 p-2">{result.component}</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-2">{result.liquidMoleFraction.toFixed(4)}</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-2">{result.vaporMoleFraction.toFixed(4)}</td>
                  {results.kValues && <td className="border border-gray-200 dark:border-gray-700 p-2">{results.kValues[i].toFixed(4)}</td>}
                </tr>
              ))}
            </tbody>
          </table>
          
          {results.properties && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Physical Properties</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Molecular Weight</p>
                  <p className="text-base font-medium">{results.properties.molWeight} g/mol</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Density</p>
                  <p className="text-base font-medium">{results.properties.density} kg/m³</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Viscosity</p>
                  <p className="text-base font-medium">{results.properties.viscosity} mPa·s</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Thermal Conductivity</p>
                  <p className="text-base font-medium">{results.properties.thermalConductivity} W/(m·K)</p>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    } else if (calculationType === "reaction" && results.conversionData) {
      return (
        <div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Reactor Type</p>
              <p className="text-lg font-medium">{results.reactionType}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Heat of Reaction</p>
              <p className="text-lg font-medium">{results.heatOfReaction} kJ/mol</p>
            </div>
          </div>
          
          <h4 className="font-semibold mb-2">Conversion Profile</h4>
          <table className="w-full border-collapse mb-4">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <th className="border border-gray-200 dark:border-gray-700 p-2 text-left">Time (min)</th>
                <th className="border border-gray-200 dark:border-gray-700 p-2 text-left">Conversion</th>
              </tr>
            </thead>
            <tbody>
              {results.conversionData.map((point: any, i: number) => (
                <tr key={i}>
                  <td className="border border-gray-200 dark:border-gray-700 p-2">{point.time.toFixed(2)}</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-2">{(point.conversion * 100).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <h4 className="font-semibold mb-2">Product Yields</h4>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <th className="border border-gray-200 dark:border-gray-700 p-2 text-left">Component</th>
                <th className="border border-gray-200 dark:border-gray-700 p-2 text-left">Yield</th>
              </tr>
            </thead>
            <tbody>
              {results.productYields.map((yield_: any, i: number) => (
                <tr key={i}>
                  <td className="border border-gray-200 dark:border-gray-700 p-2">{yield_.component}</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-2">{(Number(yield_.yield) * 100).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else if (calculationType === "economic" && results.paybackPeriod) {
      return (
        <div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Capital Expenditure</p>
              <p className="text-lg font-medium">${results.capitalCost.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Operating Cost (Annual)</p>
              <p className="text-lg font-medium">${results.operatingCost.toLocaleString()}/year</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Annual Revenue</p>
              <p className="text-lg font-medium">${results.annualRevenue.toLocaleString()}/year</p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Net Annual Cash Flow</p>
              <p className="text-lg font-medium">${results.netAnnualCashFlow.toLocaleString()}/year</p>
            </div>
          </div>
          
          <h4 className="font-semibold mb-2">Economic Indicators</h4>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <th className="border border-gray-200 dark:border-gray-700 p-2 text-left">Indicator</th>
                <th className="border border-gray-200 dark:border-gray-700 p-2 text-left">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 p-2">Payback Period</td>
                <td className="border border-gray-200 dark:border-gray-700 p-2">{results.paybackPeriod} years</td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 p-2">Return on Investment (ROI)</td>
                <td className="border border-gray-200 dark:border-gray-700 p-2">{results.roi}%</td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 p-2">Net Present Value (NPV)</td>
                <td className="border border-gray-200 dark:border-gray-700 p-2">${Number(results.npv).toLocaleString()}</td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 p-2">Internal Rate of Return (IRR)</td>
                <td className="border border-gray-200 dark:border-gray-700 p-2">{(Number(results.irr) * 100).toFixed(2)}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    } else if (calculationType === "heat" && results.temperatureProfile) {
      return (
        <div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Heat Duty</p>
              <p className="text-lg font-medium">{results.heatDuty} kW</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Heat Transfer Coefficient</p>
              <p className="text-lg font-medium">{results.overallHeatTransferCoefficient} W/(m²·K)</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Effective Area</p>
              <p className="text-lg font-medium">{results.effectiveArea} m²</p>
            </div>
          </div>
          
          <h4 className="font-semibold mb-2">Temperature Profile</h4>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <th className="border border-gray-200 dark:border-gray-700 p-2 text-left">Position</th>
                <th className="border border-gray-200 dark:border-gray-700 p-2 text-left">Hot Stream Temperature (°C)</th>
                <th className="border border-gray-200 dark:border-gray-700 p-2 text-left">Cold Stream Temperature (°C)</th>
              </tr>
            </thead>
            <tbody>
              {results.temperatureProfile.map((point: any, i: number) => (
                <tr key={i}>
                  <td className="border border-gray-200 dark:border-gray-700 p-2">{point.position.toFixed(2)}</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-2">{point.hotTemp.toFixed(2)}</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-2">{point.coldTemp.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else {
      // Generic results display when specific format is not available
      return (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
            <h4 className="font-semibold mb-2 text-blue-700 dark:text-blue-400">Calculation Summary</h4>
            <p className="text-gray-700 dark:text-gray-300">{results.message || "Calculation completed successfully."}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(results)
              .filter(([key]) => !['timestamp', 'inputs', 'calcType', 'category', 'message', 'components'].includes(key))
              .slice(0, 6)
              .map(([key, value]) => (
                <div key={key} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</p>
                  <p className="text-base font-medium">{typeof value === 'object' ? 'Complex data' : value}</p>
                </div>
              ))}
          </div>
        </div>
      );
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <GlassPanel className="p-6 h-full">
        {!selectedCalculation ? (
          <div>
            <h2 className="text-2xl font-medium mb-6">Select a Calculation</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentCalculations.map((calc) => (
                <div
                  key={calc.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors cursor-pointer group"
                  onClick={() => performCalculation(calc.id)}
                >
                  <div className="flex items-center mb-2">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                      <calc.icon className="h-5 w-5 text-flow-blue dark:text-blue-400" />
                    </div>
                    <h3 className="font-medium text-lg">{calc.name}</h3>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Run calculation</p>
                    <ArrowRight className="h-4 w-4 text-flow-blue opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium">
                {currentCalculations.find(c => c.id === selectedCalculation)?.name || selectedCalculation}
              </h3>
              <Button
                variant="outline"
                onClick={() => setSelectedCalculation(null)}
              >
                Choose Another Calculation
              </Button>
            </div>
            
            {isCalculating ? (
              <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
                <p className="mb-2">Performing calculation...</p>
                <Progress value={calculationProgress} className="mb-2" />
                <p className="text-sm text-gray-500">{calculationProgress}% complete</p>
              </div>
            ) : (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
                <Tabs defaultValue={calculationTab} onValueChange={setCalculationTab} className="w-full">
                  <TabsList className="w-full rounded-none border-b border-gray-200 dark:border-gray-700 bg-transparent">
                    <TabsTrigger value="input" className="flex-1 rounded-none data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-none border-r">
                      Input Parameters
                    </TabsTrigger>
                    <TabsTrigger value="results" className="flex-1 rounded-none data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-none">
                      Results
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="input" className="p-6 focus:outline-none">
                    {renderInputFields()}
                    
                    <div className="mt-6 flex justify-end">
                      <Button
                        onClick={() => performCalculation(selectedCalculation)}
                      >
                        Run Calculation
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="results" className="p-6 focus:outline-none">
                    <h4 className="text-lg font-medium mb-4">Results</h4>
                    
                    {renderResults()}
                    
                    <div className="mt-6 flex justify-between">
                      <Button variant="outline" className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        <span>View Documentation</span>
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2">
                        <DownloadCloud className="h-4 w-4" />
                        <span>Export Results</span>
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        )}
      </GlassPanel>
    </div>
  );
};

export default AspenCalculations;
