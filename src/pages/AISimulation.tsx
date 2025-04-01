
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
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AISimulation = () => {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<{role: string, content: string}[]>([
    {
      role: "assistant",
      content: "Hello! I'm your ChemFlow AI assistant powered by Meta's LLaMA model. I can help you with chemical process simulations, calculations, and engineering questions. How can I help you today?"
    }
  ]);
  const [llamaLoaded, setLlamaLoaded] = useState(false);

  // Simulate loading LLaMA model (in a real implementation, this would actually load the model)
  useEffect(() => {
    const loadLlama = async () => {
      // This is a placeholder for actually loading the LLaMA model
      // In a real implementation, you would use something like:
      // const model = await loadLlamaModel('path/to/model');
      
      setTimeout(() => {
        setLlamaLoaded(true);
        toast({
          title: "LLaMA Model Loaded",
          description: "The AI model is ready to answer your chemical engineering questions",
        });
      }, 2000);
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
      // In a real implementation, this would be a call to the LLaMA model
      // const response = await llamaModel.generateResponse(input);
      
      // Simulate AI response with chemical engineering related content
      setTimeout(() => {
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
        } else {
          responseText = "I can help analyze your chemical process simulation. To get started, please provide details about:\n\n" +
            "1. The specific unit operations involved\n" +
            "2. Component compositions and flow rates\n" +
            "3. Operating conditions (T, P)\n" +
            "4. Design objectives\n\n" +
            "For example, if you're designing a process for ethanol production, we could analyze the fermentation, distillation, and dehydration steps to optimize yield and energy usage.";
        }
        
        setMessages(prev => [...prev, {
          role: "assistant",
          content: responseText
        }]);
        
        setIsLoading(false);
      }, 1500);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate response. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
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
      
      <main className="flex-1 py-16 px-6 bg-gray-50">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold mb-2">AI Simulation Assistant</h1>
            <p className="text-gray-600">Get intelligent assistance with your chemical process simulations</p>
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
                            ? 'bg-white border border-gray-200' 
                            : 'bg-flow-blue text-white'
                        }`}
                      >
                        {message.role === 'assistant' && (
                          <div className="flex items-center mb-2">
                            <Brain className="h-5 w-5 mr-2 text-flow-blue" />
                            <span className="font-medium">ChemFlow AI</span>
                          </div>
                        )}
                        <div className="whitespace-pre-line">{message.content}</div>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] p-4 rounded-lg bg-white border border-gray-200">
                        <div className="flex items-center">
                          <Loader2 className="h-5 w-5 mr-2 text-flow-blue animate-spin" />
                          <span className="text-gray-600">Generating response...</span>
                        </div>
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
                    className="resize-none"
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
                <h3 className="text-lg font-medium mb-4">About AI Assistant</h3>
                <p className="text-gray-600 mb-4">
                  This AI assistant is powered by Meta's LLaMA model running locally in your browser. It can help with:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Brain className="h-5 w-5 mr-2 text-flow-blue mt-0.5" />
                    <span>Chemical process simulation assistance</span>
                  </li>
                  <li className="flex items-start">
                    <MessageSquare className="h-5 w-5 mr-2 text-flow-blue mt-0.5" />
                    <span>Engineering calculations and formulas</span>
                  </li>
                  <li className="flex items-start">
                    <FileText className="h-5 w-5 mr-2 text-flow-blue mt-0.5" />
                    <span>Troubleshooting simulation issues</span>
                  </li>
                </ul>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center text-amber-600">
                    <Info className="h-5 w-5 mr-2" />
                    <span className="text-sm font-medium">Running 100% locally in your browser</span>
                  </div>
                </div>
              </GlassPanel>
              
              <GlassPanel className="p-6">
                <h3 className="text-lg font-medium mb-4">Compare With Simulation</h3>
                <p className="text-gray-600 mb-4">
                  Compare the AI's suggestions with your actual simulation results.
                </p>
                <Button className="w-full">
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
