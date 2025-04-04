
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
  ListTodo,
  Component,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import LearnMoreModal from "@/components/ui/LearnMoreModal";

const Dashboard = () => {
  const [isLearnMoreOpen, setIsLearnMoreOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-50 via-white to-purple-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-1 py-16 px-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-display font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400">Welcome to ChemFlow - Your Chemical Process Simulation Platform</p>
            </div>
            <Button 
              variant="outline" 
              className="flex gap-2 items-center glass-card colorful-shadow-hover"
              onClick={() => setIsLearnMoreOpen(true)}
            >
              <Info className="h-4 w-4" />
              Learn More
            </Button>
          </div>
          
          {/* Primary Actions Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-indigo-800 dark:text-white flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-amber-500" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DashboardCard 
                title="Create Simulation"
                description="Start building a new chemical process simulation"
                icon={<FlaskConical className="h-6 w-6" />}
                linkTo="/create-simulation"
                color="bg-gradient-purple-pink"
                isPrimary={true}
              />
              <DashboardCard 
                title="View Simulations"
                description="Access and manage your existing simulations"
                icon={<ListTodo className="h-6 w-6" />}
                linkTo="/simulations"
                color="bg-gradient-blue-cyan"
                isPrimary={true}
              />
              <DashboardCard 
                title="Equipment Library"
                description="Browse and select components for your process"
                icon={<Component className="h-6 w-6" />}
                linkTo="/components"
                color="bg-gradient-green-teal"
                isPrimary={true}
              />
            </div>
          </div>
          
          {/* Tools & Resources Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-indigo-800 dark:text-white flex items-center">
              <Calculator className="h-5 w-5 mr-2 text-teal-500" />
              Tools & Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DashboardCard 
                title="HYSYS Calculations"
                description="Access comprehensive Aspen HYSYS calculations library"
                icon={<Calculator className="h-6 w-6" />}
                linkTo="/hysys-calculations"
                color="bg-gradient-indigo-blue"
              />
              <DashboardCard 
                title="Engineering Formulas"
                description="Comprehensive collection of chemical engineering formulas"
                icon={<Book className="h-6 w-6" />}
                linkTo="/formulas"
                color="bg-gradient-green-teal"
              />
              <DashboardCard 
                title="Unit Converter"
                description="Convert between different engineering units"
                icon={<FileText className="h-6 w-6" />}
                linkTo="/unit-converter"
                color="bg-gradient-blue-cyan"
              />
              <DashboardCard 
                title="Code Converter"
                description="Convert MATLAB to Python and compile Python code"
                icon={<Code className="h-6 w-6" />}
                linkTo="/code-converter"
                color="bg-gradient-purple-pink"
              />
              <DashboardCard 
                title="About"
                description="Learn more about LOL Groups and ChemFlow"
                icon={<Info className="h-6 w-6" />}
                linkTo="/about"
                color="bg-gradient-yellow-orange"
              />
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
  isPrimary?: boolean;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  description, 
  icon, 
  linkTo, 
  color,
  isPrimary = false
}) => {
  return (
    <Link 
      to={linkTo}
      className={`block rounded-xl ${isPrimary ? 'border-2 border-indigo-100 dark:border-gray-700' : 'border border-gray-100 dark:border-gray-700'} bg-white dark:bg-gray-800 p-6 shadow-md hover:shadow-xl transition-all duration-300 colorful-shadow-hover`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${color} text-white`}>
          {icon}
        </div>
        {isPrimary && (
          <span className="bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
            Primary
          </span>
        )}
      </div>
      <h3 className="text-xl font-medium mb-2 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
    </Link>
  );
};

export default Dashboard;

