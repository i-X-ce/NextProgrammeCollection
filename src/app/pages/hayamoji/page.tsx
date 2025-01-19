"use client";
import { HayamojiSearch } from "@/app/lib/specific/hayamoji/hayamojiSearch";
import { Button, TextField } from "@mui/material";

export default function Home() {
  const hayamojisearch = new HayamojiSearch();
  return (
    <>
      <TextField />
      <div>
        {hayamojisearch.search("ア", "ロ")?.path.map((s, i) => (
          <p key={i}>{s.char}</p>
        ))}
      </div>
    </>
  );
}
