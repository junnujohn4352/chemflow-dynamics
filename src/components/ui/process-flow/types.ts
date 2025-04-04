
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
  connections?: string[]; // Added for compatibility
  connectionPoints?: ConnectionPoint[]; // Added for compatibility
  status?: string; // Added for compatibility
  icon?: string;
  description?: string; // Added for compatibility
  settings?: Record<string, any>; // Added for compatibility
  // Add any other properties needed for equipment
}

export interface Connection {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
  sourceHandle?: string; // Added for compatibility
  targetHandle?: string; // Added for compatibility
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
}
