
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
    condenserDuty: -780
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
    condenserDuty: -780
  }
};
