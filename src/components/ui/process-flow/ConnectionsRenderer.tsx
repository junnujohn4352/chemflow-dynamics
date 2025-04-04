
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
        
        const sourceBaseX = source.position.x * (cellWidth + margin);
        const sourceBaseY = source.position.y * (cellHeight + margin);
        const targetBaseX = target.position.x * (cellWidth + margin);
        const targetBaseY = target.position.y * (cellHeight + margin);

        // Calculate midpoint for curved path
        const midX = (sourceBaseX + targetBaseX) / 2;
        const midY = (sourceBaseY + targetBaseY) / 2;
        
        const pathId = `path-${conn.id}`;
        
        return (
          <g key={conn.id}>
            <path 
              id={pathId}
              d={`M ${sourceBaseX} ${sourceBaseY} Q ${midX} ${midY} ${targetBaseX} ${targetBaseY}`} 
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
                  path={`M ${sourceBaseX} ${sourceBaseY} Q ${midX} ${midY} ${targetBaseX} ${targetBaseY}`}
                />
              </circle>
            )}
            
            {conn.label && (
              <text
                x={midX}
                y={midY - 10}
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
