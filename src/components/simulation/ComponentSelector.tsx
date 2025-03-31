
import React, { useState, useEffect } from "react";
import { Search, Check, Database, Plus, X, Info, AlertCircle, Edit, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Expanded chemical database with more chemicals
const CHEMICAL_DATABASE = [
  { id: "1", name: "Methane", formula: "CH₄", cas: "74-82-8", category: "Hydrocarbon", phase: "Gas", mw: 16.04, tc: 190.6, pc: 46.0, omega: 0.011 },
  { id: "2", name: "Ethane", formula: "C₂H₆", cas: "74-84-0", category: "Hydrocarbon", phase: "Gas", mw: 30.07, tc: 305.4, pc: 48.8, omega: 0.099 },
  { id: "3", name: "Propane", formula: "C₃H₈", cas: "74-98-6", category: "Hydrocarbon", phase: "Gas", mw: 44.10, tc: 369.8, pc: 42.5, omega: 0.152 },
  { id: "4", name: "n-Butane", formula: "C₄H₁₀", cas: "106-97-8", category: "Hydrocarbon", phase: "Gas/Liquid", mw: 58.12, tc: 425.2, pc: 38.0, omega: 0.199 },
  { id: "5", name: "i-Butane", formula: "C₄H₁₀", cas: "75-28-5", category: "Hydrocarbon", phase: "Gas/Liquid", mw: 58.12, tc: 408.1, pc: 36.5, omega: 0.184 },
  { id: "6", name: "n-Pentane", formula: "C₅H₁₂", cas: "109-66-0", category: "Hydrocarbon", phase: "Liquid", mw: 72.15, tc: 469.6, pc: 33.7, omega: 0.251 },
  { id: "7", name: "Oxygen", formula: "O₂", cas: "7782-44-7", category: "Gas", phase: "Gas", mw: 32.00, tc: 154.6, pc: 50.4, omega: 0.022 },
  { id: "8", name: "Nitrogen", formula: "N₂", cas: "7727-37-9", category: "Gas", phase: "Gas", mw: 28.01, tc: 126.2, pc: 33.9, omega: 0.037 },
  { id: "9", name: "Carbon Dioxide", formula: "CO₂", cas: "124-38-9", category: "Gas", phase: "Gas", mw: 44.01, tc: 304.2, pc: 73.8, omega: 0.224 },
  { id: "10", name: "Water", formula: "H₂O", cas: "7732-18-5", category: "Solvent", phase: "Liquid", mw: 18.02, tc: 647.1, pc: 220.6, omega: 0.344 },
  { id: "11", name: "Hydrogen", formula: "H₂", cas: "1333-74-0", category: "Gas", phase: "Gas", mw: 2.02, tc: 33.2, pc: 13.0, omega: -0.216 },
  { id: "12", name: "Methanol", formula: "CH₃OH", cas: "67-56-1", category: "Alcohol", phase: "Liquid", mw: 32.04, tc: 512.6, pc: 80.9, omega: 0.565 },
  { id: "13", name: "Ethanol", formula: "C₂H₅OH", cas: "64-17-5", category: "Alcohol", phase: "Liquid", mw: 46.07, tc: 513.9, pc: 61.4, omega: 0.645 },
  { id: "14", name: "Acetone", formula: "C₃H₆O", cas: "67-64-1", category: "Ketone", phase: "Liquid", mw: 58.08, tc: 508.2, pc: 47.0, omega: 0.307 },
  { id: "15", name: "Benzene", formula: "C₆H₆", cas: "71-43-2", category: "Aromatic", phase: "Liquid", mw: 78.11, tc: 562.2, pc: 48.9, omega: 0.210 },
  { id: "16", name: "Toluene", formula: "C₇H₈", cas: "108-88-3", category: "Aromatic", phase: "Liquid", mw: 92.14, tc: 591.8, pc: 41.0, omega: 0.263 },
  { id: "17", name: "Hydrogen Sulfide", formula: "H₂S", cas: "7783-06-4", category: "Gas", phase: "Gas", mw: 34.08, tc: 373.5, pc: 89.4, omega: 0.081 },
  { id: "18", name: "Ammonia", formula: "NH₃", cas: "7664-41-7", category: "Gas", phase: "Gas", mw: 17.03, tc: 405.5, pc: 113.5, omega: 0.253 },
  { id: "19", name: "Acetic Acid", formula: "C₂H₄O₂", cas: "64-19-7", category: "Acid", phase: "Liquid", mw: 60.05, tc: 594.4, pc: 57.9, omega: 0.467 },
  { id: "20", name: "n-Hexane", formula: "C₆H₁₄", cas: "110-54-3", category: "Hydrocarbon", phase: "Liquid", mw: 86.18, tc: 507.6, pc: 30.3, omega: 0.299 },
  { id: "21", name: "Cyclohexane", formula: "C₆H₁₂", cas: "110-82-7", category: "Hydrocarbon", phase: "Liquid", mw: 84.16, tc: 553.6, pc: 40.7, omega: 0.212 },
  { id: "22", name: "Ethylene", formula: "C₂H₄", cas: "74-85-1", category: "Hydrocarbon", phase: "Gas", mw: 28.05, tc: 282.4, pc: 50.4, omega: 0.089 },
  { id: "23", name: "Propylene", formula: "C₃H₆", cas: "115-07-1", category: "Hydrocarbon", phase: "Gas", mw: 42.08, tc: 364.9, pc: 46.0, omega: 0.144 },
  { id: "24", name: "Sulfur Dioxide", formula: "SO₂", cas: "7446-09-5", category: "Gas", phase: "Gas", mw: 64.06, tc: 430.8, pc: 78.8, omega: 0.251 },
  { id: "25", name: "Nitrogen Dioxide", formula: "NO₂", cas: "10102-44-0", category: "Gas", phase: "Gas", mw: 46.01, tc: 431.0, pc: 101.0, omega: 0.34 },
  // New additions
  { id: "26", name: "Isopropanol", formula: "C₃H₈O", cas: "67-63-0", category: "Alcohol", phase: "Liquid", mw: 60.10, tc: 508.3, pc: 47.6, omega: 0.665 },
  { id: "27", name: "Acetaldehyde", formula: "C₂H₄O", cas: "75-07-0", category: "Aldehyde", phase: "Liquid", mw: 44.05, tc: 461.0, pc: 55.7, omega: 0.291 },
  { id: "28", name: "Formaldehyde", formula: "CH₂O", cas: "50-00-0", category: "Aldehyde", phase: "Gas", mw: 30.03, tc: 408.0, pc: 65.9, omega: 0.282 },
  { id: "29", name: "Formic Acid", formula: "CH₂O₂", cas: "64-18-6", category: "Acid", phase: "Liquid", mw: 46.03, tc: 580.0, pc: 58.1, omega: 0.473 },
  { id: "30", name: "Propylene Glycol", formula: "C₃H₈O₂", cas: "57-55-6", category: "Glycol", phase: "Liquid", mw: 76.09, tc: 626.0, pc: 60.8, omega: 0.762 },
  { id: "31", name: "Ethylene Glycol", formula: "C₂H₆O₂", cas: "107-21-1", category: "Glycol", phase: "Liquid", mw: 62.07, tc: 720.0, pc: 77.0, omega: 0.576 },
  { id: "32", name: "Glycerol", formula: "C₃H₈O₃", cas: "56-81-5", category: "Polyol", phase: "Liquid", mw: 92.09, tc: 850.0, pc: 75.0, omega: 0.513 },
  { id: "33", name: "Methyl Acetate", formula: "C₃H₆O₂", cas: "79-20-9", category: "Ester", phase: "Liquid", mw: 74.08, tc: 506.6, pc: 47.5, omega: 0.331 },
  { id: "34", name: "Ethyl Acetate", formula: "C₄H₈O₂", cas: "141-78-6", category: "Ester", phase: "Liquid", mw: 88.11, tc: 523.3, pc: 38.8, omega: 0.366 },
  { id: "35", name: "Dimethyl Ether", formula: "C₂H₆O", cas: "115-10-6", category: "Ether", phase: "Gas", mw: 46.07, tc: 400.1, pc: 53.7, omega: 0.200 },
];

interface ComponentSelectorProps {
  selectedComponents: string[];
  setSelectedComponents: React.Dispatch<React.SetStateAction<string[]>>;
}

// Define a type for chemical components to ensure consistency
type ChemicalComponent = {
  id: string;
  name: string;
  formula: string;
  cas: string;
  category: string;
  phase: string;
  mw: number;
  tc: number;
  pc: number;
  omega: number;
};

// Schema for custom chemical validation
const customChemicalSchema = z.object({
  name: z.string().min(1, "Name is required"),
  formula: z.string().min(1, "Formula is required"),
  cas: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  phase: z.string().min(1, "Phase is required"),
  mw: z.coerce.number().positive("Molecular weight must be positive"),
  tc: z.coerce.number().positive("Critical temperature must be positive").optional(),
  pc: z.coerce.number().positive("Critical pressure must be positive").optional(),
  omega: z.coerce.number().optional(),
});

type CustomChemicalFormValues = z.infer<typeof customChemicalSchema>;

const ComponentSelector: React.FC<ComponentSelectorProps> = ({ 
  selectedComponents,
  setSelectedComponents 
}) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showRecommended, setShowRecommended] = useState(true);
  const [customComponents, setCustomComponents] = useState<ChemicalComponent[]>([]);
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const [nextCustomId, setNextCustomId] = useState(100); // Start custom IDs from 100
  
  // Combined database with built-in and custom chemicals
  const combinedDatabase = [...CHEMICAL_DATABASE, ...customComponents];
  
  const categories = [...new Set(combinedDatabase.map(comp => comp.category))];
  
  // Form for custom chemical
  const form = useForm<CustomChemicalFormValues>({
    resolver: zodResolver(customChemicalSchema),
    defaultValues: {
      name: "",
      formula: "",
      cas: "",
      category: "",
      phase: "Liquid",
      mw: 0,
      tc: undefined,
      pc: undefined,
      omega: undefined,
    },
  });
  
  // Show recommendations for common component groups
  const recommendations = [
    { name: "Hydrocarbon Mixture", components: ["1", "2", "3", "4", "6"] },
    { name: "Alcohol Water", components: ["10", "12", "13"] },
    { name: "Air", components: ["7", "8"] },
    { name: "Refinery Gas", components: ["1", "2", "3", "4", "5", "22", "23"] },
    { name: "Crude Oil Components", components: ["3", "4", "6", "15", "16", "20", "21"] },
  ];
  
  // Filter components based on search and category
  const filteredComponents = combinedDatabase.filter(comp => {
    const matchesSearch = comp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         comp.formula.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         comp.cas.includes(searchQuery);
    const matchesCategory = selectedCategory ? comp.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });
  
  const toggleComponent = (componentId: string) => {
    if (selectedComponents.includes(componentId)) {
      setSelectedComponents(prev => prev.filter(id => id !== componentId));
      
      toast({
        description: `${getComponentById(componentId)?.name} removed from simulation`
      });
    } else {
      setSelectedComponents(prev => [...prev, componentId]);
      
      toast({
        description: `${getComponentById(componentId)?.name} added to simulation`
      });
    }
  };
  
  const applyRecommendation = (components: string[]) => {
    setSelectedComponents(components);
    
    toast({
      title: "Recommendation Applied",
      description: `${components.length} components have been added`
    });
    
    setShowRecommended(false);
  };
  
  const getComponentById = (id: string) => {
    return combinedDatabase.find(comp => comp.id === id);
  };

  const onSubmitCustom = (values: CustomChemicalFormValues) => {
    // Create a properly typed new component by ensuring all required fields are present
    const newComponent: ChemicalComponent = {
      id: `custom-${nextCustomId}`,
      name: values.name,
      formula: values.formula,
      cas: values.cas || "",  // Provide default empty string for optional cas
      category: values.category,
      phase: values.phase,
      mw: values.mw,
      tc: values.tc || 0,     // Provide default 0 for optional tc
      pc: values.pc || 0,     // Provide default 0 for optional pc
      omega: values.omega || 0  // Provide default 0 for optional omega
    };
    
    setCustomComponents(prev => [...prev, newComponent]);
    setNextCustomId(prev => prev + 1);
    setShowCustomDialog(false);
    
    // Auto-select the new component
    setSelectedComponents(prev => [...prev, newComponent.id]);
    
    toast({
      title: "Custom Component Added",
      description: `${values.name} has been added to your database`
    });
    
    form.reset();
  };
  
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-medium mb-4">Chemical Components</h2>
      <p className="text-gray-600 mb-6">
        Select the chemical species that will be present in your simulation.
      </p>
      
      {/* Recommendations */}
      {showRecommended && (
        <div className="mb-6 bg-blue-50 rounded-lg p-4 border border-blue-100">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-blue-800 flex items-center">
              <AlertCircle className="mr-2 h-4 w-4" />
              Recommended Component Sets
            </h3>
            <button 
              className="text-blue-500 text-sm hover:text-blue-700"
              onClick={() => setShowRecommended(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {recommendations.map((rec, index) => (
              <div 
                key={index} 
                className="p-3 bg-white rounded border border-blue-200 cursor-pointer hover:border-blue-400 transition-colors"
                onClick={() => applyRecommendation(rec.components)}
              >
                <div className="font-medium text-sm mb-1">{rec.name}</div>
                <div className="text-xs text-gray-500">{rec.components.length} components</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-flow-blue/20 focus:border-flow-blue"
            placeholder="Search by name, formula, or CAS number"
          />
        </div>
        
        <Button 
          variant="outline" 
          className="flex items-center"
          onClick={() => setShowCustomDialog(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Custom Component
        </Button>
        
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              selectedCategory === null 
                ? 'bg-flow-blue text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                selectedCategory === category 
                  ? 'bg-flow-blue text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      {/* Database list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 max-h-[400px] overflow-y-auto p-2">
        {filteredComponents.map(component => (
          <div 
            key={component.id}
            className={`p-4 rounded-lg border transition-all cursor-pointer ${
              selectedComponents.includes(component.id)
                ? 'border-flow-blue bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            } ${component.id.startsWith('custom') ? 'border-dashed' : ''}`}
            onClick={() => toggleComponent(component.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium">{component.name}</h3>
                <div className="flex items-center text-gray-500 text-sm mt-1">
                  <span className="mr-2 font-mono">{component.formula}</span>
                  <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                    {component.category}
                  </span>
                </div>
                <div className="flex justify-between mt-2">
                  <div className="text-xs text-gray-500">
                    {component.cas ? `CAS: ${component.cas}` : 'Custom'}
                  </div>
                  <div className="text-xs text-gray-500">
                    MW: {component.mw}
                  </div>
                </div>
                {(component.tc || component.pc || component.omega) && (
                  <div className="grid grid-cols-3 gap-1 mt-2 text-xs text-gray-500">
                    {component.tc && <div>Tc: {component.tc} K</div>}
                    {component.pc && <div>Pc: {component.pc} bar</div>}
                    {component.omega && <div>ω: {component.omega}</div>}
                  </div>
                )}
                <div className="mt-1 text-xs inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-800">
                  {component.phase}
                </div>
              </div>
              <div className={`h-5 w-5 flex items-center justify-center rounded-full ${
                selectedComponents.includes(component.id)
                  ? 'bg-flow-blue text-white'
                  : 'border border-gray-300'
              }`}>
                {selectedComponents.includes(component.id) && <Check className="h-3 w-3" />}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Selected components list */}
      <div className="mt-auto">
        <h3 className="font-medium mb-2 flex items-center">
          <Database className="mr-2 h-4 w-4" />
          Selected Components ({selectedComponents.length})
        </h3>
        {selectedComponents.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {selectedComponents.map(id => {
              const component = getComponentById(id);
              return component ? (
                <div key={id} className="flex items-center bg-gray-100 px-3 py-1.5 rounded-lg">
                  <span className="text-sm mr-2">{component.name}</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="text-gray-400 hover:text-gray-600 mr-1">
                          <Info className="h-3.5 w-3.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-xs space-y-1 p-1">
                          <p><strong>Formula:</strong> {component.formula}</p>
                          <p><strong>MW:</strong> {component.mw}</p>
                          {component.tc && <p><strong>Tc:</strong> {component.tc} K</p>}
                          {component.pc && <p><strong>Pc:</strong> {component.pc} bar</p>}
                          {component.omega && <p><strong>ω:</strong> {component.omega}</p>}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <button 
                    className="text-gray-500 hover:text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleComponent(id);
                    }}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : null;
            })}
          </div>
        ) : (
          <div className="text-gray-500 text-sm flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Click on components to add them to your simulation
          </div>
        )}
      </div>

      {/* Dialog for custom component */}
      <Dialog open={showCustomDialog} onOpenChange={setShowCustomDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Custom Chemical Component</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitCustom)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Custom Solvent" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="formula"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chemical Formula</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. C₈H₁₈" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CAS Number (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 123-45-6" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Solvent" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phase"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phase</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Liquid" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mw"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Molecular Weight (g/mol)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-sm font-medium pt-2">Thermodynamic Properties (Optional)</h3>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="tc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Critical Temp (K)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Critical Press (bar)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="omega"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Acentric Factor</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.001" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setShowCustomDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Component</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ComponentSelector;
