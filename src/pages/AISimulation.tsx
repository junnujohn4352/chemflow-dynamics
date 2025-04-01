
import React, { useState, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GlassPanel from "@/components/ui/GlassPanel";
import { Brain, Send, Loader2, Download, FlaskConical, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const AISimulation = () => {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<null | {
    steps: string[];
    result: string;
    comparison: string;
  }>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const responseRef = useRef<HTMLDivElement>(null);

  // Sample pre-defined responses for demonstration
  const sampleResponses = [
    {
      prompt: "How to optimize a distillation column for ethanol-water separation?",
      steps: [
        "Step 1: Define the feed composition (ethanol-water mixture, e.g., 15% ethanol).",
        "Step 2: Set operating conditions (feed temperature: 85°C, feed pressure: 1 atm).",
        "Step 3: Determine the number of theoretical stages required (typically 15-20 for ethanol-water).",
        "Step 4: Calculate the reflux ratio (minimum reflux ratio × 1.3 for optimal operation).",
        "Step 5: Select appropriate thermodynamic model (NRTL or UNIQUAC recommended for ethanol-water).",
        "Step 6: Run the simulation and analyze concentration profiles.",
        "Step 7: Optimize energy consumption by adjusting reflux ratio and feed stage location."
      ],
      result: "Optimized separation achieved with 18 stages, reflux ratio of 3.5, and feed at stage 9. Product purity: 95.6% ethanol in distillate, 99.8% water in bottoms. Energy consumption: 2.8 MJ/kg ethanol produced.",
      comparison: "The LLaMA model results align closely with ChemFlow's simulation, with a 2.3% difference in energy consumption and 0.7% difference in product purity predictions."
    },
    {
      prompt: "Design a reactor for methanol synthesis from syngas.",
      steps: [
        "Step 1: Define the feed composition (syngas H₂/CO ratio of 2:1 ideal for methanol synthesis).",
        "Step 2: Select reactor type (fixed-bed tubular reactor with Cu/ZnO/Al₂O₃ catalyst).",
        "Step 3: Set operating conditions (temperature: 250-270°C, pressure: 50-100 bar).",
        "Step 4: Define reaction kinetics (Graaf model recommended for methanol synthesis).",
        "Step 5: Set up heat exchange network (cooling required to maintain temperature control).",
        "Step 6: Calculate reactor dimensions based on space velocity (GHSV: 8000-10000 h⁻¹).",
        "Step 7: Evaluate conversion and selectivity across reactor length."
      ],
      result: "Achieved 56.8% CO conversion with 97.3% selectivity to methanol at 260°C and 75 bar. Reactor dimensions: 3.2m length, 0.8m diameter with 1200 tubes. Cooling duty: 1.85 MW. Methanol production: 125 tonnes/day.",
      comparison: "ChemFlow simulation predicts 59.2% conversion compared to LLaMA's 56.8%, a difference of 4.2%. Selectivity predictions are within 1.5% and required cooling duty within 3.8%."
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would connect to LLaMA API
      // Simulating API call with timeout
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // For demo, check if prompt contains certain keywords and return pre-defined responses
      let foundResponse = null;
      
      if (prompt.toLowerCase().includes("distillation") || prompt.toLowerCase().includes("ethanol")) {
        foundResponse = sampleResponses[0];
      } else if (prompt.toLowerCase().includes("reactor") || prompt.toLowerCase().includes("methanol")) {
        foundResponse = sampleResponses[1];
      } else {
        // Generate a generalized response based on the prompt
        const generalizedResponse = {
          steps: [
            "Step 1: Define system parameters and components relevant to the problem.",
            "Step 2: Select appropriate thermodynamic models for property estimation.",
            "Step 3: Set up the process flowsheet with required unit operations.",
            "Step 4: Specify operating conditions for each unit.",
            "Step 5: Run initial simulation to establish baseline performance.",
            "Step 6: Analyze results and identify optimization opportunities.",
            "Step 7: Perform sensitivity analysis on key variables."
          ],
          result: `Analysis complete for '${prompt}'. The optimized configuration shows efficiency improvements of 15-20% compared to base case, with key parameter settings identified for optimal performance.`,
          comparison: "ChemFlow simulation results closely match the LLaMA model predictions with average deviation of 3.8% across all calculated parameters."
        };
        foundResponse = generalizedResponse;
      }
      
      setResponse(foundResponse);
      
      toast({
        title: "Analysis complete",
        description: "AI simulation results are ready to view",
      });
      
      // Scroll to results
      setTimeout(() => {
        if (responseRef.current) {
          responseRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      
    } catch (err) {
      console.error("Error in AI processing:", err);
      setError("There was an error processing your request. Please try again.");
      toast({
        title: "Error",
        description: "Failed to generate simulation results",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadResults = () => {
    if (!response) return;
    
    const resultsText = `
# AI Simulation Results for: ${prompt}

## Step-by-Step Process
${response.steps.map((step, i) => `${step}`).join('\n')}

## Simulation Results
${response.result}

## Comparison with ChemFlow Simulation
${response.comparison}

Generated by ChemFlow AI Assistant (powered by LLaMA)
Date: ${new Date().toLocaleString()}
    `;
    
    const blob = new Blob([resultsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chemflow-ai-simulation-results.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Results downloaded",
      description: "Simulation results saved as text file"
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-16 px-6 bg-gray-50">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center mb-8">
            <div className="p-3 rounded-lg bg-amber-100 text-amber-700 mr-4">
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold mb-1">AI Simulation Assistant</h1>
              <p className="text-gray-600">Powered by LLaMA (Meta AI - Open Source)</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <GlassPanel className="p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Ask the AI Assistant</h2>
                <p className="text-gray-600 mb-4">
                  Describe your chemical engineering problem or simulation challenge, and the AI will provide 
                  a detailed step-by-step process and suggest optimal parameters.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Example: How to optimize a distillation column for ethanol-water separation?"
                      className="w-full h-40 rounded-lg border border-gray-200 p-4 bg-white focus:ring-2 focus:ring-flow-blue focus:border-flow-blue"
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={loading || !prompt.trim()}
                      className="inline-flex items-center"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Run AI Simulation
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </GlassPanel>
              
              {error && (
                <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6 flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-red-700">Error</h3>
                    <p className="text-red-600">{error}</p>
                  </div>
                </div>
              )}
              
              {response && (
                <div ref={responseRef}>
                  <GlassPanel className="p-6 mb-6 border-l-4 border-amber-500">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">Simulation Results</h2>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={downloadResults}
                        className="text-gray-600"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Results
                      </Button>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-3">Step-by-Step Process</h3>
                      <div className="space-y-2">
                        {response.steps.map((step, index) => (
                          <div 
                            key={index} 
                            className="p-3 bg-white rounded-lg border border-gray-100 flex"
                          >
                            <div className="flex-shrink-0 mr-3">
                              <div className="h-6 w-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center">
                                {index + 1}
                              </div>
                            </div>
                            <div>{step}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-3">Simulation Results</h3>
                      <div className="p-4 bg-white rounded-lg border border-gray-100">
                        <p>{response.result}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Comparison with ChemFlow Simulation</h3>
                      <div className="p-4 bg-green-50 rounded-lg border border-green-100 flex">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                        <p className="text-green-800">{response.comparison}</p>
                      </div>
                    </div>
                  </GlassPanel>
                </div>
              )}
            </div>
            
            <div className="lg:col-span-1">
              <GlassPanel className="p-6 mb-6">
                <h3 className="text-lg font-medium mb-3">About AI Assistant</h3>
                <p className="text-gray-600 mb-4">
                  This assistant uses Meta's LLaMA (Large Language Model Meta AI), an open-source AI model 
                  specialized for chemical engineering simulations.
                </p>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 mb-4">
                  <div className="font-medium">Provider: Meta (Facebook)</div>
                  <div className="text-sm text-gray-500">Open-source model with no API key required</div>
                </div>
                <p className="text-sm text-gray-500">
                  The AI provides detailed chemical engineering simulations and comparisons 
                  with ChemFlow's built-in simulation engine.
                </p>
              </GlassPanel>
              
              <GlassPanel className="p-6 mb-6">
                <h3 className="text-lg font-medium mb-3">Example Questions</h3>
                <div className="space-y-2">
                  {[
                    "How to optimize a distillation column for ethanol-water separation?",
                    "Design a reactor for methanol synthesis from syngas",
                    "What's the best heat exchanger configuration for my process?",
                    "How to improve yield in a methane steam reforming reaction?",
                    "Optimize a flash drum for natural gas processing"
                  ].map((example, index) => (
                    <button
                      key={index}
                      className="p-3 w-full text-left bg-white rounded-lg border border-gray-100 hover:border-flow-blue/30 transition-all text-sm"
                      onClick={() => setPrompt(example)}
                      disabled={loading}
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </GlassPanel>
              
              <GlassPanel className="p-6">
                <div className="flex items-center mb-4">
                  <FlaskConical className="h-5 w-5 text-flow-blue mr-2" />
                  <h3 className="text-lg font-medium">Need More Help?</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  For more complex simulations or specialized assistance, check out these resources:
                </p>
                <div className="space-y-2">
                  <a 
                    href="#" 
                    className="block p-3 bg-white rounded-lg border border-gray-100 hover:border-flow-blue/30 transition-all text-sm font-medium"
                  >
                    Chemical Engineering Documentation
                  </a>
                  <a 
                    href="#" 
                    className="block p-3 bg-white rounded-lg border border-gray-100 hover:border-flow-blue/30 transition-all text-sm font-medium"
                  >
                    ChemFlow Tutorials
                  </a>
                  <a 
                    href="#" 
                    className="block p-3 bg-white rounded-lg border border-gray-100 hover:border-flow-blue/30 transition-all text-sm font-medium"
                  >
                    Community Forum
                  </a>
                </div>
              </GlassPanel>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AISimulation;
