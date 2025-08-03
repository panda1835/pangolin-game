import { useState, useEffect } from "react";

export interface GameItem {
  id: string;
  x: number;
  y: number;
  type: string;
}

export const ITEM_TYPES = {
  BLACK_ANT: "BlackAnt",
  GOLDEN_ANT: "GoldenAnt",
  TRAP: "Trap",
  SHIELD: "Shield",
};

const getRandomItem = (score: number): GameItem => {
  const probabilities = [];

  // Base: More common items
  probabilities.push(
    ...Array(10).fill(ITEM_TYPES.BLACK_ANT),
    ...Array(score < 100 ? 2 : 1).fill(ITEM_TYPES.GOLDEN_ANT),
    ...Array(score > 30 ? Math.floor(score / 10) : 1).fill(ITEM_TYPES.TRAP),
    ...Array(score < 80 ? 2 : 1).fill(ITEM_TYPES.SHIELD)
  );

  // Random pick based on weighted array
  const type = probabilities[Math.floor(Math.random() * probabilities.length)];
  const x = Math.random() * 80 + 10;

  return { id: `${Date.now()}-${Math.random()}`, x, y: -10, type };
};

const scoreToSpeed = (score: number) => {
  const k = 0.1; // steeper = faster drop
  return (
    70 -
    20 / (1 + Math.exp(-k * (score - 50))) -
    25 / (1 + Math.exp(-k * (score - 100))) -
    10 / (1 + Math.exp(-k * (score - 150))) -
    5 / (1 + Math.exp(-k * (score - 200)))
  );
};

interface UseGameLogicProps {
  screen: "home" | "instructions" | "game";
  isGameOver: boolean;
  pangolinX: number;
  isProtected: boolean;
  soundOff: boolean;
  sounds: {
    blackAntSound: React.RefObject<HTMLAudioElement | null>;
    goldenAntSound: React.RefObject<HTMLAudioElement | null>;
    shieldSound: React.RefObject<HTMLAudioElement | null>;
    trapSound: React.RefObject<HTMLAudioElement | null>;
  };
  onScoreChange: (score: number) => void;
  onGameOver: () => void;
  onPangolinJump: () => void;
  onShieldActivate: () => void;
}

export const useGameLogic = ({
  screen,
  isGameOver,
  pangolinX,
  isProtected,
  soundOff,
  sounds,
  onScoreChange,
  onGameOver,
  onPangolinJump,
  onShieldActivate,
}: UseGameLogicProps) => {
  const [items, setItems] = useState<GameItem[]>([]);
  const [score, setScore] = useState(0);

  // Item falling logic
  useEffect(() => {
    if (screen !== "game" || isGameOver) return;
    const interval = setInterval(() => {
      setItems((prev) =>
        prev
          .map((item) => ({ ...item, y: item.y + 1 }))
          .filter((item) => item.y < 500)
      );
    }, scoreToSpeed(score));
    return () => clearInterval(interval);
  }, [screen, isGameOver, score]);

  // Item spawning logic
  useEffect(() => {
    if (screen !== "game" || isGameOver) return;
    const spawnInterval = setInterval(() => {
      setItems((prev) => [...prev, getRandomItem(score)]);
    }, 1000);
    return () => clearInterval(spawnInterval);
  }, [screen, isGameOver, score]);

  // Collision detection
  useEffect(() => {
    if (screen !== "game") return;

    const checkCollision = () => {
      setItems((prev) => {
        const remaining: GameItem[] = [];
        for (const item of prev) {
          const dx = Math.abs(item.x - pangolinX);
          // Pangolin is at the bottom of screen (around 90-95% from top)
          // Items fall from top (y starts at -10 and increases)
          // When item reaches bottom area (y > 85), check collision

          if (dx < 8 && item.y > 85 && item.y < 95) {
            // More lenient collision detection
            console.log(
              `Collision detected! Item: ${item.type}, dx: ${dx}, item.y: ${item.y}, pangolinX: ${pangolinX}`
            );
            if (item.type === ITEM_TYPES.TRAP) {
              if (!isProtected) {
                if (!soundOff && sounds.trapSound.current) {
                  sounds.trapSound.current.play();
                }
                onGameOver();
              }
            } else {
              onPangolinJump();

              if (item.type === ITEM_TYPES.BLACK_ANT) {
                const newScore = score + 1;
                setScore(newScore);
                onScoreChange(newScore);
                if (!soundOff) sounds.blackAntSound.current?.play();
              } else if (item.type === ITEM_TYPES.GOLDEN_ANT) {
                const newScore = score + 10;
                setScore(newScore);
                onScoreChange(newScore);
                if (!soundOff) sounds.goldenAntSound.current?.play();
              } else if (item.type === ITEM_TYPES.SHIELD) {
                onShieldActivate();
                if (!soundOff) sounds.shieldSound.current?.play();
              }
            }
          } else {
            remaining.push(item);
          }
        }
        return remaining;
      });
    };
    const interval = setInterval(checkCollision, 50); // Check more frequently
    return () => clearInterval(interval);
  }, [
    pangolinX,
    isProtected,
    screen,
    soundOff,
    score,
    sounds,
    onScoreChange,
    onGameOver,
    onPangolinJump,
    onShieldActivate,
  ]);

  const resetGame = () => {
    setItems([]);
    setScore(0);
    onScoreChange(0);
  };

  return {
    items,
    score,
    resetGame,
  };
};
