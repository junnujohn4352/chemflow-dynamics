
export interface Connection {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string; // Added source connection point
  targetHandle?: string; // Added target connection point
  label?: string;
  animated?: boolean;
}

export type EquipmentType = string;

export interface ConnectionPoint {
  id: string;
  position: 'top' | 'right' | 'bottom' | 'left';
  offset?: {
    x: number;
    y: number;
  };
}

export interface Equipment {
  id: string;
  type: EquipmentType;
  name: string;
  position: {
    x: number;
    y: number;
  };
  settings?: Record<string, any>;
  connections?: string[];
  status?: string;
  metrics?: Record<string, any>;
  description?: string;
  rotation?: number; // Added rotation property for arrow direction
  scale?: number; // Added scale property for arrow size
  subType?: string; // Added subType for more specific equipment categories
  connectionPoints?: ConnectionPoint[]; // Added connection points
  icon?: string; // Added icon property
}

export interface GridCell {
  x: number;
  y: number;
  equipmentId: string | null;
}
