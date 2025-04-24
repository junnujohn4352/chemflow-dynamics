
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Save, Download, Clipboard, RefreshCw, Code } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface CodeExample {
  title: string;
  description: string;
  code: string;
}

const PythonCompiler = () => {
  const [pythonCode, setPythonCode] = useState("");
  const [compiledOutput, setCompiledOutput] = useState("");
  const [isCompiling, setIsCompiling] = useState(false);
  const [savedCodes, setSavedCodes] = useState<{id: string, title: string, code: string}[]>([]);
  const [pythonVersion, setPythonVersion] = useState("3.10.0");

  // Load saved codes from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('chemflow-saved-python');
    if (saved) {
      try {
        setSavedCodes(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading saved Python code:", e);
      }
    }
  }, []);

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
          language: "python",
          version: pythonVersion,
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

  const saveCurrentCode = () => {
    if (!pythonCode.trim()) {
      toast({
        title: "Empty Code",
        description: "No code to save.",
        variant: "destructive",
      });
      return;
    }
    
    // Generate a title based on first line comment or code itself
    let title = "Code " + (savedCodes.length + 1);
    const firstLine = pythonCode.split('\n')[0].trim();
    if (firstLine.startsWith('#')) {
      title = firstLine.substring(1).trim();
    }
    
    const newSavedCode = {
      id: `code-${Date.now()}`,
      title,
      code: pythonCode
    };
    
    const updatedSavedCodes = [...savedCodes, newSavedCode];
    setSavedCodes(updatedSavedCodes);
    localStorage.setItem('chemflow-saved-python', JSON.stringify(updatedSavedCodes));
    
    toast({
      title: "Code Saved",
      description: "Your Python code has been saved.",
    });
  };

  const loadSavedCode = (id: string) => {
    const codeToLoad = savedCodes.find(item => item.id === id);
    if (codeToLoad) {
      setPythonCode(codeToLoad.code);
    }
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

  // Add example codes for chemistry
  const chemistryExamples: CodeExample[] = [
    {
      title: "Ideal Gas Law Calculator",
      description: "Calculate pressure, volume, or temperature using the ideal gas law",
      code: `# Ideal Gas Law Calculator (PV = nRT)
import math

def ideal_gas_law(pressure=None, volume=None, moles=None, temperature=None):
    """
    Calculate the missing variable in the ideal gas law equation.
    PV = nRT where:
    P = pressure (atm)
    V = volume (L)
    n = number of moles
    R = gas constant (0.08206 L·atm/(mol·K))
    T = temperature (K)
    """
    R = 0.08206  # L·atm/(mol·K)
    
    if pressure is None and all(x is not None for x in [volume, moles, temperature]):
        # Calculate pressure
        pressure = (moles * R * temperature) / volume
        print(f"Pressure = {pressure:.4f} atm")
        return pressure
        
    elif volume is None and all(x is not None for x in [pressure, moles, temperature]):
        # Calculate volume
        volume = (moles * R * temperature) / pressure
        print(f"Volume = {volume:.4f} L")
        return volume
        
    elif moles is None and all(x is not None for x in [pressure, volume, temperature]):
        # Calculate moles
        moles = (pressure * volume) / (R * temperature)
        print(f"Moles = {moles:.4f} mol")
        return moles
        
    elif temperature is None and all(x is not None for x in [pressure, volume, moles]):
        # Calculate temperature
        temperature = (pressure * volume) / (moles * R)
        print(f"Temperature = {temperature:.2f} K")
        return temperature
        
    else:
        print("Error: Exactly one variable must be None (unknown).")
        return None

# Example calculations
print("Example 1: Find pressure")
ideal_gas_law(pressure=None, volume=5.0, moles=1.5, temperature=298.0)

print("\\nExample 2: Find volume")
ideal_gas_law(pressure=2.5, volume=None, moles=1.0, temperature=350.0)

print("\\nExample 3: Find moles")
ideal_gas_law(pressure=1.0, volume=22.4, moles=None, temperature=273.15)

print("\\nExample 4: Find temperature")
ideal_gas_law(pressure=1.0, volume=30.0, moles=1.0, temperature=None)`
    },
    {
      title: "Chemical Reaction Balancer",
      description: "Balance chemical equations using matrices",
      code: `# Chemical Equation Balancer
import numpy as np
from sympy import Matrix, lcm

def parse_formula(formula):
    """Parse a chemical formula into a dictionary of elements and their counts."""
    i = 0
    elements = {}
    
    while i < len(formula):
        # Find element symbol (uppercase followed by optional lowercase)
        if formula[i].isupper():
            j = i + 1
            while j < len(formula) and formula[j].islower():
                j += 1
                
            element = formula[i:j]
            
            # Find coefficient (numbers following the element)
            coef = ""
            while j < len(formula) and formula[j].isdigit():
                coef += formula[j]
                j += 1
                
            count = int(coef) if coef else 1
            
            # Add to our dictionary
            if element in elements:
                elements[element] += count
            else:
                elements[element] = count
                
            i = j
        else:
            i += 1
            
    return elements

def balance_equation(reactants, products):
    """Balance a chemical equation given lists of reactants and products."""
    # Get all unique elements
    all_elements = set()
    for compound in reactants + products:
        elements = parse_formula(compound)
        all_elements.update(elements.keys())
        
    all_elements = sorted(list(all_elements))
    
    # Create the matrix
    n_compounds = len(reactants) + len(products)
    A = np.zeros((len(all_elements), n_compounds))
    
    # Fill the matrix with element counts
    for i, element in enumerate(all_elements):
        for j, compound in enumerate(reactants):
            elements = parse_formula(compound)
            if element in elements:
                A[i, j] = elements[element]
                
        for j, compound in enumerate(products):
            elements = parse_formula(compound)
            if element in elements:
                # Products have negative coefficients
                A[i, j + len(reactants)] = -elements[element]
    
    # Convert to SymPy Matrix to find null space
    A_sympy = Matrix(A)
    nullspace = A_sympy.nullspace()
    
    if not nullspace:
        return "No solution found"
    
    # Get the coefficients (the first vector in the nullspace)
    coeffs = nullspace[0]
    
    # Convert to integers by multiplying by the LCM of the denominators
    def denom(x):
        return x.q if x.is_Rational else 1
        
    lcm_val = 1
    for c in coeffs:
        if c != 0:
            lcm_val = lcm(lcm_val, denom(c))
            
    coeffs = [int(c * lcm_val) for c in coeffs]
    
    # Make sure all coefficients are positive and find GCD
    if any(c < 0 for c in coeffs):
        coeffs = [-c for c in coeffs]
        
    from math import gcd
    from functools import reduce
    def find_gcd(numbers):
        return reduce(gcd, numbers)
        
    divisor = find_gcd([abs(c) for c in coeffs if c != 0])
    coeffs = [c // divisor for c in coeffs]
    
    # Build the balanced equation string
    reactant_part = " + ".join(
        f"{'' if c == 1 else c}{r}" 
        for c, r in zip(coeffs[:len(reactants)], reactants)
    )
    
    product_part = " + ".join(
        f"{'' if c == 1 else c}{p}" 
        for c, p in zip(coeffs[len(reactants):], products)
    )
    
    return f"{reactant_part} → {product_part}"

# Example usage
try:
    print("Example 1: Hydrogen + Oxygen → Water")
    print(balance_equation(["H2", "O2"], ["H2O"]))
    
    print("\\nExample 2: Combustion of methane")
    print(balance_equation(["CH4", "O2"], ["CO2", "H2O"]))
    
    print("\\nExample 3: Ammonia synthesis")
    print(balance_equation(["N2", "H2"], ["NH3"]))
    
    print("\\nExample 4: Iron + Hydrochloric acid")
    print(balance_equation(["Fe", "HCl"], ["FeCl3", "H2"]))
except Exception as e:
    print(f"An error occurred: {e}")`
    },
    {
      title: "Thermodynamics Calculator",
      description: "Calculate thermodynamic properties",
      code: `# Thermodynamics Calculator
import math

class ThermodynamicsCalculator:
    def __init__(self):
        self.R = 8.314  # J/(mol·K)
        
    def calculate_enthalpy_change(self, delta_h_products, delta_h_reactants, coefficients_products, coefficients_reactants):
        """Calculate the enthalpy change of a reaction."""
        enthalpy_products = sum(h * c for h, c in zip(delta_h_products, coefficients_products))
        enthalpy_reactants = sum(h * c for h, c in zip(delta_h_reactants, coefficients_reactants))
        return enthalpy_products - enthalpy_reactants
    
    def calculate_entropy_change(self, delta_s_products, delta_s_reactants, coefficients_products, coefficients_reactants):
        """Calculate the entropy change of a reaction."""
        entropy_products = sum(s * c for s, c in zip(delta_s_products, coefficients_products))
        entropy_reactants = sum(s * c for s, c in zip(delta_s_reactants, coefficients_reactants))
        return entropy_products - entropy_reactants
    
    def gibbs_free_energy(self, delta_h, delta_s, temperature):
        """Calculate the Gibbs free energy change."""
        return delta_h - temperature * delta_s
    
    def equilibrium_constant(self, delta_g, temperature):
        """Calculate the equilibrium constant from Gibbs free energy."""
        return math.exp(-delta_g / (self.R * temperature))
    
    def clausius_clapeyron(self, p1, t1, delta_h_vap, t2):
        """
        Use the Clausius-Clapeyron equation to calculate vapor pressure at temperature t2
        given pressure p1 at temperature t1 and the enthalpy of vaporization.
        """
        return p1 * math.exp((delta_h_vap / self.R) * ((1 / t1) - (1 / t2)))
    
    def heat_capacity_ratio(self, heat_capacity_constant_p, heat_capacity_constant_v):
        """Calculate the ratio of heat capacities (γ = Cp/Cv)."""
        return heat_capacity_constant_p / heat_capacity_constant_v

# Example usage
calc = ThermodynamicsCalculator()

# Example 1: Enthalpy change of a reaction
print("Example 1: Enthalpy change of combustion of methane (CH₄ + 2O₂ → CO₂ + 2H₂O)")
delta_h_products = [-393.5, -285.8]  # kJ/mol (CO2, H2O)
delta_h_reactants = [-74.8, 0]       # kJ/mol (CH4, O2)
coefficients_products = [1, 2]       # (CO2, H2O)
coefficients_reactants = [1, 2]      # (CH4, O2)

delta_h = calc.calculate_enthalpy_change(
    delta_h_products, delta_h_reactants, 
    coefficients_products, coefficients_reactants
)
print(f"Delta H = {delta_h} kJ/mol")

# Example 2: Gibbs free energy and equilibrium constant
print("\\nExample 2: Gibbs free energy and equilibrium constant")
delta_s = calc.calculate_entropy_change(
    [213.6, 69.9], [186.2, 205.0], [1, 2], [1, 2]
)  # J/(mol·K)
delta_h = delta_h * 1000  # Convert to J/mol
temperature = 298.15  # K

delta_g = calc.gibbs_free_energy(delta_h, delta_s, temperature)
k_eq = calc.equilibrium_constant(delta_g, temperature)

print(f"Delta S = {delta_s} J/(mol·K)")
print(f"Delta G at {temperature} K = {delta_g/1000:.2f} kJ/mol")
print(f"Equilibrium constant K = {k_eq:.2e}")

# Example 3: Clausius-Clapeyron equation
print("\\nExample 3: Vapor pressure of water")
p1 = 1.0  # atm at 373.15 K (100°C)
t1 = 373.15  # K
delta_h_vap = 40.65 * 1000  # J/mol
t2 = 393.15  # K (120°C)

p2 = calc.clausius_clapeyron(p1, t1, delta_h_vap, t2)
print(f"Vapor pressure at {t2} K = {p2:.2f} atm")`
    }
  ];

  const loadExampleCode = (example: CodeExample) => {
    setPythonCode(example.code);
    toast({
      title: example.title,
      description: example.description,
    });
  };

  const clearCode = () => {
    setPythonCode("");
    setCompiledOutput("");
  };

  const downloadCode = () => {
    if (!pythonCode.trim()) {
      toast({
        title: "Empty Code",
        description: "No code to download.",
        variant: "destructive",
      });
      return;
    }
    
    const blob = new Blob([pythonCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chemflow_python_code.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Code Downloaded",
      description: "Your Python code has been downloaded as a .py file.",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <Label htmlFor="python-input" className="text-lg font-medium flex items-center">
            Python Code
          </Label>
          <div className="flex flex-wrap gap-2">
            <Select
              value={pythonVersion}
              onValueChange={setPythonVersion}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Python Version" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3.10.0">Python 3.10.0</SelectItem>
                <SelectItem value="3.9.0">Python 3.9.0</SelectItem>
                <SelectItem value="3.8.0">Python 3.8.0</SelectItem>
                <SelectItem value="3.7.0">Python 3.7.0</SelectItem>
              </SelectContent>
            </Select>
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
        
        {chemistryExamples.length > 0 && (
          <div className="mt-4 mb-4">
            <Label className="block mb-2">Chemistry Examples:</Label>
            <div className="flex flex-wrap gap-2">
              {chemistryExamples.map((example, index) => (
                <Button 
                  key={index}
                  variant="secondary" 
                  size="sm"
                  onClick={() => loadExampleCode(example)}
                  className="flex items-center"
                >
                  <Code className="h-3 w-3 mr-1" />
                  {example.title}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2 mt-4">
          <Button 
            className="flex-1 flex items-center justify-center gap-2" 
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
          
          <Button 
            variant="outline"
            onClick={saveCurrentCode}
            disabled={isCompiling || !pythonCode.trim()}
            className="flex items-center"
          >
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
          
          <Button 
            variant="outline"
            onClick={downloadCode}
            disabled={isCompiling || !pythonCode.trim()}
            className="flex items-center"
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        </div>
        
        {savedCodes.length > 0 && (
          <div className="mt-4">
            <Label className="block mb-2">Saved Code:</Label>
            <div className="flex flex-wrap gap-2">
              {savedCodes.map((item) => (
                <Button 
                  key={item.id}
                  variant="outline" 
                  size="sm"
                  onClick={() => loadSavedCode(item.id)}
                >
                  {item.title}
                </Button>
              ))}
            </div>
          </div>
        )}
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
            className="flex items-center"
          >
            <Clipboard className="h-4 w-4 mr-1" />
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
        {isCompiling && (
          <div className="flex justify-center items-center mt-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="ml-2 text-blue-500">Executing Python code...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PythonCompiler;
