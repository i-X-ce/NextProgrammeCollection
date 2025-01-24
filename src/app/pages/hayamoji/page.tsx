"use client";
import Keyboard from "@/app/components/specific/hayamoji/Keyboard";
import { ButtonType } from "@/app/lib/specific/hayamoji/ButtonType";
import { HayamojiSearch } from "@/app/lib/specific/hayamoji/hayamojiSearch";
import {
  Clear,
  Face,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  KeyboardDoubleArrowLeft,
  KeyboardDoubleArrowRight,
  SmartToy,
  Tune,
} from "@mui/icons-material";
import {
  Alert,
  IconButton,
  Popover,
  Slider,
  Snackbar,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import { ReactNode, useRef, useState } from "react";
import styles from "./style.module.css";
import ButtonBox from "@/app/components/specific/hayamoji/ButtonBox";
import LogBox from "@/app/components/specific/hayamoji/LogBox";
import { pokemojiMap } from "@/app/lib/common/pokemoji";

const hayamojisearch = new HayamojiSearch();

export default function Home() {
  const [searchText, setSearchText] = useState("");
  const [listNumber, setListNumber] = useState(0);
  const [charNumber, setCharNumber] = useState(0);
  const [searchType, setSearchType] = useState<"HUMAN" | "TAS">("HUMAN");
  const [isComposing, setIsComposing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [anchorToolBox, setAnchorToolBox] = useState<HTMLButtonElement | null>(
    null
  );
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

  const handleChangeNumbers = (
    newListNumber: number,
    newCharNumber: number
  ) => {
    setListNumber(newListNumber);
    setCharNumber(newCharNumber);
  };

  const pathLength = () => {
    return pathList.current.reduce((acc, p) => {
      return acc + p.path.length;
    }, 0);
  };

  const handleChangeText = (text: string) => {
    const newText = text.slice(0, 5);
    setSearchText(newText);
    handleChangeNumbers(0, 0);
    setSearchType((prev) => {
      pathList.current = hayamojisearch.search(newText, prev) || [];
      if (!pathList.current || pathList.current.length === 0) {
        const errorChars = newText
          .split("")
          .filter(
            (c) =>
              (!pokemojiMap[c] || !pokemojiMap[c].possible) &&
              !["り", "へ", "べ", "ぺ"].includes(c)
          );
        if (errorChars.length > 0) {
          setErrorMessage(`「${errorChars.join("、")}」は入力不可能文字です。`);
        } else if (newText.length !== 0) {
          console.log(newText);
          setErrorMessage("エラーが発生しました。");
        }
      } else {
        setErrorMessage(null);
      }
      return prev;
    });
  };

  const onPagePrev = () => {
    handleChangeNumbers(Math.max(listNumber - 1, 0), 0);
  };
  const onCharPrev = () => {
    if (charNumber <= 0) {
      const newListNumber = Math.max(listNumber - 1, 0);
      const newCharNumber =
        listNumber - 1 >= 0
          ? pathList.current[newListNumber].path.length - 1
          : 0;
      handleChangeNumbers(newListNumber, newCharNumber);
    } else {
      handleChangeNumbers(listNumber, charNumber - 1);
    }
  };
  const onPageNext = () => {
    const newListNumber = listNumber + 1;
    if (newListNumber >= pathList.current.length)
      handleChangeNumbers(
        Math.min(newListNumber, pathList.current.length - 1),
        pathList.current[Math.min(newListNumber, pathList.current.length - 1)]
          .path.length - 1
      );
    else
      handleChangeNumbers(
        Math.min(newListNumber, pathList.current.length - 1),
        0
      );
  };
  const onCharNext = () => {
    if (charNumber >= pathList.current[listNumber].path.length - 1) {
      const newListNumber = Math.min(
        listNumber + 1,
        pathList.current.length - 1
      );
      const newCharNumber =
        listNumber + 1 <= pathList.current.length - 1
          ? 0
          : pathList.current[newListNumber].path.length - 1;
      handleChangeNumbers(newListNumber, newCharNumber);
    } else {
      handleChangeNumbers(listNumber, charNumber + 1);
    }
  };

  const nicknameField = (
    <TextField
      variant="filled"
      label="ニックネーム"
      onCompositionStart={() => {
        setIsComposing(true);
      }}
      onCompositionEnd={() => {
        setIsComposing(false);
        handleChangeText(searchText);
      }}
      onChange={(e) => {
        if (isComposing) {
          setSearchText(e.target.value);
        } else {
          handleChangeText(e.target.value);
        }
      }}
      value={searchText}
      autoComplete="off"
      slotProps={{
        input: {
          endAdornment: (
            <IconButton onClick={() => handleChangeText("")}>
              <Clear />
            </IconButton>
          ),
        },
      }}
    />
  );

  const processSlider: ReactNode = (
    <Slider
      min={0}
      max={pathLength() - 1}
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
        handleChangeNumbers(newListNumber, newCharNumber);
      }}
      getAriaLabel={(index) => (index === 0 ? "Minimum" : "Maximum")}
      color="primary"
    />
  );

  const prevCharButton = (
    <IconButton onClick={onCharPrev}>
      <KeyboardArrowLeft />
    </IconButton>
  );

  const nextCharButton = (
    <IconButton onClick={onCharNext}>
      <KeyboardArrowRight />
    </IconButton>
  );

  const prevPageButton = (
    <IconButton onClick={onPagePrev}>
      <KeyboardDoubleArrowLeft />
    </IconButton>
  );

  const nextPageButton = (
    <IconButton onClick={onPageNext}>
      <KeyboardDoubleArrowRight />
    </IconButton>
  );

  const toolBox = (
    <div className={styles.toolBox}>
      <ToggleButtonGroup
        value={searchType}
        exclusive
        color="primary"
        onChange={(_, v) => {
          if (v === null) return;
          setSearchType(v);
          const currntListNumber = listNumber;
          handleChangeText(searchText);
          handleChangeNumbers(currntListNumber, 0);
        }}
      >
        <Tooltip title="人間用">
          <ToggleButton value="HUMAN">
            <Face />
          </ToggleButton>
        </Tooltip>
        <Tooltip title="TAS用">
          <ToggleButton value="TAS">
            <SmartToy />
          </ToggleButton>
        </Tooltip>
      </ToggleButtonGroup>

      {nicknameField}

      <div className={styles.progressBox}>
        {prevPageButton}
        {prevCharButton}
        {processSlider}
        {nextCharButton}
        {nextPageButton}
      </div>

      <ButtonBox
        pathList={pathList.current}
        handleChangeNumbers={handleChangeNumbers}
        listNumber={listNumber}
        charNumber={charNumber}
      />

      <LogBox
        pathList={pathList.current}
        listNumber={listNumber}
        charNumber={charNumber}
        handleChangeNumbers={handleChangeNumbers}
      />
    </div>
  );

  return (
    <>
      <div className={styles.container}>
        <div className={styles.keyboardContainer}>
          {/* 画面が小さくなると映る */}
          <div className={styles.mobileToolBox}>
            <span className={styles.mobileToolBoxTop}>
              <IconButton onClick={(e) => setAnchorToolBox(e.currentTarget)}>
                <Tune />
              </IconButton>
              {nicknameField}
            </span>
            <ButtonBox
              pathList={pathList.current}
              handleChangeNumbers={handleChangeNumbers}
              listNumber={listNumber}
              charNumber={charNumber}
            />
            <Popover
              open={Boolean(anchorToolBox)}
              onClose={() => {
                setAnchorToolBox(null);
              }}
              sx={{ overflowY: "hidden" }}
            >
              {toolBox}
            </Popover>
          </div>

          <Keyboard
            pathList={pathList.current[listNumber]?.path.map((p, i) => {
              return {
                char: p.char,
                isKata: p.isKata,
                button: p.button,
                selected: () => {
                  handleChangeNumbers(listNumber, i);
                },
              };
            })}
            prevPageButton={prevPageButton}
            nextPageButton={nextPageButton}
            prevCharButton={prevCharButton}
            nextCharButton={nextCharButton}
            slider={processSlider}
            index={charNumber}
            name={pathList.current[listNumber]?.path[charNumber]?.name}
          />
          <div className={styles.laptopToolBox}>{toolBox}</div>
        </div>

        <Snackbar
          open={Boolean(errorMessage)}
          autoHideDuration={6000}
          onClose={() => setErrorMessage(null)}
        >
          <Alert severity="error">{errorMessage}</Alert>
        </Snackbar>
      </div>
    </>
  );
}
