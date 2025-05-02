
import React, { useState } from 'react';
import { Software } from '@/types/software';
import BaseSoftwareInterface from './BaseSoftwareInterface';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';

interface EnvironmentalSafetyInterfaceProps {
  software: Software;
}

const EnvironmentalSafetyInterface: React.FC<EnvironmentalSafetyInterfaceProps> = ({ software }) => {
  const [analysisType, setAnalysisType] = useState<string>("relief-valve");
  const [pressure, setPressure] = useState<number>(10);
  const [temperature, setTemperature] = useState<number>(200);
  const [flowRate, setFlowRate] = useState<number>(500);
  const [molecularWeight, setMolecularWeight] = useState<number>(18);
  const [compressibility, setCompressibility] = useState<number>(0.95);
  const [dischargePressure, setDischargePressure] = useState<number>(1.013);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [results, setResults] = useState<Record<string, string | number> | null>(null);
  const { toast } = useToast();

  const handleCalculate = () => {
    setIsCalculating(true);
    setResults(null);
    
    setTimeout(() => {
      let calculationResults: Record<string, string | number> = {};
      
      if (analysisType === "relief-valve") {
        // Relief valve sizing calculations
        const k = 1.4; // Specific heat ratio (approx. for air)
        const Z = compressibility; // Compressibility factor
        const criticalPressureRatio = Math.pow((2 / (k + 1)), (k / (k - 1)));
        const isCriticalFlow = (dischargePressure / pressure) < criticalPressureRatio;
        
        // Convert pressure to absolute (bara)
        const P1 = pressure;
        const P2 = dischargePressure;
        
        let requiredArea, massFlowRate, estimatedSize;
        
        if (isCriticalFlow) {
          // Critical (choked) flow
          massFlowRate = flowRate;
          const C = 520; // Discharge coefficient constant for gas
          requiredArea = (massFlowRate) / (C * P1 * Math.sqrt((k * molecularWeight) / (Z * (temperature + 273.15))));
        } else {
          // Sub-critical flow
          massFlowRate = flowRate;
          const C = 520; // Discharge coefficient constant for gas
          requiredArea = (massFlowRate) / (C * P1 * Math.sqrt((k * molecularWeight * (Math.pow(P2/P1, 2/k) - Math.pow(P2/P1, (k+1)/k))) / (Z * (temperature + 273.15) * (1 - P2/P1))));
        }
        
        const standardSizes = [71, 126, 198, 285, 415, 645, 1045, 1520, 2265, 3320, 4750];
        estimatedSize = standardSizes.find(size => size > (requiredArea * 1000)) || standardSizes[standardSizes.length - 1];
        
        calculationResults = {
          requiredArea: (requiredArea * 1000).toFixed(2),
          flowRegime: isCriticalFlow ? "Critical (Choked) Flow" : "Sub-critical Flow",
          recommendedArea: estimatedSize,
          massFlowrate: massFlowRate.toFixed(2),
          criticalPressureRatio: criticalPressureRatio.toFixed(3),
          actualPressureRatio: (P2 / P1).toFixed(3),
          dischargeCoefficient: "0.975",
          backPressureCorrection: isCriticalFlow ? "1.0" : (0.85 - 0.15 * (P2 / P1)).toFixed(3),
        };
      } else if (analysisType === "emission") {
        // Simple emission calculation
        const annualEmission = flowRate * 24 * 365 * 0.001; // t/year
        const carbonEquivalent = annualEmission * 2.5; // Simplified CO2 equivalent
        
        calculationResults = {
          annualEmission: annualEmission.toFixed(2),
          carbonEquivalent: carbonEquivalent.toFixed(2),
          regulatoryThreshold: "10,000.00",
          complianceStatus: annualEmission > 10000 ? "Non-Compliant" : "Compliant",
          mitigationRequired: annualEmission > 10000 ? "Yes" : "No",
          emissionIntensity: (annualEmission / (flowRate * 0.1)).toFixed(3),
          recommendedAction: annualEmission > 10000 ? "Implement emission reduction plan" : "Continue monitoring"
        };
      } else if (analysisType === "fire-explosion") {
        // Fire and explosion analysis
        const tnt = flowRate * 0.1 * 0.03; // TNT equivalent
        const fireball = 6.14 * Math.pow(tnt, 0.325); // Fireball radius
        const overpressure = 2068 * Math.pow((tnt / 100), 0.33) / 100;
        
        calculationResults = {
          tntEquivalent: tnt.toFixed(2),
          fireballRadius: fireball.toFixed(2),
          overpressure: overpressure.toFixed(2),
          hazardRadius: (fireball * 2.5).toFixed(2),
          evacuationZone: (fireball * 4).toFixed(2),
          damagePotential: tnt > 500 ? "High" : tnt > 100 ? "Medium" : "Low",
          structuralDamage: overpressure > 6.9 ? "Severe" : overpressure > 3.4 ? "Moderate" : "Minor",
          personalInjury: tnt > 200 ? "High Risk" : "Moderate Risk"
        };
      }
      
      setResults(calculationResults);
      setIsCalculating(false);
      
      toast({
        title: "Safety Analysis Complete",
        description: `${analysisType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} analysis completed.`,
      });
    }, 1800);
  };

  const renderAnalysisInputs = () => {
    switch (analysisType) {
      case "relief-valve":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="pressure">Design Pressure (bara)</Label>
              <Input 
                id="pressure" 
                type="number" 
                value={pressure} 
                onChange={(e) => setPressure(Number(e.target.value))} 
                step="0.1"
              />
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
              <Label htmlFor="flowRate">Required Flow (kg/h)</Label>
              <Input 
                id="flowRate" 
                type="number" 
                value={flowRate} 
                onChange={(e) => setFlowRate(Number(e.target.value))} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="molecularWeight">Molecular Weight (g/mol)</Label>
              <Input 
                id="molecularWeight" 
                type="number" 
                value={molecularWeight} 
                onChange={(e) => setMolecularWeight(Number(e.target.value))} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="compressibility">Compressibility Factor</Label>
              <Input 
                id="compressibility" 
                type="number" 
                value={compressibility} 
                onChange={(e) => setCompressibility(Number(e.target.value))} 
                step="0.01"
                min="0.1"
                max="1"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dischargePressure">Back Pressure (bara)</Label>
              <Input 
                id="dischargePressure" 
                type="number" 
                value={dischargePressure} 
                onChange={(e) => setDischargePressure(Number(e.target.value))} 
                step="0.1"
              />
            </div>
          </>
        );
        
      case "emission":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="flowRate">Emission Rate (kg/h)</Label>
              <Input 
                id="flowRate" 
                type="number" 
                value={flowRate} 
                onChange={(e) => setFlowRate(Number(e.target.value))} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="molecularWeight">Molecular Weight (g/mol)</Label>
              <Input 
                id="molecularWeight" 
                type="number" 
                value={molecularWeight} 
                onChange={(e) => setMolecularWeight(Number(e.target.value))} 
              />
            </div>
          </>
        );
        
      case "fire-explosion":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="pressure">Operating Pressure (bara)</Label>
              <Input 
                id="pressure" 
                type="number" 
                value={pressure} 
                onChange={(e) => setPressure(Number(e.target.value))} 
                step="0.1"
              />
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
              <Label htmlFor="flowRate">Inventory (kg)</Label>
              <Input 
                id="flowRate" 
                type="number" 
                value={flowRate} 
                onChange={(e) => setFlowRate(Number(e.target.value))} 
              />
            </div>
          </>
        );
        
      default:
        return null;
    }
  };

  const renderResults = () => {
    if (!results) return null;
    
    return (
      <div className="border rounded-md p-4 bg-gray-50">
        <h5 className="font-medium mb-2">Analysis Results</h5>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(results).map(([key, value]) => (
            <div key={key} className="border rounded p-2">
              <span className="text-gray-600 text-sm">
                {key.replace(/([A-Z])/g, ' $1')
                    .replace(/^./, str => str.toUpperCase())
                    .replace(/([a-z])([A-Z])/g, '$1 $2')}:
              </span>
              <div className="font-medium">{String(value)}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <BaseSoftwareInterface software={software}>
      <div className="mt-4 border-t pt-4">
        <h5 className="font-medium mb-2">Environmental & Safety Analysis Tools</h5>
        
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="analysisType">Analysis Type</Label>
            <Select value={analysisType} onValueChange={setAnalysisType}>
              <SelectTrigger id="analysisType">
                <SelectValue placeholder="Select analysis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relief-valve">Relief Valve Sizing</SelectItem>
                <SelectItem value="emission">Emission Modeling</SelectItem>
                <SelectItem value="fire-explosion">Fire & Explosion Analysis</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderAnalysisInputs()}
          </div>
        </div>
        
        <Button 
          onClick={handleCalculate}
          disabled={isCalculating}
          className="w-full mb-4"
        >
          {isCalculating ? "Analyzing..." : "Run Analysis"}
        </Button>
        
        {renderResults()}
      </div>
    </BaseSoftwareInterface>
  );
};

export default EnvironmentalSafetyInterface;
