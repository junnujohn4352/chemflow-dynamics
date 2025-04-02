
import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GlassPanel from "@/components/ui/GlassPanel";
import { 
  Brain, 
  Send, 
  Loader2, 
  MessageSquare, 
  Info, 
  FileText,
  ArrowRight,
  Github
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import LlamaService from "@/services/LlamaService";

const AISimulation = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<{role: string, content: string, includesImage?: boolean}[]>([
    {
      role: "assistant",
      content: "Hello! I'm your ChemFlow AI assistant powered by Meta's LLaMA model running locally in your browser. I can help you with chemical process simulations, calculations, and engineering questions. How can I help you today?"
    }
  ]);
  const [llamaLoaded, setLlamaLoaded] = useState(false);
  const [showFlowsheet, setShowFlowsheet] = useState(false);
  const [flowsheetProblem, setFlowsheetProblem] = useState("");

  // Load LLaMA model
  useEffect(() => {
    const loadLlama = async () => {
      const llamaService = LlamaService.getInstance();
      try {
        await llamaService.loadModel();
        setLlamaLoaded(true);
        toast({
          title: "LLaMA Model Loaded",
          description: "The AI model is ready to answer your chemical engineering questions",
        });
      } catch (error) {
        console.error("Error loading LLaMA model:", error);
        toast({
          title: "Model Loading Failed",
          description: "There was an error loading the LLaMA model. Falling back to simulated responses.",
          variant: "destructive",
        });
        // We'll still set llamaLoaded to true to allow the chat interface to work with simulated responses
        setLlamaLoaded(true);
      }
    };

    loadLlama();
  }, [toast]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = {
      role: "user",
      content: input
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      let responseText = "";
      
      // Check if this looks like a flowsheet request
      if (input.toLowerCase().includes("flowsheet") || input.toLowerCase().includes("process design") || 
          input.toLowerCase().includes("design a process") || input.toLowerCase().includes("design process")) {
        // Save the problem statement for potential flowsheet generation
        setFlowsheetProblem(input);
        
        responseText = "I've analyzed your process design request. I can help generate a flowsheet for this process. " +
          "Would you like me to create a visual flowsheet that you can use for your simulation? " +
          "This will include recommended equipment, operating conditions, and stream compositions based on my analysis.";
        
        // Add a special flowsheet response
        setMessages(prev => [...prev, {
          role: "assistant",
          content: responseText
        }]);
        
        // Show the flowsheet generation option
        setShowFlowsheet(true);
        setIsLoading(false);
        return;
      }
      
      // Try to use the actual LLaMA service
      const llamaService = LlamaService.getInstance();
      if (llamaService.isModelLoaded()) {
        try {
          responseText = await llamaService.generateResponse(input);
        } catch (error) {
          console.error("Error generating response from LLaMA:", error);
          // Fall back to simulated response
          responseText = getSimulatedResponse(input);
        }
      } else {
        // Fall back to simulated response
        responseText = getSimulatedResponse(input);
      }
      
      setMessages(prev => [...prev, {
        role: "assistant",
        content: responseText
      }]);
      
      setIsLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate response. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const getSimulatedResponse = (input: string) => {
    // Simulate AI response with chemical engineering related content
    let responseText = "";
    
    // Simulate different types of chemical engineering responses based on input
    if (input.toLowerCase().includes("reactor") || input.toLowerCase().includes("reaction")) {
      responseText = "To simulate a chemical reactor, we need to follow these steps:\n\n" +
        "1. Define the reaction kinetics (rate equations)\n" +
        "2. Set material balances for each component\n" +
        "3. Include energy balances if temperature effects are important\n" +
        "4. Specify reactor type (CSTR, PFR, batch)\n" +
        "5. Set inlet conditions (temperature, pressure, concentrations)\n\n" +
        "For example, for a simple A → B reaction in a CSTR with first-order kinetics, the conversion equation would be:\n" +
        "X = k·τ / (1 + k·τ) where k is the rate constant and τ is the residence time.";
    } else if (input.toLowerCase().includes("distill") || input.toLowerCase().includes("separ")) {
      responseText = "For distillation column simulation:\n\n" +
        "1. Specify the feed composition, flow rate, and thermal condition\n" +
        "2. Set the operating pressure\n" +
        "3. Define number of stages and feed stage location\n" +
        "4. Specify reflux ratio and distillate rate or bottoms composition\n" +
        "5. Select a thermodynamic model (e.g., Peng-Robinson, NRTL)\n\n" +
        "The minimum number of stages can be calculated using the Fenske equation, and the minimum reflux ratio using the Underwood equation.";
    } else if (input.toLowerCase().includes("heat") || input.toLowerCase().includes("exchang")) {
      responseText = "Heat exchanger simulation involves:\n\n" +
        "1. Specifying hot and cold stream properties\n" +
        "2. Calculating the overall heat transfer coefficient (U)\n" +
        "3. Determining the required heat transfer area using Q = U·A·LMTD\n" +
        "4. Where LMTD is the log mean temperature difference\n\n" +
        "For countercurrent flow: LMTD = (ΔT₁ - ΔT₂) / ln(ΔT₁/ΔT₂)\n" +
        "where ΔT₁ and ΔT₂ are the temperature differences at each end.";
    } else if (input.toLowerCase().includes("ethanol") || input.toLowerCase().includes("ferment")) {
      responseText = "For ethanol production via fermentation:\n\n" +
        "1. Feedstock preparation: Corn or sugarcane is milled and mixed with water\n" +
        "2. Liquefaction: Starch is broken down into fermentable sugars using alpha-amylase at 80-90°C\n" +
        "3. Saccharification: Glucoamylase converts dextrins to glucose at 60-65°C\n" +
        "4. Fermentation: Yeast converts glucose to ethanol at 30-35°C for 48-72 hours\n" +
        "5. Distillation: Ethanol is separated to ~95% purity\n" +
        "6. Dehydration: Molecular sieves remove remaining water to produce anhydrous ethanol\n\n" +
        "Key parameters include temperature control, pH maintenance at 4.0-5.0, and oxygen limitation during fermentation.";
    } else {
      responseText = "I can help analyze your chemical process simulation. To get started, please provide details about:\n\n" +
        "1. The specific unit operations involved\n" +
        "2. Component compositions and flow rates\n" +
        "3. Operating conditions (T, P)\n" +
        "4. Design objectives\n\n" +
        "For example, if you're designing a process for chemical production, we could analyze the reaction, separation, and purification steps to optimize yield and energy usage.";
    }
    
    return responseText;
  };

  const handleGenerateFlowsheet = () => {
    setIsLoading(true);
    
    // Simulate flowsheet generation
    setTimeout(() => {
      const flowsheetResponse = {
        role: "assistant",
        content: "I've generated a flowsheet based on your process description. Here's my analysis and recommendations:",
        includesImage: true
      };
      
      setMessages(prev => [...prev, flowsheetResponse]);
      setShowFlowsheet(false);
      setIsLoading(false);
      
      // Redirect to create simulation with this problem statement
      localStorage.setItem('chemflow-problem-statement', flowsheetProblem);
      
      toast({
        title: "Flowsheet Generated",
        description: "You can now view and modify the suggested process design",
      });
      
      // Wait a moment before navigating
      setTimeout(() => {
        navigate('/create-simulation');
      }, 1500);
    }, 3000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-16 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold mb-2 dark:text-white">AI Simulation Assistant</h1>
            <p className="text-gray-600 dark:text-gray-400">Get intelligent assistance with your chemical process simulations</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <GlassPanel className="p-6 flex flex-col h-[600px]">
                <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                  {messages.map((message, index) => (
                    <div 
                      key={index}
                      className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div 
                        className={`max-w-[80%] p-4 rounded-lg ${
                          message.role === 'assistant' 
                            ? 'bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700' 
                            : 'bg-flow-blue text-white'
                        }`}
                      >
                        {message.role === 'assistant' && (
                          <div className="flex items-center mb-2">
                            <Brain className="h-5 w-5 mr-2 text-flow-blue dark:text-blue-400" />
                            <span className="font-medium">ChemFlow AI</span>
                          </div>
                        )}
                        <div className="whitespace-pre-line">{message.content}</div>
                        
                        {message.includesImage && (
                          <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                            <img 
                              src="https://placehold.co/600x400/EEE/31343C?text=Process+Flowsheet+Diagram&font=montserrat"
                              alt="Process Flowsheet"
                              className="w-full"
                            />
                            <div className="p-3 bg-gray-50 dark:bg-gray-900 text-sm">
                              <p className="font-medium mb-1">Recommended Process Parameters:</p>
                              <ul className="list-disc pl-4 space-y-1">
                                <li>Reactor Temperature: 75-85°C</li>
                                <li>Reactor Pressure: 2.5 bar</li>
                                <li>Residence Time: 45 minutes</li>
                                <li>Distillation Column: 12 theoretical stages</li>
                                <li>Reflux Ratio: 3.5</li>
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] p-4 rounded-lg bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                        <div className="flex items-center">
                          <Loader2 className="h-5 w-5 mr-2 text-flow-blue animate-spin" />
                          <span className="text-gray-600 dark:text-gray-400">Generating response...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {showFlowsheet && !isLoading && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] p-4 rounded-lg bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                        <Button 
                          onClick={handleGenerateFlowsheet} 
                          className="w-full"
                        >
                          Generate Process Flowsheet <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="relative">
                  <Textarea 
                    placeholder="Ask about chemical process simulations, reactions, separations..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="resize-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    rows={3}
                    disabled={!llamaLoaded || isLoading}
                  />
                  <Button 
                    className="absolute bottom-3 right-3"
                    size="sm"
                    onClick={handleSendMessage}
                    disabled={!llamaLoaded || isLoading || !input.trim()}
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
                
                {!llamaLoaded && (
                  <div className="mt-4">
                    <Alert>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <AlertTitle>Loading LLaMA Model</AlertTitle>
                      <AlertDescription>
                        The AI model is being loaded locally in your browser. This may take a moment...
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </GlassPanel>
            </div>
            
            <div className="lg:col-span-1">
              <GlassPanel className="p-6 mb-6">
                <h3 className="text-lg font-medium mb-4 dark:text-white">About AI Assistant</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  This AI assistant is powered by Meta's LLaMA model running locally in your browser. It can help with:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Brain className="h-5 w-5 mr-2 text-flow-blue mt-0.5 dark:text-blue-400" />
                    <span className="dark:text-gray-300">Chemical process simulation assistance</span>
                  </li>
                  <li className="flex items-start">
                    <MessageSquare className="h-5 w-5 mr-2 text-flow-blue mt-0.5 dark:text-blue-400" />
                    <span className="dark:text-gray-300">Engineering calculations and formulas</span>
                  </li>
                  <li className="flex items-start">
                    <FileText className="h-5 w-5 mr-2 text-flow-blue mt-0.5 dark:text-blue-400" />
                    <span className="dark:text-gray-300">Troubleshooting simulation issues</span>
                  </li>
                </ul>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center text-amber-600 dark:text-amber-400">
                    <Info className="h-5 w-5 mr-2" />
                    <span className="text-sm font-medium">Running 100% locally in your browser</span>
                  </div>
                </div>
              </GlassPanel>
              
              <GlassPanel className="p-6">
                <h3 className="text-lg font-medium mb-4 dark:text-white">Open Source LLaMA</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  This assistant uses Meta's LLaMA model, an open-source large language model optimized for chemical engineering applications.
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <Github className="h-4 w-4 mr-2" />
                    <span className="font-medium">llama.cpp</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    Inference runs locally in WASM - no data leaves your browser
                  </div>
                </div>
                <Button 
                  className="w-full"
                  onClick={() => navigate('/create-simulation')}
                >
                  Create New Simulation <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
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
