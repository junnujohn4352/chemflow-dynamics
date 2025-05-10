
import React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import EquipmentCard from "@/components/ui/equipment/EquipmentCard";
import { EquipmentType } from "@/components/ui/equipment/EquipmentIcons";
import { 
  FlaskConical, 
  Layers, 
  Thermometer, 
  Gauge, 
  Droplets, 
  ArrowRight,
  Container,
  Filter
} from "lucide-react";

const HysysProcessEquipment: React.FC = () => {
  const { toast } = useToast();

  const handleEquipmentSelect = (type: EquipmentType) => {
    toast({
      title: `${type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')} Selected`,
      description: "Drag this equipment to the flowsheet",
    });
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, type: EquipmentType) => {
    e.dataTransfer.setData("equipment-type", type);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <Tabs defaultValue="thermal">
      <TabsList className="grid grid-cols-4 h-auto">
        <TabsTrigger value="thermal" className="text-xs py-1 px-2 h-auto">
          <Thermometer className="h-3 w-3 mr-1" />
          <span className="hidden sm:inline">Thermal</span>
        </TabsTrigger>
        <TabsTrigger value="reactors" className="text-xs py-1 px-2 h-auto">
          <FlaskConical className="h-3 w-3 mr-1" />
          <span className="hidden sm:inline">Reactors</span>
        </TabsTrigger>
        <TabsTrigger value="separators" className="text-xs py-1 px-2 h-auto">
          <Layers className="h-3 w-3 mr-1" />
          <span className="hidden sm:inline">Separators</span>
        </TabsTrigger>
        <TabsTrigger value="pressure" className="text-xs py-1 px-2 h-auto">
          <Gauge className="h-3 w-3 mr-1" />
          <span className="hidden sm:inline">Pressure</span>
        </TabsTrigger>
      </TabsList>

      <div className="mt-2">
        <TabsContent value="thermal">
          <ScrollArea className="h-[400px] pr-3">
            <div className="grid grid-cols-2 gap-2">
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, "heat-exchanger")}
                onClick={() => handleEquipmentSelect("heat-exchanger")}
              >
                <EquipmentCard
                  type="heat-exchanger"
                  title="Heat Exchanger"
                  size="sm"
                  metrics={[
                    { key: "duty", value: "500 kW" },
                    { key: "area", value: "10 m²" }
                  ]}
                />
              </div>
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, "heater")}
                onClick={() => handleEquipmentSelect("heater")}
              >
                <EquipmentCard
                  type="heater"
                  title="Heater"
                  size="sm"
                  metrics={[
                    { key: "duty", value: "250 kW" }
                  ]}
                />
              </div>
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, "cooler")}
                onClick={() => handleEquipmentSelect("cooler")}
              >
                <EquipmentCard
                  type="cooler"
                  title="Cooler"
                  size="sm"
                  metrics={[
                    { key: "duty", value: "-150 kW" }
                  ]}
                />
              </div>
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, "heat-exchanger")}
                onClick={() => handleEquipmentSelect("heat-exchanger")}
              >
                <EquipmentCard
                  type="heat-exchanger"
                  title="Air Cooler"
                  size="sm"
                  metrics={[
                    { key: "duty", value: "-200 kW" }
                  ]}
                />
              </div>
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, "heat-exchanger")}
                onClick={() => handleEquipmentSelect("heat-exchanger")}
              >
                <EquipmentCard
                  type="heat-exchanger"
                  title="Double Pipe"
                  size="sm"
                  metrics={[
                    { key: "duty", value: "75 kW" }
                  ]}
                />
              </div>
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, "heat-exchanger")}
                onClick={() => handleEquipmentSelect("heat-exchanger")}
              >
                <EquipmentCard
                  type="heat-exchanger"
                  title="LNG Exchanger"
                  size="sm"
                  metrics={[
                    { key: "duty", value: "-450 kW" }
                  ]}
                />
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="reactors">
          <ScrollArea className="h-[400px] pr-3">
            <div className="grid grid-cols-2 gap-2">
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, "reactor")}
                onClick={() => handleEquipmentSelect("reactor")}
              >
                <EquipmentCard
                  type="reactor"
                  title="CSTR"
                  size="sm"
                  metrics={[
                    { key: "conversion", value: "85%" },
                    { key: "volume", value: "5 m³" }
                  ]}
                />
              </div>
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, "reactor")}
                onClick={() => handleEquipmentSelect("reactor")}
              >
                <EquipmentCard
                  type="reactor"
                  title="PFR"
                  size="sm"
                  metrics={[
                    { key: "conversion", value: "92%" },
                    { key: "length", value: "10 m" }
                  ]}
                />
              </div>
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, "reactor")}
                onClick={() => handleEquipmentSelect("reactor")}
              >
                <EquipmentCard
                  type="reactor"
                  title="Gibbs Reactor"
                  size="sm"
                  metrics={[
                    { key: "temperature", value: "450°C" }
                  ]}
                />
              </div>
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, "reactor")}
                onClick={() => handleEquipmentSelect("reactor")}
              >
                <EquipmentCard
                  type="reactor"
                  title="Equilibrium"
                  size="sm"
                  metrics={[
                    { key: "temperature", value: "350°C" }
                  ]}
                />
              </div>
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, "reactor")}
                onClick={() => handleEquipmentSelect("reactor")}
              >
                <EquipmentCard
                  type="reactor"
                  title="Yield Shift"
                  size="sm"
                  metrics={[
                    { key: "yield", value: "78%" }
                  ]}
                />
              </div>
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, "reactor")}
                onClick={() => handleEquipmentSelect("reactor")}
              >
                <EquipmentCard
                  type="reactor"
                  title="Conversion"
                  size="sm"
                  metrics={[
                    { key: "conversion", value: "65%" }
                  ]}
                />
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="separators">
          <ScrollArea className="h-[400px] pr-3">
            <div className="grid grid-cols-2 gap-2">
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, "distillation")}
                onClick={() => handleEquipmentSelect("distillation")}
              >
                <EquipmentCard
                  type="distillation"
                  title="Distillation"
                  size="sm"
                  metrics={[
                    { key: "trays", value: "20" },
                    { key: "reflux", value: "1.5" }
                  ]}
                />
              </div>
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, "flash")}
                onClick={() => handleEquipmentSelect("flash")}
              >
                <EquipmentCard
                  type="flash"
                  title="Flash Tank"
                  size="sm"
                  metrics={[
                    { key: "temperature", value: "60°C" },
                    { key: "pressure", value: "150 kPa" }
                  ]}
                />
              </div>
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, "column")}
                onClick={() => handleEquipmentSelect("column")}
              >
                <EquipmentCard
                  type="column"
                  title="Absorber"
                  size="sm"
                  metrics={[
                    { key: "trays", value: "10" }
                  ]}
                />
              </div>
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, "column")}
                onClick={() => handleEquipmentSelect("column")}
              >
                <EquipmentCard
                  type="column"
                  title="Stripper"
                  size="sm"
                  metrics={[
                    { key: "trays", value: "8" }
                  ]}
                />
              </div>
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, "vessel")}
                onClick={() => handleEquipmentSelect("vessel")}
              >
                <EquipmentCard
                  type="vessel"
                  title="3-Phase Sep."
                  size="sm"
                  metrics={[
                    { key: "volume", value: "8 m³" }
                  ]}
                />
              </div>
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, "filter")}
                onClick={() => handleEquipmentSelect("filter")}
              >
                <EquipmentCard
                  type="filter"
                  title="Filter"
                  size="sm"
                  metrics={[
                    { key: "efficiency", value: "95%" }
                  ]}
                />
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="pressure">
          <ScrollArea className="h-[400px] pr-3">
            <div className="grid grid-cols-2 gap-2">
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, "pump")}
                onClick={() => handleEquipmentSelect("pump")}
              >
                <EquipmentCard
                  type="pump"
                  title="Pump"
                  size="sm"
                  metrics={[
                    { key: "power", value: "15 kW" },
                    { key: "efficiency", value: "75%" }
                  ]}
                />
              </div>
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, "compressor")}
                onClick={() => handleEquipmentSelect("compressor")}
              >
                <EquipmentCard
                  type="compressor"
                  title="Compressor"
                  size="sm"
                  metrics={[
                    { key: "power", value: "250 kW" },
                    { key: "ratio", value: "3.0" }
                  ]}
                />
              </div>
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, "valve")}
                onClick={() => handleEquipmentSelect("valve")}
              >
                <EquipmentCard
                  type="valve"
                  title="Valve"
                  size="sm"
                  metrics={[
                    { key: "pressure drop", value: "200 kPa" }
                  ]}
                />
              </div>
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, "compressor")}
                onClick={() => handleEquipmentSelect("compressor")}
              >
                <EquipmentCard
                  type="compressor"
                  title="Expander"
                  size="sm"
                  metrics={[
                    { key: "power", value: "-120 kW" },
                    { key: "efficiency", value: "80%" }
                  ]}
                />
              </div>
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, "pipe")}
                onClick={() => handleEquipmentSelect("pipe")}
              >
                <EquipmentCard
                  type="pipe"
                  title="Pipeline"
                  size="sm"
                  metrics={[
                    { key: "length", value: "100 m" }
                  ]}
                />
              </div>
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, "mixer")}
                onClick={() => handleEquipmentSelect("mixer")}
              >
                <EquipmentCard
                  type="mixer"
                  title="Mixer"
                  size="sm"
                />
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </div>
      
      <Card className="mt-4 p-3">
        <h3 className="text-sm font-medium mb-2 flex items-center">
          <Container className="h-4 w-4 mr-1.5" />
          Unit Operations
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <div
            draggable
            onDragStart={(e) => handleDragStart(e, "tank")}
            onClick={() => handleEquipmentSelect("tank")}
          >
            <EquipmentCard
              type="tank"
              title="Tank"
              size="sm"
            />
          </div>
          <div
            draggable
            onDragStart={(e) => handleDragStart(e, "feed")}
            onClick={() => handleEquipmentSelect("feed")}
          >
            <EquipmentCard
              type="feed"
              title="Feed"
              size="sm"
            />
          </div>
          <div
            draggable
            onDragStart={(e) => handleDragStart(e, "splitter")}
            onClick={() => handleEquipmentSelect("splitter")}
          >
            <EquipmentCard
              type="splitter"
              title="Tee"
              size="sm"
            />
          </div>
          <div
            draggable
            onDragStart={(e) => handleDragStart(e, "mixer")}
            onClick={() => handleEquipmentSelect("mixer")}
          >
            <EquipmentCard
              type="mixer"
              title="Mixer"
              size="sm"
            />
          </div>
        </div>
      </Card>
    </Tabs>
  );
};

export default HysysProcessEquipment;
