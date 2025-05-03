
import React from "react";
import { BarChart3, TrendingUp, LineChart, PieChart, Activity } from "lucide-react";
import {
  Chart,
  ChartContainer,
  ChartContent,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";

interface SimulationResultsProps {
  simulationSubject: string | null;
  components: string[];
  thermodynamicModel: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#8dd1e1', '#a4de6c', '#d0ed57'];

const SimulationResults: React.FC<SimulationResultsProps> = ({
  simulationSubject,
  components,
  thermodynamicModel,
}) => {
  // Generate data for the charts based on the components
  const generateComponentData = () => {
    return components.map((component, index) => ({
      name: component,
      purity: Math.floor(Math.random() * 30) + 70, // Random purity between 70-100%
      conversion: Math.floor(Math.random() * 20) + 80, // Random conversion between 80-100%
      yield: Math.floor(Math.random() * 25) + 75, // Random yield between 75-100%
      flowRate: Math.floor(Math.random() * 500) + 500, // Random flow rate between 500-1000 kg/h
    }));
  };

  const generateTimeSeriesData = () => {
    const data = [];
    for (let i = 0; i < 24; i++) {
      const entry: any = { time: `${i}:00` };
      components.forEach(component => {
        entry[component] = Math.floor(Math.random() * 50) + 50;
      });
      data.push(entry);
    }
    return data;
  };

  const generatePieData = () => {
    return components.map(component => ({
      name: component,
      value: Math.floor(Math.random() * 30) + 10, // Random value between 10-40
    }));
  };

  const generateEnergyData = () => {
    return [
      { name: 'Heating', value: Math.floor(Math.random() * 1000) + 200 },
      { name: 'Cooling', value: Math.floor(Math.random() * 800) + 100 },
      { name: 'Pumping', value: Math.floor(Math.random() * 300) + 50 },
      { name: 'Compression', value: Math.floor(Math.random() * 600) + 100 },
    ];
  };

  const componentData = generateComponentData();
  const timeSeriesData = generateTimeSeriesData();
  const pieData = generatePieData();
  const energyData = generateEnergyData();

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center text-blue-800">
          <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
          Simulation Results - {simulationSubject || "Chemical Process"}
        </h3>
        <div className="text-xs text-gray-500">
          Using {thermodynamicModel} model
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Component Performance Chart */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg shadow-md border border-blue-100">
          <h4 className="font-medium mb-4 text-blue-800 flex items-center">
            <Activity className="h-4 w-4 mr-1 text-blue-600" />
            Component Performance
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={componentData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" strokeOpacity={0.5} />
                <XAxis dataKey="name" tick={{ fill: '#4B5563' }} />
                <YAxis tick={{ fill: '#4B5563' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', borderColor: '#E5E7EB' }}
                />
                <Legend />
                <Bar dataKey="purity" name="Purity (%)" fill="#8884d8" />
                <Bar dataKey="yield" name="Yield (%)" fill="#82ca9d" />
                <Bar dataKey="conversion" name="Conversion (%)" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Time Series Chart */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-lg shadow-md border border-green-100">
          <h4 className="font-medium mb-4 text-green-800 flex items-center">
            <TrendingUp className="h-4 w-4 mr-1 text-green-600" />
            Time Series Analysis
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart
                data={timeSeriesData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" strokeOpacity={0.5} />
                <XAxis dataKey="time" tick={{ fill: '#4B5563' }} />
                <YAxis tick={{ fill: '#4B5563' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', borderColor: '#E5E7EB' }}
                />
                <Legend />
                {components.map((component, index) => (
                  <Line 
                    key={component}
                    type="monotone" 
                    dataKey={component} 
                    name={component}
                    stroke={COLORS[index % COLORS.length]} 
                    activeDot={{ r: 8 }}
                    strokeWidth={2} 
                  />
                ))}
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Composition Distribution */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-lg shadow-md border border-yellow-100">
          <h4 className="font-medium mb-4 text-yellow-800 flex items-center">
            <PieChart className="h-4 w-4 mr-1 text-yellow-600" />
            Composition Distribution
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} mol%`, 'Composition']}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', borderColor: '#E5E7EB' }}
                />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Energy Consumption */}
        <div className="bg-gradient-to-br from-red-50 to-pink-50 p-4 rounded-lg shadow-md border border-red-100">
          <h4 className="font-medium mb-4 text-red-800 flex items-center">
            <LineChart className="h-4 w-4 mr-1 text-red-600" />
            Energy Consumption
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={energyData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" strokeOpacity={0.5} />
                <XAxis dataKey="name" tick={{ fill: '#4B5563' }} />
                <YAxis tick={{ fill: '#4B5563' }} />
                <Tooltip 
                  formatter={(value) => [`${value} kW`, 'Energy']}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', borderColor: '#E5E7EB' }}
                />
                <Legend />
                <Bar dataKey="value" name="Energy (kW)" fill="#FF8042" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="mt-4 bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg shadow-md border border-blue-100">
        <h4 className="font-medium mb-4 text-blue-800">Simulation Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="text-blue-600 font-medium">Efficiency</div>
            <div className="text-lg font-semibold">{Math.floor(Math.random() * 30) + 70}%</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="text-green-600 font-medium">Throughput</div>
            <div className="text-lg font-semibold">{Math.floor(Math.random() * 500) + 500} kg/h</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="text-yellow-600 font-medium">Recovery</div>
            <div className="text-lg font-semibold">{Math.floor(Math.random() * 20) + 80}%</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="text-red-600 font-medium">Energy Usage</div>
            <div className="text-lg font-semibold">{Math.floor(Math.random() * 500) + 500} kW</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationResults;
