// import styles from './style.module.css';

import HayamojiContent from "@/app/components/specific/hayamoji/HayamojiContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "はやもじ",
  description: "ニックネームの最速の経路を探索します。",
};

export default function Home() {
  return <HayamojiContent />;
}
