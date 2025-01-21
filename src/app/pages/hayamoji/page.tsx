"use client";
import { HayamojiSearch } from "@/app/lib/specific/hayamoji/hayamojiSearch";
import { Button, TextField } from "@mui/material";
import { useState } from "react";

export default function Home() {
  const [searchText, setSearchText] = useState("");
  const hayamojisearch = new HayamojiSearch();
  return (
    <>
      <TextField
        onChange={(e) => {
          setSearchText(e.target.value);
        }}
        value={searchText}
      />
      <div>
        {hayamojisearch.search(searchText)?.map((s, i) => (
          <p key={i}>
            {s.map((ss) => (
              ss.char
            ))}
          </p>
        ))}
      </div>
    </>
  );
}
