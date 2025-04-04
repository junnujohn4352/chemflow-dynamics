
import React from 'react';
import { Download, BarChart, Zap } from 'lucide-react';

interface StreamDataPanelProps {
  selectedComponents: string[];
}

const StreamDataPanel: React.FC<StreamDataPanelProps> = ({ selectedComponents }) => {
  // Synthetic data for stream properties
  const streamData = {
    feed: {
      totalFlow: 100.0,
      temperature: 25.0,
      pressure: 101.325,
      phase: "Liquid",
      compositions: Object.fromEntries(
        selectedComponents.map(comp => [
          comp, 
          Math.round(Math.random() * 100) / 100
        ])
      ),
      density: 850.5,
      molecularWeight: 58.2,
      viscosity: 0.58,
      thermalConductivity: 0.125
    },
    product: {
      totalFlow: 95.0,
      temperature: 75.0,
      pressure: 95.325,
      phase: "Vapor/Liquid",
      compositions: Object.fromEntries(
        selectedComponents.map(comp => [
          comp, 
          Math.round(Math.random() * 100) / 100
        ])
      ),
      density: 780.2,
      molecularWeight: 52.8,
      viscosity: 0.41,
      thermalConductivity: 0.108
    }
  };

  // Normalize compositions
  const normalizeCompositions = (compositions: Record<string, number>) => {
    const sum = Object.values(compositions).reduce((a, b) => a + b, 0);
    return Object.fromEntries(
      Object.entries(compositions).map(([key, value]) => [key, sum > 0 ? value / sum : 0])
    );
  };

  streamData.feed.compositions = normalizeCompositions(streamData.feed.compositions);
  streamData.product.compositions = normalizeCompositions(streamData.product.compositions);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400">Stream Properties</h3>
        <button className="p-1.5 rounded-md bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 hover:bg-blue-100 transition-colors">
          <Download className="h-4 w-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StreamCard 
          name="Feed Stream" 
          data={streamData.feed} 
          selectedComponents={selectedComponents} 
        />
        <StreamCard 
          name="Product Stream" 
          data={streamData.product} 
          selectedComponents={selectedComponents} 
        />
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-base font-medium flex items-center">
            <BarChart className="h-4 w-4 mr-2 text-blue-500" />
            Component Distribution
          </h4>
          <div className="flex space-x-1 text-xs font-medium">
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Feed</span>
            <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700">Product</span>
          </div>
        </div>
        
        <div className="space-y-3">
          {selectedComponents.map(component => (
            <div key={component} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>{component}</span>
                <div className="flex space-x-2">
                  <span className="text-blue-600">{(streamData.feed.compositions[component] * 100).toFixed(1)}%</span>
                  <span className="text-green-600">{(streamData.product.compositions[component] * 100).toFixed(1)}%</span>
                </div>
              </div>
              
              <div className="flex h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-500" 
                  style={{ width: `${streamData.feed.compositions[component] * 100}%` }} 
                />
                <div 
                  className="bg-green-500" 
                  style={{ width: '100%', transform: `scaleX(${streamData.product.compositions[component]})`, transformOrigin: 'right' }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-base font-medium flex items-center">
            <Zap className="h-4 w-4 mr-2 text-blue-500" />
            Energy Analysis
          </h4>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
            <div className="text-xs text-gray-500 dark:text-gray-400">Enthalpy Change</div>
            <div className="text-lg font-medium text-blue-700 dark:text-blue-400">125.3 kJ</div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
            <div className="text-xs text-gray-500 dark:text-gray-400">Heat Duty</div>
            <div className="text-lg font-medium text-blue-700 dark:text-blue-400">85.7 kW</div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
            <div className="text-xs text-gray-500 dark:text-gray-400">Vapor Fraction</div>
            <div className="text-lg font-medium text-blue-700 dark:text-blue-400">0.35</div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
            <div className="text-xs text-gray-500 dark:text-gray-400">Entropy Change</div>
            <div className="text-lg font-medium text-blue-700 dark:text-blue-400">0.28 kJ/K</div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface StreamCardProps {
  name: string;
  data: {
    totalFlow: number;
    temperature: number;
    pressure: number;
    phase: string;
    compositions: Record<string, number>;
    density: number;
    molecularWeight: number;
    viscosity: number;
    thermalConductivity: number;
  };
  selectedComponents: string[];
}

const StreamCard: React.FC<StreamCardProps> = ({ name, data, selectedComponents }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
      <h5 className="font-medium mb-3 text-blue-700 dark:text-blue-400">{name}</h5>
      
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Flow Rate:</span>
          <span className="font-medium">{data.totalFlow.toFixed(1)} kg/h</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Temperature:</span>
          <span className="font-medium">{data.temperature.toFixed(1)} °C</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Pressure:</span>
          <span className="font-medium">{data.pressure.toFixed(1)} kPa</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Phase:</span>
          <span className="font-medium">{data.phase}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Density:</span>
          <span className="font-medium">{data.density.toFixed(1)} kg/m³</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Mol. Weight:</span>
          <span className="font-medium">{data.molecularWeight.toFixed(1)} g/mol</span>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        <h6 className="text-xs font-medium mb-2 text-gray-600 dark:text-gray-300">Composition (mole fraction)</h6>
        <div className="grid grid-cols-2 gap-1 text-sm max-h-24 overflow-y-auto">
          {selectedComponents.map(comp => (
            <div key={comp} className="flex justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">{comp}:</span>
              <span className="text-xs font-medium">
                {data.compositions[comp]?.toFixed(3) || '0.000'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StreamDataPanel;
