import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Book, Download, ExternalLink, FileText, Github, Info } from "lucide-react";

import ProcessSimulationInterface from "@/components/software-interfaces/ProcessSimulationInterface";
import ThermodynamicInterface from "@/components/software-interfaces/ThermodynamicInterface";
import ReactionEngineeringInterface from "@/components/software-interfaces/ReactionEngineeringInterface";
import DataAnalysisInterface from "@/components/software-interfaces/DataAnalysisInterface";
import ProcessControlInterface from "@/components/software-interfaces/ProcessControlInterface";
import PipingDesignInterface from "@/components/software-interfaces/PipingDesignInterface";
import EquipmentDesignInterface from "@/components/software-interfaces/EquipmentDesignInterface";
import EnvironmentalSafetyInterface from "@/components/software-interfaces/EnvironmentalSafetyInterface";
import CFDInterface from "@/components/software-interfaces/CFDInterface";
import ChemicalDatabaseInterface from "@/components/software-interfaces/ChemicalDatabaseInterface";
import MiscellaneousToolsInterface from "@/components/software-interfaces/MiscellaneousToolsInterface";

// Define the structure for software features
interface Feature {
  title: string;
  description: string;
}

// Define the structure for software
interface Software {
  id: string;
  name: string;
  description: string;
  category: string;
  price: string;
  openSource: boolean;
  website?: string;
  repository?: string;
  features?: string[];
  rating?: number;
  votes?: number;
}

// Define the structure for educational resources
interface EducationalResource {
  id: string;
  title: string;
  description: string;
  type: string;
  url: string;
  tags: string[];
}

// Define the structure for the database
interface SoftwareDatabase {
  software: Software[];
  educationalResources: EducationalResource[];
}

// Mock software database
const mockSoftwareDatabase: SoftwareDatabase = {
  software: [
    {
      id: "1",
      name: "Aspen Plus",
      description: "Aspen Plus is a chemical process simulator used for designing, simulating, and optimizing chemical processes.",
      category: "Process Simulation",
      price: "Paid",
      openSource: false,
      website: "https://www.aspentech.com/en/products/engineering/aspen-plus",
      features: [
        "Process modeling",
        "Simulation",
        "Optimization",
        "Thermodynamic analysis",
      ],
      rating: 4.5,
      votes: 120,
    },
    {
      id: "2",
      name: "ChemCAD",
      description: "ChemCAD is a suite of chemical process simulation software used for process design, optimization, and real-time process monitoring.",
      category: "Process Simulation",
      price: "Paid",
      openSource: false,
      website: "https://www.chemstations.com/products/chemcad/",
      features: [
        "Process simulation",
        "Equipment design",
        "Economic analysis",
        "Real-time monitoring",
      ],
      rating: 4.2,
      votes: 95,
    },
    {
      id: "3",
      name: "DWSIM",
      description: "DWSIM is an open-source, CAPE-OPEN compliant chemical process simulator for modeling, simulation, and optimization of chemical processes.",
      category: "Process Simulation",
      price: "Free",
      openSource: true,
      website: "https://dwsim.inforside.com.br/",
      repository: "https://github.com/DanWBR/dwsim",
      features: [
        "Process simulation",
        "Thermodynamic calculations",
        "Unit operations",
        "CAPE-OPEN compliant",
      ],
      rating: 4.8,
      votes: 150,
    },
    {
      id: "4",
      name: "ProSimPlus",
      description: "ProSimPlus is a process simulation software that helps engineers design, optimize, and analyze chemical processes.",
      category: "Process Simulation",
      price: "Paid",
      openSource: false,
      website: "https://www.prosim.net/en/software/prosimplus/",
      features: [
        "Steady-state simulation",
        "Dynamic simulation",
        "Batch process simulation",
        "Process optimization",
      ],
      rating: 4.3,
      votes: 110,
    },
    {
      id: "5",
      name: "COCO Simulator",
      description: "COCO (CAPE-OPEN to CAPE-OPEN) is a free CAPE-OPEN compliant steady-state chemical process simulator.",
      category: "Process Simulation",
      price: "Free",
      openSource: true,
      website: "https://www.cocosimulator.org/",
      features: [
        "Steady-state simulation",
        "Thermodynamic calculations",
        "Unit operations",
        "CAPE-OPEN compliant",
      ],
      rating: 4.6,
      votes: 130,
    },
    {
      id: "6",
      name: "REFPROP",
      description: "NIST REFPROP (Reference Fluid Thermodynamic and Transport Properties Database) is a widely used database for thermophysical properties of fluids.",
      category: "Thermodynamic Properties",
      price: "Paid",
      openSource: false,
      website: "https://www.nist.gov/srd/refprop",
      features: [
        "Thermodynamic properties",
        "Transport properties",
        "Fluid properties",
        "Mixture properties",
      ],
      rating: 4.7,
      votes: 140,
    },
    {
      id: "7",
      name: "Cantera",
      description: "Cantera is an open-source suite of tools for problems involving chemical kinetics, thermodynamics, and transport phenomena.",
      category: "Reaction Engineering",
      price: "Free",
      openSource: true,
      website: "https://cantera.org/",
      repository: "https://github.com/Cantera/cantera",
      features: [
        "Chemical kinetics",
        "Thermodynamics",
        "Transport phenomena",
        "Reaction mechanisms",
      ],
      rating: 4.9,
      votes: 160,
    },
    {
      id: "8",
      name: "SciPy",
      description: "SciPy is a Python library used for scientific computing and data analysis, including statistical analysis and data visualization.",
      category: "Data Analysis",
      price: "Free",
      openSource: true,
      website: "https://scipy.org/",
      repository: "https://github.com/scipy/scipy",
      features: [
        "Statistical analysis",
        "Data visualization",
        "Numerical integration",
        "Optimization",
      ],
      rating: 4.4,
      votes: 100,
    },
    {
      id: "9",
      name: "MATLAB",
      description: "MATLAB is a numerical computing environment and programming language used for algorithm development, data analysis, and simulation.",
      category: "Data Analysis",
      price: "Paid",
      openSource: false,
      website: "https://www.mathworks.com/products/matlab.html",
      features: [
        "Numerical computing",
        "Data analysis",
        "Algorithm development",
        "Simulation",
      ],
      rating: 4.6,
      votes: 125,
    },
    {
      id: "10",
      name: "LabVIEW",
      description: "LabVIEW is a graphical programming environment used for data acquisition, instrument control, and industrial automation.",
      category: "Process Control",
      price: "Paid",
      openSource: false,
      website: "https://www.ni.com/en-us/shop/labview.html",
      features: [
        "Data acquisition",
        "Instrument control",
        "Industrial automation",
        "Graphical programming",
      ],
      rating: 4.5,
      votes: 115,
    },
    {
      id: "11",
      name: "AutoCAD Plant 3D",
      description: "AutoCAD Plant 3D is a CAD software used for designing and modeling plant layouts, piping, and equipment.",
      category: "Piping Design",
      price: "Paid",
      openSource: false,
      website: "https://www.autodesk.com/products/autocad-plant-3d/overview",
      features: [
        "Plant layout design",
        "Piping design",
        "Equipment modeling",
        "Isometric drawings",
      ],
      rating: 4.3,
      votes: 90,
    },
    {
      id: "12",
      name: "HTRI Xchanger Suite",
      description: "HTRI Xchanger Suite is a software package used for the design and rating of heat exchangers.",
      category: "Equipment Design",
      price: "Paid",
      openSource: false,
      website: "https://www.htri.net/products/xchanger-suite",
      features: [
        "Heat exchanger design",
        "Thermal rating",
        "Mechanical design",
        "Performance analysis",
      ],
      rating: 4.7,
      votes: 135,
    },
    {
      id: "13",
      name: "Phast",
      description: "DNV Phast is a software tool used for process hazard analysis, risk assessment, and consequence modeling.",
      category: "Environmental & Safety",
      price: "Paid",
      openSource: false,
      website: "https://www.dnv.com/services/phast-process-hazard-analysis-software-924",
      features: [
        "Process hazard analysis",
        "Risk assessment",
        "Consequence modeling",
        "Quantitative risk analysis",
      ],
      rating: 4.4,
      votes: 105,
    },
    {
      id: "14",
      name: "Ansys Fluent",
      description: "Ansys Fluent is a computational fluid dynamics (CFD) software used for simulating fluid flow, heat transfer, and chemical reactions.",
      category: "CFD & Transport Phenomena",
      price: "Paid",
      openSource: false,
      website: "https://www.ansys.com/products/fluids/ansys-fluent",
      features: [
        "Fluid flow simulation",
        "Heat transfer simulation",
        "Chemical reactions",
        "Turbulence modeling",
      ],
      rating: 4.8,
      votes: 145,
    },
    {
      id: "15",
      name: "ChemSpider",
      description: "ChemSpider is a chemical structure database providing access to chemical information, structures, and properties.",
      category: "Chemical Database",
      price: "Free",
      openSource: false,
      website: "http://www.chemspider.com/",
      features: [
        "Chemical structures",
        "Chemical properties",
        "Spectroscopic data",
        "Literature references",
      ],
      rating: 4.6,
      votes: 120,
    },
    {
      id: "16",
      name: "Wolfram Alpha",
      description: "Wolfram Alpha is a computational knowledge engine that can perform calculations, answer questions, and provide information on various topics.",
      category: "Miscellaneous Tools",
      price: "Paid",
      openSource: false,
      website: "https://www.wolframalpha.com/",
      features: [
        "Calculations",
        "Data analysis",
        "Information retrieval",
        "Knowledge representation",
      ],
      rating: 4.5,
      votes: 110,
    },
  ],
  educationalResources: [
    {
      id: "101",
      title: "MIT OpenCourseWare: Chemical Engineering",
      description: "Free lecture notes, videos, and assignments from MIT's chemical engineering courses.",
      type: "Course",
      url: "https://ocw.mit.edu/courses/chemical-engineering/",
      tags: ["chemical engineering", "courses", "MIT", "open courseware"],
    },
    {
      id: "102",
      title: "LearnChemE",
      description: "Interactive simulations and screencasts for chemical engineering concepts.",
      type: "Simulation",
      url: "https://learncheme.com/",
      tags: ["chemical engineering", "simulations", "screencasts", "interactive"],
    },
    {
      id: "103",
      title: "Chemical Engineering Stack Exchange",
      description: "A community-driven Q&A site for chemical engineering professionals and students.",
      type: "Forum",
      url: "https://engineering.stackexchange.com/questions/tagged/chemical-engineering",
      tags: ["chemical engineering", "forum", "Q&A", "community"],
    },
  ],
};

const SoftwareTools: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [softwareData, setSoftwareData] = useState<SoftwareDatabase>(mockSoftwareDatabase);
  const [selectedSoftware, setSelectedSoftware] = useState<Software | null>(null);
  const [activeTab, setActiveTab] = useState<"software" | "educational">("software");

  const filteredSoftware = softwareData.software.filter((software) => {
    const searchRegex = new RegExp(searchTerm, "i");
    const categoryMatch = categoryFilter === "all" || software.category === categoryFilter;
    return searchRegex.test(software.name) && categoryMatch;
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
  };

  const renderSoftwareInterface = (selectedSoftware: Software) => {
    switch (selectedSoftware.category) {
      case "Process Simulation":
        return <ProcessSimulationInterface software={selectedSoftware} />;
      case "Thermodynamic Properties":
        return <ThermodynamicInterface software={selectedSoftware} />;
      case "Reaction Engineering":
        return <ReactionEngineeringInterface software={selectedSoftware} />;
      case "Data Analysis":
        return <DataAnalysisInterface software={selectedSoftware} />;
      case "Process Control":
        return <ProcessControlInterface software={selectedSoftware} />;
      case "Equipment Design":
        return <EquipmentDesignInterface software={selectedSoftware} />;
      case "Piping Design":
        return <PipingDesignInterface software={selectedSoftware} />;
      case "Environmental & Safety":
        return <EnvironmentalSafetyInterface software={selectedSoftware} />;
      case "CFD & Transport Phenomena":
        return <CFDInterface software={selectedSoftware} />;
      case "Chemical Database":
        return <ChemicalDatabaseInterface software={selectedSoftware} />;
      case "Miscellaneous Tools":
        return <MiscellaneousToolsInterface software={selectedSoftware} />;
      default:
        return <div className="p-4">No specific interface available for {selectedSoftware.name}</div>;
    }
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Chemical Engineering Digital Resources</h1>
      
      <Tabs defaultValue="software" className="mb-8" value={activeTab} onValueChange={(value) => setActiveTab(value as "software" | "educational")}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="software">Software Tools</TabsTrigger>
          <TabsTrigger value="educational">Educational Resources</TabsTrigger>
        </TabsList>
        
        {/* Software Tools Tab */}
        <TabsContent value="software">
          <div className="mb-6 flex items-center space-x-4">
            <Input
              type="text"
              placeholder="Search software..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="flex-1"
            />
            <Select value={categoryFilter} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {[...new Set(softwareData.software.map((software) => software.category))].map(
                  (category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSoftware.map((software) => (
              <Card key={software.id} className="bg-white dark:bg-gray-800 shadow-md rounded-md hover:scale-105 transition-transform duration-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">{software.name}</CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400">{software.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{software.description.substring(0, 100)}...</p>
                  <div className="flex items-center gap-2 mt-2">
                    {software.price === "Free" ? (
                      <Badge className="bg-green-600">Free</Badge>
                    ) : (
                      <Badge className="bg-blue-600">{software.price}</Badge>
                    )}
                    {software.openSource && (
                      <Badge className="bg-orange-600">Open Source</Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <Info className="h-4 w-4" />
                    {software.rating || "N/A"} ({software.votes || 0} votes)
                  </div>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Learn More
                    </Button>
                  </DialogTrigger>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {/* Software detail dialog */}
          {selectedSoftware && (
            <Dialog open={!!selectedSoftware} onOpenChange={(open) => !open && setSelectedSoftware(null)}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                  <DialogTitle className="text-2xl">{selectedSoftware.name}</DialogTitle>
                  <DialogDescription>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{selectedSoftware.category}</Badge>
                      {selectedSoftware.price === "Free" ? (
                        <Badge className="bg-green-600">Free</Badge>
                      ) : (
                        <Badge className="bg-blue-600">{selectedSoftware.price}</Badge>
                      )}
                      {selectedSoftware.openSource && (
                        <Badge className="bg-orange-600">Open Source</Badge>
                      )}
                    </div>
                  </DialogDescription>
                </DialogHeader>
                
                <ScrollArea className="flex-1 -mx-6 px-6">
                  <div className="space-y-4 mb-4">
                    <div>
                      <h3 className="font-medium">Description</h3>
                      <p className="text-gray-700 dark:text-gray-300 mt-1">{selectedSoftware.description}</p>
                    </div>
                    
                    {selectedSoftware.features && (
                      <div>
                        <h3 className="font-medium">Key Features</h3>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          {selectedSoftware.features.map((feature, index) => (
                            <li key={index} className="text-gray-700 dark:text-gray-300">{feature}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Render the appropriate interface based on the software category */}
                    {renderSoftwareInterface(selectedSoftware)}
                  </div>
                </ScrollArea>
                
                <DialogFooter className="border-t pt-4 mt-4">
                  <div className="flex w-full justify-between items-center">
                    <div className="flex items-center gap-2">
                      {selectedSoftware.website && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={selectedSoftware.website} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Visit Website
                          </a>
                        </Button>
                      )}
                      {selectedSoftware.openSource && selectedSoftware.repository && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={selectedSoftware.repository} target="_blank" rel="noopener noreferrer">
                            <Github className="h-4 w-4 mr-1" />
                            Source Code
                          </a>
                        </Button>
                      )}
                    </div>
                    <Button variant="outline" onClick={() => setSelectedSoftware(null)}>
                      Close
                    </Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </TabsContent>
        
        {/* Educational Resources Tab */}
        <TabsContent value="educational">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {softwareData.educationalResources.map((resource) => (
              <Card key={resource.id} className="bg-white dark:bg-gray-800 shadow-md rounded-md">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">{resource.title}</CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400">{resource.type}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{resource.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {resource.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" asChild>
                    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                      <Book className="h-4 w-4 mr-1" />
                      View Resource
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SoftwareTools;
