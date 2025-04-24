
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

// Pages
import { Index } from "./pages/Index";
import { Dashboard } from "./pages/Dashboard";
import ChemicalFormulas from "./pages/ChemicalFormulas";
import { CreateSimulation } from "./pages/CreateSimulation";
import LandingPage from "./pages/LandingPage";
import { NotFound } from "./pages/NotFound";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { Settings } from "./pages/Settings";
import { Formulas } from "./pages/Formulas";
import { Simulations } from "./pages/Simulations";
import { About } from "./pages/About";
import { SoftwareTools } from "./pages/SoftwareTools";
import { SoftwareTopics } from "./pages/SoftwareTopics";
import { HysysCalculations } from "./pages/HysysCalculations";
import { UnitConverter } from "./pages/UnitConverter";
import Components from "./pages/Components";
import CodeConverter from "./pages/CodeConverter";
import IntelligentSimulation from "./pages/IntelligentSimulation";

// Components
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/index" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-simulation" element={<CreateSimulation />} />
        <Route path="/intelligent-simulation" element={<IntelligentSimulation />} />
        <Route path="/formulas" element={<Formulas />} />
        <Route path="/chemical-formulas" element={<ChemicalFormulas />} />
        <Route path="/simulations" element={<Simulations />} />
        <Route path="/about" element={<About />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/software-tools" element={<SoftwareTools />} />
        <Route path="/software-topics" element={<SoftwareTopics />} />
        <Route path="/hysys-calculations" element={<HysysCalculations />} />
        <Route path="/unit-converter" element={<UnitConverter />} />
        <Route path="/components" element={<Components />} />
        <Route path="/code-converter" element={<CodeConverter />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
