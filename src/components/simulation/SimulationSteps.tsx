
import React from 'react';
import { Check } from 'lucide-react';

interface SimulationStepsProps {
  componentsValid: boolean;
  selectedModel: string;
  isSimulationComplete: boolean;
}

const SimulationSteps: React.FC<SimulationStepsProps> = ({ 
  componentsValid, 
  selectedModel, 
  isSimulationComplete 
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center">
        <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
          componentsValid ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
        }`}>
          {componentsValid ? <Check className="h-4 w-4" /> : '1'}
        </div>
        <div className={`h-1 w-12 ${
          componentsValid ? 'bg-green-500' : 'bg-gray-200'
        }`}></div>
        <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
          selectedModel ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
        }`}>
          {selectedModel ? <Check className="h-4 w-4" /> : '2'}
        </div>
        <div className={`h-1 w-12 ${
          selectedModel ? 'bg-green-500' : 'bg-gray-200'
        }`}></div>
        <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
          isSimulationComplete ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
        }`}>
          {isSimulationComplete ? <Check className="h-4 w-4" /> : '3'}
        </div>
      </div>
    </div>
  );
};

export default SimulationSteps;
