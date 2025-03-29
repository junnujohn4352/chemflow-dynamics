
import React, { useState, useEffect } from "react";
import { Check, Info, Thermometer, ChevronRight, AlertCircle, X, BarChart } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

// Thermodynamic models
const THERMODYNAMIC_MODELS = [
  { 
    id: "peng-robinson", 
    name: "Peng-Robinson", 
    description: "Cubic equation of state, good for hydrocarbons, natural gas, and oil systems.",
    suitable: ["Hydrocarbons", "Light gases", "Natural gas", "Petroleum systems"],
    unsuitable: ["Highly polar compounds", "Hydrogen bonding", "Electrolytes", "Polymers"],
    temperature: "Low to high temperatures",
    pressure: "Medium to high pressures",
    accuracy: 85
  },
  { 
    id: "srk", 
    name: "Soave-Redlich-Kwong", 
    description: "Cubic equation of state, performs well for vapor-liquid equilibrium calculations.",
    suitable: ["Hydrocarbons", "Light gases", "Petrochemical systems"],
    unsuitable: ["Strong polar compounds", "Electrolytes", "Polymers"],
    temperature: "Medium to high temperatures",
    pressure: "Medium to high pressures",
    accuracy: 80
  },
  { 
    id: "nrtl", 
    name: "NRTL", 
    description: "Activity coefficient model for strongly non-ideal liquid mixtures.",
    suitable: ["Polar compounds", "Alcohols", "Azeotropic systems", "Immiscible liquids"],
    unsuitable: ["Supercritical fluids", "High pressure systems", "Gas-phase calculations"],
    temperature: "Low to medium temperatures",
    pressure: "Low to medium pressures",
    accuracy: 90
  },
  { 
    id: "uniquac", 
    name: "UNIQUAC", 
    description: "Activity coefficient model that accounts for molecular size and shape differences.",
    suitable: ["Polar mixtures", "Alcohol-water systems", "Partially miscible systems"],
    unsuitable: ["Supercritical fluids", "High pressure systems", "Gas-phase calculations"],
    temperature: "Low to medium temperatures",
    pressure: "Low pressures",
    accuracy: 88
  },
  { 
    id: "wilson", 
    name: "Wilson", 
    description: "Activity coefficient model for polar and non-polar mixtures.",
    suitable: ["Polar mixtures", "Alcohol-hydrocarbon systems", "Binary mixtures"],
    unsuitable: ["Partially miscible liquids", "Electrolytes", "Polymers"],
    temperature: "Low to medium temperatures",
    pressure: "Low pressures",
    accuracy: 86
  },
  { 
    id: "saft", 
    name: "SAFT", 
    description: "Statistical Associating Fluid Theory, advanced equation of state.",
    suitable: ["Associating fluids", "Hydrogen-bonding systems", "Polymers", "Complex mixtures"],
    unsuitable: ["Simple systems where cubic EoS is sufficient"],
    temperature: "Wide temperature range",
    pressure: "Wide pressure range",
    accuracy: 95
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
  const { toast } = useToast();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [modelFilter, setModelFilter] = useState<string | null>(null);
  
  // Find the currently selected model details
  const currentModel = THERMODYNAMIC_MODELS.find(model => 
    model.name === selectedModel || model.id === selectedModel.toLowerCase().replace(' ', '-')
  );
  
  const handleModelSelect = (modelName: string) => {
    setSelectedModel(modelName);
    
    toast({
      title: "Model Selected",
      description: `${modelName} has been set as your thermodynamic model`
    });
  };
  
  const modelCategories = [
    { id: "eos", name: "Equations of State", models: ["Peng-Robinson", "Soave-Redlich-Kwong", "SAFT"] },
    { id: "activity", name: "Activity Coefficient", models: ["NRTL", "UNIQUAC", "Wilson"] },
  ];
  
  const filteredModels = modelFilter 
    ? THERMODYNAMIC_MODELS.filter(model => 
        modelCategories.find(cat => cat.id === modelFilter)?.models.includes(model.name)
      )
    : THERMODYNAMIC_MODELS;
  
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-medium mb-4">Thermodynamic Method</h2>
      <p className="text-gray-600 mb-6">
        Select the appropriate thermodynamic model for your simulation. The choice of model
        significantly affects calculation accuracy.
      </p>
      
      {/* Model type filter */}
      <div className="mb-6 flex gap-3">
        <button
          className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
            modelFilter === null ? 'bg-flow-blue text-white border-flow-blue' : 'bg-white border-gray-200 hover:bg-gray-50'
          }`}
          onClick={() => setModelFilter(null)}
        >
          All Models
        </button>
        {modelCategories.map(category => (
          <button
            key={category.id}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
              modelFilter === category.id ? 'bg-flow-blue text-white border-flow-blue' : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => setModelFilter(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="col-span-1 lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredModels.map(model => (
              <div 
                key={model.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  model.name === selectedModel
                    ? 'border-flow-blue bg-blue-50 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
                onClick={() => handleModelSelect(model.name)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{model.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{model.description}</p>
                    
                    <div className="mt-3 flex items-center text-sm">
                      <span className="text-gray-500 mr-2">Accuracy:</span>
                      <div className="bg-gray-200 h-2 rounded-full w-24 overflow-hidden">
                        <div 
                          className="h-full bg-flow-blue rounded-full"
                          style={{ width: `${model.accuracy}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 font-medium">{model.accuracy}%</span>
                    </div>
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
              <button 
                className="text-sm text-flow-blue hover:text-flow-blue/80 flex items-center"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                <Info className="h-4 w-4 mr-1.5" />
                Advanced Parameters
                <ChevronRight className={`h-4 w-4 ml-1 transition-transform ${showAdvanced ? 'rotate-90' : ''}`} />
              </button>
              
              {showAdvanced && (
                <div className="mt-3 space-y-3 text-sm bg-white p-3 rounded-lg border border-gray-100">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Binary Interaction Parameters:</span>
                    <button className="text-flow-blue hover:underline">
                      Edit
                    </button>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reference State:</span>
                    <span>Ideal Gas</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mixing Rule:</span>
                    <span>van der Waals</span>
                  </div>
                </div>
              )}
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
            <button 
              className="mt-2 text-sm bg-amber-100 hover:bg-amber-200 text-amber-800 px-3 py-1 rounded-md inline-flex items-center"
              onClick={() => handleModelSelect("Peng-Robinson")}
            >
              <BarChart className="h-3.5 w-3.5 mr-1.5" />
              Apply Recommendation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThermodynamicsSelector;
