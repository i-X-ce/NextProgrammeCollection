import { MapPokeFile } from "@/app/lib/specific/maping/MapPokeFile";
import styles from "./style.module.css";
import MapImg from "../MapImg";
import { useEffect, useRef, useState } from "react";
import { mapNames } from "@/app/lib/common/map";
import { number2Hex } from "@/app/lib/common/calc";
import { CircularProgress, LinearProgress } from "@mui/material";

export default function MapCard({
  pokeRom,
  mapId,
}: {
  pokeRom: MapPokeFile;
  mapId: number;
}) {
  const [mapPos, setMapPos] = useState({ x: 0, y: 0 });
  const mapDragging = useRef(false);
  const mapLastPos = useRef({ x: 0, y: 0 });
  const [mapScale, setMapScale] = useState(0.2);
  const [loaded, setLoaded] = useState(false);
  const [progressValue, setProgressValue] = useState(0);

  // マップ生成のロード
  useEffect(() => {
    setLoaded(false);
    setMapPos({ x: 0, y: 0 });
  }, [pokeRom]);

  const handleMapMouseDown = (e: React.MouseEvent) => {
    mapDragging.current = true;
    mapLastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMapMouseMove = (e: React.MouseEvent) => {
    if (!mapDragging.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = e.clientX - mapLastPos.current.x;
    const dy = e.clientY - mapLastPos.current.y;
    setMapPos((pos) => ({
      x: Math.max(Math.min(pos.x + dx, rect.width / 2), -rect.width / 2),
      y: Math.max(Math.min(pos.y + dy, rect.height), -rect.height),
    }));
    mapLastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMapMouseUp = () => {
    mapDragging.current = false;
  };

  const handleMapMouseLeave = () => {
    mapDragging.current = false;
  };

  const handleMapWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    setMapScale((scale) => {
      const newScale = scale - (delta * scale) / 1000;
      const clampedScale = Math.max(0.01, Math.min(newScale, 2));

      const scaleChange = clampedScale / scale;
      setMapPos((pos) => ({
        x: -pos.x * scaleChange,
        y: -pos.y * scaleChange,
      }));

      return clampedScale;
    });
  };

  const mapHandlers = {
    onMouseDown: handleMapMouseDown,
    onMouseMove: handleMapMouseMove,
    onMouseUp: handleMapMouseUp,
    onMouseLeave: handleMapMouseLeave,
    // onWheel: handleMapWheel,
  };

  return (
    <div className={styles.card}>
      <div className={styles.mapContainer} {...mapHandlers}>
        <div
          className={styles.mapWrapper}
          style={{
            transform: `scale(${mapScale})`,
            top: `${mapPos.y}px`,
            left: `${mapPos.x}px`,
            // transformOrigin: `${-mapPos.x}px ${-mapPos.y}px`,
          }}
        >
          <MapImg
            pokeRom={pokeRom}
            mapId={mapId}
            size={5}
            className={styles.map}
            onLoaded={() => setLoaded(true)}
            setProgressValue={setProgressValue}
          />
        </div>

        {!loaded && (
          <div className={styles.loading}>
            <CircularProgress color="info" />
          </div>
        )}
      </div>
      <LinearProgress
        variant="determinate"
        value={progressValue}
        color="info"
      />
      <div className={styles.detail}>
        <h2 className={styles.name}>
          {number2Hex(mapId)} : {mapNames[mapId].name}
        </h2>
      </div>
    </div>
  );
}
