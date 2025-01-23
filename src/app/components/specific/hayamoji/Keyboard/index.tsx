import { toHiragana, toKatakana } from "wanakana";
import styles from "./style.module.css";

import { HayamojiMap } from "@/app/lib/specific/hayamoji/hayamojiSearch";

export default function Keyboard({
  pathList,
  index,
  name,
}: {
  pathList: string[];
  index: number;
  name: string;
}) {
  return (
    <div className={styles.keyboard}>
      {HayamojiMap.CHARS.map((s, i) => (
        <>
          {s.map((ss, j) => (
            <div
              key={i * 7 + j}
              className={`${styles.cell} ${
                pathList?.includes(toKatakana(ss)) ||
                pathList?.includes(toHiragana(ss)) ||
                pathList?.includes(ss)
                  ? styles.includes
                  : ""
              } ${
                (pathList && toKatakana(pathList[index]) === ss) ||
                pathList && pathList[index] === ss
                  ? styles.selected
                  : ""
              }`}
            >
              {ss}
            </div>
          ))}
          <div key={i * 7 + 6} className={styles.cell}>
            {i === 0 ? "かな" : ""}
          </div>
        </>
      ))}
    </div>
  );
}
