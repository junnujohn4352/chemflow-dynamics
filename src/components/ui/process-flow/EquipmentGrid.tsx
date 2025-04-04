
import React from "react";
import { Equipment, Connection } from "./types";
import GridCell from "./GridCell";

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
  onConnectionSelect: (id: string, handleId?: string) => void;
  onToggleDetails: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down' | 'left' | 'right') => void;
  onCellClick: (row: number, col: number) => void;
  onRotate?: (id: string, degrees: number) => void;
  onResize?: (id: string, scaleFactor: number) => void;
  onConnectionPointClick?: (equipmentId: string, pointId: string) => void;
  onParameterChange?: (equipmentId: string, parameterId: string, value: any) => void;
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
  onCellClick,
  onRotate,
  onResize,
  onConnectionPointClick,
  onParameterChange
}) => {
  // Create a 5x3 grid
  const rows = 5;
  const cols = 3;
  
  // Generate the grid
  const grid = Array(rows).fill(null).map(() => Array(cols).fill(null));
  
  // Place equipment on the grid
  equipment.forEach(equip => {
    const { x, y } = equip.position;
    if (x >= 0 && x < cols && y >= 0 && y < rows) {
      grid[y][x] = equip;
    }
  });
  
  return (
    <div 
      className="relative bg-white shadow-sm rounded-xl border border-gray-200 p-3"
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      <div className="grid grid-cols-3 gap-3">
        {grid.map((row, rowIndex) => 
          row.map((cell, colIndex) => (
            <div 
              key={`${rowIndex}-${colIndex}`} 
              onClick={() => !cell && onCellClick(rowIndex, colIndex)}
              className="min-h-[120px]"
            >
              <GridCell 
                cell={cell}
                row={rowIndex}
                col={colIndex}
                isSelected={false}
                isConnecting={connectMode !== null}
                isRunning={isRunning}
                editingName={editingName}
                nameValue={tempName}
                showDetails={showDetails}
                onDragStart={onDragStart}
                onEditName={onEditName}
                onNameChange={onNameChange}
                onSaveName={onSaveName}
                onConnect={onConnect}
                onSelect={onConnectionSelect}
                onToggleDetails={onToggleDetails}
                onMove={onMove}
                onRotate={onRotate}
                onResize={onResize}
                allEquipment={equipment}
                onConnectEquipment={onConnectionSelect}
                onConnectionPointClick={onConnectionPointClick}
                onParameterChange={onParameterChange}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EquipmentGrid;
