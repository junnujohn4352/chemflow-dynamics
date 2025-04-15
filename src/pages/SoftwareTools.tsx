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
  },
  
  {
    name: "MATLAB with Simulink",
    description: "Comprehensive mathematical computing environment with visual programming for modeling, control systems, and optimization in chemical engineering.",
    category: "data-analysis",
    features: ["Numerical analysis", "Modeling", "Control systems", "Optimization", "Algorithm development"],
    url: "https://www.mathworks.com/products/matlab.html"
  },
  
  {
    name: "PETRO-SIM",
    description: "KBC's refinery-wide process simulation and optimization platform for petroleum refining and gas processing.",
    category: "process-simulation",
    features: ["Refinery modeling", "Process optimization", "Crude assay management", "Heat integration"],
    url: "https://www.kbc.global/software/simulation-and-optimization/petro-sim/"
  },
  {
    name: "HYSYS Dynamics",
    description: "Dynamic simulation environment for safety studies, control system design, and operational analysis in petrochemical processes.",
    category: "process-control",
    features: ["Dynamic simulation", "Safety studies", "Control system design", "Startup/shutdown scenarios"],
    url: "https://www.aspentech.com/en/products/engineering/aspen-hysys"
  },
  {
    name: "Flaresim",
    description: "Specialized software for the design and analysis of flare systems in petrochemical facilities.",
    category: "environmental-safety",
    features: ["Flare system design", "Radiation analysis", "Noise prediction", "Regulatory compliance"],
    url: "https://www.dnv.com/software/flaresim/"
  },
  
  {
    name: "Crude Assay Manager",
    description: "AspenTech software for managing and characterizing crude oil properties for refinery operations.",
    category: "process-simulation",
    features: ["Crude oil characterization", "Blend optimization", "Property analysis", "Refinery planning"],
    url: "https://www.aspentech.com/"
  },
  
  {
    name: "Petrel",
    description: "Schlumberger's software for reservoir modeling and geophysical interpretation in petroleum exploration.",
    category: "miscellaneous",
    features: ["Reservoir modeling", "Geophysical interpretation", "Well planning", "Formation evaluation"],
    url: "https://www.software.slb.com/products/petrel"
  },
  {
    name: "ECLIPSE",
    description: "Industry-reference reservoir simulator for predicting dynamic behavior of all types of reservoirs and recovery strategies.",
    category: "miscellaneous",
    features: ["Reservoir simulation", "Enhanced oil recovery", "Compositional modeling", "Field development planning"],
    url: "https://www.software.slb.com/products/eclipse"
  },
  {
    name: "CMG GEM",
    description: "Compositional and unconventional reservoir simulator for modeling complex recovery processes.",
    category: "miscellaneous",
    features: ["Compositional modeling", "Enhanced oil recovery", "Unconventional reservoirs", "Gas injection"],
    url: "https://www.cmgl.ca/gem"
  },
  {
    name: "PIPESIM",
    description: "Schlumberger's steady-state multiphase flow simulator for well and pipeline design optimization.",
    category: "piping-design",
    features: ["Multiphase flow", "Well performance", "Pipeline design", "Network analysis"],
    url: "https://www.software.slb.com/products/pipesim"
  },
  {
    name: "OLGA",
    description: "Dynamic multiphase flow simulator for production optimization and flow assurance challenges.",
    category: "piping-design",
    features: ["Dynamic simulation", "Flow assurance", "Multiphase flow", "Transient analysis"],
    url: "https://www.software.slb.com/products/olga"
  },
  {
    name: "IPM Suite",
    description: "Petroleum Experts' integrated production modeling suite including PROSPER, GAP, and MBAL tools.",
    category: "process-simulation",
    features: ["Production modeling", "Well performance", "Network optimization", "Reservoir coupling"],
    url: "https://www.petex.com/products/ipm-suite/"
  },
  
  {
    name: "SuperPro Designer",
    description: "Process simulation software with specialized capabilities for food processing operations.",
    category: "process-simulation",
    features: ["Batch processing", "Continuous processes", "Economic analysis", "Scheduling"],
    url: "https://intelligen.com/superpro-designer/"
  },
  {
    name: "COMSOL Food Module",
    description: "Specialized module for modeling heat/mass transfer in food processing operations.",
    category: "cfd",
    features: ["Heat transfer", "Mass transfer", "Drying", "Sterilization modeling"],
    url: "https://www.comsol.com/"
  },
  {
    name: "FoodProcess-Lab",
    description: "Specialized software for modeling food processing operations including drying, baking, and frying.",
    category: "process-simulation",
    features: ["Drying kinetics", "Baking processes", "Frying simulation", "Thermal processing"],
    url: "https://foodprocess-lab.com/"
  },
  {
    name: "ESHA Food Processor",
    description: "Nutrition analysis software for food product development and labeling compliance.",
    category: "miscellaneous",
    features: ["Nutrient analysis", "Formulation", "Recipe development", "Labeling compliance"],
    url: "https://esha.com/products/food-processor/"
  },
  
  {
    name: "GPS-X",
    description: "Comprehensive wastewater treatment plant modeling and simulation software.",
    category: "environmental-safety",
    features: ["Wastewater treatment", "Process optimization", "Control strategies", "Plant design"],
    url: "https://www.hydromantis.com/GPS-X.html"
  },
  {
    name: "BioWin",
    description: "Wastewater treatment process simulator for biological nutrient removal process design and optimization.",
    category: "environmental-safety",
    features: ["Biological processes", "Nutrient removal", "Process design", "Control strategies"],
    url: "https://envirosim.com/products/biowin"
  },
  {
    name: "AQUASIM",
    description: "Software for modeling and simulating aquatic systems and water quality processes.",
    category: "environmental-safety",
    features: ["Water quality modeling", "Aquatic ecosystems", "Parameter estimation", "Sensitivity analysis"],
    url: "https://www.eawag.ch/en/department/siam/software/"
  },
  {
    name: "TOXCHEM",
    description: "Modeling software for estimating fate of volatile compounds in wastewater treatment plants.",
    category: "environmental-safety",
    features: ["VOC emissions", "Hazardous compounds", "Fate modeling", "Regulatory compliance"],
    url: "https://www.enviromega.ca/toxchem/"
  },
  {
    name: "PHREEQC",
    description: "Computer program for simulating chemical reactions and transport processes in natural or polluted water.",
    category: "environmental-safety",
    features: ["Geochemical modeling", "Contaminant transport", "Solution chemistry", "Reaction paths"],
    url: "https://www.usgs.gov/software/phreeqc-version-3"
  },
  
  {
    name: "BioSolve Process",
    description: "Economic modeling software for bioprocesses and manufacturing cost analysis.",
    category: "miscellaneous",
    features: ["Cost modeling", "Process economics", "Sensitivity analysis", "Bioprocess optimization"],
    url: "https://www.biopharmservices.com/software/biosolve-process/"
  },
  {
    name: "COPASI",
    description: "Simulation and analysis software for biochemical networks and their dynamics.",
    category: "reaction-engineering",
    features: ["Biochemical networks", "Metabolic modeling", "Parameter estimation", "Stochastic simulation"],
    url: "http://copasi.org/"
  },
  
  {
    name: "HOMER Energy",
    description: "Modeling software for hybrid renewable energy systems optimization and feasibility analysis.",
    category: "miscellaneous",
    features: ["Renewable energy", "Hybrid systems", "Economic analysis", "System optimization"],
    url: "https://www.homerenergy.com/"
  },
  
  {
    name: "BowTieXP",
    description: "Risk assessment software for visualization and analysis of risk scenarios using the bowtie method.",
    category: "environmental-safety",
    features: ["Risk visualization", "Barrier management", "Incident analysis", "Risk communication"],
    url: "https://www.bowtiexp.com/"
  },
  
  {
    name: "Primavera P6",
    description: "Enterprise project portfolio management software for planning, scheduling and controlling projects.",
    category: "miscellaneous",
    features: ["Project scheduling", "Resource management", "Critical path analysis", "Progress tracking"],
    url: "https://www.oracle.com/industries/construction-engineering/primavera-p6/"
  },
  {
    name: "MS Project",
    description: "Project management software for developing plans, assigning resources, and tracking progress.",
    category: "miscellaneous",
    features: ["Project planning", "Resource management", "Timeline visualization", "Progress tracking"],
    url: "https://www.microsoft.com/microsoft-365/project/project-management-software"
  },
  {
    name: "CO$TPER",
    description: "Process economics software with equipment lists and detailed cost reporting capabilities.",
    category: "miscellaneous",
    features: ["Cost estimation", "Equipment sizing", "Economic evaluation", "Capital cost analysis"],
    url: "https://www.costper.com/"
  }
];

const SoftwareTools = () => {
  return (
    <div>
      {/* Component implementation */}
    </div>
  );
}

export default SoftwareTools;
