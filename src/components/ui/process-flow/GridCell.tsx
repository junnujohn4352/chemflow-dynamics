import React from "react";
import { cn } from "@/lib/utils";
import { Equipment } from "./types";
import EquipmentDetail from "./EquipmentDetail";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Edit2, Link, Info, RotateCw, RotateCcw, Maximize, Minimize } from "lucide-react";

interface GridCellProps {
  cell: Equipment | null;
  row: number;
  col: number;
  isSelected?: boolean;
  isConnecting?: boolean;
  isRunning?: boolean;
  editingName?: string | null;
  nameValue?: string;
  showDetails?: string | null;
  onDragStart?: (id: string, e: React.MouseEvent) => void;
  onEditName?: (id: string) => void;
  onNameChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveName?: () => void;
  onConnect?: (id: string) => void;
  onSelect?: (id: string, handleId?: string) => void;
  onToggleDetails?: (id: string) => void;
  onMove?: (id: string, direction: 'up' | 'down' | 'left' | 'right') => void;
  onRotate?: (id: string, degrees: number) => void;
  onResize?: (id: string, scaleFactor: number) => void;
  allEquipment?: Equipment[];
  onConnectEquipment?: (sourceId: string, targetId: string) => void;
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
  onConnectEquipment
}) => {
  
  if (!cell) {
    return <div className="w-30 h-30 border border-dashed border-gray-200 rounded-lg flex items-center justify-center"></div>;
  }
  
  const isEditing = editingName === cell.id;
  const isShowingDetails = showDetails === cell.id;
  
  const renderEquipmentIcon = () => {
    switch (cell.type) {
      case 'tank':
        return <div className="w-8 h-8 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center"><span className="text-xl">💧</span></div>;
      case 'pump':
        return <div className="w-8 h-8 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center"><span className="text-xl">⚙️</span></div>;
      case 'valve':
        return <div className="w-8 h-8 rounded-full bg-green-200 text-green-700 flex items-center justify-center"><span className="text-xl">🔀</span></div>;
      case 'heater':
        return <div className="w-8 h-8 rounded-full bg-red-200 text-red-700 flex items-center justify-center"><span className="text-xl">🔥</span></div>;
      case 'cooler':
        return <div className="w-8 h-8 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center"><span className="text-xl">🧊</span></div>;
      case 'column':
        return <div className="w-8 h-8 rounded-full bg-purple-200 text-purple-700 flex items-center justify-center"><span className="text-xl">⚗️</span></div>;
      case 'reactor':
        return <div className="w-8 h-8 rounded-full bg-pink-200 text-pink-700 flex items-center justify-center"><span className="text-xl">🧪</span></div>;
      case 'separator':
        return <div className="w-8 h-8 rounded-full bg-teal-200 text-teal-700 flex items-center justify-center"><span className="text-xl">⧖</span></div>;
      case 'product':
        return <div className="w-8 h-8 rounded-full bg-emerald-200 text-emerald-700 flex items-center justify-center"><span className="text-xl">📦</span></div>;
      case 'arrow':
        return <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center" style={{ transform: `rotate(${cell.rotation}deg) scale(${cell.scale})` }}><span className="text-xl">➔</span></div>;
      default:
        return <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center"><span className="text-xl">🏭</span></div>;
    }
  };
  
  const shouldShowArrowControls = cell.type === 'arrow';
  
  return (
    <div 
      className={cn(
        "w-30 h-30 border border-gray-200 rounded-lg relative p-2 transition-all glass-card overflow-hidden",
        isConnecting ? "ring-2 ring-offset-2 ring-indigo-500 cursor-none" : "",
        isSelected ? "ring-2 ring-offset-2 ring-blue-400" : "",
        isRunning && cell.status === 'running' ? "shadow-md" : "hover:shadow-md"
      )}
      draggable={!isEditing && !isShowingDetails}
      onDragStart={(e) => onDragStart?.(cell.id, e)}
      onClick={() => isConnecting && onSelect?.(cell.id)}
    >
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-r from-blue-500/30 to-indigo-500/30 rounded-full blur-xl"></div>
        <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-gradient-to-r from-green-500/30 to-teal-500/30 rounded-full blur-xl"></div>
      </div>
      
      <div className="absolute top-0 left-0 w-full h-1">
        <div 
          className={cn(
            "h-1 bg-gradient-to-r from-green-400 to-green-500",
            isRunning && cell.status === 'running' ? "animate-pulse" : "opacity-0"
          )}
        ></div>
      </div>
      
      <div className="flex flex-col h-full justify-between">
        <div>
          {isEditing ? (
            <div className="mb-2 flex">
              <input
                type="text"
                value={nameValue}
                onChange={onNameChange}
                className="text-xs w-full border border-blue-200 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-400"
                autoFocus
                onBlur={onSaveName}
                onKeyDown={(e) => e.key === 'Enter' && onSaveName?.()}
              />
            </div>
          ) : (
            <div className="flex justify-between items-start">
              <h4 className="text-xs font-medium truncate max-w-[70px] text-gray-700">
                {typeof cell.name === 'string' ? cell.name : String(cell.name)}
              </h4>
              <button
                onClick={() => onEditName?.(cell.id)}
                className="text-gray-400 hover:text-gray-700 p-0.5 rounded"
              >
                <Edit2 className="h-3 w-3" />
              </button>
            </div>
          )}
          
          <div className="flex justify-center mt-1 mb-2">
            {renderEquipmentIcon()}
          </div>
        </div>
        
        <div className="flex justify-between mt-auto">
          <div className="flex space-x-1">
            <button
              onClick={() => onToggleDetails?.(cell.id)}
              className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
            >
              <Info className="h-3 w-3" />
            </button>
            <button
              onClick={() => onConnect?.(cell.id)}
              className={cn(
                "p-1 hover:bg-indigo-50 rounded transition-colors",
                isConnecting && cell.id === isConnecting ? "text-indigo-600 bg-indigo-50" : "text-gray-400 hover:text-indigo-500"
              )}
            >
              <Link className="h-3 w-3" />
            </button>
          </div>
          
          <div className="flex space-x-1">
            {shouldShowArrowControls ? (
              <>
                <button
                  onClick={() => onRotate?.(cell.id, 45)}
                  className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
                >
                  <RotateCw className="h-3 w-3" />
                </button>
                <button
                  onClick={() => onRotate?.(cell.id, -45)}
                  className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
                >
                  <RotateCcw className="h-3 w-3" />
                </button>
                <button
                  onClick={() => onResize?.(cell.id, 0.2)}
                  className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
                >
                  <Maximize className="h-3 w-3" />
                </button>
                <button
                  onClick={() => onResize?.(cell.id, -0.2)}
                  className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
                >
                  <Minimize className="h-3 w-3" />
                </button>
              </>
            ) : (
              <div className="flex">
                <button
                  onClick={() => onMove?.(cell.id, 'up')}
                  className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                >
                  <ChevronUp className="h-3 w-3" />
                </button>
                <button
                  onClick={() => onMove?.(cell.id, 'down')}
                  className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                >
                  <ChevronDown className="h-3 w-3" />
                </button>
                <button
                  onClick={() => onMove?.(cell.id, 'left')}
                  className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                >
                  <ChevronLeft className="h-3 w-3" />
                </button>
                <button
                  onClick={() => onMove?.(cell.id, 'right')}
                  className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                >
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {isShowingDetails && (
        <EquipmentDetail
          equipment={cell}
          isRunning={isRunning || false}
          onClose={() => onToggleDetails?.(cell.id)}
          allEquipment={allEquipment}
          onConnectEquipment={onConnectEquipment}
        />
      )}
      
      {/* Connection points */}
      {isConnecting && cell.connectionPoints && (
        <div className="absolute inset-0 pointer-events-auto">
          {cell.connectionPoints.map(point => {
            const pointStyle: React.CSSProperties = {
              position: 'absolute',
              width: '12px',
              height: '12px',
              background: 'white',
              borderRadius: '50%',
              border: '2px solid #6366f1',
              zIndex: 10,
              cursor: 'pointer',
            };
            
            if (point.position === 'top') {
              pointStyle.top = '-6px';
              pointStyle.left = 'calc(50% - 6px)';
            } else if (point.position === 'right') {
              pointStyle.top = 'calc(50% - 6px)';
              pointStyle.right = '-6px';
            } else if (point.position === 'bottom') {
              pointStyle.bottom = '-6px';
              pointStyle.left = 'calc(50% - 6px)';
            } else if (point.position === 'left') {
              pointStyle.top = 'calc(50% - 6px)';
              pointStyle.left = '-6px';
            }
            
            return (
              <div
                key={point.id}
                style={pointStyle}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect?.(cell.id, point.position);
                }}
                className="hover:scale-110 hover:shadow-md transition-transform"
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GridCell;
