
import { useState, useEffect } from "react";

export function useLoadingAnimation(loadingDuration = 2000) {
  const [loading, setLoading] = useState(true);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      const fadeAnimation = setInterval(() => {
        setOpacity((prevOpacity) => {
          if (prevOpacity <= 0.2) {
            clearInterval(fadeAnimation);
            return 0.2;
          }
          return prevOpacity - 0.05;
        });
      }, 100);

      return () => clearInterval(fadeAnimation);
    }, 1000);

    const loadingTimer = setTimeout(() => {
      setLoading(false);
    }, loadingDuration);
    
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(loadingTimer);
    };
  }, [loadingDuration]);

  return { loading, opacity };
}
