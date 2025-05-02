
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { 
  FileText, 
  Calculator,
  Code,
  FlaskConical,
  Info,
  Book,
  Database,
  Thermometer,
  Settings,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import LearnMoreModal from "@/components/ui/LearnMoreModal";

const Dashboard = () => {
  const [isLearnMoreOpen, setIsLearnMoreOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-1 py-16 px-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-12 flex justify-between items-center bg-blue-50 rounded-xl p-6">
            <div>
              <h1 className="text-4xl font-display font-bold mb-4 text-blue-900">
                ChemFlow Dashboard
              </h1>
              <p className="text-xl text-blue-700">
                Your Process Simulation Platform
              </p>
            </div>
            <Button 
              variant="outline" 
              className="flex gap-2 items-center border-blue-300 text-blue-800 hover:bg-blue-100"
              onClick={() => setIsLearnMoreOpen(true)}
            >
              <Info className="h-5 w-5 text-blue-600" />
              Learn More
            </Button>
          </div>
          
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-6 text-blue-900">Core Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreDashboardCards.map((card) => (
                <Link 
                  key={card.title}
                  to={card.linkTo}
                  className="block rounded-xl border border-blue-100 p-6 hover:bg-blue-50 transition-all duration-300 group shadow-sm hover:shadow-md"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl ${card.color} bg-opacity-10 group-hover:scale-105 transition-transform`}>
                      {card.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-medium mb-2 text-blue-900">{card.title}</h3>
                  <p className="text-blue-700 text-sm">{card.description}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-6 text-blue-900">ChemLab Software Library</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {softwareTypeCards.map((card) => (
                <Link 
                  key={card.title}
                  to={`/software-tools?type=${encodeURIComponent(card.type)}`}
                  className="block rounded-xl border border-blue-100 p-4 hover:bg-blue-50 transition-all duration-300 group shadow-sm hover:shadow-md"
                >
                  <div className="flex justify-center items-center mb-4">
                    <div className={`p-3 rounded-xl ${card.color} text-white group-hover:scale-105 transition-transform`}>
                      {card.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-medium mb-2 text-blue-900 text-center">{card.title}</h3>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6 text-blue-900">Utilities & Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {utilityDashboardCards.map((card) => (
                <Link 
                  key={card.title}
                  to={card.linkTo}
                  className="block rounded-xl border border-blue-100 p-6 hover:bg-blue-50 transition-all duration-300 group shadow-sm hover:shadow-md"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl ${card.color} bg-opacity-10 group-hover:scale-105 transition-transform`}>
                      {card.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-medium mb-2 text-blue-900">{card.title}</h3>
                  <p className="text-blue-700 text-sm">{card.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <LearnMoreModal
        open={isLearnMoreOpen}
        onClose={() => setIsLearnMoreOpen(false)}
      />
    </div>
  );
};

interface DashboardCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  linkTo: string;
  color: string;
  type?: string;
}

const coreDashboardCards = [
  {
    title: "Create Simulation",
    description: "Start building a new chemical process simulation",
    icon: <FlaskConical className="h-6 w-6" />,
    linkTo: "/create-simulation",
    color: "bg-flow-blue text-white",
  },
  {
    title: "HYSYS Calculations",
    description: "Comprehensive Aspen HYSYS calculations library",
    icon: <Calculator className="h-6 w-6" />,
    linkTo: "/hysys-calculations",
    color: "bg-flow-cyan text-white",
  },
  {
    title: "Engineering Formulas",
    description: "Comprehensive collection of chemical engineering formulas",
    icon: <Book className="h-6 w-6" />,
    linkTo: "/formulas",
    color: "bg-flow-teal text-white",
  }
];

const softwareTypeCards = [
  {
    title: "Process Simulation & Modeling",
    icon: <FlaskConical className="h-6 w-6" />,
    type: "Type 1: Process Simulation & Modeling",
    linkTo: "/software-tools",
    color: "bg-blue-600",
  },
  {
    title: "Thermodynamic & Property Estimation",
    icon: <Thermometer className="h-6 w-6" />,
    type: "Type 2: Thermodynamic & Property Estimation",
    linkTo: "/software-tools",
    color: "bg-red-600",
  },
  {
    title: "Equipment Design & Sizing",
    icon: <Settings className="h-6 w-6" />,
    type: "Type 3: Equipment Design & Sizing",
    linkTo: "/software-tools",
    color: "bg-green-600",
  },
  {
    title: "Process Control & Optimization",
    icon: <Activity className="h-6 w-6" />,
    type: "Type 4: Process Control & Optimization",
    linkTo: "/software-tools",
    color: "bg-purple-600",
  },
  {
    title: "Laboratory & Data Analysis",
    icon: <Database className="h-6 w-6" />,
    type: "Type 5: Laboratory, Data Analysis & R&D",
    linkTo: "/software-tools",
    color: "bg-amber-600",
  },
];

const utilityDashboardCards = [
  {
    title: "Unit Converter",
    description: "Convert between different engineering units",
    icon: <FileText className="h-6 w-6" />,
    linkTo: "/unit-converter",
    color: "bg-blue-500 text-white",
  },
  {
    title: "Code Converter",
    description: "Convert MATLAB to Python and compile Python code",
    icon: <Code className="h-6 w-6" />,
    linkTo: "/code-converter",
    color: "bg-teal-500 text-white",
  },
  {
    title: "About ChemFlow",
    description: "Learn more about ChemFlow and our vision",
    icon: <Info className="h-6 w-6" />,
    linkTo: "/about",
    color: "bg-gray-500 text-white",
  }
];

export default Dashboard;
