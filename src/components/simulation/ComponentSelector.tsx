
import React, { useState, useEffect } from "react";
import { Search, Check, Database, Plus, X, Info, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Chemical components database (more comprehensive)
const CHEMICAL_DATABASE = [
  { id: "1", name: "Methane", formula: "CH₄", cas: "74-82-8", category: "Hydrocarbon", phase: "Gas", mw: 16.04 },
  { id: "2", name: "Ethane", formula: "C₂H₆", cas: "74-84-0", category: "Hydrocarbon", phase: "Gas", mw: 30.07 },
  { id: "3", name: "Propane", formula: "C₃H₈", cas: "74-98-6", category: "Hydrocarbon", phase: "Gas", mw: 44.10 },
  { id: "4", name: "n-Butane", formula: "C₄H₁₀", cas: "106-97-8", category: "Hydrocarbon", phase: "Gas/Liquid", mw: 58.12 },
  { id: "5", name: "i-Butane", formula: "C₄H₁₀", cas: "75-28-5", category: "Hydrocarbon", phase: "Gas/Liquid", mw: 58.12 },
  { id: "6", name: "n-Pentane", formula: "C₅H₁₂", cas: "109-66-0", category: "Hydrocarbon", phase: "Liquid", mw: 72.15 },
  { id: "7", name: "Oxygen", formula: "O₂", cas: "7782-44-7", category: "Gas", phase: "Gas", mw: 32.00 },
  { id: "8", name: "Nitrogen", formula: "N₂", cas: "7727-37-9", category: "Gas", phase: "Gas", mw: 28.01 },
  { id: "9", name: "Carbon Dioxide", formula: "CO₂", cas: "124-38-9", category: "Gas", phase: "Gas", mw: 44.01 },
  { id: "10", name: "Water", formula: "H₂O", cas: "7732-18-5", category: "Solvent", phase: "Liquid", mw: 18.02 },
  { id: "11", name: "Hydrogen", formula: "H₂", cas: "1333-74-0", category: "Gas", phase: "Gas", mw: 2.02 },
  { id: "12", name: "Methanol", formula: "CH₃OH", cas: "67-56-1", category: "Alcohol", phase: "Liquid", mw: 32.04 },
  { id: "13", name: "Ethanol", formula: "C₂H₅OH", cas: "64-17-5", category: "Alcohol", phase: "Liquid", mw: 46.07 },
  { id: "14", name: "Acetone", formula: "C₃H₆O", cas: "67-64-1", category: "Ketone", phase: "Liquid", mw: 58.08 },
  { id: "15", name: "Benzene", formula: "C₆H₆", cas: "71-43-2", category: "Aromatic", phase: "Liquid", mw: 78.11 },
  { id: "16", name: "Toluene", formula: "C₇H₈", cas: "108-88-3", category: "Aromatic", phase: "Liquid", mw: 92.14 },
  { id: "17", name: "Hydrogen Sulfide", formula: "H₂S", cas: "7783-06-4", category: "Gas", phase: "Gas", mw: 34.08 },
  { id: "18", name: "Ammonia", formula: "NH₃", cas: "7664-41-7", category: "Gas", phase: "Gas", mw: 17.03 },
  { id: "19", name: "Acetic Acid", formula: "C₂H₄O₂", cas: "64-19-7", category: "Acid", phase: "Liquid", mw: 60.05 },
  { id: "20", name: "n-Hexane", formula: "C₆H₁₄", cas: "110-54-3", category: "Hydrocarbon", phase: "Liquid", mw: 86.18 },
  { id: "21", name: "Cyclohexane", formula: "C₆H₁₂", cas: "110-82-7", category: "Hydrocarbon", phase: "Liquid", mw: 84.16 },
  { id: "22", name: "Ethylene", formula: "C₂H₄", cas: "74-85-1", category: "Hydrocarbon", phase: "Gas", mw: 28.05 },
  { id: "23", name: "Propylene", formula: "C₃H₆", cas: "115-07-1", category: "Hydrocarbon", phase: "Gas", mw: 42.08 },
  { id: "24", name: "Sulfur Dioxide", formula: "SO₂", cas: "7446-09-5", category: "Gas", phase: "Gas", mw: 64.06 },
  { id: "25", name: "Nitrogen Dioxide", formula: "NO₂", cas: "10102-44-0", category: "Gas", phase: "Gas", mw: 46.01 },
];

interface ComponentSelectorProps {
  selectedComponents: string[];
  setSelectedComponents: React.Dispatch<React.SetStateAction<string[]>>;
}

const ComponentSelector: React.FC<ComponentSelectorProps> = ({ 
  selectedComponents,
  setSelectedComponents 
}) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showRecommended, setShowRecommended] = useState(true);
  
  const categories = [...new Set(CHEMICAL_DATABASE.map(comp => comp.category))];
  
  // Show recommendations for common component groups
  const recommendations = [
    { name: "Hydrocarbon Mixture", components: ["1", "2", "3", "4", "6"] },
    { name: "Alcohol Water", components: ["10", "12", "13"] },
    { name: "Air", components: ["7", "8"] },
    { name: "Refinery Gas", components: ["1", "2", "3", "4", "5", "22", "23"] },
  ];
  
  // Filter components based on search and category
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
      
      toast({
        description: `${getComponentById(componentId)?.name} removed from simulation`
      });
    } else {
      setSelectedComponents(prev => [...prev, componentId]);
      
      toast({
        description: `${getComponentById(componentId)?.name} added to simulation`
      });
    }
  };
  
  const applyRecommendation = (components: string[]) => {
    setSelectedComponents(components);
    
    toast({
      title: "Recommendation Applied",
      description: `${components.length} components have been added`
    });
    
    setShowRecommended(false);
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
      
      {/* Recommendations */}
      {showRecommended && (
        <div className="mb-6 bg-blue-50 rounded-lg p-4 border border-blue-100">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-blue-800 flex items-center">
              <AlertCircle className="mr-2 h-4 w-4" />
              Recommended Component Sets
            </h3>
            <button 
              className="text-blue-500 text-sm hover:text-blue-700"
              onClick={() => setShowRecommended(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {recommendations.map((rec, index) => (
              <div 
                key={index} 
                className="p-3 bg-white rounded border border-blue-200 cursor-pointer hover:border-blue-400 transition-colors"
                onClick={() => applyRecommendation(rec.components)}
              >
                <div className="font-medium text-sm mb-1">{rec.name}</div>
                <div className="text-xs text-gray-500">{rec.components.length} components</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
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
                <div className="flex items-center text-gray-500 text-sm mt-1">
                  <span className="mr-2 font-mono">{component.formula}</span>
                  <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                    {component.category}
                  </span>
                </div>
                <div className="flex justify-between mt-2">
                  <div className="text-xs text-gray-500">
                    CAS: {component.cas}
                  </div>
                  <div className="text-xs text-gray-500">
                    MW: {component.mw}
                  </div>
                </div>
                <div className="mt-1 text-xs inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-800">
                  {component.phase}
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
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="text-gray-400 hover:text-gray-600 mr-1">
                          <Info className="h-3.5 w-3.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">{component.formula}, MW: {component.mw}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
