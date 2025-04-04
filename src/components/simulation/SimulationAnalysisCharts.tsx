
import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { SubjectAnalysis } from '@/hooks/useSimulationAnalysis';

interface SimulationAnalysisChartsProps {
  analysisData: any[];
  analysisId: string;
  selectedComponents: string[];
}

const SimulationAnalysisCharts: React.FC<SimulationAnalysisChartsProps> = ({
  analysisData,
  analysisId,
  selectedComponents
}) => {
  if (!analysisData || analysisData.length === 0) {
    return <div>No analysis data available</div>;
  }

  switch (analysisId) {
    case 'heatTransfer':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analysisData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" label={{ value: 'Time (min)', position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: 'Temperature (K)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="temperature" stroke="#ff7300" name="Temperature" />
          </LineChart>
        </ResponsiveContainer>
      );
    
    case 'fluidFlow':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analysisData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" label={{ value: 'Time (min)', position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: 'Pressure (kPa)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="pressure" stroke="#387908" name="Pressure" />
          </LineChart>
        </ResponsiveContainer>
      );
    
    case 'thermodynamics':
      return (
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
          </LineChart>
        </ResponsiveContainer>
      );
    
    case 'massTransfer':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={analysisData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" label={{ value: 'Time (min)', position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: 'Concentration (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            {selectedComponents.slice(0, 4).map((comp, index) => {
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
            })}
          </AreaChart>
        </ResponsiveContainer>
      );
    
    case 'reactionEngineering':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analysisData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" label={{ value: 'Time (min)', position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: 'Conversion', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="conversion" stroke="#8884d8" activeDot={{ r: 8 }} name="Conversion" />
          </LineChart>
        </ResponsiveContainer>
      );
    
    case 'safetyAnalysis':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analysisData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" label={{ value: 'Time (min)', position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: 'Pressure (kPa)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="pressure" stroke="#ff0000" name="Pressure" />
            <Line type="monotone" dataKey={(datum) => datum.pressure ? datum.pressure * 0.9 : 0} stroke="#00ff00" strokeDasharray="5 5" name="Relief Pressure" />
          </LineChart>
        </ResponsiveContainer>
      );
    
    case 'processSimulation':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={[analysisData[analysisData.length - 1]]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" tick={false} />
            <YAxis label={{ value: 'Concentration (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            {selectedComponents.map((comp, index) => {
              const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00C49F'];
              return (
                <Bar 
                  key={comp} 
                  dataKey={comp} 
                  fill={colors[index % colors.length]} 
                />
              );
            })}
          </BarChart>
        </ResponsiveContainer>
      );
    
    case 'utilityEnvironmental':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analysisData.filter((_, i) => i % 3 === 0)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" label={{ value: 'Time (min)', position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: 'Resource Usage', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={(datum) => datum.temperature ? datum.temperature / 10 : 0} stroke="#0088fe" name="Steam Usage" />
            <Line type="monotone" dataKey={(datum) => datum.pressure ? datum.pressure / 5 : 0} stroke="#00C49F" name="Cooling Water" />
            <Line type="monotone" dataKey={(datum) => datum.conversion ? datum.conversion * 100 : 0} stroke="#FFBB28" name="Power Usage" />
          </LineChart>
        </ResponsiveContainer>
      );
    
    default:
      return (
        <div>Charts not available for this analysis type</div>
      );
  }
};

export default SimulationAnalysisCharts;
