
import React, { useState } from "react";
import { Plus, Thermometer, Droplets, Settings2, Container, FlaskConical, Columns, Gauge } from "lucide-react";

interface SimulationBuilderProps {
  selectedComponents: string[];
  thermodynamicModel: string;
}

const SimulationBuilder: React.FC<SimulationBuilderProps> = ({ 
  selectedComponents,
  thermodynamicModel 
}) => {
  const [activeEquipment, setActiveEquipment] = useState<string | null>(null);
  
  const equipmentList = [
    { id: "feed", name: "Feed Stream", icon: <Droplets className="h-5 w-5" /> },
    { id: "mixer", name: "Mixer", icon: <Columns className="h-5 w-5" /> },
    { id: "splitter", name: "Splitter", icon: <Columns className="h-5 w-5 rotate-90" /> },
    { id: "heater", name: "Heater", icon: <Thermometer className="h-5 w-5" /> },
    { id: "cooler", name: "Cooler", icon: <Thermometer className="h-5 w-5" /> },
    { id: "flash", name: "Flash Separator", icon: <Container className="h-5 w-5" /> },
    { id: "column", name: "Distillation Column", icon: <FlaskConical className="h-5 w-5" /> },
    { id: "pump", name: "Pump", icon: <Gauge className="h-5 w-5" /> },
    { id: "reactor", name: "Reactor", icon: <FlaskConical className="h-5 w-5" /> },
  ];
  
  return (
    <div className="flex flex-col">
      <h2 className="text-xl font-medium mb-4">Flowsheet Builder</h2>
      <p className="text-gray-600 mb-6">
        Design your process flowsheet by adding unit operations and connecting streams.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Equipment palette */}
        <div className="col-span-1">
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
            <h3 className="font-medium mb-3">Equipment</h3>
            <div className="space-y-2">
              {equipmentList.map((equipment) => (
                <div
                  key={equipment.id}
                  className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors ${
                    activeEquipment === equipment.id
                      ? "bg-flow-blue/10 text-flow-blue"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveEquipment(equipment.id)}
                >
                  <div className="p-1.5 rounded bg-white mr-3 shadow-sm">
                    {equipment.icon}
                  </div>
                  <span className="text-sm">{equipment.name}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 border-t border-gray-200 pt-4">
              <h3 className="font-medium mb-3">Simulation Info</h3>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Components:</span>
                  <span className="font-medium">{selectedComponents.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Package:</span>
                  <span className="font-medium">{thermodynamicModel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Units:</span>
                  <span className="font-medium">SI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Flowsheet canvas */}
        <div className="col-span-1 md:col-span-3">
          <div className="bg-white rounded-lg border border-gray-200 h-[500px] flex flex-col relative">
            {/* Canvas toolbar */}
            <div className="p-3 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <button className="p-1.5 rounded hover:bg-gray-100 transition-colors">
                  <Plus className="h-4 w-4 text-gray-600" />
                </button>
                <div className="text-gray-600 text-sm">Zoom: 100%</div>
              </div>
              <button className="p-1.5 rounded hover:bg-gray-100 transition-colors">
                <Settings2 className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            
            {/* Empty canvas state */}
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center max-w-md">
                <div className="flex justify-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <Plus className="h-8 w-8 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-lg font-medium mb-2">Start Building Your Flowsheet</h3>
                <p className="text-gray-500 mb-4">
                  Select equipment from the palette and click on the canvas to place it. 
                  Connect equipment with streams to complete your process flow.
                </p>
                <p className="text-gray-500 text-sm">
                  {activeEquipment 
                    ? `Click on the canvas to place a ${equipmentList.find(e => e.id === activeEquipment)?.name}`
                    : "Select an equipment type from the palette to begin"}
                </p>
              </div>
            </div>
            
            {/* Canvas instructions */}
            <div className="absolute bottom-4 left-4 right-4 bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-700">
              <p>
                <strong>Tip:</strong> In a full version, you would be able to drag and drop equipment
                onto the canvas and connect them with streams by clicking and dragging between ports.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationBuilder;
