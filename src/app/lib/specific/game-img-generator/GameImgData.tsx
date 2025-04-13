import { ReactNode } from "react";

type ColorPalettes = {
  [name: string]: string[];
};

type PartsStyles =
  | "shell"
  | "A"
  | "B"
  | "select"
  | "start"
  | "cross"
  | "screen"
  | "glass"
  | "shadow";

type StyleColor = {
  style: string;
  color: string;
};

const colorPalettes: ColorPalettes = {
  shell: ["#f2f2f2", "#FF7F7F", "#FF4C4C", "#FF0000"],
  button: ["4d4d4d", "#b3b3b3", "c12750"],
};

export function GameSVG({
  svg,
  classColors,
}: {
  svg: ReactNode;
  classColors: StyleColor[];
}) {
  const styles = classColors
    .map((s) => `.${s.style} {fill: ${s.color}};`)
    .join("\n");

  return (
    <>
      <defs>
        <style>{styles}</style>
      </defs>
      {svg}
    </>
  );
}

class GameImgData {
  private _name: string;
  private _svg: ReactNode;
  private _initStyleColors: StyleColor[];
  private _styleColors: StyleColor[];

  constructor(name: string, svg: ReactNode, initStyleColors: StyleColor[]) {
    this._name = name;
    this._svg = svg;
    this._initStyleColors = initStyleColors;
    this._styleColors = initStyleColors;
  }

  get svg() {
    return (
      <GameSVG
        key={this._name}
        svg={this._svg}
        classColors={this._styleColors}
      />
    );
  }

  get initStyleColors() {
    return this._initStyleColors;
  }

  set styleColors(styleColors: StyleColor[]) {
    this._styleColors = styleColors;
  }
}

export const gameImges: GameImgData[] = [
  new GameImgData(
    "GB",
    (
      <svg
        id="_レイヤー_1"
        data-name="レイヤー 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 604.34 1000"
      >
        <defs>
          <style>
            {`.cls-1 {
              fill: #d9e021;
            }

            .cls-2 {
              opacity: .3;
            }

            .cls-3 {
              fill: #4d4d4d;
            }

            .cls-4 {
              opacity: .3;
            }

            .cls-5 {
              fill: #c12750;
            }

            .shell {
              fill: #f2f2f2;
            }

            .cls-7 {
              fill: #b3b3b3;
            }

            .cls-8 {
              fill: #ed1c24;
            }`}
          </style>
        </defs>
        <path
          className="cls-6"
          d="M16,0h572.63c8.67,0,15.71,7.04,15.71,15.71v849.55c0,74.37-60.38,134.75-134.75,134.75H16c-8.67,0-15.71-7.04-15.71-15.71V15.71C.3,7.04,7.33,0,16,0Z"
        />
        <path
          className="cls-7"
          d="M69.06,88.07h459.59c13.06,0,23.66,10.6,23.66,23.66v284.58c0,43.35-35.19,78.54-78.54,78.54H69.06c-13.06,0-23.66-10.6-23.66-23.66V111.73c0-13.06,10.6-23.66,23.66-23.66Z"
        />
        <rect
          className="cls-1"
          x="145.17"
          y="134.27"
          width="325.4"
          height="293.06"
        />
        <rect
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
          className="cls-4"
          d="M600.46,53.83h-43.02V3.88c0-2.14-1.74-3.88-3.88-3.88s-3.88,1.74-3.88,3.88v49.96H53.15V3.88c0-2.14-1.74-3.88-3.88-3.88s-3.88,1.74-3.88,3.88v49.96H3.88c-2.14,0-3.88,1.74-3.88,3.88s1.74,3.88,3.88,3.88h596.59c2.14,0,3.88-1.74,3.88-3.88s-1.74-3.88-3.88-3.88Z"
        />
        <path
          className="cls-3"
          d="M201.15,660.46v44.38c0,3.06-2.48,5.54-5.54,5.54h-42.4v42.4c0,3.06-2.48,5.54-5.54,5.54h-44.38c-3.06,0-5.54-2.48-5.54-5.54v-42.4h-42.4c-3.06,0-5.54-2.48-5.54-5.54v-44.38c0-3.06,2.48-5.54,5.54-5.54h42.4v-42.4c0-3.06,2.48-5.54,5.54-5.54h44.38c3.06,0,5.54,2.48,5.54,5.54v42.4h42.4c3.06,0,5.54,2.48,5.54,5.54Z"
        />
        <g>
          <rect
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
        <circle className="cls-5" cx="424.04" cy="696.88" r="37.33" />
        <circle className="cls-5" cx="523.21" cy="648.92" r="37.33" />
        <circle className="cls-8" cx="84.11" cy="237.26" r="7.7" />
      </svg>
    ),
    [
      { style: "shell", color: colorPalettes["shell"][0] },
      { style: "button", color: colorPalettes["button"][0] },
    ]
  ),
];
