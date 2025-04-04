
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
        return { top: "-5px", left: "50%", transform: "translateX(-50%)" };
      case "right":
        return { right: "-5px", top: "50%", transform: "translateY(-50%)" };
      case "bottom":
        return { bottom: "-5px", left: "50%", transform: "translateX(-50%)" };
      case "left":
        return { left: "-5px", top: "50%", transform: "translateY(-50%)" };
    }
  };
  
  return (
    <div
      className={`absolute w-3 h-3 rounded-full cursor-pointer border-2 
        ${isConnected 
          ? "bg-green-400 border-green-600" 
          : isConnectable 
            ? "bg-blue-400 border-blue-600 hover:bg-blue-500" 
            : "bg-gray-400 border-gray-600"
        } z-10 shadow-md`}
      style={{
        ...getPositionStyles(),
        transition: "all 0.2s ease"
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
