import { memo, useState } from "react";
import styles from "./style.module.css";
import { ExpandMore, Palette } from "@mui/icons-material";
import { Collapse, Tooltip } from "@mui/material";
import PopoverWrapper from "@/app/components/common/PopoverWrapper";
import { ChromePicker } from "react-color";

type PartsPalletProps = {
  title: string;
  colors: string[];
  color: string;
  onChange?: (color: string) => void;
};

const PartsPallet = memo(function PartsPallet({
  title,
  colors,
  color,
  onChange,
}: PartsPalletProps) {
  // colors.sort().reverse();
  const colorIndex = colors.indexOf(color);
  // const selectedColorIndex = useRef(colorIndex);
  // const [selectedColorIndex, setSelectedColorIndex] = useState(colorIndex);
  const [createColor, setCreateColor] = useState(
    colorIndex === -1 ? color : "#ffffff"
  );
  const [pickerVisible, setPickerVisible] = useState(false);
  // const colorInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);

  return (
    <div
      className={styles.container}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div className={styles.titleContainer}>
        <span className={styles.titleWrapper}>
          <div
            className={styles.sampleColor}
            style={{ backgroundColor: color }}
          />
          <h2 className={styles.title}>{title}</h2>
        </span>
        <ExpandMore
          color="action"
          sx={{ transform: `rotate(${open ? 180 : 0}deg)`, transition: "0.2s" }}
        />
      </div>
      <PopoverWrapper
        open={pickerVisible}
        onClose={() => {
          setPickerVisible(false);
          setOpen(false);
        }}
      >
        <ChromePicker
          onChange={(color) => {
            const rgba = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;
            setCreateColor(rgba);
            onChange?.(rgba);
          }}
          color={createColor}
        />
      </PopoverWrapper>
      <Collapse in={open}>
        <div className={styles.colorBoxContainer}>
          <ColorBox
            add
            color={createColor}
            onClick={() => {
              // setSelectedColorIndex(-1);
              // selectedColorIndex.current = -1;
              setPickerVisible(!pickerVisible);
              onChange?.(createColor);
            }}
            selected={colorIndex === -1}
          />
          {colors.map((color, i) => {
            return (
              <ColorBox
                key={i}
                color={color}
                selected={colorIndex === i}
                onClick={() => {
                  // setSelectedColorIndex(i);
                  // colorIndex = i;
                  onChange?.(color);
                }}
              />
            );
          })}
        </div>
      </Collapse>
    </div>
  );
});

export default PartsPallet;

const ColorBox = memo(function ColorBox({
  color,
  selected,
  onClick,
  add,
}: {
  color?: string;
  selected?: boolean;
  onClick?: () => void;
  add?: boolean;
}) {
  return (
    <Tooltip title={add ? "カラーピッカーで指定" : color?.toUpperCase()} arrow>
      <div
        className={`${styles.colorBox}`}
        // className={`${styles.colorBox} ${selected ? styles.selected : ""}`}
        style={{ backgroundColor: color }}
        onClick={onClick}
        tabIndex={0}
      >
        <div
          className={`${styles.hoverCircle} ${selected ? styles.selected : ""}`}
        />
        {/* <div
          className={`${styles.hoverCircleInner} ${
            selected ? styles.selected : ""
          }`}
        /> */}
        {add && <Palette color="info" sx={{ zIndex: 2 }} />}
      </div>
    </Tooltip>
  );
});
