import { useEffect } from "react";

interface UseBackgroundMusicProps {
  screen: "home" | "instructions" | "game";
  soundOff: boolean;
  isGameOver: boolean;
  showLeaderboard: boolean;
  leaderboardFromHome: boolean;
  bgAudio: React.RefObject<HTMLAudioElement | null>;
  gameOverAudio: React.RefObject<HTMLAudioElement | null>;
}

export const useBackgroundMusic = ({
  screen,
  soundOff,
  isGameOver,
  showLeaderboard,
  leaderboardFromHome,
  bgAudio,
  gameOverAudio,
}: UseBackgroundMusicProps) => {
  // Handle background music for different screens
  useEffect(() => {
    if (!bgAudio.current) return;

    // When viewing leaderboard from home, keep intro music playing
    if (showLeaderboard && leaderboardFromHome) {
      // Don't change audio - keep intro music playing
      // Ensure we're using intro music and it's playing
      if (
        bgAudio.current.src !==
        window.location.origin + "/audio/intro-background.mp3"
      ) {
        bgAudio.current.src = "/audio/intro-background.mp3";
      }
      if (soundOff) {
        bgAudio.current.pause();
      } else if (bgAudio.current.paused) {
        bgAudio.current.play().catch((e) => {
          console.warn("Intro music resume failed:", e);
        });
      }
      return;
    }

    if (screen === "game" && !isGameOver && !showLeaderboard) {
      // Switch to game background music only if not already playing
      if (
        bgAudio.current.src !==
        window.location.origin + "/audio/background.mp3"
      ) {
        bgAudio.current.pause();
        bgAudio.current.src = "/audio/background.mp3";
        if (!soundOff) {
          bgAudio.current.play().catch((e) => {
            console.warn("Game music autoplay failed:", e);
          });
        }
      } else if (!soundOff && bgAudio.current.paused) {
        bgAudio.current.play().catch((e) => {
          console.warn("Game music resume failed:", e);
        });
      }
    } else if (
      (screen === "home" || screen === "instructions") &&
      !isGameOver
    ) {
      // Use intro background music for home/instructions, but don't restart if already playing
      if (
        bgAudio.current.src !==
        window.location.origin + "/audio/intro-background.mp3"
      ) {
        bgAudio.current.pause();
        bgAudio.current.src = "/audio/intro-background.mp3";
        if (!soundOff) {
          bgAudio.current.play().catch((e) => {
            console.warn("Intro music autoplay failed:", e);
          });
        }
      } else if (!soundOff && bgAudio.current.paused) {
        // Resume if paused, don't restart
        bgAudio.current.play().catch((e) => {
          console.warn("Intro music resume failed:", e);
        });
      }
    }

    // Handle sound toggle
    if (soundOff && !bgAudio.current.paused) {
      bgAudio.current.pause();
    }
  }, [
    screen,
    soundOff,
    isGameOver,
    showLeaderboard,
    leaderboardFromHome,
    bgAudio,
  ]);

  // Handle game over audio
  useEffect(() => {
    if (!gameOverAudio.current) return;

    // Only play game over audio if we're actually in a game over state (not leaderboard from home)
    if (isGameOver && screen === "game" && !leaderboardFromHome) {
      if (bgAudio.current) {
        bgAudio.current.pause();
      }
      if (!soundOff) {
        // Don't restart if already playing (for leaderboard transitions)
        if (
          gameOverAudio.current.paused ||
          gameOverAudio.current.currentTime === 0
        ) {
          gameOverAudio.current.play().catch((e) => {
            console.warn("Game over sound failed:", e);
          });
        }
      }
    } else if (!showLeaderboard || !isGameOver || leaderboardFromHome) {
      // Stop game over audio when leaving game over state or when viewing leaderboard from home
      if (!gameOverAudio.current.paused) {
        gameOverAudio.current.pause();
        gameOverAudio.current.currentTime = 0;
      }
    }
  }, [
    isGameOver,
    screen,
    soundOff,
    showLeaderboard,
    leaderboardFromHome,
    bgAudio,
    gameOverAudio,
  ]);

  // Handle sound toggle for game over audio
  useEffect(() => {
    if (
      isGameOver &&
      screen === "game" &&
      !leaderboardFromHome &&
      gameOverAudio.current
    ) {
      if (soundOff) {
        gameOverAudio.current.pause();
      } else if (
        gameOverAudio.current.paused &&
        gameOverAudio.current.currentTime > 0
      ) {
        // Resume from current position if it was paused mid-playback
        gameOverAudio.current.play().catch((e) => {
          console.warn("Game over sound resume failed:", e);
        });
      }
    }
  }, [soundOff, isGameOver, screen, leaderboardFromHome, gameOverAudio]);
};
