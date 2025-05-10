
import React from "react";
import { Beaker, Layers, Thermometer, ArrowRight, Pump, Zap, FlaskConical, Droplets, Gauge, Cylinder, Filter, Database } from "lucide-react";

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

interface EquipmentIconProps {
  className?: string;
}

export const ReactorIcon: React.FC<EquipmentIconProps> = ({ className }) => (
  <FlaskConical className={`h-6 w-6 text-green-600 ${className || ""}`} />
);

export const HeatExchangerIcon: React.FC<EquipmentIconProps> = ({ className }) => (
  <Thermometer className={`h-6 w-6 text-red-600 ${className || ""}`} />
);

export const DistillationIcon: React.FC<EquipmentIconProps> = ({ className }) => (
  <Layers className={`h-6 w-6 text-blue-600 ${className || ""}`} />
);

export const PumpIcon: React.FC<EquipmentIconProps> = ({ className }) => (
  <Pump className={`h-6 w-6 text-purple-600 ${className || ""}`} />
);

export const CompressorIcon: React.FC<EquipmentIconProps> = ({ className }) => (
  <Gauge className={`h-6 w-6 text-purple-600 ${className || ""}`} />
);

export const FlashIcon: React.FC<EquipmentIconProps> = ({ className }) => (
  <Droplets className={`h-6 w-6 text-amber-600 ${className || ""}`} />
);

export const VesselIcon: React.FC<EquipmentIconProps> = ({ className }) => (
  <Cylinder className={`h-6 w-6 text-slate-600 ${className || ""}`} />
);

export const PipeIcon: React.FC<EquipmentIconProps> = ({ className }) => (
  <ArrowRight className={`h-6 w-6 text-gray-600 ${className || ""}`} />
);

export const ValveIcon: React.FC<EquipmentIconProps> = ({ className }) => (
  <Zap className={`h-6 w-6 text-indigo-600 ${className || ""}`} />
);

export const MixerIcon: React.FC<EquipmentIconProps> = ({ className }) => (
  <Database className={`h-6 w-6 text-teal-600 ${className || ""}`} />
);

export const SplitterIcon: React.FC<EquipmentIconProps> = ({ className }) => (
  <Database className={`h-6 w-6 transform rotate-180 text-teal-600 ${className || ""}`} />
);

export const CoolerIcon: React.FC<EquipmentIconProps> = ({ className }) => (
  <Thermometer className={`h-6 w-6 text-blue-500 ${className || ""}`} />
);

export const HeaterIcon: React.FC<EquipmentIconProps> = ({ className }) => (
  <Thermometer className={`h-6 w-6 text-red-500 ${className || ""}`} />
);

export const ColumnIcon: React.FC<EquipmentIconProps> = ({ className }) => (
  <Layers className={`h-6 w-6 text-blue-700 ${className || ""}`} />
);

export const FeedIcon: React.FC<EquipmentIconProps> = ({ className }) => (
  <Database className={`h-6 w-6 text-green-700 ${className || ""}`} />
);

export const TankIcon: React.FC<EquipmentIconProps> = ({ className }) => (
  <Cylinder className={`h-6 w-6 text-slate-600 ${className || ""}`} />
);

export const FilterIcon: React.FC<EquipmentIconProps> = ({ className }) => (
  <Filter className={`h-6 w-6 text-amber-600 ${className || ""}`} />
);

export const getEquipmentIcon = (type: EquipmentType): JSX.Element => {
  switch (type) {
    case "reactor":
      return <ReactorIcon />;
    case "heat-exchanger":
      return <HeatExchangerIcon />;
    case "distillation":
      return <DistillationIcon />;
    case "pump":
      return <PumpIcon />;
    case "compressor":
      return <CompressorIcon />;
    case "flash":
      return <FlashIcon />;
    case "vessel":
      return <VesselIcon />;
    case "pipe":
      return <PipeIcon />;
    case "valve":
      return <ValveIcon />;
    case "mixer":
      return <MixerIcon />;
    case "splitter":
      return <SplitterIcon />;
    case "cooler":
      return <CoolerIcon />;
    case "heater":
      return <HeaterIcon />;
    case "column":
      return <ColumnIcon />;
    case "feed":
      return <FeedIcon />;
    case "tank":
      return <TankIcon />;
    case "filter":
      return <FilterIcon />;
    default:
      return <Beaker className="h-6 w-6 text-gray-600" />;
  }
};
