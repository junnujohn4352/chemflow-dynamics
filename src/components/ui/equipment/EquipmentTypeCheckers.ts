
import { EquipmentType } from "./EquipmentIcons";

/**
 * Checks if a string is a valid equipment type
 */
export const isValidEquipmentType = (type: string): type is EquipmentType => {
  const validTypes: EquipmentType[] = [
    "reactor", 
    "heat-exchanger", 
    "distillation", 
    "pump", 
    "compressor", 
    "flash", 
    "vessel", 
    "pipe", 
    "valve", 
    "mixer", 
    "splitter", 
    "cooler", 
    "heater",
    "column",
    "feed",
    "tank",
    "filter"
  ];
  
  return validTypes.includes(type as EquipmentType);
};

// Type checker functions used in EquipmentSelector.tsx
export const isVessel = (type: EquipmentType): boolean => {
  return ["vessel", "tank"].includes(type);
};

export const isHeatExchanger = (type: EquipmentType): boolean => {
  return ["heat-exchanger", "cooler", "heater"].includes(type);
};

export const isFlowController = (type: EquipmentType): boolean => {
  return ["pump", "compressor", "valve", "pipe", "mixer", "splitter"].includes(type);
};

export const isReactor = (type: EquipmentType): boolean => {
  return type === "reactor";
};

export const isColumn = (type: EquipmentType): boolean => {
  return ["column", "distillation"].includes(type);
};

export const isSeparator = (type: EquipmentType): boolean => {
  return ["flash", "filter"].includes(type);
};

export const isUtility = (type: EquipmentType): boolean => {
  return ["heater", "cooler"].includes(type);
};

export const isMassTransfer = (type: EquipmentType): boolean => {
  return ["distillation", "column"].includes(type);
};

export const isSolids = (type: EquipmentType): boolean => {
  return type === "filter";
};

export const isStorageEquipment = (type: EquipmentType): boolean => {
  return ["tank", "vessel"].includes(type);
};
