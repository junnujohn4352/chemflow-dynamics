
import { EquipmentType } from "./EquipmentIcons";

export const isVessel = (type: EquipmentType): boolean => {
  return [
    "tank", "column", "reactor", "cstr", "pfr", "batch-reactor", "fluidized-bed",
    "drum", "flash", "crystallizer", "evaporator", "converter", "stripper", "absorber",
    "distillation", "absorption-tower", "adsorber", "three-phase-separator", "component-splitter",
    "conversion-reactor", "equilibrium-reactor", "gibbs-reactor", "yield-shift-reactor"
  ].includes(type);
};

export const isHeatExchanger = (type: EquipmentType): boolean => {
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

export const hasVerticalConnections = (type: EquipmentType): boolean => {
  return [
    "column", "distillation", "absorption-tower", "short-cut-column", "stripper", 
    "absorber", "mixer-column"
  ].includes(type);
};

export const isFlowController = (type: EquipmentType): boolean => {
  return [
    "valve", "pump", "compressor", "turbine", "tee", "divider", "splitter", 
    "ejector", "relief-valve", "check-valve", "generic-valve"
  ].includes(type);
};

export const isMultiInputEquipment = (type: EquipmentType): boolean => {
  return [
    "mixer", "mixer-column", "blender", "mixer-settler"
  ].includes(type);
};

export const isShellAndTube = (type: EquipmentType): boolean => {
  return type === "shell-tube-heat-exchanger" || 
         type === "shell-and-tube";
};

export const isPlateFin = (type: EquipmentType): boolean => {
  return type === "plate-fin-exchanger";
};

export const isSpiral = (type: EquipmentType): boolean => {
  return type === "spiral-heat-exchanger";
};
