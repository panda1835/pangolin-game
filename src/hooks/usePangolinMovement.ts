import { useState, useEffect } from "react";

interface UsePangolinMovementProps {
  screen: "home" | "instructions" | "game";
  gameAreaRef: React.RefObject<HTMLDivElement | null>;
}

export const usePangolinMovement = ({
  screen,
  gameAreaRef,
}: UsePangolinMovementProps) => {
  const [pangolinX, setPangolinX] = useState(50);
  const [pangolinY, setPangolinY] = useState(0);

  // Game movement logic
  useEffect(() => {
    if (screen !== "game") return;

    const handleMove = (clientX: number) => {
      if (!gameAreaRef.current) return;
      const rect = gameAreaRef.current.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 100;
      setPangolinX(Math.min(90, Math.max(10, x)));
    };

    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [screen, gameAreaRef]);

  const jump = () => {
    setPangolinY(10);
    setTimeout(() => setPangolinY(0), 150);
  };

  const resetPosition = () => {
    setPangolinX(50);
    setPangolinY(0);
  };

  return {
    pangolinX,
    pangolinY,
    jump,
    resetPosition,
  };
};
