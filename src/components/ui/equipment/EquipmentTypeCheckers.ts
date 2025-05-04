
import { EquipmentType } from "./EquipmentIcons";

export const isVessel = (type: EquipmentType): boolean => {
  return [
    "tank", "column", "reactor", "cstr", "pfr", "batch-reactor", "fluidized-bed",
    "drum", "flash", "crystallizer", "evaporator", "converter", "stripper", "absorber",
    "distillation", "absorption-tower", "adsorber", "three-phase-separator", "component-splitter",
    "conversion-reactor", "equilibrium-reactor", "gibbs-reactor", "yield-shift-reactor",
    "fixed-bed", "membrane", "catalytic", "packed-bed", "tray-column", "bioreactor",
    "fermenter", "dryer", "crushing-equipment", "grinding-equipment", "clarifier", "thickener",
    "decanter", "centrifuge", "electrostatic-precipitator", "baghouse", "cyclone", "scrubber",
    "filter-press", "rotary-filter", "pressure-filter", "plate-frame-filter", "sedimentation-tank",
    "flotation-cell", "hydrocyclone", "extractor", "leacher", "agitated-vessel", "storage-tank"
  ].includes(type);
};

export const isHeatExchanger = (type: EquipmentType): boolean => {
  return [
    "heat-exchanger", "shell-tube-heat-exchanger", "shell-and-tube", "plate", 
    "air-cooler", "reboiler", "condenser", "heater", "cooler", "plate-fin-exchanger", 
    "spiral-heat-exchanger", "double-pipe", "u-tube", "floating-head", "kettle-reboiler",
    "thermosiphon-reboiler", "air-preheater", "waste-heat-boiler", "plate-and-frame",
    "gasketed-plate", "welded-plate", "brazed-plate", "regenerator", "cooling-tower"
  ].includes(type);
};

export const hasVerticalConnections = (type: EquipmentType): boolean => {
  return [
    "column", "distillation", "absorption-tower", "short-cut-column", "stripper", 
    "absorber", "mixer-column", "tray-column", "packed-column", "spray-column", 
    "bubble-column", "sieve-tray-column", "valve-tray-column", "baffle-tray-column", 
    "structured-packed-column", "random-packed-column", "extractive-distillation-column", 
    "azeotropic-distillation-column", "reactive-distillation-column", "debutanizer", 
    "demethanizer", "deethanizer", "depropanizer", "debutanizer"
  ].includes(type);
};

export const isFlowController = (type: EquipmentType): boolean => {
  return [
    "valve", "pump", "compressor", "turbine", "tee", "divider", "splitter", 
    "ejector", "relief-valve", "check-valve", "generic-valve", "centrifugal-pump", 
    "reciprocating-pump", "gear-pump", "diaphragm-pump", "metering-pump", "peristaltic-pump", 
    "rotary-pump", "axial-compressor", "centrifugal-compressor", "reciprocating-compressor", 
    "screw-compressor", "scroll-compressor", "control-valve", "globe-valve", "gate-valve", 
    "butterfly-valve", "ball-valve", "plug-valve", "diaphragm-valve", "pinch-valve", 
    "pressure-regulator", "flow-meter", "orifice-plate", "venturi-meter", "rotameter", 
    "coriolis-meter", "magnetic-flow-meter", "ultrasonic-flow-meter", "turbine-meter"
  ].includes(type);
};

export const isMultiInputEquipment = (type: EquipmentType): boolean => {
  return [
    "mixer", "mixer-column", "blender", "mixer-settler", "in-line-mixer", "static-mixer", 
    "dynamic-mixer", "jet-mixer", "t-mixer", "tee-mixer", "agitated-mixer", "ribbon-mixer", 
    "paddle-mixer", "high-shear-mixer", "kneader-mixer", "disperser", "homogenizer"
  ].includes(type);
};

export const isShellAndTube = (type: EquipmentType): boolean => {
  return [
    "shell-tube-heat-exchanger", "shell-and-tube", "u-tube-heat-exchanger", 
    "fixed-tube-heat-exchanger", "floating-head-heat-exchanger", "kettle-reboiler"
  ].includes(type);
};

export const isPlateFin = (type: EquipmentType): boolean => {
  return ["plate-fin-exchanger", "brazed-plate-fin", "diffusion-bonded-plate-fin"].includes(type);
};

export const isSpiral = (type: EquipmentType): boolean => {
  return ["spiral-heat-exchanger", "spiral-tube"].includes(type);
};

export const isDoublePipe = (type: EquipmentType): boolean => {
  return ["double-pipe", "hairpin-heat-exchanger"].includes(type);
};

export const isPlateHeatExchanger = (type: EquipmentType): boolean => {
  return [
    "plate-heat-exchanger", "plate", "gasketed-plate", "welded-plate", 
    "brazed-plate", "plate-and-frame", "semi-welded-plate"
  ].includes(type);
};

export const isReactor = (type: EquipmentType): boolean => {
  return [
    "cstr", "pfr", "batch-reactor", "fluidized-bed", "fixed-bed", "membrane", 
    "catalytic", "conversion-reactor", "equilibrium-reactor", "gibbs-reactor", 
    "yield-shift-reactor", "stirred-tank-reactor", "tubular-reactor", "packed-bed-reactor", 
    "trickle-bed-reactor", "bubble-column-reactor", "ebullated-bed-reactor", 
    "moving-bed-reactor", "slurry-reactor", "multi-phase-reactor", "loop-reactor", 
    "autoclave", "fermentation-reactor", "photochemical-reactor", "electrochemical-reactor", 
    "microreactor", "plasma-reactor", "sonochemical-reactor", "rotating-disk-reactor"
  ].includes(type);
};

export const isColumn = (type: EquipmentType): boolean => {
  return [
    "distillation", "absorption", "stripping", "extraction", "adsorption", 
    "packed-bed", "tray-column", "scrubber", "bubble-column", "spray-column", 
    "sieve-tray-column", "valve-tray-column", "structured-packing-column", 
    "random-packing-column", "extractive-distillation-column", "reactive-distillation-column",
    "azeotropic-distillation-column", "pressure-swing-distillation-column", "dividing-wall-column"
  ].includes(type);
};

export const isSeparator = (type: EquipmentType): boolean => {
  return [
    "flash", "cyclone", "filter", "adsorber", "membrane", "crystallizer", "decanter", 
    "centrifuge", "gravity-separator", "hydrocyclone", "electrostatic-precipitator", 
    "baghouse", "scrubber", "filter-press", "rotary-filter", "pressure-filter", 
    "plate-frame-filter", "sedimentation-tank", "flotation-cell", "molecular-sieve", 
    "ion-exchange-column", "magnetic-separator", "screen", "sieve", "classifier", 
    "settler", "clarifier", "thickener", "disk-stack-centrifuge", "basket-centrifuge"
  ].includes(type);
};

export const isUtility = (type: EquipmentType): boolean => {
  return [
    "boiler", "furnace", "cooling-tower", "air-compressor", "refrigeration-system", 
    "hvac", "chiller", "steam-generator", "waste-heat-recovery", "flare-stack", 
    "incinerator", "thermal-oxidizer", "stack", "vent", "silencer", "gas-holder", 
    "water-treatment", "waste-water-treatment", "desalination", "reverse-osmosis"
  ].includes(type);
};

export const isMassTransfer = (type: EquipmentType): boolean => {
  return [
    "extractor", "leacher", "adsorber", "membrane", "ion-exchange", "liquid-liquid-extraction", 
    "solvent-extraction", "supercritical-extraction", "liquid-membrane", "gas-membrane", 
    "pervaporation", "gas-permeation", "ultrafiltration", "microfiltration", "nanofiltration", 
    "reverse-osmosis", "dialysis", "electrodialysis", "distillation-membrane"
  ].includes(type);
};

export const isSolids = (type: EquipmentType): boolean => {
  return [
    "crusher", "grinder", "mill", "pulverizer", "screen", "sieve", "classifier", "conveyor", 
    "elevator", "hopper", "bin", "silo", "feeder", "vibrating-feeder", "screw-conveyor", 
    "belt-conveyor", "pneumatic-conveyor", "bucket-elevator", "dryer", "mixer", "blender", 
    "granulator", "tablet-press", "extruder", "pelletizer", "coating-pan", "fluidized-bed-dryer"
  ].includes(type);
};

export const isStorageEquipment = (type: EquipmentType): boolean => {
  return [
    "tank", "drum", "container", "bin", "silo", "hopper", "storage-tank", "floating-roof-tank", 
    "fixed-roof-tank", "spherical-tank", "horizontal-tank", "vertical-tank", "underground-tank", 
    "pressure-vessel", "cryogenic-tank", "day-tank", "surge-tank", "buffer-tank", "measuring-tank"
  ].includes(type);
};
