
import React, { useState, useEffect } from 'react';
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
import { motion } from 'framer-motion';

interface HysysIntegrationProps {
  selectedComponents: string[];
  thermodynamicModel?: string;
}

const HysysIntegration: React.FC<HysysIntegrationProps> = ({ 
  selectedComponents,
  thermodynamicModel = "Peng-Robinson"
}) => {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    selectedComponents.length > 0 ? selectedComponents[0] : null
  );
  
  const [activeEquipmentType, setActiveEquipmentType] = useState<string | null>("heat-exchanger");
  const [animateChart, setAnimateChart] = useState(false);

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

  useEffect(() => {
    // Trigger animation after component is mounted
    setTimeout(() => {
      setAnimateChart(true);
    }, 500);
  }, []);
  
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <GlassPanel className="p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-blue-200 opacity-20 blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-purple-200 opacity-30 blur-2xl animate-pulse" style={{ animationDuration: '12s' }}></div>
      
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10"
      >
        <motion.h3 
          className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          variants={itemVariants}
        >
          HYSYS-Like Simulation Environment
        </motion.h3>
        
        <motion.div 
          className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg mb-6"
          variants={itemVariants}
        >
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
            <Button 
              size="sm" 
              variant="outline" 
              className="bg-gradient-to-r from-blue-50 to-indigo-100 text-blue-700 border-blue-300 hover:bg-blue-100 transition-all duration-300 transform hover:scale-105"
            >
              <PlayCircle className="h-3.5 w-3.5 mr-1 animate-pulse" />
              Run Simulation
            </Button>
          </div>
        </motion.div>
        
        <Tabs defaultValue="components" className="relative z-10">
          <TabsList className="w-full mb-6 bg-gradient-to-r from-blue-100/50 to-indigo-100/50 backdrop-blur-sm">
            <TabsTrigger value="components" className="data-[state=active]:bg-blue-100 transition-all duration-300">
              <Droplets className="h-4 w-4 mr-2" />
              Component Data
            </TabsTrigger>
            <TabsTrigger value="streams" className="data-[state=active]:bg-blue-100 transition-all duration-300">
              <Layers className="h-4 w-4 mr-2" />
              Stream Properties
            </TabsTrigger>
            <TabsTrigger value="reactions" className="data-[state=active]:bg-blue-100 transition-all duration-300">
              <Activity className="h-4 w-4 mr-2" />
              Reaction Data
            </TabsTrigger>
            <TabsTrigger value="equipment" className="data-[state=active]:bg-blue-100 transition-all duration-300">
              <Thermometer className="h-4 w-4 mr-2" />
              Equipment Analysis
            </TabsTrigger>
            <TabsTrigger value="energy" className="data-[state=active]:bg-blue-100 transition-all duration-300">
              <Zap className="h-4 w-4 mr-2" />
              Energy Analysis
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-blue-100 transition-all duration-300">
              <FileText className="h-4 w-4 mr-2" />
              Reports
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="components" className="animate-fade-in">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Component</label>
              <div className="flex flex-wrap gap-2">
                {selectedComponents.map(component => (
                  <motion.button
                    key={component}
                    className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                      selectedComponent === component
                        ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-300'
                        : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                    onClick={() => setSelectedComponent(component)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {component}
                  </motion.button>
                ))}
              </div>
            </div>
            
            {selectedComponent && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ComponentDetailsPanel componentName={selectedComponent} />
              </motion.div>
            )}
          </TabsContent>
          
          <TabsContent value="streams" className="animate-fade-in">
            <StreamDataPanel selectedComponents={selectedComponents} />
          </TabsContent>
          
          <TabsContent value="reactions" className="animate-fade-in">
            <ReactionDataPanel selectedComponents={selectedComponents} />
          </TabsContent>
          
          <TabsContent value="equipment" className="animate-fade-in">
            <div className="mb-4 border-b border-blue-100 pb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Equipment Type</label>
              <div className="flex flex-wrap gap-2">
                {equipmentTypes.map((equipment, index) => (
                  <motion.button
                    key={equipment.id}
                    className={`px-3 py-2 text-sm rounded-md transition-colors flex items-center ${
                      activeEquipmentType === equipment.id
                        ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-300'
                        : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                    onClick={() => setActiveEquipmentType(equipment.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      transition: { delay: index * 0.1, duration: 0.3 }
                    }}
                  >
                    {equipment.icon}
                    <span className="ml-1.5">{equipment.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>
            
            {activeEquipmentType && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <AdvancedEquipmentAnalysis 
                  equipmentType={activeEquipmentType} 
                  componentList={selectedComponents} 
                />
              </motion.div>
            )}
          </TabsContent>
          
          <TabsContent value="energy" className="animate-fade-in">
            <div className="space-y-6">
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                variants={containerVariants}
                initial="hidden"
                animate={animateChart ? "visible" : "hidden"}
              >
                <motion.div 
                  className="bg-gradient-to-br from-white to-blue-50 p-4 rounded-md shadow-lg hover:shadow-blue-200 transition-all duration-300"
                  variants={itemVariants}
                >
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
                </motion.div>
                
                <motion.div 
                  className="bg-gradient-to-br from-white to-indigo-50 p-4 rounded-md shadow-lg hover:shadow-indigo-200 transition-all duration-300"
                  variants={itemVariants}
                >
                  <h4 className="text-lg font-medium text-indigo-700 mb-3">Utility Consumption</h4>
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
                </motion.div>
                
                <motion.div 
                  className="bg-gradient-to-br from-white to-green-50 p-4 rounded-md shadow-lg hover:shadow-green-200 transition-all duration-300"
                  variants={itemVariants}
                >
                  <h4 className="text-lg font-medium text-green-700 mb-3">Environmental Impact</h4>
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
                </motion.div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={animateChart ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h4 className="text-lg font-medium mb-3">Heat Exchanger Network</h4>
                <div className="overflow-x-auto bg-white/80 backdrop-blur-sm rounded-lg border border-blue-100 shadow-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
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
                        <motion.tr 
                          key={idx} 
                          className="hover:bg-blue-50 transition-colors"
                          initial={{ opacity: 0, y: 10 }}
                          animate={animateChart ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                          transition={{ duration: 0.3, delay: 0.4 + idx * 0.1 }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-700">{exchanger.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <span className={exchanger.duty > 0 ? 'text-red-600' : 'text-blue-600'}>
                              {exchanger.duty}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{exchanger.efficiency}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{exchanger.utilityType}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{exchanger.utilityConsumption}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={animateChart ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <h4 className="text-lg font-medium mb-3">Reactor Heat Duties</h4>
                <div className="overflow-x-auto bg-white/80 backdrop-blur-sm rounded-lg border border-blue-100 shadow-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duty (kW)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exothermicity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heat Control</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {energyAnalysis.reactors.map((reactor, idx) => (
                        <motion.tr 
                          key={idx} 
                          className="hover:bg-blue-50 transition-colors"
                          initial={{ opacity: 0, y: 10 }}
                          animate={animateChart ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                          transition={{ duration: 0.3, delay: 0.7 + idx * 0.1 }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-700">{reactor.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <span className={reactor.duty > 0 ? 'text-red-600' : 'text-blue-600'}>
                              {reactor.duty}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reactor.exothermicity}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reactor.heatRemoval}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>
          </TabsContent>
          
          <TabsContent value="reports" className="animate-fade-in">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
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
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
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
    <motion.div 
      className="bg-gradient-to-br from-white to-blue-50 p-4 rounded-md shadow-md hover:shadow-lg hover:shadow-blue-200 transition-all border border-blue-100"
      whileHover={{ scale: 1.03 }}
      variants={{ 
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
    >
      <div className="flex items-center mb-3">
        <div className="bg-blue-100 p-2 rounded-full mr-2">
          {icon}
        </div>
        <h4 className="text-lg font-medium bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">{title}</h4>
      </div>
      <p className="text-sm text-gray-600 mb-3">{description}</p>
      <Button variant="outline" size="sm" className="w-full mt-2 bg-gradient-to-r from-blue-50 to-indigo-50 hover:bg-blue-100">
        <FileText className="h-3.5 w-3.5 mr-1.5" />
        Generate Report
      </Button>
    </motion.div>
  );
};

export default HysysIntegration;
