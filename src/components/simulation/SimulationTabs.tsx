
import React from 'react';
import { Check, Database, Thermometer, Layers, BarChart3 } from 'lucide-react';

interface SimulationTabsProps {
  activeTab: 'components' | 'thermodynamics' | 'builder';
  setActiveTab: (tab: 'components' | 'thermodynamics' | 'builder') => void;
  componentsValid: boolean;
  selectedModel: string;
  isSimulationComplete: boolean;
  showAnalysis: boolean;
  setShowAnalysis: (show: boolean) => void;
}

const SimulationTabs: React.FC<SimulationTabsProps> = ({
  activeTab,
  setActiveTab,
  componentsValid,
  selectedModel,
  isSimulationComplete,
  showAnalysis,
  setShowAnalysis
}) => {
  return (
    <div className="mb-6 border-b border-gray-200">
      <div className="flex space-x-4">
        <button
          className={`py-3 px-4 flex items-center border-b-2 font-medium text-sm transition-colors ${
            activeTab === 'components' 
              ? 'border-flow-blue text-flow-blue' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
          onClick={() => setActiveTab('components')}
        >
          <Database className="mr-2 h-4 w-4" />
          Components
          {componentsValid && <Check className="ml-2 h-3 w-3 text-green-500" />}
        </button>
        <button
          className={`py-3 px-4 flex items-center border-b-2 font-medium text-sm transition-colors ${
            activeTab === 'thermodynamics' 
              ? 'border-flow-blue text-flow-blue' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
          onClick={() => setActiveTab('thermodynamics')}
        >
          <Thermometer className="mr-2 h-4 w-4" />
          Thermodynamics
          {selectedModel && <Check className="ml-2 h-3 w-3 text-green-500" />}
        </button>
        <button
          className={`py-3 px-4 flex items-center border-b-2 font-medium text-sm transition-colors ${
            activeTab === 'builder' 
              ? 'border-flow-blue text-flow-blue' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
          onClick={() => setActiveTab('builder')}
        >
          <Layers className="mr-2 h-4 w-4" />
          Flowsheet Builder
          {isSimulationComplete && <Check className="ml-2 h-3 w-3 text-green-500" />}
        </button>
        
        {isSimulationComplete && (
          <button
            className={`py-3 px-4 flex items-center border-b-2 font-medium text-sm transition-colors
              ${showAnalysis ? 'border-flow-blue text-flow-blue' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setShowAnalysis(!showAnalysis)}
            id="analysis-tab"
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Analysis
          </button>
        )}
      </div>
    </div>
  );
};

export default SimulationTabs;
