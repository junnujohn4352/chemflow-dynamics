
import React from "react";
import { EquipmentType, getEquipmentIcon } from "./EquipmentIcons";
import EquipmentConnections from "./EquipmentConnections";
import EquipmentMetrics from "./EquipmentMetrics";

export interface EquipmentMetric {
  key: string;
  value: string;
  editable?: boolean;
  options?: string[];
  description?: string; // Added description to provide context for the parameter
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
  onMetricEdit?: (key: string, value: string) => void; // New prop for handling metric edits
  problem?: string; // New prop to provide context for parameter editing
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
  showDottedLines = false,
  onMetricEdit,
  problem
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

  const handleMetricChange = (key: string, value: string) => {
    if (onMetricEdit) {
      onMetricEdit(key, value);
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
      data-testid="equipment-card"
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
        <EquipmentMetrics 
          metrics={metrics} 
          onMetricChange={handleMetricChange}
        />
      )}

      {problem && selected && (
        <div className="absolute top-0 left-0 translate-y-[-100%] bg-white p-2 rounded shadow-lg text-xs max-w-[200px] z-20">
          <strong>Problem Context:</strong> {problem}
        </div>
      )}
    </div>
  );
};

export default EquipmentCard;
