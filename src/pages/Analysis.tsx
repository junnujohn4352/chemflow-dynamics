
import React, { useState } from "react";
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
  Filter
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

const Analysis = () => {
  const [activeTab, setActiveTab] = useState("performance");
  const [timeRange, setTimeRange] = useState("month");
  
  // Mock data for charts
  const performanceData = [
    { name: "Jan", efficiency: 65, throughput: 1200, target: 70 },
    { name: "Feb", efficiency: 68, throughput: 1350, target: 70 },
    { name: "Mar", efficiency: 72, throughput: 1400, target: 70 },
    { name: "Apr", efficiency: 70, throughput: 1300, target: 70 },
    { name: "May", efficiency: 75, throughput: 1500, target: 70 },
    { name: "Jun", efficiency: 83, throughput: 1600, target: 75 },
    { name: "Jul", efficiency: 80, throughput: 1550, target: 75 },
    { name: "Aug", efficiency: 85, throughput: 1700, target: 80 },
    { name: "Sep", efficiency: 90, throughput: 1800, target: 80 },
    { name: "Oct", efficiency: 92, throughput: 1850, target: 85 },
    { name: "Nov", efficiency: 88, throughput: 1750, target: 85 },
    { name: "Dec", efficiency: 91, throughput: 1900, target: 85 },
  ];
  
  const componentData = [
    { name: "Ethanol", value: 78 },
    { name: "Water", value: 12 },
    { name: "Methanol", value: 5 },
    { name: "Other", value: 5 },
  ];
  
  const resourceData = [
    { name: "Electricity", current: 540, previous: 650 },
    { name: "Steam", current: 820, previous: 900 },
    { name: "Cooling Water", current: 1200, previous: 1350 },
    { name: "Process Water", current: 450, previous: 430 },
    { name: "Catalyst", current: 120, previous: 200 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD'];
  
  const renderPerformanceTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <GlassPanel className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Process Efficiency</h3>
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
              <Download className="h-4 w-4" />
            </button>
            <button className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
              <RefreshCw className="h-4 w-4" />
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
            <button className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
              <Download className="h-4 w-4" />
            </button>
            <button className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
              <RefreshCw className="h-4 w-4" />
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
              <span className="text-2xl font-semibold">85%</span>
              <span className="text-sm text-green-600">+12%</span>
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
              <span className="text-2xl font-semibold">1350 kWh</span>
              <span className="text-sm text-red-600">+3%</span>
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
              <span className="text-2xl font-semibold">92%</span>
              <span className="text-sm text-green-600">+5%</span>
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
              <span className="text-2xl font-semibold">215 kg CO₂e</span>
              <span className="text-sm text-green-600">-8%</span>
            </div>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
  
  const renderComponentTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <GlassPanel className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Product Composition</h3>
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
              <Download className="h-4 w-4" />
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
            <button className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
              <Download className="h-4 w-4" />
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-16 px-6 bg-gray-50">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold mb-2">Process Analysis</h1>
            <p className="text-gray-600">Visualize and analyze your process performance</p>
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
              
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200">
                <Filter className="h-3.5 w-3.5" />
                Filter
              </button>
              
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md bg-flow-blue text-white hover:bg-flow-blue/90">
                <Download className="h-3.5 w-3.5" />
                Export
              </button>
            </div>
          </div>
          
          {/* Content */}
          {activeTab === "performance" ? renderPerformanceTab() : renderComponentTab()}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Analysis;
