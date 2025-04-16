
import React from 'react';
import { FlaskConical, Droplets } from 'lucide-react';

interface LolbyLogoProps {
  className?: string;
}

export const LolbyLogo: React.FC<LolbyLogoProps> = ({ className }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative mr-2">
        <FlaskConical className="h-6 w-6 text-purple-600" />
        <Droplets className="h-4 w-4 text-blue-500 absolute -bottom-1 -right-1" />
      </div>
      <span className="font-bold text-lg text-gray-800 dark:text-white">Lolby</span>
    </div>
  );
};

// Export as default as well to support both import styles
export default LolbyLogo;
