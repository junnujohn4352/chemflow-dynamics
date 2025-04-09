
import React from "react";
import { cn } from "@/lib/utils";
import { getEquipmentIcon, EquipmentType } from "./EquipmentIcons";
import EquipmentConnections from "./EquipmentConnections";
import EquipmentMetrics from "./EquipmentMetrics";

interface EquipmentCardProps {
  type: EquipmentType;
  name: string;
  status?: "running" | "stopped" | "warning" | "error";
  metrics?: {
    temperature?: number;
    pressure?: number;
    flow?: number;
    level?: number;
    conversion?: number;
    power?: number;
    efficiency?: number;
    duty?: number;
  };
  className?: string;
  onClick?: () => void;
}

const EquipmentCard: React.FC<EquipmentCardProps> = ({
  type,
  name,
  status = "stopped",
  metrics,
  className,
  onClick,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case "running":
        return "bg-green-500";
      case "stopped":
        return "bg-gray-400";
      case "warning":
        return "bg-amber-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div
      className={cn(
        "group relative p-5 rounded-xl bg-white border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md",
        status === "running" && "ring-1 ring-green-200",
        className,
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-50 text-flow-blue">
            {getEquipmentIcon(type)}
          </div>
          <div>
            <h3 className="font-medium text-lg">{name}</h3>
            <div className="flex items-center mt-1">
              <div className={`h-2.5 w-2.5 rounded-full ${getStatusColor()} mr-2`}></div>
              <p className="text-sm text-gray-500 capitalize">{status}</p>
            </div>
          </div>
        </div>
      </div>

      <EquipmentConnections type={type} />
      <EquipmentMetrics metrics={metrics} />
      
      <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-200 group-hover:ring-flow-blue transition-all duration-300 opacity-0 group-hover:opacity-100 pointer-events-none"></div>
    </div>
  );
};

export default EquipmentCard;
