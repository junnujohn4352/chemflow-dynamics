
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Set landing page as root */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Add payment route */}
        <Route path="/payment" element={<Payment />} />
        
        {/* Direct access to all pages (no auth protection) */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-simulation" element={<CreateSimulation />} />
        <Route path="/intelligent-simulation" element={<IntelligentSimulation />} />
        <Route path="/simulations" element={<Simulations />} />
        <Route path="/formulas" element={<Formulas />} />
        <Route path="/chemical-formulas" element={<ChemicalFormulas />} />
        <Route path="/about" element={<About />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/software-tools" element={<SoftwareTools />} />
        <Route path="/software-topics" element={<SoftwareTopics />} />
        <Route path="/hysys-calculations" element={<HysysCalculations />} />
        <Route path="/unit-converter" element={<UnitConverter />} />
        <Route path="/code-converter" element={<CodeConverter />} />
        
        {/* ChemLab Application Routes - all accessible without auth */}
        <Route path="/chemlab/aspen-plus" element={<ChemicalFormulas />} />
        <Route path="/chemlab/hysys" element={<HysysCalculations />} />
        <Route path="/chemlab/chemcad" element={<UnitConverter />} />
        <Route path="/chemlab/dwsim" element={<CreateSimulation />} />
        <Route path="/chemlab/unisim" element={<Simulations />} />
        <Route path="/chemlab/refprop" element={<UnitConverter />} />
        <Route path="/chemlab/properties" element={<ChemicalFormulas />} />
        <Route path="/chemlab/coolprop" element={<CodeConverter />} />
        <Route path="/chemlab/exchanger" element={<HysysCalculations />} />
        <Route path="/chemlab/column-design" element={<CreateSimulation />} />
        <Route path="/chemlab/pipe-flow" element={<IntelligentSimulation />} />
        <Route path="/chemlab/process-control" element={<Simulations />} />
        <Route path="/chemlab/pid-tuner" element={<UnitConverter />} />
        <Route path="/chemlab/doe" element={<ChemicalFormulas />} />
        <Route path="/chemlab/data-analytics" element={<CodeConverter />} />
        <Route path="/chemlab/lims" element={<HysysCalculations />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
};

export default App;
