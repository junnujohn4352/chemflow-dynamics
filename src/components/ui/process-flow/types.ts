
export interface Equipment {
  id: string;
  type: string;
  name?: string;
  position: {
    x: number;
    y: number;
  };
  rotation?: number;
  scale?: number;
  metrics?: Record<string, number>;
  parameters?: EquipmentParameter[];
  connectedPoints?: string[];
  connections?: string[]; // IDs of connections
  connectionPoints?: ConnectionPoint[]; // Connection points on this equipment
  inputPorts?: string[]; // IDs of input port points
  outputPorts?: string[]; // IDs of output port points
  status?: string;
  icon?: string;
  description?: string;
  settings?: Record<string, any>;
}

export interface Connection {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
  sourceHandle?: string;
  targetHandle?: string;
  dashed?: boolean; // Added for dashed line style
}

export interface EquipmentParameter {
  id: string;
  name: string;
  value: any;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  type: 'number' | 'boolean' | 'select' | 'string';
  options?: string[];
  category: 'basic' | 'advanced';
  description?: string;
}

export interface ConnectionPoint {
  id: string;
  position: "top" | "right" | "bottom" | "left";
  isConnected?: boolean;
  isConnectable?: boolean;
  portType?: "input" | "output"; // Added to specify port type
}
