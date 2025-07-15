import Image from "next/image";

export const Instruction1 = () => {
  return (
    <div className="relative w-[600px] h-[500px]">
      {/* Background image */}
      <Image
        unoptimized
        src="/image/Board.png"
        alt="Instruction Board"
        fill
        className="object-contain"
      />

      {/* Text overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <p className="mb-2 text-white w-56">
          Di chuyển TRÁI - PHẢI để giúp bạn Tê Tê trên cuộc du hành của mình
        </p>
        <div className="flex items-center justify-center mb-4 gap-10 mt-5">
          <Image
            unoptimized
            src="/image/LeftArrow.png"
            alt="Mũi tên trái"
            width={70}
            height={70}
          />
          <Image
            unoptimized
            src="/image/RightArrow.png"
            alt="Mũi tên phải"
            width={70}
            height={70}
          />
        </div>
        <p className="mb-6 mt-5 text-white w-56">
          Bảo đảm Tê Tê tránh các loại bẫy của thợ săn trên đường{" "}
        </p>
        <div>
          <Image
            unoptimized
            src="/image/Trap.png"
            alt="Bẫy"
            width={100}
            height={100}
          />
        </div>
      </div>
    </div>
  );
};

export const Instruction2 = () => {
  return (
    <div className="relative w-[600px] h-[500px]">
      {/* Background image */}
      <Image
        unoptimized
        src="/image/Board.png"
        alt="Instruction Board"
        fill
        className="object-contain"
      />

      {/* Text overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <p className="mb-2 text-white w-56">Giúp Tê tê ăn kiến</p>
        <div className="flex flex-col items-center justify-center mb-4">
          <Image
            unoptimized
            src="/image/KienDenPoint.png"
            alt="Kiến đen bằng 1 điểm"
            width={250}
            height={100}
          />
          <Image
            unoptimized
            src="/image/KienVangPoint.png"
            alt="Kiến vàng bằng 10 điểm"
            width={250}
            height={70}
          />
        </div>
        <p className=" text-white w-56">
          và nhặt Khiên bảo vệ để bảo vệ tạm thời trong 10s{" "}
        </p>
        <div>
          <Image
            unoptimized
            src="/image/Shield.png"
            alt="Khiên"
            width={100}
            height={50}
          />
        </div>
      </div>
    </div>
  );
};
