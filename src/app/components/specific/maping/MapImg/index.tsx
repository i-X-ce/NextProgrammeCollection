// import styles from './style.module.css';

import { number2Hex, rgbToHex } from "@/app/lib/common/calc";
import { MapPokeFile } from "@/app/lib/specific/maping/MapPokeFile";
import { useEffect, useRef } from "react";

const colors = ["#000000", "#555555", "#aaaaaa", "#ffffff"];
const maxEdge = 96;

export default function MapImg({
  pokeRom,
  mapId,
  sprite = true,
  size = 2,
  edge = 96,
}: {
  pokeRom: MapPokeFile;
  mapId: number;
  mapEdge?: boolean;
  sprite?: boolean;
  size?: number;
  edge?: number;
}) {
  const sprImg = useRef<ImageData | null>(null); // スプライトありの画像
  const nsprImg = useRef<ImageData | null>(null); // スプライトなしの画像
  const canvasRef = useRef<HTMLCanvasElement>(null); // 表示用のキャンバス
  const mapInfo = pokeRom.getMapInfo(mapId);
  const mapTypeInfo = pokeRom.getMapTypeInfo(mapInfo.mapType);
  const height = mapInfo.height + 6;
  const width = mapInfo.width + 6;
  edge = Math.min(Math.max(edge, 0), maxEdge);

  async function drawImg() {
    if (!pokeRom) return;
    // const canvas = drawCanvasRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = width * 32 * size;
    canvas.height = height * 32 * size;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    const drawMapId = mapId;
    const additionalMapInfo = pokeRom.getAdditionalMapInfo(mapId);
    const originMapData = pokeRom.getMapData(mapId);
    let mapData: number[][] = [];

    const newMapData = Array.from({ length: height }, () =>
      Array.from({ length: width }, () => additionalMapInfo.clsCell)
    );

    for (let i = 0; i < height - 6; i++) {
      for (let j = 0; j < width - 6; j++) {
        newMapData[i + 3][j + 3] = originMapData[i * (width - 6) + j];
      }
    }

    for (let i = 0; i < 4; i++) {
      const nextMap = additionalMapInfo.nextMap[i];
      if (nextMap === null) continue;
      const readAddr =
        (pokeRom.getMapBank(nextMap.mapId) << 16) + nextMap.mapDataAddr;
      const wh = nextMap.width; // 今のマップの幅
      const wh2 = nextMap.width2; // 隣のマップの幅
      let y = Math.floor((nextMap.writeAddr - 0xc6e8) / width);
      let x = (nextMap.writeAddr - 0xc6e8) % width;
      for (let ci = 0; ci < 3; ci++) {
        for (let cj = 0; cj < wh; cj++) {
          if (i < 2)
            newMapData[y + ci][x + cj] = pokeRom.readByteBig(
              readAddr + ci * wh2 + cj
            );
          else
            newMapData[y + cj][x + ci] = pokeRom.readByteBig(
              readAddr + cj * wh2 + ci
            );
        }
      }
    }
    mapData = newMapData;

    for (let ci = 0; ci < height; ci++) {
      for (let cj = 0; cj < width; cj++) {
        const cellData = pokeRom.getCellData(mapId, mapData[ci][cj]);
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
      await new Promise(requestAnimationFrame); // 非同期処理を追加
    }
    // if (drawMapId !== mapId) return;
    nsprImg.current = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const ornDict = { 0xd0: 0, 0xd1: 1, 0xd2: 2, 0xd3: 3 }; // 方向
    additionalMapInfo.npc.forEach((npc) => {
      // const edgeAdd = mapEdge ? 3 * 32 : 0;
      const x = (npc.x - 4) * 16 + 3 * 32;
      const y = (npc.y - 4) * 16 + 3 * 32;
      const attr = npc.attr;
      const spriteData = pokeRom.getSprData(npc.sprId);
      const orn = // 方向
        ornDict[attr as keyof typeof ornDict] === undefined
          ? -1
          : ornDict[attr as keyof typeof ornDict];
      const onKusa =
        pokeRom.getTileIdforMap(mapId, npc.y - 4, npc.x - 4) ===
        mapTypeInfo.kusaTile;

      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
          for (let si = 0; si < 8; si++) {
            const diff = orn !== -1 ? Math.min(orn, 2) * 0x40 : 0;
            const sprIndex = (i * 2 + j) * 16 + si * 2 + diff;
            const value = spriteData[sprIndex];
            const value2 = spriteData[sprIndex + 1];

            for (let sj = 0; sj < 8; sj++) {
              let colorIndex =
                ((1 << (7 - sj)) & value ? 0 : 1) |
                (((1 << (7 - sj)) & value2 ? 0 : 1) << 1);
              if (colorIndex === 3) continue;
              if (colorIndex !== 0) colorIndex++;
              ctx.fillStyle = colors[colorIndex];
              const drawX =
                orn === 3 ? x + 7 - sj + (1 - j) * 8 : x + sj + j * 8;
              const drawY = y + si + i * 8 - 4;
              const pixelColor = ctx.getImageData(
                drawX * size + 1,
                drawY * size + 1,
                1,
                1
              );
              if (
                !(
                  i === 1 &&
                  onKusa &&
                  rgbToHex(
                    pixelColor.data[0],
                    pixelColor.data[1],
                    pixelColor.data[2]
                  ) !== colors[3]
                )
              )
                ctx.fillRect(drawX * size, drawY * size, size, size);
            }
          }
        }
      }
    });
    // if (drawMapId !== mapId) return;
    sprImg.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    fixImg();
  }

  const fixImg = () => {
    if (!pokeRom) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (!nsprImg.current || !sprImg.current) return;
    ctx.imageSmoothingEnabled = false;
    const start = -(maxEdge - edge) * size;
    ctx.putImageData(sprite ? sprImg.current! : nsprImg.current!, start, start);
  };

  // マップ全体の書き直し
  useEffect(() => {
    drawImg();
  }, [pokeRom, mapId]);

  // マップ端、スプライトの変更時
  useEffect(() => {
    fixImg();
  }, [edge, sprite]);

  if (mapInfo.mapType >= 0x40) {
    return <div>不正なマップです</div>;
  }

  return (
    <canvas
      ref={canvasRef}
      width={(width * 32 + edge * 2 - maxEdge * 2) * size}
      height={(height * 32 + edge * 2 - maxEdge * 2) * size}
    />
  );
}
