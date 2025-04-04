
import React from "react";

interface ConnectionPointProps {
  id: string;
  position: "top" | "right" | "bottom" | "left";
  onClick?: (id: string) => void;
  isConnected?: boolean;
  isConnectable?: boolean;
  portType?: "input" | "output";
}

const ConnectionPoint: React.FC<ConnectionPointProps> = ({
  id,
  position,
  onClick,
  isConnected = false,
  isConnectable = true,
  portType = "output"
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick && isConnectable) {
      console.log(`Connection point clicked: ${id}, type: ${portType}`);
      onClick(id);
    }
  };
  
  // Position the connection point along the edge of the parent
  const getPositionStyles = () => {
    switch (position) {
      case "top":
        return { top: "-6px", left: "50%", transform: "translateX(-50%)" };
      case "right":
        return { right: "-6px", top: "50%", transform: "translateY(-50%)" };
      case "bottom":
        return { bottom: "-6px", left: "50%", transform: "translateX(-50%)" };
      case "left":
        return { left: "-6px", top: "50%", transform: "translateY(-50%)" };
    }
  };

  // Input ports are blue, output ports are green
  const getColorStyles = () => {
    if (isConnected) {
      return "bg-green-500 border-green-700";
    }
    
    if (!isConnectable) {
      return "bg-gray-500 border-gray-700";
    }
    
    if (portType === "input") {
      return "bg-blue-500 border-blue-700 hover:bg-blue-600";
    } else {
      return "bg-emerald-500 border-emerald-700 hover:bg-emerald-600";
    }
  };
  
  return (
    <div
      className={`absolute w-6 h-6 rounded-full cursor-pointer border-2 z-20 ${getColorStyles()} shadow-md`}
      style={{
        ...getPositionStyles(),
        transition: "all 0.2s ease",
        pointerEvents: "all"
      }}
      onClick={handleClick}
      title={`${portType === "input" ? "Input" : "Output"} port: ${id}`}
    >
      {/* Add a visual indicator when hovering */}
      <div 
        className="absolute inset-0 rounded-full bg-white opacity-0 hover:opacity-30 
          transition-opacity duration-200 pointer-events-none"
      ></div>
      
      {/* Add a pulsing effect for better visibility */}
      <div className={`absolute inset-0 rounded-full ${isConnected ? 'bg-green-400' : portType === "input" ? 'bg-blue-400' : 'bg-emerald-400'} opacity-50 animate-pulse pointer-events-none`}></div>
      
      {/* Add small icon to indicate direction */}
      <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
        {portType === "input" ? "in" : "out"}
      </div>
    </div>
  );
};

export default ConnectionPoint;
