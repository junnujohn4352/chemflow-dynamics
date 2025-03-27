
import { SimulationConfig } from "@/lib/supabase";

export const defaultConfig: SimulationConfig = {
  equipmentStates: {
    feedTank: {
      status: "stopped",
      metrics: { level: 75, temperature: 25 }
    },
    feedPump: {
      status: "stopped",
      metrics: { flow: 120 }
    },
    preheater: {
      status: "stopped",
      metrics: { temperature: 25 }
    },
    distillationColumn: {
      status: "stopped",
      metrics: { pressure: 150, temperature: 30 }
    },
    productTank: {
      status: "stopped",
      metrics: { level: 10, temperature: 25 }
    },
    condenser: {
      status: "stopped",
      metrics: { temperature: 25 }
    }
  },
  parameters: {
    refluxRatio: 3.5,
    feedRate: 120,
    reboilerDuty: 850,
    condenserDuty: -780,
    feedComposition: { componentA: 0.45, componentB: 0.55 },
    operatingPressure: 150,
    controlMode: "manual"
  }
};

export const runningConfig: SimulationConfig = {
  equipmentStates: {
    feedTank: {
      status: "running",
      metrics: { level: 75, temperature: 25 }
    },
    feedPump: {
      status: "running",
      metrics: { flow: 120 }
    },
    preheater: {
      status: "running",
      metrics: { temperature: 85 }
    },
    distillationColumn: {
      status: "running",
      metrics: { pressure: 150, temperature: 95 }
    },
    productTank: {
      status: "running",
      metrics: { level: 45, temperature: 60 }
    },
    condenser: {
      status: "running",
      metrics: { temperature: 40 }
    }
  },
  parameters: {
    refluxRatio: 3.5,
    feedRate: 120,
    reboilerDuty: 850,
    condenserDuty: -780,
    feedComposition: { componentA: 0.45, componentB: 0.55 },
    operatingPressure: 150,
    controlMode: "automatic"
  }
};

// Client-side simulation calculation functions
export const calculateSimulationResults = (config: SimulationConfig) => {
  // This function performs client-side calculations to simulate process results
  // In a real application, these would be more complex thermodynamic calculations
  
  const isRunning = Object.values(config.equipmentStates).some(
    equipment => equipment.status === "running"
  );
  
  if (!isRunning) {
    return {
      componentA: 0,
      componentB: 0,
      efficiency: 0,
      timestamp: new Date().toISOString()
    };
  }
  
  // Simple simulation algorithm based on input parameters
  const { refluxRatio, feedRate, reboilerDuty, condenserDuty, feedComposition } = config.parameters;
  
  // Calculate component separation based on reflux ratio and duties
  const separation = 0.5 + (0.1 * refluxRatio) + (reboilerDuty / 10000) - (condenserDuty / 10000);
  const componentASeparation = Math.min(0.99, Math.max(0.5, separation));
  
  // Calculate efficiency based on various parameters
  const theoreticalMaxEfficiency = 95;
  const actualEfficiency = theoreticalMaxEfficiency * (0.7 + (refluxRatio / 10) + (feedRate / 1000));
  const efficiency = Math.min(98, Math.max(60, actualEfficiency));
  
  // Calculate final product compositions
  const componentA = Math.round(componentASeparation * 100);
  const componentB = Math.round((1 - componentASeparation) * 100);
  
  return {
    componentA,
    componentB,
    efficiency: Math.round(efficiency),
    timestamp: new Date().toISOString()
  };
};
