import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GlassPanel from "@/components/ui/GlassPanel";
import { 
  Cpu, 
  Thermometer, 
  Beaker, 
  BarChart, 
  Sliders, 
  Square, 
  RefreshCw, 
  Wind, 
  Database, 
  Wrench,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  ExternalLink,
  PlayCircle,
  FileText,
  FlaskConical,
  Atom,
  GraduationCap,
  ShieldAlert,
  Factory,
  GitBranch,
  CloudLightning
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ProcessSimulationInterface from "@/components/software-interfaces/ProcessSimulationInterface";
import ThermodynamicInterface from "@/components/software-interfaces/ThermodynamicInterface";
import ReactionEngineeringInterface from "@/components/software-interfaces/ReactionEngineeringInterface";
import DataAnalysisInterface from "@/components/software-interfaces/DataAnalysisInterface";
import ProcessControlInterface from "@/components/software-interfaces/ProcessControlInterface";
import EquipmentDesignInterface from "@/components/software-interfaces/EquipmentDesignInterface";
import PipingDesignInterface from "@/components/software-interfaces/PipingDesignInterface";
import EnvironmentalSafetyInterface from "@/components/software-interfaces/EnvironmentalSafetyInterface";
import CFDInterface from "@/components/software-interfaces/CFDInterface";
import ChemicalDatabaseInterface from "@/components/software-interfaces/ChemicalDatabaseInterface";
import MiscellaneousToolsInterface from "@/components/software-interfaces/MiscellaneousToolsInterface";

interface Software {
  name: string;
  description: string;
  category: SoftwareCategory;
  isFree?: boolean;
  isOpenSource?: boolean;
  url?: string;
  features?: string[];
  supportsRSM?: boolean;
}

type SoftwareCategory = 
  | "process-simulation"
  | "thermodynamic"
  | "reaction-engineering"
  | "data-analysis"
  | "process-control"
  | "equipment-design"
  | "piping-design"
  | "environmental-safety"
  | "cfd"
  | "chemical-database"
  | "molecular-modeling"
  | "educational"
  | "miscellaneous";

interface CategoryInfo {
  id: SoftwareCategory;
  name: string;
  icon: React.ReactNode;
  description: string;
}

const softwareCategories: CategoryInfo[] = [
  {
    id: "process-simulation",
    name: "Process Simulation & Modeling",
    icon: <Cpu className="h-5 w-5" />,
    description: "Used to simulate entire chemical processes with thermodynamic calculations, equipment sizing, and optimization."
  },
  {
    id: "thermodynamic",
    name: "Thermodynamic & Property Calculation",
    icon: <Thermometer className="h-5 w-5" />,
    description: "Specialized in calculating phase behavior, physical properties, and thermodynamic equilibrium."
  },
  {
    id: "reaction-engineering",
    name: "Reaction Engineering & Kinetics",
    icon: <Beaker className="h-5 w-5" />,
    description: "Used for modeling chemical reactors, reaction kinetics, and complex reaction mechanisms."
  },
  {
    id: "data-analysis",
    name: "Data Analysis & Statistics",
    icon: <BarChart className="h-5 w-5" />,
    description: "Essential tools for interpreting experimental data, process data, and statistical analysis."
  },
  {
    id: "process-control",
    name: "Process Control & Automation",
    icon: <Sliders className="h-5 w-5" />,
    description: "Software used to model control loops, automation systems, and dynamic responses."
  },
  {
    id: "equipment-design",
    name: "Equipment Design & Sizing",
    icon: <Square className="h-5 w-5" />,
    description: "Specialized in designing heat exchangers, reactors, separators, and other process equipment."
  },
  {
    id: "piping-design",
    name: "Piping and Instrumentation Design",
    icon: <RefreshCw className="h-5 w-5" />,
    description: "Used for creating plant schematics, piping layouts, and instrumentation diagrams."
  },
  {
    id: "environmental-safety",
    name: "Environmental & Safety Engineering",
    icon: <ShieldAlert className="h-5 w-5" />,
    description: "Tools for assessing process safety, emissions modeling, and environmental impact analysis."
  },
  {
    id: "cfd",
    name: "Computational Fluid Dynamics",
    icon: <Wind className="h-5 w-5" />,
    description: "Advanced simulation of fluid flow, heat transfer, and mass transfer with detailed spatial resolution."
  },
  {
    id: "chemical-database",
    name: "Chemical Database & Properties",
    icon: <Database className="h-5 w-5" />,
    description: "Used for accessing chemical property databases and property estimation."
  },
  {
    id: "molecular-modeling",
    name: "Molecular Modeling & Materials Design",
    icon: <Atom className="h-5 w-5" />,
    description: "Tools for molecular design, structure analysis, and material property prediction."
  },
  {
    id: "educational",
    name: "Educational Tools",
    icon: <GraduationCap className="h-5 w-5" />,
    description: "Software used for teaching and learning chemical engineering concepts."
  },
  {
    id: "miscellaneous",
    name: "Miscellaneous Tools",
    icon: <Wrench className="h-5 w-5" />,
    description: "Specialized software for integrated tasks and unique chemical engineering applications."
  }
];

[The rest of the code is too long for this response - continuing in next message...]
