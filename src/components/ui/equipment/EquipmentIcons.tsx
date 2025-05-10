
import React from "react";
import { Beaker, Layers, Thermometer, ArrowRight, Zap, FlaskConical, Droplets, Gauge, Cylinder, Filter, Database, CircleDot } from "lucide-react";

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
  <div className={`relative equipment-icon ${className || ""}`}>
    <FlaskConical className="h-6 w-6 text-green-600" />
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <div className="w-4 h-4 rounded-full bg-gradient-to-br from-green-200 to-green-400 opacity-50 animate-pulse"></div>
    </div>
  </div>
);

export const HeatExchangerIcon: React.FC<EquipmentIconProps> = ({ className }) => (
  <div className={`relative equipment-icon ${className || ""}`}>
    <Thermometer className="h-6 w-6 text-red-600" />
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-3 h-5 bg-gradient-to-t from-blue-400 to-red-400 opacity-60 rounded-full"></div>
    </div>
  </div>
);

export const DistillationIcon: React.FC<EquipmentIconProps> = ({ className }) => (
  <div className={`relative equipment-icon ${className || ""}`}>
    <Layers className="h-6 w-6 text-blue-600" />
    <div className="absolute inset-0 flex flex-col justify-between py-1 px-2 pointer-events-none">
      <div className="h-1 w-full bg-blue-200 rounded-full opacity-50"></div>
      <div className="h-1 w-full bg-blue-300 rounded-full opacity-60"></div>
      <div className="h-1 w-full bg-blue-400 rounded-full opacity-70"></div>
    </div>
  </div>
);

export const PumpIcon: React.FC<EquipmentIconProps> = ({ className }) => (
  <div className={`relative equipment-icon ${className || ""}`}>
    <CircleDot className="h-6 w-6 text-purple-600" />
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-3 h-3 border-2 border-purple-400 rounded-full animate-spin opacity-70" style={{ animationDuration: '3s' }}></div>
    </div>
  </div>
);

export const CompressorIcon: React.FC<EquipmentIconProps> = ({ className }) => (
  <div className={`relative equipment-icon ${className || ""}`}>
    <Gauge className="h-6 w-6 text-purple-600" />
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-4 h-4 border-t-2 border-r-2 border-purple-500 rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
    </div>
  </div>
);

export const FlashIcon: React.FC<EquipmentIconProps> = ({ className }) => (
  <div className={`relative equipment-icon ${className || ""}`}>
    <Droplets className="h-6 w-6 text-amber-600" />
    <div className="absolute inset-0 flex items-end justify-center pb-1">
      <div className="w-4 h-2 bg-blue-300 rounded-t-lg opacity-50"></div>
    </div>
  </div>
);

export const VesselIcon: React.FC<EquipmentIconProps> = ({ className }) => (
  <div className={`relative equipment-icon ${className || ""}`}>
    <Cylinder className="h-6 w-6 text-slate-600" />
    <div className="absolute inset-x-0 bottom-1 h-2 bg-gradient-to-r from-blue-300 to-blue-400 opacity-40 rounded-b"></div>
  </div>
);

export const PipeIcon: React.FC<EquipmentIconProps> = ({ className }) => (
  <div className={`relative equipment-icon ${className || ""}`}>
    <ArrowRight className="h-6 w-6 text-gray-600" />
    <div className="absolute inset-y-0 left-0 right-0 flex items-center">
      <div className="h-1 w-full bg-blue-400 opacity-50 flow-animation"></div>
    </div>
  </div>
);

export const ValveIcon: React.FC<EquipmentIconProps> = ({ className }) => (
  <div className={`relative equipment-icon ${className || ""}`}>
    <Zap className="h-6 w-6 text-indigo-600" />
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-3 h-3 bg-indigo-200 rotate-45 opacity-50"></div>
    </div>
  </div>
);

export const MixerIcon: React.FC<EquipmentIconProps> = ({ className }) => (
  <div className={`relative equipment-icon ${className || ""}`}>
    <Database className="h-6 w-6 text-teal-600" />
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-4 h-4 border-2 border-dashed border-teal-400 rounded-full animate-spin opacity-70" style={{ animationDuration: '4s' }}></div>
    </div>
  </div>
);

export const SplitterIcon: React.FC<EquipmentIconProps> = ({ className }) => (
  <div className={`relative equipment-icon ${className || ""}`}>
    <Database className="h-6 w-6 transform rotate-180 text-teal-600" />
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-4 h-4 border-r-2 border-t-2 border-teal-400 rounded-full opacity-70 animate-ping" style={{ animationDuration: '4s' }}></div>
    </div>
  </div>
);

export const CoolerIcon: React.FC<EquipmentIconProps> = ({ className }) => (
  <div className={`relative equipment-icon ${className || ""}`}>
    <Thermometer className="h-6 w-6 text-blue-500" />
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-2 h-4 bg-gradient-to-b from-blue-300 to-blue-500 opacity-50 rounded-full"></div>
    </div>
  </div>
);

export const HeaterIcon: React.FC<EquipmentIconProps> = ({ className }) => (
  <div className={`relative equipment-icon ${className || ""}`}>
    <Thermometer className="h-6 w-6 text-red-500" />
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-2 h-4 bg-gradient-to-t from-red-300 to-red-500 opacity-50 rounded-full"></div>
    </div>
  </div>
);

export const ColumnIcon: React.FC<EquipmentIconProps> = ({ className }) => (
  <div className={`relative equipment-icon ${className || ""}`}>
    <Layers className="h-6 w-6 text-blue-700" />
    <div className="absolute inset-0 flex flex-col items-center justify-around py-1">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-1 w-3/4 bg-blue-300 opacity-50 rounded-full"></div>
      ))}
    </div>
  </div>
);

export const FeedIcon: React.FC<EquipmentIconProps> = ({ className }) => (
  <div className={`relative equipment-icon ${className || ""}`}>
    <Database className="h-6 w-6 text-green-700" />
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-4 h-3 bg-green-200 opacity-50 rounded-lg"></div>
    </div>
  </div>
);

export const TankIcon: React.FC<EquipmentIconProps> = ({ className }) => (
  <div className={`relative equipment-icon ${className || ""}`}>
    <Cylinder className="h-6 w-6 text-slate-600" />
    <div className="absolute inset-x-0 bottom-1 h-3 bg-blue-300 opacity-40 rounded-b animate-pulse" style={{ animationDuration: '4s' }}></div>
  </div>
);

export const FilterIcon: React.FC<EquipmentIconProps> = ({ className }) => (
  <div className={`relative equipment-icon ${className || ""}`}>
    <Filter className="h-6 w-6 text-amber-600" />
    <div className="absolute inset-x-0 top-2 bottom-1 flex flex-col items-center justify-around">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="h-0.5 w-3/4 bg-amber-300 opacity-50"></div>
      ))}
    </div>
  </div>
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
