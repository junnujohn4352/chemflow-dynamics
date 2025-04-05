
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EquipmentSettingsProps {
  equipment: {
    id: string;
    type: string;
    name: string;
    settings: Record<string, any>;
    subType?: string;
  };
  equipmentTypes?: {
    id: string;
    name: string;
    icon: React.ReactNode;
    subTypes?: { id: string; name: string }[];
  }[];
  onClose: () => void;
  onSave: (equipmentId: string, newSettings: Record<string, any>) => void;
}

const EquipmentSettings: React.FC<EquipmentSettingsProps> = ({
  equipment,
  equipmentTypes,
  onClose,
  onSave,
}) => {
  const [settings, setSettings] = useState<Record<string, any>>(equipment.settings);
  const [equipmentName, setEquipmentName] = useState(equipment.name);
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced' | 'composition' | 'design' | 'performance' | 'constraints' | 'controls' | 'connections'>('basic');

  useEffect(() => {
    // Initialize missing settings based on equipment type
    initializeSettingsForEquipmentType();
  }, [equipment]);

  const initializeSettingsForEquipmentType = () => {
    const newSettings = { ...settings };
    
    // General parameters for all equipment types
    if (!newSettings.status) newSettings.status = "active";
    if (!newSettings.operationalMode) newSettings.operationalMode = "design";
    if (!newSettings.description) newSettings.description = "";
    if (!newSettings.tags) newSettings.tags = "";
    
    // Operating conditions for all equipment
    if (!newSettings.temperature) newSettings.temperature = 25;
    if (!newSettings.pressure) newSettings.pressure = 101.325;
    if (!newSettings.flowRate) newSettings.flowRate = 100;
    if (!newSettings.phase) newSettings.phase = "Liquid";
    
    // Equipment-specific settings
    switch (equipment.type) {
      case "heater":
        if (!newSettings.heatDuty) newSettings.heatDuty = 1000;
        if (!newSettings.heatTransferCoefficient) newSettings.heatTransferCoefficient = 850;
        if (!newSettings.targetOutletTemperature) newSettings.targetOutletTemperature = 80;
        if (!newSettings.heatSource) newSettings.heatSource = "Steam";
        break;
        
      case "condenser":
        if (!newSettings.heatDuty) newSettings.heatDuty = -1000;
        if (!newSettings.heatTransferCoefficient) newSettings.heatTransferCoefficient = 750;
        if (!newSettings.targetOutletTemperature) newSettings.targetOutletTemperature = 30;
        if (!newSettings.coolantType) newSettings.coolantType = "Cooling Water";
        break;
        
      case "reactor":
        if (!newSettings.reactionType) newSettings.reactionType = "CSTR";
        if (!newSettings.volume) newSettings.volume = 10;
        if (!newSettings.conversion) newSettings.conversion = 0.85;
        if (!newSettings.heatOfReaction) newSettings.heatOfReaction = -50;
        if (!newSettings.reactorMode) newSettings.reactorMode = "Isothermal";
        if (!newSettings.catalystType) newSettings.catalystType = "None";
        if (!newSettings.residenceTime) newSettings.residenceTime = 30;
        break;
        
      case "pump":
        if (!newSettings.efficiency) newSettings.efficiency = 75;
        if (!newSettings.head) newSettings.head = 100;
        if (!newSettings.powerInput) newSettings.powerInput = 7.5;
        if (!newSettings.npsh) newSettings.npsh = 10;
        if (!newSettings.pumpCurve) newSettings.pumpCurve = "Default";
        break;
        
      case "compressor":
        if (!newSettings.efficiency) newSettings.efficiency = 72;
        if (!newSettings.pressureRatio) newSettings.pressureRatio = 3;
        if (!newSettings.powerConsumption) newSettings.powerConsumption = 250;
        if (!newSettings.efficiencyType) newSettings.efficiencyType = "Isentropic";
        if (!newSettings.surgeControl) newSettings.surgeControl = true;
        if (!newSettings.coolingType) newSettings.coolingType = "Air-Cooled";
        break;
        
      case "heat-exchanger":
      case "shell-and-tube":
      case "plate":
      case "air-cooler":
      case "reboiler":
        if (!newSettings.duty) newSettings.duty = 500;
        if (!newSettings.heatTransferArea) newSettings.heatTransferArea = 25;
        if (!newSettings.lmtd) newSettings.lmtd = 40;
        if (!newSettings.overallHeatTransferCoefficient) newSettings.overallHeatTransferCoefficient = 750;
        if (!newSettings.pressureDropShell) newSettings.pressureDropShell = 0.5;
        if (!newSettings.pressureDropTube) newSettings.pressureDropTube = 0.8;
        if (!newSettings.foulingFactor) newSettings.foulingFactor = 0.0002;
        if (!newSettings.exchangerType) {
          // Set different defaults based on specific heat exchanger type
          if (equipment.type === "shell-and-tube") {
            newSettings.exchangerType = "Shell & Tube";
            if (!newSettings.numberOfPasses) newSettings.numberOfPasses = 2;
          } else if (equipment.type === "plate") {
            newSettings.exchangerType = "Plate";
            if (!newSettings.numberOfPlates) newSettings.numberOfPlates = 50;
          } else if (equipment.type === "air-cooler") {
            newSettings.exchangerType = "Air Cooler";
            if (!newSettings.fanPower) newSettings.fanPower = 15;
          } else if (equipment.type === "reboiler") {
            newSettings.exchangerType = "Kettle Reboiler";
          } else {
            newSettings.exchangerType = "Counterflow";
          }
        }
        break;
        
      case "column":
      case "absorber":
      case "stripper":
        if (!newSettings.numberOfStages) newSettings.numberOfStages = 30;
        if (!newSettings.refluxRatio) newSettings.refluxRatio = 1.5;
        if (!newSettings.condenserDuty) newSettings.condenserDuty = -500;
        if (!newSettings.reboilerDuty) newSettings.reboilerDuty = 600;
        if (!newSettings.feedStage) newSettings.feedStage = 15;
        if (!newSettings.columnType) newSettings.columnType = "Tray";
        if (!newSettings.condenser) newSettings.condenser = "Total";
        if (!newSettings.reboiler) newSettings.reboiler = "Kettle";
        if (!newSettings.trayEfficiency) newSettings.trayEfficiency = 70;
        if (!newSettings.traySpacing) newSettings.traySpacing = 0.6;
        if (!newSettings.columnDiameter) newSettings.columnDiameter = 1.2;
        break;
        
      case "separator":
      case "flash":
      case "decanter":
      case "cyclone":
        if (!newSettings.type) {
          if (equipment.type === "flash") {
            newSettings.type = "Flash";
          } else if (equipment.type === "decanter") {
            newSettings.type = "Liquid-Liquid";
          } else if (equipment.type === "cyclone") {
            newSettings.type = "Gas-Solid";
          } else {
            newSettings.type = "Vapor-Liquid";
          }
        }
        if (!newSettings.efficiency) newSettings.efficiency = 95;
        if (!newSettings.residenceTime) newSettings.residenceTime = 5;
        if (!newSettings.separationMethod) newSettings.separationMethod = "Equilibrium";
        if (!newSettings.volume) newSettings.volume = 5;
        if (!newSettings.diameter) newSettings.diameter = 1.0;
        if (!newSettings.length) newSettings.length = 3.0;
        break;
        
      case "valve":
        if (!newSettings.valveType) newSettings.valveType = "linear";
        if (!newSettings.pressureDrop) newSettings.pressureDrop = 10;
        if (!newSettings.flowCoefficient) newSettings.flowCoefficient = 120;
        if (!newSettings.openingPercentage) newSettings.openingPercentage = 100;
        if (!newSettings.cavitationCoefficient) newSettings.cavitationCoefficient = 1.2;
        break;
        
      case "mixer":
        if (!newSettings.mixingEfficiency) newSettings.mixingEfficiency = 95;
        if (!newSettings.pressureDrop) newSettings.pressureDrop = 0.5;
        if (!newSettings.mixerType) newSettings.mixerType = "Static";
        break;
        
      case "filter":
        if (!newSettings.filterType) newSettings.filterType = "Cartridge";
        if (!newSettings.filterArea) newSettings.filterArea = 10;
        if (!newSettings.pressureDrop) newSettings.pressureDrop = 5;
        if (!newSettings.particleRetention) newSettings.particleRetention = 99.5;
        if (!newSettings.cakeResistance) newSettings.cakeResistance = 1e10;
        break;
        
      case "crystallizer":
        if (!newSettings.crystallizerType) newSettings.crystallizerType = "Batch";
        if (!newSettings.supersaturation) newSettings.supersaturation = 1.2;
        if (!newSettings.nucleationRate) newSettings.nucleationRate = 1e5;
        if (!newSettings.growthRate) newSettings.growthRate = 1e-6;
        if (!newSettings.yield) newSettings.yield = 85;
        break;
        
      case "evaporator":
        if (!newSettings.evaporatorType) newSettings.evaporatorType = "Falling Film";
        if (!newSettings.duty) newSettings.duty = 500;
        if (!newSettings.heatTransferArea) newSettings.heatTransferArea = 50;
        if (!newSettings.effects) newSettings.effects = 1;
        break;
        
      case "extractor":
        if (!newSettings.extractorType) newSettings.extractorType = "Liquid-Liquid";
        if (!newSettings.stages) newSettings.stages = 5;
        if (!newSettings.solventToFeedRatio) newSettings.solventToFeedRatio = 3;
        if (!newSettings.efficiency) newSettings.efficiency = 80;
        break;
        
      case "dryer":
        if (!newSettings.dryerType) newSettings.dryerType = "Tray";
        if (!newSettings.initialMoisture) newSettings.initialMoisture = 25;
        if (!newSettings.finalMoisture) newSettings.finalMoisture = 5;
        if (!newSettings.dryingTime) newSettings.dryingTime = 120;
        if (!newSettings.dryingTemperature) newSettings.dryingTemperature = 80;
        break;
        
      case "tank":
        if (!newSettings.tankType) newSettings.tankType = "Storage";
        if (!newSettings.volume) newSettings.volume = 100;
        if (!newSettings.diameter) newSettings.diameter = 3;
        if (!newSettings.height) newSettings.height = 6;
        if (!newSettings.level) newSettings.level = 50;
        if (!newSettings.headspace) newSettings.headspace = 10;
        break;
        
      case "centrifuge":
        if (!newSettings.centrifugeType) newSettings.centrifugeType = "Decanter";
        if (!newSettings.rotationalSpeed) newSettings.rotationalSpeed = 3000;
        if (!newSettings.separationEfficiency) newSettings.separationEfficiency = 92;
        if (!newSettings.bowlDiameter) newSettings.bowlDiameter = 0.8;
        break;
        
      // Add more equipment types as needed
      
      case "feed":
        // Handle feed streams - initialize composition if needed
        if (!newSettings.composition || Object.keys(settings.composition || {}).length === 0) {
          newSettings.composition = {
            "Methane": 0,
            "Ethane": 0,
            "Propane": 0,
            "Water": 0,
            "CO2": 0
          };
        }
        break;
    }
    
    // Set the new settings
    setSettings(newSettings);
  };

  const handleChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(equipment.id, { ...settings, _equipmentName: equipmentName });
  };

  // Helper function to safely render values
  const renderValue = (value: any): string => {
    if (value === null || value === undefined) {
      return '';
    }
    
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    
    return String(value);
  };

  const renderCompositionFields = () => {
    const composition = settings.composition || {};
    const components = Object.keys(composition);
    
    if (components.length === 0) {
      return (
        <div className="p-4 text-center bg-gray-50 rounded-md">
          <p className="text-gray-500">No components available</p>
        </div>
      );
    }
    
    // Calculate total to ensure it adds up to 100%
    const total = components.reduce((sum, comp) => sum + (parseFloat(composition[comp]) || 0), 0);
    
    return (
      <div>
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Component</span>
          <span className="text-sm font-medium text-gray-700">Mole/Mass Fraction (%)</span>
        </div>
        
        {components.map(comp => (
          <div key={comp} className="mb-3 flex items-center justify-between gap-4">
            <label className="text-sm text-gray-700 flex-1">
              {comp}
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={composition[comp] || 0}
              onChange={(e) => {
                const newComposition = { ...composition };
                newComposition[comp] = parseFloat(e.target.value) || 0;
                handleChange('composition', newComposition);
              }}
              className="w-24 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-flow-blue/20 focus:border-flow-blue"
            />
          </div>
        ))}
        
        <div className="mt-4 p-2 rounded bg-blue-50 flex justify-between items-center">
          <span className="text-sm font-medium text-blue-700">Total:</span>
          <span className={`text-sm font-bold ${Math.abs(total - 100) < 0.001 ? 'text-green-600' : 'text-amber-600'}`}>
            {total.toFixed(1)}%
          </span>
        </div>
        
        {Math.abs(total - 100) > 0.001 && (
          <div className="mt-2 p-2 bg-amber-50 text-amber-700 rounded text-xs">
            Note: Composition should sum to 100%. Current total is {total.toFixed(1)}%.
          </div>
        )}
        
        <div className="mt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              // Normalize to 100%
              if (total > 0) {
                const normalizedComposition = Object.keys(composition).reduce((acc, comp) => {
                  acc[comp] = (parseFloat(composition[comp]) || 0) * (100 / total);
                  return acc;
                }, {} as Record<string, number>);
                
                handleChange('composition', normalizedComposition);
              }
            }}
          >
            Normalize to 100%
          </Button>
        </div>
      </div>
    );
  };

  const renderBasicSettingsFields = () => {
    return (
      <div className="space-y-4">
        {/* General parameters */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={settings.status}
              onValueChange={(value) => handleChange('status', value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="standby">Standby</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="operationalMode">Operational Mode</Label>
            <Select
              value={settings.operationalMode}
              onValueChange={(value) => handleChange('operationalMode', value)}
            >
              <SelectTrigger id="operationalMode">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="simulation">Simulation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={settings.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Equipment description"
          />
        </div>
        
        <div>
          <Label htmlFor="tags">Tags/ID</Label>
          <Input
            id="tags"
            value={settings.tags || ''}
            onChange={(e) => handleChange('tags', e.target.value)}
            placeholder="e.g., E-101, TK-201"
          />
        </div>
        
        {/* Basic operating parameters */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="temperature">Temperature (°C)</Label>
            <Input
              id="temperature"
              type="number"
              value={settings.temperature || 25}
              onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
            />
          </div>
          
          <div>
            <Label htmlFor="pressure">Pressure (kPa)</Label>
            <Input
              id="pressure"
              type="number"
              value={settings.pressure || 101.325}
              onChange={(e) => handleChange('pressure', parseFloat(e.target.value))}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="flowRate">Flow Rate (kg/h)</Label>
            <Input
              id="flowRate"
              type="number"
              value={settings.flowRate || 100}
              onChange={(e) => handleChange('flowRate', parseFloat(e.target.value))}
            />
          </div>
          
          <div>
            <Label htmlFor="phase">Phase</Label>
            <Select
              value={settings.phase}
              onValueChange={(value) => handleChange('phase', value)}
            >
              <SelectTrigger id="phase">
                <SelectValue placeholder="Select phase" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Gas">Gas</SelectItem>
                <SelectItem value="Liquid">Liquid</SelectItem>
                <SelectItem value="Solid">Solid</SelectItem>
                <SelectItem value="Vapor-Liquid">Vapor-Liquid</SelectItem>
                <SelectItem value="Liquid-Liquid">Liquid-Liquid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    );
  };

  const renderDesignParameters = () => {
    // Render different design parameters based on equipment type
    switch (equipment.type) {
      case "heater":
      case "condenser":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="heatDuty">Heat Duty (kW)</Label>
                <Input
                  id="heatDuty"
                  type="number"
                  value={settings.heatDuty || 0}
                  onChange={(e) => handleChange('heatDuty', parseFloat(e.target.value))}
                />
              </div>
              
              <div>
                <Label htmlFor="heatTransferCoefficient">Heat Transfer Coefficient (W/m²·K)</Label>
                <Input
                  id="heatTransferCoefficient"
                  type="number"
                  value={settings.heatTransferCoefficient || 0}
                  onChange={(e) => handleChange('heatTransferCoefficient', parseFloat(e.target.value))}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="targetOutletTemperature">Target Outlet Temperature (°C)</Label>
                <Input
                  id="targetOutletTemperature"
                  type="number"
                  value={settings.targetOutletTemperature || 0}
                  onChange={(e) => handleChange('targetOutletTemperature', parseFloat(e.target.value))}
                />
              </div>
              
              <div>
                <Label htmlFor="heatSource">{equipment.type === "heater" ? "Heat Source" : "Coolant Type"}</Label>
                <Select
                  value={equipment.type === "heater" ? settings.heatSource : settings.coolantType}
                  onValueChange={(value) => handleChange(equipment.type === "heater" ? 'heatSource' : 'coolantType', value)}
                >
                  <SelectTrigger id={equipment.type === "heater" ? "heatSource" : "coolantType"}>
                    <SelectValue placeholder={equipment.type === "heater" ? "Select heat source" : "Select coolant"} />
                  </SelectTrigger>
                  <SelectContent>
                    {equipment.type === "heater" ? (
                      <>
                        <SelectItem value="Steam">Steam</SelectItem>
                        <SelectItem value="Hot Oil">Hot Oil</SelectItem>
                        <SelectItem value="Electric">Electric</SelectItem>
                        <SelectItem value="Furnace">Furnace</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="Cooling Water">Cooling Water</SelectItem>
                        <SelectItem value="Refrigerant">Refrigerant</SelectItem>
                        <SelectItem value="Chilled Water">Chilled Water</SelectItem>
                        <SelectItem value="Air">Air</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
        
      case "reactor":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="reactionType">Reactor Type</Label>
                <Select
                  value={settings.reactionType}
                  onValueChange={(value) => handleChange('reactionType', value)}
                >
                  <SelectTrigger id="reactionType">
                    <SelectValue placeholder="Select reactor type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CSTR">CSTR</SelectItem>
                    <SelectItem value="PFR">PFR</SelectItem>
                    <SelectItem value="Batch">Batch</SelectItem>
                    <SelectItem value="Semi-Batch">Semi-Batch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="reactorMode">Reactor Mode</Label>
                <Select
                  value={settings.reactorMode}
                  onValueChange={(value) => handleChange('reactorMode', value)}
                >
                  <SelectTrigger id="reactorMode">
                    <SelectValue placeholder="Select reactor mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Isothermal">Isothermal</SelectItem>
                    <SelectItem value="Adiabatic">Adiabatic</SelectItem>
                    <SelectItem value="Non-Isothermal">Non-Isothermal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="volume">Volume (m³)</Label>
                <Input
                  id="volume"
                  type="number"
                  value={settings.volume || 0}
                  onChange={(e) => handleChange('volume', parseFloat(e.target.value))}
                />
              </div>
              
              <div>
                <Label htmlFor="conversion">Conversion</Label>
                <Input
                  id="conversion"
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={settings.conversion || 0}
                  onChange={(e) => handleChange('conversion', parseFloat(e.target.value))}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="heatOfReaction">Heat of Reaction (kJ/mol)</Label>
                <Input
                  id="heatOfReaction"
                  type="number"
                  value={settings.heatOfReaction || 0}
                  onChange={(e) => handleChange('heatOfReaction', parseFloat(e.target.value))}
                />
              </div>
              
              <div>
                <Label htmlFor="residenceTime">Residence Time (min)</Label>
                <Input
                  id="residenceTime"
                  type="number"
                  value={settings.residenceTime || 0}
                  onChange={(e) => handleChange('residenceTime', parseFloat(e.target.value))}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="catalystType">Catalyst Type</Label>
              <Input
                id="catalystType"
                value={settings.catalystType || ''}
                onChange={(e) => handleChange('catalystType', e.target.value)}
              />
            </div>
          </div>
        );
        
      case "pump":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="efficiency">Efficiency (%)</Label>
                <Input
                  id="efficiency"
                  type="number"
                  min="0"
                  max="100"
                  value={settings.efficiency || 0}
                  onChange={(e) => handleChange('efficiency', parseFloat(e.target.value))}
                />
              </div>
              
              <div>
                <Label htmlFor="head">Head (m)</Label>
                <Input
                  id="head"
                  type="number"
                  value={settings.head || 0}
                  onChange={(e) => handleChange('head', parseFloat(e.target.value))}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="powerInput">Power Input (kW)</Label>
                <Input
                  id="powerInput"
                  type="number"
                  value={settings.powerInput || 0}
                  onChange={(e) => handleChange('powerInput', parseFloat(e.target.value))}
                />
              </div>
              
              <div>
                <Label htmlFor="npsh">NPSH (m)</Label>
                <Input
                  id="npsh"
                  type="number"
                  value={settings.npsh || 0}
                  onChange={(e) => handleChange('npsh', parseFloat(e.target.value))}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="pumpCurve">Pump Curve</Label>
              <Select
                value={settings.pumpCurve}
                onValueChange={(value) => handleChange('pumpCurve', value)}
              >
                <SelectTrigger id="pumpCurve">
                  <SelectValue placeholder="Select pump curve" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Default">Default</SelectItem>
                  <SelectItem value="Custom">Custom</SelectItem>
                  <SelectItem value="Performance">Performance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
        
      case "compressor":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="efficiency">Efficiency (%)</Label>
                <Input
                  id="efficiency"
                  type="number"
                  min="0"
                  max="100"
                  value={settings.efficiency || 0}
                  onChange={(e) => handleChange('efficiency', parseFloat(e.target.value))}
                />
              </div>
              
              <div>
                <Label htmlFor="pressureRatio">Pressure Ratio</Label>
                <Input
                  id="pressureRatio"
                  type="number"
                  value={settings.pressureRatio || 0}
                  onChange={(e) => handleChange('pressureRatio', parseFloat(e.target.value))}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="powerConsumption">Power Consumption (kW)</Label>
                <Input
                  id="powerConsumption"
                  type="number"
                  value={settings.powerConsumption || 0}
                  onChange={(e) => handleChange('powerConsumption', parseFloat(e.target.value))}
                />
              </div>
              
              <div>
                <Label htmlFor="efficiencyType">Efficiency Type</Label>
                <Select
                  value={settings.efficiencyType}
                  onValueChange={(value) => handleChange('efficiencyType', value)}
                >
                  <SelectTrigger id="efficiencyType">
                    <SelectValue placeholder="Select efficiency type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Isentropic">Isentropic</SelectItem>
                    <SelectItem value="Polytropic">Polytropic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="surgeControl"
                  checked={settings.surgeControl || false}
                  onCheckedChange={(checked) => handleChange('surgeControl', checked)}
                />
                <Label htmlFor="surgeControl">Surge Control</Label>
              </div>
              
              <div>
                <Label htmlFor="coolingType">Cooling Type</Label>
                <Select
                  value={settings.coolingType}
                  onValueChange={(value) => handleChange('coolingType', value)}
                >
                  <SelectTrigger id="coolingType">
                    <SelectValue placeholder="Select cooling type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Air-Cooled">Air-Cooled</SelectItem>
                    <SelectItem value="Water-Cooled">Water-Cooled</SelectItem>
                    <SelectItem value="Uncooled">Uncooled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
        
      case "heat-exchanger":
      case "shell-and-tube":
      case "plate":
      case "air-cooler":
      case "reboiler":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="exchangerType">Exchanger Type</Label>
                <Select
                  value={settings.exchangerType}
                  onValueChange={(value) => handleChange('exchangerType', value)}
                >
                  <SelectTrigger id="exchangerType">
                    <SelectValue placeholder="Select exchanger type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Shell & Tube">Shell & Tube</SelectItem>
                    <SelectItem value="Plate">Plate</SelectItem>
                    <SelectItem value="Air Cooler">Air Cooler</SelectItem>
                    <SelectItem value="Kettle Reboiler">Kettle Reboiler</SelectItem>
                    <SelectItem value="Double Pipe">Double Pipe</SelectItem>
                    <SelectItem value="Spiral">Spiral</SelectItem>
                    <SelectItem value="Counterflow">Counterflow</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="duty">Duty (kW)</Label>
                <Input
                  id="duty"
                  type="number"
                  value={settings.duty || 0}
                  onChange={(e) => handleChange('duty', parseFloat(e.target.value))}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="heatTransferArea">Heat Transfer Area (m²)</Label>
                <Input
                  id="heatTransferArea"
                  type="number"
                  value={settings.heatTransferArea || 0}
                  onChange={(e) => handleChange('heatTransferArea', parseFloat(e.target.value))}
                />
              </div>
              
              <div>
                <Label htmlFor="lmtd">LMTD (°C)</Label>
                <Input
                  id="lmtd"
                  type="number"
                  value={settings.lmtd || 0}
                  onChange={(e) => handleChange('lmtd', parseFloat(e.target.value))}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="overallHeatTransferCoefficient">Overall Heat Transfer Coefficient (W/m²·K)</Label>
                <Input
                  id="overallHeatTransferCoefficient"
                  type="number"
                  value={settings.overallHeatTransferCoefficient || 0}
                  onChange={(e) => handleChange('overallHeatTransferCoefficient', parseFloat(e.target.value))}
                />
              </div>
              
              <div>
                <Label htmlFor="foulingFactor">Fouling Factor (m²·K/W)</Label>
                <Input
                  id="foulingFactor"
                  type="number"
                  step="0.0001"
                  value={settings.foulingFactor || 0}
                  onChange={(e) => handleChange('foulingFactor', parseFloat(e.target.value))}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pressureDropShell">Pressure Drop Shell Side (kPa)</Label>
                <Input
                  id="pressureDropShell"
                  type="number"
                  value={settings.pressureDropShell || 0}
                  onChange={(e) => handleChange('pressureDropShell', parseFloat(e.target.value))}
                />
              </div>
              
              <div>
                <Label htmlFor="pressureDropTube">Pressure Drop Tube Side (kPa)</Label>
                <Input
                  id="pressureDropTube"
                  type="number"
                  value={settings.pressureDropTube || 0}
                  onChange={(e) => handleChange('pressureDropTube', parseFloat(e.target.value))}
                />
              </div>
            </div>
            
            {/* Specific fields based on exchanger type */}
            {settings.exchangerType === "Shell & Tube" && (
              <div>
                <Label htmlFor="numberOfPasses">Number of Passes</Label>
                <Input
                  id="numberOfPasses"
                  type="number"
                  value={settings.numberOfPasses || 0}
                  onChange={(e) => handleChange('numberOfPasses', parseInt(e.target.value))}
                />
              </div>
            )}
            
            {settings.exchangerType === "Plate" && (
              <div>
                <Label htmlFor="numberOfPlates">Number of Plates</Label>
                <Input
                  id="numberOfPlates"
                  type="number"
                  value={settings.numberOfPlates || 0}
                  onChange={(e) => handleChange('numberOfPlates', parseInt(e.target.value))}
                />
              </div>
            )}
            
            {settings.exchangerType === "Air Cooler" && (
              <div>
                <Label htmlFor="fanPower">Fan Power (kW)</Label>
                <Input
                  id="fanPower"
                  type="number"
                  value={settings.fanPower || 0}
                  onChange={(e) => handleChange('fanPower', parseFloat(e.target.value))}
                />
              </div>
            )}
          </div>
        );
        
      case "column":
      case "absorber":
      case "stripper":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="numberOfStages">Number of Stages</Label>
                <Input
                  id="numberOfStages"
                  type="number"
                  value={settings.numberOfStages || 0}
                  onChange={(e) => handleChange('numberOfStages', parseInt(e.target.value))}
                />
              </div>
              
              <div>
                <Label htmlFor="feedStage">Feed Stage</Label>
                <Input
                  id="feedStage"
                  type="number"
                  value={settings.feedStage || 0}
                  onChange={(e) => handleChange('feedStage', parseInt(e.target.value))}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="refluxRatio">Reflux Ratio</Label>
                <Input
                  id="refluxRatio"
                  type="number"
                  value={settings.refluxRatio || 0}
                  onChange={(e) => handleChange('refluxRatio', parseFloat(e.target.value))}
                />
              </div>
              
              <div>
                <Label htmlFor="columnType">Column Type</Label>
                <Select
                  value={settings.columnType}
                  onValueChange={(value) => handleChange('columnType', value)}
                >
                  <SelectTrigger id="columnType">
                    <SelectValue placeholder="Select column type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tray">Tray</SelectItem>
                    <SelectItem value="Packed">Packed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="condenserDuty">Condenser Duty (kW)</Label>
                <Input
                  id="condenserDuty"
                  type="number"
                  value={settings.condenserDuty || 0}
                  onChange={(e) => handleChange('condenserDuty', parseFloat(e.target.value))}
                />
              </div>
              
              <div>
                <Label htmlFor="reboilerDuty">Reboiler Duty (kW)</Label>
                <Input
                  id="reboilerDuty"
                  type="number"
                  value={settings.reboilerDuty || 0}
                  onChange={(e) => handleChange('reboilerDuty', parseFloat(e.target.value))}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="condenser">Condenser Type</Label>
                <Select
                  value={settings.condenser}
                  onValueChange={(value) => handleChange('condenser', value)}
                >
                  <SelectTrigger id="condenser">
                    <SelectValue placeholder="Select condenser type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Total">Total</SelectItem>
                    <SelectItem value="Partial">Partial</SelectItem>
                    <SelectItem value="None">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="reboiler">Reboiler Type</Label>
                <Select
                  value={settings.reboiler}
                  onValueChange={(value) => handleChange('reboiler', value)}
                >
                  <SelectTrigger id="reboiler">
                    <SelectValue placeholder="Select reboiler type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Kettle">Kettle</SelectItem>
                    <SelectItem value="Thermosiphon">Thermosiphon</SelectItem>
                    <SelectItem value="Forced Circulation">Forced Circulation</SelectItem>
                    <SelectItem value="None">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="trayEfficiency">Tray Efficiency (%)</Label>
                <Input
                  id="trayEfficiency"
                  type="number"
                  min="0"
                  max="100"
                  value={settings.trayEfficiency || 0}
                  onChange={(e) => handleChange('trayEfficiency', parseFloat(e.target.value))}
                />
              </div>
              
              <div>
                <Label htmlFor="columnDiameter">Column Diameter (m)</Label>
                <Input
                  id="columnDiameter"
                  type="number"
                  value={settings.columnDiameter || 0}
                  onChange={(e) => handleChange('columnDiameter', parseFloat(e.target.value))}
                />
              </div>
            </div>
          </div>
        );
        
      // Add more equipment types as needed
      
      default:
        return (
          <div className="p-4 text-center">
            <p className="text-gray-500">No specific design parameters available for this equipment type.</p>
          </div>
        );
    }
  };

  const renderPerformanceParameters = () => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="efficiency">Efficiency (%)</Label>
            <Input
              id="efficiency"
              type="number"
              min="0"
              max="100"
              value={settings.efficiency || 0}
              onChange={(e) => handleChange('efficiency', parseFloat(e.target.value))}
            />
          </div>
          
          <div>
            <Label htmlFor="duty">Duty (kW)</Label>
            <Input
              id="duty"
              type="number"
              value={settings.duty || 0}
              onChange={(e) => handleChange('duty', parseFloat(e.target.value))}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="pressureDrop">Pressure Drop (kPa)</Label>
            <Input
              id="pressureDrop"
              type="number"
              value={settings.pressureDrop || 0}
              onChange={(e) => handleChange('pressureDrop', parseFloat(e.target.value))}
            />
          </div>
          
          <div>
            <Label htmlFor="energyUsage">Energy Usage (kWh)</Label>
            <Input
              id="energyUsage"
              type="number"
              value={settings.energyUsage || 0}
              onChange={(e) => handleChange('energyUsage', parseFloat(e.target.value))}
            />
          </div>
        </div>
        
        {(equipment.type === "reactor" || equipment.type === "crystallizer") && (
          <div>
            <Label htmlFor="conversion">Conversion</Label>
            <Input
              id="conversion"
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={settings.conversion || 0}
              onChange={(e) => handleChange('conversion', parseFloat(e.target.value))}
            />
          </div>
        )}
      </div>
    );
  };

  const renderConstraintsParameters = () => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="minFlow">Minimum Flow (kg/h)</Label>
            <Input
              id="minFlow"
              type="number"
              value={settings.minFlow || 0}
              onChange={(e) => handleChange('minFlow', parseFloat(e.target.value))}
            />
          </div>
          
          <div>
            <Label htmlFor="maxFlow">Maximum Flow (kg/h)</Label>
            <Input
              id="maxFlow"
              type="number"
              value={settings.maxFlow || 0}
              onChange={(e) => handleChange('maxFlow', parseFloat(e.target.value))}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="minTemp">Minimum Temperature (°C)</Label>
            <Input
              id="minTemp"
              type="number"
              value={settings.minTemp || 0}
              onChange={(e) => handleChange('minTemp', parseFloat(e.target.value))}
            />
          </div>
          
          <div>
            <Label htmlFor="maxTemp">Maximum Temperature (°C)</Label>
            <Input
              id="maxTemp"
              type="number"
              value={settings.maxTemp || 0}
              onChange={(e) => handleChange('maxTemp', parseFloat(e.target.value))}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="minPressure">Minimum Pressure (kPa)</Label>
            <Input
              id="minPressure"
              type="number"
              value={settings.minPressure || 0}
              onChange={(e) => handleChange('minPressure', parseFloat(e.target.value))}
            />
          </div>
          
          <div>
            <Label htmlFor="maxPressure">Maximum Pressure (kPa)</Label>
            <Input
              id="maxPressure"
              type="number"
              value={settings.maxPressure || 0}
              onChange={(e) => handleChange('maxPressure', parseFloat(e.target.value))}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="safetyLimits">Safety Limits</Label>
          <Input
            id="safetyLimits"
            value={settings.safetyLimits || ''}
            onChange={(e) => handleChange('safetyLimits', e.target.value)}
            placeholder="e.g., Max operating pressure: 600 kPa, Emergency shutdown at 350°C"
          />
        </div>
      </div>
    );
  };

  const renderControlsParameters = () => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="controlMode">Control Mode</Label>
            <Select
              value={settings.controlMode}
              onValueChange={(value) => handleChange('controlMode', value)}
            >
              <SelectTrigger id="controlMode">
                <SelectValue placeholder="Select control mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Manual">Manual</SelectItem>
                <SelectItem value="Automatic">Automatic</SelectItem>
                <SelectItem value="Cascade">Cascade</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="pidController">PID Controller</Label>
            <Input
              id="pidController"
              value={settings.pidController || ''}
              onChange={(e) => handleChange('pidController', e.target.value)}
              placeholder="e.g., PIC-101"
            />
          </div>
        </div>
        
        {equipment.type === "valve" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="valveType">Valve Type</Label>
              <Select
                value={settings.valveType}
                onValueChange={(value) => handleChange('valveType', value)}
              >
                <SelectTrigger id="valveType">
                  <SelectValue placeholder="Select valve type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linear">Linear</SelectItem>
                  <SelectItem value="equal">Equal Percentage</SelectItem>
                  <SelectItem value="quick">Quick Opening</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="openingPercentage">Opening Percentage (%)</Label>
              <Input
                id="openingPercentage"
                type="number"
                min="0"
                max="100"
                value={settings.openingPercentage || 0}
                onChange={(e) => handleChange('openingPercentage', parseFloat(e.target.value))}
              />
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="setpoint">Setpoint</Label>
            <Input
              id="setpoint"
              type="number"
              value={settings.setpoint || 0}
              onChange={(e) => handleChange('setpoint', parseFloat(e.target.value))}
            />
          </div>
          
          <div>
            <Label htmlFor="controlVariable">Control Variable</Label>
            <Select
              value={settings.controlVariable}
              onValueChange={(value) => handleChange('controlVariable', value)}
            >
              <SelectTrigger id="controlVariable">
                <SelectValue placeholder="Select control variable" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Temperature">Temperature</SelectItem>
                <SelectItem value="Pressure">Pressure</SelectItem>
                <SelectItem value="Flow">Flow</SelectItem>
                <SelectItem value="Level">Level</SelectItem>
                <SelectItem value="Composition">Composition</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    );
  };

  const renderConnectionsParameters = () => {
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="inletStreams">Inlet Streams</Label>
          <Input
            id="inletStreams"
            value={settings.inletStreams || ''}
            onChange={(e) => handleChange('inletStreams', e.target.value)}
            placeholder="e.g., Stream-1, Stream-2"
          />
        </div>
        
        <div>
          <Label htmlFor="outletStreams">Outlet Streams</Label>
          <Input
            id="outletStreams"
            value={settings.outletStreams || ''}
            onChange={(e) => handleChange('outletStreams', e.target.value)}
            placeholder="e.g., Stream-3, Stream-4"
          />
        </div>
        
        <div>
          <Label htmlFor="energyStreams">Energy Streams</Label>
          <Input
            id="energyStreams"
            value={settings.energyStreams || ''}
            onChange={(e) => handleChange('energyStreams', e.target.value)}
            placeholder="e.g., Heat-1, Work-1"
          />
        </div>
        
        <div>
          <Label htmlFor="recycleStreams">Recycle Streams</Label>
          <Input
            id="recycleStreams"
            value={settings.recycleStreams || ''}
            onChange={(e) => handleChange('recycleStreams', e.target.value)}
            placeholder="e.g., Recycle-1"
          />
        </div>
      </div>
    );
  };

  const renderAdvancedSettingsFields = () => {
    const basicKeys = ['temperature', 'pressure', 'flowRate', 'phase', 'volume', 'efficiency', 'composition'];
    const advancedSettings = Object.entries(settings).filter(([key]) => 
      !basicKeys.includes(key) && 
      !key.includes('temperature') && 
      !key.includes('pressure') && 
      !key.includes('flow') &&
      !key.includes('efficiency')
    );
    
    if (advancedSettings.length === 0) {
      return <div className="p-4 text-gray-500 text-center">No advanced settings available</div>;
    }
    
    return advancedSettings.map(([key, value]) => {
      if (typeof value === 'number') {
        return (
          <div key={key} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => handleChange(key, parseFloat(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-flow-blue/20 focus:border-flow-blue"
            />
          </div>
        );
      } else if (typeof value === 'string') {
        return (
          <div key={key} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => handleChange(key, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-flow-blue/20 focus:border-flow-blue"
            />
          </div>
        );
      } else if (typeof value === 'boolean') {
        return (
          <div key={key} className="mb-4 flex items-center">
            <label className="text-sm font-medium text-gray-700 capitalize mr-2">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => handleChange(key, e.target.checked)}
              className="rounded text-flow-blue focus:ring-flow-blue h-4 w-4"
            />
          </div>
        );
      } else if (typeof value === 'object' && value !== null && key !== 'composition') {
        // Render complex objects as read-only text
        return (
          <div key={key} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            <div className="p-2 bg-gray-50 border border-gray-200 rounded-md">
              <pre className="text-xs overflow-auto">
                {JSON.stringify(value, null, 2)}
              </pre>
            </div>
          </div>
        );
      }
      
      return null;
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto animate-fade-in">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium bg-gradient-to-r from-flow-blue to-blue-700 bg-clip-text text-transparent">
            {typeof equipment.name === 'string' ? equipment.name : String(equipment.name)} Settings
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Equipment Name
            </label>
            <input
              type="text"
              value={equipmentName}
              onChange={(e) => setEquipmentName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-flow-blue/20 focus:border-flow-blue"
            />
          </div>
          
          {equipment.subType && (
            <div className="mb-6">
              <span className="text-sm text-gray-500">
                Type: {equipment.type} - {equipment.subType}
              </span>
            </div>
          )}
          
          <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="constraints">Constraints</TabsTrigger>
              <TabsTrigger value="controls">Controls</TabsTrigger>
              <TabsTrigger value="connections">Connections</TabsTrigger>
              {equipment.type === 'feed' && (
                <TabsTrigger value="composition">Composition</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4">
              {renderBasicSettingsFields()}
            </TabsContent>
            
            <TabsContent value="design" className="space-y-4">
              {renderDesignParameters()}
            </TabsContent>
            
            <TabsContent value="performance" className="space-y-4">
              {renderPerformanceParameters()}
            </TabsContent>
            
            <TabsContent value="advanced" className="space-y-4">
              {renderAdvancedSettingsFields()}
            </TabsContent>
            
            <TabsContent value="constraints" className="space-y-4">
              {renderConstraintsParameters()}
            </TabsContent>
            
            <TabsContent value="controls" className="space-y-4">
              {renderControlsParameters()}
            </TabsContent>
            
            <TabsContent value="connections" className="space-y-4">
              {renderConnectionsParameters()}
            </TabsContent>
            
            {equipment.type === 'feed' && (
              <TabsContent value="composition" className="space-y-4">
                {renderCompositionFields()}
              </TabsContent>
            )}
          </Tabs>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-gradient-to-r from-flow-blue to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EquipmentSettings;
