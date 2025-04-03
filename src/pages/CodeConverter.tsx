
import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import GlassPanel from "@/components/ui/GlassPanel";

const CodeConverter = () => {
  const [matlabCode, setMatlabCode] = useState("");
  const [pythonCode, setPythonCode] = useState("");
  const [pythonInput, setPythonInput] = useState("");
  const [compiledOutput, setCompiledOutput] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);

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

    // Simulate conversion (in a real app, this would call an API)
    setTimeout(() => {
      // Basic MATLAB to Python conversion examples
      let converted = matlabCode
        .replace(/(\w+)\s*=\s*zeros\((\d+),\s*(\d+)\)/g, '$1 = np.zeros(($2, $3))')
        .replace(/(\w+)\s*=\s*ones\((\d+),\s*(\d+)\)/g, '$1 = np.ones(($2, $3))')
        .replace(/(\w+)\.\/(\w+)/g, '$1/$2')
        .replace(/(\w+)\.\*(\w+)/g, '$1*$2')
        .replace(/\%/g, '#')
        .replace(/end/g, '')
        .replace(/function\s+(\w+)\s*=\s*(\w+)\((.*?)\)/g, 'def $2($3):');

      // Add numpy import if needed
      if (converted.includes('np.')) {
        converted = 'import numpy as np\n\n' + converted;
      }

      setPythonCode(converted);
      setIsConverting(false);
      toast({
        title: "Conversion Complete",
        description: "MATLAB code has been converted to Python.",
      });
    }, 1500);
  };

  const handlePythonCompile = () => {
    if (!pythonInput.trim()) {
      toast({
        title: "Empty Input",
        description: "Please enter Python code to compile.",
        variant: "destructive",
      });
      return;
    }

    setIsCompiling(true);

    // Simulate compilation (in a real app, this would call an API)
    setTimeout(() => {
      try {
        // Simple syntax check simulation
        if (pythonInput.includes('import') || pythonInput.includes('def ') || pythonInput.includes('print(')) {
          // Simulate successful compilation
          const output = "# Compilation successful\n# Bytecode generated\n\n# Output preview:\n";
          let previewOutput = output;
          
          // Simulate output of simple print statements
          const printMatches = pythonInput.match(/print\((.*?)\)/g);
          if (printMatches) {
            printMatches.forEach(match => {
              const content = match.substring(6, match.length - 1);
              previewOutput += `${content.replace(/["']/g, '')}\n`;
            });
          } else {
            previewOutput += "No print statements found for preview.";
          }
          
          setCompiledOutput(previewOutput);
          toast({
            title: "Compilation Successful",
            description: "Python code compiled successfully.",
          });
        } else {
          throw new Error("Invalid Python syntax or insufficient code.");
        }
      } catch (error) {
        setCompiledOutput(`# Compilation Error:\n${error.message}\n\n# Please check your code for syntax errors.`);
        toast({
          title: "Compilation Failed",
          description: error.message,
          variant: "destructive",
        });
      }
      setIsCompiling(false);
    }, 1500);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "Code has been copied to clipboard.",
    });
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
            Convert MATLAB code to Python or compile and analyze Python code with our advanced tools.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 relative z-10">
            <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700 shadow-sm hover:shadow transform hover:scale-105 transition-all">
              MATLAB to Python
            </span>
            <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 shadow-sm hover:shadow transform hover:scale-105 transition-all">
              Python Compiler
            </span>
            <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 shadow-sm hover:shadow transform hover:scale-105 transition-all">
              Syntax Analysis
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
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setMatlabCode("")}
                    disabled={!matlabCode}
                  >
                    Clear
                  </Button>
                </div>
                <Textarea
                  id="matlab-code"
                  className="min-h-[400px] font-mono text-sm"
                  placeholder="Paste your MATLAB code here..."
                  value={matlabCode}
                  onChange={(e) => setMatlabCode(e.target.value)}
                />
                <Button 
                  className="w-full mt-4" 
                  onClick={handleMatlabToPython}
                  disabled={isConverting || !matlabCode.trim()}
                >
                  {isConverting ? "Converting..." : "Convert to Python"}
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
                    Copy
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GlassPanel className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <Label htmlFor="python-input" className="text-lg font-medium flex items-center">
                    <Code className="mr-2 h-5 w-5 text-blue-500" /> Python Code
                  </Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPythonInput("")}
                    disabled={!pythonInput}
                  >
                    Clear
                  </Button>
                </div>
                <Textarea
                  id="python-input"
                  className="min-h-[400px] font-mono text-sm"
                  placeholder="Enter Python code to compile..."
                  value={pythonInput}
                  onChange={(e) => setPythonInput(e.target.value)}
                />
                <Button 
                  className="w-full mt-4" 
                  onClick={handlePythonCompile}
                  disabled={isCompiling || !pythonInput.trim()}
                >
                  {isCompiling ? "Compiling..." : "Compile Python"}
                </Button>
              </GlassPanel>

              <GlassPanel className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <Label htmlFor="compiled-output" className="text-lg font-medium flex items-center">
                    <Code className="mr-2 h-5 w-5 text-green-500" /> Compilation Output
                  </Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => copyToClipboard(compiledOutput)}
                    disabled={!compiledOutput}
                  >
                    Copy
                  </Button>
                </div>
                <Textarea
                  id="compiled-output"
                  className="min-h-[400px] font-mono text-sm"
                  placeholder="Compilation output will appear here..."
                  value={compiledOutput}
                  readOnly
                />
              </GlassPanel>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CodeConverter;
