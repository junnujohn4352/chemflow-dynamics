
import React from 'react';
import { Software } from '@/types/software';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface BaseSoftwareInterfaceProps {
  software: Software;
  children?: React.ReactNode;
}

const BaseSoftwareInterface: React.FC<BaseSoftwareInterfaceProps> = ({ software, children }) => {
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
                  <div className="text-xs text-gray-600">Parameter 1</div>
                  <div className="text-xs text-gray-600">Parameter 2</div>
                  <div className="text-xs text-gray-600">Parameter 3</div>
                </div>
              </div>
              
              <div className="border rounded-md p-3 bg-gray-50">
                <h5 className="font-medium mb-2 text-sm">Simulation Controls</h5>
                <div className="space-y-2">
                  <div className="text-xs text-gray-600">Run</div>
                  <div className="text-xs text-gray-600">Stop</div>
                  <div className="text-xs text-gray-600">Reset</div>
                </div>
              </div>
              
              <div className="border rounded-md p-3 bg-gray-50">
                <h5 className="font-medium mb-2 text-sm">Output Data</h5>
                <div className="space-y-2">
                  <div className="text-xs text-gray-600">Results</div>
                  <div className="text-xs text-gray-600">Export</div>
                  <div className="text-xs text-gray-600">Visualize</div>
                </div>
              </div>
            </div>
            
            {/* Custom content for specific interfaces */}
            {children}
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-gray-500 italic">
        Note: Click "Launch App" to open the full application interface with all features.
      </p>
    </div>
  );
};

export default BaseSoftwareInterface;
