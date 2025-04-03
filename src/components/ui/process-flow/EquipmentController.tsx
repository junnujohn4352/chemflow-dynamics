
import React from "react";

interface EquipmentControllerProps {
  equipmentId: string;
  position: { x: number; y: number };
  onMove: (id: string, direction: 'up' | 'down' | 'left' | 'right') => void;
}

const EquipmentController: React.FC<EquipmentControllerProps> = ({
  equipmentId,
  position,
  onMove,
}) => {
  return (
    <>
      <div className="absolute -top-8 left-0 right-0 hidden group-hover:flex justify-center">
        <button 
          onClick={() => onMove(equipmentId, 'up')}
          disabled={position.y === 0}
          className="p-1 bg-blue-100 rounded-full mx-1 disabled:opacity-50 hover:bg-blue-200 transition-all shadow-sm"
        >
          ↑
        </button>
      </div>
      
      <div className="absolute top-1/2 -right-8 -translate-y-1/2 hidden group-hover:flex flex-col">
        <button 
          onClick={() => onMove(equipmentId, 'right')}
          disabled={position.x === 2}
          className="p-1 bg-blue-100 rounded-full my-1 disabled:opacity-50 hover:bg-blue-200 transition-all shadow-sm"
        >
          →
        </button>
      </div>
      
      <div className="absolute -bottom-8 left-0 right-0 hidden group-hover:flex justify-center">
        <button 
          onClick={() => onMove(equipmentId, 'down')}
          disabled={position.y === 4}
          className="p-1 bg-blue-100 rounded-full mx-1 disabled:opacity-50 hover:bg-blue-200 transition-all shadow-sm"
        >
          ↓
        </button>
      </div>
      
      <div className="absolute top-1/2 -left-8 -translate-y-1/2 hidden group-hover:flex flex-col">
        <button 
          onClick={() => onMove(equipmentId, 'left')}
          disabled={position.x === 0}
          className="p-1 bg-blue-100 rounded-full my-1 disabled:opacity-50 hover:bg-blue-200 transition-all shadow-sm"
        >
          ←
        </button>
      </div>
    </>
  );
};

export default EquipmentController;
