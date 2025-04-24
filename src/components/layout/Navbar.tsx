
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChemFlowLogo } from "@/assets/icons/ChemFlowLogo";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  ChevronDown, 
  User, 
  Search, 
  FlaskConical, 
  X,
  Calculator,
  BookOpen,
  BarChart3,
  Settings,
  Layout,
  Code,
  FlaskRound
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Navigation items with icons
  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: <Layout className="h-4 w-4 mr-2" /> },
    { label: "Components", path: "/components", icon: <FlaskConical className="h-4 w-4 mr-2" /> },
    { label: "Chemical Formulas", path: "/chemical-formulas", icon: <BookOpen className="h-4 w-4 mr-2" /> },
    { label: "Simulations", path: "/simulations", icon: <FlaskRound className="h-4 w-4 mr-2" /> },
    { label: "Calculators", path: "/unit-converter", icon: <Calculator className="h-4 w-4 mr-2" /> },
    { label: "Code Tools", path: "/code-converter", icon: <Code className="h-4 w-4 mr-2" /> }
  ];

  // Check if a path is active
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white/80 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 sticky top-0 z-40">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <ChemFlowLogo className="h-8 w-auto" />
              <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">ChemFlow</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-1 lg:space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive(item.path)
                      ? 'text-flow-blue bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/60 dark:hover:text-white'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center">
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-300">
                <Search className="h-5 w-5" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="ml-2 flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span className="hidden lg:inline">Account</span>
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link to="/settings">
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/simulations">
                    <DropdownMenuItem className="cursor-pointer">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      My Simulations
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <Link to="/sign-in">
                    <DropdownMenuItem className="cursor-pointer text-red-600 dark:text-red-400">
                      Sign Out
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
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
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 text-base font-medium rounded-md ${
                  isActive(item.path)
                    ? 'text-flow-blue bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-white'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <Link
                to="/settings"
                className="flex items-center px-3 py-2 text-base font-medium rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
              <Link
                to="/sign-in"
                className="flex items-center px-3 py-2 text-base font-medium rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Out
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
