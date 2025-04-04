
import React, { useState } from "react";
import { Equipment, Connection } from "./types";
import GridCell from "./GridCell";
import ConnectionsRenderer from "./ConnectionsRenderer";
import { Plus, Minus } from "lucide-react";

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
  const [zoom, setZoom] = useState(100);
  
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
  
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 150));
  };
  
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 70));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-end gap-2 mb-1">
        <button 
          onClick={handleZoomOut}
          className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
          disabled={zoom <= 70}
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="text-xs font-medium text-gray-500 flex items-center">
          {zoom}%
        </span>
        <button 
          onClick={handleZoomIn}
          className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
          disabled={zoom >= 150}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      
      <div 
        className="relative border border-gray-300 rounded-lg bg-gray-50 w-[400px] mx-auto overflow-hidden shadow-md"
        style={{
          backgroundImage: 'linear-gradient(rgba(100, 100, 100, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(100, 100, 100, 0.05) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          backgroundPosition: 'center center',
        }}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        <div 
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center', transition: 'transform 0.2s ease-out' }}
          className="relative"
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
      </div>
    </div>
  );
};

export default EquipmentGrid;
