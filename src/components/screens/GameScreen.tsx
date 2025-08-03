import React from "react";
import { GameUI } from "../game/GameUI";
import { Pangolin } from "../game/Pangolin";
import { FallingItems } from "../game/FallingItems";
import { GameOver } from "../game/GameOver";
import { GameItem } from "@/hooks/useGameLogic";

interface GameScreenProps {
  gameAreaRef: React.RefObject<HTMLDivElement | null>;
  isGameOver: boolean;
  score: number;
  lives: number;
  pangolinX: number;
  pangolinY: number;
  isProtected: boolean;
  shieldTimeLeft: number;
  items: GameItem[];
  soundOff: boolean;
  onStartGame: () => void;
  onGoHome: () => void;
  onToggleSound: () => void;
}

export const GameScreen = ({
  gameAreaRef,
  isGameOver,
  score,
  lives,
  pangolinX,
  pangolinY,
  isProtected,
  shieldTimeLeft,
  items,
  soundOff,
  onStartGame,
  onGoHome,
  onToggleSound,
}: GameScreenProps) => {
  return (
    <div
      ref={gameAreaRef}
      className="relative overflow-hidden w-full h-screen bg-black"
    >
      {!isGameOver && (
        <div>
          <div className="absolute top-0 left-0 w-full h-full bg-repeat-y bg-[url('/image/GameBackground.png')] animate-scrollBg z-0" />

          <GameUI
            score={score}
            lives={lives}
            soundOff={soundOff}
            onGoHome={onGoHome}
            onToggleSound={onToggleSound}
          />

          <Pangolin
            pangolinX={pangolinX}
            pangolinY={pangolinY}
            isProtected={isProtected}
            shieldTimeLeft={shieldTimeLeft}
          />

          <FallingItems items={items} />
        </div>
      )}

      {/* Game Over Component */}
      {isGameOver && (
        <GameOver
          score={score}
          onPlayAgain={onStartGame}
          onGoHome={onGoHome}
          soundOff={soundOff}
          onToggleSound={onToggleSound}
        />
      )}
    </div>
  );
};
