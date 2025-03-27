
import React from "react";
import EquipmentCard from "../EquipmentCard";
import { ArrowRight } from "lucide-react";
import { SimulationConfig } from "@/lib/supabase";

interface ProcessFlowDiagramProps {
  config: SimulationConfig;
}

const ProcessFlowDiagram: React.FC<ProcessFlowDiagramProps> = ({ config }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-4">
        <EquipmentCard 
          type="tank" 
          name="Feed Tank" 
          status={config.equipmentStates.feedTank.status} 
          metrics={config.equipmentStates.feedTank.metrics}
        />
        <div className="flex items-center justify-center">
          <div className="h-0.5 w-full bg-gradient-to-r from-flow-blue to-flow-cyan"></div>
          <ArrowRight className="text-flow-blue" />
        </div>
        <EquipmentCard 
          type="pump" 
          name="Feed Pump" 
          status={config.equipmentStates.feedPump.status} 
          metrics={config.equipmentStates.feedPump.metrics}
        />
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center justify-center">
          <div className="h-10 w-0.5 bg-gradient-to-b from-flow-blue to-flow-cyan"></div>
        </div>
        <div></div>
        <div className="flex items-center justify-center">
          <div className="h-10 w-0.5 bg-gradient-to-b from-flow-blue to-flow-cyan"></div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <EquipmentCard 
          type="heater" 
          name="Preheater" 
          status={config.equipmentStates.preheater.status} 
          metrics={config.equipmentStates.preheater.metrics}
        />
        <div className="flex items-center justify-center">
          <div className="h-0.5 w-full bg-gradient-to-r from-flow-blue to-flow-cyan"></div>
          <ArrowRight className="text-flow-blue" />
        </div>
        <EquipmentCard 
          type="column" 
          name="Distillation Column" 
          status={config.equipmentStates.distillationColumn.status} 
          metrics={config.equipmentStates.distillationColumn.metrics}
        />
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center justify-center">
          <div className="h-10 w-0.5 bg-gradient-to-b from-flow-blue to-flow-cyan"></div>
        </div>
        <div></div>
        <div className="flex items-center justify-center">
          <div className="h-10 w-0.5 bg-gradient-to-b from-flow-blue to-flow-cyan"></div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <EquipmentCard 
          type="tank" 
          name="Product Tank" 
          status={config.equipmentStates.productTank.status} 
          metrics={config.equipmentStates.productTank.metrics}
        />
        <div className="flex items-center justify-center">
          <div className="h-0.5 w-full bg-gradient-to-r from-flow-blue to-flow-cyan"></div>
          <ArrowRight className="text-flow-blue" />
        </div>
        <EquipmentCard 
          type="condenser" 
          name="Condenser" 
          status={config.equipmentStates.condenser.status} 
          metrics={config.equipmentStates.condenser.metrics}
        />
      </div>
    </div>
  );
};

export default ProcessFlowDiagram;
