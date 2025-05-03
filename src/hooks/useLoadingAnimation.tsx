
import { useState, useEffect } from "react";

export const useLoadingAnimation = () => {
  const [loading, setLoading] = useState(true);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setOpacity(0);
    }, 2500);

    const timer2 = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return { loading, opacity };
};
