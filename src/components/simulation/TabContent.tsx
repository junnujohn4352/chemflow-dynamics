
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import GlassPanel from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/button';
import ComponentSelector from '@/components/simulation/ComponentSelector';
import ThermodynamicsSelector from '@/components/simulation/ThermodynamicsSelector';
import SimulationBuilder from '@/components/simulation/SimulationBuilder';

interface TabContentProps {
  activeTab: 'components' | 'thermodynamics' | 'builder';
  selectedComponents: string[];
  setSelectedComponents: React.Dispatch<React.SetStateAction<string[]>>;
  selectedModel: string;
  setSelectedModel: React.Dispatch<React.SetStateAction<string>>;
  componentsValid: boolean;
  onRunSimulation: () => void;
  handleComponentSelectionDone: () => void;
  handleModelSelectionDone: () => void;
}

const TabContent: React.FC<TabContentProps> = ({
  activeTab,
  selectedComponents,
  setSelectedComponents,
  selectedModel,
  setSelectedModel,
  componentsValid,
  onRunSimulation,
  handleComponentSelectionDone,
  handleModelSelectionDone
}) => {
  return (
    <GlassPanel className="p-6">
      {activeTab === 'components' && (
        <div className="flex flex-col">
          <ComponentSelector 
            selectedComponents={selectedComponents}
            setSelectedComponents={setSelectedComponents}
          />
          <div className="mt-6 flex justify-end">
            <Button 
              onClick={handleComponentSelectionDone}
              disabled={!componentsValid}
            >
              Continue to Thermodynamics
            </Button>
          </div>
        </div>
      )}
      
      {activeTab === 'thermodynamics' && (
        <div className="flex flex-col">
          <ThermodynamicsSelector 
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
          />
          <div className="mt-6 flex justify-between">
            <Button 
              variant="outline"
              onClick={() => activeTab = 'components'}
            >
              Back to Components
            </Button>
            <Button 
              onClick={handleModelSelectionDone}
              disabled={!selectedModel}
            >
              Continue to Flowsheet Builder
            </Button>
          </div>
        </div>
      )}
      
      {activeTab === 'builder' && (
        <DndProvider backend={HTML5Backend}>
          <SimulationBuilder 
            selectedComponents={selectedComponents}
            thermodynamicModel={selectedModel}
            onRunSimulation={onRunSimulation}
          />
        </DndProvider>
      )}
    </GlassPanel>
  );
};

export default TabContent;
