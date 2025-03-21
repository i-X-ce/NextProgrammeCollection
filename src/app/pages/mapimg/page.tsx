"use client";
import ColorPalettes from "@/app/components/specific/maping/ColorPalettes";
import styles from "./style.module.css";
import PokeRomDrop from "@/app/components/common/PokeRomDrop";
import MapCard from "@/app/components/specific/maping/MapCard";
import { generateMapImg } from "@/app/components/specific/maping/MapImg";
import { number2Hex } from "@/app/lib/common/calc";
import { mapNames } from "@/app/lib/common/map";
import {
  canvasToBlob,
  downloadBlob,
  FileFormat,
  mapFileName,
} from "@/app/lib/specific/maping/common";
import { MapPokeFile } from "@/app/lib/specific/maping/MapPokeFile";
import {
  Download,
  Palette,
  Person,
  PersonOff,
  Settings,
} from "@mui/icons-material";
import {
  Button,
  Checkbox,
  CircularProgress,
  Collapse,
  Dialog,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Switch,
  Tab,
  Tabs,
} from "@mui/material";
import JSZip from "jszip";
import React, { memo, useRef, useState } from "react";
import { GBcolorPalettes } from "@/app/lib/common/colorPalettes";

export default function Home() {
  const [pokeRom, setPokeRom] = useState<MapPokeFile | null>(null);
  // const [masterMapIdStartTemp, setMasterMapIdStartTemp] = useState(0);
  // const [masterEdgeTemp, setMasterEdgeTemp] = useState(12);
  // const [masterSpriteTemp, setMasterSpriteTemp] = useState(true);
  // const [masterMapIdStart, setMasterMapIdStart] = useState(0);
  // const [masterEdge, setMasterEdge] = useState(12);
  // const [masterSprite, setMasterSprite] = useState(true);
  const [
    masterMapIdStart,
    masterMapIdStartTemp,
    setMasterMapIdStart,
    setMasterMapIdStartTemp,
    masterMapIdStartConfirm,
    _masterMapIdStartCancel,
  ] = useTempState(0);
  const [
    masterEdge,
    masterEdgeTemp,
    _setMasterEdge,
    setMasterEdgeTemp,
    masterEdgeConfirm,
    _masterEdgeCancel,
  ] = useTempState(12);
  const [
    masterSprite,
    masterSpriteTemp,
    _setMasterSprite,
    setMasterSpriteTemp,
    masterSpriteConfirm,
    _masterSpriteCancel,
  ] = useTempState(true);
  const [openSetting, setOpenSetting] = useState(false);
  const [tabValue, setTabValue] = useState<"setting" | "color" | "download">(
    "setting"
  );

  // ダウンロード
  const [downloadRange, setDownloadRange] = useState([0x00, 0xff]);
  // const [fileFormat, setFileFormat] = useState<FileFormat>("png");
  // const [fileFormatTemp, setFileFormatTemp] = useState<FileFormat>("png");
  const [
    fileFormat,
    fileFormatTemp,
    _setFileFormat,
    setFileFormatTemp,
    fileFormatConfirm,
    _fileFormatCancel,
  ] = useTempState<FileFormat>("png");
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const downloadCnacel = useRef(false);

  // カラーパレット
  // const [colorPalettes, setColorPalettes] = useState<string[][]>(
  //   [...GBcolorPalettes].map((c) => [...c])
  // );
  const [
    colorPalettes,
    colorPalettesTemp,
    _setColorPalettes,
    setColorPalettesTemp,
    colorPalettesConfirm,
    _colorPalettesCancel,
  ] = useTempState([...GBcolorPalettes].map((c) => [...c]));
  // const [bgPaletteTemp, setBgPaletteTemp] = useState<number>(0);
  // const [bgPalette, setBgPalette] = useState<number>(0);
  const [
    bgPalette,
    bgPaletteTemp,
    _setBgPalette,
    setBgPaletteTemp,
    bgPaletteConfirm,
    _bgPaletteCancel,
  ] = useTempState(0);
  // const [oamPaletteTemp, setOamPaletteTemp] = useState<number>(0);
  // const [oamPalette, setOamPalette] = useState<number>(0);
  const [
    oamPalette,
    oamPaletteTemp,
    _setOamPalette,
    setOamPaletteTemp,
    oamPaletteConfirm,
    _oamPaletteCancel,
  ] = useTempState(0);
  const [
    paletteDivid,
    paletteDividTemp,
    _setPaletteDivid,
    setPaletteDividTemp,
    paletteDividConfirm,
    _paletteDividCancel,
  ] = useTempState(false);
  // const [paletteDividTemp, setPaletteDividTemp] = useState(false);
  // const [paletteDivid, setPaletteDivid] = useState(false);

  // サイズ
  const [size, sizeTemp, _setSize, setSizeTemp, sizeConfirm, _sizeReset] =
    useTempState(1);

  // const mapCards = useMemo(() => {
  //   if (!pokeRom) return null;
  //   return (
  //     <div
  //       className={styles.cardContainer}
  //       style={openSetting ? { display: "none" } : {}}
  //     >
  //       {Array.from({ length: 0x10 }).map((_, i) => (
  //         <MapCard
  //           key={`${i + masterMapIdStart * 0x10} ${size}`}
  //           pokeRom={pokeRom}
  //           mapId={i + masterMapIdStart * 0x10}
  //           masterEdge={masterEdge}
  //           masterSprite={masterSprite}
  //           fileFormat={fileFormat}
  //           bgColors={colorPalettes[bgPalette]}
  //           oamColors={
  //             paletteDividTemp
  //               ? colorPalettes[oamPalette]
  //               : colorPalettes[bgPalette]
  //           }
  //           size={size}
  //         />
  //       ))}
  //     </div>
  //   );
  // }, [
  //   pokeRom,
  //   masterMapIdStart,
  //   masterEdge,
  //   masterSprite,
  //   fileFormat,
  //   bgPalette,
  //   oamPalette,
  //   paletteDivid,
  //   size,
  // ]);

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
      icon: <Palette />,
      tooltipTitle: "カラーパレット",
      onClick: () => {
        setOpenSetting(true);
        setTabValue("color");
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

  // const mapIdPagination = (
  //   <Pagination
  //     count={0x10}
  //     color="primary"
  //     page={masterMapIdStartTemp + 1}
  //     renderItem={(item) => (
  //       <PaginationItem
  //         {...item}
  //         page={number2Hex(((item.page || 0) - 1) * 0x10)}
  //       />
  //     )}
  //     onChange={(_, page) => setMasterMapIdStartTemp(page - 1)}
  //   />
  // );

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
        <MenuItem value={"jpeg"}>JPG</MenuItem>
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

  const sizeSelector = (
    <FormControl sx={{ marginTop: "15px", width: "30%" }}>
      <InputLabel>サイズ</InputLabel>
      <Select
        label="サイズ"
        value={sizeTemp}
        onChange={(e) => {
          setSizeTemp(e.target.value as number);
        }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <MenuItem key={i} value={i + 1}>
            {i + 1}x
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const handleCloseSetting = () => {
    if (downloadProgress !== null) return;
    // 閉じるときに一気に書き換える
    setOpenSetting(false);
    // setMasterMapIdStart(masterMapIdStartTemp);
    masterMapIdStartConfirm();
    // setMasterEdge(masterEdgeTemp);
    masterEdgeConfirm();
    // setMasterSprite(masterSpriteTemp);
    masterSpriteConfirm();
    // setFileFormat(fileFormatTemp);
    fileFormatConfirm();
    // setBgPalette(bgPaletteTemp);
    // setOamPalette(oamPaletteTemp);
    bgPaletteConfirm();
    oamPaletteConfirm();
    // setPaletteDivid(paletteDividTemp);
    paletteDividConfirm();
    sizeConfirm();
    colorPalettesConfirm();
  };

  return (
    <>
      <style jsx global>
        {`
          :root {
            --bc-detail: #7e7e7e;
          }
        `}
      </style>
      {/* ドロップゾーン */}
      <PokeRomDrop
        setRom={(arrayBuffer: ArrayBuffer) => {
          const newPokeRom = new MapPokeFile(arrayBuffer);
          setPokeRom(newPokeRom);
        }}
      />
      {mapIdSelecter((id) => {
        setMasterMapIdStart(id);
        setMasterMapIdStartTemp(id);
      }, masterMapIdStart)}

      {/* マップカード */}
      <MapCards
        pokeRom={pokeRom}
        mapId={masterMapIdStart}
        edge={masterEdge}
        sprite={masterSprite}
        fileFormat={fileFormat}
        palettes={colorPalettes}
        bgColor={bgPalette}
        oamColor={paletteDivid ? oamPalette : bgPalette}
        size={size}
      />

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
      <Dialog open={openSetting} onClose={handleCloseSetting} maxWidth={false}>
        <Tabs
          value={tabValue}
          onChange={(_, value) => {
            if (downloadProgress !== null) return;
            setTabValue(value);
          }}
        >
          <Tab label="設定" value={"setting"} />
          <Tab label="カラーパレット" value={"color"} />
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
            <SettingTool
              title="サイズ"
              description="画像のピクセルサイズを変更します。"
              direction="row"
            >
              {sizeSelector}
            </SettingTool>
          </TabPanel>

          {/* カラーパレット */}
          <TabPanel value={tabValue} index={"color"}>
            <SettingTool
              title="個別に設定"
              description="背景とスプライトの色を個別に設定します。"
              direction="row"
            >
              <Switch
                checked={paletteDividTemp}
                onChange={(e) => setPaletteDividTemp(e.target.checked)}
              />
            </SettingTool>
            <SettingTool
              title={`背景${paletteDividTemp ? "" : "とスプライト"}`}
              description={`背景${
                paletteDividTemp ? "" : "とスプライト"
              }の配色を変更します。`}
            >
              <ColorPalettes
                pallets={colorPalettesTemp}
                palletIndex={bgPaletteTemp}
                onClick={(i) => {
                  setBgPaletteTemp(i);
                }}
                setPalettes={(p) => {
                  setColorPalettesTemp(p);
                }}
              />
            </SettingTool>
            <Collapse in={paletteDividTemp}>
              <SettingTool
                title="スプライト"
                description="スプライトの配色を変更します。"
              >
                <ColorPalettes
                  pallets={colorPalettesTemp}
                  palletIndex={oamPaletteTemp}
                  onClick={(i) => {
                    setOamPaletteTemp(i);
                  }}
                  setPalettes={(p) => {
                    setColorPalettesTemp(p);
                  }}
                />
              </SettingTool>
            </Collapse>
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
                      sizeTemp,
                      masterEdgeTemp * 8,
                      colorPalettesTemp[bgPaletteTemp],
                      paletteDividTemp
                        ? colorPalettesTemp[oamPaletteTemp]
                        : colorPalettesTemp[bgPaletteTemp]
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

// 一時保存を使うフック
function useTempState<T>(initialValue: T) {
  const [value, setValue] = useState(initialValue);
  const [tempValue, setTempValue] = useState(initialValue);

  const confirm = () => {
    setValue(tempValue);
  };

  const cancel = () => {
    setTempValue(value);
  };

  return [value, tempValue, setValue, setTempValue, confirm, cancel] as const;
}

const MapCards = memo(
  ({
    pokeRom,
    mapId,
    sprite,
    edge,
    fileFormat,
    palettes,
    bgColor,
    oamColor,
    size,
  }: {
    pokeRom: MapPokeFile | null;
    mapId: number;
    sprite: boolean;
    edge: number;
    fileFormat: FileFormat;
    palettes: string[][];
    bgColor: number;
    oamColor: number;
    size: number;
  }) => {
    if (!pokeRom) return null;
    console.log("render");
    return (
      <div className={styles.cardContainer}>
        {Array.from({ length: 0x10 }).map((_, i) => (
          <MapCard
            key={`${pokeRom.romName()} ${i + mapId * 0x10} ${[
              ...palettes[bgColor],
            ].map((c) => c)} ${[...palettes[oamColor]].map((c) => c)} ${size}`}
            pokeRom={pokeRom}
            mapId={i + mapId * 0x10}
            masterEdge={edge}
            masterSprite={sprite}
            fileFormat={fileFormat}
            bgColors={palettes[bgColor]}
            oamColors={palettes[oamColor]}
            size={size}
          />
        ))}
      </div>
    );
  }
);
