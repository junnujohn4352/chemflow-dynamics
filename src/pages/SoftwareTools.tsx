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

import { softwareDatabase } from "@/data/softwareDatabase";
import { Software, SoftwareType } from "@/types/software";

const SoftwareTools: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedSoftware, setSelectedSoftware] = useState<Software | null>(null);
  const [activeTab, setActiveTab] = useState<"software" | "educational">("software");

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

  // Get unique software types
  const softwareTypes = Array.from(new Set(softwareDatabase.software.map(software => software.type)));

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Chemical Engineering Digital Resources</h1>
      
      <Tabs defaultValue="software" className="mb-8" value={activeTab} onValueChange={(value) => setActiveTab(value as "software" | "educational")}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="software">Software Tools</TabsTrigger>
          <TabsTrigger value="educational">Educational Resources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="software">
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
                  <CardDescription className="text-gray-500 dark:text-gray-400">
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge variant="outline">{software.category}</Badge>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{software.description.substring(0, 100)}...</p>
                  <div className="flex items-center gap-2 mt-2">
                    {software.price === "Free" ? (
                      <Badge className="bg-green-600">Free</Badge>
                    ) : software.price === "Freemium" ? (
                      <Badge className="bg-teal-600">Freemium</Badge>
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
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedSoftware(software)}>
                        Learn More
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                      <DialogHeader>
                        <DialogTitle className="text-2xl">{software.name}</DialogTitle>
                        <DialogDescription>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <Badge variant="outline">{software.category}</Badge>
                            <Badge variant="secondary">{software.type}</Badge>
                            {software.price === "Free" ? (
                              <Badge className="bg-green-600">Free</Badge>
                            ) : software.price === "Freemium" ? (
                              <Badge className="bg-teal-600">Freemium</Badge>
                            ) : (
                              <Badge className="bg-blue-600">{software.price}</Badge>
                            )}
                            {software.openSource && (
                              <Badge className="bg-orange-600">Open Source</Badge>
                            )}
                          </div>
                        </DialogDescription>
                      </DialogHeader>
                      
                      <ScrollArea className="flex-1 -mx-6 px-6">
                        <div className="space-y-4 mb-4">
                          <div>
                            <h3 className="font-medium text-lg">Description</h3>
                            <p className="text-gray-700 dark:text-gray-300 mt-1">{software.description}</p>
                          </div>
                          
                          {software.usedIn && software.usedIn.length > 0 && (
                            <div>
                              <h3 className="font-medium text-lg">Used In</h3>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {software.usedIn.map((industry, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">{industry}</Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {software.features && software.features.length > 0 && (
                            <div>
                              <h3 className="font-medium text-lg">Key Features</h3>
                              <ul className="list-disc list-inside mt-1 space-y-1">
                                {software.features.map((feature, index) => (
                                  <li key={index} className="text-gray-700 dark:text-gray-300">{feature}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {renderSoftwareInterface(software)}
                        </div>
                      </ScrollArea>
                      
                      <DialogFooter className="border-t pt-4 mt-4">
                        <div className="flex w-full justify-between items-center">
                          <div className="flex items-center gap-2">
                            {software.website && (
                              <Button variant="outline" size="sm" asChild>
                                <a href={software.website} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4 mr-1" />
                                  Visit Website
                                </a>
                              </Button>
                            )}
                            {software.openSource && software.repository && (
                              <Button variant="outline" size="sm" asChild>
                                <a href={software.repository} target="_blank" rel="noopener noreferrer">
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
        </TabsContent>
        
        <TabsContent value="educational">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Educational Resources by Subject</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {softwareDatabase.educationalResources.map((resource) => (
                <Card key={resource.id} className="bg-white dark:bg-gray-800 shadow-md rounded-md">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">{resource.title}</CardTitle>
                    <CardDescription>
                      {resource.subject && (
                        <Badge variant="secondary" className="mb-2">
                          {resource.subject}
                        </Badge>
                      )}
                      {resource.platform && (
                        <Badge variant="outline" className="ml-2">
                          {resource.platform}
                        </Badge>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{resource.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {resource.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center"
                      >
                        {resource.platform === "YouTube" ? (
                          <>
                            <FileText className="h-4 w-4 mr-1" />
                            Watch Videos
                          </>
                        ) : (
                          <>
                            <Book className="h-4 w-4 mr-1" />
                            View Resource
                          </>
                        )}
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SoftwareTools;
