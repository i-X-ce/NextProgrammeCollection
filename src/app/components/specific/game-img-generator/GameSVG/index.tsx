"use client";
import PartsPallet from "../PartsPallet";
import styles from "./style.module.css";
import { ReactNode, useRef, useState } from "react";
import PopoverWrapper from "@/app/components/common/PopoverWrapper";
import { ChromePicker } from "react-color";

// 表示できるゲーム機の種類
type GameType = "GB" | "GBP" | "GBC" | "GBA" | "GC" | "SFC";

// 部品のスタイルの種類
type PartsStyles =
  | "shell"
  | "cross"
  | "screen"
  | "glass"
  | "lamp"
  | "shadow"
  | "button"
  | "AB"
  | "rubber";

// スタイルとその色
type StyleColor = {
  style: PartsStyles;
  color: string;
};

// 部品ごとのパレット(表示する必要のあるパレットのみ)
const partsPalletes: Record<PartsStyles, string[]> = {
  shell: ["#f2f2f2", "#FF7F7F", "#FF4C4C", "#FF0000"],
  button: ["#4d4d4d", "#b3b3b3", "#c12750"],
  cross: ["#4d4d4d", "#ed1c24", "#f2f2f2"],
  screen: ["#d9e021", "#ed1c24", "#f2f2f2"],
  glass: ["#b3b3b3", "#ed1c24", "#f2f2f2"],
  lamp: ["#ed1c24", "#f2f2f2"],
  shadow: ["#0000004c", "#f2f2f2"],
  AB: ["#c12750", "#f2f2f2"],
  rubber: ["#b3b3b3", "#f2f2f2"],
};

// ゲーム機の色の初期値
const initialStyleColors: Record<GameType, StyleColor[]> = {
  GB: [
    { style: "shell", color: partsPalletes.shell[0] },
    { style: "AB", color: partsPalletes.AB[0] },
    { style: "cross", color: partsPalletes.cross[0] },
    { style: "rubber", color: partsPalletes.rubber[0] },
    { style: "screen", color: partsPalletes.screen[0] },
    { style: "glass", color: partsPalletes.glass[0] },
    { style: "lamp", color: partsPalletes.lamp[0] },
    { style: "shadow", color: partsPalletes.shadow[0] },
  ],
  GBP: [],
  GBC: [],
  GBA: [],
  GC: [],
  SFC: [],
};

// パーツの名前
const partsNames: Record<PartsStyles, string> = {
  shell: "外装",
  cross: "十字キー",
  screen: "画面",
  glass: "画面ガラス",
  lamp: "ランプ",
  shadow: "影・溝",
  button: "ボタン",
  AB: "ABボタン",
  rubber: "ラバーボタン",
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

export default function GameSVG({ gameType }: { gameType: GameType }) {
  const [styleColors, setStyleColors] = useState<StyleColor[]>(
    initialStyleColors[gameType]
  );
  const [_changePartsList, setChangePartsList] = useState<
    { name: PartsStyles; element: SVGElement }[]
  >([]); // 個別に変更した部品のリスト

  const getColor = (style: PartsStyles) => {
    return styleColors.find((s) => s.style === style)?.color;
  };

  const [openColorPicker, setOpenColorPicker] = useState(false);
  const [createColor, setCreateColor] = useState<string | null>(null);
  const targetElement = useRef<{ target: SVGElement | null; style: string }>(
    null
  ); // クリックした要素を保存するためのref

  const handleSVGClick = (e: React.MouseEvent<SVGElement>) => {
    const target = e.target as SVGElement;
    const targetId = target.getAttribute("id");
    const targetName = target.getAttribute("data-name");
    const targetStyle = !targetName ? targetId : targetName;
    if (!targetId && !targetName) return;
    if (!targetStyle) return;
    console.log({ target, style: targetStyle });
    setOpenColorPicker(true);
    targetElement.current = { target, style: targetStyle }; // クリックした要素を保存
    // targetの色を取得する
    const computedStyle = window.getComputedStyle(target);
    const fill = computedStyle.fill;
    setCreateColor(fill);
    setChangePartsList((prev) => {
      return [
        ...prev,
        {
          name: targetStyle as PartsStyles,
          element: target,
        },
      ];
    });
    // const newColor = prompt(`色を入力してください:`);
    // if (newColor) {
    //   target.setAttribute("style", `fill: #${newColor} !important;`);
    //   setChangePartsList((prev) => {
    //     return [
    //       ...prev,
    //       {
    //         name: targetStyle as PartsStyles,
    //         element: target,
    //       },
    //     ];
    //   });
    // }
  };

  const svgs: Record<GameType, ReactNode> = {
    GB: (
      <svg
        id="_レイヤー_1"
        data-name="レイヤー 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 604.34 1000"
        onClick={handleSVGClick}
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
                fill: ${getColor("shell")};
              }

              .cls-6 {
                fill: ${getColor("rubber")};
              }

              .cls-7 {
                fill: ${getColor("glass")};
              }

              .cls-8 {
                fill: ${getColor("lamp")};
              }`}
          </style>
        </defs>
        <path
          id="shell"
          className="cls-5"
          d="M588.48,0H15.86C7.18,0,.15,7.03.15,15.71v968.59c0,8.67,7.03,15.71,15.71,15.71h453.59c74.42,0,134.75-60.33,134.75-134.75V15.71c0-8.67-7.03-15.71-15.71-15.71ZM555.62,396.31c0,43.38-35.16,78.54-78.54,78.54H72.38c-13.07,0-23.66-10.59-23.66-23.66V111.73c0-13.07,10.59-23.66,23.66-23.66h459.59c13.07,0,23.66,10.59,23.66,23.66v284.58Z"
        />
        <path
          id="glass"
          className="cls-7"
          d="M531.96,88.07H72.38c-13.07,0-23.66,10.59-23.66,23.66v339.46c0,13.07,10.59,23.66,23.66,23.66h404.71c43.38,0,78.54-35.16,78.54-78.54V111.73c0-13.07-10.59-23.66-23.66-23.66ZM464.87,427.33H139.47V134.27h325.4v293.06Z"
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
          className="cls-6"
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
          className="cls-6"
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
        <g id="shadow-3" data-name="shadow">
          <rect
            id="shadow-4"
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
            id="shadow-5"
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
            id="shadow-6"
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
            id="shadow-7"
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
            id="shadow-8"
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
            id="shadow-9"
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
    GBP: undefined,
    GBC: undefined,
    GBA: undefined,
    GC: undefined,
    SFC: undefined,
  };

  return (
    <div className={styles.container}>
      <div className={styles.svgContainer}>
        <h2 className={styles.svgTitle}>{gameType}</h2>
        <div className={styles.svgWrapper}>{svgs[gameType]}</div>
      </div>

      <PopoverWrapper
        open={openColorPicker}
        onClose={() => setOpenColorPicker(false)}
      >
        <ChromePicker
          color={createColor || "#ffffff"}
          onChange={(color) => {
            if (!targetElement.current) return;
            const target = targetElement.current.target;
            const targetStyle = targetElement.current.style;
            if (!target || !targetStyle) return;
            const rgba = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;
            setCreateColor(rgba);
            target.setAttribute("style", `fill: ${rgba} !important;`);
          }}
        />
      </PopoverWrapper>

      <div className={styles.palletContainer}>
        {initialStyleColors[gameType].map((styleObject) => (
          <PartsPallet
            key={`${gameType} ${styleObject.style}`}
            title={partsNames[styleObject.style]}
            colors={partsPalletes[styleObject.style]}
            color={styleObject.color}
            onChange={(color) => {
              const newStyleColors = styleColors.map((s) =>
                s.style === styleObject.style ? { ...s, color } : s
              );
              setStyleColors(newStyleColors);
              // 個別で変更した部品をリセットする
              setChangePartsList((prev) => {
                const resetParts = prev.filter(
                  (part) => part.name === styleObject.style
                );
                resetParts.forEach((part) => {
                  const element = part.element;
                  element.removeAttribute("style");
                });
                return prev.filter((part) => part.name !== styleObject.style);
              });
            }}
          />
        ))}
      </div>
    </div>
  );
}
