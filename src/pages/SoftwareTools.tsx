import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GlassPanel from "@/components/ui/GlassPanel";
import { 
  Cpu, 
  Thermometer, 
  Beaker, 
  BarChart, 
  Sliders, 
  Square, 
  RefreshCw, 
  Wind, 
  Database, 
  Wrench,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  ExternalLink,
  PlayCircle,
  FileText,
  FlaskConical,  // Replaced Flask with FlaskConical
  Atom,
  GraduationCap,
  ShieldAlert,
  Factory,
  GitBranch,
  CloudLightning
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import ProcessSimulationInterface from "@/components/software-interfaces/ProcessSimulationInterface";
import ThermodynamicInterface from "@/components/software-interfaces/ThermodynamicInterface";
import ReactionEngineeringInterface from "@/components/software-interfaces/ReactionEngineeringInterface";
import DataAnalysisInterface from "@/components/software-interfaces/DataAnalysisInterface";
import ProcessControlInterface from "@/components/software-interfaces/ProcessControlInterface";
import EquipmentDesignInterface from "@/components/software-interfaces/EquipmentDesignInterface";
import PipingDesignInterface from "@/components/software-interfaces/PipingDesignInterface";
import EnvironmentalSafetyInterface from "@/components/software-interfaces/EnvironmentalSafetyInterface";
import CFDInterface from "@/components/software-interfaces/CFDInterface";
import ChemicalDatabaseInterface from "@/components/software-interfaces/ChemicalDatabaseInterface";
import MiscellaneousToolsInterface from "@/components/software-interfaces/MiscellaneousToolsInterface";

interface Software {
  name: string;
  description: string;
  category: SoftwareCategory;
  isFree?: boolean;
  isOpenSource?: boolean;
  url?: string;
  features?: string[];
  supportsRSM?: boolean;
}

type SoftwareCategory = 
  | "process-simulation"
  | "thermodynamic"
  | "reaction-engineering"
  | "data-analysis"
  | "process-control"
  | "equipment-design"
  | "piping-design"
  | "environmental-safety"
  | "cfd"
  | "chemical-database"
  | "molecular-modeling"
  | "educational"
  | "miscellaneous";

interface CategoryInfo {
  id: SoftwareCategory;
  name: string;
  icon: React.ReactNode;
  description: string;
}

const softwareCategories: CategoryInfo[] = [
  {
    id: "process-simulation",
    name: "Process Simulation & Modeling",
    icon: <Cpu className="h-5 w-5" />,
    description: "Used to simulate entire chemical processes with thermodynamic calculations, equipment sizing, and optimization."
  },
  {
    id: "thermodynamic",
    name: "Thermodynamic & Property Calculation",
    icon: <Thermometer className="h-5 w-5" />,
    description: "Specialized in calculating phase behavior, physical properties, and thermodynamic equilibrium."
  },
  {
    id: "reaction-engineering",
    name: "Reaction Engineering & Kinetics",
    icon: <Beaker className="h-5 w-5" />,
    description: "Used for modeling chemical reactors, reaction kinetics, and complex reaction mechanisms."
  },
  {
    id: "data-analysis",
    name: "Data Analysis & Statistics",
    icon: <BarChart className="h-5 w-5" />,
    description: "Essential tools for interpreting experimental data, process data, and statistical analysis."
  },
  {
    id: "process-control",
    name: "Process Control & Automation",
    icon: <Sliders className="h-5 w-5" />,
    description: "Software used to model control loops, automation systems, and dynamic responses."
  },
  {
    id: "equipment-design",
    name: "Equipment Design & Sizing",
    icon: <Square className="h-5 w-5" />,
    description: "Specialized in designing heat exchangers, reactors, separators, and other process equipment."
  },
  {
    id: "piping-design",
    name: "Piping and Instrumentation Design",
    icon: <RefreshCw className="h-5 w-5" />,
    description: "Used for creating plant schematics, piping layouts, and instrumentation diagrams."
  },
  {
    id: "environmental-safety",
    name: "Environmental & Safety Engineering",
    icon: <ShieldAlert className="h-5 w-5" />,
    description: "Tools for assessing process safety, emissions modeling, and environmental impact analysis."
  },
  {
    id: "cfd",
    name: "Computational Fluid Dynamics",
    icon: <Wind className="h-5 w-5" />,
    description: "Advanced simulation of fluid flow, heat transfer, and mass transfer with detailed spatial resolution."
  },
  {
    id: "chemical-database",
    name: "Chemical Database & Properties",
    icon: <Database className="h-5 w-5" />,
    description: "Used for accessing chemical property databases and property estimation."
  },
  {
    id: "molecular-modeling",
    name: "Molecular Modeling & Materials Design",
    icon: <Atom className="h-5 w-5" />,
    description: "Tools for molecular design, structure analysis, and material property prediction."
  },
  {
    id: "educational",
    name: "Educational Tools",
    icon: <GraduationCap className="h-5 w-5" />,
    description: "Software used for teaching and learning chemical engineering concepts."
  },
  {
    id: "miscellaneous",
    name: "Miscellaneous Tools",
    icon: <Wrench className="h-5 w-5" />,
    description: "Specialized software for integrated tasks and unique chemical engineering applications."
  }
];

const softwareDatabase: Software[] = [
  // Process Simulation & Modeling
  {
    name: "Aspen HYSYS",
    description: "Industry-standard for oil & gas, chemical process simulation.",
    category: "process-simulation",
    features: [
      "Process flowsheeting",
      "Oil & gas specific models",
      "Dynamic simulation capabilities",
      "Pipe sizing and pressure drop calculations",
      "Support for RSM (Response Surface Methodology)"
    ],
    supportsRSM: true
  },
  {
    name: "Aspen Plus",
    description: "Focused on chemical, petrochemical, and refining industries.",
    category: "process-simulation",
    features: [
      "Detailed chemical process modeling",
      "Rigorous distillation calculations",
      "Solid handling capabilities",
      "Rate-based separation models",
      "RSM for optimization studies"
    ],
    supportsRSM: true
  },
  {
    name: "CHEMCAD",
    description: "Process simulation with a user-friendly interface.",
    category: "process-simulation",
    features: [
      "Flowsheet simulation",
      "Equipment sizing",
      "Thermodynamic calculations",
      "Heat exchanger design",
      "RSM integration available"
    ],
    supportsRSM: true
  },
  {
    name: "ProSim",
    description: "Simulates thermodynamic and chemical engineering processes.",
    category: "process-simulation",
    features: [
      "Process simulation",
      "Thermodynamic calculations",
      "Dynamic batch process modeling",
      "Energy optimization"
    ]
  },
  {
    name: "DWSIM",
    description: "Free, open-source simulator with graphical interface.",
    category: "process-simulation",
    isFree: true,
    isOpenSource: true,
    url: "https://dwsim.org/",
    features: [
      "Steady-state simulation",
      "Thermodynamic models",
      "Unit operations",
      "Cape-Open compatibility"
    ]
  },
  {
    name: "COCO Simulator",
    description: "Free CAPE-OPEN simulator with modular flexibility.",
    category: "process-simulation",
    isFree: true,
    url: "https://www.cocosimulator.org/",
    features: [
      "Modular design",
      "Cape-Open compatibility",
      "Extensible architecture",
      "Thermodynamic packages"
    ]
  },
  {
    name: "SuperPro Designer",
    description: "For modeling batch and continuous processes in biotech, pharma, food industries.",
    category: "process-simulation",
    features: [
      "Batch process scheduling",
      "Bioprocessing models",
      "Equipment sizing",
      "Economic evaluation"
    ]
  },
  {
    name: "gPROMS",
    description: "Advanced process modeling platform with custom model development capabilities.",
    category: "process-simulation",
    features: [
      "Custom model development",
      "Advanced optimization",
      "Parameter estimation",
      "Integrated RSM capabilities",
      "Digital twin development"
    ],
    supportsRSM: true
  },
  {
    name: "VMGSim",
    description: "Process simulator with advanced thermodynamic capabilities.",
    category: "process-simulation",
    features: [
      "Advanced equation of state models",
      "Fluid characterization",
      "Process modeling",
      "Dynamic simulation"
    ]
  },
  {
    name: "BioWin",
    description: "Specialized simulator for wastewater treatment processes.",
    category: "process-simulation",
    features: [
      "Biological wastewater treatment modeling",
      "Process design and optimization",
      "Operational troubleshooting",
      "Plant capacity analysis"
    ]
  },
  {
    name: "SimSci PRO/II",
    description: "Comprehensive process engineering design and optimization tool.",
    category: "process-simulation",
    features: [
      "Process modeling",
      "Heat and material balances",
      "Equipment sizing",
      "Economics evaluation",
      "RSM capabilities"
    ],
    supportsRSM: true
  },
  {
    name: "UniSim Design",
    description: "Honeywell's process simulation and optimization software.",
    category: "process-simulation",
    features: [
      "Process modeling",
      "Refinery and gas processing",
      "Equipment sizing",
      "Dynamic simulation",
      "RSM implementation"
    ],
    supportsRSM: true
  },

  // Thermodynamic & Property Calculation
  {
    name: "REFPROP",
    description: "Accurate thermophysical properties database developed by NIST.",
    category: "thermodynamic",
    features: [
      "High-accuracy pure component properties",
      "Mixture thermodynamic properties",
      "Transport properties",
      "Phase equilibrium calculations"
    ]
  },
  {
    name: "CoolProp",
    description: "Open-source alternative to REFPROP.",
    category: "thermodynamic",
    isOpenSource: true,
    isFree: true,
    url: "http://www.coolprop.org/",
    features: [
      "Thermophysical properties",
      "Many pure and pseudo-pure fluids",
      "Cross-platform compatibility",
      "Python, MATLAB, C++ interfaces"
    ]
  },
  {
    name: "HSC Chemistry",
    description: "Thermodynamic modeling, particularly in metallurgy.",
    category: "thermodynamic",
    features: [
      "Extensive thermochemical database",
      "Heat and material balances",
      "Reaction equations",
      "Equilibrium calculations"
    ]
  },
  {
    name: "OLI Systems",
    description: "Specialized in electrolyte chemistry and corrosion modeling.",
    category: "thermodynamic",
    features: [
      "Electrolyte thermodynamics",
      "Corrosion prediction",
      "Scale formation modeling",
      "Aqueous chemistry"
    ]
  },

  // Reaction Engineering & Kinetics
  {
    name: "Kintecus",
    description: "Simulates complex chemical reactions and kinetics.",
    category: "reaction-engineering",
    features: [
      "Chemical kinetics simulation",
      "Reaction mechanism analysis",
      "Parameter fitting",
      "Sensitivity analysis"
    ]
  },
  {
    name: "CHEMKIN",
    description: "Widely used in combustion and reaction mechanism simulations.",
    category: "reaction-engineering",
    features: [
      "Gas-phase kinetics",
      "Combustion modeling",
      "Surface chemistry",
      "Transport properties"
    ]
  },
  {
    name: "Cantera",
    description: "Open-source suite for chemical kinetics, thermodynamics, transport.",
    category: "reaction-engineering",
    isOpenSource: true,
    isFree: true,
    url: "https://cantera.org/",
    features: [
      "Chemical kinetics",
      "Thermodynamics",
      "Transport processes",
      "1D flame models"
    ]
  },
  {
    name: "POLYMATH",
    description: "Solves ODEs for reaction kinetics and other calculations.",
    category: "reaction-engineering",
    features: [
      "Differential equations solver",
      "Non-linear equations",
      "Regression analysis",
      "Data analysis tools"
    ]
  },
  {
    name: "ReactorLab",
    description: "Educational software for reaction engineering concepts.",
    category: "reaction-engineering",
    isFree: true,
    features: [
      "Interactive reactor models",
      "Kinetics visualization",
      "Educational examples",
      "Parameter sensitivity"
    ]
  },

  // Data Analysis & Statistics
  {
    name: "MATLAB",
    description: "Widely used for numerical analysis, simulations, and algorithm development.",
    category: "data-analysis",
    features: [
      "Numerical computing",
      "Visualization",
      "Programming environment",
      "Advanced toolboxes for specialized analyses",
      "Built-in RSM capabilities"
    ],
    supportsRSM: true
  },
  {
    name: "Python (with NumPy, SciPy, Pandas)",
    description: "Open-source alternative to MATLAB with extensive libraries.",
    category: "data-analysis",
    isOpenSource: true,
    isFree: true,
    url: "https://www.python.org/",
    features: [
      "Numerical computing",
      "Data manipulation",
      "Statistical analysis",
      "Machine learning capabilities",
      "RSM packages available"
    ],
    supportsRSM: true
  },
  {
    name: "R",
    description: "Statistical analysis and graphical representation.",
    category: "data-analysis",
    isOpenSource: true,
    isFree: true,
    url: "https://www.r-project.org/",
    features: [
      "Statistical computing",
      "Data visualization",
      "Extensive statistical packages",
      "Reproducible research",
      "Comprehensive RSM packages"
    ],
    supportsRSM: true
  },
  {
    name: "Excel with VBA",
    description: "Basic data modeling and process calculations.",
    category: "data-analysis",
    features: [
      "Spreadsheet calculations",
      "Basic data analysis",
      "Visual Basic programming",
      "Data visualization",
      "RSM add-ins available"
    ],
    supportsRSM: true
  },
  {
    name: "GAMS",
    description: "General Algebraic Modeling System for optimization.",
    category: "data-analysis",
    features: [
      "Mathematical programming",
      "Optimization modeling language",
      "Multiple solver interfaces",
      "RSM implementation"
    ],
    supportsRSM: true
  },
  {
    name: "AMPL",
    description: "Algebraic modeling language for optimization problems.",
    category: "data-analysis",
    features: [
      "Optimization modeling",
      "Mathematical programming",
      "Multiple solver support",
      "RSM functionality"
    ],
    supportsRSM: true
  },
  {
    name: "KNIME",
    description: "Open-source data analytics, reporting and integration platform.",
    category: "data-analysis",
    isOpenSource: true,
    isFree: true,
    features: [
      "Visual workflow creation",
      "Data mining",
      "Machine learning",
      "RSM workflow templates"
    ],
    supportsRSM: true
  },
  {
    name: "RapidMiner",
    description: "Data science platform for analytics teams.",
    category: "data-analysis",
    features: [
      "Predictive analytics",
      "Machine learning",
      "Data mining",
      "Visual workflow design",
      "RSM capabilities"
    ],
    supportsRSM: true
  },

  // Process Control & Automation
  {
    name: "MATLAB Simulink",
    description: "Dynamic modeling and control system design.",
    category: "process-control",
    features: [
      "Dynamic system modeling",
      "Control system design",
      "Simulation",
      "Code generation"
    ]
  },
  {
    name: "LabVIEW",
    description: "Measurement and control with hardware integration.",
    category: "process-control",
    features: [
      "Data acquisition",
      "Instrument control",
      "Real-time control systems",
      "Hardware integration"
    ]
  },
  {
    name: "Rockwell Automation",
    description: "Industry-standard DCS/PLC programming and simulation.",
    category: "process-control",
    features: [
      "PLC programming",
      "HMI development",
      "Process control",
      "System integration"
    ]
  },
  {
    name: "Siemens TIA Portal",
    description: "Integrated automation software for Siemens hardware.",
    category: "process-control",
    features: [
      "PLC programming",
      "HMI development",
      "Network configuration",
      "Diagnostics"
    ]
  },
  {
    name: "DeltaV DCS",
    description: "Distributed control system by Emerson.",
    category: "process-control",
    features: [
      "Process automation",
      "Control strategy implementation",
      "Batch control",
      "Plant operations"
    ]
  },
  {
    name: "PID Tuner",
    description: "Tool for designing and tuning control loops.",
    category: "process-control",
    features: [
      "PID controller tuning",
      "Control performance analysis",
      "Stability assessment",
      "Loop optimization"
    ]
  },

  // Equipment Design & Sizing
  {
    name: "HTRI Xchanger Suite",
    description: "Advanced heat exchanger design.",
    category: "equipment-design",
    features: [
      "Shell and tube exchangers",
      "Air coolers",
      "Plate exchangers",
      "Thermal design and rating"
    ]
  },
  {
    name: "Aspen Exchanger Design & Rating",
    description: "Integrated with Aspen tools for heat exchanger design.",
    category: "equipment-design",
    features: [
      "Heat exchanger design",
      "Mechanical design",
      "Performance rating",
      "Integration with Aspen Plus/HYSYS"
    ]
  },
  {
    name: "CHEMCAD Mechanical",
    description: "Equipment design with mechanical specifications.",
    category: "equipment-design",
    features: [
      "Pressure vessel design",
      "Heat exchanger design",
      "ASME code calculations",
      "Integration with CHEMCAD process simulation"
    ]
  },
  {
    name: "Aspen Capital Cost Estimator",
    description: "Equipment sizing and cost estimation.",
    category: "equipment-design",
    features: [
      "Cost estimation",
      "Equipment sizing",
      "Project scheduling",
      "Capital expenditure planning"
    ]
  },

  // Piping and Instrumentation Design
  {
    name: "AutoCAD P&ID / Plant 3D",
    description: "For detailed 2D/3D plant drawings.",
    category: "piping-design",
    features: [
      "P&ID creation",
      "3D plant modeling",
      "Specification-driven design",
      "Isometric drawing generation"
    ]
  },
  {
    name: "SmartPlant P&ID",
    description: "Professional plant and instrumentation diagrams.",
    category: "piping-design",
    features: [
      "Intelligent P&IDs",
      "Data-centric design",
      "Rule checking",
      "Integration with 3D design tools"
    ]
  },
  {
    name: "AVEVA Diagrams / E3D",
    description: "Advanced 3D plant design and modeling.",
    category: "piping-design",
    features: [
      "Data-centric 3D design",
      "Clash detection",
      "Multi-discipline coordination",
      "Construction planning"
    ]
  },
  {
    name: "AFT Fathom",
    description: "Pipe flow analysis tool for liquid systems.",
    category: "piping-design",
    features: [
      "Pipe sizing",
      "Pressure drop calculations",
      "Pump selection",
      "System optimization"
    ]
  },
  {
    name: "AFT Arrow",
    description: "Gas piping system design and analysis.",
    category: "piping-design",
    features: [
      "Gas flow modeling",
      "Compressor selection",
      "Pressure drop analysis",
      "System optimization"
    ]
  },

  // Environmental & Safety Engineering
  {
    name: "PHAST",
    description: "Risk assessment and consequence modeling.",
    category: "environmental-safety",
    features: [
      "Consequence analysis",
      "Dispersion modeling",
      "Fire and explosion modeling",
      "Risk assessment"
    ]
  },
  {
    name: "AERMOD",
    description: "Air pollution dispersion modeling.",
    category: "environmental-safety",
    features: [
      "Gaussian plume model",
      "Regulatory compliance",
      "Terrain effects",
      "Building downwash"
    ]
  },
  {
    name: "FLACS",
    description: "Explosion modeling and gas dispersion.",
    category: "environmental-safety",
    features: [
      "CFD-based explosion modeling",
      "Gas dispersion",
      "Flame acceleration",
      "Risk-based facility siting"
    ]
  },
  {
    name: "GEMS",
    description: "Greenhouse gas simulation and analysis.",
    category: "environmental-safety",
    features: [
      "Carbon footprint calculation",
      "Emission inventories",
      "Regulatory reporting",
      "Abatement scenario modeling"
    ]
  },
  {
    name: "PHREEQC",
    description: "Geochemical modeling software for water chemistry.",
    category: "environmental-safety",
    features: [
      "Aqueous geochemical calculations",
      "Reaction path modeling",
      "Speciation analysis",
      "Transport modeling"
    ]
  },
  {
    name: "Toxicity Estimation Software Tool",
    description: "EPA tool for chemical toxicity estimation.",
    category: "environmental-safety",
    isFree: true,
    features: [
      "Toxicity prediction",
      "QSAR models",
      "Environmental fate modeling",
      "Regulatory support"
    ]
  },

  // Computational Fluid Dynamics (CFD)
  {
    name: "ANSYS Fluent / CFX",
    description: "Industry-leading CFD tools.",
    category: "cfd",
    features: [
      "Multiphase flow",
      "Heat transfer",
      "Chemical reactions",
      "Turbulence modeling"
    ]
  },
  {
    name: "COMSOL Multiphysics",
    description: "Multiphysics simulation including chemical transport.",
    category: "cfd",
    features: [
      "Coupled physics phenomena",
      "Chemical reaction engineering",
      "Transport processes",
      "Heat transfer"
    ]
  },
  {
    name: "OpenFOAM",
    description: "Open-source CFD with advanced customization.",
    category: "cfd",
    isOpenSource: true,
    isFree: true,
    url: "https://www.openfoam.com/",
    features: [
      "Customizable solvers",
      "Extensive physics models",
      "Parallel computing",
      "Pre and post-processing tools"
    ]
  },
  {
    name: "STAR-CCM+",
    description: "CFD software with extensive physics modeling.",
    category: "cfd",
    features: [
      "Multiphysics modeling",
      "Automated meshing",
      "Flow, thermal and stress simulation",
      "Design exploration"
    ]
  },
  {
    name: "PEMFC Simulations",
    description: "Specialized tools for fuel cell modeling.",
    category: "cfd",
    features: [
      "Electrochemical modeling",
      "Mass transport",
      "Heat transfer",
      "Performance optimization"
    ]
  },

  // Chemical Database & Properties
  {
    name: "ChemDraw",
    description: "Drawing chemical structures and reaction schemes.",
    category: "chemical-database",
    features: [
      "Chemical structure drawing",
      "Reaction schemes",
      "Property prediction",
      "3D visualization"
    ]
  },
  {
    name: "ChemAxon",
    description: "Cheminformatics platform for chemistry data management.",
    category: "chemical-database",
    features: [
      "Chemical database management",
      "Structure search",
      "Property prediction",
      "Reaction planning"
    ]
  },

  // Molecular Modeling & Materials Design
  {
    name: "Materials Studio",
    description: "Comprehensive materials modeling and simulation environment.",
    category: "molecular-modeling",
    features: [
      "Crystal structure prediction",
      "Molecular dynamics",
      "Quantum mechanics",
      "Property prediction"
    ]
  },
  {
    name: "LAMMPS",
    description: "Large-scale Atomic/Molecular Massively Parallel Simulator.",
    category: "molecular-modeling",
    isOpenSource: true,
    isFree: true,
    features: [
      "Molecular dynamics",
      "Soft materials modeling",
      "Parallel computing",
      "Extensible architecture"
    ]
  },
  {
    name: "Gaussian",
    description: "Molecular modeling and quantum chemistry.",
    category: "molecular-modeling",
    features: [
      "Quantum chemical calculations",
      "Electronic structure methods",
      "Spectroscopic properties",
      "Reaction pathways"
    ]
  },
  {
    name: "ORCA",
    description: "Quantum chemistry program package.",
    category: "molecular-modeling",
    isFree: true,
    features: [
      "Electronic structure calculations",
      "Spectroscopy prediction",
      "Transition states",
      "Properties prediction"
    ]
  },
  {
    name: "VASP",
    description: "Vienna Ab initio Simulation Package for electronic structure calculations.",
    category: "molecular-modeling",
    features: [
      "Density functional theory",
      "Material properties",
      "Electronic structure",
      "Transition states"
    ]
  },
  {
    name: "Avogadro",
    description: "Advanced molecule editor and visualizer.",
    category: "molecular-modeling",
    isOpenSource: true,
    isFree: true,
    url: "https://avogadro.cc/",
    features: [
      "Molecule building",
      "Visualization",
      "Structure optimization",
      "Integration with quantum chemistry"
    ]
  },
  {
    name: "Spartan",
    description: "3D chemical structure analysis and modeling.",
    category: "molecular-modeling",
    features: [
      "Molecular mechanics",
      "Quantum chemistry",
      "Structure visualization",
      "Property prediction"
    ]
  },
  {
    name: "HyperChem",
    description: "Visualization and molecular mechanics/dynamics.",
    category: "molecular-modeling",
    features: [
      "Molecular mechanics",
      "Quantum chemistry",
      "Molecular dynamics",
      "3D visualization"
    ]
  },

  // Educational Tools
  {
    name: "Engineering Equation Solver",
    description: "Specialized solver for engineering thermodynamics and heat transfer.",
    category: "educational",
    features: [
      "Thermodynamic property lookup",
      "Equation solving",
      "Parametric tables",
      "Engineering calculations"
    ]
  },
  {
    name: "LearnChemE",
    description: "Collection of educational resources for chemical engineering.",
    category: "educational",
    isFree: true,
    features: [
      "Interactive simulations",
      "Concept demonstrations",
      "Educational modules",
      "Problem solving resources"
    ]
  },
  {
    name: "Virtual Lab Simulations",
    description: "Interactive laboratory simulations for education.",
    category: "educational",
    features: [
      "Virtual experiments",
      "Safety training",
      "Equipment operation",
      "Process visualization"
    ]
  },
  {
    name: "Polymath",
    description: "Educational software for solving equations and ODEs.",
    category: "educational",
    features: [
      "Nonlinear equation solving",
      "ODE integration",
      "Regression analysis",
      "Educational interface"
    ]
  },

  // Miscellaneous Tools
  {
    name: "Aspen Energy Analyzer",
    description: "Pinch analysis and energy optimization.",
    category: "miscellaneous",
    features: [
      "Pinch analysis",
      "Heat exchanger network design",
      "Utility targeting",
      "Energy optimization"
    ]
  },
  {
    name: "Aspen Dynamics",
    description: "Process dynamics and control.",
    category: "miscellaneous",
    features: [
      "Dynamic process simulation",
      "Control system design",
      "Disturbance testing",
      "Safety system verification"
    ]
  },
  {
    name: "CALPUFF",
    description: "Advanced air quality modeling system.",
    category: "miscellaneous",
    features: [
      "Air dispersion modeling",
      "Long-range transport",
      "Complex terrain effects",
      "Chemical transformation"
    ]
  }
];

const SoftwareTools = () => {
  const [activeCategory, setActiveCategory] = useState<SoftwareCategory | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOptions, setFilterOptions] = useState({
    showFreeOnly: false,
    showOpenSourceOnly: false,
    showRSMOnly: false
  });
  const [expandedSoftware, setExpandedSoftware] = useState<string | null>(null);
  const [openSoftware, setOpenSoftware] = useState<Software | null>(null);
  const [softwareLoading, setSoftwareLoading] = useState<boolean>(false);

  const handleToggleExpand = (softwareName: string) => {
    if (expandedSoftware === softwareName) {
      setExpandedSoftware(null);
    } else {
      setExpandedSoftware(softwareName);
    }
  };

  const handleOpenSoftware = (software: Software) => {
    setSoftwareLoading(true);
    setTimeout(() => {
      setSoftwareLoading(false);
      setOpenSoftware(software);
    }, 1200);
  };

  const handleCloseSoftware = () => {
    setOpenSoftware(null);
  };

  const filteredSoftware = softwareDatabase.filter(software => {
    if (activeCategory !== "all" && software.category !== activeCategory) {
      return false;
    }
    
    if (searchTerm && !software.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !software.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    if (filterOptions.showFreeOnly && !software.isFree) {
      return false;
    }
    
    if (filterOptions.showOpenSourceOnly && !software.isOpenSource) {
      return false;
    }
    
    if (filterOptions.showRSMOnly && !software.supportsRSM) {
      return false;
    }
    
    return true;
  });

  const renderSoftwareInterface = (software: Software) => {
    switch (software.category) {
      case "process-simulation":
        return <ProcessSimulationInterface software={software} />;
      case "thermodynamic":
        return <ThermodynamicInterface software={software} />;
      case "reaction-engineering":
        return <ReactionEngineeringInterface software={software} />;
      case "data-analysis":
        return <DataAnalysisInterface software={software} />;
      case "process-control":
        return <ProcessControlInterface software={software} />;
      case "equipment-design":
        return <EquipmentDesignInterface software={software} />;
      case "piping-design":
        return <PipingDesignInterface software={software} />;
      case "environmental-safety":
        return <EnvironmentalSafetyInterface software={software} />;
      case "cfd":
        return <CFDInterface software={software} />;
      case "chemical-database":
      case "molecular-modeling":
        return <ChemicalDatabaseInterface software={software} />;
      case "educational":
      case "miscellaneous":
        return <MiscellaneousToolsInterface software={software} />;
      default:
        return <div>Software interface not available</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 dark:text-white">
      <Navbar />
      
      <main className="flex-1 py-16 px-6 animate-fade-in">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-8 relative">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
