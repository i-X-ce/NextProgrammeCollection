import Link from "next/link";

export default function Home() {
  return (
    <>
      <Link href="./pages/hayamoji">はやもじ</Link>
      <Link href="./pages/mapimg">マップイメージ</Link>
      <Link href="./pages/game-img-generator">
        ゲームイメージジェネレーター
      </Link>
    </>
  );
}
