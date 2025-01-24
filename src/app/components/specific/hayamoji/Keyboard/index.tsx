import { toHiragana, toKatakana } from "wanakana";
import styles from "./style.module.css";

import { HayamojiMap } from "@/app/lib/specific/hayamoji/hayamojiSearch";
import {
  ButtonType,
  ButtonTypeMap,
} from "@/app/lib/specific/hayamoji/ButtonType";
import { ReactNode } from "react";

export default function Keyboard({
  pathList,
  index,
  name,
  nextPageButton,
  prevPageButton,
  nextCharButton,
  prevCharButton,
  slider,
}: {
  pathList: {
    char: string;
    isKata: boolean;
    button: ButtonType;
    selected: () => void;
  }[];
  index: number;
  name: string;
  nextPageButton: ReactNode;
  prevPageButton: ReactNode;
  nextCharButton: ReactNode;
  prevCharButton: ReactNode;
  slider: ReactNode;
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

  const allCheck = (char: string): boolean => {
    return (
      includeChar(toKatakana(char)) ||
      includeChar(toHiragana(char)) ||
      includeChar(char)
    );
  };

  return (
    <div className={styles.keyboardContainer}>
      <div className={styles.topContainer}>
        <span>
          {prevPageButton}
          {prevCharButton}
        </span>
        <h2 className={styles.nickname}>「{name || ""}」</h2>
        <span>
          {nextCharButton}
          {nextPageButton}
        </span>
      </div>
      <div className={styles.sliderContainer}>{slider}</div>
      <div className={styles.keyboard}>
        {HayamojiMap.CHARS.map((s, i) => (
          <>
            {s.map((ss, j) => (
              <div
                key={ss}
                className={`${styles.cell} ${
                  allCheck(ss) ? styles.includes : ""
                } ${
                  (pathList && toKatakana(pathList[index].char) === ss) ||
                  (pathList && pathList[index].char === ss)
                    ? styles.selected
                    : ""
                }`}
                onClick={() => {
                  pathList
                    .find(
                      (p) =>
                        p.char === ss ||
                        p.char === toHiragana(ss) ||
                        p.char === toKatakana(ss)
                    )
                    ?.selected();
                }}
              >
                {allCheck(ss) && (
                  <div className={styles.button}>
                    {
                      ButtonTypeMap[
                        pathList.find(
                          (p) =>
                            p.char === ss ||
                            p.char === toHiragana(ss) ||
                            p.char === toKatakana(ss)
                        )?.button || ButtonType.A
                      ]
                    }
                  </div>
                )}
                <span style={{ zIndex: 1 }}>
                  {ss === "ED" ? ss : formatedKeyboard(ss)}
                </span>
              </div>
            ))}
            <div
              key={"かな" + i}
              className={`${styles.cell} ${
                i === 0 && includeChar("かな") ? styles.includes : ""
              } ${
                i === 0 && pathList && pathList[index].char === "かな"
                  ? styles.selected
                  : ""
              }`}
              onClick={() => {
                pathList.find((p) => p.char === "かな")?.selected();
              }}
            >
              {i === 0 ? unformatKeyboard("かな") : ""}
            </div>
          </>
        ))}
      </div>
    </div>
  );
}
