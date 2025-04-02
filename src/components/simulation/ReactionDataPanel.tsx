
import React from 'react';
import GlassPanel from "@/components/ui/GlassPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FlaskConical, Activity, Thermometer, ArrowRight } from "lucide-react";

interface ReactionDataPanelProps {
  selectedComponents: string[];
}

const ReactionDataPanel: React.FC<ReactionDataPanelProps> = ({ selectedComponents }) => {
  // Sample reaction data
  const reactions = [
    {
      name: "Esterification",
      type: "Conversion",
      reactants: ["Acetic Acid", "Ethanol"],
      products: ["Ethyl Acetate", "Water"],
      stoichiometry: {
        "Acetic Acid": -1,
        "Ethanol": -1,
        "Ethyl Acetate": 1,
        "Water": 1
      },
      conversionRate: 75,
      activationEnergy: 58.7,
      heatOfReaction: -5.4,
      conditions: {
        temperature: 80,
        pressure: 101.325,
        catalyst: "H2SO4"
      }
    },
    {
      name: "Hydration",
      type: "Equilibrium",
      reactants: ["Ethylene"],
      products: ["Ethanol"],
      stoichiometry: {
        "Ethylene": -1,
        "Water": -1,
        "Ethanol": 1
      },
      equilibriumConstant: 0.45,
      activationEnergy: 76.5,
      heatOfReaction: -45.5,
      conditions: {
        temperature: 300,
        pressure: 7000,
        catalyst: "Phosphoric Acid"
      }
    }
  ];

  const filteredReactions = reactions.filter(reaction => {
    // Check if at least one reactant is in selected components
    return reaction.reactants.some(reactant => 
      selectedComponents.includes(reactant)
    );
  });

  if (filteredReactions.length === 0) {
    return (
      <GlassPanel className="mt-4 p-4">
        <h3 className="text-lg font-semibold mb-4">Reaction Parameters</h3>
        <div className="text-center p-8 text-gray-500">
          No reactions available for the selected components.
          <div className="mt-2 text-sm">
            Try selecting components like Acetic Acid, Ethanol, or Ethylene.
          </div>
        </div>
      </GlassPanel>
    );
  }

  return (
    <GlassPanel className="mt-4 p-4">
      <h3 className="text-lg font-semibold mb-4">Reaction Parameters</h3>
      
      <Tabs defaultValue={filteredReactions[0].name.toLowerCase().replace(/\s+/g, '-')}>
        <TabsList className="w-full mb-4">
          {filteredReactions.map(reaction => (
            <TabsTrigger 
              key={reaction.name} 
              value={reaction.name.toLowerCase().replace(/\s+/g, '-')}
            >
              <FlaskConical className="h-4 w-4 mr-2" />
              {reaction.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {filteredReactions.map(reaction => (
          <TabsContent 
            key={reaction.name}
            value={reaction.name.toLowerCase().replace(/\s+/g, '-')}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-500">Type:</span>
                  <span className="ml-2 text-blue-600">{reaction.type}</span>
                </div>
                {reaction.type === "Conversion" ? (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Conversion:</span>
                    <span className="ml-2 text-blue-600">{reaction.conversionRate}%</span>
                  </div>
                ) : (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Keq:</span>
                    <span className="ml-2 text-blue-600">{reaction.equilibriumConstant}</span>
                  </div>
                )}
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-center">
                  <div className="text-right mr-4">
                    {reaction.reactants.map(reactant => (
                      <div key={reactant} className="mb-1">{reactant}</div>
                    ))}
                  </div>
                  <ArrowRight className="h-6 w-6 text-blue-500 mx-2" />
                  <div className="ml-4">
                    {reaction.products.map(product => (
                      <div key={product} className="mb-1">{product}</div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <div className="text-sm text-gray-500">Activation Energy</div>
                  <div className="text-lg font-semibold">{reaction.activationEnergy} kJ/mol</div>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <div className="text-sm text-gray-500">Heat of Reaction</div>
                  <div className="text-lg font-semibold">{reaction.heatOfReaction} kJ/mol</div>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <div className="text-sm text-gray-500">Temperature</div>
                  <div className="text-lg font-semibold">{reaction.conditions.temperature} °C</div>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <div className="text-sm text-gray-500">Pressure</div>
                  <div className="text-lg font-semibold">{reaction.conditions.pressure} kPa</div>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm col-span-2">
                  <div className="text-sm text-gray-500">Catalyst</div>
                  <div className="text-lg font-semibold">{reaction.conditions.catalyst}</div>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-medium mb-2">Stoichiometry</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Component</TableHead>
                      <TableHead>Coefficient</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(reaction.stoichiometry).map(([component, coef]) => (
                      <TableRow key={component}>
                        <TableCell className="font-medium">{component}</TableCell>
                        <TableCell>{coef > 0 ? `+${coef}` : coef}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </GlassPanel>
  );
};

export default ReactionDataPanel;
