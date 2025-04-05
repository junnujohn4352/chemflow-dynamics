
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
  ArrowUpDown,
  Filter,
  Blocks,
  GitFork,
  Waves,
  Pipette,
  Timer,
  BoxSelect
} from "lucide-react";

interface EquipmentCardProps {
  type: "reactor" | "pump" | "valve" | "heater" | "condenser" | "column" | "tank" | "mixer" | 
         "heat-exchanger" | "filter" | "compressor" | "separator" | "cyclone" | "crystallizer" | 
         "evaporator" | "extractor" | "dryer" | "scrubber" | "batch-reactor";
  name: string;
  status?: "running" | "stopped" | "warning" | "error";
  metrics?: {
    temperature?: number;
    pressure?: number;
    flow?: number;
    level?: number;
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
        return <FlaskConical className="h-7 w-7" />;
      case "batch-reactor":
        return <Timer className="h-7 w-7" />;
      case "pump":
        return <Droplets className="h-7 w-7" />;
      case "valve":
        return <CircleOff className="h-7 w-7" />;
      case "heater":
        return <Flame className="h-7 w-7" />;
      case "condenser":
        return <Thermometer className="h-7 w-7" />;
      case "column":
        return <SquareStack className="h-7 w-7" />;
      case "tank":
        return <Container className="h-7 w-7" />;
      case "mixer":
        return <Gauge className="h-7 w-7" />;
      case "heat-exchanger":
        return <ArrowUpDown className="h-7 w-7" />;
      case "filter":
        return <Filter className="h-7 w-7" />;
      case "compressor":
        return <Blocks className="h-7 w-7" />;
      case "separator":
        return <GitFork className="h-7 w-7" />;
      case "cyclone":
        return <Waves className="h-7 w-7" />;
      case "crystallizer":
        return <BoxSelect className="h-7 w-7" />;
      case "evaporator":
        return <Waves className="h-7 w-7" />;
      case "extractor":
        return <Pipette className="h-7 w-7" />;
      case "dryer":
        return <Thermometer className="h-7 w-7" />;
      case "scrubber":
        return <Filter className="h-7 w-7" />;
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
        </div>
      )}
      
      <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-200 group-hover:ring-flow-blue transition-all duration-300 opacity-0 group-hover:opacity-100 pointer-events-none"></div>
    </div>
  );
};

export default EquipmentCard;
