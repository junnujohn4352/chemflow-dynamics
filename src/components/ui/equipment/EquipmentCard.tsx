
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Activity, Thermometer, Gauge, ArrowRight } from "lucide-react";
import { EquipmentIcons, EquipmentType } from "./EquipmentIcons";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export interface EquipmentProps {
  type: EquipmentType;
  name: string;
  status?: "running" | "stopped";
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
  onMetricsChange?: (metrics: any) => void;
  draggable?: boolean;
}

export const EquipmentCard: React.FC<EquipmentProps> = ({
  type,
  name,
  status = "stopped",
  metrics = {},
  onMetricsChange,
  draggable = true
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localMetrics, setLocalMetrics] = useState({ ...metrics });

  const Icon = EquipmentIcons[type] || EquipmentIcons["default"];

  const handleMetricChange = (key: string, value: string) => {
    const newValue = parseFloat(value);
    if (!isNaN(newValue)) {
      const updatedMetrics = {
        ...localMetrics,
        [key]: newValue
      };
      setLocalMetrics(updatedMetrics);
      if (onMetricsChange) {
        onMetricsChange(updatedMetrics);
      }
    }
  };

  const handleDialogClose = () => {
    setIsEditing(false);
  };

  return (
    <Card className={`overflow-hidden ${draggable ? 'cursor-grab active:cursor-grabbing' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-50 p-2 rounded-md text-blue-600">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-medium">{name}</h3>
              <Badge 
                variant={status === "running" ? "default" : "outline"}
                className={status === "running" ? "bg-green-500 hover:bg-green-600" : ""}
              >
                {status === "running" ? "Running" : "Stopped"}
              </Badge>
            </div>
          </div>
          
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Edit2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Equipment Parameters</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {metrics.temperature !== undefined && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="temperature" className="text-right flex items-center">
                      <Thermometer className="h-4 w-4 mr-2" />
                      Temperature
                    </Label>
                    <Input
                      id="temperature"
                      type="number"
                      className="col-span-3"
                      value={localMetrics.temperature}
                      onChange={(e) => handleMetricChange('temperature', e.target.value)}
                    />
                  </div>
                )}
                
                {metrics.pressure !== undefined && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="pressure" className="text-right flex items-center">
                      <Gauge className="h-4 w-4 mr-2" />
                      Pressure
                    </Label>
                    <Input
                      id="pressure"
                      type="number"
                      className="col-span-3"
                      value={localMetrics.pressure}
                      onChange={(e) => handleMetricChange('pressure', e.target.value)}
                    />
                  </div>
                )}
                
                {metrics.flow !== undefined && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="flow" className="text-right flex items-center">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Flow Rate
                    </Label>
                    <Input
                      id="flow"
                      type="number"
                      className="col-span-3"
                      value={localMetrics.flow}
                      onChange={(e) => handleMetricChange('flow', e.target.value)}
                    />
                  </div>
                )}
                
                {metrics.level !== undefined && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="level" className="text-right">Level</Label>
                    <Input
                      id="level"
                      type="number"
                      className="col-span-3"
                      value={localMetrics.level}
                      onChange={(e) => handleMetricChange('level', e.target.value)}
                    />
                  </div>
                )}
                
                {metrics.conversion !== undefined && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="conversion" className="text-right">Conversion</Label>
                    <Input
                      id="conversion"
                      type="number"
                      className="col-span-3"
                      value={localMetrics.conversion}
                      onChange={(e) => handleMetricChange('conversion', e.target.value)}
                    />
                  </div>
                )}
                
                {metrics.power !== undefined && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="power" className="text-right">Power</Label>
                    <Input
                      id="power"
                      type="number"
                      className="col-span-3"
                      value={localMetrics.power}
                      onChange={(e) => handleMetricChange('power', e.target.value)}
                    />
                  </div>
                )}
                
                {metrics.efficiency !== undefined && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="efficiency" className="text-right">Efficiency</Label>
                    <Input
                      id="efficiency"
                      type="number"
                      className="col-span-3"
                      value={localMetrics.efficiency}
                      onChange={(e) => handleMetricChange('efficiency', e.target.value)}
                    />
                  </div>
                )}
                
                {metrics.duty !== undefined && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="duty" className="text-right">Duty</Label>
                    <Input
                      id="duty"
                      type="number"
                      className="col-span-3"
                      value={localMetrics.duty}
                      onChange={(e) => handleMetricChange('duty', e.target.value)}
                    />
                  </div>
                )}
              </div>
              <DialogClose asChild>
                <Button onClick={handleDialogClose}>Save Changes</Button>
              </DialogClose>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="mt-4 space-y-2">
          {metrics.temperature !== undefined && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-gray-500">
                <Thermometer className="h-4 w-4 mr-2" />
                Temperature
              </div>
              <div>{localMetrics.temperature} °C</div>
            </div>
          )}
          
          {metrics.pressure !== undefined && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-gray-500">
                <Gauge className="h-4 w-4 mr-2" />
                Pressure
              </div>
              <div>{localMetrics.pressure} bar</div>
            </div>
          )}
          
          {metrics.flow !== undefined && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-gray-500">
                <ArrowRight className="h-4 w-4 mr-2" />
                Flow Rate
              </div>
              <div>{localMetrics.flow} m³/h</div>
            </div>
          )}
          
          {metrics.level !== undefined && (
            <div className="flex items-center justify-between text-sm">
              <div className="text-gray-500">Level</div>
              <div>{localMetrics.level}%</div>
            </div>
          )}
          
          {metrics.conversion !== undefined && (
            <div className="flex items-center justify-between text-sm">
              <div className="text-gray-500">Conversion</div>
              <div>{localMetrics.conversion}%</div>
            </div>
          )}
          
          {metrics.power !== undefined && (
            <div className="flex items-center justify-between text-sm">
              <div className="text-gray-500">Power</div>
              <div>{localMetrics.power} kW</div>
            </div>
          )}
          
          {metrics.efficiency !== undefined && (
            <div className="flex items-center justify-between text-sm">
              <div className="text-gray-500">Efficiency</div>
              <div>{localMetrics.efficiency}%</div>
            </div>
          )}
          
          {metrics.duty !== undefined && (
            <div className="flex items-center justify-between text-sm">
              <div className="text-gray-500">Duty</div>
              <div>{localMetrics.duty} kW</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EquipmentCard;
