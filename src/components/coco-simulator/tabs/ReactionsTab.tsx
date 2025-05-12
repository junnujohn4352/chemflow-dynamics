
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PlusCircle, FlaskConical, Edit, Trash, Pencil, 
  Check, X, ArrowRightLeft, Beaker, Database 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ReactionsTabProps {
  cornReactions: string[];
  handleAddReaction: () => void;
}

interface ReactionModel {
  id: string;
  name: string;
  type: 'kinetic' | 'equilibrium' | 'conversion' | 'gibbs';
  equation: string;
  phase: 'vapor' | 'liquid' | 'both';
  basis: 'mole' | 'mass';
  parameters: {
    activationEnergy?: number;
    preExponentialFactor?: number;
    reactionOrder?: number;
    conversionValue?: number;
    equilibriumConstant?: number;
  };
}

const ReactionsTab: React.FC<ReactionsTabProps> = ({ cornReactions, handleAddReaction }) => {
  const [activeTab, setActiveTab] = useState<string>("defined");
  const [editingReactionId, setEditingReactionId] = useState<string | null>(null);
  const [reactions, setReactions] = useState<ReactionModel[]>(
    cornReactions.map((name, index) => ({
      id: `reaction-${index}`,
      name,
      type: index % 2 === 0 ? 'kinetic' : 'equilibrium',
      equation: index % 2 === 0 ? 'A + B → C + D' : '2A ⇌ B + C',
      phase: index % 2 === 0 ? 'liquid' : 'vapor',
      basis: 'mole',
      parameters: {
        activationEnergy: 45000 + Math.random() * 20000,
        preExponentialFactor: 1e6 + Math.random() * 1e6,
        reactionOrder: 1,
        equilibriumConstant: 1.5 + Math.random()
      }
    }))
  );
  
  const [newReaction, setNewReaction] = useState<ReactionModel>({
    id: '',
    name: '',
    type: 'kinetic',
    equation: '',
    phase: 'liquid',
    basis: 'mole',
    parameters: {}
  });
  
  const handleAddNewReaction = () => {
    if(!newReaction.name || !newReaction.equation) return;
    
    setReactions([...reactions, {
      ...newReaction,
      id: `reaction-${Date.now()}`
    }]);
    
    setNewReaction({
      id: '',
      name: '',
      type: 'kinetic',
      equation: '',
      phase: 'liquid',
      basis: 'mole',
      parameters: {}
    });
    
    setActiveTab('defined');
  };
  
  const handleDeleteReaction = (id: string) => {
    setReactions(reactions.filter(r => r.id !== id));
  };
  
  const handleEditReaction = (id: string) => {
    setEditingReactionId(id);
  };
  
  const handleSaveEdit = (id: string, updatedValues: Partial<ReactionModel>) => {
    setReactions(reactions.map(r => r.id === id ? { ...r, ...updatedValues } : r));
    setEditingReactionId(null);
  };
  
  return (
    <div className="border rounded-md p-4 mb-4">
      <h3 className="font-medium mb-3">CORN - CAPE-OPEN Reaction Numerics</h3>
      <p className="text-sm text-gray-600 mb-4">
        Define chemical reactions for your process simulation.
      </p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="defined">Defined Reactions</TabsTrigger>
          <TabsTrigger value="add">Add Reaction</TabsTrigger>
          <TabsTrigger value="database">Reaction Database</TabsTrigger>
          <TabsTrigger value="kinetics">Kinetics Models</TabsTrigger>
        </TabsList>
        
        <TabsContent value="defined">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium">Defined Reactions</h4>
            <Button size="sm" onClick={() => setActiveTab('add')} className="flex items-center gap-1">
              <PlusCircle className="h-4 w-4" />
              Add Reaction
            </Button>
          </div>
          
          {reactions.length > 0 ? (
            <div className="space-y-3">
              {reactions.map((reaction) => (
                <div key={reaction.id} className="p-3 border rounded flex flex-col">
                  {editingReactionId === reaction.id ? (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center mb-2">
                        <Input 
                          value={reaction.name} 
                          onChange={(e) => setReactions(reactions.map(r => 
                            r.id === reaction.id ? { ...r, name: e.target.value } : r
                          ))}
                          className="font-medium"
                        />
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleSaveEdit(reaction.id, reaction)}
                          >
                            <Check className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setEditingReactionId(null)}
                          >
                            <X className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`equation-${reaction.id}`}>Reaction Equation</Label>
                        <Input 
                          id={`equation-${reaction.id}`}
                          value={reaction.equation} 
                          onChange={(e) => setReactions(reactions.map(r => 
                            r.id === reaction.id ? { ...r, equation: e.target.value } : r
                          ))}
                          className="font-mono"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor={`type-${reaction.id}`}>Reaction Type</Label>
                          <Select 
                            value={reaction.type} 
                            onValueChange={(value: any) => setReactions(reactions.map(r => 
                              r.id === reaction.id ? { ...r, type: value } : r
                            ))}
                          >
                            <SelectTrigger id={`type-${reaction.id}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="kinetic">Kinetic</SelectItem>
                              <SelectItem value="equilibrium">Equilibrium</SelectItem>
                              <SelectItem value="conversion">Conversion</SelectItem>
                              <SelectItem value="gibbs">Gibbs Free Energy</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`phase-${reaction.id}`}>Reaction Phase</Label>
                          <Select 
                            value={reaction.phase} 
                            onValueChange={(value: any) => setReactions(reactions.map(r => 
                              r.id === reaction.id ? { ...r, phase: value } : r
                            ))}
                          >
                            <SelectTrigger id={`phase-${reaction.id}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="vapor">Vapor</SelectItem>
                              <SelectItem value="liquid">Liquid</SelectItem>
                              <SelectItem value="both">Both Phases</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`basis-${reaction.id}`}>Reaction Basis</Label>
                          <Select 
                            value={reaction.basis} 
                            onValueChange={(value: any) => setReactions(reactions.map(r => 
                              r.id === reaction.id ? { ...r, basis: value } : r
                            ))}
                          >
                            <SelectTrigger id={`basis-${reaction.id}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mole">Molar</SelectItem>
                              <SelectItem value="mass">Mass</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Kinetic Parameters</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {reaction.type === 'kinetic' && (
                            <>
                              <div className="space-y-1">
                                <Label htmlFor={`energy-${reaction.id}`} className="text-xs">Activation Energy (J/mol)</Label>
                                <Input 
                                  id={`energy-${reaction.id}`}
                                  type="number" 
                                  value={reaction.parameters.activationEnergy || 0} 
                                  onChange={(e) => setReactions(reactions.map(r => 
                                    r.id === reaction.id ? { ...r, parameters: { ...r.parameters, activationEnergy: Number(e.target.value) } } : r
                                  ))}
                                />
                              </div>
                              <div className="space-y-1">
                                <Label htmlFor={`factor-${reaction.id}`} className="text-xs">Pre-exponential Factor</Label>
                                <Input 
                                  id={`factor-${reaction.id}`}
                                  type="number" 
                                  value={reaction.parameters.preExponentialFactor || 0} 
                                  onChange={(e) => setReactions(reactions.map(r => 
                                    r.id === reaction.id ? { ...r, parameters: { ...r.parameters, preExponentialFactor: Number(e.target.value) } } : r
                                  ))}
                                />
                              </div>
                            </>
                          )}
                          
                          {reaction.type === 'equilibrium' && (
                            <div className="space-y-1">
                              <Label htmlFor={`keq-${reaction.id}`} className="text-xs">Equilibrium Constant</Label>
                              <Input 
                                id={`keq-${reaction.id}`}
                                type="number" 
                                value={reaction.parameters.equilibriumConstant || 0} 
                                onChange={(e) => setReactions(reactions.map(r => 
                                  r.id === reaction.id ? { ...r, parameters: { ...r.parameters, equilibriumConstant: Number(e.target.value) } } : r
                                ))}
                              />
                            </div>
                          )}
                          
                          {reaction.type === 'conversion' && (
                            <div className="space-y-1">
                              <Label htmlFor={`conv-${reaction.id}`} className="text-xs">Conversion (%)</Label>
                              <Input 
                                id={`conv-${reaction.id}`}
                                type="number" 
                                value={(reaction.parameters.conversionValue || 0) * 100} 
                                onChange={(e) => setReactions(reactions.map(r => 
                                  r.id === reaction.id ? { ...r, parameters: { ...r.parameters, conversionValue: Number(e.target.value) / 100 } } : r
                                ))}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="font-medium">{reaction.name}</h5>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditReaction(reaction.id)}>
                            <Edit className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteReaction(reaction.id)}>
                            <Trash className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-2 bg-gray-50 rounded">
                        <p className="text-sm font-mono">{reaction.equation}</p>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-600">
                        <div>Type: <span className="font-medium capitalize">{reaction.type}</span></div>
                        <div>Basis: <span className="font-medium capitalize">{reaction.basis}</span></div>
                        <div>Phase: <span className="font-medium capitalize">{reaction.phase}</span></div>
                        <div>
                          {reaction.type === 'kinetic' && `Order: ${reaction.parameters.reactionOrder || 1}`}
                          {reaction.type === 'equilibrium' && `Keq: ${reaction.parameters.equilibriumConstant?.toFixed(3) || 'N/A'}`}
                          {reaction.type === 'conversion' && `Conv: ${((reaction.parameters.conversionValue || 0) * 100).toFixed(1)}%`}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 border border-dashed rounded-md text-center text-gray-500">
              <p>No reactions defined. Add a reaction to start.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="add">
          <h4 className="font-medium mb-3">Add New Reaction</h4>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reaction-name">Reaction Name</Label>
              <Input 
                id="reaction-name" 
                value={newReaction.name}
                onChange={e => setNewReaction({...newReaction, name: e.target.value})}
                placeholder="e.g., Methane Combustion"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reaction-equation">Reaction Equation</Label>
              <Input 
                id="reaction-equation" 
                value={newReaction.equation}
                onChange={e => setNewReaction({...newReaction, equation: e.target.value})}
                placeholder="e.g., CH4 + 2O2 → CO2 + 2H2O"
                className="font-mono"
              />
              <p className="text-xs text-gray-500">
                Use → for irreversible reactions or ⇌ for reversible/equilibrium reactions
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reaction-type">Reaction Type</Label>
                <Select 
                  value={newReaction.type}
                  onValueChange={(value: any) => setNewReaction({...newReaction, type: value})}
                >
                  <SelectTrigger id="reaction-type">
                    <SelectValue placeholder="Select reaction type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kinetic">Kinetic</SelectItem>
                    <SelectItem value="equilibrium">Equilibrium</SelectItem>
                    <SelectItem value="conversion">Conversion</SelectItem>
                    <SelectItem value="gibbs">Gibbs Free Energy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reaction-phase">Reaction Phase</Label>
                <Select 
                  value={newReaction.phase}
                  onValueChange={(value: any) => setNewReaction({...newReaction, phase: value})}
                >
                  <SelectTrigger id="reaction-phase">
                    <SelectValue placeholder="Select phase" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vapor">Vapor Phase</SelectItem>
                    <SelectItem value="liquid">Liquid Phase</SelectItem>
                    <SelectItem value="both">Both Phases</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reaction-basis">Reaction Basis</Label>
                <Select 
                  value={newReaction.basis}
                  onValueChange={(value: any) => setNewReaction({...newReaction, basis: value})}
                >
                  <SelectTrigger id="reaction-basis">
                    <SelectValue placeholder="Select basis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mole">Molar Basis</SelectItem>
                    <SelectItem value="mass">Mass Basis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="border-t pt-4 mt-4">
              <h5 className="text-sm font-medium mb-3">Kinetic Parameters</h5>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {newReaction.type === 'kinetic' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="activation-energy">Activation Energy (J/mol)</Label>
                      <Input 
                        id="activation-energy" 
                        type="number"
                        value={newReaction.parameters.activationEnergy || ''}
                        onChange={e => setNewReaction({
                          ...newReaction, 
                          parameters: {...newReaction.parameters, activationEnergy: Number(e.target.value)}
                        })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="pre-exponential">Pre-exponential Factor</Label>
                      <Input 
                        id="pre-exponential" 
                        type="number"
                        value={newReaction.parameters.preExponentialFactor || ''}
                        onChange={e => setNewReaction({
                          ...newReaction, 
                          parameters: {...newReaction.parameters, preExponentialFactor: Number(e.target.value)}
                        })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="reaction-order">Reaction Order</Label>
                      <Input 
                        id="reaction-order" 
                        type="number"
                        value={newReaction.parameters.reactionOrder || ''}
                        onChange={e => setNewReaction({
                          ...newReaction, 
                          parameters: {...newReaction.parameters, reactionOrder: Number(e.target.value)}
                        })}
                      />
                    </div>
                  </>
                )}
                
                {newReaction.type === 'equilibrium' && (
                  <div className="space-y-2">
                    <Label htmlFor="equilibrium-constant">Equilibrium Constant</Label>
                    <Input 
                      id="equilibrium-constant" 
                      type="number"
                      value={newReaction.parameters.equilibriumConstant || ''}
                      onChange={e => setNewReaction({
                        ...newReaction, 
                        parameters: {...newReaction.parameters, equilibriumConstant: Number(e.target.value)}
                      })}
                    />
                  </div>
                )}
                
                {newReaction.type === 'conversion' && (
                  <div className="space-y-2">
                    <Label htmlFor="conversion-value">Conversion (%)</Label>
                    <Input 
                      id="conversion-value" 
                      type="number"
                      min="0"
                      max="100"
                      value={newReaction.parameters.conversionValue ? newReaction.parameters.conversionValue * 100 : ''}
                      onChange={e => setNewReaction({
                        ...newReaction, 
                        parameters: {...newReaction.parameters, conversionValue: Number(e.target.value) / 100}
                      })}
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setActiveTab('defined')}>Cancel</Button>
              <Button onClick={handleAddNewReaction} disabled={!newReaction.name || !newReaction.equation}>
                <PlusCircle className="h-4 w-4 mr-1.5" />
                Add Reaction
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="database">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium">Reaction Database</h4>
            <div className="flex gap-2">
              <Input placeholder="Search reactions..." className="w-[200px]" />
              <Button variant="outline" size="sm">
                <Database className="h-4 w-4 mr-1.5" />
                Import
              </Button>
            </div>
          </div>
          
          <div className="border rounded overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reaction</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-3 py-2 text-sm">Methane Combustion</td>
                  <td className="px-3 py-2 text-sm font-mono">CH₄ + 2O₂ → CO₂ + 2H₂O</td>
                  <td className="px-3 py-2 text-sm">Kinetic</td>
                  <td className="px-3 py-2 text-sm text-right">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-sm">Ethylene Hydration</td>
                  <td className="px-3 py-2 text-sm font-mono">C₂H₄ + H₂O → C₂H₅OH</td>
                  <td className="px-3 py-2 text-sm">Equilibrium</td>
                  <td className="px-3 py-2 text-sm text-right">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-sm">Water Gas Shift</td>
                  <td className="px-3 py-2 text-sm font-mono">CO + H₂O ⇌ CO₂ + H₂</td>
                  <td className="px-3 py-2 text-sm">Equilibrium</td>
                  <td className="px-3 py-2 text-sm text-right">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </TabsContent>
        
        <TabsContent value="kinetics">
          <h4 className="font-medium mb-3">Reaction Kinetic Models</h4>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-md p-3 hover:bg-blue-50">
                <div className="flex items-center gap-2 mb-2">
                  <FlaskConical className="h-5 w-5 text-blue-600" />
                  <h5 className="font-medium">Power Law Kinetics</h5>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Rate = k × [A]^a × [B]^b
                </p>
                <div className="text-xs text-gray-500">
                  <p>• Simple rate expression with component concentrations</p>
                  <p>• Reaction orders can be fractional or negative</p>
                  <p>• Arrhenius temperature dependence</p>
                </div>
              </div>
              
              <div className="border rounded-md p-3 hover:bg-blue-50">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowRightLeft className="h-5 w-5 text-green-600" />
                  <h5 className="font-medium">Langmuir-Hinshelwood</h5>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Rate = k × K<sub>A</sub>[A] × K<sub>B</sub>[B] / (1 + K<sub>A</sub>[A] + K<sub>B</sub>[B])²
                </p>
                <div className="text-xs text-gray-500">
                  <p>• Surface reaction kinetics for heterogeneous catalysis</p>
                  <p>• Accounts for adsorption and desorption effects</p>
                  <p>• Suitable for many industrial catalytic processes</p>
                </div>
              </div>
              
              <div className="border rounded-md p-3 hover:bg-blue-50">
                <div className="flex items-center gap-2 mb-2">
                  <Beaker className="h-5 w-5 text-purple-600" />
                  <h5 className="font-medium">LHHW Kinetics</h5>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Rate = (kinetic term × driving force) / (adsorption term)^n
                </p>
                <div className="text-xs text-gray-500">
                  <p>• Langmuir-Hinshelwood-Hougen-Watson model</p>
                  <p>• Considers reaction and adsorption steps</p>
                  <p>• Suitable for complex catalytic systems</p>
                </div>
              </div>
              
              <div className="border rounded-md p-3 hover:bg-blue-50">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowRightLeft className="h-5 w-5 text-amber-600" />
                  <h5 className="font-medium">Reversible Reactions</h5>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Rate = k<sub>fwd</sub> × [reactants] - k<sub>rev</sub> × [products]
                </p>
                <div className="text-xs text-gray-500">
                  <p>• Forward and reverse reaction rates</p>
                  <p>• Approaches equilibrium conditions</p>
                  <p>• Temperature-dependent equilibrium constant</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <h5 className="font-medium mb-2">Reaction Engineering Tools</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button variant="outline" size="sm" className="flex items-center gap-1.5 justify-start">
                  <Pencil className="h-4 w-4" />
                  Rate Expression Builder
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-1.5 justify-start">
                  <FlaskConical className="h-4 w-4" />
                  Parameter Estimation
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-1.5 justify-start">
                  <Database className="h-4 w-4" />
                  Reaction Database
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReactionsTab;
