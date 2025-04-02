
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, AlertTriangle, RefreshCw, Loader2, Globe } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/components/ThemeProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import { LlamaService } from '@/services/LlamaService';
import { ThemeProvider } from "@/components/ThemeProvider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

<lov-add-dependency>react-markdown@9.0.1</lov-add-dependency>
<lov-add-dependency>react-syntax-highlighter@15.5.0</lov-add-dependency>

const AISimulation = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [temperature, setTemperature] = useState(0.5);
  const [topP, setTopP] = useState(0.9);
  const [seed, setSeed] = useState<number | null>(null);
  const [colabEndpoint, setColabEndpoint] = useState<string>('');
  const [showColabDialog, setShowColabDialog] = useState(false);
  const [isConnectedToColab, setIsConnectedToColab] = useState(false);
  const [llamaInstance, setLlamaInstance] = useState<LlamaService | null>(null);
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const initializeLlama = async () => {
      const instance = LlamaService.getInstance();
      setLlamaInstance(instance);
      setIsModelLoading(true);
      try {
        await instance.loadModel();
        
        // Check if there's a stored endpoint
        const storedEndpoint = localStorage.getItem('colabEndpoint');
        if (storedEndpoint) {
          setColabEndpoint(storedEndpoint);
          instance.setColabEndpoint(storedEndpoint);
          setIsConnectedToColab(true);
          toast({
            title: "Colab Connection Restored",
            description: "Using previously saved Colab endpoint.",
          });
        }
      } catch (error) {
        console.error("Failed to load the LLaMA model:", error);
        toast({
          title: "Error",
          description: "Failed to load the LLaMA model.",
          variant: "destructive",
        });
      } finally {
        setIsModelLoading(false);
      }
    };

    initializeLlama();
  }, []);

  const handleSend = useCallback(async () => {
    if (!message.trim()) return;

    setIsLoading(true);
    setResponse('');
    setIsCopied(false);

    try {
      if (!llamaInstance) {
        throw new Error("LLaMA model service not initialized.");
      }

      const response = await llamaInstance.generateResponse(message);
      setResponse(response);
    } catch (error: any) {
      console.error("Error generating response:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate response.",
        variant: "destructive",
      });
      setResponse(`Error: ${error.message || 'Failed to generate response.'}`);
    } finally {
      setIsLoading(false);
    }
  }, [message, llamaInstance, toast]);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(response);
    setIsCopied(true);
    toast({
      title: "Copied!",
      description: "Response copied to clipboard.",
    });
  };

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const handleConnectToColab = () => {
    if (!colabEndpoint || !llamaInstance) return;
    
    try {
      // Basic validation
      const url = new URL(colabEndpoint);
      
      // Set the endpoint in the service
      llamaInstance.setColabEndpoint(colabEndpoint);
      
      // Save to localStorage for persistence
      localStorage.setItem('colabEndpoint', colabEndpoint);
      
      setIsConnectedToColab(true);
      setShowColabDialog(false);
      
      toast({
        title: "Connected to Colab",
        description: "Your application is now configured to use the Colab-hosted Llama model.",
      });
    } catch (error) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL for the Colab endpoint.",
        variant: "destructive",
      });
    }
  };

  const handleDisconnectFromColab = () => {
    if (llamaInstance) {
      llamaInstance.setColabEndpoint("");
      localStorage.removeItem('colabEndpoint');
      setIsConnectedToColab(false);
      setColabEndpoint('');
      
      toast({
        title: "Disconnected from Colab",
        description: "Now using the built-in simulation.",
      });
    }
  };

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
  };

  const examples = [
    "Analyze the heat transfer in a reactor.",
    "Evaluate the fluid flow dynamics in a pipe.",
    "Assess the thermodynamic equilibrium of a mixture.",
    "Suggest improvements for a distillation column.",
    "Model the kinetics of a chemical reaction.",
    "Calculate the energy efficiency of a process.",
    "Estimate the economic viability of a plant.",
    "Identify potential environmental impacts."
  ];

  return (
    <ThemeProvider defaultTheme="system">
      <div className="flex flex-col h-screen">
        <div className="bg-gray-50 dark:bg-gray-900 py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">AI Simulation Assistant</h1>
            <div className="space-x-2">
              <Button variant="outline" size="sm" onClick={() => setShowColabDialog(true)}>
                <Globe className="mr-2 h-4 w-4" />
                {isConnectedToColab ? "Manage Colab" : "Connect to Colab"}
              </Button>
              <Button variant="outline" size="sm" onClick={toggleSettings}>
                Settings
              </Button>
              <Button size="sm" onClick={handleSend} disabled={isLoading || isModelLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  "Generate Response"
                )}
              </Button>
            </div>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Get real-time insights and analysis for your chemical processes.
            {isConnectedToColab && <Badge variant="secondary" className="ml-2">Connected to Colab</Badge>}
          </p>
        </div>

        <div className="flex-grow overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Input Message</h3>
                  <p className="text-sm text-gray-500">Enter your query or process details here.</p>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="e.g., Analyze the heat transfer in a reactor."
                    className="w-full h-32 resize-none"
                  />
                  <div className="mt-2 flex items-center space-x-2">
                    <Button onClick={handleSend} disabled={isLoading || isModelLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        "Generate Response"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <h3 className="text-lg font-semibold">Response</h3>
                  <p className="text-sm text-gray-500">
                    AI-generated analysis and insights.
                    <Badge variant="secondary" className="ml-2">
                      AI Generated
                    </Badge>
                  </p>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none">
                  {isModelLoading ? (
                    <div className="flex flex-col space-y-2">
                      <div className="h-4 w-[200px] bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                      <div className="h-4 w-[250px] bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                      <div className="h-4 w-[150px] bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                    </div>
                  ) : (
                    <ReactMarkdown
                      components={{
                        code({ node, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || '')
                          return !className?.includes('language-') ? (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          ) : (
                            <SyntaxHighlighter
                              style={dracula}
                              language={match?.[1] || ''}
                              PreTag="div"
                              {...props}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          )
                        }
                      }}
                    >
                      {response}
                    </ReactMarkdown>
                  )}
                </CardContent>
                <CardFooter className="justify-between">
                  <Button size="sm" variant="ghost" onClick={handleCopyClick} disabled={isCopied}>
                    {isCopied ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </Button>
                  <a href="https://www.example.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm">
                    Powered by AI
                  </a>
                </CardFooter>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Examples</h3>
                  <p className="text-sm text-gray-500">Try these prompts to get started.</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {examples.slice(0, 8).map((example, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-left font-normal"
                        onClick={() => setMessage(example)}
                      >
                        {example}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {isConnectedToColab && (
                <Card className="mt-4">
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Colab Connection</h3>
                    <p className="text-sm text-gray-500">Using external Llama model</p>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm">
                      <p>Status: <span className="text-green-500 font-medium">Connected</span></p>
                      <p className="mt-1 truncate">Endpoint: {colabEndpoint}</p>
                    </div>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="mt-3 w-full"
                      onClick={handleDisconnectFromColab}
                    >
                      Disconnect
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <SheetContent className="sm:max-w-sm" side="right">
            <SheetHeader>
              <SheetTitle>Settings</SheetTitle>
              <SheetDescription>
                Customize the AI Simulation Assistant to fit your needs.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="theme" className="text-right">
                  Theme
                </Label>
                <Select onValueChange={handleThemeChange} defaultValue={theme}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="temperature" className="text-right">
                  Temperature
                </Label>
                <Slider
                  id="temperature"
                  defaultValue={[temperature]}
                  max={1}
                  step={0.1}
                  onValueChange={(value) => setTemperature(value[0])}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="topP" className="text-right">
                  Top P
                </Label>
                <Slider
                  id="topP"
                  defaultValue={[topP]}
                  max={1}
                  step={0.1}
                  onValueChange={(value) => setTopP(value[0])}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="seed" className="text-right">
                  Seed
                </Label>
                <Input
                  type="number"
                  id="seed"
                  placeholder="Optional"
                  onChange={(e) => setSeed(e.target.value ? parseInt(e.target.value, 10) : null)}
                  className="col-span-3"
                />
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <Dialog open={showColabDialog} onOpenChange={setShowColabDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Connect to Google Colab</DialogTitle>
              <DialogDescription>
                Enter the URL of your Google Colab instance running Llama 2.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="colabUrl">
                  Colab Endpoint URL
                </Label>
                <Input
                  id="colabUrl"
                  placeholder="http://your-colab-url:5000"
                  value={colabEndpoint}
                  onChange={(e) => setColabEndpoint(e.target.value)}
                />
                <p className="text-sm text-gray-500">
                  This should be the full URL including port number (e.g., http://12.34.56.78:5000)
                </p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-950 p-3 rounded-md">
                <h4 className="font-medium flex items-center text-amber-800 dark:text-amber-300">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  How to get your Colab URL
                </h4>
                <ol className="text-sm mt-2 space-y-1 text-amber-700 dark:text-amber-400">
                  <li>1. Open Google Colab and run the Llama 2 notebook</li>
                  <li>2. Add the Flask code from the documentation</li>
                  <li>3. Use the Colab's external IP and port (usually 5000)</li>
                  <li>4. Make sure the Colab notebook stays running</li>
                </ol>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setShowColabDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" onClick={handleConnectToColab}>
                Connect
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ThemeProvider>
  );
};

export default AISimulation;
