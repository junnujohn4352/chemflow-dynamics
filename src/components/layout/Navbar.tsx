import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ChemFlowLogo from "@/assets/icons/ChemFlowLogo";
import { Menu, X, Moon, Sun, Search, User, BarChart3, Settings, FileText, FlaskConical } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const navigationItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <BarChart3 className="h-4 w-4 mr-2" />,
    },
    {
      label: "Create Simulation",
      href: "/create-simulation",
      icon: <FlaskConical className="h-4 w-4 mr-2" />,
    },
    {
      label: "Analysis",
      href: "/analysis",
      icon: <BarChart3 className="h-4 w-4 mr-2" />,
    },
    {
      label: "HYSYS Calculations",
      href: "/hysys-calculations",
      icon: <FileText className="h-4 w-4 mr-2" />,
    },
    {
      label: "Code Converter",
      href: "/code-converter",
      icon: <FileText className="h-4 w-4 mr-2" />,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: <Settings className="h-4 w-4 mr-2" />,
    },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <ChemFlowLogo className="h-8 w-8 mr-2" />
              <span className="text-xl font-display font-bold text-gray-900 dark:text-white">
                Chem<span className="text-flow-blue">Flow</span>
              </span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navigationItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActiveRoute(item.href)
                      ? "bg-flow-blue text-white dark:bg-flow-blue/80"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <div className="flex items-center">
                    {item.icon}
                    {item.label}
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-4 flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              
              <div className="ml-3 relative">
                <Link to="/settings">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">
                    <User className="h-4 w-4" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="flex md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="text-gray-600 dark:text-gray-300 mr-2"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-800">
            {navigationItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActiveRoute(item.href)
                    ? "bg-flow-blue text-white dark:bg-flow-blue/80"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center">
                  {item.icon}
                  {item.label}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
