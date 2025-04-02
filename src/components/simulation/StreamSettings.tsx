
import React, { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface StreamSettingsProps {
  streamId: string;
  onClose: () => void;
  onSave: (streamId: string, parameters: any) => void;
  availableComponents: string[];
  initialParameters?: any;
}

const StreamSettings: React.FC<StreamSettingsProps> = ({
  streamId,
  onClose,
  onSave,
  availableComponents,
  initialParameters = {}
}) => {
  const [parameters, setParameters] = useState({
    flowRate: initialParameters.flowRate || 1000,
    temperature: initialParameters.temperature || 25,
    pressure: initialParameters.pressure || 1.01325,
    phase: initialParameters.phase || 'Liquid',
    composition: initialParameters.composition || 
      Object.fromEntries(availableComponents.map(c => [c, 1/availableComponents.length]))
  });
  
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    composition: false
  });
  
  // Normalize composition to sum to 1
  useEffect(() => {
    const normalizeComposition = () => {
      const composition = {...parameters.composition};
      // Fix: ensure total is a number
      const total = Object.values(composition).reduce((sum, val) => sum + (typeof val === 'number' ? val : 0), 0);
      
      if (total > 0) {
        Object.keys(composition).forEach(key => {
          if (typeof composition[key] === 'number') {
            composition[key] = composition[key] / total;
          }
        });
        
        setParameters(prev => ({
          ...prev,
          composition
        }));
      }
    };
    
    normalizeComposition();
  }, []);
  
  const handleSave = () => {
    onSave(streamId, parameters);
    onClose();
  };
  
  const handleChange = (field: string, value: any) => {
    setParameters(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleCompositionChange = (component: string, value: number) => {
    setParameters(prev => ({
      ...prev,
      composition: {
        ...prev.composition,
        [component]: value
      }
    }));
  };
  
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  const phases = ['Vapor', 'Liquid', 'Mixed', 'Solid'];
  
  // Calculate total composition to normalize sliders - Fix: ensure values are numbers
  const totalComposition = Object.values(parameters.composition)
    .reduce((sum, val) => sum + (typeof val === 'number' ? val : 0), 0);
  
  return (
    <div className="stream-settings bg-white rounded-lg shadow-lg border border-blue-100 p-4 max-w-md w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-flow-blue">Stream Settings</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <div className="space-y-4">
        {/* Basic Parameters Section */}
        <div className="border border-gray-100 rounded-lg overflow-hidden">
          <div 
            className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
            onClick={() => toggleSection('basic')}
          >
            <h4 className="font-medium text-gray-700">Basic Parameters</h4>
            {expandedSections.basic ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </div>
          
          {expandedSections.basic && (
            <div className="p-3 space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Flow Rate (kg/h)</label>
                <div className="flex items-center gap-3">
                  <Slider 
                    value={[parameters.flowRate]}
                    min={0}
                    max={10000}
                    step={100}
                    onValueChange={(values) => handleChange('flowRate', values[0])}
                    className="flex-1"
                  />
                  <input
                    type="number"
                    value={parameters.flowRate}
                    onChange={(e) => handleChange('flowRate', Number(e.target.value))}
                    className="w-20 p-1 border border-gray-300 rounded text-right"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-700 mb-1">Temperature (°C)</label>
                <div className="flex items-center gap-3">
                  <Slider 
                    value={[parameters.temperature]}
                    min={-50}
                    max={500}
                    step={1}
                    onValueChange={(values) => handleChange('temperature', values[0])}
                    className="flex-1"
                  />
                  <input
                    type="number"
                    value={parameters.temperature}
                    onChange={(e) => handleChange('temperature', Number(e.target.value))}
                    className="w-20 p-1 border border-gray-300 rounded text-right"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-700 mb-1">Pressure (bar)</label>
                <div className="flex items-center gap-3">
                  <Slider 
                    value={[parameters.pressure]}
                    min={0.01}
                    max={200}
                    step={0.1}
                    onValueChange={(values) => handleChange('pressure', values[0])}
                    className="flex-1"
                  />
                  <input
                    type="number"
                    value={parameters.pressure}
                    onChange={(e) => handleChange('pressure', Number(e.target.value))}
                    className="w-20 p-1 border border-gray-300 rounded text-right"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-700 mb-1">Phase</label>
                <select
                  value={parameters.phase}
                  onChange={(e) => handleChange('phase', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  {phases.map(phase => (
                    <option key={phase} value={phase}>{phase}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
        
        {/* Composition Section */}
        <div className="border border-gray-100 rounded-lg overflow-hidden">
          <div 
            className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
            onClick={() => toggleSection('composition')}
          >
            <h4 className="font-medium text-gray-700">Composition</h4>
            {expandedSections.composition ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </div>
          
          {expandedSections.composition && (
            <div className="p-3 space-y-3">
              {availableComponents.map(component => (
                <div key={component}>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm text-gray-700">{component}</label>
                    <span className="text-sm font-medium">
                      {(parameters.composition[component] / totalComposition * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Slider 
                    value={[parameters.composition[component] * 100]}
                    min={0}
                    max={100}
                    step={0.1}
                    onValueChange={(values) => handleCompositionChange(component, values[0] / 100)}
                    className="mb-3"
                  />
                </div>
              ))}
              
              <div className="text-xs text-gray-500 italic mt-2">
                Note: Composition values will be normalized to sum to 100%
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-end mt-6 space-x-3">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default StreamSettings;
