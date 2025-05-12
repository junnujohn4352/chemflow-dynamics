
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AddChemicalDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  customChemicalName: string;
  setCustomChemicalName: (name: string) => void;
  customChemicalFormula: string;
  setCustomChemicalFormula: (formula: string) => void;
  customChemicalMw: string;
  setCustomChemicalMw: (mw: string) => void;
  customChemicalDensity: string;
  setCustomChemicalDensity: (density: string) => void;
  handleAddCustomChemical: () => void;
}

const AddChemicalDialog: React.FC<AddChemicalDialogProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  customChemicalName,
  setCustomChemicalName,
  customChemicalFormula,
  setCustomChemicalFormula,
  customChemicalMw,
  setCustomChemicalMw,
  customChemicalDensity,
  setCustomChemicalDensity,
  handleAddCustomChemical
}) => {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Custom Chemical</DialogTitle>
          <DialogDescription>
            Enter the properties of your custom chemical component.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="chemicalName" className="text-right">
              Name
            </Label>
            <Input
              id="chemicalName"
              value={customChemicalName}
              onChange={(e) => setCustomChemicalName(e.target.value)}
              placeholder="e.g., Methanol"
            />
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="chemicalFormula" className="text-right">
              Chemical Formula
            </Label>
            <Input
              id="chemicalFormula"
              value={customChemicalFormula}
              onChange={(e) => setCustomChemicalFormula(e.target.value)}
              placeholder="e.g., CH3OH"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="molecularWeight" className="text-right">
                Molecular Weight
              </Label>
              <Input
                id="molecularWeight"
                value={customChemicalMw}
                onChange={(e) => setCustomChemicalMw(e.target.value)}
                placeholder="g/mol"
              />
            </div>
            
            <div>
              <Label htmlFor="density" className="text-right">
                Density
              </Label>
              <Input
                id="density"
                value={customChemicalDensity}
                onChange={(e) => setCustomChemicalDensity(e.target.value)}
                placeholder="kg/m³"
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={handleAddCustomChemical}>Add Chemical</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddChemicalDialog;
