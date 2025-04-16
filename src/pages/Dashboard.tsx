
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import GlassPanel from "@/components/ui/GlassPanel";
import { 
  FileText, 
  Calculator,
  Code,
  FlaskConical,
  Info,
  Book,
  Cpu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import LearnMoreModal from "@/components/ui/LearnMoreModal";

const Dashboard = () => {
  const [isLearnMoreOpen, setIsLearnMoreOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-1 py-16 px-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-display font-bold mb-2 dark:text-white">Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400">Welcome to ChemFlow - Your Chemical Process Simulation Platform</p>
            </div>
            <Button 
              variant="outline" 
              className="flex gap-2 items-center"
              onClick={() => setIsLearnMoreOpen(true)}
            >
              <Info className="h-4 w-4" />
              Learn More
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <DashboardCard 
              title="Create Simulation"
              description="Start building a new chemical process simulation"
              icon={<FlaskConical className="h-6 w-6" />}
              linkTo="/create-simulation"
              color="bg-purple-500"
            />
            <DashboardCard 
              title="Intelligent Simulation"
              description="Compound selection and real-time thermodynamic analysis"
              icon={<Cpu className="h-6 w-6" />}
              linkTo="/intelligent-simulation"
              color="bg-indigo-600"
              isNew={true}
            />
            <DashboardCard 
              title="HYSYS Calculations"
              description="Access comprehensive Aspen HYSYS calculations library"
              icon={<Calculator className="h-6 w-6" />}
              linkTo="/hysys-calculations"
              color="bg-indigo-500"
            />
            <DashboardCard 
              title="Engineering Formulas"
              description="Comprehensive collection of chemical engineering formulas"
              icon={<Book className="h-6 w-6" />}
              linkTo="/formulas"
              color="bg-green-500"
            />
            <DashboardCard 
              title="Unit Converter"
              description="Convert between different engineering units"
              icon={<FileText className="h-6 w-6" />}
              linkTo="/unit-converter"
              color="bg-blue-500"
            />
            <DashboardCard 
              title="Code Converter"
              description="Convert MATLAB to Python and compile Python code"
              icon={<Code className="h-6 w-6" />}
              linkTo="/code-converter"
              color="bg-teal-500"
            />
            <DashboardCard 
              title="About"
              description="Learn more about LOL Groups and our vision"
              icon={<Info className="h-6 w-6" />}
              linkTo="/about"
              color="bg-amber-500"
            />
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
  isNew?: boolean;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  description, 
  icon, 
  linkTo, 
  color,
  isNew
}) => {
  return (
    <Link 
      to={linkTo}
      className="block rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-300 relative"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${color} text-white`}>
          {icon}
        </div>
        {isNew && (
          <span className="absolute top-4 right-4 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
            New
          </span>
        )}
      </div>
      <h3 className="text-xl font-medium mb-2 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
    </Link>
  );
};

export default Dashboard;
