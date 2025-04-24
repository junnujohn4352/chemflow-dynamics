
import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import GlassPanel from "@/components/ui/GlassPanel";
import { Search, Atom, Calculator, Waves, Thermometer, Gauge } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type FormulaCategory = 
  | "thermodynamics" 
  | "fluid-dynamics" 
  | "mass-transfer" 
  | "heat-transfer" 
  | "reaction-kinetics" 
  | "process-control";

type Formula = {
  id: string;
  name: string;
  formula: string;
  description: string;
  variables: Array<{symbol: string; name: string}>;
  applications: string[];
  category: FormulaCategory;
  color: string;
};

const formulasData: Formula[] = [
  {
    id: "reynolds",
    name: "Reynolds Number",
    formula: "Re = ρvD/μ",
    description: "Ratio of inertial forces to viscous forces within a fluid - determines flow regime (laminar or turbulent).",
    variables: [
      {symbol: "Re", name: "Reynolds number"},
      {symbol: "ρ", name: "Density of fluid"},
      {symbol: "v", name: "Flow velocity"},
      {symbol: "D", name: "Characteristic length"},
      {symbol: "μ", name: "Dynamic viscosity"}
    ],
    applications: ["Pipe flow", "Heat exchangers", "Packed beds", "Flow around objects"],
    category: "fluid-dynamics",
    color: "bg-flow-blue/10"
  },
  {
    id: "bernoulli",
    name: "Bernoulli's Equation",
    formula: "P₁ + ½ρv₁² + ρgh₁ = P₂ + ½ρv₂² + ρgh₂",
    description: "Conservation of energy for fluid flow - relates pressure, velocity and elevation in a fluid.",
    variables: [
      {symbol: "P", name: "Pressure"},
      {symbol: "ρ", name: "Density of fluid"},
      {symbol: "v", name: "Flow velocity"},
      {symbol: "g", name: "Gravitational acceleration"},
      {symbol: "h", name: "Height"}
    ],
    applications: ["Venturi meters", "Orifice plates", "Flow measurement", "Nozzles"],
    category: "fluid-dynamics",
    color: "bg-flow-cyan/10"
  },
  {
    id: "mass-balance",
    name: "Mass Balance",
    formula: "∑(ṁᵢₙ) = ∑(ṁₒᵤₜ) + ∑(ṁₐccumulation)",
    description: "Conservation of mass in a control volume - total mass entering equals total mass leaving plus accumulation.",
    variables: [
      {symbol: "ṁᵢₙ", name: "Mass flow rate in"},
      {symbol: "ṁₒᵤₜ", name: "Mass flow rate out"},
      {symbol: "ṁₐccumulation", name: "Mass accumulation rate"}
    ],
    applications: ["Reactors", "Separators", "Tanks", "Process units"],
    category: "mass-transfer",
    color: "bg-flow-teal/10"
  },
  {
    id: "energy-balance",
    name: "Energy Balance",
    formula: "Q - W = ΔE",
    description: "First law of thermodynamics - energy can be transferred as heat or work, but total energy is conserved.",
    variables: [
      {symbol: "Q", name: "Heat added to system"},
      {symbol: "W", name: "Work done by system"},
      {symbol: "ΔE", name: "Change in total energy"}
    ],
    applications: ["Heat exchangers", "Power cycles", "Refrigeration", "Combustion"],
    category: "thermodynamics",
    color: "bg-indigo-500/10"
  },
  {
    id: "gibbs-free-energy",
    name: "Gibbs Free Energy",
    formula: "ΔG = ΔH - TΔS",
    description: "Thermodynamic potential that measures the maximum reversible work at constant T and P.",
    variables: [
      {symbol: "ΔG", name: "Change in Gibbs free energy"},
      {symbol: "ΔH", name: "Change in enthalpy"},
      {symbol: "T", name: "Temperature"},
      {symbol: "ΔS", name: "Change in entropy"}
    ],
    applications: ["Chemical equilibrium", "Phase equilibrium", "Electrochemistry", "Reaction feasibility"],
    category: "thermodynamics",
    color: "bg-purple-500/10"
  },
  {
    id: "arrhenius",
    name: "Arrhenius Equation",
    formula: "k = A·e^(-E_a/RT)",
    description: "Describes temperature dependence of reaction rates.",
    variables: [
      {symbol: "k", name: "Reaction rate constant"},
      {symbol: "A", name: "Pre-exponential factor"},
      {symbol: "E_a", name: "Activation energy"},
      {symbol: "R", name: "Universal gas constant"},
      {symbol: "T", name: "Absolute temperature"}
    ],
    applications: ["Chemical reactor design", "Reaction engineering", "Kinetics studies", "Catalyst assessment"],
    category: "reaction-kinetics",
    color: "bg-amber-500/10"
  },
  {
    id: "fourier-law",
    name: "Fourier's Law",
    formula: "q = -k(∂T/∂x)",
    description: "Rate of heat transfer is proportional to the negative temperature gradient.",
    variables: [
      {symbol: "q", name: "Heat flux"},
      {symbol: "k", name: "Thermal conductivity"},
      {symbol: "∂T/∂x", name: "Temperature gradient"}
    ],
    applications: ["Heat exchangers", "Insulation design", "Cooling systems", "Electronic devices"],
    category: "heat-transfer",
    color: "bg-emerald-500/10"
  },
  {
    id: "fick-law",
    name: "Fick's Law",
    formula: "J = -D(∂c/∂x)",
    description: "Rate of diffusion is proportional to the negative concentration gradient.",
    variables: [
      {symbol: "J", name: "Diffusion flux"},
      {symbol: "D", name: "Diffusion coefficient"},
      {symbol: "∂c/∂x", name: "Concentration gradient"}
    ],
    applications: ["Mass transfer operations", "Membrane separations", "Drug delivery", "Controlled release"],
    category: "mass-transfer",
    color: "bg-teal-500/10"
  },
  {
    id: "nusselt",
    name: "Nusselt Number",
    formula: "Nu = hL/k",
    description: "Ratio of convective to conductive heat transfer across a boundary.",
    variables: [
      {symbol: "Nu", name: "Nusselt number"},
      {symbol: "h", name: "Convective heat transfer coefficient"},
      {symbol: "L", name: "Characteristic length"},
      {symbol: "k", name: "Thermal conductivity"}
    ],
    applications: ["Heat exchangers", "Cooling fins", "Natural convection", "Forced convection"],
    category: "heat-transfer",
    color: "bg-green-500/10"
  },
  {
    id: "prandtl",
    name: "Prandtl Number",
    formula: "Pr = C_p·μ/k",
    description: "Ratio of momentum diffusivity to thermal diffusivity.",
    variables: [
      {symbol: "Pr", name: "Prandtl number"},
      {symbol: "C_p", name: "Specific heat capacity"},
      {symbol: "μ", name: "Dynamic viscosity"},
      {symbol: "k", name: "Thermal conductivity"}
    ],
    applications: ["Heat exchanger design", "Fluid dynamics", "Boundary layer analysis"],
    category: "heat-transfer",
    color: "bg-sky-500/10"
  },
  {
    id: "schmidt",
    name: "Schmidt Number",
    formula: "Sc = μ/(ρ·D)",
    description: "Ratio of momentum diffusivity to mass diffusivity.",
    variables: [
      {symbol: "Sc", name: "Schmidt number"},
      {symbol: "μ", name: "Dynamic viscosity"},
      {symbol: "ρ", name: "Density"},
      {symbol: "D", name: "Mass diffusivity"}
    ],
    applications: ["Mass transfer", "Absorption", "Adsorption", "Distillation"],
    category: "mass-transfer",
    color: "bg-cyan-500/10"
  },
  {
    id: "sherwood",
    name: "Sherwood Number",
    formula: "Sh = k_c·L/D",
    description: "Ratio of convective to diffusive mass transport.",
    variables: [
      {symbol: "Sh", name: "Sherwood number"},
      {symbol: "k_c", name: "Mass transfer coefficient"},
      {symbol: "L", name: "Characteristic length"},
      {symbol: "D", name: "Mass diffusivity"}
    ],
    applications: ["Packed columns", "Extraction processes", "Gas absorption", "Drying"],
    category: "mass-transfer",
    color: "bg-blue-500/10"
  },
  {
    id: "darcy-weisbach",
    name: "Darcy-Weisbach Equation",
    formula: "ΔP = f·(L/D)·(ρv²/2)",
    description: "Relates pressure loss due to friction in pipe flow.",
    variables: [
      {symbol: "ΔP", name: "Pressure drop"},
      {symbol: "f", name: "Friction factor"},
      {symbol: "L", name: "Pipe length"},
      {symbol: "D", name: "Pipe diameter"},
      {symbol: "ρ", name: "Fluid density"},
      {symbol: "v", name: "Flow velocity"}
    ],
    applications: ["Pipeline design", "Pump sizing", "Flow measurement", "Hydraulics"],
    category: "fluid-dynamics",
    color: "bg-indigo-500/10"
  },
  {
    id: "pid-controller",
    name: "PID Controller",
    formula: "u(t) = K_p·e(t) + K_i∫e(t)dt + K_d·de(t)/dt",
    description: "Control algorithm that combines proportional, integral, and derivative control actions.",
    variables: [
      {symbol: "u(t)", name: "Controller output"},
      {symbol: "e(t)", name: "Error signal"},
      {symbol: "K_p", name: "Proportional gain"},
      {symbol: "K_i", name: "Integral gain"},
      {symbol: "K_d", name: "Derivative gain"}
    ],
    applications: ["Temperature control", "Flow control", "Pressure control", "Level control"],
    category: "process-control",
    color: "bg-violet-500/10"
  },
  {
    id: "ergun",
    name: "Ergun Equation",
    formula: "ΔP/L = 150·μ·(1-ε)²·v₀/(ε³·D_p²) + 1.75·ρ·(1-ε)·v₀²/(ε³·D_p)",
    description: "Pressure drop through a packed bed of particles.",
    variables: [
      {symbol: "ΔP", name: "Pressure drop"},
      {symbol: "L", name: "Bed length"},
      {symbol: "μ", name: "Fluid viscosity"},
      {symbol: "ε", name: "Bed porosity"},
      {symbol: "v₀", name: "Superficial velocity"},
      {symbol: "D_p", name: "Particle diameter"},
      {symbol: "ρ", name: "Fluid density"}
    ],
    applications: ["Fixed bed reactors", "Catalytic converters", "Filtration", "Packed columns"],
    category: "fluid-dynamics",
    color: "bg-pink-500/10"
  },
  {
    id: "thiele-modulus",
    name: "Thiele Modulus",
    formula: "Φ = L·√(k/D_eff)",
    description: "Relates reaction rate to diffusion rate in catalysts.",
    variables: [
      {symbol: "Φ", name: "Thiele modulus"},
      {symbol: "L", name: "Characteristic length"},
      {symbol: "k", name: "Reaction rate constant"},
      {symbol: "D_eff", name: "Effective diffusivity"}
    ],
    applications: ["Catalyst effectiveness", "Porous media reactions", "Gas-solid reactions", "Biocatalysis"],
    category: "reaction-kinetics",
    color: "bg-orange-500/10"
  }
];

const ChemicalFormulas = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  const filteredFormulas = formulasData.filter(formula => {
    const matchesSearch = formula.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        formula.formula.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        formula.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || formula.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categoryIcons: Record<string, React.ReactNode> = {
    "all": <Plus className="h-4 w-4" />,
    "thermodynamics": <Atom className="h-4 w-4" />,
    "fluid-dynamics": <Waves className="h-4 w-4" />,
    "mass-transfer": <FlaskConical className="h-4 w-4" />,
    "heat-transfer": <Thermometer className="h-4 w-4" />,
    "reaction-kinetics": <Calculator className="h-4 w-4" />,
    "process-control": <Gauge className="h-4 w-4" />
  };

  return (
    <Layout>
      <div className="py-10 px-6 max-w-screen-xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold mb-4 bg-gradient-to-r from-flow-blue to-flow-teal bg-clip-text text-transparent">
            Chemical Engineering Formulas
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl">
            Comprehensive reference for essential chemical engineering formulas, equations, and correlations used in process design and simulation.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search formulas..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Tabs 
            value={selectedCategory} 
            onValueChange={setSelectedCategory}
            className="w-full md:w-auto"
          >
            <TabsList className="w-full md:w-auto overflow-x-auto">
              <TabsTrigger value="all" className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                <span>All</span>
              </TabsTrigger>
              <TabsTrigger value="thermodynamics" className="flex items-center gap-1">
                <Atom className="h-4 w-4" />
                <span>Thermodynamics</span>
              </TabsTrigger>
              <TabsTrigger value="fluid-dynamics" className="flex items-center gap-1">
                <Waves className="h-4 w-4" />
                <span>Fluid Dynamics</span>
              </TabsTrigger>
              <TabsTrigger value="mass-transfer" className="flex items-center gap-1">
                <FlaskConical className="h-4 w-4" />
                <span>Mass Transfer</span>
              </TabsTrigger>
              <TabsTrigger value="heat-transfer" className="flex items-center gap-1">
                <Thermometer className="h-4 w-4" />
                <span>Heat Transfer</span>
              </TabsTrigger>
              <TabsTrigger value="reaction-kinetics" className="flex items-center gap-1">
                <Calculator className="h-4 w-4" />
                <span>Reaction Kinetics</span>
              </TabsTrigger>
              <TabsTrigger value="process-control" className="flex items-center gap-1">
                <Gauge className="h-4 w-4" />
                <span>Process Control</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {filteredFormulas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredFormulas.map((formula) => (
              <GlassPanel key={formula.id} className={`p-6 ${formula.color} hover:shadow-lg transition-shadow`}>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-medium text-gray-900 dark:text-gray-50">{formula.name}</h3>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300">
                    {categoryIcons[formula.category]}
                    <span className="ml-1 capitalize">
                      {formula.category.replace("-", " ")}
                    </span>
                  </span>
                </div>
                
                <div className="p-3 bg-white/80 dark:bg-gray-800/80 rounded-md mb-4 overflow-x-auto">
                  <p className="text-lg font-mono text-flow-blue dark:text-flow-cyan font-medium">
                    {formula.formula}
                  </p>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {formula.description}
                </p>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Variables:</h4>
                  <div className="grid grid-cols-2 gap-1">
                    {formula.variables.map((variable, index) => (
                      <div key={index} className="text-xs text-gray-600 dark:text-gray-300 flex items-start">
                        <span className="font-mono font-medium mr-1">{variable.symbol}:</span>
                        <span>{variable.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Applications:</h4>
                  <div className="flex flex-wrap gap-1">
                    {formula.applications.map((app, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-0.5 text-xs bg-white/60 dark:bg-gray-700/60 rounded-full"
                      >
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              </GlassPanel>
            ))}
          </div>
        ) : (
          <GlassPanel className="p-8 text-center">
            <h3 className="text-lg font-medium mb-2">No formulas found</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Try adjusting your search or filter criteria
            </p>
          </GlassPanel>
        )}
      </div>
    </Layout>
  );
};

export default ChemicalFormulas;
