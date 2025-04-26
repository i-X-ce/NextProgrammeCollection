// import styles from './style.module.css';

import CopyrightFooter from "@/app/components/common/CopyrightFooter";
import GameImgGeneratorTerms from "../GameImgGeneratorTerms";
import GameSVG from "../GameSVG";

export default function GameImgGeneratorContent() {
  return (
    <>
      <GameSVG />
      <GameImgGeneratorTerms />
      <CopyrightFooter year={2025} />
    </>
  );
}
