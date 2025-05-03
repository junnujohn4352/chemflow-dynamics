
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Plus, Search } from 'lucide-react';

interface ComponentSelectorProps {
  selectedComponents: string[];
  setSelectedComponents: React.Dispatch<React.SetStateAction<string[]>>;
}

const ComponentSelector: React.FC<ComponentSelectorProps> = ({ selectedComponents, setSelectedComponents }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const componentCategories = [
    {
      name: 'Hydrocarbons',
      components: ['Methane', 'Ethane', 'Propane', 'Butane', 'Pentane', 'Hexane', 'Heptane', 'Octane']
    },
    {
      name: 'Aromatics',
      components: ['Benzene', 'Toluene', 'Xylene', 'Styrene', 'Cumene']
    },
    {
      name: 'Alcohols',
      components: ['Methanol', 'Ethanol', 'Propanol', 'Butanol', 'Glycol', 'Glycerol']
    },
    {
      name: 'Ketones',
      components: ['Acetone', 'MEK', 'MIBK']
    },
    {
      name: 'Acids',
      components: ['Acetic Acid', 'Formic Acid', 'Propionic Acid', 'Butyric Acid']
    },
    {
      name: 'Gases',
      components: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Carbon Monoxide', 'Hydrogen', 'Ammonia']
    },
    {
      name: 'Water',
      components: ['Water', 'Steam', 'Heavy Water']
    },
    {
      name: 'Custom',
      components: []
    }
  ];

  // Get all component names for searching
  const allComponents = componentCategories.flatMap(category => category.components);

  // Filter components based on search term
  const filteredComponents = allComponents.filter(component =>
    component.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle component selection/deselection
  const toggleComponent = (component: string) => {
    if (selectedComponents.includes(component)) {
      setSelectedComponents(selectedComponents.filter(c => c !== component));
    } else {
      setSelectedComponents([...selectedComponents, component]);
    }
  };

  // Handle adding custom component
  const handleAddCustom = () => {
    if (customName.trim() && !allComponents.includes(customName.trim())) {
      // Add to selected components
      setSelectedComponents([...selectedComponents, customName.trim()]);
      // Reset input
      setCustomName('');
      setShowAddCustom(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Search for components..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {componentCategories.map(category => (
          <Button
            key={category.name}
            variant={activeCategory === category.name ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(activeCategory === category.name ? null : category.name)}
          >
            {category.name}
          </Button>
        ))}
      </div>

      <div className="border rounded-lg p-2">
        <div className="mb-2 font-medium">Selected Components ({selectedComponents.length})</div>
        {selectedComponents.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-400 text-sm">No components selected</div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedComponents.map(component => (
              <Badge
                key={component}
                variant="secondary"
                className="flex gap-1 items-center pl-3 pr-1.5 py-1.5"
              >
                {component}
                <button 
                  onClick={() => toggleComponent(component)}
                  className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {searchTerm && (
        <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
          <h3 className="font-medium mb-2">Search Results</h3>
          {filteredComponents.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {filteredComponents.map(component => (
                <Button
                  key={component}
                  variant="outline"
                  size="sm"
                  className={`justify-start ${
                    selectedComponents.includes(component) ? "border-flow-blue text-flow-blue" : ""
                  }`}
                  onClick={() => toggleComponent(component)}
                >
                  {selectedComponents.includes(component) && <Check className="h-3 w-3 mr-2" />}
                  {component}
                </Button>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 dark:text-gray-400">No components found</div>
          )}
        </div>
      )}

      {activeCategory && (
        <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
          <h3 className="font-medium mb-2">{activeCategory} Components</h3>
          {activeCategory === 'Custom' ? (
            <div className="space-y-3">
              {!showAddCustom ? (
                <Button 
                  onClick={() => setShowAddCustom(true)} 
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Add Custom Component
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Input
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Enter component name"
                    className="flex-1"
                    autoFocus
                  />
                  <Button onClick={handleAddCustom} disabled={!customName.trim()}>
                    Add
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setShowAddCustom(false);
                    setCustomName('');
                  }}>
                    Cancel
                  </Button>
                </div>
              )}
              
              {selectedComponents.filter(comp => !allComponents.includes(comp)).length > 0 && (
                <div className="mt-3">
                  <h4 className="text-sm font-medium mb-2">Your Custom Components:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedComponents
                      .filter(comp => !allComponents.includes(comp))
                      .map(component => (
                        <Badge
                          key={component}
                          variant="secondary"
                          className="flex gap-1 items-center pl-3 pr-1.5 py-1.5"
                        >
                          {component}
                          <button 
                            onClick={() => toggleComponent(component)}
                            className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {componentCategories
                .find(cat => cat.name === activeCategory)
                ?.components.map(component => (
                  <Button
                    key={component}
                    variant="outline"
                    size="sm"
                    className={`justify-start ${
                      selectedComponents.includes(component) ? "border-flow-blue text-flow-blue" : ""
                    }`}
                    onClick={() => toggleComponent(component)}
                  >
                    {selectedComponents.includes(component) && <Check className="h-3 w-3 mr-2" />}
                    {component}
                  </Button>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ComponentSelector;
