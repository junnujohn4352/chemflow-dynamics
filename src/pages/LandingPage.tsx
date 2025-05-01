
import React from "react";
import { useLoadingAnimation } from "@/hooks/useLoadingAnimation";
import LoadingScreen from "@/components/landing/LoadingScreen";
import LandingContent from "@/components/landing/LandingContent";

const LandingPage = () => {
  const { loading, opacity } = useLoadingAnimation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center 
      bg-gradient-to-br from-purple-100 via-blue-100 to-cyan-100 overflow-hidden relative">
      {loading ? (
        <LoadingScreen opacity={opacity} />
      ) : (
        <LandingContent />
      )}
    </div>
  );
};

export default LandingPage;
