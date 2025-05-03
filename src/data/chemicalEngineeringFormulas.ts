// This file contains a comprehensive collection of chemical engineering formulas

export interface Formula {
  id: string;
  category: string;
  title: string;
  formula: string;
  description?: string;
  variables?: { [key: string]: string };
}

// Collection of formulas organized by category
export const chemicalEngineeringFormulas: Formula[] = [
  // Fluid Mechanics
  {
    id: "reynolds-number",
    category: "Fluid Mechanics",
    title: "Reynolds Number",
    formula: "Re = (ρ × v × D) / μ",
    description: "Dimensionless number used to predict flow patterns in fluid flow situations",
    variables: {
      "Re": "Reynolds Number (dimensionless)",
      "ρ": "Fluid density (kg/m³)",
      "v": "Fluid velocity (m/s)",
      "D": "Characteristic length (m)",
      "μ": "Dynamic viscosity (Pa·s)"
    }
  },
  {
    id: "bernoulli-equation",
    category: "Fluid Mechanics",
    title: "Bernoulli's Equation",
    formula: "P₁ + ½ρv₁² + ρgh₁ = P₂ + ½ρv₂² + ρgh₂",
    description: "Relates pressure, velocity and elevation in a fluid flow",
    variables: {
      "P": "Pressure (Pa)",
      "ρ": "Fluid density (kg/m³)",
      "v": "Fluid velocity (m/s)",
      "g": "Gravitational acceleration (m/s²)",
      "h": "Height (m)"
    }
  },
  {
    id: "darcy-friction",
    category: "Fluid Mechanics",
    title: "Darcy-Weisbach Equation",
    formula: "ΔP = f × (L/D) × (ρv²/2)",
    description: "Calculates pressure loss due to friction in pipe flow",
    variables: {
      "ΔP": "Pressure drop (Pa)",
      "f": "Darcy friction factor",
      "L": "Length of pipe (m)",
      "D": "Diameter of pipe (m)",
      "ρ": "Fluid density (kg/m³)",
      "v": "Fluid velocity (m/s)"
    }
  },
  
  // Advanced Thermodynamics
  {
    id: "gibbs-free-energy",
    category: "Thermodynamics",
    title: "Gibbs Free Energy",
    formula: "ΔG = ΔH - TΔS",
    description: "Relates the change in Gibbs free energy to enthalpy, temperature, and entropy changes",
    variables: {
      "ΔG": "Change in Gibbs free energy (J)",
      "ΔH": "Change in enthalpy (J)",
      "T": "Temperature (K)",
      "ΔS": "Change in entropy (J/K)"
    }
  },
  {
    id: "clausius-clapeyron",
    category: "Thermodynamics",
    title: "Clausius-Clapeyron Equation",
    formula: "ln(P₂/P₁) = (ΔH_vap/R)(1/T₁ - 1/T₂)",
    description: "Relates vapor pressure to temperature for a pure substance",
    variables: {
      "P₁, P₂": "Vapor pressures at temperatures T₁ and T₂ (Pa)",
      "ΔH_vap": "Heat of vaporization (J/mol)",
      "R": "Gas constant (8.314 J/(mol·K))",
      "T₁, T₂": "Temperatures (K)"
    }
  },
  {
    id: "carnot-efficiency",
    category: "Thermodynamics",
    title: "Carnot Efficiency",
    formula: "η = 1 - T_C/T_H",
    description: "Maximum theoretical efficiency of a heat engine operating between two temperatures",
    variables: {
      "η": "Efficiency (dimensionless)",
      "T_C": "Cold reservoir temperature (K)",
      "T_H": "Hot reservoir temperature (K)"
    }
  },
  {
    id: "joule-thomson",
    category: "Thermodynamics",
    title: "Joule-Thomson Coefficient",
    formula: "μ_JT = (∂T/∂P)_H",
    description: "Rate of temperature change with pressure during an isenthalpic process",
    variables: {
      "μ_JT": "Joule-Thomson coefficient (K/Pa)",
      "(∂T/∂P)_H": "Partial derivative of temperature with respect to pressure at constant enthalpy"
    }
  },
  
  // Chemical Reaction Engineering
  {
    id: "damkohler-number",
    category: "Reaction Engineering",
    title: "Damköhler Number",
    formula: "Da = reaction rate / transport rate",
    description: "Ratio of reaction rate to mass transport rate, indicating which process is limiting",
    variables: {
      "Da": "Damköhler number (dimensionless)",
      "reaction rate": "Rate of chemical reaction",
      "transport rate": "Rate of mass transport"
    }
  },
  {
    id: "catalyst-effectiveness",
    category: "Reaction Engineering",
    title: "Catalyst Effectiveness Factor",
    formula: "η = actual reaction rate / reaction rate without diffusion limitation",
    description: "Measure of how effectively a catalyst is being utilized",
    variables: {
      "η": "Effectiveness factor (dimensionless)"
    }
  },
  {
    id: "reaction-selectivity",
    category: "Reaction Engineering",
    title: "Reaction Selectivity",
    formula: "S = rate of desired product formation / rate of undesired product formation",
    description: "Ratio of the rate of desired product formation to undesired product formation",
    variables: {
      "S": "Selectivity (dimensionless)"
    }
  },
  {
    id: "batch-reactor-design",
    category: "Reaction Engineering",
    title: "Batch Reactor Design Equation",
    formula: "t = ∫(dX/(−r_A))",
    description: "Time needed to reach a certain conversion in a batch reactor",
    variables: {
      "t": "Time (s)",
      "X": "Conversion",
      "−r_A": "Reaction rate (mol/(m³·s))"
    }
  },
  {
    id: "cstr-design",
    category: "Reaction Engineering",
    title: "CSTR Design Equation",
    formula: "τ = C_A0 · X / (−r_A)",
    description: "Residence time needed to reach a certain conversion in a CSTR",
    variables: {
      "τ": "Residence time (s)",
      "C_A0": "Initial concentration (mol/m³)",
      "X": "Conversion",
      "−r_A": "Reaction rate (mol/(m³·s))"
    }
  },
  {
    id: "pfr-design",
    category: "Reaction Engineering",
    title: "PFR Design Equation",
    formula: "V/F_A0 = ∫(dX/(−r_A))",
    description: "Volume needed to reach a certain conversion in a PFR",
    variables: {
      "V": "Reactor volume (m³)",
      "F_A0": "Molar flow rate of reactant (mol/s)",
      "X": "Conversion",
      "−r_A": "Reaction rate (mol/(m³·s))"
    }
  },
  
  // Advanced Transport Phenomena
  {
    id: "biot-number",
    category: "Transport Phenomena",
    title: "Biot Number",
    formula: "Bi = h·L/k",
    description: "Ratio of heat transfer resistances inside and at the surface of a body",
    variables: {
      "Bi": "Biot number (dimensionless)",
      "h": "Heat transfer coefficient (W/(m²·K))",
      "L": "Characteristic length (m)",
      "k": "Thermal conductivity (W/(m·K))"
    }
  },
  {
    id: "peclet-number",
    category: "Transport Phenomena",
    title: "Péclet Number",
    formula: "Pe = L·u/D",
    description: "Ratio of advective transport to diffusive transport",
    variables: {
      "Pe": "Péclet number (dimensionless)",
      "L": "Characteristic length (m)",
      "u": "Flow velocity (m/s)",
      "D": "Diffusion coefficient (m²/s)"
    }
  },
  {
    id: "graetz-number",
    category: "Transport Phenomena",
    title: "Graetz Number",
    formula: "Gz = (D/L)·Re·Pr",
    description: "Characterizes thermal developing flow in a channel",
    variables: {
      "Gz": "Graetz number (dimensionless)",
      "D": "Diameter (m)",
      "L": "Length (m)",
      "Re": "Reynolds number",
      "Pr": "Prandtl number"
    }
  },
  {
    id: "grashof-number",
    category: "Transport Phenomena",
    title: "Grashof Number",
    formula: "Gr = (g·β·ΔT·L³)/ν²",
    description: "Ratio of buoyancy to viscous forces in natural convection",
    variables: {
      "Gr": "Grashof number (dimensionless)",
      "g": "Gravitational acceleration (m/s²)",
      "β": "Thermal expansion coefficient (1/K)",
      "ΔT": "Temperature difference (K)",
      "L": "Characteristic length (m)",
      "ν": "Kinematic viscosity (m²/s)"
    }
  },
  
  // Process Control
  {
    id: "process-gain",
    category: "Process Control",
    title: "Process Gain",
    formula: "K_p = Δy/Δu",
    description: "Ratio of output change to input change in a process",
    variables: {
      "K_p": "Process gain",
      "Δy": "Change in process output",
      "Δu": "Change in process input"
    }
  },
  {
    id: "time-constant",
    category: "Process Control",
    title: "First Order Time Constant",
    formula: "y(t) = K·(1-e^(-t/τ))·u(t)",
    description: "Response of a first-order system to a step input",
    variables: {
      "y(t)": "Output at time t",
      "K": "Process gain",
      "τ": "Time constant (s)",
      "u(t)": "Step input"
    }
  },
  {
    id: "ziegler-nichols",
    category: "Process Control",
    title: "Ziegler-Nichols Tuning",
    formula: "K_p = 0.6·K_u, T_i = 0.5·T_u, T_d = 0.125·T_u",
    description: "Method for tuning PID controllers based on ultimate gain and period",
    variables: {
      "K_p": "Proportional gain",
      "T_i": "Integral time (s)",
      "T_d": "Derivative time (s)",
      "K_u": "Ultimate gain",
      "T_u": "Ultimate period (s)"
    }
  },
  
  // Fluid-Particle Systems
  {
    id: "terminal-velocity",
    category: "Fluid-Particle Systems",
    title: "Terminal Velocity",
    formula: "u_t = √(4·g·d·(ρ_p - ρ_f)/(3·C_D·ρ_f))",
    description: "Maximum velocity of a particle falling through a fluid",
    variables: {
      "u_t": "Terminal velocity (m/s)",
      "g": "Gravitational acceleration (m/s²)",
      "d": "Particle diameter (m)",
      "ρ_p": "Particle density (kg/m³)",
      "ρ_f": "Fluid density (kg/m³)",
      "C_D": "Drag coefficient"
    }
  },
  {
    id: "fluidization-velocity",
    category: "Fluid-Particle Systems",
    title: "Minimum Fluidization Velocity",
    formula: "u_mf = (d_p²·g·(ρ_p - ρ_f))/(150·μ)·(ε_mf³/(1-ε_mf))",
    description: "Minimum velocity needed to fluidize a bed of particles",
    variables: {
      "u_mf": "Minimum fluidization velocity (m/s)",
      "d_p": "Particle diameter (m)",
      "g": "Gravitational acceleration (m/s²)",
      "ρ_p": "Particle density (kg/m³)",
      "ρ_f": "Fluid density (kg/m³)",
      "μ": "Fluid viscosity (Pa·s)",
      "ε_mf": "Void fraction at minimum fluidization"
    }
  },
  
  // Polymer Engineering
  {
    id: "molecular-weight",
    category: "Polymer Engineering",
    title: "Number Average Molecular Weight",
    formula: "M_n = ∑(n_i·M_i)/∑n_i",
    description: "Average molecular weight based on number of molecules",
    variables: {
      "M_n": "Number average molecular weight (g/mol)",
      "n_i": "Number of molecules with molecular weight M_i",
      "M_i": "Molecular weight of species i (g/mol)"
    }
  },
  {
    id: "weight-average-mw",
    category: "Polymer Engineering",
    title: "Weight Average Molecular Weight",
    formula: "M_w = ∑(w_i·M_i)/∑w_i",
    description: "Average molecular weight based on weight of molecules",
    variables: {
      "M_w": "Weight average molecular weight (g/mol)",
      "w_i": "Weight of molecules with molecular weight M_i",
      "M_i": "Molecular weight of species i (g/mol)"
    }
  },
  {
    id: "polydispersity",
    category: "Polymer Engineering",
    title: "Polydispersity Index",
    formula: "PDI = M_w/M_n",
    description: "Measure of the distribution of molecular weights in a polymer",
    variables: {
      "PDI": "Polydispersity index (dimensionless)",
      "M_w": "Weight average molecular weight (g/mol)",
      "M_n": "Number average molecular weight (g/mol)"
    }
  },
  
  // Chemical Equilibrium
  {
    id: "equilibrium-constant",
    category: "Chemical Equilibrium",
    title: "Equilibrium Constant",
    formula: "K_eq = exp(-ΔG°/RT)",
    description: "Relates standard Gibbs free energy change to equilibrium constant",
    variables: {
      "K_eq": "Equilibrium constant (dimensionless)",
      "ΔG°": "Standard Gibbs free energy change (J/mol)",
      "R": "Gas constant (8.314 J/(mol·K))",
      "T": "Temperature (K)"
    }
  },
  {
    id: "vantvhoff-equation",
    category: "Chemical Equilibrium",
    title: "van't Hoff Equation",
    formula: "d(ln K)/d(1/T) = -ΔH°/R",
    description: "Effect of temperature on equilibrium constant",
    variables: {
      "K": "Equilibrium constant",
      "T": "Temperature (K)",
      "ΔH°": "Standard enthalpy change (J/mol)",
      "R": "Gas constant (8.314 J/(mol·K))"
    }
  },
  
  // Phase Equilibria
  {
    id: "distribution-coefficient",
    category: "Phase Equilibria",
    title: "Distribution Coefficient",
    formula: "K_D = c_1/c_2",
    description: "Ratio of concentrations of a substance in two phases at equilibrium",
    variables: {
      "K_D": "Distribution coefficient",
      "c_1": "Concentration in phase 1",
      "c_2": "Concentration in phase 2"
    }
  },
  {
    id: "relative-volatility",
    category: "Phase Equilibria",
    title: "Relative Volatility",
    formula: "α_ij = K_i/K_j",
    description: "Ratio of K-values for components i and j",
    variables: {
      "α_ij": "Relative volatility",
      "K_i": "K-value for component i",
      "K_j": "K-value for component j"
    }
  },
  
  // Equipment Design - Additional
  {
    id: "pump-power",
    category: "Equipment Design",
    title: "Pump Power",
    formula: "P = ρ·g·Q·H/η",
    description: "Power required for a pump",
    variables: {
      "P": "Power (W)",
      "ρ": "Fluid density (kg/m³)",
      "g": "Gravitational acceleration (m/s²)",
      "Q": "Volumetric flow rate (m³/s)",
      "H": "Head (m)",
      "η": "Pump efficiency"
    }
  },
  {
    id: "compressor-work",
    category: "Equipment Design",
    title: "Adiabatic Compressor Work",
    formula: "W = (γ/(γ-1))·R·T_1·[(P_2/P_1)^((γ-1)/γ) - 1]",
    description: "Work required for adiabatic compression",
    variables: {
      "W": "Specific work (J/mol)",
      "γ": "Heat capacity ratio",
      "R": "Gas constant (8.314 J/(mol·K))",
      "T_1": "Inlet temperature (K)",
      "P_1": "Inlet pressure (Pa)",
      "P_2": "Outlet pressure (Pa)"
    }
  },
  {
    id: "distillation-reflux",
    category: "Equipment Design",
    title: "Minimum Reflux Ratio",
    formula: "R_min = 1/(α_LK,HK·(x_D,LK/x_D,HK)·(x_F,HK/x_F,LK) - 1)",
    description: "Minimum reflux ratio for a binary distillation",
    variables: {
      "R_min": "Minimum reflux ratio",
      "α_LK,HK": "Relative volatility between light and heavy key components",
      "x_D,LK": "Mole fraction of light key in distillate",
      "x_D,HK": "Mole fraction of heavy key in distillate",
      "x_F,LK": "Mole fraction of light key in feed",
      "x_F,HK": "Mole fraction of heavy key in feed"
    }
  },
  
  // Bioreactors
  {
    id: "monod-equation",
    category: "Biochemical Engineering",
    title: "Monod Equation",
    formula: "μ = μ_max·S/(K_s + S)",
    description: "Growth rate of microorganisms as a function of substrate concentration",
    variables: {
      "μ": "Specific growth rate (1/h)",
      "μ_max": "Maximum specific growth rate (1/h)",
      "S": "Substrate concentration (g/L)",
      "K_s": "Half-saturation constant (g/L)"
    }
  },
  {
    id: "oxygen-transfer",
    category: "Biochemical Engineering",
    title: "Oxygen Transfer Rate",
    formula: "OTR = k_La·(C* - C_L)",
    description: "Rate of oxygen transfer in a bioreactor",
    variables: {
      "OTR": "Oxygen transfer rate (mg O₂/(L·h))",
      "k_La": "Volumetric mass transfer coefficient (1/h)",
      "C*": "Saturation concentration of oxygen (mg/L)",
      "C_L": "Dissolved oxygen concentration (mg/L)"
    }
  }
];

// Helper function to get formulas by category
export const getFormulasByCategory = (category: string): Formula[] => {
  return chemicalEngineeringFormulas.filter(formula => formula.category === category);
};

// Helper function to get all categories
export const getAllCategories = (): string[] => {
  return [...new Set(chemicalEngineeringFormulas.map(formula => formula.category))];
};

// Helper function to get a formula by ID
export const getFormulaById = (id: string): Formula | undefined => {
  return chemicalEngineeringFormulas.find(formula => formula.id === id);
};
