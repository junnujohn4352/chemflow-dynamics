import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./components/auth/AuthContext";

// Pages
import Dashboard from "./pages/Dashboard";
import ChemicalFormulas from "./pages/ChemicalFormulas";
import CreateSimulation from "./pages/CreateSimulation";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
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
import PaymentPage from "./components/payment/PaymentPage";

// Components
import { Toaster } from "./components/ui/toaster";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Set landing page as root */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Auth routes */}
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/payment" element={<PaymentPage />} />
          
          {/* Dashboard protected by authentication */}
          <Route path="/dashboard" element={
            <ProtectedRoute requiresSubscription={false}>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          {/* Protected routes requiring authentication and subscription */}
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
          
          {/* Other routes protected by authentication */}
          <Route path="/formulas" element={
            <ProtectedRoute requiresSubscription={false}>
              <Formulas />
            </ProtectedRoute>
          } />
          <Route path="/chemical-formulas" element={
            <ProtectedRoute requiresSubscription={false}>
              <ChemicalFormulas />
            </ProtectedRoute>
          } />
          <Route path="/about" element={
            <ProtectedRoute requiresSubscription={false}>
              <About />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute requiresSubscription={false}>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="/software-tools" element={
            <ProtectedRoute requiresSubscription={false}>
              <SoftwareTools />
            </ProtectedRoute>
          } />
          <Route path="/software-topics" element={
            <ProtectedRoute requiresSubscription={false}>
              <SoftwareTopics />
            </ProtectedRoute>
          } />
          <Route path="/hysys-calculations" element={
            <ProtectedRoute requiresSubscription={false}>
              <HysysCalculations />
            </ProtectedRoute>
          } />
          <Route path="/unit-converter" element={
            <ProtectedRoute requiresSubscription={false}>
              <UnitConverter />
            </ProtectedRoute>
          } />
          <Route path="/code-converter" element={
            <ProtectedRoute requiresSubscription={false}>
              <CodeConverter />
            </ProtectedRoute>
          } />
          
          {/* ChemLab Application Routes - all protected */}
          <Route path="/chemlab/aspen-plus" element={
            <ProtectedRoute requiresSubscription={false}>
              <ChemicalFormulas />
            </ProtectedRoute>
          } />
          <Route path="/chemlab/hysys" element={
            <ProtectedRoute requiresSubscription={false}>
              <HysysCalculations />
            </ProtectedRoute>
          } />
          <Route path="/chemlab/chemcad" element={
            <ProtectedRoute requiresSubscription={false}>
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
            <ProtectedRoute requiresSubscription={false}>
              <UnitConverter />
            </ProtectedRoute>
          } />
          <Route path="/chemlab/properties" element={
            <ProtectedRoute requiresSubscription={false}>
              <ChemicalFormulas />
            </ProtectedRoute>
          } />
          <Route path="/chemlab/coolprop" element={
            <ProtectedRoute requiresSubscription={false}>
              <CodeConverter />
            </ProtectedRoute>
          } />
          <Route path="/chemlab/exchanger" element={
            <ProtectedRoute requiresSubscription={false}>
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
            <ProtectedRoute requiresSubscription={false}>
              <UnitConverter />
            </ProtectedRoute>
          } />
          <Route path="/chemlab/doe" element={
            <ProtectedRoute requiresSubscription={false}>
              <ChemicalFormulas />
            </ProtectedRoute>
          } />
          <Route path="/chemlab/data-analytics" element={
            <ProtectedRoute requiresSubscription={false}>
              <CodeConverter />
            </ProtectedRoute>
          } />
          <Route path="/chemlab/lims" element={
            <ProtectedRoute requiresSubscription={false}>
              <HysysCalculations />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
