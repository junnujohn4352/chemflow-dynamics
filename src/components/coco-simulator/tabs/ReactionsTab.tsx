
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface ReactionsTabProps {
  cornReactions: string[];
  handleAddReaction: () => void;
}

const ReactionsTab: React.FC<ReactionsTabProps> = ({ cornReactions, handleAddReaction }) => {
  return (
    <div className="border rounded-md p-4 mb-4">
      <h3 className="font-medium mb-3">CORN - CAPE-OPEN Reaction Numerics</h3>
      <p className="text-sm text-gray-600 mb-4">
        Define chemical reactions for your process simulation.
      </p>
      
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-medium">Defined Reactions</h4>
        <Button size="sm" onClick={handleAddReaction} className="flex items-center gap-1">
          <PlusCircle className="h-4 w-4" />
          Add Reaction
        </Button>
      </div>
      
      {cornReactions.length > 0 ? (
        <div className="space-y-3">
          {cornReactions.map((reaction, index) => (
            <div key={index} className="p-3 border rounded flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <h5 className="font-medium">{reaction}</h5>
                <Button variant="ghost" size="sm">Edit</Button>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <p className="text-sm font-mono">A + B → C + D</p>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-600">
                <div>Type: <span className="font-medium">Kinetic</span></div>
                <div>Base: <span className="font-medium">Mass</span></div>
                <div>Order: <span className="font-medium">1st</span></div>
                <div>Phase: <span className="font-medium">Liquid</span></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 border border-dashed rounded-md text-center text-gray-500">
          <p>No reactions defined. Add a reaction to start.</p>
        </div>
      )}
    </div>
  );
};

export default ReactionsTab;
