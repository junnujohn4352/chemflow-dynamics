
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add comprehensive error handler for React's attempt to serialize objects as children
if (process.env.NODE_ENV !== 'production') {
  const originalConsoleError = console.error;
  console.error = (...args) => {
    // Catch and log special warning for objects in JSX
    if (
      typeof args[0] === 'string' && 
      (args[0].includes('Objects are not valid as a React child') ||
       args[0].includes('invalid object type'))
    ) {
      console.warn('WARNING: Attempting to render an object directly in JSX:', args);
      console.trace('Stack trace for object rendering issue:');
      
      // Show a visible error in the UI
      const errorElement = document.createElement('div');
      errorElement.style.position = 'fixed';
      errorElement.style.top = '0';
      errorElement.style.left = '0';
      errorElement.style.right = '0';
      errorElement.style.backgroundColor = '#f44336';
      errorElement.style.color = 'white';
      errorElement.style.padding = '10px';
      errorElement.style.zIndex = '9999';
      errorElement.textContent = 'React Error: Attempting to render an object directly. Check console for details.';
      document.body.appendChild(errorElement);
      
      // Auto-remove after 5 seconds
      setTimeout(() => {
        if (document.body.contains(errorElement)) {
          document.body.removeChild(errorElement);
        }
      }, 5000);
    }
    
    // Pass through to original console.error
    return originalConsoleError(...args);
  };
}

const root = createRoot(document.getElementById('root')!)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
