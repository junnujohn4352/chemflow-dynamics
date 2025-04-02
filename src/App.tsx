import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Simulations from "./pages/Simulations";
import CreateSimulation from "./pages/CreateSimulation";
import AISimulation from "./pages/AISimulation";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Analysis from "./pages/Analysis";
import Components from "./pages/Components";
import HysysCalculations from "./pages/HysysCalculations";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import About from "./pages/About";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

const saveSimulation = (simulationData: any) => {
  try {
    if (!simulationData || !simulationData.name) return;
    
    const simId = simulationData.id || `sim-${Date.now()}`;
    simulationData.id = simId;
    
    simulationData.lastUpdated = new Date().toISOString();
    
    const existingSimsStr = localStorage.getItem('chemflow-simulations') || '[]';
    const existingSims = JSON.parse(existingSimsStr);
    
    const simIndex = existingSims.findIndex((s: any) => s.id === simId);
    
    if (simIndex >= 0) {
      existingSims[simIndex] = simulationData;
    } else {
      existingSims.push(simulationData);
    }
    
    localStorage.setItem('chemflow-simulations', JSON.stringify(existingSims));
    console.log('Simulation saved', simulationData.name);
  } catch (error) {
    console.error('Error saving simulation:', error);
  }
};

function App() {
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      const activeSimulation = localStorage.getItem('chemflow-active-simulation');
      if (activeSimulation === 'true') {
        const simDataStr = localStorage.getItem('chemflow-simulation-data');
        if (simDataStr) {
          try {
            const simData = JSON.parse(simDataStr);
            if (simData && simData.name) {
              const fullSimData = {
                ...simData,
                description: simData.description || `${simData.name} process simulation`,
                efficiency: simData.efficiency || Math.floor(Math.random() * 30) + 70,
                components: Array.isArray(simData.components) 
                  ? simData.components.map((c: string) => ({
                      name: c,
                      percentage: Math.floor(Math.random() * 50) + 50
                    }))
                  : [],
                equipment: simData.equipment || 0,
                streams: simData.streams || 0,
              };
              
              saveSimulation(fullSimData);
            }
          } catch (e) {
            console.error("Error parsing simulation data:", e);
          }
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    const saveInterval = setInterval(handleBeforeUnload, 30000);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearInterval(saveInterval);
    };
  }, []);

  return (
    <div className="app">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/simulations" element={<Simulations />} />
              <Route path="/create-simulation" element={<CreateSimulation />} />
              <Route path="/ai-simulation" element={<AISimulation />} />
              <Route path="/analysis" element={<Analysis />} />
              <Route path="/components" element={<Components />} />
              <Route path="/hysys-calculations" element={<HysysCalculations />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  );
}

export default App;
