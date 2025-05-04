
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
