import React, { useState } from "react";
import { Equipment } from "./types";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Edit, Link as LinkIcon } from "lucide-react";
import EquipmentDetail from "./EquipmentDetail";
import ConnectionPoint from "./ConnectionPoint";
import ParametersPanel from "./ParametersPanel";

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
  onDragStart: (id: string, e: React.MouseEvent) => void;
  onEditName: (id: string) => void;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveName: () => void;
  onConnect: (id: string) => void;
  onSelect: (id: string, handleId?: string) => void;
  onToggleDetails: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down' | 'left' | 'right') => void;
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
  const [isHovering, setIsHovering] = useState(false);
  
  if (!cell) {
    return (
      <div className={`h-32 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center`}>
        <span className="text-gray-400 text-sm">Empty Cell</span>
      </div>
    );
  }
  
  const handleSelect = () => {
    onSelect(cell.id);
  };

  const handleConnectionPointClick = (pointId: string) => {
    if (onConnectionPointClick) {
      onConnectionPointClick(cell.id, pointId);
    }
  };
  
  const handleParameterChange = (parameterId: string, value: any) => {
    if (onParameterChange) {
      onParameterChange(cell.id, parameterId, value);
    }
  };
  
  const cellBackground = isRunning 
    ? 'bg-green-50 border-green-200' 
    : isSelected 
      ? 'bg-blue-50 border-blue-300' 
      : 'bg-white border-gray-200';
  
  const rotateStyle = cell.rotation 
    ? { transform: `rotate(${cell.rotation}deg)` } 
    : {};
  
  const scaleStyle = cell.scale 
    ? { transform: `${rotateStyle.transform ? rotateStyle.transform + ' ' : ''}scale(${cell.scale})` } 
    : rotateStyle;
  
  if (showDetails === cell.id) {
    return (
      <EquipmentDetail 
        equipment={cell}
        onClose={() => onToggleDetails(cell.id)}
        onMove={onMove}
        onRotate={onRotate}
        onResize={onResize}
        allEquipment={allEquipment}
        onConnectEquipment={onConnectEquipment}
        onConnectionPointClick={handleConnectionPointClick}
        onParameterChange={handleParameterChange}
        isRunning={isRunning}
      />
    );
  }
  
  return (
    <div 
      className={`relative h-32 border-2 ${cellBackground} rounded-lg p-2 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center shadow-sm hover:shadow-md`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleSelect}
      onMouseDown={(e) => onDragStart(cell.id, e)}
    >
      <div className="relative w-16 h-16 flex items-center justify-center" style={scaleStyle}>
        {cell.icon && (
          <span className="text-4xl text-gray-700">{cell.icon}</span>
        )}
        
        <ConnectionPoint
          id="top"
          position="top"
          onClick={handleConnectionPointClick}
          isConnected={cell.connectedPoints?.includes("top")}
        />
        <ConnectionPoint
          id="right"
          position="right"
          onClick={handleConnectionPointClick}
          isConnected={cell.connectedPoints?.includes("right")}
        />
        <ConnectionPoint
          id="bottom"
          position="bottom"
          onClick={handleConnectionPointClick}
          isConnected={cell.connectedPoints?.includes("bottom")}
        />
        <ConnectionPoint
          id="left"
          position="left"
          onClick={handleConnectionPointClick}
          isConnected={cell.connectedPoints?.includes("left")}
        />
      </div>
      
      {editingName === cell.id ? (
        <div className="mt-2" onClick={(e) => e.stopPropagation()}>
          <input
            type="text"
            value={nameValue}
            onChange={onNameChange}
            onBlur={onSaveName}
            onKeyPress={(e) => e.key === 'Enter' && onSaveName()}
            className="text-xs p-1 border border-blue-300 rounded w-full text-center"
            autoFocus
          />
        </div>
      ) : (
        <div className="mt-2 text-center">
          <span className="text-xs font-medium text-gray-800">{cell.name || cell.type}</span>
        </div>
      )}
      
      {isHovering && !isRunning && (
        <div className="absolute top-1 right-1 flex space-x-1">
          <button
            className="p-1 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600"
            onClick={(e) => {
              e.stopPropagation();
              onEditName(cell.id);
            }}
          >
            <Edit className="h-3 w-3" />
          </button>
          
          <button
            className="p-1 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600"
            onClick={(e) => {
              e.stopPropagation();
              onConnect(cell.id);
            }}
          >
            <LinkIcon className="h-3 w-3" />
          </button>
          
          <button
            className="p-1 bg-blue-100 rounded-full hover:bg-blue-200 text-blue-600"
            onClick={(e) => {
              e.stopPropagation();
              onToggleDetails(cell.id);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      )}
      
      {isSelected && !isRunning && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <button
            className="p-1 bg-white rounded-full border border-gray-300 hover:bg-gray-100 text-gray-600 shadow-sm"
            onClick={(e) => {
              e.stopPropagation();
              onMove(cell.id, 'up');
            }}
          >
            <ChevronUp className="h-3 w-3" />
          </button>
        </div>
      )}
      
      {isSelected && !isRunning && (
        <div className="absolute top-1/2 -right-4 transform -translate-y-1/2">
          <button
            className="p-1 bg-white rounded-full border border-gray-300 hover:bg-gray-100 text-gray-600 shadow-sm"
            onClick={(e) => {
              e.stopPropagation();
              onMove(cell.id, 'right');
            }}
          >
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      )}
      
      {isSelected && !isRunning && (
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
          <button
            className="p-1 bg-white rounded-full border border-gray-300 hover:bg-gray-100 text-gray-600 shadow-sm"
            onClick={(e) => {
              e.stopPropagation();
              onMove(cell.id, 'down');
            }}
          >
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>
      )}
      
      {isSelected && !isRunning && (
        <div className="absolute top-1/2 -left-4 transform -translate-y-1/2">
          <button
            className="p-1 bg-white rounded-full border border-gray-300 hover:bg-gray-100 text-gray-600 shadow-sm"
            onClick={(e) => {
              e.stopPropagation();
              onMove(cell.id, 'left');
            }}
          >
            <ChevronLeft className="h-3 w-3" />
          </button>
        </div>
      )}
      
      {isRunning && (
        <div className="absolute top-1 left-1">
          <span className="flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
        </div>
      )}
    </div>
  );
};

export default GridCell;
