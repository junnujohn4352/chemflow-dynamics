
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChemFlowLogo } from "@/assets/icons/ChemFlowLogo";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X,
  Settings,
} from "lucide-react";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <nav className="bg-white/80 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 sticky top-0 z-40">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <ChemFlowLogo className="h-8 w-auto" />
              <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">ChemFlow</span>
            </Link>
          </div>
          
          <div className="flex items-center">
            {/* Settings button */}
            <Link to="/settings">
              <Button variant="outline" size="sm" className="ml-2 hidden md:flex items-center">
                <Settings className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Settings</span>
              </Button>
            </Link>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
                className="text-gray-600 dark:text-gray-300"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-top-5 duration-200">
          <div className="px-4 pt-2 pb-4 space-y-1">
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <Link
                to="/settings"
                className="flex items-center px-3 py-2 text-base font-medium rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
