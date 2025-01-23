import { toHiragana, toKatakana } from "wanakana";
import styles from "./style.module.css";

import { HayamojiMap } from "@/app/lib/specific/hayamoji/hayamojiSearch";

export default function Keyboard({
  pathList,
  index,
  name,
}: {
  pathList: { char: string; isKata: boolean }[];
  index: number;
  name: string;
}) {
  const includeChar = (char: string): boolean => {
    return pathList?.some((p) => p.char === char);
  };
  const formatedKeyboard = pathList
    ? pathList[index].isKata
      ? toKatakana
      : toHiragana
    : toKatakana;
  const unformatKeyboard = pathList
    ? pathList[index].isKata
      ? toHiragana
      : toKatakana
    : toHiragana;

  return (
    <div className={styles.keyboardContainer}>
      <h2 className={styles.nickname}>「{name || ""}」</h2>
      <div className={styles.keyboard}>
        {HayamojiMap.CHARS.map((s, i) => (
          <>
            {s.map((ss, j) => (
              <div
                key={i * 7 + j}
                className={`${styles.cell} ${
                  includeChar(toKatakana(ss)) ||
                  includeChar(toHiragana(ss)) ||
                  includeChar(ss)
                    ? styles.includes
                    : ""
                } ${
                  (pathList && toKatakana(pathList[index].char) === ss) ||
                  (pathList && pathList[index].char === ss)
                    ? styles.selected
                    : ""
                }`}
              >
                {ss === "ED" ? ss : formatedKeyboard(ss)}
              </div>
            ))}
            <div
              key={i * 7 + 6}
              className={`${styles.cell} ${
                i === 0 && includeChar("かな") ? styles.includes : ""
              } ${
                i === 0 && pathList && pathList[index].char === "かな"
                  ? styles.selected
                  : ""
              }`}
            >
              {i === 0 ? unformatKeyboard("かな") : ""}
            </div>
          </>
        ))}
      </div>
    </div>
  );
}
