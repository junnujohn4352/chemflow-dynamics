
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const PythonCompiler = () => {
  const [pythonCode, setPythonCode] = useState("");
  const [compiledOutput, setCompiledOutput] = useState("");
  const [isCompiling, setIsCompiling] = useState(false);

  const handlePythonCompile = async () => {
    if (!pythonCode.trim()) {
      toast({
        title: "Empty Input",
        description: "Please enter Python code to execute.",
        variant: "destructive",
      });
      return;
    }

    setIsCompiling(true);
    
    try {
      // Use Piston API for code execution
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: "python3",
          version: "3.10.0",
          files: [
            {
              name: "main.py",
              content: pythonCode,
            },
          ],
          stdin: "",
          args: [],
          compile_timeout: 10000,
          run_timeout: 5000,
          compile_memory_limit: -1,
          run_memory_limit: -1,
        }),
      });

      const data = await response.json();
      
      if (data.run && data.run.output) {
        // Format the output
        let formattedOutput = "# Execution Output:\n\n";
        formattedOutput += data.run.output;
        
        // Show any compilation warnings if available
        if (data.compile && data.compile.stderr) {
          formattedOutput += "\n\n# Compilation Warnings:\n";
          formattedOutput += data.compile.stderr;
        }
        
        setCompiledOutput(formattedOutput);
        toast({
          title: "Execution Complete",
          description: "Python code executed successfully.",
        });
      } else if (data.run && data.run.stderr) {
        // Handle runtime errors
        setCompiledOutput(`# Runtime Error:\n${data.run.stderr}`);
        toast({
          title: "Execution Error",
          description: "There was an error running your code.",
          variant: "destructive",
        });
      } else if (data.message) {
        // Handle API errors
        setCompiledOutput(`# API Error:\n${data.message}`);
        toast({
          title: "API Error",
          description: data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error compiling Python:", error);
      setCompiledOutput(`# Error:\n${error.message || "Failed to connect to the code execution service"}`);
      toast({
        title: "Service Error",
        description: "Failed to connect to the code execution service.",
        variant: "destructive",
      });
    } finally {
      setIsCompiling(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "Code has been copied to clipboard.",
    });
  };

  // Sample code for new users
  const loadSampleCode = () => {
    const sampleCode = `# Python Sample Code
def calculate_fibonacci(n):
    if n <= 0:
        return []
    elif n == 1:
        return [0]
    
    fib = [0, 1]
    for i in range(2, n):
        fib.append(fib[i-1] + fib[i-2])
    
    return fib

# Generate and print first 10 Fibonacci numbers
result = calculate_fibonacci(10)
print("First 10 Fibonacci numbers:")
print(result)

# Calculate sum
print(f"Sum: {sum(result)}")`;
    
    setPythonCode(sampleCode);
  };

  const clearCode = () => {
    setPythonCode("");
    setCompiledOutput("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <Label htmlFor="python-input" className="text-lg font-medium flex items-center">
            Python Code
          </Label>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadSampleCode}
              disabled={isCompiling}
            >
              Load Sample
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearCode}
              disabled={isCompiling || (!pythonCode && !compiledOutput)}
            >
              Clear
            </Button>
          </div>
        </div>
        <Textarea
          id="python-input"
          className="min-h-[400px] font-mono text-sm"
          placeholder="Enter Python code to execute..."
          value={pythonCode}
          onChange={(e) => setPythonCode(e.target.value)}
          disabled={isCompiling}
        />
        <Button 
          className="w-full mt-4 flex items-center justify-center gap-2" 
          onClick={handlePythonCompile}
          disabled={isCompiling || !pythonCode.trim()}
        >
          {isCompiling ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Executing...
            </>
          ) : (
            "Execute Python Code"
          )}
        </Button>
      </div>

      <div className="p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <Label htmlFor="compiled-output" className="text-lg font-medium flex items-center">
            Execution Output
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
          placeholder="Execution output will appear here..."
          value={compiledOutput}
          readOnly
        />
      </div>
    </div>
  );
};

export default PythonCompiler;
