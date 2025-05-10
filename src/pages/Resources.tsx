
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Play, Download, FileText, BookMarked, GraduationCap, Check, Star } from "lucide-react";

const Resources: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Learning Resources</h1>
          <p className="text-muted-foreground">
            Educational materials for chemical engineering students and professionals
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <GraduationCap className="mr-2 h-4 w-4" />
            My Learning Path
          </Button>
          <Button>
            <BookMarked className="mr-2 h-4 w-4" />
            Explore All Resources
          </Button>
        </div>
      </div>

      <Tabs defaultValue="textbooks" className="w-full">
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="textbooks">Textbooks</TabsTrigger>
          <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
          <TabsTrigger value="practice">Practice Problems</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          <TabsTrigger value="videos">Video Lessons</TabsTrigger>
        </TabsList>

        <TabsContent value="textbooks" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ResourceCard 
              title="Principles of Chemical Engineering Processes"
              description="Material and energy balances with applications to engineering problems"
              type="Textbook"
              rating={4.8}
              difficulty="Beginner"
              tags={["Material Balance", "Energy Balance", "Fundamentals"]}
              buttonText="Read Online"
              buttonIcon={<BookOpen className="h-4 w-4" />}
            />
            <ResourceCard 
              title="Transport Phenomena"
              description="Comprehensive coverage of momentum, heat, and mass transfer principles"
              type="Textbook"
              rating={4.9}
              difficulty="Advanced"
              tags={["Transport", "Fluid Mechanics", "Heat Transfer", "Mass Transfer"]}
              buttonText="Read Online"
              buttonIcon={<BookOpen className="h-4 w-4" />}
            />
            <ResourceCard 
              title="Chemical Reaction Engineering"
              description="Design and operation of chemical reactors with kinetics fundamentals"
              type="Textbook"
              rating={4.7}
              difficulty="Intermediate"
              tags={["Reactor Design", "Kinetics", "Catalysis"]}
              buttonText="Read Online"
              buttonIcon={<BookOpen className="h-4 w-4" />}
            />
            <ResourceCard 
              title="Separation Process Principles"
              description="Fundamental concepts and applications of modern separation techniques"
              type="Textbook"
              rating={4.5}
              difficulty="Intermediate"
              tags={["Distillation", "Extraction", "Absorption", "Membranes"]}
              buttonText="Read Online"
              buttonIcon={<BookOpen className="h-4 w-4" />}
            />
            <ResourceCard 
              title="Process Dynamics and Control"
              description="Analysis of dynamic processes and design of control systems"
              type="Textbook"
              rating={4.6}
              difficulty="Advanced"
              tags={["Control Theory", "Feedback", "PID", "Stability"]}
              buttonText="Read Online"
              buttonIcon={<BookOpen className="h-4 w-4" />}
            />
          </div>
        </TabsContent>

        <TabsContent value="tutorials" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ResourceCard 
              title="Mass Balance Fundamentals"
              description="Step-by-step tutorial on solving material balance problems"
              type="Tutorial"
              rating={4.7}
              difficulty="Beginner"
              tags={["Mass Balance", "Fundamentals"]}
              buttonText="Start Tutorial"
              buttonIcon={<Play className="h-4 w-4" />}
            />
            <ResourceCard 
              title="Heat Exchanger Design"
              description="Complete guide to sizing and designing heat exchangers"
              type="Tutorial"
              rating={4.6}
              difficulty="Intermediate"
              tags={["Heat Transfer", "Equipment Design"]}
              buttonText="Start Tutorial"
              buttonIcon={<Play className="h-4 w-4" />}
            />
            <ResourceCard 
              title="Distillation Column Sizing"
              description="How to determine the number of stages and column dimensions"
              type="Tutorial"
              rating={4.8}
              difficulty="Advanced"
              tags={["Separation", "VLE", "Column Design"]}
              buttonText="Start Tutorial"
              buttonIcon={<Play className="h-4 w-4" />}
            />
          </div>
        </TabsContent>

        <TabsContent value="practice" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ResourceCard 
              title="Material & Energy Balances"
              description="150 practice problems with detailed solutions"
              type="Problems"
              rating={4.9}
              difficulty="Mixed"
              tags={["Material Balance", "Energy Balance", "Practice"]}
              buttonText="Download PDF"
              buttonIcon={<Download className="h-4 w-4" />}
            />
            <ResourceCard 
              title="Fluid Mechanics Problems"
              description="Practice problems on fluid flow, pumps, and pressure drop"
              type="Problems"
              rating={4.7}
              difficulty="Intermediate"
              tags={["Fluid Mechanics", "Practice"]}
              buttonText="Download PDF"
              buttonIcon={<Download className="h-4 w-4" />}
            />
            <ResourceCard 
              title="Thermodynamics Exercises"
              description="Problem sets on thermodynamic properties and cycles"
              type="Problems"
              rating={4.6}
              difficulty="Advanced"
              tags={["Thermodynamics", "Practice"]}
              buttonText="Download PDF"
              buttonIcon={<Download className="h-4 w-4" />}
            />
          </div>
        </TabsContent>

        <TabsContent value="quizzes" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ResourceCard 
              title="Fundamentals of Mass Transfer"
              description="Quiz covering diffusion, convection, and mass transfer operations"
              type="Quiz"
              rating={4.5}
              difficulty="Intermediate"
              tags={["Mass Transfer", "Assessment"]}
              buttonText="Start Quiz"
              buttonIcon={<Check className="h-4 w-4" />}
            />
            <ResourceCard 
              title="Chemical Equilibrium"
              description="Test your knowledge on reaction equilibrium and kinetics"
              type="Quiz"
              rating={4.7}
              difficulty="Intermediate"
              tags={["Thermodynamics", "Kinetics", "Assessment"]}
              buttonText="Start Quiz"
              buttonIcon={<Check className="h-4 w-4" />}
            />
            <ResourceCard 
              title="Process Control Fundamentals"
              description="Quiz on feedback control, stability, and PID controllers"
              type="Quiz"
              rating={4.6}
              difficulty="Advanced"
              tags={["Control", "Feedback", "Assessment"]}
              buttonText="Start Quiz"
              buttonIcon={<Check className="h-4 w-4" />}
            />
          </div>
        </TabsContent>

        <TabsContent value="videos" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ResourceCard 
              title="Introduction to ChemFlow"
              description="Learn the basics of using ChemFlow for process simulation"
              type="Video"
              rating={4.9}
              difficulty="Beginner"
              tags={["Tutorial", "ChemFlow", "Basics"]}
              buttonText="Watch Video"
              buttonIcon={<Play className="h-4 w-4" />}
            />
            <ResourceCard 
              title="Advanced Reactor Modeling"
              description="In-depth video course on reactor simulation techniques"
              type="Video Series"
              rating={4.8}
              difficulty="Advanced"
              tags={["Reactors", "Modeling", "Tutorial"]}
              buttonText="Watch Series"
              buttonIcon={<Play className="h-4 w-4" />}
            />
            <ResourceCard 
              title="VLE Calculations Explained"
              description="Visual explanation of vapor-liquid equilibrium calculations"
              type="Video"
              rating={4.7}
              difficulty="Intermediate"
              tags={["Thermodynamics", "VLE", "Tutorial"]}
              buttonText="Watch Video"
              buttonIcon={<Play className="h-4 w-4" />}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface ResourceCardProps {
  title: string;
  description: string;
  type: string;
  rating: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Mixed';
  tags: string[];
  buttonText: string;
  buttonIcon: React.ReactNode;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ 
  title, 
  description, 
  type, 
  rating, 
  difficulty, 
  tags,
  buttonText,
  buttonIcon
}) => {
  const getDifficultyColor = () => {
    switch(difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-600';
      case 'Intermediate': return 'bg-amber-100 text-amber-600';
      case 'Advanced': return 'bg-red-100 text-red-600';
      default: return 'bg-blue-100 text-blue-600';
    }
  };

  return (
    <Card className="hover:shadow-md transition-all duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <Badge variant="secondary" className="mb-2">{type}</Badge>
          <Badge className={`${getDifficultyColor()}`}>{difficulty}</Badge>
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center text-sm text-amber-500">
          <Star className="h-4 w-4 fill-amber-500 mr-1" />
          <span>{rating}</span>
          <span className="text-muted-foreground text-xs ml-1">/5.0</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full gap-2">
          {buttonIcon}
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Resources;
