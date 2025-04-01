
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GlassPanel from "@/components/ui/GlassPanel";
import { 
  LayoutGrid, 
  FileText, 
  BarChart3, 
  Database,
  Brain,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-16 px-6 bg-gray-50">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold mb-2">Dashboard</h1>
            <p className="text-gray-600">Welcome to ChemFlow - Your Chemical Process Simulation Platform</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <DashboardCard 
              title="Simulations"
              description="Create and manage chemical process simulations"
              icon={<LayoutGrid className="h-6 w-6" />}
              linkTo="/simulations"
              color="bg-flow-blue"
            />
            <DashboardCard 
              title="Components"
              description="Browse and customize chemical components"
              icon={<Database className="h-6 w-6" />}
              linkTo="/components"
              color="bg-flow-cyan"
            />
            <DashboardCard 
              title="Analysis"
              description="Analyze and visualize simulation results"
              icon={<BarChart3 className="h-6 w-6" />}
              linkTo="/analysis"
              color="bg-flow-teal"
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
              title="App Settings"
              description="Configure application preferences and settings"
              icon={<LayoutGrid className="h-6 w-6" />}
              linkTo="/settings"
              color="bg-gray-500"
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassPanel className="p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Simulations</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((_, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white border border-gray-100 hover:border-flow-blue/30 transition-colors">
                    <div className="flex items-center">
                      <div className="p-2 rounded-lg bg-blue-50 text-flow-blue mr-3">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">Ethanol Production {index + 1}</h3>
                        <p className="text-sm text-gray-500">Last modified: {new Date().toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      Open <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </GlassPanel>
            
            <GlassPanel className="p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button className="justify-start h-auto py-3" variant="outline">
                  <FileText className="h-5 w-5 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">New Simulation</div>
                    <div className="text-xs text-gray-500">Create from scratch</div>
                  </div>
                </Button>
                <Button className="justify-start h-auto py-3" variant="outline">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">View Reports</div>
                    <div className="text-xs text-gray-500">Analyze simulation data</div>
                  </div>
                </Button>
                <Button className="justify-start h-auto py-3" variant="outline">
                  <Database className="h-5 w-5 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">Manage Components</div>
                    <div className="text-xs text-gray-500">Edit chemical library</div>
                  </div>
                </Button>
                <Button className="justify-start h-auto py-3" variant="outline">
                  <Brain className="h-5 w-5 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">AI Assistant</div>
                    <div className="text-xs text-gray-500">Get simulation help</div>
                  </div>
                </Button>
              </div>
            </GlassPanel>
          </div>
        </div>
      </main>
      
      <Footer />
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
      className="block rounded-xl bg-white border border-gray-100 p-6 hover:shadow-md transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${color} text-white`}>
          {icon}
        </div>
        {isNew && (
          <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
            NEW
          </span>
        )}
      </div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </Link>
  );
};

export default Dashboard;
