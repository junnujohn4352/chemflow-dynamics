
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Sliders, Database, Settings2, Check } from 'lucide-react';

interface ThermodynamicsTabProps {
  teaPackages: string[];
}

const ThermodynamicsTab: React.FC<ThermodynamicsTabProps> = ({ teaPackages }) => {
  const [selectedEquationOfState, setSelectedEquationOfState] = useState<string>("peng-robinson");
  const [selectedActivityModel, setSelectedActivityModel] = useState<string>("nrtl");
  
  return (
    <div className="border rounded-md p-4 mb-4">
      <h3 className="font-medium mb-3">TEA - Thermodynamics for Engineering Applications</h3>
      <p className="text-sm text-gray-600 mb-4">
        Select thermodynamic packages and property models for your simulation.
      </p>
      
      <Tabs defaultValue="packages" className="mt-4">
        <TabsList className="mb-4">
          <TabsTrigger value="packages">Packages</TabsTrigger>
          <TabsTrigger value="eos">Equations of State</TabsTrigger>
          <TabsTrigger value="activity">Activity Coefficients</TabsTrigger>
          <TabsTrigger value="parameters">Binary Parameters</TabsTrigger>
        </TabsList>
      
        <TabsContent value="packages">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {teaPackages.map(pkg => (
                <div key={pkg} className="flex items-center p-3 border rounded hover:bg-blue-50">
                  <input type="checkbox" id={pkg} className="mr-2" defaultChecked />
                  <label htmlFor={pkg}>{pkg} Thermodynamics Package</label>
                </div>
              ))}
            </div>
            
            <div className="mt-5 border-t pt-4">
              <h4 className="font-medium mb-3">Specialized Property Methods</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div className="p-2 border rounded hover:bg-blue-50 cursor-pointer flex items-center">
                  <input type="checkbox" id="steam-tables" className="mr-2" />
                  <label htmlFor="steam-tables">Steam Tables</label>
                </div>
                <div className="p-2 border rounded hover:bg-blue-50 cursor-pointer flex items-center">
                  <input type="checkbox" id="transport" className="mr-2" />
                  <label htmlFor="transport">Transport Properties</label>
                </div>
                <div className="p-2 border rounded hover:bg-blue-50 cursor-pointer flex items-center">
                  <input type="checkbox" id="electrolyte" className="mr-2" />
                  <label htmlFor="electrolyte">Electrolyte Models</label>
                </div>
                <div className="p-2 border rounded hover:bg-blue-50 cursor-pointer flex items-center">
                  <input type="checkbox" id="glycol" className="mr-2" />
                  <label htmlFor="glycol">Glycol Property Package</label>
                </div>
                <div className="p-2 border rounded hover:bg-blue-50 cursor-pointer flex items-center">
                  <input type="checkbox" id="amine" className="mr-2" />
                  <label htmlFor="amine">Amine Property Package</label>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="eos">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-medium">Equation of State Models</h4>
              <Select value={selectedEquationOfState} onValueChange={setSelectedEquationOfState}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select EOS model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="peng-robinson">Peng-Robinson</SelectItem>
                  <SelectItem value="srk">Soave-Redlich-Kwong</SelectItem>
                  <SelectItem value="rkk">Redlich-Kwong-Kabadi</SelectItem>
                  <SelectItem value="pr-peneloux">PR with Peneloux Shift</SelectItem>
                  <SelectItem value="bwrs">BWRS</SelectItem>
                  <SelectItem value="lcvm">Lee-Kesler-Plocker</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label>Model Parameters</Label>
                <div className="p-3 bg-gray-50 rounded-md border h-[200px] overflow-y-auto">
                  {selectedEquationOfState === "peng-robinson" && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Omega A:</span>
                        <span className="text-sm font-mono">0.45724</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Omega B:</span>
                        <span className="text-sm font-mono">0.07780</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Critical Compressibility:</span>
                        <span className="text-sm font-mono">0.307</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Alpha Function:</span>
                        <span className="text-sm font-mono">Standard PR</span>
                      </div>
                    </div>
                  )}
                  
                  {selectedEquationOfState === "srk" && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Omega A:</span>
                        <span className="text-sm font-mono">0.42747</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Omega B:</span>
                        <span className="text-sm font-mono">0.08664</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Alpha Function:</span>
                        <span className="text-sm font-mono">Soave</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Mixing Rules</Label>
                <div className="space-y-2">
                  <div className="p-2 border rounded hover:bg-blue-50 cursor-pointer flex items-center">
                    <input type="radio" id="vdw" name="mixing-rules" className="mr-2" defaultChecked />
                    <label htmlFor="vdw">Van der Waals</label>
                  </div>
                  <div className="p-2 border rounded hover:bg-blue-50 cursor-pointer flex items-center">
                    <input type="radio" id="wong-sandler" name="mixing-rules" className="mr-2" />
                    <label htmlFor="wong-sandler">Wong-Sandler</label>
                  </div>
                  <div className="p-2 border rounded hover:bg-blue-50 cursor-pointer flex items-center">
                    <input type="radio" id="huron-vidal" name="mixing-rules" className="mr-2" />
                    <label htmlFor="huron-vidal">Huron-Vidal</label>
                  </div>
                  <div className="p-2 border rounded hover:bg-blue-50 cursor-pointer flex items-center">
                    <input type="radio" id="predictive" name="mixing-rules" className="mr-2" />
                    <label htmlFor="predictive">Predictive-SRK</label>
                  </div>
                </div>
              </div>
            </div>
            
            <Button variant="outline" className="mt-2" size="sm">
              <Settings2 className="h-4 w-4 mr-1.5" />
              Configure Advanced Parameters
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="activity">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-medium">Activity Coefficient Models</h4>
              <Select value={selectedActivityModel} onValueChange={setSelectedActivityModel}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select activity model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nrtl">NRTL</SelectItem>
                  <SelectItem value="uniquac">UNIQUAC</SelectItem>
                  <SelectItem value="wilson">Wilson</SelectItem>
                  <SelectItem value="unifac">UNIFAC</SelectItem>
                  <SelectItem value="vanlaar">Van Laar</SelectItem>
                  <SelectItem value="margules">Margules</SelectItem>
                  <SelectItem value="electrolyte">Electrolyte-NRTL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Model Description</Label>
                <div className="p-3 bg-gray-50 rounded-md border">
                  {selectedActivityModel === "nrtl" && (
                    <p className="text-sm">
                      Non-Random Two-Liquid (NRTL) model is suitable for highly non-ideal liquid mixtures 
                      and can handle partial miscibility. It requires binary interaction parameters 
                      that characterize the molecular interactions.
                    </p>
                  )}
                  {selectedActivityModel === "uniquac" && (
                    <p className="text-sm">
                      UNIQUAC (Universal Quasi-Chemical) accounts for molecular size and shape differences 
                      using structural parameters. Good for systems with polar or associating compounds.
                    </p>
                  )}
                  {selectedActivityModel === "wilson" && (
                    <p className="text-sm">
                      Wilson model works well for strongly non-ideal mixtures, particularly for 
                      polar/associating systems. Cannot predict liquid-liquid phase splitting.
                    </p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Application Range</Label>
                <div className="space-y-2">
                  <div className="p-2 border rounded bg-blue-50">
                    <p className="text-sm">
                      <span className="font-medium">Temperature Range:</span> {" "}
                      {selectedActivityModel === "nrtl" ? "Low to moderate temperatures" : 
                       selectedActivityModel === "uniquac" ? "Wide temperature range" :
                       selectedActivityModel === "wilson" ? "Moderate to high temperatures" :
                       "Consult model documentation"}
                    </p>
                  </div>
                  <div className="p-2 border rounded bg-blue-50">
                    <p className="text-sm">
                      <span className="font-medium">Pressure Limitations:</span> {" "}
                      {selectedActivityModel === "nrtl" ? "Low to moderate pressures" : 
                       selectedActivityModel === "uniquac" ? "Low to moderate pressures" :
                       selectedActivityModel === "wilson" ? "Low to moderate pressures" :
                       "Consult model documentation"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <Button variant="outline" className="mt-2" size="sm">
              <Sliders className="h-4 w-4 mr-1.5" />
              Configure Binary Parameters
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="parameters">
          <div className="space-y-4">
            <h4 className="font-medium">Binary Interaction Parameters</h4>
            <p className="text-sm text-gray-600">
              Configure component-component interaction parameters for accurate phase equilibrium predictions.
            </p>
            
            <div className="bg-gray-50 p-3 rounded-md border overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border text-left">Component i</th>
                    <th className="p-2 border text-left">Component j</th>
                    <th className="p-2 border text-center">k<sub>ij</sub></th>
                    <th className="p-2 border text-center">a<sub>ij</sub></th>
                    <th className="p-2 border text-center">b<sub>ij</sub></th>
                    <th className="p-2 border text-center">c<sub>ij</sub></th>
                    <th className="p-2 border text-center">Source</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border">Methane</td>
                    <td className="p-2 border">Ethane</td>
                    <td className="p-2 border text-center">0.0026</td>
                    <td className="p-2 border text-center">-0.0056</td>
                    <td className="p-2 border text-center">0.0</td>
                    <td className="p-2 border text-center">0.0</td>
                    <td className="p-2 border text-center">DIPPR</td>
                  </tr>
                  <tr>
                    <td className="p-2 border">Methane</td>
                    <td className="p-2 border">Propane</td>
                    <td className="p-2 border text-center">0.0077</td>
                    <td className="p-2 border text-center">-0.0033</td>
                    <td className="p-2 border text-center">0.0</td>
                    <td className="p-2 border text-center">0.0</td>
                    <td className="p-2 border text-center">DIPPR</td>
                  </tr>
                  <tr>
                    <td className="p-2 border">Water</td>
                    <td className="p-2 border">Methanol</td>
                    <td className="p-2 border text-center">-0.0789</td>
                    <td className="p-2 border text-center">0.0864</td>
                    <td className="p-2 border text-center">0.0027</td>
                    <td className="p-2 border text-center">0.0</td>
                    <td className="p-2 border text-center">ASPEN</td>
                  </tr>
                  <tr>
                    <td colSpan={7} className="p-2 border text-center italic text-gray-500">
                      Add more component pairs as needed
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                <Database className="h-4 w-4" />
                Import from Database
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                <Settings2 className="h-4 w-4" />
                Regression Tool
              </Button>
              <Button className="ml-auto flex items-center gap-1.5">
                <Check className="h-4 w-4" />
                Apply Parameters
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 pt-4 border-t">
        <h4 className="font-medium mb-2">Property Calculation Methods</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="p-2 border rounded bg-blue-50 text-center">Vapor Pressure</div>
          <div className="p-2 border rounded bg-blue-50 text-center">Heat Capacity</div>
          <div className="p-2 border rounded bg-blue-50 text-center">Enthalpy/Entropy</div>
          <div className="p-2 border rounded bg-blue-50 text-center">Fugacity</div>
          <div className="p-2 border rounded bg-blue-50 text-center">K-values</div>
          <div className="p-2 border rounded bg-blue-50 text-center">Viscosity</div>
          <div className="p-2 border rounded bg-blue-50 text-center">Thermal Conductivity</div>
          <div className="p-2 border rounded bg-blue-50 text-center">Surface Tension</div>
        </div>
      </div>
    </div>
  );
};

export default ThermodynamicsTab;
