import { useEffect } from "react";

interface UseBackgroundMusicProps {
  screen: "home" | "instructions" | "game";
  soundOff: boolean;
  isGameOver: boolean;
  bgAudio: React.RefObject<HTMLAudioElement | null>;
  gameOverAudio: React.RefObject<HTMLAudioElement | null>;
}

export const useBackgroundMusic = ({
  screen,
  soundOff,
  isGameOver,
  bgAudio,
  gameOverAudio,
}: UseBackgroundMusicProps) => {
  // Handle background music for different screens
  useEffect(() => {
    if (screen === "game") {
      // Switch to game background music
      if (bgAudio.current) {
        bgAudio.current.pause();
        bgAudio.current.src = "/audio/background.mp3";
        if (!soundOff && !isGameOver) {
          bgAudio.current.play().catch((e) => {
            console.warn("Game music autoplay failed:", e);
          });
        }
      }
    } else {
      // Use intro background music for home/instructions
      if (bgAudio.current) {
        bgAudio.current.pause();
        bgAudio.current.src = "/audio/intro-background.mp3";
        if (!soundOff) {
          bgAudio.current.play().catch((e) => {
            console.warn("Autoplay failed:", e);
          });
        }
      }
    }
  }, [screen, soundOff, isGameOver, bgAudio]);

  // Handle game over audio
  useEffect(() => {
    if (isGameOver && screen === "game") {
      if (bgAudio.current) {
        bgAudio.current.pause();
      }
      if (!soundOff && gameOverAudio.current) {
        gameOverAudio.current.play().catch((e) => {
          console.warn("Game over sound failed:", e);
        });
      }
    } else {
      // Stop game over audio when not in game over state
      if (gameOverAudio.current) {
        gameOverAudio.current.pause();
        gameOverAudio.current.currentTime = 0;
      }
    }
  }, [isGameOver, screen, soundOff, bgAudio, gameOverAudio]);

  // Handle sound toggle for game over audio
  useEffect(() => {
    if (isGameOver && screen === "game" && gameOverAudio.current) {
      if (soundOff) {
        gameOverAudio.current.pause();
      } else {
        gameOverAudio.current.play().catch((e) => {
          console.warn("Game over sound failed:", e);
        });
      }
    }
  }, [soundOff, isGameOver, screen, gameOverAudio]);
};
