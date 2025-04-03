
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
        
        const sourceX = (source.position.x * (cellWidth + margin)) + (cellWidth / 2);
        const sourceY = (source.position.y * (cellHeight + margin)) + (cellHeight / 2);
        
        const targetX = (target.position.x * (cellWidth + margin)) + (cellWidth / 2);
        const targetY = (target.position.y * (cellHeight + margin)) + (cellHeight / 2);
        
        const dx = targetX - sourceX;
        const dy = targetY - sourceY;
        
        const controlX1 = sourceX + dx * 0.3;
        const controlY1 = sourceY;
        const controlX2 = targetX - dx * 0.3;
        const controlY2 = targetY;
        
        // Create a unique ID for each path for animation reference
        const pathId = `path-${conn.id}`;
        
        return (
          <g key={conn.id}>
            {/* Path for the connection */}
            <path 
              id={pathId}
              d={`M ${sourceX} ${sourceY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${targetX} ${targetY}`} 
              fill="none" 
              stroke="#3b82f6" 
              strokeWidth="2" 
              strokeDasharray="5,5"
              markerEnd="url(#arrowhead)"
            />
            
            {/* Animated dot along the path */}
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
            
            {/* Connection label if provided */}
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
