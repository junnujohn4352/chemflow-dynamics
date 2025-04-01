
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Menu, X, ChevronDown, 
  LayoutDashboard, FileText, 
  BarChart3, Database, Settings,
  Brain, Flask
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ChemFlowLogo from "@/assets/icons/ChemFlowLogo";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const isActiveRoute = (route: string) => {
    return location.pathname === route;
  };
  
  const navigationItems = [
    { 
      label: "Dashboard", 
      href: "/dashboard", 
      icon: <LayoutDashboard className="h-4 w-4 mr-2" />
    },
    { 
      label: "Simulations", 
      href: "/simulations", 
      icon: <FileText className="h-4 w-4 mr-2" />
    },
    { 
      label: "AI Assistant", 
      href: "/ai-simulation", 
      icon: <Brain className="h-4 w-4 mr-2" />
    },
    { 
      label: "Settings", 
      href: "/settings", 
      icon: <Settings className="h-4 w-4 mr-2" />
    },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <ChemFlowLogo className="h-8 w-auto mr-2" />
              <span className="text-xl font-display font-bold tracking-tight">
                ChemFlow
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActiveRoute(item.href)
                    ? "bg-flow-blue text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center">
                  {item.icon}
                  {item.label}
                </div>
              </Link>
            ))}
            
            <Button 
              variant="outline" 
              size="sm"
              asChild
            >
              <Link to="/create-simulation">
                <Flask className="h-4 w-4 mr-2" />
                Create Simulation
              </Link>
            </Button>
          </nav>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigationItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActiveRoute(item.href)
                    ? "bg-flow-blue text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center">
                  {item.icon}
                  {item.label}
                </div>
              </Link>
            ))}
            
            <Link
              to="/create-simulation"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center">
                <Flask className="h-4 w-4 mr-2" />
                Create Simulation
              </div>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
