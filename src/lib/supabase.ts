
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with mock data when env variables are missing
// In production, these would be set in your deployment environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mock-url-for-development.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'mock-key-for-development';

// Create a mockable version of the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Log if we're in mock mode
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Supabase is running in mock mode. Data operations will fail in production.');
  console.warn('Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables to connect to your Supabase instance.');
}

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
    feedComposition: { componentA: number; componentB: number };
    operatingPressure: number;
    controlMode: "manual" | "automatic";
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
