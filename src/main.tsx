
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/animations.css'
import { Toaster } from './components/ui/toaster'
import { ThemeProvider } from './components/ThemeProvider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <App />
      <Toaster />
    </ThemeProvider>
  </React.StrictMode>,
)
