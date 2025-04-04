
import React from "react";
import { Equipment } from "./types";
import { X, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCw, ZoomIn, ZoomOut } from "lucide-react";
import ConnectionPoint from "./ConnectionPoint";
import ParametersPanel from "./ParametersPanel";

export interface EquipmentDetailProps {
  equipment: Equipment;
  onClose: () => void;
  onMove?: (id: string, direction: "up" | "down" | "left" | "right") => void;
  onRotate?: (id: string, degrees: number) => void;
  onResize?: (id: string, scaleFactor: number) => void;
  allEquipment?: Equipment[];
  onConnectEquipment?: (id: string, handleId?: string) => void;
  onConnectionPointClick?: (equipmentId: string, pointId: string) => void;
  onParameterChange?: (equipmentId: string, parameterId: string, value: any) => void;
  isRunning?: boolean;
}

const EquipmentDetail: React.FC<EquipmentDetailProps> = ({
  equipment,
  onClose,
  onMove,
  onRotate,
  onResize,
  allEquipment,
  onConnectEquipment,
  onConnectionPointClick,
  onParameterChange,
  isRunning = false
}) => {
  const handleRotate = () => {
    if (onRotate) {
      onRotate(equipment.id, 90);
    }
  };

  const handleResize = (increase: boolean) => {
    if (onResize) {
      onResize(equipment.id, increase ? 1.1 : 0.9);
    }
  };
  
  const handleConnectionPointClick = (pointId: string) => {
    if (onConnectionPointClick) {
      onConnectionPointClick(equipment.id, pointId);
    }
  };
  
  const handleParameterChange = (parameterId: string, value: any) => {
    if (onParameterChange) {
      onParameterChange(equipment.id, parameterId, value);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-blue-100 p-4 w-full max-w-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-blue-800">{equipment.name || equipment.type}</h3>
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Equipment Info</h4>
        <div className="bg-blue-50 p-3 rounded-md">
          <p className="text-sm"><span className="font-medium">Type:</span> {equipment.type}</p>
          <p className="text-sm"><span className="font-medium">Position:</span> ({equipment.position.x}, {equipment.position.y})</p>
          {equipment.rotation && (
            <p className="text-sm"><span className="font-medium">Rotation:</span> {equipment.rotation}°</p>
          )}
          {equipment.scale && (
            <p className="text-sm"><span className="font-medium">Scale:</span> {equipment.scale.toFixed(1)}x</p>
          )}
        </div>
      </div>
      
      {/* Connection Points */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Connection Points</h4>
        <div className="bg-gray-100 p-3 rounded-md text-center relative h-24 mb-2">
          {/* Add illustration of the equipment with connection points */}
          <div className="relative mx-auto h-full w-1/2 border border-gray-300 rounded bg-white flex items-center justify-center">
            {equipment.icon && (
              <span className="text-2xl text-gray-600">{equipment.icon}</span>
            )}
            
            {/* Connection Points */}
            <ConnectionPoint
              id="top"
              position="top"
              onClick={(id) => handleConnectionPointClick(id)}
              isConnected={equipment.connectedPoints?.includes("top")}
            />
            <ConnectionPoint
              id="right"
              position="right"
              onClick={(id) => handleConnectionPointClick(id)}
              isConnected={equipment.connectedPoints?.includes("right")}
            />
            <ConnectionPoint
              id="bottom"
              position="bottom"
              onClick={(id) => handleConnectionPointClick(id)}
              isConnected={equipment.connectedPoints?.includes("bottom")}
            />
            <ConnectionPoint
              id="left"
              position="left"
              onClick={(id) => handleConnectionPointClick(id)}
              isConnected={equipment.connectedPoints?.includes("left")}
            />
          </div>
        </div>
        <p className="text-xs text-center text-gray-500">Click on connection points to connect equipment</p>
      </div>
      
      {/* Controls for positioning and rotation */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Controls</h4>
        <div className="grid grid-cols-3 gap-2">
          <div className="col-start-2">
            <button
              className="w-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded p-2"
              onClick={() => onMove && onMove(equipment.id, "up")}
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
          <div className="col-start-1 row-start-2">
            <button
              className="w-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded p-2"
              onClick={() => onMove && onMove(equipment.id, "left")}
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          </div>
          <div className="col-start-3 row-start-2">
            <button
              className="w-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded p-2"
              onClick={() => onMove && onMove(equipment.id, "right")}
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="col-start-2 row-start-2">
            <button
              className="w-full flex items-center justify-center bg-blue-100 hover:bg-blue-200 rounded p-2"
              onClick={handleRotate}
            >
              <RotateCw className="h-4 w-4" />
            </button>
          </div>
          <div className="col-start-2 row-start-3">
            <button
              className="w-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded p-2"
              onClick={() => onMove && onMove(equipment.id, "down")}
            >
              <ArrowDown className="h-4 w-4" />
            </button>
          </div>
          <div className="col-start-1 row-start-3">
            <button
              className="w-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded p-2"
              onClick={() => handleResize(false)}
            >
              <ZoomOut className="h-4 w-4" />
            </button>
          </div>
          <div className="col-start-3 row-start-3">
            <button
              className="w-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded p-2"
              onClick={() => handleResize(true)}
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Parameters Panel */}
      <ParametersPanel
        equipment={equipment}
        onParameterChange={handleParameterChange}
        isRunning={isRunning}
      />
    </div>
  );
};

export default EquipmentDetail;
