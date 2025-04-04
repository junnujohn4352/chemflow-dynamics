import React from 'react';
import { Activity, ChevronDown, ChevronRight, Sigma } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReactionDataPanelProps {
  selectedComponents: string[];
}

const ReactionDataPanel: React.FC<ReactionDataPanelProps> = ({ selectedComponents }) => {
  const [expandedReactions, setExpandedReactions] = React.useState<string[]>(['reaction1']);

  const toggleReaction = (id: string) => {
    setExpandedReactions(prev => 
      prev.includes(id) 
        ? prev.filter(r => r !== id) 
        : [...prev, id]
    );
  };

  // Generate reaction examples based on selected components
  const reactions = React.useMemo(() => {
    const hasHydrocarbons = selectedComponents.some(comp => 
      ['methane', 'ethane', 'propane', 'butane'].includes(comp.toLowerCase())
    );
    
    const hasOxygen = selectedComponents.some(comp => 
      comp.toLowerCase() === 'oxygen'
    );
    
    const hasWater = selectedComponents.some(comp => 
      comp.toLowerCase() === 'water'
    );
    
    const hasNitrogen = selectedComponents.some(comp => 
      comp.toLowerCase() === 'nitrogen'
    );
    
    const hasCO2 = selectedComponents.some(comp => 
      comp.toLowerCase() === 'carbon dioxide'
    );

    const reactionsList = [];

    if (hasHydrocarbons && hasOxygen) {
      reactionsList.push({
        id: 'reaction1',
        name: 'Hydrocarbon Combustion',
        equation: 'CH₄ + 2O₂ → CO₂ + 2H₂O',
        type: 'Combustion',
        heatOfReaction: -890.3,
        activationEnergy: 125,
        rateConstant: 3.8e7,
        conversionRanges: [85, 98],
        components: {
          reactants: ['Methane', 'Oxygen'],
          products: ['Carbon Dioxide', 'Water']
        }
      });
    }
    
    if (hasHydrocarbons && hasWater) {
      reactionsList.push({
        id: 'reaction2',
        name: 'Steam Reforming',
        equation: 'CH₄ + H₂O → CO + 3H₂',
        type: 'Endothermic',
        heatOfReaction: 206.1,
        activationEnergy: 240,
        rateConstant: 4.2e5,
        conversionRanges: [65, 85],
        components: {
          reactants: ['Methane', 'Water'],
          products: ['Carbon Monoxide', 'Hydrogen']
        }
      });
    }
    
    if (hasCO2 && hasHydrocarbons) {
      reactionsList.push({
        id: 'reaction3',
        name: 'Dry Reforming',
        equation: 'CH₄ + CO₂ → 2CO + 2H₂',
        type: 'Endothermic',
        heatOfReaction: 247.3,
        activationEnergy: 255,
        rateConstant: 3.5e5,
        conversionRanges: [60, 80],
        components: {
          reactants: ['Methane', 'Carbon Dioxide'],
          products: ['Carbon Monoxide', 'Hydrogen']
        }
      });
    }
    
    if (hasNitrogen && hasHydrocarbons) {
      reactionsList.push({
        id: 'reaction4',
        name: 'Ammonia Synthesis',
        equation: 'N₂ + 3H₂ → 2NH₃',
        type: 'Exothermic',
        heatOfReaction: -45.9,
        activationEnergy: 230,
        rateConstant: 1.2e3,
        conversionRanges: [10, 30],
        components: {
          reactants: ['Nitrogen', 'Hydrogen'],
          products: ['Ammonia']
        }
      });
    }
    
    // Add a default reaction if none of the above conditions are met
    if (reactionsList.length === 0) {
      reactionsList.push({
        id: 'reaction_default',
        name: 'Generic Reaction',
        equation: 'A + B → C + D',
        type: 'Equilibrium',
        heatOfReaction: -45.2,
        activationEnergy: 150,
        rateConstant: 2.5e6,
        conversionRanges: [75, 90],
        components: {
          reactants: ['Component A', 'Component B'],
          products: ['Component C', 'Component D']
        }
      });
    }
    
    return reactionsList;
  }, [selectedComponents]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400 flex items-center">
          <Activity className="mr-2 h-5 w-5" />
          Reaction Kinetics
        </h3>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {reactions.map(reaction => (
          <div 
            key={reaction.id}
            className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            <div 
              className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750"
              onClick={() => toggleReaction(reaction.id)}
            >
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-200">{reaction.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">{reaction.equation}</p>
              </div>
              <div className="flex items-center">
                <span className={cn(
                  "px-2 py-1 text-xs font-medium rounded-full mr-3",
                  reaction.type === "Exothermic" 
                    ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                    : reaction.type === "Endothermic"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                      : "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                )}>
                  {reaction.type}
                </span>
                {expandedReactions.includes(reaction.id) 
                  ? <ChevronDown className="h-5 w-5 text-gray-400" /> 
                  : <ChevronRight className="h-5 w-5 text-gray-400" />
                }
              </div>
            </div>
            
            {expandedReactions.includes(reaction.id) && (
              <div className="px-4 pb-4 pt-2 bg-gray-50 dark:bg-gray-750/50">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-white dark:bg-gray-700 p-3 rounded shadow-sm">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Heat of Reaction</span>
                    <div className="flex items-center mt-1">
                      <span className="text-lg font-medium">
                        {reaction.heatOfReaction}
                      </span>
                      <span className="text-xs ml-1">kJ/mol</span>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-700 p-3 rounded shadow-sm">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Activation Energy</span>
                    <div className="flex items-center mt-1">
                      <span className="text-lg font-medium">
                        {reaction.activationEnergy}
                      </span>
                      <span className="text-xs ml-1">kJ/mol</span>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-700 p-3 rounded shadow-sm">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Rate Constant</span>
                    <div className="flex items-center mt-1">
                      <span className="text-lg font-medium">
                        {reaction.rateConstant.toExponential(2)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-700 p-3 rounded shadow-sm">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Conversion Range</span>
                    <div className="flex items-center mt-1">
                      <span className="text-lg font-medium">
                        {reaction.conversionRanges[0]}-{reaction.conversionRanges[1]}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-sm font-medium mb-2 flex items-center">
                      <Sigma className="h-4 w-4 mr-1 text-gray-500" />
                      Reaction Rate Expression
                    </h5>
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded font-mono text-sm">
                      {reaction.type === "Combustion" ? (
                        <span>r = k·[CH₄]<sup>0.5</sup>·[O₂]<sup>1.2</sup>·exp(-E<sub>a</sub>/RT)</span>
                      ) : reaction.type === "Endothermic" ? (
                        <span>r = k·[CH₄]·[H₂O]·(1-β)·exp(-E<sub>a</sub>/RT)</span>
                      ) : (
                        <span>r = k·[A]<sup>α</sup>·[B]<sup>β</sup>·exp(-E<sub>a</sub>/RT)</span>
                      )}
                    </div>
                    
                    <h5 className="text-sm font-medium mt-4 mb-2">Reactants</h5>
                    <div className="space-y-1">
                      {reaction.components.reactants.map(reactant => (
                        <div 
                          key={reactant} 
                          className="text-sm flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded"
                        >
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          {reactant}
                        </div>
                      ))}
                    </div>
                    
                    <h5 className="text-sm font-medium mt-4 mb-2">Products</h5>
                    <div className="space-y-1">
                      {reaction.components.products.map(product => (
                        <div 
                          key={product} 
                          className="text-sm flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded"
                        >
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          {product}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium mb-2">Kinetic Model</h5>
                    <div className="bg-white dark:bg-gray-700 p-3 rounded shadow-sm">
                      <div className="flex justify-between text-sm mb-1 border-b pb-1">
                        <span className="text-gray-500 dark:text-gray-400">Model Type:</span>
                        <span className="font-medium">Power Law</span>
                      </div>
                      <div className="flex justify-between text-sm mb-1 border-b pb-1">
                        <span className="text-gray-500 dark:text-gray-400">Pre-exponential Factor:</span>
                        <span className="font-medium">{(reaction.rateConstant / 1e7).toFixed(2)}×10<sup>7</sup></span>
                      </div>
                      <div className="flex justify-between text-sm mb-1 border-b pb-1">
                        <span className="text-gray-500 dark:text-gray-400">Temperature Dependence:</span>
                        <span className="font-medium">Arrhenius</span>
                      </div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500 dark:text-gray-400">Reaction Order:</span>
                        <span className="font-medium">{(Math.random() * 2 + 1).toFixed(1)}</span>
                      </div>
                    </div>
                    
                    <h5 className="text-sm font-medium mt-4 mb-2">Operating Conditions</h5>
                    <div className="bg-white dark:bg-gray-700 p-3 rounded shadow-sm space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Temperature Range:</span>
                        <span className="font-medium">
                          {reaction.type === "Exothermic" ? "180-250°C" : 
                           reaction.type === "Endothermic" ? "700-900°C" : 
                           "300-450°C"}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Pressure Range:</span>
                        <span className="font-medium">
                          {reaction.type === "Exothermic" ? "15-25 MPa" : 
                           reaction.type === "Endothermic" ? "1-2 MPa" : 
                           "5-10 MPa"}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Catalyst:</span>
                        <span className="font-medium">
                          {reaction.type === "Exothermic" ? "Ni-based" : 
                           reaction.type === "Endothermic" ? "Pt/Al₂O₃" : 
                           "Fe-based"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReactionDataPanel;
