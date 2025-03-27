
import React from "react";
import { cn } from "@/lib/utils";

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  intensity?: "light" | "medium" | "heavy";
}

const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  className,
  intensity = "medium",
}) => {
  const intensityClasses = {
    light: "bg-white/30 backdrop-blur-sm border-white/10 shadow-sm",
    medium: "bg-white/50 backdrop-blur-md border-white/20 shadow-md",
    heavy: "bg-white/70 backdrop-blur-xl border-white/30 shadow-lg",
  };

  return (
    <div className={cn(
      "rounded-2xl border transition-all duration-300",
      intensityClasses[intensity],
      className
    )}>
      {children}
    </div>
  );
};

export default GlassPanel;
