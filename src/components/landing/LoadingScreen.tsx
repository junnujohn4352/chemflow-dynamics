
import React from "react";
import ChemFlowLogo from "@/assets/icons/ChemFlowLogo";

interface LoadingScreenProps {
  opacity: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ opacity }) => {
  return (
    <div 
      className="text-center bg-white/80 p-8 rounded-2xl shadow-lg backdrop-blur-sm" 
      style={{ opacity: opacity }}
    >
      <div className="flex justify-center mb-6 animate-pulse">
        <ChemFlowLogo className="h-24 w-auto" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-2">ChemFlow</h1>
      <div className="flex items-center justify-center">
        <div className="h-1 w-64 bg-blue-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-progress w-3/4"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
