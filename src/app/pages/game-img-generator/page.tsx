import GameImgGeneratorContent from "@/app/components/specific/game-img-generator/GameImgGeneratorContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ゲーム機風イラスト",
  description:
    "ゲーム機風の素材を作成してオリジナルのイラストダウンロードできます。",
};

export default function Home() {
  return <GameImgGeneratorContent />;
}
