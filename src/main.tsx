
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add error handler for React's attempt to serialize objects as children
if (process.env.NODE_ENV !== 'production') {
  const originalConsoleError = console.error;
  console.error = (...args) => {
    // Catch and log special warning for objects in JSX
    if (
      typeof args[0] === 'string' && 
      args[0].includes('Objects are not valid as a React child')
    ) {
      console.warn('WARNING: Attempting to render an object directly in JSX:', args);
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
