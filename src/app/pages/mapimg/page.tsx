"use client";
import PokeRomDrop from "@/app/components/common/PokeRomDrop";
import TileImg from "@/app/components/specific/maping/TileImg";
import { MapPokeFile } from "@/app/lib/specific/maping/MapPokeFile";
import { useState } from "react";

export default function Home() {
  const [pokeRom, setPokeRom] = useState<MapPokeFile | null>(null);

  return (
    <>
      <PokeRomDrop
        setRom={(arrayBuffer: ArrayBuffer) => {
          setPokeRom(new MapPokeFile(arrayBuffer, 0x01));
        }}
      />
      {pokeRom && pokeRom.mapData && (
        <TileImg tileData={pokeRom.getTileData(0x52)}></TileImg>
      )}
      {/* {pokeRom &&
        pokeRom.mapData &&
        pokeRom
          .getTileData(0x52)
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
