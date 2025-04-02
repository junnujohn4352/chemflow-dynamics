
import React from 'react';
import GlassPanel from "@/components/ui/GlassPanel";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Thermometer, Droplets, Zap, Waves, Activity } from "lucide-react";

interface StreamDataPanelProps {
  stream?: any;
  selectedComponents: string[];
}

const StreamDataPanel: React.FC<StreamDataPanelProps> = ({ stream, selectedComponents }) => {
  const defaultStream = {
    name: "Feed Stream",
    temperature: 25,
    pressure: 101.325,
    vaporFraction: 0,
    totalFlow: 100,
    components: selectedComponents.reduce((acc, comp) => {
      acc[comp] = 100 / selectedComponents.length;
      return acc;
    }, {} as Record<string, number>),
    properties: {
      density: 850,
      viscosity: 0.5,
      enthalpy: -250,
      entropy: 75,
      molecularWeight: 40,
      thermalConductivity: 0.1,
      heatCapacity: 2.1,
      zFactor: 0.95
    }
  };

  const streamData = stream || defaultStream;

  return (
    <GlassPanel className="mt-4 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{streamData.name}</h3>
      </div>

      <Tabs defaultValue="conditions">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="conditions">
            <Thermometer className="h-4 w-4 mr-2" />
            Conditions
          </TabsTrigger>
          <TabsTrigger value="composition">
            <Droplets className="h-4 w-4 mr-2" />
            Composition
          </TabsTrigger>
          <TabsTrigger value="properties">
            <Waves className="h-4 w-4 mr-2" />
            Properties
          </TabsTrigger>
          <TabsTrigger value="energy">
            <Zap className="h-4 w-4 mr-2" />
            Energy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="conditions" className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded-md shadow-sm">
              <div className="text-sm text-gray-500">Temperature</div>
              <div className="text-lg font-semibold">{streamData.temperature} °C</div>
            </div>
            <div className="bg-white p-3 rounded-md shadow-sm">
              <div className="text-sm text-gray-500">Pressure</div>
              <div className="text-lg font-semibold">{streamData.pressure} kPa</div>
            </div>
            <div className="bg-white p-3 rounded-md shadow-sm">
              <div className="text-sm text-gray-500">Vapor Fraction</div>
              <div className="text-lg font-semibold">{streamData.vaporFraction}</div>
            </div>
            <div className="bg-white p-3 rounded-md shadow-sm">
              <div className="text-sm text-gray-500">Total Flow</div>
              <div className="text-lg font-semibold">{streamData.totalFlow} kg/h</div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="composition">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Component</TableHead>
                <TableHead>Mass Fraction (%)</TableHead>
                <TableHead>Mole Fraction (%)</TableHead>
                <TableHead>Flow (kg/h)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(streamData.components).map(([component, fraction]: [string, any]) => (
                <TableRow key={component}>
                  <TableCell className="font-medium">{component}</TableCell>
                  <TableCell>{fraction.toFixed(2)}</TableCell>
                  <TableCell>{(fraction * 0.9).toFixed(2)}</TableCell>
                  <TableCell>{(fraction * streamData.totalFlow / 100).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="properties" className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded-md shadow-sm">
              <div className="text-sm text-gray-500">Density</div>
              <div className="text-lg font-semibold">{streamData.properties.density} kg/m³</div>
            </div>
            <div className="bg-white p-3 rounded-md shadow-sm">
              <div className="text-sm text-gray-500">Viscosity</div>
              <div className="text-lg font-semibold">{streamData.properties.viscosity} cP</div>
            </div>
            <div className="bg-white p-3 rounded-md shadow-sm">
              <div className="text-sm text-gray-500">Molecular Weight</div>
              <div className="text-lg font-semibold">{streamData.properties.molecularWeight} g/mol</div>
            </div>
            <div className="bg-white p-3 rounded-md shadow-sm">
              <div className="text-sm text-gray-500">Z Factor</div>
              <div className="text-lg font-semibold">{streamData.properties.zFactor}</div>
            </div>
            <div className="bg-white p-3 rounded-md shadow-sm">
              <div className="text-sm text-gray-500">Thermal Conductivity</div>
              <div className="text-lg font-semibold">{streamData.properties.thermalConductivity} W/m·K</div>
            </div>
            <div className="bg-white p-3 rounded-md shadow-sm">
              <div className="text-sm text-gray-500">Heat Capacity</div>
              <div className="text-lg font-semibold">{streamData.properties.heatCapacity} kJ/kg·K</div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="energy" className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded-md shadow-sm">
              <div className="text-sm text-gray-500">Enthalpy</div>
              <div className="text-lg font-semibold">{streamData.properties.enthalpy} kJ/kg</div>
            </div>
            <div className="bg-white p-3 rounded-md shadow-sm">
              <div className="text-sm text-gray-500">Entropy</div>
              <div className="text-lg font-semibold">{streamData.properties.entropy} J/mol·K</div>
            </div>
            <div className="bg-white p-3 rounded-md shadow-sm">
              <div className="text-sm text-gray-500">Heat Flow</div>
              <div className="text-lg font-semibold">{(streamData.properties.enthalpy * streamData.totalFlow / 3600).toFixed(2)} kW</div>
            </div>
            <div className="bg-white p-3 rounded-md shadow-sm">
              <div className="text-sm text-gray-500">Gibbs Energy</div>
              <div className="text-lg font-semibold">{(streamData.properties.enthalpy - 298.15 * streamData.properties.entropy / 1000).toFixed(2)} kJ/kg</div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </GlassPanel>
  );
};

export default StreamDataPanel;
