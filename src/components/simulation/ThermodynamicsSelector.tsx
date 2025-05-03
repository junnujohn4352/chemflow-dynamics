
import React from "react";
import { Check, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ThermodynamicsSelectorProps {
  selectedModel: string;
  setSelectedModel: React.Dispatch<React.SetStateAction<string>>;
  selectedComponents: string[];
}

interface ThermodynamicModel {
  id: string;
  name: string;
  description: string;
  bestFor: string[];
  notRecommendedFor: string[];
  colorClass: string;
}

const ThermodynamicsSelector: React.FC<ThermodynamicsSelectorProps> = ({
  selectedModel,
  setSelectedModel,
  selectedComponents,
}) => {
  // Expanded list of thermodynamic models with detailed properties
  const thermodynamicModels: ThermodynamicModel[] = [
    {
      id: "Peng-Robinson",
      name: "Peng-Robinson",
      description: "Cubic equation of state, good for hydrocarbons and gases at high pressure",
      bestFor: ["hydrocarbons", "natural gas", "oil", "refinery processes", "high pressure applications"],
      notRecommendedFor: ["polar compounds", "hydrogen bonding", "highly non-ideal systems"],
      colorClass: "bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100",
    },
    {
      id: "Soave-Redlich-Kwong",
      name: "Soave-Redlich-Kwong",
      description: "Modified Redlich-Kwong equation, good for moderate pressures",
      bestFor: ["hydrocarbons", "light gases", "moderate pressure applications"],
      notRecommendedFor: ["highly polar systems", "electrolytes", "polymers"],
      colorClass: "bg-gradient-to-br from-green-50 to-teal-50 hover:from-green-100 hover:to-teal-100",
    },
    {
      id: "NRTL",
      name: "NRTL",
      description: "Non-Random Two-Liquid model, excellent for liquid-liquid equilibrium",
      bestFor: ["polar mixtures", "liquid-liquid extraction", "azeotropic systems", "highly non-ideal mixtures"],
      notRecommendedFor: ["gases", "supercritical fluids", "high pressures"],
      colorClass: "bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100",
    },
    {
      id: "UNIQUAC",
      name: "UNIQUAC",
      description: "UNIversal QUAsiChemical model, good for phase equilibrium in non-electrolyte systems",
      bestFor: ["polar compounds", "alcohols", "organic acids", "water", "non-electrolyte systems"],
      notRecommendedFor: ["gases at high pressures", "electrolyte solutions"],
      colorClass: "bg-gradient-to-br from-yellow-50 to-amber-50 hover:from-yellow-100 hover:to-amber-100",
    },
    {
      id: "Wilson",
      name: "Wilson",
      description: "Activity coefficient model for liquid-phase non-ideal mixtures",
      bestFor: ["polar-nonpolar mixtures", "alcohol-water mixtures", "vapor-liquid equilibrium calculations"],
      notRecommendedFor: ["liquid-liquid systems", "immiscible systems", "high pressures"],
      colorClass: "bg-gradient-to-br from-red-50 to-orange-50 hover:from-red-100 hover:to-orange-100",
    },
    {
      id: "Electrolyte-NRTL",
      name: "Electrolyte-NRTL",
      description: "Extension of NRTL for electrolyte solutions",
      bestFor: ["electrolyte solutions", "ionic liquids", "salt solutions", "acid-base systems"],
      notRecommendedFor: ["non-polar systems", "high-pressure gas applications"],
      colorClass: "bg-gradient-to-br from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100",
    },
    {
      id: "Cubic-Plus-Association",
      name: "CPA (Cubic-Plus-Association)",
      description: "Combines cubic EoS with association term for hydrogen bonding",
      bestFor: ["water", "alcohols", "glycols", "organic acids", "hydrogen-bonding systems"],
      notRecommendedFor: ["simple non-polar systems where simpler models would suffice"],
      colorClass: "bg-gradient-to-br from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100",
    },
    {
      id: "SAFT",
      name: "SAFT (Statistical Associating Fluid Theory)",
      description: "Based on statistical mechanics, handles complex molecules",
      bestFor: ["complex mixtures", "polymers", "long-chain hydrocarbons", "associating compounds"],
      notRecommendedFor: ["simple systems where computational cost is a concern"],
      colorClass: "bg-gradient-to-br from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100",
    },
  ];

  // Check if the components list includes specific types for recommendations
  const hasHydrocarbons = selectedComponents.some(comp => 
    ["Methane", "Ethane", "Propane", "Butane", "Pentane", "Hexane"].includes(comp)
  );
  
  const hasAlcohols = selectedComponents.some(comp => 
    ["Methanol", "Ethanol", "1-Propanol", "2-Propanol", "1-Butanol"].includes(comp)
  );
  
  const hasElectrolytes = selectedComponents.some(comp => 
    ["Sulfuric Acid", "Hydrochloric Acid", "Sodium Hydroxide", "Potassium Hydroxide"].includes(comp)
  );
  
  const hasWater = selectedComponents.includes("Water");

  // Get model recommendation based on selected components
  const getModelRecommendation = () => {
    if (hasElectrolytes) {
      return "Electrolyte-NRTL";
    } else if (hasAlcohols && hasWater) {
      return "NRTL";
    } else if (hasAlcohols && hasHydrocarbons) {
      return "Cubic-Plus-Association";
    } else if (hasHydrocarbons) {
      return "Peng-Robinson";
    } else {
      return "Soave-Redlich-Kwong";
    }
  };

  const recommendedModel = getModelRecommendation();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {thermodynamicModels.map((model) => (
          <div
            key={model.id}
            className={`p-4 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer transition-all ${
              selectedModel === model.id
                ? "ring-2 ring-blue-500 dark:ring-blue-400"
                : model.colorClass
            } ${
              recommendedModel === model.id
                ? "dark:border-green-500 border-green-500"
                : ""
            }`}
            onClick={() => setSelectedModel(model.id)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
                  {model.name}
                  {recommendedModel === model.id && (
                    <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs rounded-full">
                      Recommended
                    </span>
                  )}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {model.description}
                </p>
              </div>
              {selectedModel === model.id && (
                <span className="bg-blue-100 dark:bg-blue-900 p-1 rounded-full">
                  <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </span>
              )}
            </div>
            
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div>
                <h4 className="text-xs font-medium text-gray-700 dark:text-gray-400 mb-1">Best for</h4>
                <ul className="text-xs space-y-1">
                  {model.bestFor.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="text-gray-600 dark:text-gray-300">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-medium text-gray-700 dark:text-gray-400 mb-1">Not ideal for</h4>
                <ul className="text-xs space-y-1">
                  {model.notRecommendedFor.slice(0, 2).map((item, idx) => (
                    <li key={idx} className="text-gray-600 dark:text-gray-300">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 p-4 rounded-lg flex items-start">
        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800 dark:text-blue-200">
          <p className="font-medium mb-1">Choosing the right thermodynamic model</p>
          <p className="text-blue-700 dark:text-blue-300">
            The best model depends on your system's phase behavior, operating conditions, and components.
            For hydrocarbon systems at high pressure, cubic equations of state (Peng-Robinson, SRK) work well.
            For polar or hydrogen-bonding mixtures, activity coefficient models (NRTL, UNIQUAC) are recommended.
            {recommendedModel && (
              <span className="block mt-2">
                Based on your selected components, we recommend using the <strong>{recommendedModel}</strong> model.
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThermodynamicsSelector;
