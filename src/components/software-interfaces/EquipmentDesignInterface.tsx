
import React, { useState } from 'react';
import { Software } from '@/types/software';
import BaseSoftwareInterface from './BaseSoftwareInterface';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

interface EquipmentDesignInterfaceProps {
  software: Software;
}

const EquipmentDesignInterface: React.FC<EquipmentDesignInterfaceProps> = ({ software }) => {
  const [equipmentType, setEquipmentType] = useState<string>("heat-exchanger");
  const [flowRate, setFlowRate] = useState<number>(1000);
  const [hotInletTemp, setHotInletTemp] = useState<number>(150);
  const [hotOutletTemp, setHotOutletTemp] = useState<number>(80);
  const [coldInletTemp, setColdInletTemp] = useState<number>(25);
  const [coldOutletTemp, setColdOutletTemp] = useState<number>(70);
  const [isDesigning, setIsDesigning] = useState<boolean>(false);
  const [designResults, setDesignResults] = useState<any>(null);
  const [problemDescription, setProblemDescription] = useState<string>("");
  const { toast } = useToast();

  // Generate equipment parameters based on problem description
  const handleProblemAnalysis = () => {
    if (!problemDescription) {
      toast({
        title: "Please enter a problem description",
        description: "A problem description is needed to generate appropriate parameters.",
        variant: "destructive"
      });
      return;
    }

    // This would normally involve AI or a more sophisticated algorithm
    // For now, we'll use some simple rules to determine optimization parameters
    const lowerCaseProblem = problemDescription.toLowerCase();
    
    // Adjust parameters based on keywords in the problem description
    if (lowerCaseProblem.includes("high temperature")) {
      setHotInletTemp(200);
      setHotOutletTemp(120);
      setColdOutletTemp(100);
    } else if (lowerCaseProblem.includes("energy efficiency") || lowerCaseProblem.includes("energy saving")) {
      setHotOutletTemp(50); // Lower exit temp for better heat recovery
    } else if (lowerCaseProblem.includes("cooling")) {
      setColdInletTemp(10);
      setColdOutletTemp(30);
    } else if (lowerCaseProblem.includes("flow rate") || lowerCaseProblem.includes("high flow")) {
      setFlowRate(2000);
    }

    toast({
      title: "Problem Analyzed",
      description: "Parameters have been adjusted based on your problem description.",
    });
  };

  const handleDesign = () => {
    setIsDesigning(true);
    setDesignResults(null);
    
    setTimeout(() => {
      // Generate simulated equipment design results
      const lmtd = ((hotInletTemp - coldOutletTemp) - (hotOutletTemp - coldInletTemp)) / 
                  Math.log((hotInletTemp - coldOutletTemp) / (hotOutletTemp - coldInletTemp));
      
      const duty = flowRate * 4.18 * (coldOutletTemp - coldInletTemp);
      const area = duty / (500 * lmtd);
      
      const results = {
        heatDuty: duty.toFixed(2),
        area: area.toFixed(2),
        uValue: (450 + Math.random() * 100).toFixed(2),
        lmtd: lmtd.toFixed(2),
        tubeLength: (Math.sqrt(area) * 10 + Math.random() * 5).toFixed(2),
        tubeCount: Math.ceil(area / 0.05),
        shellDiameter: (Math.sqrt(area) * 3 + Math.random() * 2).toFixed(2),
        pressureDrop: (0.5 + Math.random() * 0.3).toFixed(3)
      };
      
      setDesignResults(results);
      setIsDesigning(false);
      
      toast({
        title: "Design Complete",
        description: `${equipmentType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} design calculations finished.`,
      });
    }, 2000);
  };

  return (
    <BaseSoftwareInterface software={software}>
      <div className="mt-4 border-t pt-4">
        <h5 className="font-medium mb-4">Equipment Design Tool</h5>
        
        <div className="space-y-4 mb-6 border p-4 rounded-lg bg-gray-50">
          <h6 className="font-medium">Problem Description</h6>
          <div className="space-y-2">
            <Label htmlFor="problemDescription">Describe the problem you're trying to solve</Label>
            <Textarea 
              id="problemDescription" 
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              placeholder="E.g., Design a heat exchanger for cooling process water from 80°C to 40°C using cooling water that enters at 25°C..."
              className="min-h-[100px]"
            />
            <Button 
              onClick={handleProblemAnalysis}
              variant="secondary"
              className="w-full"
            >
              Analyze Problem & Generate Parameters
            </Button>
          </div>
        </div>
        
        <div className="space-y-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="equipmentType">Equipment Type</Label>
            <Select value={equipmentType} onValueChange={setEquipmentType}>
              <SelectTrigger id="equipmentType">
                <SelectValue placeholder="Select equipment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="heat-exchanger">Heat Exchanger</SelectItem>
                <SelectItem value="distillation-column">Distillation Column</SelectItem>
                <SelectItem value="reactor">Reactor</SelectItem>
                <SelectItem value="pump">Pump</SelectItem>
                <SelectItem value="compressor">Compressor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="flowRate">Flow Rate (kg/h)</Label>
              <Input 
                id="flowRate" 
                type="number" 
                value={flowRate} 
                onChange={(e) => setFlowRate(Number(e.target.value))} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hotInletTemp">Hot Side Inlet Temp (°C)</Label>
              <Input 
                id="hotInletTemp" 
                type="number" 
                value={hotInletTemp} 
                onChange={(e) => setHotInletTemp(Number(e.target.value))} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hotOutletTemp">Hot Side Outlet Temp (°C)</Label>
              <Input 
                id="hotOutletTemp" 
                type="number" 
                value={hotOutletTemp} 
                onChange={(e) => setHotOutletTemp(Number(e.target.value))} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="coldInletTemp">Cold Side Inlet Temp (°C)</Label>
              <Input 
                id="coldInletTemp" 
                type="number" 
                value={coldInletTemp} 
                onChange={(e) => setColdInletTemp(Number(e.target.value))} 
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="coldOutletTemp">Cold Side Outlet Temp (°C)</Label>
              <Input 
                id="coldOutletTemp" 
                type="number" 
                value={coldOutletTemp} 
                onChange={(e) => setColdOutletTemp(Number(e.target.value))} 
              />
            </div>
          </div>
        </div>
        
        <Button 
          onClick={handleDesign}
          disabled={isDesigning}
          className="w-full mb-4"
        >
          {isDesigning ? "Designing..." : "Design Equipment"}
        </Button>
        
        {designResults && (
          <div className="border rounded-md p-4 bg-gray-50">
            <h5 className="font-medium mb-2">Design Results</h5>
            <div className="grid grid-cols-2 gap-3">
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Heat Duty (kW):</span>
                <div className="font-medium">{designResults.heatDuty}</div>
              </div>
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Heat Transfer Area (m²):</span>
                <div className="font-medium">{designResults.area}</div>
              </div>
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">U-Value (W/m²·K):</span>
                <div className="font-medium">{designResults.uValue}</div>
              </div>
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">LMTD (°C):</span>
                <div className="font-medium">{designResults.lmtd}</div>
              </div>
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Tube Length (m):</span>
                <div className="font-medium">{designResults.tubeLength}</div>
              </div>
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Number of Tubes:</span>
                <div className="font-medium">{designResults.tubeCount}</div>
              </div>
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Shell Diameter (m):</span>
                <div className="font-medium">{designResults.shellDiameter}</div>
              </div>
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Pressure Drop (bar):</span>
                <div className="font-medium">{designResults.pressureDrop}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </BaseSoftwareInterface>
  );
};

export default EquipmentDesignInterface;
