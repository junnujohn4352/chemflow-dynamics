
import React, { useState, useRef, useEffect } from "react";
import { Bot, Send, User, Sparkles, X, Copy, DownloadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChemAssistantProps {
  onClose?: () => void;
  initialPrompt?: string;
  onSimulationCreate?: (simulationData: any) => void;
}

const ChemAssistant: React.FC<ChemAssistantProps> = ({ 
  onClose, 
  initialPrompt = "",
  onSimulationCreate 
}) => {
  const [input, setInput] = useState(initialPrompt);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Sample responses based on keywords for demonstration purposes
  const sampleResponses = {
    simulation: "I can help you set up a simulation. What process would you like to simulate? For example, distillation column, reactor, or heat exchanger?",
    formula: "Which chemical engineering formula are you looking for? I can help with mass transfer, thermodynamics, reaction kinetics, and more.",
    convert: "What units would you like to convert? I can handle pressure, temperature, flow rate, and many other chemical engineering units.",
    help: "I'm your ChemFlow AI assistant! I can help with formulas, unit conversions, simulation setup, and answering chemical engineering questions.",
    default: "I'm analyzing your question. Could you provide more details about what you're trying to accomplish?"
  };

  useEffect(() => {
    // Auto-scroll to bottom when messages update
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Add initial greeting on component mount
  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content: "Hi! I'm your ChemFlow AI Assistant. I can help with chemical engineering problems, set up simulations, explain concepts, or answer questions. How can I assist you today?",
        timestamp: new Date()
      }
    ]);
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = {
      role: 'user' as const,
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsProcessing(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      let responseContent = sampleResponses.default;
      
      // Simple keyword matching for demo purposes
      const lowercaseInput = input.toLowerCase();
      if (lowercaseInput.includes('simulation') || lowercaseInput.includes('simulate')) {
        responseContent = sampleResponses.simulation;
        
        // If the user wants to create a simulation, provide that option
        if (lowercaseInput.includes('create') || lowercaseInput.includes('new') || lowercaseInput.includes('setup')) {
          responseContent += "\n\nWould you like me to help you set up a new simulation now?";
        }
      } else if (lowercaseInput.includes('formula') || lowercaseInput.includes('equation')) {
        responseContent = sampleResponses.formula;
      } else if (lowercaseInput.includes('convert') || lowercaseInput.includes('unit')) {
        responseContent = sampleResponses.convert;
      } else if (lowercaseInput.includes('help') || lowercaseInput.includes('what can you do')) {
        responseContent = sampleResponses.help;
      }
      
      // Add assistant response
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: responseContent,
        timestamp: new Date()
      }]);
      
      setIsProcessing(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const createSimulation = () => {
    toast({
      title: "Creating simulation",
      description: "Setting up a new simulation based on your input...",
    });
    
    // In a real implementation, this would process the conversation
    // and extract parameters for the simulation
    if (onSimulationCreate) {
      onSimulationCreate({
        title: "AI Generated Simulation",
        description: "Created from chat assistance",
        timestamp: new Date()
      });
    }
    
    if (onClose) onClose();
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

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-2">
            <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="font-medium text-lg">ChemFlow AI Assistant</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={copyConversation} title="Copy conversation">
            <Copy className="h-4 w-4" />
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
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
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
      
      {/* Action Buttons (optional) */}
      {messages.length > 1 && onSimulationCreate && (
        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-800">
          <Button
            variant="outline"
            size="sm"
            className="w-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 border-blue-200 dark:border-blue-800"
            onClick={createSimulation}
          >
            <DownloadCloud className="h-4 w-4 mr-2" />
            Create Simulation from Conversation
          </Button>
        </div>
      )}
      
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
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={isProcessing || !input.trim()}
            className="h-full"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChemAssistant;
