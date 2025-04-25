
import React from "react";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  TableContainer, 
  Table, 
  TableBody, 
  TableCell, 
  TableRow, 
  TableHead 
} from "@/components/ui/table";
import { Info, Check } from "lucide-react";

interface ThermodynamicsSelectorProps {
  selectedModel: string;
  setSelectedModel: React.Dispatch<React.SetStateAction<string>>;
  selectedComponents: string[];
}

const ThermodynamicsSelector: React.FC<ThermodynamicsSelectorProps> = ({
  selectedModel,
  setSelectedModel,
  selectedComponents
}) => {
  const hasHydrocarbons = selectedComponents.some(c => 
    ["Methane", "Ethane", "Propane", "Butane", "Pentane", "Hexane"].includes(c)
  );
  
  const hasAlcohols = selectedComponents.some(c => 
    ["Methanol", "Ethanol", "n-Propanol", "n-Butanol"].includes(c)
  );
  
  const hasWater = selectedComponents.includes("Water");
  
  const getRecommendation = () => {
    if (hasHydrocarbons && !hasAlcohols && !hasWater) {
      return "Peng-Robinson";
    } else if (hasHydrocarbons && (hasAlcohols || hasWater)) {
      return "NRTL";
    } else if (hasAlcohols && hasWater) {
      return "Wilson";
    } else {
      return "Peng-Robinson";
    }
  };
  
  const recommendation = getRecommendation();

  const thermodynamicModels = [
    {
      id: "Peng-Robinson",
      name: "Peng-Robinson",
      description: "Good for hydrocarbons, light gases, and non-polar components",
      suitability: {
        hydrocarbons: "Excellent",
        alcohols: "Fair",
        water: "Poor",
        highPressure: "Excellent",
        vaporLiquid: "Good"
      },
      isRecommended: recommendation === "Peng-Robinson"
    },
    {
      id: "SRK",
      name: "Soave-Redlich-Kwong",
      description: "Similar to Peng-Robinson, good for gas processing",
      suitability: {
        hydrocarbons: "Excellent", 
        alcohols: "Fair",
        water: "Poor",
        highPressure: "Good",
        vaporLiquid: "Good"
      },
      isRecommended: recommendation === "SRK"
    },
    {
      id: "NRTL",
      name: "NRTL",
      description: "Good for highly non-ideal liquid mixtures",
      suitability: {
        hydrocarbons: "Good",
        alcohols: "Excellent",
        water: "Excellent",
        highPressure: "Poor",
        vaporLiquid: "Excellent"
      },
      isRecommended: recommendation === "NRTL"
    },
    {
      id: "UNIQUAC",
      name: "UNIQUAC",
      description: "For strongly non-ideal systems and polymer solutions",
      suitability: {
        hydrocarbons: "Good",
        alcohols: "Excellent",
        water: "Excellent",
        highPressure: "Poor",
        vaporLiquid: "Excellent"
      },
      isRecommended: recommendation === "UNIQUAC"
    },
    {
      id: "Wilson",
      name: "Wilson",
      description: "Excellent for polar/non-polar mixtures",
      suitability: {
        hydrocarbons: "Good",
        alcohols: "Excellent",
        water: "Excellent",
        highPressure: "Poor",
        vaporLiquid: "Excellent"
      },
      isRecommended: recommendation === "Wilson"
    }
  ];

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-start gap-2 p-4 bg-blue-50 rounded-lg mb-4">
          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-blue-800 mb-1">Recommendation</h3>
            <p className="text-sm text-blue-700">
              Based on your selected components ({selectedComponents.join(", ")}), 
              we recommend using the <strong>{recommendation}</strong> thermodynamic model.
            </p>
          </div>
        </div>

        <Tabs defaultValue="equation-of-state">
          <TabsList className="grid grid-cols-3 w-full mb-6">
            <TabsTrigger value="equation-of-state">Equation of State</TabsTrigger>
            <TabsTrigger value="activity-coefficient">Activity Coefficient</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
          </TabsList>
          
          <TabsContent value="equation-of-state">
            <RadioGroup value={selectedModel} onValueChange={setSelectedModel} className="space-y-4">
              {thermodynamicModels.filter(model => ["Peng-Robinson", "SRK"].includes(model.id)).map((model) => (
                <Card key={model.id} className={`relative overflow-hidden ${model.isRecommended ? 'border-blue-300 shadow-md' : ''}`}>
                  {model.isRecommended && (
                    <div className="absolute top-0 right-0 bg-blue-500 text-white px-2 py-1 text-xs font-bold">
                      Recommended
                    </div>
                  )}
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value={model.id} id={model.id} className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor={model.id} className="text-base font-medium">
                          {model.name}
                        </Label>
                        <CardDescription className="mt-1">
                          {model.description}
                        </CardDescription>
                        
                        <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <div className="font-medium">Hydrocarbons:</div>
                            <div className={`${model.suitability.hydrocarbons === 'Excellent' ? 'text-green-600' : 'text-amber-600'}`}>
                              {model.suitability.hydrocarbons}
                            </div>
                          </div>
                          <div>
                            <div className="font-medium">Alcohols:</div>
                            <div className={`${model.suitability.alcohols === 'Excellent' ? 'text-green-600' : 'text-amber-600'}`}>
                              {model.suitability.alcohols}
                            </div>
                          </div>
                          <div>
                            <div className="font-medium">High Pressure:</div>
                            <div className={`${model.suitability.highPressure === 'Excellent' ? 'text-green-600' : 'text-amber-600'}`}>
                              {model.suitability.highPressure}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </RadioGroup>
          </TabsContent>
          
          <TabsContent value="activity-coefficient">
            <RadioGroup value={selectedModel} onValueChange={setSelectedModel} className="space-y-4">
              {thermodynamicModels.filter(model => ["NRTL", "UNIQUAC", "Wilson"].includes(model.id)).map((model) => (
                <Card key={model.id} className={`relative overflow-hidden ${model.isRecommended ? 'border-blue-300 shadow-md' : ''}`}>
                  {model.isRecommended && (
                    <div className="absolute top-0 right-0 bg-blue-500 text-white px-2 py-1 text-xs font-bold">
                      Recommended
                    </div>
                  )}
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value={model.id} id={model.id} className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor={model.id} className="text-base font-medium">
                          {model.name}
                        </Label>
                        <CardDescription className="mt-1">
                          {model.description}
                        </CardDescription>
                        
                        <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <div className="font-medium">Water Systems:</div>
                            <div className={`${model.suitability.water === 'Excellent' ? 'text-green-600' : 'text-amber-600'}`}>
                              {model.suitability.water}
                            </div>
                          </div>
                          <div>
                            <div className="font-medium">Alcohols:</div>
                            <div className={`${model.suitability.alcohols === 'Excellent' ? 'text-green-600' : 'text-amber-600'}`}>
                              {model.suitability.alcohols}
                            </div>
                          </div>
                          <div>
                            <div className="font-medium">VLE Accuracy:</div>
                            <div className={`${model.suitability.vaporLiquid === 'Excellent' ? 'text-green-600' : 'text-amber-600'}`}>
                              {model.suitability.vaporLiquid}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </RadioGroup>
          </TabsContent>
          
          <TabsContent value="comparison">
            <Card>
              <CardContent className="p-4 overflow-auto">
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Model</TableCell>
                        <TableCell>Hydrocarbons</TableCell>
                        <TableCell>Alcohols</TableCell>
                        <TableCell>Water</TableCell>
                        <TableCell>High Pressure</TableCell>
                        <TableCell>VLE Accuracy</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {thermodynamicModels.map(model => (
                        <TableRow key={model.id} className={model.id === selectedModel ? "bg-blue-50" : ""}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {model.id === selectedModel && <Check className="h-4 w-4 text-blue-600" />}
                              <span className={model.id === selectedModel ? "font-medium" : ""}>
                                {model.name}
                              </span>
                              {model.isRecommended && (
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                                  Recommended
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{model.suitability.hydrocarbons}</TableCell>
                          <TableCell>{model.suitability.alcohols}</TableCell>
                          <TableCell>{model.suitability.water}</TableCell>
                          <TableCell>{model.suitability.highPressure}</TableCell>
                          <TableCell>{model.suitability.vaporLiquid}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ThermodynamicsSelector;
