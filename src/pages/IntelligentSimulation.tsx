
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Check, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SimulationBuilder } from "@/components/simulation/SimulationBuilder";

const IntelligentSimulation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleStartAISimulation = () => {
    toast({
      title: "AI Simulation Started",
      description: "Your intelligent simulation is now being processed"
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-indigo-100">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 relative">
        {/* Background Animations */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-blue-200 opacity-20 animate-float" style={{ animationDuration: '7s' }}></div>
          <div className="absolute top-60 right-20 w-40 h-40 rounded-full bg-blue-300 opacity-30 animate-float" style={{ animationDuration: '11s' }}></div>
          <div className="absolute bottom-10 left-1/3 w-52 h-52 rounded-full bg-indigo-200 opacity-20 animate-float" style={{ animationDuration: '9s' }}></div>
        </div>
        
        <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent relative z-10 animate-pulse" style={{ animationDuration: '3s' }}>
          Intelligent Simulation
        </h1>
        
        <Card className="mb-8 relative z-10 border-blue-200 shadow-lg hover:shadow-blue-200 transition-shadow">
          <CardHeader className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Sparkles className="h-5 w-5 text-blue-500 animate-pulse" />
              AI-Powered Process Design
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="mb-4 text-blue-700">
              Use our advanced AI to automatically generate optimal process flowsheets based on your objectives and constraints.
            </p>
            <Button onClick={handleStartAISimulation} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-md transform hover:scale-105 transition-all duration-300">
              Start AI Simulation
              <ArrowRight className="h-4 w-4 ml-2 animate-bounce" />
            </Button>
          </CardContent>
        </Card>
        
        <div className="mb-8 relative z-10">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">Manual Configuration</h2>
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-blue-200 shadow-lg hover:shadow-blue-200 transition-shadow">
            <SimulationBuilder 
              selectedComponents={["Methanol", "Ethanol", "Water"]}
              thermodynamicModel="Peng-Robinson"
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default IntelligentSimulation;
