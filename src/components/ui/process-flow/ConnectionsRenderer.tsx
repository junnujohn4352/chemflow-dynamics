
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
  // Log connections for debugging
  React.useEffect(() => {
    if (connections.length > 0) {
      console.log("Current connections:", connections);
      connections.forEach(conn => {
        const source = equipment.find(e => e.id === conn.source);
        const target = equipment.find(e => e.id === conn.target);
        
        if (source && target) {
          console.log(`Connection from ${source.name || source.type} (${conn.sourceHandle}) to ${target.name || target.type} (${conn.targetHandle})`);
        }
      });
    }
  }, [connections, equipment]);

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
        
        // Calculate base positions (center of cells)
        const sourceBaseX = source.position.x * (cellWidth + margin) + (cellWidth / 2);
        const sourceBaseY = source.position.y * (cellHeight + margin) + (cellHeight / 2);
        const targetBaseX = target.position.x * (cellWidth + margin) + (cellWidth / 2);
        const targetBaseY = target.position.y * (cellHeight + margin) + (cellHeight / 2);

        // Get connection point positions
        const getConnectionPointOffset = (equipment: Equipment, pointId: string) => {
          const point = equipment.connectionPoints?.find(p => p.id === pointId);
          if (!point) return { x: 0, y: 0 };
          
          switch (point.position) {
            case "top": 
              return { x: 0, y: -cellHeight/2 };
            case "right": 
              return { x: cellWidth/2, y: 0 };
            case "bottom": 
              return { x: 0, y: cellHeight/2 };
            case "left": 
              return { x: -cellWidth/2, y: 0 };
            default: 
              return { x: 0, y: 0 };
          }
        };
        
        const sourceOffset = getConnectionPointOffset(source, conn.sourceHandle || 'right');
        const targetOffset = getConnectionPointOffset(target, conn.targetHandle || 'left');
        
        const startX = sourceBaseX + sourceOffset.x;
        const startY = sourceBaseY + sourceOffset.y;
        const endX = targetBaseX + targetOffset.x;
        const endY = targetBaseY + targetOffset.y;

        // Calculate midpoint for curved path
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;
        
        const pathId = `path-${conn.id}`;
        
        return (
          <g key={conn.id}>
            <path 
              id={pathId}
              d={`M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`} 
              fill="none" 
              stroke="#8B5CF6" 
              strokeWidth="3" 
              markerEnd="url(#arrowhead)"
              strokeDasharray={conn.dashed ? "5,5" : "none"}
            />
            
            {conn.animated && (
              <circle 
                r="5" 
                fill="#8B5CF6">
                <animateMotion 
                  dur="3s"
                  repeatCount="indefinite"
                  path={`M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`}
                />
              </circle>
            )}
            
            {conn.label && (
              <text
                x={midX}
                y={midY - 10}
                textAnchor="middle"
                fill="#8B5CF6"
                fontWeight="bold"
                fontSize="12"
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
