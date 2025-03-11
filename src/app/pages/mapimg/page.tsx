"use client";
import PokeRomDrop from "@/app/components/common/PokeRomDrop";
import { PokeRomFile } from "@/app/lib/common/PokeRomFile";
import { useState } from "react";

export default function Home() {
  const [pokeRom, setPokeRom] = useState<PokeRomFile | null>(null);

  return (
    <>
      <PokeRomDrop setRom={setPokeRom} />
      {pokeRom && <div>{pokeRom.romName()}</div>}
    </>
  );
}
