
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Book, BookOpen, Code, Database, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Documentation: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Documentation</h1>
          <p className="text-muted-foreground">
            Comprehensive guides and references for ChemFlow
          </p>
        </div>
        <Button variant="outline" className="flex items-center">
          <FileText className="mr-2 h-4 w-4" />
          Download All Docs
        </Button>
      </div>

      <Tabs defaultValue="guides" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="guides">User Guides</TabsTrigger>
          <TabsTrigger value="references">API References</TabsTrigger>
          <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
        </TabsList>

        <TabsContent value="guides" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DocCard 
              icon={<Book className="h-6 w-6 text-blue-500" />}
              title="Getting Started"
              description="Learn the basics of ChemFlow and set up your first project"
            />
            <DocCard 
              icon={<FlaskConical className="h-6 w-6 text-purple-500" />}
              title="Simulation Basics"
              description="Understand the core concepts of process simulation"
            />
            <DocCard 
              icon={<Database className="h-6 w-6 text-green-500" />}
              title="Working with Data"
              description="Import, export, and manage your simulation data"
            />
            <DocCard 
              icon={<Code className="h-6 w-6 text-red-500" />}
              title="Advanced Features"
              description="Explore advanced capabilities and customizations"
            />
            <DocCard 
              icon={<BookOpen className="h-6 w-6 text-amber-500" />}
              title="Best Practices"
              description="Tips and best practices for efficient simulations"
            />
            <DocCard 
              icon={<FileText className="h-6 w-6 text-cyan-500" />}
              title="Troubleshooting"
              description="Common issues and how to resolve them"
            />
          </div>
        </TabsContent>

        <TabsContent value="references" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DocCard 
              icon={<Code className="h-6 w-6 text-indigo-500" />}
              title="Component API"
              description="Reference for all component properties and methods"
            />
            <DocCard 
              icon={<Database className="h-6 w-6 text-emerald-500" />}
              title="Database Schema"
              description="Database structure and relationships"
            />
            <DocCard 
              icon={<FileText className="h-6 w-6 text-orange-500" />}
              title="Configuration Options"
              description="All available configuration settings explained"
            />
          </div>
        </TabsContent>

        <TabsContent value="tutorials" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DocCard 
              icon={<BookOpen className="h-6 w-6 text-blue-500" />}
              title="Distillation Column Setup"
              description="Step-by-step guide to model a distillation column"
            />
            <DocCard 
              icon={<BookOpen className="h-6 w-6 text-purple-500" />}
              title="Heat Exchanger Network"
              description="Building and optimizing heat exchanger networks"
            />
            <DocCard 
              icon={<BookOpen className="h-6 w-6 text-green-500" />}
              title="Reactor Modeling"
              description="Configuring different reactor types and kinetics"
            />
          </div>
        </TabsContent>

        <TabsContent value="examples" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DocCard 
              icon={<FileText className="h-6 w-6 text-blue-500" />}
              title="Ammonia Production"
              description="Complete ammonia synthesis process simulation"
            />
            <DocCard 
              icon={<FileText className="h-6 w-6 text-purple-500" />}
              title="Oil Refinery"
              description="Crude oil distillation and downstream processing"
            />
            <DocCard 
              icon={<FileText className="h-6 w-6 text-green-500" />}
              title="Ethylene Plant"
              description="Steam cracking process for ethylene production"
            />
            <DocCard 
              icon={<FileText className="h-6 w-6 text-red-500" />}
              title="Water Treatment"
              description="Industrial wastewater treatment simulation"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface DocCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const DocCard: React.FC<DocCardProps> = ({ icon, title, description }) => {
  return (
    <Card className="hover:shadow-md transition-all duration-300">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="bg-blue-50 p-2 rounded-full">
          {icon}
        </div>
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <Button variant="outline" className="w-full text-sm">
          Read Documentation
        </Button>
      </CardContent>
    </Card>
  );
};

export default Documentation;
