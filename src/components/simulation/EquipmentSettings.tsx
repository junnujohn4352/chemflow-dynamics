
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
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
}

const EquipmentSettings: React.FC<EquipmentSettingsProps> = ({
  equipment,
  equipmentTypes,
  onClose,
  onSave,
}) => {
  const [settings, setSettings] = useState<Record<string, any>>(equipment.settings);
  const [equipmentName, setEquipmentName] = useState(equipment.name);
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced' | 'composition'>('basic');

  useEffect(() => {
    // If it's a feed stream and we have components but no composition,
    // initialize composition to 0 for each component
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
        // Determine appropriate units based on key name
        let unit = "";
        let min = 0;
        let step = 0.1;
        
        if (key.includes('temperature')) {
          unit = "°C";
          min = -273.15; // Absolute zero
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
          max = 100;
        } else if (key.includes('volume')) {
          unit = "m³";
          min = 0;
        }
        
        return (
          <div key={key} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            <div className="flex items-center">
              <input
                type="number"
                min={min}
                step={step}
                value={value}
                onChange={(e) => handleChange(key, parseFloat(e.target.value))}
                className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-flow-blue/20 focus:border-flow-blue"
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
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <select
                value={value}
                onChange={(e) => handleChange(key, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-flow-blue/20 focus:border-flow-blue"
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
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <select
                value={value}
                onChange={(e) => handleChange(key, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-flow-blue/20 focus:border-flow-blue"
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
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto animate-fade-in">
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
          
          <div className="mb-6 border-b border-gray-200">
            <div className="flex -mb-px">
              <button
                type="button"
                className={`py-2 px-4 border-b-2 ${
                  activeTab === 'basic' 
                    ? 'border-flow-blue text-flow-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('basic')}
              >
                Basic Parameters
              </button>
              <button
                type="button"
                className={`py-2 px-4 border-b-2 ${
                  activeTab === 'advanced' 
                    ? 'border-flow-blue text-flow-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('advanced')}
              >
                Advanced
              </button>
              {equipment.type === 'feed' && (
                <button
                  type="button"
                  className={`py-2 px-4 border-b-2 ${
                    activeTab === 'composition' 
                      ? 'border-flow-blue text-flow-blue'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('composition')}
                >
                  Composition
                </button>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            {activeTab === 'basic' && renderBasicSettingsFields()}
            {activeTab === 'advanced' && renderAdvancedSettingsFields()}
            {activeTab === 'composition' && renderCompositionFields()}
          </div>
          
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
