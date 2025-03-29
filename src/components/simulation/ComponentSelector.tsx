
import React, { useState } from "react";
import { Search, Check, Database, Plus, X } from "lucide-react";

// Chemical components database (simplified)
const CHEMICAL_DATABASE = [
  { id: "1", name: "Methane", formula: "CH₄", cas: "74-82-8", category: "Hydrocarbon" },
  { id: "2", name: "Ethane", formula: "C₂H₆", cas: "74-84-0", category: "Hydrocarbon" },
  { id: "3", name: "Propane", formula: "C₃H₈", cas: "74-98-6", category: "Hydrocarbon" },
  { id: "4", name: "n-Butane", formula: "C₄H₁₀", cas: "106-97-8", category: "Hydrocarbon" },
  { id: "5", name: "i-Butane", formula: "C₄H₁₀", cas: "75-28-5", category: "Hydrocarbon" },
  { id: "6", name: "n-Pentane", formula: "C₅H₁₂", cas: "109-66-0", category: "Hydrocarbon" },
  { id: "7", name: "Oxygen", formula: "O₂", cas: "7782-44-7", category: "Gas" },
  { id: "8", name: "Nitrogen", formula: "N₂", cas: "7727-37-9", category: "Gas" },
  { id: "9", name: "Carbon Dioxide", formula: "CO₂", cas: "124-38-9", category: "Gas" },
  { id: "10", name: "Water", formula: "H₂O", cas: "7732-18-5", category: "Solvent" },
  { id: "11", name: "Hydrogen", formula: "H₂", cas: "1333-74-0", category: "Gas" },
  { id: "12", name: "Methanol", formula: "CH₃OH", cas: "67-56-1", category: "Alcohol" },
  { id: "13", name: "Ethanol", formula: "C₂H₅OH", cas: "64-17-5", category: "Alcohol" },
  { id: "14", name: "Acetone", formula: "C₃H₆O", cas: "67-64-1", category: "Ketone" },
  { id: "15", name: "Benzene", formula: "C₆H₆", cas: "71-43-2", category: "Aromatic" },
];

interface ComponentSelectorProps {
  selectedComponents: string[];
  setSelectedComponents: React.Dispatch<React.SetStateAction<string[]>>;
}

const ComponentSelector: React.FC<ComponentSelectorProps> = ({ 
  selectedComponents,
  setSelectedComponents 
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const categories = [...new Set(CHEMICAL_DATABASE.map(comp => comp.category))];
  
  const filteredComponents = CHEMICAL_DATABASE.filter(comp => {
    const matchesSearch = comp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         comp.formula.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         comp.cas.includes(searchQuery);
    const matchesCategory = selectedCategory ? comp.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });
  
  const toggleComponent = (componentId: string) => {
    if (selectedComponents.includes(componentId)) {
      setSelectedComponents(prev => prev.filter(id => id !== componentId));
    } else {
      setSelectedComponents(prev => [...prev, componentId]);
    }
  };
  
  const getComponentById = (id: string) => {
    return CHEMICAL_DATABASE.find(comp => comp.id === id);
  };
  
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-medium mb-4">Chemical Components</h2>
      <p className="text-gray-600 mb-6">
        Select the chemical species that will be present in your simulation.
      </p>
      
      {/* Search and filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-flow-blue/20 focus:border-flow-blue"
            placeholder="Search by name, formula, or CAS number"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              selectedCategory === null 
                ? 'bg-flow-blue text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                selectedCategory === category 
                  ? 'bg-flow-blue text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      {/* Database list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 max-h-[400px] overflow-y-auto p-2">
        {filteredComponents.map(component => (
          <div 
            key={component.id}
            className={`p-4 rounded-lg border transition-all cursor-pointer ${
              selectedComponents.includes(component.id)
                ? 'border-flow-blue bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
            onClick={() => toggleComponent(component.id)}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{component.name}</h3>
                <div className="flex items-center text-gray-500 text-sm">
                  <span className="mr-2">{component.formula}</span>
                  <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                    {component.category}
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  CAS: {component.cas}
                </div>
              </div>
              <div className={`h-5 w-5 flex items-center justify-center rounded-full ${
                selectedComponents.includes(component.id)
                  ? 'bg-flow-blue text-white'
                  : 'border border-gray-300'
              }`}>
                {selectedComponents.includes(component.id) && <Check className="h-3 w-3" />}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Selected components list */}
      <div className="mt-auto">
        <h3 className="font-medium mb-2 flex items-center">
          <Database className="mr-2 h-4 w-4" />
          Selected Components ({selectedComponents.length})
        </h3>
        {selectedComponents.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {selectedComponents.map(id => {
              const component = getComponentById(id);
              return component ? (
                <div key={id} className="flex items-center bg-gray-100 px-3 py-1.5 rounded-lg">
                  <span className="text-sm mr-2">{component.name}</span>
                  <button 
                    className="text-gray-500 hover:text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleComponent(id);
                    }}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : null;
            })}
          </div>
        ) : (
          <div className="text-gray-500 text-sm flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Click on components to add them to your simulation
          </div>
        )}
      </div>
    </div>
  );
};

export default ComponentSelector;
