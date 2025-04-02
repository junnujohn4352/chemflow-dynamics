
import React, { useState, useEffect } from 'react';
import Navbar from "@/components/layout/Navbar";
import GlassPanel from "@/components/ui/GlassPanel";
import ProcessFlow from "@/components/ui/ProcessFlow";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { 
  ArrowLeft,
  Download,
  Table,
  LineChart as LineChartIcon,
  PlayCircle,
  Settings2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Analysis = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [simulationName, setSimulationName] = useState("Untitled Simulation");
  const [simulationSubject, setSimulationSubject] = useState("Chemical Process");
  const [components, setComponents] = useState<string[]>([]);
  const [analysisData, setAnalysisData] = useState<any[]>([]);
  const [showRawData, setShowRawData] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  
  useEffect(() => {
    // Load simulation data
    const savedSimData = localStorage.getItem('chemflow-simulation-data');
    if (savedSimData) {
      try {
        const simData = JSON.parse(savedSimData);
        if (simData.name) {
          setSimulationName(simData.name);
        }
        if (simData.components && Array.isArray(simData.components)) {
          setComponents(simData.components);
        }
        if (simData.subject) {
          setSimulationSubject(simData.subject);
        }
      } catch (e) {
        console.error("Error loading simulation data:", e);
      }
    }
    
    // Generate synthetic data for analysis
    generateAnalysisData();
  }, []);
  
  const generateAnalysisData = () => {
    // Generate synthetic data based on components
    const timePoints = Array.from({ length: 25 }, (_, i) => i);
    
    const data = timePoints.map(time => {
      // Create a base object with time
      const baseObj: { 
        time: number; 
        temperature?: number; 
        pressure?: number; 
        conversion?: number;
        [key: string]: number | undefined; 
      } = { time };
      
      // Add data for each component
      if (components.length > 0) {
        components.forEach(comp => {
          // Create some realistic looking component behavior
          if (comp === 'Ethanol') {
            baseObj[comp] = 100 - 100 * Math.exp(-0.05 * time);
          } else if (comp === 'Water') {
            baseObj[comp] = 100 - 100 * Math.exp(-0.02 * time);
          } else if (comp === 'Methanol') {
            baseObj[comp] = 85 - 85 * Math.exp(-0.07 * time);
          } else if (comp === 'Butanol') {
            baseObj[comp] = 75 - 75 * Math.exp(-0.03 * time);
          } else {
            baseObj[comp] = 80 - 80 * Math.exp(-0.04 * time);
          }
          
          // Add some randomness
          if (baseObj[comp] !== undefined) {
            baseObj[comp] = baseObj[comp]! * (0.9 + Math.random() * 0.2);
          }
        });
      } else {
        // Default components if none specified
        baseObj['Component A'] = 100 - 100 * Math.exp(-0.05 * time);
        baseObj['Component B'] = 85 - 85 * Math.exp(-0.03 * time);
      }
      
      // Add temperature, pressure, and conversion data
      baseObj.temperature = 300 + 50 * Math.sin(time / 5);
      baseObj.pressure = 100 - 10 * Math.cos(time / 3);
      baseObj.conversion = Math.min(0.98, 1 - Math.exp(-0.15 * time));
      
      return baseObj;
    });
    
    setAnalysisData(data);
  };
  
  const generateReport = () => {
    setIsGeneratingReport(true);
    
    toast({
      title: "Generating report",
      description: "Please wait while we analyze your simulation data..."
    });
    
    // Simulate a delay for report generation
    setTimeout(() => {
      setIsGeneratingReport(false);
      
      toast({
        title: "Report generated",
        description: "Your simulation analysis is ready for download"
      });
    }, 2500);
  };
  
  const downloadResults = () => {
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Get all possible headers (including dynamic component names)
    const firstRow = analysisData[0];
    const headers = Object.keys(firstRow);
    csvContent += headers.join(",") + "\r\n";
    
    // Add data rows
    analysisData.forEach(row => {
      const rowData = headers.map(header => {
        const value = row[header];
        // Ensure proper CSV formatting
        if (value === null || value === undefined) return '';
        if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`;
        return value;
      });
      csvContent += rowData.join(",") + "\r\n";
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${simulationName.replace(/\s+/g, '_')}_analysis.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download started",
      description: "Your simulation data is being downloaded"
    });
  };
  
  const toggleRawData = () => {
    setShowRawData(!showRawData);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-1 py-6 px-6">
        <div className="max-w-screen-xl mx-auto">
          {/* Header with navigation */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <button 
                onClick={() => navigate("/simulations")}
                className="mr-4 p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-display font-bold">{simulationName}</h1>
                <p className="text-gray-600 text-sm">{simulationSubject} Analysis</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={toggleRawData}
              >
                {showRawData ? (
                  <LineChartIcon className="mr-2 h-4 w-4" />
                ) : (
                  <Table className="mr-2 h-4 w-4" />
                )}
                {showRawData ? "Show Charts" : "Show Raw Data"}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={downloadResults}
              >
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={generateReport}
                disabled={isGeneratingReport}
              >
                {isGeneratingReport ? (
                  <>Generating...</>
                ) : (
                  <>
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Generate Report
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {/* Process Flow */}
          <div className="mb-8">
            <ProcessFlow />
          </div>
          
          {/* Analysis Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <GlassPanel className="p-6 bg-white dark:bg-gray-800 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Component Concentration</h2>
                <button className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                  <Settings2 className="h-4 w-4" />
                </button>
              </div>
              
              {showRawData ? (
                <div className="max-h-[400px] overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Time</th>
                        {components.length > 0 ? (
                          components.map(comp => (
                            <th key={comp} className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{comp}</th>
                          ))
                        ) : (
                          <>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Component A</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Component B</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {analysisData.filter((_, i) => i % 3 === 0).map((row, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-900/50' : ''}>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{row.time.toFixed(1)}</td>
                          {components.length > 0 ? (
                            components.map(comp => (
                              <td key={comp} className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {row[comp] !== undefined ? row[comp]!.toFixed(2) : 'N/A'}
                              </td>
                            ))
                          ) : (
                            <>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{row['Component A']?.toFixed(2) || 'N/A'}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{row['Component B']?.toFixed(2) || 'N/A'}</td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analysisData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" label={{ value: 'Time (min)', position: 'insideBottom', offset: -5 }} />
                    <YAxis label={{ value: 'Concentration (%)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    {components.length > 0 ? (
                      components.slice(0, 4).map((comp, index) => {
                        const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];
                        return (
                          <Area 
                            key={comp} 
                            type="monotone" 
                            dataKey={comp} 
                            stackId="1"
                            stroke={colors[index % colors.length]} 
                            fill={colors[index % colors.length]} 
                          />
                        );
                      })
                    ) : (
                      <>
                        <Area type="monotone" dataKey="Component A" stackId="1" stroke="#8884d8" fill="#8884d8" />
                        <Area type="monotone" dataKey="Component B" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                      </>
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </GlassPanel>
            
            <GlassPanel className="p-6 bg-white dark:bg-gray-800 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Operating Parameters</h2>
                <button className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                  <Settings2 className="h-4 w-4" />
                </button>
              </div>
              
              {showRawData ? (
                <div className="max-h-[400px] overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Time</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Temperature (K)</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Pressure (kPa)</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Conversion</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {analysisData.filter((_, i) => i % 3 === 0).map((row, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-900/50' : ''}>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{row.time.toFixed(1)}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{row.temperature?.toFixed(1) || 'N/A'}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{row.pressure?.toFixed(1) || 'N/A'}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{row.conversion ? (row.conversion * 100).toFixed(1) + '%' : 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analysisData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" label={{ value: 'Time (min)', position: 'insideBottom', offset: -5 }} />
                    <YAxis yAxisId="left" label={{ value: 'Temperature (K)', angle: -90, position: 'insideLeft' }} />
                    <YAxis yAxisId="right" orientation="right" label={{ value: 'Pressure (kPa)', angle: 90, position: 'insideRight' }} />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#ff7300" name="Temperature" />
                    <Line yAxisId="right" type="monotone" dataKey="pressure" stroke="#387908" name="Pressure" />
                    <Line yAxisId="right" type="monotone" dataKey={(datum) => datum.conversion ? datum.conversion * 100 : 0} stroke="#8884d8" name="Conversion (%)" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </GlassPanel>
          </div>
          
          {/* Additional Analysis for the specific type */}
          <GlassPanel className="p-6 mb-6 bg-white dark:bg-gray-800 dark:border-gray-700">
            <h2 className="text-lg font-medium mb-4">{simulationSubject} Specific Analysis</h2>
            <p className="text-gray-600 mb-4">
              Analysis results specific to {simulationSubject} process simulations.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <h3 className="text-md font-medium mb-3">Key Process Indicators</h3>
                <div className="space-y-2">
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Overall Conversion</span>
                      <span className="text-sm font-medium">78.5%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                      <div className="h-2 rounded-full bg-flow-blue" style={{ width: '78.5%' }}></div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Yield Efficiency</span>
                      <span className="text-sm font-medium">92.3%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                      <div className="h-2 rounded-full bg-flow-cyan" style={{ width: '92.3%' }}></div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Energy Efficiency</span>
                      <span className="text-sm font-medium">67.8%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                      <div className="h-2 rounded-full bg-flow-teal" style={{ width: '67.8%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium mb-3">Process Recommendations</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="font-medium text-gray-800 dark:text-gray-200 block mb-1">Optimize Temperature Profile</span>
                    <span>Increasing temperature by 15K in the second stage could improve conversion by up to 12%.</span>
                  </li>
                  <li className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="font-medium text-gray-800 dark:text-gray-200 block mb-1">Residence Time Analysis</span>
                    <span>Current residence time is 35% below optimal. Consider increasing reactor volume.</span>
                  </li>
                  <li className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="font-medium text-gray-800 dark:text-gray-200 block mb-1">Feed Composition</span>
                    <span>Adjusting feed ratio of components could increase product purity by 8-10%.</span>
                  </li>
                </ul>
              </div>
            </div>
          </GlassPanel>
        </div>
      </main>
    </div>
  );
};

export default Analysis;
