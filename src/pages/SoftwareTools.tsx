
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GlassPanel from "@/components/ui/GlassPanel";
import { 
  Cpu, 
  Thermometer, 
  Flask, 
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
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface Software {
  name: string;
  description: string;
  category: SoftwareCategory;
  isFree?: boolean;
  isOpenSource?: boolean;
  url?: string;
  features?: string[];
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
    icon: <Flask className="h-5 w-5" />,
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
    icon: <Wind className="h-5 w-5" />,
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
    name: "Chemical Database & Molecular Modeling",
    icon: <Database className="h-5 w-5" />,
    description: "Used for molecular design, chemical structure analysis, and accessing chemical property databases."
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
      "Pipe sizing and pressure drop calculations"
    ]
  },
  {
    name: "Aspen Plus",
    description: "Focused on chemical, petrochemical, and refining industries.",
    category: "process-simulation",
    features: [
      "Detailed chemical process modeling",
      "Rigorous distillation calculations",
      "Solid handling capabilities",
      "Rate-based separation models"
    ]
  },
  {
    name: "ChemCAD",
    description: "Process simulation with a user-friendly interface.",
    category: "process-simulation",
    features: [
      "Flowsheet simulation",
      "Equipment sizing",
      "Thermodynamic calculations",
      "Heat exchanger design"
    ]
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
    name: "VMGSim",
    description: "Advanced simulator for complex thermodynamics.",
    category: "thermodynamic",
    features: [
      "Advanced equation of state models",
      "Fluid characterization",
      "Electrolyte modeling",
      "Acid gas processing"
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

  // Data Analysis & Statistics
  {
    name: "MATLAB",
    description: "Widely used for numerical analysis, simulations, and algorithm development.",
    category: "data-analysis",
    features: [
      "Numerical computing",
      "Visualization",
      "Programming environment",
      "Advanced toolboxes for specialized analyses"
    ]
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
      "Machine learning capabilities"
    ]
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
      "Reproducible research"
    ]
  },
  {
    name: "Excel with VBA",
    description: "Basic data modeling and process calculations.",
    category: "data-analysis",
    features: [
      "Spreadsheet calculations",
      "Basic data analysis",
      "Visual Basic programming",
      "Data visualization"
    ]
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
    name: "GASP",
    description: "Greenhouse gas simulation and analysis.",
    category: "environmental-safety",
    features: [
      "Carbon footprint calculation",
      "Emission inventories",
      "Regulatory reporting",
      "Abatement scenario modeling"
    ]
  },

  // Computational Fluid Dynamics
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

  // Chemical Database & Molecular Modeling
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
    name: "Gaussian",
    description: "Molecular modeling and quantum chemistry.",
    category: "chemical-database",
    features: [
      "Quantum chemical calculations",
      "Electronic structure methods",
      "Spectroscopic properties",
      "Reaction pathways"
    ]
  },
  {
    name: "Spartan",
    description: "3D chemical structure analysis and modeling.",
    category: "chemical-database",
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
    category: "chemical-database",
    features: [
      "Molecular mechanics",
      "Quantum chemistry",
      "Molecular dynamics",
      "3D visualization"
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
    name: "SimSci PRO/II",
    description: "Process modeling with steady-state focus.",
    category: "miscellaneous",
    features: [
      "Process simulation",
      "Equipment sizing",
      "Thermodynamic calculations",
      "Heat and material balances"
    ]
  },
  {
    name: "UNISIM",
    description: "Honeywell's process simulation alternative to HYSYS.",
    category: "miscellaneous",
    features: [
      "Process modeling",
      "Dynamic simulation",
      "Rigorous equipment models",
      "Thermodynamic calculations"
    ]
  }
];

const SoftwareTools = () => {
  const [activeCategory, setActiveCategory] = useState<SoftwareCategory | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOptions, setFilterOptions] = useState({
    showFreeOnly: false,
    showOpenSourceOnly: false
  });
  const [expandedSoftware, setExpandedSoftware] = useState<string | null>(null);

  const handleToggleExpand = (softwareName: string) => {
    if (expandedSoftware === softwareName) {
      setExpandedSoftware(null);
    } else {
      setExpandedSoftware(softwareName);
    }
  };

  const filteredSoftware = softwareDatabase.filter(software => {
    // Filter by category
    if (activeCategory !== "all" && software.category !== activeCategory) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !software.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !software.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filter by options
    if (filterOptions.showFreeOnly && !software.isFree) {
      return false;
    }
    
    if (filterOptions.showOpenSourceOnly && !software.isOpenSource) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 dark:text-white">
      <Navbar />
      
      <main className="flex-1 py-16 px-6 animate-fade-in">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-8 relative">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: "2s" }}></div>
            
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-display font-bold mb-4 bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent relative z-10">
                  Chemical Engineering Software Tools
                </h1>
                <p className="text-gray-600 dark:text-gray-300 max-w-3xl relative z-10">
                  A comprehensive collection of software tools used in chemical engineering for simulation, modeling, process design, 
                  thermodynamics, equipment sizing, data analysis, and more.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mb-8 flex flex-col md:flex-row gap-4 items-start">
            <div className="w-full md:w-2/3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  className="pl-10 bg-white dark:bg-gray-800" 
                  placeholder="Search software by name or description..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="w-full md:w-1/3 flex gap-2 flex-wrap">
              <Button
                variant={filterOptions.showFreeOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterOptions({...filterOptions, showFreeOnly: !filterOptions.showFreeOnly})}
                className="flex items-center gap-1"
              >
                <Filter className="h-4 w-4" />
                Free Software
              </Button>
              <Button
                variant={filterOptions.showOpenSourceOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterOptions({...filterOptions, showOpenSourceOnly: !filterOptions.showOpenSourceOnly})}
                className="flex items-center gap-1"
              >
                <Filter className="h-4 w-4" />
                Open Source
              </Button>
            </div>
          </div>
          
          <div className="mb-8">
            <Tabs defaultValue="all" onValueChange={(value) => setActiveCategory(value as SoftwareCategory | "all")}>
              <div className="overflow-x-auto pb-3">
                <TabsList className="bg-blue-50/50 dark:bg-gray-800/50 p-1 flex space-x-1 flex-nowrap min-w-max">
                  <TabsTrigger value="all" className="whitespace-nowrap">
                    All Categories
                  </TabsTrigger>
                  {softwareCategories.map((category) => (
                    <TabsTrigger 
                      key={category.id} 
                      value={category.id}
                      className="flex items-center gap-2 whitespace-nowrap"
                    >
                      {category.icon}
                      <span>{category.name}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </Tabs>
          </div>
          
          <div className="glass-panel relative z-10 shadow-xl border border-white/30 backdrop-blur-sm p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2">
                {activeCategory === "all" 
                  ? "All Chemical Engineering Software" 
                  : softwareCategories.find(cat => cat.id === activeCategory)?.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {activeCategory === "all"
                  ? `Showing ${filteredSoftware.length} tools across all categories`
                  : softwareCategories.find(cat => cat.id === activeCategory)?.description}
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredSoftware.length > 0 ? (
                filteredSoftware.map((software) => (
                  <div 
                    key={software.name}
                    className={cn(
                      "bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 p-5 transition-all duration-300",
                      "hover:shadow-md",
                      expandedSoftware === software.name ? "shadow-md" : ""
                    )}
                  >
                    <div className="flex justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold flex items-center gap-2">
                          {software.name}
                          {software.url && (
                            <a 
                              href={software.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex text-blue-500 hover:text-blue-700"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">{software.description}</p>
                      </div>
                      <div className="flex flex-col items-end justify-start gap-2">
                        <div className="flex gap-1">
                          {software.isFree && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                              Free
                            </Badge>
                          )}
                          {software.isOpenSource && (
                            <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                              Open Source
                            </Badge>
                          )}
                        </div>
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                          {softwareCategories.find(cat => cat.id === software.category)?.name}
                        </Badge>
                      </div>
                    </div>
                    
                    {software.features && (
                      <div className="mt-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleExpand(software.name)}
                          className="flex items-center gap-1 text-blue-600 dark:text-blue-400 p-0 h-auto"
                        >
                          {expandedSoftware === software.name ? (
                            <>
                              <ChevronUp className="h-4 w-4" />
                              Hide Features
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-4 w-4" />
                              Show Features
                            </>
                          )}
                        </Button>
                        
                        {expandedSoftware === software.name && (
                          <ul className="mt-2 space-y-1 pl-5 list-disc text-gray-600 dark:text-gray-400">
                            {software.features.map((feature, index) => (
                              <li key={index}>{feature}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-2 flex flex-col items-center justify-center py-12 text-center">
                  <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-4 mb-4">
                    <Search className="h-8 w-8 text-blue-500 dark:text-blue-300" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No software found</h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md">
                    Try changing your search terms or filters to find what you're looking for.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setSearchTerm("");
                      setFilterOptions({ showFreeOnly: false, showOpenSourceOnly: false });
                      setActiveCategory("all");
                    }}
                  >
                    Reset All Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SoftwareTools;
