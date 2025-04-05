import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GlassPanel from "@/components/ui/GlassPanel";
import { 
  Search, 
  Filter, 
  ArrowRight, 
  Columns,
  FlaskConical, 
  Droplets, 
  Thermometer, 
  Gauge, 
  MoveHorizontal,
  ArrowUpDown,
  Blocks,
  GitFork,
  Waves,
  Container
} from "lucide-react";
import { Input } from "@/components/ui/input";

// Component types with icons
const categories = [
  { id: "reactors", name: "Reactors", icon: <FlaskConical className="h-5 w-5" /> },
  { id: "columns", name: "Columns", icon: <Columns className="h-5 w-5" /> },
  { id: "mixers", name: "Mixers", icon: <Droplets className="h-5 w-5" /> },
  { id: "heat", name: "Heat Exchangers", icon: <ArrowUpDown className="h-5 w-5" /> },
  { id: "pressure", name: "Pressure Equipment", icon: <Gauge className="h-5 w-5" /> },
  { id: "flow", name: "Flow Equipment", icon: <MoveHorizontal className="h-5 w-5" /> },
  { id: "separation", name: "Separation Equipment", icon: <GitFork className="h-5 w-5" /> },
  { id: "storage", name: "Storage Equipment", icon: <Container className="h-5 w-5" /> },
  { id: "thermal", name: "Thermal Processing", icon: <Thermometer className="h-5 w-5" /> },
  { id: "compression", name: "Compression Equipment", icon: <Blocks className="h-5 w-5" /> },
];

interface ComponentItem {
  id: string;
  name: string;
  category: string;
  description: string;
  specs: {
    maxTemp?: string;
    maxPressure?: string;
    maxFlow?: string;
    dimensions?: string;
    material?: string;
  };
}

const Components = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock data - in a real app, this would come from a database
  const components: ComponentItem[] = [
    {
      id: "cstr-1",
      name: "Continuous Stirred Tank Reactor",
      category: "reactors",
      description: "A vessel used to create an ideal mixing reactor, facilitating reactions with constant flow.",
      specs: {
        maxTemp: "250°C",
        maxPressure: "10 bar",
        material: "Stainless Steel 316"
      }
    },
    {
      id: "pbr-1",
      name: "Packed Bed Reactor",
      category: "reactors",
      description: "A tubular reactor filled with catalyst particles for heterogeneous reactions.",
      specs: {
        maxTemp: "500°C",
        maxPressure: "25 bar",
        material: "Inconel Alloy"
      }
    },
    {
      id: "dist-1",
      name: "Distillation Column",
      category: "columns",
      description: "Separation equipment using the difference in volatilities to separate mixtures.",
      specs: {
        maxTemp: "180°C",
        maxPressure: "5 bar",
        dimensions: "1.5m dia x 10m height"
      }
    },
    {
      id: "abs-1",
      name: "Absorption Column",
      category: "columns",
      description: "Gas-liquid contactor for mass transfer between phases.",
      specs: {
        maxTemp: "120°C",
        maxPressure: "8 bar",
        dimensions: "1.2m dia x 8m height"
      }
    },
    {
      id: "mix-1",
      name: "Static Mixer",
      category: "mixers",
      description: "Pipeline element for continuous blending of fluids without moving parts.",
      specs: {
        maxFlow: "50 m³/h",
        maxPressure: "15 bar",
        material: "PTFE"
      }
    },
    {
      id: "he-1",
      name: "Shell & Tube Heat Exchanger",
      category: "heat",
      description: "Transfers heat between two fluids through tube walls.",
      specs: {
        maxTemp: "350°C",
        maxPressure: "30 bar",
        material: "Carbon Steel"
      }
    },
    {
      id: "pump-1",
      name: "Centrifugal Pump",
      category: "flow",
      description: "Converts rotational energy to fluid flow energy for transport.",
      specs: {
        maxFlow: "200 m³/h",
        maxPressure: "12 bar",
        material: "Cast Iron"
      }
    },
    {
      id: "valve-1",
      name: "Control Valve",
      category: "flow",
      description: "Regulates flow rate by varying the flow passage area.",
      specs: {
        maxFlow: "75 m³/h",
        maxPressure: "20 bar",
        material: "Stainless Steel 304"
      }
    },
    {
      id: "heat-ex-1",
      name: "Shell & Tube Heat Exchanger",
      category: "heat",
      description: "Transfers heat between two fluids through tube walls.",
      specs: {
        maxTemp: "350°C",
        maxPressure: "30 bar",
        material: "Carbon Steel"
      }
    },
    {
      id: "heat-ex-2",
      name: "Plate Heat Exchanger",
      category: "heat",
      description: "Uses metal plates to transfer heat between two fluids.",
      specs: {
        maxTemp: "200°C",
        maxPressure: "25 bar",
        material: "Stainless Steel 316"
      }
    },
    {
      id: "heat-ex-3",
      name: "Spiral Heat Exchanger",
      category: "heat",
      description: "Uses spiral channels for efficient heat transfer with fouling fluids.",
      specs: {
        maxTemp: "400°C",
        maxPressure: "20 bar",
        material: "Titanium Alloy"
      }
    },
    {
      id: "filter-1",
      name: "Bag Filter",
      category: "separation",
      description: "Uses fabric bags to filter particulates from gas or liquid streams.",
      specs: {
        maxTemp: "120°C",
        maxPressure: "10 bar",
        material: "Polypropylene"
      }
    },
    {
      id: "filter-2",
      name: "Cartridge Filter",
      category: "separation",
      description: "Uses replaceable cartridges for fine filtration of liquids.",
      specs: {
        maxFlow: "100 m³/h",
        maxPressure: "15 bar",
        material: "Various media"
      }
    },
    {
      id: "compr-1",
      name: "Centrifugal Compressor",
      category: "compression",
      description: "Increases gas pressure through centrifugal force.",
      specs: {
        maxFlow: "500,000 m³/h",
        maxPressure: "80 bar",
        material: "Stainless Steel"
      }
    },
    {
      id: "compr-2",
      name: "Reciprocating Compressor",
      category: "compression",
      description: "Uses pistons to compress gas to high pressures.",
      specs: {
        maxFlow: "10,000 m³/h",
        maxPressure: "400 bar",
        material: "Cast Iron / Steel"
      }
    },
    {
      id: "tank-1",
      name: "Floating Roof Tank",
      category: "storage",
      description: "Large storage vessel with floating roof to minimize vapor loss.",
      specs: {
        maxTemp: "80°C",
        dimensions: "Up to 100m dia",
        material: "Carbon Steel"
      }
    },
    {
      id: "separat-1",
      name: "Cyclone Separator",
      category: "separation",
      description: "Uses centrifugal force to separate particles from gas stream.",
      specs: {
        maxFlow: "50,000 m³/h",
        maxTemp: "500°C",
        material: "Carbon Steel"
      }
    },
    {
      id: "thermal-1",
      name: "Rotary Dryer",
      category: "thermal",
      description: "Rotating drum that removes moisture using hot air flow.",
      specs: {
        maxTemp: "600°C",
        dimensions: "2-5m dia x 10-20m length",
        material: "Carbon Steel"
      }
    },
  ];
  
  // Filter components based on search and category
  const filteredComponents = components.filter(comp => {
    const matchesSearch = comp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           comp.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? comp.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-16 px-6 bg-gray-50">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold mb-2">Equipment Library</h1>
            <p className="text-gray-600">Browse and select components for your process simulation</p>
          </div>
          
          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search components..." 
                className="pl-9 h-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              <button 
                onClick={() => setSelectedCategory(null)}
                className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  selectedCategory === null 
                    ? 'bg-flow-blue text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Filter className="mr-1.5 h-3.5 w-3.5" />
                All
              </button>
              
              {categories.map(category => (
                <button 
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedCategory === category.id 
                      ? 'bg-flow-blue text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {React.cloneElement(category.icon, { className: "mr-1.5 h-3.5 w-3.5" })}
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Components Grid */}
          {filteredComponents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredComponents.map(component => (
                <GlassPanel key={component.id} className="p-6 h-full flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 rounded-lg bg-blue-50 text-flow-blue">
                      {categories.find(cat => cat.id === component.category)?.icon || 
                       <FlaskConical className="h-5 w-5" />}
                    </div>
                    <div className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      {categories.find(cat => cat.id === component.category)?.name || "Component"}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-medium mb-2">{component.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 flex-1">{component.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Specifications</h4>
                    <div className="space-y-1.5">
                      {component.specs.maxTemp && (
                        <div className="flex text-sm">
                          <span className="text-gray-500 w-1/3">Max Temp:</span>
                          <span>{component.specs.maxTemp}</span>
                        </div>
                      )}
                      {component.specs.maxPressure && (
                        <div className="flex text-sm">
                          <span className="text-gray-500 w-1/3">Max Pressure:</span>
                          <span>{component.specs.maxPressure}</span>
                        </div>
                      )}
                      {component.specs.maxFlow && (
                        <div className="flex text-sm">
                          <span className="text-gray-500 w-1/3">Max Flow:</span>
                          <span>{component.specs.maxFlow}</span>
                        </div>
                      )}
                      {component.specs.dimensions && (
                        <div className="flex text-sm">
                          <span className="text-gray-500 w-1/3">Dimensions:</span>
                          <span>{component.specs.dimensions}</span>
                        </div>
                      )}
                      {component.specs.material && (
                        <div className="flex text-sm">
                          <span className="text-gray-500 w-1/3">Material:</span>
                          <span>{component.specs.material}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Link 
                    to={`/component/${component.id}`}
                    className="inline-flex items-center text-flow-blue hover:text-flow-blue/80 mt-auto"
                  >
                    View Details
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </GlassPanel>
              ))}
            </div>
          ) : (
            <GlassPanel className="p-8 text-center">
              <h3 className="text-lg font-medium mb-2">No components found</h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria
              </p>
            </GlassPanel>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Components;
