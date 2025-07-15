// components/HoverSoundWrapper.tsx
"use client";

import { useRef } from "react";

type HoverSoundWrapperProps = {
  children: React.ReactNode;
  soundSrc: string; // path to your .mp3/.wav file
  soundOff?: boolean; // optional prop to control sound on/off
};

export default function HoverSoundWrapper({
  children,
  soundSrc,
  soundOff = false,
}: HoverSoundWrapperProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleMouseEnter = () => {
    if (!audioRef.current && !soundOff) {
      audioRef.current = new Audio(soundSrc);
    }
    if (audioRef.current && !soundOff) {
      audioRef.current.currentTime = 0; // rewind to start
      audioRef.current.play().catch(() => {}); // suppress errors on quick hovers
    }
  };

  return <div onMouseEnter={handleMouseEnter}>{children}</div>;
}
