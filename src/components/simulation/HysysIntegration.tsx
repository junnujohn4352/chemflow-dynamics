
import React from 'react';
import GlassPanel from "@/components/ui/GlassPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Thermometer, Activity, Zap, Droplets, Layers, GitGraph,
  Atom, Database, Settings, AlertTriangle, BarChart3, LineChart,
  FileText, ReceiptText, PlayCircle, Beaker
} from "lucide-react";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComponentDetailsPanel from './ComponentDetailsPanel';
import StreamDataPanel from './StreamDataPanel';
import ReactionDataPanel from './ReactionDataPanel';
import AdvancedEquipmentAnalysis from './AdvancedEquipmentAnalysis';

interface HysysIntegrationProps {
  selectedComponents: string[];
  thermodynamicModel?: string;
}

const HysysIntegration: React.FC<HysysIntegrationProps> = ({ 
  selectedComponents,
  thermodynamicModel = "Peng-Robinson"
}) => {
  const [selectedComponent, setSelectedComponent] = React.useState<string | null>(
    selectedComponents.length > 0 ? selectedComponents[0] : null
  );
  
  const [activeEquipmentType, setActiveEquipmentType] = React.useState<string | null>("heat-exchanger");

  // Energy analysis data
  const energyAnalysis = {
    heatExchangers: [
      { name: "Preheater", duty: 450, efficiency: 85, utilityType: "Steam", utilityConsumption: 550 },
      { name: "Condenser", duty: -380, efficiency: 90, utilityType: "Cooling Water", utilityConsumption: 420 }
    ],
    reactors: [
      { name: "Main Reactor", duty: -120, exothermicity: "Exothermic", heatRemoval: "Cooling Jacket" }
    ],
    totalUtilities: {
      steam: 550,
      coolingWater: 420,
      electricity: 75
    },
    energyBalance: {
      input: 620,
      output: 580,
      losses: 40
    }
  };

  // Equipment specs
  const equipmentSpecs = {
    columns: [
      { 
        name: "Main Column", 
        type: "Distillation",
        numberOfTrays: 25,
        feedTray: 12,
        pressure: 101.325,
        reboilerDuty: 320,
        condenserDuty: -290,
        refluxRatio: 1.2,
        bottomsRate: 60,
        distillateRate: 40
      }
    ],
    reactors: [
      {
        name: "CSTR Reactor",
        type: "CSTR",
        volume: 5,
        temperature: 85,
        pressure: 150,
        residence: 30,
        conversion: 92
      }
    ],
    heatExchangers: [
      {
        name: "Feed-Effluent Exchanger",
        type: "Shell & Tube",
        area: 15,
        overallCoefficient: 550,
        hotInlet: 120,
        hotOutlet: 70,
        coldInlet: 25,
        coldOutlet: 65
      }
    ]
  };

  // Equipment types for comprehensive analysis
  const equipmentTypes = [
    { id: "heat-exchanger", name: "Heat Exchanger", icon: <Thermometer className="h-4 w-4" /> },
    { id: "distillation", name: "Distillation Column", icon: <Layers className="h-4 w-4" /> },
    { id: "reactor", name: "Reactor", icon: <Beaker className="h-4 w-4" /> },
    { id: "flash", name: "Flash Drum", icon: <Zap className="h-4 w-4" /> },
    { id: "pump", name: "Pump", icon: <Activity className="h-4 w-4" /> },
    { id: "compressor", name: "Compressor", icon: <Zap className="h-4 w-4" /> }
  ];

  return (
    <GlassPanel className="p-6">
      <h3 className="text-xl font-semibold mb-4">HYSYS-Like Simulation Environment</h3>
      
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg mb-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center">
            <Badge variant="outline" className="mr-2 bg-blue-50">
              <Database className="h-3.5 w-3.5 mr-1 text-blue-700" />
              <span className="text-blue-700 font-medium">{thermodynamicModel}</span>
            </Badge>
            <Badge variant="outline" className="bg-blue-50">
              <Atom className="h-3.5 w-3.5 mr-1 text-blue-700" />
              <span className="text-blue-700 font-medium">{selectedComponents.length} Components</span>
            </Badge>
          </div>
          <Button size="sm" variant="outline" className="bg-white text-blue-700 border-blue-300 hover:bg-blue-50">
            <PlayCircle className="h-3.5 w-3.5 mr-1" />
            Run Simulation
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="components">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="components">
            <Droplets className="h-4 w-4 mr-2" />
            Component Data
          </TabsTrigger>
          <TabsTrigger value="streams">
            <Layers className="h-4 w-4 mr-2" />
            Stream Properties
          </TabsTrigger>
          <TabsTrigger value="reactions">
            <Activity className="h-4 w-4 mr-2" />
            Reaction Data
          </TabsTrigger>
          <TabsTrigger value="equipment">
            <Thermometer className="h-4 w-4 mr-2" />
            Equipment Analysis
          </TabsTrigger>
          <TabsTrigger value="energy">
            <Zap className="h-4 w-4 mr-2" />
            Energy Analysis
          </TabsTrigger>
          <TabsTrigger value="reports">
            <FileText className="h-4 w-4 mr-2" />
            Reports
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="components">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Component</label>
            <div className="flex flex-wrap gap-2">
              {selectedComponents.map(component => (
                <button
                  key={component}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                    selectedComponent === component
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                  onClick={() => setSelectedComponent(component)}
                >
                  {component}
                </button>
              ))}
            </div>
          </div>
          
          {selectedComponent && (
            <ComponentDetailsPanel componentName={selectedComponent} />
          )}
        </TabsContent>
        
        <TabsContent value="streams">
          <StreamDataPanel selectedComponents={selectedComponents} />
        </TabsContent>
        
        <TabsContent value="reactions">
          <ReactionDataPanel selectedComponents={selectedComponents} />
        </TabsContent>
        
        <TabsContent value="equipment">
          <div className="mb-4 border-b pb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Equipment Type</label>
            <div className="flex flex-wrap gap-2">
              {equipmentTypes.map(equipment => (
                <button
                  key={equipment.id}
                  className={`px-3 py-2 text-sm rounded-md transition-colors flex items-center ${
                    activeEquipmentType === equipment.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                  onClick={() => setActiveEquipmentType(equipment.id)}
                >
                  {equipment.icon}
                  <span className="ml-1.5">{equipment.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          {activeEquipmentType && (
            <AdvancedEquipmentAnalysis 
              equipmentType={activeEquipmentType} 
              componentList={selectedComponents} 
            />
          )}
        </TabsContent>
        
        <TabsContent value="energy">
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-md shadow-sm">
                <h4 className="text-lg font-medium text-blue-700 mb-3">Energy Balance</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Energy Input:</span>
                    <span className="font-medium">{energyAnalysis.energyBalance.input} kW</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Energy Output:</span>
                    <span className="font-medium">{energyAnalysis.energyBalance.output} kW</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 mt-2">
                    <span className="text-gray-600">Energy Losses:</span>
                    <span className="font-medium text-amber-600">{energyAnalysis.energyBalance.losses} kW</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-md shadow-sm">
                <h4 className="text-lg font-medium text-blue-700 mb-3">Utility Consumption</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Steam:</span>
                    <span className="font-medium">{energyAnalysis.totalUtilities.steam} kg/h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cooling Water:</span>
                    <span className="font-medium">{energyAnalysis.totalUtilities.coolingWater} kg/h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Electricity:</span>
                    <span className="font-medium">{energyAnalysis.totalUtilities.electricity} kW</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-md shadow-sm">
                <h4 className="text-lg font-medium text-blue-700 mb-3">Environmental Impact</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">CO₂ Emissions:</span>
                    <span className="font-medium">45 kg/h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Water Usage:</span>
                    <span className="font-medium">1,200 kg/h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Energy Efficiency:</span>
                    <span className="font-medium text-green-600">76%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-3">Heat Exchanger Network</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duty (kW)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Efficiency (%)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utility Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consumption (kg/h)</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {energyAnalysis.heatExchangers.map((exchanger, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{exchanger.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                          <span className={exchanger.duty > 0 ? 'text-red-600' : 'text-blue-600'}>
                            {exchanger.duty}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{exchanger.efficiency}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{exchanger.utilityType}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{exchanger.utilityConsumption}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-3">Reactor Heat Duties</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duty (kW)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exothermicity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heat Control</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {energyAnalysis.reactors.map((reactor, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{reactor.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                          <span className={reactor.duty > 0 ? 'text-red-600' : 'text-blue-600'}>
                            {reactor.duty}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reactor.exothermicity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reactor.heatRemoval}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="reports">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ReportCard
              title="Stream Summary"
              icon={<GitGraph className="h-5 w-5 text-blue-600" />}
              description="Comprehensive stream property data including composition, conditions and physical properties"
            />
            <ReportCard
              title="Energy Analysis"
              icon={<Zap className="h-5 w-5 text-orange-600" />}
              description="Detailed energy balance, utility consumption and efficiency metrics"
            />
            <ReportCard
              title="Equipment Performance"
              icon={<BarChart3 className="h-5 w-5 text-green-600" />}
              description="Performance metrics for all equipment units in the simulation"
            />
            <ReportCard
              title="Economics Report"
              icon={<ReceiptText className="h-5 w-5 text-purple-600" />}
              description="Capital and operating cost estimates along with economic indicators"
            />
            <ReportCard
              title="Safety Analysis"
              icon={<AlertTriangle className="h-5 w-5 text-red-600" />}
              description="Safety metrics, design margins and equipment ratings assessment"
            />
            <ReportCard
              title="Environmental Impact"
              icon={<Droplets className="h-5 w-5 text-teal-600" />}
              description="Environmental indicators including emissions, waste and resource consumption"
            />
          </div>
        </TabsContent>
      </Tabs>
    </GlassPanel>
  );
};

interface ReportCardProps {
  title: string;
  icon: React.ReactNode;
  description: string;
}

const ReportCard: React.FC<ReportCardProps> = ({ title, icon, description }) => {
  return (
    <div className="bg-white p-4 rounded-md shadow-sm hover:shadow transition-shadow border border-gray-100">
      <div className="flex items-center mb-3">
        {icon}
        <h4 className="text-lg font-medium ml-2">{title}</h4>
      </div>
      <p className="text-sm text-gray-600 mb-3">{description}</p>
      <Button variant="outline" size="sm" className="w-full mt-2">
        <FileText className="h-3.5 w-3.5 mr-1.5" />
        Generate Report
      </Button>
    </div>
  );
};

export default HysysIntegration;
