
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip } from '@/components/ui/tooltip';
import { 
  FlaskConical, Database, PlusCircle, FileText, Settings, Filter, 
  Thermometer, ArrowRightLeft, Activity, Droplets, LayoutGrid 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UnitOperationsTabProps {
  couscousUnits: string[];
}

const UnitOperationsTab: React.FC<UnitOperationsTabProps> = ({ couscousUnits }) => {
  const [activeCategory, setActiveCategory] = useState<string>("basic");
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const { toast } = useToast();
  
  const handleSelectUnit = (unitName: string) => {
    setSelectedUnit(unitName);
    
    toast({
      title: `${unitName} Selected`,
      description: `${unitName} has been added to your canvas.`,
      duration: 3000,
    });
  };
  
  return (
    <div className="border rounded-md p-4 mb-4">
      <h3 className="font-medium mb-3">COUSCOUS - CAPE-OPEN Unit Operations Simple</h3>
      <p className="text-sm text-gray-600 mb-4">
        Use the built-in unit operations for your process simulation.
      </p>

      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="mb-4">
          <TabsTrigger value="basic">Basic Units</TabsTrigger>
          <TabsTrigger value="separation">Separation</TabsTrigger>
          <TabsTrigger value="heat">Heat Transfer</TabsTrigger>
          <TabsTrigger value="reaction">Reaction</TabsTrigger>
          <TabsTrigger value="pressure">Pressure Change</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { name: "Mixer", icon: <LayoutGrid className="h-4 w-4 mr-2 text-blue-500" />, description: "Combines multiple streams into a single output stream" },
              { name: "Splitter", icon: <ArrowRightLeft className="h-4 w-4 mr-2 text-blue-500" />, description: "Splits a single stream into multiple output streams" },
              { name: "Stream", icon: <Droplets className="h-4 w-4 mr-2 text-blue-500" />, description: "Material or energy stream connecting unit operations" },
              { name: "Tank", icon: <Database className="h-4 w-4 mr-2 text-blue-500" />, description: "Storage vessel for liquids or gases" },
              { name: "Valve", icon: <Filter className="h-4 w-4 mr-2 text-blue-500" />, description: "Controls flow rate or pressure drop" },
              { name: "Pipe Segment", icon: <Activity className="h-4 w-4 mr-2 text-blue-500" />, description: "Transports fluids with pressure drop calculations" }
            ].map(unit => (
              <div 
                key={unit.name} 
                className={`p-3 border rounded hover:bg-blue-50 cursor-pointer flex items-center ${selectedUnit === unit.name ? 'bg-blue-100 border-blue-400' : ''}`}
                onClick={() => handleSelectUnit(unit.name)}
                title={unit.description}
              >
                {unit.icon}
                <span>{unit.name}</span>
              </div>
            ))}
          </div>

          {selectedUnit && selectedUnit === "Mixer" && (
            <div className="mt-4 bg-gray-50 p-3 rounded-md border">
              <h4 className="text-sm font-medium mb-2">Mixer Specifications</h4>
              <p className="text-xs text-gray-600 mb-2">
                Combines multiple input streams into a single outlet stream, performing material and energy balances.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-white rounded border">Pressure drop model available</div>
                <div className="p-2 bg-white rounded border">Variable number of inlets</div>
                <div className="p-2 bg-white rounded border">Adiabatic or specified heat duty</div>
                <div className="p-2 bg-white rounded border">Rigorous thermodynamic flash</div>
              </div>
              <div className="mt-3 flex justify-end">
                <Button size="sm" variant="outline">Configure</Button>
                <Button size="sm" className="ml-2">Add to Simulation</Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="separation">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { name: "Flash Separator", icon: <FlaskConical className="h-4 w-4 mr-2 text-purple-500" />, description: "Separates liquid and vapor phases" },
              { name: "Component Separator", icon: <Filter className="h-4 w-4 mr-2 text-purple-500" />, description: "Separates components based on specified split fractions" },
              { name: "Distillation Column", icon: <Activity className="h-4 w-4 mr-2 text-purple-500" />, description: "Multi-stage vapor-liquid separation" },
              { name: "Absorber", icon: <ArrowRightLeft className="h-4 w-4 mr-2 text-purple-500" />, description: "Gas-liquid contactor for component absorption" },
              { name: "Extraction Column", icon: <Droplets className="h-4 w-4 mr-2 text-purple-500" />, description: "Liquid-liquid separation using solvent" },
              { name: "Membrane", icon: <Filter className="h-4 w-4 mr-2 text-purple-500" />, description: "Selective separation using semi-permeable membrane" }
            ].map(unit => (
              <div 
                key={unit.name} 
                className={`p-3 border rounded hover:bg-blue-50 cursor-pointer flex items-center ${selectedUnit === unit.name ? 'bg-blue-100 border-blue-400' : ''}`}
                onClick={() => handleSelectUnit(unit.name)}
                title={unit.description}
              >
                {unit.icon}
                <span>{unit.name}</span>
              </div>
            ))}
          </div>
          
          {selectedUnit && selectedUnit === "Distillation Column" && (
            <div className="mt-4 bg-gray-50 p-3 rounded-md border">
              <h4 className="text-sm font-medium mb-2">Distillation Column Specifications</h4>
              <p className="text-xs text-gray-600 mb-2">
                Rigorous stage-by-stage separation based on vapor-liquid equilibrium.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-white rounded border">Configurable number of stages</div>
                <div className="p-2 bg-white rounded border">Multiple feed locations</div>
                <div className="p-2 bg-white rounded border">Reflux ratio specification</div>
                <div className="p-2 bg-white rounded border">Condenser and reboiler options</div>
                <div className="p-2 bg-white rounded border">Pressure profile specification</div>
                <div className="p-2 bg-white rounded border">Column hydraulics and sizing</div>
              </div>
              <div className="mt-3 flex justify-end">
                <Button size="sm" variant="outline">Configure</Button>
                <Button size="sm" className="ml-2">Add to Simulation</Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="heat">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { name: "Heat Exchanger", icon: <ArrowRightLeft className="h-4 w-4 mr-2 text-red-500" />, description: "Transfers heat between two process streams" },
              { name: "Heater", icon: <Thermometer className="h-4 w-4 mr-2 text-red-500" />, description: "Increases stream temperature using external heat source" },
              { name: "Cooler", icon: <Thermometer className="h-4 w-4 mr-2 text-red-500" />, description: "Decreases stream temperature using cooling medium" },
              { name: "Multi-Stream HX", icon: <LayoutGrid className="h-4 w-4 mr-2 text-red-500" />, description: "Heat exchanger with multiple hot and cold streams" },
              { name: "Air Cooler", icon: <FlaskConical className="h-4 w-4 mr-2 text-red-500" />, description: "Rejects heat to ambient air using fans" },
              { name: "Fired Heater", icon: <Activity className="h-4 w-4 mr-2 text-red-500" />, description: "Uses combustion of fuel to heat process stream" }
            ].map(unit => (
              <div 
                key={unit.name} 
                className={`p-3 border rounded hover:bg-blue-50 cursor-pointer flex items-center ${selectedUnit === unit.name ? 'bg-blue-100 border-blue-400' : ''}`}
                onClick={() => handleSelectUnit(unit.name)}
                title={unit.description}
              >
                {unit.icon}
                <span>{unit.name}</span>
              </div>
            ))}
          </div>
          
          {selectedUnit && selectedUnit === "Heat Exchanger" && (
            <div className="mt-4 bg-gray-50 p-3 rounded-md border">
              <h4 className="text-sm font-medium mb-2">Heat Exchanger Specifications</h4>
              <p className="text-xs text-gray-600 mb-2">
                Transfers heat between two streams based on specified parameters and constraints.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-white rounded border">Multiple geometry options</div>
                <div className="p-2 bg-white rounded border">UA and LMTD calculations</div>
                <div className="p-2 bg-white rounded border">Rating and design modes</div>
                <div className="p-2 bg-white rounded border">Temperature approach constraints</div>
                <div className="p-2 bg-white rounded border">Pressure drop correlations</div>
                <div className="p-2 bg-white rounded border">Detailed sizing calculations</div>
              </div>
              <div className="mt-3 flex justify-end">
                <Button size="sm" variant="outline">Configure</Button>
                <Button size="sm" className="ml-2">Add to Simulation</Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="reaction">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { name: "CSTR Reactor", icon: <FlaskConical className="h-4 w-4 mr-2 text-green-500" />, description: "Continuous Stirred Tank Reactor - perfect mixing" },
              { name: "PFR Reactor", icon: <Activity className="h-4 w-4 mr-2 text-green-500" />, description: "Plug Flow Reactor - axial flow with no mixing" },
              { name: "Batch Reactor", icon: <Database className="h-4 w-4 mr-2 text-green-500" />, description: "Time-dependent reaction in closed vessel" },
              { name: "Equilibrium Reactor", icon: <ArrowRightLeft className="h-4 w-4 mr-2 text-green-500" />, description: "Reactions proceed to chemical equilibrium" },
              { name: "Gibbs Reactor", icon: <Thermometer className="h-4 w-4 mr-2 text-green-500" />, description: "Minimizes Gibbs free energy at equilibrium" },
              { name: "Yield Reactor", icon: <Droplets className="h-4 w-4 mr-2 text-green-500" />, description: "Uses specified yields for products" }
            ].map(unit => (
              <div 
                key={unit.name} 
                className={`p-3 border rounded hover:bg-blue-50 cursor-pointer flex items-center ${selectedUnit === unit.name ? 'bg-blue-100 border-blue-400' : ''}`}
                onClick={() => handleSelectUnit(unit.name)}
                title={unit.description}
              >
                {unit.icon}
                <span>{unit.name}</span>
              </div>
            ))}
          </div>
          
          {selectedUnit && selectedUnit === "CSTR Reactor" && (
            <div className="mt-4 bg-gray-50 p-3 rounded-md border">
              <h4 className="text-sm font-medium mb-2">CSTR Reactor Specifications</h4>
              <p className="text-xs text-gray-600 mb-2">
                Continuous Stirred Tank Reactor model with kinetic or equilibrium reactions.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-white rounded border">Various kinetic models</div>
                <div className="p-2 bg-white rounded border">Reaction rate expressions</div>
                <div className="p-2 bg-white rounded border">Isothermal/Adiabatic/Specified heat duty</div>
                <div className="p-2 bg-white rounded border">Residence time calculation</div>
                <div className="p-2 bg-white rounded border">Catalyst loading specifications</div>
                <div className="p-2 bg-white rounded border">Multiple reactions in series/parallel</div>
              </div>
              <div className="mt-3 flex justify-end">
                <Button size="sm" variant="outline">Configure</Button>
                <Button size="sm" className="ml-2">Add to Simulation</Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="pressure">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { name: "Pump", icon: <Activity className="h-4 w-4 mr-2 text-indigo-500" />, description: "Increases pressure of liquid streams" },
              { name: "Compressor", icon: <Activity className="h-4 w-4 mr-2 text-indigo-500" />, description: "Increases pressure of gas streams" },
              { name: "Expander", icon: <ArrowRightLeft className="h-4 w-4 mr-2 text-indigo-500" />, description: "Decreases pressure of gas streams with work recovery" },
              { name: "Valve", icon: <Filter className="h-4 w-4 mr-2 text-indigo-500" />, description: "Reduces pressure via throttling" },
              { name: "Pressure Changer", icon: <Settings className="h-4 w-4 mr-2 text-indigo-500" />, description: "Generic pressure manipulation" },
              { name: "Turbine", icon: <Activity className="h-4 w-4 mr-2 text-indigo-500" />, description: "Expands fluid while extracting shaft work" }
            ].map(unit => (
              <div 
                key={unit.name} 
                className={`p-3 border rounded hover:bg-blue-50 cursor-pointer flex items-center ${selectedUnit === unit.name ? 'bg-blue-100 border-blue-400' : ''}`}
                onClick={() => handleSelectUnit(unit.name)}
                title={unit.description}
              >
                {unit.icon}
                <span>{unit.name}</span>
              </div>
            ))}
          </div>
          
          {selectedUnit && selectedUnit === "Compressor" && (
            <div className="mt-4 bg-gray-50 p-3 rounded-md border">
              <h4 className="text-sm font-medium mb-2">Compressor Specifications</h4>
              <p className="text-xs text-gray-600 mb-2">
                Increases the pressure of a vapor stream with associated temperature and enthalpy changes.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-white rounded border">Isentropic efficiency model</div>
                <div className="p-2 bg-white rounded border">Polytropic efficiency model</div>
                <div className="p-2 bg-white rounded border">Power consumption calculation</div>
                <div className="p-2 bg-white rounded border">Discharge temperature prediction</div>
                <div className="p-2 bg-white rounded border">Surge and choke limits</div>
                <div className="p-2 bg-white rounded border">Performance curves integration</div>
              </div>
              <div className="mt-3 flex justify-end">
                <Button size="sm" variant="outline">Configure</Button>
                <Button size="sm" className="ml-2">Add to Simulation</Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 border-t pt-4">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-medium">External Unit Operations</h4>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <PlusCircle className="h-4 w-4" />
              Add CAPE-OPEN Unit
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Database className="h-4 w-4" />
              Browse Repository
            </Button>
          </div>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm text-gray-600">
            ChemFlow supports third-party CAPE-OPEN compliant unit operations. You can import custom 
            or vendor-supplied unit operations that implement the CAPE-OPEN standard.
          </p>
          <div className="flex justify-end mt-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              Documentation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitOperationsTab;
