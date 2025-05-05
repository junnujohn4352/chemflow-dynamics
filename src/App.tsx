import React from "react";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import "./App.css";

// Pages
import Dashboard from "./pages/Dashboard";
import ChemicalFormulas from "./pages/ChemicalFormulas";
import CreateSimulation from "./pages/CreateSimulation";
import LandingPage from "./pages/LandingPage";
import CodeVerification from "./pages/CodeVerification";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import Formulas from "./pages/Formulas";
import Simulations from "./pages/Simulations";
import About from "./pages/About";
import SoftwareTools from "./pages/SoftwareTools";
import SoftwareTopics from "./pages/SoftwareTopics";
import HysysCalculations from "./pages/HysysCalculations";
import UnitConverter from "./pages/UnitConverter";
import CodeConverter from "./pages/CodeConverter";
import IntelligentSimulation from "./pages/IntelligentSimulation";

// Components
import { Toaster } from "./components/ui/toaster";

// Activation protection wrapper component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();
  
  // Get activation status
  const isActivated = localStorage.getItem('chemflow-activated') === 'true';
  
  // Skip checks for these public routes
  const publicRoutes = ['/', '/code-verification', '/about'];
  const isPublicRoute = publicRoutes.includes(location.pathname);
  
  // If not activated and not on a public route, redirect to code verification
  if (!isActivated && !isPublicRoute) {
    return <Navigate to="/code-verification" replace />;
  }
  
  return children;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/code-verification" element={<CodeVerification />} />
        <Route path="/about" element={<About />} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/create-simulation" element={
          <ProtectedRoute>
            <CreateSimulation />
          </ProtectedRoute>
        } />
        <Route path="/intelligent-simulation" element={
          <ProtectedRoute>
            <IntelligentSimulation />
          </ProtectedRoute>
        } />
        <Route path="/simulations" element={
          <ProtectedRoute>
            <Simulations />
          </ProtectedRoute>
        } />
        <Route path="/formulas" element={
          <ProtectedRoute>
            <Formulas />
          </ProtectedRoute>
        } />
        <Route path="/chemical-formulas" element={
          <ProtectedRoute>
            <ChemicalFormulas />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        <Route path="/software-tools" element={
          <ProtectedRoute>
            <SoftwareTools />
          </ProtectedRoute>
        } />
        <Route path="/software-topics" element={
          <ProtectedRoute>
            <SoftwareTopics />
          </ProtectedRoute>
        } />
        <Route path="/hysys-calculations" element={
          <ProtectedRoute>
            <HysysCalculations />
          </ProtectedRoute>
        } />
        <Route path="/unit-converter" element={
          <ProtectedRoute>
            <UnitConverter />
          </ProtectedRoute>
        } />
        <Route path="/code-converter" element={
          <ProtectedRoute>
            <CodeConverter />
          </ProtectedRoute>
        } />
        
        {/* ChemLab Application Routes - all protected */}
        <Route path="/chemlab/aspen-plus" element={
          <ProtectedRoute>
            <ChemicalFormulas />
          </ProtectedRoute>
        } />
        <Route path="/chemlab/hysys" element={
          <ProtectedRoute>
            <HysysCalculations />
          </ProtectedRoute>
        } />
        <Route path="/chemlab/chemcad" element={
          <ProtectedRoute>
            <UnitConverter />
          </ProtectedRoute>
        } />
        <Route path="/chemlab/dwsim" element={
          <ProtectedRoute>
            <CreateSimulation />
          </ProtectedRoute>
        } />
        <Route path="/chemlab/unisim" element={
          <ProtectedRoute>
            <Simulations />
          </ProtectedRoute>
        } />
        <Route path="/chemlab/refprop" element={
          <ProtectedRoute>
            <UnitConverter />
          </ProtectedRoute>
        } />
        <Route path="/chemlab/properties" element={
          <ProtectedRoute>
            <ChemicalFormulas />
          </ProtectedRoute>
        } />
        <Route path="/chemlab/coolprop" element={
          <ProtectedRoute>
            <CodeConverter />
          </ProtectedRoute>
        } />
        <Route path="/chemlab/exchanger" element={
          <ProtectedRoute>
            <HysysCalculations />
          </ProtectedRoute>
        } />
        <Route path="/chemlab/column-design" element={
          <ProtectedRoute>
            <CreateSimulation />
          </ProtectedRoute>
        } />
        <Route path="/chemlab/pipe-flow" element={
          <ProtectedRoute>
            <IntelligentSimulation />
          </ProtectedRoute>
        } />
        <Route path="/chemlab/process-control" element={
          <ProtectedRoute>
            <Simulations />
          </ProtectedRoute>
        } />
        <Route path="/chemlab/pid-tuner" element={
          <ProtectedRoute>
            <UnitConverter />
          </ProtectedRoute>
        } />
        <Route path="/chemlab/doe" element={
          <ProtectedRoute>
            <ChemicalFormulas />
          </ProtectedRoute>
        } />
        <Route path="/chemlab/data-analytics" element={
          <ProtectedRoute>
            <CodeConverter />
          </ProtectedRoute>
        } />
        <Route path="/chemlab/lims" element={
          <ProtectedRoute>
            <HysysCalculations />
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
};

export default App;
