import Image from "next/image";
import HoverSoundWrapper from "@/components/common/HoverSoundWrapper";
import { LeaderboardEntry } from "@/lib/types";
import { useEffect, useRef } from "react";

interface LeaderboardProps {
  scores: LeaderboardEntry[];
  soundOff: boolean;
  onBack: () => void;
  onGoHome: () => void;
  onToggleSound: () => void;
  onStartNewGame?: () => void;
}

export const Leaderboard = ({
  scores,
  soundOff,
  onBack,
  onGoHome,
  onToggleSound,
  onStartNewGame,
}: LeaderboardProps) => {
  const transitionSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    transitionSound.current = new Audio("/audio/transition.m4a");
  }, []);

  // Star images for rankings
  const starImages = [
    "/image/Star1.png",
    "/image/Star2.png",
    "/image/Star3.png",
    "/image/Star4.png",
    "/image/Star5.png",
  ];

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString); // This will now handle ISO strings properly
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const day = date.getDate();
    const month = date.getMonth() + 1; // getMonth() returns 0-11
    const year = date.getFullYear();

    return `${hours}:${minutes} ${day} tháng ${month}, ${year}`;
  };

  return (
    <div className="relative flex min-h-screen w-screen items-center justify-center overflow-hidden">
      {/* Background */}
      <Image
        unoptimized
        src="/image/Background.png"
        alt="Background"
        fill
        className="absolute top-0 left-0 z-0 object-cover"
      />

      {/* Back Arrow */}
      <div className="absolute top-8 left-8 text-white text-xl z-20">
        <HoverSoundWrapper soundSrc="/audio/hover.m4a" soundOff={soundOff}>
          <div className="relative">
            <Image
              unoptimized
              src="/image/BackArrow.png"
              alt="Quay lại"
              width={80}
              height={80}
              onClick={() => {
                if (!soundOff && transitionSound.current) {
                  transitionSound.current.play();
                }
                onBack();
              }}
              className="object-contain hover:cursor-pointer transition-transform hover:scale-110"
            />
          </div>
        </HoverSoundWrapper>
      </div>

      {/* Home button */}
      <div className="absolute top-32 left-8 text-white text-xl z-20">
        <HoverSoundWrapper soundSrc="/audio/hover.m4a" soundOff={soundOff}>
          <div className="relative">
            <Image
              unoptimized
              src="/image/Home.png"
              alt="Trở về"
              width={80}
              height={80}
              onClick={() => {
                if (!soundOff && transitionSound.current) {
                  transitionSound.current.play();
                }
                onGoHome();
              }}
              className="object-contain hover:cursor-pointer transition-transform hover:scale-110"
            />
          </div>
        </HoverSoundWrapper>
      </div>

      {/* Sound button */}
      <div className="absolute top-54 left-8 text-white text-xl z-20">
        <HoverSoundWrapper soundSrc="/audio/hover.m4a" soundOff={soundOff}>
          <div
            className="relative cursor-pointer py-2 rounded-lg hover:brightness-110 hover:scale-110"
            onClick={onToggleSound}
          >
            {soundOff ? (
              <Image
                unoptimized
                src="/image/SoundOff.png"
                alt="Sound Off"
                width={80}
                height={80}
                className="object-contain"
              />
            ) : (
              <Image
                unoptimized
                src="/image/SoundOn.png"
                alt="Sound On"
                width={80}
                height={80}
                className="object-contain"
              />
            )}
          </div>
        </HoverSoundWrapper>
      </div>

      {/* Leaderboard Board */}
      <div className="flex flex-col items-center justify-center text-center relative z-10">
        <div className="relative w-[700px] h-[650px]">
          {/* Board Background */}
          <Image
            unoptimized
            src="/image/Board.png"
            alt="Leaderboard Board"
            fill
            className="object-contain"
          />

          {/* Content overlay */}
          <div className="absolute inset-0 flex flex-col items-center text-center px-8 py-4">
            {/* Top Label - ThanhTich.png at the very top */}
            <div className="relative -top-20 mb-4 mt-2">
              <Image
                unoptimized
                src="/image/ThanhTich.png"
                alt="Thành tích"
                width={550}
                height={80}
                className="object-contain"
              />
            </div>

            {/* Leaderboard Entries */}
            <div className="flex flex-col gap-3 w-full max-w-[420px] flex-1 justify-center">
              {scores.length === 0 ? (
                <div className="text-white text-2xl">
                  Chưa có thành tích nào!
                </div>
              ) : (
                scores.map((entry, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg p-3"
                  >
                    {/* Star Ranking */}
                    <div className="flex items-center gap-3">
                      <Image
                        unoptimized
                        src={starImages[index]}
                        alt={`Hạng ${index + 1}`}
                        width={50}
                        height={50}
                        className="object-contain"
                      />
                    </div>

                    {/* Score with golden style */}
                    <div className="flex items-center gap-2">
                      <div className="text-white text-lg font-bold opacity-75 max-w-[200px]">
                        {formatDate(entry.date)}
                      </div>
                      <div className="relative w-[120px] h-[80px]">
                        <Image
                          unoptimized
                          src="/image/Score.png"
                          alt="Điểm số"
                          fill
                          className="object-contain"
                        />
                        <div className="absolute inset-0 left-[-25px] top-[-5px] text-xl flex items-center justify-center font-bold bg-gradient-to-b from-[#C9612D] to-[#632A0E] bg-clip-text text-transparent">
                          {entry.score}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* ChoiLai Button */}
            <div className="mt-6 mb-2">
              <HoverSoundWrapper
                soundSrc="/audio/hover.m4a"
                soundOff={soundOff}
              >
                <div className="relative top-10">
                  <Image
                    unoptimized
                    src="/image/ChoiLai.png"
                    alt="Chơi lại"
                    width={200}
                    height={80}
                    onClick={() => {
                      if (!soundOff && transitionSound.current) {
                        transitionSound.current.play();
                      }
                      // Start new game if function is available, otherwise go back
                      if (onStartNewGame) {
                        onStartNewGame();
                      } else {
                        onBack();
                      }
                    }}
                    className="object-contain hover:cursor-pointer transition-transform hover:scale-110"
                  />
                </div>
              </HoverSoundWrapper>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
