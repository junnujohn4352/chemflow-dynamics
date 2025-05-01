
import React from "react";
import GlassPanel from "@/components/ui/GlassPanel";

interface FormulaCardProps {
  title: string;
  formula: string;
  className?: string;
}

const FormulaCard: React.FC<FormulaCardProps> = ({ title, formula, className }) => {
  return (
    <GlassPanel className={`p-6 hover:scale-105 transition-all duration-300 ${className}`}>
      <h3 className="text-lg font-bold text-purple-700 mb-2">{title}</h3>
      <p className="font-mono text-purple-600">{formula}</p>
    </GlassPanel>
  );
};

export default FormulaCard;
