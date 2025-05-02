
import React, { useState } from 'react';
import { Software } from '@/types/software';
import BaseSoftwareInterface from './BaseSoftwareInterface';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface ReactionEngineeringInterfaceProps {
  software: Software;
}

const ReactionEngineeringInterface: React.FC<ReactionEngineeringInterfaceProps> = ({ software }) => {
  const [reactionType, setReactionType] = useState<string>("first-order");
  const [reactorType, setReactorType] = useState<string>("cstr");
  const [temperature, setTemperature] = useState<number>(80);
  const [pressure, setPressure] = useState<number>(200);
  const [feedConcentration, setFeedConcentration] = useState<number>(2);
  const [residenceTime, setResidenceTime] = useState<number>(10);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [reactionResults, setReactionResults] = useState<any>(null);
  const { toast } = useToast();

  const handleCalculate = () => {
    setIsCalculating(true);
    setReactionResults(null);
    
    setTimeout(() => {
      // Generate simulated reaction engineering results
      const activationEnergy = 55 + Math.random() * 10; // kJ/mol
      const preExpFactor = 1E9 + Math.random() * 1E9; 
      const k = preExpFactor * Math.exp(-activationEnergy * 1000 / (8.314 * (temperature + 273.15)));
      
      let conversion;
      if (reactorType === "cstr") {
        // CSTR conversion calculation (simplified)
        conversion = (k * residenceTime) / (1 + k * residenceTime);
      } else {
        // PFR conversion calculation (simplified)
        conversion = 1 - Math.exp(-k * residenceTime);
      }
      
      // Limit to reasonable values
      conversion = Math.min(0.98, Math.max(0.1, conversion));
      
      const results = {
        conversion: conversion.toFixed(4),
        selectivity: (0.8 + Math.random() * 0.15).toFixed(4),
        yield: (conversion * (0.8 + Math.random() * 0.15)).toFixed(4),
        reactionRate: (k * feedConcentration * (1 - conversion)).toFixed(6),
        kineticConstant: k.toExponential(3),
        activationEnergy: activationEnergy.toFixed(2),
        gibbs: (-15 - Math.random() * 10).toFixed(2),
        heatOfReaction: (-30 - Math.random() * 20).toFixed(2)
      };
      
      setReactionResults(results);
      setIsCalculating(false);
      
      toast({
        title: "Reaction Analysis Complete",
        description: `Results calculated for ${reactorType.toUpperCase()} with ${reactionType} kinetics.`,
      });
    }, 1800);
  };

  return (
    <BaseSoftwareInterface software={software}>
      <div className="mt-4 border-t pt-4">
        <h5 className="font-medium mb-2">Reaction Engineering Calculator</h5>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="reactionType">Reaction Kinetics</Label>
            <Select value={reactionType} onValueChange={setReactionType}>
              <SelectTrigger id="reactionType">
                <SelectValue placeholder="Select kinetics" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="first-order">First Order</SelectItem>
                <SelectItem value="second-order">Second Order</SelectItem>
                <SelectItem value="zero-order">Zero Order</SelectItem>
                <SelectItem value="michaelis-menten">Michaelis-Menten</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reactorType">Reactor Type</Label>
            <Select value={reactorType} onValueChange={setReactorType}>
              <SelectTrigger id="reactorType">
                <SelectValue placeholder="Select reactor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cstr">CSTR</SelectItem>
                <SelectItem value="pfr">PFR</SelectItem>
                <SelectItem value="batch">Batch</SelectItem>
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
          
          <div className="space-y-2">
            <Label htmlFor="pressure">Pressure (kPa)</Label>
            <Input 
              id="pressure" 
              type="number" 
              value={pressure} 
              onChange={(e) => setPressure(Number(e.target.value))} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="feedConcentration">Feed Concentration (mol/L)</Label>
            <Input 
              id="feedConcentration" 
              type="number" 
              value={feedConcentration} 
              onChange={(e) => setFeedConcentration(Number(e.target.value))} 
              step="0.1"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="residenceTime">Residence Time (min)</Label>
            <Input 
              id="residenceTime" 
              type="number" 
              value={residenceTime} 
              onChange={(e) => setResidenceTime(Number(e.target.value))} 
            />
          </div>
        </div>
        
        <Button 
          onClick={handleCalculate}
          disabled={isCalculating}
          className="w-full mb-4"
        >
          {isCalculating ? "Calculating..." : "Calculate Reaction"}
        </Button>
        
        {reactionResults && (
          <div className="border rounded-md p-4 bg-gray-50">
            <h5 className="font-medium mb-2">Reaction Results</h5>
            <div className="grid grid-cols-2 gap-3">
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Conversion:</span>
                <div className="font-medium">{(Number(reactionResults.conversion) * 100).toFixed(2)}%</div>
              </div>
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Selectivity:</span>
                <div className="font-medium">{(Number(reactionResults.selectivity) * 100).toFixed(2)}%</div>
              </div>
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Yield:</span>
                <div className="font-medium">{(Number(reactionResults.yield) * 100).toFixed(2)}%</div>
              </div>
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Reaction Rate (mol/L·s):</span>
                <div className="font-medium">{reactionResults.reactionRate}</div>
              </div>
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Rate Constant (k):</span>
                <div className="font-medium">{reactionResults.kineticConstant}</div>
              </div>
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Activation Energy (kJ/mol):</span>
                <div className="font-medium">{reactionResults.activationEnergy}</div>
              </div>
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Gibbs Energy (kJ/mol):</span>
                <div className="font-medium">{reactionResults.gibbs}</div>
              </div>
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Heat of Reaction (kJ/mol):</span>
                <div className="font-medium">{reactionResults.heatOfReaction}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </BaseSoftwareInterface>
  );
};

export default ReactionEngineeringInterface;
