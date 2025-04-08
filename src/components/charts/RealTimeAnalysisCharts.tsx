
import React from "react";
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
  Line,
  BarChart,
  Bar,
  Scatter,
  ScatterChart,
  ZAxis
} from 'recharts';
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Thermometer, Gauge, Droplets, BarChart3, ActivitySquare, TrendingUp } from "lucide-react";

interface RealTimeAnalysisChartsProps {
  realTimeData: any[];
  selectedComponents: string[];
  isRealTimeActive: boolean;
}

const RealTimeAnalysisCharts: React.FC<RealTimeAnalysisChartsProps> = ({
  realTimeData,
  selectedComponents,
  isRealTimeActive
}) => {
  if (!realTimeData || realTimeData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <BarChart3 className="h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-600">No Analysis Data</h3>
        <p className="text-sm text-gray-500 max-w-md mt-2">
          Start the real-time analysis to visualize your simulation data
        </p>
      </div>
    );
  }

  const chartConfig = {
    temperature: {
      label: "Temperature",
      theme: { light: "#ff7300", dark: "#ff9d57" }
    },
    pressure: {
      label: "Pressure",
      theme: { light: "#387908", dark: "#5fad24" }
    },
    conversion: {
      label: "Conversion",
      theme: { light: "#8884d8", dark: "#a7a3e9" }
    },
    ...selectedComponents.reduce((acc, comp, index) => {
      const colors = [
        { light: "#8884d8", dark: "#a7a3e9" },
        { light: "#82ca9d", dark: "#a0dfb5" },
        { light: "#ffc658", dark: "#ffd685" },
        { light: "#ff8042", dark: "#ffa575" },
        { light: "#0088fe", dark: "#4fadfe" },
        { light: "#00C49F", dark: "#33dcbb" }
      ];
      return {
        ...acc,
        [comp]: {
          label: comp,
          theme: colors[index % colors.length]
        }
      };
    }, {})
  };

  // Calculate deltas for insights
  const timePoints = realTimeData.length;
  const latestDataPoint = realTimeData[realTimeData.length - 1];
  const firstDataPoint = realTimeData[0];

  const getTrend = (current: number, first: number) => {
    const diff = current - first;
    return {
      value: diff,
      percent: first !== 0 ? (diff / first) * 100 : 0,
      increasing: diff > 0
    };
  };

  const temperatureTrend = latestDataPoint?.temperature && firstDataPoint?.temperature 
    ? getTrend(latestDataPoint.temperature, firstDataPoint.temperature)
    : { value: 0, percent: 0, increasing: false };

  const pressureTrend = latestDataPoint?.pressure && firstDataPoint?.pressure 
    ? getTrend(latestDataPoint.pressure, firstDataPoint.pressure)
    : { value: 0, percent: 0, increasing: false };

  const conversionTrend = latestDataPoint?.conversion && firstDataPoint?.conversion 
    ? getTrend(latestDataPoint.conversion, firstDataPoint.conversion)
    : { value: 0, percent: 0, increasing: false };

  return (
    <div className="space-y-6">
      {/* Key metrics summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-none shadow-md bg-white dark:bg-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-blue-600 dark:text-blue-400">
              <Thermometer className="h-4 w-4 mr-2" /> Temperature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestDataPoint.temperature?.toFixed(1)} K</div>
            <div className="flex items-center mt-1">
              <Badge variant={temperatureTrend.increasing ? "default" : "destructive"} className="text-xs">
                {temperatureTrend.increasing ? "+" : ""}{temperatureTrend.value.toFixed(1)} K
              </Badge>
              <span className="text-xs text-gray-500 ml-2">
                from start
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-md bg-white dark:bg-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-green-600 dark:text-green-400">
              <Gauge className="h-4 w-4 mr-2" /> Pressure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestDataPoint.pressure?.toFixed(1)} kPa</div>
            <div className="flex items-center mt-1">
              <Badge variant={pressureTrend.increasing ? "default" : "destructive"} className="text-xs">
                {pressureTrend.increasing ? "+" : ""}{pressureTrend.value.toFixed(1)} kPa
              </Badge>
              <span className="text-xs text-gray-500 ml-2">
                from start
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-md bg-white dark:bg-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-purple-600 dark:text-purple-400">
              <ActivitySquare className="h-4 w-4 mr-2" /> Conversion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(latestDataPoint.conversion * 100).toFixed(1)}%</div>
            <div className="flex items-center mt-1">
              <Badge variant={conversionTrend.increasing ? "default" : "destructive"} className="text-xs">
                {conversionTrend.increasing ? "+" : ""}{(conversionTrend.percent).toFixed(1)}%
              </Badge>
              <span className="text-xs text-gray-500 ml-2">
                from start
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-md bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Process Variables</CardTitle>
            <CardDescription>Temperature and pressure trends over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ChartContainer config={chartConfig}>
                <LineChart data={realTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="time" 
                    label={{ value: 'Time (min)', position: 'insideBottom', offset: -5 }} 
                  />
                  <YAxis 
                    yAxisId="left" 
                    label={{ value: 'Temperature (K)', angle: -90, position: 'insideLeft' }} 
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    label={{ value: 'Pressure (kPa)', angle: 90, position: 'insideRight' }} 
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Line 
                    yAxisId="left" 
                    type="monotone" 
                    dataKey="temperature" 
                    name="temperature" 
                    strokeWidth={2} 
                    dot={false} 
                    activeDot={{ r: 6 }} 
                  />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="pressure" 
                    name="pressure" 
                    strokeWidth={2} 
                    dot={false}
                    activeDot={{ r: 6 }} 
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-md bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Conversion Efficiency</CardTitle>
            <CardDescription>Reaction conversion progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ChartContainer config={chartConfig}>
                <LineChart data={realTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="time" 
                    label={{ value: 'Time (min)', position: 'insideBottom', offset: -5 }} 
                  />
                  <YAxis 
                    domain={[0, 1]} 
                    tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                    label={{ value: 'Conversion', angle: -90, position: 'insideLeft' }} 
                  />
                  <ChartTooltip content={<ChartTooltipContent labelFormatter={(value) => `Time: ${value} min`} />} />
                  <Line 
                    type="monotone" 
                    dataKey="conversion" 
                    name="conversion" 
                    strokeWidth={2}
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Component composition chart */}
      <Card className="border-none shadow-md bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Component Compositions</CardTitle>
          <CardDescription>Concentration changes over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ChartContainer config={chartConfig}>
              <AreaChart data={realTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time" 
                  label={{ value: 'Time (min)', position: 'insideBottom', offset: -5 }} 
                />
                <YAxis 
                  label={{ value: 'Concentration (%)', angle: -90, position: 'insideLeft' }} 
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                {selectedComponents.slice(0, 6).map((comp) => (
                  <Area 
                    key={comp} 
                    type="monotone" 
                    dataKey={comp} 
                    name={comp}
                    stackId="1"
                  />
                ))}
              </AreaChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* Correlation chart */}
      {realTimeData.length > 3 && (
        <Card className="border-none shadow-md bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Parameter Correlation</CardTitle>
            <CardDescription>Relationship between temperature and conversion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid />
                  <XAxis 
                    type="number" 
                    dataKey="temperature" 
                    name="Temperature" 
                    unit="K"
                    label={{ value: 'Temperature (K)', position: 'insideBottom', offset: -5 }} 
                  />
                  <YAxis 
                    type="number" 
                    dataKey="conversion" 
                    name="Conversion" 
                    tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                    label={{ value: 'Conversion', angle: -90, position: 'insideLeft' }} 
                  />
                  <ZAxis 
                    type="number" 
                    range={[60, 400]} 
                    dataKey="pressure" 
                    name="Pressure"
                    unit=" kPa" 
                  />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Legend />
                  <Scatter 
                    name="Process Parameters" 
                    data={realTimeData} 
                    fill="#8884d8"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis insights */}
      {realTimeData.length >= 5 && (
        <Card className="border border-blue-50 bg-blue-50/30 dark:bg-blue-900/10 dark:border-blue-900/20 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
              <TrendingUp className="h-5 w-5" />
              Analysis Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mt-1.5 mr-2 flex-shrink-0"></span>
                <span>System reaching {(latestDataPoint.conversion * 100).toFixed(1)}% conversion, {latestDataPoint.conversion > 0.9 ? "approaching equilibrium" : "still in progress"}</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mt-1.5 mr-2 flex-shrink-0"></span>
                <span>Temperature {temperatureTrend.increasing ? "increased" : "decreased"} by {Math.abs(temperatureTrend.value).toFixed(1)}K {temperatureTrend.increasing ? "indicating exothermic behavior" : "suggesting endothermic process"}</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-1.5 mr-2 flex-shrink-0"></span>
                <span>Component equilibrium {realTimeData.length > 15 ? "approaching steady state" : "still developing"} - estimated time to completion: {Math.max(0, 20 - realTimeData.length)} minutes</span>
              </li>
              {pressureTrend.value !== 0 && (
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 rounded-full bg-purple-500 mt-1.5 mr-2 flex-shrink-0"></span>
                  <span>Pressure {pressureTrend.increasing ? "build-up" : "drop"} of {Math.abs(pressureTrend.value).toFixed(1)}kPa detected {pressureTrend.increasing ? "- check system boundaries" : "- monitor for leaks"}</span>
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Loading indicator */}
      {isRealTimeActive && (
        <div className="flex justify-center items-center pt-2">
          <div className="h-2 w-2 bg-blue-600 rounded-full mr-1 animate-ping"></div>
          <div className="h-2 w-2 bg-blue-600 rounded-full mr-1 animate-ping" style={{ animationDelay: "0.2s" }}></div>
          <div className="h-2 w-2 bg-blue-600 rounded-full animate-ping" style={{ animationDelay: "0.4s" }}></div>
        </div>
      )}
    </div>
  );
};

export default RealTimeAnalysisCharts;
