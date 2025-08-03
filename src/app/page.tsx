"use client";

import { useRef, useState } from "react";
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

export default function Home() {
  const [screen, setScreen] = useState<"home" | "instructions" | "game">(
    "home"
  );
  const [isGameOver, setIsGameOver] = useState(false);
  const [soundOff, setSoundOff] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
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

  // Handle background music
  useBackgroundMusic({
    screen,
    soundOff,
    isGameOver,
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
  };

  const startGame = () => {
    handleResetGame();
    setScreen("game");
    if (!soundOff && audioRefs.transitionSound.current) {
      audioRefs.transitionSound.current.play();
    }
  };

  const goHome = () => {
    // Stop game over audio if it's playing
    if (audioRefs.gameOverAudio.current) {
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
            onStartGame={startGame}
            onGoHome={goHome}
            onToggleSound={toggleSound}
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
