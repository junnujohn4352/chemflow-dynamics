
/**
 * Utility for converting MATLAB code to Python
 */

/**
 * Detects required Python imports based on MATLAB code
 */
export const detectRequiredImports = (code: string): string[] => {
  const imports: string[] = [];
  
  // NumPy
  if (
    code.includes('zeros') || 
    code.includes('ones') || 
    code.includes('eye') ||
    code.includes('linspace') ||
    code.match(/\.\*/) ||
    code.match(/\.\//) ||
    code.match(/\.\^/) ||
    code.includes('sqrt(') ||
    code.includes('sin(') ||
    code.includes('cos(') ||
    code.includes('exp(') ||
    code.includes('log(') ||
    code.includes('abs(')
  ) {
    imports.push('import numpy as np');
  }
  
  // Matplotlib
  if (
    code.includes('plot(') || 
    code.includes('figure') || 
    code.includes('title(') || 
    code.includes('xlabel(') || 
    code.includes('ylabel(') || 
    code.includes('legend(') ||
    code.includes('grid on')
  ) {
    imports.push('import matplotlib.pyplot as plt');
  }
  
  return imports;
};

/**
 * Converts MATLAB code to Python
 */
export const convertMatlabToPython = (matlabCode: string): string => {
  // Detect required imports
  const imports = detectRequiredImports(matlabCode);
  
  // Split code into lines for better processing
  let lines = matlabCode.split('\n');
  let convertedLines: string[] = [];
  
  // Track indentation level for control structures
  let indentLevel = 0;
  let inFunction = false;
  let functionIndent = 0;
  
  // Process each line
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    
    // Skip empty lines but preserve them
    if (line === '') {
      convertedLines.push('');
      continue;
    }
    
    // Handle comments
    if (line.startsWith('%')) {
      convertedLines.push('# ' + line.substring(1));
      continue;
    }
    
    // Handle inline comments
    const commentIdx = line.indexOf('%');
    if (commentIdx > 0) {
      const code = line.substring(0, commentIdx).trim();
      const comment = line.substring(commentIdx + 1).trim();
      line = code + '  # ' + comment;
    }
    
    // Handle function declarations
    if (line.startsWith('function ')) {
      inFunction = true;
      functionIndent = indentLevel;
      
      // Extract function signature
      let funcName = '';
      let args = '';
      let returnVals = '';
      
      // Function with return values: function [out1, out2] = funcName(arg1, arg2)
      if (line.includes('[') && line.includes(']') && line.includes('=')) {
        const match = line.match(/function\s*\[(.*?)\]\s*=\s*(\w+)\s*\((.*?)\)/);
        if (match) {
          returnVals = match[1].split(',').map(v => v.trim()).join(', ');
          funcName = match[2];
          args = match[3];
          
          convertedLines.push('def ' + funcName + '(' + args + '):');
          // Add comment about return values
          convertedLines.push('    # Returns: ' + returnVals);
        }
      } 
      // Function without return value: function funcName(arg1, arg2)
      else if (line.includes('(')) {
        const match = line.match(/function\s+(\w+)\s*\((.*?)\)/);
        if (match) {
          funcName = match[1];
          args = match[2];
          
          convertedLines.push('def ' + funcName + '(' + args + '):');
        }
      }
      // Function with single return value: function out = funcName(arg1, arg2)  
      else if (line.includes('=')) {
        const match = line.match(/function\s+(\w+)\s*=\s*(\w+)\s*\((.*?)\)/);
        if (match) {
          returnVals = match[1];
          funcName = match[2];
          args = match[3];
          
          convertedLines.push('def ' + funcName + '(' + args + '):');
        }
      }
      
      indentLevel++;
      continue;
    }
    
    // Handle if statements
    if (line.startsWith('if ')) {
      const condition = line.substring(2).replace('==', '==').replace('~=', '!=').trim();
      convertedLines.push('    '.repeat(indentLevel) + 'if ' + condition + ':');
      indentLevel++;
      continue;
    }
    
    // Handle elseif statements
    if (line.startsWith('elseif ')) {
      indentLevel--;
      const condition = line.substring(6).replace('==', '==').replace('~=', '!=').trim();
      convertedLines.push('    '.repeat(indentLevel) + 'elif ' + condition + ':');
      indentLevel++;
      continue;
    }
    
    // Handle else statements
    if (line === 'else') {
      indentLevel--;
      convertedLines.push('    '.repeat(indentLevel) + 'else:');
      indentLevel++;
      continue;
    }
    
    // Handle for loops
    if (line.startsWith('for ')) {
      const forLoopMatch = line.match(/for\s+(\w+)\s*=\s*(.*)/);
      if (forLoopMatch) {
        const variable = forLoopMatch[1];
        const range = forLoopMatch[2].replace(';', '').trim();
        
        // Handle different types of ranges
        if (range.includes(':')) {
          const rangeParts = range.split(':');
          
          if (rangeParts.length === 2) {
            // Simple range: for i = 1:10
            const start = rangeParts[0];
            const end = rangeParts[1];
            convertedLines.push('    '.repeat(indentLevel) + 
              `for ${variable} in range(${start}, ${end}+1):`);
          } else if (rangeParts.length === 3) {
            // Range with step: for i = 1:2:10
            const start = rangeParts[0];
            const step = rangeParts[1];
            const end = rangeParts[2];
            convertedLines.push('    '.repeat(indentLevel) + 
              `for ${variable} in range(${start}, ${end}+1, ${step}):`);
          }
        } else {
          // Iterate over array: for i = array
          convertedLines.push('    '.repeat(indentLevel) + 
            `for ${variable} in ${range}:`);
        }
        
        indentLevel++;
        continue;
      }
    }
    
    // Handle while loops
    if (line.startsWith('while ')) {
      const condition = line.substring(5).replace('==', '==').replace('~=', '!=').trim();
      convertedLines.push('    '.repeat(indentLevel) + 'while ' + condition + ':');
      indentLevel++;
      continue;
    }
    
    // Handle end statements
    if (line === 'end') {
      indentLevel--;
      
      // If we're closing a function definition
      if (inFunction && indentLevel === functionIndent) {
        inFunction = false;
        convertedLines.push('');  // Add blank line after function
      }
      
      continue;
    }
    
    // Handle special MATLAB commands
    line = handleSpecialCommands(line);
    
    // Handle MATLAB specific functions
    line = handleMatlabFunctions(line);
    
    // Handle elementwise operations
    line = line.replace(/(\w+)\.\/(\w+)/g, '$1 / $2');
    line = line.replace(/(\w+)\.\*(\w+)/g, '$1 * $2');
    line = line.replace(/(\w+)\.\^(\w+)/g, '$1 ** $2');
    
    // Handle common math functions
    line = convertMathFunctions(line);
    
    // Handle disp and fprintf
    line = convertPrintStatements(line);
    
    // Remove semicolons at the end of lines
    if (line.endsWith(';')) {
      line = line.substring(0, line.length - 1);
    }
    
    // Add proper indentation and append to result
    convertedLines.push('    '.repeat(indentLevel) + line);
  }
  
  // Add imports at the top
  let result = '';
  if (imports.length > 0) {
    result += imports.join('\n') + '\n\n';
  }
  
  result += '# Converted from MATLAB to Python\n';
  result += convertedLines.join('\n');
  
  // Add plt.show() if there are plotting commands
  if (imports.includes('import matplotlib.pyplot as plt')) {
    result += '\n\n# Display all plots\nplt.show()';
  }
  
  return result;
};

/**
 * Handle special MATLAB commands like clear, clc
 */
const handleSpecialCommands = (line: string): string => {
  // Handle MATLAB clearing commands
  if (line === 'clc' || line === 'clear' || line === 'close all' || 
      line === 'clc;' || line === 'clear;' || line === 'close all;') {
    return '# ' + line + ' - MATLAB clearing command';
  }
  
  // Handle multiple clearing commands on one line
  if (line.includes('clc') && line.includes('clear')) {
    return '# MATLAB clearing commands not needed in Python';
  }
  
  return line;
};

/**
 * Convert MATLAB functions to their Python equivalents
 */
const handleMatlabFunctions = (line: string): string => {
  // Handle plot commands
  if (line.startsWith('plot(')) {
    line = line.replace('plot(', 'plt.plot(');
  }
  if (line.startsWith('figure')) {
    line = line.replace('figure', 'plt.figure()');
  }
  if (line.startsWith('title(')) {
    line = line.replace('title(', 'plt.title(');
  }
  if (line.startsWith('xlabel(')) {
    line = line.replace('xlabel(', 'plt.xlabel(');
  }
  if (line.startsWith('ylabel(')) {
    line = line.replace('ylabel(', 'plt.ylabel(');
  }
  if (line.startsWith('legend(')) {
    line = line.replace('legend(', 'plt.legend(');
  }
  if (line.startsWith('grid on')) {
    line = 'plt.grid(True)';
  }
  if (line.startsWith('hold on')) {
    line = '# hold on - not needed in matplotlib';
  }
  
  // Handle MATLAB specific array functions
  line = line.replace(/zeros\((\d+)\)/g, 'np.zeros($1)');
  line = line.replace(/zeros\((\d+),\s*(\d+)\)/g, 'np.zeros(($1, $2))');
  line = line.replace(/ones\((\d+)\)/g, 'np.ones($1)');
  line = line.replace(/ones\((\d+),\s*(\d+)\)/g, 'np.ones(($1, $2))');
  line = line.replace(/eye\((\d+)\)/g, 'np.eye($1)');
  line = line.replace(/linspace\(([^,]+),\s*([^,]+),\s*([^)]+)\)/g, 'np.linspace($1, $2, $3)');
  
  return line;
};

/**
 * Convert MATLAB math functions to NumPy equivalents
 */
const convertMathFunctions = (line: string): string => {
  line = line.replace(/sqrt\(([^)]+)\)/g, 'np.sqrt($1)');
  line = line.replace(/abs\(([^)]+)\)/g, 'np.abs($1)');
  line = line.replace(/sin\(([^)]+)\)/g, 'np.sin($1)');
  line = line.replace(/cos\(([^)]+)\)/g, 'np.cos($1)');
  line = line.replace(/tan\(([^)]+)\)/g, 'np.tan($1)');
  line = line.replace(/exp\(([^)]+)\)/g, 'np.exp($1)');
  line = line.replace(/log\(([^)]+)\)/g, 'np.log($1)');
  line = line.replace(/log10\(([^)]+)\)/g, 'np.log10($1)');
  return line;
};

/**
 * Convert MATLAB print statements to Python
 */
const convertPrintStatements = (line: string): string => {
  // Handle disp
  line = line.replace(/disp\(([^)]+)\);?/, 'print($1)');
  
  // Handle fprintf
  line = line.replace(/fprintf\('([^']+)'(.*)\);?/, (match, p1, p2) => {
    // Replace MATLAB format specifiers with Python's
    let format = p1.replace(/%(\d*\.\d*)?[fds]/g, '{}');
    
    if (p2) {
      // Handle fprintf with arguments
      return `print(f"${format}".format(${p2.trim().substring(1)}))`;
    } else {
      // Handle fprintf without arguments
      return `print("${format}")`;
    }
  });
  
  return line;
};

/**
 * Sample MATLAB code for testing
 */
export const getSampleMatlabCode = (): string => {
  return `% MATLAB Code for Counter-Flow Heat Exchanger Temperature Profile

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
};
