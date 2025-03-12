"use client";
import PokeRomDrop from "@/app/components/common/PokeRomDrop";
import { MapPokeFile } from "@/app/lib/specific/maping/MapPokeFile";
import { useState } from "react";

export default function Home() {
  const [pokeRom, setPokeRom] = useState<MapPokeFile | null>(null);

  return (
    <>
      <PokeRomDrop setRom={setPokeRom} romClass={MapPokeFile} />
      {pokeRom && <div>{pokeRom.getMapBank(4)}</div>}
    </>
  );
}
