
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
        
        // Determine connection points
        let sourceX = sourceBaseX + (cellWidth / 2);
        let sourceY = sourceBaseY + (cellHeight / 2);
        let targetX = targetBaseX + (cellWidth / 2);
        let targetY = targetBaseY + (cellHeight / 2);
        
        // Adjust connection points based on relative positions
        if (Math.abs(targetBaseX - sourceBaseX) > Math.abs(targetBaseY - sourceBaseY)) {
          // Horizontal connection
          if (targetBaseX > sourceBaseX) {
            sourceX = sourceBaseX + cellWidth + dotOffset;
            targetX = targetBaseX - dotOffset;
          } else {
            sourceX = sourceBaseX - dotOffset;
            targetX = targetBaseX + cellWidth + dotOffset;
          }
          sourceY = sourceBaseY + (cellHeight / 2);
          targetY = targetBaseY + (cellHeight / 2);
        } else {
          // Vertical connection
          if (targetBaseY > sourceBaseY) {
            sourceY = sourceBaseY + cellHeight + dotOffset;
            targetY = targetBaseY - dotOffset;
          } else {
            sourceY = sourceBaseY - dotOffset;
            targetY = targetBaseY + cellHeight + dotOffset;
          }
          sourceX = sourceBaseX + (cellWidth / 2);
          targetX = targetBaseX + (cellWidth / 2);
        }
        
        // Calculate control points for curved paths
        const dx = targetX - sourceX;
        const dy = targetY - sourceY;
        const controlX1 = sourceX + dx * 0.25;
        const controlY1 = sourceY + dy * 0.25;
        const controlX2 = targetX - dx * 0.25;
        const controlY2 = targetY - dy * 0.25;
        
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
