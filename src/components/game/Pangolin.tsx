import Image from "next/image";

interface PangolinProps {
  pangolinX: number;
  pangolinY: number;
  isProtected: boolean;
  shieldTimeLeft: number;
}

export const Pangolin = ({
  pangolinX,
  pangolinY,
  isProtected,
  shieldTimeLeft,
}: PangolinProps) => {
  return (
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
  );
};
