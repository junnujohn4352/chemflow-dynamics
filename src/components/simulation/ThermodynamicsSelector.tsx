
import React from "react";
import { Check, Info, Thermometer, ChevronRight, AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Thermodynamic models
const THERMODYNAMIC_MODELS = [
  { 
    id: "peng-robinson", 
    name: "Peng-Robinson", 
    description: "Cubic equation of state, good for hydrocarbons, natural gas, and oil systems.",
    suitable: ["Hydrocarbons", "Light gases", "Natural gas", "Petroleum systems"],
    unsuitable: ["Highly polar compounds", "Hydrogen bonding", "Electrolytes", "Polymers"],
    temperature: "Low to high temperatures",
    pressure: "Medium to high pressures"
  },
  { 
    id: "srk", 
    name: "Soave-Redlich-Kwong", 
    description: "Cubic equation of state, performs well for vapor-liquid equilibrium calculations.",
    suitable: ["Hydrocarbons", "Light gases", "Petrochemical systems"],
    unsuitable: ["Strong polar compounds", "Electrolytes", "Polymers"],
    temperature: "Medium to high temperatures",
    pressure: "Medium to high pressures"
  },
  { 
    id: "nrtl", 
    name: "NRTL", 
    description: "Activity coefficient model for strongly non-ideal liquid mixtures.",
    suitable: ["Polar compounds", "Alcohols", "Azeotropic systems", "Immiscible liquids"],
    unsuitable: ["Supercritical fluids", "High pressure systems", "Gas-phase calculations"],
    temperature: "Low to medium temperatures",
    pressure: "Low to medium pressures"
  },
  { 
    id: "uniquac", 
    name: "UNIQUAC", 
    description: "Activity coefficient model that accounts for molecular size and shape differences.",
    suitable: ["Polar mixtures", "Alcohol-water systems", "Partially miscible systems"],
    unsuitable: ["Supercritical fluids", "High pressure systems", "Gas-phase calculations"],
    temperature: "Low to medium temperatures",
    pressure: "Low pressures"
  },
  { 
    id: "wilson", 
    name: "Wilson", 
    description: "Activity coefficient model for polar and non-polar mixtures.",
    suitable: ["Polar mixtures", "Alcohol-hydrocarbon systems", "Binary mixtures"],
    unsuitable: ["Partially miscible liquids", "Electrolytes", "Polymers"],
    temperature: "Low to medium temperatures",
    pressure: "Low pressures"
  },
  { 
    id: "saft", 
    name: "SAFT", 
    description: "Statistical Associating Fluid Theory, advanced equation of state.",
    suitable: ["Associating fluids", "Hydrogen-bonding systems", "Polymers", "Complex mixtures"],
    unsuitable: ["Simple systems where cubic EoS is sufficient"],
    temperature: "Wide temperature range",
    pressure: "Wide pressure range"
  },
];

interface ThermodynamicsSelectorProps {
  selectedModel: string;
  setSelectedModel: React.Dispatch<React.SetStateAction<string>>;
}

const ThermodynamicsSelector: React.FC<ThermodynamicsSelectorProps> = ({ 
  selectedModel,
  setSelectedModel 
}) => {
  // Find the currently selected model details
  const currentModel = THERMODYNAMIC_MODELS.find(model => 
    model.name.toLowerCase() === selectedModel.toLowerCase()
  );
  
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-medium mb-4">Thermodynamic Method</h2>
      <p className="text-gray-600 mb-6">
        Select the appropriate thermodynamic model for your simulation. The choice of model
        significantly affects calculation accuracy.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="col-span-1 lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {THERMODYNAMIC_MODELS.map(model => (
              <div 
                key={model.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  model.name === selectedModel
                    ? 'border-flow-blue bg-blue-50 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
                onClick={() => setSelectedModel(model.name)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{model.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{model.description}</p>
                  </div>
                  <div className={`h-5 w-5 flex items-center justify-center rounded-full ${
                    model.name === selectedModel
                      ? 'bg-flow-blue text-white'
                      : 'border border-gray-300'
                  }`}>
                    {model.name === selectedModel && <Check className="h-3 w-3" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {currentModel && (
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <h3 className="font-medium mb-3 flex items-center">
              <Thermometer className="mr-2 h-4 w-4 text-flow-blue" />
              {currentModel.name} Properties
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Suitable For:</h4>
                <div className="space-y-1">
                  {currentModel.suitable.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="h-3.5 w-3.5 text-green-500 mr-2" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Not Recommended For:</h4>
                <div className="space-y-1">
                  {currentModel.unsuitable.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <AlertCircle className="h-3.5 w-3.5 text-amber-500 mr-2" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Temperature Range:</span>
                  <span className="font-medium">{currentModel.temperature}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Pressure Range:</span>
                  <span className="font-medium">{currentModel.pressure}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="text-sm text-flow-blue hover:text-flow-blue/80 flex items-center">
                      <Info className="h-4 w-4 mr-1.5" />
                      Advanced Parameters
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Binary interaction parameters and model settings</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mr-3 mt-0.5" />
          <div>
            <h4 className="font-medium text-amber-800">Recommendation</h4>
            <p className="text-sm text-amber-700 mt-1">
              Based on your selected components, we recommend using the Peng-Robinson
              equation of state for better accuracy with hydrocarbon systems.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThermodynamicsSelector;
