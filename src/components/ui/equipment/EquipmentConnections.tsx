
import React from "react";
import { EquipmentType } from "./EquipmentIcons";

// Add this connection points interface
interface EquipmentConnectionPoints {
  top?: string[];
  right?: string[];
  bottom?: string[];
  left?: string[];
}

interface EquipmentConnectionsProps {
  type: EquipmentType;
  onClick?: (point: string, e: React.MouseEvent) => void;
  activePoints?: string[];
  showDottedLines?: boolean;
}

// Connection point configurations for different equipment types
const connectionConfigs: Record<EquipmentType, EquipmentConnectionPoints> = {
  "reactor": {
    left: ["feed"],
    right: ["product"],
    top: ["vent"],
  },
  "heat-exchanger": {
    left: ["hot-in", "cold-in"],
    right: ["hot-out", "cold-out"],
  },
  "distillation": {
    top: ["vapor"],
    bottom: ["liquid"],
    left: ["feed"],
  },
  "pump": {
    left: ["suction"],
    right: ["discharge"],
  },
  "compressor": {
    left: ["inlet"],
    right: ["outlet"],
  },
  "flash": {
    top: ["vapor"],
    bottom: ["liquid"],
    left: ["feed"],
  },
  "vessel": { // This is causing the error - making sure it's properly included in EquipmentType
    top: ["vapor"],
    bottom: ["drain"],
    left: ["feed"],
    right: ["outlet"],
  },
  "pipe": {
    left: ["inlet"],
    right: ["outlet"],
  },
  "valve": {
    left: ["inlet"],
    right: ["outlet"],
  },
  "mixer": {
    left: ["inlet-1", "inlet-2"],
    right: ["outlet"],
  },
  "splitter": {
    left: ["inlet"],
    right: ["outlet-1", "outlet-2"],
  },
  "cooler": {
    left: ["inlet"],
    right: ["outlet"],
  },
  "heater": {
    left: ["inlet"],
    right: ["outlet"],
  },
};

const EquipmentConnections: React.FC<EquipmentConnectionsProps> = ({ 
  type,
  onClick,
  activePoints = [],
  showDottedLines = false
}) => {
  const config = connectionConfigs[type] || {};

  const handlePointClick = (point: string, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default navigation
    e.stopPropagation();
    if (onClick) {
      onClick(point, e);
    }
  };

  const renderConnectionPoints = (points: string[] | undefined, position: 'top' | 'right' | 'bottom' | 'left') => {
    if (!points || points.length === 0) return null;

    const positionStyles: Record<string, string> = {
      'top': 'top-0 left-0 w-full flex justify-around transform -translate-y-1/2',
      'right': 'top-0 right-0 h-full flex flex-col justify-around transform translate-x-1/2',
      'bottom': 'bottom-0 left-0 w-full flex justify-around transform translate-y-1/2',
      'left': 'top-0 left-0 h-full flex flex-col justify-around transform -translate-x-1/2'
    };

    return (
      <div className={`absolute ${positionStyles[position]} z-10`}>
        {points.map((point, index) => {
          const isActive = activePoints.includes(point);
          const pointKey = `${position}-${index}`;
          
          return (
            <div 
              key={pointKey}
              className={`w-3 h-3 rounded-full cursor-pointer ${isActive ? 'bg-blue-500' : 'bg-gray-300'} 
                border-2 border-white hover:scale-125 transition-transform`}
              onClick={(e) => handlePointClick(point, e)}
              data-connection={point}
            >
              {showDottedLines && isActive && (
                <div className={`absolute ${
                  position === 'left' ? 'w-8 h-1 right-3 top-1' :
                  position === 'right' ? 'w-8 h-1 left-3 top-1' :
                  position === 'top' ? 'h-8 w-1 bottom-3 left-1' :
                  'h-8 w-1 top-3 left-1'
                } bg-blue-200 z-[-1]`} />
              )}
              
              {/* Connection point tooltip */}
              <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded px-1 py-0.5 whitespace-nowrap z-50">
                {point}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Render connection points for each side */}
      {renderConnectionPoints(config.top, 'top')}
      {renderConnectionPoints(config.right, 'right')}
      {renderConnectionPoints(config.bottom, 'bottom')}
      {renderConnectionPoints(config.left, 'left')}
    </div>
  );
};

export default EquipmentConnections;
