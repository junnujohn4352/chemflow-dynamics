
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
  {
    id: "hagen-poiseuille",
    category: "Fluid Mechanics",
    title: "Hagen-Poiseuille Equation",
    formula: "ΔP = (8μLQ)/(πr⁴)",
    description: "Pressure drop in laminar flow through a pipe",
    variables: {
      "ΔP": "Pressure drop (Pa)",
      "μ": "Dynamic viscosity (Pa·s)",
      "L": "Length of pipe (m)",
      "Q": "Volumetric flow rate (m³/s)",
      "r": "Pipe radius (m)"
    }
  },
  {
    id: "moody-friction-factor",
    category: "Fluid Mechanics",
    title: "Colebrook Equation",
    formula: "1/√f = -2log(ε/(3.7D) + 2.51/(Re·√f))",
    description: "Implicit equation for Darcy friction factor in turbulent flow",
    variables: {
      "f": "Darcy friction factor",
      "ε": "Pipe roughness (m)",
      "D": "Pipe diameter (m)",
      "Re": "Reynolds number"
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
  {
    id: "peng-robinson",
    category: "Thermodynamics",
    title: "Peng-Robinson Equation of State",
    formula: "P = (RT/(V-b)) - (a(T)/(V(V+b) + b(V-b)))",
    description: "Equation of state commonly used in chemical process simulations",
    variables: {
      "P": "Pressure (Pa)",
      "R": "Gas constant (8.314 J/(mol·K))",
      "T": "Temperature (K)",
      "V": "Molar volume (m³/mol)",
      "a(T)": "Temperature-dependent parameter",
      "b": "Volume correction parameter"
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
  {
    id: "arrhenius-equation",
    category: "Reaction Engineering",
    title: "Arrhenius Equation",
    formula: "k = A·e^(-E_a/RT)",
    description: "Relationship between reaction rate constant and temperature",
    variables: {
      "k": "Rate constant",
      "A": "Pre-exponential factor",
      "E_a": "Activation energy (J/mol)",
      "R": "Gas constant (8.314 J/(mol·K))",
      "T": "Temperature (K)"
    }
  },
  {
    id: "thiele-modulus",
    category: "Reaction Engineering",
    title: "Thiele Modulus",
    formula: "φ = L·√(k/D_e)",
    description: "Dimensionless number relating reaction rate to diffusion rate in a catalyst pellet",
    variables: {
      "φ": "Thiele modulus",
      "L": "Characteristic length (m)",
      "k": "Reaction rate constant (1/s)",
      "D_e": "Effective diffusivity (m²/s)"
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
  {
    id: "sherwood-number",
    category: "Transport Phenomena",
    title: "Sherwood Number",
    formula: "Sh = k·L/D",
    description: "Dimensionless mass transfer coefficient",
    variables: {
      "Sh": "Sherwood number",
      "k": "Mass transfer coefficient (m/s)",
      "L": "Characteristic length (m)",
      "D": "Diffusion coefficient (m²/s)"
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
  {
    id: "pid-controller",
    category: "Process Control",
    title: "PID Controller Equation",
    formula: "u(t) = K_p·e(t) + K_i·∫e(t)dt + K_d·de(t)/dt",
    description: "Standard PID controller output calculation",
    variables: {
      "u(t)": "Controller output",
      "e(t)": "Error (setpoint - measured value)",
      "K_p": "Proportional gain",
      "K_i": "Integral gain",
      "K_d": "Derivative gain"
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
  {
    id: "ergun-equation",
    category: "Fluid-Particle Systems",
    title: "Ergun Equation",
    formula: "ΔP/L = 150((1-ε)²/ε³)(μu/d_p²) + 1.75((1-ε)/ε³)(ρu²/d_p)",
    description: "Pressure drop through a packed bed",
    variables: {
      "ΔP": "Pressure drop (Pa)",
      "L": "Bed length (m)",
      "ε": "Void fraction",
      "μ": "Fluid viscosity (Pa·s)",
      "u": "Superficial velocity (m/s)",
      "d_p": "Particle diameter (m)",
      "ρ": "Fluid density (kg/m³)"
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
  {
    id: "flory-fox",
    category: "Polymer Engineering",
    title: "Flory-Fox Equation",
    formula: "T_g = T_g∞ - K/M_n",
    description: "Relationship between glass transition temperature and molecular weight",
    variables: {
      "T_g": "Glass transition temperature (K)",
      "T_g∞": "Glass transition temperature at infinite molecular weight (K)",
      "K": "Polymer-specific constant",
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
  {
    id: "reaction-quotient",
    category: "Chemical Equilibrium",
    title: "Reaction Quotient",
    formula: "Q = [C]^c[D]^d/[A]^a[B]^b",
    description: "For a reaction aA + bB ⇌ cC + dD, the reaction quotient helps determine direction of equilibrium shift",
    variables: {
      "Q": "Reaction quotient",
      "[A],[B],[C],[D]": "Concentrations or partial pressures",
      "a,b,c,d": "Stoichiometric coefficients"
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
  {
    id: "raoults-law",
    category: "Phase Equilibria",
    title: "Raoult's Law",
    formula: "P_i = x_i·P_i°",
    description: "Partial pressure of component in vapor phase is proportional to its mole fraction in liquid phase",
    variables: {
      "P_i": "Partial pressure of component i (Pa)",
      "x_i": "Mole fraction in liquid phase",
      "P_i°": "Vapor pressure of pure component i (Pa)"
    }
  },
  {
    id: "henrys-law",
    category: "Phase Equilibria",
    title: "Henry's Law",
    formula: "P_i = H_i·x_i",
    description: "Solubility of a gas in a liquid is directly proportional to the gas pressure",
    variables: {
      "P_i": "Partial pressure of gas (Pa)",
      "H_i": "Henry's constant (Pa)",
      "x_i": "Mole fraction of gas in solution"
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
  {
    id: "heat-exchanger-lmtd",
    category: "Equipment Design",
    title: "LMTD for Heat Exchangers",
    formula: "LMTD = (ΔT₁ - ΔT₂)/ln(ΔT₁/ΔT₂)",
    description: "Log Mean Temperature Difference for heat exchanger design",
    variables: {
      "LMTD": "Log Mean Temperature Difference (K)",
      "ΔT₁": "Temperature difference at one end (K)",
      "ΔT₂": "Temperature difference at other end (K)"
    }
  },
  {
    id: "shell-heat-transfer",
    category: "Equipment Design",
    title: "Shell and Tube Heat Exchanger Area",
    formula: "Q = U·A·LMTD",
    description: "Heat transfer in a shell and tube heat exchanger",
    variables: {
      "Q": "Heat transfer rate (W)",
      "U": "Overall heat transfer coefficient (W/(m²·K))",
      "A": "Heat transfer area (m²)",
      "LMTD": "Log Mean Temperature Difference (K)"
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
  },
  {
    id: "michaelis-menten",
    category: "Biochemical Engineering",
    title: "Michaelis-Menten Kinetics",
    formula: "v = v_max·[S]/(K_m + [S])",
    description: "Rate of enzymatic reactions as a function of substrate concentration",
    variables: {
      "v": "Reaction rate",
      "v_max": "Maximum reaction rate",
      "[S]": "Substrate concentration",
      "K_m": "Michaelis constant"
    }
  },
  {
    id: "cell-growth",
    category: "Biochemical Engineering",
    title: "Cell Growth Equation",
    formula: "dX/dt = μ·X",
    description: "Exponential growth of cell population in batch culture",
    variables: {
      "dX/dt": "Rate of change of cell concentration",
      "μ": "Specific growth rate (1/h)",
      "X": "Cell concentration (g/L)"
    }
  },
  
  // Corrosion Engineering
  {
    id: "corrosion-rate",
    category: "Corrosion Engineering",
    title: "Corrosion Rate",
    formula: "CR = (K·W)/(A·T·ρ)",
    description: "Calculation of corrosion rate from weight loss",
    variables: {
      "CR": "Corrosion rate (mm/year)",
      "K": "Constant (8.76×10⁴ for mm/year)",
      "W": "Weight loss (g)",
      "A": "Area (cm²)",
      "T": "Time (h)",
      "ρ": "Density (g/cm³)"
    }
  },
  {
    id: "nernst-equation",
    category: "Corrosion Engineering",
    title: "Nernst Equation",
    formula: "E = E° - (RT/nF)·ln(a_red/a_ox)",
    description: "Relationship between reduction potential and activities of species in a half-cell",
    variables: {
      "E": "Cell potential (V)",
      "E°": "Standard cell potential (V)",
      "R": "Gas constant (8.314 J/(mol·K))",
      "T": "Temperature (K)",
      "n": "Number of electrons transferred",
      "F": "Faraday constant (96,485 C/mol)",
      "a_red": "Activity of reduced species",
      "a_ox": "Activity of oxidized species"
    }
  },
  
  // Environmental Engineering
  {
    id: "bod-kinetics",
    category: "Environmental Engineering",
    title: "BOD Kinetics",
    formula: "BOD_t = BOD_u·(1-e^(-k·t))",
    description: "Biochemical oxygen demand as a function of time",
    variables: {
      "BOD_t": "BOD at time t (mg/L)",
      "BOD_u": "Ultimate BOD (mg/L)",
      "k": "Rate constant (1/day)",
      "t": "Time (days)"
    }
  },
  {
    id: "henry-constant-temp",
    category: "Environmental Engineering",
    title: "Temperature Effect on Henry's Constant",
    formula: "H(T) = H(T°)·exp[C·((1/T°)-(1/T))]",
    description: "Temperature dependence of Henry's constant",
    variables: {
      "H(T)": "Henry's constant at temperature T",
      "H(T°)": "Henry's constant at reference temperature T°",
      "C": "Temperature coefficient",
      "T": "Temperature (K)",
      "T°": "Reference temperature (K)"
    }
  },
  
  // Safety Engineering
  {
    id: "tnt-equivalence",
    category: "Safety Engineering",
    title: "TNT Equivalence",
    formula: "W_TNT = η·W_fuel·ΔH_c/ΔH_TNT",
    description: "Equivalent TNT mass for explosion energy calculation",
    variables: {
      "W_TNT": "Equivalent TNT mass (kg)",
      "η": "Explosion efficiency",
      "W_fuel": "Mass of fuel (kg)",
      "ΔH_c": "Heat of combustion of fuel (J/kg)",
      "ΔH_TNT": "TNT explosion energy (4.68 MJ/kg)"
    }
  },
  {
    id: "dow-fire-explosion",
    category: "Safety Engineering",
    title: "Dow F&EI Calculation",
    formula: "F&EI = MF × (1 + GPH + SPH)",
    description: "Fire and Explosion Index for hazard ranking of process units",
    variables: {
      "F&EI": "Fire and Explosion Index",
      "MF": "Material Factor",
      "GPH": "General Process Hazards factor",
      "SPH": "Special Process Hazards factor"
    }
  },
  
  // Process Economics
  {
    id: "net-present-value",
    category: "Process Economics",
    title: "Net Present Value",
    formula: "NPV = -C₀ + ∑(C_t/(1+r)^t)",
    description: "Net present value of an investment project",
    variables: {
      "NPV": "Net Present Value",
      "C₀": "Initial investment",
      "C_t": "Cash flow at time t",
      "r": "Discount rate",
      "t": "Time period"
    }
  },
  {
    id: "internal-rate-return",
    category: "Process Economics",
    title: "Internal Rate of Return",
    formula: "0 = -C₀ + ∑(C_t/(1+IRR)^t)",
    description: "Discount rate that makes the net present value zero",
    variables: {
      "C₀": "Initial investment",
      "C_t": "Cash flow at time t",
      "IRR": "Internal Rate of Return",
      "t": "Time period"
    }
  },
  {
    id: "payback-period",
    category: "Process Economics",
    title: "Payback Period",
    formula: "PBP = C₀/CF_annual",
    description: "Simple payback period for an investment (for uniform cash flows)",
    variables: {
      "PBP": "Payback Period (years)",
      "C₀": "Initial investment",
      "CF_annual": "Annual cash flow"
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
