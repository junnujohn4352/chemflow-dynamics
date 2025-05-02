
import { SoftwareDatabase } from "../types/software";

export const softwareDatabase: SoftwareDatabase = {
  software: [
    // Type 1: Process Simulation & Modeling Software
    {
      id: "chemlab-aspen-plus",
      name: "ChemLab: Aspen Plus",
      description: "Steady-state simulation of chemical processes including reactions, separations, and energy balance calculations.",
      category: "Process Simulation",
      type: "Type 1: Process Simulation & Modeling",
      price: "Free",
      openSource: true,
      features: [
        "Thermodynamics libraries",
        "Flow sheeting",
        "Sensitivity analysis",
        "Process modeling",
        "Simulation",
        "Optimization"
      ],
      usedIn: ["Chemical plants", "Pharmaceuticals", "Specialty chemicals"],
      rating: 4.7,
      votes: 245,
      localApp: true,
      appRoute: "/chemlab/aspen-plus"
    },
    {
      id: "chemlab-hysys",
      name: "ChemLab: HYSYS",
      description: "Steady-state and dynamic modeling software especially designed for oil & gas, refineries, and natural gas processing plants.",
      category: "Process Simulation",
      type: "Type 1: Process Simulation & Modeling",
      price: "Free",
      openSource: true,
      features: [
        "Fluid flow analysis",
        "Phase equilibria",
        "Compressor modeling",
        "Safety relief analysis",
        "Dynamic simulation"
      ],
      usedIn: ["Petrochemical", "LNG", "Energy industries"],
      rating: 4.8,
      votes: 320,
      localApp: true,
      appRoute: "/chemlab/hysys"
    },
    {
      id: "chemlab-chemcad",
      name: "ChemLab: CHEMCAD",
      description: "Modular simulation software with customizable unit operations for chemical process design and optimization.",
      category: "Process Simulation",
      type: "Type 1: Process Simulation & Modeling",
      price: "Free",
      openSource: true,
      features: [
        "Heat and mass balance",
        "Dynamic simulation",
        "Process optimization",
        "Equipment sizing"
      ],
      usedIn: ["Specialty chemicals", "Petrochemicals", "Food industries"],
      rating: 4.2,
      votes: 156,
      localApp: true,
      appRoute: "/chemlab/chemcad"
    },
    {
      id: "chemlab-dwsim",
      name: "ChemLab: DWSIM",
      description: "CAPE-OPEN compliant simulator for chemical processes with graphical interface and thermodynamic models.",
      category: "Process Simulation",
      type: "Type 1: Process Simulation & Modeling",
      price: "Free",
      openSource: true,
      features: [
        "Thermodynamic models",
        "Customizable flowsheets",
        "Python scripting",
        "CAPE-OPEN compliance"
      ],
      usedIn: ["Education", "Small-scale industry simulation"],
      rating: 4.5,
      votes: 98,
      localApp: true,
      appRoute: "/chemlab/dwsim"
    },
    {
      id: "chemlab-unisim",
      name: "ChemLab: UniSim Design",
      description: "Process simulation tool for design and optimization of chemical and energy systems with rigorous equipment models.",
      category: "Process Simulation",
      type: "Type 1: Process Simulation & Modeling",
      price: "Free",
      openSource: true,
      features: [
        "Process optimization",
        "HAZOP studies",
        "Steady/dynamic models",
        "Pipeline modeling"
      ],
      usedIn: ["Refining", "Oil & gas", "Power generation"],
      rating: 4.3,
      votes: 112,
      localApp: true,
      appRoute: "/chemlab/unisim"
    },
    
    // Type 2: Thermodynamic and Property Estimation Tools
    {
      id: "chemlab-refprop",
      name: "ChemLab: REFPROP",
      description: "High-accuracy reference fluid thermodynamic and transport properties database for pure fluids and mixtures.",
      category: "Thermodynamic Properties",
      type: "Type 2: Thermodynamic & Property Estimation",
      price: "Free",
      openSource: true,
      features: [
        "Equations of state",
        "Thermodynamic charts",
        "Multi-component mixtures",
        "Transport properties"
      ],
      usedIn: ["Refrigeration", "Cryogenics", "Chemical industry"],
      rating: 4.9,
      votes: 142,
      localApp: true,
      appRoute: "/chemlab/refprop"
    },
    {
      id: "chemlab-properties",
      name: "ChemLab: Properties",
      description: "Comprehensive property database and estimation tool integrated with ChemLab simulation software.",
      category: "Thermodynamic Properties",
      type: "Type 2: Thermodynamic & Property Estimation",
      price: "Free",
      openSource: true,
      features: [
        "20,000+ chemicals database",
        "NRTL models",
        "Peng-Robinson EOS",
        "UNIQUAC models"
      ],
      usedIn: ["General chemical process simulation"],
      rating: 4.7,
      votes: 118,
      localApp: true,
      appRoute: "/chemlab/properties"
    },
    {
      id: "chemlab-coolprop",
      name: "ChemLab: CoolProp",
      description: "Thermophysical property library for pure fluids and mixtures with multiple interfaces.",
      category: "Thermodynamic Properties",
      type: "Type 2: Thermodynamic & Property Estimation",
      price: "Free",
      openSource: true,
      features: [
        "REFPROP-like modeling",
        "High-speed computation",
        "Multiple language bindings",
        "Refrigerant properties"
      ],
      usedIn: ["Academic", "Research", "Refrigerants and mixtures"],
      rating: 4.6,
      votes: 93,
      localApp: true,
      appRoute: "/chemlab/coolprop"
    },
    
    // Type 3: Equipment Design and Sizing Software
    {
      id: "chemlab-exchanger",
      name: "ChemLab: Exchanger Design",
      description: "Complete heat exchanger design, simulation, and rating software for various exchanger types.",
      category: "Equipment Design",
      type: "Type 3: Equipment Design & Sizing",
      price: "Free",
      openSource: true,
      features: [
        "Thermal and hydraulic design",
        "Fouling analysis",
        "TEMA standards compliance",
        "Detailed performance reports"
      ],
      usedIn: ["All process industries", "Heat exchanger design"],
      rating: 4.7,
      votes: 136,
      localApp: true,
      appRoute: "/chemlab/exchanger"
    },
    {
      id: "chemlab-column-design",
      name: "ChemLab: Column Design",
      description: "Comprehensive distillation column and separation equipment design tool.",
      category: "Equipment Design",
      type: "Type 3: Equipment Design & Sizing",
      price: "Free",
      openSource: true,
      features: [
        "Tray and packing design",
        "Hydraulic analysis",
        "Efficiency calculations",
        "Thermal performance modeling"
      ],
      usedIn: ["Oil & gas", "Refining", "Chemical industries"],
      rating: 4.6,
      votes: 128,
      localApp: true,
      appRoute: "/chemlab/column-design"
    },
    {
      id: "chemlab-pipe-flow",
      name: "ChemLab: Pipe Flow",
      description: "Pipe network and pressure drop calculation software for gases and liquids with component sizing.",
      category: "Equipment Design",
      type: "Type 3: Equipment Design & Sizing",
      price: "Free",
      openSource: true,
      features: [
        "Flow analysis",
        "Pump sizing",
        "Pressure drop calculations",
        "System curve generation"
      ],
      usedIn: ["Pipeline design", "Gas/liquid transport systems"],
      rating: 4.4,
      votes: 89,
      localApp: true,
      appRoute: "/chemlab/pipe-flow"
    },
    
    // Type 4: Process Control & Optimization Software
    {
      id: "chemlab-control",
      name: "ChemLab: Process Control",
      description: "Advanced process control (APC) software for multivariable control and optimization of complex processes.",
      category: "Process Control",
      type: "Type 4: Process Control & Optimization",
      price: "Free",
      openSource: true,
      features: [
        "Model Predictive Control (MPC)",
        "Multivariable control",
        "Real-time optimization",
        "Adaptive control"
      ],
      usedIn: ["Refining", "Petrochemical", "Chemical plants"],
      rating: 4.6,
      votes: 93,
      localApp: true,
      appRoute: "/chemlab/process-control"
    },
    {
      id: "chemlab-pid-tuner",
      name: "ChemLab: PID Tuner",
      description: "PID tuning and control loop analysis software for process control optimization.",
      category: "Process Control",
      type: "Type 4: Process Control & Optimization",
      price: "Free",
      openSource: true,
      features: [
        "Oscillation diagnosis",
        "Tuning advisor",
        "Loop performance metrics",
        "Non-steady state tuning"
      ],
      usedIn: ["Chemical manufacturing", "Batch processes", "Continuous processes"],
      rating: 4.5,
      votes: 85,
      localApp: true,
      appRoute: "/chemlab/pid-tuner"
    },
    
    // Type 5: Laboratory, Data Analysis & R&D Software
    {
      id: "chemlab-doe",
      name: "ChemLab: Design of Experiments",
      description: "Statistical software for Design of Experiments (DoE) and optimization of processes and formulations.",
      category: "Laboratory & Data Analysis",
      type: "Type 5: Laboratory, Data Analysis & R&D",
      price: "Free",
      openSource: true,
      features: [
        "ANOVA",
        "Factorial design",
        "Response surface methodology (RSM)",
        "Mixture designs"
      ],
      usedIn: ["R&D labs", "Formulation studies", "Process optimization"],
      rating: 4.7,
      votes: 95,
      localApp: true,
      appRoute: "/chemlab/doe"
    },
    {
      id: "chemlab-data-analytics",
      name: "ChemLab: Data Analytics",
      description: "Statistical software for data analysis, quality control, and process improvement.",
      category: "Data Analysis",
      type: "Type 5: Laboratory, Data Analysis & R&D",
      price: "Free",
      openSource: true,
      features: [
        "Regression analysis",
        "ANOVA",
        "Control charts",
        "Process capability analysis"
      ],
      usedIn: ["Lab experiments", "Food tech", "QA/QC labs"],
      rating: 4.6,
      votes: 128,
      localApp: true,
      appRoute: "/chemlab/data-analytics"
    },
    {
      id: "chemlab-lims",
      name: "ChemLab: LIMS",
      description: "Laboratory Information Management System for sample tracking and lab workflow management.",
      category: "Laboratory & Data Analysis",
      type: "Type 5: Laboratory, Data Analysis & R&D",
      price: "Free",
      openSource: true,
      features: [
        "Sample tracking",
        "Regulatory compliance",
        "Workflow automation",
        "Instrument integration"
      ],
      usedIn: ["Food", "Pharma", "Oil & chemical labs"],
      rating: 4.3,
      votes: 67,
      localApp: true,
      appRoute: "/chemlab/lims"
    }
  ],
  educationalResources: [
    // Add educational resources here if needed
  ]
};
