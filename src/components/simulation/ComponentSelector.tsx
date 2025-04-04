import React, { useState } from "react";
import { Search, X, Info, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ComponentSelectorProps {
  selectedComponents: string[];
  setSelectedComponents: (components: string[]) => void;
}

const availableComponents = [
  {
    id: "Nitrogen",
    name: "Nitrogen",
    formula: "N₂",
    mw: 28.02,
    cas: "7727-37-9",
    phase: "Gas"
  },
  {
    id: "Oxygen",
    name: "Oxygen",
    formula: "O₂",
    mw: 32.00,
    cas: "7782-44-7",
    phase: "Gas"
  },
  {
    id: "Carbon-Dioxide",
    name: "Carbon Dioxide",
    formula: "CO₂",
    mw: 44.01,
    cas: "124-38-9",
    phase: "Gas"
  },
  {
    id: "Hydrogen",
    name: "Hydrogen",
    formula: "H₂",
    mw: 2.02,
    cas: "1333-74-0",
    phase: "Gas"
  },
  {
    id: "Methane",
    name: "Methane",
    formula: "CH₄",
    mw: 16.04,
    cas: "74-82-8",
    phase: "Gas"
  },
  {
    id: "Ethane",
    name: "Ethane",
    formula: "C₂H₆",
    mw: 30.07,
    cas: "74-84-0",
    phase: "Gas"
  },
  {
    id: "Propane",
    name: "Propane",
    formula: "C₃H₈",
    mw: 44.10,
    cas: "74-98-6",
    phase: "Gas"
  },
  {
    id: "Benzene",
    name: "Benzene",
    formula: "C₆H₆",
    mw: 78.11,
    cas: "71-43-2",
    phase: "Liquid"
  },
  {
    id: "Toluene",
    name: "Toluene",
    formula: "C₇H₈",
    mw: 92.14,
    cas: "108-88-3",
    phase: "Liquid"
  },
  {
    id: "Methanol",
    name: "Methanol",
    formula: "CH₃OH",
    mw: 32.04,
    cas: "67-56-1",
    phase: "Liquid"
  },
  {
    id: "Ethanol",
    name: "Ethanol",
    formula: "C₂H₅OH",
    mw: 46.07,
    cas: "64-17-5",
    phase: "Liquid"
  },
  {
    id: "Acetone",
    name: "Acetone",
    formula: "C₃H₆O",
    mw: 58.08,
    cas: "67-64-1",
    phase: "Liquid"
  }
];

const ComponentSelector: React.FC<ComponentSelectorProps> = ({ selectedComponents, setSelectedComponents }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customComponent, setCustomComponent] = useState({ name: "", formula: "" });
  
  const filteredComponents = availableComponents.filter(
    comp => 
      comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.formula.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.cas.includes(searchQuery)
  );
  
  const handleComponentClick = (componentId: string) => {
    if (selectedComponents.includes(componentId)) {
      setSelectedComponents(selectedComponents.filter(id => id !== componentId));
    } else {
      setSelectedComponents([...selectedComponents, componentId]);
    }
  };
  
  const handleAddCustomComponent = () => {
    if (customComponent.name.trim() === "") return;
    
    const componentId = customComponent.name.replace(/[^a-zA-Z0-9]/g, "-");
    
    if (!selectedComponents.includes(componentId)) {
      setSelectedComponents([...selectedComponents, componentId]);
    }
    
    setCustomComponent({ name: "", formula: "" });
    setShowCustomInput(false);
  };
  
  const componentGroups = [
    { name: "Common Gases", components: ["Nitrogen", "Oxygen", "Carbon-Dioxide", "Hydrogen", "Argon", "Helium"] },
    { name: "Light Hydrocarbons", components: ["Methane", "Ethane", "Propane", "n-Butane", "i-Butane"] },
    { name: "Olefins", components: ["Ethylene", "Propylene", "1,3-Butadiene", "Isoprene", "Acetylene"] },
    { name: "Alcohols", components: ["Methanol", "Ethanol", "Isopropanol", "n-Butanol", "Glycerol"] },
    { name: "Aromatics", components: ["Benzene", "Toluene", "Xylene", "Styrene", "Ethylbenzene"] },
    { name: "Solvents", components: ["Acetone", "MEK", "DMF", "DMSO", "THF", "Dichloromethane"] }
  ];
  
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Select Components</h3>
      <p className="text-gray-600 mb-6">
        Choose the chemical components for your simulation
      </p>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input 
          placeholder="Search by name, formula, or CAS number..." 
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-2">Quick Add by Group</h4>
        <div className="flex flex-wrap gap-2">
          {componentGroups.map(group => (
            <TooltipProvider key={group.name}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const newComponents = group.components.filter(
                        comp => !selectedComponents.includes(comp)
                      );
                      if (newComponents.length > 0) {
                        setSelectedComponents([...selectedComponents, ...newComponents]);
                      }
                    }}
                  >
                    {group.name}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">{group.components.join(", ")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
      
      {showCustomInput ? (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg">
          <h4 className="text-sm font-medium mb-3">Add Custom Component</h4>
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Component Name</label>
              <Input 
                value={customComponent.name}
                onChange={(e) => setCustomComponent({...customComponent, name: e.target.value})}
                placeholder="e.g., Propylene Glycol"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Chemical Formula (optional)</label>
              <Input 
                value={customComponent.formula}
                onChange={(e) => setCustomComponent({...customComponent, formula: e.target.value})}
                placeholder="e.g., C₃H₈O₂"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setShowCustomInput(false);
                setCustomComponent({ name: "", formula: "" });
              }}
            >
              Cancel
            </Button>
            <Button 
              size="sm"
              onClick={handleAddCustomComponent}
              disabled={customComponent.name.trim() === ""}
            >
              Add Component
            </Button>
          </div>
        </div>
      ) : (
        <div className="mb-6">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowCustomInput(true)}
          >
            + Add Custom Component
          </Button>
        </div>
      )}
      
      {selectedComponents.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-2">Selected Components ({selectedComponents.length})</h4>
          <div className="flex flex-wrap gap-2">
            {selectedComponents.map(compId => {
              const component = availableComponents.find(c => c.id === compId) || { id: compId, name: compId, formula: "" };
              return (
                <div 
                  key={compId}
                  className="flex items-center bg-blue-50 text-flow-blue rounded-lg px-3 py-1.5"
                >
                  <span className="text-sm font-medium mr-1">{component.name}</span>
                  {component.formula && (
                    <span className="text-xs text-flow-blue/70">({component.formula})</span>
                  )}
                  <button 
                    className="ml-2 text-flow-blue/70 hover:text-flow-blue"
                    onClick={() => handleComponentClick(compId)}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      <div>
        <h4 className="text-sm font-medium mb-2">Available Components</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
          {filteredComponents.map(component => (
            <div
              key={component.id}
              className={`flex items-center p-2 border rounded-lg cursor-pointer transition-colors ${
                selectedComponents.includes(component.id)
                  ? "border-flow-blue bg-blue-50 text-flow-blue"
                  : "border-gray-200 hover:border-flow-blue/50 hover:bg-blue-50/30"
              }`}
              onClick={() => handleComponentClick(component.id)}
            >
              <div className="flex-1">
                <div className="flex items-center space-x-1">
                  <div className="font-medium">{component.name}</div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Info className="h-3.5 w-3.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-xs space-y-1 max-w-[200px]">
                          <div><strong>Formula:</strong> {component.formula}</div>
                          <div><strong>MW:</strong> {component.mw} g/mol</div>
                          <div><strong>CAS:</strong> {component.cas}</div>
                          <div><strong>Phase:</strong> {component.phase}</div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="text-sm text-gray-500">{component.formula}</div>
              </div>
              <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center">
                {selectedComponents.includes(component.id) && <Check className="h-3 w-3 text-flow-blue" />}
              </div>
            </div>
          ))}
          
          {filteredComponents.length === 0 && (
            <div className="col-span-2 p-4 text-center text-gray-500">
              No components found matching "{searchQuery}". Try a different search term or add a custom component.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComponentSelector;
