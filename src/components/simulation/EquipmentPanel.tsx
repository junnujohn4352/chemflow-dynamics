
import React from "react";
import { motion } from "framer-motion";
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
        description: `${type.replace('-', ' ')} has been selected. Drag it to the canvas.`,
        variant: "default",
      });
    }
  };

  // Create a function to handle dataTransfer separately from Framer Motion events
  const handleDragStart = (type: string, e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("equipment-type", type);
    e.dataTransfer.effectAllowed = "copy";
  };

  const equipmentCategories = [
    {
      title: "Reactors",
      icon: <FlaskConical className="h-5 w-5 text-green-600" />,
      color: "from-green-100 to-green-50",
      equipment: [
        { type: "reactor", title: "CSTR" },
        { type: "reactor", title: "PFR" },
        { type: "reactor", title: "Batch" }
      ]
    },
    {
      title: "Columns",
      icon: <Layers className="h-5 w-5 text-blue-600" />,
      color: "from-blue-100 to-blue-50",
      equipment: [
        { type: "distillation", title: "Distillation" },
        { type: "column", title: "Absorption" },
        { type: "column", title: "Stripping" }
      ]
    },
    {
      title: "Heat Exchangers",
      icon: <Thermometer className="h-5 w-5 text-red-600" />,
      color: "from-red-100 to-red-50",
      equipment: [
        { type: "heat-exchanger", title: "Shell & Tube" },
        { type: "cooler", title: "Cooler" },
        { type: "heater", title: "Heater" }
      ]
    },
    {
      title: "Separators",
      icon: <Droplets className="h-5 w-5 text-purple-600" />,
      color: "from-purple-100 to-purple-50",
      equipment: [
        { type: "flash", title: "Flash Drum" },
        { type: "filter", title: "Filter" }
      ]
    },
    {
      title: "Flow Control",
      icon: <ArrowRight className="h-5 w-5 text-indigo-600" />,
      color: "from-indigo-100 to-indigo-50",
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
      color: "from-amber-100 to-amber-50",
      equipment: [
        { type: "tank", title: "Storage Tank" },
        { type: "vessel", title: "Vessel" }
      ]
    },
    {
      title: "Mass Transfer",
      icon: <Database className="h-5 w-5 text-teal-600" />,
      color: "from-teal-100 to-teal-50",
      equipment: [
        { type: "column", title: "Extraction" },
        { type: "vessel", title: "Absorption" }
      ]
    },
    {
      title: "Utilities",
      icon: <Zap className="h-5 w-5 text-yellow-600" />,
      color: "from-yellow-100 to-yellow-50",
      equipment: [
        { type: "heater", title: "Boiler" },
        { type: "cooler", title: "Cooling Tower" }
      ]
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="space-y-6 overflow-auto max-h-[calc(100vh-300px)] pr-2 hide-scrollbar"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {equipmentCategories.map((category, idx) => (
        <motion.div 
          key={idx}
          variants={item}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Card className={`border-blue-200 shadow-md transition-all duration-300 hover:shadow-blue-200/50 bg-gradient-to-br ${category.color}`}>
            <CardHeader className="bg-gradient-to-r from-blue-100/70 to-indigo-100/70 rounded-t-lg py-3">
              <CardTitle className="flex items-center gap-2 text-blue-700 text-lg">
                {category.icon}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {category.title}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3 pb-2">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {category.equipment.map((item, itemIdx) => {
                  // Use a regular div with onDragStart instead of using Framer Motion's drag handlers
                  return (
                    <motion.div 
                      key={itemIdx} 
                      onClick={() => handleEquipmentSelect(item.type as EquipmentType)}
                      className="cursor-grab active:cursor-grabbing relative"
                      whileHover={{ scale: 1.05, zIndex: 10 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: itemIdx * 0.1, duration: 0.3 }}
                    >
                      <div
                        draggable
                        onDragStart={(e) => handleDragStart(item.type, e)}
                      >
                        <EquipmentCard
                          type={item.type as EquipmentType}
                          title={item.title}
                          size="sm"
                          showConnections={true}
                          showDottedLines={false}
                          className="shadow-md hover:shadow-lg transition-shadow duration-300"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 to-transparent rounded-lg pointer-events-none"></div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default EquipmentPanel;
