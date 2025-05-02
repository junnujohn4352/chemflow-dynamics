
import React, { useState } from 'react';
import { Software } from '@/types/software';
import BaseSoftwareInterface from './BaseSoftwareInterface';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

interface ChemicalDatabaseInterfaceProps {
  software: Software;
}

const ChemicalDatabaseInterface: React.FC<ChemicalDatabaseInterfaceProps> = ({ software }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [temperature, setTemperature] = useState<number>(25);
  const [pressure, setPressure] = useState<number>(101.325);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedCompound, setSelectedCompound] = useState<any>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const { toast } = useToast();

  // Sample database of chemicals
  const chemicalDatabase = [
    {
      name: "Water",
      formula: "H2O",
      cas: "7732-18-5",
      molecularWeight: 18.02,
      boilingPoint: 100,
      meltingPoint: 0,
      criticalTemp: 373.95,
      criticalPressure: 220.64,
      heatCapacity: 4.18,
      density: 997,
      thermalConductivity: 0.6,
      viscosity: 0.001,
      vaporPressure: 3.17,
      heatOfVaporization: 40.65,
      heatOfFusion: 6.02,
      flashPoint: null,
      autoignitionTemp: null,
      flammabilityLimits: null,
      solubility: "Miscible with many polar solvents",
      hazards: "Non-hazardous"
    },
    {
      name: "Methanol",
      formula: "CH3OH",
      cas: "67-56-1",
      molecularWeight: 32.04,
      boilingPoint: 64.7,
      meltingPoint: -97.6,
      criticalTemp: 239.45,
      criticalPressure: 81.0,
      heatCapacity: 2.53,
      density: 792,
      thermalConductivity: 0.203,
      viscosity: 0.00059,
      vaporPressure: 13.02,
      heatOfVaporization: 35.21,
      heatOfFusion: 3.16,
      flashPoint: 11,
      autoignitionTemp: 464,
      flammabilityLimits: "6-36%",
      solubility: "Miscible with water",
      hazards: "Flammable, Toxic"
    },
    {
      name: "Ethanol",
      formula: "C2H5OH",
      cas: "64-17-5",
      molecularWeight: 46.07,
      boilingPoint: 78.4,
      meltingPoint: -114.1,
      criticalTemp: 241.0,
      criticalPressure: 63.0,
      heatCapacity: 2.44,
      density: 789,
      thermalConductivity: 0.17,
      viscosity: 0.0012,
      vaporPressure: 5.95,
      heatOfVaporization: 38.56,
      heatOfFusion: 4.6,
      flashPoint: 13,
      autoignitionTemp: 363,
      flammabilityLimits: "3.3-19%",
      solubility: "Miscible with water",
      hazards: "Flammable"
    },
    {
      name: "Toluene",
      formula: "C7H8",
      cas: "108-88-3",
      molecularWeight: 92.14,
      boilingPoint: 110.6,
      meltingPoint: -95,
      criticalTemp: 318.6,
      criticalPressure: 41.0,
      heatCapacity: 1.7,
      density: 867,
      thermalConductivity: 0.14,
      viscosity: 0.00059,
      vaporPressure: 2.9,
      heatOfVaporization: 33.18,
      heatOfFusion: 6.64,
      flashPoint: 4.4,
      autoignitionTemp: 480,
      flammabilityLimits: "1.1-7.1%",
      solubility: "Immiscible with water",
      hazards: "Flammable, Harmful"
    },
    {
      name: "Benzene",
      formula: "C6H6",
      cas: "71-43-2",
      molecularWeight: 78.11,
      boilingPoint: 80.1,
      meltingPoint: 5.5,
      criticalTemp: 288.9,
      criticalPressure: 48.9,
      heatCapacity: 1.74,
      density: 876,
      thermalConductivity: 0.14,
      viscosity: 0.00065,
      vaporPressure: 10.0,
      heatOfVaporization: 30.72,
      heatOfFusion: 9.87,
      flashPoint: -11,
      autoignitionTemp: 498,
      flammabilityLimits: "1.2-7.8%",
      solubility: "Immiscible with water",
      hazards: "Flammable, Carcinogenic"
    }
  ];
  
  const handleSearch = () => {
    setIsSearching(true);
    
    setTimeout(() => {
      const query = searchQuery.toLowerCase();
      const filteredResults = chemicalDatabase.filter(chemical => 
        chemical.name.toLowerCase().includes(query) || 
        chemical.formula.toLowerCase().includes(query) || 
        chemical.cas.includes(query)
      );
      
      setSearchResults(filteredResults);
      setIsSearching(false);
      
      toast({
        title: "Search Complete",
        description: `Found ${filteredResults.length} chemical${filteredResults.length !== 1 ? 's' : ''} matching your query.`,
      });
    }, 800);
  };
  
  const handleCompoundSelect = (compound: any) => {
    setSelectedCompound(compound);
    
    toast({
      title: "Compound Selected",
      description: `Showing detailed information for ${compound.name}.`,
    });
  };

  return (
    <BaseSoftwareInterface software={software}>
      <div className="mt-4 border-t pt-4">
        <h5 className="font-medium mb-2">Chemical Property Database</h5>
        
        <div className="space-y-4 mb-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input 
                placeholder="Search by name, formula, or CAS number..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature (°C)</Label>
              <Input 
                id="temperature" 
                type="number" 
                value={temperature} 
                onChange={(e) => setTemperature(Number(e.target.value))} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pressure">Pressure (kPa)</Label>
              <Input 
                id="pressure" 
                type="number" 
                value={pressure} 
                onChange={(e) => setPressure(Number(e.target.value))} 
              />
            </div>
          </div>
        </div>
        
        <div className="border rounded-md overflow-hidden mb-4">
          {searchResults.length > 0 ? (
            <div className="max-h-64 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Name</TableHead>
                    <TableHead>Formula</TableHead>
                    <TableHead>CAS</TableHead>
                    <TableHead className="text-right">MW (g/mol)</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchResults.map((compound, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{compound.name}</TableCell>
                      <TableCell>{compound.formula}</TableCell>
                      <TableCell>{compound.cas}</TableCell>
                      <TableCell className="text-right">{compound.molecularWeight}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleCompoundSelect(compound)}>
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              {isSearching ? "Searching database..." : "Search for chemicals by name, formula, or CAS number"}
            </div>
          )}
        </div>
        
        {selectedCompound && (
          <div className="border rounded-md p-4 bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <h5 className="font-medium">{selectedCompound.name} ({selectedCompound.formula})</h5>
              <span className="text-sm text-gray-500">CAS: {selectedCompound.cas}</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Molecular Weight:</span>
                <div className="font-medium">{selectedCompound.molecularWeight} g/mol</div>
              </div>
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Boiling Point:</span>
                <div className="font-medium">{selectedCompound.boilingPoint} °C</div>
              </div>
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Melting Point:</span>
                <div className="font-medium">{selectedCompound.meltingPoint} °C</div>
              </div>
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Critical Temperature:</span>
                <div className="font-medium">{selectedCompound.criticalTemp} °C</div>
              </div>
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Critical Pressure:</span>
                <div className="font-medium">{selectedCompound.criticalPressure} bar</div>
              </div>
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Heat Capacity:</span>
                <div className="font-medium">{selectedCompound.heatCapacity} kJ/(kg·K)</div>
              </div>
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Density:</span>
                <div className="font-medium">{selectedCompound.density} kg/m³</div>
              </div>
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Thermal Conductivity:</span>
                <div className="font-medium">{selectedCompound.thermalConductivity} W/(m·K)</div>
              </div>
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Viscosity:</span>
                <div className="font-medium">{selectedCompound.viscosity} Pa·s</div>
              </div>
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Vapor Pressure:</span>
                <div className="font-medium">{selectedCompound.vaporPressure} kPa at 25°C</div>
              </div>
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Heat of Vaporization:</span>
                <div className="font-medium">{selectedCompound.heatOfVaporization} kJ/mol</div>
              </div>
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Flash Point:</span>
                <div className="font-medium">{selectedCompound.flashPoint !== null ? `${selectedCompound.flashPoint} °C` : 'N/A'}</div>
              </div>
              <div className="border rounded p-2 md:col-span-3">
                <span className="text-gray-600 text-sm">Hazards:</span>
                <div className="font-medium">{selectedCompound.hazards}</div>
              </div>
            </div>
            
            <div className="mt-4">
              <Button variant="outline" size="sm" onClick={() => setSelectedCompound(null)}>
                Return to Search
              </Button>
            </div>
          </div>
        )}
      </div>
    </BaseSoftwareInterface>
  );
};

export default ChemicalDatabaseInterface;
