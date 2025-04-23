"use client";
import PartsPallet from "../PartsPallet";
import styles from "./style.module.css";
import { ReactNode, useCallback, useMemo, useRef, useState } from "react";
import PopoverWrapper from "@/app/components/common/PopoverWrapper";
import { ChromePicker } from "react-color";
import {
  Button,
  Checkbox,
  IconButton,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import {
  Circle,
  Download,
  Landscape,
  LandscapeOutlined,
  Replay,
  Square,
} from "@mui/icons-material";

// 表示できるゲーム機の種類
type GameType = "GB" | "GBP" | "GBC" | "GBA" | "GC" | "SFC";

// 部品のスタイルの種類
type PartsStyles =
  | "shell"
  | "shell2"
  | "cross"
  | "screen"
  | "glass"
  | "lamp"
  | "shadow"
  | "shadow2"
  | "button"
  | "AB"
  | "rubber"
  | "background"
  | "LR";

// スタイルとその色
type StyleColor = {
  style: PartsStyles;
  color: string;
};

const baseColors = [
  "#ff0000", // 赤
  "#ffa500", // オレンジ
  "#ffff00", // 黄色
  "#008000", // 緑
  "#35FFF6", // 水色
  "#0000ff", // 青
  "#4b0082", // 藍（インディゴ）
  "#ee82ee", // 紫（バイオレット）
  "#a52a2a", // 茶色
  "#000000", // 黒
  "#1a1a1a", // ほぼ黒
  "#333333", // 濃いグレー2
  "#4d4d4d", // 濃いグレー
  "#b3b3b3", // 薄いグレー
  "#e6e6e6", // 薄いグレー2
  "#f2f2f2", // 薄いグレー3
  "#ffffff", // 白
];

const shellColors = [
  "#de1021",
  "#ffc900",
  "#187b5a",
  "#181821",
  "#a5b5bd",
  "#ce9c84",
  "#ef73ad",
  "#5640bc",
  "#29abe2",
  "#aaaedd",
  "#dcdddf",
  "#4a4fae",
  "#f39dc4",
  "#fa8947",
  "#d1c3a0",
  "#b0bdc3",
  ...baseColors,
];

const buttonColors = ["#c12750", ...baseColors];

const screenColors = ["#d9e021", "#ed1c24", ...baseColors];

// 部品ごとのパレット(表示する必要のあるパレットのみ)
const partsPalletes: Record<PartsStyles, string[]> = {
  shell: shellColors,
  shell2: shellColors,
  AB: buttonColors,
  cross: buttonColors,
  button: buttonColors,
  rubber: buttonColors,
  LR: buttonColors,
  screen: screenColors,
  glass: shellColors,
  lamp: screenColors,
  shadow: ["#0000004c", "#ffffff4c"],
  shadow2: ["#00000098", "#ffffff98"],
  background: baseColors,
};

// ゲーム機の色の初期値
const initialStyleColors: Record<GameType, StyleColor[]> = {
  GB: [
    { style: "shell", color: "#f2f2f2" },
    { style: "AB", color: "#c12750" },
    { style: "cross", color: "#4d4d4d" },
    { style: "rubber", color: "#b3b3b3" },
    { style: "screen", color: "#d9e021" },
    { style: "glass", color: "#b3b3b3" },
    { style: "lamp", color: "#ed1c24" },
    { style: "shadow", color: "#0000004c" },
  ],
  GBP: [
    { style: "shell", color: "#ffc900" },
    { style: "AB", color: "#4d4d4d" },
    { style: "cross", color: "#4d4d4d" },
    { style: "rubber", color: "#4d4d4d" },
    { style: "screen", color: "#d9e021" },
    { style: "glass", color: "#4d4d4d" },
    { style: "lamp", color: "#ed1c24" },
    { style: "shadow", color: "#0000004c" },
    { style: "shadow2", color: "#00000098" },
  ],
  GBC: [
    { style: "shell", color: "#29abe2" },
    { style: "AB", color: "#4d4d4d" },
    { style: "cross", color: "#4d4d4d" },
    { style: "rubber", color: "#4d4d4d" },
    { style: "screen", color: "#d9e021" },
    { style: "glass", color: "#4d4d4d" },
    { style: "lamp", color: "#ed1c24" },
    { style: "shadow", color: "#0000004c" },
    { style: "shadow2", color: "#00000098" },
  ],
  GBA: [
    { style: "shell", color: "#4a4fae" },
    { style: "AB", color: "#b3b3b3" },
    { style: "cross", color: "#b3b3b3" },
    { style: "rubber", color: "#b3b3b3" },
    { style: "LR", color: "#b3b3b3" },
    { style: "screen", color: "#d9e021" },
    { style: "glass", color: "#333333" },
    { style: "lamp", color: "#d9e021" },
    { style: "shadow", color: "#0000004c" },
  ],
  GC: [
    { style: "shell", color: "#4a4fae" },
    { style: "shell2", color: "#1a1a1a" },
    { style: "button", color: "#b3b3b3" },
    { style: "shadow", color: "#0000004c" },
  ],
  SFC: [
    { style: "shell", color: "#e6e6e6" },
    { style: "shell2", color: "#b3b3b3" },
    { style: "button", color: "#4d4d4d" },
    { style: "lamp", color: "#ed1c24" },
    { style: "shadow", color: "#0000004c" },
  ],
};

// パーツの名前
const partsNames: Record<PartsStyles, string> = {
  shell: "外装",
  shell2: "外装2",
  cross: "十字キー",
  screen: "画面",
  glass: "画面ガラス",
  lamp: "ランプ",
  shadow: "影・溝",
  shadow2: "影・溝2",
  button: "ボタン",
  AB: "ABボタン",
  LR: "LRボタン",
  rubber: "ラバーボタン",
  background: "背景",
};

// ゲーム機の名前
const GameNames: Record<GameType, { EN: GameType; JP: string }> = {
  GB: {
    EN: "GB",
    JP: "ゲームボーイ",
  },
  GBP: {
    EN: "GBP",
    JP: "ゲームボーイポケット",
  },
  GBC: {
    EN: "GBC",
    JP: "ゲームボーイカラー",
  },
  GBA: {
    EN: "GBA",
    JP: "ゲームボーイアドバンス",
  },
  GC: {
    EN: "GC",
    JP: "ゲームキューブ",
  },
  SFC: {
    EN: "SFC",
    JP: "スーパーファミコン",
  },
};

// // パレットを表示させるスタイルのセットを定義
// const displayStyleSet: Record<GameType, PartsStyles[]> = {
//   GB: ["shell", "AB", "rubber", "cross", "screen", "glass", "lamp", "shadow"],
//   GBP: [],
//   GBC: [],
//   GBA: [],
//   GC: [],
//   SFC: [],
// };

export default function GameSVG() {
  const [gameType, setGameType] = useState<GameType>("GB");
  const [styleColors, setStyleColors] = useState<
    Record<GameType, StyleColor[]>
  >(
    Object.values(GameNames).reduce((acc, game) => {
      acc[game.EN as GameType] = initialStyleColors[game.EN];
      return acc;
    }, {} as Record<GameType, StyleColor[]>)
  );
  // const [_changePartsList, setChangePartsList] = useState<
  //   { name: PartsStyles; element: SVGElement }[]
  // >([]); // 個別に変更した部品のリスト

  const svgRef = useRef<SVGSVGElement>(null);
  // const svgRef = useRef<HTMLDivElement>(null);

  const getColor = (style: PartsStyles) => {
    return styleColors[gameType].find((s) => s.style === style)?.color;
  };

  const [openColorPicker, setOpenColorPicker] = useState(false);
  const [createColor, setCreateColor] = useState<string | null>(null);
  const targetElement = useRef<{ target: SVGElement | null; style: string }>(
    null
  ); // クリックした要素を保存するためのref
  const [discreteColors, setDiscreateColors] = useState<
    Record<
      GameType,
      { [id: string]: { style: PartsStyles; color: string } } | null
    >
  >(
    Object.values(GameNames).reduce((acc, game) => {
      acc[game.EN as GameType] = null;
      return acc;
    }, {} as Record<GameType, { [id: string]: { style: PartsStyles; color: string } } | null>)
  ); // 個別色の色

  const [backgroundEnabled, setBackgroundEnabled] = useState(false); // 背景の有無
  const [backgroundShape, setBackgroundShape] = useState<"circle" | "square">(
    "circle"
  ); // 背景の形
  const [backgroundSize, setBackgroundSize] = useState(20); // 背景のサイズ
  const [backgroundColor, setBackgroundColor] = useState(
    partsPalletes.background[0]
  ); // 背景の色

  // 個別色の変更
  const handleSVGClick = (e: React.MouseEvent<SVGElement>) => {
    const target = e.target as SVGElement;
    const targetId = target.getAttribute("id");
    const targetName = target.getAttribute("data-name");
    const targetStyle = !targetName ? targetId : targetName;
    if (!targetId && !targetName) return;
    if (!targetStyle) return;
    targetElement.current = { target, style: targetStyle }; // クリックした要素を保存
    // targetの色を取得する
    const computedStyle = window.getComputedStyle(target);
    const fill = computedStyle.fill;
    setCreateColor(fill);
    // setChangePartsList((prev) => {
    //   return [
    //     ...prev,
    //     {
    //       name: targetStyle as PartsStyles,
    //       element: target,
    //     },
    //   ];
    // });

    if (!targetId) return;
    setOpenColorPicker(true);
    setDiscreateColors((prev) => {
      return {
        ...prev,
        [gameType]: {
          ...prev[gameType],
          [targetId]: { style: targetStyle as PartsStyles, color: fill },
        },
      };
    });
  };

  // 画像ダウンロードの処理
  const handleSVGDownload = () => {
    const svg = svgRef.current;
    if (!svg) return;
    const discreteStyle = document.createElement("style");
    discreteStyle.innerHTML = discreteColorsStyles;
    svg.appendChild(discreteStyle);
    console.log(svg);
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    console.log(svgBlob);
    const url = URL.createObjectURL(svgBlob);
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (!context) return;
      // 背景の有無で分岐
      const size = 1000;
      if (backgroundEnabled) {
        canvas.width = size;
        canvas.height = size;
        context.fillStyle = backgroundColor;
        if (backgroundShape === "circle") {
          context.beginPath();
          context.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
          context.closePath();
          context.fill();
        } else {
          context.fillRect(0, 0, canvas.width, canvas.height);
        }
        let w = 0;
        let h = 0;
        if (image.width > image.height) {
          w = size;
          h = (image.height / image.width) * size;
        } else {
          w = (image.width / image.height) * size;
          h = size;
        }
        w *= (100 - backgroundSize * 2) / 100;
        h *= (100 - backgroundSize * 2) / 100;
        const x = (size - w) / 2;
        const y = (size - h) / 2;
        context.drawImage(image, x, y, w, h);
      } else {
        if (image.width > image.height) {
          canvas.width = size;
          canvas.height = size * (image.height / image.width);
        } else {
          canvas.width = size * (image.width / image.height);
          canvas.height = size;
        }
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
      }

      const pngUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = pngUrl;
      a.download = `${gameType}.png`;
      a.click();
      URL.revokeObjectURL(url);
    };
    image.src = url;

    // const canvas = await html2canvas(target);
    // const dataUrl = canvas.toDataURL("image/png");
    // const link = document.createElement("a");
    // link.href = dataUrl;
    // link.download = `${gameType}.png`;
    // link.click();
    // console.log("ダウンロード完了");
  };

  // SVG追加ルール
  // -- レイヤーにパーツの名前を付ける
  // -- SVGタグのonClickにhandleSVGClickを追加する
  // -- 真っ黒の要素は不当明度を弄らない場合は作らない
  // -- svg/defs/styleの中身を``で囲み、fillの色をgetColor(部品名)で取得する
  // -- svgにrefを追加する
  // -- 同じ色で違うパーツパレットにしたい場合は少しだけカラーコードを変更してクラスをずらしておく
  // -- 透明度がopacityで指定されている場合は、RGBAで指定する
  // -- ?xmlタグは消す
  // -- classはclassNameに変更する
  const svgs: Record<GameType, ReactNode> = {
    GB: (
      <svg
        id="GB"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 604.34 1000"
        onClick={handleSVGClick}
        ref={svgRef}
      >
        <defs>
          <style>
            {`.cls-1 {
              fill: ${getColor("screen")};
            }

            .cls-2 {
              fill: ${getColor("shadow")};
            }

            .cls-3 {
              fill: ${getColor("cross")};
            }

            .cls-4 {
              fill: ${getColor("AB")};
            }

            .cls-5 {
              fill:${getColor("shell")};
            }

            .cls-6 {
              fill: ${getColor("glass")};
            }

            .cls-7 {
              fill:${getColor("rubber")};
            }

            .cls-8 {
              fill: ${getColor("lamp")};
            }`}
          </style>
        </defs>
        <path
          id="shell"
          className="cls-5"
          d="M604.19,15.71v849.54c0,74.42-60.33,134.75-134.75,134.75H15.86c-8.68,0-15.71-7.03-15.71-15.71V15.71C.15,7.03,7.18,0,15.86,0h572.62c8.68,0,15.71,7.03,15.71,15.71Z"
        />
        <path
          id="glass"
          className="cls-6"
          d="M555.62,111.73v284.58c0,43.38-35.16,78.54-78.54,78.54H72.38c-13.07,0-23.66-10.59-23.66-23.66V111.73c0-13.06,10.59-23.66,23.66-23.66h459.58c13.07,0,23.66,10.6,23.66,23.66Z"
        />
        <rect
          id="screen"
          className="cls-1"
          x="139.47"
          y="134.27"
          width="325.4"
          height="293.06"
        />
        <polygon
          id="shadow"
          className="cls-2"
          points="139.47 427.33 464.87 134.27 464.87 427.33 139.47 427.33"
        />
        <rect
          id="rubber"
          className="cls-7"
          x="284.94"
          y="815.59"
          width="77.07"
          height="22.56"
          rx="11.28"
          ry="11.28"
          transform="translate(-315.53 210.41) rotate(-24.66)"
        />
        <rect
          id="rubber-2"
          data-name="rubber"
          className="cls-7"
          x="182.87"
          y="815.59"
          width="77.07"
          height="22.56"
          rx="11.28"
          ry="11.28"
          transform="translate(-324.84 167.82) rotate(-24.66)"
        />
        <path
          id="shadow-2"
          data-name="shadow"
          className="cls-2"
          d="M600.46,53.83h-43.02V3.88c0-2.14-1.74-3.88-3.88-3.88s-3.88,1.74-3.88,3.88v49.96H53.15V3.88c0-2.14-1.74-3.88-3.88-3.88s-3.88,1.74-3.88,3.88v49.96H3.88c-2.14,0-3.88,1.74-3.88,3.88s1.74,3.88,3.88,3.88h596.59c2.14,0,3.88-1.74,3.88-3.88s-1.74-3.88-3.88-3.88Z"
        />
        <path
          id="cross"
          className="cls-3"
          d="M201.15,660.46v44.38c0,3.06-2.48,5.54-5.54,5.54h-42.4v42.4c0,3.06-2.48,5.54-5.54,5.54h-44.38c-3.06,0-5.54-2.48-5.54-5.54v-42.4h-42.4c-3.06,0-5.54-2.48-5.54-5.54v-44.38c0-3.06,2.48-5.54,5.54-5.54h42.4v-42.4c0-3.06,2.48-5.54,5.54-5.54h44.38c3.06,0,5.54,2.48,5.54,5.54v42.4h42.4c3.06,0,5.54,2.48,5.54,5.54Z"
        />
        <g>
          <rect
            id="shadow-3"
            data-name="shadow"
            className="cls-2"
            x="354.46"
            y="931.37"
            width="100.57"
            height="12.85"
            rx="6.42"
            ry="6.42"
            transform="translate(1014.52 118.38) rotate(60)"
          />
          <rect
            id="shadow-4"
            data-name="shadow"
            className="cls-2"
            x="383.89"
            y="914.37"
            width="100.57"
            height="12.85"
            rx="6.42"
            ry="6.42"
            transform="translate(1014.52 84.39) rotate(60)"
          />
          <rect
            id="shadow-5"
            data-name="shadow"
            className="cls-2"
            x="413.33"
            y="897.37"
            width="100.57"
            height="12.85"
            rx="6.42"
            ry="6.42"
            transform="translate(1014.52 50.4) rotate(60)"
          />
          <rect
            id="shadow-6"
            data-name="shadow"
            className="cls-2"
            x="442.77"
            y="880.38"
            width="100.57"
            height="12.85"
            rx="6.42"
            ry="6.42"
            transform="translate(1014.51 16.41) rotate(60)"
          />
          <rect
            id="shadow-7"
            data-name="shadow"
            className="cls-2"
            x="472.2"
            y="863.38"
            width="100.57"
            height="12.85"
            rx="6.42"
            ry="6.42"
            transform="translate(1014.51 -17.58) rotate(60)"
          />
          <rect
            id="shadow-8"
            data-name="shadow"
            className="cls-2"
            x="502.29"
            y="847.52"
            width="100.57"
            height="12.85"
            rx="6.42"
            ry="6.42"
            transform="translate(1015.82 -51.58) rotate(60)"
          />
        </g>
        <circle id="AB" className="cls-4" cx="424.04" cy="696.88" r="37.33" />
        <circle
          id="AB-2"
          data-name="AB"
          className="cls-4"
          cx="523.21"
          cy="648.92"
          r="37.33"
        />
        <circle id="lamp" className="cls-8" cx="87.43" cy="237.26" r="7.7" />
      </svg>
    ),
    GBP: (
      <svg
        id="GBP"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 608.16 1000"
        onClick={handleSVGClick}
        ref={svgRef}
      >
        <defs>
          <style>
            {`.cls-1 {
              fill: ${getColor("shadow2")};
            }

            .cls-2 {
              fill: ${getColor("rubber")};
            }

            .cls-3 {
              fill: ${getColor("screen")};
            }

            .cls-4 {
              fill: ${getColor("AB")};
            }

            .cls-5 {
              fill: ${getColor("cross")};
            }

            .cls-6 {
              fill: ${getColor("shadow")};
            }

            .cls-7 {
              fill: ${getColor("glass")};
            }

            .cls-8 {
              fill: ${getColor("lamp")};
            }

            .cls-9 {
              fill: ${getColor("shell")};
            }`}
          </style>
        </defs>
        <path
          id="shell"
          className="cls-9"
          d="M608.16,21.19v874.45c0,57.64-46.73,104.36-104.36,104.36H21.19c-11.7,0-21.19-9.49-21.19-21.19V21.19C0,9.49,9.49,0,21.19,0h565.78c11.7,0,21.19,9.49,21.19,21.19Z"
        />
        <path
          id="glass"
          className="cls-7"
          d="M570.73,72.53v386.21c0,31.86-25.82,57.68-57.68,57.68H46.8c-5.18,0-9.37-4.19-9.37-9.37V72.53c0-5.17,4.19-9.36,9.37-9.36h514.56c5.18,0,9.37,4.19,9.37,9.36Z"
        />
        <rect
          id="screen"
          className="cls-3"
          x="108.48"
          y="106.93"
          width="391.2"
          height="350.93"
          rx="7.18"
          ry="7.18"
        />
        <path
          id="shadow"
          className="cls-6"
          d="M497.46,108.92L110.7,455.86c1.29,1.23,3.03,1.99,4.95,1.99h376.85c3.96,0,7.18-3.21,7.18-7.18V114.11c0-2.04-.86-3.88-2.22-5.18Z"
        />
        <path
          id="cross"
          className="cls-5"
          d="M199.03,655.56v41.3c0,3.23-2.62,5.85-5.85,5.85h-42.84v42.84c0,3.24-2.62,5.86-5.86,5.86h-41.3c-3.23,0-5.85-2.62-5.85-5.86v-42.84h-42.85c-3.23,0-5.85-2.62-5.85-5.85v-41.3c0-3.24,2.62-5.86,5.85-5.86h42.85v-42.84c0-3.23,2.62-5.85,5.85-5.85h41.3c3.24,0,5.86,2.62,5.86,5.85v42.84h42.84c3.23,0,5.85,2.62,5.85,5.86Z"
        />
        <rect
          id="rubber"
          className="cls-2"
          x="224.92"
          y="832.62"
          width="68.42"
          height="23.95"
          rx="11.98"
          ry="11.98"
        />
        <rect
          id="rubber-2"
          data-name="rubber"
          className="cls-2"
          x="317.17"
          y="832.62"
          width="68.42"
          height="23.95"
          rx="11.98"
          ry="11.98"
        />
        <circle id="AB" className="cls-4" cx="412.98" cy="694.44" r="37.6" />
        <circle
          id="AB-2"
          data-name="AB"
          className="cls-4"
          cx="525.68"
          cy="658.16"
          r="37.6"
        />
        <circle id="lamp" className="cls-8" cx="56.42" cy="180.2" r="7.84" />
        <g>
          <circle
            id="shadow-2"
            data-name="shadow"
            className="cls-6"
            cx="467.28"
            cy="958.9"
            r="4.41"
          />
          <circle
            id="shadow2"
            className="cls-1"
            cx="467.28"
            cy="940.82"
            r="4.41"
          />
          <circle
            id="shadow-3"
            data-name="shadow"
            className="cls-6"
            cx="467.28"
            cy="922.73"
            r="4.41"
          />
          <circle
            id="shadow2-2"
            data-name="shadow2"
            className="cls-1"
            cx="467.28"
            cy="904.65"
            r="4.41"
          />
          <circle
            id="shadow-4"
            data-name="shadow"
            className="cls-6"
            cx="467.28"
            cy="886.57"
            r="4.41"
          />
          <circle
            id="shadow-5"
            data-name="shadow"
            className="cls-6"
            cx="484.9"
            cy="940.82"
            r="4.41"
          />
          <circle
            id="shadow2-3"
            data-name="shadow2"
            className="cls-1"
            cx="484.9"
            cy="922.73"
            r="4.41"
          />
          <circle
            id="shadow-6"
            data-name="shadow"
            className="cls-6"
            cx="484.9"
            cy="904.65"
            r="4.41"
          />
          <circle
            id="shadow2-4"
            data-name="shadow2"
            className="cls-1"
            cx="484.9"
            cy="886.57"
            r="4.41"
          />
          <circle
            id="shadow-7"
            data-name="shadow"
            className="cls-6"
            cx="484.9"
            cy="868.48"
            r="4.41"
          />
          <circle
            id="shadow2-5"
            data-name="shadow2"
            className="cls-1"
            cx="484.9"
            cy="958.9"
            r="4.41"
          />
          <circle
            id="shadow-8"
            data-name="shadow"
            className="cls-6"
            cx="502.51"
            cy="958.9"
            r="4.41"
          />
          <circle
            id="shadow2-6"
            data-name="shadow2"
            className="cls-1"
            cx="502.51"
            cy="940.82"
            r="4.41"
          />
          <circle
            id="shadow-9"
            data-name="shadow"
            className="cls-6"
            cx="502.51"
            cy="922.73"
            r="4.41"
          />
          <circle
            id="shadow2-7"
            data-name="shadow2"
            className="cls-1"
            cx="502.51"
            cy="904.65"
            r="4.41"
          />
          <circle
            id="shadow-10"
            data-name="shadow"
            className="cls-6"
            cx="502.51"
            cy="886.57"
            r="4.41"
          />
          <circle
            id="shadow2-8"
            data-name="shadow2"
            className="cls-1"
            cx="502.51"
            cy="868.48"
            r="4.41"
          />
          <circle
            id="shadow-11"
            data-name="shadow"
            className="cls-6"
            cx="502.51"
            cy="850.4"
            r="4.41"
          />
          <circle
            id="shadow-12"
            data-name="shadow"
            className="cls-6"
            cx="520.13"
            cy="940.82"
            r="4.41"
          />
          <circle
            id="shadow2-9"
            data-name="shadow2"
            className="cls-1"
            cx="520.13"
            cy="922.73"
            r="4.41"
          />
          <circle
            id="shadow-13"
            data-name="shadow"
            className="cls-6"
            cx="520.13"
            cy="904.65"
            r="4.41"
          />
          <circle
            id="shadow2-10"
            data-name="shadow2"
            className="cls-1"
            cx="520.13"
            cy="886.57"
            r="4.41"
          />
          <circle
            id="shadow-14"
            data-name="shadow"
            className="cls-6"
            cx="520.13"
            cy="868.48"
            r="4.41"
          />
          <circle
            id="shadow2-11"
            data-name="shadow2"
            className="cls-1"
            cx="520.13"
            cy="850.4"
            r="4.41"
          />
          <circle
            id="shadow2-12"
            data-name="shadow2"
            className="cls-1"
            cx="520.13"
            cy="958.9"
            r="4.41"
          />
          <circle
            id="shadow-15"
            data-name="shadow"
            className="cls-6"
            cx="537.75"
            cy="958.9"
            r="4.41"
          />
          <circle
            id="shadow2-13"
            data-name="shadow2"
            className="cls-1"
            cx="537.75"
            cy="940.82"
            r="4.41"
          />
          <circle
            id="shadow-16"
            data-name="shadow"
            className="cls-6"
            cx="537.75"
            cy="922.73"
            r="4.41"
          />
          <circle
            id="shadow2-14"
            data-name="shadow2"
            className="cls-1"
            cx="537.75"
            cy="904.65"
            r="4.41"
          />
          <circle
            id="shadow-17"
            data-name="shadow"
            className="cls-6"
            cx="537.75"
            cy="886.57"
            r="4.41"
          />
          <circle
            id="shadow2-15"
            data-name="shadow2"
            className="cls-1"
            cx="537.75"
            cy="868.48"
            r="4.41"
          />
          <circle
            id="shadow-18"
            data-name="shadow"
            className="cls-6"
            cx="537.75"
            cy="850.4"
            r="4.41"
          />
          <circle
            id="shadow-19"
            data-name="shadow"
            className="cls-6"
            cx="555.36"
            cy="940.82"
            r="4.41"
          />
          <circle
            id="shadow2-16"
            data-name="shadow2"
            className="cls-1"
            cx="555.36"
            cy="922.73"
            r="4.41"
          />
          <circle
            id="shadow-20"
            data-name="shadow"
            className="cls-6"
            cx="555.36"
            cy="904.65"
            r="4.41"
          />
          <circle
            id="shadow2-17"
            data-name="shadow2"
            className="cls-1"
            cx="555.36"
            cy="886.57"
            r="4.41"
          />
          <circle
            id="shadow-21"
            data-name="shadow"
            className="cls-6"
            cx="555.36"
            cy="868.48"
            r="4.41"
          />
          <circle
            id="shadow2-18"
            data-name="shadow2"
            className="cls-1"
            cx="555.36"
            cy="850.4"
            r="4.41"
          />
          <circle
            id="shadow-22"
            data-name="shadow"
            className="cls-6"
            cx="572.98"
            cy="922.73"
            r="4.41"
          />
          <circle
            id="shadow2-19"
            data-name="shadow2"
            className="cls-1"
            cx="572.98"
            cy="904.65"
            r="4.41"
          />
          <circle
            id="shadow-23"
            data-name="shadow"
            className="cls-6"
            cx="572.98"
            cy="886.57"
            r="4.41"
          />
          <circle
            id="shadow2-20"
            data-name="shadow2"
            className="cls-1"
            cx="572.98"
            cy="868.48"
            r="4.41"
          />
          <circle
            id="shadow-24"
            data-name="shadow"
            className="cls-6"
            cx="572.98"
            cy="850.4"
            r="4.41"
          />
        </g>
      </svg>
    ),
    GBC: (
      <svg
        id="GBC"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 584.97 1000"
        onClick={handleSVGClick}
        ref={svgRef}
      >
        <defs>
          <style>
            {`.cls-1 {
              fill: ${getColor("shell")};
            }
      
            .cls-2 {
              fill: ${getColor("AB")};
            }
      
            .cls-3 {
              fill: ${getColor("screen")};
            }
      
            .cls-4 {
              fill: ${getColor("cross")};
            }
      
            .cls-5 {
              fill: ${getColor("rubber")};
            }
      
            .cls-6 {
              fill: ${getColor("shadow")};
            }
      
            .cls-7 {
              fill: ${getColor("glass")};
            }
      
            .cls-8 {
              fill: ${getColor("shadow")};
            }
      
            .cls-9 {
              fill: ${getColor("lamp")};
            }
      
            .cls-10 {
              fill: ${getColor("shadow2")};
            }`}
          </style>
        </defs>
        <path
          id="shell"
          className="cls-1"
          d="M584.96,22.4v904.75c-1.03,6.38-3.51,15.86-10.26,24.74-11.97,15.76-30.26,20.25-39.73,22.43-87.05,20.05-184.51,23.68-184.51,23.68-16.68.62-36.17,1.31-57.98,2-21.81-.69-41.3-1.38-57.98-2,0,0-97.46-3.63-184.51-23.68-9.47-2.18-27.76-6.67-39.73-22.43-6.75-8.88-9.23-18.36-10.26-24.74V22.4C0,10.03,10.02,0,22.39,0h540.18c12.37,0,22.39,10.03,22.39,22.4Z"
        />
        <path
          id="glass"
          className="cls-7"
          d="M546.78,57.21v417.28c-.27,1.25-1.45,5.98-5.95,9.24-3.08,2.24-6.22,2.7-7.69,2.82-38.95,4.29-79.84,7.83-122.56,10.32-40.97,2.4-80.39,3.64-118.1,3.99-37.71-.35-77.13-1.59-118.1-3.99-42.72-2.49-83.61-6.03-122.56-10.32-1.47-.12-4.61-.58-7.69-2.82-4.5-3.26-5.68-7.99-5.95-9.24V57.21c0-8.2,6.65-14.84,14.84-14.84h478.92c8.19,0,14.84,6.64,14.84,14.84Z"
        />
        <rect
          id="screen"
          className="cls-3"
          x="105.62"
          y="75.92"
          width="373.73"
          height="337.2"
        />
        <path
          id="cross"
          className="cls-4"
          d="M193.98,643.21v32.05c0,4.51-3.66,8.17-8.17,8.17h-37.13v37.13c0,4.51-3.66,8.17-8.17,8.17h-32.05c-4.51,0-8.17-3.66-8.17-8.17v-37.13h-37.13c-4.52,0-8.17-3.66-8.17-8.17v-32.05c0-4.51,3.65-8.17,8.17-8.17h37.13v-37.13c0-4.52,3.66-8.17,8.17-8.17h32.05c4.51,0,8.17,3.65,8.17,8.17v37.13h37.13c4.51,0,8.17,3.66,8.17,8.17Z"
        />
        <path
          id="rubber"
          className="cls-5"
          d="M275.33,826c-.64,11.93-15.36,10.68-26.05,11.05-10.7-.37-25.47.9-26.1-11.07.64-11.94,15.37-10.67,26.05-11.05,10.7.38,25.47-.9,26.1,11.07Z"
        />
        <path
          id="rubber-2"
          data-name="rubber"
          className="cls-5"
          d="M360.16,826.31c-.64,11.93-15.36,10.68-26.05,11.05-10.7-.37-25.47.9-26.1-11.07.64-11.94,15.37-10.67,26.05-11.05,10.7.38,25.47-.9,26.1,11.07Z"
        />
        <circle id="AB" className="cls-2" cx="394.04" cy="676.2" r="35" />
        <circle
          id="AB-2"
          data-name="AB"
          className="cls-2"
          cx="498.88"
          cy="642.7"
          r="35"
        />
        <circle id="lamp" className="cls-9" cx="59.1" cy="187.2" r="9.64" />
        <polygon
          id="shadow"
          className="cls-6"
          points="105.62 413.12 479.35 75.92 479.35 413.12 105.62 413.12"
        />
        <g>
          <circle
            id="shadow-2"
            data-name="shadow"
            className="cls-8"
            cx="426.8"
            cy="934.3"
            r="5.1"
          />
          <circle
            id="shadow2"
            className="cls-10"
            cx="426.8"
            cy="917.87"
            r="5.1"
          />
          <circle
            id="shadow-3"
            data-name="shadow"
            className="cls-8"
            cx="426.8"
            cy="901.44"
            r="5.1"
          />
          <circle
            id="shadow2-2"
            data-name="shadow2"
            className="cls-10"
            cx="426.8"
            cy="885.01"
            r="5.1"
          />
          <circle
            id="shadow-4"
            data-name="shadow"
            className="cls-8"
            cx="426.8"
            cy="868.58"
            r="5.1"
          />
          <circle
            id="shadow2-3"
            data-name="shadow2"
            className="cls-10"
            cx="426.8"
            cy="852.16"
            r="5.1"
          />
          <circle
            id="shadow2-4"
            data-name="shadow2"
            className="cls-10"
            cx="443.3"
            cy="932.09"
            r="5.1"
          />
          <circle
            id="shadow-5"
            data-name="shadow"
            className="cls-8"
            cx="443.3"
            cy="915.66"
            r="5.1"
          />
          <circle
            id="shadow2-5"
            data-name="shadow2"
            className="cls-10"
            cx="443.3"
            cy="899.23"
            r="5.1"
          />
          <circle
            id="shadow-6"
            data-name="shadow"
            className="cls-8"
            cx="443.3"
            cy="882.8"
            r="5.1"
          />
          <circle
            id="shadow2-6"
            data-name="shadow2"
            className="cls-10"
            cx="443.3"
            cy="866.37"
            r="5.1"
          />
          <circle
            id="shadow-7"
            data-name="shadow"
            className="cls-8"
            cx="443.3"
            cy="849.94"
            r="5.1"
          />
          <circle
            id="shadow2-7"
            data-name="shadow2"
            className="cls-10"
            cx="443.3"
            cy="833.51"
            r="5.1"
          />
          <circle
            id="shadow-8"
            data-name="shadow"
            className="cls-8"
            cx="443.3"
            cy="948.51"
            r="5.1"
          />
          <circle
            id="shadow2-8"
            data-name="shadow2"
            className="cls-10"
            cx="459.8"
            cy="945.63"
            r="5.1"
          />
          <circle
            id="shadow-9"
            data-name="shadow"
            className="cls-8"
            cx="459.8"
            cy="929.2"
            r="5.1"
          />
          <circle
            id="shadow2-9"
            data-name="shadow2"
            className="cls-10"
            cx="459.8"
            cy="912.77"
            r="5.1"
          />
          <circle
            id="shadow-10"
            data-name="shadow"
            className="cls-8"
            cx="459.8"
            cy="896.34"
            r="5.1"
          />
          <circle
            id="shadow2-10"
            data-name="shadow2"
            className="cls-10"
            cx="459.8"
            cy="879.91"
            r="5.1"
          />
          <circle
            id="shadow-11"
            data-name="shadow"
            className="cls-8"
            cx="459.8"
            cy="863.48"
            r="5.1"
          />
          <circle
            id="shadow2-11"
            data-name="shadow2"
            className="cls-10"
            cx="459.8"
            cy="847.06"
            r="5.1"
          />
          <circle
            id="shadow-12"
            data-name="shadow"
            className="cls-8"
            cx="459.8"
            cy="830.63"
            r="5.1"
          />
          <circle
            id="shadow2-12"
            data-name="shadow2"
            className="cls-10"
            cx="476.29"
            cy="926.37"
            r="5.1"
          />
          <circle
            id="shadow-13"
            data-name="shadow"
            className="cls-8"
            cx="476.29"
            cy="909.94"
            r="5.1"
          />
          <circle
            id="shadow2-13"
            data-name="shadow2"
            className="cls-10"
            cx="476.29"
            cy="893.51"
            r="5.1"
          />
          <circle
            id="shadow-14"
            data-name="shadow"
            className="cls-8"
            cx="476.29"
            cy="877.09"
            r="5.1"
          />
          <circle
            id="shadow2-14"
            data-name="shadow2"
            className="cls-10"
            cx="476.29"
            cy="860.66"
            r="5.1"
          />
          <circle
            id="shadow-15"
            data-name="shadow"
            className="cls-8"
            cx="476.29"
            cy="844.23"
            r="5.1"
          />
          <circle
            id="shadow2-15"
            data-name="shadow2"
            className="cls-10"
            cx="476.29"
            cy="827.8"
            r="5.1"
          />
          <circle
            id="shadow-16"
            data-name="shadow"
            className="cls-8"
            cx="476.29"
            cy="942.8"
            r="5.1"
          />
          <circle
            id="shadow2-16"
            data-name="shadow2"
            className="cls-10"
            cx="492.79"
            cy="939.3"
            r="5.1"
          />
          <circle
            id="shadow-17"
            data-name="shadow"
            className="cls-8"
            cx="492.79"
            cy="922.87"
            r="5.1"
          />
          <circle
            id="shadow2-17"
            data-name="shadow2"
            className="cls-10"
            cx="492.79"
            cy="906.44"
            r="5.1"
          />
          <circle
            id="shadow-18"
            data-name="shadow"
            className="cls-8"
            cx="492.79"
            cy="890.01"
            r="5.1"
          />
          <circle
            id="shadow2-18"
            data-name="shadow2"
            className="cls-10"
            cx="492.79"
            cy="873.59"
            r="5.1"
          />
          <circle
            id="shadow-19"
            data-name="shadow"
            className="cls-8"
            cx="492.79"
            cy="857.16"
            r="5.1"
          />
          <circle
            id="shadow2-19"
            data-name="shadow2"
            className="cls-10"
            cx="492.79"
            cy="840.73"
            r="5.1"
          />
          <circle
            id="shadow-20"
            data-name="shadow"
            className="cls-8"
            cx="492.79"
            cy="824.3"
            r="5.1"
          />
          <circle
            id="shadow2-20"
            data-name="shadow2"
            className="cls-10"
            cx="509.29"
            cy="919.07"
            r="5.1"
          />
          <circle
            id="shadow-21"
            data-name="shadow"
            className="cls-8"
            cx="509.29"
            cy="902.64"
            r="5.1"
          />
          <circle
            id="shadow2-21"
            data-name="shadow2"
            className="cls-10"
            cx="509.29"
            cy="886.21"
            r="5.1"
          />
          <circle
            id="shadow-22"
            data-name="shadow"
            className="cls-8"
            cx="509.29"
            cy="869.79"
            r="5.1"
          />
          <circle
            id="shadow2-22"
            data-name="shadow2"
            className="cls-10"
            cx="509.29"
            cy="853.36"
            r="5.1"
          />
          <circle
            id="shadow-23"
            data-name="shadow"
            className="cls-8"
            cx="509.29"
            cy="836.93"
            r="5.1"
          />
          <circle
            id="shadow2-23"
            data-name="shadow2"
            className="cls-10"
            cx="509.29"
            cy="820.5"
            r="5.1"
          />
          <circle
            id="shadow-24"
            data-name="shadow"
            className="cls-8"
            cx="509.29"
            cy="935.5"
            r="5.1"
          />
          <circle
            id="shadow2-24"
            data-name="shadow2"
            className="cls-10"
            cx="525.79"
            cy="932"
            r="5.1"
          />
          <circle
            id="shadow-25"
            data-name="shadow"
            className="cls-8"
            cx="525.79"
            cy="915.57"
            r="5.1"
          />
          <circle
            id="shadow2-25"
            data-name="shadow2"
            className="cls-10"
            cx="525.79"
            cy="899.14"
            r="5.1"
          />
          <circle
            id="shadow-26"
            data-name="shadow"
            className="cls-8"
            cx="525.79"
            cy="882.71"
            r="5.1"
          />
          <circle
            id="shadow2-26"
            data-name="shadow2"
            className="cls-10"
            cx="525.79"
            cy="866.29"
            r="5.1"
          />
          <circle
            id="shadow-27"
            data-name="shadow"
            className="cls-8"
            cx="525.79"
            cy="849.86"
            r="5.1"
          />
          <circle
            id="shadow2-27"
            data-name="shadow2"
            className="cls-10"
            cx="525.79"
            cy="833.43"
            r="5.1"
          />
          <circle
            id="shadow-28"
            data-name="shadow"
            className="cls-8"
            cx="525.79"
            cy="817"
            r="5.1"
          />
          <circle
            id="shadow2-28"
            data-name="shadow2"
            className="cls-10"
            cx="542.28"
            cy="911.37"
            r="5.1"
          />
          <circle
            id="shadow-29"
            data-name="shadow"
            className="cls-8"
            cx="542.28"
            cy="894.94"
            r="5.1"
          />
          <circle
            id="shadow2-29"
            data-name="shadow2"
            className="cls-10"
            cx="542.28"
            cy="878.51"
            r="5.1"
          />
          <circle
            id="shadow-30"
            data-name="shadow"
            className="cls-8"
            cx="542.28"
            cy="862.09"
            r="5.1"
          />
          <circle
            id="shadow2-30"
            data-name="shadow2"
            className="cls-10"
            cx="542.28"
            cy="845.66"
            r="5.1"
          />
          <circle
            id="shadow-31"
            data-name="shadow"
            className="cls-8"
            cx="542.28"
            cy="829.23"
            r="5.1"
          />
        </g>
      </svg>
    ),
    GBA: (
      <svg
        id="GBA"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 564.5"
        onClick={handleSVGClick}
        ref={svgRef}
      >
        <defs>
          <style>
            {`.cls-1 {
                fill: ${getColor("lamp")};
              }

              .cls-2 {
                fill: ${getColor("screen")};
              }

              .cls-3 {
                fill: ${getColor("shadow")}
              }

              .cls-4 {
                fill: ${getColor("shadow")}
              }

              .cls-5 {
                fill: ${getColor("shell")};
              }

              .cls-6 {
                fill: ${getColor("glass")};
              }

              .cls-7 {
                fill: ${getColor("cross")};
              }

              .cls-8 {
                fill: ${getColor("LR")};
              }

              .cls-9 {
                fill: ${getColor("AB")};
              }

              .cls-10 {
                fill: ${getColor("rubber")};
              }`}
          </style>
        </defs>
        <path
          id="LR"
          className="cls-8"
          d="M31.9,111.92c-3.61.31-6.54,3.06-7.07,6.65-7.01,47.55-12.07,88.81-15.76,122.25C1.17,312.41-.29,347.01.04,380.03c.19,18.58.91,34.38,1.63,46.16.23,3.71,1.04,7.35,2.42,10.8h0c11.13,27.79,36.91,43.08,54.92,51,0,0,9.12,1.11,9.35-6.88,1.86-64.97,1.18-367.28,1.18-367.28l-37.65-1.91Z"
        />
        <path
          id="LR-2"
          data-name="LR"
          className="cls-8"
          d="M223.88,90.73H38.97l-8.68-6.63c-.95-.73-1.34-1.98-.95-3.11,2.65-7.69,9.12-22.53,24.06-34.93,13.5-11.2,27.41-15.02,34.49-16.46,45.33-5.36,90.66-10.72,135.99-16.07v77.21Z"
        />
        <path
          id="LR-3"
          data-name="LR"
          className="cls-8"
          d="M968.1,111.92c3.61.31,6.54,3.06,7.07,6.65,7.01,47.55,12.07,88.81,15.76,122.25,7.89,71.6,9.35,106.2,9.02,139.22-.19,18.58-.91,34.38-1.63,46.16-.23,3.71-1.04,7.35-2.42,10.8h0c-11.13,27.79-36.91,43.08-54.92,51,0,0-9.12,1.11-9.35-6.88-1.86-64.97-1.18-367.28-1.18-367.28l37.65-1.91Z"
        />
        <path
          id="LR-4"
          data-name="LR"
          className="cls-8"
          d="M776.12,90.73h184.91l8.68-6.63c.95-.73,1.34-1.98.95-3.11-2.65-7.69-9.12-22.53-24.06-34.93-13.5-11.2-27.41-15.02-34.49-16.46-45.33-5.36-90.66-10.72-135.99-16.07v77.21Z"
        />
        <path
          id="shell"
          className="cls-5"
          d="M989.28,373.74c-.18,18.58-.91,34.39-1.63,46.17-.22,3.7-1.04,7.35-2.42,10.8-11.13,27.79-36.91,43.08-54.92,50.99l-98.61,27.72c-8.19,1.89-17.32,4.48-27.08,8.05-9.17,3.37-17.35,7.03-24.49,10.64-5.71,2.76-12.39,5.57-19.98,8.06-7.24,2.37-13.97,4.01-19.98,5.15-51.8,10.46-92.65,15.29-120.85,17.73-18.64,1.61-37.83,2.69-42.84,2.98-30.88,1.73-57.01,2.3-76.48,2.46-19.47-.16-45.6-.73-76.48-2.46-5.01-.29-24.2-1.37-42.84-2.98-28.2-2.44-69.05-7.27-120.85-17.73-6.01-1.14-12.74-2.78-19.98-5.15-7.59-2.49-14.27-5.3-19.98-8.06-7.14-3.61-15.32-7.27-24.49-10.64-9.76-3.57-18.89-6.16-27.08-8.05l-98.61-27.72c-18.01-7.91-43.79-23.2-54.92-50.99-1.38-3.45-2.2-7.1-2.42-10.8-.72-11.78-1.45-27.59-1.63-46.17-.33-33.01,1.13-67.62,9.02-139.22,4.15-37.61,10.03-85.13,18.48-140.36.36-2.35,1.02-4.66,2.01-6.82,3.05-6.62,9.19-16.65,20.44-21.36.03-.02.07-.04.11-.05,2.73-1.14,5.67-1.68,8.63-1.79,5.24-.2,12.32-.65,20.58-1.71,49.39-6.33,92.72-28.26,127.94-46.08,7.86-3.98,16.15-7.02,24.17-10.64,3.22-1.45,7.68-3.48,13.95-4.72,1.96-.38,3.79-.64,5.44-.8h.01c19.09.01,37.74.02,55.9.03,1.46,0,2.92,0,4.37.01,41.55.06,106.32.08,189.5.06,71.89.01,128.46,0,166.18-.06,3.26-.01,6.37-.01,9.35-.01,16.84-.01,34.08-.02,51.71-.03.01,0,.02.01.03,0,1.64.17,3.46.42,5.41.8,6.27,1.24,10.73,3.27,13.95,4.72,8.02,3.62,16.31,6.66,24.17,10.64,35.22,17.82,78.55,39.75,127.94,46.08,8.26,1.06,15.34,1.51,20.58,1.71,2.96.11,5.9.65,8.63,1.79.04.01.08.03.11.05,11.25,4.71,17.39,14.74,20.44,21.36.99,2.16,1.65,4.47,2.01,6.82,8.45,55.23,14.33,102.75,18.48,140.36,7.89,71.6,9.35,106.21,9.02,139.22Z"
        />
        <path
          id="glass"
          className="cls-6"
          d="M765.68,378.28c0,16.2-.17,32.19-.48,47.95v2.81c-.08,10.85-3.92,20.94-10.39,28.89-6.47,7.95-15.57,13.76-26.18,16.03-26.42,7.83-55.91,15.08-88.22,20.75-51.22,9-97.74,11.97-137.59,11.97h-2.32c-39.85,0-86.37-2.97-137.59-11.97-32.31-5.67-61.8-12.92-88.21-20.75-10.61-2.27-19.72-8.08-26.19-16.03-6.47-7.95-10.31-18.04-10.38-28.89v-2.81c-.32-15.76-.49-31.75-.49-47.95s.16-31.84.48-48.06c1.6-80.91,7.16-157.19,15.3-228.32,0-8.31,3.37-15.83,8.81-21.28,5.45-5.45,12.97-8.82,21.29-8.82h.52c23.96-3.25,48.88-6.07,74.72-8.3,43.75-3.78,85.41-5.48,124.64-5.68h36.52c39.23.2,80.89,1.9,124.64,5.68,25.84,2.23,50.76,5.05,74.73,8.3h.51c8.32,0,15.84,3.37,21.29,8.82,5.44,5.45,8.81,12.97,8.81,21.28,8.14,71.13,13.7,147.41,15.3,228.32.32,16.22.48,32.24.48,48.06Z"
        />
        <rect
          id="screen"
          className="cls-2"
          x="285.17"
          y="107.09"
          width="429.65"
          height="287.47"
        />
        <path
          id="cross"
          className="cls-7"
          d="M197.15,220.23v25.11c0,4.38-3.56,7.93-7.94,7.93h-33.09v33.1c0,4.38-3.56,7.93-7.94,7.93h-25.1c-4.38,0-7.94-3.55-7.94-7.93v-33.1h-33.09c-4.38,0-7.94-3.55-7.94-7.93v-25.11c0-4.38,3.56-7.93,7.94-7.93h33.09v-33.1c0-4.38,3.56-7.93,7.94-7.93h25.1c4.38,0,7.94,3.55,7.94,7.93v33.1h33.09c4.38,0,7.94,3.55,7.94,7.93Z"
        />
        <rect
          id="shadow"
          className="cls-3"
          x="108.43"
          y="343.87"
          width="111.14"
          height="34.1"
          rx="17.05"
          ry="17.05"
          transform="translate(93.34 -29.16) rotate(14.17)"
        />
        <circle
          id="rubber"
          className="cls-10"
          cx="201.74"
          cy="370.15"
          r="14.31"
        />
        <rect
          id="shadow-2"
          data-name="shadow"
          className="cls-3"
          x="108.43"
          y="399.8"
          width="111.14"
          height="34.1"
          rx="17.05"
          ry="17.05"
          transform="translate(107.03 -27.46) rotate(14.17)"
        />
        <circle
          id="rubber-2"
          data-name="rubber"
          className="cls-10"
          cx="201.74"
          cy="426.07"
          r="14.31"
        />
        <g>
          <rect
            id="shadow-3"
            data-name="shadow"
            className="cls-4"
            x="787.47"
            y="429.01"
            width="114.33"
            height="8.57"
            rx="4.29"
            ry="4.29"
            transform="translate(-80.15 218.98) rotate(-14.11)"
          />
          <rect
            id="shadow-4"
            data-name="shadow"
            className="cls-4"
            x="787.47"
            y="407.97"
            width="114.33"
            height="8.57"
            rx="4.29"
            ry="4.29"
            transform="translate(-75.02 218.34) rotate(-14.11)"
          />
          <rect
            id="shadow-5"
            data-name="shadow"
            className="cls-4"
            x="787.47"
            y="386.93"
            width="114.33"
            height="8.57"
            rx="4.29"
            ry="4.29"
            transform="translate(-69.89 217.71) rotate(-14.11)"
          />
          <rect
            id="shadow-6"
            data-name="shadow"
            className="cls-4"
            x="787.47"
            y="365.9"
            width="114.33"
            height="8.57"
            rx="4.29"
            ry="4.29"
            transform="translate(-64.76 217.07) rotate(-14.11)"
          />
          <rect
            id="shadow-7"
            data-name="shadow"
            className="cls-4"
            x="787.47"
            y="344.86"
            width="114.33"
            height="8.57"
            rx="4.29"
            ry="4.29"
            transform="translate(-59.63 216.44) rotate(-14.11)"
          />
        </g>
        <circle id="AB" className="cls-9" cx="822.58" cy="249.77" r="31.49" />
        <circle
          id="AB-2"
          data-name="AB"
          className="cls-9"
          cx="912.68"
          cy="218.28"
          r="31.49"
        />
        <circle id="lamp" className="cls-1" cx="822.58" cy="97.98" r="8.58" />
        <polygon
          id="shadow-8"
          data-name="shadow"
          className="cls-3"
          points="285.17 394.56 714.83 107.09 714.83 394.56 285.17 394.56"
        />
      </svg>
    ),
    GC: (
      <svg
        id="GC"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 811.22 1000"
        onClick={handleSVGClick}
        ref={svgRef}
      >
        <defs>
          <style>
            {`.cls-1 {
              fill: none;
              stroke: ${getColor("shadow")};
              stroke-miterlimit: 10;
              stroke-width: 5px;
            }

            .cls-2 {
              fill: ${getColor("shell")};
            }

            .cls-3 {
              fill: ${getColor("shell2")};
            }

            .cls-4 {
              fill: ${getColor("button")};
            }`}
          </style>
        </defs>
        <path
          id="shell2"
          className="cls-3"
          d="M401.99,0C222.65,0,77.28,145.38,77.28,324.71s145.38,324.71,324.71,324.71,324.71-145.38,324.71-324.71S581.32,0,401.99,0ZM405.61,542.03c-127.2,0-230.31-103.11-230.31-230.31s103.11-230.31,230.31-230.31,230.31,103.11,230.31,230.31-103.11,230.31-230.31,230.31Z"
        />
        <rect
          id="shell"
          className="cls-2"
          y="163.74"
          width="811.22"
          height="836.26"
          rx="17.82"
          ry="17.82"
        />
        <circle
          id="shell2-2"
          data-name="shell2"
          className="cls-3"
          cx="405.61"
          cy="575.65"
          r="216.64"
        />
        <circle id="button" className="cls-4" cx="91.5" cy="359.01" r="47.3" />
        <circle id="shadow" className="cls-1" cx="91.5" cy="870.71" r="43.55" />
        <path
          id="shadow-2"
          data-name="shadow"
          className="cls-1"
          d="M92,163.74l.73,129.2c.03,5.19,3.85,9.56,8.99,10.33,27.45,4.13,48.36,27.05,48.36,55.73s-21.97,52.6-49.64,56.91c-5.14.8-8.94,5.2-8.93,10.4l.49,376.57c0,5.61,4.09,10.31,9.62,11.29,26.9,4.78,47.32,28.27,47.32,56.54v.07c0,4.03,2.91,7.47,6.91,7.97,31.05,7.46,64.88,14.22,101.26,19.54,15.31,2.24,30.29,4.12,44.9,5.67,36.98,3.92,71.66,5.77,103.6,6.24,31.94-.47,66.62-2.32,103.6-6.24,14.61-1.55,29.59-3.43,44.9-5.67,36.38-5.32,70.21-12.08,101.26-19.54,4-.5,6.91-3.94,6.91-7.97v-.07c0-28.27,20.42-51.76,47.32-56.54,5.53-.98,9.62-5.68,9.62-11.29V163.74"
        />
        <circle
          id="shadow-3"
          data-name="shadow"
          className="cls-1"
          cx="719.22"
          cy="870.71"
          r="43.55"
        />
        <path
          id="shell2-3"
          data-name="shell2"
          className="cls-3"
          d="M405.61,913.03c-28.56-.42-59.31-1.95-91.93-5.07,27.55,14.48,58.7,22.64,91.69,22.64s64.05-8.14,91.57-22.59c-32.4,3.08-62.95,4.59-91.33,5.01Z"
        />
      </svg>
    ),
    SFC: (
      <svg
        id="SFC"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 823.58 1000"
        onClick={handleSVGClick}
        ref={svgRef}
      >
        <defs>
          <style>
            {`.cls-1 {
              fill: none;
              stroke: ${getColor("shadow")};
              stroke-miterlimit: 10;
              stroke-width: 5px;
            }

            .cls-2 {
              fill: ${getColor("button")};
            }

            .cls-3 {
              fill: ${getColor("lamp")};
            }

            .cls-4 {
              fill: ${getColor("shell2")};
            }

            .cls-5 {
              fill: ${getColor("shell")};
            }`}
          </style>
        </defs>
        <rect
          id="shell"
          className="cls-5"
          width="823.58"
          height="1000"
          rx="61.53"
          ry="61.53"
        />
        <path
          id="shadow"
          className="cls-1"
          d="M755.39,975H68.19c-26.29,0-47.6-21.31-47.6-47.6V72.6c0-26.29,21.31-47.6,47.6-47.6h687.2c26.29,0,47.6,21.31,47.6,47.6v854.8c0,26.29-21.31,47.6-47.6,47.6ZM112.44,975l.82-950M68.19,975h687.2c26.29,0,47.6-21.31,47.6-47.6V72.6c0-26.29-21.31-47.6-47.6-47.6H68.19c-26.29,0-47.6,21.31-47.6,47.6v854.8c0,26.29,21.31,47.6,47.6,47.6ZM711.14,975l-.82-950M133.76,0v25M159.04,0v25M184.31,0v25M209.59,0v25M234.86,0v25M260.14,0v25M285.41,0v25M310.69,0v25M335.96,0v25M361.24,0v25M386.51,0v25M411.79,0v25M437.06,0v25M462.34,0v25M487.61,0v25M512.89,0v25M538.16,0v25M563.44,0v25M588.71,0v25M613.99,0v25M639.26,0v25M664.54,0v25M689.81,0v25"
        />
        <path
          id="shell2"
          className="cls-4"
          d="M730.77,118.63H92.81c-15.81,0-28.63,12.82-28.63,28.63v637.97c0,15.81,12.82,28.63,28.63,28.63h637.97c15.81,0,28.63-12.82,28.63-28.63V147.26c0-15.81-12.82-28.63-28.63-28.63ZM256.91,753.73c0,13.1-10.62,23.72-23.72,23.72h-82.73c-13.1,0-23.72-10.62-23.72-23.72v-99c0-13.1,10.62-23.72,23.72-23.72h82.73c13.1,0,23.72,10.62,23.72,23.72v99ZM693.88,753.73c0,13.1-10.62,23.72-23.72,23.72h-82.73c-13.1,0-23.72-10.62-23.72-23.72v-99c0-13.1,10.62-23.72,23.72-23.72h82.73c13.1,0,23.72,10.62,23.72,23.72v99Z"
        />
        <path
          id="button"
          className="cls-2"
          d="M692.75,387.5c-.36-.86-.81-1.67-1.32-2.43-.77-1.14-1.7-2.17-2.77-3.04-2.47-2.04-5.65-3.27-9.11-3.27H144.02c-2.47,0-4.8.63-6.82,1.73s-3.76,2.68-5.05,4.58c-.51.76-.96,1.58-1.32,2.43-.18.43-.34.87-.48,1.32-.42,1.34-.64,2.77-.64,4.26v29.66c0,9.69,3.99,19.05,11.28,25.43.33.28.66.57,1,.85,2.98,2.43,6.01,4.14,8.78,5.35,3.86,1.68,7.99,2.64,12.18,3.01,35.05,3.09,71.26,5.64,108.57,7.55,48.5,2.48,95.3,3.66,140.26,3.82,44.96-.16,91.76-1.35,140.26-3.82,37.31-1.9,73.52-4.46,108.57-7.55,4.19-.37,8.32-1.33,12.18-3.01,2.78-1.21,5.81-2.92,8.78-5.35.34-.28.68-.56,1-.85,7.29-6.38,11.28-15.74,11.28-25.43v-29.66c0-1.48-.23-2.91-.64-4.26-.14-.45-.3-.89-.48-1.32Z"
        />
        <rect
          id="button-2"
          data-name="button"
          className="cls-2"
          x="136.31"
          y="642.98"
          width="109.21"
          height="122.86"
          rx="13.32"
          ry="13.32"
        />
        <rect
          id="button-3"
          data-name="button"
          className="cls-2"
          x="573.27"
          y="642.98"
          width="109.21"
          height="122.86"
          rx="13.32"
          ry="13.32"
        />
        <rect
          id="shadow-2"
          data-name="shadow"
          className="cls-1"
          x="294.78"
          y="641.84"
          width="234.01"
          height="120.91"
          rx="11.31"
          ry="11.31"
        />
        <rect
          id="lamp"
          className="cls-3"
          x="603.79"
          y="925.03"
          width="43.6"
          height="14.42"
          rx="7.21"
          ry="7.21"
        />
      </svg>
    ),
  };

  const currentSVGView = (
    <div key={gameType} className={styles.svgWrapper}>
      <div className={styles.svgWrapper2}>
        <div
          className={styles.svgBack}
          style={
            backgroundEnabled
              ? {
                  padding: `${backgroundSize}%`,
                  borderRadius: backgroundShape === "circle" ? "100%" : "0",
                  backgroundColor,
                }
              : {}
          }
        >
          {svgs[gameType]}
        </div>
      </div>
    </div>
  );

  // パレットの色を変更する関数 再生成を防ぐためにCallBackでラップする
  const handlePalletColorChange = useCallback(
    (style: string, color: string) => {
      // バックグラウンドは別処理
      if (style === "background") {
        setBackgroundColor(color);
        return;
      }

      // スタイルのカラーを書き換える
      setStyleColors((prev) => {
        const newStyleColors = styleColors[gameType].map((s) =>
          s.style === style ? { ...s, color } : s
        );
        return {
          ...prev,
          [gameType]: newStyleColors,
        };
      });
      // setStyleColors3(newStyleColors);
      // 個別で変更した部品をリセットする
      // setChangePartsList((prev) => {
      //   const resetParts = prev.filter((part) => part.name === style);
      //   resetParts.forEach((part) => {
      //     const element = part.element;
      //     element.removeAttribute("style");
      //   });
      //   return prev.filter((part) => part.name !== style);
      // });
      setDiscreateColors((prev) => {
        if (!prev[gameType]) return prev;
        const ids = Object.keys(prev[gameType] || {}).filter(
          (id) => prev[gameType]?.[id].style === style
        );
        let newMap = prev[gameType];
        ids.forEach((id) => {
          delete newMap[id];
        });
        return {
          ...prev,
          [gameType]: {
            ...prev[gameType],
            ...newMap,
          },
        };
      });
    },
    [gameType, styleColors, setBackgroundColor]
  );

  const palletHandlers = useMemo(() => {
    const map: Record<string, (color: string) => void> = {};
    Object.keys(partsPalletes).forEach((style) => {
      map[style] = (color: string) => handlePalletColorChange(style, color);
    });
    return map;
  }, [handlePalletColorChange]);

  // 個別色のスタイル
  const discreteColorsStyles = useMemo(() => {
    if (!discreteColors[gameType]) return "";
    return Object.keys(discreteColors[gameType])
      .map((id) => {
        return `#${id} { fill: ${
          discreteColors[gameType] && discreteColors[gameType][id].color
        } !important; }`;
      })
      .join(" ");
  }, [discreteColors, gameType]);

  return (
    <>
      <style>{discreteColors[gameType] && `${discreteColorsStyles}`}</style>
      <div className={styles.containerWrapper}>
        <div className={styles.container}>
          {/* <defs>
        <style>
          {`path:hover, rect:hover, circle:hover, polygon:hover, ellipse:hover, line:hover, polyline:hover {
          // animation-name: hover;
          // animation-duration: .5s;
          // animation-fill-mode: forwards;
          // animation-direction: alternate;
          // animation-iteration-count: infinite;
          // filter: ;
          // transition: 0.3s
        }
        
          @keyframes hover {
            0% {
              filter: drop-shadow(0px 0px 0 rgb(0, 0, 0)) hue-rotate(0deg);
            }
            100% {
              filter: drop-shadow(10px 10px 0 rgb(0, 0, 0)) hue-rotate(90deg);
            }
          }
        `}
        </style>
      </defs> */}

          {/* 左のコンテナ */}
          <div className={styles.leftContainer}>
            <ToggleButtonGroup
              value={gameType}
              color="primary"
              exclusive
              onChange={(_, value) => {
                if (!value) return;
                setGameType(value as GameType);
                // setStyleColors3(initialStyleColors[value as GameType]);
              }}
            >
              {Object.values(GameNames).map((game) => (
                <ToggleButton key={game.EN} value={game.EN}>
                  <img
                    src={`/gameSVG/${game.EN}.svg`}
                    style={{ width: "30px", aspectRatio: 1 }}
                  />
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            <div className={styles.svgContainer}>
              <div className={styles.svgTitleContainer}>
                <Tooltip title="色をリセットする" arrow>
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setStyleColors((prev) => {
                        return {
                          ...prev,
                          [gameType]: initialStyleColors[gameType],
                        };
                      });
                      // setChangePartsList([]);
                      setDiscreateColors((prev) => {
                        return { ...prev, [gameType]: {} };
                      });
                    }}
                  >
                    <Replay />
                  </IconButton>
                </Tooltip>
                <h2 className={styles.svgTitle}>{gameType}</h2>
              </div>
              {currentSVGView}
            </div>
          </div>

          {/* カラーピッカー */}
          <PopoverWrapper
            open={openColorPicker}
            onClose={() => setOpenColorPicker(false)}
          >
            <ChromePicker
              color={createColor || "#ffffff"}
              onChange={(color) => {
                // if (!targetElement.current) return;
                // const target = targetElement.current.target;
                // const targetStyle = targetElement.current.style;
                // if (!target || !targetStyle) return;
                // const rgba = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;
                // setCreateColor(rgba);
                // target.setAttribute("style", `fill: ${rgba} !important;`);

                if (!targetElement.current) return;
                const target = targetElement.current.target;
                const targetId = target?.getAttribute("id");
                if (!targetId) return;
                const rgba = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;
                setCreateColor(rgba);
                setDiscreateColors((prev) => {
                  return {
                    ...prev,
                    [gameType]: {
                      ...prev[gameType],
                      [targetId]: {
                        ...prev[gameType]?.[targetId],
                        color: rgba,
                      },
                    },
                  };
                });
              }}
            />
          </PopoverWrapper>

          {/* 右のコンテナ */}
          <div className={styles.palletContainer}>
            {/* 背景ツール */}
            <div className={styles.bgToolsContainer}>
              <div className={styles.bgToolsTitleContainer}>
                <p className={styles.bgToolsTitle}>背景設定</p>
                <Tooltip
                  title={`背景を${backgroundEnabled ? "無" : "有"}効にする`}
                  arrow
                >
                  <Checkbox
                    icon={<LandscapeOutlined />}
                    checkedIcon={<Landscape />}
                    size="large"
                    checked={backgroundEnabled}
                    onChange={(e) => setBackgroundEnabled(e.target.checked)}
                  />
                </Tooltip>
              </div>
              <div className={styles.bgTools}>
                <Tooltip title="背景の形を変更" arrow>
                  <ToggleButtonGroup
                    fullWidth
                    exclusive
                    value={backgroundEnabled ? backgroundShape : null}
                    disabled={!backgroundEnabled}
                    color="primary"
                    onChange={(_, value) => {
                      if (value) setBackgroundShape(value);
                    }}
                  >
                    <ToggleButton value={"circle"}>
                      <Circle />
                    </ToggleButton>
                    <ToggleButton value={"square"}>
                      <Square />
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Tooltip>
                <Tooltip
                  title={`背景の余白を変更(${backgroundSize * 2}%)`}
                  arrow
                >
                  <Slider
                    disabled={!backgroundEnabled}
                    max={50}
                    value={backgroundSize}
                    onChange={(_, value) => {
                      setBackgroundSize(value as number);
                    }}
                  />
                </Tooltip>
              </div>
            </div>
            {/* パレット */}
            {/* {[
            ...styleColors[gameType],
            { style: "background", color: backgroundColor } as StyleColor,
          ].map(
            (styleObject) =>
              (styleObject.style === "background" && !backgroundEnabled) || (
                <PartsPallet
                  key={`${gameType} ${styleObject.style}`}
                  title={partsNames[styleObject.style]}
                  colors={partsPalletes[styleObject.style]}
                  color={styleObject.color}
                  onChange={(color) => {
                    // バックグラウンドは別処理
                    if (styleObject.style === "background") {
                      setBackgroundColor(color);
                      return;
                    }

                    // スタイルのカラーを書き換える
                    setStyleColors((prev) => {
                      const newStyleColors = styleColors[gameType].map((s) =>
                        s.style === styleObject.style ? { ...s, color } : s
                      );
                      return {
                        ...prev,
                        [gameType]: newStyleColors,
                      };
                    });
                    // setStyleColors3(newStyleColors);
                    // 個別で変更した部品をリセットする
                    setChangePartsList((prev) => {
                      const resetParts = prev.filter(
                        (part) => part.name === styleObject.style
                      );
                      resetParts.forEach((part) => {
                        const element = part.element;
                        element.removeAttribute("style");
                      });
                      return prev.filter(
                        (part) => part.name !== styleObject.style
                      );
                    });
                  }}
                />
              )
          )} */}
            {[
              ...styleColors[gameType],
              { style: "background", color: backgroundColor } as StyleColor,
            ].map(
              (styleObject) =>
                (styleObject.style === "background" && !backgroundEnabled) || (
                  <PartsPallet
                    key={`${gameType} ${styleObject.style}`}
                    title={partsNames[styleObject.style]}
                    colors={partsPalletes[styleObject.style]}
                    color={styleObject.color}
                    onChange={palletHandlers[styleObject.style]}
                  />
                )
            )}
          </div>
        </div>
        <Button
          variant="contained"
          onClick={() => {
            handleSVGDownload();
          }}
          size="large"
          endIcon={<Download />}
        >
          ダウンロード
        </Button>
      </div>
    </>
  );
}
