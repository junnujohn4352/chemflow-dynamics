
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Beaker, ArrowRight, Lightbulb, Book, GraduationCap } from "lucide-react";

interface LearnMoreModalProps {
  open: boolean;
  onClose: () => void;
}

const LearnMoreModal: React.FC<LearnMoreModalProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">ChemFlow Advanced Features</DialogTitle>
          <DialogDescription>
            Discover how ChemFlow can transform your chemical process simulations
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex items-start gap-4 p-4 border rounded-lg">
            <div className="bg-flow-blue text-white p-2 rounded-full">
              <Beaker className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium mb-1">Advanced Thermodynamic Models</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Access industry-standard models like Peng-Robinson, NRTL, UNIQUAC, and more for accurate phase equilibrium predictions.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-4 border rounded-lg">
            <div className="bg-purple-500 text-white p-2 rounded-full">
              <Lightbulb className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium mb-1">AI-Powered Process Optimization</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Leverage machine learning algorithms to automatically identify optimal process conditions and equipment configurations.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-4 border rounded-lg">
            <div className="bg-amber-500 text-white p-2 rounded-full">
              <Book className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium mb-1">Extensive Component Database</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Access over 2,000 chemical components with comprehensive property data for accurate simulations across various industries.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-4 border rounded-lg">
            <div className="bg-green-500 text-white p-2 rounded-full">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium mb-1">Interactive Learning Resources</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Access tutorials, webinars, and documentation to master chemical process simulation techniques and best practices.
              </p>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LearnMoreModal;
