
import React, { useState } from 'react';
import { ArrowRight, ChevronDown, ChevronUp, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FlowStreamProps {
  id: string;
  sourceId: string;
  targetId: string;
  label?: string;
  className?: string;
  animated?: boolean;
  onClick?: () => void;
  onSettingsClick?: () => void;
  parameters?: {
    flowRate?: number;
    temperature?: number;
    pressure?: number;
    phase?: string;
    composition?: Record<string, number>;
  };
}

const FlowStream: React.FC<FlowStreamProps> = ({
  id,
  sourceId,
  targetId,
  label,
  className,
  animated = true,
  onClick,
  onSettingsClick,
  parameters = {}
}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="relative group" onClick={onClick}>
      <div className={cn("flow-stream h-1 bg-blue-400 relative", className)}>
        {animated && (
          <div className="absolute inset-0 overflow-hidden">
            <div className="flow-stream-animation bg-white/70 h-full" style={{ width: '30%' }}></div>
          </div>
        )}
      </div>
      
      {label && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-6 z-10">
          <div className="bg-white/80 backdrop-blur-sm text-xs px-2 py-1 rounded border border-blue-100 shadow-sm whitespace-nowrap">
            {label}
          </div>
        </div>
      )}
      
      <button 
        className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-blue-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
        onClick={(e) => {
          e.stopPropagation();
          if (onSettingsClick) onSettingsClick();
        }}
      >
        <Settings className="h-3 w-3 text-white" />
      </button>
      
      <button
        className="absolute -right-10 top-1/2 transform -translate-y-1/2 bg-blue-50 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
        onClick={(e) => {
          e.stopPropagation();
          setShowDetails(!showDetails);
        }}
      >
        {showDetails ? (
          <ChevronUp className="h-3 w-3 text-blue-500" />
        ) : (
          <ChevronDown className="h-3 w-3 text-blue-500" />
        )}
      </button>
      
      {showDetails && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 mt-2 bg-white/90 backdrop-blur-sm rounded-lg border border-blue-100 shadow-lg p-3 z-20 min-w-[200px]">
          <div className="text-xs font-medium text-gray-700 mb-2">Stream Properties</div>
          
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Flow Rate:</span>
              <span className="font-medium">{parameters.flowRate?.toFixed(2) || '—'} kg/h</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-500">Temperature:</span>
              <span className="font-medium">{parameters.temperature?.toFixed(1) || '—'} °C</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-500">Pressure:</span>
              <span className="font-medium">{parameters.pressure?.toFixed(2) || '—'} bar</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-500">Phase:</span>
              <span className="font-medium">{parameters.phase || '—'}</span>
            </div>
            
            {parameters.composition && Object.keys(parameters.composition).length > 0 && (
              <div className="pt-1 border-t border-blue-50">
                <div className="text-gray-500 mb-1">Composition:</div>
                {Object.entries(parameters.composition).map(([component, value]) => (
                  <div key={component} className="flex justify-between pl-2">
                    <span className="text-gray-500">{component}:</span>
                    <span className="font-medium">{(value * 100).toFixed(2)}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="absolute top-1/2 right-0 transform translate-x-1 -translate-y-1/2">
        <ArrowRight className="h-3 w-3 text-blue-500" />
      </div>
    </div>
  );
};

export default FlowStream;
