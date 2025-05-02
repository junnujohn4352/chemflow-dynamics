
import React, { ReactNode } from 'react';
import { Software } from '@/types/software';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface BaseSoftwareInterfaceProps {
  software: Software;
  children?: ReactNode;
}

const BaseSoftwareInterface: React.FC<BaseSoftwareInterfaceProps> = ({ software, children }) => {
  const { toast } = useToast();
  
  const handleAction = (action: string) => {
    toast({
      title: action,
      description: `${action} function triggered in ${software.name}`,
      duration: 2000,
    });
  };

  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-xl font-semibold">Application Interface</h3>
      <Separator />
      
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4">
            <div className="text-center mb-4">
              <h4 className="text-lg font-medium">
                {software.name} Interface
              </h4>
              <p className="text-gray-500 text-sm">
                Simplified demonstration version
              </p>
            </div>
            
            {/* Common UI Elements */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-md p-3 bg-gray-50">
                <h5 className="font-medium mb-2 text-sm">Input Parameters</h5>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start text-xs text-gray-600"
                    onClick={() => handleAction("Import Parameters")}
                  >
                    Import Parameters
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start text-xs text-gray-600"
                    onClick={() => handleAction("Load Defaults")}
                  >
                    Load Defaults
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start text-xs text-gray-600"
                    onClick={() => handleAction("Clear All")}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md p-3 bg-gray-50">
                <h5 className="font-medium mb-2 text-sm">Simulation Controls</h5>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start text-xs text-gray-600"
                    onClick={() => handleAction("Run")}
                  >
                    Run
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start text-xs text-gray-600"
                    onClick={() => handleAction("Stop")}
                  >
                    Stop
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start text-xs text-gray-600"
                    onClick={() => handleAction("Reset")}
                  >
                    Reset
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md p-3 bg-gray-50">
                <h5 className="font-medium mb-2 text-sm">Output Data</h5>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start text-xs text-gray-600"
                    onClick={() => handleAction("View Results")}
                  >
                    View Results
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start text-xs text-gray-600"
                    onClick={() => handleAction("Export")}
                  >
                    Export
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start text-xs text-gray-600"
                    onClick={() => handleAction("Visualize")}
                  >
                    Visualize
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Custom content for specific interfaces */}
            {children}
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-gray-500 italic">
        Note: This is a simplified version with limited functionality for demonstration purposes.
      </p>
    </div>
  );
};

export default BaseSoftwareInterface;
