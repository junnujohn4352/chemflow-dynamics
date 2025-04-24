import React, { useState } from "react";
import { Search, X, Info, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ComponentSelectorProps {
  selectedComponents: string[];
  setSelectedComponents: (components: string[]) => void;
}

// Expanded list of chemical components with more data
const availableComponents = [
  { id: "Water", name: "Water", formula: "H₂O", mw: 18.02, cas: "7732-18-5", phase: "liquid/gas" },
  { id: "Nitrogen", name: "Nitrogen", formula: "N₂", mw: 28.01, cas: "7727-37-9", phase: "gas" },
  { id: "Oxygen", name: "Oxygen", formula: "O₂", mw: 32.00, cas: "7782-44-7", phase: "gas" },
  { id: "Carbon-Dioxide", name: "Carbon Dioxide", formula: "CO₂", mw: 44.01, cas: "124-38-9", phase: "gas" },
  { id: "Methane", name: "Methane", formula: "CH₄", mw: 16.04, cas: "74-82-8", phase: "gas" },
  { id: "Ethane", name: "Ethane", formula: "C₂H₆", mw: 30.07, cas: "74-84-0", phase: "gas" },
  { id: "Propane", name: "Propane", formula: "C₃H₈", mw: 44.10, cas: "74-98-6", phase: "gas/liquid" },
  { id: "n-Butane", name: "n-Butane", formula: "C₄H₁₀", mw: 58.12, cas: "106-97-8", phase: "gas/liquid" },
  { id: "i-Butane", name: "i-Butane", formula: "C₄H₁₀", mw: 58.12, cas: "75-28-5", phase: "gas/liquid" },
  { id: "n-Pentane", name: "n-Pentane", formula: "C₅H₁₂", mw: 72.15, cas: "109-66-0", phase: "liquid" },
  { id: "n-Hexane", name: "n-Hexane", formula: "C₆H₁₄", mw: 86.18, cas: "110-54-3", phase: "liquid" },
  { id: "n-Heptane", name: "n-Heptane", formula: "C₇H₁₆", mw: 100.20, cas: "142-82-5", phase: "liquid" },
  { id: "n-Octane", name: "n-Octane", formula: "C₈H₁₈", mw: 114.23, cas: "111-65-9", phase: "liquid" },
  { id: "Ethylene", name: "Ethylene", formula: "C₂H₄", mw: 28.05, cas: "74-85-1", phase: "gas" },
  { id: "Propylene", name: "Propylene", formula: "C₃H₆", mw: 42.08, cas: "115-07-1", phase: "gas" },
  { id: "Acetone", name: "Acetone", formula: "C₃H₆O", mw: 58.08, cas: "67-64-1", phase: "liquid" },
  { id: "Methanol", name: "Methanol", formula: "CH₃OH", mw: 32.04, cas: "67-56-1", phase: "liquid" },
  { id: "Ethanol", name: "Ethanol", formula: "C₂H₅OH", mw: 46.07, cas: "64-17-5", phase: "liquid" },
  { id: "Benzene", name: "Benzene", formula: "C₆H₆", mw: 78.11, cas: "71-43-2", phase: "liquid" },
  { id: "Toluene", name: "Toluene", formula: "C₇H₈", mw: 92.14, cas: "108-88-3", phase: "liquid" },
  { id: "Xylene", name: "Xylene", formula: "C₈H₁₀", mw: 106.16, cas: "1330-20-7", phase: "liquid" },
  { id: "Ammonia", name: "Ammonia", formula: "NH₃", mw: 17.03, cas: "7664-41-7", phase: "gas/liquid" },
  { id: "Hydrogen", name: "Hydrogen", formula: "H₂", mw: 2.02, cas: "1333-74-0", phase: "gas" },
  { id: "Hydrogen-Sulfide", name: "Hydrogen Sulfide", formula: "H₂S", mw: 34.08, cas: "7783-06-4", phase: "gas" },
  { id: "Sulfur-Dioxide", name: "Sulfur Dioxide", formula: "SO₂", mw: 64.07, cas: "7446-09-5", phase: "gas" },
  { id: "Nitrogen-Dioxide", name: "Nitrogen Dioxide", formula: "NO₂", mw: 46.01, cas: "10102-44-0", phase: "gas" },
  { id: "Acetic-Acid", name: "Acetic Acid", formula: "CH₃COOH", mw: 60.05, cas: "64-19-7", phase: "liquid" },
  { id: "Formic-Acid", name: "Formic Acid", formula: "HCOOH", mw: 46.03, cas: "64-18-6", phase: "liquid" },
  { id: "Formaldehyde", name: "Formaldehyde", formula: "CH₂O", mw: 30.03, cas: "50-00-0", phase: "gas" },
  { id: "Acetaldehyde", name: "Acetaldehyde", formula: "C₂H₄O", mw: 44.05, cas: "75-07-0", phase: "liquid" },
  { id: "Chlorine", name: "Chlorine", formula: "Cl₂", mw: 70.91, cas: "7782-50-5", phase: "gas" },
  { id: "Carbon-Monoxide", name: "Carbon Monoxide", formula: "CO", mw: 28.01, cas: "630-08-0", phase: "gas" },
  { id: "Hydrogen-Chloride", name: "Hydrogen Chloride", formula: "HCl", mw: 36.46, cas: "7647-01-0", phase: "gas" },
  { id: "Helium", name: "Helium", formula: "He", mw: 4.00, cas: "7440-59-7", phase: "gas" },
  { id: "Argon", name: "Argon", formula: "Ar", mw: 39.95, cas: "7440-37-1", phase: "gas" },
  { id: "Neon", name: "Neon", formula: "Ne", mw: 20.18, cas: "7440-01-9", phase: "gas" },
  { id: "Krypton", name: "Krypton", formula: "Kr", mw: 83.80, cas: "7439-90-9", phase: "gas" },
  { id: "Xenon", name: "Xenon", formula: "Xe", mw: 131.29, cas: "7440-63-3", phase: "gas" },
  { id: "Isopropanol", name: "Isopropanol", formula: "C₃H₈O", mw: 60.10, cas: "67-63-0", phase: "liquid" },
  { id: "n-Butanol", name: "n-Butanol", formula: "C₄H₁₀O", mw: 74.12, cas: "71-36-3", phase: "liquid" },
  { id: "Glycerol", name: "Glycerol", formula: "C₃H₈O₃", mw: 92.09, cas: "56-81-5", phase: "liquid" },
  { id: "Phenol", name: "Phenol", formula: "C₆H₅OH", mw: 94.11, cas: "108-95-2", phase: "solid/liquid" },
  { id: "Styrene", name: "Styrene", formula: "C₈H₈", mw: 104.15, cas: "100-42-5", phase: "liquid" },
  { id: "Cyclohexane", name: "Cyclohexane", formula: "C₆H₁₂", mw: 84.16, cas: "110-82-7", phase: "liquid" },
  { id: "MTBE", name: "MTBE", formula: "C₅H₁₂O", mw: 88.15, cas: "1634-04-4", phase: "liquid" },
  { id: "Acetonitrile", name: "Acetonitrile", formula: "C₂H₃N", mw: 41.05, cas: "75-05-8", phase: "liquid" },
  { id: "Dichloromethane", name: "Dichloromethane", formula: "CH₂Cl₂", mw: 84.93, cas: "75-09-2", phase: "liquid" },
  { id: "Chloroform", name: "Chloroform", formula: "CHCl₃", mw: 119.38, cas: "67-66-3", phase: "liquid" },
  { id: "Carbon-Tetrachloride", name: "Carbon Tetrachloride", formula: "CCl₄", mw: 153.82, cas: "56-23-5", phase: "liquid" },
  { id: "Diethyl-Ether", name: "Diethyl Ether", formula: "C₄H₁₀O", mw: 74.12, cas: "60-29-7", phase: "liquid" },
  { id: "MEK", name: "MEK", formula: "C₄H₈O", mw: 72.11, cas: "78-93-3", phase: "liquid" },
  { id: "THF", name: "THF", formula: "C₄H₈O", mw: 72.11, cas: "109-99-9", phase: "liquid" },
  { id: "Acetic-Anhydride", name: "Acetic Anhydride", formula: "C₄H₆O₃", mw: 102.09, cas: "108-24-7", phase: "liquid" },
  { id: "Pyridine", name: "Pyridine", formula: "C₅H₅N", mw: 79.10, cas: "110-86-1", phase: "liquid" },
  { id: "DMF", name: "DMF", formula: "C₃H₇NO", mw: 73.09, cas: "68-12-2", phase: "liquid" },
  { id: "DMSO", name: "DMSO", formula: "C₂H₆OS", mw: 78.13, cas: "67-68-5", phase: "liquid" },
  { id: "Nitrobenzene", name: "Nitrobenzene", formula: "C₆H₅NO₂", mw: 123.11, cas: "98-95-3", phase: "liquid" },
  { id: "Aniline", name: "Aniline", formula: "C₆H₇N", mw: 93.13, cas: "62-53-3", phase: "liquid" },
  { id: "Naphthalene", name: "Naphthalene", formula: "C₁₀H₈", mw: 128.17, cas: "91-20-3", phase: "solid" },
  { id: "Anthracene", name: "Anthracene", formula: "C₁₄H₁₀", mw: 178.23, cas: "120-12-7", phase: "solid" },
  { id: "Ethylene-Oxide", name: "Ethylene Oxide", formula: "C₂H₄O", mw: 44.05, cas: "75-21-8", phase: "gas" },
  { id: "Propylene-Oxide", name: "Propylene Oxide", formula: "C₃H₆O", mw: 58.08, cas: "75-56-9", phase: "liquid" },
  { id: "Ethylene-Glycol", name: "Ethylene Glycol", formula: "C₂H₆O₂", mw: 62.07, cas: "107-21-1", phase: "liquid" },
  { id: "Propylene-Glycol", name: "Propylene Glycol", formula: "C₃H₈O₂", mw: 76.09, cas: "57-55-6", phase: "liquid" },
  { id: "Acrylic-Acid", name: "Acrylic Acid", formula: "C₃H₄O₂", mw: 72.06, cas: "79-10-7", phase: "liquid" },
  { id: "Acrylonitrile", name: "Acrylonitrile", formula: "C₃H₃N", mw: 53.06, cas: "107-13-1", phase: "liquid" },
  { id: "1,3-Butadiene", name: "1,3-Butadiene", formula: "C₄H₆", mw: 54.09, cas: "106-99-0", phase: "gas" },
  { id: "Isoprene", name: "Isoprene", formula: "C₅H₈", mw: 68.12, cas: "78-79-5", phase: "liquid" },
  { id: "Vinyl-Chloride", name: "Vinyl Chloride", formula: "C₂H₃Cl", mw: 62.50, cas: "75-01-4", phase: "gas" },
  { id: "Vinyl-Acetate", name: "Vinyl Acetate", formula: "C₄H₆O₂", mw: 86.09, cas: "108-05-4", phase: "liquid" },
  { id: "Styrene", name: "Styrene", formula: "C₈H₈", mw: 104.15, cas: "100-42-5", phase: "liquid" },
  { id: "Ethylbenzene", name: "Ethylbenzene", formula: "C₈H₁₀", mw: 106.17, cas: "100-41-4", phase: "liquid" },
  { id: "Urea", name: "Urea", formula: "CH₄N₂O", mw: 60.06, cas: "57-13-6", phase: "solid" },
  { id: "Methyl-Methacrylate", name: "Methyl Methacrylate", formula: "C₅H₈O₂", mw: 100.12, cas: "80-62-6", phase: "liquid" },
  { id: "Acetylene", name: "Acetylene", formula: "C₂H₂", mw: 26.04, cas: "74-86-2", phase: "gas" },
  { id: "Acetaminophen", name: "Acetaminophen", formula: "C₈H₉NO₂", mw: 151.16, cas: "103-90-2", phase: "solid" },
  { id: "Acetylsalicylic-Acid", name: "Acetylsalicylic Acid", formula: "C₉H₈O₄", mw: 180.16, cas: "50-78-2", phase: "solid" },
  { id: "Adenosine", name: "Adenosine", formula: "C₁₀H₁₃N₅O₄", mw: 267.24, cas: "58-61-7", phase: "solid" },
  { id: "Adrenaline", name: "Adrenaline", formula: "C₉H₁₃NO₃", mw: 183.20, cas: "51-43-4", phase: "solid" },
  { id: "Caffeine", name: "Caffeine", formula: "C₈H₁₀N₄O₂", mw: 194.19, cas: "58-08-2", phase: "solid" },
  { id: "Cholesterol", name: "Cholesterol", formula: "C₂₇H₄₆O", mw: 386.65, cas: "57-88-5", phase: "solid" },
  { id: "Citric-Acid", name: "Citric Acid", formula: "C₆H₈O₇", mw: 192.12, cas: "77-92-9", phase: "solid" },
  { id: "Diethyl-Ether", name: "Diethyl Ether", formula: "C₄H₁₀O", mw: 74.12, cas: "60-29-7", phase: "liquid" },
  { id: "Dopamine", name: "Dopamine", formula: "C₈H₁₁NO₂", mw: 153.18, cas: "51-61-6", phase: "solid" },
  { id: "Estrogen", name: "Estrogen", formula: "C₁₈H₂₄O₂", mw: 272.38, cas: "50-28-2", phase: "solid" },
  { id: "Ethyl-Acetate", name: "Ethyl Acetate", formula: "C₄H₈O₂", mw: 88.11, cas: "141-78-6", phase: "liquid" },
  { id: "Fructose", name: "Fructose", formula: "C₆H₁₂O₆", mw: 180.16, cas: "57-48-7", phase: "solid" },
  { id: "Glucose", name: "Glucose", formula: "C₆H₁₂O₆", mw: 180.16, cas: "50-99-7", phase: "solid" },
  { id: "Glycine", name: "Glycine", formula: "C₂H₅NO₂", mw: 75.07, cas: "56-40-6", phase: "solid" },
  { id: "Hydrogen-Peroxide", name: "Hydrogen Peroxide", formula: "H₂O₂", mw: 34.01, cas: "7722-84-1", phase: "liquid" },
  { id: "Insulin", name: "Insulin", formula: "C₂₅₇H₃₈₃N₆₅O₇₇S₆", mw: 5807.6, cas: "11061-68-0", phase: "solid" },
  { id: "Lactic-Acid", name: "Lactic Acid", formula: "C₃H₆O₃", mw: 90.08, cas: "50-21-5", phase: "liquid" },
  { id: "Nitric-Acid", name: "Nitric Acid", formula: "HNO₃", mw: 63.01, cas: "7697-37-2", phase: "liquid" },
  { id: "Oleic-Acid", name: "Oleic Acid", formula: "C₁₈H₃₄O₂", mw: 282.46, cas: "112-80-1", phase: "liquid" },
  { id: "Paracetamol", name: "Paracetamol", formula: "C₈H₉NO₂", mw: 151.16, cas: "103-90-2", phase: "solid" },
  { id: "Penicillin", name: "Penicillin", formula: "C₁₆H₁₈N₂O₄S", mw: 334.39, cas: "61-33-6", phase: "solid" },
  { id: "Phosphoric-Acid", name: "Phosphoric Acid", formula: "H₃PO₄", mw: 97.99, cas: "7664-38-2", phase: "liquid" },
  { id: "Potassium-Chloride", name: "Potassium Chloride", formula: "KCl", mw: 74.55, cas: "7447-40-7", phase: "solid" },
  { id: "Potassium-Hydroxide", name: "Potassium Hydroxide", formula: "KOH", mw: 56.11, cas: "1310-58-3", phase: "solid" },
  { id: "Propylene-Glycol", name: "Propylene Glycol", formula: "C₃H₈O₂", mw: 76.09, cas: "57-55-6", phase: "liquid" },
  { id: "Sodium-Bicarbonate", name: "Sodium Bicarbonate", formula: "NaHCO₃", mw: 84.01, cas: "144-55-8", phase: "solid" },
  { id: "Sodium-Chloride", name: "Sodium Chloride", formula: "NaCl", mw: 58.44, cas: "7647-14-5", phase: "solid" },
  { id: "Sodium-Hydroxide", name: "Sodium Hydroxide", formula: "NaOH", mw: 40.00, cas: "1310-73-2", phase: "solid" },
  { id: "Sucrose", name: "Sucrose", formula: "C₁₂H₂₂O₁₁", mw: 342.30, cas: "57-50-1", phase: "solid" },
  { id: "Sulfuric-Acid", name: "Sulfuric Acid", formula: "H₂SO₄", mw: 98.08, cas: "7664-93-9", phase: "liquid" },
  { id: "Tetrafluoroethylene", name: "Tetrafluoroethylene", formula: "C₂F₄", mw: 100.02, cas: "116-14-3", phase: "gas" },
  { id: "Titanium-Dioxide", name: "Titanium Dioxide", formula: "TiO₂", mw: 79.87, cas: "13463-67-7", phase: "solid" },
  { id: "Trifluoroacetic-Acid", name: "Trifluoroacetic Acid", formula: "C₂HF₃O₂", mw: 114.02, cas: "76-05-1", phase: "liquid" },
  { id: "Uranium-Hexafluoride", name: "Uranium Hexafluoride", formula: "UF₆", mw: 352.02, cas: "7783-81-5", phase: "solid/gas" },
  { id: "Vitamin-A", name: "Vitamin A", formula: "C₂₀H₃₀O", mw: 286.45, cas: "68-26-8", phase: "solid" },
  { id: "Vitamin-C", name: "Vitamin C", formula: "C₆H₈O₆", mw: 176.12, cas: "50-81-7", phase: "solid" },
  { id: "Zinc-Oxide", name: "Zinc Oxide", formula: "ZnO", mw: 81.38, cas: "1314-13-2", phase: "solid" }
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
