
import React from "react";
import { 
  CircleOff, 
  Droplets, 
  Flame, 
  Gauge, 
  ThermometerIcon, 
  FlaskConical, 
  SquareStack,
  Container,
  ArrowUpDown,
  Filter,
  Blocks,
  GitFork,
  Waves,
  PipetteIcon,
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
  Hammer,
  Banana,
  AtSign,
  Columns,
  Microscope,
  TestTubeIcon,
  Network,
  Sparkles,
  ScrollIcon,
  PanelTop,
  Wind,
  SplitSquareVertical,
  Scan,
  LayersIcon,
  Orbit,
  Landmark,
  Box,
  Atom
} from "lucide-react";

// Define a consistent naming pattern without creating aliases that conflict with imports
// We'll just use the imported names directly
export type EquipmentType = 
  | "reactor" | "pump" | "valve" | "heater" | "condenser" | "column" | "tank" | "mixer" 
  | "heat-exchanger" | "filter" | "compressor" | "separator" | "cyclone" | "crystallizer" 
  | "evaporator" | "extractor" | "dryer" | "scrubber" | "batch-reactor" | "shell-and-tube"
  | "plate" | "air-cooler" | "reboiler" | "rotary" | "belt" | "spray" | "tray" | "absorber"
  | "stripper" | "flash" | "decanter" | "centrifuge" | "cooling-tower" | "furnace" | "turbine"
  | "cstr" | "pfr" | "absorption-tower" | "cooler" | "distillation" | "crystallization"
  | "extruder" | "disintegrator" | "expander" | "reformer" | "boiler" | "tee" | "sieve"
  | "hydrocyclone" | "gravity-separator" | "drum" | "clarifier" | "membrane" | "granulator"
  | "homogenizer" | "conveyor" | "drainer" | "agitator" | "fluidized-bed" | "fixed-bed"
  | "catalytic" | "adsorption" | "packed-bed" | "tray-column" | "blender" | "dehumidifier" 
  | "adsorber" | "quench" | "calciner" | "mixer-settler" | "ejector" | "wetted-wall"
  | "shell-tube-heat-exchanger" | "short-cut-column" | "three-phase-separator" 
  | "component-splitter" | "conversion-reactor" | "equilibrium-reactor" | "gibbs-reactor" 
  | "yield-shift-reactor" | "pipe-segment" | "liquid-liquid-extraction" | "spread-sheet" 
  | "makeup" | "recycle" | "ratio-control" | "adjust" | "balance" | "controller" | "set" 
  | "case-study" | "logical-operator" | "mixer-column" | "divider" | "splitter" 
  | "relief-valve" | "check-valve" | "plate-fin-exchanger" | "generic-valve" 
  | "spiral-heat-exchanger" | "double-pipe" | "plate-heat-exchanger";

export const getEquipmentIcon = (type: EquipmentType): React.ReactNode => {
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
      return <ThermometerIcon className="h-7 w-7" />;
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
      return <ThermometerIcon className="h-7 w-7" />;
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
      return <PipetteIcon className="h-7 w-7" />;
    case "dryer":
      return <ThermometerIcon className="h-7 w-7" />;
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
    
    case "fixed-bed":
      return <LayersIcon className="h-7 w-7" />;
    case "catalytic":
      return <Atom className="h-7 w-7" />;
    case "adsorption":
      return <PanelTop className="h-7 w-7" />;
    case "packed-bed":
      return <Box className="h-7 w-7" />;
    case "tray-column":
      return <SquareStack className="h-7 w-7" />;
    case "double-pipe":
      return <Cylinder className="h-7 w-7" />;
    case "plate-heat-exchanger":
      return <Package className="h-7 w-7" />;

    default:
      return <FlaskConical className="h-7 w-7" />;
  }
};
