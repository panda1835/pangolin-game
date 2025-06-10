import Image from "next/image";
export const GameOver = ({ score }: { score: number }) => (
  <div className="relative flex min-h-screen w-screen items-center justify-center overflow-hidden">
    {/* Background */}
    {/* <div className="absolute top-0 left-0 w-full h-full bg-repeat-y bg-[url('/Background.png')] z-0" /> */}
    <Image
      unoptimized
      src="/Background.png"
      alt="Background"
      fill
      className="absolute top-0 left-0 z-0 object-cover"
    />
    <div className="absolute top-8 left-8 text-white text-xl z-20">
      <div className="relative ">
        <Image
          unoptimized
          src="/Home.png"
          alt="Trở về"
          width={80}
          height={80}
          onClick={() => {
            window.location.href = "/";
          }}
          className="object-contain hover:cursor-pointer transition-transform hover:scale-110"
        />
      </div>
    </div>
    <div className="flex flex-col items-center justify-center text-center relative z-10">
      <div className="relative w-[600px] h-[500px]">
        {/* Background image */}
        <Image
          unoptimized
          src="/Board.png"
          alt="Instruction Board"
          fill
          className="object-contain"
        />

        {/* Text overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <p className="mb-2 text-white text-4xl w-72">
            Tê tê bị dính bẫy mất rồi! huhu{" "}
          </p>

          <p className=" text-[#F8B290] text-2xl w-72 mt-10">
            Bạn đã giúp Tê tê ăn được{" "}
          </p>
          <div className="relative w-[150px] h-[100px]">
            <Image
              unoptimized
              src="/Score.png"
              alt="Điểm số"
              fill
              className="object-contain"
            />
            <div className="absolute inset-0 left-[-30px] top-[-5px] text-2xl flex items-center justify-center font-bold bg-gradient-to-b from-[#C9612D] to-[#632A0E] bg-clip-text text-transparent">
              {score}
            </div>
          </div>
        </div>
      </div>

      <div
        className="relative w-[200px] h-[200px] cursor-pointer transition-transform hover:scale-110"
        onClick={() => window.location.reload()}
      >
        <Image
          unoptimized
          src="/ChoiLai.png"
          alt="Chơi lại"
          fill
          className="object-contain"
        />
      </div>
    </div>

    {/* Trapped Pangolin Image */}
    <div className="absolute bottom-[-100px] right-[-350px] overflow-hidden z-20">
      <Image
        unoptimized
        src="/TrapedPangolin.png"
        alt="Trapped Pangolin"
        width={1000}
        height={300}
        className="object-contain"
      />
    </div>
  </div>
);
