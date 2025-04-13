
import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
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
  ChevronRight,
  FileText,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SoftwareCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  subtopics: Subtopic[];
}

interface Subtopic {
  id: string;
  name: string;
  description: string;
  applications: string[];
  keyFeatures: string[];
  examples: {
    name: string;
    isFree?: boolean;
    isOpenSource?: boolean;
    url?: string;
  }[];
}

const softwareCategories: SoftwareCategory[] = [
  {
    id: "process-simulation",
    name: "Process Simulation & Modeling",
    icon: <Cpu className="h-5 w-5" />,
    description: "Used to simulate entire chemical processes with thermodynamic calculations, equipment sizing, and optimization.",
    subtopics: [
      {
        id: "steady-state-simulation",
        name: "Steady-State Simulation",
        description: "Tools for modeling processes that don't change with time, focusing on material and energy balances at equilibrium.",
        applications: [
          "Process design and optimization",
          "Heat integration studies",
          "Equipment sizing and rating",
          "Cost estimation and economic evaluation"
        ],
        keyFeatures: [
          "Rigorous thermodynamic calculations",
          "Comprehensive unit operation models",
          "Heat and material balance calculations",
          "Sensitivity analysis capabilities"
        ],
        examples: [
          { name: "Aspen Plus", url: "https://www.aspentech.com/" },
          { name: "DWSIM", isFree: true, isOpenSource: true, url: "https://dwsim.org/" },
          { name: "ProSim", url: "https://www.prosim.net/" }
        ]
      },
      {
        id: "dynamic-simulation",
        name: "Dynamic Simulation",
        description: "Tools for analyzing time-dependent behavior of chemical processes, including startup, shutdown, and transient operations.",
        applications: [
          "Control system design and tuning",
          "Safety and operability studies",
          "Startup and shutdown procedures",
          "Operator training"
        ],
        keyFeatures: [
          "Time-dependent equation solving",
          "Controller implementation",
          "Disturbance analysis",
          "Real-time simulation capabilities"
        ],
        examples: [
          { name: "Aspen Dynamics", url: "https://www.aspentech.com/" },
          { name: "DYNSIM", url: "https://www.aveva.com/" },
          { name: "gPROMS", url: "https://www.psenterprise.com/" }
        ]
      },
      {
        id: "flowsheeting",
        name: "Flowsheeting Software",
        description: "Tools specifically designed for creating and analyzing process flow diagrams with integrated calculation capabilities.",
        applications: [
          "Process flow diagram creation",
          "Mass and energy balance calculations",
          "Process documentation",
          "Conceptual design"
        ],
        keyFeatures: [
          "Graphical user interface for flowsheet creation",
          "Built-in component databases",
          "Equation solvers",
          "Reporting tools"
        ],
        examples: [
          { name: "ChemCAD", url: "https://www.chemstations.com/" },
          { name: "COCO Simulator", isFree: true, url: "https://www.cocosimulator.org/" },
          { name: "SuperPro Designer", url: "http://www.intelligen.com/" }
        ]
      }
    ]
  },
  {
    id: "thermodynamic",
    name: "Thermodynamic & Property Calculation",
    icon: <Thermometer className="h-5 w-5" />,
    description: "Specialized in calculating phase behavior, physical properties, and thermodynamic equilibrium.",
    subtopics: [
      {
        id: "physical-properties",
        name: "Physical Properties Databases",
        description: "Comprehensive collections of experimental and predicted physical properties for pure components and mixtures.",
        applications: [
          "Material selection",
          "Process design parameters",
          "Safety data compilation",
          "Regulatory compliance"
        ],
        keyFeatures: [
          "Temperature-dependent properties",
          "Transport properties",
          "Thermodynamic properties",
          "Experimental data access"
        ],
        examples: [
          { name: "DIPPR", url: "https://www.aiche.org/dippr" },
          { name: "NIST Chemistry WebBook", isFree: true, url: "https://webbook.nist.gov/" },
          { name: "REFPROP", url: "https://www.nist.gov/refprop" }
        ]
      },
      {
        id: "equation-of-state",
        name: "Equation of State Tools",
        description: "Software implementing various equations of state for predicting thermodynamic behavior under different conditions.",
        applications: [
          "Phase equilibrium calculations",
          "High-pressure system design",
          "Critical point determination",
          "Fluid properties at extreme conditions"
        ],
        keyFeatures: [
          "Multiple EOS model implementations",
          "Mixing rules",
          "Binary interaction parameters",
          "Phase envelope calculations"
        ],
        examples: [
          { name: "VMGSim Thermo", url: "https://www.virtualmaterials.com/" },
          { name: "CoolProp", isFree: true, isOpenSource: true, url: "http://www.coolprop.org/" },
          { name: "Multiflash", url: "https://www.kbc.global/" }
        ]
      },
      {
        id: "thermochemical-calculations",
        name: "Thermochemical Calculation Tools",
        description: "Tools for calculating reaction thermodynamics, equilibrium compositions, and energy requirements.",
        applications: [
          "Reaction engineering",
          "Process energy requirements",
          "Chemical equilibrium studies",
          "Combustion analysis"
        ],
        keyFeatures: [
          "Standard enthalpy and Gibbs energy calculations",
          "Equilibrium composition determination",
          "Heat of reaction calculations",
          "Temperature and pressure effects"
        ],
        examples: [
          { name: "HSC Chemistry", url: "https://www.outotec.com/products/digital-solutions/hsc-chemistry/" },
          { name: "FactSage", url: "https://www.factsage.com/" },
          { name: "Thermoflow", url: "https://www.thermoflow.com/" }
        ]
      }
    ]
  },
  {
    id: "reaction-engineering",
    name: "Reaction Engineering & Kinetics",
    icon: <Beaker className="h-5 w-5" />,
    description: "Used for modeling chemical reactors, reaction kinetics, and complex reaction mechanisms.",
    subtopics: [
      {
        id: "kinetics-modeling",
        name: "Kinetics Modeling",
        description: "Software for developing, fitting, and validating reaction kinetics models from experimental data.",
        applications: [
          "Reaction rate determination",
          "Parameter estimation",
          "Mechanism validation",
          "Scale-up calculations"
        ],
        keyFeatures: [
          "Rate expression libraries",
          "Parameter estimation tools",
          "Statistical analysis",
          "Numerical integration methods"
        ],
        examples: [
          { name: "Kintecus", url: "https://www.kintecus.com/" },
          { name: "DynoChem", url: "https://www.scale-up.com/" },
          { name: "COPASI", isFree: true, isOpenSource: true, url: "http://copasi.org/" }
        ]
      },
      {
        id: "reactor-design",
        name: "Reactor Design Software",
        description: "Tools specifically for designing and optimizing chemical reactors based on kinetics, flow patterns, and heat transfer.",
        applications: [
          "Reactor sizing",
          "Conversion optimization",
          "Temperature profile modeling",
          "Catalyst performance evaluation"
        ],
        keyFeatures: [
          "Multiple reactor models (CSTR, PFR, batch)",
          "Non-ideal flow modeling",
          "Heat transfer calculations",
          "Safety factor analysis"
        ],
        examples: [
          { name: "COMSOL Reaction Engineering Module", url: "https://www.comsol.com/" },
          { name: "Reactor Lab", isFree: true, url: "https://reactorlab.net/" },
          { name: "Aspen Custom Modeler", url: "https://www.aspentech.com/" }
        ]
      },
      {
        id: "combustion-modeling",
        name: "Combustion Modeling",
        description: "Specialized tools for modeling combustion processes, flame propagation, and emissions.",
        applications: [
          "Burner design",
          "Emissions prediction",
          "Flame stability analysis",
          "Fuel efficiency optimization"
        ],
        keyFeatures: [
          "Detailed chemical mechanisms",
          "Transport phenomena integration",
          "Flame speed calculations",
          "NOx and other emissions prediction"
        ],
        examples: [
          { name: "CHEMKIN", url: "https://www.ansys.com/products/fluids/ansys-chemkin-pro" },
          { name: "Cantera", isFree: true, isOpenSource: true, url: "https://cantera.org/" },
          { name: "FlameMaster", url: "https://www.itv.rwth-aachen.de/en/research/flamemaster/" }
        ]
      }
    ]
  },
  {
    id: "data-analysis",
    name: "Data Analysis & Statistics",
    icon: <BarChart className="h-5 w-5" />,
    description: "Essential tools for interpreting experimental data, process data, and statistical analysis.",
    subtopics: [
      {
        id: "statistical-analysis",
        name: "Statistical Analysis Tools",
        description: "Software for analyzing data using statistical methods, hypothesis testing, and regression analysis.",
        applications: [
          "Experimental data evaluation",
          "Quality control",
          "Process capability analysis",
          "Uncertainty quantification"
        ],
        keyFeatures: [
          "Descriptive statistics",
          "Hypothesis testing",
          "ANOVA",
          "Multiple regression analysis"
        ],
        examples: [
          { name: "R", isFree: true, isOpenSource: true, url: "https://www.r-project.org/" },
          { name: "Minitab", url: "https://www.minitab.com/" },
          { name: "JMP", url: "https://www.jmp.com/" }
        ]
      },
      {
        id: "process-data-analysis",
        name: "Process Data Analysis",
        description: "Tools specifically designed for analyzing time-series process data from chemical plants and manufacturing operations.",
        applications: [
          "Process monitoring",
          "Fault detection",
          "Trend analysis",
          "Optimization opportunities identification"
        ],
        keyFeatures: [
          "Time-series analysis",
          "Pattern recognition",
          "Multivariate analysis",
          "Data visualization tools"
        ],
        examples: [
          { name: "MATLAB with Signal Processing Toolbox", url: "https://www.mathworks.com/" },
          { name: "PI ProcessBook", url: "https://www.osisoft.com/" },
          { name: "Aspen Process Explorer", url: "https://www.aspentech.com/" }
        ]
      },
      {
        id: "machine-learning",
        name: "Machine Learning for Chemical Engineering",
        description: "Advanced analysis tools using AI and machine learning algorithms tailored for chemical engineering applications.",
        applications: [
          "Process optimization",
          "Predictive maintenance",
          "Formulation design",
          "Property prediction"
        ],
        keyFeatures: [
          "Neural networks",
          "Support vector machines",
          "Random forests",
          "Deep learning capabilities"
        ],
        examples: [
          { name: "Python with scikit-learn", isFree: true, isOpenSource: true, url: "https://scikit-learn.org/" },
          { name: "TensorFlow", isFree: true, isOpenSource: true, url: "https://www.tensorflow.org/" },
          { name: "KNIME", isFree: true, url: "https://www.knime.com/" }
        ]
      }
    ]
  },
  {
    id: "process-control",
    name: "Process Control & Automation",
    icon: <Sliders className="h-5 w-5" />,
    description: "Software used to model control loops, automation systems, and dynamic responses.",
    subtopics: [
      {
        id: "control-system-design",
        name: "Control System Design",
        description: "Tools for designing, tuning, and simulating control systems for chemical processes.",
        applications: [
          "PID controller tuning",
          "Advanced control strategy development",
          "Control loop analysis",
          "Stability analysis"
        ],
        keyFeatures: [
          "Controller tuning methods",
          "Process model identification",
          "Frequency response analysis",
          "Robustness evaluation"
        ],
        examples: [
          { name: "MATLAB Control System Toolbox", url: "https://www.mathworks.com/" },
          { name: "ControlStation", url: "https://controlstation.com/" },
          { name: "Aspen DMCplus", url: "https://www.aspentech.com/" }
        ]
      },
      {
        id: "dcs-plc-programming",
        name: "DCS & PLC Programming",
        description: "Software platforms for programming and simulating industrial control systems like PLCs and DCS.",
        applications: [
          "Control logic implementation",
          "SCADA system development",
          "Batch process control",
          "Safety instrumented systems"
        ],
        keyFeatures: [
          "Ladder logic programming",
          "Function block diagrams",
          "Sequential function charts",
          "Simulation capabilities"
        ],
        examples: [
          { name: "Siemens TIA Portal", url: "https://new.siemens.com/global/en/products/automation/industry-software/automation-software/tia-portal.html" },
          { name: "Rockwell Studio 5000", url: "https://www.rockwellautomation.com/" },
          { name: "ABB 800xA", url: "https://new.abb.com/control-systems/800xa" }
        ]
      },
      {
        id: "hmi-development",
        name: "HMI Development",
        description: "Tools for creating human-machine interfaces for process monitoring and control.",
        applications: [
          "Operator interface design",
          "Process visualization",
          "Alarm management",
          "Data logging and reporting"
        ],
        keyFeatures: [
          "Graphical development environment",
          "Pre-built control libraries",
          "Historical data trending",
          "User access management"
        ],
        examples: [
          { name: "Wonderware InTouch", url: "https://www.aveva.com/" },
          { name: "Ignition SCADA", url: "https://inductiveautomation.com/" },
          { name: "Siemens WinCC", url: "https://new.siemens.com/global/en/products/automation/simatic-hmi/wincc-unified.html" }
        ]
      }
    ]
  },
  {
    id: "equipment-design",
    name: "Equipment Design & Sizing",
    icon: <Square className="h-5 w-5" />,
    description: "Specialized in designing heat exchangers, reactors, separators, and other process equipment.",
    subtopics: [
      {
        id: "heat-exchanger-design",
        name: "Heat Exchanger Design",
        description: "Specialized tools for designing and rating various types of heat exchangers.",
        applications: [
          "Shell and tube exchanger design",
          "Plate heat exchanger sizing",
          "Air cooler design",
          "Thermal performance evaluation"
        ],
        keyFeatures: [
          "TEMA standards compliance",
          "Fouling factor analysis",
          "Pressure drop calculations",
          "Thermal rating and sizing"
        ],
        examples: [
          { name: "HTRI Xchanger Suite", url: "https://www.htri.net/" },
          { name: "Aspen EDR", url: "https://www.aspentech.com/" },
          { name: "COMPRESS", url: "https://www.codeware.com/" }
        ]
      },
      {
        id: "vessel-design",
        name: "Pressure Vessel Design",
        description: "Software for the mechanical design of pressure vessels, tanks, and columns.",
        applications: [
          "Storage tank design",
          "Pressure vessel certification",
          "Mechanical integrity analysis",
          "Code compliance documentation"
        ],
        keyFeatures: [
          "ASME code calculations",
          "Stress analysis",
          "Nozzle design",
          "FEA integration"
        ],
        examples: [
          { name: "PV Elite", url: "https://www.hexagonppm.com/" },
          { name: "COMPRESS", url: "https://www.codeware.com/" },
          { name: "AutoPIPE Vessel", url: "https://www.bentley.com/" }
        ]
      },
      {
        id: "separation-equipment",
        name: "Separation Equipment Design",
        description: "Specialized tools for designing distillation columns, absorbers, extractors, and other separation equipment.",
        applications: [
          "Tray hydraulics design",
          "Packing selection and sizing",
          "Column internals specification",
          "Extraction equipment design"
        ],
        keyFeatures: [
          "Hydraulic calculations",
          "Mass transfer models",
          "Efficiency predictions",
          "Mechanical design integration"
        ],
        examples: [
          { name: "Aspen Distillation", url: "https://www.aspentech.com/" },
          { name: "KG-TOWER", url: "https://www.koch-glitsch.com/" },
          { name: "ProSec", url: "https://www.prosim.net/" }
        ]
      }
    ]
  },
  {
    id: "piping-design",
    name: "Piping and Instrumentation Design",
    icon: <RefreshCw className="h-5 w-5" />,
    description: "Used for creating plant schematics, piping layouts, and instrumentation diagrams.",
    subtopics: [
      {
        id: "pid-software",
        name: "P&ID Software",
        description: "Tools for creating piping and instrumentation diagrams with intelligent data connections.",
        applications: [
          "Process flow documentation",
          "Engineering documentation",
          "Instrumentation specification",
          "Line specification"
        ],
        keyFeatures: [
          "Symbol libraries",
          "Intelligent P&ID objects",
          "Database connectivity",
          "Automated line numbering"
        ],
        examples: [
          { name: "AutoCAD P&ID", url: "https://www.autodesk.com/" },
          { name: "SmartPlant P&ID", url: "https://hexagonppm.com/" },
          { name: "AVEVA Diagrams", url: "https://www.aveva.com/" }
        ]
      },
      {
        id: "pipe-stress-analysis",
        name: "Pipe Stress Analysis",
        description: "Software for calculating stresses in piping systems under various operating conditions.",
        applications: [
          "Thermal expansion analysis",
          "Support and restraint design",
          "Code compliance verification",
          "Dynamic response analysis"
        ],
        keyFeatures: [
          "Static and dynamic analysis",
          "Code compliance checking",
          "Support optimization",
          "Stress visualization"
        ],
        examples: [
          { name: "CAESAR II", url: "https://hexagonppm.com/" },
          { name: "AutoPIPE", url: "https://www.bentley.com/" },
          { name: "ROHR2", url: "https://www.rohr2.de/en/" }
        ]
      },
      {
        id: "3d-plant-design",
        name: "3D Plant Design",
        description: "Comprehensive platforms for 3D modeling of entire process plants including equipment, piping, and structural elements.",
        applications: [
          "Plant layout design",
          "Clash detection",
          "Construction planning",
          "As-built documentation"
        ],
        keyFeatures: [
          "3D modeling capabilities",
          "Equipment placement",
          "Automated piping routing",
          "Interference checking"
        ],
        examples: [
          { name: "AVEVA E3D", url: "https://www.aveva.com/" },
          { name: "Autodesk Plant 3D", url: "https://www.autodesk.com/" },
          { name: "SmartPlant 3D", url: "https://hexagonppm.com/" }
        ]
      }
    ]
  },
  {
    id: "environmental-safety",
    name: "Environmental & Safety Engineering",
    icon: <Wind className="h-5 w-5" />,
    description: "Tools for assessing process safety, emissions modeling, and environmental impact analysis.",
    subtopics: [
      {
        id: "hazard-analysis",
        name: "Hazard Analysis Tools",
        description: "Software for identifying, analyzing, and mitigating process hazards.",
        applications: [
          "HAZOP studies",
          "Fault tree analysis",
          "LOPA studies",
          "Safety integrity level determination"
        ],
        keyFeatures: [
          "Hazard scenario modeling",
          "Risk matrix integration",
          "Safety measure evaluation",
          "Documentation tools"
        ],
        examples: [
          { name: "PHA-Pro", url: "https://www.spherasolutions.com/" },
          { name: "PHAWorks", url: "https://www.primatech.com/" },
          { name: "BowTieXP", url: "https://www.cgerisk.com/" }
        ]
      },
      {
        id: "consequence-modeling",
        name: "Consequence Modeling",
        description: "Tools for predicting the consequences of process incidents like fires, explosions, and toxic releases.",
        applications: [
          "Facility siting studies",
          "Emergency response planning",
          "Quantitative risk assessment",
          "Safety zone determination"
        ],
        keyFeatures: [
          "Dispersion modeling",
          "Fire and explosion effects",
          "Toxic impact assessment",
          "GIS integration"
        ],
        examples: [
          { name: "PHAST", url: "https://www.dnv.com/software/phast" },
          { name: "FLACS", url: "https://www.gexcon.com/" },
          { name: "ALOHA", isFree: true, url: "https://www.epa.gov/cameo/aloha-software" }
        ]
      },
      {
        id: "emissions-modeling",
        name: "Emissions Modeling",
        description: "Software for predicting, tracking, and managing air, water, and soil emissions from industrial processes.",
        applications: [
          "Air dispersion modeling",
          "Wastewater treatment design",
          "Regulatory compliance",
          "Environmental impact assessment"
        ],
        keyFeatures: [
          "Pollutant fate and transport",
          "Regulatory standards integration",
          "Treatment technology evaluation",
          "Reporting tools"
        ],
        examples: [
          { name: "AERMOD", url: "https://www.epa.gov/scram/air-quality-dispersion-modeling-preferred-and-recommended-models" },
          { name: "CALPUFF", url: "http://www.src.com/" },
          { name: "WATER9", isFree: true, url: "https://www.epa.gov/water-research/water9-wastewater-treatment-model" }
        ]
      }
    ]
  },
  {
    id: "cfd",
    name: "Computational Fluid Dynamics",
    icon: <Wind className="h-5 w-5" />,
    description: "Advanced simulation of fluid flow, heat transfer, and mass transfer with detailed spatial resolution.",
    subtopics: [
      {
        id: "general-purpose-cfd",
        name: "General Purpose CFD",
        description: "Comprehensive CFD platforms for modeling a wide range of fluid flow and heat transfer problems.",
        applications: [
          "Equipment internal flow analysis",
          "Mixing studies",
          "Heat transfer optimization",
          "Multiphase flow analysis"
        ],
        keyFeatures: [
          "Mesh generation tools",
          "Multiple turbulence models",
          "Parallelization capabilities",
          "Post-processing visualization"
        ],
        examples: [
          { name: "ANSYS Fluent", url: "https://www.ansys.com/" },
          { name: "COMSOL CFD Module", url: "https://www.comsol.com/" },
          { name: "OpenFOAM", isFree: true, isOpenSource: true, url: "https://www.openfoam.com/" }
        ]
      },
      {
        id: "specialized-cfd",
        name: "Specialized CFD Applications",
        description: "CFD tools tailored for specific chemical engineering applications like reactors or separation equipment.",
        applications: [
          "Fluidized bed modeling",
          "Packed bed analysis",
          "Membrane separation",
          "Distillation internals design"
        ],
        keyFeatures: [
          "Application-specific models",
          "Reaction coupling",
          "Specialized boundary conditions",
          "Industry-specific post-processing"
        ],
        examples: [
          { name: "Barracuda VR", url: "https://cpfd-software.com/" },
          { name: "MFiX", isFree: true, url: "https://mfix.netl.doe.gov/" },
          { name: "STAR-CCM+", url: "https://www.plm.automation.siemens.com/global/en/products/simcenter/STAR-CCM.html" }
        ]
      },
      {
        id: "multiphysics-cfd",
        name: "Multiphysics CFD",
        description: "Tools that couple CFD with other physics like structural mechanics, electromagnetics, or chemical reactions.",
        applications: [
          "Fluid-structure interaction",
          "Electrochemical systems",
          "Non-Newtonian fluid processing",
          "Particle-laden flows"
        ],
        keyFeatures: [
          "Multi-domain coupling",
          "Non-linear material properties",
          "Moving boundary handling",
          "Complex physics interactions"
        ],
        examples: [
          { name: "COMSOL Multiphysics", url: "https://www.comsol.com/" },
          { name: "ANSYS Multiphysics", url: "https://www.ansys.com/" },
          { name: "Simcenter", url: "https://www.plm.automation.siemens.com/" }
        ]
      }
    ]
  },
  {
    id: "chemical-database",
    name: "Chemical Database & Molecular Modeling",
    icon: <Database className="h-5 w-5" />,
    description: "Used for molecular design, chemical structure analysis, and accessing chemical property databases.",
    subtopics: [
      {
        id: "structure-drawing",
        name: "Chemical Structure Drawing",
        description: "Tools for drawing, editing, and representing chemical structures and reactions.",
        applications: [
          "Publication-quality structure drawing",
          "Reaction scheme illustration",
          "Structure file format conversion",
          "IUPAC name generation"
        ],
        keyFeatures: [
          "Template libraries",
          "Stereochemistry representation",
          "Structure validation",
          "Multiple file format support"
        ],
        examples: [
          { name: "ChemDraw", url: "https://www.perkinelmer.com/category/chemdraw" },
          { name: "MarvinSketch", url: "https://chemaxon.com/" },
          { name: "ChemSketch", isFree: true, url: "https://www.acdlabs.com/resources/freeware/chemsketch/" }
        ]
      },
      {
        id: "molecular-modeling",
        name: "Molecular Modeling",
        description: "Software for predicting molecular properties, conformations, and interactions using computational chemistry methods.",
        applications: [
          "Drug design",
          "Catalyst development",
          "Material property prediction",
          "Reaction mechanism studies"
        ],
        keyFeatures: [
          "Quantum mechanical calculations",
          "Molecular mechanics",
          "Molecular dynamics",
          "Property prediction tools"
        ],
        examples: [
          { name: "Gaussian", url: "https://gaussian.com/" },
          { name: "AMBER", url: "https://ambermd.org/" },
          { name: "Spartan", url: "https://www.wavefun.com/" }
        ]
      },
      {
        id: "chemical-informatics",
        name: "Chemical Informatics",
        description: "Tools for managing, analyzing, and mining chemical information and databases.",
        applications: [
          "High-throughput screening analysis",
          "Structure-property relationships",
          "Chemical space exploration",
          "Formulation design"
        ],
        keyFeatures: [
          "Database integration",
          "Similarity searching",
          "QSAR/QSPR modeling",
          "Clustering and classification tools"
        ],
        examples: [
          { name: "RDKit", isFree: true, isOpenSource: true, url: "https://www.rdkit.org/" },
          { name: "ChemAxon JChem", url: "https://chemaxon.com/" },
          { name: "Schrödinger Materials Science Suite", url: "https://www.schrodinger.com/" }
        ]
      }
    ]
  },
  {
    id: "miscellaneous",
    name: "Miscellaneous Tools",
    icon: <Wrench className="h-5 w-5" />,
    description: "Specialized software for integrated tasks and unique chemical engineering applications.",
    subtopics: [
      {
        id: "process-economics",
        name: "Process Economics Tools",
        description: "Software for economic evaluation, cost estimation, and financial analysis of chemical processes.",
        applications: [
          "Capital cost estimation",
          "Operating cost analysis",
          "Profitability assessment",
          "Sensitivity analysis"
        ],
        keyFeatures: [
          "Equipment cost correlations",
          "Time value of money calculations",
          "Project financing models",
          "Economic metrics (ROI, NPV, IRR)"
        ],
        examples: [
          { name: "Aspen Process Economic Analyzer", url: "https://www.aspentech.com/" },
          { name: "ICARUS Process Evaluator", url: "https://hexagonppm.com/" },
          { name: "CapCost", url: "https://www.wileyprofessional.com/product/design-and-analysis-of-integrated-manufacturing-systems/" }
        ]
      },
      {
        id: "batch-process",
        name: "Batch Process Tools",
        description: "Specialized software for modeling, scheduling, and optimizing batch chemical processes.",
        applications: [
          "Batch recipe management",
          "Scheduling optimization",
          "Equipment utilization",
          "Cycle time reduction"
        ],
        keyFeatures: [
          "Recipe modeling",
          "Gantt chart visualization",
          "Resource allocation",
          "Campaign planning"
        ],
        examples: [
          { name: "SuperPro Designer", url: "http://www.intelligen.com/" },
          { name: "Aspen Batch Process Developer", url: "https://www.aspentech.com/" },
          { name: "Schedule Pro", url: "https://intelligen.com/schedulepro/" }
        ]
      },
      {
        id: "sustainability-tools",
        name: "Sustainability Tools",
        description: "Software for life cycle assessment, carbon footprinting, and sustainability metrics for chemical processes.",
        applications: [
          "Life cycle assessment",
          "Carbon footprint analysis",
          "Water footprint calculation",
          "Sustainable process design"
        ],
        keyFeatures: [
          "LCA databases",
          "Environmental impact categories",
          "Sustainability metrics",
          "Reporting and documentation"
        ],
        examples: [
          { name: "SimaPro", url: "https://simapro.com/" },
          { name: "GaBi", url: "https://gabi.sphera.com/" },
          { name: "Umberto", url: "https://www.ifu.com/umberto/" }
        ]
      }
    ]
  }
];

const SoftwareTopics: React.FC = () => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedSubtopic, setExpandedSubtopic] = useState<string | null>(null);
  
  const handleToggleCategory = (categoryId: string) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryId);
    }
    setExpandedSubtopic(null);
  };
  
  const handleToggleSubtopic = (subtopicId: string) => {
    if (expandedSubtopic === subtopicId) {
      setExpandedSubtopic(null);
    } else {
      setExpandedSubtopic(subtopicId);
    }
  };

  return (
    <Layout>
      <div className="py-16 px-6 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 dark:text-white animate-fade-in">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-8 relative">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: "2s" }}></div>
            
            <div className="relative z-10">
              <h1 className="text-4xl font-display font-bold mb-4 bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
                Chemical Engineering Software Topics
              </h1>
              <p className="text-gray-600 dark:text-gray-300 max-w-3xl">
                A comprehensive guide to the various categories of software used in chemical engineering, 
                including detailed information about each subtopic, applications, key features, and example software.
              </p>
              
              <div className="flex gap-4 mt-6">
                <Link to="/software-tools">
                  <Button variant="outline" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Browse Software Tools
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <GlassPanel className="shadow-xl border border-white/30 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
                All Chemical Engineering Software Categories
              </h2>
              
              <div className="space-y-4">
                {softwareCategories.map((category) => (
                  <div key={category.id} className="border border-blue-100 dark:border-blue-900 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
                    <div 
                      className={cn(
                        "flex items-center justify-between p-4 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors",
                        expandedCategory === category.id ? "bg-blue-50 dark:bg-blue-900/30" : ""
                      )}
                      onClick={() => handleToggleCategory(category.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                          {category.icon}
                        </div>
                        <div>
                          <h3 className="font-medium text-lg">{category.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{category.description}</p>
                        </div>
                      </div>
                      <div>
                        {expandedCategory === category.id ? (
                          <ChevronUp className="h-5 w-5 text-blue-500" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                    
                    {expandedCategory === category.id && (
                      <div className="p-4 border-t border-blue-100 dark:border-blue-900">
                        <div className="space-y-4">
                          {category.subtopics.map((subtopic) => (
                            <div key={subtopic.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                              <div 
                                className={cn(
                                  "flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors",
                                  expandedSubtopic === subtopic.id ? "bg-gray-50 dark:bg-gray-700/50" : ""
                                )}
                                onClick={() => handleToggleSubtopic(subtopic.id)}
                              >
                                <div>
                                  <h4 className="font-medium">{subtopic.name}</h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">{subtopic.description}</p>
                                </div>
                                <div>
                                  {expandedSubtopic === subtopic.id ? (
                                    <ChevronUp className="h-4 w-4 text-blue-500" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4 text-gray-400" />
                                  )}
                                </div>
                              </div>
                              
                              {expandedSubtopic === subtopic.id && (
                                <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                      <h5 className="font-medium text-sm mb-2 text-blue-600 dark:text-blue-400">Applications</h5>
                                      <ul className="space-y-1 text-sm list-disc pl-5">
                                        {subtopic.applications.map((app, idx) => (
                                          <li key={idx}>{app}</li>
                                        ))}
                                      </ul>
                                      
                                      <h5 className="font-medium text-sm mt-4 mb-2 text-blue-600 dark:text-blue-400">Key Features</h5>
                                      <ul className="space-y-1 text-sm list-disc pl-5">
                                        {subtopic.keyFeatures.map((feature, idx) => (
                                          <li key={idx}>{feature}</li>
                                        ))}
                                      </ul>
                                    </div>
                                    
                                    <div>
                                      <h5 className="font-medium text-sm mb-3 text-blue-600 dark:text-blue-400">Example Software</h5>
                                      <div className="space-y-3">
                                        {subtopic.examples.map((example, idx) => (
                                          <div key={idx} className="flex items-center justify-between bg-white dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                                            <div className="flex items-center gap-2">
                                              <span className="font-medium">{example.name}</span>
                                              <div className="flex gap-1">
                                                {example.isFree && (
                                                  <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full">
                                                    Free
                                                  </span>
                                                )}
                                                {example.isOpenSource && (
                                                  <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 rounded-full">
                                                    Open Source
                                                  </span>
                                                )}
                                              </div>
                                            </div>
                                            {example.url && (
                                              <a 
                                                href={example.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-blue-500 hover:text-blue-700 transition-colors"
                                              >
                                                <ExternalLink className="h-4 w-4" />
                                              </a>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                      
                                      <div className="mt-4">
                                        <Link to="/software-tools">
                                          <Button variant="outline" size="sm" className="w-full justify-center">
                                            <ChevronRight className="h-4 w-4 mr-1" />
                                            Browse All Software Tools
                                          </Button>
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </GlassPanel>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SoftwareTopics;
