
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import ChemicalFormulas from './pages/ChemicalFormulas';
import UnitConverter from './pages/UnitConverter';
import NotFound from './pages/NotFound';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import LandingPage from './pages/LandingPage';
import { Layout } from './components/layout/Layout';
import ProcessSimulation from './pages/ProcessSimulation';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={
          <Layout>
            <Home />
          </Layout>
        } />
        <Route path="/about" element={
          <Layout>
            <About />
          </Layout>
        } />
        <Route path="/dashboard" element={
          <Layout>
            <Dashboard />
          </Layout>
        } />
        <Route path="/settings" element={
          <Layout>
            <Settings />
          </Layout>
        } />
        <Route path="/chemical-formulas" element={
          <Layout>
            <ChemicalFormulas />
          </Layout>
        } />
        <Route path="/engineering-formulas" element={
          <Layout>
            <ChemicalFormulas />
          </Layout>
        } />
        <Route path="/unit-converter" element={
          <Layout>
            <UnitConverter />
          </Layout>
        } />
        <Route path="/process-simulation" element={
          <Layout>
            <ProcessSimulation />
          </Layout>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
