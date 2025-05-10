
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import ChemicalFormulas from './pages/ChemicalFormulas';
import UnitConverter from './pages/UnitConverter';
import NotFound from './pages/NotFound';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import IntelligentSimulation from './pages/IntelligentSimulation';
import HysysCalculations from './pages/HysysCalculations';
import CreateSimulation from './pages/CreateSimulation';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/chemical-formulas" element={<ChemicalFormulas />} />
        <Route path="/engineering-formulas" element={<ChemicalFormulas />} /> {/* Redirect to Chemical Formulas */}
        <Route path="/unit-converter" element={<UnitConverter />} />
        <Route path="/intelligent-simulation" element={<IntelligentSimulation />} />
        <Route path="/hysys-calculations" element={<HysysCalculations />} />
        <Route path="/create-simulation" element={<CreateSimulation />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
