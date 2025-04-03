import React, { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GlassPanel from "@/components/ui/GlassPanel";
import { Calculator, Droplets, Beaker, Thermometer, Waves, Zap, Shield, Cpu, Leaf } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface CalculationCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  calculations: string[];
}

interface CalculationInput {
  id: string;
  label: string;
  value: string;
  unit: string;
  placeholder?: string;
}

const AspenCalculations: React.FC = () => {
  const [activeTab, setActiveTab] = useState("heatTransfer");
  const [selectedCalculation, setSelectedCalculation] = useState<string | null>(null);
  const [calculationResult, setCalculationResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [calculationProgress, setCalculationProgress] = useState(0);
  const [calculationInputs, setCalculationInputs] = useState<CalculationInput[]>([]);
  const progressInterval = useRef<number | null>(null);
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

    return () => {
      if (progressInterval.current) {
        window.clearInterval(progressInterval.current);
      }
    };
  }, []);

  const getDefaultInputs = (calculation: string): CalculationInput[] => {
    switch (calculation) {
      case "LMTD (Log Mean Temperature Difference)":
        return [
          { id: "t1_hot", label: "Hot Fluid Inlet Temperature", value: "150", unit: "°C", placeholder: "e.g., 150" },
          { id: "t2_hot", label: "Hot Fluid Outlet Temperature", value: "90", unit: "°C", placeholder: "e.g., 90" },
          { id: "t1_cold", label: "Cold Fluid Inlet Temperature", value: "30", unit: "°C", placeholder: "e.g., 30" },
          { id: "t2_cold", label: "Cold Fluid Outlet Temperature", value: "80", unit: "°C", placeholder: "e.g., 80" }
        ];
      case "Heat Exchanger Effectiveness":
        return [
          { id: "c_min", label: "Minimum Heat Capacity Rate", value: "5000", unit: "W/K", placeholder: "e.g., 5000" },
          { id: "c_max", label: "Maximum Heat Capacity Rate", value: "8000", unit: "W/K", placeholder: "e.g., 8000" },
          { id: "ua", label: "Overall Heat Transfer Coefficient × Area", value: "10000", unit: "W/K", placeholder: "e.g., 10000" },
          { id: "t_hot_in", label: "Hot Fluid Inlet Temperature", value: "150", unit: "°C", placeholder: "e.g., 150" },
          { id: "t_cold_in", label: "Cold Fluid Inlet Temperature", value: "30", unit: "°C", placeholder: "e.g., 30" }
        ];
      case "Heat Duty Calculation":
        return [
          { id: "mass_flow", label: "Mass Flow Rate", value: "5", unit: "kg/s", placeholder: "e.g., 5" },
          { id: "cp", label: "Specific Heat Capacity", value: "4.18", unit: "kJ/kg·K", placeholder: "e.g., 4.18" },
          { id: "t_in", label: "Inlet Temperature", value: "25", unit: "°C", placeholder: "e.g., 25" },
          { id: "t_out", label: "Outlet Temperature", value: "85", unit: "°C", placeholder: "e.g., 85" }
        ];
      case "Overall Heat Transfer Coefficient (U-value)":
        return [
          { id: "h_hot", label: "Hot Side Heat Transfer Coefficient", value: "1000", unit: "W/m²·K", placeholder: "e.g., 1000" },
          { id: "h_cold", label: "Cold Side Heat Transfer Coefficient", value: "800", unit: "W/m²·K", placeholder: "e.g., 800" },
          { id: "k_wall", label: "Wall Thermal Conductivity", value: "16", unit: "W/m·K", placeholder: "e.g., 16" },
          { id: "thickness", label: "Wall Thickness", value: "0.002", unit: "m", placeholder: "e.g., 0.002" },
          { id: "fouling_hot", label: "Hot Side Fouling Resistance", value: "0.0001", unit: "m²·K/W", placeholder: "e.g., 0.0001" },
          { id: "fouling_cold", label: "Cold Side Fouling Resistance", value: "0.0002", unit: "m²·K/W", placeholder: "e.g., 0.0002" }
        ];
      default:
        return [];
    }
  };

  const calculateLMTD = (inputs: CalculationInput[]): string => {
    const t1_hot = parseFloat(inputs.find(i => i.id === "t1_hot")?.value || "0");
    const t2_hot = parseFloat(inputs.find(i => i.id === "t2_hot")?.value || "0");
    const t1_cold = parseFloat(inputs.find(i => i.id === "t1_cold")?.value || "0");
    const t2_cold = parseFloat(inputs.find(i => i.id === "t2_cold")?.value || "0");
    
    const dt1 = t1_hot - t2_cold;
    const dt2 = t2_hot - t1_cold;
    
    if (dt1 <= 0 || dt2 <= 0) {
      return `## Error in LMTD Calculation
      
Temperature differences must be positive for a valid LMTD calculation.
Current values:
- ΔT1 (T1_hot - T2_cold) = ${dt1}°C
- ΔT2 (T2_hot - T1_cold) = ${dt2}°C

Please adjust input temperatures to ensure proper temperature driving forces.`;
    }
    
    if (Math.abs(dt1 - dt2) < 0.001) {
      const lmtd = dt1;
      return `## LMTD Calculation Results

### Input Data
- Hot fluid inlet temperature (T1_hot): ${t1_hot}°C
- Hot fluid outlet temperature (T2_hot): ${t2_hot}°C
- Cold fluid inlet temperature (T1_cold): ${t1_cold}°C
- Cold fluid outlet temperature (T2_cold): ${t2_cold}°C

### Calculation Process
Since ΔT1 ≈ ΔT2 (difference less than 0.001°C), the arithmetic mean is used instead of logarithmic mean.

ΔT1 = T1_hot - T2_cold = ${t1_hot} - ${t2_cold} = ${dt1.toFixed(2)}°C
ΔT2 = T2_hot - T1_cold = ${t2_hot} - ${t1_cold} = ${dt2.toFixed(2)}°C
LMTD = ΔT1 = ${lmtd.toFixed(2)}°C

### Result
LMTD = ${lmtd.toFixed(2)}°C

### Application
This LMTD value can be used in the heat exchanger design equation:
Q = U × A × LMTD

Where:
- Q is the heat transfer rate (W)
- U is the overall heat transfer coefficient (W/m²·K)
- A is the heat transfer area (m²)`;
    }
    
    const lmtd = (dt1 - dt2) / Math.log(dt1 / dt2);
    
    return `## LMTD Calculation Results

### Input Data
- Hot fluid inlet temperature (T1_hot): ${t1_hot}°C
- Hot fluid outlet temperature (T2_hot): ${t2_hot}°C
- Cold fluid inlet temperature (T1_cold): ${t1_cold}°C
- Cold fluid outlet temperature (T2_cold): ${t2_cold}°C

### Calculation Process
ΔT1 = T1_hot - T2_cold = ${t1_hot} - ${t2_cold} = ${dt1.toFixed(2)}°C
ΔT2 = T2_hot - T1_cold = ${t2_hot} - ${t1_cold} = ${dt2.toFixed(2)}°C
LMTD = (ΔT1 - ΔT2) / ln(ΔT1/ΔT2) = (${dt1.toFixed(2)} - ${dt2.toFixed(2)}) / ln(${dt1.toFixed(2)}/${dt2.toFixed(2)}) = ${lmtd.toFixed(2)}°C

### Result
LMTD = ${lmtd.toFixed(2)}°C

### Application
This LMTD value can be used in the heat exchanger design equation:
Q = U × A × LMTD

Where:
- Q is the heat transfer rate (W)
- U is the overall heat transfer coefficient (W/m²·K)
- A is the heat transfer area (m²)

### Correction Factor
For non-counter-current flow arrangements (like cross-flow or multi-pass shell and tube exchangers), a correction factor F must be applied:
Q = U × A × LMTD × F

Typical correction factor values:
- Counter-current flow: F = 1.0
- Co-current flow: F < 1.0
- Cross-flow (both fluids unmixed): 0.9 < F < 1.0
- Shell-and-tube (one shell pass, two or more tube passes): 0.8 < F < 0.9`;
  };

  const calculateEffectiveness = (inputs: CalculationInput[]): string => {
    const c_min = parseFloat(inputs.find(i => i.id === "c_min")?.value || "0");
    const c_max = parseFloat(inputs.find(i => i.id === "c_max")?.value || "0");
    const ua = parseFloat(inputs.find(i => i.id === "ua")?.value || "0");
    const t_hot_in = parseFloat(inputs.find(i => i.id === "t_hot_in")?.value || "0");
    const t_cold_in = parseFloat(inputs.find(i => i.id === "t_cold_in")?.value || "0");
    
    const ntu = ua / c_min;
    
    const c_ratio = c_min / c_max;
    
    let effectiveness = 0;
    
    if (c_ratio < 0.99) {
      effectiveness = (1 - Math.exp(-ntu * (1 - c_ratio))) / (1 - c_ratio * Math.exp(-ntu * (1 - c_ratio)));
    } else {
      effectiveness = ntu / (1 + ntu);
    }
    
    const q_max = c_min * (t_hot_in - t_cold_in);
    const q_actual = effectiveness * q_max;
    
    const t_hot_out = t_hot_in - q_actual / (c_ratio < 1 ? c_max : c_min);
    const t_cold_out = t_cold_in + q_actual / (c_ratio < 1 ? c_min : c_max);
    
    return `## Heat Exchanger Effectiveness Calculation Results

### Input Data
- Minimum heat capacity rate (Cmin): ${c_min} W/K
- Maximum heat capacity rate (Cmax): ${c_max} W/K
- Overall heat transfer coefficient × Area (UA): ${ua} W/K
- Hot fluid inlet temperature: ${t_hot_in}°C
- Cold fluid inlet temperature: ${t_cold_in}°C

### Calculation Process
1. NTU (Number of Transfer Units) = UA / Cmin = ${ua} / ${c_min} = ${ntu.toFixed(3)}
2. Capacity ratio (Cr) = Cmin / Cmax = ${c_min} / ${c_max} = ${c_ratio.toFixed(3)}
3. For counter-current flow arrangement with Cr = ${c_ratio.toFixed(3)}:
   Effectiveness (ε) = ${effectiveness.toFixed(4)} or ${(effectiveness * 100).toFixed(2)}%

### Results
- Heat exchanger effectiveness: ${(effectiveness * 100).toFixed(2)}%
- Maximum possible heat transfer rate: Qmax = Cmin × (Thot,in - Tcold,in) = ${q_max.toFixed(0)} W
- Actual heat transfer rate: Qactual = ε × Qmax = ${q_actual.toFixed(0)} W
- Hot fluid outlet temperature: ${t_hot_out.toFixed(2)}°C
- Cold fluid outlet temperature: ${t_cold_out.toFixed(2)}°C

### Interpretation
This heat exchanger is operating at ${(effectiveness * 100).toFixed(2)}% of its theoretical maximum performance for the given flow conditions. ${effectiveness > 0.8 ? "This indicates a well-designed and efficient exchanger." : effectiveness > 0.6 ? "This indicates a reasonably efficient exchanger with some room for improvement." : "This indicates a heat exchanger that could benefit from design optimization."}`;
  };

  const calculateHeatDuty = (inputs: CalculationInput[]): string => {
    const mass_flow = parseFloat(inputs.find(i => i.id === "mass_flow")?.value || "0");
    const cp = parseFloat(inputs.find(i => i.id === "cp")?.value || "0");
    const t_in = parseFloat(inputs.find(i => i.id === "t_in")?.value || "0");
    const t_out = parseFloat(inputs.find(i => i.id === "t_out")?.value || "0");
    
    const delta_t = t_out - t_in;
    const heat_duty = mass_flow * cp * delta_t;
    
    const heat_duty_kw = heat_duty;
    const heat_duty_mw = heat_duty / 1000;
    const heat_duty_btu_hr = heat_duty * 3412.14;
    
    return `## Heat Duty Calculation Results

### Input Data
- Mass flow rate: ${mass_flow} kg/s
- Specific heat capacity: ${cp} kJ/kg·K
- Inlet temperature: ${t_in}°C
- Outlet temperature: ${t_out}°C

### Calculation Process
Heat duty (Q) = Mass flow rate × Specific heat capacity × Temperature difference
Q = ${mass_flow} kg/s × ${cp} kJ/kg·K × (${t_out}°C - ${t_in}°C)
Q = ${mass_flow} kg/s × ${cp} kJ/kg·K × ${delta_t}°C
Q = ${heat_duty.toFixed(2)} kW

### Results
- Heat duty: ${heat_duty.toFixed(2)} kW
- Heat duty: ${heat_duty_mw.toFixed(4)} MW
- Heat duty: ${heat_duty_btu_hr.toFixed(0)} BTU/hr

### Applications
This heat duty can be used to:
1. Size heat exchangers by determining the required heat transfer area
2. Determine utility requirements (steam, cooling water, etc.)
3. Estimate operating costs for heating/cooling processes
4. Evaluate energy efficiency improvements

### Additional Considerations
- For heat exchangers, this heat duty must be balanced with the heat transferred to/from the other fluid stream
- The specific heat capacity can vary with temperature for many fluids
- For phase change processes, latent heat must also be considered`;
  };

  const calculateUValue = (inputs: CalculationInput[]): string => {
    const h_hot = parseFloat(inputs.find(i => i.id === "h_hot")?.value || "0");
    const h_cold = parseFloat(inputs.find(i => i.id === "h_cold")?.value || "0");
    const k_wall = parseFloat(inputs.find(i => i.id === "k_wall")?.value || "0");
    const thickness = parseFloat(inputs.find(i => i.id === "thickness")?.value || "0");
    const fouling_hot = parseFloat(inputs.find(i => i.id === "fouling_hot")?.value || "0");
    const fouling_cold = parseFloat(inputs.find(i => i.id === "fouling_cold")?.value || "0");
    
    const r_hot = 1 / h_hot;
    const r_wall = thickness / k_wall;
    const r_cold = 1 / h_cold;
    const r_fouling = fouling_hot + fouling_cold;
    const r_total = r_hot + r_wall + r_cold + r_fouling;
    
    const u_value = 1 / r_total;
    
    const pct_hot = (r_hot / r_total) * 100;
    const pct_wall = (r_wall / r_total) * 100;
    const pct_cold = (r_cold / r_total) * 100;
    const pct_fouling = (r_fouling / r_total) * 100;
    
    return `## Overall Heat Transfer Coefficient (U-value) Calculation Results

### Input Data
- Hot side heat transfer coefficient: ${h_hot} W/m²·K
- Cold side heat transfer coefficient: ${h_cold} W/m²·K
- Wall thermal conductivity: ${k_wall} W/m·K
- Wall thickness: ${thickness} m
- Hot side fouling resistance: ${fouling_hot} m²·K/W
- Cold side fouling resistance: ${fouling_cold} m²·K/W

### Calculation Process - Thermal Resistance Method
1. Hot side convective resistance: Rh = 1/h_hot = 1/${h_hot} = ${r_hot.toFixed(6)} m²·K/W
2. Wall conductive resistance: Rw = thickness/k_wall = ${thickness}/${k_wall} = ${r_wall.toFixed(6)} m²·K/W
3. Cold side convective resistance: Rc = 1/h_cold = 1/${h_cold} = ${r_cold.toFixed(6)} m²·K/W
4. Total fouling resistance: Rf = Rf_hot + Rf_cold = ${fouling_hot} + ${fouling_cold} = ${r_fouling.toFixed(6)} m²·K/W
5. Total thermal resistance: Rtotal = Rh + Rw + Rc + Rf = ${r_total.toFixed(6)} m²·K/W
6. Overall heat transfer coefficient: U = 1/Rtotal = 1/${r_total.toFixed(6)} = ${u_value.toFixed(2)} W/m²·K

### Results
- Overall heat transfer coefficient (U-value): ${u_value.toFixed(2)} W/m²·K

### Resistance Distribution Analysis
- Hot side convection: ${pct_hot.toFixed(1)}% of total resistance
- Wall conduction: ${pct_wall.toFixed(1)}% of total resistance
- Cold side convection: ${pct_cold.toFixed(1)}% of total resistance
- Fouling layers: ${pct_fouling.toFixed(1)}% of total resistance

### Interpretation
${pct_fouling > 50 ? "Fouling dominates the heat transfer resistance. Cleaning or anti-fouling measures would significantly improve performance." : 
  pct_hot > 50 ? "Hot side convection is the limiting factor. Increasing turbulence or surface area on the hot side would improve performance." :
  pct_cold > 50 ? "Cold side convection is the limiting factor. Increasing turbulence or surface area on the cold side would improve performance." :
  pct_wall > 50 ? "Wall conduction is the limiting factor. A thinner wall or material with higher thermal conductivity would improve performance." :
  "Heat transfer resistances are relatively balanced across all components."}

### Typical U-values for Reference
- Water to water (shell & tube): 800-1500 W/m²·K
- Water to light organics: 500-1000 W/m²·K
- Water to heavy organics: 250-500 W/m²·K
- Organics to organics: 100-300 W/m²·K
- Water to gases: 20-300 W/m²·K
- Gas to gas: 10-50 W/m²·K`;
  };

  const calculateResults = (calculation: string, inputs: CalculationInput[]): string => {
    switch (calculation) {
      case "LMTD (Log Mean Temperature Difference)":
        return calculateLMTD(inputs);
      case "Heat Exchanger Effectiveness":
        return calculateEffectiveness(inputs);
      case "Heat Duty Calculation":
        return calculateHeatDuty(inputs);
      case "Overall Heat Transfer Coefficient (U-value)":
        return calculateUValue(inputs);
      default:
        return "Calculation not implemented with direct formulas yet. Using AI assistance instead.";
    }
  };

  const performCalculation = async (calculation: string) => {
    setSelectedCalculation(calculation);
    setIsLoading(true);
    setCalculationProgress(0);
    
    const inputs = getDefaultInputs(calculation);
    setCalculationInputs(inputs);
    
    if (progressInterval.current) {
      window.clearInterval(progressInterval.current);
    }
    
    progressInterval.current = window.setInterval(() => {
      setCalculationProgress(prev => {
        const newProgress = prev + (100 - prev) * 0.1;
        return newProgress >= 99 ? 99 : newProgress;
      });
    }, 100);
    
    try {
      const directResult = calculateResults(calculation, inputs);
      
      if (directResult !== "Calculation not implemented with direct formulas yet. Using AI assistance instead.") {
        setTimeout(() => {
          setCalculationResult(directResult);
          setCalculationProgress(100);
          
          if (progressInterval.current) {
            window.clearInterval(progressInterval.current);
            progressInterval.current = null;
          }
          
          setIsLoading(false);
          
          toast({
            title: "Calculation Completed",
            description: `Analysis for ${calculation} is ready`
          });
        }, 800);
        
        return;
      }
      
      const defaultResponse = `# ${calculation}\n\nThis calculation requires more advanced processing which is currently unavailable.\n\nPlease try one of the implemented calculations like LMTD, Heat Exchanger Effectiveness, Heat Duty Calculation, or Overall Heat Transfer Coefficient.`;
      setCalculationResult(defaultResponse);
      
      setCalculationProgress(100);
      
      if (progressInterval.current) {
        window.clearInterval(progressInterval.current);
        progressInterval.current = null;
      }
      
      toast({
        title: "Calculation Notice",
        description: `This calculation requires advanced processing which is currently unavailable.`
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
      
      if (progressInterval.current) {
        window.clearInterval(progressInterval.current);
        progressInterval.current = null;
      }
    }
  };

  const handleInputChange = (id: string, value: string) => {
    setCalculationInputs(prev => 
      prev.map(input => 
        input.id === id ? { ...input, value } : input
      )
    );
    
    if (selectedCalculation && calculationInputs.length > 0) {
      const directResult = calculateResults(selectedCalculation, 
        calculationInputs.map(input => 
          input.id === id ? { ...input, value } : input
        )
      );
      
      if (directResult !== "Calculation not implemented with direct formulas yet. Using AI assistance instead.") {
        setCalculationResult(directResult);
      }
    }
  };

  const runRealTimeCalculation = () => {
    if (selectedCalculation && calculationInputs.length > 0) {
      const directResult = calculateResults(selectedCalculation, calculationInputs);
      
      if (directResult !== "Calculation not implemented with direct formulas yet. Using AI assistance instead.") {
        setCalculationResult(directResult);
        
        toast({
          title: "Calculation Updated",
          description: `Real-time analysis updated for ${selectedCalculation}`
        });
      } else {
        performCalculation(selectedCalculation);
      }
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
                      <div className="w-full max-w-md mb-3">
                        <Progress value={calculationProgress} className="h-2" />
                      </div>
                      <div className="w-12 h-12 border-2 border-flow-blue/20 border-t-flow-blue rounded-full animate-spin mb-4"></div>
                      <p className="text-gray-500">Generating detailed calculation...</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {calculationInputs.length > 0 && (
                        <div className="space-y-4 mb-6 p-5 bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <h5 className="font-medium">Calculation Inputs</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {calculationInputs.map((input) => (
                              <div key={input.id} className="flex flex-col space-y-1">
                                <label htmlFor={input.id} className="text-sm text-gray-600 dark:text-gray-400">
                                  {input.label}
                                </label>
                                <div className="flex rounded-md overflow-hidden">
                                  <input
                                    id={input.id}
                                    type="text"
                                    value={input.value}
                                    placeholder={input.placeholder}
                                    onChange={(e) => handleInputChange(input.id, e.target.value)}
                                    className="flex-1 px-3 py-2 border rounded-l-md dark:bg-gray-800 dark:border-gray-700"
                                  />
                                  <span className="inline-flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-2 border border-l-0 rounded-r-md text-gray-500 dark:text-gray-400">
                                    {input.unit}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="pt-4">
                            <Button onClick={runRealTimeCalculation} className="w-full bg-flow-blue hover:bg-flow-blue/90">
                              Update Calculation
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      <div className="prose dark:prose-invert max-w-none">
                        {calculationResult ? (
                          <div dangerouslySetInnerHTML={{ __html: calculationResult.replace(/\n/g, '<br>').replace(/#{1,6}\s?(.*)/g, '<h4>$1</h4>') }} />
                        ) : (
                          <p className="text-gray-500">Select a calculation to view detailed analysis</p>
                        )}
                      </div>
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
