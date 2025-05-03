
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./components/auth/AuthContext";

// Pages
import Index from "./pages/Index";
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
          <Route path="/" element={<LandingPage />} />
          <Route path="/index" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
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
          <Route path="/formulas" element={<Formulas />} />
          <Route path="/chemical-formulas" element={<ChemicalFormulas />} />
          <Route path="/simulations" element={
            <ProtectedRoute>
              <Simulations />
            </ProtectedRoute>
          } />
          <Route path="/about" element={<About />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/software-tools" element={<SoftwareTools />} />
          <Route path="/software-topics" element={<SoftwareTopics />} />
          <Route path="/hysys-calculations" element={<HysysCalculations />} />
          <Route path="/unit-converter" element={<UnitConverter />} />
          <Route path="/code-converter" element={<CodeConverter />} />
          
          {/* ChemLab Application Routes */}
          <Route path="/chemlab/aspen-plus" element={<ChemicalFormulas />} /> {/* Placeholder */}
          <Route path="/chemlab/hysys" element={<HysysCalculations />} /> {/* Placeholder */}
          <Route path="/chemlab/chemcad" element={<UnitConverter />} /> {/* Placeholder */}
          <Route path="/chemlab/dwsim" element={<CreateSimulation />} /> {/* Placeholder */}
          <Route path="/chemlab/unisim" element={<Simulations />} /> {/* Placeholder */}
          <Route path="/chemlab/refprop" element={<UnitConverter />} /> {/* Placeholder */}
          <Route path="/chemlab/properties" element={<ChemicalFormulas />} /> {/* Placeholder */}
          <Route path="/chemlab/coolprop" element={<CodeConverter />} /> {/* Placeholder */}
          <Route path="/chemlab/exchanger" element={<HysysCalculations />} /> {/* Placeholder */}
          <Route path="/chemlab/column-design" element={<CreateSimulation />} /> {/* Placeholder */}
          <Route path="/chemlab/pipe-flow" element={<IntelligentSimulation />} /> {/* Placeholder */}
          <Route path="/chemlab/process-control" element={<Simulations />} /> {/* Placeholder */}
          <Route path="/chemlab/pid-tuner" element={<UnitConverter />} /> {/* Placeholder */}
          <Route path="/chemlab/doe" element={<ChemicalFormulas />} /> {/* Placeholder */}
          <Route path="/chemlab/data-analytics" element={<CodeConverter />} /> {/* Placeholder */}
          <Route path="/chemlab/lims" element={<HysysCalculations />} /> {/* Placeholder */}
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
