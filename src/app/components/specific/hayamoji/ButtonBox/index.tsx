import {
  ButtonType,
  ButtonTypeMap,
} from "@/app/lib/specific/hayamoji/ButtonType";
import styles from "./style.module.css";
import { IconButton } from "@mui/material";
import { useEffect, useRef } from "react";

export default function ButtonBox({
  pathList,
  handleChangeNumbers,
  listNumber,
  charNumber,
}: {
  pathList: {
    goal: string;
    path: {
      char: string;
      button: ButtonType;
      name: string;
      isKata: boolean;
    }[];
  }[];
  handleChangeNumbers: (i: number, j: number) => void;
  listNumber: number;
  charNumber: number;
}) {
  const buttonBoxRef = useRef<(HTMLButtonElement | null)[]>([]);

  const handleButtonBoxScroll = (index: number) => {
    buttonBoxRef?.current[index]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
    });
  };

  useEffect(() => {
    handleButtonBoxScroll(listNumber * 100 + charNumber);
  }, [listNumber, charNumber]);

  return (
    <div className={styles.buttonBox}>
      {pathList?.map((p, i) => {
        return p?.path.map((pp, j) => {
          return (
            <IconButton
              size="small"
              onClick={() => {
                handleChangeNumbers(i, j);
              }}
              key={`${i}-${j}`}
              ref={(el) => {
                buttonBoxRef.current[i * 100 + j] = el;
              }}
            >
              <span
                className={`${styles.logCellButton} ${
                  i === listNumber && j === charNumber
                    ? styles.logCellButtonSelected
                    : ""
                }`}
              >
                {ButtonTypeMap[pp.button]}
              </span>
            </IconButton>
          );
        });
      })}
    </div>
  );
}
