
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Search, Download, Save, RotateCw, FileText, Pen, Layers, Molecule } from "lucide-react";

interface ChemicalDatabaseInterfaceProps {
  software: {
    name: string;
    description: string;
    category: string;
  };
}

const ChemicalDatabaseInterface: React.FC<ChemicalDatabaseInterfaceProps> = ({ software }) => {
  const [searchResults, setSearchResults] = useState<boolean>(false);
  const [selectedCompound, setSelectedCompound] = useState<string | null>(null);
  
  const handleSearch = () => {
    setSearchResults(true);
  };
  
  const handleSelectCompound = (compound: string) => {
    setSelectedCompound(compound);
  };

  return (
    <div className="space-y-6 mt-4">
      <Tabs defaultValue="search">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="search">Compound Search</TabsTrigger>
          <TabsTrigger value="properties">Physical Properties</TabsTrigger>
          <TabsTrigger value="structure">Structure Editor</TabsTrigger>
          <TabsTrigger value="prediction">Property Prediction</TabsTrigger>
        </TabsList>
        
        <TabsContent value="search" className="p-4 border rounded-md mt-4">
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-1 space-y-4">
              <h3 className="font-medium">Search Criteria</h3>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="search-type">Search Type</Label>
                  <Select defaultValue="name">
                    <SelectTrigger id="search-type">
                      <SelectValue placeholder="Select search type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Compound Name</SelectItem>
                      <SelectItem value="formula">Chemical Formula</SelectItem>
                      <SelectItem value="cas">CAS Number</SelectItem>
                      <SelectItem value="structure">Structural Search</SelectItem>
                      <SelectItem value="property">Property Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="search-term">Search Term</Label>
                  <div className="flex items-center gap-2">
                    <Input id="search-term" placeholder="e.g. Methanol, CH3OH, 67-56-1" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="database">Database</Label>
                  <Select defaultValue="all">
                    <SelectTrigger id="database">
                      <SelectValue placeholder="Select database" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Databases</SelectItem>
                      <SelectItem value="nist">NIST Chemistry WebBook</SelectItem>
                      <SelectItem value="pubchem">PubChem</SelectItem>
                      <SelectItem value="chemspider">ChemSpider</SelectItem>
                      <SelectItem value="internal">Internal Database</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Property Filters</Label>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="filter-bp" />
                      <Label htmlFor="filter-bp" className="text-xs">Boiling Point</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="filter-mp" />
                      <Label htmlFor="filter-mp" className="text-xs">Melting Point</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="filter-density" />
                      <Label htmlFor="filter-density" className="text-xs">Density</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="filter-mw" />
                      <Label htmlFor="filter-mw" className="text-xs">Molecular Weight</Label>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button className="w-full" onClick={handleSearch}>
                    <Search className="h-4 w-4 mr-1" />
                    Search Compounds
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="col-span-2 space-y-4">
              <h3 className="font-medium">Search Results</h3>
              
              {searchResults ? (
                <div className="border rounded-md bg-white dark:bg-gray-800 overflow-hidden">
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 border-b flex justify-between items-center">
                    <span className="text-sm font-medium">Found 5 compounds matching criteria</span>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Export Results
                    </Button>
                  </div>
                  
                  <div className="divide-y">
                    <div 
                      className={`p-4 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer ${
                        selectedCompound === "methanol" ? "bg-blue-50 dark:bg-blue-900/20" : ""
                      }`}
                      onClick={() => handleSelectCompound("methanol")}
                    >
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium">Methanol</h4>
                          <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                            <p>Formula: CH₃OH</p>
                            <p>CAS: 67-56-1</p>
                          </div>
                        </div>
                        <div className="text-sm text-right">
                          <p>MW: 32.04 g/mol</p>
                          <p>BP: 64.7 °C</p>
                          <p>MP: -97.6 °C</p>
                        </div>
                      </div>
                    </div>
                    
                    <div 
                      className={`p-4 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer ${
                        selectedCompound === "ethanol" ? "bg-blue-50 dark:bg-blue-900/20" : ""
                      }`}
                      onClick={() => handleSelectCompound("ethanol")}
                    >
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium">Ethanol</h4>
                          <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                            <p>Formula: C₂H₅OH</p>
                            <p>CAS: 64-17-5</p>
                          </div>
                        </div>
                        <div className="text-sm text-right">
                          <p>MW: 46.07 g/mol</p>
                          <p>BP: 78.2 °C</p>
                          <p>MP: -114.1 °C</p>
                        </div>
                      </div>
                    </div>
                    
                    <div 
                      className={`p-4 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer ${
                        selectedCompound === "propanol" ? "bg-blue-50 dark:bg-blue-900/20" : ""
                      }`}
                      onClick={() => handleSelectCompound("propanol")}
                    >
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium">1-Propanol</h4>
                          <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                            <p>Formula: C₃H₇OH</p>
                            <p>CAS: 71-23-8</p>
                          </div>
                        </div>
                        <div className="text-sm text-right">
                          <p>MW: 60.10 g/mol</p>
                          <p>BP: 97.2 °C</p>
                          <p>MP: -126.2 °C</p>
                        </div>
                      </div>
                    </div>
                    
                    <div 
                      className={`p-4 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer ${
                        selectedCompound === "isopropanol" ? "bg-blue-50 dark:bg-blue-900/20" : ""
                      }`}
                      onClick={() => handleSelectCompound("isopropanol")}
                    >
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium">2-Propanol (Isopropanol)</h4>
                          <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                            <p>Formula: C₃H₇OH</p>
                            <p>CAS: 67-63-0</p>
                          </div>
                        </div>
                        <div className="text-sm text-right">
                          <p>MW: 60.10 g/mol</p>
                          <p>BP: 82.6 °C</p>
                          <p>MP: -89.5 °C</p>
                        </div>
                      </div>
                    </div>
                    
                    <div 
                      className={`p-4 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer ${
                        selectedCompound === "butanol" ? "bg-blue-50 dark:bg-blue-900/20" : ""
                      }`}
                      onClick={() => handleSelectCompound("butanol")}
                    >
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium">1-Butanol</h4>
                          <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                            <p>Formula: C₄H₉OH</p>
                            <p>CAS: 71-36-3</p>
                          </div>
                        </div>
                        <div className="text-sm text-right">
                          <p>MW: 74.12 g/mol</p>
                          <p>BP: 117.7 °C</p>
                          <p>MP: -89.8 °C</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 border rounded-md h-96 bg-gray-50 dark:bg-gray-800">
                  <Search className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No search results yet</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Use the search criteria on the left to find compounds</p>
                </div>
              )}
              
              {selectedCompound && (
                <div className="border rounded-md p-4 bg-white dark:bg-gray-800">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium">
                      {selectedCompound === "methanol" ? "Methanol" :
                       selectedCompound === "ethanol" ? "Ethanol" :
                       selectedCompound === "propanol" ? "1-Propanol" :
                       selectedCompound === "isopropanol" ? "2-Propanol (Isopropanol)" :
                       "1-Butanol"}
                    </h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Formula:</span> {
                        selectedCompound === "methanol" ? "CH₃OH" :
                        selectedCompound === "ethanol" ? "C₂H₅OH" :
                        selectedCompound === "propanol" || selectedCompound === "isopropanol" ? "C₃H₇OH" :
                        "C₄H₉OH"
                      }</p>
                      <p><span className="font-medium">Molecular Weight:</span> {
                        selectedCompound === "methanol" ? "32.04" :
                        selectedCompound === "ethanol" ? "46.07" :
                        selectedCompound === "propanol" || selectedCompound === "isopropanol" ? "60.10" :
                        "74.12"
                      } g/mol</p>
                      <p><span className="font-medium">CAS Registry Number:</span> {
                        selectedCompound === "methanol" ? "67-56-1" :
                        selectedCompound === "ethanol" ? "64-17-5" :
                        selectedCompound === "propanol" ? "71-23-8" :
                        selectedCompound === "isopropanol" ? "67-63-0" :
                        "71-36-3"
                      }</p>
                      <p><span className="font-medium">IUPAC Name:</span> {
                        selectedCompound === "methanol" ? "Methanol" :
                        selectedCompound === "ethanol" ? "Ethanol" :
                        selectedCompound === "propanol" ? "Propan-1-ol" :
                        selectedCompound === "isopropanol" ? "Propan-2-ol" :
                        "Butan-1-ol"
                      }</p>
                    </div>
                    <div className="flex items-center justify-center border rounded bg-gray-50 dark:bg-gray-700">
                      <div className="text-center p-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">[Molecular structure would appear here]</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="properties" className="p-4 border rounded-md mt-4">
          {selectedCompound ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">
                  Physical Properties - {
                    selectedCompound === "methanol" ? "Methanol" :
                    selectedCompound === "ethanol" ? "Ethanol" :
                    selectedCompound === "propanol" ? "1-Propanol" :
                    selectedCompound === "isopropanol" ? "2-Propanol (Isopropanol)" :
                    "1-Butanol"
                  }
                </h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Export Data
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="border rounded-md p-4 bg-white dark:bg-gray-800">
                  <h4 className="text-sm font-medium mb-3 pb-2 border-b">Thermodynamic Properties</h4>
                  
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b">
                        <td className="py-1.5">Normal Boiling Point</td>
                        <td className="text-right">
                          {selectedCompound === "methanol" ? "64.7" :
                           selectedCompound === "ethanol" ? "78.2" :
                           selectedCompound === "propanol" ? "97.2" :
                           selectedCompound === "isopropanol" ? "82.6" :
                           "117.7"} °C
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1.5">Normal Melting Point</td>
                        <td className="text-right">
                          {selectedCompound === "methanol" ? "-97.6" :
                           selectedCompound === "ethanol" ? "-114.1" :
                           selectedCompound === "propanol" ? "-126.2" :
                           selectedCompound === "isopropanol" ? "-89.5" :
                           "-89.8"} °C
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1.5">Critical Temperature</td>
                        <td className="text-right">
                          {selectedCompound === "methanol" ? "239.4" :
                           selectedCompound === "ethanol" ? "241.6" :
                           selectedCompound === "propanol" ? "263.5" :
                           selectedCompound === "isopropanol" ? "235.2" :
                           "289.9"} °C
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1.5">Critical Pressure</td>
                        <td className="text-right">
                          {selectedCompound === "methanol" ? "8.09" :
                           selectedCompound === "ethanol" ? "6.14" :
                           selectedCompound === "propanol" ? "5.17" :
                           selectedCompound === "isopropanol" ? "4.76" :
                           "4.42"} MPa
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1.5">Critical Volume</td>
                        <td className="text-right">
                          {selectedCompound === "methanol" ? "118" :
                           selectedCompound === "ethanol" ? "167" :
                           selectedCompound === "propanol" ? "219" :
                           selectedCompound === "isopropanol" ? "220" :
                           "275"} cm³/mol
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1.5">Acentric Factor</td>
                        <td className="text-right">
                          {selectedCompound === "methanol" ? "0.559" :
                           selectedCompound === "ethanol" ? "0.645" :
                           selectedCompound === "propanol" ? "0.623" :
                           selectedCompound === "isopropanol" ? "0.665" :
                           "0.589"}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1.5">Standard Enthalpy of Formation</td>
                        <td className="text-right">
                          {selectedCompound === "methanol" ? "-238.4" :
                           selectedCompound === "ethanol" ? "-277.0" :
                           selectedCompound === "propanol" ? "-302.6" :
                           selectedCompound === "isopropanol" ? "-318.1" :
                           "-327.3"} kJ/mol
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1.5">Standard Gibbs Energy</td>
                        <td className="text-right">
                          {selectedCompound === "methanol" ? "-166.6" :
                           selectedCompound === "ethanol" ? "-174.8" :
                           selectedCompound === "propanol" ? "-171.8" :
                           selectedCompound === "isopropanol" ? "-180.3" :
                           "-168.9"} kJ/mol
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="border rounded-md p-4 bg-white dark:bg-gray-800">
                  <h4 className="text-sm font-medium mb-3 pb-2 border-b">Physical Properties</h4>
                  
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b">
                        <td className="py-1.5">Density (20°C)</td>
                        <td className="text-right">
                          {selectedCompound === "methanol" ? "791.8" :
                           selectedCompound === "ethanol" ? "789.3" :
                           selectedCompound === "propanol" ? "803.5" :
                           selectedCompound === "isopropanol" ? "786.3" :
                           "809.8"} kg/m³
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1.5">Dynamic Viscosity (20°C)</td>
                        <td className="text-right">
                          {selectedCompound === "methanol" ? "0.593" :
                           selectedCompound === "ethanol" ? "1.20" :
                           selectedCompound === "propanol" ? "2.26" :
                           selectedCompound === "isopropanol" ? "2.43" :
                           "2.95"} mPa·s
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1.5">Surface Tension (20°C)</td>
                        <td className="text-right">
                          {selectedCompound === "methanol" ? "22.6" :
                           selectedCompound === "ethanol" ? "22.1" :
                           selectedCompound === "propanol" ? "23.7" :
                           selectedCompound === "isopropanol" ? "21.7" :
                           "24.6"} mN/m
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1.5">Refractive Index (20°C)</td>
                        <td className="text-right">
                          {selectedCompound === "methanol" ? "1.3288" :
                           selectedCompound === "ethanol" ? "1.3614" :
                           selectedCompound === "propanol" ? "1.3862" :
                           selectedCompound === "isopropanol" ? "1.3776" :
                           "1.3993"}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1.5">Dielectric Constant (20°C)</td>
                        <td className="text-right">
                          {selectedCompound === "methanol" ? "32.7" :
                           selectedCompound === "ethanol" ? "24.5" :
                           selectedCompound === "propanol" ? "20.8" :
                           selectedCompound === "isopropanol" ? "19.9" :
                           "17.8"}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1.5">Dipole Moment</td>
                        <td className="text-right">
                          {selectedCompound === "methanol" ? "1.70" :
                           selectedCompound === "ethanol" ? "1.69" :
                           selectedCompound === "propanol" ? "1.68" :
                           selectedCompound === "isopropanol" ? "1.66" :
                           "1.66"} D
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1.5">Solubility in Water (20°C)</td>
                        <td className="text-right">
                          {selectedCompound === "methanol" || selectedCompound === "ethanol" ? "Miscible" :
                           selectedCompound === "propanol" || selectedCompound === "isopropanol" ? "Miscible" :
                           "Partially soluble"}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1.5">Flash Point</td>
                        <td className="text-right">
                          {selectedCompound === "methanol" ? "11" :
                           selectedCompound === "ethanol" ? "13" :
                           selectedCompound === "propanol" ? "23" :
                           selectedCompound === "isopropanol" ? "12" :
                           "35"} °C
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="border rounded-md p-4 bg-white dark:bg-gray-800">
                <h4 className="text-sm font-medium mb-3 pb-2 border-b">Temperature-Dependent Properties</h4>
                
                <div className="aspect-video bg-gray-50 dark:bg-gray-700 rounded-md flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">[Property vs. temperature plot would appear here]</p>
                  </div>
                </div>
                
                <div className="flex justify-between mt-4">
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">Vapor Pressure</Button>
                    <Button variant="outline" size="sm">Density</Button>
                    <Button variant="outline" size="sm">Heat Capacity</Button>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Export Chart
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md p-4 bg-white dark:bg-gray-800">
                <h4 className="text-sm font-medium mb-3 pb-2 border-b">Sources & References</h4>
                
                <ul className="space-y-1 text-sm list-disc pl-5">
                  <li>NIST Chemistry WebBook, NIST Standard Reference Database Number 69</li>
                  <li>Perry's Chemical Engineers' Handbook, 9th Edition</li>
                  <li>Yaws, C.L., "Thermophysical Properties of Chemicals and Hydrocarbons", 2nd Edition</li>
                  <li>CRC Handbook of Chemistry and Physics, 101st Edition</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 border rounded-md h-96 bg-gray-50 dark:bg-gray-800">
              <FileText className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No compound selected</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Search for and select a compound in the "Compound Search" tab</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="structure" className="p-4 border rounded-md mt-4">
          <div className="grid grid-cols-5 gap-6">
            <div className="col-span-1 space-y-4">
              <h3 className="font-medium">Drawing Tools</h3>
              
              <div className="border rounded-md p-3 bg-white dark:bg-gray-800 space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Pen className="h-4 w-4 mr-1" />
                  Single Bond
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Pen className="h-4 w-4 mr-1" />
                  Double Bond
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Pen className="h-4 w-4 mr-1" />
                  Triple Bond
                </Button>
                <div className="border-t my-2"></div>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <RotateCw className="h-4 w-4 mr-1" />
                  Rotate
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Layers className="h-4 w-4 mr-1" />
                  Templates
                </Button>
                <div className="border-t my-2"></div>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  C
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  O
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  N
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  S
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  More...
                </Button>
              </div>
              
              <div className="border rounded-md p-3 bg-white dark:bg-gray-800 space-y-3">
                <Label htmlFor="smiles">SMILES String</Label>
                <Textarea 
                  id="smiles" 
                  value={selectedCompound === "methanol" ? "CO" :
                         selectedCompound === "ethanol" ? "CCO" :
                         selectedCompound === "propanol" ? "CCCO" :
                         selectedCompound === "isopropanol" ? "CC(C)O" :
                         selectedCompound === "butanol" ? "CCCCO" : ""}
                  placeholder="Enter SMILES string"
                  className="h-16 resize-none"
                  readOnly={selectedCompound !== null}
                />
                <Button size="sm" className="w-full">
                  Import from SMILES
                </Button>
              </div>
              
              <div className="border rounded-md p-3 bg-white dark:bg-gray-800 space-y-3">
                <Button variant="outline" size="sm" className="w-full">
                  Clear Canvas
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="h-4 w-4 mr-1" />
                  Export Structure
                </Button>
              </div>
            </div>
            
            <div className="col-span-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Structure Editor</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm">
                    <Search className="h-4 w-4 mr-1" />
                    Search by Structure
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md aspect-video bg-white dark:bg-gray-800 flex items-center justify-center p-6">
                {selectedCompound ? (
                  <div className="text-center">
                    <Molecule className="h-20 w-20 mx-auto mb-4 text-blue-500" />
                    <p className="text-gray-500 dark:text-gray-400 mb-2">
                      {selectedCompound === "methanol" ? "Methanol (CH₃OH)" :
                       selectedCompound === "ethanol" ? "Ethanol (C₂H₅OH)" :
                       selectedCompound === "propanol" ? "1-Propanol (C₃H₇OH)" :
                       selectedCompound === "isopropanol" ? "2-Propanol/Isopropanol (C₃H₇OH)" :
                       "1-Butanol (C₄H₉OH)"}
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      [Molecular structure editor would display here]
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      [Structure drawing canvas would appear here]
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                      Use the tools on the left to draw a chemical structure
                    </p>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-md p-4 bg-white dark:bg-gray-800">
                  <h4 className="text-sm font-medium mb-2">Structure Information</h4>
                  
                  {selectedCompound ? (
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Molecular Formula:</span> {
                        selectedCompound === "methanol" ? "CH₄O" :
                        selectedCompound === "ethanol" ? "C₂H₆O" :
                        selectedCompound === "propanol" || selectedCompound === "isopropanol" ? "C₃H₈O" :
                        "C₄H₁₀O"
                      }</p>
                      <p><span className="font-medium">Exact Mass:</span> {
                        selectedCompound === "methanol" ? "32.0262" :
                        selectedCompound === "ethanol" ? "46.0419" :
                        selectedCompound === "propanol" || selectedCompound === "isopropanol" ? "60.0575" :
                        "74.0732"
                      } g/mol</p>
                      <p><span className="font-medium">SMILES:</span> {
                        selectedCompound === "methanol" ? "CO" :
                        selectedCompound === "ethanol" ? "CCO" :
                        selectedCompound === "propanol" ? "CCCO" :
                        selectedCompound === "isopropanol" ? "CC(C)O" :
                        "CCCCO"
                      }</p>
                      <p><span className="font-medium">InChI:</span> {
                        selectedCompound === "methanol" ? "InChI=1S/CH4O/c1-2/h2H,1H3" :
                        selectedCompound === "ethanol" ? "InChI=1S/C2H6O/c1-2-3/h3H,2H2,1H3" :
                        selectedCompound === "propanol" ? "InChI=1S/C3H8O/c1-2-3-4/h4H,2-3H2,1H3" :
                        selectedCompound === "isopropanol" ? "InChI=1S/C3H8O/c1-3(2)4/h3-4H,1-2H3" :
                        "InChI=1S/C4H10O/c1-2-3-4-5/h5H,2-4H2,1H3"
                      }</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Draw or import a structure to see information
                    </p>
                  )}
                </div>
                
                <div className="border rounded-md p-4 bg-white dark:bg-gray-800">
                  <h4 className="text-sm font-medium mb-2">3D Structure</h4>
                  
                  {selectedCompound ? (
                    <div className="h-32 flex items-center justify-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        [3D molecular viewer would appear here]
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Draw or import a structure to generate 3D model
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="prediction" className="p-4 border rounded-md mt-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium">Property Prediction Methods</h3>
              
              <div className="border rounded-md p-4 bg-white dark:bg-gray-800 space-y-3">
                <div>
                  <Label htmlFor="prediction-method">Estimation Method</Label>
                  <Select defaultValue="group">
                    <SelectTrigger id="prediction-method">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="group">Group Contribution</SelectItem>
                      <SelectItem value="qspr">QSPR/QSAR</SelectItem>
                      <SelectItem value="corresponding">Corresponding States</SelectItem>
                      <SelectItem value="ml">Machine Learning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="property-type">Property Type</Label>
                  <Select defaultValue="thermo">
                    <SelectTrigger id="property-type">
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="thermo">Thermodynamic</SelectItem>
                      <SelectItem value="transport">Transport</SelectItem>
                      <SelectItem value="environmental">Environmental</SelectItem>
                      <SelectItem value="safety">Safety</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Properties to Predict</Label>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="pred-bp" defaultChecked />
                      <Label htmlFor="pred-bp" className="text-sm">Boiling Point</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="pred-mp" defaultChecked />
                      <Label htmlFor="pred-mp" className="text-sm">Melting Point</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="pred-cp" defaultChecked />
                      <Label htmlFor="pred-cp" className="text-sm">Heat Capacity</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="pred-antoine" defaultChecked />
                      <Label htmlFor="pred-antoine" className="text-sm">Antoine Parameters</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="pred-viscosity" />
                      <Label htmlFor="pred-viscosity" className="text-sm">Viscosity</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="pred-conductivity" />
                      <Label htmlFor="pred-conductivity" className="text-sm">Thermal Conductivity</Label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="temperature">Temperature</Label>
                  <Input id="temperature" defaultValue="298.15" />
                  <p className="text-xs text-gray-500 mt-1">K</p>
                </div>
                
                <div>
                  <Label htmlFor="pressure">Pressure</Label>
                  <Input id="pressure" defaultValue="101.325" />
                  <p className="text-xs text-gray-500 mt-1">kPa</p>
                </div>
                
                <div className="pt-2">
                  <Button className="w-full">
                    <Play className="h-4 w-4 mr-1" />
                    Predict Properties
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md p-4 bg-white dark:bg-gray-800">
                <h4 className="text-sm font-medium mb-3">Estimation Methods Information</h4>
                
                <div className="text-sm space-y-2">
                  <p><span className="font-medium">Group Contribution:</span> Estimates properties based on the contribution of functional groups in the molecule (Joback, Lydersen, Benson methods).</p>
                  <p><span className="font-medium">QSPR/QSAR:</span> Quantitative Structure-Property/Activity Relationships correlate molecular descriptors with properties.</p>
                  <p><span className="font-medium">Corresponding States:</span> Uses reduced properties and the principle of corresponding states for predictions.</p>
                  <p><span className="font-medium">Machine Learning:</span> Applies trained ML models on molecular features to predict properties.</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">Prediction Results</h3>
              
              {selectedCompound ? (
                <div className="border rounded-md p-4 bg-white dark:bg-gray-800">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-medium">
                      {selectedCompound === "methanol" ? "Methanol" :
                       selectedCompound === "ethanol" ? "Ethanol" :
                       selectedCompound === "propanol" ? "1-Propanol" :
                       selectedCompound === "isopropanol" ? "2-Propanol (Isopropanol)" :
                       "1-Butanol"}
                    </h4>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Export Results
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h5 className="text-sm font-medium mb-2">Predicted Thermodynamic Properties</h5>
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left pb-2">Property</th>
                            <th className="text-right pb-2">Predicted Value</th>
                            <th className="text-right pb-2">Experimental</th>
                            <th className="text-right pb-2">Error (%)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-1.5">Normal Boiling Point</td>
                            <td className="text-right">
                              {selectedCompound === "methanol" ? "63.9" :
                               selectedCompound === "ethanol" ? "77.1" :
                               selectedCompound === "propanol" ? "96.5" :
                               selectedCompound === "isopropanol" ? "81.3" :
                               "116.9"} °C
                            </td>
                            <td className="text-right">
                              {selectedCompound === "methanol" ? "64.7" :
                               selectedCompound === "ethanol" ? "78.2" :
                               selectedCompound === "propanol" ? "97.2" :
                               selectedCompound === "isopropanol" ? "82.6" :
                               "117.7"} °C
                            </td>
                            <td className="text-right">
                              {selectedCompound === "methanol" ? "1.2" :
                               selectedCompound === "ethanol" ? "1.4" :
                               selectedCompound === "propanol" ? "0.7" :
                               selectedCompound === "isopropanol" ? "1.6" :
                               "0.7"}%
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-1.5">Normal Melting Point</td>
                            <td className="text-right">
                              {selectedCompound === "methanol" ? "-95.1" :
                               selectedCompound === "ethanol" ? "-112.3" :
                               selectedCompound === "propanol" ? "-124.7" :
                               selectedCompound === "isopropanol" ? "-91.8" :
                               "-88.2"} °C
                            </td>
                            <td className="text-right">
                              {selectedCompound === "methanol" ? "-97.6" :
                               selectedCompound === "ethanol" ? "-114.1" :
                               selectedCompound === "propanol" ? "-126.2" :
                               selectedCompound === "isopropanol" ? "-89.5" :
                               "-89.8"} °C
                            </td>
                            <td className="text-right">
                              {selectedCompound === "methanol" ? "2.6" :
                               selectedCompound === "ethanol" ? "1.6" :
                               selectedCompound === "propanol" ? "1.2" :
                               selectedCompound === "isopropanol" ? "2.6" :
                               "1.8"}%
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-1.5">Heat Capacity (liq, 298K)</td>
                            <td className="text-right">
                              {selectedCompound === "methanol" ? "79.8" :
                               selectedCompound === "ethanol" ? "112.4" :
                               selectedCompound === "propanol" ? "144.2" :
                               selectedCompound === "isopropanol" ? "149.5" :
                               "176.3"} J/(mol·K)
                            </td>
                            <td className="text-right">
                              {selectedCompound === "methanol" ? "81.6" :
                               selectedCompound === "ethanol" ? "114.8" :
                               selectedCompound === "propanol" ? "146.7" :
                               selectedCompound === "isopropanol" ? "152.6" :
                               "177.9"} J/(mol·K)
                            </td>
                            <td className="text-right">
                              {selectedCompound === "methanol" ? "2.2" :
                               selectedCompound === "ethanol" ? "2.1" :
                               selectedCompound === "propanol" ? "1.7" :
                               selectedCompound === "isopropanol" ? "2.0" :
                               "0.9"}%
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium mb-2">Antoine Parameters</h5>
                      <div className="text-sm">
                        <p className="mb-2">log₁₀(P) = A - B/(T + C) where P is in mmHg and T is in °C</p>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-gray-500 dark:text-gray-400">A:</p>
                            <p className="font-medium">
                              {selectedCompound === "methanol" ? "7.8975" :
                               selectedCompound === "ethanol" ? "8.3211" :
                               selectedCompound === "propanol" ? "8.3761" :
                               selectedCompound === "isopropanol" ? "8.4532" :
                               "8.6342"}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-gray-400">B:</p>
                            <p className="font-medium">
                              {selectedCompound === "methanol" ? "1582.271" :
                               selectedCompound === "ethanol" ? "1718.643" :
                               selectedCompound === "propanol" ? "1802.169" :
                               selectedCompound === "isopropanol" ? "1793.684" :
                               "1889.897"}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-gray-400">C:</p>
                            <p className="font-medium">
                              {selectedCompound === "methanol" ? "239.726" :
                               selectedCompound === "ethanol" ? "237.217" :
                               selectedCompound === "propanol" ? "225.373" :
                               selectedCompound === "isopropanol" ? "233.294" :
                               "221.523"}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Valid temperature range: -10°C to 100°C</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 border rounded-md h-96 bg-gray-50 dark:bg-gray-800">
                  <Molecule className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No compound selected</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    Select a compound and run predictions to see results
                  </p>
                </div>
              )}
              
              <div className="border rounded-md p-4 bg-white dark:bg-gray-800">
                <h4 className="text-sm font-medium mb-3">Reliability Analysis</h4>
                
                {selectedCompound ? (
                  <div className="space-y-3 text-sm">
                    <p>The predictions were generated using the Group Contribution method and have an average deviation of 1.8% from experimental values. The reliability of the predictions is highest for boiling point (confidence 92%) and heat capacity (confidence 90%), with somewhat lower confidence for melting point predictions (confidence 82%).</p>
                    <p>The alcohol family compounds generally show good predictability with group contribution methods due to well-established group parameters for hydroxyl and alkyl groups.</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Run predictions to see reliability analysis
                  </p>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChemicalDatabaseInterface;
