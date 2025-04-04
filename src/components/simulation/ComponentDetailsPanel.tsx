
import React from 'react';
import { ArrowRight, CircleDot, FlaskConical, ThermometerSnowflake, Waves } from 'lucide-react';

interface ComponentDetailsPanelProps {
  componentName: string;
}

const ComponentDetailsPanel: React.FC<ComponentDetailsPanelProps> = ({ componentName }) => {
  // Mock data for the component properties
  const componentData = React.useMemo(() => {
    // Generate realistic data based on the component name
    const generateData = () => {
      switch (componentName.toLowerCase()) {
        case 'methane':
          return {
            formula: 'CH₄',
            molecularWeight: 16.04,
            criticalTemperature: -82.6,
            criticalPressure: 4600,
            acentricFactor: 0.011,
            normalBoilingPoint: -161.5,
            properties: {
              density: 0.657,
              thermalConductivity: 0.0332,
              viscosity: 0.011,
              heatCapacity: 35.31,
            }
          };
        case 'ethane':
          return {
            formula: 'C₂H₆',
            molecularWeight: 30.07,
            criticalTemperature: 32.2,
            criticalPressure: 4880,
            acentricFactor: 0.099,
            normalBoilingPoint: -88.6,
            properties: {
              density: 1.264,
              thermalConductivity: 0.0219,
              viscosity: 0.0095,
              heatCapacity: 52.5,
            }
          };
        case 'propane':
          return {
            formula: 'C₃H₈',
            molecularWeight: 44.1,
            criticalTemperature: 96.7,
            criticalPressure: 4250,
            acentricFactor: 0.152,
            normalBoilingPoint: -42.1,
            properties: {
              density: 1.898,
              thermalConductivity: 0.0177,
              viscosity: 0.008,
              heatCapacity: 73.6,
            }
          };
        case 'butane':
          return {
            formula: 'C₄H₁₀',
            molecularWeight: 58.12,
            criticalTemperature: 152.0,
            criticalPressure: 3800,
            acentricFactor: 0.199,
            normalBoilingPoint: -0.5,
            properties: {
              density: 2.489,
              thermalConductivity: 0.0149,
              viscosity: 0.007,
              heatCapacity: 97.45,
            }
          };
        case 'water':
          return {
            formula: 'H₂O',
            molecularWeight: 18.02,
            criticalTemperature: 374.0,
            criticalPressure: 22064,
            acentricFactor: 0.344,
            normalBoilingPoint: 100.0,
            properties: {
              density: 997,
              thermalConductivity: 0.607,
              viscosity: 0.891,
              heatCapacity: 4.18,
            }
          };
        case 'nitrogen':
          return {
            formula: 'N₂',
            molecularWeight: 28.01,
            criticalTemperature: -147.0,
            criticalPressure: 3400,
            acentricFactor: 0.039,
            normalBoilingPoint: -195.8,
            properties: {
              density: 1.145,
              thermalConductivity: 0.0258,
              viscosity: 0.0178,
              heatCapacity: 1.04,
            }
          };
        case 'oxygen':
          return {
            formula: 'O₂',
            molecularWeight: 32.0,
            criticalTemperature: -118.6,
            criticalPressure: 5043,
            acentricFactor: 0.022,
            normalBoilingPoint: -183.0,
            properties: {
              density: 1.429,
              thermalConductivity: 0.0267,
              viscosity: 0.0205,
              heatCapacity: 0.918,
            }
          };
        case 'carbon dioxide':
          return {
            formula: 'CO₂',
            molecularWeight: 44.01,
            criticalTemperature: 31.1,
            criticalPressure: 7390,
            acentricFactor: 0.224,
            normalBoilingPoint: -78.5, // Sublimation point
            properties: {
              density: 1.98,
              thermalConductivity: 0.0166,
              viscosity: 0.015,
              heatCapacity: 0.846,
            }
          };
        default:
          // Generic data for other components
          return {
            formula: 'Unknown',
            molecularWeight: Math.round(Math.random() * 100 + 20),
            criticalTemperature: Math.round(Math.random() * 300 - 100),
            criticalPressure: Math.round(Math.random() * 7000 + 3000),
            acentricFactor: (Math.random() * 0.4).toFixed(3),
            normalBoilingPoint: Math.round(Math.random() * 200 - 150),
            properties: {
              density: (Math.random() * 10).toFixed(3),
              thermalConductivity: (Math.random() * 0.5).toFixed(4),
              viscosity: (Math.random() * 0.1).toFixed(4),
              heatCapacity: (Math.random() * 100).toFixed(2),
            }
          };
      }
    };

    return generateData();
  }, [componentName]);

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-400 flex items-center">
            <FlaskConical className="h-5 w-5 mr-2" />
            {componentName}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Formula: {componentData.formula}
          </p>
        </div>
        <div className="p-2 px-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
          <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
            MW: {componentData.molecularWeight} g/mol
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center mb-2">
            <ThermometerSnowflake className="h-4 w-4 mr-1" />
            Critical Properties
          </h4>
          <div className="space-y-3">
            <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded flex justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">Critical Temperature:</span>
              <span className="text-xs font-medium">{componentData.criticalTemperature} °C</span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded flex justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">Critical Pressure:</span>
              <span className="text-xs font-medium">{componentData.criticalPressure} kPa</span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded flex justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">Acentric Factor:</span>
              <span className="text-xs font-medium">{componentData.acentricFactor}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center mb-2">
            <Waves className="h-4 w-4 mr-1" />
            Physical Properties
          </h4>
          <div className="space-y-3">
            <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded flex justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">Normal Boiling Point:</span>
              <span className="text-xs font-medium">{componentData.normalBoilingPoint} °C</span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded flex justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">Density (STP):</span>
              <span className="text-xs font-medium">{componentData.properties.density} kg/m³</span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded flex justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">Heat Capacity:</span>
              <span className="text-xs font-medium">{componentData.properties.heatCapacity} J/(mol·K)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center mb-2">
          <CircleDot className="h-4 w-4 mr-1" />
          Transport Properties (25°C, 1 atm)
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded flex justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">Thermal Conductivity:</span>
            <span className="text-xs font-medium">{componentData.properties.thermalConductivity} W/(m·K)</span>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded flex justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">Viscosity:</span>
            <span className="text-xs font-medium">{componentData.properties.viscosity} cP</span>
          </div>
        </div>
      </div>

      <div className="mt-4 text-right">
        <button className="text-xs flex items-center text-blue-600 hover:text-blue-800 transition-colors">
          View complete property data
          <ArrowRight className="h-3 w-3 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default ComponentDetailsPanel;
