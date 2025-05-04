
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
  onClick?: (point: string, e: React.MouseEvent) => void;
  activePoints?: string[];
  showDottedLines?: boolean;
}

const EquipmentConnections: React.FC<EquipmentConnectionsProps> = ({ 
  type, 
  onClick,
  activePoints = [],
  showDottedLines = false
}) => {
  
  // Enhanced connection styles for better visibility and interaction
  const connectionPointClass = "absolute w-3 h-3 rounded-full border-2 border-white shadow-sm z-10 cursor-pointer transition-all hover:scale-125 hover:border-blue-300";
  
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
  
  const handleClick = (e: React.MouseEvent, point: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) {
      onClick(point, e);
    }
  };
  
  const getActiveClass = (point: string) => {
    return activePoints.includes(point) ? "ring-2 ring-offset-1 ring-blue-500 scale-125 animate-pulse" : "";
  };
  
  // Function to render dotted flow line from connection point
  const renderDottedLine = (point: string) => {
    if (!showDottedLines || !activePoints.includes(point)) return null;
    
    // Determine the direction and length of the dotted line based on the connection point
    let lineStyles: React.CSSProperties = {
      position: 'absolute',
      backgroundColor: 'transparent',
      borderTop: '2px dashed #6366f1',
      zIndex: 5,
      pointerEvents: 'none'
    };
    
    switch (point) {
      case 'left':
        lineStyles = {
          ...lineStyles,
          width: '30px', 
          height: '2px',
          left: '-30px',
          top: '50%',
          transform: 'translateY(-50%)'
        };
        break;
      case 'right':
        lineStyles = {
          ...lineStyles,
          width: '30px', 
          height: '2px',
          right: '-30px',
          top: '50%',
          transform: 'translateY(-50%)'
        };
        break;
      case 'top':
        lineStyles = {
          ...lineStyles,
          width: '2px', 
          height: '30px',
          top: '-30px',
          left: '50%',
          transform: 'translateX(-50%)',
          borderTop: 'none',
          borderLeft: '2px dashed #6366f1'
        };
        break;
      case 'bottom':
        lineStyles = {
          ...lineStyles,
          width: '2px', 
          height: '30px',
          bottom: '-30px',
          left: '50%',
          transform: 'translateX(-50%)',
          borderTop: 'none',
          borderLeft: '2px dashed #6366f1'
        };
        break;
      default:
        if (point.includes('in') || point.includes('input')) {
          lineStyles = {
            ...lineStyles,
            width: '20px', 
            height: '2px',
            left: '-20px',
            top: '50%',
            transform: 'translateY(-50%)'
          };
        } else if (point.includes('out') || point.includes('output')) {
          lineStyles = {
            ...lineStyles,
            width: '20px', 
            height: '2px',
            right: '-20px',
            top: '50%',
            transform: 'translateY(-50%)'
          };
        }
        break;
    }
    
    return <div style={lineStyles}></div>;
  };
  
  // Function to create standard left and right connections
  const createStandardConnections = () => (
    <>
      <div 
        className={`${connectionPointClass} ${connectionColor} left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 ${getActiveClass('left')}`} 
        data-connection="left" 
        onClick={(e) => handleClick(e, 'left')}
      >
        {renderDottedLine('left')}
      </div>
      <div 
        className={`${connectionPointClass} ${connectionColor} right-0 top-1/2 translate-x-1/2 -translate-y-1/2 ${getActiveClass('right')}`} 
        data-connection="right" 
        onClick={(e) => handleClick(e, 'right')}
      >
        {renderDottedLine('right')}
      </div>
    </>
  );
  
  // Function to create standard top and bottom connections
  const createVerticalConnections = () => (
    <>
      <div 
        className={`${connectionPointClass} ${connectionColor} top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 ${getActiveClass('top')}`} 
        data-connection="top" 
        onClick={(e) => handleClick(e, 'top')}
      >
        {renderDottedLine('top')}
      </div>
      <div 
        className={`${connectionPointClass} ${connectionColor} bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 ${getActiveClass('bottom')}`} 
        data-connection="bottom" 
        onClick={(e) => handleClick(e, 'bottom')}
      >
        {renderDottedLine('bottom')}
      </div>
    </>
  );

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Connection points are now interactive */}
      <div className="pointer-events-auto">
        {/* Standard horizontal connections for most equipment */}
        {!hasVerticalConnections(type) && !isHeatExchanger(type) && createStandardConnections()}

        {/* Vertical connections for columns */}
        {hasVerticalConnections(type) && createVerticalConnections()}

        {/* Vessels have both horizontal and vertical connections */}
        {isVessel(type) && !hasVerticalConnections(type) && createVerticalConnections()}

        {/* Multi-input equipment has additional input */}
        {isMultiInputEquipment(type) && (
          <div 
            className={`${connectionPointClass} ${connectionColor} top-1/2 left-0 -translate-x-1/2 -translate-y-[calc(50%+15px)] ${getActiveClass('input-2')}`} 
            data-connection="input-2"
            onClick={(e) => handleClick(e, 'input-2')}
          >
            {renderDottedLine('input-2')}
          </div>
        )}

        {/* Heat Exchanger connections based on type */}
        {isHeatExchanger(type) && (
          <>
            {/* Standard horizontal connections for all heat exchangers */}
            {createStandardConnections()}
            
            {/* Shell & Tube specific connections */}
            {isShellAndTube(type) && (
              <>
                <div 
                  className={`${connectionPointClass} bg-green-500 top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 ${getActiveClass('shell-in')}`} 
                  data-connection="shell-in"
                  onClick={(e) => handleClick(e, 'shell-in')}
                >
                  {renderDottedLine('shell-in')}
                </div>
                <div 
                  className={`${connectionPointClass} bg-green-500 bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 ${getActiveClass('shell-out')}`} 
                  data-connection="shell-out"
                  onClick={(e) => handleClick(e, 'shell-out')}
                >
                  {renderDottedLine('shell-out')}
                </div>
              </>
            )}
            
            {/* Plate Heat Exchanger specific connections */}
            {isPlateHeatExchanger(type) && (
              <>
                <div 
                  className={`${connectionPointClass} bg-amber-500 top-0 right-1/4 -translate-y-1/2 ${getActiveClass('plate-hot-in')}`} 
                  data-connection="plate-hot-in"
                  onClick={(e) => handleClick(e, 'plate-hot-in')}
                >
                  {renderDottedLine('plate-hot-in')}
                </div>
                <div 
                  className={`${connectionPointClass} bg-amber-500 bottom-0 left-1/4 translate-y-1/2 ${getActiveClass('plate-cold-out')}`} 
                  data-connection="plate-cold-out"
                  onClick={(e) => handleClick(e, 'plate-cold-out')}
                >
                  {renderDottedLine('plate-cold-out')}
                </div>
              </>
            )}
            
            {/* Plate Fin specific connections */}
            {isPlateFin(type) && (
              <>
                <div 
                  className={`${connectionPointClass} bg-amber-500 top-0 left-1/3 -translate-x-1/2 -translate-y-1/2 ${getActiveClass('fin-hot-in')}`} 
                  data-connection="fin-hot-in"
                  onClick={(e) => handleClick(e, 'fin-hot-in')}
                >
                  {renderDottedLine('fin-hot-in')}
                </div>
                <div 
                  className={`${connectionPointClass} bg-amber-500 bottom-0 left-1/3 -translate-x-1/2 translate-y-1/2 ${getActiveClass('fin-cold-out')}`} 
                  data-connection="fin-cold-out"
                  onClick={(e) => handleClick(e, 'fin-cold-out')}
                >
                  {renderDottedLine('fin-cold-out')}
                </div>
                <div 
                  className={`${connectionPointClass} bg-amber-500 top-0 left-2/3 -translate-x-1/2 -translate-y-1/2 ${getActiveClass('fin-cold-in')}`} 
                  data-connection="fin-cold-in"
                  onClick={(e) => handleClick(e, 'fin-cold-in')}
                >
                  {renderDottedLine('fin-cold-in')}
                </div>
                <div 
                  className={`${connectionPointClass} bg-amber-500 bottom-0 left-2/3 -translate-x-1/2 translate-y-1/2 ${getActiveClass('fin-hot-out')}`} 
                  data-connection="fin-hot-out"
                  onClick={(e) => handleClick(e, 'fin-hot-out')}
                >
                  {renderDottedLine('fin-hot-out')}
                </div>
              </>
            )}
            
            {/* Double Pipe specific connections */}
            {isDoublePipe(type) && (
              <>
                <div 
                  className={`${connectionPointClass} bg-purple-500 left-1/4 top-0 -translate-y-1/2 ${getActiveClass('pipe-hot-in')}`} 
                  data-connection="pipe-hot-in"
                  onClick={(e) => handleClick(e, 'pipe-hot-in')}
                >
                  {renderDottedLine('pipe-hot-in')}
                </div>
                <div 
                  className={`${connectionPointClass} bg-purple-500 right-1/4 bottom-0 translate-y-1/2 ${getActiveClass('pipe-cold-out')}`} 
                  data-connection="pipe-cold-out"
                  onClick={(e) => handleClick(e, 'pipe-cold-out')}
                >
                  {renderDottedLine('pipe-cold-out')}
                </div>
              </>
            )}
            
            {/* Spiral Heat Exchanger specific connections */}
            {isSpiral(type) && (
              <>
                <div 
                  className={`${connectionPointClass} bg-purple-500 top-1/4 left-0 -translate-x-1/2 -translate-y-1/2 ${getActiveClass('spiral-hot-in')}`} 
                  data-connection="spiral-hot-in"
                  onClick={(e) => handleClick(e, 'spiral-hot-in')}
                >
                  {renderDottedLine('spiral-hot-in')}
                </div>
                <div 
                  className={`${connectionPointClass} bg-purple-500 bottom-1/4 right-0 translate-x-1/2 -translate-y-1/2 ${getActiveClass('spiral-cold-out')}`} 
                  data-connection="spiral-cold-out"
                  onClick={(e) => handleClick(e, 'spiral-cold-out')}
                >
                  {renderDottedLine('spiral-cold-out')}
                </div>
                <div 
                  className={`${connectionPointClass} bg-purple-500 top-0 right-1/4 -translate-y-1/2 ${getActiveClass('spiral-cold-in')}`} 
                  data-connection="spiral-cold-in"
                  onClick={(e) => handleClick(e, 'spiral-cold-in')}
                >
                  {renderDottedLine('spiral-cold-in')}
                </div>
                <div 
                  className={`${connectionPointClass} bg-purple-500 bottom-0 left-1/4 translate-y-1/2 ${getActiveClass('spiral-hot-out')}`} 
                  data-connection="spiral-hot-out"
                  onClick={(e) => handleClick(e, 'spiral-hot-out')}
                >
                  {renderDottedLine('spiral-hot-out')}
                </div>
              </>
            )}
          </>
        )}
        
        {/* Reactor with additional connections */}
        {isReactor(type) && !hasVerticalConnections(type) && !isVessel(type) && (
          <>
            <div 
              className={`${connectionPointClass} bg-green-500 top-0 right-1/4 -translate-y-1/2 ${getActiveClass('utility-in')}`} 
              data-connection="utility-in"
              onClick={(e) => handleClick(e, 'utility-in')}
            >
              {renderDottedLine('utility-in')}
            </div>
            <div 
              className={`${connectionPointClass} bg-green-500 bottom-0 right-1/4 translate-y-1/2 ${getActiveClass('utility-out')}`} 
              data-connection="utility-out"
              onClick={(e) => handleClick(e, 'utility-out')}
            >
              {renderDottedLine('utility-out')}
            </div>
          </>
        )}
        
        {/* Separator with multiple outputs */}
        {isSeparator(type) && !isVessel(type) && !hasVerticalConnections(type) && (
          <>
            <div 
              className={`${connectionPointClass} ${connectionColor} right-0 top-1/4 translate-x-1/2 -translate-y-1/2 ${getActiveClass('out-1')}`} 
              data-connection="out-1"
              onClick={(e) => handleClick(e, 'out-1')}
            >
              {renderDottedLine('out-1')}
            </div>
            <div 
              className={`${connectionPointClass} ${connectionColor} right-0 bottom-1/4 translate-x-1/2 -translate-y-1/2 ${getActiveClass('out-2')}`} 
              data-connection="out-2"
              onClick={(e) => handleClick(e, 'out-2')}
            >
              {renderDottedLine('out-2')}
            </div>
          </>
        )}

        {/* Flow controllers with multiple connections */}
        {isFlowController(type) && type.includes("tee") && (
          <>
            <div 
              className={`${connectionPointClass} bg-purple-500 right-0 top-1/4 translate-x-1/2 -translate-y-1/2 ${getActiveClass('out-1')}`} 
              data-connection="out-1"
              onClick={(e) => handleClick(e, 'out-1')}
            >
              {renderDottedLine('out-1')}
            </div>
            <div 
              className={`${connectionPointClass} bg-purple-500 right-0 bottom-1/4 translate-x-1/2 -translate-y-1/2 ${getActiveClass('out-2')}`} 
              data-connection="out-2"
              onClick={(e) => handleClick(e, 'out-2')}
            >
              {renderDottedLine('out-2')}
            </div>
          </>
        )}
        
        {/* Utility equipment specific connections */}
        {isUtility(type) && (
          <>
            <div 
              className={`${connectionPointClass} bg-teal-500 top-0 left-1/4 -translate-y-1/2 ${getActiveClass('utility-in')}`} 
              data-connection="utility-in"
              onClick={(e) => handleClick(e, 'utility-in')}
            >
              {renderDottedLine('utility-in')}
            </div>
            <div 
              className={`${connectionPointClass} bg-teal-500 bottom-0 right-1/4 translate-y-1/2 ${getActiveClass('utility-out')}`} 
              data-connection="utility-out"
              onClick={(e) => handleClick(e, 'utility-out')}
            >
              {renderDottedLine('utility-out')}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EquipmentConnections;
