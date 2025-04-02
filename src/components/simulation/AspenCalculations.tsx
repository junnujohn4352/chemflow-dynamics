
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GlassPanel from "@/components/ui/GlassPanel";
import { Calculator, Droplets, Beaker, Thermometer, Waves, Zap, Shield, Cpu, Leaf } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LlamaService from "@/services/LlamaService";

interface CalculationCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  calculations: string[];
}

const AspenCalculations: React.FC = () => {
  const [activeTab, setActiveTab] = useState("heatTransfer");
  const [selectedCalculation, setSelectedCalculation] = useState<string | null>(null);
  const [calculationResult, setCalculationResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const calculationCategories: CalculationCategory[] = [
    {
      id: "heatTransfer",
      title: "Heat Transfer Calculations",
      icon: <Thermometer className="h-5 w-5" />,
      calculations: [
        "LMTD (Log Mean Temperature Difference)",
        "NTU (Number of Transfer Units) Method",
        "Heat Exchanger Effectiveness",
        "Heat Duty Calculation",
        "Overall Heat Transfer Coefficient (U-value)",
        "Fouling Factor Estimation",
        "Fin Efficiency in Heat Exchangers",
        "Thermal Conductivity Calculations",
        "Condensation and Boiling Heat Transfer Coefficients",
        "Cooling Tower Performance Analysis"
      ]
    },
    {
      id: "fluidFlow",
      title: "Fluid Flow & Pressure Drop",
      icon: <Waves className="h-5 w-5" />,
      calculations: [
        "Bernoulli's Equation Applications",
        "Darcy-Weisbach Equation for Pipe Flow",
        "Friction Factor Calculation (Moody Chart)",
        "Two-Phase Flow Analysis (Homogeneous & Separated Models)",
        "Cv/Kv Valve Sizing",
        "Orifice and Nozzle Flow Calculations",
        "Reynolds Number & Flow Regime Identification",
        "Compressible and Incompressible Flow Analysis",
        "Pump Sizing and Performance (NPSH, Efficiency, Power)",
        "Compressor Polytropic & Isentropic Efficiency",
        "Venturi Meter and Flow Measurement Calculations"
      ]
    },
    {
      id: "thermodynamics",
      title: "Thermodynamics & Phase Equilibrium",
      icon: <Zap className="h-5 w-5" />,
      calculations: [
        "VLE (Vapor-Liquid Equilibrium) Calculations",
        "LLE (Liquid-Liquid Equilibrium) Calculations",
        "SLE (Solid-Liquid Equilibrium) Calculations",
        "Bubble Point and Dew Point Calculations",
        "Henry's Law and Fugacity Calculations",
        "Thermodynamic Property Estimation (Enthalpy, Entropy, Gibbs Free Energy)",
        "Joule-Thomson Coefficient Calculation",
        "Compressibility Factor (Z) Calculation",
        "Equations of State (Peng-Robinson, Soave-Redlich-Kwong, etc.)",
        "Heat Capacity (Cp, Cv) Estimation",
        "Steam Table Calculations"
      ]
    },
    {
      id: "massTransfer",
      title: "Mass Transfer & Separation Processes",
      icon: <Droplets className="h-5 w-5" />,
      calculations: [
        "Distillation Column Design & Rating",
        "McCabe-Thiele Analysis for Distillation",
        "Absorption/Stripping Column Performance",
        "Mass Transfer Coefficients (K_L, K_G)",
        "Liquid-Liquid Extraction Calculations",
        "Membrane Separation Analysis",
        "Relative Volatility and Separation Factor",
        "Flash Drum Calculations",
        "Reflux Ratio Calculation"
      ]
    },
    {
      id: "reactionEngineering",
      title: "Reaction Engineering",
      icon: <Beaker className="h-5 w-5" />,
      calculations: [
        "Conversion, Yield, and Selectivity Calculations",
        "Batch, CSTR, and PFR Reactor Sizing",
        "Rate of Reaction and Rate Constant Estimation",
        "Activation Energy Calculation (Arrhenius Equation)",
        "Residence Time Distribution (RTD) Analysis",
        "Exothermic & Endothermic Reaction Heat Duty",
        "Equilibrium Constant Calculation"
      ]
    },
    {
      id: "safetyAnalysis",
      title: "Safety & Relief System Analysis",
      icon: <Shield className="h-5 w-5" />,
      calculations: [
        "Relief Valve Sizing (API 520, 521)",
        "Depressurization Analysis",
        "Flammability & Explosivity Limits (LEL, UEL)",
        "Adiabatic Compression & Autoignition Temperature",
        "Overpressure Scenario Analysis",
        "Fire Case Heat Input Calculation",
        "PSV (Pressure Safety Valve) Blowdown Calculations"
      ]
    },
    {
      id: "processSimulation",
      title: "Process Simulation & Optimization",
      icon: <Cpu className="h-5 w-5" />,
      calculations: [
        "Steady-State and Dynamic Process Simulations",
        "Process Energy Optimization (Pinch Analysis)",
        "Cost Estimation & Economic Feasibility Analysis",
        "Sensitivity Analysis for Design Variables",
        "Plant Performance & Efficiency Analysis"
      ]
    },
    {
      id: "utilityEnvironmental",
      title: "Utility & Environmental Calculations",
      icon: <Leaf className="h-5 w-5" />,
      calculations: [
        "Cooling Water and Steam Consumption Calculations",
        "Carbon Footprint & Emission Estimations",
        "Air & Water Pollution Control Modeling"
      ]
    }
  ];

  useEffect(() => {
    // Load the LLaMA model on component mount
    const loadModel = async () => {
      try {
        await LlamaService.getInstance().loadModel();
      } catch (error) {
        console.error("Error loading model:", error);
      }
    };
    
    loadModel();
    
    // Check if there's a subject from URL params or localStorage
    const storedSubject = localStorage.getItem('chemflow-simulation-subject');
    if (storedSubject) {
      switch (storedSubject.toLowerCase()) {
        case 'heat transfer':
        case 'thermal':
          setActiveTab('heatTransfer');
          break;
        case 'fluid flow':
        case 'pressure':
        case 'hydraulics':
          setActiveTab('fluidFlow');
          break;
        case 'thermodynamics':
        case 'equilibrium':
          setActiveTab('thermodynamics');
          break;
        case 'distillation':
        case 'mass transfer':
        case 'separation':
          setActiveTab('massTransfer');
          break;
        case 'reaction':
        case 'reactor':
          setActiveTab('reactionEngineering');
          break;
        case 'safety':
        case 'relief':
          setActiveTab('safetyAnalysis');
          break;
        case 'simulation':
        case 'optimization':
          setActiveTab('processSimulation');
          break;
        case 'utility':
        case 'environmental':
          setActiveTab('utilityEnvironmental');
          break;
      }
    }
  }, []);

  const performCalculation = async (calculation: string) => {
    setSelectedCalculation(calculation);
    setIsLoading(true);
    
    try {
      const categoryName = calculationCategories.find(cat => cat.id === activeTab)?.title || "";
      const prompt = `Explain how to calculate ${calculation} in ${categoryName}. Show step by step methodology and include an example calculation.`;
      
      const response = await LlamaService.getInstance().generateResponse(prompt);
      setCalculationResult(response);
      
      toast({
        title: "Calculation Completed",
        description: `Analysis for ${calculation} is ready`
      });
    } catch (error) {
      console.error("Error generating calculation:", error);
      toast({
        title: "Calculation Failed",
        description: "Unable to perform calculation at this time",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GlassPanel className="p-6">
      <h2 className="text-2xl font-display font-bold mb-6">Aspen HYSYS Calculations</h2>
      
      <Tabs 
        defaultValue="heatTransfer" 
        value={activeTab} 
        onValueChange={setActiveTab}
      >
        <TabsList className="mb-6 flex flex-wrap">
          {calculationCategories.map((category) => (
            <TabsTrigger 
              key={category.id} 
              value={category.id}
              className="flex items-center gap-2"
            >
              {category.icon}
              <span className="hidden sm:inline">{category.title}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {calculationCategories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <div className="space-y-4">
              <h3 className="text-xl font-medium mb-4">{category.title}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.calculations.map((calculation, idx) => (
                  <div 
                    key={idx} 
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedCalculation === calculation
                        ? 'border-flow-blue bg-flow-blue/5'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                    } shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700`}
                    onClick={() => performCalculation(calculation)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-full p-2 bg-gray-100 dark:bg-gray-700 text-flow-blue dark:text-flow-cyan">
                        <Calculator className="h-4 w-4" />
                      </div>
                      <span>{calculation}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              {selectedCalculation && (
                <div className="mt-8 p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-medium">{selectedCalculation}</h4>
                    <div className="px-3 py-1 rounded-full bg-flow-blue/10 text-flow-blue text-xs font-medium">
                      {category.title}
                    </div>
                  </div>
                  
                  {isLoading ? (
                    <div className="py-8 flex flex-col items-center justify-center">
                      <div className="w-12 h-12 border-2 border-flow-blue/20 border-t-flow-blue rounded-full animate-spin mb-4"></div>
                      <p className="text-gray-500">Generating detailed calculation...</p>
                    </div>
                  ) : (
                    <div className="prose dark:prose-invert max-w-none">
                      {calculationResult ? (
                        <div dangerouslySetInnerHTML={{ __html: calculationResult.replace(/\n/g, '<br>').replace(/#{1,6}\s?(.*)/g, '<h4>$1</h4>') }} />
                      ) : (
                        <p className="text-gray-500">Select a calculation to view detailed analysis</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </GlassPanel>
  );
};

export default AspenCalculations;
