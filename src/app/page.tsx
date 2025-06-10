"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Add this import

import Image from "next/image";
import {
  Instruction1,
  Instruction2,
} from "@/components/instructions/Instruction";
export default function Home() {
  const [screen, setScreen] = useState<"home" | "instructions" | "game">(
    "home"
  );
  const router = useRouter(); // Initialize the router

  return (
    <main className="relative flex min-h-screen w-screen items-center justify-center overflow-hidden">
      {/* Background */}
      <Image
        unoptimized
        src="/Background.png"
        alt="Background"
        fill
        className="absolute top-0 left-0 -z-10 object-cover"
      />

      {/* HOME SCREEN */}
      {screen === "home" && (
        <div>
          {/* Background */}
          {/* <div className="absolute top-0 left-0 w-full h-full bg-[url('/Background.png')] z-0" /> */}

          <div className="flex flex-col items-center justify-center text-center relative z-10">
            <div className="relative ">
              {/* Background image */}
              <Image
                unoptimized
                src="/TeTeDuHanh.png"
                alt="Title"
                width={800}
                height={200}
                className=""
              />
            </div>

            <div
              className="relative cursor-pointer transition-transform hover:scale-110"
              onClick={() => setScreen("instructions")}
            >
              <Image
                unoptimized
                src="/DiNao.png"
                alt="Di Nào"
                width={200}
                height={100}
                className="object-contain"
              />
            </div>
          </div>
          {/*  Pangolin Image */}
          <div className="absolute bottom-[-100px] right-[-500px] overflow-hidden z-20">
            <Image
              unoptimized
              src="/Pangolin1.png"
              alt="Tê tê"
              width={950}
              height={300}
              className="object-contain"
            />
          </div>
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

            <div
              className="flex w-full justify-center items-center mt-8 cursor-pointer transition-transform hover:scale-110"
              onClick={() => router.push("/game")}
            >
              <Image
                unoptimized
                src="/BatDau.png"
                alt="Bắt đầu"
                width={200}
                height={100}
                className="object-contain"
              />
            </div>
          </div>
          <div
            className="absolute left-4 top-4 z-20  text-black px-4 py-2 rounded-lg hover:brightness-110 hover:scale-110"
            onClick={() => setScreen("home")}
          >
            <Image
              unoptimized
              src="/BackArrow.png"
              alt="Quay lại"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
        </>
      )}
    </main>
  );
}
