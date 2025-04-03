
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
          <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
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
        
        // Determine start and end points based on relative positions
        let sourceX = sourceBaseX + (cellWidth / 2);
        let sourceY = sourceBaseY + (cellHeight / 2);
        let targetX = targetBaseX + (cellWidth / 2);
        let targetY = targetBaseY + (cellHeight / 2);
        
        // Adjust connection points to the sides
        if (targetBaseX > sourceBaseX) {
          // Target is to the right
          sourceX = sourceBaseX + cellWidth;
          targetX = targetBaseX;
        } else if (targetBaseX < sourceBaseX) {
          // Target is to the left
          sourceX = sourceBaseX;
          targetX = targetBaseX + cellWidth;
        }
        
        if (targetBaseY > sourceBaseY) {
          // Target is below
          sourceY = sourceBaseY + cellHeight;
          targetY = targetBaseY;
        } else if (targetBaseY < sourceBaseY) {
          // Target is above
          sourceY = sourceBaseY;
          targetY = targetBaseY + cellHeight;
        }
        
        const dx = targetX - sourceX;
        const dy = targetY - sourceY;
        
        // Adjust control points for smoother curves
        const controlX1 = sourceX + dx * 0.3;
        const controlY1 = sourceY;
        const controlX2 = targetX - dx * 0.3;
        const controlY2 = targetY;
        
        const pathId = `path-${conn.id}`;
        
        return (
          <g key={conn.id}>
            <path 
              id={pathId}
              d={`M ${sourceX} ${sourceY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${targetX} ${targetY}`} 
              fill="none" 
              stroke="#3b82f6" 
              strokeWidth="2" 
              strokeDasharray="5,5"
              markerEnd="url(#arrowhead)"
            />
            
            {conn.animated && (
              <circle 
                r="4" 
                fill="#3b82f6">
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
                fill="#3b82f6"
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
