"use client";
import PokeRomDrop from "@/app/components/common/PokeRomDrop";
import MapImg from "@/app/components/specific/maping/MapImg";
import { number2Hex } from "@/app/lib/common/calc";
import { MapPokeFile } from "@/app/lib/specific/maping/MapPokeFile";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { Checkbox, FormControlLabel, IconButton, Slider } from "@mui/material";
import { useState } from "react";

export default function Home() {
  const [pokeRom, setPokeRom] = useState<MapPokeFile | null>(null);
  const [mapId, setMapId] = useState(0x25);
  const [sprite, setSprite] = useState(true);
  const [edge, setEdge] = useState(96);

  return (
    <>
      <PokeRomDrop
        setRom={(arrayBuffer: ArrayBuffer) => {
          const newPokeRom = new MapPokeFile(arrayBuffer, mapId);
          setPokeRom(newPokeRom);
        }}
      />
      <span>
        <IconButton onClick={() => setMapId((mapId) => (mapId - 1) & 0xff)}>
          <KeyboardArrowLeft />
        </IconButton>
        <span>0x{number2Hex(mapId)}</span>
        <IconButton onClick={() => setMapId((mapId) => (mapId + 1) & 0xff)}>
          <KeyboardArrowRight />
        </IconButton>
      </span>

      <span>
        <Slider
          max={12}
          min={0}
          valueLabelDisplay="auto"
          sx={{ width: "200px", margin: "0 20px" }}
          value={edge}
          onChange={(_, value) => setEdge(value as number)}
        />
        <FormControlLabel
          control={
            <Checkbox checked={sprite} onClick={() => setSprite(!sprite)} />
          }
          label="スプライト"
        />
      </span>
      {pokeRom && (
        <MapImg
          key={mapId}
          pokeRom={pokeRom}
          mapId={mapId}
          sprite={sprite}
          edge={edge * 8}
        />
      )}
      {/* <div style={{ display: "flex", flexWrap: "wrap" }}>
        {pokeRom && pokeRom.mapImage}
      </div> */}
      {/* <div style={{ display: "flex", flexWrap: "wrap" }}>
        {pokeRom &&
          Array.from({ length: 0x100 }).map((_, i) => pokeRom?.cellImages[i])}
      </div> */}
      {/* {pokeRom && pokeRom.mapData && (
        <TileImg tileData={pokeRom.getTileData(0x52)}></TileImg>
      )} */}
      {/* {pokeRom &&
        pokeRom.mapData &&
        pokeRom
          .getCellData(0x03)
          .map((value, i) => <p key={i}>{number2Hex(value)}</p>)} */}
      {/* {pokeRom &&
        pokeRom.mapData &&
        Object.entries(pokeRom.getTileData(0x52)).map(([key, value]) => (
          <p key={key}>
            {key}:{number2Hex(value)}
          </p>
        ))} */}
    </>
  );
}
