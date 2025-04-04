
import React from "react";
import { Equipment } from "./types";
import EquipmentDetail from "./EquipmentDetail";
import ConnectionPoint from "./ConnectionPoint";

interface GridCellProps {
  cell: Equipment | null;
  row: number;
  col: number;
  isSelected: boolean;
  isConnecting: boolean;
  isRunning: boolean;
  editingName: string | null;
  nameValue: string;
  showDetails: string | null;
  onDragStart?: (id: string, e: React.MouseEvent) => void;
  onEditName?: (id: string) => void;
  onNameChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveName?: () => void;
  onConnect?: (id: string) => void;
  onSelect?: (id: string) => void;
  onToggleDetails?: (id: string) => void;
  onMove?: (id: string, direction: 'up' | 'down' | 'left' | 'right') => void;
  onRotate?: (id: string, degrees: number) => void;
  onResize?: (id: string, scaleFactor: number) => void;
  allEquipment?: Equipment[];
  onConnectEquipment?: (id: string, handleId?: string) => void;
  onConnectionPointClick?: (equipmentId: string, pointId: string) => void;
  onParameterChange?: (equipmentId: string, parameterId: string, value: any) => void;
}

const GridCell: React.FC<GridCellProps> = ({
  cell,
  row,
  col,
  isSelected,
  isConnecting,
  isRunning,
  editingName,
  nameValue,
  showDetails,
  onDragStart,
  onEditName,
  onNameChange,
  onSaveName,
  onConnect,
  onSelect,
  onToggleDetails,
  onMove,
  onRotate,
  onResize,
  allEquipment,
  onConnectEquipment,
  onConnectionPointClick,
  onParameterChange
}) => {
  if (!cell) {
    return (
      <div className={`min-h-[120px] bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg flex items-center justify-center border border-dashed border-purple-200 ${isConnecting ? 'cursor-pointer opacity-75 hover:bg-purple-100 transition-colors' : ''}`}>
        {isConnecting ? (
          <div className="text-purple-400 text-sm font-medium text-center">Click to place equipment here</div>
        ) : (
          <div className="text-purple-300 text-xs text-center">Empty</div>
        )}
      </div>
    );
  }

  // Determine if this cell's equipment is currently being edited for its name
  const isEditing = editingName === cell.id;
  
  // Determine if the details panel should be shown for this equipment
  const isShowingDetails = showDetails === cell.id;
  
  // Define base styling for the equipment card
  let cardClasses = "relative flex flex-col items-center justify-between rounded-xl p-3 shadow-sm transition-all overflow-hidden";
  
  // Add conditional styling
  if (isSelected) {
    cardClasses += " ring-2 ring-blue-500";
  }
  
  if (isRunning) {
    cardClasses += " animate-pulse";
  }
  
  // Add custom colors based on equipment type
  let bgColorClass = "";
  switch (cell.type) {
    case "reactor":
      bgColorClass = "bg-gradient-to-br from-red-500 to-orange-500";
      break;
    case "distillation":
      bgColorClass = "bg-gradient-to-br from-blue-500 to-cyan-500";
      break;
    case "heatExchanger":
      bgColorClass = "bg-gradient-to-br from-yellow-500 to-orange-500";
      break;
    case "pump":
      bgColorClass = "bg-gradient-to-br from-green-500 to-emerald-500";
      break;
    case "valve":
      bgColorClass = "bg-gradient-to-br from-purple-500 to-pink-500";
      break;
    default:
      bgColorClass = "bg-gradient-to-br from-gray-500 to-gray-600";
  }
  
  cardClasses += ` ${bgColorClass}`;

  // Default connection points if none are provided
  const connectionPoints = cell.connectionPoints || [
    { id: 'top', position: 'top' },
    { id: 'right', position: 'right' },
    { id: 'bottom', position: 'bottom' },
    { id: 'left', position: 'left' }
  ];
  
  // Handle connection point click
  const handleConnectionPointClick = (equipmentId: string, pointId: string) => {
    if (onConnectionPointClick) {
      onConnectionPointClick(equipmentId, pointId);
    } else if (onConnectEquipment) {
      onConnectEquipment(equipmentId, pointId);
    }
  };
  
  return (
    <div className={cardClasses}>
      {/* Connection Points */}
      {connectionPoints.map(point => (
        <ConnectionPoint
          key={point.id}
          point={point}
          equipmentId={cell.id}
          onClick={handleConnectionPointClick}
          isConnecting={isConnecting}
        />
      ))}
      
      {/* Equipment Image/Icon */}
      <div 
        className="w-full cursor-move" 
        onMouseDown={(e) => onDragStart && onDragStart(cell.id, e)}
      >
        <div className="flex justify-between items-center mb-2">
          {/* Equipment Name (or Editing Input) */}
          {isEditing ? (
            <div className="w-full">
              <input
                type="text"
                value={nameValue}
                onChange={onNameChange}
                onBlur={onSaveName}
                onKeyDown={(e) => e.key === 'Enter' && onSaveName && onSaveName()}
                className="w-full px-2 py-1 text-sm rounded border border-gray-300 bg-white text-gray-800"
                autoFocus
              />
            </div>
          ) : (
            <div 
              className="font-medium text-white text-sm truncate cursor-pointer hover:underline" 
              onClick={() => onEditName && onEditName(cell.id)}
              title={cell.name}
            >
              {cell.name}
            </div>
          )}
        </div>
        
        {/* Equipment Icon/Image */}
        <div className="flex justify-center items-center h-12 my-1">
          <img 
            src={cell.icon || '/placeholder.svg'} 
            alt={cell.type} 
            className="max-h-full max-w-full object-contain"
          />
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="w-full flex justify-around mt-2">
        <button 
          onClick={() => onToggleDetails && onToggleDetails(cell.id)}
          className="text-xs bg-white bg-opacity-30 hover:bg-opacity-40 text-white px-2 py-1 rounded-md transition-colors"
        >
          {isShowingDetails ? 'Hide' : 'Details'}
        </button>
        
        <button 
          onClick={() => onConnect && onConnect(cell.id)}
          className={`text-xs px-2 py-1 rounded-md transition-colors ${
            isConnecting ? 'bg-white text-purple-700 font-medium' : 'bg-white bg-opacity-30 hover:bg-opacity-40 text-white'
          }`}
        >
          Connect
        </button>
      </div>
      
      {/* Equipment Details Panel */}
      {isShowingDetails && (
        <EquipmentDetail 
          equipment={cell}
          isRunning={isRunning}
          onClose={() => onToggleDetails && onToggleDetails(cell.id)}
          onMove={onMove}
          onRotate={onRotate}
          onResize={onResize}
          allEquipment={allEquipment || []}
          onConnectEquipment={onConnectEquipment}
          onParameterChange={onParameterChange}
        />
      )}
    </div>
  );
};

export default GridCell;
