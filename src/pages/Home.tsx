
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import OpenSourceAI from "@/components/ai/OpenSourceAI";
import { Beaker, Calculator, BookOpen, Atom, Globe, Zap, FileText, Bookmark, BarChart3, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Home: React.FC = () => {
  const { toast } = useToast();
  
  // Show welcome message once on initial load
  useEffect(() => {
    toast({
      title: "Welcome to ChemFlow",
      description: "Your open-source chemical engineering platform",
    });
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Welcome to ChemFlow</h1>
        <p className="text-xl text-muted-foreground">Open-Source Chemical Engineering Simulation & Tools</p>
        <div className="mt-4">
          <Button asChild variant="outline" className="hover-scale">
            <Link to="/" className="flex items-center justify-center">
              Visit Landing Page
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <div className="flex items-center mb-2">
              <Beaker className="h-6 w-6 text-blue-500 mr-2" />
              <CardTitle>Process Simulation</CardTitle>
            </div>
            <CardDescription>Build and analyze chemical processes</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Create dynamic simulations with our visual flowsheet builder</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full group">
              <Link to="/create-simulation" className="flex items-center justify-center">
                Start Simulating
                <Zap className="ml-2 h-4 w-4 transition-transform group-hover:scale-125" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <div className="flex items-center mb-2">
              <BookOpen className="h-6 w-6 text-purple-500 mr-2" />
              <CardTitle>Chemical Formulas</CardTitle>
            </div>
            <CardDescription>Access important chemical engineering formulas</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Find and use key equations for your calculations</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full group">
              <Link to="/chemical-formulas" className="flex items-center justify-center">
                View Formulas
                <Atom className="ml-2 h-4 w-4 transition-transform group-hover:rotate-45" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <CardHeader>
            <div className="flex items-center mb-2">
              <Calculator className="h-6 w-6 text-green-500 mr-2" />
              <CardTitle>Unit Converter</CardTitle>
            </div>
            <CardDescription>Convert between different engineering units</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Easily convert between common chemical engineering units</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full group">
              <Link to="/unit-converter" className="flex items-center justify-center">
                Convert Units
                <Globe className="ml-2 h-4 w-4 transition-transform group-hover:rotate-180" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <CardHeader>
            <div className="flex items-center mb-2">
              <BookOpen className="h-6 w-6 text-blue-500 mr-2" />
              <CardTitle>Learning Resources</CardTitle>
            </div>
            <CardDescription>Educational materials for chemical engineering</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Access textbooks, tutorials, practice problems, and quizzes</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full group">
              <Link to="/resources" className="flex items-center justify-center">
                Browse Resources
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <CardHeader>
            <div className="flex items-center mb-2">
              <Bookmark className="h-6 w-6 text-purple-500 mr-2" />
              <CardTitle>My Bookmarks</CardTitle>
            </div>
            <CardDescription>Save and organize your favorite resources</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Quickly access your saved formulas, articles, and simulations</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full group">
              <Link to="/bookmarks" className="flex items-center justify-center">
                View Bookmarks
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <CardHeader>
            <div className="flex items-center mb-2">
              <BarChart3 className="h-6 w-6 text-green-500 mr-2" />
              <CardTitle>Data Analysis</CardTitle>
            </div>
            <CardDescription>Process data visualization and analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Visualize and analyze chemical engineering data with powerful charts</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full group">
              <Link to="/data-analysis" className="flex items-center justify-center">
                Open Analysis Tools
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{ animationDelay: '0.7s' }}>
          <CardHeader>
            <div className="flex items-center mb-2">
              <FileText className="h-6 w-6 text-orange-500 mr-2" />
              <CardTitle>My Reports</CardTitle>
            </div>
            <CardDescription>Access and manage your simulation reports</CardDescription>
          </CardHeader>
          <CardContent>
            <p>View, download, and share your previous simulation results</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full group">
              <Link to="/reports" className="flex items-center justify-center">
                View Reports
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-12 bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl shadow-sm animate-fade-in" style={{ animationDelay: '0.8s' }}>
        <h2 className="text-2xl font-bold mb-4 text-blue-700">Open-Source AI Assistant</h2>
        <div className="h-[400px] relative overflow-hidden rounded-lg border">
          <OpenSourceAI />
        </div>
      </div>
    </div>
  );
};

export default Home;
