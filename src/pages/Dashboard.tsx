
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import GlassPanel from "@/components/ui/GlassPanel";
import { 
  LayoutGrid, 
  FileText, 
  BarChart3, 
  Database,
  Brain,
  ArrowRight,
  Info,
  Calculator,
  Code
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
            {/* Dashboard Cards */}
            <DashboardCard 
              title="Simulations"
              description="Create and manage chemical process simulations"
              icon={<LayoutGrid className="h-6 w-6" />}
              linkTo="/simulations"
              color="bg-flow-blue"
            />
            <DashboardCard 
              title="Create Simulation"
              description="Start building a new chemical process simulation"
              icon={<FileText className="h-6 w-6" />}
              linkTo="/create-simulation"
              color="bg-purple-500"
            />
            <DashboardCard 
              title="AI Assistant"
              description="Get AI-powered simulation assistance and problem-solving"
              icon={<Brain className="h-6 w-6" />}
              linkTo="/ai-simulation"
              color="bg-amber-500"
              isNew={true}
            />
            <DashboardCard 
              title="Process Analysis"
              description="Analyze your simulation results with powerful tools"
              icon={<BarChart3 className="h-6 w-6" />}
              linkTo="/analysis"
              color="bg-green-500"
            />
            <DashboardCard 
              title="Component Library"
              description="Browse and manage chemical components"
              icon={<Database className="h-6 w-6" />}
              linkTo="/components"
              color="bg-red-500"
            />
            <DashboardCard 
              title="HYSYS Calculations"
              description="Access comprehensive Aspen HYSYS calculations library"
              icon={<Calculator className="h-6 w-6" />}
              linkTo="/hysys-calculations"
              color="bg-indigo-500"
              isNew={true}
            />
            <DashboardCard 
              title="Code Converter"
              description="Convert MATLAB to Python and compile Python code"
              icon={<Code className="h-6 w-6" />}
              linkTo="/code-converter"
              color="bg-teal-500"
              isNew={true}
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
  isNew = false 
}) => {
  return (
    <Link 
      to={linkTo}
      className="block rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${color} text-white`}>
          {icon}
        </div>
        {isNew && (
          <span className="px-2 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200 text-xs font-medium rounded-full">
            NEW
          </span>
        )}
      </div>
      <h3 className="text-xl font-medium mb-2 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
    </Link>
  );
};

export default Dashboard;
