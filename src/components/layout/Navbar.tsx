
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
  
  // Main navigation items in the requested order
  const navItems = [
    { title: "Dashboard", path: "/dashboard" },
    { title: "Create Simulation", path: "/create-simulation" },
    { title: "HYSYS Calculations", path: "/hysys-calculations" },
    { title: "Unit Converter", path: "/unit-converter" },
    { title: "Code Converter", path: "/code-converter" },
    { title: "Formulas", path: "/formulas" },
    { title: "About", path: "/about" },
    { title: "Settings", path: "/settings" }
  ];

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
            {navItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium"
              >
                {item.title}
              </Link>
            ))}
          </div>
          
          {/* Theme Toggle */}
          <div className="flex items-center">
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
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-purple-600"
                onClick={() => setShowMobileMenu(false)}
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
