
import React from "react";
import { Equipment } from "./types";
import { PencilLine, Settings, Link as LinkIcon, ArrowUpCircle, ArrowDownCircle, ArrowLeftCircle, ArrowRightCircle, RotateCw, RotateCcw, ZoomIn, ZoomOut, Info } from "lucide-react";
import EquipmentDetail from "./EquipmentDetail";

interface GridCellProps {
  equipment: Equipment;
  selectedEquipment: string | null;
  connectMode: string | null;
  editingName: string | null;
  tempName: string;
  showDetails: string | null;
  isRunning: boolean;
  onDragStart: (id: string, e: React.MouseEvent) => void;
  onEditName: (id: string) => void;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveName: () => void;
  onConnect: (id: string) => void;
  onConnectionSelect: (id: string, handleId?: string) => void;
  onToggleDetails: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down' | 'left' | 'right') => void;
  onRotate?: (id: string, degrees: number) => void;
  onResize?: (id: string, scaleFactor: number) => void;
}

const GridCell: React.FC<GridCellProps> = ({
  equipment,
  selectedEquipment,
  connectMode,
  editingName,
  tempName,
  showDetails,
  isRunning,
  onDragStart,
  onEditName,
  onNameChange,
  onSaveName,
  onConnect,
  onConnectionSelect,
  onToggleDetails,
  onMove,
  onRotate,
  onResize
}) => {
  const isEditing = editingName === equipment.id;
  const isSelected = selectedEquipment === equipment.id;
  const isConnectMode = connectMode === equipment.id;
  const isDetailVisible = showDetails === equipment.id;
  
  const getEquipmentIconColor = (type: string) => {
    switch (type) {
      case 'feed':
      case 'tank':
        return 'text-blue-500';
      case 'pump':
      case 'compressor':
        return 'text-indigo-500';
      case 'valve':
        return 'text-green-500';
      case 'heater':
      case 'furnace':
        return 'text-red-500';
      case 'cooler':
      case 'coolingTower':
        return 'text-blue-400';
      case 'separator':
      case 'filter':
        return 'text-teal-500';
      case 'column':
      case 'absorber':
      case 'flashDrum':
        return 'text-purple-500';
      case 'reactor':
      case 'cstr':
      case 'pfr':
        return 'text-pink-500';
      case 'mixer':
        return 'text-orange-500';
      case 'splitter':
        return 'text-indigo-600';
      case 'sensor':
        return 'text-cyan-500';
      case 'controller':
        return 'text-violet-500';
      case 'heatExchanger':
        return 'text-yellow-500';
      case 'product':
        return 'text-emerald-500';
      default:
        return 'text-gray-500';
    }
  };
  
  const getEquipmentBackgroundColor = (type: string) => {
    switch (type) {
      case 'feed':
      case 'tank':
        return 'bg-blue-100';
      case 'pump':
      case 'compressor':
        return 'bg-indigo-100';
      case 'valve':
        return 'bg-green-100';
      case 'heater':
      case 'furnace':
        return 'bg-red-100';
      case 'cooler':
      case 'coolingTower':
        return 'bg-blue-50';
      case 'separator':
      case 'filter':
        return 'bg-teal-100';
      case 'column':
      case 'absorber':
      case 'flashDrum':
        return 'bg-purple-100';
      case 'reactor':
      case 'cstr':
      case 'pfr':
        return 'bg-pink-100';
      case 'mixer':
        return 'bg-orange-100';
      case 'splitter':
        return 'bg-indigo-100';
      case 'sensor':
        return 'bg-cyan-100';
      case 'controller':
        return 'bg-violet-100';
      case 'heatExchanger':
        return 'bg-yellow-100';
      case 'product':
        return 'bg-emerald-100';
      default:
        return 'bg-gray-100';
    }
  };
  
  const renderEquipmentIcon = () => {
    const type = equipment.type;
    
    if (type === 'arrow') {
      return (
        <div 
          className="flex items-center justify-center h-16 w-16"
          style={{
            transform: `rotate(${equipment.rotation || 0}deg) scale(${equipment.scale || 1})`,
            transition: 'transform 0.3s ease-out'
          }}
        >
          <div className="relative w-12 h-4">
            <div className="absolute top-0 left-0 w-full h-full bg-gray-300 rounded-full"></div>
            <div className="absolute top-[-8px] right-[-8px] w-0 h-0 
              border-l-[10px] border-l-transparent
              border-b-[10px] border-b-gray-500
              border-r-[10px] border-r-transparent
              transform rotate-90"
            ></div>
          </div>
        </div>
      );
    }
    
    const iconClasses = `h-16 w-16 ${getEquipmentIconColor(type)}`;
    
    return (
      <div className={`w-20 h-20 rounded-full flex items-center justify-center ${getEquipmentBackgroundColor(type)} border ${isRunning ? 'animate-pulse' : ''}`}>
        <div className="text-center">
          <div className="equipment-icon">
            {type === 'tank' && (
              <div className="relative h-12 w-12 mx-auto">
                <div className="absolute inset-0 border-2 border-current rounded-md"></div>
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-current transition-all duration-500 rounded-sm"
                  style={{ 
                    height: `${equipment.metrics?.level ? Math.min(100, equipment.metrics.level) : 50}%`,
                    opacity: 0.3
                  }}
                ></div>
              </div>
            )}
            
            {(type === 'pump' || type === 'compressor') && (
              <div className="h-12 w-12 mx-auto">
                <div className="relative h-full w-full">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 border-2 border-current rounded-full"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-1 bg-current rounded-full"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-1 w-6 bg-current rounded-full"></div>
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-3 w-6 border-t-2 border-l-2 border-r-2 border-current rounded-t-md"></div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-3 w-6 border-b-2 border-l-2 border-r-2 border-current rounded-b-md"></div>
                </div>
              </div>
            )}
            
            {(type === 'heater' || type === 'cooler' || type === 'heatExchanger') && (
              <div className="h-12 w-12 mx-auto">
                <div className="relative h-full w-full">
                  <div className="absolute inset-0 border-2 border-current rounded-md"></div>
                  <div className="absolute top-2 left-2 right-2 bottom-2">
                    {type === 'heater' ? (
                      <div className="h-full w-full flex items-center justify-center">
                        <div className="h-1 w-8 bg-current"></div>
                        <div className="h-8 w-1 bg-current"></div>
                      </div>
                    ) : type === 'cooler' ? (
                      <div className="h-full w-full flex items-center justify-center">
                        <div className="h-1 w-8 bg-current"></div>
                      </div>
                    ) : (
                      <div className="h-full w-full flex flex-col items-center justify-center space-y-1">
                        <div className="h-1 w-6 bg-current"></div>
                        <div className="h-1 w-6 bg-current"></div>
                        <div className="h-1 w-6 bg-current"></div>
                        <div className="h-1 w-6 bg-current"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {type === 'valve' && (
              <div className="h-12 w-12 mx-auto">
                <div className="relative h-full w-full">
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-current transform -translate-y-1/2"></div>
                  <div className="absolute top-0 left-1/2 bottom-0 w-1 bg-current transform -translate-x-1/2"></div>
                  <div className="absolute top-1/2 left-1/2 h-6 w-6 border-2 border-current rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                </div>
              </div>
            )}
            
            {(type === 'column' || type === 'absorber' || type === 'flashDrum') && (
              <div className="h-12 w-12 mx-auto">
                <div className="relative h-full w-full">
                  <div className="absolute inset-0 border-2 border-current rounded-lg"></div>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div 
                      key={i}
                      className="absolute left-0 right-0 h-0.5 bg-current"
                      style={{
                        top: `${20 + i * 15}%`
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            )}
            
            {(type === 'reactor' || type === 'cstr' || type === 'pfr') && (
              <div className="h-12 w-12 mx-auto">
                <div className="relative h-full w-full">
                  {type === 'pfr' ? (
                    <div className="absolute inset-0 border-2 border-current rounded-full"></div>
                  ) : (
                    <div className="absolute inset-0 border-2 border-current rounded-md"></div>
                  )}
                  <div className="absolute inset-3 flex items-center justify-center">
                    {type === 'cstr' ? (
                      <div className="h-4 w-4 border-2 border-current rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
                    ) : (
                      <div className="h-4 w-4 border-2 border-current rounded-sm"></div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {(type === 'mixer' || type === 'splitter') && (
              <div className="h-12 w-12 mx-auto">
                <div className="relative h-full w-full">
                  <div className="absolute inset-0 border-2 border-current rounded-full"></div>
                  {type === 'mixer' ? (
                    <>
                      <div className="absolute top-1/2 left-0 w-3 h-1 bg-current transform -translate-y-1/2"></div>
                      <div className="absolute top-0 left-1/2 h-3 w-1 bg-current transform -translate-x-1/2"></div>
                      <div className="absolute top-1/2 right-0 w-3 h-1 bg-current transform -translate-y-1/2"></div>
                      <div className="absolute bottom-0 left-1/2 h-3 w-1 bg-current transform -translate-x-1/2"></div>
                    </>
                  ) : (
                    <>
                      <div className="absolute top-1/4 right-0 w-3 h-1 bg-current transform -translate-y-1/2"></div>
                      <div className="absolute top-3/4 right-0 w-3 h-1 bg-current transform -translate-y-1/2"></div>
                      <div className="absolute top-1/2 left-0 w-3 h-1 bg-current transform -translate-y-1/2"></div>
                    </>
                  )}
                </div>
              </div>
            )}
            
            {type === 'filter' && (
              <div className="h-12 w-12 mx-auto">
                <div className="relative h-full w-full">
                  <div className="absolute inset-0 border-2 border-current rounded-md"></div>
                  <div className="absolute inset-2 flex flex-col justify-around">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div 
                        key={i}
                        className="h-1 bg-current rounded-full"
                        style={{
                          opacity: 0.7
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {type === 'product' && (
              <div className="h-12 w-12 mx-auto">
                <div className="relative h-full w-full">
                  <div className="absolute inset-0 border-2 border-current rounded-lg"></div>
                  <div className="absolute top-1 left-1 right-1 h-2 border-b-2 border-current"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-current">
                    END
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div 
      className={`relative h-full w-full flex flex-col items-center justify-center ${isSelected ? 'bg-indigo-50' : isConnectMode ? 'bg-green-50' : ''}`}
      onMouseDown={(e) => onDragStart(equipment.id, e)}
    >
      {isConnectMode && (
        <div className="absolute inset-0 border-2 border-green-500 z-10 rounded-lg pointer-events-none"></div>
      )}
      
      {isSelected && !isConnectMode && (
        <div className="absolute inset-0 border-2 border-indigo-500 z-10 rounded-lg pointer-events-none"></div>
      )}
      
      <div className="flex flex-col items-center gap-1">
        {renderEquipmentIcon()}
        
        {isEditing ? (
          <div className="mt-1">
            <input
              type="text"
              value={tempName}
              onChange={onNameChange}
              onBlur={onSaveName}
              onKeyDown={(e) => e.key === 'Enter' && onSaveName()}
              autoFocus
              className="text-sm p-1 border rounded text-center w-24"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <span className="text-xs font-medium">{equipment.name}</span>
            {equipment.metrics && Object.keys(equipment.metrics).length > 0 && (
              <div className="text-xs text-gray-500 mt-0.5">
                {equipment.metrics.temperature && (
                  <span className="mr-1">{Math.round(equipment.metrics.temperature)}°C</span>
                )}
                {equipment.metrics.pressure && (
                  <span className="mr-1">{Math.round(equipment.metrics.pressure)} kPa</span>
                )}
                {equipment.metrics.flowRate && (
                  <span>{Math.round(equipment.metrics.flowRate)} kg/h</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="absolute bottom-1 right-1 flex gap-1">
        <button
          className="p-1 bg-blue-100 hover:bg-blue-200 rounded text-blue-700"
          onClick={() => onToggleDetails(equipment.id)}
          title="Equipment Details"
        >
          <Info className="h-3 w-3" />
        </button>
      </div>
      
      <div className="absolute bottom-1 left-1 flex gap-1">
        <button
          className="p-1 bg-purple-100 hover:bg-purple-200 rounded text-purple-700"
          onClick={() => onConnect(equipment.id)}
          title="Connect Equipment"
        >
          <LinkIcon className="h-3 w-3" />
        </button>
        <button
          className="p-1 bg-green-100 hover:bg-green-200 rounded text-green-700"
          onClick={() => onEditName(equipment.id)}
          title="Edit Name"
        >
          <PencilLine className="h-3 w-3" />
        </button>
      </div>
      
      {(connectMode && connectMode !== equipment.id) && (
        <div 
          className="absolute inset-0 bg-green-200 bg-opacity-20 cursor-pointer z-20"
          onClick={() => onConnectionSelect(equipment.id)}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-2 bg-white rounded-full shadow-md">
              <LinkIcon className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>
      )}
      
      {(equipment.connectionPoints && connectMode && connectMode !== equipment.id) && (
        <div className="absolute inset-0 z-30">
          {equipment.connectionPoints.map(point => {
            let style: React.CSSProperties = {};
            
            switch (point.position) {
              case 'top':
                style = { top: '0', left: '50%', transform: 'translate(-50%, -50%)' };
                break;
              case 'right':
                style = { top: '50%', right: '0', transform: 'translate(50%, -50%)' };
                break;
              case 'bottom':
                style = { bottom: '0', left: '50%', transform: 'translate(-50%, 50%)' };
                break;
              case 'left':
                style = { top: '50%', left: '0', transform: 'translate(-50%, -50%)' };
                break;
            }
            
            return (
              <div
                key={point.id}
                className="absolute w-5 h-5 bg-green-500 rounded-full cursor-pointer shadow-md z-30"
                style={style}
                onClick={() => onConnectionSelect(equipment.id, point.id)}
              ></div>
            );
          })}
        </div>
      )}
      
      {isDetailVisible && (
        <EquipmentDetail 
          equipment={equipment}
          isRunning={isRunning}
          onClose={() => onToggleDetails(equipment.id)} 
          allEquipment={[]}
          onConnectEquipment={() => {}}
        />
      )}
      
      <div className="absolute top-1 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <button
          className="p-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700"
          onClick={() => onMove(equipment.id, 'up')}
        >
          <ArrowUpCircle className="h-3 w-3" />
        </button>
      </div>
      
      <div className="absolute top-1/2 -translate-y-1/2 left-1 flex flex-col items-center">
        <button
          className="p-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700"
          onClick={() => onMove(equipment.id, 'left')}
        >
          <ArrowLeftCircle className="h-3 w-3" />
        </button>
      </div>
      
      <div className="absolute top-1/2 -translate-y-1/2 right-1 flex flex-col items-center">
        <button
          className="p-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700"
          onClick={() => onMove(equipment.id, 'right')}
        >
          <ArrowRightCircle className="h-3 w-3" />
        </button>
      </div>
      
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <button
          className="p-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700"
          onClick={() => onMove(equipment.id, 'down')}
        >
          <ArrowDownCircle className="h-3 w-3" />
        </button>
      </div>
      
      {equipment.type === 'arrow' && (
        <div className="absolute top-1 right-1 flex flex-col gap-1">
          <button
            className="p-1 bg-amber-100 hover:bg-amber-200 rounded text-amber-700"
            onClick={() => onRotate && onRotate(equipment.id, 45)}
            title="Rotate Clockwise"
          >
            <RotateCw className="h-3 w-3" />
          </button>
          <button
            className="p-1 bg-amber-100 hover:bg-amber-200 rounded text-amber-700"
            onClick={() => onRotate && onRotate(equipment.id, -45)}
            title="Rotate Counter-Clockwise"
          >
            <RotateCcw className="h-3 w-3" />
          </button>
          <button
            className="p-1 bg-blue-100 hover:bg-blue-200 rounded text-blue-700"
            onClick={() => onResize && onResize(equipment.id, 0.1)}
            title="Increase Size"
          >
            <ZoomIn className="h-3 w-3" />
          </button>
          <button
            className="p-1 bg-blue-100 hover:bg-blue-200 rounded text-blue-700"
            onClick={() => onResize && onResize(equipment.id, -0.1)}
            title="Decrease Size"
          >
            <ZoomOut className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
};

export default GridCell;
