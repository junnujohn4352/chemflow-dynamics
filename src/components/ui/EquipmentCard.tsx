import React from "react";
import { cn } from "@/lib/utils";
import { 
  CircleOff, 
  Droplets, 
  Flame, 
  Gauge, 
  ThermometerIcon as Thermometer, 
  FlaskConical, 
  SquareStack,
  Container,
  ArrowUpDown,
  Filter,
  Blocks,
  GitFork,
  Waves,
  PipetteIcon as Pipette,
  Timer,
  BoxSelect,
  Fan,
  FlaskRound,
  Cylinder,
  Leaf,
  Beaker,
  CircleDot,
  Wrench,
  Package,
  Activity,
  Asterisk,
  Cog,
  Factory,
  Cloud,
  MoveVertical,
  Move,
  Snowflake,
  TriangleRight,
  PipetteIcon,
  Hammer,
  Banana,
  AtSign,
  Columns,
  Microscope,
  TestTubeIcon as TestTube,
  Network,
  Sparkles,
  ScrollIcon,
  PanelTop,
  Wind,
  SplitSquareVertical
} from "lucide-react";

interface EquipmentCardProps {
  type: "reactor" | "pump" | "valve" | "heater" | "condenser" | "column" | "tank" | "mixer" | 
         "heat-exchanger" | "filter" | "compressor" | "separator" | "cyclone" | "crystallizer" | 
         "evaporator" | "extractor" | "dryer" | "scrubber" | "batch-reactor" | "shell-and-tube" |
         "plate" | "air-cooler" | "reboiler" | "rotary" | "belt" | "spray" | "tray" | "absorber" |
         "stripper" | "flash" | "decanter" | "centrifuge" | "cooling-tower" | "furnace" | "turbine" |
         "cstr" | "pfr" | "absorption-tower" | "cooler" | "distillation" | "crystallization" | 
         "extruder" | "disintegrator" | "expander" | "reformer" | "boiler" | "tee" | "sieve" |
         "hydrocyclone" | "gravity-separator" | "drum" | "clarifier" | "membrane" | "granulator" |
         "homogenizer" | "conveyor" | "drainer" | "agitator" | "fluidized-bed" |
         "blender" | "dehumidifier" | "adsorber" | "quench" | "wetted-wall" | "ejector" | "calciner" |
         "mixer-settler" | "shell-tube-heat-exchanger" | 
         "short-cut-column" | "three-phase-separator" | "component-splitter" | "conversion-reactor" |
         "equilibrium-reactor" | "gibbs-reactor" | "yield-shift-reactor" | "pipe-segment" |
         "liquid-liquid-extraction" | "spread-sheet" | "makeup" | "recycle" | "ratio-control" |
         "adjust" | "balance" | "controller" | "set" | "case-study" | "logical-operator" |
         "mixer-column" | "divider" | "splitter" | "relief-valve" | "check-valve" | "plate-fin-exchanger" |
         "generic-valve" | "spiral-heat-exchanger";
  name: string;
  status?: "running" | "stopped" | "warning" | "error";
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
      case "cstr":
        return <FlaskRound className="h-7 w-7" />;
      case "pfr":
        return <Cylinder className="h-7 w-7" />;
      case "fluidized-bed":
        return <Blocks className="h-7 w-7" />;
      case "reformer":
        return <AtSign className="h-7 w-7" />;
      case "conversion-reactor":
        return <FlaskConical className="h-7 w-7" />;
      case "equilibrium-reactor":
        return <FlaskRound className="h-7 w-7" />;
      case "gibbs-reactor":
        return <Thermometer className="h-7 w-7" />;
      case "yield-shift-reactor":
        return <ArrowUpDown className="h-7 w-7" />;
        
      case "pump":
        return <Droplets className="h-7 w-7" />;
      case "valve":
        return <CircleOff className="h-7 w-7" />;
      case "compressor":
        return <Blocks className="h-7 w-7" />;
      case "expander":
        return <MoveVertical className="h-7 w-7" />;
      case "turbine":
        return <Fan className="h-7 w-7" />;
      case "tee":
        return <GitFork className="h-7 w-7" />;
      case "ejector":
        return <Activity className="h-7 w-7" />;
      case "conveyor":
        return <ArrowUpDown className="h-7 w-7" />;
      case "relief-valve":
        return <CircleOff className="h-7 w-7" />;
      case "check-valve":
        return <CircleDot className="h-7 w-7" />;
      case "generic-valve":
        return <Gauge className="h-7 w-7" />;
      case "pipe-segment":
        return <Cylinder className="h-7 w-7" />;
        
      case "heater":
        return <Flame className="h-7 w-7" />;
      case "cooler":
        return <Snowflake className="h-7 w-7" />;
      case "condenser":
        return <Thermometer className="h-7 w-7" />;
      case "heat-exchanger":
        return <ArrowUpDown className="h-7 w-7" />;
      case "shell-tube-heat-exchanger":
        return <Network className="h-7 w-7" />;
      case "shell-and-tube":
        return <Cylinder className="h-7 w-7" />;
      case "plate":
        return <Package className="h-7 w-7" />;
      case "air-cooler":
        return <Fan className="h-7 w-7" />;
      case "reboiler":
        return <Flame className="h-7 w-7" />;
      case "cooling-tower":
        return <SquareStack className="h-7 w-7" />;
      case "furnace":
        return <Flame className="h-7 w-7" />;
      case "boiler":
        return <Cloud className="h-7 w-7" />;
      case "quench":
        return <Droplets className="h-7 w-7" />;
      case "plate-fin-exchanger":
        return <Package className="h-7 w-7" />;
      case "spiral-heat-exchanger":
        return <CircleDot className="h-7 w-7" />;
        
      case "column":
        return <SquareStack className="h-7 w-7" />;
      case "distillation":
        return <Columns className="h-7 w-7" />;
      case "absorption-tower":
        return <SquareStack className="h-7 w-7" />;
      case "filter":
        return <Filter className="h-7 w-7" />;
      case "separator":
        return <GitFork className="h-7 w-7" />;
      case "cyclone":
        return <Waves className="h-7 w-7" />;
      case "crystallizer":
        return <BoxSelect className="h-7 w-7" />;
      case "crystallization":
        return <Asterisk className="h-7 w-7" />;
      case "evaporator":
        return <Waves className="h-7 w-7" />;
      case "extractor":
        return <Pipette className="h-7 w-7" />;
      case "dryer":
        return <Thermometer className="h-7 w-7" />;
      case "scrubber":
        return <Filter className="h-7 w-7" />;
      case "hydrocyclone":
        return <CircleDot className="h-7 w-7" />;
      case "decanter":
        return <Container className="h-7 w-7" />;
      case "centrifuge":
        return <Wrench className="h-7 w-7" />;
      case "flash":
        return <Beaker className="h-7 w-7" />;
      case "adsorber":
        return <PanelTop className="h-7 w-7" />;
      case "absorber":
        return <FlaskRound className="h-7 w-7" />;
      case "stripper":
        return <Leaf className="h-7 w-7" />;
      case "drum":
        return <Cylinder className="h-7 w-7" />;
      case "clarifier":
        return <Droplets className="h-7 w-7" />;
      case "membrane":
        return <Filter className="h-7 w-7" />;
      case "gravity-separator":
        return <MoveVertical className="h-7 w-7" />;
      case "sieve":
        return <TriangleRight className="h-7 w-7" />;
      case "mixer-settler":
        return <SplitSquareVertical className="h-7 w-7" />;
      case "short-cut-column":
        return <Columns className="h-7 w-7" />;
      case "three-phase-separator":
        return <SplitSquareVertical className="h-7 w-7" />;
      case "component-splitter":
        return <GitFork className="h-7 w-7" />;
      case "liquid-liquid-extraction":
        return <PipetteIcon className="h-7 w-7" />;
      
      case "tank":
        return <Container className="h-7 w-7" />;
      case "mixer":
        return <Gauge className="h-7 w-7" />;
      case "mixer-column":
        return <Cog className="h-7 w-7" />;
      case "divider":
        return <SplitSquareVertical className="h-7 w-7" />;
      case "splitter":
        return <GitFork className="h-7 w-7" />;
        
      case "rotary":
        return <CircleDot className="h-7 w-7" />;
      case "belt":
        return <ArrowUpDown className="h-7 w-7" />;
      case "extruder":
        return <Move className="h-7 w-7" />;
      case "disintegrator":
        return <Hammer className="h-7 w-7" />;
      case "granulator":
        return <Sparkles className="h-7 w-7" />;
      case "blender":
        return <Move className="h-7 w-7" />;
      case "agitator":
        return <Cog className="h-7 w-7" />;
      case "homogenizer":
        return <Factory className="h-7 w-7" />;
      case "drainer":
        return <PipetteIcon className="h-7 w-7" />;
      case "calciner":
        return <Flame className="h-7 w-7" />;
        
      case "spray":
        return <Droplets className="h-7 w-7" />;
      case "tray":
        return <SquareStack className="h-7 w-7" />;
      case "wetted-wall":
        return <ScrollIcon className="h-7 w-7" />;
      case "dehumidifier":
        return <Wind className="h-7 w-7" />;
        
      case "spread-sheet":
        return <Package className="h-7 w-7" />;
      case "makeup":
        return <Droplets className="h-7 w-7" />;
      case "recycle":
        return <Activity className="h-7 w-7" />;
      case "ratio-control":
        return <Gauge className="h-7 w-7" />;
      case "adjust":
        return <Wrench className="h-7 w-7" />;
      case "balance":
        return <Activity className="h-7 w-7" />;
      case "controller":
        return <Cog className="h-7 w-7" />;
      case "set":
        return <CircleDot className="h-7 w-7" />;
      case "case-study":
        return <Microscope className="h-7 w-7" />;
      case "logical-operator":
        return <GitFork className="h-7 w-7" />;

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

  const isVessel = () => {
    return [
      "tank", "column", "reactor", "cstr", "pfr", "batch-reactor", "fluidized-bed",
      "drum", "flash", "crystallizer", "evaporator", "converter", "stripper", "absorber",
      "distillation", "absorption-tower", "adsorber", "three-phase-separator", "component-splitter",
      "conversion-reactor", "equilibrium-reactor", "gibbs-reactor", "yield-shift-reactor"
    ].includes(type);
  };

  const isHeatExchanger = () => {
    return type === "heat-exchanger" || 
           type === "shell-tube-heat-exchanger" || 
           type === "shell-and-tube" || 
           type === "plate" || 
           type === "air-cooler" || 
           type === "reboiler" ||
           type === "condenser" ||
           type === "heater" ||
           type === "cooler" ||
           type === "plate-fin-exchanger" ||
           type === "spiral-heat-exchanger";
  };

  const hasVerticalConnections = () => {
    return [
      "column", "distillation", "absorption-tower", "short-cut-column", "stripper", 
      "absorber", "mixer-column"
    ].includes(type);
  };

  const isFlowController = () => {
    return [
      "valve", "pump", "compressor", "turbine", "tee", "divider", "splitter", 
      "ejector", "relief-valve", "check-valve", "generic-valve"
    ].includes(type);
  };

  const isMultiInputEquipment = () => {
    return [
      "mixer", "mixer-column", "blender", "mixer-settler"
    ].includes(type);
  };

  const isShellAndTube = () => {
    return type === "shell-tube-heat-exchanger" || 
           type === "shell-and-tube";
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

      <div className="absolute inset-0 pointer-events-none">
        {!hasVerticalConnections() && (
          <>
            <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-sm z-10"></div>
            <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-sm z-10"></div>
          </>
        )}

        {hasVerticalConnections() && (
          <>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-sm z-10"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-sm z-10"></div>
          </>
        )}

        {isVessel() && !hasVerticalConnections() && (
          <>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-sm z-10"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-sm z-10"></div>
          </>
        )}

        {isMultiInputEquipment() && (
          <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-[calc(50%+15px)] w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-sm z-10"></div>
        )}

        {isShellAndTube() && (
          <>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow-sm z-10"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow-sm z-10"></div>
          </>
        )}
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
      )}
      
      <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-200 group-hover:ring-flow-blue transition-all duration-300 opacity-0 group-hover:opacity-100 pointer-events-none"></div>
    </div>
  );
};

export default EquipmentCard;
