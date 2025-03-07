import Game from "@/components/game";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-amber-100 to-amber-200">
      <h1 className="text-3xl md:text-5xl font-bold text-amber-800 mb-4 text-center">
        Hành Trình Bảo Vệ Tê Tê
      </h1>
      <p className="text-amber-700 mb-6 text-center max-w-lg">
        Hãy giúp người bạn tê tê thu thập kiến và tránh nguy hiểm! Trên đường
        đi, bạn sẽ khám phá thêm về cách bảo vệ các bạn tê tê.
      </p>
      <Game />
    </main>
  );
}
