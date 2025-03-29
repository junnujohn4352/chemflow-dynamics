
import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GlassPanel from "@/components/ui/GlassPanel";
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  Download, 
  RefreshCw, 
  ChevronDown,
  Calendar,
  Filter,
  AlertTriangle
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart as RePieChart,
  Pie,
  Cell
} from "recharts";
import { useToast } from "@/hooks/use-toast";

const Analysis = () => {
  const [activeTab, setActiveTab] = useState("performance");
  const [timeRange, setTimeRange] = useState("month");
  const [isLoading, setIsLoading] = useState(true);
  const [hasSimulationData, setHasSimulationData] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const { toast } = useToast();
  
  // Real-time data states
  const [performanceData, setPerformanceData] = useState([]);
  const [componentData, setComponentData] = useState([]);
  const [resourceData, setResourceData] = useState([]);

  useEffect(() => {
    // Check if there are any active simulations
    checkForSimulationData();
    
    // Initial data load
    fetchAnalysisData();
    
    // Set up interval for real-time updates
    const intervalId = setInterval(() => {
      fetchAnalysisData();
    }, 10000); // Update every 10 seconds
    
    return () => clearInterval(intervalId);
  }, [timeRange]);
  
  const checkForSimulationData = () => {
    // In a real app, we would check if user has any simulations
    // For demo purpose, we'll simulate this check
    const simulationExists = localStorage.getItem("activeSimulation");
    setHasSimulationData(!!simulationExists);
  };
  
  const fetchAnalysisData = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      if (!hasSimulationData) {
        setIsLoading(false);
        return;
      }
      
      // Generate random data based on time range to simulate real-time updates
      generateRandomData();
      setLastUpdated(new Date());
      setIsLoading(false);
    }, 1000);
  };
  
  const generateRandomData = () => {
    // Generate dynamic performance data
    const newPerformanceData = [];
    const periods = timeRange === 'day' ? 24 : 
                    timeRange === 'week' ? 7 : 
                    timeRange === 'month' ? 12 : 4;
    
    const periodLabels = timeRange === 'day' ? Array.from({length: 24}, (_, i) => `${i}:00`) : 
                          timeRange === 'week' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] : 
                          timeRange === 'month' ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] : 
                          ['Q1', 'Q2', 'Q3', 'Q4'];
    
    // Base values that will be modulated for "real-time" feel
    const baseEfficiency = 75;
    const baseThroughput = 1500;
    const baseTarget = 80;
    
    for (let i = 0; i < periods; i++) {
      // Add some randomness to simulate real-time changes
      const variance = Math.random() * 15 - 7.5; // -7.5 to +7.5
      const throughputVariance = Math.random() * 300 - 150; // -150 to +150
      
      newPerformanceData.push({
        name: periodLabels[i % periodLabels.length],
        efficiency: Math.max(50, Math.min(98, baseEfficiency + variance)),
        throughput: Math.max(1000, Math.min(2000, baseThroughput + throughputVariance)),
        target: baseTarget + (i % 3 === 0 ? 5 : 0) // Occasional target adjustments
      });
    }
    setPerformanceData(newPerformanceData);
    
    // Generate component composition data
    setComponentData([
      { name: "Ethanol", value: 65 + Math.random() * 20 },
      { name: "Water", value: 15 + Math.random() * 10 },
      { name: "Methanol", value: 5 + Math.random() * 5 },
      { name: "Other", value: 2 + Math.random() * 3 },
    ]);
    
    // Generate resource consumption data
    setResourceData([
      { name: "Electricity", current: 500 + Math.random() * 100, previous: 650 },
      { name: "Steam", current: 800 + Math.random() * 100, previous: 900 },
      { name: "Cooling Water", current: 1150 + Math.random() * 100, previous: 1350 },
      { name: "Process Water", current: 430 + Math.random() * 50, previous: 430 },
      { name: "Catalyst", current: 100 + Math.random() * 50, previous: 200 },
    ]);
  };
  
  const refreshData = () => {
    toast({
      title: "Refreshing analysis data",
      description: "Fetching the latest simulation results",
    });
    fetchAnalysisData();
  };
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD'];
  
  const renderPerformanceTab = () => {
    if (!hasSimulationData) {
      return renderNoDataState();
    }
    
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassPanel className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Process Efficiency</h3>
            <div className="flex items-center gap-2">
              <button 
                className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => {
                  toast({
                    title: "Downloading data",
                    description: "Process efficiency data downloaded successfully",
                  });
                }}
              >
                <Download className="h-4 w-4" />
              </button>
              <button 
                className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={refreshData}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={performanceData}
                margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="efficiency" stroke="#3B82F6" fill="#93C5FD" fillOpacity={0.6} />
                <Area type="monotone" dataKey="target" stroke="#EF4444" fill="#FCA5A5" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>
        
        <GlassPanel className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Throughput Analysis</h3>
            <div className="flex items-center gap-2">
              <button 
                className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => {
                  toast({
                    title: "Downloading data",
                    description: "Throughput analysis data downloaded successfully",
                  });
                }}
              >
                <Download className="h-4 w-4" />
              </button>
              <button 
                className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={refreshData}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={performanceData}
                margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="throughput" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>
        
        <GlassPanel className="p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Key Performance Indicators</h3>
            <div className="text-xs text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm text-gray-500">Average Efficiency</h4>
                <div className="p-1.5 rounded-full bg-green-50 text-green-600">
                  <LineChart className="h-4 w-4" />
                </div>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-semibold">
                  {performanceData.length ? 
                    Math.round(performanceData.reduce((sum, item) => sum + item.efficiency, 0) / performanceData.length) : 0}%
                  </span>
                <span className="text-sm text-green-600">+{Math.floor(Math.random() * 15)}%</span>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm text-gray-500">Energy Consumption</h4>
                <div className="p-1.5 rounded-full bg-amber-50 text-amber-600">
                  <BarChart3 className="h-4 w-4" />
                </div>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-semibold">{1200 + Math.floor(Math.random() * 300)} kWh</span>
                <span className="text-sm text-red-600">+{Math.floor(Math.random() * 7)}%</span>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm text-gray-500">Yield</h4>
                <div className="p-1.5 rounded-full bg-blue-50 text-flow-blue">
                  <PieChart className="h-4 w-4" />
                </div>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-semibold">{85 + Math.floor(Math.random() * 10)}%</span>
                <span className="text-sm text-green-600">+{Math.floor(Math.random() * 8)}%</span>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm text-gray-500">Emissions</h4>
                <div className="p-1.5 rounded-full bg-indigo-50 text-indigo-600">
                  <BarChart3 className="h-4 w-4" />
                </div>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-semibold">{190 + Math.floor(Math.random() * 50)} kg CO₂e</span>
                <span className="text-sm text-green-600">-{Math.floor(Math.random() * 12)}%</span>
              </div>
            </div>
          </div>
        </GlassPanel>
      </div>
    );
  };
  
  const renderComponentTab = () => {
    if (!hasSimulationData) {
      return renderNoDataState();
    }
    
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassPanel className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Product Composition</h3>
            <div className="flex items-center gap-2">
              <button 
                className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => {
                  toast({
                    title: "Downloading data",
                    description: "Product composition data downloaded successfully",
                  });
                }}
              >
                <Download className="h-4 w-4" />
              </button>
              <button 
                className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={refreshData}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={componentData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {componentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>
        
        <GlassPanel className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Resource Consumption</h3>
            <div className="flex items-center gap-2">
              <button 
                className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => {
                  toast({
                    title: "Downloading data",
                    description: "Resource consumption data downloaded successfully",
                  });
                }}
              >
                <Download className="h-4 w-4" />
              </button>
              <button 
                className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={refreshData}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={resourceData}
                margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Legend />
                <Bar dataKey="current" name="Current" fill="#3B82F6" />
                <Bar dataKey="previous" name="Previous" fill="#93C5FD" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>
      </div>
    );
  };
  
  const renderNoDataState = () => (
    <GlassPanel className="p-8">
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-amber-50 p-4 rounded-full mb-6">
          <AlertTriangle className="h-10 w-10 text-amber-500" />
        </div>
        <h3 className="text-xl font-medium mb-2">No Simulation Data Available</h3>
        <p className="text-gray-500 max-w-md mb-6">
          You don't have any active simulations to analyze. Create a new simulation first to see real-time analysis.
        </p>
        <a 
          href="/create-simulation" 
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md bg-flow-blue text-white hover:bg-flow-blue/90"
        >
          Create New Simulation
        </a>
      </div>
    </GlassPanel>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-16 px-6 bg-gray-50">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold mb-2">Process Analysis</h1>
            <p className="text-gray-600">Real-time visualization and analysis of your active simulations</p>
          </div>
          
          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
              <button 
                onClick={() => setActiveTab("performance")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium ${
                  activeTab === "performance" 
                    ? "bg-white text-flow-blue shadow-sm" 
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                Performance
              </button>
              <button 
                onClick={() => setActiveTab("components")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium ${
                  activeTab === "components" 
                    ? "bg-white text-flow-blue shadow-sm" 
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                Components
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <select 
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="bg-transparent appearance-none pr-6 py-1 focus:outline-none cursor-pointer"
                >
                  <option value="day">Daily</option>
                  <option value="week">Weekly</option>
                  <option value="month">Monthly</option>
                  <option value="year">Yearly</option>
                </select>
                <ChevronDown className="h-3 w-3 -ml-5 pointer-events-none" />
              </div>
              
              <button 
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200"
                onClick={() => {
                  toast({
                    title: "Filter applied",
                    description: "Analysis data has been filtered",
                  });
                }}
              >
                <Filter className="h-3.5 w-3.5" />
                Filter
              </button>
              
              <button 
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md bg-flow-blue text-white hover:bg-flow-blue/90"
                onClick={() => {
                  toast({
                    title: "Data exported",
                    description: "Analysis data has been exported successfully",
                  });
                }}
              >
                <Download className="h-3.5 w-3.5" />
                Export
              </button>
            </div>
          </div>
          
          {/* Content */}
          {activeTab === "performance" ? renderPerformanceTab() : renderComponentTab()}
          
          {/* Real-time indicator */}
          {hasSimulationData && (
            <div className="mt-6 flex justify-end items-center gap-2 text-xs text-gray-500">
              <div className={`h-2 w-2 rounded-full ${isLoading ? 'bg-amber-500' : 'bg-green-500'} animate-pulse`}></div>
              <span>{isLoading ? 'Fetching data...' : 'Real-time updates active'}</span>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Analysis;
