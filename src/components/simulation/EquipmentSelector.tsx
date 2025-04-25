
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
  isColumn 
} from "@/components/ui/equipment/EquipmentTypeCheckers";

interface EquipmentSelectorProps {
  onSelectEquipment: (equipmentType: EquipmentType) => void;
}

// Equipment categories and their items
const equipmentCategories = {
  reactors: [
    { type: "cstr", name: "CSTR" },
    { type: "pfr", name: "PFR" },
    { type: "batch-reactor", name: "Batch Reactor" },
    { type: "fluidized-bed", name: "Fluidized Bed" },
    { type: "fixed-bed", name: "Fixed Bed" },
    { type: "conversion-reactor", name: "Conversion Reactor" },
    { type: "equilibrium-reactor", name: "Equilibrium Reactor" },
    { type: "gibbs-reactor", name: "Gibbs Reactor" },
    { type: "yield-shift-reactor", name: "Yield Shift Reactor" },
    { type: "catalytic", name: "Catalytic Reactor" }
  ],
  columns: [
    { type: "distillation", name: "Distillation Column" },
    { type: "absorption-tower", name: "Absorption Tower" },
    { type: "stripper", name: "Stripper" },
    { type: "tray-column", name: "Tray Column" },
    { type: "packed-bed", name: "Packed Bed" },
    { type: "short-cut-column", name: "Short Cut Column" },
    { type: "three-phase-separator", name: "Three Phase Separator" },
    { type: "component-splitter", name: "Component Splitter" }
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
    { type: "double-pipe", name: "Double Pipe Exchanger" }
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
    { type: "hydrocyclone", name: "Hydrocyclone" }
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
    { type: "check-valve", name: "Check Valve" }
  ],
  vessels: [
    { type: "tank", name: "Tank" },
    { type: "drum", name: "Drum" },
    { type: "container", name: "Container" },
    { type: "mixer-settler", name: "Mixer-Settler" }
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
    { type: "scrubber", name: "Scrubber" },
    { type: "dehumidifier", name: "Dehumidifier" },
    { type: "cooling-tower", name: "Cooling Tower" },
    { type: "furnace", name: "Furnace" },
    { type: "boiler", name: "Boiler" }
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
        <TabsList className="grid grid-cols-3 md:grid-cols-7 mb-2 w-full max-w-full overflow-x-auto">
          <TabsTrigger value="reactors">Reactors</TabsTrigger>
          <TabsTrigger value="columns">Columns</TabsTrigger>
          <TabsTrigger value="heatExchangers">Heat Exchangers</TabsTrigger>
          <TabsTrigger value="separators">Separators</TabsTrigger>
          <TabsTrigger value="pressureFlow">Pressure & Flow</TabsTrigger>
          <TabsTrigger value="vessels">Vessels</TabsTrigger>
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
    if (isVessel(type)) return "text-amber-600";
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
