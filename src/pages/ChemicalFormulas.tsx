
import React, { useState, useEffect, useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import GlassPanel from "@/components/ui/GlassPanel";
import { 
  Atom, Calculator, Waves, Thermometer, Gauge, Plus, 
  FlaskConical, Beaker, FlaskRound, MoveVertical, Droplets, 
  BookOpen, FileText, Search, CirclePlus, Filter, ChevronLeft, ChevronRight
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { chemicalEngineeringFormulas, getAllCategories } from "@/data/chemicalEngineeringFormulas";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

type FormulaCategory = 
  | "all"
  | "thermodynamics"
  | "fluid-mechanics"
  | "mass-transfer"
  | "heat-transfer"
  | "reaction-engineering"
  | "process-control"
  | "transport-phenomena"
  | "equipment-design"
  | "biochemical-engineering"
  | "polymer-engineering"
  | "chemical-equilibrium"
  | "phase-equilibria"
  | "separation-processes"
  | "corrosion-engineering"
  | "environmental-engineering"
  | "safety-engineering"
  | "process-economics";

const ChemicalFormulas = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [formulaCount, setFormulaCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Get all unique categories
  const allCategories = useMemo(() => {
    const categories = getAllCategories();
    return ["All", ...categories];
  }, []);
  
  const filteredFormulas = useMemo(() => {
    return chemicalEngineeringFormulas.filter(formula => {
      const matchesSearch = 
        formula.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        formula.formula.toLowerCase().includes(searchQuery.toLowerCase()) ||
        formula.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (formula.variables && Object.entries(formula.variables).some(
          ([key, value]) => key.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           value.toLowerCase().includes(searchQuery.toLowerCase())
        ));
      
      const matchesCategory = selectedCategory === "all" || 
                            formula.category.toLowerCase().replace(' ', '-') === selectedCategory.toLowerCase() ||
                            (selectedCategory === "All" && formula.category);
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    setFormulaCount(filteredFormulas.length);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filteredFormulas.length]);

  // Calculate current formulas for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFormulas = filteredFormulas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredFormulas.length / itemsPerPage);

  const categoryIcons: Record<string, React.ReactNode> = {
    "All": <CirclePlus className="h-4 w-4" />,
    "Thermodynamics": <Atom className="h-4 w-4" />,
    "Fluid Mechanics": <Waves className="h-4 w-4" />,
    "Mass Transfer": <FlaskConical className="h-4 w-4" />,
    "Heat Transfer": <Thermometer className="h-4 w-4" />,
    "Reaction Engineering": <Calculator className="h-4 w-4" />,
    "Process Control": <Gauge className="h-4 w-4" />,
    "Transport Phenomena": <MoveVertical className="h-4 w-4" />,
    "Equipment Design": <Beaker className="h-4 w-4" />,
    "Biochemical Engineering": <FlaskRound className="h-4 w-4" />,
    "Separation Processes": <Droplets className="h-4 w-4" />,
    "Polymer Engineering": <FileText className="h-4 w-4" />,
    "Chemical Equilibrium": <BookOpen className="h-4 w-4" />,
    "Phase Equilibria": <Calculator className="h-4 w-4" />,
    "Corrosion Engineering": <FileText className="h-4 w-4" />,
    "Environmental Engineering": <Beaker className="h-4 w-4" />,
    "Safety Engineering": <Gauge className="h-4 w-4" />,
    "Process Economics": <Calculator className="h-4 w-4" />
  };

  // Generate a color based on the category for visual distinction
  const getCategoryColor = (category: string): string => {
    const colorMap: Record<string, string> = {
      "Thermodynamics": "from-purple-500 to-purple-700",
      "Fluid Mechanics": "from-blue-500 to-blue-700",
      "Mass Transfer": "from-teal-500 to-teal-700",
      "Heat Transfer": "from-red-500 to-red-700",
      "Reaction Engineering": "from-green-500 to-green-700",
      "Process Control": "from-yellow-500 to-yellow-700",
      "Transport Phenomena": "from-indigo-500 to-indigo-700",
      "Equipment Design": "from-orange-500 to-orange-700",
      "Biochemical Engineering": "from-pink-500 to-pink-700",
      "Polymer Engineering": "from-blue-400 to-indigo-600",
      "Chemical Equilibrium": "from-amber-500 to-amber-700",
      "Phase Equilibria": "from-sky-500 to-sky-700",
      "Separation Processes": "from-cyan-500 to-cyan-700",
      "Corrosion Engineering": "from-rose-500 to-rose-700",
      "Environmental Engineering": "from-emerald-500 to-emerald-700",
      "Safety Engineering": "from-red-500 to-orange-600",
      "Process Economics": "from-blue-500 to-violet-700",
    };
    
    return colorMap[category] || "from-gray-500 to-gray-700";
  };

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Animation variants for formulas
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <Layout>
      <div className="py-10 px-6 max-w-screen-xl mx-auto">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-display font-bold mb-4 bg-gradient-to-r from-flow-blue to-flow-teal bg-clip-text text-transparent">
            Chemical & Engineering Formulas
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl">
            Comprehensive reference for essential chemical and process engineering formulas, equations, and correlations used in process design and simulation.
          </p>
        </motion.div>
        
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <motion.div 
            className="relative flex-1"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input 
              className="pl-10 border-flow-blue/20 focus:border-flow-blue/70 transition-colors duration-300"
              placeholder="Search formulas, variables, or descriptions..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </motion.div>
          
          <motion.div
            className="flex gap-2"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button 
              variant="outline" 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-1 h-10 border-flow-blue/20 hover:border-flow-blue/70 transition-all duration-300"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </Button>
            
            <Badge variant="outline" className="h-10 px-4 flex items-center gap-1 text-flow-blue border-flow-blue/20">
              <BookOpen className="h-4 w-4" />
              <span>{formulaCount} formula{formulaCount !== 1 ? 's' : ''} found</span>
            </Badge>
          </motion.div>
        </div>
        
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6 overflow-hidden"
            >
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-4 rounded-xl border border-blue-100 dark:border-blue-900 shadow-md">
                <h3 className="text-lg font-medium mb-2 text-flow-blue">Filter by Category</h3>
                <div className="flex flex-wrap gap-2">
                  {allCategories.map((category) => (
                    <motion.div 
                      key={category} 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Badge 
                        variant={selectedCategory === category.toLowerCase().replace(' ', '-') ? "default" : "outline"}
                        className={`px-3 py-2 cursor-pointer ${
                          selectedCategory === category.toLowerCase().replace(' ', '-') 
                            ? `bg-gradient-to-r ${getCategoryColor(category)} text-white` 
                            : "hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-300"
                        }`}
                        onClick={() => setSelectedCategory(category.toLowerCase().replace(' ', '-'))}
                      >
                        {categoryIcons[category] || <Plus className="h-4 w-4 mr-1" />}
                        <span>{category}</span>
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {currentFormulas.length > 0 ? (
          <>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {currentFormulas.map((formula) => {
                const categoryColor = getCategoryColor(formula.category);
                
                return (
                  <motion.div 
                    key={formula.id} 
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  >
                    <GlassPanel 
                      className={`p-6 bg-white/90 dark:bg-gray-800/90 hover:shadow-lg transition-shadow border border-gray-100/30 overflow-hidden relative`}
                    >
                      <div className="flex justify-between items-start mb-3 relative z-10">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-gray-50">{formula.title}</h3>
                        <Badge className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${categoryColor}`}>
                          {categoryIcons[formula.category] || <Plus className="h-4 w-4 mr-1" />}
                          <span className="ml-1 capitalize">
                            {formula.category}
                          </span>
                        </Badge>
                      </div>
                      
                      <div className="p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-md mb-4 overflow-x-auto border border-gray-100 dark:border-gray-700">
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
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                            {Object.entries(formula.variables).map(([key, value], idx) => (
                              <div key={idx} className="text-xs text-gray-600 dark:text-gray-300 flex items-start">
                                <span className="font-mono font-medium mr-1">{key}:</span>
                                <span>{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Decorative background element */}
                      <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-gradient-to-r from-blue-500/5 to-purple-500/5 dark:from-blue-500/10 dark:to-purple-500/10 z-0"></div>
                    </GlassPanel>
                  </motion.div>
                );
              })}
            </motion.div>
            
            {/* Pagination controls */}
            {totalPages > 1 && (
              <motion.div 
                className="flex justify-center mt-10 gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  variant="outline"
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Prev
                </Button>
                
                <div className="flex gap-1 mx-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(num => 
                      num === 1 || 
                      num === totalPages || 
                      (num >= currentPage - 1 && num <= currentPage + 1)
                    )
                    .map((number, index, array) => {
                      // Add ellipsis
                      if (index > 0 && array[index - 1] !== number - 1) {
                        return (
                          <React.Fragment key={`ellipsis-${number}`}>
                            <Button
                              variant="ghost"
                              disabled
                              className="w-10 h-10 p-0"
                            >
                              ...
                            </Button>
                            <Button
                              variant={currentPage === number ? "default" : "outline"}
                              onClick={() => paginate(number)}
                              className={`w-10 h-10 p-0 ${
                                currentPage === number 
                                  ? "bg-gradient-to-r from-flow-blue to-flow-teal text-white" 
                                  : ""
                              }`}
                            >
                              {number}
                            </Button>
                          </React.Fragment>
                        );
                      }
                      
                      return (
                        <Button
                          key={number}
                          variant={currentPage === number ? "default" : "outline"}
                          onClick={() => paginate(number)}
                          className={`w-10 h-10 p-0 ${
                            currentPage === number 
                              ? "bg-gradient-to-r from-flow-blue to-flow-teal text-white" 
                              : ""
                          }`}
                        >
                          {number}
                        </Button>
                      );
                    })
                  }
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <GlassPanel className="p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-flow-blue" />
              </div>
              <h3 className="text-lg font-medium mb-2">No formulas found</h3>
              <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                Try adjusting your search terms or filter criteria, or select "All" from the category filters.
              </p>
              <Button 
                className="mt-4 bg-gradient-to-r from-flow-blue to-flow-teal text-white"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
              >
                Clear filters
              </Button>
            </GlassPanel>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default ChemicalFormulas;
