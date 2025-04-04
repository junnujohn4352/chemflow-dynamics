
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  ChevronRight, 
  ChevronLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowUpRight,
  ArrowUpLeft,
  ArrowDownRight,
  ArrowDownLeft
} from "lucide-react";

interface ArrowToolkitProps {
  onSelectArrow: (type: string, rotation: number) => void;
  className?: string;
}

const ArrowToolkit: React.FC<ArrowToolkitProps> = ({
  onSelectArrow,
  className
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const arrowConfigurations = [
    { icon: ArrowRight, rotation: 0, label: "Right" },
    { icon: ArrowDown, rotation: 90, label: "Down" },
    { icon: ArrowLeft, rotation: 180, label: "Left" },
    { icon: ArrowUp, rotation: 270, label: "Up" },
    { icon: ArrowUpRight, rotation: 315, label: "Up-Right" },
    { icon: ArrowUpLeft, rotation: 225, label: "Up-Left" },
    { icon: ArrowDownRight, rotation: 45, label: "Down-Right" },
    { icon: ArrowDownLeft, rotation: 135, label: "Down-Left" },
  ];

  return (
    <div 
      className={cn(
        "absolute top-20 transition-all duration-300 z-20 flex",
        isOpen ? "left-4" : "-left-16",
        className
      )}
    >
      <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
        <div className="p-2 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h3 className="text-sm font-medium">Arrow Toolkit</h3>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 rounded hover:bg-gray-200 transition-colors"
            title={isOpen ? "Hide toolkit" : "Show toolkit"}
          >
            {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
        {isOpen && (
          <div className="p-2 grid grid-cols-2 gap-2">
            {arrowConfigurations.map((config, index) => (
              <button
                key={index}
                className="p-2 bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded-md flex flex-col items-center justify-center transition-colors"
                onClick={() => onSelectArrow("arrow", config.rotation)}
                title={`Add ${config.label} Arrow`}
              >
                <config.icon className="h-5 w-5 text-blue-600" />
                <span className="text-xs mt-1 text-gray-600">{config.rotation}°</span>
              </button>
            ))}
          </div>
        )}
      </div>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 ml-1 bg-white border border-gray-200 rounded-md shadow-md hover:bg-gray-50 transition-colors"
          title="Show toolkit"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default ArrowToolkit;
