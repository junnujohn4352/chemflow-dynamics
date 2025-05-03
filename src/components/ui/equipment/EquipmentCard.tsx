
import React from "react";
import { getEquipmentIcon } from "./EquipmentIcons";
import { Button } from "@/components/ui/button";
import { 
  Settings, Info, Trash2
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EquipmentType } from "./EquipmentIcons";
import { 
  isVessel, 
  isHeatExchanger, 
  isFlowController, 
  isReactor, 
  isColumn 
} from "./EquipmentTypeCheckers";

interface EquipmentCardProps {
  type: EquipmentType;
  title: string;
  onEdit?: () => void;
  onInfo?: () => void;
  onDelete?: () => void;
  selected?: boolean;
  metrics?: {
    key: string;
    value: string | number;
  }[];
}

export const EquipmentCard: React.FC<EquipmentCardProps> = ({
  type,
  title,
  onEdit,
  onInfo,
  onDelete,
  selected = false,
  metrics = []
}) => {
  // Determine icon color based on equipment type
  const getIconColor = () => {
    if (isReactor(type)) return "text-green-600";
    if (isColumn(type)) return "text-blue-600";
    if (isHeatExchanger(type)) return "text-red-600";
    if (isFlowController(type)) return "text-purple-600";
    if (isVessel(type)) return "text-amber-600";
    return "text-gray-600";
  };

  return (
    <Card 
      className={`border overflow-hidden transition-all ${
        selected 
          ? "border-blue-400 ring-2 ring-blue-200" 
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <span className={getIconColor()}>
            {getEquipmentIcon(type)}
          </span>
          <span className="truncate">{title}</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 pt-2 pb-2">
        {metrics && metrics.length > 0 && (
          <div className="grid grid-cols-2 gap-1 text-xs">
            {metrics.slice(0, 4).map((metric, idx) => (
              <div key={idx} className="flex justify-between">
                <span className="text-gray-500">{metric.key}:</span>
                <span className="font-medium">{metric.value}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-3 pt-0 flex justify-between gap-2">
        {onEdit && (
          <Button variant="outline" size="sm" onClick={onEdit} className="p-0 h-7 w-7">
            <Settings className="h-3.5 w-3.5" />
          </Button>
        )}
        
        {onInfo && (
          <Button variant="outline" size="sm" onClick={onInfo} className="p-0 h-7 w-7">
            <Info className="h-3.5 w-3.5" />
          </Button>
        )}
        
        {onDelete && (
          <Button variant="outline" size="sm" onClick={onDelete} className="p-0 h-7 w-7 hover:bg-red-50 hover:text-red-600 hover:border-red-200">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default EquipmentCard;
