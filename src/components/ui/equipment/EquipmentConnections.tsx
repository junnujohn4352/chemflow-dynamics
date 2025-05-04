
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
  isPlateHeatExchanger,
  isReactor,
  isColumn,
  isFlowController,
  isSeparator,
  isUtility,
  isMassTransfer,
  isSolids,
  isStorageEquipment
} from "./EquipmentTypeCheckers";

interface EquipmentConnectionsProps {
  type: EquipmentType;
}

const EquipmentConnections: React.FC<EquipmentConnectionsProps> = ({ type }) => {
  
  // Basic connection styles
  const connectionPointClass = "absolute w-3 h-3 rounded-full border-2 border-white shadow-sm z-10";
  
  // Connection point colors based on equipment type
  const getConnectionColor = () => {
    if (isReactor(type)) return "bg-green-500";
    if (isColumn(type)) return "bg-blue-500";
    if (isHeatExchanger(type)) return "bg-red-500";
    if (isFlowController(type)) return "bg-purple-500";
    if (isSeparator(type)) return "bg-amber-500";
    if (isUtility(type)) return "bg-teal-500";
    if (isMassTransfer(type)) return "bg-indigo-500";
    if (isSolids(type)) return "bg-orange-500";
    if (isStorageEquipment(type)) return "bg-slate-500";
    return "bg-blue-500"; // Default
  };
  
  const connectionColor = getConnectionColor();
  
  // Function to create standard left and right connections
  const createStandardConnections = () => (
    <>
      <div className={`${connectionPointClass} ${connectionColor} left-0 top-1/2 -translate-x-1/2 -translate-y-1/2`} data-connection="left" />
      <div className={`${connectionPointClass} ${connectionColor} right-0 top-1/2 translate-x-1/2 -translate-y-1/2`} data-connection="right" />
    </>
  );
  
  // Function to create standard top and bottom connections
  const createVerticalConnections = () => (
    <>
      <div className={`${connectionPointClass} ${connectionColor} top-0 left-1/2 -translate-x-1/2 -translate-y-1/2`} data-connection="top" />
      <div className={`${connectionPointClass} ${connectionColor} bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2`} data-connection="bottom" />
    </>
  );

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Standard horizontal connections for most equipment */}
      {!hasVerticalConnections(type) && !isHeatExchanger(type) && createStandardConnections()}

      {/* Vertical connections for columns */}
      {hasVerticalConnections(type) && createVerticalConnections()}

      {/* Vessels have both horizontal and vertical connections */}
      {isVessel(type) && !hasVerticalConnections(type) && createVerticalConnections()}

      {/* Multi-input equipment has additional input */}
      {isMultiInputEquipment(type) && (
        <div className={`${connectionPointClass} ${connectionColor} top-1/2 left-0 -translate-x-1/2 -translate-y-[calc(50%+15px)]`} data-connection="input-2" />
      )}

      {/* Heat Exchanger connections based on type */}
      {isHeatExchanger(type) && (
        <>
          {/* Standard horizontal connections for all heat exchangers */}
          {createStandardConnections()}
          
          {/* Shell & Tube specific connections */}
          {isShellAndTube(type) && (
            <>
              <div className={`${connectionPointClass} bg-green-500 top-0 left-1/2 -translate-x-1/2 -translate-y-1/2`} data-connection="shell-in" />
              <div className={`${connectionPointClass} bg-green-500 bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2`} data-connection="shell-out" />
            </>
          )}
          
          {/* Plate Heat Exchanger specific connections */}
          {isPlateHeatExchanger(type) && (
            <>
              <div className={`${connectionPointClass} bg-amber-500 top-0 right-1/4 -translate-y-1/2`} data-connection="plate-hot-in" />
              <div className={`${connectionPointClass} bg-amber-500 bottom-0 left-1/4 translate-y-1/2`} data-connection="plate-cold-out" />
            </>
          )}
          
          {/* Plate Fin specific connections */}
          {isPlateFin(type) && (
            <>
              <div className={`${connectionPointClass} bg-amber-500 top-0 left-1/3 -translate-x-1/2 -translate-y-1/2`} data-connection="fin-hot-in" />
              <div className={`${connectionPointClass} bg-amber-500 bottom-0 left-1/3 -translate-x-1/2 translate-y-1/2`} data-connection="fin-cold-out" />
              <div className={`${connectionPointClass} bg-amber-500 top-0 left-2/3 -translate-x-1/2 -translate-y-1/2`} data-connection="fin-cold-in" />
              <div className={`${connectionPointClass} bg-amber-500 bottom-0 left-2/3 -translate-x-1/2 translate-y-1/2`} data-connection="fin-hot-out" />
            </>
          )}
          
          {/* Double Pipe specific connections */}
          {isDoublePipe(type) && (
            <>
              <div className={`${connectionPointClass} bg-purple-500 left-1/4 top-0 -translate-y-1/2`} data-connection="pipe-hot-in" />
              <div className={`${connectionPointClass} bg-purple-500 right-1/4 bottom-0 translate-y-1/2`} data-connection="pipe-cold-out" />
            </>
          )}
          
          {/* Spiral Heat Exchanger specific connections */}
          {isSpiral(type) && (
            <>
              <div className={`${connectionPointClass} bg-purple-500 top-1/4 left-0 -translate-x-1/2 -translate-y-1/2`} data-connection="spiral-hot-in" />
              <div className={`${connectionPointClass} bg-purple-500 bottom-1/4 right-0 translate-x-1/2 -translate-y-1/2`} data-connection="spiral-cold-out" />
              <div className={`${connectionPointClass} bg-purple-500 top-0 right-1/4 -translate-y-1/2`} data-connection="spiral-cold-in" />
              <div className={`${connectionPointClass} bg-purple-500 bottom-0 left-1/4 translate-y-1/2`} data-connection="spiral-hot-out" />
            </>
          )}
        </>
      )}
      
      {/* Reactor with additional connections */}
      {isReactor(type) && !hasVerticalConnections(type) && !isVessel(type) && (
        <>
          <div className={`${connectionPointClass} bg-green-500 top-0 right-1/4 -translate-y-1/2`} data-connection="utility-in" />
          <div className={`${connectionPointClass} bg-green-500 bottom-0 right-1/4 translate-y-1/2`} data-connection="utility-out" />
        </>
      )}
      
      {/* Separator with multiple outputs */}
      {isSeparator(type) && !isVessel(type) && !hasVerticalConnections(type) && (
        <>
          <div className={`${connectionPointClass} ${connectionColor} right-0 top-1/4 translate-x-1/2 -translate-y-1/2`} data-connection="out-1" />
          <div className={`${connectionPointClass} ${connectionColor} right-0 bottom-1/4 translate-x-1/2 -translate-y-1/2`} data-connection="out-2" />
        </>
      )}

      {/* Flow controllers with multiple connections */}
      {isFlowController(type) && type.includes("tee") && (
        <>
          <div className={`${connectionPointClass} bg-purple-500 right-0 top-1/4 translate-x-1/2 -translate-y-1/2`} data-connection="out-1" />
          <div className={`${connectionPointClass} bg-purple-500 right-0 bottom-1/4 translate-x-1/2 -translate-y-1/2`} data-connection="out-2" />
        </>
      )}
      
      {/* Utility equipment specific connections */}
      {isUtility(type) && (
        <>
          <div className={`${connectionPointClass} bg-teal-500 top-0 left-1/4 -translate-y-1/2`} data-connection="utility-in" />
          <div className={`${connectionPointClass} bg-teal-500 bottom-0 right-1/4 translate-y-1/2`} data-connection="utility-out" />
        </>
      )}
    </div>
  );
};

export default EquipmentConnections;
