"use client";
import Keyboard from "@/app/components/specific/hayamoji/Keyboard";
import { ButtonType } from "@/app/lib/specific/hayamoji/ButtonType";
import {
  HayamojiMap,
  HayamojiSearch,
} from "@/app/lib/specific/hayamoji/hayamojiSearch";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { IconButton, TextField } from "@mui/material";
import { useRef, useState } from "react";

const hayamojisearch = new HayamojiSearch();

export default function Home() {
  const [searchText, setSearchText] = useState("");
  const [listNumber, setListNumber] = useState(0);
  const [charNumber, setCharNumber] = useState(0);
  const pathList = useRef<
    { char: string; button: ButtonType; name: string }[][]
  >([[]]);

  return (
    <>
      <TextField
        onChange={(e) => {
          setSearchText(e.target.value);
          setListNumber(0);
          setCharNumber(0);
          pathList.current = hayamojisearch.search(e.target.value) || [[]];
        }}
        value={searchText}
      />
      <Keyboard
        pathList={pathList.current[listNumber]?.map((p) => p.char)}
        index={charNumber}
        name={""}
      />
      <IconButton
        onClick={() => {
          if (charNumber <= 0) {
            const newListNumber = listNumber - 1;
            setListNumber(Math.max(newListNumber, 0));
            if (newListNumber >= 0)
              setCharNumber(pathList.current[newListNumber].length - 1);
          } else {
            setCharNumber(charNumber - 1);
          }
        }}
      >
        <ChevronLeft />
      </IconButton>
      <IconButton
        onClick={() => {
          if (charNumber >= pathList.current[listNumber].length - 1) {
            const newListNumber = listNumber + 1;
            setListNumber(Math.min(newListNumber, pathList.current.length - 1));
            if (newListNumber <= pathList.current.length - 1) setCharNumber(0);
          } else {
            setCharNumber(charNumber + 1);
          }
        }}
      >
        <ChevronRight />
      </IconButton>

      <div>
        {hayamojisearch.search(searchText)?.map((s, i) => (
          <p key={i}>
            {s.map((ss, i) => (
              <span key={i}>
                「{ss.char},{ss.button},{ss.name}」
              </span>
            ))}
          </p>
        ))}
      </div>
    </>
  );
}
