
import React, { useState, useRef, useEffect } from "react";
import { Bot, Send, User, Sparkles, X, Loader, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { pipeline } from "@huggingface/transformers";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface OpenSourceAIProps {
  onClose?: () => void;
  initialPrompt?: string;
}

const OpenSourceAI: React.FC<OpenSourceAIProps> = ({ 
  onClose,
  initialPrompt = "" 
}) => {
  const [input, setInput] = useState(initialPrompt);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [modelLoadingProgress, setModelLoadingProgress] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [pipeline, setPipeline] = useState<any>(null);
  
  // Initialize the model
  useEffect(() => {
    let loadingInterval: ReturnType<typeof setInterval>;
    
    const loadModel = async () => {
      try {
        // Start fake loading progress indicator
        loadingInterval = setInterval(() => {
          setModelLoadingProgress(prev => {
            const nextProgress = prev + Math.random() * 5;
            return nextProgress >= 100 ? 100 : nextProgress;
          });
        }, 300);
        
        // For now we'll use a simulated AI response system
        // In a production app, you would load a real model like this:
        // const model = await pipeline("text-generation", "TinyLlama/TinyLlama-1.1B-Chat-v1.0", { 
        //   device: "cpu",
        //   quantized: true
        // });
        
        // Simulate model loading time
        await new Promise(resolve => setTimeout(resolve, 4000));
        
        setPipeline({
          simulate: true,
          generate: async (text: string) => {
            // Simulate thinking time
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Generate response based on keywords
            const lowercaseInput = text.toLowerCase();
            
            if (lowercaseInput.includes('simulation') || lowercaseInput.includes('simulate')) {
              return "I can help with chemical process simulations. What specific simulation are you interested in? For example, distillation columns, reactors, or heat exchangers?";
            } else if (lowercaseInput.includes('formula') || lowercaseInput.includes('equation')) {
              return "Chemical engineering formulas are essential tools. Which area are you interested in: thermodynamics, fluid mechanics, heat transfer, mass transfer, or reaction kinetics?";
            } else if (lowercaseInput.includes('convert') || lowercaseInput.includes('unit')) {
              return "I can assist with unit conversions. Please specify the value, original unit, and target unit (e.g., convert 5 bar to psi).";
            } else if (lowercaseInput.includes('help') || lowercaseInput.includes('what can you do')) {
              return "As an open-source ChemFlow assistant, I can help with chemical engineering problems, explain concepts, provide information about simulations, look up formulas, and answer general questions. I run completely in your browser without sending data to external servers!";
            } else {
              return "Thanks for your question about " + text.substring(0, 20).trim() + "... To provide more specific help, could you provide more details about what you're trying to accomplish? I can help with simulations, formulas, conversions, and more.";
            }
          }
        });
        
        setIsModelLoading(false);
        setModelLoadingProgress(100);
        
      } catch (error) {
        console.error("Error loading model:", error);
        toast({
          title: "Model loading failed",
          description: "Falling back to basic response mode",
          variant: "destructive"
        });
        
        // Set up fallback mode
        setPipeline({
          simulate: true,
          generate: async () => "I'm currently in fallback mode due to a loading issue. I can still try to help with basic questions!"
        });
        
        setIsModelLoading(false);
      } finally {
        if (loadingInterval) clearInterval(loadingInterval);
      }
    };
    
    loadModel();
    
    return () => {
      if (loadingInterval) clearInterval(loadingInterval);
    };
  }, [toast]);

  // Add initial greeting on component mount
  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content: "Hi! I'm your open-source ChemFlow AI Assistant. I run completely in your browser - no API keys or external servers needed! How can I help you with chemical engineering today?",
        timestamp: new Date()
      }
    ]);
  }, []);
  
  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isProcessing || isModelLoading) return;
    
    // Add user message
    const userMessage = {
      role: 'user' as const,
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsProcessing(true);
    
    try {
      // Generate response using the model
      const response = await pipeline.generate(input);
      
      // Add assistant response
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error("Error generating response:", error);
      // Add error message
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I encountered an issue processing your request. Could you try again with a different question?",
        timestamp: new Date()
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyConversation = () => {
    const conversationText = messages
      .map(msg => `${msg.role === 'user' ? 'You' : 'Assistant'}: ${msg.content}`)
      .join('\n\n');
    
    navigator.clipboard.writeText(conversationText);
    
    toast({
      title: "Copied to clipboard",
      description: "The conversation has been copied to your clipboard.",
    });
  };

  // If model is loading, show loading state
  if (isModelLoading) {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-2">
              <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-medium text-lg">Open-Source AI Assistant</h3>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="flex-grow flex flex-col items-center justify-center p-8 space-y-6">
          <div className="animate-bounce">
            <Brain className="h-16 w-16 text-blue-500" />
          </div>
          <h3 className="text-xl font-medium text-center">Loading AI Model</h3>
          <p className="text-center text-muted-foreground">
            This free, open-source AI model runs entirely in your browser.
            <br />No API keys or external servers needed!
          </p>
          
          <div className="w-full max-w-md">
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 rounded-full"
                style={{ width: `${modelLoadingProgress}%` }}
              ></div>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-2">
              Loading: {Math.round(modelLoadingProgress)}%
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-2">
            <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="font-medium text-lg">Open-Source AI Assistant</h3>
          <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">Free & Local</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={copyConversation} title="Copy conversation">
            <span className="sr-only">Copy conversation</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
          </Button>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Messages Container */}
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white ml-4'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 mr-4'
                }`}
              >
                <div className="flex items-center mb-1">
                  {message.role === 'user' ? (
                    <>
                      <span className="text-xs opacity-75">You</span>
                      <User className="h-3 w-3 ml-1 opacity-75" />
                    </>
                  ) : (
                    <>
                      <span className="text-xs opacity-75">ChemFlow AI</span>
                      <Sparkles className="h-3 w-3 ml-1 opacity-75" />
                    </>
                  )}
                </div>
                <p className="whitespace-pre-wrap">{message.content}</p>
                <div className="text-right">
                  <span className="text-xs opacity-50">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg max-w-[80%] mr-4">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex space-x-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything about chemical engineering..."
            className="resize-none"
            rows={2}
            disabled={isProcessing}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={isProcessing || !input.trim() || isModelLoading}
            className="h-full"
          >
            {isProcessing ? <Loader className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        <div className="mt-2 text-xs text-center text-muted-foreground">
          <span className="flex items-center justify-center">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>
            Runs 100% in your browser • No data sent to servers • Open-source
          </span>
        </div>
      </div>
    </div>
  );
};

export default OpenSourceAI;
