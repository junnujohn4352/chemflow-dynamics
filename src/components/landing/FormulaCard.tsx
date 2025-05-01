
import React, { useState } from "react";
import GlassPanel from "@/components/ui/GlassPanel";
import { ChevronDown, ChevronUp, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FormulaCardProps {
  title: string;
  formula: string;
  description?: string;
  variables?: { [key: string]: string };
  className?: string;
}

const FormulaCard: React.FC<FormulaCardProps> = ({ 
  title, 
  formula, 
  description,
  variables,
  className 
}) => {
  const [expanded, setExpanded] = useState(false);
  const { toast } = useToast();

  const handleCopyFormula = () => {
    navigator.clipboard.writeText(formula);
    toast({
      title: "Formula Copied",
      description: `${title} formula copied to clipboard`,
    });
  };

  return (
    <GlassPanel className={`p-6 hover:shadow-md transition-all duration-300 ${className}`}>
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold text-purple-700 mb-2">{title}</h3>
        <button 
          onClick={handleCopyFormula}
          className="text-purple-600 hover:text-purple-800 p-1 rounded-full hover:bg-purple-100 transition-colors"
        >
          <Copy className="h-4 w-4" />
        </button>
      </div>
      
      <p className="font-mono text-purple-600 mb-2">{formula}</p>
      
      {(description || variables) && (
        <div className="mt-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center text-sm text-purple-500 hover:text-purple-700 transition-colors"
          >
            {expanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Hide details
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                Show details
              </>
            )}
          </button>
          
          {expanded && (
            <div className="mt-3 pt-3 border-t border-purple-100 animate-fade-in">
              {description && (
                <p className="text-sm text-gray-700 mb-2">{description}</p>
              )}
              
              {variables && (
                <div className="mt-2">
                  <h4 className="text-sm font-medium text-purple-700 mb-1">Variables:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {Object.entries(variables).map(([key, value]) => (
                      <div key={key} className="text-xs">
                        <span className="font-mono text-purple-600">{key}</span>: {value}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </GlassPanel>
  );
};

export default FormulaCard;
