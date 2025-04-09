
import React from "react";
import { EquipmentType } from "./EquipmentIcons";
import { 
  isVessel, 
  isHeatExchanger, 
  hasVerticalConnections, 
  isMultiInputEquipment,
  isShellAndTube,
  isPlateFin,
  isSpiral,
  isDoublePipe,
  isPlateHeatExchanger
} from "./EquipmentTypeCheckers";

interface EquipmentConnectionsProps {
  type: EquipmentType;
}

const EquipmentConnections: React.FC<EquipmentConnectionsProps> = ({ type }) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {!hasVerticalConnections(type) && !isHeatExchanger(type) && (
        <>
          <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-sm z-10"></div>
          <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-sm z-10"></div>
        </>
      )}

      {hasVerticalConnections(type) && (
        <>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-sm z-10"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-sm z-10"></div>
        </>
      )}

      {isVessel(type) && !hasVerticalConnections(type) && (
        <>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-sm z-10"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-sm z-10"></div>
        </>
      )}

      {isMultiInputEquipment(type) && (
        <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-[calc(50%+15px)] w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-sm z-10"></div>
      )}

      {/* Heat Exchanger connections based on type */}
      {isHeatExchanger(type) && (
        <>
          {/* Standard horizontal connections for all heat exchangers */}
          <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-sm z-10"></div>
          <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-sm z-10"></div>
          
          {/* Shell & Tube specific connections */}
          {isShellAndTube(type) && (
            <>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow-sm z-10"></div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow-sm z-10"></div>
            </>
          )}
          
          {/* Plate Heat Exchanger specific connections */}
          {isPlateHeatExchanger(type) && (
            <>
              <div className="absolute top-0 right-1/4 -translate-y-1/2 w-3 h-3 rounded-full bg-amber-500 border-2 border-white shadow-sm z-10"></div>
              <div className="absolute bottom-0 left-1/4 translate-y-1/2 w-3 h-3 rounded-full bg-amber-500 border-2 border-white shadow-sm z-10"></div>
            </>
          )}
          
          {/* Plate Fin specific connections */}
          {isPlateFin(type) && (
            <>
              <div className="absolute top-0 left-1/3 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-amber-500 border-2 border-white shadow-sm z-10"></div>
              <div className="absolute bottom-0 left-1/3 -translate-x-1/2 translate-y-1/2 w-3 h-3 rounded-full bg-amber-500 border-2 border-white shadow-sm z-10"></div>
              <div className="absolute top-0 left-2/3 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-amber-500 border-2 border-white shadow-sm z-10"></div>
              <div className="absolute bottom-0 left-2/3 -translate-x-1/2 translate-y-1/2 w-3 h-3 rounded-full bg-amber-500 border-2 border-white shadow-sm z-10"></div>
            </>
          )}
          
          {/* Double Pipe specific connections */}
          {isDoublePipe(type) && (
            <>
              <div className="absolute left-1/4 top-0 -translate-y-1/2 w-3 h-3 rounded-full bg-purple-500 border-2 border-white shadow-sm z-10"></div>
              <div className="absolute right-1/4 bottom-0 translate-y-1/2 w-3 h-3 rounded-full bg-purple-500 border-2 border-white shadow-sm z-10"></div>
            </>
          )}
          
          {/* Spiral Heat Exchanger specific connections */}
          {isSpiral(type) && (
            <>
              <div className="absolute top-1/4 left-0 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-purple-500 border-2 border-white shadow-sm z-10"></div>
              <div className="absolute bottom-1/4 right-0 translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-purple-500 border-2 border-white shadow-sm z-10"></div>
              <div className="absolute top-0 right-1/4 -translate-y-1/2 w-3 h-3 rounded-full bg-purple-500 border-2 border-white shadow-sm z-10"></div>
              <div className="absolute bottom-0 left-1/4 translate-y-1/2 w-3 h-3 rounded-full bg-purple-500 border-2 border-white shadow-sm z-10"></div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default EquipmentConnections;
