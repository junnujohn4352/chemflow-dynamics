
import { v4 as uuidv4 } from 'uuid';

export interface Formula {
  id: string;
  title: string;
  category: string;
  formula: string;
  description?: string;
  variables?: Record<string, string>;
}

export const chemicalEngineeringFormulas: Formula[] = [
  // Thermodynamics
  {
    id: uuidv4(),
    title: "Ideal Gas Law",
    category: "Thermodynamics",
    formula: "PV = nRT",
    description: "Relates pressure, volume, amount of substance, and temperature for an ideal gas.",
    variables: {
      "P": "Pressure (Pa)",
      "V": "Volume (m³)",
      "n": "Amount of substance (mol)",
      "R": "Gas constant (8.314 J/(mol·K))",
      "T": "Temperature (K)"
    }
  },
  {
    id: uuidv4(),
    title: "Gibbs Free Energy",
    category: "Thermodynamics",
    formula: "ΔG = ΔH - TΔS",
    description: "Determines the spontaneity of a process at constant temperature and pressure.",
    variables: {
      "ΔG": "Change in Gibbs free energy (J)",
      "ΔH": "Change in enthalpy (J)",
      "T": "Temperature (K)",
      "ΔS": "Change in entropy (J/K)"
    }
  },
  {
    id: uuidv4(),
    title: "Clausius-Clapeyron Equation",
    category: "Thermodynamics",
    formula: "ln(P₂/P₁) = (ΔH_vap/R)(1/T₁ - 1/T₂)",
    description: "Describes the phase transition between two phases of matter.",
    variables: {
      "P₁, P₂": "Vapor pressures at T₁ and T₂ (Pa)",
      "ΔH_vap": "Enthalpy of vaporization (J/mol)",
      "R": "Gas constant (8.314 J/(mol·K))",
      "T₁, T₂": "Temperatures (K)"
    }
  },
  {
    id: uuidv4(),
    title: "Adiabatic Flame Temperature",
    category: "Thermodynamics",
    formula: "T_ad = T_i + Q_r/(m·C_p)",
    description: "Maximum temperature that can be achieved by combustion.",
    variables: {
      "T_ad": "Adiabatic flame temperature (K)",
      "T_i": "Initial temperature (K)",
      "Q_r": "Heat released by reaction (J)",
      "m": "Mass of products (kg)",
      "C_p": "Heat capacity of products (J/(kg·K))"
    }
  },
  {
    id: uuidv4(),
    title: "Fugacity Coefficient",
    category: "Thermodynamics",
    formula: "φ = f/P",
    description: "Ratio of fugacity to pressure, measures deviation from ideal gas behavior.",
    variables: {
      "φ": "Fugacity coefficient (dimensionless)",
      "f": "Fugacity (Pa)",
      "P": "Pressure (Pa)"
    }
  },
  
  // Fluid Mechanics
  {
    id: uuidv4(),
    title: "Bernoulli's Equation",
    category: "Fluid Mechanics",
    formula: "P₁ + ½ρv₁² + ρgh₁ = P₂ + ½ρv₂² + ρgh₂",
    description: "Conservation of energy for flowing fluids.",
    variables: {
      "P": "Pressure (Pa)",
      "ρ": "Density (kg/m³)",
      "v": "Fluid velocity (m/s)",
      "g": "Gravitational acceleration (9.81 m/s²)",
      "h": "Height (m)"
    }
  },
  {
    id: uuidv4(),
    title: "Darcy-Weisbach Equation",
    category: "Fluid Mechanics",
    formula: "ΔP = f·(L/D)·(ρv²/2)",
    description: "Pressure drop in pipe flow due to friction.",
    variables: {
      "ΔP": "Pressure drop (Pa)",
      "f": "Darcy friction factor",
      "L": "Pipe length (m)",
      "D": "Pipe diameter (m)",
      "ρ": "Fluid density (kg/m³)",
      "v": "Flow velocity (m/s)"
    }
  },
  {
    id: uuidv4(),
    title: "Reynolds Number",
    category: "Fluid Mechanics",
    formula: "Re = ρvD/μ",
    description: "Ratio of inertial to viscous forces, determines flow regime.",
    variables: {
      "Re": "Reynolds number (dimensionless)",
      "ρ": "Fluid density (kg/m³)",
      "v": "Flow velocity (m/s)",
      "D": "Characteristic length (m)",
      "μ": "Dynamic viscosity (Pa·s)"
    }
  },
  {
    id: uuidv4(),
    title: "Navier-Stokes Equation",
    category: "Fluid Mechanics",
    formula: "ρ(∂v/∂t + v·∇v) = -∇P + μ∇²v + ρg",
    description: "Equation governing fluid motion.",
    variables: {
      "ρ": "Fluid density (kg/m³)",
      "v": "Flow velocity (m/s)",
      "t": "Time (s)",
      "P": "Pressure (Pa)",
      "μ": "Dynamic viscosity (Pa·s)",
      "g": "Gravitational acceleration (m/s²)"
    }
  },
  {
    id: uuidv4(),
    title: "Hagen-Poiseuille Equation",
    category: "Fluid Mechanics",
    formula: "Q = (πr⁴ΔP)/(8μL)",
    description: "Volumetric flow rate for laminar flow in a pipe.",
    variables: {
      "Q": "Volumetric flow rate (m³/s)",
      "r": "Pipe radius (m)",
      "ΔP": "Pressure difference (Pa)",
      "μ": "Dynamic viscosity (Pa·s)",
      "L": "Pipe length (m)"
    }
  },
  
  // Mass Transfer
  {
    id: uuidv4(),
    title: "Fick's First Law",
    category: "Mass Transfer",
    formula: "J = -D(∂C/∂x)",
    description: "Diffusive flux due to concentration gradient.",
    variables: {
      "J": "Diffusive flux (mol/(m²·s))",
      "D": "Diffusion coefficient (m²/s)",
      "C": "Concentration (mol/m³)",
      "x": "Position (m)"
    }
  },
  {
    id: uuidv4(),
    title: "Fick's Second Law",
    category: "Mass Transfer",
    formula: "∂C/∂t = D(∂²C/∂x²)",
    description: "Change in concentration with time due to diffusion.",
    variables: {
      "C": "Concentration (mol/m³)",
      "t": "Time (s)",
      "D": "Diffusion coefficient (m²/s)",
      "x": "Position (m)"
    }
  },
  {
    id: uuidv4(),
    title: "Sherwood Number",
    category: "Mass Transfer",
    formula: "Sh = k·L/D",
    description: "Ratio of convective to diffusive mass transport.",
    variables: {
      "Sh": "Sherwood number (dimensionless)",
      "k": "Mass transfer coefficient (m/s)",
      "L": "Characteristic length (m)",
      "D": "Diffusion coefficient (m²/s)"
    }
  },
  {
    id: uuidv4(),
    title: "Schmidt Number",
    category: "Mass Transfer",
    formula: "Sc = μ/(ρD)",
    description: "Ratio of momentum diffusivity to mass diffusivity.",
    variables: {
      "Sc": "Schmidt number (dimensionless)",
      "μ": "Dynamic viscosity (Pa·s)",
      "ρ": "Density (kg/m³)",
      "D": "Diffusion coefficient (m²/s)"
    }
  },
  {
    id: uuidv4(),
    title: "Mass Transfer Coefficient",
    category: "Mass Transfer",
    formula: "N = k(CA,i - CA,b)",
    description: "Rate of mass transfer across an interface.",
    variables: {
      "N": "Mass flux (mol/(m²·s))",
      "k": "Mass transfer coefficient (m/s)",
      "CA,i": "Interface concentration (mol/m³)",
      "CA,b": "Bulk concentration (mol/m³)"
    }
  },
  
  // Heat Transfer
  {
    id: uuidv4(),
    title: "Fourier's Law",
    category: "Heat Transfer",
    formula: "q = -k(∂T/∂x)",
    description: "Conductive heat flux is proportional to temperature gradient.",
    variables: {
      "q": "Heat flux (W/m²)",
      "k": "Thermal conductivity (W/(m·K))",
      "T": "Temperature (K)",
      "x": "Position (m)"
    }
  },
  {
    id: uuidv4(),
    title: "Heat Transfer Coefficient",
    category: "Heat Transfer",
    formula: "q = h(Ts - T∞)",
    description: "Convective heat transfer between a surface and a fluid.",
    variables: {
      "q": "Heat flux (W/m²)",
      "h": "Heat transfer coefficient (W/(m²·K))",
      "Ts": "Surface temperature (K)",
      "T∞": "Fluid temperature (K)"
    }
  },
  {
    id: uuidv4(),
    title: "Nusselt Number",
    category: "Heat Transfer",
    formula: "Nu = hL/k",
    description: "Ratio of convective to conductive heat transfer.",
    variables: {
      "Nu": "Nusselt number (dimensionless)",
      "h": "Heat transfer coefficient (W/(m²·K))",
      "L": "Characteristic length (m)",
      "k": "Thermal conductivity (W/(m·K))"
    }
  },
  {
    id: uuidv4(),
    title: "Stefan-Boltzmann Law",
    category: "Heat Transfer",
    formula: "q = εσT⁴",
    description: "Radiative heat flux from a surface.",
    variables: {
      "q": "Heat flux (W/m²)",
      "ε": "Emissivity (dimensionless)",
      "σ": "Stefan-Boltzmann constant (5.67×10⁻⁸ W/(m²·K⁴))",
      "T": "Surface temperature (K)"
    }
  },
  {
    id: uuidv4(),
    title: "Overall Heat Transfer Coefficient",
    category: "Heat Transfer",
    formula: "1/U = 1/hi + Σ(Δx/k) + 1/ho",
    description: "Combined effect of conduction and convection in heat exchangers.",
    variables: {
      "U": "Overall heat transfer coefficient (W/(m²·K))",
      "hi": "Inner heat transfer coefficient (W/(m²·K))",
      "Δx": "Wall thickness (m)",
      "k": "Thermal conductivity (W/(m·K))",
      "ho": "Outer heat transfer coefficient (W/(m²·K))"
    }
  },
  
  // Reaction Engineering
  {
    id: uuidv4(),
    title: "Arrhenius Equation",
    category: "Reaction Engineering",
    formula: "k = A·e^(-Ea/RT)",
    description: "Temperature dependence of reaction rate constant.",
    variables: {
      "k": "Rate constant",
      "A": "Pre-exponential factor",
      "Ea": "Activation energy (J/mol)",
      "R": "Gas constant (8.314 J/(mol·K))",
      "T": "Temperature (K)"
    }
  },
  {
    id: uuidv4(),
    title: "First-Order Reaction",
    category: "Reaction Engineering",
    formula: "-rA = k·CA",
    description: "Rate of reaction for first-order kinetics.",
    variables: {
      "-rA": "Reaction rate (mol/(m³·s))",
      "k": "Rate constant (1/s)",
      "CA": "Concentration of reactant A (mol/m³)"
    }
  },
  {
    id: uuidv4(),
    title: "Residence Time",
    category: "Reaction Engineering",
    formula: "τ = V/Q",
    description: "Average time a particle spends in a reactor.",
    variables: {
      "τ": "Residence time (s)",
      "V": "Reactor volume (m³)",
      "Q": "Volumetric flow rate (m³/s)"
    }
  },
  {
    id: uuidv4(),
    title: "Damköhler Number",
    category: "Reaction Engineering",
    formula: "Da = reaction rate / mass transfer rate",
    description: "Ratio of reaction rate to mass transfer rate.",
    variables: {
      "Da": "Damköhler number (dimensionless)"
    }
  },
  {
    id: uuidv4(),
    title: "CSTR Design Equation",
    category: "Reaction Engineering",
    formula: "V = FA0·X / (-rA)",
    description: "Volume required for a continuous stirred-tank reactor.",
    variables: {
      "V": "Reactor volume (m³)",
      "FA0": "Molar flow rate of A entering (mol/s)",
      "X": "Conversion (dimensionless)",
      "-rA": "Reaction rate (mol/(m³·s))"
    }
  },
  
  // Process Control
  {
    id: uuidv4(),
    title: "PID Controller",
    category: "Process Control",
    formula: "u(t) = Kp·e(t) + Ki∫e(t)dt + Kd·de(t)/dt",
    description: "Control signal for a proportional-integral-derivative controller.",
    variables: {
      "u(t)": "Control signal",
      "Kp": "Proportional gain",
      "Ki": "Integral gain",
      "Kd": "Derivative gain",
      "e(t)": "Error signal"
    }
  },
  {
    id: uuidv4(),
    title: "Transfer Function",
    category: "Process Control",
    formula: "G(s) = Y(s)/U(s)",
    description: "Relationship between output and input in the Laplace domain.",
    variables: {
      "G(s)": "Transfer function",
      "Y(s)": "Output in Laplace domain",
      "U(s)": "Input in Laplace domain"
    }
  },
  {
    id: uuidv4(),
    title: "Time Constant",
    category: "Process Control",
    formula: "G(s) = K/(τs + 1)",
    description: "First-order system response.",
    variables: {
      "G(s)": "Transfer function",
      "K": "Steady-state gain",
      "τ": "Time constant (s)"
    }
  },
  {
    id: uuidv4(),
    title: "Feedback Control",
    category: "Process Control",
    formula: "G_closed = G/(1 + GH)",
    description: "Closed-loop transfer function with feedback.",
    variables: {
      "G_closed": "Closed-loop transfer function",
      "G": "Forward path transfer function",
      "H": "Feedback path transfer function"
    }
  },
  {
    id: uuidv4(),
    title: "Stability Criterion",
    category: "Process Control",
    formula: "All poles of G_closed must have negative real parts",
    description: "Condition for a stable feedback control system.",
    variables: {
      "G_closed": "Closed-loop transfer function"
    }
  },
  
  // Transport Phenomena
  {
    id: uuidv4(),
    title: "Prandtl Number",
    category: "Transport Phenomena",
    formula: "Pr = Cp·μ/k",
    description: "Ratio of momentum diffusivity to thermal diffusivity.",
    variables: {
      "Pr": "Prandtl number (dimensionless)",
      "Cp": "Specific heat capacity (J/(kg·K))",
      "μ": "Dynamic viscosity (Pa·s)",
      "k": "Thermal conductivity (W/(m·K))"
    }
  },
  {
    id: uuidv4(),
    title: "Lewis Number",
    category: "Transport Phenomena",
    formula: "Le = α/D",
    description: "Ratio of thermal to mass diffusivity.",
    variables: {
      "Le": "Lewis number (dimensionless)",
      "α": "Thermal diffusivity (m²/s)",
      "D": "Mass diffusivity (m²/s)"
    }
  },
  {
    id: uuidv4(),
    title: "Film Theory",
    category: "Transport Phenomena",
    formula: "j = k(Ci - Cb)",
    description: "Mass or heat transfer across a film.",
    variables: {
      "j": "Flux (mol/(m²·s) or W/m²)",
      "k": "Transfer coefficient",
      "Ci": "Interface concentration/temperature",
      "Cb": "Bulk concentration/temperature"
    }
  },
  {
    id: uuidv4(),
    title: "Chilton-Colburn Analogy",
    category: "Transport Phenomena",
    formula: "jH = jD = f/2",
    description: "Relationship between heat, mass, and momentum transfer.",
    variables: {
      "jH": "Heat transfer j-factor",
      "jD": "Mass transfer j-factor",
      "f": "Friction factor"
    }
  },
  {
    id: uuidv4(),
    title: "Shell Energy Balance",
    category: "Transport Phenomena",
    formula: "∂(ρCpT)/∂t + ∇·(ρCpvT) = ∇·(k∇T) + S",
    description: "Energy conservation in a fluid element.",
    variables: {
      "ρ": "Density (kg/m³)",
      "Cp": "Specific heat capacity (J/(kg·K))",
      "T": "Temperature (K)",
      "t": "Time (s)",
      "v": "Velocity vector (m/s)",
      "k": "Thermal conductivity (W/(m·K))",
      "S": "Energy source term (W/m³)"
    }
  },
  
  // Equipment Design
  {
    id: uuidv4(),
    title: "Distillation Column Sizing",
    category: "Equipment Design",
    formula: "N = ln[(xD/xB)·((1-xB)/(1-xD))] / ln(α)",
    description: "Number of theoretical plates in binary distillation.",
    variables: {
      "N": "Number of theoretical plates",
      "xD": "Distillate composition",
      "xB": "Bottom composition",
      "α": "Relative volatility"
    }
  },
  {
    id: uuidv4(),
    title: "Heat Exchanger Design",
    category: "Equipment Design",
    formula: "Q = U·A·LMTD",
    description: "Heat transfer in a heat exchanger.",
    variables: {
      "Q": "Heat transfer rate (W)",
      "U": "Overall heat transfer coefficient (W/(m²·K))",
      "A": "Heat transfer area (m²)",
      "LMTD": "Log mean temperature difference (K)"
    }
  },
  {
    id: uuidv4(),
    title: "Reactor Volume",
    category: "Equipment Design",
    formula: "V = F·τ",
    description: "Volume of a reactor based on flowrate and residence time.",
    variables: {
      "V": "Reactor volume (m³)",
      "F": "Volumetric flow rate (m³/s)",
      "τ": "Residence time (s)"
    }
  },
  {
    id: uuidv4(),
    title: "Pump Power",
    category: "Equipment Design",
    formula: "P = ρ·g·H·Q / η",
    description: "Power required for a pump.",
    variables: {
      "P": "Power (W)",
      "ρ": "Fluid density (kg/m³)",
      "g": "Gravitational acceleration (9.81 m/s²)",
      "H": "Head (m)",
      "Q": "Volumetric flow rate (m³/s)",
      "η": "Pump efficiency"
    }
  },
  {
    id: uuidv4(),
    title: "Fluidized Bed Velocity",
    category: "Equipment Design",
    formula: "umf = (ρp - ρf)·g·dp² / (150·μ) · (ε³ / (1-ε))",
    description: "Minimum fluidization velocity.",
    variables: {
      "umf": "Minimum fluidization velocity (m/s)",
      "ρp": "Particle density (kg/m³)",
      "ρf": "Fluid density (kg/m³)",
      "g": "Gravitational acceleration (9.81 m/s²)",
      "dp": "Particle diameter (m)",
      "μ": "Fluid viscosity (Pa·s)",
      "ε": "Bed voidage"
    }
  },
  
  // Biochemical Engineering
  {
    id: uuidv4(),
    title: "Monod Equation",
    category: "Biochemical Engineering",
    formula: "μ = μmax · S / (Ks + S)",
    description: "Specific growth rate of microorganisms.",
    variables: {
      "μ": "Specific growth rate (1/h)",
      "μmax": "Maximum specific growth rate (1/h)",
      "S": "Substrate concentration (g/L)",
      "Ks": "Half-saturation constant (g/L)"
    }
  },
  {
    id: uuidv4(),
    title: "Michaelis-Menten Kinetics",
    category: "Biochemical Engineering",
    formula: "v = vmax · [S] / (Km + [S])",
    description: "Rate of enzymatic reactions.",
    variables: {
      "v": "Reaction rate",
      "vmax": "Maximum reaction rate",
      "[S]": "Substrate concentration",
      "Km": "Michaelis constant"
    }
  },
  {
    id: uuidv4(),
    title: "Oxygen Transfer Rate",
    category: "Biochemical Engineering",
    formula: "OTR = kLa · (C* - C)",
    description: "Rate of oxygen transfer in a bioreactor.",
    variables: {
      "OTR": "Oxygen transfer rate (mol/(m³·s))",
      "kLa": "Volumetric mass transfer coefficient (1/s)",
      "C*": "Saturated dissolved oxygen concentration (mol/m³)",
      "C": "Actual dissolved oxygen concentration (mol/m³)"
    }
  },
  {
    id: uuidv4(),
    title: "Bioreactor Productivity",
    category: "Biochemical Engineering",
    formula: "P = D·X",
    description: "Productivity of a continuous bioreactor.",
    variables: {
      "P": "Productivity (g/(L·h))",
      "D": "Dilution rate (1/h)",
      "X": "Cell concentration (g/L)"
    }
  },
  {
    id: uuidv4(),
    title: "Cell Growth",
    category: "Biochemical Engineering",
    formula: "dX/dt = μX - kd·X",
    description: "Change in cell concentration over time.",
    variables: {
      "X": "Cell concentration (g/L)",
      "t": "Time (h)",
      "μ": "Specific growth rate (1/h)",
      "kd": "Death rate constant (1/h)"
    }
  },
  
  // Separation Processes
  {
    id: uuidv4(),
    title: "Relative Volatility",
    category: "Separation Processes",
    formula: "α = (y1/x1) / (y2/x2)",
    description: "Ratio of vapor-liquid equilibrium constants.",
    variables: {
      "α": "Relative volatility",
      "y": "Mole fraction in vapor phase",
      "x": "Mole fraction in liquid phase"
    }
  },
  {
    id: uuidv4(),
    title: "McCabe-Thiele Method",
    category: "Separation Processes",
    formula: "yn+1 = α·xn / (1 + (α-1)·xn)",
    description: "Relationship between liquid and vapor compositions in distillation.",
    variables: {
      "yn+1": "Vapor composition leaving stage n+1",
      "xn": "Liquid composition leaving stage n",
      "α": "Relative volatility"
    }
  },
  {
    id: uuidv4(),
    title: "Minimum Reflux Ratio",
    category: "Separation Processes",
    formula: "Rmin = xD/(xD - xF)",
    description: "Minimum reflux ratio for a distillation column.",
    variables: {
      "Rmin": "Minimum reflux ratio",
      "xD": "Distillate composition",
      "xF": "Feed composition"
    }
  },
  {
    id: uuidv4(),
    title: "HETP",
    category: "Separation Processes",
    formula: "HETP = H / N",
    description: "Height equivalent to a theoretical plate.",
    variables: {
      "HETP": "Height equivalent to a theoretical plate (m)",
      "H": "Total packing height (m)",
      "N": "Number of theoretical plates"
    }
  },
  {
    id: uuidv4(),
    title: "Extraction Distribution Coefficient",
    category: "Separation Processes",
    formula: "KD = Cextract / Craffinate",
    description: "Ratio of concentrations at equilibrium in liquid-liquid extraction.",
    variables: {
      "KD": "Distribution coefficient",
      "Cextract": "Concentration in extract phase",
      "Craffinate": "Concentration in raffinate phase"
    }
  },
  
  // Polymer Engineering
  {
    id: uuidv4(),
    title: "Degree of Polymerization",
    category: "Polymer Engineering",
    formula: "Xn = 1 / (1 - p)",
    description: "Average chain length in step-growth polymerization.",
    variables: {
      "Xn": "Number-average degree of polymerization",
      "p": "Extent of reaction"
    }
  },
  {
    id: uuidv4(),
    title: "Mark-Houwink Equation",
    category: "Polymer Engineering",
    formula: "[η] = K·Mᵃ",
    description: "Relationship between intrinsic viscosity and molecular weight.",
    variables: {
      "[η]": "Intrinsic viscosity",
      "K": "Constant dependent on polymer-solvent system",
      "M": "Molecular weight",
      "a": "Exponent related to polymer shape"
    }
  },
  {
    id: uuidv4(),
    title: "Glass Transition Temperature",
    category: "Polymer Engineering",
    formula: "1/Tg = w1/Tg1 + w2/Tg2",
    description: "Glass transition temperature of a polymer blend.",
    variables: {
      "Tg": "Glass transition temperature of blend (K)",
      "Tg1, Tg2": "Glass transition temperatures of components (K)",
      "w1, w2": "Weight fractions of components"
    }
  },
  {
    id: uuidv4(),
    title: "Flory-Huggins Theory",
    category: "Polymer Engineering",
    formula: "ΔGmix/RT = n1·ln(φ1) + n2·ln(φ2) + n1·φ2·χ12",
    description: "Free energy of mixing for polymer solutions.",
    variables: {
      "ΔGmix": "Gibbs free energy of mixing (J)",
      "R": "Gas constant (8.314 J/(mol·K))",
      "T": "Temperature (K)",
      "n1, n2": "Moles of solvent and polymer",
      "φ1, φ2": "Volume fractions",
      "χ12": "Flory-Huggins interaction parameter"
    }
  },
  {
    id: uuidv4(),
    title: "Molecular Weight Distribution",
    category: "Polymer Engineering",
    formula: "PDI = Mw/Mn",
    description: "Polydispersity index, measure of molecular weight distribution.",
    variables: {
      "PDI": "Polydispersity index",
      "Mw": "Weight-average molecular weight",
      "Mn": "Number-average molecular weight"
    }
  },
  
  // Chemical Equilibrium
  {
    id: uuidv4(),
    title: "Equilibrium Constant",
    category: "Chemical Equilibrium",
    formula: "K = exp(-ΔG°/RT)",
    description: "Relationship between standard Gibbs free energy change and equilibrium constant.",
    variables: {
      "K": "Equilibrium constant",
      "ΔG°": "Standard Gibbs free energy change (J/mol)",
      "R": "Gas constant (8.314 J/(mol·K))",
      "T": "Temperature (K)"
    }
  },
  {
    id: uuidv4(),
    title: "Le Chatelier's Principle",
    category: "Chemical Equilibrium",
    formula: "K = K(T, P, concentration)",
    description: "Equilibrium shifts to counteract imposed changes.",
    variables: {
      "K": "Equilibrium constant",
      "T": "Temperature (K)",
      "P": "Pressure (Pa)"
    }
  },
  {
    id: uuidv4(),
    title: "Activity Coefficient",
    category: "Chemical Equilibrium",
    formula: "ai = γi·xi",
    description: "Activity of a component in a non-ideal solution.",
    variables: {
      "ai": "Activity of component i",
      "γi": "Activity coefficient",
      "xi": "Mole fraction"
    }
  },
  {
    id: uuidv4(),
    title: "van't Hoff Equation",
    category: "Chemical Equilibrium",
    formula: "ln(K2/K1) = (ΔH°/R)·(1/T1 - 1/T2)",
    description: "Temperature dependence of equilibrium constant.",
    variables: {
      "K1, K2": "Equilibrium constants at T1 and T2",
      "ΔH°": "Standard enthalpy change (J/mol)",
      "R": "Gas constant (8.314 J/(mol·K))",
      "T1, T2": "Temperatures (K)"
    }
  },
  {
    id: uuidv4(),
    title: "Equilibrium Conversion",
    category: "Chemical Equilibrium",
    formula: "K = (CA,e·CB,e)/(CC,e·CD,e)",
    description: "Equilibrium concentrations for reaction A + B ⇌ C + D.",
    variables: {
      "K": "Equilibrium constant",
      "Ci,e": "Equilibrium concentration of component i (mol/m³)"
    }
  },
  
  // Phase Equilibria
  {
    id: uuidv4(),
    title: "Raoult's Law",
    category: "Phase Equilibria",
    formula: "Pi = xi·Pi°",
    description: "Vapor pressure of component in ideal solution.",
    variables: {
      "Pi": "Partial pressure of component i (Pa)",
      "xi": "Mole fraction in liquid phase",
      "Pi°": "Vapor pressure of pure component i (Pa)"
    }
  },
  {
    id: uuidv4(),
    title: "Henry's Law",
    category: "Phase Equilibria",
    formula: "Pi = Hi·xi",
    description: "Solubility of gases in liquids at low concentrations.",
    variables: {
      "Pi": "Partial pressure of gas (Pa)",
      "Hi": "Henry's constant (Pa)",
      "xi": "Mole fraction in liquid"
    }
  },
  {
    id: uuidv4(),
    title: "Gibbs Phase Rule",
    category: "Phase Equilibria",
    formula: "F = C - P + 2",
    description: "Degrees of freedom in a thermodynamic system.",
    variables: {
      "F": "Degrees of freedom",
      "C": "Number of components",
      "P": "Number of phases"
    }
  },
  {
    id: uuidv4(),
    title: "Lever Rule",
    category: "Phase Equilibria",
    formula: "mα/mβ = (xβ - x)/(x - xα)",
    description: "Mass ratio of phases in a two-phase region.",
    variables: {
      "mα, mβ": "Masses of phases α and β",
      "xα, xβ": "Compositions of phases α and β",
      "x": "Overall composition"
    }
  },
  {
    id: uuidv4(),
    title: "NRTL Model",
    category: "Phase Equilibria",
    formula: "ln(γi) = [Σ(τji·Gji·xj)]/[Σ(Gki·xk)] + Σ[xj·Gij·(τij - [Σ(τkj·Gkj·xk)]/[Σ(Gkj·xk)])]/[Σ(Gij·xj)]",
    description: "Non-Random Two-Liquid model for activity coefficients.",
    variables: {
      "γi": "Activity coefficient of component i",
      "τij": "Binary interaction parameter",
      "Gij": "Function of τij and non-randomness parameter",
      "xj": "Mole fraction of component j"
    }
  },

  // Corrosion Engineering
  {
    id: uuidv4(),
    title: "Corrosion Rate",
    category: "Corrosion Engineering",
    formula: "CR = (K·W)/(A·T·D)",
    description: "Rate of material loss due to corrosion.",
    variables: {
      "CR": "Corrosion rate (mm/year)",
      "K": "Constant (8.76×10⁴ for mm/year)",
      "W": "Mass loss (g)",
      "A": "Area (cm²)",
      "T": "Time (h)",
      "D": "Density (g/cm³)"
    }
  },
  {
    id: uuidv4(),
    title: "Tafel Equation",
    category: "Corrosion Engineering",
    formula: "η = β·log(i/i0)",
    description: "Relationship between overpotential and current density.",
    variables: {
      "η": "Overpotential (V)",
      "β": "Tafel slope (V)",
      "i": "Current density (A/m²)",
      "i0": "Exchange current density (A/m²)"
    }
  },
  {
    id: uuidv4(),
    title: "Galvanic Series",
    category: "Corrosion Engineering",
    formula: "More negative E → more anodic → more corrosive",
    description: "Electrochemical potential series for metals.",
    variables: {
      "E": "Standard electrode potential (V)"
    }
  },
  {
    id: uuidv4(),
    title: "Nernst Equation",
    category: "Corrosion Engineering",
    formula: "E = E° - (RT/nF)·ln(aRed/aOx)",
    description: "Electrode potential under non-standard conditions.",
    variables: {
      "E": "Electrode potential (V)",
      "E°": "Standard electrode potential (V)",
      "R": "Gas constant (8.314 J/(mol·K))",
      "T": "Temperature (K)",
      "n": "Number of electrons transferred",
      "F": "Faraday constant (96485 C/mol)",
      "aRed, aOx": "Activities of reduced and oxidized species"
    }
  },
  {
    id: uuidv4(),
    title: "Pourbaix Diagram",
    category: "Corrosion Engineering",
    formula: "E-pH diagrams",
    description: "Map of stable phases as functions of potential and pH.",
    variables: {
      "E": "Electrode potential (V)",
      "pH": "Acidity"
    }
  },

  // Environmental Engineering
  {
    id: uuidv4(),
    title: "BOD Removal",
    category: "Environmental Engineering",
    formula: "BOD removal = (BODin - BODout)/BODin × 100%",
    description: "Efficiency of biological oxygen demand removal.",
    variables: {
      "BODin": "Influent BOD (mg/L)",
      "BODout": "Effluent BOD (mg/L)"
    }
  },
  {
    id: uuidv4(),
    title: "Adsorption Isotherm (Langmuir)",
    category: "Environmental Engineering",
    formula: "qe = (qmax·KL·Ce)/(1 + KL·Ce)",
    description: "Relationship between adsorbent loading and equilibrium concentration.",
    variables: {
      "qe": "Adsorption capacity at equilibrium (mg/g)",
      "qmax": "Maximum adsorption capacity (mg/g)",
      "KL": "Langmuir constant (L/mg)",
      "Ce": "Equilibrium concentration (mg/L)"
    }
  },
  {
    id: uuidv4(),
    title: "Henry's Law Constant",
    category: "Environmental Engineering",
    formula: "KH = p/c",
    description: "Partitioning between gas and aqueous phase.",
    variables: {
      "KH": "Henry's law constant (Pa·m³/mol)",
      "p": "Partial pressure (Pa)",
      "c": "Aqueous concentration (mol/m³)"
    }
  },
  {
    id: uuidv4(),
    title: "Activated Sludge Process",
    category: "Environmental Engineering",
    formula: "SRT = V·X/(Qw·Xw)",
    description: "Solids retention time in activated sludge systems.",
    variables: {
      "SRT": "Solids retention time (days)",
      "V": "Reactor volume (m³)",
      "X": "MLSS concentration (mg/L)",
      "Qw": "Waste sludge flow rate (m³/day)",
      "Xw": "Waste sludge concentration (mg/L)"
    }
  },
  {
    id: uuidv4(),
    title: "Dispersion Model",
    category: "Environmental Engineering",
    formula: "C(x,y,z) = (Q/(2π·u·σy·σz))·exp(-y²/(2σy²))·exp(-z²/(2σz²))",
    description: "Gaussian dispersion model for air pollutants.",
    variables: {
      "C": "Concentration (g/m³)",
      "Q": "Emission rate (g/s)",
      "u": "Wind speed (m/s)",
      "σy, σz": "Dispersion coefficients (m)",
      "x,y,z": "Coordinates (m)"
    }
  },

  // Safety Engineering
  {
    id: uuidv4(),
    title: "Lower Flammability Limit",
    category: "Safety Engineering",
    formula: "LFL = 100·(ΣCi·LFLi)/[100 - Σ((100 - LFLi)·Ci/LFLi)]",
    description: "Lower flammability limit for gas mixtures.",
    variables: {
      "LFL": "Lower flammability limit of mixture (%vol)",
      "Ci": "Concentration of component i (%vol)",
      "LFLi": "Lower flammability limit of component i (%vol)"
    }
  },
  {
    id: uuidv4(),
    title: "TNT Equivalence",
    category: "Safety Engineering",
    formula: "WTNT = α·W·(HC/HCTNT)",
    description: "TNT equivalent for explosion hazard assessment.",
    variables: {
      "WTNT": "TNT equivalent mass (kg)",
      "α": "Yield factor",
      "W": "Mass of flammable material (kg)",
      "HC": "Heat of combustion (J/kg)",
      "HCTNT": "Heat of combustion of TNT (4.68×10⁶ J/kg)"
    }
  },
  {
    id: uuidv4(),
    title: "Dow Fire and Explosion Index",
    category: "Safety Engineering",
    formula: "F&EI = MF · (1 + GPH + SPH)",
    description: "Index for hazard assessment of process units.",
    variables: {
      "F&EI": "Fire and Explosion Index",
      "MF": "Material Factor",
      "GPH": "General Process Hazards",
      "SPH": "Special Process Hazards"
    }
  },
  {
    id: uuidv4(),
    title: "Pressure Relief Valve Sizing",
    category: "Safety Engineering",
    formula: "A = Q/(C·Kd·P1·Kb·√(MW/ZT))",
    description: "Required relief area for gases/vapors.",
    variables: {
      "A": "Relief area (mm²)",
      "Q": "Flow capacity (kg/h)",
      "C": "Coefficient of discharge",
      "Kd": "Effective coefficient of discharge",
      "P1": "Upstream pressure (kPa absolute)",
      "Kb": "Capacity correction factor",
      "MW": "Molecular weight (kg/kmol)",
      "Z": "Compressibility factor",
      "T": "Temperature (K)"
    }
  },
  {
    id: uuidv4(),
    title: "Risk Assessment",
    category: "Safety Engineering",
    formula: "Risk = Probability × Consequence",
    description: "Basic formula for quantitative risk assessment.",
    variables: {
      "Risk": "Risk level",
      "Probability": "Likelihood of occurrence",
      "Consequence": "Severity of outcome"
    }
  },

  // Process Economics
  {
    id: uuidv4(),
    title: "Payback Period",
    category: "Process Economics",
    formula: "PBP = Capital Investment / Annual Cash Flow",
    description: "Time required to recover the cost of an investment.",
    variables: {
      "PBP": "Payback period (years)",
      "Capital Investment": "Initial investment (currency)",
      "Annual Cash Flow": "Net annual revenue (currency/year)"
    }
  },
  {
    id: uuidv4(),
    title: "Net Present Value",
    category: "Process Economics",
    formula: "NPV = Σ[CFt / (1+r)ᵗ] - CI",
    description: "Present value of future cash flows minus initial investment.",
    variables: {
      "NPV": "Net present value (currency)",
      "CFt": "Cash flow in period t (currency)",
      "r": "Discount rate",
      "t": "Time period (years)",
      "CI": "Capital investment (currency)"
    }
  },
  {
    id: uuidv4(),
    title: "Return on Investment",
    category: "Process Economics",
    formula: "ROI = (Annual Profit / Total Investment) × 100%",
    description: "Measure of investment profitability.",
    variables: {
      "ROI": "Return on investment (%)",
      "Annual Profit": "Net annual profit (currency/year)",
      "Total Investment": "Total capital investment (currency)"
    }
  },
  {
    id: uuidv4(),
    title: "Capital Cost Estimation",
    category: "Process Economics",
    formula: "C2 = C1·(Q2/Q1)ⁿ",
    description: "Scaling relationship for equipment cost.",
    variables: {
      "C2": "Cost of equipment with capacity Q2 (currency)",
      "C1": "Known cost of equipment with capacity Q1 (currency)",
      "Q2, Q1": "Capacities",
      "n": "Scaling exponent (typically 0.6-0.7)"
    }
  },
  {
    id: uuidv4(),
    title: "Discount Cash Flow Rate of Return",
    category: "Process Economics",
    formula: "Σ[CFt / (1+DCFRR)ᵗ] - CI = 0",
    description: "Discount rate that makes NPV equal to zero.",
    variables: {
      "CFt": "Cash flow in period t (currency)",
      "DCFRR": "Discount cash flow rate of return",
      "t": "Time period (years)",
      "CI": "Capital investment (currency)"
    }
  }
];

// Function to get all unique categories
export function getAllCategories(): string[] {
  const categories = new Set(chemicalEngineeringFormulas.map(formula => formula.category));
  return Array.from(categories);
}
