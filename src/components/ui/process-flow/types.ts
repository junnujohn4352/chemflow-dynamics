
export interface Equipment {
  id: string;
  type: "reactor" | "pump" | "valve" | "heater" | "condenser" | "column" | "tank" | "mixer" | string;
  name: string;
  status: "running" | "stopped" | "warning" | "error" | string;
  metrics: {
    temperature?: number;
    pressure?: number;
    flow?: number;
    level?: number;
    [key: string]: any;
  };
  position: { x: number; y: number };
  connections?: string[];
  description?: string; // Added description for basic information
}

export interface Connection {
  id: string;
  source: string;
  target: string;
  animated: boolean;
  label?: string; // Added label for connection information
}

export interface SimulationData {
  componentA: number;
  componentB: number;
  systemEfficiency: number;
}
