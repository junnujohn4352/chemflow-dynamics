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
  icon?: string;
  // Add any other properties needed for equipment
}

export interface Connection {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
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
