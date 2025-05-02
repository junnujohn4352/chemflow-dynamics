
import React, { useState } from 'react';
import { Software } from '@/types/software';
import BaseSoftwareInterface from './BaseSoftwareInterface';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

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
