
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Menu, X, ChevronDown, 
  LayoutDashboard, FileText, 
  BarChart3, Database, Settings,
  Brain, FlaskConical, Moon, Sun,
  Info, Calculator, Code
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
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
      label: "Component Library", 
      href: "/components", 
      icon: <Database className="h-4 w-4 mr-2" />
    },
    {
      label: "Process Analysis",
      href: "/analysis",
      icon: <BarChart3 className="h-4 w-4 mr-2" />
    },
    {
      label: "HYSYS Calculations",
      href: "/hysys-calculations",
      icon: <Calculator className="h-4 w-4 mr-2" />
    },
    {
      label: "Code Converter",
      href: "/code-converter",
      icon: <Code className="h-4 w-4 mr-2" />
    },
    { 
      label: "AI Assistant", 
      href: "/ai-simulation", 
      icon: <Brain className="h-4 w-4 mr-2" />
    },
    {
      label: "About",
      href: "/about",
      icon: <Info className="h-4 w-4 mr-2" />
    },
    { 
      label: "Settings", 
      href: "/settings", 
      icon: <Settings className="h-4 w-4 mr-2" />
    },
  ];

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem('darkMode', newMode ? 'dark' : 'light');
  };

  // Check for saved dark mode preference when component mounts
  React.useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Brand text only */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <span className="text-xl font-display font-bold tracking-tight dark:text-white">
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
            
            <Button 
              variant="outline" 
              size="sm"
              asChild
              className="dark:border-gray-600 dark:text-gray-200"
            >
              <Link to="/create-simulation">
                <FlaskConical className="h-4 w-4 mr-2" />
                Create Simulation
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="ml-2"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </nav>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="mr-2"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
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
            
            <Link
              to="/create-simulation"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center">
                <FlaskConical className="h-4 w-4 mr-2" />
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
