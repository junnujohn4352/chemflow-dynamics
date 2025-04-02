
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EquipmentSelectorProps {
  onAddEquipment: (type: string) => void;
}

const EquipmentSelector: React.FC<EquipmentSelectorProps> = ({ onAddEquipment }) => {
  const equipmentTypes = [
    { id: 'reactor', name: 'Reactor' },
    { id: 'column', name: 'Column' },
    { id: 'heater', name: 'Heater' },
    { id: 'cooler', name: 'Cooler' },
    { id: 'pump', name: 'Pump' },
    { id: 'tank', name: 'Tank' },
    { id: 'valve', name: 'Valve' },
    { id: 'mixer', name: 'Mixer' },
    { id: 'splitter', name: 'Splitter' },
  ];

  return (
    <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-sm font-medium mb-3 text-gray-700">Add Equipment</h3>
      <div className="space-y-2">
        {equipmentTypes.map((type) => (
          <Button
            key={type.id}
            variant="outline"
            size="sm"
            className="w-full justify-start text-left font-normal"
            onClick={() => onAddEquipment(type.id)}
          >
            <PlusCircle className="mr-2 h-4 w-4 text-blue-500" />
            {type.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default EquipmentSelector;
