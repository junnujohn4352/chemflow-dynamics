
import React, { useState } from 'react';
import { Software } from '@/types/software';
import BaseSoftwareInterface from './BaseSoftwareInterface';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface PipingDesignInterfaceProps {
  software: Software;
}

const PipingDesignInterface: React.FC<PipingDesignInterfaceProps> = ({ software }) => {
  const [fluidType, setFluidType] = useState<string>("water");
  const [flowRate, setFlowRate] = useState<number>(10);
  const [pipeLength, setPipeLength] = useState<number>(100);
  const [pipeDiameter, setPipeDiameter] = useState<number>(0.05);
  const [pipeRoughness, setPipeRoughness] = useState<number>(0.000045);
  const [elevationChange, setElevationChange] = useState<number>(0);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const handleCalculate = () => {
    setIsCalculating(true);
    setResults(null);
    
    setTimeout(() => {
      // Basic pipe flow calculations
      // Constants for water at 20°C
      const density = fluidType === 'water' ? 998 : 850; // kg/m³
      const viscosity = fluidType === 'water' ? 0.001 : 0.03; // Pa·s
      
      // Calculate pipe cross-sectional area
      const area = Math.PI * Math.pow(pipeDiameter, 2) / 4; // m²
      
      // Calculate flow velocity
      const flowRateM3s = flowRate / 3600; // convert from m³/h to m³/s
      const velocity = flowRateM3s / area; // m/s
      
      // Calculate Reynolds number
      const reynolds = (density * velocity * pipeDiameter) / viscosity;
      
      // Calculate friction factor (Colebrook equation simplified)
      let frictionFactor;
      if (reynolds < 2300) {
        // Laminar flow
        frictionFactor = 64 / reynolds;
      } else {
        // Turbulent flow (simplified Colebrook approximation)
        const relativeRoughness = pipeRoughness / pipeDiameter;
        frictionFactor = 0.25 / Math.pow(Math.log10(relativeRoughness/3.7 + 5.74/Math.pow(reynolds, 0.9)), 2);
      }
      
      // Calculate head loss due to friction (Darcy-Weisbach)
      const headLossFriction = frictionFactor * (pipeLength / pipeDiameter) * (Math.pow(velocity, 2) / (2 * 9.81));
      
      // Calculate head loss due to elevation change
      const headLossElevation = elevationChange;
      
      // Total head loss
      const totalHeadLoss = headLossFriction + headLossElevation;
      
      // Calculate pressure drop
      const pressureDrop = totalHeadLoss * density * 9.81 / 1000; // kPa
      
      // Calculate pump power required
      const pumpPowerRequired = (pressureDrop * 1000) * flowRateM3s / 1000; // kW
      
      const results = {
        velocity: velocity.toFixed(2),
        reynolds: reynolds.toFixed(0),
        flowRegime: reynolds < 2300 ? 'Laminar' : reynolds < 4000 ? 'Transitional' : 'Turbulent',
        frictionFactor: frictionFactor.toFixed(5),
        headLossFriction: headLossFriction.toFixed(2),
        headLossElevation: headLossElevation.toFixed(2),
        totalHeadLoss: totalHeadLoss.toFixed(2),
        pressureDrop: pressureDrop.toFixed(2),
        pumpPowerRequired: pumpPowerRequired.toFixed(3)
      };
      
      setResults(results);
      setIsCalculating(false);
      
      toast({
        title: "Calculation Complete",
        description: "Pipe flow calculations have been completed successfully.",
      });
    }, 1500);
  };

  return (
    <BaseSoftwareInterface software={software}>
      <div className="mt-4 border-t pt-4">
        <h5 className="font-medium mb-2">Pipe Flow Calculator</h5>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="fluidType">Fluid Type</Label>
            <Select value={fluidType} onValueChange={setFluidType}>
              <SelectTrigger id="fluidType">
                <SelectValue placeholder="Select fluid" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="water">Water</SelectItem>
                <SelectItem value="oil">Oil</SelectItem>
                <SelectItem value="gas">Natural Gas</SelectItem>
                <SelectItem value="steam">Steam</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="flowRate">Flow Rate (m³/h)</Label>
            <Input 
              id="flowRate" 
              type="number" 
              value={flowRate} 
              onChange={(e) => setFlowRate(Number(e.target.value))} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pipeLength">Pipe Length (m)</Label>
            <Input 
              id="pipeLength" 
              type="number" 
              value={pipeLength} 
              onChange={(e) => setPipeLength(Number(e.target.value))} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pipeDiameter">Pipe Diameter (m)</Label>
            <Input 
              id="pipeDiameter" 
              type="number" 
              value={pipeDiameter} 
              onChange={(e) => setPipeDiameter(Number(e.target.value))} 
              step="0.001"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pipeRoughness">Pipe Roughness (m)</Label>
            <Input 
              id="pipeRoughness" 
              type="number" 
              value={pipeRoughness} 
              onChange={(e) => setPipeRoughness(Number(e.target.value))} 
              step="0.000001"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="elevationChange">Elevation Change (m)</Label>
            <Input 
              id="elevationChange" 
              type="number" 
              value={elevationChange} 
              onChange={(e) => setElevationChange(Number(e.target.value))} 
            />
          </div>
        </div>
        
        <Button 
          onClick={handleCalculate}
          disabled={isCalculating}
          className="w-full mb-4"
        >
          {isCalculating ? "Calculating..." : "Calculate Flow"}
        </Button>
        
        {results && (
          <div className="border rounded-md p-4 bg-gray-50">
            <h5 className="font-medium mb-2">Flow Results</h5>
            <div className="grid grid-cols-2 gap-3">
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Flow Velocity:</span>
                <div className="font-medium">{results.velocity} m/s</div>
              </div>
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Reynolds Number:</span>
                <div className="font-medium">{results.reynolds}</div>
              </div>
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Flow Regime:</span>
                <div className="font-medium">{results.flowRegime}</div>
              </div>
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Friction Factor:</span>
                <div className="font-medium">{results.frictionFactor}</div>
              </div>
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Friction Head Loss:</span>
                <div className="font-medium">{results.headLossFriction} m</div>
              </div>
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Elevation Head:</span>
                <div className="font-medium">{results.headLossElevation} m</div>
              </div>
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Total Head Loss:</span>
                <div className="font-medium">{results.totalHeadLoss} m</div>
              </div>
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Pressure Drop:</span>
                <div className="font-medium">{results.pressureDrop} kPa</div>
              </div>
              <div className="border rounded p-2 md:col-span-2">
                <span className="text-gray-600 text-sm">Pump Power Required:</span>
                <div className="font-medium">{results.pumpPowerRequired} kW</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </BaseSoftwareInterface>
  );
};

export default PipingDesignInterface;
