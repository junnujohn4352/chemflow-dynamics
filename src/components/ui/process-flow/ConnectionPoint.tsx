
import React from "react";

interface ConnectionPointProps {
  id: string;
  position: "top" | "right" | "bottom" | "left";
  onClick?: (id: string) => void;
  isConnected?: boolean;
  isConnectable?: boolean;
}

const ConnectionPoint: React.FC<ConnectionPointProps> = ({
  id,
  position,
  onClick,
  isConnected = false,
  isConnectable = true
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick && isConnectable) {
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
  
  return (
    <div
      className={`absolute w-4 h-4 rounded-full cursor-pointer border-2 z-20
        ${isConnected 
          ? "bg-green-500 border-green-700" 
          : isConnectable 
            ? "bg-blue-500 border-blue-700 hover:bg-blue-600" 
            : "bg-gray-500 border-gray-700"
        } shadow-md`}
      style={{
        ...getPositionStyles(),
        transition: "all 0.2s ease",
        pointerEvents: "all"
      }}
      onClick={handleClick}
    >
      {/* Add a visual indicator when hovering */}
      <div 
        className={`absolute inset-0 rounded-full bg-white opacity-0 hover:opacity-30 
          transition-opacity duration-200 pointer-events-none`}
      ></div>
    </div>
  );
};

export default ConnectionPoint;
