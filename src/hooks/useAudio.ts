import { useEffect, useRef } from "react";

export const useAudio = () => {
  const transitionSound = useRef<HTMLAudioElement | null>(null);
  const bgAudio = useRef<HTMLAudioElement | null>(null);
  const blackAntSound = useRef<HTMLAudioElement | null>(null);
  const goldenAntSound = useRef<HTMLAudioElement | null>(null);
  const shieldSound = useRef<HTMLAudioElement | null>(null);
  const trapSound = useRef<HTMLAudioElement | null>(null);
  const gameOverAudio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    transitionSound.current = new Audio("/audio/transition.m4a");
    bgAudio.current = new Audio("/audio/intro-background.mp3");
    blackAntSound.current = new Audio("/audio/eat-black-ant.m4a");
    goldenAntSound.current = new Audio("/audio/eat-golden-ant.mp3");
    shieldSound.current = new Audio("/audio/eat-shield.mp3");
    trapSound.current = new Audio("/audio/trap.m4a");
    gameOverAudio.current = new Audio("/audio/game-over.mp3");

    if (bgAudio.current) {
      bgAudio.current.loop = true;
      bgAudio.current.volume = 1;
    }
  }, []);

  return {
    transitionSound,
    bgAudio,
    blackAntSound,
    goldenAntSound,
    shieldSound,
    trapSound,
    gameOverAudio,
  };
};
