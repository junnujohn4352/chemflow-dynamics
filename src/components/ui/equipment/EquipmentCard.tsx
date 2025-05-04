
import React from "react";
import { EquipmentType, getEquipmentIcon } from "./EquipmentIcons";
import EquipmentConnections from "./EquipmentConnections";
import EquipmentMetrics from "./EquipmentMetrics";

export interface EquipmentMetric {
  key: string;
  value: string;
  editable?: boolean;
  options?: string[];
}

interface EquipmentCardProps {
  type: EquipmentType;
  title: string;
  metrics?: EquipmentMetric[];
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  draggable?: boolean;
  size?: "sm" | "md" | "lg";
  status?: "ready" | "running" | "error" | "complete";
  selected?: boolean;
  onClick?: () => void;
  showConnections?: boolean;
  onConnectionPointClick?: (point: string) => void;
  activeConnectionPoints?: string[];
  showDottedLines?: boolean;
}

const EquipmentCard: React.FC<EquipmentCardProps> = ({
  type,
  title,
  metrics = [],
  onDragStart,
  draggable = true,
  size = "md",
  status = "ready",
  selected = false,
  onClick,
  showConnections = false,
  onConnectionPointClick,
  activeConnectionPoints = [],
  showDottedLines = false
}) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (onDragStart) {
      onDragStart(e);
    }
  };

  const handleConnectionPointClick = (point: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onConnectionPointClick) {
      onConnectionPointClick(point);
    }
  };

  const sizeClasses = {
    sm: "w-[100px] h-[100px] p-2",
    md: "w-[150px] h-[150px] p-3",
    lg: "w-[200px] h-[200px] p-4",
  };

  const statusColors = {
    ready: "bg-blue-50 border-blue-200",
    running: "bg-amber-50 border-amber-200",
    error: "bg-red-50 border-red-200",
    complete: "bg-green-50 border-green-200",
  };

  const icon = getEquipmentIcon(type);

  return (
    <div
      className={`relative flex flex-col items-center justify-center ${sizeClasses[size]} ${statusColors[status]} 
        border rounded-lg shadow-sm cursor-pointer transition-all
        ${selected ? "ring-2 ring-blue-500 shadow-md" : "hover:shadow-md hover:border-blue-300"}
        ${draggable ? "cursor-grab active:cursor-grabbing" : ""}
      `}
      draggable={draggable}
      onDragStart={handleDragStart}
      onClick={onClick}
    >
      {showConnections && (
        <EquipmentConnections 
          type={type} 
          onClick={handleConnectionPointClick} 
          activePoints={activeConnectionPoints}
          showDottedLines={showDottedLines}
        />
      )}

      <div className="z-10 flex flex-col items-center justify-center">
        <div className="mb-1">{icon}</div>
        <div className="text-xs font-medium text-center whitespace-nowrap overflow-hidden text-ellipsis w-full">
          {title}
        </div>
      </div>

      {metrics.length > 0 && size !== "sm" && (
        <EquipmentMetrics metrics={metrics} />
      )}
    </div>
  );
};

export default EquipmentCard;
