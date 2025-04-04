import React, { useEffect, useState } from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { Equipment } from "./types";

interface RealTimeAnalysisProps {
  equipment: Equipment[];
  isRunning: boolean;
  simulationTime: number;
}

const RealTimeAnalysis: React.FC<RealTimeAnalysisProps> = ({
  equipment,
  isRunning,
  simulationTime
}) => {
  const [realtimeData, setRealtimeData] = useState<any[]>([]);
  const [reactorData, setReactorData] = useState<any[]>([]);
  const [flowData, setFlowData] = useState<any[]>([]);
  
  useEffect(() => {
    if (!isRunning) return;
    
    const intervalId = setInterval(() => {
      const newDataPoint = {
        time: simulationTime,
        temperature: getAverageMetric('temperature'),
        pressure: getAverageMetric('pressure'),
        level: getAverageMetric('level'),
        flow: getAverageMetric('flow'),
      };
      
      setRealtimeData(prev => {
        const newData = [...prev, newDataPoint];
        return newData.slice(-20);
      });
      
      const reactors = equipment.filter(eq => eq.type === 'reactor' || eq.type === 'cstr' || eq.type === 'pfr');
      if (reactors.length > 0) {
        const reactorDataPoint = {
          time: simulationTime,
          ...reactors.reduce((acc, reactor, index) => {
            const conversion = reactor.metrics?.conversion || Math.min(95, 40 + simulationTime * 2);
            return {
              ...acc,
              [`reactor${index + 1}`]: conversion
            };
          }, {})
        };
        
        setReactorData(prev => {
          const newData = [...prev, reactorDataPoint];
          return newData.slice(-20);
        });
      }
      
      const flowEquipment = equipment.filter(eq => 
        eq.type === 'pump' || eq.type === 'valve' || eq.type === 'compressor'
      );
      
      if (flowEquipment.length > 0) {
        const flowDataPoint = {
          time: simulationTime,
          ...flowEquipment.reduce((acc, eq, index) => {
            const flow = eq.metrics?.flow || Math.min(200, 50 + simulationTime * 5);
            return { 
              ...acc, 
              [`${eq.type}${index + 1}`]: flow 
            };
          }, {})
        };
        
        setFlowData(prev => {
          const newData = [...prev, flowDataPoint];
          return newData.slice(-20);
        });
      }
      
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [isRunning, simulationTime, equipment]);
  
  const getAverageMetric = (metricName: string): number => {
    const validEquipment = equipment.filter(eq => 
      eq.metrics && eq.metrics[metricName] !== undefined
    );
    
    if (validEquipment.length === 0) {
      if (metricName === 'temperature') return 25 + Math.sin(simulationTime / 2) * 10 + simulationTime;
      if (metricName === 'pressure') return 100 + Math.cos(simulationTime / 3) * 15 + simulationTime * 0.5;
      if (metricName === 'level') return Math.min(100, 10 + simulationTime * 1.5);
      if (metricName === 'flow') return 50 + Math.sin(simulationTime / 1.5) * 20 + simulationTime * 2;
      return 50;
    }
    
    const sum = validEquipment.reduce((acc, eq) => acc + (eq.metrics![metricName] as number), 0);
    return sum / validEquipment.length;
  };
  
  const formatValue = (value: any, suffix: string = ''): string => {
    if (typeof value === 'number') {
      return value.toFixed(1) + suffix;
    }
    return String(value) + suffix;
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-2">Temperature & Pressure Trends</h3>
        <div className="h-48 bg-white rounded-lg p-2 shadow-sm">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={realtimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="time" 
                label={{ value: 'Time (min)', position: 'insideBottom', offset: -5 }} 
              />
              <YAxis yAxisId="left" 
                label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }} 
              />
              <YAxis yAxisId="right" orientation="right" 
                label={{ value: 'Pressure (kPa)', angle: 90, position: 'insideRight' }} 
              />
              <Tooltip formatter={(value) => formatValue(value)} />
              <Line 
                yAxisId="left" 
                type="monotone" 
                dataKey="temperature" 
                stroke="#ff7300" 
                dot={false} 
                name="Temperature" 
                isAnimationActive={true}
              />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="pressure" 
                stroke="#387908" 
                dot={false} 
                name="Pressure"
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {reactorData.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-2">Reactor Conversion</h3>
          <div className="h-48 bg-white rounded-lg p-2 shadow-sm">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={reactorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time" 
                  label={{ value: 'Time (min)', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  label={{ value: 'Conversion (%)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip formatter={(value) => formatValue(value, '%')} />
                {Object.keys(reactorData[0] || {})
                  .filter(key => key !== 'time')
                  .map((key, index) => {
                    const colors = ['#8884d8', '#82ca9d', '#ffc658'];
                    return (
                      <Line 
                        key={key}
                        type="monotone" 
                        dataKey={key} 
                        stroke={colors[index % colors.length]} 
                        dot={false}
                        name={`Reactor ${index + 1}`}
                        isAnimationActive={true}
                      />
                    );
                  })
                }
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      
      {flowData.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-2">Flow Rates</h3>
          <div className="h-48 bg-white rounded-lg p-2 shadow-sm">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={flowData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time" 
                  label={{ value: 'Time (min)', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  label={{ value: 'Flow Rate (kg/h)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip formatter={(value) => formatValue(value, ' kg/h')} />
                {Object.keys(flowData[0] || {})
                  .filter(key => key !== 'time')
                  .map((key, index) => {
                    const colors = ['rgba(136, 132, 216, 0.6)', 'rgba(130, 202, 157, 0.6)', 'rgba(255, 198, 88, 0.6)'];
                    return (
                      <Area 
                        key={key}
                        type="monotone" 
                        dataKey={key} 
                        fill={colors[index % colors.length]}
                        stroke={colors[index % colors.length].replace('0.6', '1')}
                        name={key}
                        isAnimationActive={true}
                      />
                    );
                  })
                }
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      
      <div>
        <h3 className="text-sm font-semibold mb-2">Tank Levels</h3>
        <div className="h-48 bg-white rounded-lg p-2 shadow-sm">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={realtimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="time" 
                label={{ value: 'Time (min)', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                label={{ value: 'Level (%)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip formatter={(value) => formatValue(value, '%')} />
              <Area 
                type="monotone" 
                dataKey="level" 
                fill="rgba(0, 136, 254, 0.6)" 
                stroke="#0088fe" 
                name="Tank Level"
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default RealTimeAnalysis;
