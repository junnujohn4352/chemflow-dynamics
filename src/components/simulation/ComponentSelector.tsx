import React, { useState } from "react";
import { Check, Search, X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ComponentSelectorProps {
  selectedComponents: string[];
  setSelectedComponents: React.Dispatch<React.SetStateAction<string[]>>;
}

const ComponentSelector: React.FC<ComponentSelectorProps> = ({
  selectedComponents,
  setSelectedComponents,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>("common");

  // Extended list of chemical components by category
  const componentsByCategory = {
    common: [
      "Water", "Methane", "Ethane", "Propane", "Butane", "Pentane", 
      "Hexane", "Heptane", "Octane", "Nitrogen", "Oxygen", "Carbon Dioxide",
      "Hydrogen", "Ethylene", "Propylene", "Benzene", "Toluene", "Methanol",
      "Ethanol", "Acetone"
    ],
    hydrocarbons: [
      "Methane", "Ethane", "Propane", "Butane", "Pentane", "Hexane", 
      "Heptane", "Octane", "Nonane", "Decane", "Cyclopentane", "Cyclohexane",
      "Ethylene", "Propylene", "1-Butene", "1-Pentene", "1-Hexene", 
      "Acetylene", "Benzene", "Toluene", "Xylene", "Styrene", "Naphthalene"
    ],
    alcohols: [
      "Methanol", "Ethanol", "1-Propanol", "2-Propanol", "1-Butanol", "2-Butanol", 
      "tert-Butanol", "Glycerol", "Ethylene Glycol", "Phenol", "Cyclohexanol"
    ],
    acids: [
      "Acetic Acid", "Formic Acid", "Propionic Acid", "Butyric Acid", "Sulfuric Acid", 
      "Hydrochloric Acid", "Nitric Acid", "Phosphoric Acid", "Citric Acid"
    ],
    ketones: [
      "Acetone", "Methyl Ethyl Ketone", "Methyl Isobutyl Ketone", "Cyclohexanone", 
      "Acetophenone"
    ],
    ethers: [
      "Dimethyl Ether", "Diethyl Ether", "Tetrahydrofuran", "1,4-Dioxane", 
      "Methyl tert-Butyl Ether"
    ],
    esters: [
      "Methyl Acetate", "Ethyl Acetate", "Butyl Acetate", "Methyl Benzoate", 
      "Ethyl Benzoate"
    ],
    amines: [
      "Methylamine", "Dimethylamine", "Trimethylamine", "Ethylamine", "Aniline", 
      "Pyridine"
    ],
    gases: [
      "Hydrogen", "Nitrogen", "Oxygen", "Carbon Dioxide", "Carbon Monoxide", 
      "Helium", "Argon", "Neon", "Krypton", "Xenon", "Ammonia", "Chlorine",
      "Sulfur Dioxide", "Hydrogen Sulfide", "Nitrous Oxide"
    ],
    halogenated: [
      "Dichloromethane", "Chloroform", "Carbon Tetrachloride", "1,2-Dichloroethane", 
      "Chlorobenzene", "Freon-12", "Freon-22", "HFC-134a"
    ],
    inorganic: [
      "Water", "Ammonia", "Hydrogen Peroxide", "Sulfuric Acid", "Nitric Acid", 
      "Sodium Hydroxide", "Potassium Hydroxide", "Hydrochloric Acid"
    ]
  };

  const categories = [
    { id: "common", name: "Common" },
    { id: "hydrocarbons", name: "Hydrocarbons" },
    { id: "alcohols", name: "Alcohols" },
    { id: "acids", name: "Acids" },
    { id: "ketones", name: "Ketones" },
    { id: "ethers", name: "Ethers" },
    { id: "esters", name: "Esters" },
    { id: "amines", name: "Amines" },
    { id: "gases", name: "Gases" },
    { id: "halogenated", name: "Halogenated" },
    { id: "inorganic", name: "Inorganic" },
  ];

  // Get components for the active category
  const getActiveComponents = () => {
    if (!activeCategory) return [];
    return componentsByCategory[activeCategory as keyof typeof componentsByCategory] || [];
  };

  // Filter components based on search term
  const filteredComponents = searchTerm
    ? Object.values(componentsByCategory)
        .flat()
        .filter((component) =>
          component.toLowerCase().includes(searchTerm.toLowerCase())
        )
    : getActiveComponents();

  // Add a component to the selection
  const handleAddComponent = (component: string) => {
    if (!selectedComponents.includes(component)) {
      setSelectedComponents([...selectedComponents, component]);
    }
  };

  // Remove a component from the selection
  const handleRemoveComponent = (component: string) => {
    setSelectedComponents(selectedComponents.filter((c) => c !== component));
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search components..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setActiveCategory(category.id);
              setSearchTerm("");
            }}
            className={activeCategory === category.id ? "bg-blue-600 hover:bg-blue-700" : ""}
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Display filtered components */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {filteredComponents.map((component) => (
          <div
            key={component}
            className={`p-3 rounded-lg border transition-colors ${
              selectedComponents.includes(component)
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-200 hover:border-blue-300 dark:border-gray-700 dark:hover:border-blue-800"
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="text-sm dark:text-gray-200">{component}</span>
              {selectedComponents.includes(component) ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-blue-600"
                  onClick={() => handleRemoveComponent(component)}
                >
                  <Check className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-gray-400 hover:text-blue-600"
                  onClick={() => handleAddComponent(component)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Selected components */}
      {selectedComponents.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Selected Components</h3>
          <div className="flex flex-wrap gap-2">
            {selectedComponents.map((component) => (
              <div
                key={component}
                className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded-md flex items-center text-sm"
              >
                {component}
                <button
                  onClick={() => handleRemoveComponent(component)}
                  className="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComponentSelector;
