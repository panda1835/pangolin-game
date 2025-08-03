import Image from "next/image";
import HoverSoundWrapper from "@/components/common/HoverSoundWrapper";
import {
  Instruction1,
  Instruction2,
} from "@/components/instructions/Instruction";

interface InstructionsScreenProps {
  soundOff: boolean;
  onStartGame: () => void;
  onGoHome: () => void;
  onToggleSound: () => void;
}

export const InstructionsScreen = ({
  soundOff,
  onStartGame,
  onGoHome,
  onToggleSound,
}: InstructionsScreenProps) => {
  return (
    <main className="relative flex min-h-screen w-screen items-center justify-center overflow-hidden">
      {/* Background */}
      <Image
        unoptimized
        src="/image/Background.png"
        alt="Background"
        fill
        className="absolute top-0 left-0 -z-10 object-cover"
      />

      <div className="flex flex-col w-[900px] h-screen justify-center text-center z-10">
        <div className="flex">
          <Instruction1 />
          <Instruction2 />
        </div>
        <div className="flex justify-center mt-8">
          <HoverSoundWrapper soundSrc="/audio/hover.m4a" soundOff={soundOff}>
            <div
              className="flex w-fit justify-center items-center mt-8 cursor-pointer transition-transform hover:scale-110"
              onClick={onStartGame}
            >
              <Image
                unoptimized
                src="/image/BatDau.png"
                alt="Bắt đầu"
                width={200}
                height={100}
                className="object-contain"
              />
            </div>
          </HoverSoundWrapper>
        </div>
      </div>
      <div>
        <HoverSoundWrapper soundSrc="/audio/hover.m4a" soundOff={soundOff}>
          <div
            className="absolute cursor-pointer left-4 top-4 z-20 text-black px-4 py-2 rounded-lg hover:brightness-110 hover:scale-110"
            onClick={onGoHome}
          >
            <Image
              unoptimized
              src="/image/BackArrow.png"
              alt="Quay lại"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
        </HoverSoundWrapper>
        <HoverSoundWrapper soundSrc="/audio/hover.m4a" soundOff={soundOff}>
          <div
            className="absolute cursor-pointer left-4 top-28 z-20 text-black px-4 py-2 rounded-lg hover:brightness-110 hover:scale-110"
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
    </main>
  );
};
