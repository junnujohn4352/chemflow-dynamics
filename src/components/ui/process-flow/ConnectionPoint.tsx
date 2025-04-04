
import React from "react";
import { ConnectionPoint as ConnectionPointType } from "./types";

interface ConnectionPointProps {
  point: ConnectionPointType;
  equipmentId: string;
  onClick: (equipmentId: string, pointId: string) => void;
  isConnecting: boolean;
}

const ConnectionPoint: React.FC<ConnectionPointProps> = ({ 
  point, 
  equipmentId,
  onClick,
  isConnecting
}) => {
  // Calculate position and size for connection point
  const getPositionStyle = () => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      backgroundColor: point.isConnected ? '#4CAF50' : '#9e86ed',
      border: '2px solid white',
      cursor: 'pointer',
      zIndex: 10,
      transition: 'transform 0.2s, background-color 0.2s',
    };

    // Add hover effect when connecting
    if (isConnecting) {
      baseStyle.transform = 'scale(1.2)';
      baseStyle.boxShadow = '0 0 0 2px rgba(158, 134, 237, 0.4)';
    }

    // Position the connection point based on its position property
    switch (point.position) {
      case 'top':
        return {
          ...baseStyle,
          top: '-6px',
          left: '50%',
          transform: `translateX(-50%) ${isConnecting ? 'scale(1.2)' : ''}`,
        };
      case 'right':
        return {
          ...baseStyle,
          top: '50%',
          right: '-6px',
          transform: `translateY(-50%) ${isConnecting ? 'scale(1.2)' : ''}`,
        };
      case 'bottom':
        return {
          ...baseStyle,
          bottom: '-6px',
          left: '50%',
          transform: `translateX(-50%) ${isConnecting ? 'scale(1.2)' : ''}`,
        };
      case 'left':
        return {
          ...baseStyle,
          top: '50%',
          left: '-6px',
          transform: `translateY(-50%) ${isConnecting ? 'scale(1.2)' : ''}`,
        };
      default:
        return baseStyle;
    }
  };

  return (
    <div
      className="connection-point"
      style={getPositionStyle()}
      onClick={() => onClick(equipmentId, point.id)}
      title={`Connect from ${point.position}${point.label ? `: ${point.label}` : ''}`}
    >
      {/* Add a tooltip or label if needed */}
    </div>
  );
};

export default ConnectionPoint;
