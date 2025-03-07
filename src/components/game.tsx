"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { pangolinFacts, gameOverMessages, shieldMessages } from "@/lib/info";
import type { FactType } from "@/lib/types";
// Game constants
const GAME_WIDTH = 600;
const GAME_HEIGHT = 400;
const PANGOLIN_SIZE = 80; // Increased from 60
const ANT_SIZE = 20; // Increased from 15
const ENEMY_SIZE = 40; // Increased from 30
const GOLDEN_ANT_SIZE = 25; // Increased from 20
const SHIELD_SIZE = 30; // Increased from 25
const ITEM_SPEED = 2;
const SPAWN_INTERVAL = 1000;

// Game item types
type Position = {
  x: number;
  y: number;
};

type GameItem = {
  id: number;
  type: "ant" | "enemy" | "goldenAnt" | "shield";
  position: Position;
  width: number;
  height: number;
};

export default function Game() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [pangolinPosition, setPangolinPosition] = useState<Position>({
    x: GAME_WIDTH / 2,
    y: GAME_HEIGHT - PANGOLIN_SIZE,
  });
  const [items, setItems] = useState<GameItem[]>([]);
  const [nextItemId, setNextItemId] = useState(0);
  const [showFact, setShowFact] = useState<FactType | null>(null);
  const [hasShield, setHasShield] = useState(false);
  const [shieldTimeLeft, setShieldTimeLeft] = useState(0);
  const [gameOverMessage, setGameOverMessage] = useState<FactType | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [gamePaused, setGamePaused] = useState(false); // New state for pausing the game
  const [pangolinSize, setPangolinSize] = useState("text-7xl"); // Add new state

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>(0);
  const lastSpawnTimeRef = useRef<number>(0);

  // Handle mouse movement to control pangolin
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!gameAreaRef.current || !gameStarted || gameOver) return;

    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;

    // Keep pangolin within game boundaries
    const newX = Math.max(
      PANGOLIN_SIZE / 2,
      Math.min(GAME_WIDTH - PANGOLIN_SIZE / 2, x)
    );

    setPangolinPosition((prev) => ({
      ...prev,
      x: newX,
    }));
  };

  // Start the game
  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setItems([]);
    setPangolinPosition({ x: GAME_WIDTH / 2, y: GAME_HEIGHT - PANGOLIN_SIZE });
    setHasShield(false);
    setShieldTimeLeft(0);
    setShowInstructions(false);
    lastSpawnTimeRef.current = performance.now();
  };

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver || gamePaused) return;

    const gameLoop = (timestamp: number) => {
      // Spawn new items
      if (timestamp - lastSpawnTimeRef.current > SPAWN_INTERVAL) {
        const random = Math.random();
        let newItemType: GameItem["type"];
        let itemSize: number;

        if (random < 0.6) {
          newItemType = "ant";
          itemSize = ANT_SIZE;
        } else if (random < 0.9) {
          newItemType = "enemy";
          itemSize = ENEMY_SIZE;
        } else if (random < 0.95) {
          newItemType = "goldenAnt";
          itemSize = GOLDEN_ANT_SIZE;
        } else {
          newItemType = "shield";
          itemSize = SHIELD_SIZE;
        }

        const newItem: GameItem = {
          id: nextItemId,
          type: newItemType,
          position: {
            x: Math.random() * (GAME_WIDTH - itemSize),
            y: -itemSize,
          },
          width: itemSize,
          height: itemSize,
        };

        setItems((prev) => [...prev, newItem]);
        setNextItemId((prev) => prev + 1);
        lastSpawnTimeRef.current = timestamp;
      }

      // Update item positions and check collisions
      setItems((prevItems) => {
        const updatedItems = prevItems.map((item) => ({
          ...item,
          position: {
            ...item.position,
            y: item.position.y + ITEM_SPEED,
          },
        }));

        // Remove items that are off-screen
        return updatedItems.filter((item) => item.position.y < GAME_HEIGHT);
      });

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [gameStarted, gameOver, gamePaused, nextItemId]);

  // Check for collisions
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const pangolinRect = {
      left: pangolinPosition.x - PANGOLIN_SIZE / 2,
      right: pangolinPosition.x + PANGOLIN_SIZE / 2,
      top: pangolinPosition.y - PANGOLIN_SIZE / 2,
      bottom: pangolinPosition.y + PANGOLIN_SIZE / 2,
    };

    const collidedItems: number[] = [];

    items.forEach((item) => {
      const itemRect = {
        left: item.position.x,
        right: item.position.x + item.width,
        top: item.position.y,
        bottom: item.position.y + item.height,
      };

      // Check for collision
      if (
        pangolinRect.left < itemRect.right &&
        pangolinRect.right > itemRect.left &&
        pangolinRect.top < itemRect.bottom &&
        pangolinRect.bottom > itemRect.top
      ) {
        collidedItems.push(item.id);

        // Handle collision based on item type
        if (item.type === "ant") {
          setScore((prev) => prev + 1);
        } else if (item.type === "goldenAnt") {
          setScore((prev) => prev + 10);
          const randomFact =
            pangolinFacts[Math.floor(Math.random() * pangolinFacts.length)];
          setShowFact(randomFact);
        } else if (item.type === "shield") {
          setHasShield(true);
          setShieldTimeLeft(5);
          setShowFact(shieldMessages[0]);
        } else if (item.type === "enemy") {
          if (!hasShield) {
            const randomMessage =
              gameOverMessages[
                Math.floor(Math.random() * gameOverMessages.length)
              ];
            setGameOverMessage(randomMessage);
            setGameOver(true);
          }
        }
      }
    });

    // Remove collided items
    if (collidedItems.length > 0) {
      setItems((prev) =>
        prev.filter((item) => !collidedItems.includes(item.id))
      );
    }
  }, [items, pangolinPosition, gameStarted, gameOver, hasShield]);

  // Show facts at score milestones
  useEffect(() => {
    if (score === 10 || score === 20 || score === 30) {
      const factIndex = Math.floor(score / 10) - 1;
      const factType = ["fact", "threat", "conservation"][factIndex];
      const relevantFacts = pangolinFacts.filter(
        (fact) => fact.type === factType
      );
      const randomFact =
        relevantFacts[Math.floor(Math.random() * relevantFacts.length)];
      setShowFact(randomFact);
    }
  }, [score]);

  // Shield timer
  useEffect(() => {
    if (!hasShield) return;

    const timer = setTimeout(() => {
      if (shieldTimeLeft > 1) {
        setShieldTimeLeft((prev) => prev - 1);
      } else {
        setHasShield(false);
        setShieldTimeLeft(0);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [hasShield, shieldTimeLeft]);

  useEffect(() => {
    if (showFact) {
      setGamePaused(true);
    } else {
      setGamePaused(false);
    }
  }, [showFact]);

  useEffect(() => {
    if (score >= 60) {
      setPangolinSize("text-9xl");
    } else if (score >= 45) {
      setPangolinSize("text-8xl");
    } else if (score >= 30) {
      setPangolinSize("text-7xl");
    } else if (score >= 15) {
      setPangolinSize("text-6xl");
    } else {
      setPangolinSize("text-5xl");
    }
  }, [score]);

  return (
    <div className="flex flex-col items-center">
      {/* Game area */}
      <div
        ref={gameAreaRef}
        className="relative bg-green-100 border-4 border-amber-800 rounded-lg overflow-hidden cursor-none"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
        onMouseMove={handleMouseMove}
      >
        {/* Game background - jungle scene */}
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=600')] bg-cover opacity-20"></div>

        {gameStarted && !gameOver ? (
          <>
            {/* Pangolin character */}
            <motion.div
              className={`absolute ${hasShield ? "animate-pulse" : ""}`}
              style={{
                width: PANGOLIN_SIZE,
                height: PANGOLIN_SIZE,
                left: pangolinPosition.x - PANGOLIN_SIZE / 2,
                top: pangolinPosition.y - PANGOLIN_SIZE / 2,
                backgroundImage: "url('/placeholder.svg?height=80&width=80')",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                filter: hasShield ? "drop-shadow(0 0 8px gold)" : "none",
              }}
            >
              {/* Pangolin image would go here */}
              <div className="w-full h-full flex items-center justify-center">
                <span className={pangolinSize}>🦡</span>
              </div>

              {/* Shield indicator */}
              {hasShield && (
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-amber-400 text-amber-900 px-2 rounded-full text-xs font-bold">
                  {shieldTimeLeft}s
                </div>
              )}
            </motion.div>

            {/* Game items */}
            {items.map((item) => (
              <div
                key={item.id}
                className="absolute"
                style={{
                  width: item.width,
                  height: item.height,
                  left: item.position.x,
                  top: item.position.y,
                }}
              >
                {item.type === "ant" && <span className="text-4xl">🐜</span>}
                {item.type === "enemy" && <span className="text-4xl">🛑</span>}
                {item.type === "goldenAnt" && (
                  <span className="text-4xl">✨</span>
                )}
                {item.type === "shield" && <span className="text-4xl">🛡️</span>}
              </div>
            ))}

            {/* Score display */}
            <div className="absolute top-2 left-2 bg-amber-800 text-white px-3 py-1 rounded-full text-sm font-bold">
              Điểm: {score}
            </div>
            {/* Growth indicator */}
            {score > 0 && score % 15 === 0 && (
              <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-bounce">
                Tê tê lớn hơn!
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-amber-800/70 text-white p-4">
            {showInstructions ? (
              <>
                <h2 className="text-4xl font-bold mb-4">Cách Chơi</h2>
                <ul className="list-disc list-inside mb-4 text-xl">
                  <li>Di chuyển chuột để điều khiển tê tê</li>
                  <li>Thu thập kiến (🐜) để kiếm điểm</li>
                  <li>Kiến vàng (✨) đáng giá 10 điểm</li>
                  <li>Khiên (🛡️) bảo vệ bạn tạm thời</li>
                  <li>Tránh nguy hiểm (🛑) hoặc trò chơi kết thúc</li>
                </ul>
                <p className="mb-4 text-xl">Tìm hiểu về tê tê khi bạn chơi!</p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-2">Trò Chơi Kết Thúc</h2>
                <p className="mb-4">Điểm của bạn: {score}</p>
                {gameOverMessage && (
                  <Alert className="mb-4 bg-red-800 text-white border-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>{gameOverMessage.title}</AlertTitle>
                    <AlertDescription className="text-white mt-3">
                      {gameOverMessage.description}
                    </AlertDescription>
                  </Alert>
                )}
              </>
            )}
            <Button
              onClick={startGame}
              className="bg-amber-500 hover:bg-amber-600 text-amber-950 text-xl"
            >
              {showInstructions ? "Bắt Đầu Chơi" : "Chơi Lại"}
            </Button>
          </div>
        )}
      </div>

      {/* Score and controls */}
      <div className="mt-4 flex flex-col items-center">
        {gameStarted && !gameOver && (
          <Button
            variant="outline"
            onClick={() => setGameOver(true)}
            className="mt-2"
          >
            Kết Thúc Trò Chơi
          </Button>
        )}
      </div>

      {/* Educational fact dialog - updated to green color and positive styling */}
      <Dialog open={!!showFact} onOpenChange={() => setShowFact(null)}>
        <DialogContent className="bg-green-50 border-green-600">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-800">
              {showFact?.title}
            </DialogTitle>
            <DialogDescription className="text-green-700 text-base">
              {showFact?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center">
            <Button
              onClick={() => setShowFact(null)}
              className="bg-green-600 hover:bg-green-700"
            >
              Tiếp Tục Chơi
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
