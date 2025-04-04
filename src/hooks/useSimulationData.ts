
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface SimulationData {
  components: string[];
  thermodynamicModel: string;
  name: string;
  subject: string | null;
}

export const useSimulationData = () => {
  const { toast } = useToast();
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState('Peng-Robinson');
  const [simulationName, setSimulationName] = useState('Untitled Simulation');
  const [simulationSubject, setSimulationSubject] = useState<string | null>(null);
  
  // Load saved simulation data on mount
  useEffect(() => {
    const savedSimData = localStorage.getItem('chemflow-simulation-data');
    if (savedSimData) {
      try {
        const simData = JSON.parse(savedSimData);
        if (simData.components && simData.components.length > 0) {
          setSelectedComponents(simData.components);
        }
        if (simData.thermodynamicModel) {
          setSelectedModel(simData.thermodynamicModel);
        }
        if (simData.name) {
          setSimulationName(simData.name);
        }
        if (simData.subject) {
          setSimulationSubject(simData.subject);
        }
      } catch (e) {
        console.error("Error loading saved simulation data:", e);
      }
    }
  }, []);
  
  const detectSimulationSubject = () => {
    const hasAromatic = selectedComponents.some(c => 
      ['Benzene', 'Toluene', 'Xylene', 'Styrene'].includes(c));
    
    const hasAlcohol = selectedComponents.some(c => 
      ['Methanol', 'Ethanol', 'Propanol', 'Butanol'].includes(c));
      
    const hasAcid = selectedComponents.some(c => 
      ['Acetic Acid', 'Formic Acid', 'Sulfuric Acid'].includes(c));
    
    const hasGas = selectedComponents.some(c => 
      ['Methane', 'Ethane', 'Propane', 'Nitrogen', 'Oxygen', 'Carbon Dioxide'].includes(c));
    
    if (hasAromatic && hasAlcohol) {
      return "Liquid-Liquid Extraction";
    } else if (hasAlcohol && hasAcid) {
      return "Esterification Reaction";
    } else if (hasAlcohol) {
      return "Distillation";
    } else if (hasGas) {
      return "Gas Processing";
    } else if (hasAromatic) {
      return "Aromatics Separation";
    } else if (hasAcid) {
      return "Acid Gas Treatment";
    } else {
      return "Chemical Process";
    }
  };
  
  const saveSimulation = () => {
    if (simulationName.trim() === '') {
      toast({
        title: "Name required",
        description: "Please enter a name for your simulation",
        variant: "destructive",
      });
      return false;
    }
    
    if (selectedComponents.length === 0) {
      toast({
        title: "Components required",
        description: "Please select at least one component for your simulation",
        variant: "destructive",
      });
      return false;
    }
    
    localStorage.setItem('chemflow-simulation-name', simulationName);
    localStorage.setItem('chemflow-selected-components', JSON.stringify(selectedComponents));
    localStorage.setItem('chemflow-selected-model', selectedModel);
    
    if (simulationSubject) {
      localStorage.setItem('chemflow-simulation-subject', simulationSubject);
    }
    
    toast({
      title: "Simulation saved",
      description: "Your simulation has been created successfully!"
    });
    
    return true;
  };
  
  return {
    selectedComponents,
    setSelectedComponents,
    selectedModel,
    setSelectedModel,
    simulationName,
    setSimulationName,
    simulationSubject,
    setSimulationSubject,
    detectSimulationSubject,
    saveSimulation
  };
};
