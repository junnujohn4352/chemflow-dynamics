
import {
  FlaskConical,
  Flame,
  Waves,
  Droplet,
  Compass,
  Zap,
  Box,
  SlidersHorizontal,
  MoreHorizontal,
  Split,
  Snowflake,
  Sun,
  Beaker
} from "lucide-react";

export type EquipmentType = 
  | "reactor" 
  | "heat-exchanger" 
  | "distillation" 
  | "pump" 
  | "compressor" 
  | "flash" 
  | "vessel" 
  | "pipe" 
  | "valve" 
  | "mixer" 
  | "splitter" 
  | "cooler" 
  | "heater"
  | "column"
  | "feed"
  | "tank"
  | "filter";

export const getEquipmentIcon = (type: EquipmentType) => {
  switch (type) {
    case "reactor":
      return <Flame />;
    case "heat-exchanger":
      return <Waves />;
    case "distillation":
      return <FlaskConical />;
    case "column":
      return <FlaskConical />;
    case "pump":
      return <Droplet />;
    case "compressor":
      return <Compass />;
    case "flash":
      return <Zap />;
    case "vessel":
      return <Box />;
    case "pipe":
      return <SlidersHorizontal />; // Changed from Pipe to SlidersHorizontal as a fallback
    case "valve":
      return <SlidersHorizontal />;
    case "mixer":
      return <MoreHorizontal />;
    case "splitter":
      return <Split />;
    case "cooler":
      return <Snowflake />;
    case "heater":
      return <Sun />;
    case "feed":
      return <Droplet />;
    case "tank":
      return <Box />;
    case "filter":
      return <Beaker />;
    default:
      return null;
  }
};
