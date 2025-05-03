import React from "react";
import { useLoadingAnimation } from "@/hooks/useLoadingAnimation";
import LoadingScreen from "@/components/landing/LoadingScreen";
import { Button } from "@/components/ui/button";
import { ChemFlowLogo } from "@/assets/icons/ChemFlowLogo";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Beaker, FlaskConical, LineChart, Atom, Thermometer, Database, Waves, Gauge, FlaskRound, BookOpen } from "lucide-react";

const LandingPage = () => {
  const { loading, opacity } = useLoadingAnimation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center 
      bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-100 overflow-hidden relative">
      {loading ? (
        <LoadingScreen opacity={opacity} />
      ) : (
        <div className="w-full max-w-7xl mx-auto px-4">
          {/* Hero Section */}
          <section className="min-h-[90vh] flex flex-col md:flex-row items-center justify-between py-16 relative">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-blue-200 opacity-20 animate-pulse" style={{ animationDuration: '8s' }}></div>
              <div className="absolute top-40 right-20 w-60 h-60 rounded-full bg-purple-200 opacity-30 animate-pulse" style={{ animationDuration: '12s' }}></div>
              <div className="absolute bottom-20 left-1/4 w-80 h-80 rounded-full bg-indigo-200 opacity-20 animate-pulse" style={{ animationDuration: '10s' }}></div>
            </div>
            
            {/* Content */}
            <div className="z-10 md:w-1/2 text-center md:text-left mb-12 md:mb-0">
              <h1 className="text-5xl md:text-6xl font-extrabold text-gradient bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-700 mb-6">
                ChemFlow
              </h1>
              <p className="text-2xl font-medium text-gray-700 mb-8">
                Advanced Process Simulation for Chemical Engineers
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Design, analyze, and optimize chemical processes with our powerful simulation platform
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button 
                  onClick={() => navigate("/sign-up")}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg py-6 px-8"
                  size="lg"
                >
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  onClick={() => navigate("/sign-in")} 
                  variant="outline"
                  className="border-2 border-blue-600 text-blue-700 hover:bg-blue-50 text-lg py-6 px-8"
                  size="lg"
                >
                  Log In
                </Button>
              </div>
            </div>
            
            {/* 3D-like visualization */}
            <div className="md:w-1/2 relative h-[400px]">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-80 h-80">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 rounded-full opacity-20 animate-pulse"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ChemFlowLogo className="w-40 h-40" />
                  </div>
                  
                  {/* Orbiting icons */}
                  <div className="absolute inset-0" style={{ animation: 'spin 20s linear infinite' }}>
                    <Beaker className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600 w-10 h-10" />
                    <FlaskConical className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 text-purple-600 w-10 h-10" />
                    <LineChart className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 text-indigo-600 w-10 h-10" />
                    <Atom className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2 text-blue-600 w-10 h-10" />
                    <Thermometer className="absolute top-1/4 right-1/4 text-purple-600 w-8 h-8" />
                    <Database className="absolute bottom-1/4 left-1/4 text-indigo-600 w-8 h-8" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-16">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Powerful Chemical Engineering Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Beaker className="h-10 w-10 text-blue-600" />}
                title="Process Simulation"
                description="Simulate complex chemical processes with industry-standard thermodynamic models"
              />
              <FeatureCard 
                icon={<LineChart className="h-10 w-10 text-purple-600" />}
                title="Advanced Analysis"
                description="Get comprehensive analysis of your simulations including energy usage and efficiency metrics"
              />
              <FeatureCard 
                icon={<Atom className="h-10 w-10 text-indigo-600" />}
                title="Component Database"
                description="Access extensive database of chemical components with accurate property data"
              />
              <FeatureCard 
                icon={<BookOpen className="h-10 w-10 text-green-600" />}
                title="Formula Reference"
                description="Access over 50+ chemical engineering formulas and equations for quick reference"
              />
              <FeatureCard 
                icon={<Gauge className="h-10 w-10 text-amber-600" />}
                title="Process Control"
                description="Design and simulate control strategies for your chemical processes"
              />
              <FeatureCard 
                icon={<Waves className="h-10 w-10 text-cyan-600" />}
                title="Fluid Dynamics"
                description="Model and analyze fluid behaviors in your process equipment"
              />
            </div>
          </section>
          
          {/* New Testimonials Section */}
          <section className="py-16 bg-white/60 backdrop-blur-sm rounded-3xl shadow-sm my-8">
            <div className="max-w-6xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
                Trusted by Chemical Engineers Worldwide
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <TestimonialCard
                  quote="ChemFlow has revolutionized how we approach process design. The simulation tools are intuitive yet powerful."
                  author="Dr. Sarah Chen"
                  role="Process Engineer, PetroChem Industries"
                />
                <TestimonialCard
                  quote="The formula database alone saved me countless hours of reference checking. An essential tool for any chemical engineer."
                  author="Alex Rodriguez"
                  role="Senior Researcher, Advanced Materials"
                />
                <TestimonialCard
                  quote="I've used many simulation tools, but ChemFlow's attention to detail and accuracy stands out from the competition."
                  author="Dr. Michael Okonkwo"
                  role="Professor of Chemical Engineering"
                />
              </div>
            </div>
          </section>
          
          {/* New Price Section */}
          <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl my-8">
            <div className="max-w-4xl mx-auto text-center px-4">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Simple, Transparent Pricing</h2>
              <p className="text-xl text-gray-600 mb-8">Get full access to all ChemFlow features</p>
              
              <div className="bg-white rounded-xl shadow-xl p-8 max-w-md mx-auto">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Full Access</h3>
                <div className="text-5xl font-bold text-blue-600 mb-4">₹500</div>
                <p className="text-gray-600 mb-8">One-time payment, lifetime access</p>
                
                <ul className="text-left space-y-3 mb-8">
                  {[
                    "Complete simulation toolkit",
                    "All chemical formulas & references",
                    "Process design templates",
                    "Equipment sizing tools",
                    "Unlimited projects",
                    "Export & share results"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <div className="mr-2 text-green-500">✓</div>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button 
                  onClick={() => navigate("/sign-up")}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 w-full py-6"
                  size="lg"
                >
                  Get Started Now
                </Button>
              </div>
            </div>
          </section>
          
          {/* CTA Section */}
          <section className="py-16 text-center">
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl shadow-lg p-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-800">Ready to transform your engineering workflow?</h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Join chemical engineers worldwide who use ChemFlow to design, analyze, and optimize their processes
              </p>
              <Button 
                onClick={() => navigate("/sign-up")}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg py-6 px-10"
                size="lg"
              >
                Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </section>
          
          {/* Footer */}
          <footer className="py-8 border-t border-gray-200 mt-16">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <ChemFlowLogo className="h-8 w-auto mr-2" />
                <span className="text-xl font-semibold text-gray-800">ChemFlow</span>
              </div>
              <div className="text-gray-600 text-sm">
                © {new Date().getFullYear()} ChemFlow. All rights reserved.
              </div>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow">
      <div className="bg-blue-50 p-4 rounded-full inline-block mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, author, role }) => {
  return (
    <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-sm">
      <div className="text-blue-600 mb-4 text-3xl">"</div>
      <p className="text-gray-700 italic mb-6">{quote}</p>
      <div>
        <p className="font-semibold text-gray-800">{author}</p>
        <p className="text-gray-600 text-sm">{role}</p>
      </div>
    </div>
  );
};

export default LandingPage;
