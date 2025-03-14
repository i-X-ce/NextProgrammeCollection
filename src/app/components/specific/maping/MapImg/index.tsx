// import styles from './style.module.css';

import { MapPokeFile } from "@/app/lib/specific/maping/MapPokeFile";
import { useEffect, useRef } from "react";

const colors = ["#000", "#555", "#AAA", "#FFF"];
const size = 3;

export default function MapImg({
  pokeRom,
  mapId,
}: {
  pokeRom: MapPokeFile;
  mapId: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mapInfo = pokeRom.getMapInfo(mapId);
  const height = mapInfo.height;
  const width = mapInfo.width;

  useEffect(() => {
    if (!pokeRom) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    const mapData = pokeRom.getMapData(mapId);
    for (let ci = 0; ci < height; ci++) {
      for (let cj = 0; cj < width; cj++) {
        const cellData = pokeRom.getCellData(mapId, mapData[ci * width + cj]);
        for (let ti = 0; ti < 4; ti++) {
          for (let tj = 0; tj < 4; tj++) {
            const tileId = cellData[ti * 4 + tj];
            const tileData = pokeRom.getTileData(mapId, tileId);
            for (let i = 0; i < 8; i++) {
              const value = tileData[i * 2];
              const value2 = tileData[i * 2 + 1];
              for (let j = 0; j < 8; j++) {
                const colorIndex =
                  ((1 << (7 - j)) & value ? 0 : 1) |
                  (((1 << (7 - j)) & value2 ? 0 : 1) << 1);
                ctx.fillStyle = colors[colorIndex];
                const y = (ci * 32 + ti * 8 + i) * size;
                const x = (cj * 32 + tj * 8 + j) * size;
                ctx.fillRect(x, y, size, size);
              }
            }
          }
        }
      }
    }
  }, [pokeRom, mapId]);

  if (mapInfo.mapType >= 0x40) {
    return <div>不正なマップです</div>;
  }

  return (
    <canvas
      ref={canvasRef}
      width={width * 32 * size}
      height={height * 32 * size}
    />
  );
}
