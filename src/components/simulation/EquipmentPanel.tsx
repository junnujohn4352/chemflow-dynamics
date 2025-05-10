
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Layers, FlaskConical, Thermometer, Droplets, Zap, Beaker, ArrowRight, Cylinder, Database } from "lucide-react";
import EquipmentCard from "@/components/ui/equipment/EquipmentCard";
import { EquipmentType } from "@/components/ui/equipment/EquipmentIcons";
import { useToast } from "@/hooks/use-toast";

interface EquipmentPanelProps {
  onEquipmentSelect?: (type: EquipmentType) => void;
}

const EquipmentPanel: React.FC<EquipmentPanelProps> = ({ onEquipmentSelect }) => {
  const { toast } = useToast();
  
  const handleEquipmentSelect = (type: EquipmentType) => {
    if (onEquipmentSelect) {
      onEquipmentSelect(type);
    } else {
      toast({
        title: "Equipment Selected",
        description: `${type} has been selected. Drag it to the canvas.`
      });
    }
  };

  const equipmentCategories = [
    {
      title: "Reactors",
      icon: <FlaskConical className="h-5 w-5 text-green-600" />,
      equipment: [
        { type: "reactor", title: "CSTR" },
        { type: "reactor", title: "PFR" },
        { type: "reactor", title: "Batch" }
      ]
    },
    {
      title: "Columns",
      icon: <Layers className="h-5 w-5 text-blue-600" />,
      equipment: [
        { type: "distillation", title: "Distillation" },
        { type: "column", title: "Absorption" },
        { type: "column", title: "Stripping" }
      ]
    },
    {
      title: "Heat Exchangers",
      icon: <Thermometer className="h-5 w-5 text-red-600" />,
      equipment: [
        { type: "heat-exchanger", title: "Shell & Tube" },
        { type: "cooler", title: "Cooler" },
        { type: "heater", title: "Heater" }
      ]
    },
    {
      title: "Separators",
      icon: <Droplets className="h-5 w-5 text-purple-600" />,
      equipment: [
        { type: "flash", title: "Flash Drum" },
        { type: "filter", title: "Filter" }
      ]
    },
    {
      title: "Flow Control",
      icon: <ArrowRight className="h-5 w-5 text-indigo-600" />,
      equipment: [
        { type: "pump", title: "Pump" },
        { type: "compressor", title: "Compressor" },
        { type: "valve", title: "Control Valve" },
        { type: "mixer", title: "Mixer" },
        { type: "splitter", title: "Splitter" }
      ]
    },
    {
      title: "Vessels",
      icon: <Cylinder className="h-5 w-5 text-amber-600" />,
      equipment: [
        { type: "tank", title: "Storage Tank" },
        { type: "vessel", title: "Vessel" }
      ]
    },
    {
      title: "Mass Transfer",
      icon: <Database className="h-5 w-5 text-teal-600" />,
      equipment: [
        { type: "column", title: "Extraction" },
        { type: "vessel", title: "Absorption" }
      ]
    },
    {
      title: "Utilities",
      icon: <Zap className="h-5 w-5 text-yellow-600" />,
      equipment: [
        { type: "heater", title: "Boiler" },
        { type: "cooler", title: "Cooling Tower" }
      ]
    }
  ];

  return (
    <div className="space-y-6 overflow-auto max-h-[calc(100vh-300px)] pr-2 animate-fade-in">
      {equipmentCategories.map((category, idx) => (
        <Card key={idx} className="border-blue-200 shadow-md hover:shadow-blue-200 transition-all bg-gradient-to-br from-white to-blue-50">
          <CardHeader className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-t-lg py-3">
            <CardTitle className="flex items-center gap-2 text-blue-700 text-lg">
              {category.icon}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {category.title}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 pb-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {category.equipment.map((item, itemIdx) => (
                <div 
                  key={itemIdx} 
                  onClick={() => handleEquipmentSelect(item.type as EquipmentType)}
                  className="transform transition-transform hover:scale-105 cursor-grab active:cursor-grabbing"
                >
                  <EquipmentCard
                    type={item.type as EquipmentType}
                    title={item.title}
                    size="sm"
                    showConnections={true}
                    showDottedLines={false}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EquipmentPanel;
