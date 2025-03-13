// import styles from './style.module.css';

import { useEffect, useRef } from "react";

const colors = ["#000", "#555", "#AAA", "#FFF"];
const size = 20;

export default function TileImg({ tileData }: { tileData: number[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    for (let i = 0; i < 8; i++) {
      const value = tileData[i * 2];
      const value2 = tileData[i * 2 + 1];
      for (let j = 0; j < 8; j++) {
        const colorIndex =
          ((1 << (7 - j)) & value ? 0 : 1) |
          (((1 << (7 - j)) & value2 ? 0 : 1) << 1);
        ctx.fillStyle = colors[colorIndex];
        ctx.fillRect(size * j, size * i, size, size);
      }
    }
  });

  if (tileData.length !== 16) {
    return <div>タイルデータが不正です</div>;
  }
  return <canvas ref={canvasRef} width={size * 8} height={size * 8} />;
}
