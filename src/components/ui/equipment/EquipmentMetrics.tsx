
import React from "react";
import { Thermometer, Gauge, Droplets, Container, FlaskConical, Blocks, Activity, Flame } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface EquipmentMetric {
  key: string;
  value: string | number;
  editable?: boolean;
  options?: string[];
  description?: string;
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
  onMetricChange?: (key: string, value: string) => void;
}

const EquipmentMetrics: React.FC<EquipmentMetricsProps> = ({ metrics, onMetricChange }) => {
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

  // Find original metric objects to check if they're editable
  const getOriginalMetric = (key: string) => {
    if (Array.isArray(metrics)) {
      return metrics.find(m => m.key === key);
    }
    return null;
  };

  const handleChange = (key: string, value: string) => {
    if (onMetricChange) {
      onMetricChange(key, value);
    }
  };

  const handleSelectChange = (key: string, value: string) => {
    if (onMetricChange) {
      onMetricChange(key, value);
    }
  };

  // Get the appropriate icon for a key
  const getIconForKey = (key: string) => {
    switch (key.toLowerCase()) {
      case 'temperature': return <Thermometer className="h-3.5 w-3.5 text-gray-500" />;
      case 'pressure': return <Gauge className="h-3.5 w-3.5 text-gray-500" />;
      case 'flow': return <Droplets className="h-3.5 w-3.5 text-gray-500" />;
      case 'level': return <Container className="h-3.5 w-3.5 text-gray-500" />;
      case 'conversion': return <FlaskConical className="h-3.5 w-3.5 text-gray-500" />;
      case 'power': return <Blocks className="h-3.5 w-3.5 text-gray-500" />;
      case 'efficiency': return <Activity className="h-3.5 w-3.5 text-gray-500" />;
      case 'duty': return <Flame className="h-3.5 w-3.5 text-gray-500" />;
      default: return <Activity className="h-3.5 w-3.5 text-gray-500" />;
    }
  };

  // Get the unit for a key
  const getUnitForKey = (key: string) => {
    switch (key.toLowerCase()) {
      case 'temperature': return '°C';
      case 'pressure': return 'kPa';
      case 'flow': return 'm³/h';
      case 'level': return '%';
      case 'conversion': return '%';
      case 'power': return 'kW';
      case 'efficiency': return '%';
      case 'duty': return 'kW';
      default: return '';
    }
  };

  // Format key for display
  const formatKeyForDisplay = (key: string) => {
    return key.charAt(0).toUpperCase() + key.slice(1).replace(/-/g, ' ');
  };

  return (
    <div className="grid grid-cols-1 gap-1 mt-2 max-h-[60px] overflow-y-auto">
      {Object.entries(metricsObject).map(([key, value]) => {
        const originalMetric = getOriginalMetric(key);
        const unit = getUnitForKey(key);
        
        return (
          <div key={key} className="p-1 rounded-md bg-gray-50 border border-gray-100">
            <div className="flex items-center gap-1.5">
              {getIconForKey(key)}
              <span className="text-[10px] text-gray-500">{formatKeyForDisplay(key)}</span>
            </div>
            {originalMetric?.editable && onMetricChange ? (
              originalMetric.options ? (
                <Select 
                  value={String(value)}
                  onValueChange={(newValue) => handleSelectChange(key, newValue)}
                >
                  <SelectTrigger className="h-6 mt-0.5 text-[10px] py-0 px-2 min-h-0">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    {originalMetric.options.map((option) => (
                      <SelectItem key={option} value={option} className="text-xs">
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex items-center mt-0.5">
                  <Input 
                    className="h-5 px-1 py-0 text-[10px] font-medium min-h-0"
                    value={String(value)}
                    onChange={(e) => handleChange(key, e.target.value)}
                  />
                  {unit && <span className="text-[10px] ml-1 text-gray-500">{unit}</span>}
                </div>
              )
            ) : (
              <p className="text-[10px] font-medium mt-0.5">{String(value)}{unit}</p>
            )}
            {originalMetric?.description && (
              <p className="text-[8px] text-gray-500 mt-0.5 truncate" title={originalMetric.description}>
                {originalMetric.description}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default EquipmentMetrics;
