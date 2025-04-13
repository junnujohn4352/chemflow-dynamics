
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Play, Save, Download, FileText, RotateCw } from "lucide-react";

interface EquipmentDesignInterfaceProps {
  software: {
    name: string;
    description: string;
    category: string;
  };
}

const EquipmentDesignInterface: React.FC<EquipmentDesignInterfaceProps> = ({ software }) => {
  const [designComplete, setDesignComplete] = useState(false);
  
  const handleCalculateDesign = () => {
    setDesignComplete(true);
  };

  return (
    <div className="space-y-6 mt-4">
      <Tabs defaultValue="heat-exchanger">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="heat-exchanger">Heat Exchangers</TabsTrigger>
          <TabsTrigger value="distillation">Distillation Columns</TabsTrigger>
          <TabsTrigger value="reactor">Reactors</TabsTrigger>
          <TabsTrigger value="report">Design Report</TabsTrigger>
        </TabsList>
        
        <TabsContent value="heat-exchanger" className="p-4 border rounded-md mt-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium">Heat Exchanger Specification</h3>
              
              <div>
                <Label htmlFor="exchanger-type">Exchanger Type</Label>
                <Select defaultValue="shell-tube">
                  <SelectTrigger id="exchanger-type">
                    <SelectValue placeholder="Select exchanger type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shell-tube">Shell and Tube</SelectItem>
                    <SelectItem value="plate">Plate</SelectItem>
                    <SelectItem value="double-pipe">Double Pipe</SelectItem>
                    <SelectItem value="air-cooled">Air Cooled</SelectItem>
                    <SelectItem value="spiral">Spiral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="shell-side">Shell Side Fluid</Label>
                  <Select defaultValue="hot-water">
                    <SelectTrigger id="shell-side">
                      <SelectValue placeholder="Select fluid" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hot-water">Hot Water</SelectItem>
                      <SelectItem value="steam">Steam</SelectItem>
                      <SelectItem value="oil">Thermal Oil</SelectItem>
                      <SelectItem value="organic">Organic Solvent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="tube-side">Tube Side Fluid</Label>
                  <Select defaultValue="process">
                    <SelectTrigger id="tube-side">
                      <SelectValue placeholder="Select fluid" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="process">Process Fluid</SelectItem>
                      <SelectItem value="cold-water">Cooling Water</SelectItem>
                      <SelectItem value="glycol">Glycol Solution</SelectItem>
                      <SelectItem value="refrigerant">Refrigerant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="duty">Heat Duty</Label>
                <div className="flex items-center gap-2">
                  <Input id="duty" defaultValue="500" />
                  <span className="text-sm whitespace-nowrap">kW</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="shell-inlet">Shell Inlet Temperature</Label>
                  <div className="flex items-center gap-2">
                    <Input id="shell-inlet" defaultValue="95" />
                    <span className="text-sm whitespace-nowrap">°C</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="shell-outlet">Shell Outlet Temperature</Label>
                  <div className="flex items-center gap-2">
                    <Input id="shell-outlet" defaultValue="65" />
                    <span className="text-sm whitespace-nowrap">°C</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="tube-inlet">Tube Inlet Temperature</Label>
                  <div className="flex items-center gap-2">
                    <Input id="tube-inlet" defaultValue="30" />
                    <span className="text-sm whitespace-nowrap">°C</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="tube-outlet">Tube Outlet Temperature</Label>
                  <div className="flex items-center gap-2">
                    <Input id="tube-outlet" defaultValue="60" />
                    <span className="text-sm whitespace-nowrap">°C</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="shell-flow">Shell Side Flow Rate</Label>
                  <div className="flex items-center gap-2">
                    <Input id="shell-flow" defaultValue="15000" />
                    <span className="text-sm whitespace-nowrap">kg/h</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="tube-flow">Tube Side Flow Rate</Label>
                  <div className="flex items-center gap-2">
                    <Input id="tube-flow" defaultValue="12000" />
                    <span className="text-sm whitespace-nowrap">kg/h</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-2">
                <Button className="w-full" onClick={handleCalculateDesign}>
                  <Play className="h-4 w-4 mr-1" />
                  Calculate Design
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">Design Results</h3>
              
              {designComplete ? (
                <div className="space-y-4">
                  <div className="border rounded-md p-4 bg-white dark:bg-gray-800">
                    <h4 className="text-sm font-medium mb-3">Thermal Design</h4>
                    
                    <div className="space-y-2 text-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-gray-500 dark:text-gray-400">Heat Transfer Area:</div>
                        <div className="font-medium">47.8 m²</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-gray-500 dark:text-gray-400">Overall Heat Transfer Coefficient:</div>
                        <div className="font-medium">750 W/(m²·K)</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-gray-500 dark:text-gray-400">LMTD:</div>
                        <div className="font-medium">22.4 °C</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-gray-500 dark:text-gray-400">LMTD Correction Factor:</div>
                        <div className="font-medium">0.95</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-gray-500 dark:text-gray-400">Number of Shells:</div>
                        <div className="font-medium">1</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4 bg-white dark:bg-gray-800">
                    <h4 className="text-sm font-medium mb-3">Mechanical Design</h4>
                    
                    <div className="space-y-2 text-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-gray-500 dark:text-gray-400">Tube Count:</div>
                        <div className="font-medium">276</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-gray-500 dark:text-gray-400">Tube Outside Diameter:</div>
                        <div className="font-medium">19.05 mm</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-gray-500 dark:text-gray-400">Tube BWG:</div>
                        <div className="font-medium">14 BWG (2.11 mm)</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-gray-500 dark:text-gray-400">Tube Layout:</div>
                        <div className="font-medium">Triangular, 23.8 mm pitch</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-gray-500 dark:text-gray-400">Shell Diameter:</div>
                        <div className="font-medium">584 mm</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-gray-500 dark:text-gray-400">Baffle Spacing:</div>
                        <div className="font-medium">117 mm (20% cut)</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-gray-500 dark:text-gray-400">Tube Length:</div>
                        <div className="font-medium">3.66 m</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4 bg-white dark:bg-gray-800">
                    <h4 className="text-sm font-medium mb-3">Pressure Drop</h4>
                    
                    <div className="space-y-2 text-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-gray-500 dark:text-gray-400">Shell Side Pressure Drop:</div>
                        <div className="font-medium">28.5 kPa</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-gray-500 dark:text-gray-400">Tube Side Pressure Drop:</div>
                        <div className="font-medium">42.1 kPa</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      <Save className="h-4 w-4 mr-1" />
                      Save Design
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Export Datasheet
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 border rounded-md bg-gray-50 dark:bg-gray-800 h-[400px]">
                  <RotateCw className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No design results yet</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Fill in specifications and click "Calculate Design"</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="distillation" className="p-4 border rounded-md mt-4">
          <div className="space-y-4">
            <h3 className="font-medium">Distillation Column Design</h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="separation-type">Separation Type</Label>
                  <Select defaultValue="binary">
                    <SelectTrigger id="separation-type">
                      <SelectValue placeholder="Select separation type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="binary">Binary Separation</SelectItem>
                      <SelectItem value="multicomponent">Multicomponent</SelectItem>
                      <SelectItem value="azeotropic">Azeotropic</SelectItem>
                      <SelectItem value="extractive">Extractive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="light-component">Light Component</Label>
                    <Select defaultValue="methanol">
                      <SelectTrigger id="light-component">
                        <SelectValue placeholder="Select component" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="methanol">Methanol</SelectItem>
                        <SelectItem value="ethanol">Ethanol</SelectItem>
                        <SelectItem value="acetone">Acetone</SelectItem>
                        <SelectItem value="benzene">Benzene</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="heavy-component">Heavy Component</Label>
                    <Select defaultValue="water">
                      <SelectTrigger id="heavy-component">
                        <SelectValue placeholder="Select component" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="water">Water</SelectItem>
                        <SelectItem value="toluene">Toluene</SelectItem>
                        <SelectItem value="xylene">Xylene</SelectItem>
                        <SelectItem value="ethylbenzene">Ethylbenzene</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="feed-rate">Feed Rate</Label>
                  <div className="flex items-center gap-2">
                    <Input id="feed-rate" defaultValue="1000" />
                    <span className="text-sm whitespace-nowrap">kg/h</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="feed-light">Feed Light Component</Label>
                    <div className="flex items-center gap-2">
                      <Input id="feed-light" defaultValue="40" />
                      <span className="text-sm whitespace-nowrap">wt%</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="feed-heavy">Feed Heavy Component</Label>
                    <div className="flex items-center gap-2">
                      <Input id="feed-heavy" defaultValue="60" />
                      <span className="text-sm whitespace-nowrap">wt%</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="distillate-purity">Distillate Purity</Label>
                    <div className="flex items-center gap-2">
                      <Input id="distillate-purity" defaultValue="95" />
                      <span className="text-sm whitespace-nowrap">wt%</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="bottoms-purity">Bottoms Purity</Label>
                    <div className="flex items-center gap-2">
                      <Input id="bottoms-purity" defaultValue="98" />
                      <span className="text-sm whitespace-nowrap">wt%</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="feed-condition">Feed Condition</Label>
                  <div className="flex items-center gap-2">
                    <Slider defaultValue={[0.5]} min={0} max={1} step={0.1} className="flex-1" />
                    <span className="text-sm whitespace-nowrap">q = 0.5 (50% vapor)</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="operating-pressure">Operating Pressure</Label>
                  <div className="flex items-center gap-2">
                    <Input id="operating-pressure" defaultValue="101.3" />
                    <span className="text-sm whitespace-nowrap">kPa</span>
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button className="w-full" onClick={handleCalculateDesign}>
                    <Play className="h-4 w-4 mr-1" />
                    Design Column
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md p-4 bg-white dark:bg-gray-800">
                <h4 className="text-sm font-medium mb-3">Column Design Results</h4>
                
                {designComplete ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="text-gray-500 dark:text-gray-400">Minimum Reflux Ratio:</div>
                      <div className="font-medium">0.86</div>
                      
                      <div className="text-gray-500 dark:text-gray-400">Actual Reflux Ratio:</div>
                      <div className="font-medium">1.3 (1.5 × Rmin)</div>
                      
                      <div className="text-gray-500 dark:text-gray-400">Minimum Stages:</div>
                      <div className="font-medium">9.2</div>
                      
                      <div className="text-gray-500 dark:text-gray-400">Total Stages:</div>
                      <div className="font-medium">18</div>
                      
                      <div className="text-gray-500 dark:text-gray-400">Feed Stage Location:</div>
                      <div className="font-medium">10 (from top)</div>
                      
                      <div className="text-gray-500 dark:text-gray-400">Column Diameter:</div>
                      <div className="font-medium">0.85 m</div>
                      
                      <div className="text-gray-500 dark:text-gray-400">Tray Spacing:</div>
                      <div className="font-medium">0.6 m</div>
                      
                      <div className="text-gray-500 dark:text-gray-400">Column Height:</div>
                      <div className="font-medium">14.2 m</div>
                      
                      <div className="text-gray-500 dark:text-gray-400">Tray Type:</div>
                      <div className="font-medium">Sieve</div>
                      
                      <div className="text-gray-500 dark:text-gray-400">Condenser Duty:</div>
                      <div className="font-medium">1.24 MW</div>
                      
                      <div className="text-gray-500 dark:text-gray-400">Reboiler Duty:</div>
                      <div className="font-medium">1.38 MW</div>
                    </div>
                    
                    <div className="border-t pt-4 mt-4">
                      <h4 className="text-sm font-medium mb-3">Mass Balance</h4>
                      
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left pb-2">Stream</th>
                            <th className="text-right pb-2">Flow (kg/h)</th>
                            <th className="text-right pb-2">Methanol (wt%)</th>
                            <th className="text-right pb-2">Water (wt%)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="py-1.5">Feed</td>
                            <td className="text-right">1000.0</td>
                            <td className="text-right">40.0</td>
                            <td className="text-right">60.0</td>
                          </tr>
                          <tr>
                            <td className="py-1.5">Distillate</td>
                            <td className="text-right">421.1</td>
                            <td className="text-right">95.0</td>
                            <td className="text-right">5.0</td>
                          </tr>
                          <tr>
                            <td className="py-1.5">Bottoms</td>
                            <td className="text-right">578.9</td>
                            <td className="text-right">2.0</td>
                            <td className="text-right">98.0</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="flex justify-end pt-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-1" />
                        Generate Detailed Report
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 h-[400px]">
                    <RotateCw className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">No column design results yet</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Fill in specifications and click "Design Column"</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="reactor" className="p-4 border rounded-md mt-4">
          <div className="flex justify-center items-center h-60">
            <div className="text-center">
              <p>Reactor design functionality would be shown here</p>
              <Button className="mt-4" onClick={handleCalculateDesign}>
                <Play className="h-4 w-4 mr-1" />
                Design Reactor
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="report" className="p-4 border rounded-md mt-4">
          {designComplete ? (
            <div className="space-y-4">
              <div className="border rounded-md p-4 bg-white dark:bg-gray-800">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Equipment Design Report</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Export PDF
                    </Button>
                  </div>
                </div>
                
                <div className="mt-6 space-y-6">
                  <div>
                    <h4 className="text-lg font-medium mb-2">Design Summary</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Shell and tube heat exchanger designed for process cooling application with 
                      hot water on shell side and process fluid on tube side. 
                      The design meets TEMA standards and has been optimized for 
                      thermal performance while maintaining acceptable pressure drops.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium mb-2">Specifications</h4>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                      <div className="text-gray-600 dark:text-gray-400">Heat Duty:</div>
                      <div>500 kW</div>
                      
                      <div className="text-gray-600 dark:text-gray-400">Tube Side Fluid:</div>
                      <div>Process Fluid</div>
                      
                      <div className="text-gray-600 dark:text-gray-400">Shell Side Fluid:</div>
                      <div>Hot Water</div>
                      
                      <div className="text-gray-600 dark:text-gray-400">Flow Pattern:</div>
                      <div>Counter-current</div>
                      
                      <div className="text-gray-600 dark:text-gray-400">Tube Side Inlet/Outlet:</div>
                      <div>30°C / 60°C</div>
                      
                      <div className="text-gray-600 dark:text-gray-400">Shell Side Inlet/Outlet:</div>
                      <div>95°C / 65°C</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium mb-2">Mechanical Design</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      The exchanger design follows TEMA class R standards and ASME Section VIII, Division 1 pressure vessel code.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                      <div className="text-gray-600 dark:text-gray-400">TEMA Type:</div>
                      <div>AES</div>
                      
                      <div className="text-gray-600 dark:text-gray-400">Shell Material:</div>
                      <div>Carbon Steel SA-516 Gr. 70</div>
                      
                      <div className="text-gray-600 dark:text-gray-400">Tube Material:</div>
                      <div>Stainless Steel 304</div>
                      
                      <div className="text-gray-600 dark:text-gray-400">Tube Sheet Material:</div>
                      <div>Carbon Steel SA-516 Gr. 70 w/ SS304 Cladding</div>
                      
                      <div className="text-gray-600 dark:text-gray-400">Design Pressure (Shell):</div>
                      <div>10 barg</div>
                      
                      <div className="text-gray-600 dark:text-gray-400">Design Pressure (Tube):</div>
                      <div>15 barg</div>
                      
                      <div className="text-gray-600 dark:text-gray-400">Design Temperature:</div>
                      <div>150°C</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium mb-2">Performance Evaluation</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      The design provides efficient heat transfer with adequate safety margins 
                      and reasonable pressure drops. The fouling factors used are conservative 
                      to ensure reliable long-term performance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 border rounded-md bg-gray-50 dark:bg-gray-800">
              <FileText className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-xl font-medium mb-2">No Reports Available</h3>
              <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                Complete equipment design in the other tabs to generate detailed reports.
              </p>
              <Button className="mt-6" onClick={handleCalculateDesign}>
                <Play className="h-4 w-4 mr-1" />
                Generate Sample Report
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EquipmentDesignInterface;
