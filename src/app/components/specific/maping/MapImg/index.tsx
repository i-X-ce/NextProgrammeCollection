// import styles from './style.module.css';

import { mod, number2Hex } from "@/app/lib/common/calc";
import { mapNames } from "@/app/lib/common/map";
import { MapPokeFile } from "@/app/lib/specific/maping/MapPokeFile";
import { useCallback, useEffect, useRef } from "react";

const dummyColors = ["#000000", "#555555", "#aaaaaa", "#ffffff"];
const maxEdge = 96;

export default function MapImg({
  pokeRom,
  mapId,
  bgColors = dummyColors,
  oamColors = dummyColors,
  sprite = true,
  size = 2,
  edge = 96,
  className,
  onLoaded,
  setProgressValue,
  imgRef,
}: {
  pokeRom: MapPokeFile;
  mapId: number;
  bgColors?: string[];
  oamColors?: string[];
  mapEdge?: boolean;
  sprite?: boolean;
  size?: number;
  edge?: number;
  className?: string;
  onLoaded?: () => void;
  setProgressValue?: (value: number) => void;
  imgRef?: React.RefObject<HTMLCanvasElement | null>;
}) {
  const sprImg = useRef<ImageData | null>(null); // スプライトありの画像
  const nsprImg = useRef<ImageData | null>(null); // スプライトなしの画像
  const canvasRef = useRef<HTMLCanvasElement>(null); // 表示用のキャンバス
  const mapInfo = pokeRom.getMapInfo(mapId);
  // const mapTypeInfo = pokeRom.getMapTypeInfo(mapInfo.mapType);
  const height = mapInfo.height + 6;
  const width = mapInfo.width + 6;
  edge = Math.min(Math.max(edge, 0), maxEdge);

  const drawImg = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const setNsprImg = (img: ImageData) => {
      nsprImg.current = img;
    };

    const setSprImg = (img: ImageData) => {
      sprImg.current = img;
    };

    await generateMapImg(
      pokeRom,
      mapId,
      sprite,
      size,
      edge,
      bgColors,
      oamColors,
      setProgressValue,
      setNsprImg,
      setSprImg,
      onLoaded
    );

    fixCanvas();

    // if (!pokeRom) return;
    // // const canvas = drawCanvasRef.current;
    // const canvas = document.createElement("canvas");
    // canvas.width = width * 32 * size;
    // canvas.height = height * 32 * size;
    // if (!canvas) return;
    // const ctx = canvas.getContext("2d");
    // if (!ctx) return;
    // ctx.imageSmoothingEnabled = false;

    // const additionalMapInfo = pokeRom.getAdditionalMapInfo(mapId);
    // const originMapData = pokeRom.getMapData(mapId);
    // let mapData: number[][] = [];

    // const newMapData = Array.from({ length: height }, () =>
    //   Array.from({ length: width }, () => additionalMapInfo.clsCell)
    // );

    // for (let i = 0; i < height - 6; i++) {
    //   for (let j = 0; j < width - 6; j++) {
    //     newMapData[i + 3][j + 3] = originMapData[i * (width - 6) + j];
    //   }
    // }

    // for (let i = 0; i < 4; i++) {
    //   const nextMap = additionalMapInfo.nextMap[i];
    //   if (nextMap === null) continue;
    //   const readAddr =
    //     (pokeRom.getMapBank(nextMap.mapId) << 16) + nextMap.mapDataAddr;
    //   const wh = nextMap.width; // 今のマップの幅
    //   const wh2 = nextMap.width2; // 隣のマップの幅
    //   let y = Math.floor((nextMap.writeAddr - 0xc6e8) / width);
    //   let x = (nextMap.writeAddr - 0xc6e8) % width;
    //   for (let ci = 0; ci < 3; ci++) {
    //     for (let cj = 0; cj < wh; cj++) {
    //       if (i < 2)
    //         newMapData[y + ci][x + cj] = pokeRom.readByteBig(
    //           readAddr + ci * wh2 + cj
    //         );
    //       else
    //         newMapData[y + cj][x + ci] = pokeRom.readByteBig(
    //           readAddr + cj * wh2 + ci
    //         );
    //     }
    //   }
    // }
    // mapData = newMapData;

    // for (let ci = 0; ci < height; ci++) {
    //   for (let cj = 0; cj < width; cj++) {
    //     const cellData = pokeRom.getCellData(mapId, mapData[ci][cj]);
    //     for (let ti = 0; ti < 4; ti++) {
    //       for (let tj = 0; tj < 4; tj++) {
    //         const tileId = cellData[ti * 4 + tj];
    //         const tileData = pokeRom.getTileData(mapId, tileId);
    //         for (let i = 0; i < 8; i++) {
    //           const value = tileData[i * 2];
    //           const value2 = tileData[i * 2 + 1];
    //           for (let j = 0; j < 8; j++) {
    //             const colorIndex =
    //               ((1 << (7 - j)) & value ? 0 : 1) |
    //               (((1 << (7 - j)) & value2 ? 0 : 1) << 1);
    //             ctx.fillStyle = colors[colorIndex];
    //             const y = (ci * 32 + ti * 8 + i) * size;
    //             const x = (cj * 32 + tj * 8 + j) * size;
    //             ctx.fillRect(x, y, size, size);
    //           }
    //         }
    //       }
    //     }
    //   }
    //   setProgressValue && setProgressValue(((ci + 1) * 100) / height);
    //   await new Promise(requestAnimationFrame); // 非同期処理を追加
    // }
    // // if (drawMapId !== mapId) return;
    // nsprImg.current = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // const ornDict = { 0xd0: 0, 0xd1: 1, 0xd2: 2, 0xd3: 3 }; // 方向
    // additionalMapInfo.npc.forEach((npc) => {
    //   // const edgeAdd = mapEdge ? 3 * 32 : 0;
    //   const x = (npc.x - 4) * 16 + 3 * 32;
    //   const y = (npc.y - 4) * 16 + 3 * 32;
    //   const attr = npc.attr;
    //   const spriteData = pokeRom.getSprData(npc.sprId);
    //   const orn = // 方向
    //     ornDict[attr as keyof typeof ornDict] === undefined
    //       ? -1
    //       : ornDict[attr as keyof typeof ornDict];
    //   const onKusa =
    //     pokeRom.getTileIdforMap(mapId, npc.y - 4, npc.x - 4) ===
    //     mapTypeInfo.kusaTile;

    //   for (let i = 0; i < 2; i++) {
    //     for (let j = 0; j < 2; j++) {
    //       for (let si = 0; si < 8; si++) {
    //         const diff = orn !== -1 ? Math.min(orn, 2) * 0x40 : 0;
    //         const sprIndex = (i * 2 + j) * 16 + si * 2 + diff;
    //         const value = spriteData[sprIndex];
    //         const value2 = spriteData[sprIndex + 1];

    //         for (let sj = 0; sj < 8; sj++) {
    //           let colorIndex =
    //             ((1 << (7 - sj)) & value ? 0 : 1) |
    //             (((1 << (7 - sj)) & value2 ? 0 : 1) << 1);
    //           if (colorIndex === 3) continue;
    //           if (colorIndex !== 0) colorIndex++;
    //           ctx.fillStyle = colors[colorIndex];
    //           const drawX =
    //             orn === 3 ? x + 7 - sj + (1 - j) * 8 : x + sj + j * 8;
    //           const drawY = y + si + i * 8 - 4;
    //           const pixelColor = ctx.getImageData(
    //             drawX * size + 1,
    //             drawY * size + 1,
    //             1,
    //             1
    //           );
    //           if (
    //             !(
    //               i === 1 &&
    //               onKusa &&
    //               rgbToHex(
    //                 pixelColor.data[0],
    //                 pixelColor.data[1],
    //                 pixelColor.data[2]
    //               ) !== colors[3]
    //             )
    //           )
    //             ctx.fillRect(drawX * size, drawY * size, size, size);
    //         }
    //       }
    //     }
    //   }
    // });
    // // if (drawMapId !== mapId) return;
    // sprImg.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    // fixCanvas();
    // onLoaded && onLoaded();
  }, []);

  // 画像の修正(スプライトの表示、端の表示)
  const fixCanvas = () => {
    if (!pokeRom) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", {
      willreadfrequently: true,
    }) as CanvasRenderingContext2D;
    if (!ctx) return;
    if (!nsprImg.current || !sprImg.current) return;
    ctx.imageSmoothingEnabled = false;
    const start = -(maxEdge - edge) * size;
    ctx.putImageData(sprite ? sprImg.current! : nsprImg.current!, start, start);
  };

  // マップ全体の書き直し
  useEffect(() => {
    drawImg();
  }, [drawImg]);

  // マップ端、スプライトの変更時
  useEffect(() => {
    fixCanvas();
  }, [fixCanvas]);

  return (
    <canvas
      ref={(e) => {
        canvasRef.current = e;
        if (imgRef && e) {
          imgRef.current = e;
        }
      }}
      width={(width * 32 + edge * 2 - maxEdge * 2) * size}
      height={(height * 32 + edge * 2 - maxEdge * 2) * size}
      className={className}
    />
  );
}

export async function generateMapImg(
  pokeRom: MapPokeFile,
  mapId: number,
  sprite = true,
  size = 1,
  edge = 96,
  bgColors: string[] = dummyColors,
  oamColors: string[] = dummyColors,
  setProgressValue?: (value: number) => void,
  setNsprImg?: (img: ImageData) => void, // スプライトなしの画像
  setSprImg?: (img: ImageData) => void, // スプライトありの画像
  onLoaded?: () => void
): Promise<HTMLCanvasElement | null> {
  if (!mapNames[mapId].isVisible) return null;
  const mapInfo = pokeRom.getMapInfo(mapId);
  const mapTypeInfo = pokeRom.getMapTypeInfo(mapInfo.mapType);
  const width = mapInfo.width + 6;
  const height = mapInfo.height + 6;

  const canvas = document.createElement("canvas");
  canvas.width = 32 * width * size;
  canvas.height = 32 * height * size;
  if (!canvas) return null;
  const ctx = canvas.getContext("2d", {
    willreadfrequently: true,
  }) as CanvasRenderingContext2D;
  if (!ctx) return null;
  ctx.imageSmoothingEnabled = false;

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
    const y = Math.floor((nextMap.writeAddr - 0xc6e8) / width);
    const x = (nextMap.writeAddr - 0xc6e8) % width;
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
              ctx.fillStyle = bgColors[colorIndex];
              const y = (ci * 32 + ti * 8 + i) * size;
              const x = (cj * 32 + tj * 8 + j) * size;
              ctx.fillRect(x, y, size, size);
            }
          }
        }
      }
    }
    setProgressValue?.(((ci + 1) * 100) / height);
    await new Promise(requestAnimationFrame); // 非同期処理を追加
  }
  // if (drawMapId !== mapId) return;
  setNsprImg?.(ctx.getImageData(0, 0, canvas.width, canvas.height));
  const nsprImg = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // スプライトの描画
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
    const tiles = Array.from({ length: 2 }, (_, i) =>
      Array.from({ length: 2 }, (_, j) =>
        pokeRom.getTileIdforMap(mapId, npc.y - 4, npc.x - 4, i, j)
      )
    );
    const tileDatas = tiles.map((row) =>
      row.map((tile) => pokeRom.getTileData(mapId, tile))
    );
    const onKusa = tiles[1][0] === mapTypeInfo.kusaTile;

    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        for (let si = 0; si < 8; si++) {
          const diff = orn !== -1 ? Math.min(orn, 2) * 0x40 : 0;
          const sprIndex = (i * 2 + j) * 16 + si * 2 + diff;
          const value = spriteData[sprIndex];
          const value2 = spriteData[sprIndex + 1];
          const tileData =
            tileDatas[Math.max(Math.floor((si + i * 8 - 4) / 8), 0)][j];
          const tileValue = tileData[mod(si - 4, 8) * 2];
          const tileValue2 = tileData[mod(si - 4, 8) * 2 + 1];

          for (let sj = 0; sj < 8; sj++) {
            let hide = onKusa && i === 1;
            const tileX = orn === 3 ? 7 - sj : sj;
            const tileColorIndex =
              (1 << (7 - tileX)) & tileValue
                ? 0
                : 1 | (((1 << (7 - tileX)) & tileValue2 ? 0 : 1) << 1); // タイルの色
            if (hide) console.log(number2Hex(mapId), tileColorIndex);
            if (hide && tileColorIndex === 3) hide = false;
            let colorIndex =
              ((1 << (7 - sj)) & value ? 0 : 1) |
              (((1 << (7 - sj)) & value2 ? 0 : 1) << 1);
            if (colorIndex === 3) continue; // 透明色
            if (colorIndex !== 0) colorIndex++;
            ctx.fillStyle = oamColors[colorIndex];

            const drawX = orn === 3 ? x + 7 - sj + (1 - j) * 8 : x + sj + j * 8;
            const drawY = y + si + i * 8 - 4;
            if (!hide) ctx.fillRect(drawX * size, drawY * size, size, size);
          }
        }
      }
    }
  });
  // if (drawMapId !== mapId) return;
  setSprImg?.(ctx.getImageData(0, 0, canvas.width, canvas.height));
  onLoaded?.();
  return generateMapCanvas(
    sprite ? ctx.getImageData(0, 0, canvas.width, canvas.height) : nsprImg,
    size,
    edge
  );
}

function generateMapCanvas(
  img: ImageData,
  size: number,
  edge: number
): HTMLCanvasElement | null {
  const canvas = document.createElement("canvas");
  canvas.width = img.width + (edge - maxEdge) * 2;
  canvas.height = img.height + (edge - maxEdge) * 2;
  const ctx = canvas.getContext("2d", {
    willreadfrequently: true,
  }) as CanvasRenderingContext2D;
  if (!ctx) return null;
  ctx.imageSmoothingEnabled = false;
  const start = -(maxEdge - edge) * size;
  ctx.putImageData(img, start, start);
  return canvas;
}
