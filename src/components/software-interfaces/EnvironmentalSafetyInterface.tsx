
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Play, Wind, Download, BarChart, Save, FileText, AlertTriangle } from "lucide-react";

interface EnvironmentalSafetyInterfaceProps {
  software: {
    name: string;
    description: string;
    category: string;
  };
}

const EnvironmentalSafetyInterface: React.FC<EnvironmentalSafetyInterfaceProps> = ({ software }) => {
  const [modelComplete, setModelComplete] = useState(false);
  
  const handleRunModel = () => {
    setModelComplete(true);
  };

  return (
    <div className="space-y-6 mt-4">
      <Tabs defaultValue="dispersion">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="dispersion">Dispersion Modeling</TabsTrigger>
          <TabsTrigger value="consequence">Consequence Analysis</TabsTrigger>
          <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
          <TabsTrigger value="report">Report Generation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dispersion" className="p-4 border rounded-md mt-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium">Dispersion Model Parameters</h3>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="substance">Substance</Label>
                  <Select defaultValue="methane">
                    <SelectTrigger id="substance">
                      <SelectValue placeholder="Select substance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="methane">Methane</SelectItem>
                      <SelectItem value="ammonia">Ammonia</SelectItem>
                      <SelectItem value="chlorine">Chlorine</SelectItem>
                      <SelectItem value="hydrogen-sulfide">Hydrogen Sulfide</SelectItem>
                      <SelectItem value="lpg">LPG (Propane/Butane)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="release-type">Release Type</Label>
                  <Select defaultValue="continuous">
                    <SelectTrigger id="release-type">
                      <SelectValue placeholder="Select release type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="continuous">Continuous Release</SelectItem>
                      <SelectItem value="instantaneous">Instantaneous Release</SelectItem>
                      <SelectItem value="catastrophic">Catastrophic Failure</SelectItem>
                      <SelectItem value="leak">Leak from Hole</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="release-rate">Release Rate</Label>
                  <div className="flex items-center gap-2">
                    <Input id="release-rate" defaultValue="5.0" />
                    <span className="text-sm whitespace-nowrap">kg/s</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="release-duration">Release Duration</Label>
                  <div className="flex items-center gap-2">
                    <Input id="release-duration" defaultValue="600" />
                    <span className="text-sm whitespace-nowrap">seconds</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="release-height">Release Height</Label>
                  <div className="flex items-center gap-2">
                    <Input id="release-height" defaultValue="3.0" />
                    <span className="text-sm whitespace-nowrap">m</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="wind-speed">Wind Speed</Label>
                  <div className="flex items-center gap-2">
                    <Slider defaultValue={[5]} min={1} max={20} step={0.5} className="flex-1" />
                    <span className="text-sm whitespace-nowrap">5 m/s</span>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="stability-class">Atmospheric Stability Class</Label>
                  <Select defaultValue="d">
                    <SelectTrigger id="stability-class">
                      <SelectValue placeholder="Select stability class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a">A (Very Unstable)</SelectItem>
                      <SelectItem value="b">B (Unstable)</SelectItem>
                      <SelectItem value="c">C (Slightly Unstable)</SelectItem>
                      <SelectItem value="d">D (Neutral)</SelectItem>
                      <SelectItem value="e">E (Slightly Stable)</SelectItem>
                      <SelectItem value="f">F (Stable)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="terrain-type">Terrain Type</Label>
                  <Select defaultValue="urban">
                    <SelectTrigger id="terrain-type">
                      <SelectValue placeholder="Select terrain type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urban">Urban/Industrial</SelectItem>
                      <SelectItem value="suburban">Suburban</SelectItem>
                      <SelectItem value="rural">Rural/Open Country</SelectItem>
                      <SelectItem value="water">Over Water</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="pt-2">
                  <Button className="w-full" onClick={handleRunModel}>
                    <Play className="h-4 w-4 mr-1" />
                    Run Dispersion Model
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">Dispersion Results</h3>
              
              {modelComplete ? (
                <div className="space-y-4">
                  <div className="aspect-square bg-white dark:bg-gray-800 border rounded-md p-4 flex items-center justify-center">
                    <div className="text-center">
                      <Wind className="h-16 w-16 mx-auto mb-2 text-blue-500" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">[Dispersion contour map would appear here]</p>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4 bg-white dark:bg-gray-800">
                    <h4 className="text-sm font-medium mb-3">Concentration Profiles</h4>
                    
                    <div className="space-y-3 text-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-gray-500 dark:text-gray-400">Maximum Concentration:</div>
                        <div className="font-medium">4,320 ppm</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-gray-500 dark:text-gray-400">Distance to IDLH (1,000 ppm):</div>
                        <div className="font-medium">156 m</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-gray-500 dark:text-gray-400">Distance to LEL (50,000 ppm):</div>
                        <div className="font-medium">42 m</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-gray-500 dark:text-gray-400">Distance to 0.5 LEL:</div>
                        <div className="font-medium">63 m</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-gray-500 dark:text-gray-400">Cloud Width (max):</div>
                        <div className="font-medium">85 m</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      <Save className="h-4 w-4 mr-1" />
                      Save Results
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Export Data
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 border rounded-md h-[445px]">
                  <Wind className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No dispersion results yet</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Configure parameters and run the model</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="consequence" className="p-4 border rounded-md mt-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium">Consequence Analysis</h3>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="scenario-type">Scenario Type</Label>
                  <Select defaultValue="fire">
                    <SelectTrigger id="scenario-type">
                      <SelectValue placeholder="Select scenario type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fire">Fire (Pool/Jet)</SelectItem>
                      <SelectItem value="explosion">Explosion (VCE)</SelectItem>
                      <SelectItem value="bleve">BLEVE</SelectItem>
                      <SelectItem value="toxic">Toxic Release</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="material">Material</Label>
                  <Select defaultValue="natural-gas">
                    <SelectTrigger id="material">
                      <SelectValue placeholder="Select material" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="natural-gas">Natural Gas</SelectItem>
                      <SelectItem value="lpg">LPG</SelectItem>
                      <SelectItem value="gasoline">Gasoline</SelectItem>
                      <SelectItem value="hydrogen">Hydrogen</SelectItem>
                      <SelectItem value="ammonia">Ammonia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="inventory">Inventory</Label>
                  <div className="flex items-center gap-2">
                    <Input id="inventory" defaultValue="5000" />
                    <span className="text-sm whitespace-nowrap">kg</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="pressure">Pressure</Label>
                  <div className="flex items-center gap-2">
                    <Input id="pressure" defaultValue="10" />
                    <span className="text-sm whitespace-nowrap">bar</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="temperature">Temperature</Label>
                  <div className="flex items-center gap-2">
                    <Input id="temperature" defaultValue="25" />
                    <span className="text-sm whitespace-nowrap">°C</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="hole-size">Hole Size</Label>
                  <div className="flex items-center gap-2">
                    <Input id="hole-size" defaultValue="50" />
                    <span className="text-sm whitespace-nowrap">mm</span>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="congestion-level">Congestion Level (for explosion)</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger id="congestion-level">
                      <SelectValue placeholder="Select congestion level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="pt-2">
                  <Button className="w-full" onClick={handleRunModel}>
                    <Play className="h-4 w-4 mr-1" />
                    Calculate Consequences
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {modelComplete ? (
                <div className="space-y-4">
                  <div className="border rounded-md p-4 bg-orange-50 dark:bg-orange-950 text-orange-800 dark:text-orange-200">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium">Hazardous Scenario Identified</h4>
                        <p className="text-sm mt-1">
                          This release scenario could result in significant consequences including thermal radiation effects
                          and potential escalation to nearby equipment.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4 bg-white dark:bg-gray-800">
                    <h4 className="text-sm font-medium mb-3">Radiation Effect Distances</h4>
                    
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left pb-2">Radiation Level</th>
                          <th className="text-right pb-2">Effect</th>
                          <th className="text-right pb-2">Distance (m)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="py-1.5">37.5 kW/m²</td>
                          <td className="text-right text-xs">Equipment Damage</td>
                          <td className="text-right">18</td>
                        </tr>
                        <tr>
                          <td className="py-1.5">12.5 kW/m²</td>
                          <td className="text-right text-xs">1% Fatality</td>
                          <td className="text-right">32</td>
                        </tr>
                        <tr>
                          <td className="py-1.5">4.0 kW/m²</td>
                          <td className="text-right text-xs">1st Degree Burns</td>
                          <td className="text-right">56</td>
                        </tr>
                        <tr>
                          <td className="py-1.5">1.6 kW/m²</td>
                          <td className="text-right text-xs">No Harm Limit</td>
                          <td className="text-right">98</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="aspect-video bg-white dark:bg-gray-800 border rounded-md p-4 flex items-center justify-center">
                    <div className="text-center">
                      <BarChart className="h-12 w-12 mx-auto mb-2 text-orange-500" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">[Consequence visualization would appear here]</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      <Save className="h-4 w-4 mr-1" />
                      Save Results
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Export Data
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 border rounded-md h-[445px]">
                  <AlertTriangle className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No consequence results yet</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Configure scenario and calculate consequences</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="risk" className="p-4 border rounded-md mt-4">
          <div className="space-y-4">
            <h3 className="font-medium">Risk Assessment</h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="border rounded-md p-4 bg-white dark:bg-gray-800">
                  <h4 className="text-sm font-medium mb-3">Event Frequency Analysis</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="equipment-type">Equipment Type</Label>
                      <Select defaultValue="pressure-vessel">
                        <SelectTrigger id="equipment-type">
                          <SelectValue placeholder="Select equipment type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pressure-vessel">Pressure Vessel</SelectItem>
                          <SelectItem value="storage-tank">Storage Tank</SelectItem>
                          <SelectItem value="pipeline">Pipeline</SelectItem>
                          <SelectItem value="pump">Pump</SelectItem>
                          <SelectItem value="compressor">Compressor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="diameter">Diameter/Size</Label>
                      <div className="flex items-center gap-2">
                        <Input id="diameter" defaultValue="1.2" />
                        <span className="text-sm whitespace-nowrap">m</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="length">Length</Label>
                      <div className="flex items-center gap-2">
                        <Input id="length" defaultValue="4.0" />
                        <span className="text-sm whitespace-nowrap">m</span>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="failure-mode">Failure Mode</Label>
                      <Select defaultValue="leak">
                        <SelectTrigger id="failure-mode">
                          <SelectValue placeholder="Select failure mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="leak">Small Leak (10mm)</SelectItem>
                          <SelectItem value="breach">Medium Breach (50mm)</SelectItem>
                          <SelectItem value="rupture">Catastrophic Rupture</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-700 space-y-2">
                      <h5 className="text-sm font-medium">Calculated Frequency</h5>
                      <p className="text-xl font-bold">5.0 × 10<sup>-6</sup> per year</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Based on generic failure frequency data for pressure vessels</p>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4 bg-white dark:bg-gray-800">
                  <h4 className="text-sm font-medium mb-3">Vulnerability Assessment</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="population-type">Population Type</Label>
                      <Select defaultValue="industrial">
                        <SelectTrigger id="population-type">
                          <SelectValue placeholder="Select population type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="industrial">Industrial Workers</SelectItem>
                          <SelectItem value="residential">Residential Area</SelectItem>
                          <SelectItem value="commercial">Commercial Area</SelectItem>
                          <SelectItem value="school">School/Hospital</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="population-density">Population Density</Label>
                      <div className="flex items-center gap-2">
                        <Input id="population-density" defaultValue="5" />
                        <span className="text-sm whitespace-nowrap">people/ha</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="distance">Distance from Release</Label>
                      <div className="flex items-center gap-2">
                        <Input id="distance" defaultValue="150" />
                        <span className="text-sm whitespace-nowrap">m</span>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full" size="sm" onClick={handleRunModel}>
                      Calculate Vulnerability
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {modelComplete ? (
                  <div className="space-y-4">
                    <div className="border rounded-md p-4 bg-white dark:bg-gray-800">
                      <h4 className="text-sm font-medium mb-3">Risk Analysis Results</h4>
                      
                      <div className="space-y-3 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-gray-500 dark:text-gray-400">Individual Risk:</div>
                          <div className="font-medium">2.4 × 10<sup>-7</sup> per year</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-gray-500 dark:text-gray-400">Societal Risk:</div>
                          <div className="font-medium">5.1 × 10<sup>-6</sup> per year</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-gray-500 dark:text-gray-400">Potential Loss of Life (PLL):</div>
                          <div className="font-medium">3.2 × 10<sup>-5</sup> fatalities/year</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-gray-500 dark:text-gray-400">Risk Level Classification:</div>
                          <div className="font-medium text-amber-600 dark:text-amber-400">ALARP Region</div>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t">
                        <h5 className="text-sm font-medium mb-2">Risk Acceptability</h5>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-12 bg-red-500 rounded-full"></div>
                          <div className="w-2 h-12 bg-amber-500 rounded-full"></div>
                          <div className="w-2 h-12 bg-green-500 rounded-full"></div>
                          <div className="flex-1 h-12 bg-gray-100 dark:bg-gray-700 rounded-md relative">
                            <div className="absolute inset-0 flex items-center">
                              <div className="h-8 w-1 bg-black dark:bg-white absolute" style={{ left: "38%" }}></div>
                            </div>
                            <div className="flex justify-between text-xs px-2 pt-1">
                              <span>Intolerable</span>
                              <span>ALARP</span>
                              <span>Acceptable</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="aspect-video bg-white dark:bg-gray-800 border rounded-md p-4 flex items-center justify-center">
                      <div className="text-center">
                        <BarChart className="h-12 w-12 mx-auto mb-2 text-blue-500" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">[F-N curve would appear here]</p>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-4 bg-white dark:bg-gray-800">
                      <h4 className="text-sm font-medium mb-3">Risk Reduction Recommendations</h4>
                      
                      <ul className="space-y-2 text-sm pl-5 list-disc">
                        <li>Install additional gas detection systems at potential release locations</li>
                        <li>Increase inspection frequency for the pressure vessel connections</li>
                        <li>Implement automatic emergency shutdown system linked to gas detection</li>
                        <li>Review and update emergency response procedures</li>
                        <li>Consider additional passive fire protection for nearby critical equipment</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-12 border rounded-md h-[445px]">
                    <FileText className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No risk assessment results yet</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Configure parameters and run the analysis</p>
                    <Button className="mt-4" onClick={handleRunModel}>
                      <Play className="h-4 w-4 mr-1" />
                      Run Risk Assessment
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="report" className="p-4 border rounded-md mt-4">
          {modelComplete ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Safety Report Generation</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Save className="h-4 w-4 mr-1" />
                    Save Report
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Export PDF
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md p-6 bg-white dark:bg-gray-800">
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold mb-2">Hazard and Risk Assessment Report</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Generated on April 13, 2025 | Project: Natural Gas Processing Facility
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium border-b pb-2 mb-3">Executive Summary</h3>
                    <p className="text-sm">
                      This report presents the findings of a comprehensive hazard and risk assessment 
                      conducted for the natural gas processing facility. The assessment focused on the 
                      potential hazards associated with methane releases from pressure vessels and 
                      subsequent fire and explosion scenarios. The analysis indicates that the overall 
                      risk levels fall within the ALARP (As Low As Reasonably Practicable) region, 
                      suggesting that while the risks are tolerable, further risk reduction measures 
                      should be considered where practicable.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium border-b pb-2 mb-3">Scope and Methodology</h3>
                    <p className="text-sm">
                      The assessment covered the primary natural gas processing units, with 
                      particular focus on high-pressure vessels containing methane. The methodology 
                      included consequence modeling of gas releases, frequency analysis based on 
                      historical failure data, and risk assessment using standard industry risk metrics.
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
                      <li>Gaussian dispersion modeling for gas release scenarios</li>
                      <li>Jet fire and vapor cloud explosion consequence modeling</li>
                      <li>Probit vulnerability assessment for exposed personnel</li>
                      <li>Individual and societal risk calculations</li>
                    </ul>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium border-b pb-2 mb-3">Key Findings</h3>
                      <ul className="list-disc pl-6 space-y-2 text-sm">
                        <li>
                          <strong>Hazardous Scenarios:</strong> The most significant hazard 
                          identified is a medium breach (50mm) in a pressure vessel containing methane.
                        </li>
                        <li>
                          <strong>Consequences:</strong> Thermal radiation effects could extend up 
                          to 98m for the no-harm criterion (1.6 kW/m²).
                        </li>
                        <li>
                          <strong>Frequency:</strong> The estimated frequency of this event is 
                          5.0 × 10<sup>-6</sup> per year based on industry data.
                        </li>
                        <li>
                          <strong>Risk Levels:</strong> Individual risk at nearby occupied buildings 
                          is 2.4 × 10<sup>-7</sup> per year, which is within acceptable limits but 
                          requires monitoring.
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium border-b pb-2 mb-3">Recommendations</h3>
                      <ul className="list-disc pl-6 space-y-2 text-sm">
                        <li>
                          <strong>Detection Systems:</strong> Install additional gas detection systems 
                          with automatic alarm and shutdown capabilities.
                        </li>
                        <li>
                          <strong>Inspection Program:</strong> Enhance the inspection frequency for 
                          pressure vessel connections and potential leak points.
                        </li>
                        <li>
                          <strong>Emergency Response:</strong> Update emergency procedures to address 
                          the specific scenarios identified in this assessment.
                        </li>
                        <li>
                          <strong>Passive Protection:</strong> Consider additional passive fire 
                          protection for nearby critical equipment.
                        </li>
                        <li>
                          <strong>Training:</strong> Conduct specialized training for operators on 
                          early leak detection and emergency response.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 border rounded-md bg-gray-50 dark:bg-gray-800">
              <FileText className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-xl font-medium mb-2">No Report Available</h3>
              <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                Complete at least one analysis in the other tabs to generate a safety report.
              </p>
              <Button className="mt-6" onClick={handleRunModel}>
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

export default EnvironmentalSafetyInterface;
