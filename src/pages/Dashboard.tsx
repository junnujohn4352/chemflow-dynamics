
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { 
  FileText, 
  Calculator,
  Code,
  FlaskConical,
  Info,
  Book
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
          <div className="mb-12 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-display font-bold mb-4 text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-flow-blue via-flow-cyan to-flow-teal">
                ChemFlow Dashboard
              </h1>
              <p className="text-xl text-gray-600">
                Your Process Simulation Platform
              </p>
            </div>
            <Button 
              variant="outline" 
              className="flex gap-2 items-center hover:bg-flow-blue/10 transition-colors"
              onClick={() => setIsLearnMoreOpen(true)}
            >
              <Info className="h-5 w-5 text-flow-blue" />
              Learn More
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardCards.map((card) => (
              <DashboardCard 
                key={card.title}
                {...card}
              />
            ))}
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

const dashboardCards = [
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
  },
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
    title: "About",
    description: "Learn more about ChemFlow and our vision",
    icon: <Info className="h-6 w-6" />,
    linkTo: "/about",
    color: "bg-gray-500 text-white",
  }
];

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
      className="block rounded-xl bg-white border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 relative group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${color} bg-opacity-90 group-hover:scale-105 transition-transform`}>
          {icon}
        </div>
        {isNew && (
          <span className="absolute top-4 right-4 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            New
          </span>
        )}
      </div>
      <h3 className="text-xl font-medium mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </Link>
  );
};

export default Dashboard;

