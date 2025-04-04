import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface SubjectAnalysis {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: string;
  charts: React.ReactNode;
}

export const useSimulationAnalysis = (selectedComponents: string[]) => {
  const { toast } = useToast();
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [isSimulationComplete, setIsSimulationComplete] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisData, setAnalysisData] = useState<any[]>([]);
  const [subjectAnalyses, setSubjectAnalyses] = useState<SubjectAnalysis[]>([]);
  const [activeSubjectAnalysis, setActiveSubjectAnalysis] = useState<string | null>(null);
  
  const generateAnalysisData = () => {
    const timePoints = Array.from({ length: 25 }, (_, i) => i);
    
    const data = timePoints.map(time => {
      const baseObj: { 
        time: number; 
        temperature?: number; 
        pressure?: number; 
        conversion?: number;
        [key: string]: number | undefined; 
      } = { time };
      
      selectedComponents.forEach(comp => {
        if (comp === 'Ethanol') {
          baseObj[comp] = 100 - 100 * Math.exp(-0.05 * time);
        } else if (comp === 'Water') {
          baseObj[comp] = 100 - 100 * Math.exp(-0.02 * time);
        } else if (comp === 'Methanol') {
          baseObj[comp] = 85 - 85 * Math.exp(-0.07 * time);
        } else if (comp === 'Butanol') {
          baseObj[comp] = 75 - 75 * Math.exp(-0.03 * time);
        } else {
          baseObj[comp] = 80 - 80 * Math.exp(-0.04 * time);
        }
        
        baseObj[comp] *= (0.9 + Math.random() * 0.2);
      });
      
      baseObj.temperature = 300 + 50 * Math.sin(time / 5);
      baseObj.pressure = 100 - 10 * Math.cos(time / 3);
      baseObj.conversion = Math.min(0.98, 1 - Math.exp(-0.15 * time));
      
      return baseObj;
    });
    
    setAnalysisData(data);
  };

  const generateSubjectAnalyses = async (subject: string) => {
    try {
      const generateStaticAnalysis = (subject: string, components: string[]): string => {
        return `# ${subject} Analysis Summary
        
This analysis examines the ${subject} process using ${components.join(", ")} as the main components.
        
## Key Findings
- The process shows stable behavior under normal operating conditions
- Operating temperature range: 300-350K
- Operating pressure range: 90-110 kPa
- The system achieves 95-98% conversion efficiency

## Recommendations
- Consider increasing residence time for better conversion
- Monitor temperature gradients in the system
- Optimize energy usage by heat integration
- Regular maintenance of critical equipment is recommended`;
      };
      
      const heatTransferAnalysis = generateStaticAnalysis(`Heat Transfer for ${subject}`, selectedComponents);
      const fluidFlowAnalysis = generateStaticAnalysis(`Fluid Flow for ${subject}`, selectedComponents);
      const thermodynamicsAnalysis = generateStaticAnalysis(`Thermodynamics for ${subject}`, selectedComponents);
      const massTransferAnalysis = generateStaticAnalysis(`Mass Transfer for ${subject}`, selectedComponents);
      const reactionAnalysis = generateStaticAnalysis(`Reaction Engineering for ${subject}`, selectedComponents);
      const safetyAnalysis = generateStaticAnalysis(`Safety for ${subject}`, selectedComponents);
      const processAnalysis = generateStaticAnalysis(`Process Simulation for ${subject}`, selectedComponents);
      const utilityAnalysis = generateStaticAnalysis(`Utility Requirements for ${subject}`, selectedComponents);
      
      // Import icons directly in the components that use them
      const { Thermometer, Waves, Zap, Droplets, FlaskConical, Shield, Cpu, Leaf } = await import('lucide-react');
      
      // Create the icon components ahead of time
      const thermometerIcon = <Thermometer className="h-5 w-5" />;
      const wavesIcon = <Waves className="h-5 w-5" />;
      const zapIcon = <Zap className="h-5 w-5" />;
      const dropletsIcon = <Droplets className="h-5 w-5" />;
      const flaskConicalIcon = <FlaskConical className="h-5 w-5" />;
      const shieldIcon = <Shield className="h-5 w-5" />;
      const cpuIcon = <Cpu className="h-5 w-5" />;
      const leafIcon = <Leaf className="h-5 w-5" />;
      
      const analyses: SubjectAnalysis[] = [
        {
          id: "heatTransfer",
          title: "Heat Transfer Analysis",
          icon: thermometerIcon,
          content: heatTransferAnalysis,
          charts: null // Charts will be created in the component
        },
        {
          id: "fluidFlow",
          title: "Fluid Flow Analysis",
          icon: wavesIcon,
          content: fluidFlowAnalysis,
          charts: null
        },
        {
          id: "thermodynamics",
          title: "Thermodynamic Analysis",
          icon: zapIcon,
          content: thermodynamicsAnalysis,
          charts: null
        },
        {
          id: "massTransfer",
          title: "Mass Transfer Analysis",
          icon: dropletsIcon,
          content: massTransferAnalysis,
          charts: null
        },
        {
          id: "reactionEngineering",
          title: "Reaction Engineering Analysis",
          icon: flaskConicalIcon,
          content: reactionAnalysis,
          charts: null
        },
        {
          id: "safetyAnalysis",
          title: "Safety Analysis",
          icon: shieldIcon,
          content: safetyAnalysis,
          charts: null
        },
        {
          id: "processSimulation",
          title: "Process Simulation",
          icon: cpuIcon,
          content: processAnalysis,
          charts: null
        },
        {
          id: "utilityEnvironmental",
          title: "Utility & Environmental Analysis",
          icon: leafIcon,
          content: utilityAnalysis,
          charts: null
        }
      ];
      
      setSubjectAnalyses(analyses);
      setActiveSubjectAnalysis(analyses[0].id);
      
    } catch (error) {
      console.error("Error generating analyses:", error);
      toast({
        title: "Analysis Generation Failed",
        description: "There was an error generating detailed analyses",
        variant: "destructive"
      });
    }
  };
  
  return {
    isSimulationRunning,
    setIsSimulationRunning,
    isSimulationComplete,
    setIsSimulationComplete,
    showAnalysis,
    setShowAnalysis,
    analysisData,
    setAnalysisData,
    subjectAnalyses,
    setSubjectAnalyses,
    activeSubjectAnalysis,
    setActiveSubjectAnalysis,
    generateAnalysisData,
    generateSubjectAnalyses
  };
};
