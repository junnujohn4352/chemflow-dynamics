
import React from "react";
import { Connection, Equipment } from "./types";

interface ConnectionsRendererProps {
  connections: Connection[];
  equipment: Equipment[];
}

const ConnectionsRenderer: React.FC<ConnectionsRendererProps> = ({
  connections,
  equipment,
}) => {
  return (
    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
      <defs>
        <marker 
          id="arrowhead" 
          markerWidth="10" 
          markerHeight="7" 
          refX="9" 
          refY="3.5" 
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#8B5CF6" />
        </marker>
      </defs>
      
      {connections.map(conn => {
        const source = equipment.find(e => e.id === conn.source);
        const target = equipment.find(e => e.id === conn.target);
        
        if (!source || !target) return null;
        
        const cellWidth = 120;
        const cellHeight = 120;
        const margin = 12;
        
        // Calculate base positions
        const sourceBaseX = source.position.x * (cellWidth + margin);
        const sourceBaseY = source.position.y * (cellHeight + margin);
        const targetBaseX = target.position.x * (cellWidth + margin);
        const targetBaseY = target.position.y * (cellHeight + margin);
        
        // Calculate cell centers
        const sourceCenterX = sourceBaseX + (cellWidth / 2);
        const sourceCenterY = sourceBaseY + (cellHeight / 2);
        const targetCenterX = targetBaseX + (cellWidth / 2);
        const targetCenterY = targetBaseY + (cellHeight / 2);
        
        // Calculate angle between centers for proper arrow rotation
        const angleRad = Math.atan2(targetCenterY - sourceCenterY, targetCenterX - sourceCenterX);
        const angleDeg = (angleRad * 180) / Math.PI;
        
        // Calculate control points for curved paths - make smoother curves
        const dx = targetCenterX - sourceCenterX;
        const dy = targetCenterY - sourceCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Adjust curve strength based on distance
        const curveFactor = Math.min(0.4, distance / 500);
        
        const controlX1 = sourceCenterX + dx * 0.3;
        const controlY1 = sourceCenterY + dy * 0.3;
        const controlX2 = targetCenterX - dx * 0.3;
        const controlY2 = targetCenterY - dy * 0.3;
        
        const pathId = `path-${conn.id}`;
        
        return (
          <g key={conn.id}>
            <path 
              id={pathId}
              d={`M ${sourceCenterX} ${sourceCenterY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${targetCenterX} ${targetCenterY}`} 
              fill="none" 
              stroke="#8B5CF6" 
              strokeWidth="2" 
              markerEnd="url(#arrowhead)"
            />
            
            {conn.animated && (
              <circle 
                r="4" 
                fill="#8B5CF6">
                <animateMotion 
                  dur="3s"
                  repeatCount="indefinite"
                  path={`M ${sourceCenterX} ${sourceCenterY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${targetCenterX} ${targetCenterY}`}
                />
              </circle>
            )}
            
            {conn.label && (
              <text
                x={(sourceCenterX + targetCenterX) / 2}
                y={(sourceCenterY + targetCenterY) / 2 - 10}
                textAnchor="middle"
                fill="#8B5CF6"
                fontSize="10"
                className="pointer-events-none"
                transform={`rotate(${angleDeg < -90 || angleDeg > 90 ? angleDeg + 180 : angleDeg}, ${(sourceCenterX + targetCenterX) / 2}, ${(sourceCenterY + targetCenterY) / 2})`}
              >
                {conn.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

export default ConnectionsRenderer;
