"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { GameOver } from "./GameOver";
import HoverSoundWrapper from "@/components/common/HoverSoundWrapper";
const ITEM_TYPES = {
  BLACK_ANT: "BlackAnt",
  GOLDEN_ANT: "GoldenAnt",
  TRAP: "Trap",
  SHIELD: "Shield",
};

const getRandomItem = (score: number) => {
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

export default function GamePage() {
  const [pangolinX, setPangolinX] = useState(50);
  const [pangolinY, setPangolinY] = useState(0);
  const [items, setItems] = useState<
    { id: string; x: number; y: number; type: string }[]
  >([]);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isProtected, setIsProtected] = useState(false);
  const [shieldTimeLeft, setShieldTimeLeft] = useState(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const blackAntSound = useRef<HTMLAudioElement | null>(null);
  const goldenAntSound = useRef<HTMLAudioElement | null>(null);
  const shieldSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    blackAntSound.current = new Audio("/audio/eat-black-ant.m4a");
    goldenAntSound.current = new Audio("/audio/eat-golden-ant.mp3");
    shieldSound.current = new Audio("/audio/eat-shield.mp3");
  }, []);

  useEffect(() => {
    const bgAudio = new Audio("/audio/background.mp3");
    const gameOverAudio = new Audio("/audio/game-over.mp3");
    bgAudio.loop = true;
    bgAudio.volume = 1;

    if (!isGameOver) {
      bgAudio.play().catch((e) => {
        console.warn("Autoplay failed:", e);
      });
    }

    if (isGameOver) {
      bgAudio.pause();
      gameOverAudio.play().catch((e) => {
        console.warn("Game over sound failed:", e);
      });
    }

    return () => {
      bgAudio.pause();
      bgAudio.currentTime = 0;
      gameOverAudio.pause();
      gameOverAudio.currentTime = 0;
    };
  }, [isGameOver]);

  useEffect(() => {
    const handleMove = (clientX: number) => {
      if (!gameAreaRef.current) return;
      const rect = gameAreaRef.current.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 100;
      setPangolinX(Math.min(90, Math.max(10, x)));
    };

    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  // Faster item fall speed (10s background loop = 1% every 100ms)
  useEffect(() => {
    if (isGameOver) return;
    const interval = setInterval(
      () => {
        setItems((prev) =>
          prev
            .map((item) => ({ ...item, y: item.y + 1 }))
            .filter((item) => item.y < 500)
        );
      },
      scoreToSpeed(score) // Adjust speed based on score
    ); // slower than before (was 50ms), but each tick moves more
    return () => clearInterval(interval);
  }, [isGameOver, score]);

  useEffect(() => {
    if (isGameOver) return;
    const spawnInterval = setInterval(() => {
      setItems((prev) => [...prev, getRandomItem(score)]);
    }, 1000);
    return () => clearInterval(spawnInterval);
  }, [isGameOver, score]);

  useEffect(() => {
    if (!isProtected) return;

    setShieldTimeLeft(10);
    const timer = setInterval(() => {
      setShieldTimeLeft((t) => {
        if (t <= 1) {
          setIsProtected(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isProtected]);

  useEffect(() => {
    const checkCollision = () => {
      setItems((prev) => {
        const remaining: { id: string; x: number; y: number; type: string }[] =
          [];
        for (const item of prev) {
          const dx = Math.abs(item.x - pangolinX);
          const dy = Math.abs(item.y - 90);
          if (dx < 5 && dy < 8) {
            if (item.type === ITEM_TYPES.TRAP) {
              if (!isProtected) {
                setIsGameOver(true);
              }
            } else {
              setPangolinY(10);
              setTimeout(() => setPangolinY(0), 150);

              if (item.type === ITEM_TYPES.BLACK_ANT) {
                setScore((s) => s + 1);
                blackAntSound.current?.play();
              } else if (item.type === ITEM_TYPES.GOLDEN_ANT) {
                setScore((s) => s + 10);
                goldenAntSound.current?.play();
              } else if (item.type === ITEM_TYPES.SHIELD) {
                setIsProtected(true);
                shieldSound.current?.play();
              }
            }
          } else {
            remaining.push(item);
          }
        }
        return remaining;
      });
    };
    const interval = setInterval(checkCollision, 100);
    return () => clearInterval(interval);
  }, [pangolinX, isProtected]);

  return (
    <div
      ref={gameAreaRef}
      className="relative overflow-hidden w-full h-screen bg-black"
    >
      {!isGameOver && (
        <div>
          <div className="absolute top-0 left-0 w-full h-full bg-repeat-y bg-[url('/image/GameBackground.png')] animate-scrollBg z-0" />

          {/* Score */}
          <div className="absolute top-4 right-4 text-white text-xl z-20">
            {!isGameOver && (
              <div className="relative w-[150px] h-[100px]">
                <Image
                  unoptimized
                  src="/image/Score.png"
                  alt="Điểm số"
                  fill
                  className="object-contain"
                />
                <div className="absolute inset-0 left-[-30px] top-[-5px] text-2xl flex items-center justify-center font-bold bg-gradient-to-b from-[#C9612D] to-[#632A0E] bg-clip-text text-transparent">
                  {score}
                </div>
              </div>
            )}
          </div>

          {/* Home button */}
          <div className="absolute top-8 left-8 text-white text-xl z-20">
            {!isGameOver && (
              <HoverSoundWrapper soundSrc="/audio/hover.m4a">
                <div className="relative ">
                  <Image
                    unoptimized
                    src="/image/Home.png"
                    alt="Trở về"
                    width={80}
                    height={80}
                    onClick={() => {
                      window.location.href = "/";
                    }}
                    className="object-contain hover:cursor-pointer transition-transform hover:scale-110"
                  />
                </div>
              </HoverSoundWrapper>
            )}
          </div>

          {/* Pangolin */}
          <div
            className="absolute bottom-[-20px] z-10 flex flex-col items-center"
            style={{
              left: `calc(${pangolinX}% - 50px)`,
              transform: `translateY(-${pangolinY}px)`,
              width: "100px",
              height: "100px",
            }}
          >
            <div className="relative w-[100px] h-[100px]">
              <Image
                unoptimized
                src="/image/LongPangolin.png"
                alt="Pangolin"
                width={100}
                height={100}
              />
              {isProtected && (
                <div className="absolute top-0 left-2 w-full h-full flex items-center justify-center">
                  <Image
                    unoptimized
                    src="/image/Shield.png"
                    alt="Shield Overlay"
                    width={100}
                    height={100}
                    className="pointer-events-none"
                  />
                  <div className="absolute text-white left-20 bg-[#C9612D] px-2 py-1 rounded shadow text-sm">
                    {shieldTimeLeft}s
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Falling items */}
          {items.map((item) => (
            <div
              key={item.id}
              className="absolute w-[100px] h-[100px] z-10"
              style={{ top: `${item.y}%`, left: `calc(${item.x}% - 50px)` }}
            >
              <Image
                unoptimized
                src={`/image/${item.type}.png`}
                alt={item.type}
                width={100}
                height={100}
              />
            </div>
          ))}
        </div>
      )}

      {/* Game Over Component */}
      {isGameOver && <GameOver score={score} />}
    </div>
  );
}
