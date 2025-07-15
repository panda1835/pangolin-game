"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import Image from "next/image";
import {
  Instruction1,
  Instruction2,
} from "@/components/instructions/Instruction";
import HoverSoundWrapper from "@/components/common/HoverSoundWrapper";

export default function Home() {
  const [screen, setScreen] = useState<"home" | "instructions" | "game">(
    "home"
  );
  const router = useRouter();
  const transitionSound = useRef<HTMLAudioElement | null>(null);
  const bgAudio = useRef<HTMLAudioElement | null>(null);
  const [soundOff, setSoundOff] = useState(false);

  useEffect(() => {
    transitionSound.current = new Audio("/audio/transition.m4a");
    bgAudio.current = new Audio("/audio/intro-background.mp3");
    if (bgAudio.current) {
      bgAudio.current.loop = true;
      bgAudio.current.volume = 1;
    }
  }, []);

  useEffect(() => {
    if (bgAudio.current) {
      if (soundOff) {
        bgAudio.current.pause();
      } else {
        bgAudio.current.play().catch((e) => {
          console.warn("Autoplay failed:", e);
        });
      }
    }
  }, [soundOff]);

  const toggleSound = () => {
    setSoundOff((prev) => !prev);
    if (transitionSound.current) {
      if (soundOff) {
        transitionSound.current.play();
      } else {
        transitionSound.current.pause();
        transitionSound.current.currentTime = 0;
      }
    }
  };

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

      {/* HOME SCREEN */}
      {screen === "home" && (
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
                onClick={() => {
                  setScreen("instructions");
                  if (!soundOff && transitionSound.current) {
                    transitionSound.current.play();
                  }
                }}
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
              onClick={toggleSound}
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
      )}

      {/* INSTRUCTIONS SCREEN */}
      {screen === "instructions" && (
        <>
          <div className="flex flex-col w-[900px] h-screen justify-center text-center z-10">
            <div className="flex">
              <Instruction1 />
              <Instruction2 />
            </div>
            <div className="flex justify-center mt-8">
              <HoverSoundWrapper
                soundSrc="/audio/hover.m4a"
                soundOff={soundOff}
              >
                <div
                  className="flex w-fit justify-center items-center mt-8 cursor-pointer transition-transform hover:scale-110"
                  onClick={() => {
                    if (!soundOff && transitionSound.current) {
                      transitionSound.current.play();
                    }
                    // Turn off background audio
                    if (bgAudio.current) {
                      bgAudio.current.pause();
                      bgAudio.current.currentTime = 0;
                    }
                    router.push("/game");
                  }}
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
                onClick={() => {
                  setScreen("home");
                  if (!soundOff && transitionSound.current) {
                    transitionSound.current.play();
                  }
                }}
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
                onClick={toggleSound}
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
      )}
    </main>
  );
}
