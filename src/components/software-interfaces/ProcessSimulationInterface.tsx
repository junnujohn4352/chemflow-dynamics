
import React, { useState } from 'react';
import { Software } from '@/types/software';
import BaseSoftwareInterface from './BaseSoftwareInterface';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';

interface ProcessSimulationInterfaceProps {
  software: Software;
}

const ProcessSimulationInterface: React.FC<ProcessSimulationInterfaceProps> = ({ software }) => {
  const [feedTemperature, setFeedTemperature] = useState<number>(25);
  const [feedPressure, setFeedPressure] = useState<number>(101.325);
  const [feedFlowRate, setFeedFlowRate] = useState<number>(100);
  const [thermodynamicModel, setThermodynamicModel] = useState<string>("peng-robinson");
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();
  
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
        description: "Process simulation results have been calculated.",
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

  return (
    <BaseSoftwareInterface software={software}>
      <div className="mt-4 border-t pt-4">
        <h5 className="font-medium mb-2">Process Simulation Controls</h5>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="feedTemp">Feed Temperature (°C)</Label>
            <Input 
              id="feedTemp" 
              type="number" 
              value={feedTemperature} 
              onChange={(e) => setFeedTemperature(Number(e.target.value))} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="feedPressure">Feed Pressure (kPa)</Label>
            <Input 
              id="feedPressure" 
              type="number" 
              value={feedPressure} 
              onChange={(e) => setFeedPressure(Number(e.target.value))} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="feedFlowRate">Feed Flow Rate (kg/h)</Label>
            <Input 
              id="feedFlowRate" 
              type="number" 
              value={feedFlowRate} 
              onChange={(e) => setFeedFlowRate(Number(e.target.value))} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="thermoModel">Thermodynamic Model</Label>
            <Select value={thermodynamicModel} onValueChange={setThermodynamicModel}>
              <SelectTrigger id="thermoModel">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="peng-robinson">Peng-Robinson</SelectItem>
                <SelectItem value="srk">Soave-Redlich-Kwong</SelectItem>
                <SelectItem value="nrtl">NRTL</SelectItem>
                <SelectItem value="wilson">Wilson</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h5 className="font-medium">Components</h5>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="flex items-center gap-1">
                  <PlusCircle className="h-4 w-4" />
                  Add Custom Chemical
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Custom Chemical</DialogTitle>
                  <DialogDescription>
                    Enter the properties of your custom chemical component.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="chemicalName" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="chemicalName"
                      value={customChemicalName}
                      onChange={(e) => setCustomChemicalName(e.target.value)}
                      placeholder="e.g., Methanol"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="chemicalFormula" className="text-right">
                      Chemical Formula
                    </Label>
                    <Input
                      id="chemicalFormula"
                      value={customChemicalFormula}
                      onChange={(e) => setCustomChemicalFormula(e.target.value)}
                      placeholder="e.g., CH3OH"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="molecularWeight" className="text-right">
                        Molecular Weight
                      </Label>
                      <Input
                        id="molecularWeight"
                        value={customChemicalMw}
                        onChange={(e) => setCustomChemicalMw(e.target.value)}
                        placeholder="g/mol"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="density" className="text-right">
                        Density
                      </Label>
                      <Input
                        id="density"
                        value={customChemicalDensity}
                        onChange={(e) => setCustomChemicalDensity(e.target.value)}
                        placeholder="kg/m³"
                      />
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button onClick={handleAddCustomChemical}>Add Chemical</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-2">
            {/* Standard components */}
            <div className="border rounded p-2 bg-blue-50 cursor-pointer hover:bg-blue-100">
              Methane (CH₄)
            </div>
            <div className="border rounded p-2 bg-blue-50 cursor-pointer hover:bg-blue-100">
              Ethane (C₂H₆)
            </div>
            <div className="border rounded p-2 bg-blue-50 cursor-pointer hover:bg-blue-100">
              Propane (C₃H₈)
            </div>
            <div className="border rounded p-2 bg-blue-50 cursor-pointer hover:bg-blue-100">
              Water (H₂O)
            </div>
            
            {/* Custom chemicals */}
            {customChemicalsList.map(chemical => (
              <div 
                key={chemical.id} 
                className="border rounded p-2 bg-green-50 cursor-pointer hover:bg-green-100"
              >
                {chemical.name} ({chemical.formula})
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="border rounded p-2 bg-blue-50">Material Balance</div>
          <div className="border rounded p-2 bg-blue-50">Energy Balance</div>
          <div className="border rounded p-2 bg-blue-50">Equipment Design</div>
          <div className="border rounded p-2 bg-blue-50">Thermodynamics</div>
        </div>
        
        <Button 
          onClick={handleRunSimulation} 
          disabled={isSimulating}
          className="w-full"
        >
          {isSimulating ? "Simulating..." : "Run Simulation"}
        </Button>
        
        {results && (
          <div className="mt-4 border rounded-md p-4 bg-gray-50">
            <h5 className="font-medium mb-2">Simulation Results</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Outlet Temperature:</span>
                <div className="font-medium">{results.outletTemperature.toFixed(2)} °C</div>
              </div>
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Outlet Pressure:</span>
                <div className="font-medium">{results.outletPressure.toFixed(2)} kPa</div>
              </div>
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Conversion:</span>
                <div className="font-medium">{(results.conversion * 100).toFixed(2)}%</div>
              </div>
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Energy Usage:</span>
                <div className="font-medium">{results.energyUsage.toFixed(2)} kW</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </BaseSoftwareInterface>
  );
};

export default ProcessSimulationInterface;
