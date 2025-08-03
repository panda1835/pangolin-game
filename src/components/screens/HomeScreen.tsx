import Image from "next/image";
import HoverSoundWrapper from "@/components/common/HoverSoundWrapper";

interface HomeScreenProps {
  soundOff: boolean;
  onNavigateToInstructions: () => void;
  onToggleSound: () => void;
}

export const HomeScreen = ({
  soundOff,
  onNavigateToInstructions,
  onToggleSound,
}: HomeScreenProps) => {
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

      <div>
        <div className="flex flex-col items-center justify-center text-center relative z-10">
          <div className="relative">
            <Image
              unoptimized
              src="/image/TeTeDuHanh.png"
              alt="Title"
              width={800}
              height={200}
              className=""
            />
          </div>

          <HoverSoundWrapper soundSrc="/audio/hover.m4a" soundOff={soundOff}>
            <div
              className="relative cursor-pointer transition-transform hover:scale-110"
              onClick={onNavigateToInstructions}
            >
              <Image
                unoptimized
                src="/image/DiNao.png"
                alt="Di Nào"
                width={200}
                height={100}
                className="object-contain"
              />
            </div>
          </HoverSoundWrapper>
        </div>

        {/* Pangolin Image */}
        <div className="absolute bottom-[-100px] right-[-500px] overflow-hidden z-20">
          <Image
            unoptimized
            src="/image/Pangolin1.png"
            alt="Tê tê"
            width={950}
            height={300}
            className="object-contain"
          />
        </div>

        <HoverSoundWrapper soundSrc="/audio/hover.m4a" soundOff={soundOff}>
          <div
            className="absolute cursor-pointer left-4 top-4 z-20 text-black px-4 py-2 rounded-lg hover:brightness-110 hover:scale-110"
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
