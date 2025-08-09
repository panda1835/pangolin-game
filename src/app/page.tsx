"use client";

import { useRef, useState, useEffect } from "react";
import {
  HomeScreen,
  InstructionsScreen,
  GameScreen,
} from "@/components/screens";
import { QuizModal } from "@/components/game/QuizModal";
import {
  useAudio,
  useBackgroundMusic,
  useGameLogic,
  usePangolinMovement,
  useShield,
  useLivesAndQuiz,
} from "@/hooks";
import { saveScore, getLeaderboard } from "@/lib/leaderboard";
import { LeaderboardEntry } from "@/lib/types";

export default function Home() {
  const [screen, setScreen] = useState<"home" | "instructions" | "game">(
    "home"
  );
  const [isGameOver, setIsGameOver] = useState(false);
  const [soundOff, setSoundOff] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardFromHome, setLeaderboardFromHome] = useState(false);
  const [leaderboardScores, setLeaderboardScores] = useState<
    LeaderboardEntry[]
  >([]);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // Initialize all audio references
  const audioRefs = useAudio();

  // Initialize game hooks
  const { pangolinX, pangolinY, jump, resetPosition } = usePangolinMovement({
    screen,
    gameAreaRef,
  });

  const { isProtected, shieldTimeLeft, activateShield, resetShield } =
    useShield();

  // Initialize lives and quiz system with a temporary score state
  const [currentScore, setCurrentScore] = useState(0);

  const {
    lives,
    currentQuiz,
    showQuiz,
    handleQuizAnswer,
    handleQuizClose,
    loseLife,
    resetLives,
  } = useLivesAndQuiz({
    score: currentScore,
    isGameOver,
    onPause: () => setIsPaused(true),
    onResume: () => setIsPaused(false),
  });

  const { items, score, resetGame } = useGameLogic({
    screen,
    isGameOver: isGameOver || isPaused, // Pause game during quiz
    pangolinX,
    isProtected,
    soundOff,
    sounds: {
      blackAntSound: audioRefs.blackAntSound,
      goldenAntSound: audioRefs.goldenAntSound,
      shieldSound: audioRefs.shieldSound,
      trapSound: audioRefs.trapSound,
    },
    onScoreChange: (newScore: number) => setCurrentScore(newScore),
    onGameOver: () => setIsGameOver(true),
    onPangolinJump: jump,
    onShieldActivate: activateShield,
    onLoseLife: loseLife,
  });

  // Load leaderboard scores on component mount
  useEffect(() => {
    setLeaderboardScores(getLeaderboard());
  }, []);

  // Save score when game is over
  useEffect(() => {
    if (isGameOver && score > 0) {
      saveScore(score);
      setLeaderboardScores(getLeaderboard()); // Refresh leaderboard
    }
  }, [isGameOver, score]);

  // Handle background music
  useBackgroundMusic({
    screen,
    soundOff,
    isGameOver,
    showLeaderboard,
    leaderboardFromHome,
    bgAudio: audioRefs.bgAudio,
    gameOverAudio: audioRefs.gameOverAudio,
  });

  const toggleSound = () => {
    setSoundOff((prev) => !prev);
    if (audioRefs.transitionSound.current) {
      if (soundOff) {
        audioRefs.transitionSound.current.play();
      } else {
        audioRefs.transitionSound.current.pause();
        audioRefs.transitionSound.current.currentTime = 0;
      }
    }
  };

  const handleResetGame = () => {
    resetPosition();
    resetGame();
    resetShield();
    resetLives();
    setCurrentScore(0);
    setIsPaused(false);
    setIsGameOver(false);
    setShowLeaderboard(false); // Reset leaderboard view
    setLeaderboardFromHome(false); // Reset the flag
  };

  const handleShowAchievements = () => {
    setShowLeaderboard(true);
    if (screen === "home") {
      setScreen("game");
      setIsGameOver(true); // Set game over state to show leaderboard properly
      setLeaderboardFromHome(true); // Track that we came from home
    }
  };

  const handleBackFromLeaderboard = () => {
    setShowLeaderboard(false);
    setLeaderboardFromHome(false); // Reset the flag
    // If we came from home screen, go back to home
    if (!isGameOver || screen !== "game") {
      setScreen("home");
      setIsGameOver(false);
    }
  };

  const startGame = () => {
    handleResetGame();
    setScreen("game");
    if (!soundOff && audioRefs.transitionSound.current) {
      audioRefs.transitionSound.current.play();
    }
  };

  const goHome = () => {
    // Only stop game over audio if it's playing, but allow smooth transition to home music
    if (
      audioRefs.gameOverAudio.current &&
      !audioRefs.gameOverAudio.current.paused
    ) {
      audioRefs.gameOverAudio.current.pause();
      audioRefs.gameOverAudio.current.currentTime = 0;
    }
    handleResetGame();
    setScreen("home");
    if (!soundOff && audioRefs.transitionSound.current) {
      audioRefs.transitionSound.current.play();
    }
  };

  const navigateToInstructions = () => {
    setScreen("instructions");
    // Don't restart audio - let it continue from home to instructions
    if (!soundOff && audioRefs.transitionSound.current) {
      audioRefs.transitionSound.current.play();
    }
  };

  return (
    <>
      {screen === "home" && (
        <HomeScreen
          soundOff={soundOff}
          onNavigateToInstructions={navigateToInstructions}
          onToggleSound={toggleSound}
          onShowAchievements={handleShowAchievements}
        />
      )}

      {screen === "instructions" && (
        <InstructionsScreen
          soundOff={soundOff}
          onStartGame={startGame}
          onGoHome={goHome}
          onToggleSound={toggleSound}
        />
      )}

      {screen === "game" && (
        <>
          <GameScreen
            gameAreaRef={gameAreaRef}
            isGameOver={isGameOver}
            score={score}
            lives={lives}
            pangolinX={pangolinX}
            pangolinY={pangolinY}
            isProtected={isProtected}
            shieldTimeLeft={shieldTimeLeft}
            items={items}
            soundOff={soundOff}
            leaderboardScores={leaderboardScores}
            showLeaderboard={showLeaderboard}
            leaderboardFromHome={leaderboardFromHome}
            onStartGame={startGame}
            onGoHome={goHome}
            onToggleSound={toggleSound}
            onShowAchievements={handleShowAchievements}
            onBackFromLeaderboard={handleBackFromLeaderboard}
          />

          {currentQuiz && (
            <QuizModal
              quiz={currentQuiz}
              isVisible={showQuiz}
              soundOff={soundOff}
              onAnswer={handleQuizAnswer}
              onClose={handleQuizClose}
            />
          )}
        </>
      )}
    </>
  );
}
