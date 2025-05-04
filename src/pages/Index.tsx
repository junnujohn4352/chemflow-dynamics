import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProcessFlow from "@/components/ui/ProcessFlow";
import GlassPanel from "@/components/ui/GlassPanel";
import EquipmentCard from "@/components/ui/equipment/EquipmentCard";
import { ArrowRight, ChevronRight, Download, Play, BookOpen, Server, Gauge, FlaskConical, PieChart, Atom } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative bg-gradient-mesh">
        <div className="absolute inset-0 bg-gradient-radial from-blue-50/70 to-transparent"></div>
        <div className="max-w-screen-xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-12 mb-10 lg:mb-0">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-flow-blue text-sm font-medium mb-6 animate-fade-in-up">
                <span className="mr-2 bg-flow-blue text-white text-xs px-2 py-0.5 rounded-full">NEW</span>
                Introducing ChemFlow 1.0
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
                Chemical Process <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-flow-blue via-flow-cyan to-flow-teal">
                  Simulation Reimagined
                </span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                ChemFlow delivers elegant, powerful process simulation with an intuitive interface designed for modern engineers and scientists.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
                <Link
                  to="/simulations"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-flow-blue text-white font-medium shadow-sm hover:bg-flow-blue/90 transition-colors"
                >
                  Start Simulating
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <a
                  href="#demo"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  <Play className="mr-2 h-4 w-4 text-flow-blue" />
                  Watch Demo
                </a>
              </div>
            </div>
            
            <div className="lg:w-1/2 animate-fade-in-up" style={{ animationDelay: "400ms" }}>
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-flow-blue via-flow-cyan to-flow-teal rounded-2xl blur-lg opacity-30 animate-pulse-subtle"></div>
                <div className="relative">
                  <ProcessFlow />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Powerful Features, Simple Interface</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              ChemFlow combines advanced simulation capabilities with an intuitive user experience designed for efficiency and precision.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<FlaskConical className="h-6 w-6" />}
              title="Advanced Thermodynamics"
              description="Access comprehensive property packages and thermodynamic models for accurate process simulation."
              delay={0}
            />
            <FeatureCard 
              icon={<Server className="h-6 w-6" />}
              title="Equipment Library"
              description="Extensive collection of pre-configured unit operations and equipment models ready to use."
              delay={100}
            />
            <FeatureCard 
              icon={<PieChart className="h-6 w-6" />}
              title="Real-time Analysis"
              description="Visualize process data with interactive charts and dynamic reporting capabilities."
              delay={200}
            />
            <FeatureCard 
              icon={<Atom className="h-6 w-6" />}
              title="Chemical Database"
              description="Comprehensive database of chemical components with physical properties and interaction parameters."
              delay={300}
            />
            <FeatureCard 
              icon={<Gauge className="h-6 w-6" />}
              title="Optimization Tools"
              description="Built-in tools for sensitivity analysis, optimization, and process improvement."
              delay={400}
            />
            <FeatureCard 
              icon={<BookOpen className="h-6 w-6" />}
              title="Intuitive Documentation"
              description="Extensive documentation with tutorials, examples, and best practices for effective modeling."
              delay={500}
            />
          </div>
        </div>
      </section>
      
      {/* Process Showcase */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Model Any Process</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From simple unit operations to complex integrated processes, ChemFlow handles a wide range of chemical engineering applications.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <EquipmentCard 
              type="reactor" 
              title="Batch Reactor" 
              status="running" 
              metrics={[
                { key: "Temperature", value: "85°C" },
                { key: "Pressure", value: "150 kPa" },
                { key: "Flow", value: "1200 kg/h" }
              ]}
            />
            <EquipmentCard 
              type="distillation" 
              title="Distillation Column" 
              status="running" 
              metrics={[
                { key: "Temperature", value: "95°C" },
                { key: "Pressure", value: "150 kPa" },
                { key: "Flow", value: "1200 kg/h" }
              ]}
            />
            <EquipmentCard 
              type="heater" 
              title="Heat Exchanger" 
              status="running" 
              metrics={[
                { key: "Temperature", value: "120°C" },
                { key: "Flow", value: "75 kg/h" }
              ]}
            />
            <EquipmentCard 
              type="mixer" 
              title="Mixing Vessel" 
              status="running" 
              metrics={[
                { key: "Level", value: "65%" },
                { key: "Pressure", value: "110 kPa" }
              ]}
            />
          </div>
          
          <div className="mt-10 text-center">
            <Link
              to="/components"
              className="inline-flex items-center text-flow-blue hover:text-flow-blue/80 font-medium"
            >
              Explore all equipment models
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-6 relative bg-gradient-to-r from-gray-900 to-gray-800 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-flow-blue"></div>
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-flow-cyan"></div>
          <div className="absolute top-40 left-1/3 w-40 h-40 rounded-full bg-flow-teal"></div>
        </div>
        
        <div className="max-w-screen-xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-2/3 mb-10 lg:mb-0">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                Ready to Transform Your Process Engineering Workflow?
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl">
                Join thousands of engineers who use ChemFlow to design, optimize, and analyze chemical processes with precision and ease.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/simulations"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white text-gray-900 font-medium shadow-sm hover:bg-gray-100 transition-colors"
              >
                Try For Free
              </Link>
              <a
                href="#"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-transparent border border-white/20 text-white font-medium hover:bg-white/10 transition-colors"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Brochure
              </a>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay }) => {
  return (
    <div 
      className="p-6 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="p-3 rounded-xl bg-blue-50 text-flow-blue inline-block mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-medium mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default Index;
