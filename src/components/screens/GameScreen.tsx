import React from "react";
import { GameUI } from "../game/GameUI";
import { Pangolin } from "../game/Pangolin";
import { FallingItems } from "../game/FallingItems";
import { GameOver } from "../game/GameOver";
import { Leaderboard } from "../game/Leaderboard";
import { GameItem } from "@/hooks/useGameLogic";
import { LeaderboardEntry } from "@/lib/types";

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
  leaderboardScores: LeaderboardEntry[];
  showLeaderboard: boolean;
  onStartGame: () => void;
  onGoHome: () => void;
  onToggleSound: () => void;
  onShowAchievements: () => void;
  onBackFromLeaderboard: () => void;
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
  leaderboardScores,
  showLeaderboard,
  onStartGame,
  onGoHome,
  onToggleSound,
  onShowAchievements,
  onBackFromLeaderboard,
}: GameScreenProps) => {
  // Show leaderboard when requested
  if (isGameOver && showLeaderboard) {
    return (
      <Leaderboard
        scores={leaderboardScores}
        soundOff={soundOff}
        onBack={onBackFromLeaderboard}
        onGoHome={onGoHome}
        onToggleSound={onToggleSound}
        onStartNewGame={onStartGame}
      />
    );
  }
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
          onShowAchievements={onShowAchievements}
          soundOff={soundOff}
          onToggleSound={onToggleSound}
          showLeaderboard={showLeaderboard}
        />
      )}
    </div>
  );
};
