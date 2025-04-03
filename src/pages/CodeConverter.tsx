
import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Code, Copy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import GlassPanel from "@/components/ui/GlassPanel";
import PythonCompiler from "@/components/tools/PythonCompiler";
import { convertMatlabToPython, getSampleMatlabCode } from "@/utils/matlabToPythonConverter";

const CodeConverter = () => {
  const [matlabCode, setMatlabCode] = useState("");
  const [pythonCode, setPythonCode] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  
  const handleClear = () => {
    setMatlabCode("");
    setPythonCode("");
  };

  const handleMatlabToPython = () => {
    if (!matlabCode.trim()) {
      toast({
        title: "Empty Input",
        description: "Please enter MATLAB code to convert.",
        variant: "destructive",
      });
      return;
    }

    setIsConverting(true);

    // Use setTimeout to avoid blocking the UI during conversion
    setTimeout(() => {
      try {
        const converted = convertMatlabToPython(matlabCode);
        setPythonCode(converted);
        toast({
          title: "Conversion Complete",
          description: "MATLAB code has been converted to Python. Some manual adjustment may be needed.",
        });
      } catch (error) {
        console.error("Conversion error:", error);
        toast({
          title: "Conversion Error",
          description: "An error occurred during conversion. Please check your MATLAB code syntax.",
          variant: "destructive",
        });
        setPythonCode("# Error occurred during conversion. Please check your MATLAB code syntax.");
      } finally {
        setIsConverting(false);
      }
    }, 800);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "Code has been copied to clipboard.",
    });
  };
  
  const loadSampleMatlabCode = () => {
    setMatlabCode(getSampleMatlabCode());
  };

  return (
    <Layout>
      <div className="py-10 px-6 max-w-screen-xl mx-auto animate-fade-in">
        <div className="mb-8 relative">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
          <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: "2s" }}></div>
          
          <h1 className="text-4xl font-display font-bold mb-4 bg-gradient-to-r from-purple-500 to-blue-700 bg-clip-text text-transparent relative z-10">
            Code Converter & Compiler
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl relative z-10">
            Convert MATLAB code to Python or compile and execute Python code with our advanced tools.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 relative z-10">
            <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700 shadow-sm hover:shadow transform hover:scale-105 transition-all">
              MATLAB to Python
            </span>
            <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 shadow-sm hover:shadow transform hover:scale-105 transition-all">
              Python Compiler
            </span>
            <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 shadow-sm hover:shadow transform hover:scale-105 transition-all">
              Live Code Execution
            </span>
          </div>
        </div>

        <Tabs defaultValue="matlab-python" className="relative z-10">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="matlab-python" className="text-base">MATLAB to Python</TabsTrigger>
            <TabsTrigger value="python-compiler" className="text-base">Python Compiler</TabsTrigger>
          </TabsList>

          <TabsContent value="matlab-python">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GlassPanel className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <Label htmlFor="matlab-code" className="text-lg font-medium flex items-center">
                    <Code className="mr-2 h-5 w-5 text-purple-500" /> MATLAB Code
                  </Label>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={loadSampleMatlabCode}
                      disabled={isConverting}
                    >
                      Load Sample
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleClear}
                      disabled={isConverting || (!matlabCode && !pythonCode)}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
                <Textarea
                  id="matlab-code"
                  className="min-h-[400px] font-mono text-sm"
                  placeholder="Paste your MATLAB code here..."
                  value={matlabCode}
                  onChange={(e) => setMatlabCode(e.target.value)}
                  disabled={isConverting}
                />
                <Button 
                  className="w-full mt-4 flex items-center justify-center gap-2" 
                  onClick={handleMatlabToPython}
                  disabled={isConverting || !matlabCode.trim()}
                >
                  {isConverting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Converting...
                    </>
                  ) : (
                    "Convert to Python"
                  )}
                </Button>
              </GlassPanel>

              <GlassPanel className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <Label htmlFor="python-code" className="text-lg font-medium flex items-center">
                    <Code className="mr-2 h-5 w-5 text-blue-500" /> Python Code
                  </Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => copyToClipboard(pythonCode)}
                    disabled={!pythonCode}
                  >
                    <Copy className="h-4 w-4 mr-1" /> Copy
                  </Button>
                </div>
                <Textarea
                  id="python-code"
                  className="min-h-[400px] font-mono text-sm"
                  placeholder="Converted Python code will appear here..."
                  value={pythonCode}
                  readOnly
                />
              </GlassPanel>
            </div>
          </TabsContent>

          <TabsContent value="python-compiler">
            <PythonCompiler />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CodeConverter;
