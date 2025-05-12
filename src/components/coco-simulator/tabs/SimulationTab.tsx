
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Download, PlayCircle, PlusCircle } from 'lucide-react';

interface SimulationTabProps {
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
  handleRunSimulation: () => void;
  setIsDialogOpen: (isOpen: boolean) => void;
}

const SimulationTab: React.FC<SimulationTabProps> = ({
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
  handleRunSimulation,
  setIsDialogOpen
}) => {
  return (
    <>
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
          <Button size="sm" variant="outline" className="flex items-center gap-1" onClick={() => setIsDialogOpen(true)}>
            <PlusCircle className="h-4 w-4" />
            Add Custom Chemical
          </Button>
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
      
      <div className="flex gap-4 mb-6">
        <Button 
          className="flex items-center gap-1"
          variant="outline"
        >
          <Upload className="h-4 w-4" />
          Import Flowsheet
        </Button>
        <Button 
          className="flex items-center gap-1"
          variant="outline"
        >
          <Download className="h-4 w-4" />
          Export Flowsheet
        </Button>
        <Button 
          className="flex items-center gap-1 ml-auto"
          onClick={handleRunSimulation} 
          disabled={isSimulating}
        >
          <PlayCircle className="h-4 w-4" />
          {isSimulating ? "Simulating..." : "Run Simulation"}
        </Button>
      </div>
      
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
    </>
  );
};

export default SimulationTab;
