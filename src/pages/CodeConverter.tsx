
import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import GlassPanel from "@/components/ui/GlassPanel";
import PythonCompiler from "@/components/tools/PythonCompiler";
import { Loader2 } from "lucide-react";

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

    // More comprehensive MATLAB to Python conversion
    setTimeout(() => {
      let converted = matlabCode;
      
      // Add required Python imports
      const imports = [];
      
      if (
        converted.includes("linspace") || 
        converted.includes("zeros") || 
        converted.includes("ones") ||
        converted.match(/\.\*/) ||
        converted.match(/\.\//) ||
        converted.match(/\.\^/)
      ) {
        imports.push("import numpy as np");
      }
      
      if (
        converted.includes("plot") || 
        converted.includes("figure") || 
        converted.includes("title") || 
        converted.includes("xlabel") || 
        converted.includes("ylabel") || 
        converted.includes("grid on")
      ) {
        imports.push("import matplotlib.pyplot as plt");
      }
      
      // Handle comments
      converted = converted.replace(/%/g, "#");
      
      // Handle common MATLAB functions
      converted = converted
        // MATLAB initialization functions
        .replace(/(\w+)\s*=\s*zeros\((\d+),\s*(\d+)\)/g, "$1 = np.zeros(($2, $3))")
        .replace(/(\w+)\s*=\s*zeros\((\d+)\)/g, "$1 = np.zeros($2)")
        .replace(/(\w+)\s*=\s*ones\((\d+),\s*(\d+)\)/g, "$1 = np.ones(($2, $3))")
        .replace(/(\w+)\s*=\s*ones\((\d+)\)/g, "$1 = np.ones($2)")
        .replace(/linspace\(([^,]+),\s*([^,]+),\s*([^)]+)\)/g, "np.linspace($1, $2, $3)")
        
        // MATLAB element-wise operations
        .replace(/(\w+)\.\/(\w+)/g, "$1 / $2")
        .replace(/(\w+)\.\*(\w+)/g, "$1 * $2")
        .replace(/(\w+)\.\^(\w+)/g, "$1 ** $2")
        
        // MATLAB functions with direct NumPy equivalents
        .replace(/(\w+)\s*=\s*sqrt\(([^)]+)\)/g, "$1 = np.sqrt($2)")
        .replace(/(\w+)\s*=\s*abs\(([^)]+)\)/g, "$1 = np.abs($2)")
        .replace(/(\w+)\s*=\s*sin\(([^)]+)\)/g, "$1 = np.sin($2)")
        .replace(/(\w+)\s*=\s*cos\(([^)]+)\)/g, "$1 = np.cos($2)")
        .replace(/(\w+)\s*=\s*tan\(([^)]+)\)/g, "$1 = np.tan($2)")
        .replace(/(\w+)\s*=\s*exp\(([^)]+)\)/g, "$1 = np.exp($2)")
        .replace(/(\w+)\s*=\s*log\(([^)]+)\)/g, "$1 = np.log($2)")
        
        // MATLAB plotting commands
        .replace(/figure;?/g, "plt.figure()")
        .replace(/plot\(([^,]+),\s*([^,]+)(,\s*'[^']+')?.*\);/g, "plt.plot($1, $2$3)")
        .replace(/xlabel\('([^']+)'\);/g, "plt.xlabel('$1')")
        .replace(/ylabel\('([^']+)'\);/g, "plt.ylabel('$1')")
        .replace(/title\('([^']+)'\);/g, "plt.title('$1')")
        .replace(/hold on;?/g, "# No need for hold on in matplotlib")
        .replace(/grid on;?/g, "plt.grid(True)")
        .replace(/leg\(([^)]+)\);/g, "plt.legend([$1])")
        .replace(/legend\(([^)]+)\);/g, "plt.legend([$1])")
        
        // MATLAB console output
        .replace(/fprintf\('([^']+)\\n',\s*([^)]+)\);/g, "print(f'$1', $2)")
        .replace(/disp\(([^)]+)\);/g, "print($1)")
        
        // MATLAB functions and control structures
        .replace(/function\s+(\w+)\s*=\s*(\w+)\((.*?)\)/g, "def $2($3):")
        .replace(/function\s+(\w+)\((.*?)\)/g, "def $1($2):")
        .replace(/if\s+([^)+\r\n]+)/g, "if $1:")
        .replace(/elseif\s+([^)\r\n]+)/g, "elif $1:")
        .replace(/else/g, "else:")
        .replace(/for\s+(\w+)\s*=\s*(\d+):(\d+)/g, "for $1 in range($2, $3+1):")
        .replace(/while\s+([^)\r\n]+)/g, "while $1:")
        
        // Remove MATLAB-specific syntax
        .replace(/end/g, "")
        .replace(/;(\s*\n|\s*$)/g, "$1")  // Remove semicolons at line ends
        
        // Clean up any leftover semicolons
        .replace(/;/g, "")
        
        // Special case for MATLAB's clc, clear commands
        .replace(/clc;?\s*clear;?\s*close all;?/, "# MATLAB clearing commands not needed in Python\n");
        
      // Add imports at the top if needed
      if (imports.length > 0) {
        converted = imports.join("\n") + "\n\n" + converted;
      }
      
      // Add a note about the conversion
      converted = "# Converted from MATLAB to Python\n" + converted;
      
      // Add plt.show() if there are plotting commands
      if (
        converted.includes("plt.plot") || 
        converted.includes("plt.figure")
      ) {
        converted += "\n\n# Display all plots\nplt.show()";
      }

      setPythonCode(converted);
      setIsConverting(false);
      toast({
        title: "Conversion Complete",
        description: "MATLAB code has been converted to Python. Some manual adjustment may be needed.",
      });
    }, 1000);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "Code has been copied to clipboard.",
    });
  };
  
  const loadSampleMatlabCode = () => {
    const sample = `% MATLAB Code for Counter-Flow Heat Exchanger Temperature Profile

clc; clear; close all;

% Given Data
m_hot = 2.5; % Hot fluid mass flow rate (kg/s)
m_cold = 3.0; % Cold fluid mass flow rate (kg/s)
Cp_hot = 4.18; % Specific heat capacity of hot fluid (kJ/kg.K)
Cp_cold = 4.18; % Specific heat capacity of cold fluid (kJ/kg.K)
T_hot_in = 150; % Inlet temperature of hot fluid (°C)
T_cold_in = 30; % Inlet temperature of cold fluid (°C)
T_hot_out = 80; % Outlet temperature of hot fluid (°C)
T_cold_out = 100; % Outlet temperature of cold fluid (°C)

% Define the temperature variation along the heat exchanger length
x = linspace(0, 1, 100); % Normalized length (0 to 1)
T_hot = T_hot_in - (T_hot_in - T_hot_out) * x;
T_cold = T_cold_in + (T_cold_out - T_cold_in) * x;

% Plot the temperature profiles
figure;
plot(x, T_hot, 'r', 'LineWidth', 2); hold on;
plot(x, T_cold, 'b', 'LineWidth', 2);
xlabel('Normalized Heat Exchanger Length');
ylabel('Temperature (°C)');
title('Counter-Flow Heat Exchanger Temperature Profile');
legend('Hot Fluid', 'Cold Fluid');
grid on;

% Display results
fprintf('Hot Fluid Outlet Temperature: %.2f °C\\n', T_hot_out);
fprintf('Cold Fluid Outlet Temperature: %.2f °C\\n', T_cold_out);`;
    
    setMatlabCode(sample);
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
            <PythonCompiler />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CodeConverter;
