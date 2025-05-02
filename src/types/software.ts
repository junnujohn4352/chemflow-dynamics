
export interface Feature {
  title: string;
  description: string;
}

export type SoftwareCategory =
  | "Process Simulation"
  | "Thermodynamic Properties"
  | "Equipment Design"
  | "Process Control"
  | "Laboratory & Data Analysis"
  | "Reaction Engineering"
  | "Data Analysis"
  | "Piping Design"
  | "Environmental & Safety"
  | "CFD & Transport Phenomena"
  | "Chemical Database"
  | "Miscellaneous Tools";

export type SoftwarePricing = "Free" | "Paid" | "Freemium" | "Subscription" | "Enterprise";

export type SoftwareType = 
  | "Type 1: Process Simulation & Modeling"
  | "Type 2: Thermodynamic & Property Estimation"
  | "Type 3: Equipment Design & Sizing"
  | "Type 4: Process Control & Optimization"
  | "Type 5: Laboratory, Data Analysis & R&D";

export interface Software {
  id: string;
  name: string;
  description: string;
  category: SoftwareCategory;
  type: SoftwareType;
  price: SoftwarePricing;
  openSource: boolean;
  website?: string;
  repository?: string;
  features?: string[];
  usedIn?: string[];
  rating?: number;
  votes?: number;
  logo?: string;
}

export interface EducationalResource {
  id: string;
  title: string;
  description: string;
  type: string;
  url: string;
  tags: string[];
  subject?: string;
  platform?: string;
}

export interface SoftwareDatabase {
  software: Software[];
  educationalResources: EducationalResource[];
}
