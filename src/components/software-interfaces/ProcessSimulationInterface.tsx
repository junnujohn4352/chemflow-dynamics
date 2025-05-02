
import React from 'react';
import { Software } from '@/types/software';
import BaseSoftwareInterface from './BaseSoftwareInterface';

interface ProcessSimulationInterfaceProps {
  software: Software;
}

const ProcessSimulationInterface: React.FC<ProcessSimulationInterfaceProps> = ({ software }) => {
  return (
    <BaseSoftwareInterface software={software}>
      <div className="mt-4 border-t pt-4">
        <h5 className="font-medium mb-2">Process Simulation Features</h5>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="border rounded p-2 bg-blue-50">Material Balance</div>
          <div className="border rounded p-2 bg-blue-50">Energy Balance</div>
          <div className="border rounded p-2 bg-blue-50">Equipment Design</div>
          <div className="border rounded p-2 bg-blue-50">Thermodynamics</div>
        </div>
      </div>
    </BaseSoftwareInterface>
  );
};

export default ProcessSimulationInterface;
