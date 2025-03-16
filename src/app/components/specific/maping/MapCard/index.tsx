import { MapPokeFile } from "@/app/lib/specific/maping/MapPokeFile";
import styles from "./style.module.css";
import MapImg from "../MapImg";
import { useEffect, useRef, useState } from "react";
import { mapNames } from "@/app/lib/common/map";
import { number2Hex } from "@/app/lib/common/calc";
import {
  CardActionArea,
  CircularProgress,
  Collapse,
  Divider,
  LinearProgress,
} from "@mui/material";
import { ErrorOutline, ExpandLess, ExpandMore } from "@mui/icons-material";
import { red } from "@mui/material/colors";

const centerAndColumn = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};

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
  const isVisible = mapNames[mapId].isVisible;
  const [detailOpen, setDetailOpen] = useState(false);
  const mapBank = pokeRom.getMapBank(mapId);
  const mapInfo = pokeRom.getMapInfo(mapId);
  const mapAddition = pokeRom.getAdditionalMapInfo(mapId);
  const mapImgRef = useRef<HTMLDivElement>(null);

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
    const rect = mapImgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const dx = e.clientX - mapLastPos.current.x;
    const dy = e.clientY - mapLastPos.current.y;
    setMapPos((pos) => ({
      x: Math.max(Math.min(pos.x + dx, rect.width / 2), -rect.width / 2),
      y: Math.max(Math.min(pos.y + dy, rect.height / 2), -rect.height / 2),
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

  const detailList = [
    { listName: "タイプ", value: number2Hex(mapInfo.mapType) + "h" },
    { listName: "高", value: `${mapInfo.height} * 2` },
    { listName: "幅", value: `${mapInfo.width} * 2` },
    {
      listName: "マップデータ",
      value: formatAddr(mapBank, mapInfo.mapDataAddr),
    },
    {
      listName: "イベントテーブル",
      value: formatAddr(mapBank, mapInfo.msgTableAddr),
    },
    {
      listName: "マップスクリプト",
      value: formatAddr(mapBank, mapInfo.eventTableAddr),
    },
    { listName: "ドア数", value: `${mapAddition.warpPointCnt}` },
    { listName: "イベント数", value: `${mapAddition.eventCnt}` },
    { listName: "NPC数", value: `${mapAddition.npcCnt}` },
  ];

  return (
    <div className={styles.card}>
      {/* マップ画像 */}
      <div className={styles.mapContainer} {...mapHandlers}>
        {isVisible ? (
          <div
            className={styles.mapWrapper}
            style={{
              transform: `scale(${mapScale})`,
              top: `${mapPos.y}px`,
              left: `${mapPos.x}px`,
              // transformOrigin: `${-mapPos.x}px ${-mapPos.y}px`,
            }}
            ref={mapImgRef}
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
        ) : (
          <div
            className={styles.centerAndColumn}
            style={{ color: red[500], fontSize: "small" }}
          >
            <ErrorOutline color="error" fontSize="large" />
            <p>表示できないマップです</p>
          </div>
        )}
        {!loaded && isVisible && (
          <div className={styles.loading}>
            <CircularProgress color="info" />
          </div>
        )}
      </div>

      {/* ロードバー */}
      <LinearProgress
        variant="determinate"
        value={progressValue}
        color="info"
      />

      {/* 詳細 */}
      <div className={styles.detail}>
        <h2
          className={styles.name}
          style={{ color: `var(--bc-${isVisible ? "primary" : "shadow"})` }}
        >
          {number2Hex(mapId)}h : {mapNames[mapId].name}
        </h2>
        <Collapse in={detailOpen}>
          <div className={styles.detailList}>
            {detailList.map((item, i) => (
              <DetailListCell
                key={i}
                listName={item.listName}
                value={isVisible ? item.value : "???"}
              />
            ))}
          </div>
        </Collapse>
      </div>
      <Divider />
      <CardActionArea
        sx={{ borderRadius: "0", padding: "5px 0", ...centerAndColumn }}
        onClick={() => setDetailOpen((open) => !open)}
      >
        {detailOpen ? (
          <ExpandLess color="action" />
        ) : (
          <ExpandMore color="action" />
        )}
      </CardActionArea>
    </div>
  );
}

function DetailListCell({
  listName,
  value,
}: {
  listName: string;
  value: string | number;
}) {
  return (
    <div className={styles.detailListCell}>
      <div>{listName}</div>
      <div>{value}</div>
    </div>
  );
}

function formatAddr(bank: number, addr: number) {
  return `${number2Hex(bank)}:${number2Hex(addr, 4)}h`;
}
