
import React from 'react';
import { motion } from 'framer-motion';

const ProcessFlowSteps = [
  "Define simulation objectives",
  "Develop process flowsheet", 
  "Input thermodynamic and property data", 
  "Specify operating conditions", 
  "Solve simulation model", 
  "Analyze results"
];

const ProcessFlow: React.FC = () => {
  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="space-y-4">
        {ProcessFlowSteps.map((step, index) => (
          <motion.div 
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: index * 0.2, 
              duration: 0.5 
            }}
            className="bg-gray-700 text-white p-4 rounded-lg text-center shadow-md"
          >
            {step}
            {index < ProcessFlowSteps.length - 1 && (
              <div className="h-8 w-px bg-white mx-auto my-2 opacity-50" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProcessFlow;

