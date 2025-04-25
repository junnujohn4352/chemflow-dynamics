
  const getRecommendation = (): string => {
    if (hasHydrocarbons && !hasAlcohols && !hasWater) {
      return "Peng-Robinson";
    } else if (hasHydrocarbons && (hasAlcohols || hasWater)) {
      return "NRTL";
    } else if (hasAlcohols && hasWater) {
      return "Wilson";
    } else if (hasHydrocarbons && hasAlcohols && !hasWater) {
      return "SRK";
    } else if (hasAlcohols && !hasWater && !hasHydrocarbons) {
      return "UNIQUAC";
    } else {
      return "Peng-Robinson";
    }
  };
