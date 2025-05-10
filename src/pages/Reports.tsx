
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Printer, Share2, Eye, Filter, Clock, Calendar } from "lucide-react";

const Reports: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Reports</h1>
          <p className="text-muted-foreground">
            Access and manage your simulation reports and analyses
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            New Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="recent" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="simulations">Simulation Reports</TabsTrigger>
          <TabsTrigger value="analysis">Analysis Reports</TabsTrigger>
          <TabsTrigger value="shared">Shared With Me</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="animate-fade-in">
          <div className="grid grid-cols-1 gap-4">
            <ReportCard 
              title="Reactor Performance Analysis"
              description="Detailed analysis of conversion rates and temperature profiles for CSTR reactor"
              date="2025-05-05"
              type="Analysis"
              tags={["Reactor", "Performance", "Kinetics"]}
            />
            <ReportCard 
              title="Distillation Column Optimization"
              description="Reflux ratio optimization study for ethanol-water separation column"
              date="2025-05-03"
              type="Simulation"
              tags={["Distillation", "Optimization", "Separation"]}
            />
            <ReportCard 
              title="Heat Exchanger Network Analysis"
              description="Energy efficiency assessment of plant heat exchanger network"
              date="2025-05-01"
              type="Analysis"
              tags={["Heat Transfer", "Energy", "Network"]}
            />
            <ReportCard 
              title="Ammonia Plant Flow Analysis"
              description="Complete process flow simulation for ammonia synthesis plant"
              date="2025-04-28"
              type="Simulation"
              tags={["Ammonia", "Process Flow", "Synthesis"]}
            />
            <ReportCard 
              title="Process Control Parameter Tuning"
              description="PID controller parameter optimization for reactor temperature control"
              date="2025-04-25"
              type="Analysis"
              tags={["Control", "PID", "Tuning"]}
            />
          </div>
        </TabsContent>

        <TabsContent value="simulations" className="animate-fade-in">
          <div className="grid grid-cols-1 gap-4">
            <ReportCard 
              title="Distillation Column Optimization"
              description="Reflux ratio optimization study for ethanol-water separation column"
              date="2025-05-03"
              type="Simulation"
              tags={["Distillation", "Optimization", "Separation"]}
            />
            <ReportCard 
              title="Ammonia Plant Flow Analysis"
              description="Complete process flow simulation for ammonia synthesis plant"
              date="2025-04-28"
              type="Simulation"
              tags={["Ammonia", "Process Flow", "Synthesis"]}
            />
            <ReportCard 
              title="Membrane Separation Model"
              description="Gas separation performance simulation for polymer membrane system"
              date="2025-04-20"
              type="Simulation"
              tags={["Membrane", "Separation", "Gas"]}
            />
            <ReportCard 
              title="Fluidized Bed Reactor Simulation"
              description="CFD analysis of particle flow patterns in fluidized bed reactor"
              date="2025-04-15"
              type="Simulation"
              tags={["Reactor", "CFD", "Fluid Dynamics"]}
            />
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="animate-fade-in">
          <div className="grid grid-cols-1 gap-4">
            <ReportCard 
              title="Reactor Performance Analysis"
              description="Detailed analysis of conversion rates and temperature profiles for CSTR reactor"
              date="2025-05-05"
              type="Analysis"
              tags={["Reactor", "Performance", "Kinetics"]}
            />
            <ReportCard 
              title="Heat Exchanger Network Analysis"
              description="Energy efficiency assessment of plant heat exchanger network"
              date="2025-05-01"
              type="Analysis"
              tags={["Heat Transfer", "Energy", "Network"]}
            />
            <ReportCard 
              title="Process Control Parameter Tuning"
              description="PID controller parameter optimization for reactor temperature control"
              date="2025-04-25"
              type="Analysis"
              tags={["Control", "PID", "Tuning"]}
            />
            <ReportCard 
              title="Thermodynamic Model Comparison"
              description="Comparative analysis of equation of state models for VLE prediction"
              date="2025-04-10"
              type="Analysis"
              tags={["Thermodynamics", "VLE", "Models"]}
            />
          </div>
        </TabsContent>

        <TabsContent value="shared" className="animate-fade-in">
          <div className="grid grid-cols-1 gap-4">
            <ReportCard 
              title="Plant-Wide Optimization Study"
              description="Complete optimization analysis of production facility"
              date="2025-05-04"
              type="Analysis"
              tags={["Optimization", "Plant-Wide", "Efficiency"]}
              shared="D. Harishwar"
            />
            <ReportCard 
              title="Safety Risk Assessment"
              description="Hazard analysis and risk assessment of chemical storage area"
              date="2025-04-22"
              type="Analysis"
              tags={["Safety", "Risk", "Hazard"]}
              shared="P. Janardhan Reddy"
            />
            <ReportCard 
              title="Equipment Sizing Guidelines"
              description="Standard specifications for process equipment sizing"
              date="2025-04-18"
              type="Documentation"
              tags={["Equipment", "Design", "Standards"]}
              shared="Engineering Team"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface ReportCardProps {
  title: string;
  description: string;
  date: string;
  type: 'Simulation' | 'Analysis' | 'Documentation';
  tags: string[];
  shared?: string;
}

const ReportCard: React.FC<ReportCardProps> = ({ 
  title, 
  description, 
  date, 
  type, 
  tags,
  shared
}) => {
  const getBadgeColor = () => {
    switch(type) {
      case 'Simulation': return 'bg-blue-100 text-blue-700';
      case 'Analysis': return 'bg-green-100 text-green-700';
      case 'Documentation': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge className={getBadgeColor()}>
                {type}
              </Badge>
              {shared && (
                <Badge variant="outline" className="text-xs">
                  Shared by {shared}
                </Badge>
              )}
            </div>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center text-xs text-muted-foreground mb-2">
              <Calendar className="h-3 w-3 mr-1" />
              {date}
            </div>
            <div className="flex space-x-1">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Printer className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Reports;
