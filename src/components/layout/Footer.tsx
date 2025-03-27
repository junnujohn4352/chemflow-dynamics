
import React from "react";
import ChemFlowLogo from "@/assets/icons/ChemFlowLogo";
import { 
  Twitter, 
  Linkedin, 
  Github, 
  Youtube 
} from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-screen-2xl mx-auto px-6 py-16">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-4">
            <ChemFlowLogo className="h-10 w-auto" />
            <p className="mt-5 text-gray-600 max-w-md">
              ChemFlow is a modern, intuitive chemical process simulation software designed for engineers and scientists to model, analyze, and optimize chemical processes.
            </p>
            <div className="flex space-x-4 mt-6">
              <SocialIcon icon={<Twitter />} href="#" />
              <SocialIcon icon={<Linkedin />} href="#" />
              <SocialIcon icon={<Github />} href="#" />
              <SocialIcon icon={<Youtube />} href="#" />
            </div>
          </div>
          
          <div className="col-span-6 sm:col-span-4 lg:col-span-2">
            <h3 className="font-medium text-lg mb-4">Product</h3>
            <ul className="space-y-3">
              <FooterLink href="#">Features</FooterLink>
              <FooterLink href="#">Pricing</FooterLink>
              <FooterLink href="#">Integrations</FooterLink>
              <FooterLink href="#">Case Studies</FooterLink>
              <FooterLink href="#">Documentation</FooterLink>
            </ul>
          </div>
          
          <div className="col-span-6 sm:col-span-4 lg:col-span-2">
            <h3 className="font-medium text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              <FooterLink href="#">About Us</FooterLink>
              <FooterLink href="#">Careers</FooterLink>
              <FooterLink href="#">Press</FooterLink>
              <FooterLink href="#">Blog</FooterLink>
              <FooterLink href="#">Contact</FooterLink>
            </ul>
          </div>
          
          <div className="col-span-6 sm:col-span-4 lg:col-span-2">
            <h3 className="font-medium text-lg mb-4">Resources</h3>
            <ul className="space-y-3">
              <FooterLink href="#">Help Center</FooterLink>
              <FooterLink href="#">Community</FooterLink>
              <FooterLink href="#">Tutorials</FooterLink>
              <FooterLink href="#">Webinars</FooterLink>
              <FooterLink href="#">API</FooterLink>
            </ul>
          </div>
          
          <div className="col-span-6 sm:col-span-8 lg:col-span-2">
            <h3 className="font-medium text-lg mb-4">Legal</h3>
            <ul className="space-y-3">
              <FooterLink href="#">Privacy Policy</FooterLink>
              <FooterLink href="#">Terms of Service</FooterLink>
              <FooterLink href="#">Security</FooterLink>
              <FooterLink href="#">Compliance</FooterLink>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} ChemFlow. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <select className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-flow-blue/20 focus:border-flow-blue transition-all">
              <option value="en">English (US)</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="es">Español</option>
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
};

interface SocialIconProps {
  icon: React.ReactNode;
  href: string;
}

const SocialIcon: React.FC<SocialIconProps> = ({ icon, href }) => {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-flow-blue hover:border-flow-blue transition-colors"
    >
      {React.cloneElement(icon as React.ReactElement, { className: "h-5 w-5" })}
    </a>
  );
};

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

const FooterLink: React.FC<FooterLinkProps> = ({ href, children }) => {
  return (
    <li>
      <a 
        href={href} 
        className="text-gray-600 hover:text-flow-blue transition-colors"
      >
        {children}
      </a>
    </li>
  );
};

export default Footer;
