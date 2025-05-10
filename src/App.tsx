
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import About from './pages/About';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import ChemicalFormulas from './pages/ChemicalFormulas';
import UnitConverter from './pages/UnitConverter';
import IntelligentSimulation from './pages/IntelligentSimulation';
import HysysCalculations from './pages/HysysCalculations';
import DynamicModeling from './pages/DynamicModeling';
import EquipmentSizing from './pages/EquipmentSizing';
import ProcessLibrary from './pages/ProcessLibrary';
import SoftwareInterfaces from './pages/SoftwareInterfaces';
import FlowsheetAnalysis from './pages/FlowsheetAnalysis';
import DataVisualization from './pages/DataVisualization';
import UserProfile from './pages/UserProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/chemical-formulas" element={<ChemicalFormulas />} />
        <Route path="/engineering-formulas" element={<ChemicalFormulas />} /> {/* Redirect to Chemical Formulas */}
        <Route path="/unit-converter" element={<UnitConverter />} />
        <Route path="/dynamic-modeling" element={<DynamicModeling />} />
        <Route path="/equipment-sizing" element={<EquipmentSizing />} />
        <Route path="/intelligent-simulation" element={<IntelligentSimulation />} />
        <Route path="/hysys-calculations" element={<HysysCalculations />} />
        <Route path="/process-library" element={<ProcessLibrary />} />
        <Route path="/software-interfaces" element={<SoftwareInterfaces />} />
        <Route path="/flowsheet-analysis" element={<FlowsheetAnalysis />} />
        <Route path="/data-visualization" element={<DataVisualization />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
