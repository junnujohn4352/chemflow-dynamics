import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Beaker, 
  Calculator, 
  ArrowRight, 
  Maximize, 
  Minimize,
  Bot,
  FlaskConical
} from "lucide-react";
import ChemAssistant from "@/components/ai/ChemAssistant";

const Dashboard: React.FC = () => {
  const { toast } = useToast();
  const [showAssistant, setShowAssistant] = useState(false);
  const [assistantMinimized, setAssistantMinimized] = useState(false);

  const handleNavigateToCreateSimulation = () => {
    toast({
      title: "Opening simulation builder",
      description: "Redirecting to the simulation creation page..."
    });
  };

  const toggleAssistant = () => {
    setShowAssistant(!showAssistant);
    if (!showAssistant) {
      setAssistantMinimized(false);
    }
  };

  const toggleMinimizeAssistant = () => {
    setAssistantMinimized(!assistantMinimized);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-100">ChemFlow Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Your Chemical Engineering Companion</p>
          </div>
          <Button 
            variant="outline" 
            className="flex items-center space-x-2 border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400"
            onClick={toggleAssistant}
          >
            <Bot className="h-4 w-4" />
            <span>{showAssistant ? 'Close AI Assistant' : 'AI Assistant'}</span>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Process Simulation Card */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 shadow-md hover:shadow-lg transition-all duration-300 border-blue-100 dark:border-blue-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-blue-800 dark:text-blue-200 flex items-center">
                <FlaskConical className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                Process Simulation
              </CardTitle>
              <CardDescription>Build and run chemical process simulations like Aspen HYSYS</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Create flowsheets, simulate chemical processes, and analyze results with our powerful simulation engine.
              </p>
              <div className="flex justify-between">
                <Link to="/process-simulation">
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center"
                  >
                    Open Process Simulator
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          
          {/* Engineering Formulas Card */}
          <Card className="bg-gradient-to-br from-teal-50 to-green-50 dark:from-teal-900/30 dark:to-green-900/30 shadow-md hover:shadow-lg transition-all duration-300 border-teal-100 dark:border-teal-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-teal-800 dark:text-teal-200 flex items-center">
                <Calculator className="mr-2 h-5 w-5 text-teal-600 dark:text-teal-400" />
                Engineering Formulas
              </CardTitle>
              <CardDescription>Chemical engineering equations and calculators</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Access a comprehensive library of formulas, equations, and interactive calculators for chemical engineering.
              </p>
              <div className="flex justify-between">
                <Link to="/chemical-formulas">
                  <Button 
                    className="bg-teal-600 hover:bg-teal-700 text-white flex items-center"
                  >
                    Open Formula Library
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/engineering-formulas">
                  <Button variant="outline" className="border-teal-300 dark:border-teal-700">
                    View Calculators
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          
          {/* Unit Converter Card */}
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 shadow-md hover:shadow-lg transition-all duration-300 border-purple-100 dark:border-purple-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-purple-800 dark:text-purple-200 flex items-center">
                <Beaker className="mr-2 h-5 w-5 text-purple-600 dark:text-purple-400" />
                Unit Converter
              </CardTitle>
              <CardDescription>Convert between engineering units</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Easily convert between different units of measurement used in chemical engineering practice.
              </p>
              <div className="flex justify-between">
                <Link to="/unit-converter">
                  <Button 
                    className="bg-purple-600 hover:bg-purple-700 text-white flex items-center"
                  >
                    Open Unit Converter
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* AI Assistant Floating Widget */}
        {showAssistant && (
          <div 
            className={`fixed bottom-4 right-4 transition-all duration-300 z-50 ${
              assistantMinimized 
                ? 'w-72 h-14 rounded-full' 
                : 'w-96 h-[600px] max-h-[80vh] rounded-xl'
            }`}
          >
            {assistantMinimized ? (
              <div 
                className="h-full w-full bg-blue-600 text-white flex items-center justify-between px-4 py-2 rounded-full cursor-pointer shadow-lg"
                onClick={toggleMinimizeAssistant}
              >
                <div className="flex items-center">
                  <Bot className="h-5 w-5 mr-2" />
                  <span>ChemFlow AI Assistant</span>
                </div>
                <Maximize className="h-4 w-4" />
              </div>
            ) : (
              <div className="h-full w-full flex flex-col bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="absolute top-2 right-2 z-10 flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 w-7 p-0 rounded-full" 
                    onClick={toggleMinimizeAssistant}
                  >
                    <Minimize className="h-3.5 w-3.5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 w-7 p-0 rounded-full" 
                    onClick={toggleAssistant}
                  >
                    <span className="sr-only">Close</span>
                    <span aria-hidden="true">×</span>
                  </Button>
                </div>
                <div className="flex-grow overflow-hidden">
                  <ChemAssistant />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
