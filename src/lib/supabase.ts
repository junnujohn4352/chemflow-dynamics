
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials missing. Please check your environment variables.');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

// Type definitions for our simulation data
export interface SimulationData {
  id?: string;
  name: string;
  description?: string;
  config: SimulationConfig;
  results?: SimulationResults;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

export interface SimulationConfig {
  equipmentStates: {
    feedTank: EquipmentState;
    feedPump: EquipmentState;
    preheater: EquipmentState;
    distillationColumn: EquipmentState;
    productTank: EquipmentState;
    condenser: EquipmentState;
  };
  parameters: {
    refluxRatio: number;
    feedRate: number;
    reboilerDuty: number;
    condenserDuty: number;
  };
}

export interface EquipmentState {
  status: 'running' | 'stopped' | 'error';
  metrics: Record<string, number | string>;
}

export interface SimulationResults {
  componentA: number;
  componentB: number;
  efficiency: number;
  timestamp: string;
}
