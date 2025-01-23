"use client";
import Keyboard from "@/app/components/specific/hayamoji/Keyboard";
import {
  ButtonType,
  ButtonTypeMap,
} from "@/app/lib/specific/hayamoji/ButtonType";
import { HayamojiSearch } from "@/app/lib/specific/hayamoji/hayamojiSearch";
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  KeyboardDoubleArrowLeft,
  KeyboardDoubleArrowRight,
} from "@mui/icons-material";
import { IconButton, Slider, TextField } from "@mui/material";
import { useRef, useState } from "react";
import styles from "./style.module.css";

const hayamojisearch = new HayamojiSearch();

export default function Home() {
  const [searchText, setSearchText] = useState("");
  const [listNumber, setListNumber] = useState(0);
  const [charNumber, setCharNumber] = useState(0);
  const pathList = useRef<
    {
      goal: string;
      path: {
        char: string;
        button: ButtonType;
        name: string;
        isKata: boolean;
      }[];
    }[]
  >([]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.keyboardContainer}>
          <Keyboard
            pathList={pathList.current[listNumber]?.path.map((p) => {
              return { char: p.char, isKata: p.isKata };
            })}
            index={charNumber}
            name={pathList.current[listNumber]?.path[charNumber]?.name}
          />
          <div className={styles.toolBox}>
            <TextField
              variant="filled"
              label="ニックネーム"
              onChange={(e) => {
                const newText = e.target.value.slice(0, 5);
                setSearchText(newText);
                setListNumber(0);
                setCharNumber(0);
                pathList.current = hayamojisearch.search(newText) || [];
              }}
              value={searchText}
              autoComplete="off"
            />

            <div className={styles.progressBox}>
              <IconButton
                onClick={() => {
                  setListNumber(Math.max(listNumber - 1, 0));
                  setCharNumber(0);
                }}
              >
                <KeyboardDoubleArrowLeft />
              </IconButton>
              <IconButton
                onClick={() => {
                  if (charNumber <= 0) {
                    const newListNumber = listNumber - 1;
                    setListNumber(Math.max(newListNumber, 0));
                    if (newListNumber >= 0)
                      setCharNumber(
                        pathList.current[newListNumber].path.length - 1
                      );
                  } else {
                    setCharNumber(charNumber - 1);
                  }
                }}
              >
                <KeyboardArrowLeft />
              </IconButton>
              <Slider
                min={0}
                max={
                  pathList.current.reduce((acc, p) => {
                    return acc + p.path.length;
                  }, 0) - 1
                }
                sx={{ margin: "0 20px" }}
                value={pathList.current.reduce((acc, p, i) => {
                  if (i > listNumber) return acc;
                  if (i === listNumber) return acc + charNumber;
                  return acc + p.path.length;
                }, 0)}
                onChange={(_, v) => {
                  let acc = 0;
                  let newListNumber = 0;
                  let newCharNumber = 0;
                  for (let i = 0; i < pathList.current.length; i++) {
                    if (acc + pathList.current[i].path.length > (v as number)) {
                      newListNumber = i;
                      newCharNumber = (v as number) - acc;
                      break;
                    }
                    acc += pathList.current[i].path.length;
                  }
                  setListNumber(newListNumber);
                  setCharNumber(newCharNumber);
                }}
                getAriaLabel={(index) => (index === 0 ? "Minimum" : "Maximum")}
              />
              <IconButton
                onClick={() => {
                  if (
                    charNumber >=
                    pathList.current[listNumber].path.length - 1
                  ) {
                    const newListNumber = listNumber + 1;
                    setListNumber(
                      Math.min(newListNumber, pathList.current.length - 1)
                    );
                    if (newListNumber <= pathList.current.length - 1)
                      setCharNumber(0);
                  } else {
                    setCharNumber(charNumber + 1);
                  }
                }}
              >
                <KeyboardArrowRight />
              </IconButton>
              <IconButton
                onClick={() => {
                  const newListNumber = listNumber + 1;
                  setListNumber(
                    Math.min(newListNumber, pathList.current.length - 1)
                  );
                  if (newListNumber >= pathList.current.length)
                    setCharNumber(
                      pathList.current[
                        Math.min(newListNumber, pathList.current.length - 1)
                      ].path.length - 1
                    );
                  else setCharNumber(0);
                }}
              >
                <KeyboardDoubleArrowRight />
              </IconButton>
            </div>

            <div className={styles.logBox}>
              {pathList.current.map((p, i) => {
                return (
                  <div
                    className={`${styles.logCell} ${
                      i === listNumber ? styles.logCellSelected : ""
                    }`}
                    onClick={(e) => {
                      setListNumber(i);
                      setCharNumber(0);
                    }}
                  >
                    <span className={styles.logCellGoal}>{p.goal}</span>
                    <span className={styles.logCellButtonBox}>
                      {p.path.map((pp, j) => {
                        return (
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              setListNumber(i);
                              setCharNumber(j);
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
          </div>
        </div>
      </div>
    </>
  );
}
