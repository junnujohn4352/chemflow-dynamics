
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ChemFlowLogo from "@/assets/icons/ChemFlowLogo";
import { cn } from "@/lib/utils";
import { 
  LayoutGrid, 
  FileText, 
  BarChart3, 
  Database, 
  PanelRight, 
  Search,
  Bell,
  HelpCircle,
  Sliders
} from "lucide-react";

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-200",
        scrolled 
          ? "bg-white/70 backdrop-blur-lg shadow-sm border-b border-gray-100" 
          : "bg-transparent"
      )}
    >
      <div className="max-w-screen-2xl mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <ChemFlowLogo className="h-10 w-auto" />
            </Link>
            
            <nav className="ml-10 hidden md:flex items-center space-x-1">
              <NavItem icon={<LayoutGrid className="h-4 w-4" />} href="/simulations" label="Simulations" />
              <NavItem icon={<FileText className="h-4 w-4" />} href="/create-simulation" label="Create Simulation" />
              <NavItem icon={<Database className="h-4 w-4" />} href="/components" label="Components" />
              <NavItem icon={<BarChart3 className="h-4 w-4" />} href="/analysis" label="Analysis" />
              <NavItem icon={<Sliders className="h-4 w-4" />} href="/settings" label="App Settings" />
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:flex items-center">
              <Search className="absolute left-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-2 rounded-lg bg-gray-50 border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-flow-blue/20 focus:border-flow-blue transition-all w-56"
              />
            </div>
            
            <button className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <button className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
              <HelpCircle className="h-5 w-5" />
            </button>
            
            <button className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
              <PanelRight className="h-5 w-5" />
            </button>
            
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-flow-blue to-flow-cyan shadow-sm flex items-center justify-center text-white font-medium text-sm">
              CF
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, href, active }) => {
  // Check if current route matches this nav item
  const isActive = window.location.pathname === href;
  
  return (
    <Link
      to={href}
      className={cn(
        "px-3 py-2 rounded-lg text-sm font-medium flex items-center transition-all",
        isActive
          ? "text-flow-blue bg-blue-50"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
      )}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </Link>
  );
};

export default Navbar;
