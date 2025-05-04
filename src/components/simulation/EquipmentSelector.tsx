
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";
import { EquipmentType, getEquipmentIcon } from "@/components/ui/equipment/EquipmentIcons";
import { 
  isVessel, 
  isHeatExchanger, 
  isFlowController, 
  isReactor, 
  isColumn,
  isSeparator,
  isUtility,
  isMassTransfer,
  isSolids,
  isStorageEquipment
} from "@/components/ui/equipment/EquipmentTypeCheckers";

interface EquipmentSelectorProps {
  onSelectEquipment: (equipmentType: EquipmentType) => void;
}

// Equipment categories and their items
const equipmentCategories = {
  reactors: [
    { type: "reactor", name: "General Reactor" },
    { type: "cstr", name: "CSTR" },
    { type: "pfr", name: "PFR" },
    { type: "batch-reactor", name: "Batch Reactor" },
    { type: "fluidized-bed", name: "Fluidized Bed" },
    { type: "fixed-bed", name: "Fixed Bed" },
    { type: "conversion-reactor", name: "Conversion Reactor" },
    { type: "equilibrium-reactor", name: "Equilibrium Reactor" },
    { type: "gibbs-reactor", name: "Gibbs Reactor" },
    { type: "yield-shift-reactor", name: "Yield Shift Reactor" },
    { type: "catalytic", name: "Catalytic Reactor" },
    { type: "stirred-tank-reactor", name: "Stirred Tank Reactor" },
    { type: "tubular-reactor", name: "Tubular Reactor" },
    { type: "packed-bed-reactor", name: "Packed Bed Reactor" },
    { type: "trickle-bed-reactor", name: "Trickle Bed Reactor" },
    { type: "bubble-column-reactor", name: "Bubble Column Reactor" },
    { type: "ebullated-bed-reactor", name: "Ebullated Bed Reactor" },
    { type: "moving-bed-reactor", name: "Moving Bed Reactor" },
    { type: "slurry-reactor", name: "Slurry Reactor" },
    { type: "multi-phase-reactor", name: "Multi-Phase Reactor" },
    { type: "loop-reactor", name: "Loop Reactor" },
    { type: "autoclave", name: "Autoclave" },
    { type: "fermentation-reactor", name: "Fermentation Reactor" },
    { type: "bioreactor", name: "Bioreactor" },
    { type: "fermenter", name: "Fermenter" },
    { type: "photochemical-reactor", name: "Photochemical Reactor" },
    { type: "electrochemical-reactor", name: "Electrochemical Reactor" },
    { type: "microreactor", name: "Microreactor" },
    { type: "plasma-reactor", name: "Plasma Reactor" },
    { type: "sonochemical-reactor", name: "Sonochemical Reactor" },
    { type: "rotating-disk-reactor", name: "Rotating Disk Reactor" }
  ],
  columns: [
    { type: "column", name: "General Column" },
    { type: "distillation", name: "Distillation Column" },
    { type: "absorption-tower", name: "Absorption Tower" },
    { type: "stripper", name: "Stripper" },
    { type: "tray-column", name: "Tray Column" },
    { type: "packed-bed", name: "Packed Bed" },
    { type: "packed-column", name: "Packed Column" },
    { type: "short-cut-column", name: "Short Cut Column" },
    { type: "three-phase-separator", name: "Three Phase Separator" },
    { type: "component-splitter", name: "Component Splitter" },
    { type: "bubble-column", name: "Bubble Column" },
    { type: "spray-column", name: "Spray Column" },
    { type: "sieve-tray-column", name: "Sieve Tray Column" },
    { type: "valve-tray-column", name: "Valve Tray Column" },
    { type: "baffle-tray-column", name: "Baffle Tray Column" },
    { type: "structured-packed-column", name: "Structured Packed Column" },
    { type: "random-packed-column", name: "Random Packed Column" },
    { type: "extractive-distillation-column", name: "Extractive Distillation" },
    { type: "azeotropic-distillation-column", name: "Azeotropic Distillation" },
    { type: "reactive-distillation-column", name: "Reactive Distillation" },
    { type: "pressure-swing-distillation-column", name: "Pressure Swing Distillation" },
    { type: "dividing-wall-column", name: "Dividing Wall Column" },
    { type: "debutanizer", name: "Debutanizer" },
    { type: "demethanizer", name: "Demethanizer" },
    { type: "deethanizer", name: "Deethanizer" },
    { type: "depropanizer", name: "Depropanizer" },
    { type: "scrubber", name: "Scrubber" }
  ],
  heatExchangers: [
    { type: "heat-exchanger", name: "Heat Exchanger" },
    { type: "shell-tube-heat-exchanger", name: "Shell & Tube Heat Exchanger" },
    { type: "plate", name: "Plate Heat Exchanger" },
    { type: "air-cooler", name: "Air Cooler" },
    { type: "reboiler", name: "Reboiler" },
    { type: "condenser", name: "Condenser" },
    { type: "heater", name: "Heater" },
    { type: "cooler", name: "Cooler" },
    { type: "plate-fin-exchanger", name: "Plate Fin Exchanger" },
    { type: "spiral-heat-exchanger", name: "Spiral Heat Exchanger" },
    { type: "double-pipe", name: "Double Pipe Exchanger" },
    { type: "u-tube-heat-exchanger", name: "U-Tube Heat Exchanger" },
    { type: "fixed-tube-heat-exchanger", name: "Fixed Tube Heat Exchanger" },
    { type: "floating-head-heat-exchanger", name: "Floating Head Heat Exchanger" },
    { type: "kettle-reboiler", name: "Kettle Reboiler" },
    { type: "thermosiphon-reboiler", name: "Thermosiphon Reboiler" },
    { type: "air-preheater", name: "Air Preheater" },
    { type: "waste-heat-boiler", name: "Waste Heat Boiler" },
    { type: "plate-and-frame", name: "Plate and Frame" },
    { type: "gasketed-plate", name: "Gasketed Plate" },
    { type: "welded-plate", name: "Welded Plate" },
    { type: "brazed-plate", name: "Brazed Plate" },
    { type: "regenerator", name: "Regenerator" },
    { type: "cooling-tower", name: "Cooling Tower" }
  ],
  separators: [
    { type: "flash", name: "Flash Drum" },
    { type: "cyclone", name: "Cyclone" },
    { type: "filter", name: "Filter" },
    { type: "adsorber", name: "Adsorber" },
    { type: "membrane", name: "Membrane Separator" },
    { type: "crystallizer", name: "Crystallizer" },
    { type: "decanter", name: "Decanter" },
    { type: "centrifuge", name: "Centrifuge" },
    { type: "gravity-separator", name: "Gravity Separator" },
    { type: "hydrocyclone", name: "Hydrocyclone" },
    { type: "electrostatic-precipitator", name: "Electrostatic Precipitator" },
    { type: "baghouse", name: "Baghouse" },
    { type: "filter-press", name: "Filter Press" },
    { type: "rotary-filter", name: "Rotary Filter" },
    { type: "pressure-filter", name: "Pressure Filter" },
    { type: "plate-frame-filter", name: "Plate Frame Filter" },
    { type: "sedimentation-tank", name: "Sedimentation Tank" },
    { type: "flotation-cell", name: "Flotation Cell" },
    { type: "molecular-sieve", name: "Molecular Sieve" },
    { type: "ion-exchange-column", name: "Ion Exchange Column" },
    { type: "magnetic-separator", name: "Magnetic Separator" },
    { type: "screen", name: "Screen" },
    { type: "sieve", name: "Sieve" },
    { type: "classifier", name: "Classifier" },
    { type: "settler", name: "Settler" },
    { type: "clarifier", name: "Clarifier" },
    { type: "thickener", name: "Thickener" },
    { type: "disk-stack-centrifuge", name: "Disk Stack Centrifuge" },
    { type: "basket-centrifuge", name: "Basket Centrifuge" }
  ],
  pressureFlow: [
    { type: "pump", name: "Pump" },
    { type: "compressor", name: "Compressor" },
    { type: "valve", name: "Valve" },
    { type: "turbine", name: "Turbine" },
    { type: "tee", name: "Tee" },
    { type: "divider", name: "Divider" },
    { type: "splitter", name: "Splitter" },
    { type: "mixer", name: "Mixer" },
    { type: "expander", name: "Expander" },
    { type: "ejector", name: "Ejector" },
    { type: "relief-valve", name: "Relief Valve" },
    { type: "check-valve", name: "Check Valve" },
    { type: "centrifugal-pump", name: "Centrifugal Pump" },
    { type: "reciprocating-pump", name: "Reciprocating Pump" },
    { type: "gear-pump", name: "Gear Pump" },
    { type: "diaphragm-pump", name: "Diaphragm Pump" },
    { type: "metering-pump", name: "Metering Pump" },
    { type: "peristaltic-pump", name: "Peristaltic Pump" },
    { type: "rotary-pump", name: "Rotary Pump" },
    { type: "axial-compressor", name: "Axial Compressor" },
    { type: "centrifugal-compressor", name: "Centrifugal Compressor" },
    { type: "reciprocating-compressor", name: "Reciprocating Compressor" },
    { type: "screw-compressor", name: "Screw Compressor" },
    { type: "scroll-compressor", name: "Scroll Compressor" },
    { type: "control-valve", name: "Control Valve" },
    { type: "globe-valve", name: "Globe Valve" },
    { type: "gate-valve", name: "Gate Valve" },
    { type: "butterfly-valve", name: "Butterfly Valve" },
    { type: "ball-valve", name: "Ball Valve" },
    { type: "plug-valve", name: "Plug Valve" },
    { type: "diaphragm-valve", name: "Diaphragm Valve" },
    { type: "pinch-valve", name: "Pinch Valve" },
    { type: "pressure-regulator", name: "Pressure Regulator" },
    { type: "flow-meter", name: "Flow Meter" },
    { type: "orifice-plate", name: "Orifice Plate" },
    { type: "venturi-meter", name: "Venturi Meter" },
    { type: "rotameter", name: "Rotameter" },
    { type: "coriolis-meter", name: "Coriolis Meter" },
    { type: "magnetic-flow-meter", name: "Magnetic Flow Meter" },
    { type: "ultrasonic-flow-meter", name: "Ultrasonic Flow Meter" },
    { type: "turbine-meter", name: "Turbine Meter" }
  ],
  vessels: [
    { type: "tank", name: "Tank" },
    { type: "drum", name: "Drum" },
    { type: "container", name: "Container" },
    { type: "mixer-settler", name: "Mixer-Settler" },
    { type: "storage-tank", name: "Storage Tank" },
    { type: "floating-roof-tank", name: "Floating Roof Tank" },
    { type: "fixed-roof-tank", name: "Fixed Roof Tank" },
    { type: "spherical-tank", name: "Spherical Tank" },
    { type: "horizontal-tank", name: "Horizontal Tank" },
    { type: "vertical-tank", name: "Vertical Tank" },
    { type: "underground-tank", name: "Underground Tank" },
    { type: "pressure-vessel", name: "Pressure Vessel" },
    { type: "cryogenic-tank", name: "Cryogenic Tank" },
    { type: "day-tank", name: "Day Tank" },
    { type: "surge-tank", name: "Surge Tank" },
    { type: "buffer-tank", name: "Buffer Tank" },
    { type: "measuring-tank", name: "Measuring Tank" },
    { type: "agitated-vessel", name: "Agitated Vessel" }
  ],
  massTransfer: [
    { type: "extractor", name: "Extractor" },
    { type: "leacher", name: "Leacher" },
    { type: "adsorber", name: "Adsorber" },
    { type: "membrane", name: "Membrane" },
    { type: "ion-exchange", name: "Ion Exchange" },
    { type: "liquid-liquid-extraction", name: "Liquid-Liquid Extraction" },
    { type: "solvent-extraction", name: "Solvent Extraction" },
    { type: "supercritical-extraction", name: "Supercritical Extraction" },
    { type: "liquid-membrane", name: "Liquid Membrane" },
    { type: "gas-membrane", name: "Gas Membrane" },
    { type: "pervaporation", name: "Pervaporation" },
    { type: "gas-permeation", name: "Gas Permeation" },
    { type: "ultrafiltration", name: "Ultrafiltration" },
    { type: "microfiltration", name: "Microfiltration" },
    { type: "nanofiltration", name: "Nanofiltration" },
    { type: "reverse-osmosis", name: "Reverse Osmosis" },
    { type: "dialysis", name: "Dialysis" },
    { type: "electrodialysis", name: "Electrodialysis" },
    { type: "distillation-membrane", name: "Distillation Membrane" }
  ],
  solids: [
    { type: "crusher", name: "Crusher" },
    { type: "grinder", name: "Grinder" },
    { type: "mill", name: "Mill" },
    { type: "pulverizer", name: "Pulverizer" },
    { type: "screen", name: "Screen" },
    { type: "sieve", name: "Sieve" },
    { type: "classifier", name: "Classifier" },
    { type: "conveyor", name: "Conveyor" },
    { type: "elevator", name: "Elevator" },
    { type: "hopper", name: "Hopper" },
    { type: "bin", name: "Bin" },
    { type: "silo", name: "Silo" },
    { type: "feeder", name: "Feeder" },
    { type: "vibrating-feeder", name: "Vibrating Feeder" },
    { type: "screw-conveyor", name: "Screw Conveyor" },
    { type: "belt-conveyor", name: "Belt Conveyor" },
    { type: "pneumatic-conveyor", name: "Pneumatic Conveyor" },
    { type: "bucket-elevator", name: "Bucket Elevator" },
    { type: "dryer", name: "Dryer" },
    { type: "mixer", name: "Mixer" },
    { type: "blender", name: "Blender" },
    { type: "granulator", name: "Granulator" },
    { type: "tablet-press", name: "Tablet Press" },
    { type: "extruder", name: "Extruder" },
    { type: "pelletizer", name: "Pelletizer" },
    { type: "coating-pan", name: "Coating Pan" },
    { type: "fluidized-bed-dryer", name: "Fluidized Bed Dryer" }
  ],
  utility: [
    { type: "boiler", name: "Boiler" },
    { type: "furnace", name: "Furnace" },
    { type: "cooling-tower", name: "Cooling Tower" },
    { type: "air-compressor", name: "Air Compressor" },
    { type: "refrigeration-system", name: "Refrigeration System" },
    { type: "hvac", name: "HVAC" },
    { type: "chiller", name: "Chiller" },
    { type: "steam-generator", name: "Steam Generator" },
    { type: "waste-heat-recovery", name: "Waste Heat Recovery" },
    { type: "flare-stack", name: "Flare Stack" },
    { type: "incinerator", name: "Incinerator" },
    { type: "thermal-oxidizer", name: "Thermal Oxidizer" },
    { type: "stack", name: "Stack" },
    { type: "vent", name: "Vent" },
    { type: "silencer", name: "Silencer" },
    { type: "gas-holder", name: "Gas Holder" },
    { type: "water-treatment", name: "Water Treatment" },
    { type: "waste-water-treatment", name: "Waste Water Treatment" },
    { type: "desalination", name: "Desalination" },
    { type: "reverse-osmosis", name: "Reverse Osmosis" }
  ],
  other: [
    { type: "dryer", name: "Dryer" },
    { type: "extractor", name: "Extractor" },
    { type: "evaporator", name: "Evaporator" },
    { type: "crystallization", name: "Crystallization" },
    { type: "extruder", name: "Extruder" },
    { type: "disintegrator", name: "Disintegrator" },
    { type: "granulator", name: "Granulator" },
    { type: "homogenizer", name: "Homogenizer" },
    { type: "conveyor", name: "Conveyor" },
    { type: "calciner", name: "Calciner" },
    { type: "dehumidifier", name: "Dehumidifier" },
    { type: "cooling-tower", name: "Cooling Tower" },
    { type: "furnace", name: "Furnace" },
    { type: "boiler", name: "Boiler" },
    { type: "spray-dryer", name: "Spray Dryer" },
    { type: "freeze-dryer", name: "Freeze Dryer" },
    { type: "rotary-dryer", name: "Rotary Dryer" },
    { type: "tray-dryer", name: "Tray Dryer" },
    { type: "vacuum-dryer", name: "Vacuum Dryer" },
    { type: "fluidized-bed-dryer", name: "Fluidized Bed Dryer" },
    { type: "falling-film-evaporator", name: "Falling Film Evaporator" },
    { type: "rising-film-evaporator", name: "Rising Film Evaporator" },
    { type: "forced-circulation-evaporator", name: "Forced Circulation Evaporator" },
    { type: "multiple-effect-evaporator", name: "Multiple Effect Evaporator" },
    { type: "agitated-thin-film-evaporator", name: "Agitated Thin Film Evaporator" },
    { type: "vacuum-crystallizer", name: "Vacuum Crystallizer" },
    { type: "cooling-crystallizer", name: "Cooling Crystallizer" },
    { type: "melt-crystallizer", name: "Melt Crystallizer" },
    { type: "draft-tube-baffle-crystallizer", name: "Draft Tube Baffle Crystallizer" },
    { type: "oslo-crystallizer", name: "Oslo Crystallizer" }
  ]
};

// Flatten all equipment for search
const allEquipment = Object.values(equipmentCategories).flat();

const EquipmentSelector: React.FC<EquipmentSelectorProps> = ({ onSelectEquipment }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<keyof typeof equipmentCategories>("reactors");
  
  // Filter equipment based on search query
  const filteredEquipment = searchQuery.trim() !== "" 
    ? allEquipment.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.type.toLowerCase().includes(searchQuery.toLowerCase()))
    : equipmentCategories[activeCategory];

  return (
    <div className="bg-white p-4 rounded-lg border">
      <div className="flex items-center mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search equipment..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Tabs 
        defaultValue="reactors" 
        value={searchQuery ? "search" : activeCategory}
        onValueChange={(value) => {
          if (value !== "search") {
            setActiveCategory(value as keyof typeof equipmentCategories);
            setSearchQuery("");
          }
        }}
        className="space-y-4"
      >
        <TabsList className="grid grid-cols-3 md:grid-cols-9 mb-2 w-full max-w-full overflow-x-auto">
          <TabsTrigger value="reactors">Reactors</TabsTrigger>
          <TabsTrigger value="columns">Columns</TabsTrigger>
          <TabsTrigger value="heatExchangers">Heat Exchangers</TabsTrigger>
          <TabsTrigger value="separators">Separators</TabsTrigger>
          <TabsTrigger value="pressureFlow">Flow Control</TabsTrigger>
          <TabsTrigger value="vessels">Vessels</TabsTrigger>
          <TabsTrigger value="massTransfer">Mass Transfer</TabsTrigger>
          <TabsTrigger value="solids">Solids</TabsTrigger>
          <TabsTrigger value="utility">Utilities</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
          {searchQuery && <TabsTrigger value="search" className="hidden">Search</TabsTrigger>}
        </TabsList>

        {/* Search Results Tab Content */}
        <TabsContent value="search" className="m-0">
          <div className="flex items-center mb-2 justify-between">
            <h3 className="text-sm font-medium">Search Results</h3>
            <Badge variant="outline" className="text-xs">
              {filteredEquipment.length} item{filteredEquipment.length !== 1 ? 's' : ''}
            </Badge>
          </div>
          <ScrollArea className="h-[300px]">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {filteredEquipment.map((item) => (
                <EquipmentItem 
                  key={item.type} 
                  type={item.type as EquipmentType}
                  name={item.name}
                  onClick={() => onSelectEquipment(item.type as EquipmentType)}
                />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Generate tab content for each category */}
        {Object.entries(equipmentCategories).map(([category, items]) => (
          <TabsContent key={category} value={category} className="m-0">
            <ScrollArea className="h-[300px]">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {items.map((item) => (
                  <EquipmentItem 
                    key={item.type} 
                    type={item.type as EquipmentType}
                    name={item.name}
                    onClick={() => onSelectEquipment(item.type as EquipmentType)}
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

interface EquipmentItemProps {
  type: EquipmentType;
  name: string;
  onClick: () => void;
}

const EquipmentItem: React.FC<EquipmentItemProps> = ({ type, name, onClick }) => {
  // Determine icon color based on equipment type
  const getIconColor = () => {
    if (isReactor(type)) return "text-green-600";
    if (isColumn(type)) return "text-blue-600";
    if (isHeatExchanger(type)) return "text-red-600";
    if (isFlowController(type)) return "text-purple-600";
    if (isSeparator(type)) return "text-amber-600";
    if (isVessel(type)) return "text-slate-600";
    if (isUtility(type)) return "text-teal-600";
    if (isMassTransfer(type)) return "text-indigo-600";
    if (isSolids(type)) return "text-orange-600";
    return "text-gray-600";
  };

  return (
    <Button
      variant="outline"
      className="h-auto py-3 px-3 flex flex-col items-center justify-center text-center gap-2 hover:bg-gray-50"
      onClick={onClick}
    >
      <div className={`${getIconColor()}`}>
        {getEquipmentIcon(type)}
      </div>
      <span className="text-xs font-medium truncate max-w-full">{name}</span>
    </Button>
  );
};

export default EquipmentSelector;
