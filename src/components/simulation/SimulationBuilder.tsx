
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import EquipmentCard from '@/components/ui/equipment/EquipmentCard';

interface SimulationBuilderProps {
  selectedComponents: string[];
  thermodynamicModel: string;
  onRunSimulation?: () => void;
}

export const SimulationBuilder: React.FC<SimulationBuilderProps> = ({
  selectedComponents,
  thermodynamicModel,
  onRunSimulation
}) => {
  const [equipmentMetrics, setEquipmentMetrics] = useState([
    { key: "Temperature", value: "85°C" },
    { key: "Pressure", value: "150 kPa" },
    { key: "Flow", value: "1200 kg/h" }
  ]);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-gray-50 p-4 rounded-lg col-span-1">
        <h3 className="text-lg font-medium mb-3">Equipment Library</h3>
        <div className="grid grid-cols-2 gap-2">
          <EquipmentCard 
            type="reactor" 
            title="CSTR Reactor"
            onEdit={() => {}}
            metrics={equipmentMetrics}
            status="ready"
          />
          <EquipmentCard 
            type="column" 
            title="Distillation"
            onEdit={() => {}}
            metrics={equipmentMetrics}
            status="ready"
          />
          <EquipmentCard 
            type="heat-exchanger" 
            title="Heat Exchanger"
            onEdit={() => {}}
            metrics={equipmentMetrics}
            status="ready"
          />
          <EquipmentCard 
            type="pump" 
            title="Centrifugal Pump"
            onEdit={() => {}}
            metrics={equipmentMetrics}
            status="ready"
          />
        </div>
      </div>
      
      <div className="bg-white border border-dashed border-gray-300 p-4 rounded-lg col-span-2">
        <h3 className="text-lg font-medium mb-3">Process Canvas</h3>
        <div className="min-h-[300px] flex items-center justify-center">
          <p className="text-gray-400">Drag equipment here to build your process</p>
        </div>
      </div>
    </div>
  );
};

export default SimulationBuilder;
