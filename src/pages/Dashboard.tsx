
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { 
  FileText, Calculator, Code, FlaskConical, Info, Book, Database, Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import LearnMoreModal from "@/components/ui/LearnMoreModal";

const Dashboard = () => {
  const [isLearnMoreOpen, setIsLearnMoreOpen] = useState(false);
  
  // Remove authentication-related code
  const hasSimulationAccess = true; // Set to true since we're removing auth checks
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-900 dark:to-blue-900">
      <Navbar />
      
      <main className="flex-1 py-16 px-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 shadow-xl text-white border border-blue-400 dark:border-purple-800">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              <Link 
                to="/create-simulation"
                className="block rounded-xl border transition-all duration-300 group shadow-lg hover:shadow-xl py-8 px-8
                  bg-gradient-to-br from-blue-500 to-purple-600 text-white border-blue-400 transform hover:scale-105"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 text-white group-hover:scale-110 transition-transform shadow-lg">
                    <FlaskConical className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="text-2xl font-medium mb-2 text-white">Create Simulation</h3>
                <p className="text-white/90 text-md">Build chemical process simulations with interactive flowsheeting and connect equipment using drag-and-drop</p>
              </Link>

              <Link 
                to="/engineering-formulas"
                className="block rounded-xl border transition-all duration-300 group shadow-lg hover:shadow-xl py-8 px-8
                  bg-gradient-to-br from-teal-500 to-green-600 text-white border-teal-400 transform hover:scale-105"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-teal-600 to-teal-800 text-white group-hover:scale-110 transition-transform shadow-lg">
                    <Book className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="text-2xl font-medium mb-2 text-white">Engineering Formulas</h3>
                <p className="text-white/90 text-md">Comprehensive collection of chemical engineering formulas and equations</p>
              </Link>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6 text-blue-900 dark:text-white">Utilities & Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {utilityDashboardCards.map(card => (
                <Link 
                  key={card.title} 
                  to={card.linkTo} 
                  className={`block rounded-xl border transition-all duration-300 group shadow-md hover:shadow-lg py-6 px-8 ${card.gradient} transform hover:scale-105`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-4 rounded-xl ${card.iconBg} text-white group-hover:scale-110 transition-transform shadow-md`}>
                      {card.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-medium mb-2 text-white">{card.title}</h3>
                  <p className="text-white/90 text-sm">{card.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <LearnMoreModal open={isLearnMoreOpen} onClose={() => setIsLearnMoreOpen(false)} />
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

export default Dashboard;
