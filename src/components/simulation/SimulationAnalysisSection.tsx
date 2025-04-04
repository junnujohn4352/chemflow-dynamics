
import React from 'react';
import { Button } from '@/components/ui/button';
import GlassPanel from '@/components/ui/GlassPanel';
import { ChevronUp, ChevronDown } from 'lucide-react';
import HysysIntegration from '@/components/simulation/HysysIntegration';
import SimulationAnalysisCharts from '@/components/simulation/SimulationAnalysisCharts';
import { SubjectAnalysis } from '@/hooks/useSimulationAnalysis';

interface SimulationAnalysisSectionProps {
  showAnalysis: boolean;
  isSimulationComplete: boolean;
  setShowAnalysis: (show: boolean) => void;
  simulationSubject: string | null;
  selectedComponents: string[];
  thermodynamicModel: string;
  subjectAnalyses: SubjectAnalysis[];
  activeSubjectAnalysis: string | null;
  setActiveSubjectAnalysis: (id: string) => void;
  analysisData: any[];
}

const SimulationAnalysisSection: React.FC<SimulationAnalysisSectionProps> = ({
  showAnalysis,
  isSimulationComplete,
  setShowAnalysis,
  simulationSubject,
  selectedComponents,
  thermodynamicModel,
  subjectAnalyses,
  activeSubjectAnalysis,
  setActiveSubjectAnalysis,
  analysisData
}) => {
  if (!showAnalysis || !isSimulationComplete) return null;
  
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-display font-bold">
          {simulationSubject} Simulation Analysis
        </h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowAnalysis(!showAnalysis)}
        >
          {showAnalysis ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>
      
      <div className="mt-4">
        <HysysIntegration 
          selectedComponents={selectedComponents}
          thermodynamicModel={thermodynamicModel}
        />
      </div>
      
      <div className="border-b border-gray-200 mb-6 mt-6">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {subjectAnalyses.map(analysis => (
            <button
              key={analysis.id}
              className={`py-2 px-4 flex items-center rounded-t-lg text-sm font-medium transition-colors ${
                activeSubjectAnalysis === analysis.id
                  ? 'bg-white border-x border-t border-gray-200 text-flow-blue' 
                  : 'bg-gray-50 text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveSubjectAnalysis(analysis.id)}
            >
              {analysis.icon}
              <span className="ml-2">{analysis.title}</span>
            </button>
          ))}
        </div>
      </div>
      
      {activeSubjectAnalysis && (
        <GlassPanel className="p-6">
          {activeSubjectAnalysis && (
            <SimulationAnalysisCharts 
              analysisData={analysisData}
              analysisId={activeSubjectAnalysis}
              selectedComponents={selectedComponents}
            />
          )}
          
          <div className="mt-6 prose dark:prose-invert max-w-none">
            <div
              dangerouslySetInnerHTML={{ 
                __html: subjectAnalyses.find(a => a.id === activeSubjectAnalysis)?.content
                  .replace(/\n/g, '<br>')
                  .replace(/#{1,6}\s?(.*)/g, '<h4>$1</h4>') || ''
              }}
            />
          </div>
        </GlassPanel>
      )}
      
      <div className="mt-6 flex justify-between">
        <Button 
          variant="outline"
          onClick={() => setShowAnalysis(false)}
        >
          Hide Analysis
        </Button>
        <Button>
          Export Results
        </Button>
      </div>
    </div>
  );
};

export default SimulationAnalysisSection;
