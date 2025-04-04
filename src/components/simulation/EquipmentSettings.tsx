import React, { useState, useEffect } from "react";
import { X, Link as LinkIcon, Settings2, PlusCircle, AlignJustify } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  allEquipment?: {
    id: string;
    type: string;
    name: string;
  }[];
  onConnectEquipment?: (sourceId: string, targetId: string) => void;
}

const EquipmentSettings: React.FC<EquipmentSettingsProps> = ({
  equipment,
  equipmentTypes,
  onClose,
  onSave,
  allEquipment = [],
  onConnectEquipment,
}) => {
  const [settings, setSettings] = useState<Record<string, any>>(equipment.settings);
  const [equipmentName, setEquipmentName] = useState(equipment.name);
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced' | 'composition' | 'connect'>('basic');

  useEffect(() => {
    if (equipment.type === 'feed' && 
        (!settings.composition || Object.keys(settings.composition).length === 0)) {
      
      const components = Object.keys(settings.composition || {});
      if (components.length > 0) {
        const newComposition = components.reduce((acc, comp) => {
          acc[comp] = 0;
          return acc;
        }, {} as Record<string, number>);
        
        setSettings(prev => ({
          ...prev,
          composition: newComposition
        }));
      }
    }
  }, [equipment]);

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
    
    const total = components.reduce((sum, comp) => sum + (parseFloat(composition[comp]) || 0), 0);
    
    return (
      <div>
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Component</span>
          <span className="text-sm font-medium text-gray-700">Mole/Mass Fraction (%)</span>
        </div>
        
        {components.map(comp => (
          <div key={comp} className="mb-3 flex items-center justify-between gap-4">
            <label className="text-sm text-gray-700 flex-1 colorful-border blue">
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
              className="w-24 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-flow-blue/20 focus:border-flow-blue colorful-input"
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
              if (total > 0) {
                const normalizedComposition = Object.keys(composition).reduce((acc, comp) => {
                  acc[comp] = (parseFloat(composition[comp]) || 0) * (100 / total);
                  return acc;
                }, {} as Record<string, number>);
                
                handleChange('composition', normalizedComposition);
              }
            }}
            className="bg-gradient-blue-cyan hover:shadow-blue-300/50 text-white hover:bg-blue-600"
          >
            Normalize to 100%
          </Button>
        </div>
      </div>
    );
  };

  const renderConnectFields = () => {
    const connectableEquipment = allEquipment?.filter(eq => 
      eq.id !== equipment.id
    ) || [];
    
    if (connectableEquipment.length === 0) {
      return (
        <div className="p-4 text-center bg-gray-50 rounded-md">
          <p className="text-gray-500">No other equipment available to connect</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-2">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2 colorful-border purple">
            Connect {equipment.name} to:
          </h3>
          <div className="space-y-1 max-h-[300px] overflow-y-auto border border-gray-100 p-2 rounded-md">
            {connectableEquipment.map(eq => (
              <div 
                key={eq.id}
                onClick={() => onConnectEquipment && onConnectEquipment(equipment.id, eq.id)}
                className="connect-item cursor-pointer"
              >
                <LinkIcon className="h-4 w-4 mr-2 text-indigo-500" />
                <span className="font-medium text-sm">{eq.name}</span>
                <span className="ml-2 text-xs text-gray-500">({eq.type})</span>
                <PlusCircle className="h-4 w-4 ml-auto text-green-500" />
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-indigo-50 p-3 rounded-md mt-4">
          <div className="flex items-start">
            <Settings2 className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-indigo-700">Connection Info</h4>
              <p className="text-xs text-indigo-600 mt-1">
                Connections define the flow of materials and energy between equipment. Click on an equipment to create a connection.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBasicSettingsFields = () => {
    const basicKeys = ['temperature', 'pressure', 'flowRate', 'phase', 'volume', 'efficiency'];
    const filteredSettings = Object.entries(settings).filter(([key]) => 
      basicKeys.includes(key) || 
      key.includes('temperature') || 
      key.includes('pressure') || 
      key.includes('flow') ||
      key.includes('efficiency')
    );
    
    if (filteredSettings.length === 0) {
      return <div className="p-4 text-gray-500 text-center">No basic settings available</div>;
    }
    
    return filteredSettings.map(([key, value]) => {
      if (typeof value === 'number') {
        let unit = "";
        let min = 0;
        let step = 0.1;
        let maxValue = 100;
        
        if (key.includes('temperature')) {
          unit = "°C";
          min = -273.15;
          step = 1;
        } else if (key.includes('pressure')) {
          unit = "kPa";
          min = 0;
          step = 1;
        } else if (key.includes('flow')) {
          unit = "kg/h";
          min = 0;
          step = 1;
        } else if (key.includes('efficiency')) {
          unit = "%";
          min = 0;
          maxValue = 100;
        } else if (key.includes('volume')) {
          unit = "m³";
          min = 0;
        }
        
        return (
          <div key={key} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize colorful-border green">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            <div className="flex items-center">
              <input
                type="number"
                min={min}
                step={step}
                max={key.includes('efficiency') ? maxValue : undefined}
                value={value}
                onChange={(e) => handleChange(key, parseFloat(e.target.value))}
                className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-flow-blue/20 focus:border-flow-blue colorful-input"
              />
              {unit && <span className="ml-2 text-sm text-gray-500">{unit}</span>}
            </div>
          </div>
        );
      } else if (typeof value === 'string') {
        if (key === 'phase') {
          const options = ['Gas', 'Liquid', 'Solid', 'Vapor-Liquid'];
          
          return (
            <div key={key} className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize colorful-border green">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <select
                value={value}
                onChange={(e) => handleChange(key, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-flow-blue/20 focus:border-flow-blue colorful-input"
              >
                {options.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          );
        } else if (key === 'reactionType' || key === 'valveType') {
          const options = key === 'reactionType' 
            ? ['CSTR', 'PFR', 'Batch'] 
            : ['linear', 'equal', 'quick'];
            
          return (
            <div key={key} className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize colorful-border green">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <select
                value={value}
                onChange={(e) => handleChange(key, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-flow-blue/20 focus:border-flow-blue colorful-input"
              >
                {options.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          );
        }
        
        return (
          <div key={key} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize colorful-border green">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => handleChange(key, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-flow-blue/20 focus:border-flow-blue colorful-input"
            />
          </div>
        );
      }
      
      return null;
    });
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
            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize colorful-border orange">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => handleChange(key, parseFloat(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-flow-blue/20 focus:border-flow-blue colorful-input"
            />
          </div>
        );
      } else if (typeof value === 'string') {
        return (
          <div key={key} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize colorful-border orange">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => handleChange(key, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-flow-blue/20 focus:border-flow-blue colorful-input"
            />
          </div>
        );
      } else if (typeof value === 'boolean') {
        return (
          <div key={key} className="mb-4 flex items-center">
            <label className="text-sm font-medium text-gray-700 capitalize mr-2 colorful-border orange">
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
        return (
          <div key={key} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize colorful-border orange">
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
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto animate-fade-in">
        <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <h3 className="text-lg font-medium">
            {typeof equipment.name === 'string' ? equipment.name : String(equipment.name)} Settings
          </h3>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1 colorful-border purple">
              Equipment Name
            </label>
            <input
              type="text"
              value={equipmentName}
              onChange={(e) => setEquipmentName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-500 colorful-input"
            />
          </div>
          
          {equipment.subType && (
            <div className="mb-6">
              <span className="text-sm text-gray-500">
                Type: {equipment.type} - {equipment.subType}
              </span>
            </div>
          )}
          
          <div className="mb-6 border-b border-gray-200">
            <div className="flex -mb-px overflow-x-auto">
              <button
                type="button"
                className={`py-2 px-4 flex items-center colorful-tab ${
                  activeTab === 'basic' ? 'active purple' : ''
                }`}
                onClick={() => setActiveTab('basic')}
              >
                <Settings2 className="h-4 w-4 mr-1" />
                Basic Parameters
              </button>
              <button
                type="button"
                className={`py-2 px-4 flex items-center colorful-tab ${
                  activeTab === 'advanced' ? 'active orange' : ''
                }`}
                onClick={() => setActiveTab('advanced')}
              >
                <AlignJustify className="h-4 w-4 mr-1" />
                Advanced
              </button>
              {equipment.type === 'feed' && (
                <button
                  type="button"
                  className={`py-2 px-4 flex items-center colorful-tab ${
                    activeTab === 'composition' ? 'active blue' : ''
                  }`}
                  onClick={() => setActiveTab('composition')}
                >
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Composition
                </button>
              )}
              <button
                type="button"
                className={`py-2 px-4 flex items-center colorful-tab ${
                  activeTab === 'connect' ? 'active green' : ''
                }`}
                onClick={() => setActiveTab('connect')}
              >
                <LinkIcon className="h-4 w-4 mr-1" />
                Connect To
              </button>
            </div>
          </div>
          
          <div className="space-y-2 tab-panel">
            {activeTab === 'basic' && renderBasicSettingsFields()}
            {activeTab === 'advanced' && renderAdvancedSettingsFields()}
            {activeTab === 'composition' && renderCompositionFields()}
            {activeTab === 'connect' && renderConnectFields()}
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
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
