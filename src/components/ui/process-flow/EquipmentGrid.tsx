
import React from "react";
import { Equipment, Connection } from "./types";
import GridCell from "./GridCell";
import ConnectionsRenderer from "./ConnectionsRenderer";

interface EquipmentGridProps {
  equipment: Equipment[];
  connections: Connection[];
  connectMode: string | null;
  editingName: string | null;
  tempName: string;
  showDetails: string | null;
  isRunning: boolean;
  onDragStart: (id: string, e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  onEditName: (id: string) => void;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveName: () => void;
  onConnect: (id: string) => void;
  onConnectionSelect: (id: string) => void;
  onToggleDetails: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down' | 'left' | 'right') => void;
  onCellClick?: (row: number, col: number) => void; // Add new prop for cell click
}

const EquipmentGrid: React.FC<EquipmentGridProps> = ({
  equipment,
  connections,
  connectMode,
  editingName,
  tempName,
  showDetails,
  isRunning,
  onDragStart,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
  onEditName,
  onNameChange,
  onSaveName,
  onConnect,
  onConnectionSelect,
  onToggleDetails,
  onMove,
  onCellClick, // Add handler to component props
}) => {
  // Create a 2D grid structure
  const grid = Array(5).fill(0).map(() => Array(3).fill(null));
  
  equipment.forEach(eq => {
    const { x, y } = eq.position;
    grid[y][x] = eq;
  });

  return (
    <div 
      className="grid grid-cols-3 gap-4 relative"
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      {grid.map((row, rowIndex) => (
        <React.Fragment key={`row-${rowIndex}`}>
          {row.map((eq, colIndex) => (
            <div key={`cell-${rowIndex}-${colIndex}`} className="min-h-[120px] flex items-center justify-center">
              <GridCell 
                equipment={eq}
                connectMode={connectMode}
                editingName={editingName}
                tempName={tempName}
                showDetails={showDetails}
                isRunning={isRunning}
                onDragStart={onDragStart}
                onEditName={onEditName}
                onNameChange={onNameChange}
                onSaveName={onSaveName}
                onConnect={onConnect}
                onConnectionSelect={onConnectionSelect}
                onToggleDetails={onToggleDetails}
                onMove={onMove}
                onDropClick={onCellClick ? () => onCellClick(rowIndex, colIndex) : undefined}
              />
            </div>
          ))}
        </React.Fragment>
      ))}
      
      <ConnectionsRenderer connections={connections} equipment={equipment} />
    </div>
  );
};

export default EquipmentGrid;
