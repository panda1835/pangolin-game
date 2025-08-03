import Image from "next/image";
import HoverSoundWrapper from "@/components/common/HoverSoundWrapper";

interface GameUIProps {
  score: number;
  lives: number;
  soundOff: boolean;
  onGoHome: () => void;
  onToggleSound: () => void;
}

export const GameUI = ({
  score,
  lives,
  soundOff,
  onGoHome,
  onToggleSound,
}: GameUIProps) => {
  return (
    <>
      {/* Lives */}
      <div className="absolute top-12 right-44 text-white text-xl z-20">
        <div className="flex items-center gap-2">
          {Array.from({ length: lives }).map((_, index) => (
            <Image
              key={index}
              unoptimized
              src="/image/Life.png"
              alt="Life"
              width={40}
              height={40}
              className="object-contain"
            />
          ))}
        </div>
      </div>

      {/* Score */}
      <div className="absolute top-4 right-4 text-white text-xl z-20">
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
      </div>

      {/* Home button */}
      <div className="absolute top-8 left-8 text-white text-xl z-20">
        <HoverSoundWrapper soundSrc="/audio/hover.m4a" soundOff={soundOff}>
          <div className="relative ">
            <Image
              unoptimized
              src="/image/Home.png"
              alt="Trở về"
              width={80}
              height={80}
              onClick={onGoHome}
              className="object-contain hover:cursor-pointer transition-transform hover:scale-110"
            />
          </div>
        </HoverSoundWrapper>
      </div>

      {/* Sound button */}
      <div className="absolute top-32 left-8 text-white text-xl z-20">
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
    </>
  );
};
