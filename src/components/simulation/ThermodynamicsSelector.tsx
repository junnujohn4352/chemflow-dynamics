
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type ThermodynamicModel = "Peng-Robinson" | "NRTL" | "Wilson" | "SRK" | "UNIQUAC";

interface ThermodynamicsSelectorProps {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  selectedComponents: string[];
}

const ThermodynamicsSelector: React.FC<ThermodynamicsSelectorProps> = ({
  selectedModel,
  setSelectedModel,
  selectedComponents,
}) => {
  const [hasHydrocarbons, setHasHydrocarbons] = useState(false);
  const [hasAlcohols, setHasAlcohols] = useState(false);
  const [hasWater, setHasWater] = useState(false);

  const hydrocarbons = ['Methane', 'Ethane', 'Propane', 'Butane', 'Pentane', 'Hexane', 'Octane', 'Benzene', 'Toluene', 'Xylene'];
  const alcohols = ['Methanol', 'Ethanol', 'Propanol', 'Butanol', 'Glycol', 'Glycerol'];
  const waterCompounds = ['Water', 'Steam', 'Aqueous'];

  useEffect(() => {
    setHasHydrocarbons(selectedComponents.some(component => hydrocarbons.includes(component)));
    setHasAlcohols(selectedComponents.some(component => alcohols.includes(component)));
    setHasWater(selectedComponents.some(component => waterCompounds.includes(component)));
  }, [selectedComponents]);

  const getRecommendation = (): ThermodynamicModel => {
    if (hasHydrocarbons && !hasAlcohols && !hasWater) {
      return "Peng-Robinson";
    } else if (hasHydrocarbons && (hasAlcohols || hasWater)) {
      return "NRTL";
    } else if (hasAlcohols && hasWater) {
      return "Wilson";
    } else if (hasHydrocarbons && hasAlcohols && !hasWater) {
      return "SRK";
    } else if (hasAlcohols && !hasWater && !hasHydrocarbons) {
      return "UNIQUAC";
    } else {
      return "Peng-Robinson";
    }
  };

  const thermodynamicModels: {
    id: ThermodynamicModel;
    name: string;
    description: string;
    bestFor: string[];
  }[] = [
    {
      id: "Peng-Robinson",
      name: "Peng-Robinson",
      description: "Excellent for gas and non-polar systems, widely used in gas processing.",
      bestFor: ["Natural gas", "Hydrocarbons", "High pressure systems"]
    },
    {
      id: "NRTL",
      name: "NRTL (Non-Random Two-Liquid)",
      description: "Best for highly non-ideal liquid mixtures and systems with partial miscibility.",
      bestFor: ["Alcohol-water mixtures", "Hydrocarbon-alcohol systems", "Polar/non-polar mixtures"]
    },
    {
      id: "Wilson",
      name: "Wilson",
      description: "Great for polar mixtures and systems with strong hydrogen bonding.",
      bestFor: ["Alcohol mixtures", "Water-solvent systems", "Highly polar compounds"]
    },
    {
      id: "SRK",
      name: "Soave-Redlich-Kwong",
      description: "Similar to Peng-Robinson but with different accuracy in specific regions.",
      bestFor: ["Petroleum refining", "Light hydrocarbons", "Moderate pressure systems"]
    },
    {
      id: "UNIQUAC",
      name: "UNIQUAC",
      description: "Universal Quasi-Chemical model, good for strongly non-ideal liquid mixtures.",
      bestFor: ["Complex chemical mixtures", "Polymer solutions", "Electrolyte systems"]
    }
  ];

  const recommendation = getRecommendation();

  return (
    <div className="space-y-6">
      <Card className="border-blue-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-md flex items-center">
            Recommended Model:
            <span className="ml-2 text-blue-600 font-bold">{recommendation}</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 ml-2 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">
                    Based on your component selection, we recommend {recommendation} as the optimal thermodynamic model.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription>
            Select the thermodynamic model that best suits your simulation needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1 text-sm text-gray-600">
            {hasHydrocarbons && <div>✓ Hydrocarbons detected</div>}
            {hasAlcohols && <div>✓ Alcohols detected</div>}
            {hasWater && <div>✓ Water detected</div>}
            {!hasHydrocarbons && !hasAlcohols && !hasWater && <div>No specific component types detected. Using default recommendation.</div>}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <RadioGroup
          value={selectedModel}
          onValueChange={setSelectedModel}
          className="grid grid-cols-1 gap-4"
        >
          {thermodynamicModels.map((model) => (
            <Label
              key={model.id}
              htmlFor={model.id}
              className={cn(
                "flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50",
                selectedModel === model.id
                  ? "border-blue-500 bg-blue-50/50"
                  : "border-gray-200"
              )}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={model.id} id={model.id} />
                <div>
                  <p className="font-medium">{model.name}</p>
                  <p className="text-sm text-gray-500">{model.description}</p>
                </div>
              </div>
              <div className="mt-2 sm:mt-0 flex flex-wrap gap-1">
                {model.bestFor.map((item, index) => (
                  <Badge key={index} variant="outline" className="bg-gray-50">
                    {item}
                  </Badge>
                ))}
              </div>
              {model.id === recommendation && (
                <Badge className="ml-2 bg-blue-100 text-blue-800 border-blue-200 hidden sm:flex">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Recommended
                </Badge>
              )}
            </Label>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};

export default ThermodynamicsSelector;
