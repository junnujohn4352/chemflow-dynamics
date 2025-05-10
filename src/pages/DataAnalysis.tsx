
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, LineChart, PieChart, AreaChart, Upload, Download, Table as TableIcon, Database, Settings } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 700 },
  { name: 'Jun', value: 500 },
  { name: 'Jul', value: 900 },
];

const DataAnalysis: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Data Analysis</h1>
          <p className="text-muted-foreground">
            Process data visualization and analysis tools
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center">
            <Upload className="mr-2 h-4 w-4" />
            Import Data
          </Button>
          <Button variant="outline" className="flex items-center">
            <Database className="mr-2 h-4 w-4" />
            Browse Templates
          </Button>
          <Button className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            Analysis Settings
          </Button>
        </div>
      </div>

      <Tabs defaultValue="charts" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="charts">Charts & Graphs</TabsTrigger>
          <TabsTrigger value="statistics">Statistical Analysis</TabsTrigger>
          <TabsTrigger value="tables">Data Tables</TabsTrigger>
          <TabsTrigger value="export">Export Options</TabsTrigger>
        </TabsList>

        <TabsContent value="charts" className="animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle>Production Yield Analysis</CardTitle>
                <CardDescription>Monthly production yield comparison</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" name="Production (kg)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Chart Types</CardTitle>
                <CardDescription>Select visualization style</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  <Button variant="outline" className="justify-start">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Bar Chart
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <LineChart className="mr-2 h-4 w-4" />
                    Line Chart
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <PieChart className="mr-2 h-4 w-4" />
                    Pie Chart
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <AreaChart className="mr-2 h-4 w-4" />
                    Area Chart
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-1 lg:col-span-3">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Process Parameter Correlations</CardTitle>
                    <CardDescription>Relationships between key process variables</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    Configure
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted h-[300px] rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Select parameters to visualize correlations</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="statistics" className="animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle>Descriptive Statistics</CardTitle>
                <CardDescription>Statistical summary of process variables</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        <th className="text-left p-2 border">Variable</th>
                        <th className="text-left p-2 border">Mean</th>
                        <th className="text-left p-2 border">Median</th>
                        <th className="text-left p-2 border">Std Dev</th>
                        <th className="text-left p-2 border">Min</th>
                        <th className="text-left p-2 border">Max</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 border">Temperature</td>
                        <td className="p-2 border">85.2</td>
                        <td className="p-2 border">84.9</td>
                        <td className="p-2 border">3.5</td>
                        <td className="p-2 border">78.3</td>
                        <td className="p-2 border">92.1</td>
                      </tr>
                      <tr>
                        <td className="p-2 border">Pressure</td>
                        <td className="p-2 border">2.4</td>
                        <td className="p-2 border">2.3</td>
                        <td className="p-2 border">0.3</td>
                        <td className="p-2 border">1.9</td>
                        <td className="p-2 border">3.1</td>
                      </tr>
                      <tr>
                        <td className="p-2 border">Flow Rate</td>
                        <td className="p-2 border">125.7</td>
                        <td className="p-2 border">124.5</td>
                        <td className="p-2 border">8.2</td>
                        <td className="p-2 border">104.3</td>
                        <td className="p-2 border">142.8</td>
                      </tr>
                      <tr>
                        <td className="p-2 border">Concentration</td>
                        <td className="p-2 border">0.78</td>
                        <td className="p-2 border">0.79</td>
                        <td className="p-2 border">0.05</td>
                        <td className="p-2 border">0.68</td>
                        <td className="p-2 border">0.88</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Analysis Tools</CardTitle>
                <CardDescription>Available statistical methods</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  <Button variant="outline" className="justify-start">
                    Regression Analysis
                  </Button>
                  <Button variant="outline" className="justify-start">
                    ANOVA
                  </Button>
                  <Button variant="outline" className="justify-start">
                    Process Capability
                  </Button>
                  <Button variant="outline" className="justify-start">
                    Hypothesis Testing
                  </Button>
                  <Button variant="outline" className="justify-start">
                    Control Charts
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tables" className="animate-fade-in">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Process Data</CardTitle>
                  <CardDescription>Raw data table with filtering and sorting options</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Import
                  </Button>
                  <Button variant="outline" size="sm">
                    <TableIcon className="mr-2 h-4 w-4" />
                    Format
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="text-left p-2 border">Time</th>
                      <th className="text-left p-2 border">Temperature (°C)</th>
                      <th className="text-left p-2 border">Pressure (bar)</th>
                      <th className="text-left p-2 border">Flow (kg/h)</th>
                      <th className="text-left p-2 border">Conc. (mol %)</th>
                      <th className="text-left p-2 border">Yield (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array(8).fill(0).map((_, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-muted/50" : ""}>
                        <td className="p-2 border">{`${i+1}:00`}</td>
                        <td className="p-2 border">{(80 + Math.random() * 10).toFixed(1)}</td>
                        <td className="p-2 border">{(2 + Math.random() * 1).toFixed(2)}</td>
                        <td className="p-2 border">{(100 + Math.random() * 50).toFixed(1)}</td>
                        <td className="p-2 border">{(0.7 + Math.random() * 0.2).toFixed(2)}</td>
                        <td className="p-2 border">{(85 + Math.random() * 10).toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ExportCard 
              title="Excel Export"
              description="Export data as Excel spreadsheet"
              icon={<TableIcon className="h-10 w-10 text-green-600" />}
            />
            <ExportCard 
              title="CSV Export"
              description="Export raw data as CSV file"
              icon={<Database className="h-10 w-10 text-blue-600" />}
            />
            <ExportCard 
              title="PDF Report"
              description="Generate complete PDF report"
              icon={<FileIcon className="h-10 w-10 text-red-600" />}
            />
            <ExportCard 
              title="Image Export"
              description="Export charts as PNG/JPG"
              icon={<ImageIcon className="h-10 w-10 text-purple-600" />}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface ExportCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const ExportCard: React.FC<ExportCardProps> = ({ title, description, icon }) => {
  return (
    <Card className="hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <div className="flex flex-col items-center">
          <div className="rounded-full p-3 bg-muted mb-2">
            {icon}
          </div>
          <CardTitle className="text-center">{title}</CardTitle>
          <CardDescription className="text-center">{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Button className="w-full">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </CardContent>
    </Card>
  );
};

// Simple file icon component
const FileIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

// Simple image icon component
const ImageIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="m21 15-5-5L5 21" />
  </svg>
);

export default DataAnalysis;
