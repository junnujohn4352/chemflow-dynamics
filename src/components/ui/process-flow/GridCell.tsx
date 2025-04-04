import React, { useState } from "react";
import { Equipment } from "./types";
import { Button } from "@/components/ui/button";
import { Info, ArrowRight } from "lucide-react";
import EquipmentCard from "@/components/ui/EquipmentCard";
import EquipmentController from "./EquipmentController";
import EquipmentDetail from "./EquipmentDetail";

interface GridCellProps {
  equipment: Equipment | null;
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
  onConnectionSelect: (id: string) => void;
  onToggleDetails: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down' | 'left' | 'right') => void;
}

const GridCell: React.FC<GridCellProps> = ({
  equipment,
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
}) => {
  const [showArrow, setShowArrow] = useState(false);
  const [arrowPosition, setArrowPosition] = useState({ x: 0, y: 0 });
  const [arrowAngle, setArrowAngle] = useState(0);
  const [isDraggingArrow, setIsDraggingArrow] = useState(false);

  const handleMouseEnter = () => {
    if (equipment) {
      setShowArrow(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isDraggingArrow) {
      setShowArrow(false);
    }
  };

  const startArrowDrag = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (equipment) {
      setIsDraggingArrow(true);
      document.addEventListener('mousemove', moveArrow);
      document.addEventListener('mouseup', stopArrowDrag);
      
      const rect = e.currentTarget.getBoundingClientRect();
      setArrowPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const moveArrow = (e: MouseEvent) => {
    if (isDraggingArrow && equipment) {
      const equipmentElement = document.getElementById(`equipment-${equipment.id}`);
      if (equipmentElement) {
        const rect = equipmentElement.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const newX = e.clientX - rect.left;
        const newY = e.clientY - rect.top;
        
        const dx = newX - centerX;
        const dy = newY - centerY;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        
        setArrowPosition({ x: newX, y: newY });
        setArrowAngle(angle);
      }
    }
  };

  const stopArrowDrag = (e: MouseEvent) => {
    if (isDraggingArrow && equipment) {
      setIsDraggingArrow(false);
      setShowArrow(false);
      document.removeEventListener('mousemove', moveArrow);
      document.removeEventListener('mouseup', stopArrowDrag);
      
      onConnect(equipment.id);
    }
  };

  if (!equipment) {
    return (
      <div className="w-full h-full min-h-[120px] border border-dashed border-blue-200 rounded-xl flex items-center justify-center bg-blue-50/30 hover:bg-blue-50 transition-colors">
        <span className="text-gray-400 text-xs">Empty</span>
      </div>
    );
  }

  return (
    <div 
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      id={`equipment-${equipment.id}`}
    >
      <div 
        className="absolute left-0 top-1/2 -translate-x-2 -translate-y-1/2 w-4 h-4 bg-violet-500 hover:bg-violet-600 rounded-full opacity-100 cursor-pointer z-10 transition-all duration-200"
        onClick={() => onConnect(equipment.id)}
      />
      
      <div 
        className="absolute right-0 top-1/2 translate-x-2 -translate-y-1/2 w-4 h-4 bg-violet-500 hover:bg-violet-600 rounded-full opacity-100 cursor-pointer z-10 transition-all duration-200"
        onClick={() => onConnect(equipment.id)}
      />
      
      <div 
        className="absolute top-0 left-1/2 -translate-y-2 -translate-x-1/2 w-4 h-4 bg-violet-500 hover:bg-violet-600 rounded-full opacity-100 cursor-pointer z-10 transition-all duration-200"
        onClick={() => onConnect(equipment.id)}
      />
      
      <div 
        className="absolute bottom-0 left-1/2 translate-y-2 -translate-x-1/2 w-4 h-4 bg-violet-500 hover:bg-violet-600 rounded-full opacity-100 cursor-pointer z-10 transition-all duration-200"
        onClick={() => onConnect(equipment.id)}
      />

      {showArrow && (
        <div 
          className="absolute z-20 cursor-grab active:cursor-grabbing"
          style={{
            left: arrowPosition.x || "50%",
            top: arrowPosition.y || "50%",
            transform: `translate(-50%, -50%) rotate(${arrowAngle}deg)`,
            display: isDraggingArrow ? 'block' : 'block'
          }}
          onMouseDown={startArrowDrag}
        >
          <div className="p-2 rounded-full bg-violet-500 hover:bg-violet-600 text-white shadow-lg transition-colors">
            <ArrowRight className="h-5 w-5" />
          </div>
        </div>
      )}

      {editingName === equipment.id ? (
        <div className="absolute -top-10 left-0 right-0 flex z-50">
          <input
            type="text"
            value={tempName}
            onChange={onNameChange}
            onBlur={onSaveName}
            onKeyDown={(e) => e.key === 'Enter' && onSaveName()}
            autoFocus
            className="w-full px-2 py-1 text-sm border rounded shadow-md"
          />
        </div>
      ) : null}
      
      <EquipmentController 
        equipmentId={equipment.id} 
        position={equipment.position} 
        onMove={onMove} 
      />
      
      <div 
        className={`cursor-move hover:scale-105 transition-transform ${
          connectMode && connectMode !== equipment.id 
            ? 'ring-2 ring-violet-400 ring-offset-2 cursor-pointer' 
            : ''
        }`}
        onMouseDown={(e) => onDragStart(equipment.id, e)}
        onDoubleClick={() => onEditName(equipment.id)}
        onClick={() => connectMode && connectMode !== equipment.id ? onConnectionSelect(equipment.id) : null}
      >
        <EquipmentCard 
          type={equipment.type as "reactor" | "pump" | "valve" | "heater" | "condenser" | "column" | "tank" | "mixer"} 
          name={typeof equipment.name === 'string' ? equipment.name : String(equipment.name)} 
          status={isRunning ? "running" : "stopped"} 
          metrics={equipment.metrics}
        />
        
        {equipment.description && (
          <div className="mt-1 text-xs text-gray-500 max-w-[120px] truncate">
            {equipment.description}
          </div>
        )}
        
        <div className="mt-2 flex space-x-2 justify-center">
          <Button 
            variant="outline" 
            size="sm" 
            className={`text-xs px-2 py-1 h-auto ${
              showDetails === equipment.id ? 'bg-gray-100 border-gray-400' : ''
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleDetails(equipment.id);
            }}
          >
            <Info className="h-3 w-3 mr-1" />
            {showDetails === equipment.id ? 'Hide' : 'Info'}
          </Button>
        </div>
        
        {showDetails === equipment.id && (
          <EquipmentDetail 
            equipment={equipment} 
            isRunning={isRunning}
            onClose={() => onToggleDetails(equipment.id)} 
          />
        )}
      </div>
    </div>
  );
};

export default GridCell;
