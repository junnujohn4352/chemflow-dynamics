import {
  Flask2,
  Flame,
  Waves,
  Droplet,
  Compress,
  Zap,
  Cube,
  Pipe,
  SlidersHorizontal,
  MixerHorizontal,
  Split,
  Snowflake,
  Sun,
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
  | "heater";

export const getEquipmentIcon = (type: EquipmentType) => {
  switch (type) {
    case "reactor":
      return <Flame />;
    case "heat-exchanger":
      return <Waves />;
    case "distillation":
      return <Flask2 />;
    case "pump":
      return <Droplet />;
    case "compressor":
      return <Compress />;
    case "flash":
      return <Zap />;
    case "vessel":
      return <Cube />;
    case "pipe":
      return <Pipe />;
    case "valve":
      return <SlidersHorizontal />;
    case "mixer":
      return <MixerHorizontal />;
    case "splitter":
      return <Split />;
    case "cooler":
      return <Snowflake />;
    case "heater":
      return <Sun />;
    default:
      return null;
  }
};
