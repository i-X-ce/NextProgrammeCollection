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
  Dialog,
  DialogTitle,
  Divider,
  FormControl,
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
import React, { useMemo, useState } from "react";

export default function Home() {
  const [pokeRom, setPokeRom] = useState<MapPokeFile | null>(null);
  const [masterMapIdStartTemp, setMasterMapIdStartTemp] = useState(0);
  // 設定を閉じた時に一気に書き換えるため一時的なStateを用意
  const [masterEdgeTemp, setMasterEdgeTemp] = useState(12);
  const [masterSpriteTemp, setMasterSpriteTemp] = useState(true);
  const [masterMapIdStart, setMasterMapIdStart] = useState(0);
  const [masterEdge, setMasterEdge] = useState(12);
  const [masterSprite, setMasterSprite] = useState(true);
  const [openSetting, setOpenSetting] = useState(false);

  const mapCards = useMemo(() => {
    if (!pokeRom || openSetting) return null;
    return (
      <div
        className={styles.cardContainer}
        style={openSetting ? { display: "none" } : {}}
      >
        {Array.from({ length: 0x10 }).map((_, i) => (
          <MapCard
            key={i + masterMapIdStart * 0x10}
            pokeRom={pokeRom}
            mapId={i + masterMapIdStart * 0x10}
            masterEdge={masterEdge}
            masterSprite={masterSprite}
          />
        ))}
      </div>
    );
  }, [pokeRom, masterMapIdStart, masterEdge, masterSprite]);

  const speedDialActions = [
    {
      icon: <Download />,
      tooltipTitle: "まとめてダウンロード",
      onClick: () => {},
    },
    {
      icon: <Settings />,
      tooltipTitle: "設定",
      onClick: () => {
        setOpenSetting(true);
      },
    },
  ];

  const mapIdPagination = (
    <Pagination
      count={0x10}
      color="primary"
      page={masterMapIdStartTemp + 1}
      renderItem={(item) => (
        <PaginationItem
          {...item}
          page={number2Hex(((item.page || 0) - 1) * 0x10)}
        />
      )}
      onChange={(_, page) => setMasterMapIdStartTemp(page - 1)}
    />
  );

  const mapIdSelecter = (setId: (id: number) => void) => (
    <FormControl sx={{ marginTop: "15px" }}>
      <InputLabel>マップ番号</InputLabel>
      <Select
        label="マップ番号"
        value={masterMapIdStartTemp}
        onChange={(e) => {
          setId(e.target.value as number);
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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexGrow: 1,
      }}
    >
      <Slider
        max={12}
        value={masterEdgeTemp}
        valueLabelDisplay="auto"
        onChange={(_, value) => {
          setMasterEdgeTemp(value as number);
        }}
      />
    </div>
  );

  const spriteCheckbox = (
    <Checkbox
      icon={<PersonOff />}
      checkedIcon={<Person />}
      checked={masterSpriteTemp}
      onClick={() => setMasterSpriteTemp((sprite) => !sprite)}
    />
  );

  return (
    <>
      {/* ドロップゾーン */}
      <PokeRomDrop
        setRom={(arrayBuffer: ArrayBuffer) => {
          const newPokeRom = new MapPokeFile(arrayBuffer, masterMapIdStart);
          setPokeRom(newPokeRom);
        }}
      />
      {mapIdSelecter(setMasterMapIdStart)}

      {/* マップカード */}
      {mapCards}

      {/* スピードダイヤル */}
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

      {/* 設定ダイアログ */}
      <Dialog
        open={openSetting}
        onClose={() => {
          setOpenSetting(false);
          setMasterMapIdStart(masterMapIdStartTemp);
          setMasterEdge(masterEdgeTemp);
          setMasterSprite(masterSpriteTemp);
        }}
        maxWidth={false}
      >
        <DialogTitle>設定</DialogTitle>
        <Divider />
        <div className={styles.settingContainer}>
          <SettingTool
            title="マップ番号"
            description="画像化するマップ番号の初期値を変更します。"
          >
            {mapIdSelecter(setMasterMapIdStartTemp)}
          </SettingTool>
          <SettingTool
            title="スプライト・端タイル数"
            description="スプライトの表示・非表示と端タイル数を変更します。ここで設定するとすべてのマップに適応されます。"
          >
            <div className={styles.edgeAndSprite}>
              {spriteCheckbox}
              {edgeSlider}
            </div>
          </SettingTool>
        </div>
      </Dialog>
    </>
  );
}

function SettingTool({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.settingTools}>
      <h3 className={styles.settingToolTitle}>{title}</h3>
      <p className={styles.settingToolDescription}>{description}</p>
      {children}
    </div>
  );
}
