
import React from "react";
import { Layout } from "@/components/layout/Layout";
import { ArrowRight } from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";
import { Link } from "react-router-dom";

const About: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          <section className="mb-12">
            <GlassPanel className="p-8 animate-fade-in">
              <h1 className="text-4xl font-bold mb-6 text-flow-blue">About LOL Groups</h1>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className="text-lg text-gray-700 mb-4">
                    LOL Groups is a pioneering chemical engineering solutions provider, specializing in process simulation 
                    software for chemical engineers worldwide. Our flagship product, ChemFlow, is designed to help engineers 
                    model, analyze, and optimize chemical processes with unprecedented ease and accuracy.
                  </p>
                  
                  <p className="text-lg text-gray-700 mb-4">
                    Founded with a vision to revolutionize the chemical engineering industry, 
                    LOL Groups continues to push the boundaries of innovation in process simulation technology.
                  </p>
                  
                  <div className="mt-8">
                    <Link 
                      to="/simulations" 
                      className="inline-flex items-center bg-flow-blue text-white px-5 py-3 rounded-lg hover:bg-flow-blue/90 transition-colors"
                    >
                      Explore Our Simulations
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <h2 className="text-2xl font-medium mb-4 text-gray-800">Company Highlights</h2>
                  
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="bg-green-100 rounded-full p-1 mr-3 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Industry-leading process simulation technology</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-green-100 rounded-full p-1 mr-3 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Trusted by engineering firms worldwide</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-green-100 rounded-full p-1 mr-3 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Dedicated to innovation and research</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-green-100 rounded-full p-1 mr-3 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Customer-focused solutions and support</span>
                    </li>
                  </ul>
                </div>
              </div>
            </GlassPanel>
          </section>
          
          <section className="mb-12">
            <GlassPanel className="p-8 animate-fade-in">
              <h2 className="text-3xl font-bold mb-6 text-flow-blue">Our Founders</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
                  <div className="p-6">
                    <h3 className="text-xl font-medium text-gray-900 mb-1">P. Janardhan Reddy</h3>
                    <p className="text-flow-blue mb-4">Founder & CEO</p>
                    
                    <p className="text-gray-600 mb-4">
                      With over 15 years of experience in chemical engineering and process design, 
                      P. Janardhan Reddy founded LOL Groups with a vision to create cutting-edge 
                      simulation tools that make complex processes more accessible and efficient.
                    </p>
                    
                    <p className="text-gray-600">
                      His expertise in process optimization and simulation has been the driving force 
                      behind ChemFlow's development and success.
                    </p>
                  </div>
                </div>
                
                <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
                  <div className="p-6">
                    <h3 className="text-xl font-medium text-gray-900 mb-1">D. Harishwar</h3>
                    <p className="text-flow-blue mb-4">Co-Founder & CTO</p>
                    
                    <p className="text-gray-600 mb-4">
                      D. Harishwar brings extensive technical expertise in software development 
                      and computational methods to LOL Groups. As the co-founder and CTO, he leads 
                      the technical development of ChemFlow, ensuring it meets the highest standards 
                      of accuracy and user experience.
                    </p>
                    
                    <p className="text-gray-600">
                      His innovative approach to engineering software has revolutionized how engineers 
                      interact with simulation tools.
                    </p>
                  </div>
                </div>
              </div>
            </GlassPanel>
          </section>
          
          <section>
            <GlassPanel className="p-8 animate-fade-in">
              <h2 className="text-3xl font-bold mb-6 text-flow-blue">Our Mission</h2>
              
              <p className="text-lg text-gray-700 mb-6">
                At LOL Groups, our mission is to empower chemical engineers with intuitive, powerful, 
                and reliable simulation tools that accelerate innovation and improve process efficiency. 
                We are committed to advancing the field of chemical engineering through continuous 
                innovation and customer-focused solutions.
              </p>
              
              <div className="bg-flow-blue/5 p-6 rounded-lg border border-flow-blue/10 mt-6">
                <blockquote className="text-xl italic text-gray-700">
                  "Our goal is to simplify complex chemical processes through innovative simulation technology, 
                  making the impossible possible for engineers worldwide."
                </blockquote>
                <p className="mt-2 text-flow-blue font-medium">— P. Janardhan Reddy, Founder & CEO</p>
              </div>
            </GlassPanel>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default About;
