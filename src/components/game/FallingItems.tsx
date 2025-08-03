import Image from "next/image";
import { GameItem } from "@/hooks/useGameLogic";

interface FallingItemsProps {
  items: GameItem[];
}

export const FallingItems = ({ items }: FallingItemsProps) => {
  return (
    <>
      {items.map((item) => (
        <div
          key={item.id}
          className="absolute w-[100px] h-[100px] z-10"
          style={{ top: `${item.y}%`, left: `calc(${item.x}% - 50px)` }}
        >
          <Image
            unoptimized
            src={`/image/${item.type}.png`}
            alt={item.type}
            width={100}
            height={100}
          />
        </div>
      ))}
    </>
  );
};
