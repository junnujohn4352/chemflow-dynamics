
export interface Connection {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
}

export type EquipmentType = string;

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
}

export interface GridCell {
  x: number;
  y: number;
  equipmentId: string | null;
}
