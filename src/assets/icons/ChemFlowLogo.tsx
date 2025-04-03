
import React from 'react';
import { FlaskConical, Droplets } from 'lucide-react';

interface ChemFlowLogoProps {
  className?: string;
}

export const ChemFlowLogo: React.FC<ChemFlowLogoProps> = ({ className }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative mr-2">
        <FlaskConical className="h-6 w-6 text-flow-blue" />
        <Droplets className="h-4 w-4 text-flow-cyan absolute -bottom-1 -right-1" />
      </div>
      <span className="font-bold text-lg text-gray-800">ChemFlow</span>
    </div>
  );
};

// Export as default as well to support both import styles
export default ChemFlowLogo;
