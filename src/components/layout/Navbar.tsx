import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@/hooks/use-theme";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Menu } from 'lucide-react';
import ChemFlowLogo from "@/assets/icons/ChemFlowLogo";

const Navbar: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width: 640px)');
  
  const isAuthenticated = localStorage.getItem("auth") === "true";
  
  const handleSignOut = () => {
    localStorage.removeItem("auth");
    window.location.href = "/sign-in";
  };

  return (
    <header className="sticky top-0 z-50">
      <nav className="bg-white border-b border-gray-200 px-4 py-2 shadow-sm">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Mobile Menu */}
          <div className="flex items-center">
            {isSmallScreen && (
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-flow-blue mr-2"
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
            <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              Dashboard
            </Link>
            <Link to="/simulations" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              Simulations
            </Link>
            <Link to="/unit-converter" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              Unit Converter
            </Link>
            <Link to="/formulas" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              Formulas
            </Link>
            <Link to="/hysys-calculations" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              HYSYS Calculations
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              About
            </Link>
            <Link to="/components" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              Components
            </Link>
            <Link to="/code-converter" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              Code Converter
            </Link>
          </div>
          
          {/* User Menu */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-flow-blue"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-flow-blue to-blue-500 flex items-center justify-center text-white">
                    US
                  </div>
                </button>
                
                {showUserMenu && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none">
                    <div className="py-1">
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Settings
                      </Link>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/sign-in"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  Sign in
                </Link>
                <Link
                  to="/sign-up"
                  className="bg-flow-blue text-white hover:bg-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}
            
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="ml-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              {theme === "dark" ? (
                <SunIcon className="h-5 w-5 text-gray-700" />
              ) : (
                <MoonIcon className="h-5 w-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </nav>
      
      {/* Mobile Menu */}
      {isSmallScreen && showMobileMenu && (
        <div className="sm:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-md z-50">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/dashboard"
              className="bg-gray-100 text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
            >
              Dashboard
            </Link>
            <Link
              to="/simulations"
              className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
            >
              Simulations
            </Link>
            <Link
              to="/unit-converter"
              className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
            >
              Unit Converter
            </Link>
             <Link
              to="/formulas"
              className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
            >
              Formulas
            </Link>
            <Link
              to="/hysys-calculations"
              className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
            >
              HYSYS Calculations
            </Link>
            <Link
              to="/about"
              className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
            >
              About
            </Link>
            <Link
              to="/components"
              className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
            >
              Components
            </Link>
            <Link
              to="/code-converter"
              className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
            >
              Code Converter
            </Link>
             {isAuthenticated ? (
              <>
                <Link
                  to="/settings"
                  className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Settings
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left text-gray-600 hover:bg-gray-100 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/sign-in"
                  className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Sign in
                </Link>
                <Link
                  to="/sign-up"
                  className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
