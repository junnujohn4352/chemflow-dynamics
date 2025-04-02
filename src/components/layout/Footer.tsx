
import React from "react";
import ChemFlowLogo from "@/assets/icons/ChemFlowLogo";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 dark:bg-gray-800 dark:border-gray-700">
      <div className="max-w-screen-2xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <ChemFlowLogo className="h-8 w-auto" />
          </div>
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} ChemFlow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
