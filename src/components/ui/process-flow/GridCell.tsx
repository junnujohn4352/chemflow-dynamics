import React, { useState } from "react";
import { Equipment, Connection, ConnectionPoint } from "./types";
import EquipmentDetail from "./EquipmentDetail";
import { 
  Container, 
  Gauge, 
  Thermometer, 
  FlaskConical, 
  Droplets, 
  Columns, 
  Filter, 
  Beaker, 
  Lightbulb,
  Pipette, 
  Milestone,
  Package,
  ArrowRight,
  Plus,
  Minus,
  Info,
  Circle
} from "lucide-react";

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
  const [hoveredConnector, setHoveredConnector] = useState<string | null>(null);
  const isSelected = selectedEquipment === equipment.id;
  const isConnecting = connectMode === equipment.id;

  const defaultConnectionPoints: ConnectionPoint[] = [
    { id: 'top', position: 'top' },
    { id: 'right', position: 'right' },
    { id: 'bottom', position: 'bottom' },
    { id: 'left', position: 'left' }
  ];

  const connectionPoints = equipment.connectionPoints || defaultConnectionPoints;

  const getConnectorPosition = (position: string): React.CSSProperties => {
    switch (position) {
      case 'top':
        return { 
          top: '-10px', 
          left: '50%', 
          transform: 'translateX(-50%)' 
        };
      case 'right':
        return { 
          top: '50%', 
          right: '-10px', 
          transform: 'translateY(-50%)' 
        };
      case 'bottom':
        return { 
          bottom: '-10px', 
          left: '50%', 
          transform: 'translateX(-50%)' 
        };
      case 'left':
        return { 
          top: '50%', 
          left: '-10px', 
          transform: 'translateY(-50%)' 
        };
      default:
        return {};
    }
  };

  const handleConnectorClick = (e: React.MouseEvent, connectorId: string) => {
    e.stopPropagation();
    onConnectionSelect(equipment.id, connectorId);
  };

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-1 left-1 text-xs font-medium text-gray-700 max-w-[80%] truncate">
        {editingName === equipment.id ? (
          <input
            type="text"
            className="w-full text-xs border rounded px-1"
            value={tempName}
            onChange={onNameChange}
            onBlur={onSaveName}
            onKeyPress={(e) => e.key === 'Enter' && onSaveName()}
            autoFocus
          />
        ) : (
          <span onDoubleClick={() => onEditName(equipment.id)}>{equipment.name}</span>
        )}
      </div>
      
      <div 
        className={`w-full h-full flex items-center justify-center ${connectMode && !isConnecting ? 'cursor-pointer' : ''}`}
        onClick={() => connectMode && !isConnecting && onConnectionSelect(equipment.id)}
      >
        {equipment.type === 'arrow' ? (
          <ArrowRight className="w-12 h-12 text-gray-800" />
        ) : (
          <span className="text-gray-700">{getEquipmentIcon(equipment.type)}</span>
        )}
      </div>
      
      {connectionPoints.map(point => (
        <div 
          key={point.id}
          className={`
            absolute flex items-center justify-center 
            w-6 h-6 rounded-full cursor-pointer z-10 
            transition-all duration-200 ease-in-out
            ${hoveredConnector === point.id 
              ? 'bg-amber-200 border-2 border-amber-500' 
              : isConnecting
                ? 'bg-green-100 border-2 border-green-400'
                : 'bg-blue-100 border-2 border-blue-400'}
          `}
          style={{
            ...getConnectorPosition(point.position),
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            opacity: connectMode ? 1 : 0.7,
            transform: `${getConnectorPosition(point.position).transform} scale(${connectMode ? 1.2 : 1})`,
          }}
          onClick={(e) => handleConnectorClick(e, point.id)}
          onMouseEnter={() => setHoveredConnector(point.id)}
          onMouseLeave={() => setHoveredConnector(null)}
          title={`Connect from ${point.position}`}
        >
          <Circle 
            className={`
              w-3 h-3 
              ${hoveredConnector === point.id 
                ? 'text-amber-600' 
                : isConnecting
                  ? 'text-green-500'
                  : 'text-blue-500'}
            `} 
            fill="currentColor" 
            strokeWidth={2} 
          />
        </div>
      ))}
      
      {isSelected && (
        <div className="absolute -top-2 -right-2 flex space-x-1">
          {equipment.type === 'arrow' && (
            <>
              <button
                className="bg-blue-100 text-blue-600 rounded-full p-1 hover:bg-blue-200 transition-colors"
                onClick={() => {
                  onRotate && onRotate(equipment.id, 45);
                }}
                title="Rotate"
              >
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </button>
              <button
                className="bg-purple-100 text-purple-600 rounded-full p-1 hover:bg-purple-200 transition-colors"
                onClick={() => {
                  onResize && onResize(equipment.id, 0.2);
                }}
                title="Increase size"
              >
                <Plus className="h-3 w-3" />
              </button>
              <button
                className="bg-indigo-100 text-indigo-600 rounded-full p-1 hover:bg-indigo-200 transition-colors"
                onClick={() => {
                  onResize && onResize(equipment.id, -0.2);
                }}
                title="Decrease size"
              >
                <Minus className="h-3 w-3" />
              </button>
            </>
          )}
          <button
            className="bg-green-100 text-green-600 rounded-full p-1 hover:bg-green-200 transition-colors"
            onClick={() => onToggleDetails(equipment.id)}
            title="Show details"
          >
            <Info className="h-3 w-3" />
          </button>
        </div>
      )}
      
      {showDetails === equipment.id && (
        <EquipmentDetail 
          equipment={equipment} 
          isRunning={isRunning}
          onClose={() => onToggleDetails('')}
          allEquipment={[]} // Add empty array for allEquipment prop
          onConnectEquipment={() => {}} // Add empty function for onConnectEquipment prop
        />
      )}
      
      {equipment.metrics && Object.keys(equipment.metrics).length > 0 && (
        <div className="absolute bottom-1 left-1 right-1 text-xs bg-gray-50 rounded px-1 py-0.5 line-clamp-1 text-gray-600">
          {Object.entries(equipment.metrics)
            .slice(0, 1)
            .map(([key, value]) => (
              <span key={key}>
                {key}: {safeStringify(value)}
                {key === 'temperature' ? '°C' : 
                 key === 'pressure' ? ' kPa' : 
                 key === 'level' ? '%' : 
                 key === 'flow' ? ' kg/h' : ''}
              </span>
            ))}
        </div>
      )}
      
      {equipment.description && isSelected && (
        <div className="absolute -bottom-8 left-0 right-0 text-xs bg-white shadow border border-gray-200 rounded p-1 z-10">
          {equipment.description.substring(0, 30)}
          {equipment.description.length > 30 ? '...' : ''}
        </div>
      )}
    </div>
  );
};

const getEquipmentIcon = (type: string) => {
  switch (type) {
    case 'tank':
      return <Container className="h-10 w-10 text-blue-600" />;
    case 'pump':
      return <Gauge className="h-10 w-10 text-blue-600" />;
    case 'heater':
      return <Thermometer className="h-10 w-10 text-red-500" />;
    case 'condenser':
      return <Thermometer className="h-10 w-10 text-blue-400" />;
    case 'column':
      return <FlaskConical className="h-10 w-10 text-purple-500" />;
    case 'valve':
      return <Gauge className="h-10 w-10 text-green-500" />;
    case 'mixer':
      return <Columns className="h-10 w-10 text-orange-500" />;
    case 'filter':
      return <Filter className="h-10 w-10 text-gray-600" />;
    case 'reactor':
      return <Beaker className="h-10 w-10 text-pink-500" />;
    case 'heatExchanger':
      return <Lightbulb className="h-10 w-10 text-yellow-500" />;
    case 'sensor':
      return <Pipette className="h-10 w-10 text-teal-500" />;
    case 'splitter':
      return <Milestone className="h-10 w-10 text-indigo-500" />;
    case 'product':
      return <Package className="h-10 w-10 text-emerald-500" />;
    case 'arrow':
      return <ArrowRight className="h-10 w-10 text-gray-800" />;
    default:
      return <div className="h-10 w-10 bg-gray-200 rounded-full"></div>;
  }
};

const safeStringify = (value: any): string => {
  if (value === null || value === undefined) {
    return '';
  }
  
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch (e) {
      return '[Object]';
    }
  }
  
  return String(value);
};

export default GridCell;
