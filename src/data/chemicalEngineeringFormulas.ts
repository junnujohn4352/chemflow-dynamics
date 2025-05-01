
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
  
  // Thermodynamics
  {
    id: "ideal-gas-law",
    category: "Thermodynamics",
    title: "Ideal Gas Law",
    formula: "PV = nRT",
    description: "Relates pressure, volume, amount of substance and temperature for an ideal gas",
    variables: {
      "P": "Pressure (Pa)",
      "V": "Volume (m³)",
      "n": "Amount of substance (mol)",
      "R": "Universal gas constant (8.314 J/(mol·K))",
      "T": "Temperature (K)"
    }
  },
  {
    id: "first-law-thermodynamics",
    category: "Thermodynamics",
    title: "First Law of Thermodynamics",
    formula: "ΔU = Q - W",
    description: "Energy conservation principle for a thermodynamic system",
    variables: {
      "ΔU": "Change in internal energy (J)",
      "Q": "Heat added to the system (J)",
      "W": "Work done by the system (J)"
    }
  },
  {
    id: "enthalpy-change",
    category: "Thermodynamics",
    title: "Enthalpy Change",
    formula: "ΔH = ΔU + P·ΔV",
    description: "Relates enthalpy change to internal energy change at constant pressure",
    variables: {
      "ΔH": "Change in enthalpy (J)",
      "ΔU": "Change in internal energy (J)",
      "P": "Pressure (Pa)",
      "ΔV": "Change in volume (m³)"
    }
  },
  
  // Heat Transfer
  {
    id: "fouriers-law",
    category: "Heat Transfer",
    title: "Fourier's Law of Heat Conduction",
    formula: "q = -k·A·(dT/dx)",
    description: "Rate of heat transfer through a material by conduction",
    variables: {
      "q": "Heat transfer rate (W)",
      "k": "Thermal conductivity (W/(m·K))",
      "A": "Cross-sectional area (m²)",
      "dT/dx": "Temperature gradient (K/m)"
    }
  },
  {
    id: "newtons-cooling",
    category: "Heat Transfer",
    title: "Newton's Law of Cooling",
    formula: "q = h·A·ΔT",
    description: "Rate of heat transfer by convection",
    variables: {
      "q": "Heat transfer rate (W)",
      "h": "Heat transfer coefficient (W/(m²·K))",
      "A": "Surface area (m²)",
      "ΔT": "Temperature difference (K)"
    }
  },
  {
    id: "stefan-boltzmann",
    category: "Heat Transfer",
    title: "Stefan-Boltzmann Law",
    formula: "q = ε·σ·A·T⁴",
    description: "Rate of heat transfer by radiation from a body",
    variables: {
      "q": "Heat transfer rate (W)",
      "ε": "Emissivity (dimensionless)",
      "σ": "Stefan-Boltzmann constant (5.67×10⁻⁸ W/(m²·K⁴))",
      "A": "Surface area (m²)",
      "T": "Absolute temperature (K)"
    }
  },
  
  // Mass Transfer
  {
    id: "ficks-law",
    category: "Mass Transfer",
    title: "Fick's First Law",
    formula: "J = -D·(dc/dx)",
    description: "Diffusive flux due to concentration gradient",
    variables: {
      "J": "Diffusion flux (mol/(m²·s))",
      "D": "Diffusion coefficient (m²/s)",
      "dc/dx": "Concentration gradient (mol/m⁴)"
    }
  },
  {
    id: "mass-transfer",
    category: "Mass Transfer",
    title: "Mass Transfer Coefficient",
    formula: "N = k·A·ΔC",
    description: "Relates mass transfer rate to concentration difference",
    variables: {
      "N": "Mass transfer rate (mol/s)",
      "k": "Mass transfer coefficient (m/s)",
      "A": "Interfacial area (m²)",
      "ΔC": "Concentration difference (mol/m³)"
    }
  },
  
  // Reaction Engineering
  {
    id: "arrhenius",
    category: "Reaction Engineering",
    title: "Arrhenius Equation",
    formula: "k = A·e^(-Ea/RT)",
    description: "Temperature dependence of reaction rate constants",
    variables: {
      "k": "Rate constant",
      "A": "Pre-exponential factor",
      "Ea": "Activation energy (J/mol)",
      "R": "Universal gas constant (8.314 J/(mol·K))",
      "T": "Absolute temperature (K)"
    }
  },
  {
    id: "first-order-reaction",
    category: "Reaction Engineering",
    title: "First Order Reaction",
    formula: "dC/dt = -k·C",
    description: "Rate of change of concentration in a first-order reaction",
    variables: {
      "dC/dt": "Rate of change of concentration (mol/(m³·s))",
      "k": "Rate constant (1/s)",
      "C": "Concentration (mol/m³)"
    }
  },
  {
    id: "residence-time",
    category: "Reaction Engineering",
    title: "Residence Time",
    formula: "τ = V/Q",
    description: "Average time a particle spends in a reactor",
    variables: {
      "τ": "Residence time (s)",
      "V": "Volume of reactor (m³)",
      "Q": "Volumetric flow rate (m³/s)"
    }
  },
  
  // Transport Phenomena
  {
    id: "navier-stokes",
    category: "Transport Phenomena",
    title: "Navier-Stokes Equation (Simplified)",
    formula: "ρ(∂v/∂t + v·∇v) = -∇p + μ∇²v + ρg",
    description: "Describes fluid motion",
    variables: {
      "ρ": "Fluid density (kg/m³)",
      "v": "Fluid velocity vector (m/s)",
      "t": "Time (s)",
      "p": "Pressure (Pa)",
      "μ": "Dynamic viscosity (Pa·s)",
      "g": "Gravitational acceleration (m/s²)"
    }
  },
  
  // Separation Processes
  {
    id: "raoults-law",
    category: "Separation Processes",
    title: "Raoult's Law",
    formula: "P₁ = x₁·P₁°",
    description: "Relates vapor pressure of components to their mole fraction in a mixture",
    variables: {
      "P₁": "Partial pressure of component (Pa)",
      "x₁": "Mole fraction in liquid phase",
      "P₁°": "Vapor pressure of pure component (Pa)"
    }
  },
  {
    id: "henrys-law",
    category: "Separation Processes",
    title: "Henry's Law",
    formula: "P₁ = k_H·x₁",
    description: "Relates dissolved gas concentration to its partial pressure",
    variables: {
      "P₁": "Partial pressure of gas (Pa)",
      "k_H": "Henry's constant (Pa)",
      "x₁": "Mole fraction in liquid"
    }
  },
  {
    id: "fenske-equation",
    category: "Separation Processes",
    title: "Fenske Equation",
    formula: "N_min = log[(x_D/x_B)·(y_B/y_D)]/log(α)",
    description: "Minimum number of theoretical plates for binary distillation",
    variables: {
      "N_min": "Minimum number of theoretical plates",
      "x_D": "Mole fraction of light component in distillate",
      "x_B": "Mole fraction of light component in bottoms",
      "y_D": "Mole fraction of light component in vapor from top plate",
      "y_B": "Mole fraction of light component in vapor from bottom plate",
      "α": "Relative volatility"
    }
  },
  
  // Process Control
  {
    id: "pid-controller",
    category: "Process Control",
    title: "PID Controller Equation",
    formula: "u(t) = K_p·e(t) + K_i·∫e(t)dt + K_d·de(t)/dt",
    description: "Output of a proportional-integral-derivative controller",
    variables: {
      "u(t)": "Controller output",
      "e(t)": "Error (difference between setpoint and process variable)",
      "K_p": "Proportional gain",
      "K_i": "Integral gain",
      "K_d": "Derivative gain"
    }
  },
  
  // Equipment Design
  {
    id: "ergun-equation",
    category: "Equipment Design",
    title: "Ergun Equation",
    formula: "ΔP/L = 150·[(1-ε)²/ε³]·[(μ·u₀)/D_p²] + 1.75·[(1-ε)/ε³]·[(ρ·u₀²)/D_p]",
    description: "Pressure drop in packed beds",
    variables: {
      "ΔP": "Pressure drop (Pa)",
      "L": "Bed length (m)",
      "ε": "Void fraction",
      "μ": "Fluid viscosity (Pa·s)",
      "u₀": "Superficial velocity (m/s)",
      "D_p": "Particle diameter (m)",
      "ρ": "Fluid density (kg/m³)"
    }
  },
  {
    id: "shell-heat-exchanger",
    category: "Equipment Design",
    title: "Heat Exchanger Design Equation",
    formula: "Q = U·A·LMTD",
    description: "Heat transfer in a heat exchanger",
    variables: {
      "Q": "Heat transfer rate (W)",
      "U": "Overall heat transfer coefficient (W/(m²·K))",
      "A": "Heat transfer area (m²)",
      "LMTD": "Log mean temperature difference (K)"
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
