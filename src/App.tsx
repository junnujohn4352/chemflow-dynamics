
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import { useEffect, useState } from 'react';
import { supabase } from './integrations/supabase/client';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check authentication status on load
    const checkAuth = async () => {
      try {
        // Set up auth state listener FIRST
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          console.log("App auth event:", event);
          setIsAuthenticated(!!session);
          
          if (event === 'SIGNED_IN') {
            toast({
              title: "Signed in successfully",
              description: "Welcome to ChemFlow!",
              variant: "success",
            });
          } else if (event === 'SIGNED_OUT') {
            toast({
              title: "Signed out successfully",
              description: "You have been signed out",
              variant: "default",
            });
          } else if (event === 'USER_UPDATED') {
            toast({
              title: "Account updated",
              description: "Your account has been updated",
              variant: "default",
            });
          }
        });
        
        // THEN check for existing session
        const { data } = await supabase.auth.getSession();
        setIsAuthenticated(!!data.session);
        
        return () => subscription.unsubscribe();
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
  }, [toast]);

  // Loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={isAuthenticated ? <Navigate to="/resources" /> : <Auth />} />
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
          isAuthenticated ? (
            <Layout>
              <Dashboard />
            </Layout>
          ) : (
            <Navigate to="/auth" />
          )
        } />
        <Route path="/settings" element={
          isAuthenticated ? (
            <Layout>
              <Settings />
            </Layout>
          ) : (
            <Navigate to="/auth" />
          )
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
          isAuthenticated ? (
            <Layout>
              <IntelligentSimulation />
            </Layout>
          ) : (
            <Navigate to="/auth" />
          )
        } />
        <Route path="/create-simulation" element={
          isAuthenticated ? (
            <Layout>
              <CreateSimulation />
            </Layout>
          ) : (
            <Navigate to="/auth" />
          )
        } />
        {/* Resources sections */}
        <Route path="/documentation" element={
          <Layout>
            <Documentation />
          </Layout>
        } />
        <Route path="/bookmarks" element={
          isAuthenticated ? (
            <Layout>
              <Bookmarks />
            </Layout>
          ) : (
            <Navigate to="/auth" />
          )
        } />
        <Route path="/resources" element={
          isAuthenticated ? (
            <Layout>
              <Resources />
            </Layout>
          ) : (
            <Navigate to="/auth" />
          )
        } />
        <Route path="/data-analysis" element={
          isAuthenticated ? (
            <Layout>
              <DataAnalysis />
            </Layout>
          ) : (
            <Navigate to="/auth" />
          )
        } />
        <Route path="/reports" element={
          isAuthenticated ? (
            <Layout>
              <Reports />
            </Layout>
          ) : (
            <Navigate to="/auth" />
          )
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
