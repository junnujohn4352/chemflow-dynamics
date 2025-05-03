import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { 
  FileText, Calculator, Code, FlaskConical, Info, Book, Database, 
  Thermometer, Settings, Activity, PieChart, BarChart3, LineChart, 
  Beaker, FlaskRound, Gauge, Lock, Microscope, Layers, GitBranch
} from "lucide-react";
import { Button } from "@/components/ui/button";
import LearnMoreModal from "@/components/ui/LearnMoreModal";
import { useAuth } from "@/components/auth/AuthContext";

const Dashboard = () => {
  const [isLearnMoreOpen, setIsLearnMoreOpen] = useState(false);
  const [hysysCapabilityModal, setHysysCapabilityModal] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();
  
  // Check if user has access to simulations
  const hasSimulationAccess = user?.isSubscribed || localStorage.getItem('chemflow-payment-completed') === 'true';

  const renderHysysCapabilityModal = () => {
    if (!hysysCapabilityModal) return null;
    
    const capability = hysysCapabilities.find(cap => cap.id === hysysCapabilityModal);
    if (!capability) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <span className={`p-2 rounded-lg mr-3 ${capability.colorClass}`}>
                  {capability.icon}
                </span>
                {capability.title}
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setHysysCapabilityModal(null)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>
                </svg>
              </Button>
            </div>
            
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300">{capability.description}</p>
              
              <h3 className="text-lg font-medium mt-4 mb-2 text-gray-900 dark:text-white">Key Features</h3>
              <ul className="space-y-2">
                {capability.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-gray-700 dark:text-gray-300">
                    <span className="text-green-500 mr-2">•</span>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <h3 className="text-lg font-medium mt-4 mb-2 text-gray-900 dark:text-white">Applications</h3>
              <ul className="space-y-2">
                {capability.applications.map((app, idx) => (
                  <li key={idx} className="flex items-start text-gray-700 dark:text-gray-300">
                    <span className="text-blue-500 mr-2">•</span>
                    {app}
                  </li>
                ))}
              </ul>
              
              {capability.specifications && (
                <>
                  <h3 className="text-lg font-medium mt-4 mb-2 text-gray-900 dark:text-white">Technical Specifications</h3>
                  <ul className="space-y-2">
                    {capability.specifications.map((spec, idx) => (
                      <li key={idx} className="flex items-start text-gray-700 dark:text-gray-300">
                        <span className="text-purple-500 mr-2">•</span>
                        {spec}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              {!hasSimulationAccess && (
                <Button 
                  variant="outline" 
                  asChild
                  className="flex items-center"
                >
                  <Link to="/payment">
                    <Lock className="h-4 w-4 mr-1" />
                    Unlock Feature
                  </Link>
                </Button>
              )}
              <Button 
                onClick={() => setHysysCapabilityModal(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-900">
      <Navbar />
      
      <main className="flex-1 py-16 px-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 shadow-lg text-white">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-display font-bold mb-4 text-white">
                  ChemFlow Dashboard
                </h1>
                <p className="text-xl text-blue-100">
                  Your Advanced Process Simulation Platform
                </p>
              </div>
              <Button variant="outline" className="flex gap-2 items-center border-white/20 bg-white/10 text-white hover:bg-white/20" onClick={() => setIsLearnMoreOpen(true)}>
                <Info className="h-5 w-5 text-blue-100" />
                Learn More
              </Button>
            </div>
          </div>
          
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-6 text-blue-900 dark:text-white">Core Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreDashboardCards.map(card => (
                <Link 
                  key={card.title} 
                  to={!hasSimulationAccess && card.requiresPayment ? "/payment" : card.linkTo}
                  className={`block rounded-xl border transition-all duration-300 group shadow-sm hover:shadow-md py-6 px-6
                    ${card.gradient} 
                    ${!hasSimulationAccess && card.requiresPayment ? "relative" : ""}
                  `}
                >
                  {!hasSimulationAccess && card.requiresPayment && (
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <div className="bg-white/90 dark:bg-gray-800/90 p-3 rounded-lg flex items-center space-x-2">
                        <Lock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        <span className="text-sm font-medium">Requires Payment</span>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-4 rounded-xl ${card.iconBg} text-white group-hover:scale-105 transition-transform`}>
                      {card.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-medium mb-2 text-white">{card.title}</h3>
                  <p className="text-white/80 text-sm">{card.description}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-6 text-blue-900 dark:text-white">ChemLab Software Library</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {softwareTypeCards.map(card => (
                <Link 
                  key={card.title} 
                  to={`/software-tools?type=${encodeURIComponent(card.type)}`} 
                  className={`block rounded-xl border transition-all duration-300 group shadow-sm hover:shadow-md p-4 ${card.gradient}`}
                >
                  <div className="flex justify-center items-center mb-4">
                    <div className={`p-3 rounded-xl ${card.iconBg} text-white group-hover:scale-105 transition-transform`}>
                      {card.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-medium mb-2 text-white text-center">{card.title}</h3>
                </Link>
              ))}
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-6 text-blue-900 dark:text-white">HYSYS Core Capabilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {hysysCapabilities.map((capability) => (
                <div
                  key={capability.id}
                  onClick={() => setHysysCapabilityModal(capability.id)}
                  className={`rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg ${capability.gradient}`}
                >
                  <div className="flex justify-center items-center mb-3">
                    <div className={`p-3 rounded-xl ${capability.iconBg} text-white`}>
                      {capability.icon}
                    </div>
                  </div>
                  <h3 className="text-center text-white font-medium">{capability.title}</h3>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6 text-blue-900 dark:text-white">Utilities & Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {utilityDashboardCards.map(card => (
                <Link 
                  key={card.title} 
                  to={card.linkTo} 
                  className={`block rounded-xl border transition-all duration-300 group shadow-sm hover:shadow-md py-6 px-6 ${card.gradient}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-4 rounded-xl ${card.iconBg} text-white group-hover:scale-105 transition-transform`}>
                      {card.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-medium mb-2 text-white">{card.title}</h3>
                  <p className="text-white/80 text-sm">{card.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <LearnMoreModal open={isLearnMoreOpen} onClose={() => setIsLearnMoreOpen(false)} />
      {renderHysysCapabilityModal()}
    </div>
  );
};

interface DashboardCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  linkTo: string;
  iconBg: string;
  gradient: string;
  requiresPayment?: boolean;
  type?: string;
}

const coreDashboardCards: DashboardCardProps[] = [
  {
    title: "Create Simulation",
    description: "Start building a new chemical process simulation with drag-and-drop flowsheeting",
    icon: <FlaskConical className="h-6 w-6" />,
    linkTo: "/create-simulation",
    iconBg: "bg-gradient-to-br from-blue-500 to-blue-700",
    gradient: "bg-gradient-to-br from-blue-500 to-blue-700 text-white border-blue-400",
    requiresPayment: true
  },
  {
    title: "HYSYS Calculations",
    description: "Access the comprehensive Aspen HYSYS calculations library for process engineering",
    icon: <Calculator className="h-6 w-6" />,
    linkTo: "/hysys-calculations",
    iconBg: "bg-gradient-to-br from-cyan-500 to-cyan-700",
    gradient: "bg-gradient-to-br from-cyan-500 to-cyan-700 text-white border-cyan-400"
  },
  {
    title: "Engineering Formulas",
    description: "Comprehensive collection of chemical engineering formulas and equations",
    icon: <Book className="h-6 w-6" />,
    linkTo: "/formulas",
    iconBg: "bg-gradient-to-br from-teal-500 to-teal-700",
    gradient: "bg-gradient-to-br from-teal-500 to-teal-700 text-white border-teal-400"
  }
];

const softwareTypeCards: DashboardCardProps[] = [
  {
    title: "Process Simulation & Modeling",
    description: "Design and simulate complete process plants with steady-state and dynamic modeling",
    icon: <FlaskConical className="h-6 w-6" />,
    type: "Type 1: Process Simulation & Modeling",
    linkTo: "/software-tools",
    iconBg: "bg-gradient-to-br from-blue-600 to-blue-800",
    gradient: "bg-gradient-to-br from-blue-500 to-blue-700 border-blue-400"
  },
  {
    title: "Thermodynamic & Property Estimation",
    description: "Access comprehensive thermodynamic models and physical property estimations",
    icon: <Thermometer className="h-6 w-6" />,
    type: "Type 2: Thermodynamic & Property Estimation",
    linkTo: "/software-tools",
    iconBg: "bg-gradient-to-br from-red-600 to-red-800",
    gradient: "bg-gradient-to-br from-red-500 to-red-700 border-red-400"
  },
  {
    title: "Equipment Design & Sizing",
    description: "Design and rate process equipment including heat exchangers and columns",
    icon: <Settings className="h-6 w-6" />,
    type: "Type 3: Equipment Design & Sizing",
    linkTo: "/software-tools",
    iconBg: "bg-gradient-to-br from-green-600 to-green-800",
    gradient: "bg-gradient-to-br from-green-500 to-green-700 border-green-400"
  },
  {
    title: "Process Control & Optimization",
    description: "Optimize processes for cost, yield, and energy efficiency",
    icon: <Activity className="h-6 w-6" />,
    type: "Type 4: Process Control & Optimization",
    linkTo: "/software-tools",
    iconBg: "bg-gradient-to-br from-purple-600 to-purple-800",
    gradient: "bg-gradient-to-br from-purple-500 to-purple-700 border-purple-400"
  },
  {
    title: "Laboratory & Data Analysis",
    description: "Tools for laboratory data management and analytical procedures",
    icon: <Database className="h-6 w-6" />,
    type: "Type 5: Laboratory, Data Analysis & R&D",
    linkTo: "/software-tools",
    iconBg: "bg-gradient-to-br from-amber-600 to-amber-800",
    gradient: "bg-gradient-to-br from-amber-500 to-amber-700 border-amber-400"
  }
];

const utilityDashboardCards: DashboardCardProps[] = [
  {
    title: "Unit Converter",
    description: "Convert between different engineering units with precision and ease",
    icon: <FileText className="h-6 w-6" />,
    linkTo: "/unit-converter",
    iconBg: "bg-gradient-to-br from-blue-600 to-blue-800",
    gradient: "bg-gradient-to-br from-blue-600/90 to-indigo-600/90 border-blue-500/50"
  },
  {
    title: "Code Converter",
    description: "Convert MATLAB to Python and compile Python code for engineering calculations",
    icon: <Code className="h-6 w-6" />,
    linkTo: "/code-converter",
    iconBg: "bg-gradient-to-br from-teal-600 to-teal-800",
    gradient: "bg-gradient-to-br from-teal-600/90 to-emerald-600/90 border-teal-500/50"
  },
  {
    title: "About ChemFlow",
    description: "Learn more about ChemFlow platform and our vision for chemical engineering",
    icon: <Info className="h-6 w-6" />,
    linkTo: "/about",
    iconBg: "bg-gradient-to-br from-gray-600 to-gray-800",
    gradient: "bg-gradient-to-br from-gray-600/90 to-slate-700/90 border-gray-500/50"
  }
];

interface HYSYSCapability {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  iconBg: string;
  gradient: string;
  colorClass: string;
  features: string[];
  applications: string[];
  specifications?: string[];
}

const hysysCapabilities: HYSYSCapability[] = [
  {
    id: "process-simulation",
    title: "Process Simulation & Design",
    icon: <Flask className="h-5 w-5" />,
    description: "Design and simulate entire process plants with comprehensive modeling tools for steady-state and dynamic operations.",
    iconBg: "bg-gradient-to-br from-blue-500 to-blue-700",
    gradient: "bg-gradient-to-br from-blue-500 to-blue-700 border-blue-400",
    colorClass: "bg-blue-100 text-blue-600",
    features: [
      "Steady-state modeling of complete process plants",
      "Dynamic simulation for startup, shutdown, and transient operations",
      "Interactive Process Flow Diagrams (PFDs)",
      "Mass and energy balance calculations",
      "Built-in component library with hundreds of compounds"
    ],
    applications: [
      "Refinery process design and optimization",
      "Gas processing facility modeling",
      "Chemical plant design",
      "Petrochemical process optimization",
      "Troubleshooting existing processes"
    ],
    specifications: [
      "Models up to 50,000+ equipment items in a single flowsheet",
      "Handles pressure ranges from vacuum to 15,000 psia",
      "Temperature ranges from cryogenic to 3000°F"
    ]
  },
  {
    id: "thermodynamic-property",
    title: "Thermodynamic & Property Calculations",
    icon: <Thermometer className="h-5 w-5" />,
    description: "Access comprehensive thermodynamic models for accurate physical property predictions across a wide range of operating conditions.",
    iconBg: "bg-gradient-to-br from-red-500 to-red-700",
    gradient: "bg-gradient-to-br from-red-500 to-red-700 border-red-400",
    colorClass: "bg-red-100 text-red-600",
    features: [
      "Multiple thermodynamic models (Peng-Robinson, SRK, NRTL, etc.)",
      "Phase equilibrium calculations (VLE, LLE, VLLE)",
      "Transport property estimation",
      "Binary interaction parameters",
      "Property estimation methods for unknown compounds"
    ],
    applications: [
      "Distillation column design requiring accurate VLE data",
      "Liquid-liquid extraction processes",
      "High-pressure applications in oil & gas",
      "Azeotropic systems handling",
      "Electrolyte systems"
    ]
  },
  {
    id: "reaction-engineering",
    title: "Chemical Reaction Engineering",
    icon: <Beaker className="h-5 w-5" />,
    description: "Model complex reaction systems with various reactor types using kinetic, equilibrium, and conversion-based approaches.",
    iconBg: "bg-gradient-to-br from-purple-500 to-purple-700",
    gradient: "bg-gradient-to-br from-purple-500 to-purple-700 border-purple-400",
    colorClass: "bg-purple-100 text-purple-600",
    features: [
      "Multiple reactor models (CSTR, PFR, batch, etc.)",
      "Kinetic, equilibrium, and conversion reaction modeling",
      "Catalytic and non-catalytic reactions",
      "Series and parallel reaction networks",
      "Heat of reaction calculations"
    ],
    applications: [
      "Petrochemical reaction process design",
      "Pharmaceutical intermediate production",
      "Biochemical reaction systems",
      "Polymer production processes",
      "Catalyst performance assessment"
    ]
  },
  {
    id: "equipment-sizing",
    title: "Equipment Sizing & Rating",
    icon: <Settings className="h-5 w-5" />,
    description: "Size and rate process equipment including heat exchangers, distillation columns, compressors, and more with detailed specifications.",
    iconBg: "bg-gradient-to-br from-green-500 to-green-700",
    gradient: "bg-gradient-to-br from-green-500 to-green-700 border-green-400",
    colorClass: "bg-green-100 text-green-600",
    features: [
      "Heat exchanger design and rating (shell & tube, plate, air-cooled)",
      "Distillation column hydraulics and tray efficiency",
      "Compressor and pump curves and sizing",
      "Vessel and separator design",
      "Pipeline hydraulics"
    ],
    applications: [
      "Heat exchanger network design",
      "Distillation column retrofit analysis",
      "Pressure relief system sizing",
      "Compressor train optimization",
      "Piping network design"
    ],
    specifications: [
      "TEMA standards for heat exchangers",
      "API standards for pressure vessels",
      "Column diameter range from 0.3 to 15 meters",
      "Comprehensive tray and packing specifications"
    ]
  },
  {
    id: "energy-analysis",
    title: "Energy & Utility Analysis",
    icon: <Gauge className="h-5 w-5" />,
    description: "Optimize energy usage through pinch analysis, heat integration, and utility system optimization to minimize operational costs.",
    iconBg: "bg-gradient-to-br from-amber-500 to-amber-700",
    gradient: "bg-gradient-to-br from-amber-500 to-amber-700 border-amber-400",
    colorClass: "bg-amber-100 text-amber-600",
    features: [
      "Pinch analysis for energy targeting",
      "Heat exchanger network synthesis",
      "Utility system optimization",
      "Steam system modeling",
      "Energy consumption analysis"
    ],
    applications: [
      "Plant-wide energy optimization",
      "Heat recovery system design",
      "Cogeneration system integration",
      "Utility cost reduction projects",
      "Carbon footprint reduction"
    ]
  },
  {
    id: "optimization",
    title: "Optimization & Analysis",
    icon: <LineChart className="h-5 w-5" />,
    description: "Optimize processes for cost, yield, and energy efficiency using advanced sensitivity analysis and optimization tools.",
    iconBg: "bg-gradient-to-br from-cyan-500 to-cyan-700",
    gradient: "bg-gradient-to-br from-cyan-500 to-cyan-700 border-cyan-400",
    colorClass: "bg-cyan-100 text-cyan-600",
    features: [
      "Multi-variable optimization",
      "Sensitivity analysis",
      "Case study management",
      "Economic evaluation",
      "Monte Carlo simulation"
    ],
    applications: [
      "Process yield optimization",
      "Operating cost reduction",
      "Capital cost estimation",
      "Risk analysis",
      "Design of experiments"
    ]
  },
  {
    id: "safety-operations",
    title: "Safety & Operations",
    icon: <GitBranch className="h-5 w-5" />,
    description: "Ensure process safety through dynamic modeling, relief system sizing, and operator training simulators.",
    iconBg: "bg-gradient-to-br from-rose-500 to-rose-700",
    gradient: "bg-gradient-to-br from-rose-500 to-rose-700 border-rose-400",
    colorClass: "bg-rose-100 text-rose-600",
    features: [
      "Relief system sizing and design",
      "Overpressure protection studies",
      "Operator Training Simulators (OTS)",
      "Safety system validation",
      "Emergency scenario modeling"
    ],
    applications: [
      "HAZOP studies",
      "Operator training and certification",
      "Emergency response planning",
      "Control system checkout",
      "Safety interlock validation"
    ]
  },
  {
    id: "oil-gas",
    title: "Oil & Gas Applications",
    icon: <PieChart className="h-5 w-5" />,
    description: "Specialized tools for oil and gas industry including gas processing, crude distillation, and pipeline modeling.",
    iconBg: "bg-gradient-to-br from-teal-500 to-teal-700",
    gradient: "bg-gradient-to-br from-teal-500 to-teal-700 border-teal-400",
    colorClass: "bg-teal-100 text-teal-600",
    features: [
      "Gas processing simulation (sweetening, dehydration)",
      "Crude oil characterization",
      "Multiphase flow modeling",
      "Pipeline networks",
      "Reservoir fluid modeling"
    ],
    applications: [
      "Natural gas plant design",
      "LNG facility modeling",
      "Crude distillation optimization",
      "Pipeline capacity studies",
      "Gas gathering system design"
    ]
  },
  {
    id: "economic-analysis",
    title: "Economic & Cost Analysis",
    icon: <BarChart3 className="h-5 w-5" />,
    description: "Estimate capital and operating costs for process equipment and entire plants to support investment decisions.",
    iconBg: "bg-gradient-to-br from-indigo-500 to-indigo-700",
    gradient: "bg-gradient-to-br from-indigo-500 to-indigo-700 border-indigo-400",
    colorClass: "bg-indigo-100 text-indigo-600",
    features: [
      "Capital cost estimation",
      "Operating cost analysis",
      "Economic evaluation metrics (ROI, NPV, IRR)",
      "Scenario comparison",
      "Sensitivity analysis for economic parameters"
    ],
    applications: [
      "Project feasibility studies",
      "Bid development",
      "Budget preparation",
      "Investment decision support",
      "Cost reduction initiatives"
    ]
  },
  {
    id: "tool-integration",
    title: "Integration Capabilities",
    icon: <Layers className="h-5 w-5" />,
    description: "Connect HYSYS with other software tools including Excel, MATLAB, Aspen Plus, and real-time data systems.",
    iconBg: "bg-gradient-to-br from-fuchsia-500 to-fuchsia-700",
    gradient: "bg-gradient-to-br from-fuchsia-500 to-fuchsia-700 border-fuchsia-400",
    colorClass: "bg-fuchsia-100 text-fuchsia-600",
    features: [
      "Excel integration via ActiveX",
      "MATLAB connectivity",
      "Aspen suite integration",
      "OPC interfaces for real-time data",
      "Custom extension capability through programming"
    ],
    applications: [
      "Digital twin development",
      "Advanced process control",
      "Data analytics integration",
      "Custom user interfaces",
      "Report generation automation"
    ]
  }
];

export default Dashboard;
