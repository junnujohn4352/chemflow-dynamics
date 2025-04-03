
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
        const dotOffset = 8; // Offset for the connection dots
        
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
        
        // Determine connection points based on relative positions
        let sourceX, sourceY, targetX, targetY;
        
        // Calculate angle between centers
        const angleRad = Math.atan2(targetCenterY - sourceCenterY, targetCenterX - sourceCenterX);
        const angleDeg = (angleRad * 180) / Math.PI;
        
        // Determine which side of the source to connect from
        if (angleDeg >= -45 && angleDeg < 45) {
          // Connect from right side of source
          sourceX = sourceBaseX + cellWidth + dotOffset;
          sourceY = sourceCenterY;
        } else if (angleDeg >= 45 && angleDeg < 135) {
          // Connect from bottom of source
          sourceX = sourceCenterX;
          sourceY = sourceBaseY + cellHeight + dotOffset;
        } else if ((angleDeg >= 135 && angleDeg <= 180) || (angleDeg >= -180 && angleDeg < -135)) {
          // Connect from left side of source
          sourceX = sourceBaseX - dotOffset;
          sourceY = sourceCenterY;
        } else {
          // Connect from top of source
          sourceX = sourceCenterX;
          sourceY = sourceBaseY - dotOffset;
        }
        
        // Determine which side of the target to connect to
        // We use the opposite angle for the target
        const targetAngleDeg = (angleDeg + 180) % 360;
        
        if (targetAngleDeg >= -45 && targetAngleDeg < 45) {
          // Connect to right side of target
          targetX = targetBaseX + cellWidth + dotOffset;
          targetY = targetCenterY;
        } else if (targetAngleDeg >= 45 && targetAngleDeg < 135) {
          // Connect to bottom of target
          targetX = targetCenterX;
          targetY = targetBaseY + cellHeight + dotOffset;
        } else if ((targetAngleDeg >= 135 && targetAngleDeg <= 180) || (targetAngleDeg >= -180 && targetAngleDeg < -135)) {
          // Connect to left side of target
          targetX = targetBaseX - dotOffset;
          targetY = targetCenterY;
        } else {
          // Connect to top of target
          targetX = targetCenterX;
          targetY = targetBaseY - dotOffset;
        }
        
        // Calculate control points for curved paths
        const dx = targetX - sourceX;
        const dy = targetY - sourceY;
        const controlX1 = sourceX + dx * 0.4;
        const controlY1 = sourceY + dy * 0.4;
        const controlX2 = targetX - dx * 0.4;
        const controlY2 = targetY - dy * 0.4;
        
        const pathId = `path-${conn.id}`;
        
        return (
          <g key={conn.id}>
            <path 
              id={pathId}
              d={`M ${sourceX} ${sourceY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${targetX} ${targetY}`} 
              fill="none" 
              stroke="#8B5CF6" 
              strokeWidth="2" 
              strokeDasharray="5,5"
              markerEnd="url(#arrowhead)"
            />
            
            {conn.animated && (
              <circle 
                r="4" 
                fill="#8B5CF6">
                <animateMotion 
                  dur="3s"
                  repeatCount="indefinite"
                  path={`M ${sourceX} ${sourceY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${targetX} ${targetY}`}
                />
              </circle>
            )}
            
            {conn.label && (
              <text
                x={(sourceX + targetX) / 2}
                y={(sourceY + targetY) / 2 - 10}
                textAnchor="middle"
                fill="#8B5CF6"
                fontSize="10"
                className="pointer-events-none"
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
