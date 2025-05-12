
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SimulationTab from './tabs/SimulationTab';
import ThermodynamicsTab from './tabs/ThermodynamicsTab';
import ReactionsTab from './tabs/ReactionsTab';
import UnitOperationsTab from './tabs/UnitOperationsTab';

interface SimulationTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  feedTemperature: number;
  setFeedTemperature: (value: number) => void;
  feedPressure: number;
  setFeedPressure: (value: number) => void;
  feedFlowRate: number;
  setFeedFlowRate: (value: number) => void;
  thermodynamicModel: string;
  setThermodynamicModel: (value: string) => void;
  isSimulating: boolean;
  results: any;
  customChemicalsList: any[];
  teaPackages: string[];
  cornReactions: string[];
  couscousUnits: string[];
  handleRunSimulation: () => void;
  handleAddReaction: () => void;
  setIsDialogOpen: (isOpen: boolean) => void;
}

const SimulationTabs: React.FC<SimulationTabsProps> = ({
  activeTab,
  setActiveTab,
  feedTemperature,
  setFeedTemperature,
  feedPressure,
  setFeedPressure,
  feedFlowRate,
  setFeedFlowRate,
  thermodynamicModel,
  setThermodynamicModel,
  isSimulating,
  results,
  customChemicalsList,
  teaPackages,
  cornReactions,
  couscousUnits,
  handleRunSimulation,
  handleAddReaction,
  setIsDialogOpen
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-4 mb-4">
        <TabsTrigger value="simulation">COFE Flowsheet</TabsTrigger>
        <TabsTrigger value="thermodynamics">TEA Package</TabsTrigger>
        <TabsTrigger value="reactions">CORN Package</TabsTrigger>
        <TabsTrigger value="unitops">COUSCOUS Units</TabsTrigger>
      </TabsList>

      <TabsContent value="simulation">
        <SimulationTab 
          feedTemperature={feedTemperature}
          setFeedTemperature={setFeedTemperature}
          feedPressure={feedPressure}
          setFeedPressure={setFeedPressure}
          feedFlowRate={feedFlowRate}
          setFeedFlowRate={setFeedFlowRate}
          thermodynamicModel={thermodynamicModel}
          setThermodynamicModel={setThermodynamicModel}
          isSimulating={isSimulating}
          results={results}
          customChemicalsList={customChemicalsList}
          handleRunSimulation={handleRunSimulation}
          setIsDialogOpen={setIsDialogOpen}
        />
      </TabsContent>
      
      <TabsContent value="thermodynamics">
        <ThermodynamicsTab teaPackages={teaPackages} />
      </TabsContent>
      
      <TabsContent value="reactions">
        <ReactionsTab 
          cornReactions={cornReactions} 
          handleAddReaction={handleAddReaction} 
        />
      </TabsContent>
      
      <TabsContent value="unitops">
        <UnitOperationsTab couscousUnits={couscousUnits} />
      </TabsContent>
    </Tabs>
  );
};

export default SimulationTabs;
