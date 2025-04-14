
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
  FlaskConical,
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
  // Process Simulation
  {
    name: "Aspen Plus",
    description: "Industry-standard process simulation software for steady-state chemical processes with extensive thermodynamic databases and equipment models.",
    category: "process-simulation",
    features: ["Steady-state simulation", "Thermodynamic models", "Equipment sizing", "Chemical reactions", "Optimization"],
    url: "https://www.aspentech.com/en/products/engineering/aspen-plus"
  },
  {
    name: "Aspen HYSYS",
    description: "Process simulation tool focused on oil, gas, refining, and petrochemical processes with dynamic modeling capabilities.",
    category: "process-simulation",
    features: ["Oil & gas processing", "Dynamic simulation", "Pressure relief analysis", "Petroleum refining"],
    url: "https://www.aspentech.com/en/products/engineering/aspen-hysys"
  },
  {
    name: "ProMax",
    description: "Process simulation software specializing in natural gas processing, refining, and chemical manufacturing with robust thermodynamic packages.",
    category: "process-simulation",
    features: ["Natural gas processing", "Amine treating", "Sulfur recovery", "Dehydration processes"],
    url: "https://www.bre.com/software/promax/"
  },
  {
    name: "CHEMCAD",
    description: "Intuitive process simulation suite with specialized modules for various chemical engineering applications and batch processing.",
    category: "process-simulation",
    features: ["Batch distillation", "Heat exchanger design", "Pipe hydraulics", "User-friendly interface"],
    url: "https://www.chemstations.com/"
  },
  {
    name: "PRO/II",
    description: "Process simulation software for process design, performance optimization, and operational analysis for oil and gas, chemicals, and polymers.",
    category: "process-simulation",
    features: ["Rigorous distillation", "Polymer processes", "Heat exchanger networks", "Electrolyte modeling"],
    url: "https://www.aveva.com/en/products/pro-ii-process-engineering/"
  },
  {
    name: "gPROMS",
    description: "Advanced process modeling platform with custom model development capabilities for optimization, design, and digital applications.",
    category: "process-simulation",
    features: ["Custom modeling", "Equation-oriented", "Dynamic optimization", "Digital twins"],
    url: "https://www.psenterprise.com/products/gproms"
  },
  {
    name: "DWSIM",
    description: "Open-source process simulator with thermodynamic models, unit operations, and petroleum operations capabilities.",
    category: "process-simulation",
    isOpenSource: true,
    isFree: true,
    features: ["Open-source", "Chemical equilibrium", "Petroleum operations", "Educational use"],
    url: "https://dwsim.org/"
  },
  {
    name: "Simulink with MATLAB",
    description: "Dynamic system simulation platform widely used for process control, modeling, and mathematical representation of chemical processes.",
    category: "process-simulation",
    features: ["Block diagrams", "Process dynamics", "Control systems", "Signal processing"],
    url: "https://www.mathworks.com/products/simulink.html"
  },
  
  // Thermodynamic Analysis
  {
    name: "Aspen Properties",
    description: "Comprehensive thermodynamic property package with extensive pure component database and physical property estimation methods.",
    category: "thermodynamic",
    features: ["Equation of state models", "Data regression", "Physical property databases", "Mixture properties"],
    url: "https://www.aspentech.com/"
  },
  {
    name: "NIST REFPROP",
    description: "Reference fluid thermodynamic and transport properties database with high-accuracy models for refrigerants and industrial fluids.",
    category: "thermodynamic",
    features: ["High-accuracy properties", "Refrigerants", "Natural gas", "Hydrocarbons", "Mixture properties"],
    url: "https://www.nist.gov/srd/refprop"
  },
  {
    name: "HSC Chemistry",
    description: "Chemical reaction and equilibrium software with extensive thermochemical database and heat and material balance tools.",
    category: "thermodynamic",
    features: ["Thermodynamics", "Material balances", "Electrochemistry", "Gibbs energy minimization"],
    url: "https://www.outotec.com/products/digital-solutions/hsc-chemistry/"
  },
  {
    name: "COCO/COFE",
    description: "Free flowsheeting environment with thermodynamic modeling capabilities and unit operation models.",
    category: "thermodynamic",
    isFree: true,
    features: ["Free software", "Thermodynamic calculations", "Chemical equilibrium", "Flash calculations"],
    url: "https://www.cocosimulator.org/"
  },
  {
    name: "MultiFlash",
    description: "Advanced fluid phase behavior and physical property prediction software for oil, gas, chemicals, and refrigerants.",
    category: "thermodynamic",
    features: ["Phase envelopes", "Critical points", "Hydrate formation", "Wax precipitation"],
    url: "https://www.kbc.global/software/simulation-and-optimization/multiflash/"
  },
  
  // Reaction Engineering
  {
    name: "Reaction Workbench (Aspen Plus)",
    description: "Reaction kinetics modeling environment for developing and analyzing reaction mechanisms in chemical processes.",
    category: "reaction-engineering",
    features: ["Reaction networks", "Kinetic parameter estimation", "Integration with Aspen Plus"],
    url: "https://www.aspentech.com/"
  },
  {
    name: "POLYMATH",
    description: "Problem-solving environment for differential equations, commonly used for reactor design calculations and chemical kinetics.",
    category: "reaction-engineering",
    features: ["ODE solving", "Data regression", "Nonlinear equations", "Educational use"],
    url: "https://polymath-software.com/"
  },
  {
    name: "Cantera",
    description: "Open-source suite for thermodynamics, kinetics, and transport processes with a focus on combustion applications.",
    category: "reaction-engineering",
    isOpenSource: true,
    isFree: true,
    features: ["Combustion modeling", "Chemical kinetics", "Python/MATLAB interfaces", "Gas-phase reactions"],
    url: "https://cantera.org/"
  },
  {
    name: "MATLAB Chemical Engineering Toolbox",
    description: "Collection of MATLAB tools and functions for chemical reaction engineering and process modeling applications.",
    category: "reaction-engineering",
    features: ["Reactor models", "Parameter estimation", "Flexibility", "Scripting capabilities"],
    url: "https://www.mathworks.com/"
  },
  {
    name: "CHEMKIN",
    description: "Chemical kinetics simulation software for modeling complex gas-phase chemical reactions and combustion processes.",
    category: "reaction-engineering",
    features: ["Gas-phase kinetics", "Surface chemistry", "Combustion", "Plasma processing"],
    url: "https://www.ansys.com/products/fluids/ansys-chemkin-pro"
  },
  
  // Data Analysis
  {
    name: "Python (with NumPy, Pandas, Scikit-learn)",
    description: "Open-source programming language with powerful libraries for data manipulation, analysis, visualization, and machine learning.",
    category: "data-analysis",
    isOpenSource: true,
    isFree: true,
    features: ["Data manipulation", "Statistical analysis", "Machine learning", "Visualization"],
    url: "https://www.python.org/"
  },
  {
    name: "R",
    description: "Programming language and environment for statistical computing and graphics with extensive package ecosystem.",
    category: "data-analysis",
    isOpenSource: true,
    isFree: true,
    features: ["Statistical modeling", "Data visualization", "Time series analysis", "Bioinformatics"],
    url: "https://www.r-project.org/"
  },
  {
    name: "Tableau",
    description: "Interactive data visualization software focused on business intelligence and analytics with easy-to-create dashboards.",
    category: "data-analysis",
    features: ["Interactive dashboards", "Data visualization", "KPI tracking", "Business intelligence"],
    url: "https://www.tableau.com/"
  },
  {
    name: "Power BI",
    description: "Business analytics service for interactive visualizations and business intelligence with self-service capabilities.",
    category: "data-analysis",
    features: ["Data visualization", "Business intelligence", "Cloud integration", "Microsoft ecosystem"],
    url: "https://powerbi.microsoft.com/"
  },
  {
    name: "Excel",
    description: "Spreadsheet software widely used for data analysis, calculations, and visualization in chemical engineering applications.",
    category: "data-analysis",
    features: ["Calculation tools", "Data analysis", "VBA automation", "Accessibility"],
    url: "https://www.microsoft.com/microsoft-365/excel"
  },
  {
    name: "JMP",
    description: "Statistical discovery software connecting data to graphics for visual insight and statistical analysis.",
    category: "data-analysis",
    features: ["DOE (Design of Experiments)", "Statistical quality control", "Predictive modeling", "Interactive graphics"],
    url: "https://www.jmp.com/"
  },
  
  // Process Control
  {
    name: "MATLAB with Control System Toolbox",
    description: "Comprehensive environment for analyzing and designing control systems with specialized control engineering tools.",
    category: "process-control",
    features: ["Control design", "System identification", "PID tuning", "State-space modeling"],
    url: "https://www.mathworks.com/products/control.html"
  },
  {
    name: "LabVIEW",
    description: "Visual programming environment for measurement, test, and control systems with hardware integration capabilities.",
    category: "process-control",
    features: ["Visual programming", "Data acquisition", "Instrument control", "Real-time systems"],
    url: "https://www.ni.com/en-us/shop/labview.html"
  },
  {
    name: "DeltaV",
    description: "Distributed control system (DCS) for process automation in chemical, oil and gas, and pharmaceutical industries.",
    category: "process-control",
    features: ["Real-time monitoring", "Alarm management", "Batch processing", "Advanced control"],
    url: "https://www.emerson.com/en-us/automation/control-and-safety-systems/distributed-control-systems-dcs/deltav-distributed-control-system"
  },
  {
    name: "Honeywell Experion",
    description: "Process control system integrating advanced control and monitoring tools for industrial automation.",
    category: "process-control",
    features: ["SCADA systems", "Automation", "Advanced process control", "Asset management"],
    url: "https://www.honeywellprocess.com/en-US/explore/products/control-monitoring-and-safety-systems/integrated-control-and-safety-systems/experion-process-knowledge-system/Pages/default.aspx"
  },
  {
    name: "Siemens PCS 7",
    description: "Industrial control system for process automation with scalable architecture and integrated safety functions.",
    category: "process-control",
    features: ["Process automation", "Batch control", "Safety integration", "Plant asset management"],
    url: "https://new.siemens.com/global/en/products/automation/process-control/simatic-pcs-7.html"
  },
  
  // Equipment Design
  {
    name: "Aspen Exchanger Design & Rating (EDR)",
    description: "Comprehensive heat exchanger design and simulation software for thermal and hydraulic analysis.",
    category: "equipment-design",
    features: ["Shell-and-tube design", "Plate exchangers", "Air coolers", "Thermal rating"],
    url: "https://www.aspentech.com/en/products/engineering/aspen-exchanger-design-and-rating"
  },
  {
    name: "Aspen Capital Cost Estimator (ACCE)",
    description: "Project cost estimation and economic evaluation software with equipment sizing and detailed cost reporting.",
    category: "equipment-design",
    features: ["Cost estimation", "Equipment sizing", "Economic evaluation", "Integration with process simulators"],
    url: "https://www.aspentech.com/en/products/engineering/aspen-capital-cost-estimator"
  },
  {
    name: "HTRI Xchanger Suite",
    description: "Heat exchanger design and analysis software with thermal and hydraulic calculations based on proprietary research.",
    category: "equipment-design",
    features: ["Heat exchanger design", "Thermal analysis", "Vibration analysis", "Research-based methods"],
    url: "https://www.htri.net/software"
  },
  {
    name: "SolidWorks",
    description: "3D CAD software for mechanical design of equipment, vessels, and components with simulation capabilities.",
    category: "equipment-design",
    features: ["3D modeling", "Equipment design", "Assembly modeling", "Drawing generation"],
    url: "https://www.solidworks.com/"
  },
  {
    name: "Autodesk Inventor",
    description: "3D mechanical design software for creating equipment models and engineering documentation.",
    category: "equipment-design",
    features: ["3D modeling", "Assembly design", "Visualization", "Technical documentation"],
    url: "https://www.autodesk.com/products/inventor/overview"
  },
  
  // Piping Design
  {
    name: "AutoCAD Plant 3D",
    description: "Plant design and layout software with piping specification-driven design and P&ID functionality.",
    category: "piping-design",
    features: ["P&ID diagrams", "3D plant models", "Piping specifications", "Isometric drawings"],
    url: "https://www.autodesk.com/products/autocad/included-toolsets/autocad-plant-3d"
  },
  {
    name: "AVEVA Everything3D (E3D)",
    description: "Integrated 3D plant design system for creating detailed piping layouts and equipment arrangements.",
    category: "piping-design",
    features: ["3D design", "Clash detection", "Engineering data management", "Construction planning"],
    url: "https://www.aveva.com/en/products/everything3d/"
  },
  {
    name: "SmartPlant 3D",
    description: "Comprehensive plant design solution with integrated engineering and design functionality.",
    category: "piping-design",
    features: ["3D modeling", "Rule-based design", "Interference checking", "Integration with P&ID"],
    url: "https://hexagonppm.com/products/3d-design-visualization/smartplant-3d"
  },
  {
    name: "Caesar II",
    description: "Pipe stress analysis software for evaluating structural integrity and safety of piping systems.",
    category: "piping-design",
    features: ["Stress analysis", "Code compliance", "Static and dynamic analysis", "Load case scenarios"],
    url: "https://hexagonppm.com/products/analysis-product-family/caesar-ii"
  },
  {
    name: "PIPENET",
    description: "Fluid flow analysis software for pipe networks, sprinkler systems, and firewater networks.",
    category: "piping-design",
    features: ["Flow analysis", "Sprinkler systems", "Firewater networks", "Surge analysis"],
    url: "https://www.sunrise-sys.com/pipenet/"
  },
  
  // Environmental & Safety
  {
    name: "PHAST (Process Hazard Analysis Software Tool)",
    description: "Consequence modeling software for process safety hazards and risk assessment in chemical facilities.",
    category: "environmental-safety",
    features: ["Dispersion modeling", "Fire analysis", "Explosion modeling", "Toxic release modeling"],
    url: "https://www.dnv.com/software/phast/"
  },
  {
    name: "ALOHA",
    description: "Atmospheric dispersion model for evaluating releases of hazardous chemical vapors with emergency response applications.",
    category: "environmental-safety",
    isFree: true,
    features: ["Dispersion modeling", "Toxic cloud visualization", "Emergency response", "Chemical database"],
    url: "https://www.epa.gov/cameo/aloha-software"
  },
  {
    name: "PHA-Pro",
    description: "Process hazard analysis software for managing HAZOP, LOPA, and other safety studies in process facilities.",
    category: "environmental-safety",
    features: ["HAZOP studies", "LOPA", "What-if analysis", "Risk assessment"],
    url: "https://www.sphera.com/operational-risk/process-safety-software/"
  },
  {
    name: "Fault Tree+",
    description: "Fault tree analysis software for reliability engineering and risk assessment in process systems.",
    category: "environmental-safety",
    features: ["Fault tree analysis", "Event tree analysis", "Reliability calculations", "Risk modeling"],
    url: "https://www.isograph.com/software/reliability-workbench/fault-tree-analysis-software/"
  },
  {
    name: "ProMax with TSWEET",
    description: "Process simulation software with specialized environmental compliance and emissions modeling capabilities.",
    category: "environmental-safety",
    features: ["Emissions modeling", "Environmental compliance", "Sulfur treating", "Acid gas removal"],
    url: "https://www.bre.com/software/promax/"
  },
  
  // CFD Software
  {
    name: "ANSYS Fluent",
    description: "Comprehensive computational fluid dynamics software for modeling flow, turbulence, heat transfer, and reactions.",
    category: "cfd",
    features: ["Multiphase flow", "Chemical reactions", "Heat transfer", "Turbulence modeling"],
    url: "https://www.ansys.com/products/fluids/ansys-fluent"
  },
  {
    name: "COMSOL Multiphysics",
    description: "Finite element analysis software for coupled phenomena simulations with specific chemical engineering modules.",
    category: "cfd",
    features: ["Multiphysics simulation", "Reaction engineering", "Transport phenomena", "Electrochemical processes"],
    url: "https://www.comsol.com/"
  },
  {
    name: "OpenFOAM",
    description: "Open-source CFD software with extensive physical modeling capabilities for complex fluid flows.",
    category: "cfd",
    isOpenSource: true,
    isFree: true,
    features: ["Open-source", "Customizable", "Multiphase flows", "Requires programming knowledge"],
    url: "https://www.openfoam.com/"
  },
  {
    name: "STAR-CCM+",
    description: "Computational fluid dynamics software for simulating fluid flow, heat transfer, and chemical reactions in complex geometries.",
    category: "cfd",
    features: ["Automated meshing", "Multiphase modeling", "Particle dynamics", "Chemical reaction modeling"],
    url: "https://www.plm.automation.siemens.com/global/en/products/simcenter/STAR-CCM.html"
  },
  {
    name: "Autodesk CFD",
    description: "Computational fluid dynamics and thermal simulation software with accessible interface and automation features.",
    category: "cfd",
    features: ["Fluid flow simulation", "Thermal analysis", "Design validation", "Integration with CAD"],
    url: "https://www.autodesk.com/products/cfd/overview"
  },
  
  // Chemical Database
  {
    name: "ChemSpider",
    description: "Free chemical structure database providing access to properties, spectra, and information for millions of compounds.",
    category: "chemical-database",
    isFree: true,
    features: ["Chemical structures", "Property data", "Literature references", "Spectral data"],
    url: "http://www.chemspider.com/"
  },
  {
    name: "Reaxys",
    description: "Chemical information database with reaction data, substance properties, and literature information for chemical research.",
    category: "chemical-database",
    features: ["Reaction data", "Property data", "Synthesis planning", "Literature search"],
    url: "https://www.reaxys.com/"
  },
  {
    name: "CRC Handbook of Chemistry and Physics",
    description: "Comprehensive reference resource for chemical and physical property data of compounds and elements.",
    category: "chemical-database",
    features: ["Physical constants", "Thermodynamic data", "Solubility data", "Reference tables"],
    url: "https://www.crcpress.com/CRC-Handbook-of-Chemistry-and-Physics/product/9780367712600"
  },
  {
    name: "NIST Chemistry WebBook",
    description: "Free online database of chemical thermodynamic and spectroscopic data maintained by the National Institute of Standards and Technology.",
    category: "chemical-database",
    isFree: true,
    features: ["Thermochemical data", "Spectroscopic data", "Phase change data", "Reaction thermodynamics"],
    url: "https://webbook.nist.gov/chemistry/"
  },
  {
    name: "Knovel",
    description: "Engineering reference database with technical information, property data, and interactive tools for chemical engineers.",
    category: "chemical-database",
    features: ["Property data", "Interactive equations", "Technical references", "Material data"],
    url: "https://www.elsevier.com/solutions/knovel-engineering-information"
  },
  
  // Molecular Modeling
  {
    name: "Materials Studio",
    description: "Modeling and simulation software for materials science and chemistry research with specialized modules.",
    category: "molecular-modeling",
    features: ["Molecular modeling", "Quantum mechanics", "Crystallization", "Polymer properties"],
    url: "https://www.3ds.com/products-services/biovia/products/molecular-modeling-simulation/biovia-materials-studio/"
  },
  {
    name: "Gaussian",
    description: "Quantum chemistry software package for computing electronic structures and properties of molecular systems.",
    category: "molecular-modeling",
    features: ["Electronic structure", "Transition states", "Spectroscopic properties", "Reaction mechanisms"],
    url: "https://gaussian.com/"
  },
  {
    name: "GAMESS",
    description: "General ab initio quantum chemistry package for molecular electronic structure calculations.",
    category: "molecular-modeling",
    isFree: true,
    features: ["Electronic structure", "Potential energy surfaces", "Molecular properties", "No commercial license required"],
    url: "https://www.msg.chem.iastate.edu/gamess/"
  },
  {
    name: "GROMACS",
    description: "Molecular dynamics package designed for biomolecular systems with applications in materials science.",
    category: "molecular-modeling",
    isOpenSource: true,
    isFree: true,
    features: ["Molecular dynamics", "Force field simulations", "High performance", "Energy minimization"],
    url: "http://www.gromacs.org/"
  },
  {
    name: "VASP",
    description: "Vienna Ab initio Simulation Package for atomic scale modeling of materials and electronic structure calculations.",
    category: "molecular-modeling",
    features: ["Electronic structure", "Solid state materials", "Surface science", "Catalysis modeling"],
    url: "https://www.vasp.at/"
  },
  
  // Educational Tools
  {
    name: "LearnChemE",
    description: "Collection of interactive simulations and educational resources for chemical engineering concepts.",
    category: "educational",
    isFree: true,
    features: ["Interactive simulations", "Screencasts", "Calculation tools", "Teaching resources"],
    url: "https://learncheme.com/"
  },
  {
    name: "OLI Studio",
    description: "Electrolyte thermodynamics and chemistry software with educational applications for understanding aqueous chemistry.",
    category: "educational",
    features: ["Electrolyte modeling", "pH prediction", "Speciation", "Phase behavior"],
    url: "https://www.olisystems.com/oli-studio"
  },
  {
    name: "Essentials of Chemical Engineering",
    description: "Educational software with visualization tools and simulations for teaching core chemical engineering concepts.",
    category: "educational",
    features: ["Process simulations", "Interactive diagrams", "Teaching modules", "Self-paced learning"],
    url: "https://www.potto.org/gasDynamics.php"
  },
  {
    name: "Virtual Lab: Chemical Engineering",
    description: "Interactive virtual laboratory for simulating chemical engineering experiments and unit operations.",
    category: "educational",
    isFree: true,
    features: ["Virtual experiments", "Interactive processes", "Unit operations", "Process control"],
    url: "https://vlab.co.in/broad-area-chemical-engineering"
  },
  {
    name: "Excel templates for Chemical Engineering",
    description: "Collection of spreadsheet templates for chemical engineering calculations and design tasks.",
    category: "educational",
    isFree: true,
    features: ["Design calculations", "Material balances", "Energy balances", "Equipment sizing"],
    url: "https://www.che.com/calculators/"
  },
  
  // Miscellaneous Tools
  {
    name: "UniSim Design",
    description: "Process simulation software for oil and gas, refining, and chemical processes with intuitive interface.",
    category: "miscellaneous",
    features: ["Process simulation", "Equipment design", "Refinery processes", "Dynamics"],
    url: "https://www.honeywellprocess.com/en-US/explore/products/advanced-applications/unisim/Pages/default.aspx"
  },
  {
    name: "BioProcess Simulator",
    description: "Specialized simulation software for bioprocesses and biochemical engineering applications.",
    category: "miscellaneous",
    features: ["Fermentation", "Bioreactors", "Bioprocessing", "Biological reactions"],
    url: "https://intelligen.com/superpro-designer/"
  },
  {
    name: "EMSO",
    description: "Equation-based process modeling environment with object-oriented features for chemical process simulation.",
    category: "miscellaneous",
    isOpenSource: true,
    isFree: true,
    features: ["Equation-oriented", "Dynamic simulation", "Object-oriented modeling", "Open source"],
    url: "http://www.vrtech.com.br/en/emso/"
  },
  {
    name: "PROSIM",
    description: "Process simulation software with specialized modules for energy efficiency, batch processes, and environmental impact.",
    category: "miscellaneous",
    features: ["Batch processing", "Energy efficiency", "Environmental assessment", "Process optimization"],
    url: "https://www.prosim.net/en/"
  }
];

const SoftwareTools = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<{
    freeOnly: boolean;
    openSourceOnly: boolean;
    category: SoftwareCategory | "all";
  }>({
    freeOnly: false,
    openSourceOnly: false,
    category: "all",
  });
  const [selectedSoftware, setSelectedSoftware] = useState<Software | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const isCategoryExpanded = (categoryId: string) => {
    return expandedCategories.includes(categoryId);
  };

  const handleSoftwareClick = (software: Software) => {
    setSelectedSoftware(software);
    setIsModalOpen(true);
  };

  const filteredSoftware = softwareDatabase.filter((software) => {
    // Text search
    const matchesSearch =
      searchQuery === "" ||
      software.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      software.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Category filter
    const matchesCategory = filters.category === "all" || software.category === filters.category;

    // Free/Open Source filters
    const matchesFreeOnly = !filters.freeOnly || software.isFree === true;
    const matchesOpenSourceOnly = !filters.openSourceOnly || software.isOpenSource === true;

    return matchesSearch && matchesCategory && matchesFreeOnly && matchesOpenSourceOnly;
  });

  const sortedCategories = [...softwareCategories].sort((a, b) => a.name.localeCompare(b.name));

  const renderSoftwareInterface = (category: SoftwareCategory) => {
    switch (category) {
      case "process-simulation":
        return <ProcessSimulationInterface />;
      case "thermodynamic":
        return <ThermodynamicInterface />;
      case "reaction-engineering":
        return <ReactionEngineeringInterface />;
      case "data-analysis":
        return <DataAnalysisInterface />;
      case "process-control":
        return <ProcessControlInterface />;
      case "equipment-design":
        return <EquipmentDesignInterface />;
      case "piping-design":
        return <PipingDesignInterface />;
      case "environmental-safety":
        return <EnvironmentalSafetyInterface />;
      case "cfd":
        return <CFDInterface />;
      case "chemical-database":
        return <ChemicalDatabaseInterface />;
      default:
        return <MiscellaneousToolsInterface />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Chemical Engineering Software Tools
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Explore specialized software tools for chemical engineering applications, 
              from process simulation to equipment design and beyond.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
            <div className="lg:col-span-1">
              <GlassPanel className="p-5 sticky top-24 dark:bg-gray-800/50 dark:border-gray-700">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                  Filter Tools
                </h2>
                <div className="space-y-5">
                  <div>
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Search
                    </label>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <Input
                        id="search"
                        type="search"
                        placeholder="Search software..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 flex items-center">
                      <Filter className="h-4 w-4 mr-1.5" />
                      Categories
                    </h3>
                    <div className="space-y-1.5 mt-2">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="category-all"
                          name="category"
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          checked={filters.category === "all"}
                          onChange={() => setFilters({ ...filters, category: "all" })}
                        />
                        <label htmlFor="category-all" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          All Categories
                        </label>
                      </div>
                      
                      {sortedCategories.map((category) => (
                        <div key={category.id} className="flex items-center">
                          <input
                            type="radio"
                            id={`category-${category.id}`}
                            name="category"
                            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            checked={filters.category === category.id}
                            onChange={() => setFilters({ ...filters, category: category.id })}
                          />
                          <label
                            htmlFor={`category-${category.id}`}
                            className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                          >
                            {category.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Features
                    </h3>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="free-only"
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        checked={filters.freeOnly}
                        onChange={() => setFilters({ ...filters, freeOnly: !filters.freeOnly })}
                      />
                      <label htmlFor="free-only" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Free Software
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="open-source-only"
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        checked={filters.openSourceOnly}
                        onChange={() => setFilters({ ...filters, openSourceOnly: !filters.openSourceOnly })}
                      />
                      <label htmlFor="open-source-only" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Open Source
                      </label>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setFilters({
                        freeOnly: false,
                        openSourceOnly: false,
                        category: "all",
                      })}
                    >
                      Reset Filters
                    </Button>
                  </div>
                </div>
              </GlassPanel>
            </div>

            <div className="lg:col-span-3">
              <Tabs defaultValue="list" className="mb-8">
                <TabsList className="grid w-full md:w-[400px] grid-cols-2">
                  <TabsTrigger value="list">List View</TabsTrigger>
                  <TabsTrigger value="category">Category View</TabsTrigger>
                </TabsList>
                
                <TabsContent value="list" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredSoftware.map((software) => (
                      <div 
                        key={software.name}
                        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
                        onClick={() => handleSoftwareClick(software)}
                      >
                        <div className="p-5">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {software.name}
                            </h3>
                            {(software.isFree || software.isOpenSource) && (
                              <div className="flex space-x-1.5">
                                {software.isFree && (
                                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                                    Free
                                  </Badge>
                                )}
                                {software.isOpenSource && (
                                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800">
                                    Open Source
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                            {software.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <Badge 
                              className={cn(
                                "text-xs font-medium",
                                software.category === "process-simulation" && "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
                                software.category === "thermodynamic" && "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
                                software.category === "reaction-engineering" && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
                                software.category === "data-analysis" && "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
                                software.category === "process-control" && "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
                                software.category === "equipment-design" && "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
                                software.category === "piping-design" && "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
                                software.category === "environmental-safety" && "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
                                software.category === "cfd" && "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
                                software.category === "chemical-database" && "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
                                software.category === "molecular-modeling" && "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
                                software.category === "educational" && "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
                                software.category === "miscellaneous" && "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                              )}
                            >
                              {softwareCategories.find(cat => cat.id === software.category)?.name || software.category}
                            </Badge>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredSoftware.length === 0 && (
                    <div className="text-center py-12">
                      <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No results found</h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Try adjusting your search or filter criteria
                      </p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="category" className="mt-6">
                  <div className="space-y-6">
                    {softwareCategories.map((category) => {
                      const categorySoftware = filteredSoftware.filter(
                        (s) => s.category === category.id
                      );
                      
                      if (categorySoftware.length === 0) return null;
                      
                      return (
                        <div 
                          key={category.id}
                          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                        >
                          <div 
                            className="flex items-center justify-between p-4 cursor-pointer"
                            onClick={() => toggleCategory(category.id)}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                {category.icon}
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {category.name}
                                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                                  ({categorySoftware.length})
                                </span>
                              </h3>
                            </div>
                            {isCategoryExpanded(category.id) ? (
                              <ChevronUp className="h-5 w-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                          
                          {isCategoryExpanded(category.id) && (
                            <div className="border-t border-gray-200 dark:border-gray-700">
                              <div className="p-4">
                                <p className="text-gray-600 dark:text-gray-300 mb-4">
                                  {category.description}
                                </p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {categorySoftware.map((software) => (
                                    <div 
                                      key={software.name}
                                      className="bg-gray-50 dark:bg-gray-750 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-sm transition-shadow cursor-pointer"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleSoftwareClick(software);
                                      }}
                                    >
                                      <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-md font-semibold text-gray-900 dark:text-white">
                                          {software.name}
                                        </h4>
                                        <div className="flex space-x-1.5">
                                          {software.isFree && (
                                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                                              Free
                                            </Badge>
                                          )}
                                          {software.isOpenSource && (
                                            <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800">
                                              Open Source
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                      
                                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                                        {software.description}
                                      </p>
                                      
                                      {software.features && software.features.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                          {software.features.slice(0, 3).map((feature, i) => (
                                            <Badge key={i} variant="outline" className="text-xs bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700">
                                              {feature}
                                            </Badge>
                                          ))}
                                          {software.features.length > 3 && (
                                            <Badge variant="outline" className="text-xs bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700">
                                              +{software.features.length - 3} more
                                            </Badge>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="p-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex justify-between items-center">
                                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Sample Interface
                                  </h4>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-flow-blue hover:text-flow-blue/90"
                                  >
                                    <PlayCircle className="h-4 w-4 mr-1.5" />
                                    Interactive Demo
                                  </Button>
                                </div>
                                <div className="mt-4 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                                  {renderSoftwareInterface(category.id)}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Software Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-3xl">
          {selectedSoftware && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>{selectedSoftware.name}</span>
                  <div className="flex space-x-1.5">
                    {selectedSoftware.isFree && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                        Free
                      </Badge>
                    )}
                    {selectedSoftware.isOpenSource && (
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800">
                        Open Source
                      </Badge>
                    )}
                  </div>
                </DialogTitle>
              </DialogHeader>
              
              <div className="mt-4">
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  {selectedSoftware.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </h3>
                    <Badge 
                      className={cn(
                        "text-sm font-medium",
                        selectedSoftware.category === "process-simulation" && "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
                        selectedSoftware.category === "thermodynamic" && "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
                        selectedSoftware.category === "reaction-engineering" && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
                        selectedSoftware.category === "data-analysis" && "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
                        selectedSoftware.category === "process-control" && "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
                        selectedSoftware.category === "equipment-design" && "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
                        selectedSoftware.category === "piping-design" && "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
                        selectedSoftware.category === "environmental-safety" && "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
                        selectedSoftware.category === "cfd" && "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
                        selectedSoftware.category === "chemical-database" && "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
                        selectedSoftware.category === "molecular-modeling" && "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
                        selectedSoftware.category === "educational" && "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
                        selectedSoftware.category === "miscellaneous" && "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                      )}
                    >
                      {softwareCategories.find(cat => cat.id === selectedSoftware.category)?.name || selectedSoftware.category}
                    </Badge>
                  </div>
                  
                  {selectedSoftware.url && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Official Website
                      </h3>
                      <a 
                        href={selectedSoftware.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-flow-blue hover:text-flow-blue/80 flex items-center"
                      >
                        Visit Website
                        <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                      </a>
                    </div>
                  )}
                </div>
                
                {selectedSoftware.features && selectedSoftware.features.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Key Features
                    </h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                      {selectedSoftware.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 rounded-full bg-flow-blue/10 flex items-center justify-center mt-0.5">
                            <div className="h-2 w-2 rounded-full bg-flow-blue"></div>
                          </div>
                          <span className="ml-2 text-gray-600 dark:text-gray-300">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                    <FileText className="h-4 w-4 mr-1.5" />
                    Documentation & Resources
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Access official documentation, tutorials, and guides to help you get started with {selectedSoftware.name}.
                  </p>
                  <div className="flex space-x-3">
                    <Button variant="outline" size="sm">
                      User Manual
                    </Button>
                    <Button variant="outline" size="sm">
                      Tutorials
                    </Button>
                    <Button variant="outline" size="sm">
                      API Reference
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SoftwareTools;
