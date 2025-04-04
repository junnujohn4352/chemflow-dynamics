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
  onConnectionSelect: (id: string, handleId?: string) => void;
  onToggleDetails: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down' | 'left' | 'right') => void;
  onCellClick: (row: number, col: number) => void;
  onRotate?: (id: string, degrees: number) => void;
  onResize?: (id: string, scaleFactor: number) => void;
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
  onResize
}) => {
  const handleRotate = (id: string, degrees: number) => {
    if (onRotate) {
      onRotate(id, degrees);
    }
  };

  const handleResize = (id: string, scaleFactor: number) => {
    if (onResize) {
      onResize(id, scaleFactor);
    }
  };

  return (
    <div 
      className="relative border border-gray-200 rounded-lg shadow-inner bg-gray-50 w-[480px] mx-auto"
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      <ConnectionsRenderer connections={connections} equipment={equipment} />
      
      <div className="grid grid-cols-3 gap-2 p-2">
        {Array.from({ length: 15 }).map((_, index) => {
          const row = Math.floor(index / 3);
          const col = index % 3;
          const eq = equipment.find(e => e.position.x === col && e.position.y === row);
          
          return (
            <div 
              key={index}
              className="aspect-square bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              onClick={() => !eq && onCellClick(row, col)}
            >
              {eq && (
                <GridCell 
                  equipment={eq}
                  selectedEquipment={connectMode}
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
                  onRotate={handleRotate}
                  onResize={handleResize}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EquipmentGrid;
