
import React, { useState } from 'react';
import { Software } from '@/types/software';
import BaseSoftwareInterface from './BaseSoftwareInterface';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface MiscellaneousToolsInterfaceProps {
  software: Software;
}

const MiscellaneousToolsInterface: React.FC<MiscellaneousToolsInterfaceProps> = ({ software }) => {
  const [currentTool, setCurrentTool] = useState<string>("unit-converter");
  const { toast } = useToast();
  
  // Unit Converter State
  const [fromUnit, setFromUnit] = useState<string>("meter");
  const [toUnit, setToUnit] = useState<string>("foot");
  const [fromValue, setFromValue] = useState<number>(1);
  const [toValue, setToValue] = useState<number>(3.28084);
  const [unitType, setUnitType] = useState<string>("length");
  
  // Sizing Calculator State
  const [tankType, setTankType] = useState<string>("vertical-cylinder");
  const [tankVolume, setTankVolume] = useState<number>(10);
  const [tankDiameter, setTankDiameter] = useState<number>(2);
  const [tankHeight, setTankHeight] = useState<number>(3.18);
  
  // Economic Calculator State
  const [capitalCost, setCapitalCost] = useState<number>(1000000);
  const [annualRevenue, setAnnualRevenue] = useState<number>(300000);
  const [annualOperatingCost, setAnnualOperatingCost] = useState<number>(100000);
  const [discountRate, setDiscountRate] = useState<number>(10);
  const [projectLife, setProjectLife] = useState<number>(10);
  
  const units = {
    length: [
      { name: "meter", symbol: "m", ratio: 1 },
      { name: "foot", symbol: "ft", ratio: 3.28084 },
      { name: "inch", symbol: "in", ratio: 39.3701 },
      { name: "centimeter", symbol: "cm", ratio: 100 },
      { name: "millimeter", symbol: "mm", ratio: 1000 },
      { name: "kilometer", symbol: "km", ratio: 0.001 },
      { name: "mile", symbol: "mi", ratio: 0.000621371 }
    ],
    mass: [
      { name: "kilogram", symbol: "kg", ratio: 1 },
      { name: "pound", symbol: "lb", ratio: 2.20462 },
      { name: "gram", symbol: "g", ratio: 1000 },
      { name: "milligram", symbol: "mg", ratio: 1000000 },
      { name: "ton", symbol: "t", ratio: 0.001 },
      { name: "ounce", symbol: "oz", ratio: 35.274 }
    ],
    volume: [
      { name: "cubic meter", symbol: "m³", ratio: 1 },
      { name: "liter", symbol: "L", ratio: 1000 },
      { name: "cubic foot", symbol: "ft³", ratio: 35.3147 },
      { name: "gallon (US)", symbol: "gal", ratio: 264.172 },
      { name: "milliliter", symbol: "mL", ratio: 1000000 },
      { name: "barrel", symbol: "bbl", ratio: 6.28981 }
    ],
    pressure: [
      { name: "pascal", symbol: "Pa", ratio: 1 },
      { name: "bar", symbol: "bar", ratio: 0.00001 },
      { name: "kilopascal", symbol: "kPa", ratio: 0.001 },
      { name: "psi", symbol: "psi", ratio: 0.000145038 },
      { name: "atmosphere", symbol: "atm", ratio: 0.00000986923 },
      { name: "mmHg", symbol: "mmHg", ratio: 0.00750062 }
    ]
  };
  
  const handleUnitConvert = () => {
    const from = units[unitType as keyof typeof units].find(u => u.name === fromUnit);
    const to = units[unitType as keyof typeof units].find(u => u.name === toUnit);
    
    if (from && to) {
      // Convert to base unit, then to target unit
      const baseValue = fromValue / from.ratio;
      const result = baseValue * to.ratio;
      setToValue(result);
    }
    
    toast({
      title: "Unit Conversion Complete",
      description: `${fromValue} ${fromUnit} = ${toValue.toFixed(4)} ${toUnit}`,
    });
  };
  
  const handleTankCalculation = () => {
    let volume, height, diameter;
    
    if (tankType === "vertical-cylinder") {
      if (tankVolume && tankDiameter) {
        // Calculate height from volume and diameter
        diameter = tankDiameter;
        const radius = diameter / 2;
        height = tankVolume / (Math.PI * radius * radius);
        setTankHeight(height);
      } else if (tankVolume && tankHeight) {
        // Calculate diameter from volume and height
        height = tankHeight;
        const radius = Math.sqrt(tankVolume / (Math.PI * height));
        diameter = radius * 2;
        setTankDiameter(diameter);
      } else if (tankDiameter && tankHeight) {
        // Calculate volume from diameter and height
        diameter = tankDiameter;
        height = tankHeight;
        const radius = diameter / 2;
        volume = Math.PI * radius * radius * height;
        setTankVolume(volume);
      }
    }
    
    toast({
      title: "Tank Sizing Complete",
      description: "Tank dimensions calculated successfully.",
    });
  };
  
  const handleEconomicCalculation = () => {
    // Calculate net cash flow
    const annualCashFlow = annualRevenue - annualOperatingCost;
    
    // Calculate NPV
    let npv = -capitalCost;
    for (let year = 1; year <= projectLife; year++) {
      npv += annualCashFlow / Math.pow(1 + discountRate/100, year);
    }
    
    // Calculate Payback Period
    const paybackPeriod = capitalCost / annualCashFlow;
    
    // Calculate IRR (simplified using approximation)
    const irr = ((annualCashFlow / capitalCost) - 1/projectLife) * 100;
    
    // Calculate ROI
    const roi = (annualCashFlow / capitalCost) * 100;
    
    const resultMessage = `NPV: $${npv.toFixed(2)}, Payback: ${paybackPeriod.toFixed(2)} years, ROI: ${roi.toFixed(2)}%`;
    
    toast({
      title: "Economic Analysis Complete",
      description: resultMessage,
    });
    
    return {
      npv: npv.toFixed(2),
      paybackPeriod: paybackPeriod.toFixed(2),
      irr: irr.toFixed(2),
      roi: roi.toFixed(2)
    };
  };

  return (
    <BaseSoftwareInterface software={software}>
      <div className="mt-4 border-t pt-4">
        <h5 className="font-medium mb-2">Utility Tools</h5>
        
        <Tabs value={currentTool} onValueChange={setCurrentTool} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="unit-converter">Unit Converter</TabsTrigger>
            <TabsTrigger value="sizing-calculator">Sizing Calculator</TabsTrigger>
            <TabsTrigger value="economic-calculator">Economic Calculator</TabsTrigger>
          </TabsList>
          
          <TabsContent value="unit-converter" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="unitType">Measurement Type</Label>
                <Select value={unitType} onValueChange={setUnitType}>
                  <SelectTrigger id="unitType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="length">Length</SelectItem>
                    <SelectItem value="mass">Mass</SelectItem>
                    <SelectItem value="volume">Volume</SelectItem>
                    <SelectItem value="pressure">Pressure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fromValue">Value</Label>
                <Input 
                  id="fromValue" 
                  type="number" 
                  value={fromValue} 
                  onChange={(e) => setFromValue(Number(e.target.value))} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fromUnit">From Unit</Label>
                <Select value={fromUnit} onValueChange={setFromUnit}>
                  <SelectTrigger id="fromUnit">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {unitType && units[unitType as keyof typeof units].map((unit) => (
                      <SelectItem key={unit.name} value={unit.name}>
                        {unit.name} ({unit.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="toUnit">To Unit</Label>
                <Select value={toUnit} onValueChange={setToUnit}>
                  <SelectTrigger id="toUnit">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {unitType && units[unitType as keyof typeof units].map((unit) => (
                      <SelectItem key={unit.name} value={unit.name}>
                        {unit.name} ({unit.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-4">
              <Button onClick={handleUnitConvert}>Convert</Button>
              
              <div className="border rounded-md p-4 bg-gray-50 w-full text-center">
                <div className="text-lg">
                  {fromValue} {fromUnit} = <span className="font-bold">{toValue.toFixed(4)}</span> {toUnit}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="sizing-calculator" className="space-y-4">
            <div className="space-y-2 mb-4">
              <Label htmlFor="tankType">Tank Type</Label>
              <Select value={tankType} onValueChange={setTankType}>
                <SelectTrigger id="tankType">
                  <SelectValue placeholder="Select tank type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vertical-cylinder">Vertical Cylinder</SelectItem>
                  <SelectItem value="horizontal-cylinder">Horizontal Cylinder</SelectItem>
                  <SelectItem value="rectangular">Rectangular Tank</SelectItem>
                  <SelectItem value="spherical">Spherical Tank</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="tankVolume">Volume (m³)</Label>
                <Input 
                  id="tankVolume" 
                  type="number" 
                  value={tankVolume} 
                  onChange={(e) => setTankVolume(Number(e.target.value))} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tankDiameter">Diameter (m)</Label>
                <Input 
                  id="tankDiameter" 
                  type="number" 
                  value={tankDiameter} 
                  onChange={(e) => setTankDiameter(Number(e.target.value))} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tankHeight">Height (m)</Label>
                <Input 
                  id="tankHeight" 
                  type="number" 
                  value={tankHeight} 
                  onChange={(e) => setTankHeight(Number(e.target.value))} 
                />
              </div>
            </div>
            
            <Button onClick={handleTankCalculation} className="w-full">Calculate</Button>
            
            <div className="border rounded-md p-4 bg-gray-50 mt-4">
              <h6 className="font-medium mb-2">Tank Properties</h6>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-gray-600 text-sm">Volume:</span>
                  <div className="font-medium">{tankVolume.toFixed(2)} m³</div>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Surface Area:</span>
                  <div className="font-medium">{(2 * Math.PI * (tankDiameter/2) * (tankDiameter/2 + tankHeight)).toFixed(2)} m²</div>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Aspect Ratio (H/D):</span>
                  <div className="font-medium">{(tankHeight / tankDiameter).toFixed(2)}</div>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Shell Thickness:</span>
                  <div className="font-medium">{(0.005 + tankDiameter/1000).toFixed(3)} m</div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="economic-calculator" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="capitalCost">Capital Cost ($)</Label>
                <Input 
                  id="capitalCost" 
                  type="number" 
                  value={capitalCost} 
                  onChange={(e) => setCapitalCost(Number(e.target.value))} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="annualRevenue">Annual Revenue ($/year)</Label>
                <Input 
                  id="annualRevenue" 
                  type="number" 
                  value={annualRevenue} 
                  onChange={(e) => setAnnualRevenue(Number(e.target.value))} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="annualOperatingCost">Annual Operating Cost ($/year)</Label>
                <Input 
                  id="annualOperatingCost" 
                  type="number" 
                  value={annualOperatingCost} 
                  onChange={(e) => setAnnualOperatingCost(Number(e.target.value))} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="discountRate">Discount Rate (%)</Label>
                <Input 
                  id="discountRate" 
                  type="number" 
                  value={discountRate} 
                  onChange={(e) => setDiscountRate(Number(e.target.value))} 
                  step="0.1"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="projectLife">Project Life (years)</Label>
                <Input 
                  id="projectLife" 
                  type="number" 
                  value={projectLife} 
                  onChange={(e) => setProjectLife(Number(e.target.value))} 
                />
              </div>
            </div>
            
            <Button onClick={handleEconomicCalculation} className="w-full">Analyze Economics</Button>
            
            <div className="border rounded-md p-4 bg-gray-50 mt-4">
              <h6 className="font-medium mb-2">Economic Analysis Results</h6>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-gray-600 text-sm">Net Present Value (NPV):</span>
                  <div className="font-medium">${(annualRevenue - annualOperatingCost) * projectLife - capitalCost}</div>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Return on Investment (ROI):</span>
                  <div className="font-medium">{((annualRevenue - annualOperatingCost) / capitalCost * 100).toFixed(2)}%</div>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Payback Period:</span>
                  <div className="font-medium">{(capitalCost / (annualRevenue - annualOperatingCost)).toFixed(2)} years</div>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Annual Cash Flow:</span>
                  <div className="font-medium">${(annualRevenue - annualOperatingCost).toFixed(2)}/year</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </BaseSoftwareInterface>
  );
};

export default MiscellaneousToolsInterface;
