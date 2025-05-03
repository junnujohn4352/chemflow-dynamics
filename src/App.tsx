
import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import "./App.css";

// Pages
import Dashboard from "./pages/Dashboard";
import ChemicalFormulas from "./pages/ChemicalFormulas";
import CreateSimulation from "./pages/CreateSimulation";
import LandingPage from "./pages/LandingPage";
import Payment from "./pages/Payment";
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

// Payment protection wrapper component
const PaymentProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const paymentCompleted = localStorage.getItem('chemflow-payment-completed') === 'true';
  const location = useLocation();
  
  // Skip payment check for these public routes
  const publicRoutes = ['/', '/payment', '/about'];
  const isPublicRoute = publicRoutes.includes(location.pathname);
  
  if (!paymentCompleted && !isPublicRoute) {
    return <Navigate to="/payment" replace />;
  }
  
  return children;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/about" element={<About />} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={
          <PaymentProtectedRoute>
            <Dashboard />
          </PaymentProtectedRoute>
        } />
        <Route path="/create-simulation" element={
          <PaymentProtectedRoute>
            <CreateSimulation />
          </PaymentProtectedRoute>
        } />
        <Route path="/intelligent-simulation" element={
          <PaymentProtectedRoute>
            <IntelligentSimulation />
          </PaymentProtectedRoute>
        } />
        <Route path="/simulations" element={
          <PaymentProtectedRoute>
            <Simulations />
          </PaymentProtectedRoute>
        } />
        <Route path="/formulas" element={
          <PaymentProtectedRoute>
            <Formulas />
          </PaymentProtectedRoute>
        } />
        <Route path="/chemical-formulas" element={
          <PaymentProtectedRoute>
            <ChemicalFormulas />
          </PaymentProtectedRoute>
        } />
        <Route path="/settings" element={
          <PaymentProtectedRoute>
            <Settings />
          </PaymentProtectedRoute>
        } />
        <Route path="/software-tools" element={
          <PaymentProtectedRoute>
            <SoftwareTools />
          </PaymentProtectedRoute>
        } />
        <Route path="/software-topics" element={
          <PaymentProtectedRoute>
            <SoftwareTopics />
          </PaymentProtectedRoute>
        } />
        <Route path="/hysys-calculations" element={
          <PaymentProtectedRoute>
            <HysysCalculations />
          </PaymentProtectedRoute>
        } />
        <Route path="/unit-converter" element={
          <PaymentProtectedRoute>
            <UnitConverter />
          </PaymentProtectedRoute>
        } />
        <Route path="/code-converter" element={
          <PaymentProtectedRoute>
            <CodeConverter />
          </PaymentProtectedRoute>
        } />
        
        {/* ChemLab Application Routes - all protected */}
        <Route path="/chemlab/aspen-plus" element={
          <PaymentProtectedRoute>
            <ChemicalFormulas />
          </PaymentProtectedRoute>
        } />
        <Route path="/chemlab/hysys" element={
          <PaymentProtectedRoute>
            <HysysCalculations />
          </PaymentProtectedRoute>
        } />
        <Route path="/chemlab/chemcad" element={
          <PaymentProtectedRoute>
            <UnitConverter />
          </PaymentProtectedRoute>
        } />
        <Route path="/chemlab/dwsim" element={
          <PaymentProtectedRoute>
            <CreateSimulation />
          </PaymentProtectedRoute>
        } />
        <Route path="/chemlab/unisim" element={
          <PaymentProtectedRoute>
            <Simulations />
          </PaymentProtectedRoute>
        } />
        <Route path="/chemlab/refprop" element={
          <PaymentProtectedRoute>
            <UnitConverter />
          </PaymentProtectedRoute>
        } />
        <Route path="/chemlab/properties" element={
          <PaymentProtectedRoute>
            <ChemicalFormulas />
          </PaymentProtectedRoute>
        } />
        <Route path="/chemlab/coolprop" element={
          <PaymentProtectedRoute>
            <CodeConverter />
          </PaymentProtectedRoute>
        } />
        <Route path="/chemlab/exchanger" element={
          <PaymentProtectedRoute>
            <HysysCalculations />
          </PaymentProtectedRoute>
        } />
        <Route path="/chemlab/column-design" element={
          <PaymentProtectedRoute>
            <CreateSimulation />
          </PaymentProtectedRoute>
        } />
        <Route path="/chemlab/pipe-flow" element={
          <PaymentProtectedRoute>
            <IntelligentSimulation />
          </PaymentProtectedRoute>
        } />
        <Route path="/chemlab/process-control" element={
          <PaymentProtectedRoute>
            <Simulations />
          </PaymentProtectedRoute>
        } />
        <Route path="/chemlab/pid-tuner" element={
          <PaymentProtectedRoute>
            <UnitConverter />
          </PaymentProtectedRoute>
        } />
        <Route path="/chemlab/doe" element={
          <PaymentProtectedRoute>
            <ChemicalFormulas />
          </PaymentProtectedRoute>
        } />
        <Route path="/chemlab/data-analytics" element={
          <PaymentProtectedRoute>
            <CodeConverter />
          </PaymentProtectedRoute>
        } />
        <Route path="/chemlab/lims" element={
          <PaymentProtectedRoute>
            <HysysCalculations />
          </PaymentProtectedRoute>
        } />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
};

export default App;
