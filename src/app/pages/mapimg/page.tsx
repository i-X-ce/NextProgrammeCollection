"use client";
import styles from "./style.module.css";
import PokeRomDrop from "@/app/components/common/PokeRomDrop";
import MapCard from "@/app/components/specific/maping/MapCard";
import MapImg, {
  generateMapImg,
} from "@/app/components/specific/maping/MapImg";
import { number2Hex } from "@/app/lib/common/calc";
import { mapNames } from "@/app/lib/common/map";
import {
  canvasToBlob,
  downloadBlob,
  FileFormat,
  mapFileName,
} from "@/app/lib/specific/maping/common";
import { MapPokeFile } from "@/app/lib/specific/maping/MapPokeFile";
import { Download, Person, PersonOff, Settings } from "@mui/icons-material";
import {
  Button,
  Checkbox,
  CircularProgress,
  Collapse,
  Dialog,
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
  Tab,
  Tabs,
} from "@mui/material";
import JSZip from "jszip";
import React, { useMemo, useRef, useState } from "react";

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
  const [tabValue, setTabValue] = useState<"setting" | "download">("setting");
  const [downloadRange, setDownloadRange] = useState([0x00, 0xff]);
  const [fileFormat, setFileFormat] = useState<FileFormat>("png");
  const [fileFormatTemp, setFileFormatTemp] = useState<FileFormat>("png");
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const downloadCnacel = useRef(false);

  const mapCards = useMemo(() => {
    if (!pokeRom) return null;
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
            fileFormat={fileFormat}
          />
        ))}
      </div>
    );
  }, [pokeRom, masterMapIdStart, masterEdge, masterSprite, fileFormat]);

  const speedDialActions = [
    {
      icon: <Download />,
      tooltipTitle: "まとめてダウンロード",
      onClick: () => {
        setOpenSetting(true);
        setTabValue("download");
      },
    },
    {
      icon: <Settings />,
      tooltipTitle: "設定",
      onClick: () => {
        setOpenSetting(true);
        setTabValue("setting");
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

  const mapIdSelecter = (setId: (id: number) => void, id: number) => (
    <FormControl sx={{ marginTop: "15px", width: "30%" }}>
      <InputLabel>マップ番号</InputLabel>
      <Select
        label="マップ番号"
        value={id}
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

  const fileFormatSelecter = (
    <FormControl sx={{ marginTop: "15px", width: "30%" }}>
      <InputLabel>ファイル形式</InputLabel>
      <Select
        label="ファイル形式"
        value={fileFormatTemp}
        onChange={(e) => {
          setFileFormatTemp(e.target.value as FileFormat);
        }}
      >
        <MenuItem value={"png"}>PNG</MenuItem>
        <MenuItem value={"jpg"}>JPG</MenuItem>
        {/* <MenuItem value={"bmp"}>BMP</MenuItem> */}
      </Select>
    </FormControl>
  );

  const fileFormatSetting = (
    <SettingTool
      title="ファイル形式"
      description="画像のファイル形式を変更します。"
      direction="row"
    >
      {fileFormatSelecter}
    </SettingTool>
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
      {mapIdSelecter((id) => {
        setMasterMapIdStart(id);
        setMasterMapIdStartTemp(id);
      }, masterMapIdStart)}

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
          if (downloadProgress !== null) return;
          setOpenSetting(false);
          setMasterMapIdStart(masterMapIdStartTemp);
          setMasterEdge(masterEdgeTemp);
          setMasterSprite(masterSpriteTemp);
          setFileFormat(fileFormatTemp);
        }}
        maxWidth={false}
      >
        <Tabs
          value={tabValue}
          onChange={(_, value) => {
            if (downloadProgress !== null) return;
            setTabValue(value);
          }}
        >
          <Tab label="設定" value={"setting"} />
          <Tab label="ダウンロード" value={"download"} />
        </Tabs>

        <div className={styles.settingContainer}>
          {/* 設定 */}
          <TabPanel value={tabValue} index={"setting"}>
            <SettingTool
              title="マップ番号"
              description="画像化するマップ番号の初期値を変更します。"
              direction="row"
            >
              {mapIdSelecter(setMasterMapIdStartTemp, masterMapIdStartTemp)}
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
            {fileFormatSetting}
          </TabPanel>

          {/* ダウンロード */}
          <TabPanel value={tabValue} index={"download"}>
            <Collapse in={downloadProgress !== null}>
              <div className={styles.downloadProgress}>
                <CircularProgress
                  variant="determinate"
                  value={downloadProgress as number}
                />
                <p>描画中...({downloadProgress?.toFixed(1)}%)</p>
              </div>
            </Collapse>
            <SettingTool
              title="範囲選択"
              description={`ダウンロードしたいマップ番号の範囲を指定してください。\n(${number2Hex(
                downloadRange[0]
              )}h ${mapNames[downloadRange[0]].name}) ~ (${number2Hex(
                downloadRange[1]
              )}h ${mapNames[downloadRange[1]].name})`}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px ",
                }}
              >
                <Slider
                  value={downloadRange}
                  min={0x00}
                  max={0xff}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) =>
                    `${number2Hex(value as number)}h `
                  }
                  onChange={(_: Event, value: number | number[]) => {
                    setDownloadRange(value as number[]);
                  }}
                />
              </div>
            </SettingTool>
            <div className={styles.downloadButtons}>
              <Button
                variant="contained"
                disabled={downloadProgress === null}
                onClick={() => {
                  downloadCnacel.current = true;
                  setDownloadProgress(null);
                }}
              >
                キャンセル
              </Button>
              <Button
                variant="contained"
                disabled={!pokeRom || downloadProgress !== null}
                onClick={async () => {
                  if (!pokeRom) return;
                  if (downloadProgress !== null) return;
                  // const toBlobAsync = (
                  //   canvas: HTMLCanvasElement,
                  //   format: string
                  // ): Promise<Blob | null> => {
                  //   return new Promise((resolve) => {
                  //     canvas.toBlob((blob) => resolve(blob), format);
                  //   });
                  // };
                  const minRange = downloadRange[0];
                  const maxRange = downloadRange[1];
                  const total = maxRange - minRange + 1;
                  setDownloadProgress(0);
                  const zip = new JSZip();
                  for (let i = minRange; i <= maxRange; i++) {
                    if (downloadCnacel.current) {
                      downloadCnacel.current = false;
                      setDownloadProgress(null);
                      return;
                    } // キャンセル
                    const canvas = await generateMapImg(
                      pokeRom,
                      i,
                      masterSpriteTemp,
                      1,
                      masterEdgeTemp * 8
                    );
                    setDownloadProgress(((i - minRange + 1) / total) * 100);
                    if (!canvas) continue;
                    const blob = await canvasToBlob(canvas, fileFormatTemp);
                    if (!blob) continue;
                    zip
                      .folder("mapimg")
                      ?.file(mapFileName(i, fileFormatTemp), blob);
                  }
                  const zipBlob = await zip.generateAsync({ type: "blob" });
                  downloadBlob(zipBlob, "mapimg.zip");
                  setDownloadProgress(null);
                }}
              >
                スタート
              </Button>
            </div>
          </TabPanel>
        </div>
      </Dialog>
    </>
  );
}

function SettingTool({
  title,
  description,
  children,
  direction = "column",
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  direction?: "row" | "column";
}) {
  return (
    <div className={styles.settingTools} style={{ flexDirection: direction }}>
      <div>
        <h3 className={styles.settingToolTitle}>{title}</h3>
        <p className={styles.settingToolDescription}>{description}</p>
      </div>
      {children}
    </div>
  );
}

function TabPanel({
  children,
  value,
  index,
}: {
  children: React.ReactNode;
  value: string;
  index: string;
}) {
  const open = value === index;

  return <Collapse in={open}>{children}</Collapse>;
}
