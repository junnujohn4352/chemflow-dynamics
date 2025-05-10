
import React, { useEffect, useState } from "react";
import { useLoadingAnimation } from "@/hooks/useLoadingAnimation";
import { Button } from "@/components/ui/button";
import { ChemFlowLogo } from "@/assets/icons/ChemFlowLogo";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Beaker, FlaskConical, LineChart, Atom, Thermometer, Database, ChevronDown, BookOpen, Bookmark, BarChart3, FileText } from "lucide-react";
import FormulaCard from "@/components/landing/FormulaCard";

const LandingPage = () => {
  const { loading, opacity } = useLoadingAnimation();
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollOpacity = Math.max(0, Math.min(1, 1 - scrollY / 300));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-100">
        <div className="text-center bg-white/80 p-8 rounded-2xl shadow-lg backdrop-blur-sm" style={{ opacity: opacity }}>
          <div className="flex justify-center mb-6 animate-pulse">
            <ChemFlowLogo className="h-24 w-auto" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">ChemFlow</h1>
          <p className="text-gray-600 mb-4">Loading your chemical engineering experience...</p>
          <div className="flex items-center justify-center">
            <div className="h-1 w-64 bg-blue-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-100 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-blue-200 opacity-20 animate-pulse" style={{ animationDuration: '8s' }}></div>
          <div className="absolute top-40 right-20 w-60 h-60 rounded-full bg-purple-200 opacity-30 animate-pulse" style={{ animationDuration: '12s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-80 h-80 rounded-full bg-indigo-200 opacity-20 animate-pulse" style={{ animationDuration: '10s' }}></div>
        </div>

        <div className="container mx-auto px-4 z-10 text-center">
          <div className="mb-6 flex justify-center animate-fade-in">
            <ChemFlowLogo className="h-24 w-auto" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-700 bg-clip-text text-transparent">
            ChemFlow
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Advanced chemical engineering simulation platform designed for modern engineers and scientists
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Button 
              onClick={() => navigate("/dashboard")}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg py-6 px-8"
              size="lg"
            >
              Enter Dashboard <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              onClick={() => navigate("/home")}
              variant="outline" 
              size="lg"
              className="border-blue-500 text-blue-700 hover:bg-blue-50 text-lg py-6"
            >
              Explore Tools
            </Button>
          </div>
        </div>
        
        <div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer"
          style={{ opacity: scrollOpacity }}
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <ChevronDown className="h-8 w-8 text-blue-600" />
        </div>
        
        {/* Orbiting icons animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px]" style={{ animation: 'spin 20s linear infinite' }}>
            <Beaker className="absolute top-0 transform -translate-y-1/2 text-blue-500 opacity-20 w-12 h-12" />
            <FlaskConical className="absolute right-0 transform translate-x-1/2 text-purple-500 opacity-20 w-12 h-12" />
            <LineChart className="absolute bottom-0 transform translate-y-1/2 text-indigo-500 opacity-20 w-12 h-12" />
            <Atom className="absolute left-0 transform -translate-x-1/2 text-cyan-500 opacity-20 w-12 h-12" />
          </div>
        </div>
      </section>

      {/* Learning Resources Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Educational Resources & Tools
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ResourceCard 
              icon={<BookOpen className="h-10 w-10 text-blue-600" />}
              title="Learning Resources"
              description="Access textbooks, tutorials, practice problems, and quizzes to enhance your learning experience."
              buttonText="Browse Resources"
              buttonLink="/resources"
            />
            
            <ResourceCard 
              icon={<Bookmark className="h-10 w-10 text-purple-600" />}
              title="My Bookmarks"
              description="Save and organize your favorite formulas, articles, and simulations for quick reference."
              buttonText="View Bookmarks"
              buttonLink="/bookmarks"
            />
            
            <ResourceCard 
              icon={<BarChart3 className="h-10 w-10 text-green-600" />}
              title="Data Analysis"
              description="Visualize and analyze chemical engineering data with powerful charts and statistical tools."
              buttonText="Open Analysis Tools"
              buttonLink="/data-analysis"
            />
            
            <ResourceCard 
              icon={<FileText className="h-10 w-10 text-orange-500" />}
              title="My Reports"
              description="Access and manage your simulation reports, calculations, and project documentation."
              buttonText="View Reports"
              buttonLink="/reports"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Powerful Chemical Engineering Tools
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
            <FeatureCard 
              icon={<Beaker className="h-10 w-10 text-blue-600" />}
              title="Process Simulation"
              description="Build and analyze complex chemical processes with our intuitive drag-and-drop interface"
              delay={0.1}
            />
            <FeatureCard 
              icon={<LineChart className="h-10 w-10 text-purple-600" />}
              title="Advanced Analysis"
              description="Get comprehensive analysis of your simulations including energy usage and efficiency metrics"
              delay={0.3}
            />
            <FeatureCard 
              icon={<Atom className="h-10 w-10 text-indigo-600" />}
              title="Component Database"
              description="Access extensive database of chemical components with accurate property data"
              delay={0.5}
            />
            <FeatureCard 
              icon={<Thermometer className="h-10 w-10 text-red-500" />}
              title="Thermodynamics"
              description="Apply various thermodynamic models to your simulations for accurate predictions"
              delay={0.2}
            />
            <FeatureCard 
              icon={<Database className="h-10 w-10 text-green-600" />}
              title="Data Management"
              description="Store, manage, and share your simulation data securely in the cloud"
              delay={0.4}
            />
            <FeatureCard 
              icon={<FlaskConical className="h-10 w-10 text-orange-500" />}
              title="Reaction Engineering"
              description="Model complex reaction kinetics and reactor performance with ease"
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* Formula Showcase */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
            Essential Chemical Engineering Formulas
          </h2>
          <p className="text-center text-lg mb-12 max-w-3xl mx-auto">
            Access and calculate with hundreds of formulas across all chemical engineering disciplines
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <FormulaCard 
              title="Reynolds Number" 
              formula="Re = ρvD/μ"
              description="Dimensionless number that predicts fluid flow patterns."
              variables={{
                "ρ": "density (kg/m³)",
                "v": "velocity (m/s)",
                "D": "diameter (m)",
                "μ": "viscosity (kg/m·s)"
              }}
              className="bg-gradient-to-br from-purple-50 to-purple-100/50"
            />
            <FormulaCard 
              title="Bernoulli's Equation" 
              formula="P₁ + ½ρv₁² + ρgh₁ = P₂ + ½ρv₂² + ρgh₂"
              description="Conservation of energy principle for fluid flow."
              className="bg-gradient-to-br from-blue-50 to-blue-100/50"
            />
            <FormulaCard 
              title="Mass Balance" 
              formula="∑(ṁᵢₙ) = ∑(ṁₒᵤₜ)"
              description="Conservation of mass in a steady-state process."
              className="bg-gradient-to-br from-cyan-50 to-cyan-100/50"
            />
            <FormulaCard 
              title="Energy Balance" 
              formula="Q - W = ΔE"
              description="First law of thermodynamics applied to process systems."
              className="bg-gradient-to-br from-indigo-50 to-indigo-100/50"
            />
          </div>
          
          <div className="text-center">
            <Button 
              onClick={() => navigate("/chemical-formulas")}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
            >
              Explore All Formulas <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Simulation Preview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
            Powerful Simulation Platform
          </h2>
          <p className="text-center text-lg mb-12 max-w-3xl mx-auto">
            Design, analyze, and optimize chemical processes with our drag-and-drop interface
          </p>

          <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-8 rounded-2xl shadow-lg max-w-4xl mx-auto overflow-hidden">
            <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 shadow-inner">
              <div className="absolute inset-0 bg-white">
                {/* Simulation Preview Mockup */}
                <div className="h-full w-full bg-gray-50 flex flex-col">
                  <div className="h-12 border-b border-gray-200 bg-white flex items-center px-4">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <div className="text-sm text-gray-500 ml-2">ChemFlow Simulation</div>
                  </div>
                  <div className="flex-grow flex">
                    <div className="w-48 border-r border-gray-200 p-4 bg-white">
                      <div className="w-full h-8 bg-gray-100 rounded mb-3"></div>
                      <div className="w-full h-6 bg-gray-100 rounded mb-2"></div>
                      <div className="w-full h-6 bg-gray-100 rounded mb-2"></div>
                      <div className="w-full h-6 bg-gray-100 rounded"></div>
                    </div>
                    <div className="flex-grow p-4 relative">
                      {/* Simulated Flow Elements */}
                      <div className="absolute left-1/4 top-1/4 w-16 h-16 bg-blue-100 rounded-lg border border-blue-200 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-blue-200 animate-pulse"></div>
                      </div>
                      <div className="absolute right-1/4 top-1/4 w-16 h-16 bg-green-100 rounded-lg border border-green-200 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-green-200 animate-pulse"></div>
                      </div>
                      <div className="absolute left-1/3 bottom-1/4 w-16 h-16 bg-purple-100 rounded-lg border border-purple-200 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-purple-200 animate-pulse"></div>
                      </div>
                      {/* Connection Lines */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        <line x1="25%" y1="25%" x2="75%" y2="25%" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="2" strokeDasharray="5,5" className="connection-line"></line>
                        <line x1="25%" y1="25%" x2="33%" y2="75%" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="2" strokeDasharray="5,5" className="connection-line"></line>
                        <line x1="75%" y1="25%" x2="33%" y2="75%" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="2" strokeDasharray="5,5" className="connection-line"></line>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button 
              onClick={() => navigate("/create-simulation")}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              size="lg"
            >
              Try Simulation Builder <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Meet Our Founders
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 transform transition-all hover:-translate-y-1 hover:shadow-md">
              <h3 className="text-xl font-bold text-gray-800 mb-2">P. Janardhan Reddy</h3>
              <p className="text-blue-600 font-medium mb-4">Founder & CEO</p>
              <p className="text-gray-600">
                With over 15 years of experience in chemical engineering and process design, 
                P. Janardhan Reddy founded ChemFlow with a vision to create cutting-edge 
                simulation tools that make complex processes more accessible and efficient for engineers worldwide.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100 transform transition-all hover:-translate-y-1 hover:shadow-md">
              <h3 className="text-xl font-bold text-gray-800 mb-2">D. Harishwar</h3>
              <p className="text-purple-600 font-medium mb-4">Co-Founder & CTO</p>
              <p className="text-gray-600">
                With a strong background in software development and chemical engineering, 
                D. Harishwar leads the technical innovation at ChemFlow. His expertise in 
                computational methods and user experience design has been instrumental in 
                creating our powerful yet intuitive simulation platform.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Chemical Engineering Workflow?
          </h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto opacity-90">
            Join thousands of engineers who are already using ChemFlow to streamline their simulation and analysis processes.
          </p>
          <Button 
            onClick={() => navigate("/dashboard")}
            variant="outline"
            size="lg"
            className="border-white text-white hover:bg-white/10"
          >
            Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <ChemFlowLogo className="h-8 w-auto mr-2" />
              <span className="text-xl font-semibold text-gray-800">ChemFlow</span>
            </div>
            <div className="text-gray-600 text-sm">
              © {new Date().getFullYear()} ChemFlow. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={cardRef}
      className={`bg-white rounded-xl shadow-sm border border-gray-100 p-8 transition-all duration-700 transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${delay}s` }}
    >
      <div className="bg-blue-50 p-4 rounded-full inline-flex items-center justify-center mb-4 text-blue-600">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

interface ResourceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ icon, title, description, buttonText, buttonLink }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="bg-blue-50 p-4 rounded-full inline-flex items-center justify-center mb-4 text-blue-600">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-gray-800">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      <Button
        variant="outline"
        onClick={() => navigate(buttonLink)}
        className="w-full border-blue-200 hover:bg-blue-50"
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default LandingPage;

