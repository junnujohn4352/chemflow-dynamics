
import React, { useState } from 'react';
import { Software } from '@/types/software';
import BaseSoftwareInterface from './BaseSoftwareInterface';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface CFDInterfaceProps {
  software: Software;
}

const CFDInterface: React.FC<CFDInterfaceProps> = ({ software }) => {
  const [geometryType, setGeometryType] = useState<string>("pipe");
  const [modelType, setModelType] = useState<string>("k-epsilon");
  const [inletVelocity, setInletVelocity] = useState<number>(10);
  const [inletTemperature, setInletTemperature] = useState<number>(25);
  const [fluidViscosity, setFluidViscosity] = useState<number>(0.001);
  const [fluidDensity, setFluidDensity] = useState<number>(1000);
  const [meshDensity, setMeshDensity] = useState<number>(50);
  
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [simulationProgress, setSimulationProgress] = useState<number>(0);
  const [simulationStage, setSimulationStage] = useState<string>("");
  const [results, setResults] = useState<any>(null);
  
  const { toast } = useToast();

  const handleRunSimulation = () => {
    setIsRunning(true);
    setSimulationProgress(0);
    setSimulationStage("Initializing");
    setResults(null);
    
    const totalTime = 8000; // Total simulation time in ms
    const updateInterval = 200; // Update progress every 200ms
    const stages = [
      "Generating geometry",
      "Creating mesh",
      "Setting up physics",
      "Initializing solver",
      "Running simulation",
      "Processing results",
      "Finalizing"
    ];
    
    let currentStage = 0;
    let timer = 0;
    
    const interval = setInterval(() => {
      timer += updateInterval;
      const progress = Math.min(100, Math.floor((timer / totalTime) * 100));
      
      setSimulationProgress(progress);
      
      // Change stages at appropriate intervals
      if (progress > (currentStage + 1) * (100 / stages.length)) {
        currentStage = Math.min(currentStage + 1, stages.length - 1);
        setSimulationStage(stages[currentStage]);
      }
      
      if (progress >= 100) {
        clearInterval(interval);
        setIsRunning(false);
        
        // Generate results based on input values
        generateResults();
        
        toast({
          title: "Simulation Complete",
          description: "CFD analysis has been completed successfully.",
        });
      }
    }, updateInterval);
  };
  
  const generateResults = () => {
    // Reynolds number calculation
    let characteristic_length = 0.1; // Default characteristic length (m)
    if (geometryType === "pipe") {
      characteristic_length = 0.05; // Pipe diameter (m)
    } else if (geometryType === "channel") {
      characteristic_length = 0.2; // Channel width (m)
    }
    
    const reynolds = (fluidDensity * inletVelocity * characteristic_length) / fluidViscosity;
    const isLaminar = reynolds < 2300;
    const isTurbulent = reynolds > 4000;
    
    // Calculate pressure drop using correlations
    let frictionFactor;
    if (isLaminar) {
      frictionFactor = 64 / reynolds;
    } else {
      // Blasius correlation for turbulent flow
      frictionFactor = 0.316 * Math.pow(reynolds, -0.25);
    }
    
    const pressureDrop = frictionFactor * (1 / characteristic_length) * 0.5 * fluidDensity * Math.pow(inletVelocity, 2);
    
    // Calculate heat transfer (if temperature difference exists)
    const nusseltNumber = isTurbulent ? 
      0.023 * Math.pow(reynolds, 0.8) * Math.pow(0.7, 0.4) : // Dittus-Boelter for turbulent
      3.66; // Constant Nu for laminar flow in pipes
    
    const heatTransferCoeff = nusseltNumber * 0.6 / characteristic_length; // W/(m²·K)
    
    const shearStress = frictionFactor * 0.5 * fluidDensity * Math.pow(inletVelocity, 2);
    
    // Generate cross-sectional velocity profile
    const velocityProfile: {position: number, velocity: number}[] = [];
    if (isLaminar && geometryType === "pipe") {
      // Parabolic profile for laminar pipe flow
      for (let i = 0; i <= 10; i++) {
        const r = i / 10; // Normalized radius
        const velocity = inletVelocity * 2 * (1 - r * r); // Poiseuille flow
        velocityProfile.push({ position: r, velocity });
      }
    } else {
      // Power-law profile for turbulent flow
      const n = 7; // Power-law exponent
      for (let i = 0; i <= 10; i++) {
        const r = i / 10; // Normalized position
        const velocity = inletVelocity * Math.pow(1 - r, 1/n);
        velocityProfile.push({ position: r, velocity });
      }
    }
    
    const simResults = {
      meshElements: Math.floor((30000 * meshDensity) / 50),
      iterations: Math.floor(200 + (meshDensity / 10) * 100),
      convergenceResidual: (0.00001 * 50 / meshDensity).toExponential(2),
      reynoldsNumber: reynolds.toFixed(0),
      flowRegime: isLaminar ? "Laminar" : isTurbulent ? "Turbulent" : "Transitional",
      maxVelocity: (inletVelocity * (isLaminar ? 2 : 1.2)).toFixed(2),
      pressureDrop: pressureDrop.toFixed(2),
      shearStress: shearStress.toFixed(4),
      frictionFactor: frictionFactor.toFixed(5),
      heatTransferCoefficient: heatTransferCoeff.toFixed(2),
      turbulenceIntensity: (0.16 * Math.pow(reynolds, -0.125)).toFixed(4),
      velocityProfile
    };
    
    setResults(simResults);
  };

  return (
    <BaseSoftwareInterface software={software}>
      <div className="mt-4 border-t pt-4">
        <h5 className="font-medium mb-2">CFD Simulation Controls</h5>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="geometryType">Geometry Type</Label>
            <Select value={geometryType} onValueChange={setGeometryType}>
              <SelectTrigger id="geometryType">
                <SelectValue placeholder="Select geometry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pipe">Pipe Flow</SelectItem>
                <SelectItem value="channel">Channel Flow</SelectItem>
                <SelectItem value="cavity">Lid-Driven Cavity</SelectItem>
                <SelectItem value="backward-step">Backward Facing Step</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="modelType">Turbulence Model</Label>
            <Select value={modelType} onValueChange={setModelType}>
              <SelectTrigger id="modelType">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="k-epsilon">k-ε Standard</SelectItem>
                <SelectItem value="k-omega">k-ω SST</SelectItem>
                <SelectItem value="spalart-allmaras">Spalart-Allmaras</SelectItem>
                <SelectItem value="laminar">Laminar (No Turbulence)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="inletVelocity">Inlet Velocity (m/s)</Label>
            <Input 
              id="inletVelocity" 
              type="number" 
              value={inletVelocity} 
              onChange={(e) => setInletVelocity(Number(e.target.value))} 
              step="0.1"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="inletTemperature">Temperature (°C)</Label>
            <Input 
              id="inletTemperature" 
              type="number" 
              value={inletTemperature} 
              onChange={(e) => setInletTemperature(Number(e.target.value))} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fluidViscosity">Viscosity (Pa·s)</Label>
            <Input 
              id="fluidViscosity" 
              type="number" 
              value={fluidViscosity} 
              onChange={(e) => setFluidViscosity(Number(e.target.value))} 
              step="0.0001"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fluidDensity">Density (kg/m³)</Label>
            <Input 
              id="fluidDensity" 
              type="number" 
              value={fluidDensity} 
              onChange={(e) => setFluidDensity(Number(e.target.value))} 
              step="1"
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="meshDensity">Mesh Density: {meshDensity}</Label>
            <Input 
              id="meshDensity"
              type="range"
              min="10"
              max="100"
              value={meshDensity} 
              onChange={(e) => setMeshDensity(Number(e.target.value))}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Coarse (Faster)</span>
              <span>Fine (Accurate)</span>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={handleRunSimulation}
          disabled={isRunning}
          className="w-full mb-4"
        >
          {isRunning ? "Running Simulation..." : "Run CFD Simulation"}
        </Button>
        
        {isRunning && (
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span>{simulationStage}</span>
              <span>{simulationProgress}%</span>
            </div>
            <Progress value={simulationProgress} className="h-2" />
          </div>
        )}
        
        {results && (
          <div className="border rounded-md p-4 bg-gray-50">
            <h5 className="font-medium mb-2">Simulation Results</h5>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Mesh Elements:</span>
                <div className="font-medium">{results.meshElements.toLocaleString()}</div>
              </div>
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Iterations:</span>
                <div className="font-medium">{results.iterations}</div>
              </div>
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Reynolds Number:</span>
                <div className="font-medium">{results.reynoldsNumber}</div>
              </div>
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Flow Regime:</span>
                <div className="font-medium">{results.flowRegime}</div>
              </div>
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Pressure Drop (Pa):</span>
                <div className="font-medium">{results.pressureDrop}</div>
              </div>
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Maximum Velocity (m/s):</span>
                <div className="font-medium">{results.maxVelocity}</div>
              </div>
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Shear Stress (Pa):</span>
                <div className="font-medium">{results.shearStress}</div>
              </div>
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Heat Transfer (W/m²·K):</span>
                <div className="font-medium">{results.heatTransferCoefficient}</div>
              </div>
            </div>
            
            <h6 className="font-medium text-sm mb-2">Velocity Profile</h6>
            <div className="relative h-32 bg-gray-100 border rounded p-2">
              <div className="absolute inset-0">
                {results.velocityProfile.map((point, i) => {
                  const prevPoint = i > 0 ? results.velocityProfile[i-1] : null;
                  if (!prevPoint) return null;
                  
                  return (
                    <svg key={i} className="absolute top-0 left-0 w-full h-full" style={{overflow: 'visible'}}>
                      <line 
                        x1={`${prevPoint.position * 100}%`} 
                        y1={`${100 - (prevPoint.velocity / results.maxVelocity) * 100}%`} 
                        x2={`${point.position * 100}%`} 
                        y2={`${100 - (point.velocity / results.maxVelocity) * 100}%`} 
                        stroke="blue" 
                        strokeWidth="2"
                      />
                    </svg>
                  );
                })}
              </div>
              
              {/* Axis labels */}
              <div className="absolute bottom-0 left-0 text-xs text-gray-500">0</div>
              <div className="absolute bottom-0 right-0 text-xs text-gray-500">r/R</div>
              <div className="absolute top-0 left-1 text-xs text-gray-500">V</div>
              <div className="absolute bottom-0 left-1 text-xs text-gray-500">0</div>
            </div>
          </div>
        )}
      </div>
    </BaseSoftwareInterface>
  );
};

export default CFDInterface;
