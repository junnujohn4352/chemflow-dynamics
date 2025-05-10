
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import ChemicalFormulas from './pages/ChemicalFormulas';
import UnitConverter from './pages/UnitConverter';
import NotFound from './pages/NotFound';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import IntelligentSimulation from './pages/IntelligentSimulation';
import CreateSimulation from './pages/CreateSimulation';
import LandingPage from './pages/LandingPage';
import { Layout } from './components/layout/Layout';

// Import or create the new pages
import Documentation from './pages/Documentation';
import Bookmarks from './pages/Bookmarks';
import Resources from './pages/Resources';
import DataAnalysis from './pages/DataAnalysis';
import Reports from './pages/Reports';
import Auth from './pages/Auth';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />
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
        } /> {/* Redirect to Chemical Formulas */}
        <Route path="/unit-converter" element={
          <Layout>
            <UnitConverter />
          </Layout>
        } />
        <Route path="/intelligent-simulation" element={
          <Layout>
            <IntelligentSimulation />
          </Layout>
        } />
        <Route path="/create-simulation" element={
          <Layout>
            <CreateSimulation />
          </Layout>
        } />
        {/* Resources sections */}
        <Route path="/documentation" element={
          <Layout>
            <Documentation />
          </Layout>
        } />
        <Route path="/bookmarks" element={
          <Layout>
            <Bookmarks />
          </Layout>
        } />
        <Route path="/resources" element={
          <Layout>
            <Resources />
          </Layout>
        } />
        <Route path="/data-analysis" element={
          <Layout>
            <DataAnalysis />
          </Layout>
        } />
        <Route path="/reports" element={
          <Layout>
            <Reports />
          </Layout>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
