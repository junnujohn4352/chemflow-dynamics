
import React from 'react';

interface ThermodynamicsTabProps {
  teaPackages: string[];
}

const ThermodynamicsTab: React.FC<ThermodynamicsTabProps> = ({ teaPackages }) => {
  return (
    <div className="border rounded-md p-4 mb-4">
      <h3 className="font-medium mb-3">TEA - Thermodynamics for Engineering Applications</h3>
      <p className="text-sm text-gray-600 mb-4">
        Select thermodynamic packages and property models for your simulation.
      </p>
      
      <div className="space-y-3">
        {teaPackages.map(pkg => (
          <div key={pkg} className="flex items-center p-2 border rounded hover:bg-blue-50">
            <input type="checkbox" id={pkg} className="mr-2" defaultChecked />
            <label htmlFor={pkg}>{pkg} Thermodynamics Package</label>
          </div>
        ))}
      </div>
      
      <div className="mt-4">
        <h4 className="font-medium mb-2">Property Methods</h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 border rounded bg-blue-50">Equations of State</div>
          <div className="p-2 border rounded bg-blue-50">Activity Coefficient Models</div>
          <div className="p-2 border rounded bg-blue-50">Steam Tables</div>
          <div className="p-2 border rounded bg-blue-50">Transport Properties</div>
        </div>
      </div>
    </div>
  );
};

export default ThermodynamicsTab;
