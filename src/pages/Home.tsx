
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import OpenSourceAI from "@/components/ai/OpenSourceAI";
import { Beaker, Calculator, BookOpen, Atom, Globe, Zap, FileText, Bookmark, BarChart3, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Home: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Check authentication status and redirect if not logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to access resources",
          variant: "destructive",
        });
        navigate('/auth');
      } else {
        // Show welcome message once on initial load
        toast({
          title: "Welcome to ChemFlow",
          description: "Your open-source chemical engineering platform",
          variant: "default",
        });
      }
    };
    
    checkAuth();
  }, [navigate, toast]);
  
  return (
    <div className="container mx-auto px-4 py-8 relative overflow-hidden">
      {/* Enhanced 3D background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-float"></div>
        <div className="absolute top-40 -left-20 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float-reverse" style={{ animationDelay: "3s" }}></div>
        <div className="absolute bottom-40 right-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-float" style={{ animationDelay: "5s" }}></div>
        <div className="absolute bottom-20 left-1/3 w-48 h-48 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float-reverse" style={{ animationDelay: "8s" }}></div>
      </div>

      <div className="absolute top-20 left-1/4 w-20 h-20 border-2 border-blue-300/30 rounded-lg rotate-12 animate-spin-slow opacity-70"></div>
      <div className="absolute bottom-40 right-1/4 w-16 h-16 border-2 border-purple-300/30 rounded-full animate-spin-slow opacity-70" style={{ animationDelay: "7s" }}></div>
      <div className="absolute top-60 right-1/3 w-24 h-24 border-2 border-pink-300/30 rounded-lg -rotate-12 animate-spin-slow opacity-70" style={{ animationDelay: "15s", animationDirection: "reverse" }}></div>
      
      <div className="text-center mb-12 animate-fade-in relative">
        <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 animate-fade-in-up">Welcome to ChemFlow</h1>
        <p className="text-xl text-muted-foreground animate-fade-in-up" style={{ animationDelay: "0.2s" }}>Open-Source Chemical Engineering Simulation & Tools</p>
        
        <div className="absolute -z-10 inset-x-0 top-1/2 transform -translate-y-1/2 flex justify-center opacity-20 pointer-events-none">
          <div className="w-40 h-40 rounded-full border-4 border-blue-500/40 animate-pulse-subtle"></div>
          <div className="w-60 h-60 rounded-full border-4 border-purple-500/30 animate-pulse-subtle" style={{ animationDelay: "1s" }}></div>
          <div className="w-80 h-80 rounded-full border-4 border-pink-500/20 animate-pulse-subtle" style={{ animationDelay: "2s" }}></div>
        </div>
        
        <div className="mt-4">
          <Button asChild variant="outline" className="hover-scale animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Link to="/" className="flex items-center justify-center">
              Visit Landing Page
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 relative">
        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-scale-in" style={{ animationDelay: '0.1s' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100/30 rounded-xl -z-10"></div>
          <CardHeader>
            <div className="flex items-center mb-2">
              <div className="p-2 rounded-full bg-blue-100 mr-2">
                <Beaker className="h-6 w-6 text-blue-500 animate-bounce-subtle" style={{ animationDuration: '3s' }} />
              </div>
              <CardTitle>Process Simulation</CardTitle>
            </div>
            <CardDescription>Build and analyze chemical processes</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Create dynamic simulations with our visual flowsheet builder</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full group bg-gradient-to-r from-blue-500 to-blue-600">
              <Link to="/create-simulation" className="flex items-center justify-center">
                Start Simulating
                <Zap className="ml-2 h-4 w-4 transition-transform group-hover:scale-125" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-scale-in" style={{ animationDelay: '0.2s' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-purple-100/30 rounded-xl -z-10"></div>
          <CardHeader>
            <div className="flex items-center mb-2">
              <div className="p-2 rounded-full bg-purple-100 mr-2">
                <BookOpen className="h-6 w-6 text-purple-500 animate-bounce-subtle" style={{ animationDuration: '4s', animationDelay: '0.5s' }} />
              </div>
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
        
        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-scale-in" style={{ animationDelay: '0.3s' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100/30 rounded-xl -z-10"></div>
          <CardHeader>
            <div className="flex items-center mb-2">
              <div className="p-2 rounded-full bg-green-100 mr-2">
                <Calculator className="h-6 w-6 text-green-500 animate-bounce-subtle" style={{ animationDuration: '5s', animationDelay: '1s' }} />
              </div>
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
        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-scale-in" style={{ animationDelay: '0.4s' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-cyan-100/30 rounded-xl -z-10"></div>
          <CardHeader>
            <div className="flex items-center mb-2">
              <div className="p-2 rounded-full bg-cyan-100 mr-2">
                <BookOpen className="h-6 w-6 text-cyan-500 animate-bounce-subtle" style={{ animationDuration: '4.5s', animationDelay: '0.2s' }} />
              </div>
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
        
        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-scale-in" style={{ animationDelay: '0.5s' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-indigo-100/30 rounded-xl -z-10"></div>
          <CardHeader>
            <div className="flex items-center mb-2">
              <div className="p-2 rounded-full bg-indigo-100 mr-2">
                <Bookmark className="h-6 w-6 text-indigo-500 animate-bounce-subtle" style={{ animationDuration: '3.5s', animationDelay: '0.7s' }} />
              </div>
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
        
        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-scale-in" style={{ animationDelay: '0.6s' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-amber-100/30 rounded-xl -z-10"></div>
          <CardHeader>
            <div className="flex items-center mb-2">
              <div className="p-2 rounded-full bg-amber-100 mr-2">
                <BarChart3 className="h-6 w-6 text-amber-500 animate-bounce-subtle" style={{ animationDuration: '4s', animationDelay: '1.2s' }} />
              </div>
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
        
        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-scale-in" style={{ animationDelay: '0.7s' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-rose-50 to-rose-100/30 rounded-xl -z-10"></div>
          <CardHeader>
            <div className="flex items-center mb-2">
              <div className="p-2 rounded-full bg-rose-100 mr-2">
                <FileText className="h-6 w-6 text-rose-500 animate-bounce-subtle" style={{ animationDuration: '3s', animationDelay: '0.9s' }} />
              </div>
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

      <div className="mt-12 bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl shadow-sm animate-fade-in relative overflow-hidden" style={{ animationDelay: '0.8s' }}>
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        <div className="absolute -bottom-12 -left-12 w-24 h-24 rounded-full bg-blue-100 mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-purple-100 mix-blend-multiply filter blur-xl opacity-70 animate-float-reverse"></div>
        
        <h2 className="text-2xl font-bold mb-4 text-blue-700 relative z-10">Open-Source AI Assistant</h2>
        <div className="h-[400px] relative overflow-hidden rounded-lg border bg-white/80 backdrop-blur-sm">
          <OpenSourceAI />
        </div>
      </div>
    </div>
  );
};

export default Home;
