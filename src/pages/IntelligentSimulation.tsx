
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Check, AlertCircle, Beaker, Thermometer, Droplets, Layers, FlaskConical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SimulationBuilder } from "@/components/simulation/SimulationBuilder";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HysysIntegration from "@/components/simulation/HysysIntegration";

const IntelligentSimulation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeView, setActiveView] = useState<'builder' | 'hysys'>('builder');
  const [selectedComponents, setSelectedComponents] = useState<string[]>(["Methanol", "Ethanol", "Water"]);
  const [thermodynamicModel, setThermodynamicModel] = useState<string>("Peng-Robinson");
  
  const handleStartAISimulation = () => {
    toast({
      title: "AI Simulation Started",
      description: "Your intelligent simulation is now being processed"
    });
  };

  const handleAddComponent = (component: string) => {
    if (!selectedComponents.includes(component)) {
      setSelectedComponents([...selectedComponents, component]);
      
      toast({
        title: "Component Added",
        description: `${component} has been added to your simulation.`
      });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-indigo-100">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 relative">
        {/* Enhanced Background Animations */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-blue-200 opacity-20 animate-float" style={{ animationDuration: '7s' }}></div>
          <div className="absolute top-60 right-20 w-40 h-40 rounded-full bg-blue-300 opacity-30 animate-float" style={{ animationDuration: '11s' }}></div>
          <div className="absolute bottom-10 left-1/3 w-52 h-52 rounded-full bg-indigo-200 opacity-20 animate-float" style={{ animationDuration: '9s' }}></div>
          <div className="absolute bottom-40 right-1/4 w-36 h-36 rounded-full bg-blue-400 opacity-10 animate-pulse" style={{ animationDuration: '13s' }}></div>
          <div className="absolute top-1/3 left-1/4 w-24 h-24 rounded-full bg-indigo-300 opacity-15 animate-bounce" style={{ animationDuration: '15s' }}></div>
        </div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent relative z-10 animate-pulse" style={{ animationDuration: '3s' }}>
            Process Simulation Environment
          </h1>
          
          <p className="text-blue-700 max-w-3xl mb-6">
            Design, analyze, and optimize chemical processes using our comprehensive simulation tools. 
            Choose between our guided Process Builder or advanced HYSYS-like interface.
          </p>
          
          <div className="mb-6">
            <Tabs defaultValue="builder" onValueChange={(value) => setActiveView(value as 'builder' | 'hysys')} className="w-full">
              <TabsList className="grid grid-cols-2 w-full max-w-md mb-4">
                <TabsTrigger value="builder" className="flex items-center gap-2">
                  <Beaker className="h-4 w-4" />
                  Process Builder
                </TabsTrigger>
                <TabsTrigger value="hysys" className="flex items-center gap-2">
                  <FlaskConical className="h-4 w-4" />
                  Advanced Simulation
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

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
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 relative z-10">
            {/* Equipment Categories Card */}
            <Card className="border-blue-200 shadow-lg hover:shadow-blue-300 transition-all transform hover:scale-[1.02] bg-gradient-to-br from-white to-blue-50">
              <CardHeader className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Layers className="h-5 w-5 text-blue-500" />
                  Equipment Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: "Reactors", icon: <FlaskConical className="h-4 w-4" />, color: "bg-green-100 text-green-700 border-green-200" },
                    { name: "Columns", icon: <Layers className="h-4 w-4" />, color: "bg-blue-100 text-blue-700 border-blue-200" },
                    { name: "Heat Exchangers", icon: <Thermometer className="h-4 w-4" />, color: "bg-red-100 text-red-700 border-red-200" },
                    { name: "Separators", icon: <Droplets className="h-4 w-4" />, color: "bg-purple-100 text-purple-700 border-purple-200" },
                    { name: "Flow Control", icon: <ArrowRight className="h-4 w-4" />, color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
                    { name: "Vessels", icon: <Beaker className="h-4 w-4" />, color: "bg-amber-100 text-amber-700 border-amber-200" },
                    { name: "Mass Transfer", icon: <Droplets className="h-4 w-4" />, color: "bg-teal-100 text-teal-700 border-teal-200" },
                    { name: "Solids", icon: <Layers className="h-4 w-4" />, color: "bg-orange-100 text-orange-700 border-orange-200" },
                    { name: "Utilities", icon: <Thermometer className="h-4 w-4" />, color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
                    { name: "Other", icon: <Beaker className="h-4 w-4" />, color: "bg-gray-100 text-gray-700 border-gray-200" }
                  ].map((category, idx) => (
                    <div 
                      key={idx}
                      className={`${category.color} border rounded-md px-3 py-2 flex items-center gap-2 cursor-pointer hover:shadow-md transition-shadow animate-fade-in`}
                      style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                      {category.icon}
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Components Card */}
            <Card className="border-blue-200 shadow-lg hover:shadow-blue-300 transition-all transform hover:scale-[1.02] bg-gradient-to-br from-white to-blue-50">
              <CardHeader className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Droplets className="h-5 w-5 text-blue-500" />
                  Available Components
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Methanol", "Ethanol", "Water", "Carbon Dioxide", 
                    "Nitrogen", "Oxygen", "Hydrogen", "Propane", 
                    "Butane", "Benzene", "Toluene", "Xylene"
                  ].map((component, idx) => (
                    <Button 
                      key={idx} 
                      variant="outline" 
                      className={`py-1 h-auto text-sm justify-start ${selectedComponents.includes(component) ? 'bg-blue-100 border-blue-300' : 'hover:bg-blue-50'}`}
                      onClick={() => handleAddComponent(component)}
                    >
                      {selectedComponents.includes(component) && <Check className="h-3 w-3 mr-1 text-blue-600" />}
                      {component}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Thermodynamic Models Card */}
            <Card className="border-blue-200 shadow-lg hover:shadow-blue-300 transition-all transform hover:scale-[1.02] bg-gradient-to-br from-white to-blue-50">
              <CardHeader className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Thermometer className="h-5 w-5 text-blue-500" />
                  Thermodynamic Models
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 gap-2">
                  {[
                    "Peng-Robinson", "Soave-Redlich-Kwong", 
                    "NRTL", "UNIQUAC", "Wilson", 
                    "Ideal", "Chao-Seader", "UNIFAC"
                  ].map((model, idx) => (
                    <Button 
                      key={idx} 
                      variant="outline" 
                      className={`py-1 h-auto text-sm justify-start ${model === thermodynamicModel ? 'bg-blue-100 border-blue-300' : 'hover:bg-blue-50'}`}
                      onClick={() => setThermodynamicModel(model)}
                    >
                      {model === thermodynamicModel && <Check className="h-3 w-3 mr-1 text-blue-600" />}
                      {model}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mb-8 relative z-10">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">Process Simulation Environment</h2>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-blue-200 shadow-lg hover:shadow-blue-200 transition-shadow">
              {activeView === 'builder' ? (
                <SimulationBuilder 
                  selectedComponents={selectedComponents}
                  thermodynamicModel={thermodynamicModel}
                />
              ) : (
                <HysysIntegration 
                  selectedComponents={selectedComponents}
                  thermodynamicModel={thermodynamicModel}
                />
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />

      {/* Floating Help Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          className="rounded-full w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-blue-300/50 transition-all duration-300 flex items-center justify-center"
          onClick={() => toast({
            title: "Help Available",
            description: "Click on any equipment to explore its properties and settings.",
          })}
        >
          <AlertCircle className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default IntelligentSimulation;
