
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Settings, Activity, Thermometer, Droplet, BarChart3, Waves,
  GitCommit, GitGraph, Atom, AlertTriangle, ReceiptText, Box, Check
} from "lucide-react";
import { Badge } from '@/components/ui/badge';

interface AdvancedEquipmentAnalysisProps {
  equipmentType: string;
  componentList: string[];
}

const AdvancedEquipmentAnalysis: React.FC<AdvancedEquipmentAnalysisProps> = ({
  equipmentType,
  componentList
}) => {
  const [activeTab, setActiveTab] = useState('properties');
  const [currentMode, setCurrentMode] = useState('operating');
  
  // Generate dummy data based on equipment type and components
  const generatePropertyData = () => {
    const props: Record<string, string | number> = {
      "Pressure": `${Math.floor(Math.random() * 100) + 100} kPa`,
      "Temperature": `${Math.floor(Math.random() * 150) + 50} °C`,
      "Flow Rate": `${Math.floor(Math.random() * 1000) + 500} kg/h`,
      "Vapor Fraction": `${(Math.random() * 0.5).toFixed(3)}`,
      "Liquid Fraction": `${(1 - Math.random() * 0.5).toFixed(3)}`,
      "Heat Duty": `${Math.floor(Math.random() * 2000) - 1000} kW`,
      "Efficiency": `${Math.floor(Math.random() * 30) + 70}%`,
      "LMTD": `${Math.floor(Math.random() * 50) + 20} °C`,
      "UA": `${Math.floor(Math.random() * 5000) + 1000} W/K`,
      "Reynolds Number": `${Math.floor(Math.random() * 100000) + 10000}`,
      "Pressure Drop": `${(Math.random() * 100).toFixed(2)} kPa`,
    };
    
    // Add equipment specific properties
    if (equipmentType.includes("heat-exchanger")) {
      props["Heat Transfer Coefficient"] = `${Math.floor(Math.random() * 500) + 300} W/m²·K`;
      props["Heat Transfer Area"] = `${Math.floor(Math.random() * 100) + 20} m²`;
      props["Tube Side Velocity"] = `${(Math.random() * 3 + 1).toFixed(2)} m/s`;
      props["Shell Side Velocity"] = `${(Math.random() * 2 + 0.5).toFixed(2)} m/s`;
      props["Fouling Factor"] = `${(Math.random() * 0.0005 + 0.0001).toFixed(6)} m²·K/W`;
      props["Number of Tube Passes"] = Math.floor(Math.random() * 6) + 1;
      props["Number of Shell Passes"] = Math.floor(Math.random() * 2) + 1;
      props["Tube Diameter"] = `${(Math.random() * 0.05 + 0.01).toFixed(4)} m`;
      props["Shell Diameter"] = `${(Math.random() * 1.5 + 0.5).toFixed(3)} m`;
      props["Baffle Spacing"] = `${(Math.random() * 0.5 + 0.2).toFixed(3)} m`;
      props["Baffle Cut"] = `${Math.floor(Math.random() * 15) + 20}%`;
    } else if (equipmentType.includes("column") || equipmentType.includes("distillation")) {
      props["Number of Trays"] = Math.floor(Math.random() * 40) + 10;
      props["Feed Tray"] = Math.floor(Math.random() * 20) + 5;
      props["Reflux Ratio"] = (Math.random() * 5 + 1).toFixed(2);
      props["Boilup Ratio"] = (Math.random() * 3 + 0.5).toFixed(2);
      props["Condenser Duty"] = `${-(Math.floor(Math.random() * 1000) + 200)} kW`;
      props["Reboiler Duty"] = `${Math.floor(Math.random() * 1200) + 300} kW`;
      props["Column Diameter"] = `${(Math.random() * 3 + 1).toFixed(2)} m`;
      props["Column Height"] = `${(Math.random() * 30 + 10).toFixed(2)} m`;
      props["HETP"] = `${(Math.random() * 0.5 + 0.3).toFixed(2)} m`;
      props["Tray Efficiency"] = `${Math.floor(Math.random() * 30) + 60}%`;
      props["Condenser Temperature"] = `${Math.floor(Math.random() * 30) + 30} °C`;
      props["Reboiler Temperature"] = `${Math.floor(Math.random() * 50) + 100} °C`;
      props["Bottoms Flow Rate"] = `${Math.floor(Math.random() * 500) + 200} kg/h`;
      props["Distillate Flow Rate"] = `${Math.floor(Math.random() * 500) + 100} kg/h`;
    } else if (equipmentType.includes("reactor")) {
      props["Conversion"] = `${Math.floor(Math.random() * 30) + 70}%`;
      props["Selectivity"] = `${Math.floor(Math.random() * 15) + 85}%`;
      props["Yield"] = `${Math.floor(Math.random() * 25) + 75}%`;
      props["Residence Time"] = `${(Math.random() * 60 + 10).toFixed(1)} min`;
      props["Volume"] = `${(Math.random() * 20 + 5).toFixed(2)} m³`;
      props["Reaction Rate"] = `${(Math.random() * 0.1 + 0.01).toFixed(4)} mol/L·s`;
      props["Activation Energy"] = `${Math.floor(Math.random() * 50000) + 30000} J/mol`;
      props["Pre-exponential Factor"] = `${(Math.random() * 1e6 + 1e5).toExponential(3)} 1/s`;
      props["Heat of Reaction"] = `${-(Math.floor(Math.random() * 50000) + 10000)} J/mol`;
      props["Catalyst Amount"] = `${(Math.random() * 500 + 100).toFixed(1)} kg`;
      props["Catalyst Life"] = `${Math.floor(Math.random() * 12) + 6} months`;
    } else if (equipmentType.includes("pump") || equipmentType.includes("compressor")) {
      props["Head"] = `${Math.floor(Math.random() * 100) + 20} m`;
      props["Power"] = `${Math.floor(Math.random() * 500) + 100} kW`;
      props["NPSH Available"] = `${Math.floor(Math.random() * 10) + 5} m`;
      props["NPSH Required"] = `${Math.floor(Math.random() * 3) + 1} m`;
      props["Efficiency"] = `${Math.floor(Math.random() * 20) + 75}%`;
      props["Shaft Speed"] = `${Math.floor(Math.random() * 1000) + 2000} RPM`;
      props["Specific Speed"] = Math.floor(Math.random() * 3000) + 1000;
      props["Impeller Diameter"] = `${(Math.random() * 0.3 + 0.2).toFixed(3)} m`;
      props["Number of Stages"] = Math.floor(Math.random() * 5) + 1;
      props["Suction Pressure"] = `${Math.floor(Math.random() * 100) + 100} kPa`;
      props["Discharge Pressure"] = `${Math.floor(Math.random() * 500) + 200} kPa`;
      props["Pressure Ratio"] = (Math.random() * 4 + 1.5).toFixed(2);
    } else if (equipmentType.includes("flash") || equipmentType.includes("drum")) {
      props["Liquid Level"] = `${Math.floor(Math.random() * 50) + 25}%`;
      props["Vapor Space"] = `${Math.floor(Math.random() * 30) + 20}%`;
      props["Liquid Holdup"] = `${(Math.random() * 10 + 2).toFixed(2)} m³`;
      props["Vessel Diameter"] = `${(Math.random() * 3 + 1).toFixed(2)} m`;
      props["Vessel Length"] = `${(Math.random() * 10 + 3).toFixed(2)} m`;
      props["Vapor Velocity"] = `${(Math.random() * 1 + 0.5).toFixed(3)} m/s`;
      props["Liquid Residence Time"] = `${(Math.random() * 600 + 300).toFixed(0)} s`;
      props["Design Pressure"] = `${Math.floor(Math.random() * 200) + 150} kPa`;
      props["Wall Thickness"] = `${(Math.random() * 0.05 + 0.01).toFixed(3)} m`;
      props["Level Control"] = Math.random() > 0.5 ? "PID" : "On/Off";
      props["Relief Size"] = `${Math.floor(Math.random() * 4) + 2} inch`;
    }
    
    return props;
  };

  const generateComponentData = () => {
    return componentList.map(component => ({
      name: component,
      molarFlow: (Math.random() * 100 + 10).toFixed(2),
      massFlow: (Math.random() * 500 + 100).toFixed(2),
      molarFraction: (Math.random() * 0.5 + 0.1).toFixed(4),
      massFraction: (Math.random() * 0.5 + 0.1).toFixed(4),
      liquidFraction: (Math.random() * 0.8 + 0.2).toFixed(4),
      vaporFraction: (Math.random() * 0.5).toFixed(4),
    }));
  };

  const propertyData = generatePropertyData();
  const componentData = generateComponentData();
  
  // Safety and design data
  const safetyData = {
    operatingPressureMax: `${Math.floor(Math.random() * 500) + 200} kPa`,
    operatingPressureMin: `${Math.floor(Math.random() * 50) + 50} kPa`,
    operatingTempMax: `${Math.floor(Math.random() * 100) + 100} °C`,
    operatingTempMin: `${Math.floor(Math.random() * 30) + 20} °C`,
    pressureRating: `${Math.floor(Math.random() * 1000) + 500} kPa`,
    tempRating: `${Math.floor(Math.random() * 200) + 150} °C`,
    materialOfConstruction: ["Carbon Steel", "Stainless Steel 316", "Hastelloy C", "Inconel"][Math.floor(Math.random() * 4)],
    corrosionAllowance: `${(Math.random() * 5 + 1).toFixed(1)} mm`,
    designCode: ["ASME VIII", "API 650", "API 510", "TEMA", "API 560"][Math.floor(Math.random() * 5)],
    inspectionInterval: `${Math.floor(Math.random() * 4) + 2} years`,
    pressureTestDate: "2024-03-15",
    reliefValvePressure: `${Math.floor(Math.random() * 100) + 400} kPa`,
    reliefValveCapacity: `${Math.floor(Math.random() * 5000) + 2000} kg/h`,
  };

  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">
          {equipmentType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Analysis
        </h3>
        <div className="flex space-x-2">
          <Select value={currentMode} onValueChange={setCurrentMode}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="operating">Operating</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 lg:grid-cols-6 mb-4">
          <TabsTrigger value="properties">
            <Settings className="h-4 w-4 mr-1" /> Properties
          </TabsTrigger>
          <TabsTrigger value="streams">
            <GitGraph className="h-4 w-4 mr-1" /> Streams
          </TabsTrigger>
          <TabsTrigger value="components">
            <Atom className="h-4 w-4 mr-1" /> Components
          </TabsTrigger>
          <TabsTrigger value="performance">
            <Activity className="h-4 w-4 mr-1" /> Performance
          </TabsTrigger>
          <TabsTrigger value="safety">
            <AlertTriangle className="h-4 w-4 mr-1" /> Safety
          </TabsTrigger>
          <TabsTrigger value="economics">
            <ReceiptText className="h-4 w-4 mr-1" /> Economics
          </TabsTrigger>
        </TabsList>

        <div className="border rounded-lg p-4 bg-gray-50">
          {/* Properties Tab */}
          <TabsContent value="properties" className="space-y-4 mt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(propertyData).map(([key, value]) => (
                <div key={key} className="bg-white p-3 rounded shadow-sm">
                  <div className="text-sm text-gray-500">{key}</div>
                  <div className="font-medium">{value}</div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Streams Tab */}
          <TabsContent value="streams" className="mt-0">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">Stream</th>
                    <th className="border p-2 text-left">Type</th>
                    <th className="border p-2 text-left">Temp (°C)</th>
                    <th className="border p-2 text-left">Press (kPa)</th>
                    <th className="border p-2 text-left">Flow (kg/h)</th>
                    <th className="border p-2 text-left">Phase</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2">Feed</td>
                    <td className="border p-2">Inlet</td>
                    <td className="border p-2">{Math.floor(Math.random() * 100) + 50}</td>
                    <td className="border p-2">{Math.floor(Math.random() * 200) + 100}</td>
                    <td className="border p-2">{Math.floor(Math.random() * 1000) + 500}</td>
                    <td className="border p-2">
                      <Badge variant="outline">Mixed</Badge>
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-2">Product</td>
                    <td className="border p-2">Outlet</td>
                    <td className="border p-2">{Math.floor(Math.random() * 100) + 50}</td>
                    <td className="border p-2">{Math.floor(Math.random() * 200) + 100}</td>
                    <td className="border p-2">{Math.floor(Math.random() * 1000) + 500}</td>
                    <td className="border p-2">
                      <Badge variant="outline">Liquid</Badge>
                    </td>
                  </tr>
                  {equipmentType.includes("heat-exchanger") && (
                    <>
                      <tr>
                        <td className="border p-2">Hot In</td>
                        <td className="border p-2">Inlet</td>
                        <td className="border p-2">{Math.floor(Math.random() * 50) + 100}</td>
                        <td className="border p-2">{Math.floor(Math.random() * 200) + 100}</td>
                        <td className="border p-2">{Math.floor(Math.random() * 1000) + 500}</td>
                        <td className="border p-2">
                          <Badge variant="outline">Vapor</Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="border p-2">Hot Out</td>
                        <td className="border p-2">Outlet</td>
                        <td className="border p-2">{Math.floor(Math.random() * 30) + 50}</td>
                        <td className="border p-2">{Math.floor(Math.random() * 180) + 100}</td>
                        <td className="border p-2">{Math.floor(Math.random() * 1000) + 500}</td>
                        <td className="border p-2">
                          <Badge variant="outline">Vapor</Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="border p-2">Cold In</td>
                        <td className="border p-2">Inlet</td>
                        <td className="border p-2">{Math.floor(Math.random() * 20) + 20}</td>
                        <td className="border p-2">{Math.floor(Math.random() * 200) + 100}</td>
                        <td className="border p-2">{Math.floor(Math.random() * 1000) + 500}</td>
                        <td className="border p-2">
                          <Badge variant="outline">Liquid</Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="border p-2">Cold Out</td>
                        <td className="border p-2">Outlet</td>
                        <td className="border p-2">{Math.floor(Math.random() * 30) + 60}</td>
                        <td className="border p-2">{Math.floor(Math.random() * 180) + 100}</td>
                        <td className="border p-2">{Math.floor(Math.random() * 1000) + 500}</td>
                        <td className="border p-2">
                          <Badge variant="outline">Liquid</Badge>
                        </td>
                      </tr>
                    </>
                  )}
                  {(equipmentType.includes("column") || equipmentType.includes("distillation")) && (
                    <>
                      <tr>
                        <td className="border p-2">Distillate</td>
                        <td className="border p-2">Outlet</td>
                        <td className="border p-2">{Math.floor(Math.random() * 20) + 40}</td>
                        <td className="border p-2">{Math.floor(Math.random() * 50) + 100}</td>
                        <td className="border p-2">{Math.floor(Math.random() * 500) + 100}</td>
                        <td className="border p-2">
                          <Badge variant="outline">Liquid</Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="border p-2">Bottoms</td>
                        <td className="border p-2">Outlet</td>
                        <td className="border p-2">{Math.floor(Math.random() * 50) + 100}</td>
                        <td className="border p-2">{Math.floor(Math.random() * 100) + 110}</td>
                        <td className="border p-2">{Math.floor(Math.random() * 500) + 200}</td>
                        <td className="border p-2">
                          <Badge variant="outline">Liquid</Badge>
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Components Tab */}
          <TabsContent value="components" className="mt-0">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">Component</th>
                    <th className="border p-2 text-left">Molar Flow (kmol/h)</th>
                    <th className="border p-2 text-left">Mass Flow (kg/h)</th>
                    <th className="border p-2 text-left">Mole Frac</th>
                    <th className="border p-2 text-left">Mass Frac</th>
                    <th className="border p-2 text-left">Liquid Frac</th>
                    <th className="border p-2 text-left">Vapor Frac</th>
                  </tr>
                </thead>
                <tbody>
                  {componentData.map((component, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="border p-2">{component.name}</td>
                      <td className="border p-2">{component.molarFlow}</td>
                      <td className="border p-2">{component.massFlow}</td>
                      <td className="border p-2">{component.molarFraction}</td>
                      <td className="border p-2">{component.massFraction}</td>
                      <td className="border p-2">{component.liquidFraction}</td>
                      <td className="border p-2">{component.vaporFraction}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded shadow-sm">
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <BarChart3 className="h-4 w-4 mr-1 text-blue-600" />
                  Performance Metrics
                </h4>
                <div className="space-y-3">
                  {equipmentType.includes("heat-exchanger") && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Overall Heat Transfer Coefficient:</span>
                        <span className="font-medium">{Math.floor(Math.random() * 500) + 300} W/m²·K</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Thermal Effectiveness:</span>
                        <span className="font-medium">{Math.floor(Math.random() * 40) + 60}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">NTU:</span>
                        <span className="font-medium">{(Math.random() * 5 + 1).toFixed(2)}</span>
                      </div>
                    </>
                  )}
                  {equipmentType.includes("reactor") && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Reactor Conversion:</span>
                        <span className="font-medium">{Math.floor(Math.random() * 30) + 70}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Selectivity:</span>
                        <span className="font-medium">{Math.floor(Math.random() * 20) + 80}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Catalyst Activity:</span>
                        <span className="font-medium">{Math.floor(Math.random() * 30) + 70}%</span>
                      </div>
                    </>
                  )}
                  {(equipmentType.includes("column") || equipmentType.includes("distillation")) && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Product Purity:</span>
                        <span className="font-medium">{Math.floor(Math.random() * 10) + 90}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Recovery:</span>
                        <span className="font-medium">{Math.floor(Math.random() * 15) + 85}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Tray Efficiency:</span>
                        <span className="font-medium">{Math.floor(Math.random() * 30) + 70}%</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Energy Efficiency:</span>
                    <span className="font-medium">{Math.floor(Math.random() * 30) + 70}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Operating Cost:</span>
                    <span className="font-medium">${Math.floor(Math.random() * 500) + 200}/hr</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded shadow-sm">
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <Thermometer className="h-4 w-4 mr-1 text-red-600" />
                  Operating Conditions
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Pressure:</span>
                    <span className="font-medium">{Math.floor(Math.random() * 900) + 100} kPa</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Temperature:</span>
                    <span className="font-medium">{Math.floor(Math.random() * 150) + 50} °C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Flow Rate:</span>
                    <span className="font-medium">{Math.floor(Math.random() * 2000) + 500} kg/h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Capacity Utilization:</span>
                    <span className="font-medium">{Math.floor(Math.random() * 40) + 60}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Operating Mode:</span>
                    <span className="font-medium">{Math.random() > 0.7 ? 'Batch' : 'Continuous'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 bg-white p-4 rounded shadow-sm">
              <h4 className="text-sm font-medium mb-2">Performance Optimization</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <span className="block text-sm text-gray-600 mb-1">Target Value:</span>
                  <Input value={`${Math.floor(Math.random() * 50) + 50}`} />
                </div>
                <div>
                  <span className="block text-sm text-gray-600 mb-1">Optimization Parameter:</span>
                  <Select defaultValue="temperature">
                    <SelectTrigger>
                      <SelectValue placeholder="Select parameter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="temperature">Temperature</SelectItem>
                      <SelectItem value="pressure">Pressure</SelectItem>
                      <SelectItem value="flowRate">Flow Rate</SelectItem>
                      <SelectItem value="catalyst">Catalyst Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button className="w-full">Optimize</Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Safety Tab */}
          <TabsContent value="safety" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded shadow-sm space-y-3">
                <h4 className="text-sm font-medium mb-2">Design & Operating Limits</h4>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Max Operating Pressure:</span>
                  <span className="font-medium">{safetyData.operatingPressureMax}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Min Operating Pressure:</span>
                  <span className="font-medium">{safetyData.operatingPressureMin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Max Operating Temperature:</span>
                  <span className="font-medium">{safetyData.operatingTempMax}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Min Operating Temperature:</span>
                  <span className="font-medium">{safetyData.operatingTempMin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Pressure Rating:</span>
                  <span className="font-medium">{safetyData.pressureRating}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Temperature Rating:</span>
                  <span className="font-medium">{safetyData.tempRating}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Material of Construction:</span>
                  <span className="font-medium">{safetyData.materialOfConstruction}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Corrosion Allowance:</span>
                  <span className="font-medium">{safetyData.corrosionAllowance}</span>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded shadow-sm space-y-3">
                <h4 className="text-sm font-medium mb-2">Safety Features</h4>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Design Code:</span>
                  <span className="font-medium">{safetyData.designCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Inspection Interval:</span>
                  <span className="font-medium">{safetyData.inspectionInterval}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Last Pressure Test:</span>
                  <span className="font-medium">{safetyData.pressureTestDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Relief Valve Set Pressure:</span>
                  <span className="font-medium">{safetyData.reliefValvePressure}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Relief Valve Capacity:</span>
                  <span className="font-medium">{safetyData.reliefValveCapacity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Safety Instrumented System:</span>
                  <span className="font-medium">SIL 2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Overpressure Protection:</span>
                  <span className="font-medium">PSV, Rupture Disk</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Temperature Protection:</span>
                  <span className="font-medium">High Temp Alarm, Shutdown</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 bg-white p-4 rounded shadow-sm">
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1 text-amber-600" />
                Safety Alerts
              </h4>
              <div className="space-y-2">
                <div className="p-2 bg-amber-50 border border-amber-200 rounded-md flex items-center">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                  <span className="text-sm">Operating pressure is at 85% of design maximum</span>
                </div>
                <div className="p-2 bg-green-50 border border-green-200 rounded-md flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">All safety systems functioning normally</span>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Economics Tab */}
          <TabsContent value="economics" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded shadow-sm">
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <Box className="h-4 w-4 mr-1 text-blue-600" />
                  Capital Costs
                </h4>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Equipment Cost:</span>
                    <span className="font-medium">${(Math.random() * 500000 + 100000).toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Installation Cost:</span>
                    <span className="font-medium">${(Math.random() * 200000 + 50000).toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Piping & Instrumentation:</span>
                    <span className="font-medium">${(Math.random() * 150000 + 30000).toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Electrical Systems:</span>
                    <span className="font-medium">${(Math.random() * 100000 + 20000).toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                  </div>
                  <div className="flex justify-between font-medium pt-2 border-t">
                    <span>Total Capital Cost:</span>
                    <span>${(Math.random() * 950000 + 200000).toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded shadow-sm">
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <ReceiptText className="h-4 w-4 mr-1 text-green-600" />
                  Operating Costs
                </h4>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Utilities:</span>
                    <span className="font-medium">${(Math.random() * 50000 + 10000).toLocaleString(undefined, {maximumFractionDigits: 0})}/year</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Maintenance:</span>
                    <span className="font-medium">${(Math.random() * 40000 + 5000).toLocaleString(undefined, {maximumFractionDigits: 0})}/year</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Labor:</span>
                    <span className="font-medium">${(Math.random() * 80000 + 20000).toLocaleString(undefined, {maximumFractionDigits: 0})}/year</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Raw Materials:</span>
                    <span className="font-medium">${(Math.random() * 200000 + 50000).toLocaleString(undefined, {maximumFractionDigits: 0})}/year</span>
                  </div>
                  <div className="flex justify-between font-medium pt-2 border-t">
                    <span>Total Operating Cost:</span>
                    <span>${(Math.random() * 370000 + 85000).toLocaleString(undefined, {maximumFractionDigits: 0})}/year</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 bg-white p-4 rounded shadow-sm">
              <h4 className="text-sm font-medium mb-2">Economic Analysis</h4>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-gray-50 rounded-md">
                  <div className="text-sm text-gray-600">ROI</div>
                  <div className="text-lg font-medium">{Math.floor(Math.random() * 15) + 10}%</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <div className="text-sm text-gray-600">Payback Period</div>
                  <div className="text-lg font-medium">{(Math.random() * 4 + 2).toFixed(1)} years</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <div className="text-sm text-gray-600">NPV</div>
                  <div className="text-lg font-medium">${(Math.random() * 2000000 + 500000).toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <div className="text-sm text-gray-600">IRR</div>
                  <div className="text-lg font-medium">{Math.floor(Math.random() * 12) + 8}%</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default AdvancedEquipmentAnalysis;
