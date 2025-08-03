import { useState, useEffect } from "react";

export const useShield = () => {
  const [isProtected, setIsProtected] = useState(false);
  const [shieldTimeLeft, setShieldTimeLeft] = useState(0);

  // Shield timer logic
  useEffect(() => {
    if (!isProtected) return;

    setShieldTimeLeft(10);
    const timer = setInterval(() => {
      setShieldTimeLeft((t) => {
        if (t <= 1) {
          setIsProtected(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isProtected]);

  const activateShield = () => {
    setIsProtected(true);
  };

  const resetShield = () => {
    setIsProtected(false);
    setShieldTimeLeft(0);
  };

  return {
    isProtected,
    shieldTimeLeft,
    activateShield,
    resetShield,
  };
};
