
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/use-theme";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Menu } from 'lucide-react';
import ChemFlowLogo from "@/assets/icons/ChemFlowLogo";

const Navbar: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width: 640px)');
  const navigate = useNavigate();
  
  const isAuthenticated = localStorage.getItem("auth") === "true";
  
  const handleSignOut = () => {
    localStorage.removeItem("auth");
    navigate("/sign-in");
  };

  return (
    <header className="sticky top-0 z-50">
      <nav className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 border-b border-gray-200 px-4 py-2 shadow-sm dark:border-gray-700">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Mobile Menu */}
          <div className="flex items-center">
            {isSmallScreen && (
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-200 hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-flow-blue mr-2"
              >
                <span className="sr-only">Open main menu</span>
                <Menu className="h-6 w-6" aria-hidden="true" />
              </button>
            )}
            <Link to="/" className="flex-shrink-0">
              <ChemFlowLogo className="h-8 w-auto" />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <Link to="/dashboard" className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium">
              Dashboard
            </Link>
            <Link to="/create-simulation" className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium">
              Create Simulation
            </Link>
            <Link to="/unit-converter" className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium">
              Unit Converter
            </Link>
            <Link to="/formulas" className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium">
              Formulas
            </Link>
            <Link to="/hysys-calculations" className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium">
              HYSYS Calculations
            </Link>
            <Link to="/about" className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium">
              About
            </Link>
            <Link to="/code-converter" className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium">
              Code Converter
            </Link>
          </div>
          
          {/* User Menu */}
          <div className="flex items-center">
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-purple-500 focus:ring-white"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-600 flex items-center justify-center text-white">
                    US
                  </div>
                </button>
                
                {showUserMenu && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none dark:bg-gray-800 dark:ring-gray-700 dark:divide-gray-700">
                    <div className="py-1">
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Settings
                      </Link>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="ml-4 p-2 rounded-full text-white hover:bg-purple-600 transition-colors"
            >
              {isDarkMode ? (
                <SunIcon className="h-5 w-5 text-white" />
              ) : (
                <MoonIcon className="h-5 w-5 text-white" />
              )}
            </button>
          </div>
        </div>
      </nav>
      
      {/* Mobile Menu */}
      {isSmallScreen && showMobileMenu && (
        <div className="sm:hidden absolute top-full left-0 right-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 border-b border-gray-200 shadow-md z-50">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/dashboard"
              className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-purple-600"
            >
              Dashboard
            </Link>
            <Link
              to="/create-simulation"
              className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-purple-600"
            >
              Create Simulation
            </Link>
            <Link
              to="/unit-converter"
              className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-purple-600"
            >
              Unit Converter
            </Link>
             <Link
              to="/formulas"
              className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-purple-600"
            >
              Formulas
            </Link>
            <Link
              to="/hysys-calculations"
              className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-purple-600"
            >
              HYSYS Calculations
            </Link>
            <Link
              to="/about"
              className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-purple-600"
            >
              About
            </Link>
            <Link
              to="/code-converter"
              className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-purple-600"
            >
              Code Converter
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/settings"
                  className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-purple-600"
                >
                  Settings
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-purple-600"
                >
                  Sign out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
