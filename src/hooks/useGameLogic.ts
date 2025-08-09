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

  // Black ants - always common (base food)
  probabilities.push(...Array(10).fill(ITEM_TYPES.BLACK_ANT));

  // Golden ants - slightly less common at high scores but still present
  const goldenAntCount = score < 100 ? 3 : 2;
  probabilities.push(...Array(goldenAntCount).fill(ITEM_TYPES.GOLDEN_ANT));

  // Traps - increase much more aggressively with score for difficulty
  let trapCount = 1;
  if (score > 20) trapCount = Math.floor(score / 10); // Start increasing earlier
  if (score > 50) trapCount = Math.floor(score / 8); // More traps at moderate scores
  if (score > 100) trapCount = Math.floor(score / 6); // Even more at high scores
  if (score > 200) trapCount = Math.floor(score / 4); // Very aggressive at very high scores
  trapCount = Math.min(trapCount, 12); // Higher cap to allow more traps at extreme scores
  probabilities.push(...Array(trapCount).fill(ITEM_TYPES.TRAP));

  // Shields - decrease at high scores but don't completely disappear
  let shieldCount = 2;
  if (score > 80) shieldCount = 1;
  if (score > 200) shieldCount = Math.max(1, Math.floor(Math.random() * 2)); // Random 0-1 shields at very high scores
  probabilities.push(...Array(shieldCount).fill(ITEM_TYPES.SHIELD));

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

const scoreToSpawnRate = (score: number) => {
  // Base spawn rate: 1000ms (1 second)
  // At high scores, spawn much more frequently
  const baseRate = 1000;
  const k = 0.08; // Controls how quickly spawn rate increases

  return Math.max(
    300, // Minimum 300ms between spawns (very frequent at high scores)
    baseRate -
      200 / (1 + Math.exp(-k * (score - 50))) - // Start reducing at score 50
      300 / (1 + Math.exp(-k * (score - 100))) - // More reduction at score 100
      200 / (1 + Math.exp(-k * (score - 150))) - // Even more at score 150
      100 / (1 + Math.exp(-k * (score - 200))) // Maximum reduction at score 200+
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
  onLoseLife: () => boolean; // Returns true if game should end
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
  onLoseLife,
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
    }, scoreToSpawnRate(score));
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
          // When item reaches bottom area, check collision
          // Expanded collision zone to account for fast-falling items

          if (dx < 8 && item.y > 80 && item.y < 100) {
            // Collision detected - handle it and DON'T add to remaining (item disappears)
            if (item.type === ITEM_TYPES.TRAP) {
              if (!isProtected) {
                if (!soundOff && sounds.trapSound.current) {
                  sounds.trapSound.current.play();
                }
                // Use lives system instead of immediate game over
                const shouldEndGame = onLoseLife();
                if (shouldEndGame) {
                  onGameOver();
                }
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
            // Item collided - don't add to remaining array (it disappears)
          } else {
            // No collision - keep the item
            remaining.push(item);
          }
        }
        return remaining;
      });
    };
    const interval = setInterval(
      checkCollision,
      Math.min(25, scoreToSpeed(score) / 2)
    ); // Check at least twice per item movement
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
    onLoseLife,
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
