
import React from "react";
import { 
  Check, Info, AlertTriangle
} from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Card } from "@/components/ui/card";

export interface ThermodynamicsSelectorProps {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  selectedComponents: string[]; // Add this prop to the interface
}

const models = [
  {
    id: "Peng-Robinson",
    name: "Peng-Robinson",
    description: "Widely used cubic equation of state for non-polar components",
    bestFor: ["Hydrocarbons", "Light gases", "Refinery processes"],
    limitations: ["Polar compounds", "Hydrogen bonding", "High pressures above 30 MPa"],
  },
  {
    id: "SRK",
    name: "Soave-Redlich-Kwong",
    description: "Good for vapor-liquid equilibria of hydrocarbons",
    bestFor: ["Hydrocarbons", "Oil & gas", "Medium pressures"],
    limitations: ["Strongly polar mixtures", "Hydrogen bonding systems"],
  },
  {
    id: "NRTL",
    name: "NRTL",
    description: "Non-Random Two-Liquid model for liquid activity coefficients",
    bestFor: ["Polar compounds", "Liquid-liquid extraction", "Azeotropic systems"],
    limitations: ["Gas phase", "Supercritical regions", "High pressures"],
  },
  {
    id: "UNIQUAC",
    name: "UNIQUAC",
    description: "UNIversal QUAsiChemical model for strongly non-ideal liquid mixtures",
    bestFor: ["Alcohols", "Organic acids", "Water-hydrocarbon systems"],
    limitations: ["Polymers", "Electrolytes", "Gas solubility"],
  },
  {
    id: "Wilson",
    name: "Wilson",
    description: "Good for polar and non-polar liquid mixtures",
    bestFor: ["Alcohols", "Ketones", "Liquid-phase activity coefficients"],
    limitations: ["Liquid-liquid immiscibility", "Gas phase", "High pressure systems"],
  },
  {
    id: "Electrolyte-NRTL",
    name: "Electrolyte-NRTL",
    description: "Extended NRTL model for electrolyte solutions",
    bestFor: ["Electrolyte solutions", "Acid gases", "Water treatment"],
    limitations: ["Non-aqueous systems", "High concentrations", "High temperatures"],
  },
  {
    id: "SAFT",
    name: "SAFT",
    description: "Statistical Associating Fluid Theory for associating fluids",
    bestFor: ["Associating fluids", "Hydrogen bonding", "Polymer systems"],
    limitations: ["Complex mixtures", "Implementation complexity", "Computational cost"],
  },
  {
    id: "PC-SAFT",
    name: "PC-SAFT",
    description: "Perturbed-Chain SAFT - improved version of SAFT",
    bestFor: ["Polymers", "Hydrogen bonding", "Asymmetric systems"],
    limitations: ["Computational cost", "Ionic liquids", "Very high pressures"],
  },
  {
    id: "CPA",
    name: "CPA",
    description: "Cubic-Plus-Association EoS for associating components",
    bestFor: ["Water-hydrocarbon", "Glycols", "Alcohols"],
    limitations: ["Multi-component systems", "Parameter estimation", "Polymer solutions"],
  },
  {
    id: "GERG-2008",
    name: "GERG-2008",
    description: "High accuracy equation for natural gas mixtures",
    bestFor: ["Natural gas", "LNG", "Gas processing"],
    limitations: ["Components not in database", "Some properties", "Complex implementation"],
  },
  {
    id: "PSRK",
    name: "PSRK",
    description: "Predictive SRK model with group contribution method",
    bestFor: ["Gas solubility", "Supercritical CO2", "High pressure"],
    limitations: ["Complex systems", "Some polar mixtures", "Parameter availability"],
  },
  {
    id: "SRKM",
    name: "SRKM",
    description: "Modified SRK with Mathias-Copeman alpha function",
    bestFor: ["Hydrocarbons", "High temperatures", "Refinery applications"],
    limitations: ["Polar compounds", "Parameter estimation", "Association effects"],
  },
];

// Helper function to recommend models based on components
const recommendModels = (components: string[]): string[] => {
  const hasHydrocarbons = components.some(c => 
    ["Methane", "Ethane", "Propane", "n-Butane", "i-Butane", "n-Pentane", "n-Hexane"].includes(c)
  );
  
  const hasAlcohols = components.some(c => 
    ["Methanol", "Ethanol", "Isopropanol", "n-Butanol"].includes(c)
  );
  
  const hasAcids = components.some(c => 
    ["Acetic-Acid", "Formic-Acid"].includes(c)
  );
  
  const hasElectrolytes = components.some(c => 
    ["Hydrogen-Chloride", "Ammonia", "Hydrogen-Sulfide"].includes(c)
  );
  
  const hasWater = components.includes("Water");
  
  const hasPolymers = components.some(c => 
    ["Polyethylene", "Polypropylene", "PVC"].includes(c)
  );
  
  const hasNaturalGas = components.some(c => 
    ["Methane", "Ethane", "Propane", "Carbon-Dioxide", "Nitrogen"].every(comp => 
      components.includes(comp)
    )
  );
  
  const recommendations = [];
  
  if (hasElectrolytes && hasWater) {
    recommendations.push("Electrolyte-NRTL");
  }
  
  if (hasAcids || (hasAlcohols && hasWater)) {
    recommendations.push("NRTL", "UNIQUAC", "Wilson");
  }
  
  if (hasAlcohols && !hasWater) {
    recommendations.push("Wilson", "UNIQUAC", "Peng-Robinson");
  }
  
  if (hasHydrocarbons && !hasWater) {
    recommendations.push("Peng-Robinson", "SRK");
  }
  
  if (hasHydrocarbons && hasWater) {
    recommendations.push("SRK", "Peng-Robinson", "CPA");
  }
  
  if (hasPolymers) {
    recommendations.push("PC-SAFT", "SAFT");
  }
  
  if (hasNaturalGas) {
    recommendations.push("GERG-2008", "Peng-Robinson", "SRK");
  }
  
  if (recommendations.length === 0) {
    return ["Peng-Robinson"]; // Default recommendation
  }
  
  return [...new Set(recommendations)]; // Remove duplicates
};

const ThermodynamicsSelector: React.FC<ThermodynamicsSelectorProps> = ({ 
  selectedModel, 
  setSelectedModel,
  selectedComponents 
}) => {
  // Generate model recommendations based on selected components
  const recommendedModels = recommendModels(selectedComponents);
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Thermodynamic Models</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Select the appropriate thermodynamic model for your simulation based on your chemical components and operating conditions.
        </p>
        
        {recommendedModels.length > 0 && (
          <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-100 dark:border-blue-800">
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 flex items-center mb-2">
              <Info className="h-4 w-4 mr-1" />
              Recommended Models
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              Based on your component selection, we recommend: {recommendedModels.join(", ")}
            </p>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {models.map((model) => (
          <Card
            key={model.id}
            className={`p-4 cursor-pointer border-2 transition-colors ${
              selectedModel === model.id
                ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                : "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700"
            }`}
            onClick={() => setSelectedModel(model.id)}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium">{model.name}</h4>
              {selectedModel === model.id && (
                <Check className="h-5 w-5 text-purple-500" />
              )}
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {model.description}
            </p>
            
            <div className="text-xs space-y-2">
              <div>
                <span className="text-green-600 dark:text-green-400 font-medium">Best for:</span>
                <div className="flex flex-wrap mt-1 gap-1">
                  {model.bestFor.map((item) => (
                    <span
                      key={item}
                      className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <span className="text-amber-600 dark:text-amber-400 font-medium">Limitations:</span>
                <div className="flex flex-wrap mt-1 gap-1">
                  {model.limitations.map((item) => (
                    <span
                      key={item}
                      className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-full"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {recommendedModels.includes(model.id) && (
              <div className="mt-3 text-xs flex items-center text-blue-600 dark:text-blue-400">
                <Check className="h-3.5 w-3.5 mr-1" />
                Recommended for your components
              </div>
            )}
            
            {!recommendedModels.includes(model.id) && selectedModel === model.id && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="mt-3 text-xs flex items-center text-amber-600 dark:text-amber-400">
                      <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                      Not ideal for your components
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      This model may not give accurate results for your selected components.
                      Consider using one of the recommended models instead.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ThermodynamicsSelector;
