
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Intelligent Simulation</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              AI-Powered Process Design
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Use our advanced AI to automatically generate optimal process flowsheets based on your objectives and constraints.
            </p>
            <Button onClick={handleStartAISimulation} className="bg-purple-600 hover:bg-purple-700">
              Start AI Simulation
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Manual Configuration</h2>
          <SimulationBuilder 
            selectedComponents={["Methanol", "Ethanol", "Water"]}
            thermodynamicModel="Peng-Robinson"
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default IntelligentSimulation;
