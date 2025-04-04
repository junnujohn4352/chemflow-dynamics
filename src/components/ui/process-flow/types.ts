
export type EquipmentType = "reactor" | "pump" | "valve" | "heater" | "condenser" | "column" | "tank" | "mixer";

export interface Equipment {
  id: string;
  type: EquipmentType;
  name: string | number;
  status: "running" | "stopped" | "error";
  metrics: Record<string, any>;
  position: { x: number; y: number };
  connections: string[];
  description?: string;
}

export interface Connection {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
  label?: string;
}
