
import React from 'react';
import { Button } from '@/components/ui/button';
import { FlaskConical, Database, PlusCircle, FileText } from 'lucide-react';

interface UnitOperationsTabProps {
  couscousUnits: string[];
}

const UnitOperationsTab: React.FC<UnitOperationsTabProps> = ({ couscousUnits }) => {
  return (
    <div className="border rounded-md p-4 mb-4">
      <h3 className="font-medium mb-3">COUSCOUS - CAPE-OPEN Unit Operations Simple</h3>
      <p className="text-sm text-gray-600 mb-4">
        Use the built-in unit operations for your process simulation.
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          "Mixer", "Splitter", "Pump", "Heat Exchanger", "Flash Separator",
          "Component Separator", "Reactor", "Distillation Column", "Valve",
          "Compressor", "Pipe Segment", "Heater", "Cooler", "Tank"
        ].map(unit => (
          <div key={unit} className="p-3 border rounded hover:bg-blue-50 cursor-pointer flex items-center">
            <FlaskConical className="h-4 w-4 mr-2 text-blue-500" />
            <span>{unit}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-4">
        <h4 className="font-medium mb-2">External Unit Operations</h4>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <PlusCircle className="h-4 w-4" />
            Add CAPE-OPEN Unit
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Database className="h-4 w-4" />
            Browse Repository
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            Documentation
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnitOperationsTab;
