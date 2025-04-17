import { memo, useState } from "react";
import styles from "./style.module.css";
import { Palette } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
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
  colors.sort().reverse();
  const [selectedColorIndex, setSelectedColorIndex] = useState(
    colors.indexOf(color)
  );
  const [createColor, setCreateColor] = useState("#ffffff");
  const [pickerVisible, setPickerVisible] = useState(false);
  // const colorInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <PopoverWrapper
        open={pickerVisible}
        onClose={() => setPickerVisible(false)}
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
      <div className={styles.colorBoxContainer}>
        <ColorBox
          add
          color={createColor}
          onClick={() => {
            setSelectedColorIndex(-1);
            setPickerVisible(!pickerVisible);
            onChange?.(createColor);
          }}
          selected={selectedColorIndex === -1}
        />
        {colors.map((color, i) => {
          return (
            <ColorBox
              key={i}
              color={color}
              selected={selectedColorIndex === i}
              onClick={() => {
                setSelectedColorIndex(i);
                onChange?.(color);
              }}
            />
          );
        })}
      </div>
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
    <Tooltip title={add ? "自由に指定" : color} arrow>
      <div
        className={`${styles.colorBox}`}
        // className={`${styles.colorBox} ${selected ? styles.selected : ""}`}
        style={{ backgroundColor: color }}
        onClick={onClick}
      >
        <div
          className={`${styles.hoverCircle} ${selected ? styles.selected : ""}`}
        />
        {/* <div
          className={`${styles.hoverCircleInner} ${
            selected ? styles.selected : ""
          }`}
        /> */}
        {add && <Palette color="action" sx={{ zIndex: 2 }} />}
      </div>
    </Tooltip>
  );
});
