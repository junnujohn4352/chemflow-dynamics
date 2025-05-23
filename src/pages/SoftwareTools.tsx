
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, ExternalLink, Github, Info, Play, BookOpenText } from "lucide-react";

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

import { softwareDatabase } from "@/data/softwareDatabase";
import { Software, SoftwareType } from "@/types/software";
import { useToast } from "@/components/ui/use-toast";

const SoftwareTools: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedSoftware, setSelectedSoftware] = useState<Software | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const filteredSoftware = softwareDatabase.software.filter((software) => {
    const searchRegex = new RegExp(searchTerm, "i");
    const categoryMatch = categoryFilter === "all" || software.category === categoryFilter;
    const typeMatch = typeFilter === "all" || software.type === typeFilter;
    return searchRegex.test(software.name) && categoryMatch && typeMatch;
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
  };

  const handleTypeChange = (value: string) => {
    setTypeFilter(value);
  };

  const handleShowExplanation = (software: Software) => {
    setSelectedSoftware(software);
    setShowExplanation(true);
    toast({
      title: `${software.name}`,
      description: "Opening detailed explanation...",
      duration: 3000,
    });
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
      case "Laboratory & Data Analysis":
        return <DataAnalysisInterface software={selectedSoftware} />;
      case "Miscellaneous Tools":
        return <MiscellaneousToolsInterface software={selectedSoftware} />;
      default:
        return <div className="p-4">No specific interface available for {selectedSoftware.name}</div>;
    }
  };

  const renderSoftwareExplanation = (software: Software) => {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-2">What is {software.name}?</h3>
          <p className="text-gray-700 dark:text-gray-300">{software.description}</p>
        </div>
        
        {software.features && software.features.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-2">Key Capabilities</h3>
            <ul className="list-disc list-inside space-y-1">
              {software.features.map((feature, index) => (
                <li key={index} className="text-gray-700 dark:text-gray-300">{feature}</li>
              ))}
            </ul>
          </div>
        )}

        {software.usedIn && software.usedIn.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-2">Industry Applications</h3>
            <div className="flex flex-wrap gap-2">
              {software.usedIn.map((industry, index) => (
                <Badge key={index} variant="outline" className="text-sm">{industry}</Badge>
              ))}
            </div>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              {software.name} is widely used in the above industries for solving complex engineering problems, 
              optimizing processes, and making data-driven decisions.
            </p>
          </div>
        )}

        <div>
          <h3 className="text-xl font-semibold mb-2">Technical Specifications</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="border rounded p-2">
              <span className="text-gray-600 text-sm">License Type:</span>
              <div className="font-medium">{software.price === "Free" ? "Free" : software.price === "Freemium" ? "Freemium (Basic features free, advanced paid)" : "Commercial"}</div>
            </div>
            <div className="border rounded p-2">
              <span className="text-gray-600 text-sm">Open Source:</span>
              <div className="font-medium">{software.openSource ? "Yes" : "No"}</div>
            </div>
            <div className="border rounded p-2">
              <span className="text-gray-600 text-sm">Platform:</span>
              <div className="font-medium">{software.localApp ? "Local Application & Web Interface" : "Web-based"}</div>
            </div>
            <div className="border rounded p-2">
              <span className="text-gray-600 text-sm">User Rating:</span>
              <div className="font-medium">{software.rating || "N/A"} ({software.votes || 0} reviews)</div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">How It Works</h3>
          <p className="text-gray-700 dark:text-gray-300">
            {software.name} operates by {software.category === "Process Simulation" ? 
              "creating a digital twin of your chemical process, allowing you to test different scenarios and optimize without physical prototyping." : 
              software.category === "Thermodynamic Properties" ? 
              "utilizing advanced equations of state and property methods to accurately predict the behavior of chemicals under various conditions." :
              software.category === "Reaction Engineering" ?
              "modeling reaction kinetics, heat transfer, and mass transfer phenomena to simulate chemical reactors and reaction systems." :
              software.category === "Data Analysis" ?
              "leveraging statistical methods and machine learning algorithms to extract insights from large datasets collected during experiments or process operations." :
              software.category === "Process Control" ?
              "implementing control algorithms that continuously monitor process variables and make adjustments to maintain desired operating conditions." :
              software.category === "Piping Design" ?
              "applying fluid mechanics principles to design efficient piping systems that meet safety standards and operational requirements." :
              software.category === "Equipment Design" ?
              "using engineering fundamentals to size and design process equipment such as heat exchangers, columns, and vessels." :
              software.category === "Environmental & Safety" ?
              "assessing environmental impacts and safety risks of chemical processes through sophisticated modeling and analysis techniques." :
              software.category === "CFD & Transport Phenomena" ?
              "solving the complex equations governing fluid flow, heat transfer, and mass transfer using numerical methods and computational fluid dynamics." :
              software.category === "Chemical Database" ?
              "providing access to comprehensive databases of chemical properties, allowing engineers to quickly retrieve reliable data for their calculations." :
              "integrating various chemical engineering tools and utilities to streamline workflows and solve specific problems."
            }
          </p>
          
          <p className="mt-3 text-gray-700 dark:text-gray-300">
            The software utilizes {software.openSource ? "open-source algorithms that are continuously improved by the community" : "proprietary algorithms developed by expert chemical engineers"} 
            to ensure accurate results and reliable performance.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">Getting Started</h3>
          <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 dark:bg-blue-900/20">
            <p className="text-gray-700 dark:text-gray-300">
              To begin using {software.name}, you would typically follow these steps:
            </p>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Install the software or access the web platform</li>
              <li>Set up your project parameters and input data</li>
              <li>Configure the specific analysis or simulation settings</li>
              <li>Run the calculation or simulation process</li>
              <li>Analyze results and generate reports</li>
            </ol>
          </div>
        </div>
      </div>
    );
  };

  // Get unique software types
  const softwareTypes = Array.from(new Set(softwareDatabase.software.map(software => software.type)));

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">ChemLab Software Collection</h1>
      
      <div className="mb-6 space-y-4">
        <Input
          type="text"
          placeholder="Search software..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full"
        />

        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Select value={typeFilter} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {softwareTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <Select value={categoryFilter} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {[...new Set(softwareDatabase.software.map((software) => software.category))].map(
                  (category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {typeFilter !== "all" && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-3">{typeFilter}</h2>
          <p className="text-gray-600 mb-4">
            {typeFilter.startsWith("Type 1") && "Tools that simulate the behavior of chemical processes in steady-state or dynamic conditions, helping engineers design, optimize, and analyze systems before implementation."}
            {typeFilter.startsWith("Type 2") && "Tools that help in estimating thermodynamic properties (enthalpy, entropy, fugacity, etc.), phase equilibria, and physical/chemical properties of pure components and mixtures."}
            {typeFilter.startsWith("Type 3") && "Tools that help chemical engineers design, size, and analyze equipment such as reactors, heat exchangers, distillation columns, and absorbers."}
            {typeFilter.startsWith("Type 4") && "Tools used to monitor, control, optimize, and automate chemical processes to ensure safety, efficiency, cost-effectiveness, and quality in operations."}
            {typeFilter.startsWith("Type 5") && "Tools that support research, product development, lab-scale simulation, data interpretation, statistical modeling, and lab automation."}
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSoftware.map((software) => (
          <Card key={software.id} className="bg-white dark:bg-gray-800 shadow-md rounded-md hover:scale-105 transition-transform duration-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">{software.name}</CardTitle>
              <CardDescription>
                <div className="flex flex-wrap gap-1 mt-1">
                  <Badge variant="outline">{software.category}</Badge>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{software.description.substring(0, 100)}...</p>
              <div className="flex items-center gap-2 mt-2">
                {software.localApp && (
                  <Badge className="bg-green-600">ChemLab App</Badge>
                )}
                {software.price === "Free" ? (
                  <Badge className="bg-blue-600">Free</Badge>
                ) : software.price === "Freemium" ? (
                  <Badge className="bg-teal-600">Freemium</Badge>
                ) : (
                  <Badge className="bg-purple-600">{software.price}</Badge>
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
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={() => handleShowExplanation(software)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <BookOpenText className="h-4 w-4 mr-1" />
                    Detailed Explanation
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                  <DialogHeader>
                    <DialogTitle className="text-2xl">{selectedSoftware?.name}</DialogTitle>
                    <DialogDescription>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge variant="outline">{selectedSoftware?.category}</Badge>
                        <Badge variant="secondary">{selectedSoftware?.type}</Badge>
                        {selectedSoftware?.localApp && (
                          <Badge className="bg-green-600">ChemLab App</Badge>
                        )}
                        {selectedSoftware?.price === "Free" ? (
                          <Badge className="bg-blue-600">Free</Badge>
                        ) : selectedSoftware?.price === "Freemium" ? (
                          <Badge className="bg-teal-600">Freemium</Badge>
                        ) : (
                          <Badge className="bg-purple-600">{selectedSoftware?.price}</Badge>
                        )}
                        {selectedSoftware?.openSource && (
                          <Badge className="bg-orange-600">Open Source</Badge>
                        )}
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                  
                  <ScrollArea className="flex-1 -mx-6 px-6">
                    {selectedSoftware && showExplanation ? (
                      renderSoftwareExplanation(selectedSoftware)
                    ) : (
                      selectedSoftware && renderSoftwareInterface(selectedSoftware)
                    )}
                  </ScrollArea>
                  
                  <DialogFooter className="border-t pt-4 mt-4">
                    <div className="flex w-full justify-between items-center">
                      <div className="flex items-center gap-2">
                        {selectedSoftware?.website && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={selectedSoftware.website} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Visit Website
                            </a>
                          </Button>
                        )}
                        {selectedSoftware?.openSource && selectedSoftware?.repository && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={selectedSoftware.repository} target="_blank" rel="noopener noreferrer">
                              <Github className="h-4 w-4 mr-1" />
                              Source Code
                            </a>
                          </Button>
                        )}
                      </div>
                      <Button variant="outline" onClick={() => {
                        setSelectedSoftware(null);
                        setShowExplanation(false);
                      }}>
                        Close
                      </Button>
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredSoftware.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium mb-2">No matching software found</h3>
          <p className="text-gray-500">Try changing your search terms or filters</p>
        </div>
      )}
    </div>
  );
};

export default SoftwareTools;
