
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ArrowRight, BarChart, LineChart, Calculator, Download, Save } from "lucide-react";

interface MiscellaneousToolsInterfaceProps {
  software: {
    name: string;
    description: string;
    category: string;
  };
}

const MiscellaneousToolsInterface: React.FC<MiscellaneousToolsInterfaceProps> = ({ software }) => {
  const [calculationComplete, setCalculationComplete] = useState(false);
  
  const handleCalculate = () => {
    setCalculationComplete(true);
  };

  return (
    <div className="space-y-6 mt-4">
      <Tabs defaultValue="pinch">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="pinch">Energy Analysis</TabsTrigger>
          <TabsTrigger value="dynamics">Process Dynamics</TabsTrigger>
          <TabsTrigger value="economics">Economics</TabsTrigger>
          <TabsTrigger value="utilities">Utilities</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pinch" className="p-4 border rounded-md mt-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium">Pinch Analysis</h3>
              
              <div className="border rounded-md p-4 bg-white dark:bg-gray-800 space-y-3">
                <div>
                  <Label htmlFor="stream-data">Heat Exchanger Network Data</Label>
                  <div className="mt-2 overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700">
                          <th className="border px-2 py-1 text-left">Stream</th>
                          <th className="border px-2 py-1 text-left">Type</th>
                          <th className="border px-2 py-1 text-right">T<sub>in</sub> (°C)</th>
                          <th className="border px-2 py-1 text-right">T<sub>out</sub> (°C)</th>
                          <th className="border px-2 py-1 text-right">CP (kW/°C)</th>
                          <th className="border px-2 py-1 text-right">Duty (kW)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border px-2 py-1">H1</td>
                          <td className="border px-2 py-1">Hot</td>
                          <td className="border px-2 py-1 text-right">180</td>
                          <td className="border px-2 py-1 text-right">40</td>
                          <td className="border px-2 py-1 text-right">20</td>
                          <td className="border px-2 py-1 text-right">2800</td>
                        </tr>
                        <tr>
                          <td className="border px-2 py-1">H2</td>
                          <td className="border px-2 py-1">Hot</td>
                          <td className="border px-2 py-1 text-right">150</td>
                          <td className="border px-2 py-1 text-right">30</td>
                          <td className="border px-2 py-1 text-right">40</td>
                          <td className="border px-2 py-1 text-right">4800</td>
                        </tr>
                        <tr>
                          <td className="border px-2 py-1">C1</td>
                          <td className="border px-2 py-1">Cold</td>
                          <td className="border px-2 py-1 text-right">20</td>
                          <td className="border px-2 py-1 text-right">135</td>
                          <td className="border px-2 py-1 text-right">25</td>
                          <td className="border px-2 py-1 text-right">2875</td>
                        </tr>
                        <tr>
                          <td className="border px-2 py-1">C2</td>
                          <td className="border px-2 py-1">Cold</td>
                          <td className="border px-2 py-1 text-right">80</td>
                          <td className="border px-2 py-1 text-right">140</td>
                          <td className="border px-2 py-1 text-right">30</td>
                          <td className="border px-2 py-1 text-right">1800</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="flex justify-end mt-2">
                    <Button variant="outline" size="sm">
                      Add Stream
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="min-approach">Minimum Approach Temperature (ΔT<sub>min</sub>)</Label>
                  <div className="flex items-center gap-2">
                    <Slider id="min-approach" defaultValue={[10]} min={1} max={30} step={1} className="flex-1" />
                    <span className="text-sm whitespace-nowrap">10 °C</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hot-utility">Hot Utility Cost</Label>
                    <div className="flex items-center gap-2">
                      <Input id="hot-utility" defaultValue="120" />
                      <span className="text-sm whitespace-nowrap">$/kW-yr</span>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="cold-utility">Cold Utility Cost</Label>
                    <div className="flex items-center gap-2">
                      <Input id="cold-utility" defaultValue="20" />
                      <span className="text-sm whitespace-nowrap">$/kW-yr</span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button className="w-full" onClick={handleCalculate}>
                    <Calculator className="h-4 w-4 mr-1" />
                    Calculate Pinch Point
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">Pinch Analysis Results</h3>
              
              {calculationComplete ? (
                <div className="space-y-4">
                  <div className="border rounded-md p-4 bg-white dark:bg-gray-800">
                    <h4 className="text-sm font-medium mb-3">Key Results</h4>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Pinch Temperature (Hot):</p>
                        <p className="text-xl font-medium">95 °C</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Pinch Temperature (Cold):</p>
                        <p className="text-xl font-medium">85 °C</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Minimum Hot Utility:</p>
                        <p className="text-xl font-medium">2,075 kW</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Minimum Cold Utility:</p>
                        <p className="text-xl font-medium">4,100 kW</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Maximum Energy Recovery:</p>
                        <p className="text-xl font-medium">3,600 kW</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Annual Utility Cost:</p>
                        <p className="text-xl font-medium">$331,000</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="aspect-video bg-white dark:bg-gray-800 border rounded-md p-4 flex items-center justify-center">
                    <div className="text-center">
                      <LineChart className="h-12 w-12 mx-auto mb-2 text-blue-500" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">[Composite curves would appear here]</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button variant="outline" size="sm">
                      <Save className="h-4 w-4 mr-1" />
                      Save Results
                    </Button>
                    <Button variant="outline" size="sm">
                      <ArrowRight className="h-4 w-4 mr-1" />
                      Design HEN
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 border rounded-md h-80 bg-gray-50 dark:bg-gray-800">
                  <BarChart className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No pinch analysis results yet</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Enter stream data and calculate pinch point</p>
                </div>
              )}
              
              {calculationComplete && (
                <div className="border rounded-md p-4 bg-white dark:bg-gray-800">
                  <h4 className="text-sm font-medium mb-3">Energy Targeting</h4>
                  
                  <div className="space-y-2 text-sm">
                    <p>The current design has the following potential improvements:</p>
                    
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Potential utility cost savings of $142,000/year compared to existing design</li>
                      <li>Current design uses 3,200 kW hot utility (vs. minimum 2,075 kW)</li>
                      <li>Current design uses 5,225 kW cold utility (vs. minimum 4,100 kW)</li>
                      <li>3 heat exchanger units can be eliminated</li>
                    </ul>
                    
                    <div className="pt-2">
                      <Button variant="outline" size="sm" className="w-full">
                        <Download className="h-4 w-4 mr-1" />
                        Generate Detailed Report
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="dynamics" className="p-4 border rounded-md mt-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium">Process Dynamics Analysis</h3>
              
              <div className="border rounded-md p-4 bg-white dark:bg-gray-800 space-y-3">
                <div>
                  <Label htmlFor="system-type">System Type</Label>
                  <Select defaultValue="first-order">
                    <SelectTrigger id="system-type">
                      <SelectValue placeholder="Select system type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="first-order">First Order</SelectItem>
                      <SelectItem value="second-order">Second Order</SelectItem>
                      <SelectItem value="first-order-delay">First Order with Delay</SelectItem>
                      <SelectItem value="integrating">Integrating</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="time-constant">Time Constant (τ)</Label>
                    <div className="flex items-center gap-2">
                      <Input id="time-constant" defaultValue="5" />
                      <span className="text-sm whitespace-nowrap">min</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="process-gain">Process Gain (K)</Label>
                    <Input i="process-gain" defaultValue="2.5" />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="dead-time">Dead Time (θ)</Label>
                  <div className="flex items-center gap-2">
                    <Input id="dead-time" defaultValue="1" />
                    <span className="text-sm whitespace-nowrap">min</span>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="input-type">Input Type</Label>
                  <Select defaultValue="step">
                    <SelectTrigger id="input-type">
                      <SelectValue placeholder="Select input type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="step">Step Change</SelectItem>
                      <SelectItem value="pulse">Pulse</SelectItem>
                      <SelectItem value="ramp">Ramp</SelectItem>
                      <SelectItem value="sine">Sinusoidal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="input-magnitude">Input Magnitude</Label>
                  <Input id="input-magnitude" defaultValue="1.0" />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="simulation-time">Simulation Time</Label>
                  <div className="flex items-center gap-2">
                    <Input id="simulation-time" defaultValue="30" />
                    <span className="text-sm whitespace-nowrap">min</span>
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button className="w-full" onClick={handleCalculate}>
                    <Calculator className="h-4 w-4 mr-1" />
                    Generate Response
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">Dynamic Response</h3>
              
              {calculationComplete ? (
                <div className="space-y-4">
                  <div className="aspect-video bg-white dark:bg-gray-800 border rounded-md p-4 flex items-center justify-center">
                    <div className="text-center">
                      <LineChart className="h-12 w-12 mx-auto mb-2 text-blue-500" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">[Dynamic response plot would appear here]</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        First Order with Delay: Step Response
                      </p>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4 bg-white dark:bg-gray-800">
                    <h4 className="text-sm font-medium mb-3">Response Characteristics</h4>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Rise Time (10% to 90%):</p>
                        <p className="font-medium">11.5 min</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Settling Time (5%):</p>
                        <p className="font-medium">16.0 min</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Peak Time:</p>
                        <p className="font-medium">N/A (Non-overshooting)</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Overshoot:</p>
                        <p className="font-medium">0%</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Final Value:</p>
                        <p className="font-medium">2.5</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Initial Response Rate:</p>
                        <p className="font-medium">0 (due to delay)</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4 bg-white dark:bg-gray-800">
                    <h4 className="text-sm font-medium mb-3">Transfer Function</h4>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md font-mono text-center text-sm">
                      G(s) = 2.5 e<sup>-1s</sup> / (5s + 1)
                    </div>
                    
                    <div className="flex justify-between mt-4">
                      <Button variant="outline" size="sm">
                        Convert to State Space
                      </Button>
                      <Button variant="outline" size="sm">
                        <ArrowRight className="h-4 w-4 mr-1" />
                        Controller Design
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 border rounded-md h-80 bg-gray-50 dark:bg-gray-800">
                  <LineChart className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No dynamic response generated yet</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Configure system and generate response</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="economics" className="p-4 border rounded-md mt-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium">Economic Analysis</h3>
              
              <div className="border rounded-md p-4 bg-white dark:bg-gray-800 space-y-3">
                <div>
                  <Label htmlFor="analysis-type">Analysis Type</Label>
                  <Select defaultValue="capex">
                    <SelectTrigger id="analysis-type">
                      <SelectValue placeholder="Select analysis type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="capex">Capital Cost Estimation</SelectItem>
                      <SelectItem value="opex">Operating Cost Estimation</SelectItem>
                      <SelectItem value="discounted">Discounted Cash Flow</SelectItem>
                      <SelectItem value="comparison">Investment Comparison</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="project-name">Project/Equipment Name</Label>
                  <Input id="project-name" defaultValue="Heat Exchanger Network Upgrade" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="capital-cost">Total Capital Investment</Label>
                    <div className="flex items-center gap-2">
                      <Input id="capital-cost" defaultValue="750000" />
                      <span className="text-sm whitespace-nowrap">$</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="annual-savings">Annual Savings</Label>
                    <div className="flex items-center gap-2">
                      <Input id="annual-savings" defaultValue="142000" />
                      <span className="text-sm whitespace-nowrap">$/year</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="discount-rate">Discount Rate</Label>
                    <div className="flex items-center gap-2">
                      <Input id="discount-rate" defaultValue="10" />
                      <span className="text-sm whitespace-nowrap">%</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="project-life">Project Life</Label>
                    <div className="flex items-center gap-2">
                      <Input id="project-life" defaultValue="15" />
                      <span className="text-sm whitespace-nowrap">years</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="depreciation">Depreciation Method</Label>
                  <Select defaultValue="straight">
                    <SelectTrigger id="depreciation">
                      <SelectValue placeholder="Select depreciation method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="straight">Straight Line</SelectItem>
                      <SelectItem value="declining">Declining Balance</SelectItem>
                      <SelectItem value="macrs">MACRS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="tax-rate">Tax Rate</Label>
                  <div className="flex items-center gap-2">
                    <Input id="tax-rate" defaultValue="25" />
                    <span className="text-sm whitespace-nowrap">%</span>
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button className="w-full" onClick={handleCalculate}>
                    <Calculator className="h-4 w-4 mr-1" />
                    Calculate Economics
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">Economic Evaluation</h3>
              
              {calculationComplete ? (
                <div className="space-y-4">
                  <div className="border rounded-md p-4 bg-white dark:bg-gray-800">
                    <h4 className="text-sm font-medium mb-3">Key Economic Indicators</h4>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Net Present Value (NPV):</p>
                        <p className="text-xl font-medium">$447,265</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Internal Rate of Return (IRR):</p>
                        <p className="text-xl font-medium">16.8%</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Payback Period (Simple):</p>
                        <p className="text-xl font-medium">5.3 years</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Payback Period (Discounted):</p>
                        <p className="text-xl font-medium">7.1 years</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Profitability Index:</p>
                        <p className="text-xl font-medium">1.60</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Levelized Annual Cost:</p>
                        <p className="text-xl font-medium">$99,421/year</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="aspect-video bg-white dark:bg-gray-800 border rounded-md p-4 flex items-center justify-center">
                    <div className="text-center">
                      <BarChart className="h-12 w-12 mx-auto mb-2 text-blue-500" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">[Cash flow diagram would appear here]</p>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4 bg-white dark:bg-gray-800">
                    <h4 className="text-sm font-medium mb-3">Sensitivity Analysis</h4>
                    
                    <div className="text-sm">
                      <p className="mb-2">Most sensitive parameters:</p>
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>Annual Savings (±20% changes NPV by ±$168,450)</li>
                        <li>Capital Cost (±20% changes NPV by ±$150,000)</li>
                        <li>Discount Rate (±2% changes NPV by ±$72,350)</li>
                        <li>Project Life (±5 years changes NPV by ±$63,280)</li>
                      </ol>
                      
                      <div className="mt-4">
                        <p className="font-medium">Recommendation:</p>
                        <p className="mt-1">
                          The project shows positive economic indicators with an IRR (16.8%) greater than the discount rate (10%). 
                          The NPV is positive ($447,265), indicating that the project adds value to the company.
                          However, sensitivity to annual savings suggests that careful monitoring of actual utility costs is important.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Export Detailed Report
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 border rounded-md h-80 bg-gray-50 dark:bg-gray-800">
                  <Calculator className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No economic analysis results yet</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Enter project parameters and calculate economics</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="utilities" className="p-4 border rounded-md mt-4">
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium">Utility Calculators</h3>
              
              <div className="border rounded-md p-4 bg-white dark:bg-gray-800">
                <ul className="space-y-2">
                  <li>
                    <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleCalculate}>
                      <Calculator className="h-4 w-4 mr-1" />
                      Steam System Calculator
                    </Button>
                  </li>
                  <li>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Calculator className="h-4 w-4 mr-1" />
                      Cooling Water System
                    </Button>
                  </li>
                  <li>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Calculator className="h-4 w-4 mr-1" />
                      Refrigeration System
                    </Button>
                  </li>
                  <li>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Calculator className="h-4 w-4 mr-1" />
                      Compressed Air System
                    </Button>
                  </li>
                  <li>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Calculator className="h-4 w-4 mr-1" />
                      Water Treatment
                    </Button>
                  </li>
                  <li>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Calculator className="h-4 w-4 mr-1" />
                      Electricity Consumption
                    </Button>
                  </li>
                  <li>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Calculator className="h-4 w-4 mr-1" />
                      Natural Gas Systems
                    </Button>
                  </li>
                  <li>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Calculator className="h-4 w-4 mr-1" />
                      Heat Loss Calculator
                    </Button>
                  </li>
                  <li>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Calculator className="h-4 w-4 mr-1" />
                      Pump Power Calculator
                    </Button>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="col-span-2 space-y-4">
              <h3 className="font-medium">Steam System Calculator</h3>
              
              {calculationComplete ? (
                <div className="border rounded-md p-4 bg-white dark:bg-gray-800 space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="steam-pressure">Steam Pressure</Label>
                        <div className="flex items-center gap-2">
                          <Input id="steam-pressure" defaultValue="10" />
                          <span className="text-sm whitespace-nowrap">bar g</span>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="steam-temperature">Steam Temperature</Label>
                        <div className="flex items-center gap-2">
                          <Input id="steam-temperature" defaultValue="184" />
                          <span className="text-sm whitespace-nowrap">°C</span>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="steam-flowrate">Flow Rate</Label>
                        <div className="flex items-center gap-2">
                          <Input id="steam-flowrate" defaultValue="5000" />
                          <span className="text-sm whitespace-nowrap">kg/h</span>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="condensate-return">Condensate Return</Label>
                        <div className="flex items-center gap-2">
                          <Input id="condensate-return" defaultValue="80" />
                          <span className="text-sm whitespace-nowrap">%</span>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="condensate-temp">Condensate Temperature</Label>
                        <div className="flex items-center gap-2">
                          <Input id="condensate-temp" defaultValue="95" />
                          <span className="text-sm whitespace-nowrap">°C</span>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="feedwater-temp">Feedwater Temperature</Label>
                        <div className="flex items-center gap-2">
                          <Input id="feedwater-temp" defaultValue="15" />
                          <span className="text-sm whitespace-nowrap">°C</span>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="boiler-efficiency">Boiler Efficiency</Label>
                        <div className="flex items-center gap-2">
                          <Input id="boiler-efficiency" defaultValue="85" />
                          <span className="text-sm whitespace-nowrap">%</span>
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <Button className="w-full">
                          <Calculator className="h-4 w-4 mr-1" />
                          Recalculate
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-700">
                        <h4 className="text-sm font-medium mb-3">Steam Properties</h4>
                        
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                          <div className="text-gray-500 dark:text-gray-400">Saturation Temperature:</div>
                          <div className="font-medium">184.1 °C</div>
                          
                          <div className="text-gray-500 dark:text-gray-400">Specific Enthalpy:</div>
                          <div className="font-medium">2,781 kJ/kg</div>
                          
                          <div className="text-gray-500 dark:text-gray-400">Specific Volume:</div>
                          <div className="font-medium">0.194 m³/kg</div>
                          
                          <div className="text-gray-500 dark:text-gray-400">Density:</div>
                          <div className="font-medium">5.15 kg/m³</div>
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-700">
                        <h4 className="text-sm font-medium mb-3">System Performance</h4>
                        
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                          <div className="text-gray-500 dark:text-gray-400">Steam Energy Content:</div>
                          <div className="font-medium">3,878 kW</div>
                          
                          <div className="text-gray-500 dark:text-gray-400">Makeup Water:</div>
                          <div className="font-medium">1,000 kg/h</div>
                          
                          <div className="text-gray-500 dark:text-gray-400">Fuel Input (Natural Gas):</div>
                          <div className="font-medium">456 m³/h</div>
                          
                          <div className="text-gray-500 dark:text-gray-400">CO₂ Emissions:</div>
                          <div className="font-medium">876 kg/h</div>
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-700">
                        <h4 className="text-sm font-medium mb-3">Economic Analysis</h4>
                        
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                          <div className="text-gray-500 dark:text-gray-400">Fuel Cost:</div>
                          <div className="font-medium">$152/h</div>
                          
                          <div className="text-gray-500 dark:text-gray-400">Water Cost:</div>
                          <div className="font-medium">$2.50/h</div>
                          
                          <div className="text-gray-500 dark:text-gray-400">Treatment Cost:</div>
                          <div className="font-medium">$1.75/h</div>
                          
                          <div className="text-gray-500 dark:text-gray-400">Total Operating Cost:</div>
                          <div className="font-medium">$156.25/h</div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Export Results
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 border rounded-md h-96 bg-gray-50 dark:bg-gray-800">
                  <Calculator className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No utility calculator selected</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Select a utility calculator from the list</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MiscellaneousToolsInterface;
