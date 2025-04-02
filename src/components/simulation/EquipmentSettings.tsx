
import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EquipmentSettingsProps {
  equipment: {
    id: string;
    type: string;
    name: string;
    settings: Record<string, any>;
  };
  equipmentTypes?: {
    id: string;
    name: string;
    icon: React.ReactNode;
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

  const renderSettingsFields = () => {
    return Object.entries(settings).map(([key, value]) => {
      // Skip rendering composition for now as it's a complex nested object
      if (key === 'composition') {
        return null;
      }
      
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
        if (key === 'reactionType' || key === 'valveType') {
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
      } else if (typeof value === 'object' && value !== null) {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium">
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
          
          <h4 className="font-medium mb-3 mt-6">Parameters</h4>
          {renderSettingsFields()}
          
          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EquipmentSettings;
