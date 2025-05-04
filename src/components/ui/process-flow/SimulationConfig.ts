
// SimulationConfig.ts - Configuration for different simulation equipment types

// Type definitions for equipment configuration parameters
export interface HeatExchangerConfig {
  hotInletTemp: number;
  hotOutletTemp: number;
  coldInletTemp: number;
  coldOutletTemp: number;
  flowRate: number;
}

export interface DistillationColumnConfig {
  refluxRatio: number;
  feedRate: number;
  reboilerDuty: number;
  condenserDuty: number;
  feedComposition: Record<string, number>; // Add missing feedComposition property
}

export interface ReactorConfig {
  temperature: number;
  pressure: number;
  conversionRate: number;
  residenceTime: number;
}

export interface PumpConfig {
  flowRate: number;
  pressure: number;
  efficiency: number;
  power: number;
}

// Default configuration values
export const defaultConfigurations = {
  heatExchanger: {
    hotInletTemp: 150,
    hotOutletTemp: 80,
    coldInletTemp: 25,
    coldOutletTemp: 70,
    flowRate: 1000
  },
  distillationColumn: {
    refluxRatio: 3.5,
    feedRate: 100,
    reboilerDuty: 500,
    condenserDuty: 450,
    feedComposition: { // Include feedComposition in the default configuration
      ethanol: 0.4,
      water: 0.6
    }
  },
  reactor: {
    temperature: 120,
    pressure: 200,
    conversionRate: 0.85,
    residenceTime: 60
  },
  pump: {
    flowRate: 50,
    pressure: 300,
    efficiency: 0.7,
    power: 15
  }
};

// Helper functions for simulation configuration
export function getOptimalDistillationParameters(feedComposition: Record<string, number>) {
  // Calculate optimal parameters based on feed composition
  const ethanolContent = feedComposition.ethanol || 0;
  
  return {
    refluxRatio: ethanolContent > 0.5 ? 4.0 : 3.5,
    feedRate: 100,
    reboilerDuty: ethanolContent > 0.5 ? 550 : 500,
    condenserDuty: ethanolContent > 0.5 ? 500 : 450,
    feedComposition // Include feedComposition in the returned object
  };
}

// Simulation optimization functions
export function optimizeDistillationColumn(config: DistillationColumnConfig) {
  // Simple optimization: Adjust reflux ratio based on feed composition
  const mainComponent = Object.entries(config.feedComposition).sort((a, b) => b[1] - a[1])[0];
  const mainComponentFraction = mainComponent ? mainComponent[1] : 0.5;
  
  return {
    ...config,
    refluxRatio: config.refluxRatio * (0.9 + mainComponentFraction * 0.2),
    reboilerDuty: config.reboilerDuty * (0.95 + mainComponentFraction * 0.1)
  };
}

export function calculateHeatExchangerPerformance(config: HeatExchangerConfig) {
  const cp = 4.18; // Specific heat capacity of water in kJ/kg°C
  const duty = config.flowRate * cp * (config.coldOutletTemp - config.coldInletTemp) / 3600; // kW
  const lmtd = ((config.hotInletTemp - config.coldOutletTemp) - (config.hotOutletTemp - config.coldInletTemp)) / 
               Math.log((config.hotInletTemp - config.coldOutletTemp) / (config.hotOutletTemp - config.coldInletTemp));
  const uValue = 500; // Overall heat transfer coefficient in W/m²°C
  const area = duty * 1000 / (uValue * lmtd); // m²
  
  return { duty, lmtd, area };
}
