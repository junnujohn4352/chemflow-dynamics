
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

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

// Save simulation data to localStorage
const saveSimulation = (simulationData: any) => {
  try {
    if (!simulationData || !simulationData.name) return;
    
    // Generate a unique ID if not present
    const simId = simulationData.id || `sim-${Date.now()}`;
    simulationData.id = simId;
    
    // Update the lastUpdated timestamp
    simulationData.lastUpdated = new Date().toISOString();
    
    // Get existing simulations
    const existingSimsStr = localStorage.getItem('chemflow-simulations') || '[]';
    const existingSims = JSON.parse(existingSimsStr);
    
    // Check if this simulation already exists
    const simIndex = existingSims.findIndex((s: any) => s.id === simId);
    
    if (simIndex >= 0) {
      // Update existing simulation
      existingSims[simIndex] = simulationData;
    } else {
      // Add new simulation
      existingSims.push(simulationData);
    }
    
    // Save updated simulations
    localStorage.setItem('chemflow-simulations', JSON.stringify(existingSims));
    console.log('Simulation saved', simulationData.name);
  } catch (error) {
    console.error('Error saving simulation:', error);
  }
};

const App: React.FC = () => {
  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Set up a listener for saving simulation data on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      const activeSimulation = localStorage.getItem('chemflow-active-simulation');
      if (activeSimulation === 'true') {
        const simDataStr = localStorage.getItem('chemflow-simulation-data');
        if (simDataStr) {
          try {
            const simData = JSON.parse(simDataStr);
            if (simData && simData.name) {
              // Add some default values for a new simulation if not present
              const fullSimData = {
                ...simData,
                description: simData.description || `${simData.name} process simulation`,
                efficiency: simData.efficiency || Math.floor(Math.random() * 30) + 70, // Random 70-99%
                components: Array.isArray(simData.components) 
                  ? simData.components.map((c: string) => ({
                      name: c,
                      percentage: Math.floor(Math.random() * 50) + 50 // Random 50-99%
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

    // Add event listener for page unload
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Also save every 30 seconds
    const saveInterval = setInterval(handleBeforeUnload, 30000);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearInterval(saveInterval);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Landing page */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Main application routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/simulations" element={<Simulations />} />
            <Route path="/create-simulation" element={<CreateSimulation />} />
            <Route path="/ai-simulation" element={<AISimulation />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/settings" element={<Settings />} />
            
            {/* Legacy index page */}
            <Route path="/home" element={<Index />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
