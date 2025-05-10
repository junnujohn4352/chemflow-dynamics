
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ChemAssistant from "@/components/ai/ChemAssistant";
import { Beaker, Calculator, BookOpen, Atom, Globe, Zap } from "lucide-react";

const Home: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">Welcome to ChemFlow</h1>
        <p className="text-xl text-muted-foreground">Chemical Engineering Simulation & Tools</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
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
        
        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
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
        
        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
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

      <div className="mt-12 bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl shadow-sm">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">Need Assistance?</h2>
        <div className="h-[400px] relative overflow-hidden rounded-lg border">
          <ChemAssistant />
        </div>
      </div>
    </div>
  );
};

export default Home;
