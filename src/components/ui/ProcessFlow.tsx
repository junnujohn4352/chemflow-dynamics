
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X, MoveUp, MoveDown, Edit, Save } from 'lucide-react';

const defaultProcessFlowSteps = [
  "Define simulation objectives",
  "Develop process flowsheet", 
  "Input thermodynamic and property data", 
  "Specify operating conditions", 
  "Solve simulation model", 
  "Analyze results"
];

const ProcessFlow: React.FC = () => {
  const [steps, setSteps] = useState<string[]>(defaultProcessFlowSteps);
  const [newStep, setNewStep] = useState<string>("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState<string>("");
  
  const handleAddStep = () => {
    if (newStep.trim()) {
      setSteps([...steps, newStep.trim()]);
      setNewStep("");
    }
  };

  const handleRemoveStep = (index: number) => {
    const newSteps = [...steps];
    newSteps.splice(index, 1);
    setSteps(newSteps);
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      const newSteps = [...steps];
      [newSteps[index - 1], newSteps[index]] = [newSteps[index], newSteps[index - 1]];
      setSteps(newSteps);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < steps.length - 1) {
      const newSteps = [...steps];
      [newSteps[index], newSteps[index + 1]] = [newSteps[index + 1], newSteps[index]];
      setSteps(newSteps);
    }
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditingText(steps[index]);
  };

  const saveEditing = () => {
    if (editingIndex !== null && editingText.trim()) {
      const newSteps = [...steps];
      newSteps[editingIndex] = editingText.trim();
      setSteps(newSteps);
      setEditingIndex(null);
    }
  };

  const cancelEditing = () => {
    setEditingIndex(null);
  };

  const handleReset = () => {
    setSteps(defaultProcessFlowSteps);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <h3 className="text-lg font-medium mb-4">Process Flow Steps</h3>

      {/* Add new step */}
      <div className="flex gap-2 mb-6">
        <Input
          value={newStep}
          onChange={(e) => setNewStep(e.target.value)}
          placeholder="Add new process step"
          className="flex-grow"
        />
        <Button onClick={handleAddStep} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
        <Button onClick={handleReset} size="sm" variant="outline">
          Reset
        </Button>
      </div>

      {/* Steps list */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <motion.div 
            key={`${step}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: index * 0.1, 
              duration: 0.3 
            }}
            className="bg-gray-700 text-white p-4 rounded-lg shadow-md"
          >
            {editingIndex === index ? (
              <div className="flex flex-col gap-2">
                <Input 
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="bg-gray-600 text-white border-gray-500"
                  autoFocus
                />
                <div className="flex justify-end gap-2 mt-1">
                  <Button size="sm" variant="ghost" onClick={cancelEditing}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={saveEditing}>
                    <Save className="h-3 w-3 mr-1" />
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div className="text-center flex-grow">{step}</div>
                <div className="flex gap-1 ml-2">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className="h-7 w-7 p-0"
                  >
                    <MoveUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => handleMoveDown(index)}
                    disabled={index === steps.length - 1}
                    className="h-7 w-7 p-0"
                  >
                    <MoveDown className="h-3.5 w-3.5" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => startEditing(index)}
                    className="h-7 w-7 p-0"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => handleRemoveStep(index)}
                    className="h-7 w-7 p-0 hover:text-red-300"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}

            {index < steps.length - 1 && (
              <div className="h-8 w-px bg-white mx-auto my-2 opacity-50" />
            )}
          </motion.div>
        ))}
        
        {steps.length === 0 && (
          <div className="text-center py-4 text-gray-400">
            No process steps defined. Add steps above.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessFlow;
