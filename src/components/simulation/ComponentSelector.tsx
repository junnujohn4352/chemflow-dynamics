
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search, Plus, X } from "lucide-react";

interface ComponentSelectorProps {
  selectedComponents: string[];
  setSelectedComponents: React.Dispatch<React.SetStateAction<string[]>>;
}

// Chemical component database
const chemicalComponents = [
  { id: "water", name: "Water", formula: "H₂O", category: "common" },
  { id: "methane", name: "Methane", formula: "CH₄", category: "hydrocarbon" },
  { id: "ethane", name: "Ethane", formula: "C₂H₆", category: "hydrocarbon" },
  { id: "propane", name: "Propane", formula: "C₃H₈", category: "hydrocarbon" },
  { id: "butane", name: "Butane", formula: "C₄H₁₀", category: "hydrocarbon" },
  { id: "pentane", name: "Pentane", formula: "C₅H₁₂", category: "hydrocarbon" },
  { id: "hexane", name: "Hexane", formula: "C₆H₁₄", category: "hydrocarbon" },
  { id: "ethylene", name: "Ethylene", formula: "C₂H₄", category: "hydrocarbon" },
  { id: "propylene", name: "Propylene", formula: "C₃H₆", category: "hydrocarbon" },
  { id: "benzene", name: "Benzene", formula: "C₆H₆", category: "aromatic" },
  { id: "toluene", name: "Toluene", formula: "C₇H₈", category: "aromatic" },
  { id: "xylene", name: "Xylene", formula: "C₈H₁₀", category: "aromatic" },
  { id: "methanol", name: "Methanol", formula: "CH₃OH", category: "alcohol" },
  { id: "ethanol", name: "Ethanol", formula: "C₂H₅OH", category: "alcohol" },
  { id: "propanol", name: "n-Propanol", formula: "C₃H₇OH", category: "alcohol" },
  { id: "butanol", name: "n-Butanol", formula: "C₄H₉OH", category: "alcohol" },
  { id: "acetic-acid", name: "Acetic Acid", formula: "CH₃COOH", category: "acid" },
  { id: "formic-acid", name: "Formic Acid", formula: "HCOOH", category: "acid" },
  { id: "sulfuric-acid", name: "Sulfuric Acid", formula: "H₂SO₄", category: "acid" },
  { id: "nitrogen", name: "Nitrogen", formula: "N₂", category: "gas" },
  { id: "oxygen", name: "Oxygen", formula: "O₂", category: "gas" },
  { id: "hydrogen", name: "Hydrogen", formula: "H₂", category: "gas" },
  { id: "carbon-dioxide", name: "Carbon Dioxide", formula: "CO₂", category: "gas" },
  { id: "carbon-monoxide", name: "Carbon Monoxide", formula: "CO", category: "gas" },
  { id: "ammonia", name: "Ammonia", formula: "NH₃", category: "gas" },
  { id: "acetone", name: "Acetone", formula: "C₃H₆O", category: "ketone" },
  { id: "acetaldehyde", name: "Acetaldehyde", formula: "C₂H₄O", category: "aldehyde" },
  { id: "formaldehyde", name: "Formaldehyde", formula: "CH₂O", category: "aldehyde" },
  { id: "chlorine", name: "Chlorine", formula: "Cl₂", category: "inorganic" },
  { id: "hydrogen-chloride", name: "Hydrogen Chloride", formula: "HCl", category: "inorganic" },
  { id: "sodium-hydroxide", name: "Sodium Hydroxide", formula: "NaOH", category: "inorganic" },
  { id: "calcium-oxide", name: "Calcium Oxide", formula: "CaO", category: "inorganic" },
  { id: "styrene", name: "Styrene", formula: "C₈H₈", category: "aromatic" },
  { id: "glycerol", name: "Glycerol", formula: "C₃H₈O₃", category: "alcohol" },
  { id: "mek", name: "Methyl Ethyl Ketone", formula: "C₄H₈O", category: "ketone" },
  { id: "air", name: "Air", formula: "N₂/O₂", category: "mixture" }
];

const categories = [
  { id: "all", name: "All" },
  { id: "common", name: "Common" },
  { id: "hydrocarbon", name: "Hydrocarbons" },
  { id: "aromatic", name: "Aromatics" },
  { id: "alcohol", name: "Alcohols" },
  { id: "acid", name: "Acids" },
  { id: "gas", name: "Gases" },
  { id: "ketone", name: "Ketones" },
  { id: "aldehyde", name: "Aldehydes" },
  { id: "inorganic", name: "Inorganics" },
  { id: "mixture", name: "Mixtures" }
];

const ComponentSelector: React.FC<ComponentSelectorProps> = ({ 
  selectedComponents, 
  setSelectedComponents 
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const handleAddComponent = (componentName: string) => {
    if (!selectedComponents.includes(componentName)) {
      setSelectedComponents([...selectedComponents, componentName]);
    }
  };
  
  const handleRemoveComponent = (componentName: string) => {
    setSelectedComponents(selectedComponents.filter(c => c !== componentName));
  };
  
  const filteredComponents = chemicalComponents.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          component.formula.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || component.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
      <div className="md:col-span-3 space-y-4">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search components..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
        
        <ScrollArea className="h-[350px] border rounded-md p-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filteredComponents.map(component => (
              <div
                key={component.id}
                className={`p-3 rounded-md border hover:bg-gray-50 cursor-pointer ${
                  selectedComponents.includes(component.name) ? "bg-blue-50 border-blue-200" : ""
                }`}
                onClick={() => handleAddComponent(component.name)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{component.name}</div>
                    <div className="text-sm text-gray-500">{component.formula}</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-gray-400 hover:text-blue-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (selectedComponents.includes(component.name)) {
                        handleRemoveComponent(component.name);
                      } else {
                        handleAddComponent(component.name);
                      }
                    }}
                  >
                    {selectedComponents.includes(component.name) ? (
                      <X className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      
      <div className="md:col-span-2 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Selected Components</h3>
          <span className="text-sm text-gray-500">{selectedComponents.length} selected</span>
        </div>
        
        <div className="border rounded-md p-4 h-[350px] overflow-auto">
          {selectedComponents.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <p>No components selected</p>
              <p className="text-sm mt-1">Select components from the list</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {selectedComponents.map(component => {
                const componentData = chemicalComponents.find(c => c.name === component);
                return (
                  <li 
                    key={component} 
                    className="flex justify-between items-center p-2 bg-blue-50 rounded-md"
                  >
                    <div>
                      <span className="font-medium">{component}</span>
                      {componentData && (
                        <span className="ml-2 text-sm text-gray-500">{componentData.formula}</span>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-gray-400 hover:text-red-600"
                      onClick={() => handleRemoveComponent(component)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComponentSelector;
