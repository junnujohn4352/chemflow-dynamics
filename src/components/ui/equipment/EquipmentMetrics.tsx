
import React from "react";
import { Thermometer, Gauge, Droplets, Container, FlaskConical, Blocks, Activity, Flame } from "lucide-react";

export interface EquipmentMetric {
  key: string;
  value: string | number;
  editable?: boolean;
  options?: string[];
}

interface EquipmentMetricsProps {
  // Support both the legacy object format and the new array format
  metrics?: {
    temperature?: number | string;
    pressure?: number | string;
    flow?: number | string;
    level?: number | string;
    conversion?: number | string;
    power?: number | string;
    efficiency?: number | string;
    duty?: number | string;
    [key: string]: any;
  } | EquipmentMetric[];
}

const EquipmentMetrics: React.FC<EquipmentMetricsProps> = ({ metrics }) => {
  if (!metrics) return null;
  
  // Convert array format to object format if needed
  const metricsObject = Array.isArray(metrics) 
    ? metrics.reduce<Record<string, string | number>>((acc, metric) => {
        if (metric.key) {
          // Convert string values to numbers where appropriate
          const value = !isNaN(Number(metric.value)) && typeof metric.value === 'string' 
            ? Number(metric.value) 
            : metric.value;
          return { ...acc, [metric.key]: value };
        }
        return acc;
      }, {})
    : metrics as Record<string, string | number>;

  return (
    <div className="grid grid-cols-2 gap-2 mt-4">
      {metricsObject.temperature !== undefined && (
        <div className="p-2 rounded-lg bg-gray-50">
          <div className="flex items-center gap-2">
            <Thermometer className="h-3.5 w-3.5 text-gray-500" />
            <span className="text-xs text-gray-500">Temp</span>
          </div>
          <p className="font-medium mt-1">{metricsObject.temperature}°C</p>
        </div>
      )}
      {metricsObject.pressure !== undefined && (
        <div className="p-2 rounded-lg bg-gray-50">
          <div className="flex items-center gap-2">
            <Gauge className="h-3.5 w-3.5 text-gray-500" />
            <span className="text-xs text-gray-500">Press</span>
          </div>
          <p className="font-medium mt-1">{metricsObject.pressure} kPa</p>
        </div>
      )}
      {metricsObject.flow !== undefined && (
        <div className="p-2 rounded-lg bg-gray-50">
          <div className="flex items-center gap-2">
            <Droplets className="h-3.5 w-3.5 text-gray-500" />
            <span className="text-xs text-gray-500">Flow</span>
          </div>
          <p className="font-medium mt-1">{metricsObject.flow} m³/h</p>
        </div>
      )}
      {metricsObject.level !== undefined && (
        <div className="p-2 rounded-lg bg-gray-50">
          <div className="flex items-center gap-2">
            <Container className="h-3.5 w-3.5 text-gray-500" />
            <span className="text-xs text-gray-500">Level</span>
          </div>
          <p className="font-medium mt-1">{metricsObject.level}%</p>
        </div>
      )}
      {metricsObject.conversion !== undefined && (
        <div className="p-2 rounded-lg bg-gray-50">
          <div className="flex items-center gap-2">
            <FlaskConical className="h-3.5 w-3.5 text-gray-500" />
            <span className="text-xs text-gray-500">Conv</span>
          </div>
          <p className="font-medium mt-1">{metricsObject.conversion}%</p>
        </div>
      )}
      {metricsObject.power !== undefined && (
        <div className="p-2 rounded-lg bg-gray-50">
          <div className="flex items-center gap-2">
            <Blocks className="h-3.5 w-3.5 text-gray-500" />
            <span className="text-xs text-gray-500">Power</span>
          </div>
          <p className="font-medium mt-1">{metricsObject.power} kW</p>
        </div>
      )}
      {metricsObject.efficiency !== undefined && (
        <div className="p-2 rounded-lg bg-gray-50">
          <div className="flex items-center gap-2">
            <Activity className="h-3.5 w-3.5 text-gray-500" />
            <span className="text-xs text-gray-500">Eff</span>
          </div>
          <p className="font-medium mt-1">{metricsObject.efficiency}%</p>
        </div>
      )}
      {metricsObject.duty !== undefined && (
        <div className="p-2 rounded-lg bg-gray-50">
          <div className="flex items-center gap-2">
            <Flame className="h-3.5 w-3.5 text-gray-500" />
            <span className="text-xs text-gray-500">Duty</span>
          </div>
          <p className="font-medium mt-1">{metricsObject.duty} kW</p>
        </div>
      )}
      
      {/* Support for custom metrics that aren't part of the predefined set */}
      {Object.entries(metricsObject).map(([key, value]) => {
        // Skip the predefined metrics that are already handled above
        if (['temperature', 'pressure', 'flow', 'level', 'conversion', 'power', 'efficiency', 'duty'].includes(key)) {
          return null;
        }
        
        return (
          <div key={key} className="p-2 rounded-lg bg-gray-50">
            <div className="flex items-center gap-2">
              <Activity className="h-3.5 w-3.5 text-gray-500" />
              <span className="text-xs text-gray-500">{key}</span>
            </div>
            <p className="font-medium mt-1">{String(value)}</p>
          </div>
        );
      })}
    </div>
  );
};

export default EquipmentMetrics;
