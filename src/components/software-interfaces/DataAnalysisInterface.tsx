
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BarChart, LineChart, PieChart, Upload, Play, Save, Download } from "lucide-react";

interface DataAnalysisInterfaceProps {
  software: {
    name: string;
    description: string;
    category: string;
  };
}

const DataAnalysisInterface: React.FC<DataAnalysisInterfaceProps> = ({ software }) => {
  const [dataAnalyzed, setDataAnalyzed] = useState(false);
  const [activeTab, setActiveTab] = useState("input");
  
  const handleAnalyzeData = () => {
    setDataAnalyzed(true);
    setActiveTab("visualization");
  };

  return (
    <div className="space-y-6 mt-4">
      <Tabs defaultValue="input" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="input">Data Input</TabsTrigger>
          <TabsTrigger value="processing">Data Processing</TabsTrigger>
          <TabsTrigger value="visualization">Visualization</TabsTrigger>
          <TabsTrigger value="statistics">Statistical Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="input" className="p-4 border rounded-md mt-4">
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="font-medium">Import Data</h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md p-6 flex flex-col items-center justify-center">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Drag and drop a file or click to upload</p>
                  <Button variant="outline" size="sm">Browse Files</Button>
                  <p className="text-xs text-gray-400 mt-2">Supports CSV, XLS, XLSX files</p>
                </div>
                
                <div>
                  <Label htmlFor="data-type">Data Type</Label>
                  <Select defaultValue="experimental">
                    <SelectTrigger id="data-type">
                      <SelectValue placeholder="Select data type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="experimental">Experimental Data</SelectItem>
                      <SelectItem value="simulation">Simulation Results</SelectItem>
                      <SelectItem value="process">Process Data</SelectItem>
                      <SelectItem value="literature">Literature Data</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="mt-4">
                    <Label htmlFor="delimiter">Delimiter (if CSV)</Label>
                    <Select defaultValue="comma">
                      <SelectTrigger id="delimiter">
                        <SelectValue placeholder="Select delimiter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="comma">Comma (,)</SelectItem>
                        <SelectItem value="semicolon">Semicolon (;)</SelectItem>
                        <SelectItem value="tab">Tab</SelectItem>
                        <SelectItem value="space">Space</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="mt-4">
                    <Label htmlFor="header">Headers</Label>
                    <Select defaultValue="first-row">
                      <SelectTrigger id="header">
                        <SelectValue placeholder="Headers in file?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="first-row">First row contains headers</SelectItem>
                        <SelectItem value="no-header">No headers (generate automatically)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-medium">Manual Data Entry</h3>
              
              <Textarea 
                placeholder="Enter data manually (comma separated or tab delimited rows)..." 
                className="min-h-24 font-mono text-sm"
              />
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="columns">Column Names (comma separated)</Label>
                  <Input id="columns" placeholder="e.g. Time, Temperature, Pressure, Conversion" />
                </div>
                <div>
                  <Label htmlFor="units">Units (comma separated)</Label>
                  <Input id="units" placeholder="e.g. min, °C, bar, %" />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={() => setActiveTab("processing")}>
                Next: Process Data
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="processing" className="p-4 border rounded-md mt-4">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium">Data Cleaning</h3>
                
                <div>
                  <Label>Handle Missing Values</Label>
                  <Select defaultValue="interpolate">
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="remove">Remove rows</SelectItem>
                      <SelectItem value="interpolate">Linear interpolation</SelectItem>
                      <SelectItem value="mean">Replace with mean</SelectItem>
                      <SelectItem value="median">Replace with median</SelectItem>
                      <SelectItem value="zero">Replace with zero</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Handle Outliers</Label>
                  <Select defaultValue="iqr">
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No outlier treatment</SelectItem>
                      <SelectItem value="iqr">IQR method</SelectItem>
                      <SelectItem value="zscore">Z-score method</SelectItem>
                      <SelectItem value="manual">Manual threshold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="normalize" className="h-4 w-4" />
                    <Label htmlFor="normalize">Normalize Data</Label>
                  </div>
                  <p className="text-xs text-gray-500 ml-6 mt-1">Scale values between 0 and 1</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Data Transformation</h3>
                
                <div>
                  <Label>Apply Function</Label>
                  <Select defaultValue="none">
                    <SelectTrigger>
                      <SelectValue placeholder="Select function" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="log">Logarithm</SelectItem>
                      <SelectItem value="sqrt">Square Root</SelectItem>
                      <SelectItem value="exp">Exponential</SelectItem>
                      <SelectItem value="custom">Custom Formula</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="columns-select">Apply to Columns</Label>
                  <Select defaultValue="all">
                    <SelectTrigger id="columns-select">
                      <SelectValue placeholder="Select columns" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Columns</SelectItem>
                      <SelectItem value="temperature">Temperature</SelectItem>
                      <SelectItem value="pressure">Pressure</SelectItem>
                      <SelectItem value="conversion">Conversion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="custom-formula">Custom Formula (optional)</Label>
                  <Input id="custom-formula" placeholder="e.g. x^2 + 2*x" />
                  <p className="text-xs text-gray-500 mt-1">Use 'x' as the variable</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("input")}>
                Back: Data Input
              </Button>
              <Button onClick={handleAnalyzeData}>
                <Play className="h-4 w-4 mr-1" />
                Process & Analyze Data
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="visualization" className="p-4 border rounded-md mt-4">
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Chart Type</Label>
                <Select defaultValue="line">
                  <SelectTrigger>
                    <SelectValue placeholder="Select chart type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="line">Line Chart</SelectItem>
                    <SelectItem value="scatter">Scatter Plot</SelectItem>
                    <SelectItem value="bar">Bar Chart</SelectItem>
                    <SelectItem value="pie">Pie Chart</SelectItem>
                    <SelectItem value="heatmap">Heat Map</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>X-Axis</Label>
                <Select defaultValue="time">
                  <SelectTrigger>
                    <SelectValue placeholder="Select X variable" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="time">Time</SelectItem>
                    <SelectItem value="temperature">Temperature</SelectItem>
                    <SelectItem value="pressure">Pressure</SelectItem>
                    <SelectItem value="index">Row Index</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Y-Axis</Label>
                <Select defaultValue="conversion">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Y variable" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conversion">Conversion</SelectItem>
                    <SelectItem value="temperature">Temperature</SelectItem>
                    <SelectItem value="pressure">Pressure</SelectItem>
                    <SelectItem value="yield">Yield</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="aspect-video bg-white dark:bg-gray-800 rounded-md border p-4">
              {dataAnalyzed ? (
                <div className="h-full flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Conversion vs. Time</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Save className="h-4 w-4 mr-1" />
                        Save Chart
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Export Data
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <LineChart className="h-16 w-16 mx-auto mb-2 text-blue-500" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">[Data visualization would appear here]</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-400">Process data to generate visualization</p>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <Button variant="outline" className="flex items-center justify-center gap-2">
                <LineChart className="h-4 w-4" />
                Line Chart
              </Button>
              <Button variant="outline" className="flex items-center justify-center gap-2">
                <BarChart className="h-4 w-4" />
                Bar Chart
              </Button>
              <Button variant="outline" className="flex items-center justify-center gap-2">
                <PieChart className="h-4 w-4" />
                Pie Chart
              </Button>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("processing")}>
                Back: Data Processing
              </Button>
              <Button onClick={() => setActiveTab("statistics")}>
                Next: Statistical Analysis
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="statistics" className="p-4 border rounded-md mt-4">
          {dataAnalyzed ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="border rounded-md p-4 bg-white dark:bg-gray-800">
                  <h3 className="font-medium mb-3">Descriptive Statistics</h3>
                  
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left pb-2">Statistic</th>
                        <th className="text-right pb-2">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-1.5">Mean</td>
                        <td className="text-right">65.38</td>
                      </tr>
                      <tr>
                        <td className="py-1.5">Median</td>
                        <td className="text-right">67.21</td>
                      </tr>
                      <tr>
                        <td className="py-1.5">Standard Deviation</td>
                        <td className="text-right">12.45</td>
                      </tr>
                      <tr>
                        <td className="py-1.5">Minimum</td>
                        <td className="text-right">32.10</td>
                      </tr>
                      <tr>
                        <td className="py-1.5">Maximum</td>
                        <td className="text-right">85.93</td>
                      </tr>
                      <tr>
                        <td className="py-1.5">Range</td>
                        <td className="text-right">53.83</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="border rounded-md p-4 bg-white dark:bg-gray-800">
                  <h3 className="font-medium mb-3">Correlation Analysis</h3>
                  
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left pb-2">Variables</th>
                        <th className="text-right pb-2">Correlation (r)</th>
                        <th className="text-right pb-2">p-value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-1.5">Time vs. Conversion</td>
                        <td className="text-right">0.92</td>
                        <td className="text-right">&lt;0.001</td>
                      </tr>
                      <tr>
                        <td className="py-1.5">Temperature vs. Conversion</td>
                        <td className="text-right">0.78</td>
                        <td className="text-right">&lt;0.001</td>
                      </tr>
                      <tr>
                        <td className="py-1.5">Pressure vs. Conversion</td>
                        <td className="text-right">-0.23</td>
                        <td className="text-right">0.142</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-medium">Model Fitting</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Model Type</Label>
                    <Select defaultValue="linear">
                      <SelectTrigger>
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="linear">Linear Regression</SelectItem>
                        <SelectItem value="polynomial">Polynomial Regression</SelectItem>
                        <SelectItem value="exponential">Exponential</SelectItem>
                        <SelectItem value="power">Power Law</SelectItem>
                        <SelectItem value="arrhenius">Arrhenius Equation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Independent Variable (X)</Label>
                    <Select defaultValue="time">
                      <SelectTrigger>
                        <SelectValue placeholder="Select variable" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="time">Time</SelectItem>
                        <SelectItem value="temperature">Temperature</SelectItem>
                        <SelectItem value="pressure">Pressure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Dependent Variable (Y)</Label>
                    <Select defaultValue="conversion">
                      <SelectTrigger>
                        <SelectValue placeholder="Select variable" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conversion">Conversion</SelectItem>
                        <SelectItem value="yield">Yield</SelectItem>
                        <SelectItem value="rate">Reaction Rate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button variant="outline" size="sm">
                  <Play className="h-4 w-4 mr-1" />
                  Fit Model
                </Button>
                
                <div className="border rounded-md p-4 bg-white dark:bg-gray-800 mt-3">
                  <h4 className="text-sm font-medium mb-2">Model Results</h4>
                  <div className="text-sm">
                    <p>Equation: y = 4.53x + 12.21</p>
                    <p className="mt-1">R² = 0.92</p>
                    <p className="mt-1">Adjusted R² = 0.91</p>
                    <p className="mt-1">p-value: &lt;0.001</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("visualization")}>
                  Back: Visualization
                </Button>
                <Button variant="outline">
                  <Save className="h-4 w-4 mr-1" />
                  Export Analysis
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4">Process and analyze data to view statistics</p>
              <Button onClick={handleAnalyzeData}>
                <Play className="h-4 w-4 mr-1" />
                Process & Analyze Data
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataAnalysisInterface;
