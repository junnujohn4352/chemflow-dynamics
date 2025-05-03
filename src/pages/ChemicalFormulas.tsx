
import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import GlassPanel from "@/components/ui/GlassPanel";
import { Atom, Calculator, Waves, Thermometer, Gauge, Plus, FlaskConical, Beaker, FlaskRound, MoveVertical, Droplets } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { chemicalEngineeringFormulas, getAllCategories } from "@/data/chemicalEngineeringFormulas";

type FormulaCategory = 
  | "thermodynamics" 
  | "fluid-dynamics" 
  | "mass-transfer" 
  | "heat-transfer" 
  | "reaction-kinetics" 
  | "process-control"
  | "transport-phenomena"
  | "equipment-design"
  | "biochemical-engineering"
  | "polymer-engineering"
  | "chemical-equilibrium"
  | "phase-equilibria"
  | "fluid-particle-systems"
  | "separation-processes";

const ChemicalFormulas = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  const filteredFormulas = chemicalEngineeringFormulas.filter(formula => {
    const matchesSearch = formula.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        formula.formula.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        formula.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || formula.category.toLowerCase().replace(' ', '-') === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categoryIcons: Record<string, React.ReactNode> = {
    "all": <Plus className="h-4 w-4" />,
    "thermodynamics": <Atom className="h-4 w-4" />,
    "fluid-dynamics": <Waves className="h-4 w-4" />,
    "mass-transfer": <FlaskConical className="h-4 w-4" />,
    "heat-transfer": <Thermometer className="h-4 w-4" />,
    "reaction-engineering": <Calculator className="h-4 w-4" />,
    "process-control": <Gauge className="h-4 w-4" />,
    "transport-phenomena": <MoveVertical className="h-4 w-4" />,
    "equipment-design": <Beaker className="h-4 w-4" />,
    "biochemical-engineering": <FlaskRound className="h-4 w-4" />,
    "separation-processes": <Droplets className="h-4 w-4" />
  };

  const categories = ["all", ...new Set(chemicalEngineeringFormulas.map(formula => 
    formula.category.toLowerCase().replace(' ', '-')
  ))];

  return (
    <Layout>
      <div className="py-10 px-6 max-w-screen-xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold mb-4 bg-gradient-to-r from-flow-blue to-flow-teal bg-clip-text text-transparent">
            Chemical Engineering Formulas
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl">
            Comprehensive reference for essential chemical engineering formulas, equations, and correlations used in process design and simulation.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Input 
              placeholder="Search formulas..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Tabs 
            value={selectedCategory} 
            onValueChange={setSelectedCategory}
            className="w-full md:w-auto"
          >
            <TabsList className="w-full md:w-auto overflow-x-auto">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category} 
                  value={category} 
                  className="flex items-center gap-1"
                >
                  {categoryIcons[category] || <Plus className="h-4 w-4" />}
                  <span>{category === "all" ? "All" : category.replace('-', ' ')}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        
        {filteredFormulas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredFormulas.map((formula) => (
              <GlassPanel 
                key={formula.id} 
                className={`p-6 bg-${formula.category.toLowerCase().replace(' ', '-')}-50/10 hover:shadow-lg transition-shadow`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-medium text-gray-900 dark:text-gray-50">{formula.title}</h3>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300">
                    {categoryIcons[formula.category.toLowerCase().replace(' ', '-')] || <Plus className="h-4 w-4" />}
                    <span className="ml-1 capitalize">
                      {formula.category}
                    </span>
                  </span>
                </div>
                
                <div className="p-3 bg-white/80 dark:bg-gray-800/80 rounded-md mb-4 overflow-x-auto">
                  <p className="text-lg font-mono text-flow-blue dark:text-flow-cyan font-medium">
                    {formula.formula}
                  </p>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {formula.description}
                </p>
                
                {formula.variables && Object.keys(formula.variables).length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Variables:</h4>
                    <div className="grid grid-cols-2 gap-1">
                      {Object.entries(formula.variables).map(([key, value], idx) => (
                        <div key={idx} className="text-xs text-gray-600 dark:text-gray-300 flex items-start">
                          <span className="font-mono font-medium mr-1">{key}:</span>
                          <span>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </GlassPanel>
            ))}
          </div>
        ) : (
          <GlassPanel className="p-8 text-center">
            <h3 className="text-lg font-medium mb-2">No formulas found</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Try adjusting your search or filter criteria
            </p>
          </GlassPanel>
        )}
      </div>
    </Layout>
  );
};

export default ChemicalFormulas;
