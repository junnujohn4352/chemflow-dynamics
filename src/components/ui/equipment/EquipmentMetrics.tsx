
import React from "react";
import { Thermometer, Gauge, Droplets, Container, FlaskConical, Blocks, Activity, Flame } from "lucide-react";

interface EquipmentMetricsProps {
  metrics?: {
    temperature?: number;
    pressure?: number;
    flow?: number;
    level?: number;
    conversion?: number;
    power?: number;
    efficiency?: number;
    duty?: number;
  };
}

const EquipmentMetrics: React.FC<EquipmentMetricsProps> = ({ metrics }) => {
  if (!metrics) return null;

  return (
    <div className="grid grid-cols-2 gap-2 mt-4">
      {metrics.temperature !== undefined && (
        <div className="p-2 rounded-lg bg-gray-50">
          <div className="flex items-center gap-2">
            <Thermometer className="h-3.5 w-3.5 text-gray-500" />
            <span className="text-xs text-gray-500">Temp</span>
          </div>
          <p className="font-medium mt-1">{metrics.temperature}°C</p>
        </div>
      )}
      {metrics.pressure !== undefined && (
        <div className="p-2 rounded-lg bg-gray-50">
          <div className="flex items-center gap-2">
            <Gauge className="h-3.5 w-3.5 text-gray-500" />
            <span className="text-xs text-gray-500">Press</span>
          </div>
          <p className="font-medium mt-1">{metrics.pressure} kPa</p>
        </div>
      )}
      {metrics.flow !== undefined && (
        <div className="p-2 rounded-lg bg-gray-50">
          <div className="flex items-center gap-2">
            <Droplets className="h-3.5 w-3.5 text-gray-500" />
            <span className="text-xs text-gray-500">Flow</span>
          </div>
          <p className="font-medium mt-1">{metrics.flow} m³/h</p>
        </div>
      )}
      {metrics.level !== undefined && (
        <div className="p-2 rounded-lg bg-gray-50">
          <div className="flex items-center gap-2">
            <Container className="h-3.5 w-3.5 text-gray-500" />
            <span className="text-xs text-gray-500">Level</span>
          </div>
          <p className="font-medium mt-1">{metrics.level}%</p>
        </div>
      )}
      {metrics.conversion !== undefined && (
        <div className="p-2 rounded-lg bg-gray-50">
          <div className="flex items-center gap-2">
            <FlaskConical className="h-3.5 w-3.5 text-gray-500" />
            <span className="text-xs text-gray-500">Conv</span>
          </div>
          <p className="font-medium mt-1">{metrics.conversion}%</p>
        </div>
      )}
      {metrics.power !== undefined && (
        <div className="p-2 rounded-lg bg-gray-50">
          <div className="flex items-center gap-2">
            <Blocks className="h-3.5 w-3.5 text-gray-500" />
            <span className="text-xs text-gray-500">Power</span>
          </div>
          <p className="font-medium mt-1">{metrics.power} kW</p>
        </div>
      )}
      {metrics.efficiency !== undefined && (
        <div className="p-2 rounded-lg bg-gray-50">
          <div className="flex items-center gap-2">
            <Activity className="h-3.5 w-3.5 text-gray-500" />
            <span className="text-xs text-gray-500">Eff</span>
          </div>
          <p className="font-medium mt-1">{metrics.efficiency}%</p>
        </div>
      )}
      {metrics.duty !== undefined && (
        <div className="p-2 rounded-lg bg-gray-50">
          <div className="flex items-center gap-2">
            <Flame className="h-3.5 w-3.5 text-gray-500" />
            <span className="text-xs text-gray-500">Duty</span>
          </div>
          <p className="font-medium mt-1">{metrics.duty} kW</p>
        </div>
      )}
    </div>
  );
};

export default EquipmentMetrics;
