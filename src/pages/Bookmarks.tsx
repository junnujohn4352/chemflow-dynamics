
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bookmark, Search, Star, Calendar, Tag, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Bookmarks: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Bookmarks</h1>
          <p className="text-muted-foreground">
            Access your saved formulas, articles, and simulations
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              className="pl-10" 
              placeholder="Search bookmarks..." 
            />
          </div>
          <Button variant="outline">
            <Tag className="h-4 w-4 mr-2" />
            Manage Tags
          </Button>
        </div>
      </div>

      <Tabs defaultValue="formulas" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="formulas">Formulas</TabsTrigger>
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="simulations">Simulations</TabsTrigger>
          <TabsTrigger value="all">All Bookmarks</TabsTrigger>
        </TabsList>

        <TabsContent value="formulas" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <BookmarkCard 
              title="Reynolds Number"
              description="Dimensionless number that predicts fluid flow patterns"
              tags={["Fluid Mechanics", "Dimensionless Numbers"]}
              date="2025-04-28"
              starred
            />
            <BookmarkCard 
              title="Bernoulli's Equation"
              description="Conservation of energy principle for fluid flow"
              tags={["Fluid Mechanics", "Conservation Laws"]}
              date="2025-04-25"
            />
            <BookmarkCard 
              title="Heat Transfer Coefficient"
              description="Overall heat transfer coefficient calculation"
              tags={["Heat Transfer", "Exchangers"]}
              date="2025-04-20"
              starred
            />
            <BookmarkCard 
              title="Fick's Law of Diffusion"
              description="Rate of diffusion calculation for mass transfer"
              tags={["Mass Transfer", "Diffusion"]}
              date="2025-04-15"
            />
            <BookmarkCard 
              title="Raoult's Law"
              description="Vapor pressure of ideal mixtures"
              tags={["Thermodynamics", "VLE"]}
              date="2025-04-10"
            />
          </div>
        </TabsContent>

        <TabsContent value="articles" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <BookmarkCard 
              title="Advanced Distillation Techniques"
              description="Modern approaches to distillation column design"
              tags={["Separation", "Design"]}
              date="2025-05-01"
            />
            <BookmarkCard 
              title="Heat Exchanger Network Optimization"
              description="Pinch analysis for heat exchanger networks"
              tags={["Heat Transfer", "Optimization"]}
              date="2025-04-28"
              starred
            />
            <BookmarkCard 
              title="Reactor Design Fundamentals"
              description="Principles of chemical reactor design and analysis"
              tags={["Reactors", "Kinetics"]}
              date="2025-04-20"
            />
          </div>
        </TabsContent>

        <TabsContent value="simulations" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <BookmarkCard 
              title="Ammonia Plant Simulation"
              description="Complete ammonia synthesis process flow diagram"
              tags={["Ammonia", "Synthesis"]}
              date="2025-05-05"
              starred
            />
            <BookmarkCard 
              title="Distillation Column: Ethanol-Water"
              description="Separation of ethanol-water azeotropic mixture"
              tags={["Distillation", "Azeotropes"]}
              date="2025-04-25"
            />
            <BookmarkCard 
              title="Heat Exchanger Network"
              description="Optimized shell and tube heat exchanger system"
              tags={["Heat Transfer", "Network"]}
              date="2025-04-15"
            />
          </div>
        </TabsContent>

        <TabsContent value="all" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <BookmarkCard 
              title="Reynolds Number"
              description="Dimensionless number that predicts fluid flow patterns"
              tags={["Formula", "Fluid Mechanics"]}
              date="2025-04-28"
              starred
            />
            <BookmarkCard 
              title="Advanced Distillation Techniques"
              description="Modern approaches to distillation column design"
              tags={["Article", "Separation"]}
              date="2025-05-01"
            />
            <BookmarkCard 
              title="Ammonia Plant Simulation"
              description="Complete ammonia synthesis process flow diagram"
              tags={["Simulation", "Ammonia"]}
              date="2025-05-05"
              starred
            />
            <BookmarkCard 
              title="Heat Transfer Coefficient"
              description="Overall heat transfer coefficient calculation"
              tags={["Formula", "Heat Transfer"]}
              date="2025-04-20"
              starred
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface BookmarkCardProps {
  title: string;
  description: string;
  tags: string[];
  date: string;
  starred?: boolean;
}

const BookmarkCard: React.FC<BookmarkCardProps> = ({ title, description, tags, date, starred }) => {
  return (
    <Card className="hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="flex space-x-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              {starred ? 
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /> : 
                <Star className="h-4 w-4" />
              }
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center text-xs text-muted-foreground">
          <Bookmark className="h-3 w-3 mr-1" />
          <span>Saved on </span>
          <span className="ml-1 flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {date}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default Bookmarks;
