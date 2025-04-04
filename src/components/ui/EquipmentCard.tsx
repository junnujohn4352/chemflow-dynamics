
import React from "react";
import { cn } from "@/lib/utils";
import { 
  CircleOff, 
  Droplets, 
  Flame, 
  Gauge, 
  Thermometer, 
  FlaskConical, 
  SquareStack,
  Container,
  Wind,
  Filter,
  Beaker,
  Package,
  Columns,
  Cpu,
  ArrowRight,
  Waves,
  Milestone,
  Lightbulb,
  Pipette
} from "lucide-react";

interface EquipmentCardProps {
  type: string;
  name: string;
  status?: "running" | "stopped" | "warning" | "error";
  metrics?: {
    temperature?: number;
    pressure?: number;
    flow?: number;
    level?: number;
    efficiency?: number;
    conversion?: number;
    duty?: number;
    purity?: number;
    separation?: number;
    [key: string]: number | undefined;
  };
  className?: string;
  onClick?: () => void;
}

const EquipmentCard: React.FC<EquipmentCardProps> = ({
  type,
  name,
  status = "stopped",
  metrics,
  className,
  onClick,
}) => {
  const getIcon = () => {
    switch (type) {
      case "reactor":
      case "cstr":
      case "pfr":
        return <Beaker className="h-7 w-7" />;
      case "pump":
        return <Droplets className="h-7 w-7" />;
      case "valve":
        return <CircleOff className="h-7 w-7" />;
      case "heater":
      case "furnace":
        return <Flame className="h-7 w-7" />;
      case "cooler":
        return <Thermometer className="h-7 w-7" />;
      case "column":
      case "absorber":
        return <SquareStack className="h-7 w-7" />;
      case "tank":
      case "flashDrum":
        return <Container className="h-7 w-7" />;
      case "mixer":
        return <Columns className="h-7 w-7" />;
      case "compressor":
        return <Wind className="h-7 w-7" />;
      case "filter":
        return <Filter className="h-7 w-7" />;
      case "product":
        return <Package className="h-7 w-7" />;
      case "separator":
        return <Columns className="h-7 w-7" />;
      case "controller":
        return <Cpu className="h-7 w-7" />;
      case "arrow":
        return <ArrowRight className="h-7 w-7" />;
      case "heatExchanger":
        return <Lightbulb className="h-7 w-7" />;
      case "sensor":
        return <Pipette className="h-7 w-7" />;
      case "splitter":
        return <Milestone className="h-7 w-7" />;
      case "coolingTower":
        return <Waves className="h-7 w-7" />;
      default:
        return <FlaskConical className="h-7 w-7" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "running":
        return "bg-green-500";
      case "stopped":
        return "bg-gray-400";
      case "warning":
        return "bg-amber-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div
      className={cn(
        "group relative p-5 rounded-xl bg-white border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md",
        status === "running" && "ring-1 ring-green-200",
        className,
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-50 text-flow-blue">
            {getIcon()}
          </div>
          <div>
            <h3 className="font-medium text-lg">{name}</h3>
            <div className="flex items-center mt-1">
              <div className={`h-2.5 w-2.5 rounded-full ${getStatusColor()} mr-2`}></div>
              <p className="text-sm text-gray-500 capitalize">{status}</p>
            </div>
          </div>
        </div>
      </div>

      {metrics && (
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
          {metrics.efficiency !== undefined && (
            <div className="p-2 rounded-lg bg-gray-50">
              <div className="flex items-center gap-2">
                <Gauge className="h-3.5 w-3.5 text-gray-500" />
                <span className="text-xs text-gray-500">Efficiency</span>
              </div>
              <p className="font-medium mt-1">{metrics.efficiency}%</p>
            </div>
          )}
          {metrics.conversion !== undefined && (
            <div className="p-2 rounded-lg bg-gray-50">
              <div className="flex items-center gap-2">
                <Beaker className="h-3.5 w-3.5 text-gray-500" />
                <span className="text-xs text-gray-500">Conversion</span>
              </div>
              <p className="font-medium mt-1">{metrics.conversion}%</p>
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
          {metrics.purity !== undefined && (
            <div className="p-2 rounded-lg bg-gray-50">
              <div className="flex items-center gap-2">
                <Package className="h-3.5 w-3.5 text-gray-500" />
                <span className="text-xs text-gray-500">Purity</span>
              </div>
              <p className="font-medium mt-1">{metrics.purity}%</p>
            </div>
          )}
          {metrics.separation !== undefined && (
            <div className="p-2 rounded-lg bg-gray-50">
              <div className="flex items-center gap-2">
                <Columns className="h-3.5 w-3.5 text-gray-500" />
                <span className="text-xs text-gray-500">Separation</span>
              </div>
              <p className="font-medium mt-1">{metrics.separation}%</p>
            </div>
          )}
        </div>
      )}
      
      <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-200 group-hover:ring-flow-blue transition-all duration-300 opacity-0 group-hover:opacity-100 pointer-events-none"></div>
    </div>
  );
};

export default EquipmentCard;
