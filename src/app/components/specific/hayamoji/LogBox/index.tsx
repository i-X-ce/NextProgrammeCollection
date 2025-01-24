import { IconButton } from "@mui/material";
import styles from "./style.module.css";
import {
  ButtonType,
  ButtonTypeMap,
} from "@/app/lib/specific/hayamoji/ButtonType";
import { useEffect, useRef } from "react";

export default function LogBox({
  pathList,
  listNumber,
  charNumber,
  handleChangeNumbers,
}: {
  pathList: {
    goal: string;
    path: { char: string; button: ButtonType; name: string; isKata: boolean }[];
  }[];
  listNumber: number;
  charNumber: number;
  handleChangeNumbers: (i: number, j: number) => void;
}) {
  const logsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    logsRef?.current[listNumber]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [listNumber]);

  return (
    <div className={styles.logBox}>
      {pathList.map((p, i) => {
        return (
          <div
            className={`${styles.logCell} ${
              i === listNumber ? styles.logCellSelected : ""
            }`}
            onClick={() => {
              handleChangeNumbers(i, 0);
            }}
            ref={(el) => {
              logsRef.current[i] = el;
            }}
          >
            <span className={styles.logCellGoal}>{p.goal}</span>
            <span className={styles.logCellButtonBox}>
              {p.path.map((pp, j) => {
                return (
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      handleChangeNumbers(i, j);
                      e.stopPropagation();
                    }}
                  >
                    <span
                      className={`${styles.logCellButton} ${
                        j === charNumber && i === listNumber
                          ? styles.logCellButtonSelected
                          : ""
                      }`}
                    >
                      {ButtonTypeMap[pp.button]}
                    </span>
                  </IconButton>
                );
              })}
            </span>
          </div>
        );
      })}
    </div>
  );
}
