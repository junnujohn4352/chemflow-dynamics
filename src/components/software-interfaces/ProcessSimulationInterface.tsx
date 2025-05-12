
import React, { useState } from 'react';
import { Software } from '@/types/software';
import BaseSoftwareInterface from './BaseSoftwareInterface';
import { useToast } from '@/hooks/use-toast';
import SimulationTabs from '../coco-simulator/SimulationTabs';
import AddChemicalDialog from '../coco-simulator/AddChemicalDialog';

interface ProcessSimulationInterfaceProps {
  software: Software;
}

const ProcessSimulationInterface: React.FC<ProcessSimulationInterfaceProps> = ({ software }) => {
  // Process parameters
  const [feedTemperature, setFeedTemperature] = useState<number>(25);
  const [feedPressure, setFeedPressure] = useState<number>(101.325);
  const [feedFlowRate, setFeedFlowRate] = useState<number>(100);
  const [thermodynamicModel, setThermodynamicModel] = useState<string>("peng-robinson");
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("simulation");
  
  // COCO packages states
  const [teaPackages, setTeaPackages] = useState<string[]>(["TEA", "NIST", "ChemSep", "UNIFAC"]);
  const [couscousUnits, setCouscousUnits] = useState<string[]>(["Mixer", "Splitter", "Pump", "Heat Exchanger"]);
  const [cornReactions, setCornReactions] = useState<string[]>([]);
  
  // Custom chemical state
  const [customChemicalName, setCustomChemicalName] = useState<string>("");
  const [customChemicalFormula, setCustomChemicalFormula] = useState<string>("");
  const [customChemicalMw, setCustomChemicalMw] = useState<string>("");
  const [customChemicalDensity, setCustomChemicalDensity] = useState<string>("");
  const [customChemicalsList, setCustomChemicalsList] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const handleRunSimulation = () => {
    // Simulate processing time
    setIsSimulating(true);
    setResults(null);
    
    setTimeout(() => {
      // Generate simulated results based on inputs
      const simulatedResults = {
        outletTemperature: feedTemperature + (Math.random() * 15 - 5),
        outletPressure: feedPressure * (0.8 + Math.random() * 0.15),
        conversion: Math.random() * 0.6 + 0.3,
        energyUsage: feedFlowRate * (0.5 + Math.random() * 0.2),
        errorMargin: Math.random() * 0.05
      };
      
      setResults(simulatedResults);
      setIsSimulating(false);
      
      toast({
        title: "Simulation Complete",
        description: "ChemFlow simulation results have been calculated.",
      });
    }, 2000);
  };

  const handleAddCustomChemical = () => {
    if (!customChemicalName || !customChemicalFormula) {
      toast({
        title: "Missing Information",
        description: "Please provide at least a name and formula for the custom chemical.",
        variant: "destructive"
      });
      return;
    }

    const newChemical = {
      id: Date.now().toString(),
      name: customChemicalName,
      formula: customChemicalFormula,
      mw: customChemicalMw ? parseFloat(customChemicalMw) : undefined,
      density: customChemicalDensity ? parseFloat(customChemicalDensity) : undefined
    };

    setCustomChemicalsList([...customChemicalsList, newChemical]);
    
    // Reset form
    setCustomChemicalName("");
    setCustomChemicalFormula("");
    setCustomChemicalMw("");
    setCustomChemicalDensity("");
    setIsDialogOpen(false);
    
    toast({
      title: "Chemical Added",
      description: `${customChemicalName} has been added to your component list.`,
    });
  };

  const handleAddReaction = () => {
    // This would add a new reaction using CORN package
    setCornReactions([...cornReactions, `Reaction ${cornReactions.length + 1}`]);
    toast({
      title: "Reaction Added",
      description: "A new reaction has been added using the CORN package.",
    });
  };

  return (
    <BaseSoftwareInterface software={software}>
      <div className="mt-4 border-t pt-4">
        <h5 className="font-medium mb-2">ChemFlow CAPE-OPEN Simulation Environment</h5>
        
        <SimulationTabs 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
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
          teaPackages={teaPackages}
          cornReactions={cornReactions}
          couscousUnits={couscousUnits}
          handleRunSimulation={handleRunSimulation}
          handleAddReaction={handleAddReaction}
          setIsDialogOpen={setIsDialogOpen}
        />
        
        <AddChemicalDialog 
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          customChemicalName={customChemicalName}
          setCustomChemicalName={setCustomChemicalName}
          customChemicalFormula={customChemicalFormula}
          setCustomChemicalFormula={setCustomChemicalFormula}
          customChemicalMw={customChemicalMw}
          setCustomChemicalMw={setCustomChemicalMw}
          customChemicalDensity={customChemicalDensity}
          setCustomChemicalDensity={setCustomChemicalDensity}
          handleAddCustomChemical={handleAddCustomChemical}
        />
      </div>
    </BaseSoftwareInterface>
  );
};

export default ProcessSimulationInterface;
