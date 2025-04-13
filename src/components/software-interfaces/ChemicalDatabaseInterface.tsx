
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Search, Download, Save, RotateCw, FileText, Pen, Layers, Flask } from "lucide-react";

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

  const renderSoftwareInterface = (software: any) => {
    switch (software.category) {
      case "process-simulation":
        return <ProcessSimulationInterface software={software} />;
      case "thermodynamic":
        return <ThermodynamicInterface software={software} />;
      case "reaction-engineering":
        return <ReactionEngineeringInterface software={software} />;
      case "data-analysis":
        return <DataAnalysisInterface software={software} />;
      case "process-control":
        return <ProcessControlInterface software={software} />;
      case "equipment-design":
        return <EquipmentDesignInterface software={software} />;
      case "piping-design":
        return <PipingDesignInterface software={software} />;
      case "environmental-safety":
        return <EnvironmentalSafetyInterface software={software} />;
      case "cfd":
        return <CFDInterface software={software} />;
      case "chemical-database":
        return <ChemicalDatabaseInterface software={software} />;
      case "miscellaneous":
        return <MiscellaneousToolsInterface software={software} />;
      default:
        return <div>Software interface not available</div>;
    }
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
                    <Flask className="h-20 w-20 mx-auto mb-4 text-blue-500" />
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
                {/* Placeholder for additional structure-related content */}
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="prediction" className="p-4 border rounded-md mt-4">
          <div className="flex flex-col items-center justify-center p-12 border rounded-md h-96 bg-gray-50 dark:bg-gray-800">
            <Flask className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Property Prediction Tool</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">This feature will be available in a future update</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChemicalDatabaseInterface;
