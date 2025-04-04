
export interface Equipment {
  id: string;
  type: "reactor" | "pump" | "valve" | "heater" | "condenser" | "column" | "tank" | "mixer";
  name: string;
  status: "running" | "stopped" | "warning" | "error";
  metrics: {
    temperature?: number;
    pressure?: number;
    flow?: number;
    level?: number;
    [key: string]: any;
  };
  position: { x: number; y: number };
  connections?: string[];
  inputPorts?: string[];
  outputPorts?: string[];
}

export interface Connection {
  id: string;
  source: string;
  target: string;
  animated: boolean;
  dashed?: boolean;
}

export interface SimulationData {
  componentA: number;
  componentB: number;
  systemEfficiency: number;
}
