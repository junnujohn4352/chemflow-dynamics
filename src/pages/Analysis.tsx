
import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GlassPanel from "@/components/ui/GlassPanel";
import ProcessFlow from "@/components/ui/ProcessFlow";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnalysisData {
  timestamp: string;
  temperature: number;
  pressure: number;
  flow: number;
  composition: {
    componentA: number;
    componentB: number;
  };
}

const Analysis = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [activeSimulation, setActiveSimulation] = useState<boolean>(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData[]>([]);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check if we have a saved simulation
    const equipment = localStorage.getItem('chemflow-equipment');
    const streams = localStorage.getItem('chemflow-streams');
    
    if (equipment && streams) {
      setActiveSimulation(true);
      refreshData();
      
      // Set up periodic refresh
      const interval = setInterval(() => {
        refreshData();
      }, 10000); // Refresh every 10 seconds
      
      setRefreshInterval(interval);
    } else {
      setLoading(false);
    }
    
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, []);

  const refreshData = () => {
    setLoading(true);
    
    // Generate real-time simulation data based on the current time
    const now = new Date();
    const newData: AnalysisData[] = [];
    
    // Generate data for the last 24 hours with 1-hour intervals
    for (let i = 24; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
      
      // Add some randomness to create realistic-looking data
      const noise = Math.sin(i * 0.5) + Math.random() * 0.5;
      const temperatureBase = 75 + noise * 5; // Base temperature with fluctuation
      
      newData.push({
        timestamp: timestamp.toISOString(),
        temperature: Math.round(temperatureBase * 10) / 10,
        pressure: Math.round((150 + noise * 10) * 10) / 10,
        flow: Math.round((120 + noise * 15) * 10) / 10,
        composition: {
          componentA: Math.round((78 + noise * 3) * 10) / 10,
          componentB: Math.round((22 - noise * 3) * 10) / 10,
        }
      });
    }
    
    setAnalysisData(newData);
    setLoading(false);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const downloadData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(analysisData));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "chemflow-analysis.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    toast({
      title: "Data exported",
      description: "The analysis data has been downloaded as JSON"
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-6 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-display font-bold mb-2">Process Analysis</h1>
              <p className="text-gray-600">Monitor real-time process data and performance metrics</p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={refreshData}
                disabled={loading || !activeSimulation}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                variant="outline" 
                onClick={downloadData}
                disabled={loading || !activeSimulation || analysisData.length === 0}
              >
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </div>
          </div>
          
          {!activeSimulation ? (
            <GlassPanel className="p-12 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-amber-50 text-amber-600">
                  <AlertCircle className="h-8 w-8" />
                </div>
              </div>
              <h3 className="text-xl font-medium mb-2">No Active Simulation</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Create and run a simulation from the Simulations page to see real-time analysis data here.
              </p>
              <Button onClick={() => window.location.href = '/create-simulation'}>
                Create Simulation
              </Button>
            </GlassPanel>
          ) : (
            <>
              <ProcessFlow className="mb-8" />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <GlassPanel className="p-6">
                  <h2 className="text-xl font-medium mb-4">Temperature Profile</h2>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={analysisData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timestamp" tickFormatter={formatTime} />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value}°C`, 'Temperature']} />
                        <Legend />
                        <Line type="monotone" dataKey="temperature" stroke="#3B82F6" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </GlassPanel>
                
                <GlassPanel className="p-6">
                  <h2 className="text-xl font-medium mb-4">Pressure Trend</h2>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={analysisData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timestamp" tickFormatter={formatTime} />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value} kPa`, 'Pressure']} />
                        <Legend />
                        <Line type="monotone" dataKey="pressure" stroke="#22D3EE" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </GlassPanel>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GlassPanel className="p-6">
                  <h2 className="text-xl font-medium mb-4">Flow Rate Analysis</h2>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={analysisData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timestamp" tickFormatter={formatTime} />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value} kg/h`, 'Flow Rate']} />
                        <Legend />
                        <Line type="monotone" dataKey="flow" stroke="#2DD4BF" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </GlassPanel>
                
                <GlassPanel className="p-6">
                  <h2 className="text-xl font-medium mb-4">Component Composition</h2>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={analysisData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timestamp" tickFormatter={formatTime} />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value}%`, 'Concentration']} />
                        <Legend />
                        <Line type="monotone" dataKey="composition.componentA" name="Component A" stroke="#8884d8" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="composition.componentB" name="Component B" stroke="#82ca9d" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </GlassPanel>
              </div>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Analysis;
