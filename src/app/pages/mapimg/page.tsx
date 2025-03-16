"use client";
import styles from "./style.module.css";
import PokeRomDrop from "@/app/components/common/PokeRomDrop";
import MapCard from "@/app/components/specific/maping/MapCard";
import MapImg from "@/app/components/specific/maping/MapImg";
import { number2Hex } from "@/app/lib/common/calc";
import { mapNames } from "@/app/lib/common/map";
import { MapPokeFile } from "@/app/lib/specific/maping/MapPokeFile";
import {
  Download,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Person,
  PersonOff,
  Settings,
  UnfoldLess,
  UnfoldMore,
} from "@mui/icons-material";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  PaginationItem,
  Select,
  Slider,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from "@mui/material";
import { useState } from "react";

export default function Home() {
  const [pokeRom, setPokeRom] = useState<MapPokeFile | null>(null);
  const [mapIdStart, setMapIdStart] = useState(0x00);
  const [mapEdge, setMapEdge] = useState(12);
  const [sprite, setSprite] = useState(true);

  const speedDialActions = [
    {
      icon: <Download />,
      tooltipTitle: "まとめてダウンロード",
      onClick: () => {},
    },
    {
      icon: <Settings />,
      tooltipTitle: "設定",
      onClick: () => {},
    },
  ];

  const mapIdPagination = (
    <Pagination
      count={0x10}
      color="primary"
      page={mapIdStart + 1}
      renderItem={(item) => (
        <PaginationItem
          {...item}
          page={number2Hex(((item.page || 0) - 1) * 0x10)}
        />
      )}
      onChange={(_, page) => setMapIdStart(page - 1)}
    />
  );

  const mapIdSelecter = (
    <FormControl>
      <InputLabel>マップ番号</InputLabel>
      <Select
        label="マップ番号"
        value={mapIdStart}
        onChange={(e) => {
          setMapIdStart(e.target.value as number);
        }}
      >
        {Array.from({ length: 0x10 }).map((_, i) => (
          <MenuItem key={i} value={i}>
            {number2Hex(i * 0x10)}h {mapNames[i * 0x10].name}~
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const edgeSlider = (
    <div
      style={{
        width: 200,
        gap: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <IconButton onClick={() => setMapEdge((edge) => Math.max(edge - 1, 0))}>
        <UnfoldLess />
      </IconButton>
      <Slider
        max={12}
        value={mapEdge}
        valueLabelDisplay="auto"
        onChange={(_, value) => {
          setMapEdge(value as number);
        }}
      />
      <IconButton onClick={() => setMapEdge((edge) => Math.min(edge + 1, 12))}>
        <UnfoldMore />
      </IconButton>
    </div>
  );

  const spriteCheckbox = (
    <Checkbox
      icon={<PersonOff />}
      checkedIcon={<Person />}
      checked={sprite}
      onClick={() => setSprite((sprite) => !sprite)}
    />
  );

  return (
    <>
      <PokeRomDrop
        setRom={(arrayBuffer: ArrayBuffer) => {
          const newPokeRom = new MapPokeFile(arrayBuffer, mapIdStart);
          setPokeRom(newPokeRom);
        }}
      />
      {mapIdSelecter}
      {edgeSlider}
      {spriteCheckbox}
      {pokeRom && (
        <div className={styles.cardContainer}>
          {Array.from({ length: 0x10 }).map((_, i) => (
            <MapCard
              key={i + mapIdStart}
              pokeRom={pokeRom}
              mapId={i + mapIdStart * 0x10}
              masterEdge={mapEdge * 8}
              masterSprite={sprite}
            />
          ))}
        </div>
      )}
      <SpeedDial
        ariaLabel={""}
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
        direction="left"
      >
        {speedDialActions.map((action, i) => (
          <SpeedDialAction key={i} {...action} />
        ))}
      </SpeedDial>
    </>
  );
}
