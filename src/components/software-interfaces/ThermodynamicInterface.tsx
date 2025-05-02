
import React, { useState } from 'react';
import { Software } from '@/types/software';
import BaseSoftwareInterface from './BaseSoftwareInterface';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface ThermodynamicInterfaceProps {
  software: Software;
}

const ThermodynamicInterface: React.FC<ThermodynamicInterfaceProps> = ({ software }) => {
  const [compound, setCompound] = useState<string>("methane");
  const [temperature, setTemperature] = useState<number>(25);
  const [pressure, setPressure] = useState<number>(101.325);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [propertyResults, setPropertyResults] = useState<any>(null);
  const { toast } = useToast();

  const handleCalculate = () => {
    setIsCalculating(true);
    setPropertyResults(null);
    
    setTimeout(() => {
      // Generate simulated thermodynamic property results
      const results = {
        density: (0.6 + Math.random() * 0.2).toFixed(4),
        heatCapacity: (2.1 + Math.random() * 0.5).toFixed(4),
        thermalConductivity: (0.03 + Math.random() * 0.01).toFixed(4),
        viscosity: (0.01 + Math.random() * 0.005).toFixed(5),
        enthalpy: (-50 - Math.random() * 20).toFixed(2),
        entropy: (180 + Math.random() * 40).toFixed(2)
      };
      
      setPropertyResults(results);
      setIsCalculating(false);
      
      toast({
        title: "Properties Calculated",
        description: `Thermodynamic properties for ${compound} calculated at specified conditions.`,
      });
    }, 1500);
  };

  return (
    <BaseSoftwareInterface software={software}>
      <div className="mt-4 border-t pt-4">
        <h5 className="font-medium mb-2">Thermodynamic Properties Calculator</h5>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="compound">Compound</Label>
            <Select value={compound} onValueChange={setCompound}>
              <SelectTrigger id="compound">
                <SelectValue placeholder="Select compound" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="methane">Methane</SelectItem>
                <SelectItem value="ethane">Ethane</SelectItem>
                <SelectItem value="propane">Propane</SelectItem>
                <SelectItem value="water">Water</SelectItem>
                <SelectItem value="nitrogen">Nitrogen</SelectItem>
                <SelectItem value="oxygen">Oxygen</SelectItem>
                <SelectItem value="carbon_dioxide">Carbon Dioxide</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="temperature">Temperature (°C)</Label>
            <Input 
              id="temperature" 
              type="number" 
              value={temperature} 
              onChange={(e) => setTemperature(Number(e.target.value))} 
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="pressure">Pressure (kPa)</Label>
            <Input 
              id="pressure" 
              type="number" 
              value={pressure} 
              onChange={(e) => setPressure(Number(e.target.value))} 
            />
          </div>
        </div>
        
        <Button 
          onClick={handleCalculate}
          disabled={isCalculating}
          className="w-full mb-4"
        >
          {isCalculating ? "Calculating..." : "Calculate Properties"}
        </Button>
        
        {propertyResults && (
          <div className="border rounded-md p-4 bg-gray-50">
            <h5 className="font-medium mb-2">Property Results</h5>
            <div className="grid grid-cols-2 gap-3">
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Density (g/cm³):</span>
                <div className="font-medium">{propertyResults.density}</div>
              </div>
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Heat Capacity (kJ/kg·K):</span>
                <div className="font-medium">{propertyResults.heatCapacity}</div>
              </div>
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Thermal Conductivity (W/m·K):</span>
                <div className="font-medium">{propertyResults.thermalConductivity}</div>
              </div>
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Viscosity (Pa·s):</span>
                <div className="font-medium">{propertyResults.viscosity}</div>
              </div>
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Enthalpy (kJ/mol):</span>
                <div className="font-medium">{propertyResults.enthalpy}</div>
              </div>
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Entropy (J/mol·K):</span>
                <div className="font-medium">{propertyResults.entropy}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </BaseSoftwareInterface>
  );
};

export default ThermodynamicInterface;
