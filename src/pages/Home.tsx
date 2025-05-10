
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ChemAssistant from "@/components/ai/ChemAssistant";

const Home: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">Welcome to ChemFlow</h1>
        <p className="text-xl text-muted-foreground">Chemical Engineering Simulation & Tools</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Process Simulation</CardTitle>
            <CardDescription>Build and analyze chemical processes</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Create dynamic simulations with our visual flowsheet builder</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/create-simulation">Start Simulating</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Chemical Formulas</CardTitle>
            <CardDescription>Access important chemical engineering formulas</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Find and use key equations for your calculations</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link to="/chemical-formulas">View Formulas</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Unit Converter</CardTitle>
            <CardDescription>Convert between different engineering units</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Easily convert between common chemical engineering units</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link to="/unit-converter">Convert Units</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-12 bg-muted/50 p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-4">Need Assistance?</h2>
        <div className="h-[400px]">
          <ChemAssistant />
        </div>
      </div>
    </div>
  );
};

export default Home;
