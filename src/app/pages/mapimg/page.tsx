// import styles from './style.module.css';

import MapImgContent from "@/app/components/specific/maping/MapImgContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "マップイメージ",
  description: "お好みのROMからマップ画像を生成します。",
};

export default function Home() {
  return <MapImgContent />;
}
